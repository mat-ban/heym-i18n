"""Plugin management API (install/uninstall/list/toggle)."""

from __future__ import annotations

import json
import re
from pathlib import Path

from fastapi import APIRouter, Depends, File, Header, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.config import settings
from app.db.models import Plugin, User
from app.db.session import get_db
from app.models.plugin_schemas import (
    PluginDoc,
    PluginField,
    PluginManifest,
    PluginNodeSummary,
    PluginSummary,
)
from app.services import plugin_loader, plugin_store
from app.services.plugin_store import PluginInstallError

router = APIRouter()

_LANG_RE = re.compile(r"^[a-zA-Z0-9_-]{2,10}$")


def require_plugins_enabled() -> None:
    if not settings.plugins_enabled:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plugins are disabled. Set HEYM_PLUGINS_ENABLED=true to enable them.",
        )


def _admin_emails() -> set[str]:
    return {e.strip().lower() for e in settings.plugin_admin_emails.split(",") if e.strip()}


def require_plugin_admin(current_user: User) -> None:
    require_plugins_enabled()
    allowed = _admin_emails()
    if not allowed or current_user.email.strip().lower() not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to manage plugins.",
        )


def _resolve_lang(lang: str | None, accept_language: str | None = None) -> str | None:
    """Resolve and sanitize a language tag from ?lang= or Accept-Language."""
    raw = (lang or "").strip()
    if not raw and accept_language:
        first = accept_language.split(",")[0].split(";")[0].strip()
        raw = first
    if not raw or not _LANG_RE.match(raw):
        return None
    return raw


def _lang_candidates(lang: str | None) -> list[str]:
    """Return candidate language codes in priority order (e.g. ['de-DE', 'de'])."""
    if not lang or not _LANG_RE.match(lang):
        return []
    candidates = [lang]
    sep = "-" if "-" in lang else ("_" if "_" in lang else None)
    if sep:
        base = lang.split(sep, 1)[0]
        if base and _LANG_RE.match(base) and base not in candidates:
            candidates.append(base)
    return candidates


def _load_plugin_locale(plugin_id: str, lang: str | None) -> dict:
    """Load <plugins_root>/<plugin_id>/i18n/<lang>.json if available, else {}."""
    candidates = _lang_candidates(lang)
    if not candidates:
        return {}
    package_root = (plugin_store.plugins_root() / plugin_id).resolve()
    i18n_dir = (package_root / "i18n").resolve()
    try:
        i18n_dir.relative_to(package_root)
    except ValueError:
        return {}
    for code in candidates:
        candidate = (i18n_dir / f"{code}.json").resolve()
        try:
            candidate.relative_to(i18n_dir)
        except ValueError:
            continue
        if candidate.is_file():
            try:
                data = json.loads(candidate.read_text(encoding="utf-8"))
                if isinstance(data, dict):
                    return data
            except (OSError, ValueError):
                continue
    return {}


def _resolve_plugin_doc_path(plugin_id: str, lang: str | None) -> Path | None:
    """Resolve localized plugin documentation markdown file with fallback to README.md."""
    package_root = (plugin_store.plugins_root() / plugin_id).resolve()
    rel_candidates: list[str] = []
    for code in _lang_candidates(lang):
        rel_candidates.extend(
            [
                f"README.{code}.md",
                f"docs/README.{code}.md",
                f"docs/setup-guide.{code}.md",
            ]
        )
    rel_candidates.append("README.md")
    for rel in rel_candidates:
        candidate = (package_root / rel).resolve()
        try:
            candidate.relative_to(package_root)
        except ValueError:
            continue
        if candidate.is_file():
            return candidate
    return None


def _safe_icon_path(plugin_id: str, filename: str) -> Path | None:
    """Resolve an icon file inside the plugin package dir, guarding traversal."""
    if not filename:
        return None
    package_root = (plugin_store.plugins_root() / plugin_id).resolve()
    candidate = (package_root / filename).resolve()
    try:
        candidate.relative_to(package_root)
    except ValueError:
        return None
    return candidate if candidate.is_file() else None


