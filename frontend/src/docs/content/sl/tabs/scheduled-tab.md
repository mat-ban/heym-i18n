# Načrtovana Zavihek

Zavihek **Načrtovano** prikazuje vse aktivne cron workflows na vizualnem koledarju. Preklapljajte med dnevnim, tedenskim in mesečnim pogledom, da vidite, kdaj so vaše avtomatizacije načrtovane za izvajanje.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Oglejte si predstavitev Načrtovano</a></p>

## Pogledi

- **Dan** – Časovnica po urah za izbrani dan; vsak dogodek se prikaže kot blok ob svojem načrtovanem času
- **Teden** – Mreža s sedmimi stolpci, ki zajema trenutni teden; bloki se zložijo, ko se več workflows izvede ob isti uri
- **Mesec** – Mreža celotnega meseca; vsaka celica navaja workflows, ki so načrtovani za izvajanje na ta dan

## Bloki Workflows

Vsak blok prikazuje:

- **Ime workflow** – Kliknite, da neposredno odprete canvas workflow
- **Cron izraz** – Vidno ob premiku miške, prikazuje surovo časovnico (npr. `0 9 * * 1-5`)

## Navigacija

Administratorji instance, navedeni v `HEYM_ADMIN_EMAILS`, vidijo urnike vseh lastnikov, ko je **Prikaži vse workflows** označeno. Odznačite ga, da vidite le svoje lastne workflows. Drugi uporabniki obdržijo možnost **Prikaži deljeno z mano**. Za umik avtomatizacije zaposlenega uporabite [nadzorne elemente upravljanja instance](./workflows-tab.md#instance-administration) na predogledu Workflows, da zaustavite ali nadaljujete triggers.

- Uporabite puščice **prejšnji / naslednji** za premikanje med dnevi, tedni ali meseci
- Gumb **Danes** se takoj vrne na trenutni datum

## Sorodno

- [Cron Node](../nodes/cron-node.md) – Konfigurirajte načrtovane triggers na canvasu
- [Workflows Tab](./workflows-tab.md) – Upravljajte in organizirajte vse workflows
- [Analytics Tab](./analytics-tab.md) – Metrični podatki in trendi izvajanja
