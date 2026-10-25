# Portalas

**Portalas** atveria Heym workflows kaip viešas pokalbių stiliaus vartotojo sąsajas. Galutiniai vartotojai gali vykdyti workflows per URL, nesiregistruodami į Heym.

## Ką Jis Daro

- **Viešas URL**: `/chat/{slug}` (pvz., `/chat/my-workflow`)
- **Pokalbių sąsaja**: Vartotojai bendrauja per pokalbių UI (žinutės, įvestys, atsakymai)
- **Pasirinktinė autentifikacija**: Jei portalų vartotojai yra sukonfigūruoti, reikalingas prisijungimas; kitaip portalas yra viešas
- **Srautinė transliacija**: Realaus laiko mazgo pažanga vykdymo metu (kai įjungta)
- **Sustabdyti vykdymus**: Vartotojai gali sustabdyti vykdomą portalą iš pokalbių apačios; aktyvus workflow vykdymas taip pat atšaukiamas serverio pusėje
- **Failų įkėlimas**: Pasirinktiniai failų įkėlimai (tekstas, vaizdai ir kt.) kiekvienam įvesties laukui
- **Žmogiškojo peržiūros perdavimas**: Portalų vykdymai gali rodyti [HITL peržiūros nuorodas](./human-in-the-loop.md), kai agentas sustoja patvirtinimui
- **Vaizdų rodymas**: Workflow išvestys, turinčios vaizdus (pvz., iš LLM vaizdų generavimo ar Playwright ekrano nuotraukų), rodomos kaip miniatiūros pokalbyje. Paspauskite bet kurį vaizdą, kad atidarytumėte viso ekrano peržiūrą; paspauskite **Esc** arba naudokite įrenginio atgalinio mygtuko funkciją, kad uždarytumėte

## Workflow Konfigūracija

| Nustatymas | Aprašymas |
|------------|-----------|
| `portal_enabled` | Įjungti portalą šiam workflow |
| `portal_slug` | URL slug (pvz., `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Naudoti srautinį vykdymą |
| `portal_file_upload_enabled` | Leisti failų įkėlimus |
| `portal_file_config` | Failų konfigūracija pagal laukus (tipai, limitai) |

Konfigūruokite redaktoriuje: **Portalas** mygtukas workflow antraštėje atidaro portalų nustatymų dialogą.

## Srautas

1. **Informacija**: `GET /api/portal/{slug}/info` – Grąžina workflow metaduomenis ir įvesties laukus (be autentifikacijos)
2. **Prisijungimas** (jei reikia): `POST /api/portal/{slug}/login` – Grąžina sesijos tokeną
3. **Vykdyti**: `POST /api/portal/{slug}/execute` – Portalų pokalbių UI tai kviečia (arba jo srautinę versiją viduje, kai įjungta); galutiniai vartotojai bendrauja per pokalbių sąsają, o ne tiesiogiai kviesdami API.
4. **Sustabdyti**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Prašoma, kai vartotojas paspaudžia **Sustabdyti** aktyvaus portalo vykdymo metu

## Lygiagretumo apribojimas

Kai workflow turi [lygiagretumo apribojimą](./webhooks.md#concurrency-limit-and-queued-runs) ir visi lizdai yra užimti, portalo pranešimas laukia savo eilės, užuot paleistas iš karto. Pokalbio eigos eilutėje rodoma **Waiting in queue (2/5)**, kol vykdymas prasideda, o po to – atsakymas kaip įprasta. Vykdymas vis tiek įvyksta, jei vartotojas uždaro puslapį. **Stop** pašalina laukiantį vykdymą iš eilės. Kai eilė pilna, pranešimas nepavyksta su klaida "Concurrency queue is full". Eilėje laukęs vykdymas netransliuoja savo atsakymo po vieną tokeną; visas atsakymas pasirodo jam pasibaigus.

## HITL Portalų Vykdymuose

Jei portalų workflow pasiekia [Agent Node](../nodes/agent-node.md) su įjungtu [Human-in-the-Loop](./human-in-the-loop.md), portalų atsakymas rodo peržiūros nuorodą, o ne atrodo tuščias.

- Workflow vykdymo būsena tampa `pending`
- Portalų pokalbis rodo peržiūros URL
- Bet kurie mazgai, prijungti prie agento `review` išvesties rankenos, gali nedelsdami pranešti Slack, el. paštu ar kitais kanalais
- Peržiūrėtojas užbaigia sprendimą adresu `/review/{token}` nesiregistruodamas
- Po peržiūros workflow tęsiasi nuo saugomo momentinio vaizdo

Tai leidžia derinti viešus pokalbių srautus su privatiais žmogiškojo patvirtinimo žingsniais.

## Įvesties Laukai

Įvesties laukus teikia [Input](../nodes/input-node.md) mazgai. API išskiria pradinius mazgus, kurių tipas `textInput`, ir jų `inputFields`. Vykdymas naudoja tą pačią variklį kaip ir normalūs vykdymai; įvestys perduodamos kaip `body.inputs` ir `conversation_history` daugiažingsniams srautams.

## Autentifikacija ir Sesijos

- **WorkflowPortalUser**: Vartotojo vardas/slaptazodis kiekvienam workflow (kai autentifikacija įjungta)
- **Paskutinio vartotojo pašalinimas**: Kai portalas įjungtas, ištrynus paskutinį portalo vartotoją portalas vėl tampa viešas; nustatymų dialogo langas pirmiausia prašo patvirtinimo
- **PortalSession**: Sesijos tokenai su 168 valandų galiojimo laiku
- **Greitojo ribojimo**: 3 nesėkmingi prisijungimo bandymai → 24 valandų uždraudimas kiekvienam workflow+IP
- Pasibaigusios sesijos valomos cron užduoties

## Konfigūracijos UI

**WebPortalSettingsDialog** skirtukai:

1. **Bendra**: Įjungti portalą, nustatyti slug, kopijuoti portalų URL
2. **Vartotojai**: Pridėti/pašalinti portalų vartotojus (vartotojo vardas/slaptazodis)
3. **Parinktys**: Srautinio režimo, failų įkėlimo, įvesties laukų peržiūra

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – Portalas kaip pokalbių paviršius agentams gamyboje
- [Workflows Skirtukas](../tabs/workflows-tab.md) – Kurti workflows ir įjungti portalą
- [Human-in-the-Loop](./human-in-the-loop.md) – Viešos peržiūros puslapiai laukiančioms agentų išvestims
- [Triggers](./triggers.md) – Portalas kaip įėjimo taškas
- [Node Tipai](./node-types.md) – [Input](../nodes/input-node.md) portalų įvestims
- [Workflow Struktūra](./workflow-structure.md) – Mazgai ir briaunos
