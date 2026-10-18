"""Real-PostgreSQL regression tests for issue #725.

Unique columns are stored in JSONB, so the database cannot enforce them. The
check-then-insert in ``_check_unique_constraints`` therefore has to be serialised per
table. Mocked tests cannot catch this race, so these run concurrent writers with the
same value against a live database.

The check is wrapped so that every writer pauses between "check passed" and "insert".
That widens the race window enough to make an unfixed build fail every time, instead of
only now and then. With the advisory lock held, the pause just queues the other writers.

Requires a reachable PostgreSQL instance with migrations applied (see AGENTS.md,
"PostgreSQL Integration Tests").
"""

import asyncio
import unittest
import uuid
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch

from fastapi import HTTPException
from sqlalchemy import delete, func, select

from app.api import data_tables as dt_api
from app.db.models import DataTable, DataTableRow, User
from app.db.session import SessionLocal, async_session_maker, engine
from app.models.schemas import DataTableRowCreate, DataTableRowUpdate

WRITERS = 8
RACE_WINDOW_SECONDS = 0.2


def _is_db_reachable() -> bool:
    try:
        from sqlalchemy import text

        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


class RealPostgresUniqueConcurrencyTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        if not _is_db_reachable():
            self.skipTest("PostgreSQL database is not reachable")

        await engine.dispose()
        self.user_id = uuid.uuid4()
        self.table_id = uuid.uuid4()
        self.columns = [
            {"name": "email", "type": "string", "unique": True},
            {"name": "note", "type": "string"},
        ]
        async with async_session_maker() as session:
            session.add(
                User(
                    id=self.user_id,
                    email=f"unique-race-{self.user_id.hex[:8]}@example.com",
                    hashed_password="x",
                    name="Race Tester",
                )
            )
            await session.flush()
            session.add(
                DataTable(
                    id=self.table_id,
                    name=f"unique_race_{self.table_id.hex[:8]}",
                    owner_id=self.user_id,
                    columns=self.columns,
                )
            )
            await session.commit()

        async with async_session_maker() as session:
            self.user = (
                await session.execute(select(User).where(User.id == self.user_id))
            ).scalar_one()

    async def asyncTearDown(self) -> None:
        async with async_session_maker() as session:
            await session.execute(
                delete(DataTableRow).where(DataTableRow.table_id == self.table_id)
            )
            await session.execute(delete(DataTable).where(DataTable.id == self.table_id))
            await session.execute(delete(User).where(User.id == self.user_id))
            await session.commit()
        await engine.dispose()

    async def _count_rows(self, email: str | None = None) -> int:
        async with async_session_maker() as session:
            query = (
                select(func.count())
                .select_from(DataTableRow)
                .where(DataTableRow.table_id == self.table_id)
            )
            if email is not None:
                query = query.where(DataTableRow.data["email"].astext == email)
            return (await session.execute(query)).scalar_one()

    def _slow_check(self):
        """Wrap the real check so each writer idles between check and write."""
        original = dt_api._check_unique_constraints

        async def slow(*args, **kwargs):
            errors = await original(*args, **kwargs)
            await asyncio.sleep(RACE_WINDOW_SECONDS)
            return errors

        return patch.object(dt_api, "_check_unique_constraints", slow)

    async def _create_row(self, email: str) -> int:
        async with async_session_maker() as session:
            try:
                await dt_api.create_row(
                    self.table_id,
                    DataTableRowCreate(data={"email": email}),
                    self.user,
                    session,
                )
                await session.commit()
                return 201
            except HTTPException as exc:
                await session.rollback()
                return exc.status_code

    async def test_concurrent_create_row_same_value_inserts_once(self) -> None:
        with self._slow_check():
            statuses = await asyncio.gather(
                *[self._create_row("dup@example.com") for _ in range(WRITERS)]
            )

        self.assertEqual(statuses.count(201), 1, statuses)
        self.assertEqual(statuses.count(409), WRITERS - 1, statuses)
        self.assertEqual(await self._count_rows("dup@example.com"), 1)

    async def test_concurrent_create_row_different_values_all_succeed(self) -> None:
        with self._slow_check():
            statuses = await asyncio.gather(
                *[self._create_row(f"user{i}@example.com") for i in range(WRITERS)]
            )

        self.assertEqual(statuses, [201] * WRITERS)
        self.assertEqual(await self._count_rows(), WRITERS)

    async def test_concurrent_bulk_create_same_value_inserts_once(self) -> None:
        async def bulk() -> int:
            async with async_session_maker() as session:
                response = await dt_api.bulk_create_rows(
                    self.table_id,
                    [DataTableRowCreate(data={"email": "bulk@example.com"})],
                    self.user,
                    session,
                )
                await session.commit()
                return response.imported

        with self._slow_check():
            imported = await asyncio.gather(*[bulk() for _ in range(WRITERS)])

        self.assertEqual(sum(imported), 1, imported)
        self.assertEqual(await self._count_rows("bulk@example.com"), 1)

    async def test_concurrent_update_to_same_value_succeeds_once(self) -> None:
        row_ids = []
        async with async_session_maker() as session:
            for i in range(2):
                row = DataTableRow(
                    table_id=self.table_id,
                    data={"email": f"orig{i}@example.com"},
                    created_by=self.user_id,
                    updated_by=self.user_id,
                )
                session.add(row)
                await session.flush()
                row_ids.append(row.id)
            await session.commit()

        async def update(row_id: uuid.UUID) -> int:
            async with async_session_maker() as session:
                try:
                    await dt_api.update_row(
                        self.table_id,
                        row_id,
                        DataTableRowUpdate(data={"email": "taken@example.com"}),
                        self.user,
                        session,
                    )
                    await session.commit()
                    return 200
                except HTTPException as exc:
                    await session.rollback()
                    return exc.status_code

        with self._slow_check():
            statuses = await asyncio.gather(*[update(rid) for rid in row_ids])

        self.assertEqual(sorted(statuses), [200, 409], statuses)
        self.assertEqual(await self._count_rows("taken@example.com"), 1)

    async def test_sync_node_path_inserts_once(self) -> None:
        """The Data Table node uses the sync checker with its own session and commit."""
        barrier_window = RACE_WINDOW_SECONDS

        def insert(_: int) -> bool:
            import time

            with SessionLocal() as db:
                errors = dt_api._check_unique_constraints_sync(
                    self.table_id, {"email": "node@example.com"}, self.columns, db
                )
                time.sleep(barrier_window)
                if errors:
                    db.rollback()
                    return False
                db.add(
                    DataTableRow(
                        table_id=self.table_id,
                        data={"email": "node@example.com"},
                        created_by=self.user_id,
                        updated_by=self.user_id,
                    )
                )
                db.commit()
                return True

        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor(max_workers=WRITERS) as pool:
            results = await asyncio.gather(
                *[loop.run_in_executor(pool, insert, i) for i in range(WRITERS)]
            )

        self.assertEqual(sum(results), 1, results)
        self.assertEqual(await self._count_rows("node@example.com"), 1)


if __name__ == "__main__":
    unittest.main()
