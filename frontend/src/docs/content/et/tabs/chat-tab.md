# Chat-vahekaart

**Chat**-vahekaart pakub otsest LLM-i vestlusliidest. Kasutage seda mudelite testimiseks, küsimuste esitamiseks, olemasolevate workflow'de käivitamiseks või uue workflow loomiseks loomulikus keeles esitatud taotluse põhjal.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Vaadake Chat demo</a></p>

## Seadistamine

1. Valige [mandaat](./credentials-tab.md) (API-võti OpenAI, Google'i jne jaoks)
2. Valige rippmenüüst mudel (mudelid laaditakse valitud mandaadi põhjal)
3. Alustage sõnumite saatmiseks tippimist

Vestlust saab alustada ka [Workflows-vahekaardi](./workflows-tab.md) chat-kastist. See saadab Teie esimese sõnumi ja avab uue vestluse siin, kus vastus juba voogedastatakse.

## Funktsioonid

- **Globaalsete muutujate kontekst** – Teie [Globaalsed muutujad](../reference/global-variables.md) on LLM-ile kättesaadavad, nii et saate salvestatud väärtuste kohta küsida või neile viidata
- **Tööruumi mallide kontekst** – Teie tööruumis jagatud workflow'de ja sõlmede mallid lisatakse kontekstina, nii et Chat saab vastata küsimustele saadaolevate mallide kohta
- **Pikaajaline agent** – Chat jätkab taustal töötamist ka siis, kui brauser suletakse, nii et saate teisest seadmest naasta ja sama vestlust jätkata
- **Workflow loomine** – Paluge Chatil workflow luua või seadistada; see kasutab sama Workflow AI Builderi mootorit nagu redaktori assistent, et workflow genereerida ja salvestada
- **Kanban-ülesande loomine** – Paluge loomulikus keeles ülesannet lisada või kaarti luua. Chat lisab selle soovitud tahvli esimesse veergu; kui Teil on mitu tahvlit ega nimeta ühtegi, esitab Chat enne kaardi loomist tahvli valija
- **Järjekorda pandud järeltegevused** – Saatke vastuse voogedastamise ajal rohkem sõnumeid. Järjekorda pandud sõnumid säilitatakse, neid saab enne käivitumist muuta või kustutada ning need käivituvad aktiivse vastuse järel järjekorras
- **Planeerimise pausid** – Kui Chat vajab planeerimise üksikasju, esitab ta täpsustavaid küsimusi ja peatab järjekorda pandud järeltegevused, kuni Te vastate. Pärast planeerimisvastuse lõppemist jätkuvad järjekorras olevad sõnumid
- **Mandaadid** – Kui Chatil loodud või muudetud workflow vajab mandaati, küsib Chat, millist kasutada, pakub vestluses uue loomist või lubab ilma jätkata. Samuti saate paluda Chatil mandaat luua või muuta mandaati, mille omanik Te olete; see avab vestluses mandaadi vormi. Mudel näeb mandaadi nime ja tüüpi, mitte kunagi selle väärtusi, nii teile kuuluvate kui ka teiega jagatud mandaatide puhul. Chati lisatud LLM- ja Agent-sõlmed töötavad chati jaoks valitud mandaadi ja mudeliga, sealhulgas jagatud mandaatidega; kui Chat muudab workflow'd, säilitavad selle olemasolevad LLM- ja Agent-sõlmed oma mandaadi ja mudeli. Vt [AI Assistant › Mandaadid](../reference/ai-assistant.md#credentials)
- **Andmetabelid** – Kui Chatil loodud või muudetud workflow salvestab kirjeid, küsib Chat, millist [andmetabelit](./datatable-tab.md) kasutada, või pakub luua tabeli workflow'le vajalike veergudega. Samuti saab see loetleda Teie tabeleid ja nende veerge. See ei loe ega kirjuta kunagi ridu. Vt [AI Assistant › Andmetabelid](../reference/ai-assistant.md#data-tables)
- **Voogedastatavad vastused** – Näete mudeli väljundit selle voogedastamise ajal
- **Vastuse peatamine** – Katkestage praegune voogedastatav vastus igal ajal; peatamine tühjendab ka selle vestluse järjekorda pandud sõnumid
- **Markdowni renderdamine** – Vastused toetavad markdown-vormingut, sealhulgas reasisesed pildid
- **Piltide kuvamine** – Vastustesse manustatud pildid (nt LLM-i pildigeneratsioonist) kuvatakse reasiseselt; klõpsake mis tahes pildil, et seda täisekraanil vaadata. Täisekraanvaate sulgemiseks vajutage **Esc** või tagasi-nuppu (mobiilis)
- **Sõnumite kopeerimine** – Kopeerige mis tahes sõnum lõikelauale
- **Chati tühjendamine** – Alustage uut vestlust
- **Häälsisend** – Kasutage kõnetuvastuseks mikrofoninuppu (brauseri toega). Salvestuse peatamisel võib Heym transkriptsiooni enne saatmist kergelt puhastada
- **Ajakavaga workflow'd** – Küsige, millal cron-workflow'd käivituvad (täna, sel nädalal, sel kuul või kohandatud kuupäevavahemikus). Assistent kasutab samu ajakava andmeid nagu [Ajakavad-vahekaart](./scheduled-tab.md) ning saab piirata tulemused workflow'dele, mille omanik Te olete, või lisada need, mis on Teiega jagatud
- **Workflow'de käivituste ajalugu** – Küsige ühe workflow kohta ("mitu korda päevane aruanne käivitus?", "kas see ebaõnnestus?", "millal see viimati käivitus?"). Chat otsib workflow üles selle ID järgi ja vastab selle käivituste arvu, olekute jaotuse, esimese ja viimase käivituse aja ning keskmise kestuse põhjal. Küsige, miks käivitus ebaõnnestus või mida see tagastas, ja Chat avab seejärel selle üksiku käivituse, et lugeda selle sisendeid, väljundeid ja sõlmede kaupa vigu
- **Reaalajas käivituse olek** – Küsige, mis parasjagu töötab, ja Chat vastab arvu, workflow'de nimede, iga käivituse kestuse, selle hetkel oleva sõlme ja otselingiga reaalajas käivitusele
## Chat'i kasutamine MCP-kliendist

Chat'i mootorile saab ligi ka väljaspool brauserit. Lubage **Heym Chat Tool** [MCP vahekaardil](./mcp-tab.md) ja MCP-kliendid — Claude, Cursor ja kõik muud MCP-d toetavad rakendused — saavad ühe `heym_chat` tööriista, mis käivitab sama mootori kõigi oma võimalustega.

Need vestlused jõuavad selle vahekaardi ajalukku, tähistatuna vestluste loendis pistiku ikooniga. Avage üks, et lugeda, mida klient küsis, näha selle käivitatud tööriistakaarte ja jätkata lõime ise. Täpsustava küsimuse vastamine toimib samamoodi olenemata sellest, kas voor algas siin või MCP-kliendist.

MCP kaudu Chat ei loetle, vali ega loo mandaate. Workflow'd, mida see loob, jätavad mandaadi väljad tühjaks ning vastuses nimetatakse sõlmed, mis vajavad mandaati, et saaksite need redaktoris seadistada.

Andmetabelid töötavad samuti MCP kaudu: Chat loetleb teie tabelid, loob uusi ja ühendab need workflow'desse, mida see loob. Selle tabeliküsimus saabub tulemuses tekstina, seega vastake sellele sama `conversation_id`-ga.

## Konteksti limiit

Chat hoiab kontekstis kuni 25 viimast sõnumit. Vanemad sõnumid kärbitakse, et püsida mudeli limiitide piires.

## Workflow'de loomine

Kui palute Chat'il workflow'd luua, ehitada, genereerida või seadistada, loob see uue salvestatud workflow genereeritud nime ja kirjeldusega. Vastus sisaldab genereeritud sõlmede ja servade kirjutuskaitstud lõuendi eelvaadet ning **Open workflow** linki, mis avab workflow redaktori uuel brauseri vahekaardil. Kasutage eelvaate kaardi nuppu **Run**, kui soovite workflow'd käivitada.

Järeltagasiside samas chat'is muudab seda workflow'd, mitte ei loo uut. Näiteks pärast seda, kui Chat on workflow loonud, võite öelda "add an approval step", "change the output format" või "şöyle yap" ning Chat uuendab salvestatud workflow'd ja värskendab eelvaadet.

See sobib kõige paremini päringute jaoks, kus soovite, et töö tehtaks korduvkasutatava automatiseerimisena, mitte ainult ühekordse vastusena.

## Kanban-ülesannete loomine

Küsige Chat'ilt tavalises keeles, näiteks "Add a task called Fix login bug" või
"Create a new card Update documentation on the Launch board." Võite samasse päringusse lisada
kirjelduse. Chat loob kaardi alati valitud tahvli
esimesse veergu.

Kui teie tööruumis on mitu tahvlit ja te ei täpsusta ühtegi, peatub Chat
ühe valikuga tahvli valijaga. Valige tahvli, et kaardi loomine lõpetada. Ükski kaldkriipsukäsk
ega spetsiaalne sõnumivorming pole vajalik.

## Küsimine, mis parasjagu töötab

Küsige tavalises keeles — "what is running?", "how many workflows are active right now?",
"which node is the nightly report on?" — ja Chat annab ülevaate reaalajas:

- **Kui palju** käivitusi on pooleli, jaotatuna töötavateks ja inimülevaatust ootavateks
- **Millistesse workflow'desse** need kuuluvad, nime järgi
- **Kui kaua** iga käivitus on kestnud (näiteks `1m 35s`, `3h 25m`)
- **Milline sõlm** parasjagu käivitub, selle lõuendi sildi järgi, pluss viimane lõpetatud sõlm
- **Link** igale aktiivsele käivitusele, mis avab lõuendi selle käivituse taasesitusega

Käivitused, mis on peatatud [Human-in-the-Loop](../reference/human-in-the-loop.md) või Codex ülevaatuse jaoks, esitatakse teid ootavatena, mitte töötavatena. Need on samad andmed kui päises olev aktiivsete käivituste märk, seega Chat ja märk ei ole kunagi vastuolus. Juba lõpetatud käivituste kohta küsige hoopis viimaseid käivitusi — see loeb [Execution History](../reference/execution-history.md).

## Küsimused käituse kohta

Valige Workflow käitus [Execution History](../reference/execution-history.md#ask-ai) aknas toimetist või All History vaatest ja klõpsake dialoogi pealkirja kõrval **Küsi AI-lt**. Chat avab uue vestluse kahe kiibiga sõnumikasti kohal:

- **Workflow:** Workflow nimi
- **Execution:** valitud käituse ID esimesed märgid

Eemaldage kiip selle **×** nupuga selle väljajätmiseks. Seejärel esitage küsimus, näiteks „miks see käitus nii kaua aega võttis?“, „mis siin ebaõnnestus?“ või „kas saate selle parandada?“. Ülejäänud kiibid lisatakse sellele sõnumile täielike ID-dega, nii et Chat loeb otse käituse sisendeid, väljundeid ja sõlmede jälitust Workflow otsimise asemel. Workflow parandamiseks salvestab, testib ja kinnitab Chat muudatuse jaotises [Workflow'de loomine](#workflowde-loomine) kirjeldatud viisil.

Saadetud sõnum kuvab kiibid teie küsimuse all. Need kuuluvad ainult selle sõnumi juurde; sama vestluse järgmised küsimused säilitavad konteksti ajaloost.

## Küsimine teavituste kohta

Chat oskab vastata küsimustele teie määratud [teavituste](./alerts-tab.md) kohta:

- **Mis olemas on** — "what alerts do I have?", "is there an alert on the invoice workflow?",
  "which alerts are firing right now?"
- **Kuidas üks on seadistatud** — "what is the threshold on the cost alert?", "how is that configured?"
- **Miks ja millal see käivitus** — "why did the cost alert fire?", "when did this last trigger?"

Küsimuse "why did it fire" puhul loeb Chat käivitumise kirje ja tsiteerib tegelikku täheldatud
väärtust, lävendit ja täpset hinnatud akent, pluss kaasaitavat detaili:
ebaõnnestunud käivituste id-sid ja veateateid veateavituste puhul, mudelipõhist kulutust kuluteavituste puhul või
triggeri-allika jaotust käivituste arvu teavituste puhul. See esitab, mis oli tõsi teavituse
käivitumise hetkel, mitte ei arvuta akent uuesti, sest aken on möödunud ja värske arvutus
võib anda erineva vastuse.

## Kasutaja reeglid

[User Rules](../reference/user-settings.md) (seadistatud Settings'is) sisestatakse automaatselt igasse Chat'i vestlusesse süsteemitasemeliste juhistena. Seadistage need üks kord, et rakendada püsivaid eelistusi kõigile chat'i päringutele.
## Seotud

- [MCP vahekaart](./mcp-tab.md) – Avaldage see mootor MCP klientidele tööriistana `heym_chat`
- [Seaded](../reference/user-settings.md) – Määrake kasutajareeglid, mida rakendatakse kõikidele chat-päringutele
- [Mandaatide vahekaart](./credentials-tab.md) – Lisage ja haldake API võtmeid
- [Muutujate vahekaart](./global-variables-tab.md) – Globaalsed muutujad, mis on Chatis saadaval
- [Sõlmetüübid](../reference/node-types.md) – LLM ja Agent sõlmed workflow'de jaoks
- [Agent sõlm](../nodes/agent-node.md) – AI Agent tööriistade kutsumisega
- [AI assistent](../reference/ai-assistant.md) – Redaktori assistent, mis põhineb samal workflow builder DSL-il
- [Käivituste ajalugu](../reference/execution-history.md) – Vaadake varasemaid käivitusi (History nupp päises)
- [Ajakavade vahekaart](./scheduled-tab.md) – Tulevaste cron-käivituste kalender (samad andmed, mida Chat saab kokku võtta)
- [Teavituste vahekaart](./alerts-tab.md) – Lävenditeavitused, mida Chat saab loetleda ja selgitada
- [Kontekstipõhine tutvustus](../reference/contextual-showcase.md) – Kompaktne rakendusesisene orientatsioon selle lehe jaoks
- [Chati hääl (TTS ja STT)](../reference/chat-voice.md) – Lugege sõnumeid ette ja rääkige käed vabad ElevenLabsiga

## Tööriistade kutsed ja konteksti suurus

Iga kord, kui assistent kutsub tööriista (käivitab workflow, loetleb käivitusi, ehitab uue workflow), ilmub vestlusesse kokkupandav kaart. Kaart avaneb automaatselt tööriista töötamise ajal, näidates täpseid argumente. Kui tööriist lõpetab, kukub kaart üherealiseks kokkuvõtteks koos kulunud ajaga. Klõpsake mis tahes kaardil, et argumendid ja vastuse kokkuvõte uuesti avada.

Väike rõngakujuline märk sisestusvälja all näitab praegust konteksti kasutust protsendina mudeli aknast (nt `12% · ~9.2k`). Hõljutage kursorit märgi kohal, et näha jaotust: süsteemi prompt, AGENTS.md, workflow'de plokk, kasutajareeglid, ajalugu ja teie mustandi sisend. Kui kasutus ületab 80%, muutub rõngas merevaigukollaseks; 95% juures muutub see punaseks.

Kui kasutus läheneb piirile, tihendab Heym automaatselt vanemad sõnumid lühikokkuvõtteks, kasutades sama mehhanismi, mida kasutavad agent sõlmed. Reasiseselt ilmub kaart "Context compressed", mis näitab, mis juhtus.
