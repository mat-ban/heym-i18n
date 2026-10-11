# Lõuendi funktsioonid

Workflow' redaktor pakub mitmeid funktsioone sõlmede silumiseks, testimiseks ja korrastamiseks: **Käivita sõlmeni**, **Andmete kinnitamine**, **Käivituse logid**, **Luba/Keela** ja **Eralda alam-workflow'ks**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Vaadake redaktori demot</a></p>

## Käivita sõlmeni

Hõljutage kursorit mis tahes sõlme kohal, välja arvatud kleepuv märkus, ja klõpsake selle all oleval nupul **Käivita**. Heym käivitab selle sõlme ja selle ülesvoolu sõltuvused, jättes allavoolu sõlmed ja seotud harud puutumata. See kasutab lõuendi testrežiimi, sealhulgas kinnitatud väljundeid ja workflow' tavapäraseid harutingimusi.

Kui valitud teel on sisendväljad, avaneb parempoolne **Käivitamise** paneel ja fookus läheb esimesele väljale. Sisestage väärtused, seejärel klõpsake nupul **Käivita sõlmeni _sõlme silt_** või vajutage **Ctrl+Enter** (macOS-is Cmd+Enter). Üldine body-režiim seab fookuse JSON body redaktorile. Teed ilma sisendväljadeta käivituvad kohe ilma paneeli avamata. Kinnitatud sisendsõlmed kasutavad uuesti oma kinnitatud väljundit ilma sisendit küsimata.

Paneel säilitab valitud sihtmärgi järgnevateks käivitusteks. Sihtmärgi tühistamiseks valige **Käivita kogu workflow**. Käivitamise nupud on keelatud, kui käivitus on aktiivne. Sihtmärk tsükli sees peatab käivituse, kui see sõlm esimest korda saavutatakse; tsükli järel oleva sõlme valimine käivitab tervikliku ülesvoolu tsükli.

## Andmete kinnitamine

Andmete kinnitamine võimaldab kinnitada sõlme väljundi viimasest käivitusest, et saaksite testida allavoolu sõlmi ilma kinnitatud sõlme uuesti käivitamata.

### Kust seda leida

- **Atribuutide paneel** – Valige sõlm ja kerige jaotiseni **Kinnitatud andmed**
- **Sõlme märgis** – Kui andmed on kinnitatud, kuvatakse sõlmel kinnitusikoon

### Toimingud

| Toiming | Kirjeldus |
|--------|-------------|
| **Kinnita** | Kinnitab sõlme viimase käivituse väljundi (saadaval pärast käivitust) |
| **Tühjenda** | Eemaldab kinnitatud andmed |
| **Redigeeri** | Redigeerige kinnitatud JSON-i otse; rakendamiseks klõpsake Salvesta |

### Testrežiimi käitumine

Workflow' käivitamisel testrežiimis jätavad sõlmed, millel on `pinnedData`, käivituse vahele ja kasutavad selle asemel kinnitatud väljundit. Kasutage seda järgmisteks tegevusteks:

- Testige allavoolu loogikat ilma väliste API-de kutsumiseta
- Siluge avaldisi, mis viitavad sõlme väljundile
- Täiustage prompt'e või tingimusi fikseeritud näidisandmetega

Avaldiste automaatlõpetus redaktoris kasutab kinnitatud andmeid, kui need on saadaval, et soovitada välju.

## Käivituse logid

**Silumise paneel** (alumine sahtel) kuvab workflow' käivituste ajal reaalajas käivituse logisid. Samuti saate avada töötava tootmiskäivituse kas Ajaloo dialoogist või Tahvli kaardilt. Redaktor ühendub selle käivituse SSE-vooga, taastab lõpetatud sõlmede tulemused ning jätkab sõlmede animatsioonide ja logide kuvamist, kui uued sõlmed algavad ja lõpevad.

### Mida see kuvab

- **Sõlmede tulemused** – Sõlmede kaupa olek (`success`, `error`, `skipped`, `running`), käivituse aeg ja väljund
- **Lõplikud väljundid** – [Väljundi](../nodes/output-node.md) sõlmede koondatud väljundid
- **Agendi edenemine** – [Agendi](../nodes/agent-node.md) sõlmede puhul samm-sammulised tööriistakutsed ja põhjendused

### Toimingud

