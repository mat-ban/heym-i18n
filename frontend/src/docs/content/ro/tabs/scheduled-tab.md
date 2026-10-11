# Filă Programate

Fila **Programate** afișează toate workflow-urile cron active într-un calendar vizual. Comutați între vizualizările pe zi, săptămână și lună pentru a vedea când sunt programate să ruleze automatizările dumneavoastră.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

## Vizualizări

- **Zi** – Cronologie oră cu oră pentru ziua selectată; fiecare ocurență apare ca un bloc la ora programată
- **Săptămână** – Grilă cu șapte coloane care acoperă săptămâna curentă; blocurile se suprapun atunci când mai multe workflow-uri se declanșează la aceeași oră
- **Lună** – Grilă completă pentru întreaga lună; fiecare celulă listează workflow-urile programate să ruleze în ziua respectivă

## Blocuri de workflow

Fiecare bloc afișează:

- **Numele workflow-ului** – Faceți clic pentru a deschide direct canvas-ul workflow-ului
- **Expresia cron** – Vizibilă la hover, arătând programarea brută (de ex. `0 9 * * 1-5`)

## Navigare

Administratorii de instanță enumerați în `HEYM_ADMIN_EMAILS` văd programările fiecărui proprietar atunci când opțiunea **Show all workflows** este bifată. Debifați-o pentru a vedea doar propriile workflow-uri. Ceilalți utilizatori păstrează opțiunea **Show shared with me**. Pentru a retrage automatizarea unui angajat, utilizați [controalele de administrare a instanței](./workflows-tab.md#instance-administration) din previzualizarea Workflows pentru a suspenda sau relua trigger-ele.

- Utilizați săgețile **previous / next** pentru a naviga între zile, săptămâni sau luni
- Butonul **Today** revine instantaneu la data curentă

## Resurse conexe

- [Nod Cron](../nodes/cron-node.md) – Configurați trigger-e programate pe canvas
- [Fila Workflows](./workflows-tab.md) – Gestionați și organizați toate workflow-urile
- [Fila Analytics](./analytics-tab.md) – Metrici de execuție și tendințe
