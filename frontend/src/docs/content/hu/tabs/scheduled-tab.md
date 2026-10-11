# Ütemezések lap

Az **Ütemezések** lap az összes aktív cron workflow-t jeleníti meg egy vizuális naptárban. Váltson nap, hét és hónap nézet között, hogy lássa, mikor ütemezettek az automatizálásai futásra.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Az Ütemezések demó megtekintése</a></p>

## Nézetek

- **Nap** – Óráról órára haladó idővonal a kiválasztott napra; minden előfordulás egy blokként jelenik meg az ütemezett időpontjában
- **Hét** – Hétoszlopos rács az aktuális hétre; a blokkok egymásra helyeződnek, ha több workflow indul ugyanabban az órában
- **Hónap** – Teljes havi rács; minden cella felsorolja az adott napon futásra ütemezett workflow-kat

## Workflow-blokkok

Minden blokk a következőket jeleníti meg:

- **Workflow neve** – Kattintson rá a workflow vászon közvetlen megnyitásához
- **Cron kifejezés** – Rámutatáskor látható, a nyers ütemezést mutatja (pl. `0 9 * * 1-5`)

## Navigáció

A `HEYM_ADMIN_EMAILS` listában szereplő instance-adminisztrátorok minden tulajdonos ütemezését látják, amikor a **Show all workflows** be van jelölve. A jelölés törlésével csak a saját workflow-jaikat látják. A többi felhasználó számára továbbra is elérhető a **Show shared with me** opció. Egy munkatárs automatizálásának visszavonásához használja a [instance-adminisztrációs vezérlőket](./workflows-tab.md#instance-administration) a Workflows előnézetben a triggerek szüneteltetéséhez vagy folytatásához.

- A **previous / next** nyilakkal lépkedhet napok, hetek vagy hónapok között
- A **Today** gomb azonnal visszatér az aktuális dátumhoz

## Kapcsolódó

- [Cron csomópont](../nodes/cron-node.md) – Ütemezett triggerek konfigurálása a vásznon
- [Workflows lap](./workflows-tab.md) – Az összes workflow kezelése és rendszerezése
- [Analytics lap](./analytics-tab.md) – Futtatási metrikák és trendek
