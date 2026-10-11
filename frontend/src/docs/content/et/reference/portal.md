# Portal

**Portal** avalikustab Heymi workflow'd avalike chat-stiilis kasutajaliidestena. Lõppkasutajad saavad workflow'sid käivitada URL-i kaudu ilma Heymi sisse logimata.

## Mida see teeb

- **Avalik URL**: `/chat/{slug}` (nt `/chat/my-workflow`)
- **Chat-liides**: Kasutajad suhtlevad chat-liidese kaudu (sõnumid, sisendid, vastused)
- **Valikuline autentimine**: Kui portaali kasutajad on konfigureeritud, on sisselogimine nõutav; vastasel juhul on portaal avalik
- **Voogedastus**: Reaalajas sõlmede edenemine käivituse ajal (kui lubatud)
- **Käimasolevate käivituste peatamine**: Kasutajad saavad chat-jaluses peatada käimasoleva portaali käivituse; aktiivne workflow käivitus tühistatakse ka serveripoolselt
- **Faili üleslaadimine**: Valikulised faili üleslaadimised (tekst, pildid jne) sisendvälja kohta
- **Inimülevaatuse üleandmine**: Portaali käivitused võivad esile tuua [HITL ülevaatuse lingid](./human-in-the-loop.md), kui agent peatub kinnituse saamiseks
- **Piltide kuvamine**: Workflow väljundid, mis sisaldavad pilte (nt LLM-i pildigeneratsioonist või Playwrighti ekraanipiltidest), kuvatakse chatis pisipiltidena. Klõpsake mis tahes pildil, et avada täisekraani vaatur; sulgemiseks vajutage **Esc** või kasutage seadme tagasi-nuppu

## Workflow konfiguratsioon

| Seade | Kirjeldus |
|---------|-------------|
| `portal_enabled` | Lubage selle workflow jaoks portaal |
| `portal_slug` | URL-i slug (nt `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Kasutage voogedastusega käivitust |
| `portal_file_upload_enabled` | Lubage faili üleslaadimine |
| `portal_file_config` | Väljapõhine faili konfiguratsioon (tüübid, piirangud) |

Konfigureerige redaktoris: **Portal** nupp workflow päises avab portaali seadete dialoogi.

## Voog

1. **Info**: `GET /api/portal/{slug}/info` – Tagastab workflow metaandmed ja sisendväljad (autentimiseta)
2. **Sisselogimine** (kui nõutav): `POST /api/portal/{slug}/login` – Tagastab sessiooni tokeni
3. **Käivita**: `POST /api/portal/{slug}/execute` – Portaali chat-liides kutsub seda (või selle voogedastusvarianti sisemiselt, kui lubatud); lõppkasutajad suhtlevad chat-liidese kaudu, mitte ei kutsu API-t otse.
4. **Peata**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Taotletakse, kui kasutaja vajutab **Peata** aktiivse portaali käivituse ajal

## HITL portaali käivitustes

Kui portaali workflow jõuab [Agendi sõlmeni](../nodes/agent-node.md), millel on lubatud [Human-in-the-Loop](./human-in-the-loop.md), kuvab portaali vastus ülevaatuse lingi selle asemel, et jääda tühjaks.

- Workflow käivituse olekuks saab `pending`
- Portaali chat kuvab ülevaatuse URL-i
- Kõik sõlmed, mis on ühendatud agendi `review` väljundkäepidemega, saavad kohe teavitada Slacki, e-posti või muid kanaleid
- Ülevaataja teeb otsuse aadressil `/review/{token}` ilma sisse logimata
- Pärast ülevaatust jätkub workflow salvestatud hetktõmmisest

See võimaldab kombineerida avalikke chat-vooge privaatsete inimkinnituse sammudega.

## Sisendväljad

Sisendväljad pärinevad [Input](../nodes/input-node.md) sõlmedest. API eraldab algussõlmed tüübiga `textInput` ja nende `inputFields`. Käivitus kasutab sama mootorit nagu tavalised käivitused; sisendid edastatakse kui `body.inputs` ja `conversation_history` mitme vooru voogude jaoks.

## Autentimine ja sessioonid

- **WorkflowPortalUser**: Kasutajanimi/parool workflow kohta (kui autentimine on lubatud)
- **PortalSession**: Sessiooni tokenid 168-tunnise TTL-iga
- **Kiirusepiirang**: 3 ebaõnnestunud sisselogimiskatset → 24h keeld workflow+IP kohta
- Aegunud sessioonid puhastatakse cron-tööga

## Konfiguratsiooni kasutajaliides

**WebPortalSettingsDialog** vahelehed:

1. **Üldine**: Lubage portaal, määrake slug, kopeerige portaali URL
2. **Kasutajad**: Lisage/eemaldage portaali kasutajaid (kasutajanimi/parool)
3. **Valikud**: Voogedastusrežiim, faili üleslaadimine, sisendväljade vaatamine

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – Portaal kui agentide chat-liides tootmises
- [Workflows vaheleht](../tabs/workflows-tab.md) – Looge workflow'sid ja lubage portaal
- [Human-in-the-Loop](./human-in-the-loop.md) – Avalikud ülevaatuse lehed ootel agentide väljundite jaoks
- [Triggerid](./triggers.md) – Portaal kui sisenemispunkt
- [Sõlmede tüübid](./node-types.md) – [Input](../nodes/input-node.md) portaali sisendite jaoks
- [Workflow struktuur](./workflow-structure.md) – Sõlmed ja servad
