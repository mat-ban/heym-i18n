# Grafiku cilne

Cilne **Grafiki** parāda visus aktīvos cron workflow vizuālā kalendārā. Pārslēdzieties starp dienas, nedēļas un mēneša skatiem, lai redzētu, kad Jūsu automatizācijas ir ieplānotas palaišanai.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Skatīties Grafiku demonstrāciju</a></p>

## Skati

- **Diena** – Stundu pa stundai laika josla izvēlētajai dienai; katrs notikums parādās kā bloks tā ieplānotajā laikā
- **Nedēļa** – Septiņu kolonnu režģis, kas aptver pašreizējo nedēļu; bloki sakrājas, ja vairāki workflow tiek palaisti vienā stundā
- **Mēnesis** – Pilna mēneša režģis; katra šūna uzskaita workflow, kas ieplānoti palaišanai attiecīgajā dienā

## Workflow bloki

Katrs bloks parāda:

- **Workflow nosaukums** – Noklikšķiniet, lai tieši atvērtu workflow kanvu
- **Cron izteiksme** – Redzama, novietojot kursoru, parādot neapstrādāto grafiku (piem., `0 9 * * 1-5`)

## Navigācija

Instances administratori, kas norādīti `HEYM_ADMIN_EMAILS`, redz visu īpašnieku grafikus, kad ir atzīmēta opcija **Rādīt visus workflow**. Noņemiet atzīmi, lai redzētu tikai savus workflow. Pārējie lietotāji saglabā opciju **Rādīt kopīgotos ar mani**. Lai atceltu darbinieka automatizāciju, izmantojiet [instances administrēšanas vadīklas](./workflows-tab.md#instance-administration) Workflows priekšskatījumā, lai apturētu vai atsāktu trigger.

- Izmantojiet **iepriekšējās / nākamās** bultiņas, lai pārvietotos starp dienām, nedēļām vai mēnešiem
- Poga **Šodien** nekavējoties atgriežas pie pašreizējā datuma

## Saistītie

- [Cron mezgls](../nodes/cron-node.md) – Konfigurējiet ieplānotos trigger uz kanvas
- [Workflows cilne](./workflows-tab.md) – Pārvaldiet un organizējiet visus workflow
- [Analītikas cilne](./analytics-tab.md) – Izpildes metrikas un tendences
