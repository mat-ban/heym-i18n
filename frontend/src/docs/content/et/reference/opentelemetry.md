# OpenTelemetry jälgimine

Heym suudab väljastada [OpenTelemetry](https://opentelemetry.io/) jälgimisandmeid (traces) iga workflow käivituse, node'i täitmise ja Agent-tööriista kutsumise kohta. Iga käivitus loob juursõlme (root span) koos tütarsõlmedega iga node'i ja Agent-tööriista jaoks, nii et on näha, milline samm ebaõnnestus, kui kaua see kestis, mida kutsuti ja mis tagastati. Sõlmed eksporditakse OTLP/HTTP kaudu mis tahes ühilduvasse taustsüsteemi, nagu Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic või Grafana Cloud.

Jälgimine on **vaikimisi välja lülitatud**. Kui see on välja lülitatud, ei ole mõõdetavat ülekulu ega looda ühtegi sõlme.

## Jälgimise lubamine

Määrake backend'il järgmised keskkonnamuutujad ja taaskäivitage see:

Täieliku keskkonnamuutujate loendi leiate jaotisest [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Muutuja | Vaikeväärtus | Kirjeldus |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Pealüliti. Seadke väärtusele `true`, et jälgimine sisse lülitada. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP baas-endpoint, näiteks `http://collector:4318`. Heym saadab sõlmed aadressile `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Komadega eraldatud `key=value` päised eksportija autentimiseks, näiteks `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Ressursi atribuut `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Pea-proovivõtu suhe vahemikus `0.0` kuni `1.0`, rakendatakse parent-based sampler'iga. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Kui `true`, lisatakse node'i sõlmedele kärbitud node'i sisend- ja väljund-payload'd. Privaatsuse huvides vaikimisi välja lülitatud. |

Minimaalne näide:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Aktiivset konfiguratsiooni saab kinnitada rakenduses jaotises **Settings → Observability** (avage see päises oma avatarilt). See paneel on kirjutuskaitstud ega kuva kunagi eksportija saladusi.

## Mida jälgitakse

### Workflow juursõlm

Nimi: `heym.workflow.execute`

| Atribuut | Kirjeldus |
|-----------|-------------|
| `heym.workflow.id` | Workflow UUID. |
| `heym.node.count` | Node'ide arv workflow's. |
| `heym.workflow.test_mode` | `true` testkäivituste puhul. |
| `heym.sub_workflow.depth` | Pesastumise sügavus, kui kutsutakse alam-workflow'na. |
| `heym.workflow.status` | Käivituse lõplik olek. Ebaõnnestunud käivitus määrab sõlme olekuks `ERROR`. |

### Node'i sõlm

Nimi: `heym.node.execute`, loodud workflow sõlme tütarsõlmena.

| Atribuut | Kirjeldus |
|-----------|-------------|
| `heym.node.id` | Node'i id. |
| `heym.node.type` | Node'i tüüp, näiteks `agent`, `llm`, `http`. |
| `heym.node.label` | Lõuendil kuvatav node'i silt. |
| `heym.node.status` | `success` või `error`. Vead määravad sõlme olekuks `ERROR`. |
| `heym.node.duration_ms` | Node'i täitmisaeg millisekundites. |
| `heym.llm.model` | Mudeli nimi LLM- ja agent-node'ide jaoks, kui saadaval. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Token'ite kasutus LLM- ja agent-node'ide jaoks, kui saadaval. |

Node'i sõlmed pesastuvad õigesti workflow sõlme alla ka siis, kui node'id töötavad paralleelselt, sest workflow kontekst edastatakse töölõimedesse.

### Agent-tööriista sõlm

Nimi: `heym.agent.tool.execute`, loodud aktiivse Agent-node'i sõlme alla.

| Atribuut | Kirjeldus |
|-----------|-------------|
| `heym.agent.tool.name` | Mudeli valitud tööriista nimi. |
| `heym.agent.tool.call_id` | Teenusepakkuja tööriista-kutse id, kui saadaval. |
| `heym.agent.tool.source` | Tööriista allikas, näiteks `node_tool`, `mcp`, `skill` või `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP-serveri silt, kui asjakohane. |
| `heym.agent.tool.iteration` | Agent-tööriista tsükli iteratsioon. |
| `heym.agent.tool.args_bytes` | Serialiseeritud tööriista argumentide UTF-8 suurus. |
| `heym.agent.tool.result_bytes` | Serialiseeritud tööriista tulemuse UTF-8 suurus. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` või `cancelled`. Tööriista vead määravad sõlme olekuks `ERROR`. |

Tooreid tööriista argumente ja tulemusi ei lisata sõlmedele vaikimisi.

## Agent-tööriista payload'i turvalisus

Püsivad Agent-vaadeldavuse payload'd redigeeritakse ja kärbitakse koodis (`4096` tähemärki stringi kohta, sügavus `6`, `32768` tähemärki kokku iga LLM trace kirjutise kohta). Kogu trace'i eelarve jaotatakse tööriista kirjete vahel, nii et varajane suur tulemus ei saa varjata hilisemate kutsete identiteeti ja elutsükli olekut. Piiratud `_generated_files` allalaadimise metaandmed on reserveeritud eraldi mahukast skill-väljundist:

- LLM trace'i `request` / `response` tööriista sektsioonid, sealhulgas trace'i hoidlasse kirjutatud `_hitl_pending` koopiad
- Agent-tulemuse `tool_calls` kirjed, mida kuvatakse käivituste ajaloos
- Live Debug paneeli tööriista-tulemuse sündmused, mis kasutavad uuesti sama piiratud puhastatud kirjet

Reaalajas tööriista täitmine, mudeliga seotud tööriista sõnumid ja mälusisene HITL jätkamise olek (`_hitl_pending.agent_state.messages` / `tool_arguments`) säilitavad algseid väärtusi, nii et jätkamine ja täpne argumentide sobitamine töötaksid endiselt. Puhastatakse ainult salvestatud vaadeldavuse koopiad.
## Trace Context levitamine

Heym järgib [W3C Trace Context](https://www.w3.org/TR/trace-context/) standardit, et jäljed püsiksid teenuste piiride üleselt ühendatud.

- **Sisenevad webhookid:** kui sissetulev päring sisaldab `traceparent` päist, salvestatakse workflow käivitus selle jälje alluvana. See seob Heymi käivitused neid käivitanud ülemvoolusüsteemiga.
- **Väljuv HTTP:** HTTP node lisab tehtavatesse päringutesse `traceparent`, et allavoolu teenused saaksid sama jälge jätkata.
- **Alam-workflow'd:** alam-workflow käivitus seatakse selle käivitanud node'i alluvaks, säilitades kutse hierarhia ühes jäljes.

Triggerid, millel puudub sisenev kontekst (näiteks Cron, IMAP, RabbitMQ ja WebSocket), alustavad iga käivituse kohta uut jälge.

## Töökindlus

- Aeglane või kättesaamatu koguja ei blokeeri kunagi workflow täitmist. Spanid koondatakse partiidesse ja eksporditakse taustal.
- Kui jälgimise lähtestamine ebaõnnestub (näiteks vigase endpoint'i tõttu), logib backend vea ja jätkab jälgimise väljalülitatud olekus, selle asemel et käivitumisel ebaõnnestuda.
- OTLP autentimispäiseid loetakse ainult keskkonnamuutujatest. Neid ei salvestata kunagi andmebaasi ega tagastata kunagi oleku API poolt.

## Seotud

- [Seaded](./user-settings.md) – Vaadeldavuse vahekaart, mis näitab jälgimise olekut
- [Keskkonnamuutujad](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Täielik konfiguratsiooni viide
- [Triggerid](./triggers.md) – Kuidas workflow'd käivituvad, sealhulgas webhookid
- [Käivituste ajalugu](./execution-history.md) – Heymi sisseehitatud käivituste kaupa ajaloo vaade
- [HTTP](../nodes/http-node.md) – Node, mis levitab trace context'i allavoolu kutsungitele
