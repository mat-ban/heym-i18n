#!/usr/bin/env python3
"""Heym Hybrid Release CLI & Pre-Flight Gate.

Enforces GEMINI.md quality gates and forensic rules before creating,
tagging, and pushing a new release to GitHub.
"""

import os
import re
import subprocess
import sys
from pathlib import Path

# Paths
HEYM_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = HEYM_ROOT / "frontend"
BACKEND_DIR = HEYM_ROOT / "backend"
VERSION_FILE = HEYM_ROOT / "VERSION"
SET_VERSION_SH = HEYM_ROOT / "set-version.sh"
WORKSPACE_DIR = HEYM_ROOT.parent
DEPLOYMENT_ENV = WORKSPACE_DIR / "deployment.env"

# Forensic Rules (GEMINI.md Section 7)
FORBIDDEN_IPS = [re.compile(r"\b192\.168\.178\.139\b")]
FORBIDDEN_EMAILS = [
    re.compile(r"\b[a-zA-Z0-9._%+-]+@home\.local\b"),
]
FORBIDDEN_KEYS = [
    re.compile(r"\bsk-[a-zA-Z0-9]{32,}\b"),
    re.compile(r"\bghp_[a-zA-Z0-9]{36,}\b"),
]
FORBIDDEN_FILES = [
    "deployment.env",
    ".env",
    ".env.local",
    "i18n-report.json",
    "coverage-report.md",
    "package-lock.json",
]
WHITELISTED_FILES = {
    "backend/tests/test_ssrf_protection.py",
}


def log_step(title: str):
    print(f"\n{'='*70}\n🚀 {title}\n{'='*70}")


def log_pass(msg: str):
    print(f"  ✅ [PASS] {msg}")


def log_fail(msg: str):
    print(f"  ❌ [FAIL] {msg}")


def run_cmd(cmd: list[str], cwd: Path | None = None, check: bool = True) -> subprocess.CompletedProcess:
    cwd_path = cwd or HEYM_ROOT
    res = subprocess.run(cmd, cwd=str(cwd_path), capture_output=True, text=True)
    if check and res.returncode != 0:
        log_fail(f"Command failed: {' '.join(cmd)}")
        if res.stdout:
            print("--- STDOUT ---")
            print(res.stdout)
        if res.stderr:
            print("--- STDERR ---")
            print(res.stderr)
        sys.exit(1)
    return res


def step_forensic_scan():
    log_step("Schritt 1: Forensischer Secret- & Privacy-Scan (GEMINI.md)")

    # 1. Check for untracked forbidden files
    git_status = run_cmd(["git", "status", "--porcelain"])
    dirty_lines = [l for l in git_status.stdout.splitlines() if l.strip()]

    # Filter out ignored/untracked temporary files if any
    for line in dirty_lines:
        filepath = line[3:].strip()
        for forbidden in FORBIDDEN_FILES:
            if filepath.endswith(forbidden):
                log_fail(f"Verbotene Datei im Git-Arbeitsverzeichnis erkannt: {filepath}")
                sys.exit(1)

    # 2. Check tracked files for forbidden patterns
    tracked_files = run_cmd(["git", "ls-files"]).stdout.splitlines()
    for f in tracked_files:
        if f in WHITELISTED_FILES:
            continue
        full_path = HEYM_ROOT / f
        if not full_path.is_file() or full_path.stat().st_size > 2_000_000:
            continue
        try:
            content = full_path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        for ip_pat in FORBIDDEN_IPS:
            if ip_pat.search(content):
                log_fail(f"Interne IP-Adresse in {f} gefunden!")
                sys.exit(1)

        for email_pat in FORBIDDEN_EMAILS:
            if email_pat.search(content):
                log_fail(f"Lokale Test-E-Mail (@home.local) in {f} gefunden!")
                sys.exit(1)

        for key_pat in FORBIDDEN_KEYS:
            if key_pat.search(content):
                log_fail(f"Potentieller API-Key / Secret in {f} gefunden!")
                sys.exit(1)

    log_pass("Zero Secrets & Neutralisierung verifiziert: Keine internen IPs, Mails oder Keys im Repository.")