def _resolve_icon(plugin_id: str, manifest: PluginManifest, node_key: str | None) -> Path | None:
    """Find the icon for a node (its own icon) or fall back to the package icon."""
    if node_key:
        node = manifest.get_node(node_key)
        if node is not None and node.icon:
            node_icon = _safe_icon_path(plugin_id, node.icon)
            if node_icon is not None:
                return node_icon
    return _safe_icon_path(plugin_id, "icon.svg")


def _localize_field(field: PluginField, field_i18n: dict) -> PluginField:
    if not field_i18n:
        return field
    label = field_i18n.get("label")
    options_i18n = field_i18n.get("options")
    new_label = str(label) if isinstance(label, str) and label else field.label
    if isinstance(options_i18n, dict) and field.options:
        new_options = [
            opt.model_copy(
                update={
                    "label": str(options_i18n[opt.value])
                    if isinstance(options_i18n.get(opt.value), str) and options_i18n.get(opt.value)
                    else opt.label
                }
            )
            for opt in field.options
        ]
    else:
        new_options = field.options
    return field.model_copy(update={"label": new_label, "options": new_options})


def _to_summary(plugin: Plugin, lang: str | None = None) -> PluginSummary:
    manifest = PluginManifest.model_validate(plugin.manifest)
    i18n = _load_plugin_locale(plugin.plugin_id, lang)
    plugin_i18n = i18n.get("plugin") if isinstance(i18n.get("plugin"), dict) else {}
    nodes_i18n = i18n.get("nodes") if isinstance(i18n.get("nodes"), dict) else {}

    nodes: list[PluginNodeSummary] = []
    for node in manifest.resolved_nodes():
        node_i18n = nodes_i18n.get(node.key) if isinstance(nodes_i18n.get(node.key), dict) else {}
        fields_i18n = node_i18n.get("fields") if isinstance(node_i18n.get("fields"), dict) else {}
        localized_fields = [
            _localize_field(
                f,
                fields_i18n.get(f.key) if isinstance(fields_i18n.get(f.key), dict) else {},
            )
            for f in node.fields
        ]
        node_name = node_i18n.get("name")
        node_desc = node_i18n.get("description")
        nodes.append(
            PluginNodeSummary(
                key=node.key,
                name=str(node_name) if isinstance(node_name, str) and node_name else node.name,
                kind=node.kind,
                description=str(node_desc)
                if isinstance(node_desc, str) and node_desc
                else node.description,
                fields=localized_fields,
                dsl_hint=node.dsl_hint,
                doc_slug=node.doc_slug,
                has_icon=_resolve_icon(plugin.plugin_id, manifest, node.key) is not None,
            )
        )

    pkg_name = plugin_i18n.get("name")
    pkg_desc = plugin_i18n.get("description")
    return PluginSummary(
        id=plugin.plugin_id,
        name=str(pkg_name) if isinstance(pkg_name, str) and pkg_name else plugin.name,
        version=plugin.version,
        kind=plugin.kind,
        description=str(pkg_desc) if isinstance(pkg_desc, str) and pkg_desc else plugin.description,
        enabled=plugin.enabled,
        nodes=nodes,
        has_icon=_safe_icon_path(plugin.plugin_id, "icon.svg") is not None,
    )