- **Kopeeri JSON-ina** – Kopeerib täieliku käivituse logi lõikelauale
- **Ava JSON-redaktoris** – Avab logi JSON Hero või JSON Editor Online keskkonnas ülevaatamiseks
- **Laadi alla loodud failid** – Kui oskus lõi allalaaditavaid faile (`_generated_files`), kuvatakse allalaadimise nupp. Üksik fail laaditakse alla otse; mitme faili puhul avaneb valiku hüpikaken.

### Erinevus Logide vahekaardist

Silumise paneel kuvab **workflow' käivituse** logisid (sõlmede tulemused, väljundid). [Logide vahekaart](../tabs/logs-tab.md) kuvab **Dockeri konteineri** logisid (backend, frontend, andmebaas). <!-- pragma: allowlist secret -->

## Luba / Keela

Saate sõlmi keelata, et need käivituse ajal vahele jäetaks. Keelatud sõlmed kuvavad märgist "väljas" ja paistavad tuhmilt.

### Kuidas lülitada

| Meetod | Kirjeldus |
|--------|-------------|
| **Atribuutide paneel** | Valige sõlm → Toite ikoon (üleval paremal) |
| **Kontekstimenüü** | Paremklõps sõlmel/sõlmedel → Keela või Luba |
| **Klaviatuur** | Valige sõlm/sõlmed → vajutage **D** (vt [Klaviatuuri kiirklahvid](./keyboard-shortcuts.md)) |

### Mitmikvalik

Kui on valitud mitu sõlme, rakendub Luba/Keela kõigile neile. Kontekstimenüü kuvab "Luba", kui mõni valitud sõlm on keelatud, ja "Keela", kui kõik on lubatud.

### Käitumine käitusajal

Sõlmed, millel on `active: false`, jäetakse vahele. Allavoolu sõlmed ei saa vahelejäetud sõlmedelt andmeid. Kasutage seda sõlmede ajutiseks väljajätmiseks ilma neid kustutamata.

Sõlme sisse- või väljalülitamiseks käsitsi asemel workflow' seest kasutage sõlmi [Keela sõlm](../nodes/disable-node.md) ja [Luba sõlm](../nodes/enable-node.md).
## Agendi mälugraaf