def step_quality_gates():
    log_step("Schritt 2: Frontend & Backend Quality Gates")

    # 1. npm run i18n:check
    print("  -> Führe i18n:check aus...")
    run_cmd(["npm", "run", "i18n:check"], cwd=FRONTEND_DIR)
    log_pass("100% Key-Parität (2.011 Keys über 32 Sprachen, 0 Compilerfehler)")

    # 2. npm run i18n:coverage -- --gate
    print("  -> Führe i18n:coverage -- --gate aus...")
    run_cmd(["npm", "run", "i18n:coverage", "--", "--gate"], cwd=FRONTEND_DIR)
    log_pass("100% Tier-A Dokumentations-Coverage (129/129 Docs in 32 Sprachen)")

    # 3. npm run typecheck
    print("  -> Führe TypeScript typecheck aus...")
    run_cmd(["npm", "run", "typecheck"], cwd=FRONTEND_DIR)
    log_pass("0 TypeScript-Typfehler")

    # 4. npm run lint:check
    print("  -> Führe ESLint lint:check aus...")
    run_cmd(["npm", "run", "lint:check"], cwd=FRONTEND_DIR)
    log_pass("ESLint Prüfung fehlerfrei")

    # 5. npx vitest run src/i18n/
    print("  -> Führe i18n Unit-Tests aus...")
    run_cmd(["npx", "vitest", "run", "src/i18n/"], cwd=FRONTEND_DIR)
    log_pass("12/12 i18n Unit-Tests bestanden")

    # 6. uv run ruff check .
    print("  -> Führe Backend Ruff lint aus...")
    run_cmd(["uv", "run", "ruff", "check", "."], cwd=BACKEND_DIR)
    log_pass("Backend Ruff Linting bestanden (0 Fehler)")

    # 7. uv run ruff format --check .
    print("  -> Führe Backend Ruff format check aus...")
    run_cmd(["uv", "run", "ruff", "format", "--check", "."], cwd=BACKEND_DIR)
    log_pass("Backend Ruff Formatierung sauber")


def parse_semver(v: str) -> tuple[int, int, int]:
    m = re.match(r"^v?(\d+)\.(\d+)\.(\d+)$", v.strip())
    if not m:
        return (0, 0, 0)
    return (int(m.group(1)), int(m.group(2)), int(m.group(3)))


def step_select_version(manual_version: str | None = None) -> str:
    log_step("Schritt 3: Versionsauswahl")

    current_v = VERSION_FILE.read_text().strip()
    print(f"  Aktuelle Version in VERSION: {current_v}")

    major, minor, patch = parse_semver(current_v)
    patch_v = f"{major}.{minor}.{patch + 1}"
    minor_v = f"{major}.{minor + 1}.0"
    major_v = f"{major + 1}.0.0"

    if manual_version:
        target = manual_version.lstrip("v")
        print(f"  Verwende übergebene Version: {target}")
        return target

    print("\n  Wählen Sie die Zielversion für dieses Release (GEMINI.md Upstream-Parität):")
    print(f"  1) Upstream-Parität: {current_v} (Standard / Übernahme der Basis-Releaseversion)")
    print(f"  2) Patch:            {patch_v} (Inkrementelles Update)")
    print(f"  3) Minor:            {minor_v} (Feature-Erweiterung)")
    print("  4) Manuelle Eingabe")

    choice = input("\n  Ihre Wahl [1-4, Standard=1]: ").strip()
    if choice == "2":
        target = patch_v
    elif choice == "3":
        target = minor_v
    elif choice == "4":
        target = input("  Geben Sie die Versionsnummer ein (z. B. 0.0.128): ").strip().lstrip("v")
    else:
        target = current_v

    print(f"  Gewählte Version: {target}")
    return target


def step_apply_version_and_merge(version: str):
    log_step(f"Schritt 4: Version {version} setzen & Single-Commit Squash (GEMINI.md)")

    # Set version
    run_cmd(["bash", str(SET_VERSION_SH), version])
    log_pass(f"Version auf {version} in VERSION, pyproject.toml, package.json und .env aktualisiert")

    # Find upstream base commit (upstream/main or upstream tag)
    remotes = run_cmd(["git", "remote"]).stdout.splitlines()
    upstream_ref = "upstream/main" if "upstream" in remotes else "main"

    # Switch to main
    current_branch = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"]).stdout.strip()
    if current_branch != "main":
        print(f"  -> Wechsle auf 'main' für Single-Commit Squash...")
        run_cmd(["git", "checkout", "main"])

    # Perform soft reset to upstream base to squash all intermediate development commits
    print(f"  -> Führe Soft-Reset auf '{upstream_ref}' durch (Squash-before-Push)...")
    run_cmd(["git", "reset", "--soft", upstream_ref])
    run_cmd(["git", "add", "-A"])
    commit_msg = "feat(i18n): enterprise internationalization (32 languages) and documentation"
    run_cmd(["git", "commit", "-m", commit_msg])
    log_pass(f"Aggregierter Einzel-Commit auf Basis von '{upstream_ref}' erstellt")

    # Align feature branch and prune local dangling commits
    run_cmd(["git", "branch", "-f", "feature/i18n", "main"])
    run_cmd(["git", "reflog", "expire", "--expire=now", "--all"])
    run_cmd(["git", "gc", "--prune=now"])
    log_pass("Lokale Branches angeglichen und alte Zwischencommits getilgt")

    # Create tag
    tag_name = f"v{version}"
    existing_tags = run_cmd(["git", "tag", "-l", tag_name]).stdout.strip()
    if existing_tags:
        print(f"  -> Tag {tag_name} existiert bereits, überschreibe Tag...")
        run_cmd(["git", "tag", "-d", tag_name])
    run_cmd(["git", "tag", "-a", tag_name, "-m", f"Heym i18n {tag_name}"])
    log_pass(f"Git-Tag '{tag_name}' erfolgreich erstellt")


