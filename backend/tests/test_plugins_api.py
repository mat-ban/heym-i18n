import unittest
import uuid
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from fastapi import HTTPException, status

from app.api import plugins
from app.config import settings
from app.models.plugin_schemas import PluginManifest


class PluginGateTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self._enabled = settings.plugins_enabled
        self._admins = settings.plugin_admin_emails
        settings.plugins_enabled = True
        settings.plugin_admin_emails = "admin@example.com"

    def tearDown(self) -> None:
        settings.plugins_enabled = self._enabled
        settings.plugin_admin_emails = self._admins

    def test_require_enabled_raises_when_off(self) -> None:
        settings.plugins_enabled = False
        with self.assertRaises(HTTPException) as ctx:
            plugins.require_plugins_enabled()
        self.assertEqual(ctx.exception.status_code, status.HTTP_404_NOT_FOUND)

    def test_require_admin_rejects_unlisted(self) -> None:
        user = SimpleNamespace(id=uuid.uuid4(), email="viewer@example.com")
        with self.assertRaises(HTTPException) as ctx:
            plugins.require_plugin_admin(user)
        self.assertEqual(ctx.exception.status_code, status.HTTP_403_FORBIDDEN)

    def test_require_admin_allows_listed(self) -> None:
        user = SimpleNamespace(id=uuid.uuid4(), email="Admin@Example.com")
        plugins.require_plugin_admin(user)  # no raise

    async def test_uninstall_rejects_non_admin(self) -> None:
        user = SimpleNamespace(id=uuid.uuid4(), email="viewer@example.com")
        with self.assertRaises(HTTPException) as ctx:
            await plugins.uninstall_plugin("acme-crm", current_user=user, db=AsyncMock())
        self.assertEqual(ctx.exception.status_code, status.HTTP_403_FORBIDDEN)


class PluginIconResolverTests(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name)
        (self.root / "ikv").mkdir()
        (self.root / "ikv" / "icon.svg").write_text("<svg/>")
        (self.root / "ikv" / "trigger.svg").write_text("<svg id='t'/>")
        self._patch = patch.object(plugins.plugin_store, "plugins_root", return_value=self.root)
        self._patch.start()
        self.addCleanup(self._patch.stop)
        self.manifest = PluginManifest.model_validate(
            {
                "id": "ikv",
                "name": "IKV",
                "version": "1.0.0",
                "description": "x",
                "nodes": [
                    {"key": "t", "name": "t", "kind": "trigger", "icon": "trigger.svg"},
                    {"key": "p", "name": "p", "kind": "action"},
                ],
            }
        )

    def test_node_with_icon_uses_its_own(self) -> None:
        path = plugins._resolve_icon("ikv", self.manifest, "t")
        self.assertEqual(path, (self.root / "ikv" / "trigger.svg").resolve())

    def test_node_without_icon_falls_back_to_package(self) -> None:
        path = plugins._resolve_icon("ikv", self.manifest, "p")
        self.assertEqual(path, (self.root / "ikv" / "icon.svg").resolve())

    def test_rejects_path_traversal(self) -> None:
        (self.root / "secret.svg").write_text("<svg/>")
        self.assertIsNone(plugins._safe_icon_path("ikv", "../secret.svg"))

    def test_missing_icon_returns_none(self) -> None:
        self.assertIsNone(plugins._safe_icon_path("ikv", "nope.svg"))


class PluginI18nTests(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name)
        pkg = self.root / "acme-crm"
        (pkg / "i18n").mkdir(parents=True)
        (pkg / "docs").mkdir(parents=True)
        (pkg / "README.md").write_text("# Acme CRM (EN)")
        (pkg / "README.de.md").write_text("# Acme CRM (DE)")
        (pkg / "docs" / "README.fr.md").write_text("# Acme CRM (FR)")
        (pkg / "i18n" / "de.json").write_text(
            """{
  "plugin": {
    "name": "Acme CRM Deutsch",
    "description": "Deutsche Paketbeschreibung"
  },
  "nodes": {
    "lookup": {
      "name": "Kunde suchen",
      "description": "Sucht einen Kunden im CRM",
      "fields": {
        "mode": {
          "label": "Suchmodus",
          "options": {
            "exact": "Exakte Übereinstimmung"
          }
        }
      }
    }
  }
}""",
            encoding="utf-8",
        )
        self._patch = patch.object(plugins.plugin_store, "plugins_root", return_value=self.root)
        self._patch.start()
        self.addCleanup(self._patch.stop)
        self.plugin_row = SimpleNamespace(
            plugin_id="acme-crm",
            name="Acme CRM",
            version="1.0.0",
            kind="action",
            description="English description",
            enabled=True,
            manifest={
                "id": "acme-crm",
                "name": "Acme CRM",
                "version": "1.0.0",
                "description": "English description",
                "nodes": [
                    {
                        "key": "lookup",
                        "name": "Lookup Customer",
                        "kind": "action",
                        "description": "Looks up a customer",
                        "fields": [
                            {
                                "key": "mode",
                                "label": "Search Mode",
                                "type": "select",
                                "options": [
                                    {"label": "Exact Match", "value": "exact"},
                                    {"label": "Fuzzy Match", "value": "fuzzy"},
                                ],
                            },
                            {
                                "key": "query",
                                "label": "Query",
                                "type": "string",
                            },
                        ],
                    }
                ],
            },
        )

    def test_to_summary_localizes_and_falls_back(self) -> None:
        summary_de = plugins._to_summary(self.plugin_row, lang="de-DE")
        self.assertEqual(summary_de.name, "Acme CRM Deutsch")
        self.assertEqual(summary_de.description, "Deutsche Paketbeschreibung")
        node = summary_de.nodes[0]
        self.assertEqual(node.name, "Kunde suchen")
        self.assertEqual(node.description, "Sucht einen Kunden im CRM")
        self.assertEqual(node.fields[0].label, "Suchmodus")
        self.assertEqual(node.fields[0].options[0].label, "Exakte Übereinstimmung")
        self.assertEqual(node.fields[0].options[1].label, "Fuzzy Match")
        self.assertEqual(node.fields[1].label, "Query")

    def test_to_summary_without_locale_preserves_manifest(self) -> None:
        summary_en = plugins._to_summary(self.plugin_row, lang="en")
        self.assertEqual(summary_en.name, "Acme CRM")
        self.assertEqual(summary_en.nodes[0].name, "Lookup Customer")
        self.assertEqual(summary_en.nodes[0].fields[0].label, "Search Mode")

    def test_rejects_invalid_lang_traversal(self) -> None:
        self.assertEqual(plugins._load_plugin_locale("acme-crm", "../secret"), {})
        self.assertIsNone(plugins._resolve_lang("../../etc/passwd"))

    def test_resolve_plugin_doc_path_priority(self) -> None:
        self.assertEqual(
            plugins._resolve_plugin_doc_path("acme-crm", "de"),
            (self.root / "acme-crm" / "README.de.md").resolve(),
        )
        self.assertEqual(
            plugins._resolve_plugin_doc_path("acme-crm", "fr-FR"),
            (self.root / "acme-crm" / "docs" / "README.fr.md").resolve(),
        )
        self.assertEqual(
            plugins._resolve_plugin_doc_path("acme-crm", "es"),
            (self.root / "acme-crm" / "README.md").resolve(),
        )
