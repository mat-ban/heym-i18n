# DataTable

Vahekaart **DataTable** võimaldab luua ja hallata struktureeritud andmetabeleid otse Heyemis. Tabeleid saab workflow'des kasutada [DataTable node'i](../nodes/datatable-node.md) kaudu programmiliste CRUD-operatsioonide jaoks.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Vaadake DataTable'i demo</a></p>

## Tabeli loomine

1. Liikuge armatuurlauast vahekaardile DataTable
2. Klõpsake **Create DataTable**
3. Sisestage nimi ja valikuline kirjeldus
4. Lisage veerud veeruredaktoriga

## Veerud

Igal veerul on:

| Property | Description |
|----------|-------------|
| Name | Veeru kuvatav nimi |
| Type | `string`, `number`, `boolean`, `date` või `json` |
| Required | Kas uued read peavad selle veeru sisaldama |
| Unique | Kas väärtused peavad ridade lõikes olema unikaalsed |
| Default Value | Täidetakse automaatselt, kui rida selle veeru välja jätab |

Veerge saab lisada, muuta või eemaldada tabeli detailvaate päisest.

## Veergude genereerimine AI-ga

Veergude käsitsi lisamise asemel võite tabelit kirjeldada lihtsas keeles (või kleepida näidis-JSON-i) ja lasta LLM-il skeemi välja pakkuda. Mõlemad sisenemispunktid avavad sama dialoogi:

- **Generate with AI** (DataTable'i loendi päis) — loob teie kirjelduse põhjal täiesti uue tabeli.
- **AI columns** (tabeli detailvaade, veerujuhtelementide kõrval) — pakub välja *uued* veerud, mis lisatakse avatud tabelile.

### Kuidas see töötab

1. Valige **LLM credential** ja **model** (vaikimisi teie esimene LLM credential ja selle uusim mudel).
2. Sisestage kirjeldus — näiteks *"A table of books with title, author, page count, and whether I've read it"* — või kleepige JSON-i näidis/skeem.
3. Klõpsake **Generate**. Mudel tagastab soovitatud skeemi.
4. Vaadake genereeritud veerud üle redigeeritavas vormis: muutke iga veeru **name**, **type**, **default**, **unique** ja **notEmpty** (required) väärtust, kustutage soovimatud veerud või lisage veerg käsitsi valikuga **Add column**. Uue tabeli puhul saate muuta ka AI pakutud **name** ja **description** väärtust.
5. Salvestamiseks klõpsake **Create Table** (uus tabel) või **Add Columns** (olemasolev tabel). Dialoogi sulgemiseks vajutage igal ajal **Esc**.

### Olemasolevate tabelite puhul ainult lisamine

Olemasolevale tabelile veergude genereerimisel näeb mudel kontekstina teie praeguseid veerge ja pakub välja **ainult uued** veerud. Olemasolevaid veerge ja nende andmeid ei muudeta ega eemaldata kunagi — genereeritud veerud lisatakse lõppu. Duplikaatnimed (tõstutundetud) eemaldatakse automaatselt.

> Vajalik on LLM credential (OpenAI, Google või Custom). Kui teil seda pole, lisage see esmalt Settings'is.

## Ridade haldamine

- **Rea lisamine**: uue rea loomiseks klõpsake lisamisnupul
- **Reasisene redigeerimine**: väärtuse muutmiseks topeltklõpsake mis tahes lahtril. Salvestamiseks vajutage Enter või klõpsake mujale, tühistamiseks Escape
- **Rea kustutamine**: rea eemaldamiseks kasutage rea toimingute menüüd
- **Lehekülgedeks jagamine**: read kuvatakse 25 kaupa leheküljel, lehekülgede navigeerimisega

## CSV import/eksport

### Import
1. Tabeli detailvaates klõpsake **Import CSV**
2. Valige üleslaaditav CSV-fail
3. Eelvaadake esimest 5 rida ja veergude vastendust
4. Rohelised veerud on vastendatud olemasolevate tabeli veergudega; kollased on vastendamata
5. Ridade hulgi lisamiseks klõpsake Import

### Eksport
Kõigi ridade CSV-failina allalaadimiseks klõpsake **Export CSV**.

## Jagamine

Jagage tabeleid teiste kasutajate või tiimidega:

1. Avage tabeli detailvaatest jagamise dialoog
2. Lisage kasutajaid e-posti järgi **read** või **write** õigusega
3. Lisage tiime **read** või **write** õigusega
4. Ainult lugevad kasutajad saavad andmeid vaadata; kirjutamisõigusega kasutajad saavad muuta ridu ja veerge. Tabeli ümbernimetamine, selle kirjelduse muutmine ja jagamiste haldamine jäävad ainult omaniku õiguseks.

## Tabelite loomine AI-assistendiga

Lõuendi [AI-assistent](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) ja tööriist `heym_chat` [MCP vahekaardil](./mcp-tab.md) saavad valida ühe teie tabelitest loodava workflow jaoks või luua uue. Nad pakuvad välja nime ja veerud ning loovad tabeli, kui esitate küsimusekaardi. Lõuendiassistent konfigureerib workflow sõlmed tabeli metaandmetest. Chat ja `heym_chat` saavad ka ridu vaadata, veerge lisada või eemaldada ning ridu otseselt sisestada, värskendada või kustutada. Andke neile tabeli nimi või selle vahekaardi link. Kirjutamistoimingud nõuavad omanikuõigust või otsest/tiimi **kirjutusõigust**. Veergude lisamine säilitab olemasolevad andmed; veergude eemaldamine kustutab nende väärtused igalt realt. Veergude eemaldamine ja kõigi ridade tühjendamine küsivad kinnitust, vastavalt sellele vahekaardile.

## Kasutamine workflow'des

[DataTable node](../nodes/datatable-node.md) ühendab tabelid workflow'dega. Toimingute hulka kuuluvad find, getAll, getById, insert, update, remove ja upsert. Mandaate pole vaja.

## LLM Cost Table (süsteemitabel)

Kasutajate loodud tabelite kohal kuvatakse kinnitatud jaotis **System tables** ühe kirjega: **LLM Cost Table**. See on fikseeritud skeemiga, kasutajapõhiselt redigeeritav vaade mudelipõhisele hinnastamisele, mida kasutavad [Traces](./traces-tab.md) kulugraafikud.

### Kust andmed pärinevad

Heym hoiab globaalset mudelipõhise hinnastamise tabelit, mis on alglaaditud Helicone'i avalikust hinnastamise endpoint'ist (`https://www.helicone.ai/api/llm-costs`). Sünkroonimine toimub taustal esimesel korral, kui avate tabeli või Traces, ja on piiratud ühe päringuga 24 tunni jooksul. Kohese uuesti sünkroonimise jõustamiseks vajutage **Refresh**. Helicone'i poolt ülesvoolu loendist eemaldatud kirjeid lokaalselt ei kustutata, seega ajaloolised kulupäringud püsivad stabiilsed.

### Skeem (ainult lugemise veerud)

| Column | Meaning |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informatiivne, Helicone kasutab) |
| Model | Mudeli identifikaator, mida vastendatakse `trace.model` vastu |
| Op | Vastendusoperaator: `equals`, `startsWith` või `includes` |
| Input $/1M | USD 1 miljoni prompt-tokeni kohta |
| Output $/1M | USD 1 miljoni completion-tokeni kohta |
| Source | `helicone`, `seed` või `user` |
### Hindade kohandamine

