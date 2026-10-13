# Hurtigpanel

**Hurtigpanelet** er en højrejusteret hurtigkørsel-panel til workflows. Det vises på autentificerede sider såsom dashboardets [Workflows-fane](../tabs/workflows-tab.md), Docs og Evalueringer.

## Adgang

- Klik på den faste **Quick / Workflows**-trigger i højre midterkant af skærmen
- Når [Kontekstvisning](./contextual-showcase.md) også er tilgængelig, placeres dens **Sideguide**-trigger over Quick Workflows
- Panelet åbnes fra højre og forskyder den aktuelle side til venstre med en diskret skalering
- På mobil skjules Hurtigpanelet
- Panelet vises ikke på workflow-editoren, login/registreringssider, portal eller HITL-gennemsynssider

## Workflow-søgning

Brug filterfeltet øverst i panelet til at søge workflows efter:

- Workflow-navn
- Workflow-beskrivelse

Søgningen er case-insensitiv og opdaterer listen med det samme.

## Fastgjorte workflows

Fastgør workflows for at beholde dem øverst i panelet.

- Fastgjorte workflows vises i deres egen sektion over den fulde liste
- Nye fastgørelser tilføjes øverst
- Fastgørelsesrækkefølgen bevares ved genindlæsning i browserens lager

## Kørsel af workflows

Vælg et workflow for at åbne dets inputformular.

- Inputfelter vises lodret i panelets rækkefølge
- Klik på **Kør Workflow** for at eksekvere det valgte workflow
- Klik på **Stop Workflow** for at annullere en igangværende kørsel fra panelet
- Workflows uden inputfelter kan stadig køres direkte
- Et workflow, der starter med en [File Upload Trigger](../nodes/file-upload-trigger-node.md), viser i stedet en dropzone: træk en fil derind, eller klik for at vælge en. Zonen viser de filtyper og den størrelse, som triggeren accepterer, og afviser andre filer før upload. **Run Workflow** forbliver deaktiveret, indtil der er valgt en fil.

Panelet bruger den samme workflow-eksekverings-API som andre Heym-kørselsflader, så output og kørselsadfærd forbliver konsistente.

Annullering af en kørsel fra panelet stopper også den aktuelle backend-eksekvering, inklusive eventuelle igangværende Playwright-browserjob for den pågældende workflowkørsel.

## Fremskridt og resultater

Efter start af en kørsel viser panelet:

- Streaming af trinfremskridt for noder efterhånden som de starter og afsluttes
- Endelig status: `success`, `error` eller `pending`
- Endelige output i et kompakt JSON-panel
- Historikposter mærket med `Hurtigpanel`

`pending` betyder, at workflowet venter på en senere handling såsom menneskelig gennemsyn.

En filkørsel går gennem triggerens engangs-uploadlink: skuffen beder workflowet om et link, uploader filen til det og viser resultatet, når uploaden vender tilbage. Filkørsler viser den endelige status og output, men ingen trinvis fremdrift, og bliver også tagget med `Quick Drawer` i historikken. Den valgte fil ryddes efter hver kørsel, da et link kun tager imod én fil.

## Browserlager

Hurtigpanelet gemmer personlige præferencer i `localStorage`:

- ID'er for fastgjorte workflows
- Sidst valgte workflow

Panelet gemmer **ikke** inputværdier i denne version.

## Omfang

Hurtigpanelet er bevidst en letvægts eksekveringsflade.

- Inkluderet: søgning, fastgørelse, valg, input (herunder en fil), kørsel, fremskridt, resultat
- Ekskluderet: workflow-oprettelse, redigering, mappestyring og canvas-handlinger

## Relateret

- [Workflows-fane](../tabs/workflows-tab.md) – Hovedliste over workflows, mapper og styring
- [Hurtig start](../getting-started/quick-start.md) – Byg og kør det første workflow
- [Kørselshistorik](./execution-history.md) – Gennemse tidligere kørsler
- [Webhooks](./webhooks.md) – Udløs workflows over HTTP
- [Kontekstvisning](./contextual-showcase.md) – Sideguidepanel der supplerer Hurtigpanelet
