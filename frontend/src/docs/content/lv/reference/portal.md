# Portāls

**Portāls** nodrošina Heym workflow kā publiskus chat stila lietotāja interfeisus. Galalietotāji var palaist workflow, izmantojot URL, bez pieteikšanās Heym.

## Ko tas dara

- **Publisks URL**: `/chat/{slug}` (piem., `/chat/my-workflow`)
- **Chat interfeiss**: Lietotāji mijiedarbojas, izmantojot chat UI (ziņojumi, ievades, atbildes)
- **Neobligāta autentifikācija**: Ja ir konfigurēti portāla lietotāji, ir nepieciešama pieteikšanās; pretējā gadījumā portāls ir publisks
- **Straumēšana**: Reāllaika node progress izpildes laikā (ja iespējots)
- **Apturēt aktīvās izpildes**: Lietotāji var apturēt aktīvu portāla izpildi no chat kājenes; aktīvā workflow izpilde tiek atcelta arī servera pusē
- **Failu augšupielāde**: Neobligātas failu augšupielādes (teksts, attēli utt.) katram ievades laukam
- **Cilvēka pārskatīšanas nodošana**: Portāla izpildes var parādīt [HITL pārskatīšanas saites](./human-in-the-loop.md), kad aģents aptur darbību apstiprināšanai
- **Attēlu attēlošana**: Workflow izvades, kas satur attēlus (piem., no LLM attēlu ģenerēšanas vai Playwright ekrānuzņēmumiem), parādās kā sīktēli chat logā. Noklikšķiniet uz jebkura attēla, lai atvērtu pilnekrāna skatītāju; nospiediet **Esc** vai izmantojiet ierīces atpakaļ pogu, lai aizvērtu

## Workflow konfigurācija

| Iestatījums | Apraksts |
|---------|-------------|
| `portal_enabled` | Iespējot portālu šim workflow |
| `portal_slug` | URL slug (piem., `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Izmantot straumēšanas izpildi |
| `portal_file_upload_enabled` | Atļaut failu augšupielādes |
| `portal_file_config` | Failu konfigurācija katram laukam (veidi, ierobežojumi) |

Konfigurējiet redaktorā: **Portal** poga workflow galvenē atver portāla iestatījumu dialogu.

## Plūsma

1. **Informācija**: `GET /api/portal/{slug}/info` – Atgriež workflow metadatus un ievades laukus (bez autentifikācijas)
2. **Pieteikšanās** (ja nepieciešama): `POST /api/portal/{slug}/login` – Atgriež sesijas token
3. **Izpilde**: `POST /api/portal/{slug}/execute` – Portāla chat UI izsauc šo (vai tā straumēšanas variantu iekšēji, ja iespējots); galalietotāji mijiedarbojas, izmantojot chat interfeisu, nevis tieši izsaucot API.
4. **Apturēšana**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Tiek pieprasīts, kad lietotājs nospiež **Stop** aktīvas portāla izpildes laikā

## Vienlaicības ierobežojums

Kad darbplūsmai ir [vienlaicības ierobežojums](./webhooks.md#concurrency-limit-and-queued-runs) un visas vietas ir aizņemtas, portāla ziņojums gaida savu kārtu, nevis tiek palaists nekavējoties. Tērzēšanas progresa rindā tiek rādīts **Waiting in queue (2/5)**, līdz izpilde sākas, un pēc tam atbilde parādās kā parasti. Izpilde notiek arī tad, ja lietotājs aizver lapu. **Stop** noņem gaidošo izpildi no rindas. Kad rinda ir pilna, ziņojums neizdodas ar "Concurrency queue is full". Izpilde, kas gaidījusi rindā, nestraumē savu atbildi pa vienam tokenam; visa atbilde parādās, kad tā ir pabeigta.

## HITL portāla izpildēs

Ja portāla workflow sasniedz [Agent Node](../nodes/agent-node.md) ar iespējotu [Human-in-the-Loop](./human-in-the-loop.md), portāla atbilde parāda pārskatīšanas saiti, nevis parādās tukša.

- Workflow izpildes statuss kļūst `pending`
- Portāla chat parāda pārskatīšanas URL
- Jebkuri node, kas savienoti ar aģenta `review` izvades apstrādi, var nekavējoties paziņot Slack, e-pastā vai citos kanālos
- Pārskatītājs pabeidz lēmumu vietnē `/review/{token}` bez pieteikšanās
- Pēc pārskatīšanas workflow atsāk darbību no saglabātā snapshot

Tas ļauj apvienot publiskas chat plūsmas ar privātām cilvēka apstiprināšanas darbībām.

## Ievades lauki

Ievades lauki nāk no [Input](../nodes/input-node.md) node. API izgūst sākuma node ar tipu `textInput` un to `inputFields`. Izpilde izmanto to pašu dzinēju kā parastās izpildes; ievades tiek nodotas kā `body.inputs` un `conversation_history` vairāku apmaiņu plūsmām.

## Autentifikācija un sesijas

- **WorkflowPortalUser**: Lietotājvārds/parole katram workflow (kad autentifikācija ir iespējota)
- **Pēdējā lietotāja noņemšana**: Kad portāls ir iespējots, pēdējā portāla lietotāja dzēšana padara portālu atkal publisku; iestatījumu dialoglodziņš vispirms lūdz apstiprinājumu
- **PortalSession**: Sesijas token ar 168 stundu TTL
- **Ātruma ierobežošana**: 3 neveiksmīgi pieteikšanās mēģinājumi → 24h aizliegums katram workflow+IP
- Beigušās sesijas tiek notīrītas ar cron job

## Konfigurācijas UI

**WebPortalSettingsDialog** cilnes:

1. **General**: Iespējot portālu, iestatīt slug, kopēt portāla URL
2. **Users**: Pievienot/noņemt portāla lietotājus (lietotājvārds/parole)
3. **Options**: Straumēšanas režīms, failu augšupielāde, skatīt ievades laukus

## Saistītie

- [Why Heym](../getting-started/why-heym.md) – Portāls kā chat virsma aģentiem ražošanā
- [Workflows Tab](../tabs/workflows-tab.md) – Izveidot workflow un iespējot portālu
- [Human-in-the-Loop](./human-in-the-loop.md) – Publiskas pārskatīšanas lapas gaidošiem aģenta izvadiem
- [Triggers](./triggers.md) – Portāls kā ieejas punkts
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) portāla ievadēm
- [Workflow Structure](./workflow-structure.md) – Node un malas