- **Rea redigeerimine** võimaldab selle hinnad üle kirjutada. Ülekirjutus kehtib kasutajapõhiselt ja on tähistatud märgisega `Customized`; edasised Helicone'i sünkroonimised jätavad selle puutumata.
- **Lähteväärtuse taastamine** eemaldab ülekirjutuse ja taastab selle rea globaalse väärtuse.
- **Kohandatud mudeli lisamine** avab dialoogi ainult kasutajale nähtava rea loomiseks (näiteks privaatne peenhäälestatud mudel, mida Helicone ei loetle). Kohandatud read on tähistatud märgisega `User added` ning nende kustutamine eemaldab need täielikult.

### Sobitamine käivitustega

Kui Käivituste töölaud arvutab kulu, sobitab see iga `trace.model` järgmiste reeglite järgi:

1. Esmalt Teie ülekirjutused (täpne vastavus mudeli nimele)
2. Seejärel globaalne tabel — operaator `equals` (täpne vastavus) on prioriteetsem kui `startsWith`/`includes`; sama operaatori korral lahendatakse kollisioonid pikima sobiva mudeli eesliite/alamsõne järgi

Kui ükski rida ei sobi, loetletakse mudel Käivituste lehel **Unpriced models** teate all; selle kulupanus on null, kuni lisate kohandatud rea või kirjutate mõne rea üle.

## Seotud

- [DataTable Node](../nodes/datatable-node.md) - Workflow sõlme viide
- [Traces Tab](./traces-tab.md) - Kasutab LLM Cost Table'it kulutõusu ja KPI-kaartide jaoks
- [Grist Node](../nodes/grist-node.md) - Väline arvutustabeli alternatiiv
- [Variables Tab](./global-variables-tab.md) - Võti-väärtus salvestuse alternatiiv