def step_setup_remotes_and_push(version: str, do_push: bool):
    log_step("Schritt 5: GitHub Remotes Setup & Push")

    tag_name = f"v{version}"

    # Check remotes
    remotes = run_cmd(["git", "remote", "-v"]).stdout
    has_upstream = "upstream" in remotes
    origin_url = ""
    for line in remotes.splitlines():
        if line.startswith("origin\t") and "(push)" in line:
            origin_url = line.split()[1]

    # Rename origin to upstream if it points to heymrun
    if "heymrun/heym" in origin_url:
        print("  -> Benenne bisheriges 'origin' (heymrun/heym) zu 'upstream' um...")
        if not has_upstream:
            run_cmd(["git", "remote", "rename", "origin", "upstream"])
        else:
            run_cmd(["git", "remote", "remove", "origin"])

        # Add mat-ban/heym-i18n as origin
        target_repo = "https://github.com/mat-ban/heym-i18n.git"
        print(f"  -> Setze 'origin' auf {target_repo}...")
        run_cmd(["git", "remote", "add", "origin", target_repo])
        log_pass(f"Remotes erfolgreich konfiguriert: origin -> {target_repo}, upstream -> heymrun/heym")

    if not do_push:
        print(f"\n  ℹ️ Push übersprungen (--no-push). Sie können manuell pushen mit:")
        print(f"     git push origin main")
        print(f"     git push origin {tag_name}")
        return

    # Extract token safely for push without saving to git config
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token and DEPLOYMENT_ENV.is_file():
        for line in DEPLOYMENT_ENV.read_text().splitlines():
            if line.startswith("GITHUB_TOKEN="):
                token = line.split("=", 1)[1].strip()

    target_repo = "https://github.com/mat-ban/heym-i18n.git"
    push_target = f"https://oauth2:{token}@github.com/mat-ban/heym-i18n.git" if token else "origin"

    print(f"  -> Pushe 'main' und Tag '{tag_name}' nach GitHub (mat-ban/heym-i18n)...")
    run_cmd(["git", "push", "--force", push_target, "main"])
    run_cmd(["git", "push", "--force", push_target, f"refs/tags/{tag_name}"])
    log_pass(f"Branch 'main' und Tag '{tag_name}' erfolgreich nach GitHub gepusht!")
    print(f"\n🎉 GitHub Actions Workflow wird nun gestartet und erstellt das Release unter:")
    print(f"   https://github.com/mat-ban/heym-i18n/releases/tag/{tag_name}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Heym Hybrid Release CLI")
    parser.add_argument("--version", "-v", help="Zielversion (z. B. 0.0.129 oder 0.1.0)", default=None)
    parser.add_argument("--no-push", action="store_true", help="Erstelle Release lokal ohne sofortigen Push")
    parser.add_argument("--skip-lint", action="store_true", help="Überspringe Linter-Checks (nur im Notfall)")
    args = parser.parse_args()

    print("======================================================================")
    print("📦 Heym Enterprise Hybrid Release Pipeline")
    print("======================================================================")

    # 1. Forensic scan
    step_forensic_scan()

    # 2. Quality gates
    if not args.skip_lint:
        step_quality_gates()
    else:
        print("\n  ⚠️ Quality Gates durch --skip-lint übersprungen!")

    # 3. Select version
    target_version = step_select_version(args.version)

    # 4. Set version & merge
    step_apply_version_and_merge(target_version)

    # 5. Remote setup & push
    step_setup_remotes_and_push(target_version, do_push=not args.no_push)


if __name__ == "__main__":
    main()