@router.get("", response_model=list[PluginSummary])
async def list_plugins(
    lang: str | None = Query(None, description="Optional UI locale code (e.g. de, fr, zh-Hans)"),
    accept_language: str | None = Header(None, alias="Accept-Language"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[PluginSummary]:
    require_plugins_enabled()
    resolved_lang = _resolve_lang(
        lang if isinstance(lang, str) else None,
        accept_language if isinstance(accept_language, str) else None,
    )
    rows = (await db.execute(select(Plugin))).scalars().all()
    return [_to_summary(p, lang=resolved_lang) for p in rows]


@router.get("/{plugin_id}/doc", response_model=PluginDoc)
async def get_plugin_doc(
    plugin_id: str,
    lang: str | None = Query(None, description="Optional UI locale code (e.g. de, fr, zh-Hans)"),
    accept_language: str | None = Header(None, alias="Accept-Language"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PluginDoc:
    require_plugins_enabled()
    plugin = (
        await db.execute(select(Plugin).where(Plugin.plugin_id == plugin_id))
    ).scalar_one_or_none()
    if plugin is None:
        raise HTTPException(status_code=404, detail="Plugin not found")
    resolved_lang = _resolve_lang(
        lang if isinstance(lang, str) else None,
        accept_language if isinstance(accept_language, str) else None,
    )
    doc_path = _resolve_plugin_doc_path(plugin_id, resolved_lang)
    markdown = doc_path.read_text(encoding="utf-8") if doc_path is not None else ""
    i18n = _load_plugin_locale(plugin_id, resolved_lang)
    plugin_i18n = i18n.get("plugin") if isinstance(i18n.get("plugin"), dict) else {}
    pkg_name = plugin_i18n.get("name")
    manifest = PluginManifest.model_validate(plugin.manifest)
    return PluginDoc(
        id=plugin_id,
        name=str(pkg_name) if isinstance(pkg_name, str) and pkg_name else plugin.name,
        doc_slug=manifest.resolved_doc_slug(),
        markdown=markdown,
    )


@router.get("/{plugin_id}/icon")
async def get_plugin_icon(
    plugin_id: str,
    node: str | None = Query(None, description="Resolve the icon for a specific node key"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FileResponse:
    require_plugins_enabled()
    plugin = (
        await db.execute(select(Plugin).where(Plugin.plugin_id == plugin_id))
    ).scalar_one_or_none()
    if plugin is None:
        raise HTTPException(status_code=404, detail="Plugin not found")
    manifest = PluginManifest.model_validate(plugin.manifest)
    icon = _resolve_icon(plugin_id, manifest, node)
    if icon is None:
        raise HTTPException(status_code=404, detail="Icon not found")
    return FileResponse(icon, media_type="image/svg+xml")


@router.post("/install", response_model=PluginSummary)
async def install_plugin(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PluginSummary:
    require_plugin_admin(current_user)
    data = await file.read()
    try:
        manifest = plugin_store.extract_and_validate(data, plugin_store.plugins_root())
    except PluginInstallError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    plugin_loader.clear_cache()
    existing = (
        await db.execute(select(Plugin).where(Plugin.plugin_id == manifest.id))
    ).scalar_one_or_none()
    if existing is None:
        existing = Plugin(plugin_id=manifest.id)
        db.add(existing)
    existing.name = manifest.name
    existing.version = manifest.version
    existing.kind = manifest.package_kind()
    existing.description = manifest.description
    existing.manifest = manifest.model_dump(by_alias=True)
    existing.enabled = True
    existing.installed_by = current_user.email
    await db.commit()
    await db.refresh(existing)
    return _to_summary(existing)


@router.patch("/{plugin_id}", response_model=PluginSummary)
async def set_plugin_enabled(
    plugin_id: str,
    enabled: bool,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PluginSummary:
    require_plugin_admin(current_user)
    plugin = (
        await db.execute(select(Plugin).where(Plugin.plugin_id == plugin_id))
    ).scalar_one_or_none()
    if plugin is None:
        raise HTTPException(status_code=404, detail="Plugin not found")
    plugin.enabled = enabled
    await db.commit()
    await db.refresh(plugin)
    return _to_summary(plugin)


@router.delete("/{plugin_id}")
async def uninstall_plugin(
    plugin_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    require_plugin_admin(current_user)
    plugin = (
        await db.execute(select(Plugin).where(Plugin.plugin_id == plugin_id))
    ).scalar_one_or_none()
    if plugin is not None:
        await db.delete(plugin)
        await db.commit()
    plugin_store.remove_plugin_dir(plugin_id, plugin_store.plugins_root())
    plugin_loader.clear_cache()
    return {"status": "uninstalled", "plugin_id": plugin_id}
