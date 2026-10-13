"""Admin endpoints for the Heym Work integration."""

import unittest
import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi import HTTPException

from app.api.work_integration_admin import get_work_config, rotate_work_key, update_work_config
from app.models.work_integration_schemas import WorkIntegrationConfigUpdate
from app.services.secret_tokens import hash_secret

_ADMINS = "app.services.instance_admin.settings.admin_emails"
_GET_ROW = "app.api.work_integration_admin.get_work_integration"
_CLEAR = "app.api.work_integration_admin.clear_key_cache"


def _row(**overrides: object) -> SimpleNamespace:
    base: dict[str, object] = dict(
        enabled=False,
        work_url="",
        key_hash=None,
        key_rotated_at=None,
        last_seen_at=None,
        last_work_version="",
        last_license_status="",
        updated_by_id=None,
    )
    base.update(overrides)
    return SimpleNamespace(**base)


def _admin() -> SimpleNamespace:
    return SimpleNamespace(id=uuid.uuid4(), email="admin@heym.example")


class AdminWorkConfigTests(unittest.IsolatedAsyncioTestCase):
    async def test_non_admin_is_refused(self) -> None:
        with patch(_ADMINS, "someone-else@heym.example"):
            with self.assertRaises(HTTPException) as ctx:
                await get_work_config(current_user=_admin(), db=AsyncMock())

        self.assertEqual(ctx.exception.status_code, 403)

    async def test_config_reports_key_set_without_returning_it(self) -> None:
        row = _row(key_hash=hash_secret("hwi_secret_value"))
        with patch(_ADMINS, "admin@heym.example"), patch(_GET_ROW, AsyncMock(return_value=row)):
            response = await get_work_config(current_user=_admin(), db=AsyncMock())

        payload = response.model_dump_json()
        self.assertTrue(response.key_set)
        self.assertNotIn("hwi_secret_value", payload)
        self.assertNotIn(row.key_hash, payload)

    async def test_rotate_returns_the_key_once_and_stores_its_digest(self) -> None:
        row = _row()
        with (
            patch(_ADMINS, "admin@heym.example"),
            patch(_GET_ROW, AsyncMock(return_value=row)),
            patch(_CLEAR, MagicMock()) as clear,
        ):
            response = await rotate_work_key(current_user=_admin(), db=AsyncMock())

        self.assertTrue(response.key.startswith("hwi_"))
        self.assertEqual(row.key_hash, hash_secret(response.key))
        self.assertIsNotNone(row.key_rotated_at)
        clear.assert_called_once()

    async def test_enabling_requires_url_and_key(self) -> None:
        row = _row()
        with patch(_ADMINS, "admin@heym.example"), patch(_GET_ROW, AsyncMock(return_value=row)):
            with self.assertRaises(HTTPException) as ctx:
                await update_work_config(
                    WorkIntegrationConfigUpdate(enabled=True),
                    current_user=_admin(),
                    db=AsyncMock(),
                )

        self.assertEqual(ctx.exception.status_code, 400)

    async def test_remote_http_url_is_refused(self) -> None:
        row = _row()
        with patch(_ADMINS, "admin@heym.example"), patch(_GET_ROW, AsyncMock(return_value=row)):
            with self.assertRaises(HTTPException) as ctx:
                await update_work_config(
                    WorkIntegrationConfigUpdate(work_url="http://work.acme.example"),
                    current_user=_admin(),
                    db=AsyncMock(),
                )

        self.assertEqual(ctx.exception.status_code, 400)

    async def test_update_saves_url_enables_and_clears_cache(self) -> None:
        row = _row(key_hash=hash_secret("hwi_x"))
        with (
            patch(_ADMINS, "admin@heym.example"),
            patch(_GET_ROW, AsyncMock(return_value=row)),
            patch(_CLEAR, MagicMock()) as clear,
        ):
            response = await update_work_config(
                WorkIntegrationConfigUpdate(work_url="https://work.acme.example/", enabled=True),
                current_user=_admin(),
                db=AsyncMock(),
            )

        self.assertEqual(response.work_url, "https://work.acme.example")
        self.assertTrue(response.enabled)
        clear.assert_called_once()

    async def test_private_lan_and_local_http_urls_are_accepted(self) -> None:
        row = _row(key_hash=hash_secret("hwi_x"))
        with (
            patch(_ADMINS, "admin@heym.example"),
            patch(_GET_ROW, AsyncMock(return_value=row)),
            patch(_CLEAR, MagicMock()),
        ):
            lan_resp = await update_work_config(
                WorkIntegrationConfigUpdate(work_url="http://10.0.0.5:5180/", enabled=True),
                current_user=_admin(),
                db=AsyncMock(),
            )
            local_resp = await update_work_config(
                WorkIntegrationConfigUpdate(work_url="http://work.local:5180/", enabled=True),
                current_user=_admin(),
                db=AsyncMock(),
            )

        self.assertEqual(lan_resp.work_url, "http://10.0.0.5:5180")
        self.assertEqual(local_resp.work_url, "http://work.local:5180")