[Agendi](../nodes/agent-node.md) sõlmed, millel on lubatud **[püsiv mälu](./agent-persistent-memory.md)**, kuvavad sõlmel roosat **aju** juhtelementi. Klõpsake sellel, et avada mälugraafi redaktor: entiteedid kuvatakse animeeritud, jõupõhisel graafil, mis on klasterdatud entiteedi tüübi järgi, koos otsitavate Source/Target valijatega seoste lisamiseks ja ühenduste paneeliga lingitud entiteetide vahel hüppamiseks. Sama dialoog sisaldab valikut **Jaga mälu teiste agentidega** (workflow → agent → lugemine või lugemine/kirjutamine) [agentidevahelise mälujagamise](./agent-persistent-memory.md#sharing-with-other-agents) jaoks. Kuni dialoog on avatud, on peamise lõuendi undo/redo edasi lükatud, et graafi redigeerimine säilitaks oma ajaloo.

**Graafi filtreerimine.** Lõuendi ülaosas vasakul on otsingukontroll, mis on ahendatud otsetee nupuks, kuni klõpsate sellel või vajutate **Ctrl/Cmd+F**. See vastab entiteedi nimele, selle tüübile ning igale atribuudi võtmele ja väärtusele, samuti seose tüübile (`parent_of`) ja selle omadustele; vastav seos toob kaasa mõlemad oma entiteedid. Kõik tühikuga eraldatud terminid peavad vastama. Vastav entiteet toob kaasa kogu oma naabruskonna — iga seose, milles see osaleb, ja entiteedi iga seose teisel poolel — nii et vastet ei jäeta kunagi ühendamata punktina. Vastav seos toob ainult kaks entiteeti, mida see ühendab, ja peatub seal, kuna seose tüübi otsimine on küsimus selle seose kohta, mitte kõige kohta, millega selle otsad on seotud. Kõik muu on lõuendil ja **Kõik servad** loendis otseselt peidetud — mitte tuhmilt kuvatud — ning märk näitab, kui palju koguarvust entiteetidest on alles. Kasti sees olev **✕** tühjendab esmalt päringu, seejärel sulgeb kasti teisel vajutusel. Escape taandub samal viisil, sisemistest välistele: see tühjendab päringu, seejärel sulgeb otsingukasti, seejärel lahkub laiendatud lõuendivaatest ja sulgeb dialoogi alles siis, kui ükski neist pole avatud. Tühjendamine taastab täieliku graafi, kus iga entiteet on tagasi oma kohal.

**Entiteetide käsitsi paigutamine.** Entiteedi lohistamine kinnitab selle sinna, kuhu selle asetate, nii et automaatne paigutus lahendab ülejäänud graafi selle ümber, selle asemel et seda tagasi tõmmata. Valitud entiteedi lohistamine liigutab koos sellega ka otseselt ühendatud entiteedid, säilitades klasteri kuju; mis tahes muu entiteedi lohistamine liigutab ainult seda. **Korrasta paigutus** (võlukepi nupp) vabastab iga kinnitatud entiteedi ja käivitab automaatse paigutuse uuesti.

## Eralda alam-workflow'ks

Teisendage valitud sõlmed taaskasutatavaks alam-workflow'ks ja asendage need [Execute](../nodes/execute-node.md) sõlmega.

### Kuidas kasutada

1. Valige lõuendil üks või mitu sõlme
2. Paremklõps → **Eralda alam-workflow'ks**
3. Sisestage uue workflow nimetus (ja valikuline kirjeldus)
4. Klõpsake **Eralda**

### Mis juhtub

- Valitud sõlmedega luuakse uus workflow
- Välised sisendid (servad väljastpoolt valikut) muutuvad alam-workflow [Input](../nodes/input-node.md) väljadeks
- Välised väljundid (servad valikust väljapoole jäävatesse sõlmedesse) vastendatakse alam-workflow [Output](../nodes/output-node.md) väljundiga
- Valitud sõlmed asendatakse üksiku [Execute](../nodes/execute-node.md) sõlmega, mis kutsub uut workflow'd
- Sisend/väljund vastendused säilitatakse automaatselt

### Kasutusjuhud

- Korduva sõlmede jada taaskasutamine mitmes workflow's
- Keeruka workflow lihtsustamine seotud loogika rühmitamise teel
- Modulaarsete, testitavate alam-workflow'de loomine

## Käivitamine cURL-iga

Redaktori tööriistaribal (ülaosas paremal) olev **cURL** nupp avab dialoogi, et koostada ja kopeerida cURL käsk workflow käivitamiseks API kaudu.

- Valige workflow päringu keha režiim (`Defined` või `Generic`)
- Määrake autentimise tüüp (Anonymous, JWT või Header Auth)
- Konfigureerige vastuse vahemällu salvestamine ja kiirusepiirang
- Lülitage sisse SSE voogedastus ja kohandage sõlmede kaupa algussõnumeid
- Muutke päringu keha
- Generic režiimis kasutab lõuendi käivitamise paneel sama töötlemata JSON keha nagu cURL dialoog
- Klõpsake **Kopeeri cURL**, et kopeerida käivitamisvalmis käsk

Täielike dialoogi üksikasjade kohta vaadake [Webhooks](./webhooks.md#run-with-curl-dialog) ja sündmuste protokolli kohta [SSE voogedastus](./sse-streaming.md).

## Seotud

- [Klaviatuuri otseteed](./keyboard-shortcuts.md) – Kõik lõuendi ja redaktori otseteed
- [Agendi püsiv mälu](./agent-persistent-memory.md) – Mälugraafi käitumine ja API
- [Execute sõlm](../nodes/execute-node.md) – Kutsuvad alam-workflow'sid
- [Avaldise DSL](./expression-dsl.md) – Viited ja kinnitatud andmed
- [Workflow struktuur](./workflow-structure.md) – Sõlmede ja servade formaat
- [Allalaadimine ja importimine](./download-import.md) – Workflow'de eksportimine ja importimine JSON-ina
- [Sõlmede tüübid](./node-types.md) – Kõik sõlmede tüübid
- [Logide vahekaart](../tabs/logs-tab.md) – Docker konteineri logid
- [Käivituste ajalugu](./execution-history.md) – Varasemad käivitused
- [Mallid](../tabs/templates-tab.md) – Workflow'de ja sõlmede salvestamine ja taaskasutamine
- [Kontekstipõhine tutvustus](./contextual-showcase.md) – Kompaktne lehe juhend, mis on redaktoris saadaval
