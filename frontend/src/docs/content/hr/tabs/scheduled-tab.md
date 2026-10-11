# Raspoređeni Tab

Tab **Rasporedi** prikazuje sve aktivne cron workflows na vizualnom kalendaru. Prebacite se između prikaza dana, tjedna i mjeseca kako biste vidjeli kada su vaša automatizacija zakazana za pokretanje.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Pogledajte demo Rasporeda</a></p>

## Prikazi

- **Dan** – Vremenska linija po satu za odabrani dan; svaki događaj pojavljuje se kao blok u svom zakazanom vremenu
- **Tjedan** – Mreža sa sedam kolona koja obuhvaća trenutni tjedan; blokovi se slažu kada se više workflows pokrene u isto vrijeme
- **Mjesec** – Mreža za cijeli mjesec; svaka ćelija navodi workflows koji su zakazani za pokretanje tog dana

## Workflow Blokovi

Svaki blok prikazuje:

- **Naziv workflowa** – Kliknite za izravno otvaranje canvas-a workflowa
- **Cron izraz** – Vidljiv pri prelasku miša, prikazuje sirovi raspored (npr. `0 9 * * 1-5`)

## Navigacija

Administratori instance navedeni u `HEYM_ADMIN_EMAILS` vide rasporede svih vlasnika kada je **Prikaži sve workflows** označeno. Poništite ovu opciju kako biste vidjeli samo vlastite workflows. Ostali korisnici zadržavaju opciju **Prikaži dijeljeno sa mnom**. Za povlačenje automatizacije zaposlenika, koristite [kontrole administracije instance](./workflows-tab.md#instance-administration) na pregledu Workflows za pauziranje ili nastavak triggera.

- Koristite **prethodne / sljedeće** strelice za kretanje kroz dane, tjedne ili mjesece
- Gumb **Danas** odmah se vraća na trenutni datum

## Povezano

- [Cron Node](../nodes/cron-node.md) – Konfigurirajte zakazane triggere na canvas-u
- [Workflows Tab](./workflows-tab.md) – Upravljajte i organizirajte sve workflows
- [Analytics Tab](./analytics-tab.md) – Metrike i trendovi izvršenja
