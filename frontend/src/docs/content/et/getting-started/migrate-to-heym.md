# Üleminek Hey mile

Kas teil on juba töövoog (Workflow) mõnes teises tööriistas? **AI Convert** teisendab need teie jaoks Heymi töövoogudeks. Kleepige töövoog (Workflow) n8n-ist, Flowise'ist, Dify'st, Langflow'st, sim.ai-st või Activepiecesist — või kirjeldage lihtsalt, mida soovite — ja Heym ehitab samaväärse töövoo (Workflow) reaalajas lõuendile, mille saate alla laadida ja importida.

Avage see aadressil **[heym.run/convert](https://heym.run/convert)** või kasutage saidi päises nuppu **✨ AI Convert**.

## Kuidas see töötab

1. **Valige lähtetööriist** (valikuline) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces või jätke see valikule *Auto*.
2. **Esitage oma töövoog (Workflow)** — kleepige oma praegusest tööriistast eksporditud JSON või kirjutage lihtsas keeles kirjeldus automatiseerimisest, mida soovite.
3. **Genereerige** — Heym edastab tulemuse voogesitusena lõuendile, joonistades sõlmed ja ühendused nende loomise ajal.
4. **Laadige alla või kopeerige** genereeritud töövoog (Workflow) JSON-ina.
5. **Importige Heymi** — kasutage voogu [Download & Import](../reference/download-import.md), et kleepida JSON oma lõuendile, seejärel käivitage see.

Teisendamine lisab lõuendile ka väikese *Sticky Note'i*, mis märgib töövoo (Workflow) Hey mi poolt genereerituks — kustutage see, millal iganes soovite.

## Mida te saate

Teisendaja vastendab lähtekontseptsioonid Hey mi natiivsete sõlmedega — triggerid, [LLM](../nodes/llm-node.md) sammud, [HTTP](../nodes/http-node.md) päringud, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) tegevused, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) ja [Output](../nodes/output-node.md). Vaadake tulemus lõuendil üle, ühendage oma [Credentials](../reference/credentials.md) ja kohandage kõike, mida lähtetööriist väljendas erinevalt.

> AI Convert on lähtepunkt, mitte garanteeritud 1:1 port. Vaadake genereeritud töövoog (Workflow) alati üle enne selle tootmiskeskkonnas käivitamist.

## Hea teada

- **AI-põhine:** teisendused loob suur keelemudel, seega tulemused võivad käivituste vahel erineda. Kui esimene tulemus pole päris sobiv, genereerige uuesti.
- **Sisendi suurus:** kleepitud või sisestatud sisend on piiratud ligikaudu **25 000 tokeniga**. Kärpige väga suuri eksportfaile enne teisendamist.
- **Päringupiirangud:** tööriista kättesaadavuse tagamiseks kõigile on päringud piiratud **1 minutis, 5 tunnis ja 10 ööpäevas** külastaja kohta.
- **Ohutus:** päringud vaadatakse läbi ja töödeldakse ainult workflow'de loomise päringuid.

## Järgmised sammud

- Olete lõuendil uus? Alustage jaotisest [Kiire algus](./quick-start.md).
- Õppige, kuidas importimine toimib jaotisest [Allalaadimine ja import](../reference/download-import.md).
- Hostite Heymi ise? Täieliku konfiguratsiooniteabe leiate jaotisest [Keskkonnamuutujad](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).
- Looge nullist rakendusesisese [AI-assistendi](../reference/ai-assistant.md) abil.
