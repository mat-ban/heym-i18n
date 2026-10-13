# Seaded

Seadete dialoog võimaldab hallata profiili, määrata püsivaid AI-juhiseid, uuendada konto parooli, konfigureerida chat'i häält, määrata vaikimisi AI-mandaati ja -mudelit ning vaadata jälgitavuse olekut. Avage see, klõpsates päises paremas ülanurgas **oma avatari ja nime**.

## Dialoogi avamine

Klõpsake päises paremas ülanurgas **oma avatari ja nime**. Dialoog avaneb järgmiste vahekaartidega: **Profiil**, **Turvalisus**, **Hääl**, **AI vaikeväärtused** ja **Jälgitavus**. Instantsi administraatorid näevad ka vahekaarte **SSO**, **Heym Work** ja **Instances**.

## Vahekaart Profiil

### Profiilipilt

Heym kuvab teie konto e-posti jaoks teie [Gravatari](https://gravatar.com) pilti päises, teie sõnumite kõrval jaotises [Chat](../tabs/chat-tab.md) ja **Chat with Heym**, jaotise [Tahvel](../tabs/board-tab.md) kommentaarides ning teie nime kõrval jagamise dialoogides ja meeskonnaliikmete loendites. Muutmiseks uuendage pilti Gravatari keskkonnas; Heym võtab uue pildi kasutusele mõne tunni jooksul. Ilma Gravatari pildita kuvab Heym teie nime esimest tähte.

Pildi toob Heymi server ja vahemällu salvestatakse see seal, seega teie brauser ei võta Gravatari kunagi ühendust. Kui server ei saa Gravatariga ühendust, näevad kõik jätkuvalt initsiaale.

### Nimi

Teie kuvatav nimi, mida näidatakse kogu rakenduses. See väli on kohustuslik ja seda ei saa tühjaks jätta.

### Kasutaja reeglid

Kasutaja reeglid on kohandatud juhised, mis lisatakse automaatselt igasse AI-päringusse – nii workflow' koostajas kui ka armatuurlaua chat'is. **Workflow' koostajas** ([AI Assistant](./ai-assistant.md)) lisatakse need süsteemi promptile, mida kasutatakse workflow' JSON-i genereerimiseks. **Armatuurlaua chat'is** rakendatakse neid süsteemitasandi kontekstina. Kirjutate need üks kord ja need rakenduvad globaalselt, ilma et peaksite neid igas promptis kordama.

**Levinud kasutusjuhud:**

- Keel või toon: `Always respond in English. Keep responses concise.`
- Koodi stiil: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow' tavad: `Include error handling in all workflows. Use descriptive node labels.`
- Vastuse vorming: `Use bullet points. Avoid lengthy explanations.`

**Kus need rakenduvad:**

| Kontekst | Kirjeldus |
|---------|-------------|
| **Workflow' koostaja** | [AI Assistant](./ai-assistant.md) päringud workflow'de genereerimiseks või muutmiseks |
| **Armatuurlaua chat** | Kõik [Chat'i vahekaardi](../tabs/chat-tab.md) vestlused |

Kasutaja reeglid lisatakse süsteemitasandil – need käivituvad automaatselt enne iga prompti, ilma täiendava konfiguratsioonita iga workflow' või vestluse kohta.

### Profiili muudatuste salvestamine

Rakendamiseks klõpsake **Save Changes**. Muudatused jõustuvad kohe kõigi uute AI-päringute puhul.

## Vahekaart Turvalisus

### Parooli muutmine

Kasutage vahekaarti Turvalisus, et uuendada oma konto parooli.

**Nõuded:**

| Reegel | Nõue |
|------|-------------|
| Minimaalne pikkus | 8 tähemärki |
| Suurtäht | Vähemalt üks suurtäht (A–Z) |
| Väiketäht | Vähemalt üks väiketäht (a–z) |
| Number | Vähemalt üks number (0–9) |

Parool peab erinema ka teie praegusest paroolist. Neid reegleid rakendatakse nii esiliideses kui ka taustaprogrammis.

**Sammud:**

1. Sisestage oma **Current Password**
2. Sisestage oma **New Password** (peab vastama kõigile ülaltoodud nõuetele)
3. Sisestage uuesti väljale **Confirm New Password**
4. Klõpsake **Update Password**

Kui praegune parool on vale, kuvatakse reasisene veateade. Õnnestumise korral kuvatakse kinnitus ja vorm lähtestatakse automaatselt.

## Vahekaart Hääl

Vahekaart Hääl konfigureerib kõne [Chat'i vahekaardi](../tabs/chat-tab.md) jaoks: valige **ElevenLabs mandaat** (või lisage see reasiseselt), valige **Hääl** oma ElevenLabs kontolt ja klõpsake **Save Voice Settings**. See võimaldab sõnumipõhist ettelugemist ja interaktiivset häälerežiimi. Täieliku voo kohta vaadake [Chat Voice (TTS & STT)](./chat-voice.md).

## Vahekaart AI vaikeväärtused

Vahekaardil AI vaikeväärtused on kaks jaotist.

### Eelistatud mandaat ja mudel

Valige **eelistatud LLM-i mandaat** ja sellest **mudel**. Sellest saab iga AI-funktsiooni algne vaikeväärtus rakenduses – chat, [AI Assistant](./ai-assistant.md) (koostaja, analüsaator ja workflow' loomine), tahvli kaardistaja, AI armatuurlaua vidinad, [docs chat](../tabs/chat-tab.md), andmetabeli AI skeemi abiline, avaldise koostaja ja hindamised – alati, kui sellel pinnal pole oma salvestatud valikut.

Valikureegel, mida iga pind järgib, on:

1. **Salvestatud valik** – valik, mille olete sellel pinnal juba teinud (näiteks chat'i vestluse viimane mudel), võidab alati.
2. **Eelistatud** – kasutatakse siis, kui salvestatud valikut pole.
3. **Esimene saadaolev mandaat** – varulahendus, kui te pole eelistust määranud.

Saate ikkagi igal ajal mandaati ja mudelit pinnapõhiselt muuta; eelistus täidab ainult algse vaikeväärtuse. Jätke mandaat valikuks **No preference**, et säilitada varasem esimese mandaadi käitumine. Kui teie eelistatud mandaat hiljem kustutatakse või jagamine lõpetatakse, kuvab vahekaart teate ja pinnad lähevad vaikselt tagasi esimese saadaoleva mandaadi juurde.
### Koodipaketi kasutamine

Iga **Codex** mandaadi (sealhulgas jagatud mandaatide) puhul kuvatakse vahekaardil järelejäänud rate-limiti kasutus horisontaalse ribana iga aktiivse akna kohta — näiteks **5 tunni** aken ja/või **Iganädalane** aken, sõltuvalt teie plaanist. Iga riba näitab järelejäänud kvoodi protsenti ja lähtestamise loendurit. Nupp **Värskenda** laeb andmed nõudmisel uuesti (tulemused on serveris lühiajaliselt vahemällu salvestatud).

Iga **OpenCode** mandaadi puhul kuvatakse vahekaardil OpenCode Go tellimuse aknaid — **5 tundi**, **Iganädalane** ja **Igakuine** — sama stiiliga ribadena, mis loetakse gateway autenditud kasutus-endpoint'ist selle mandaadi API võtmega. Aken, mis on oma ülempiiri saavutanud, kuvatakse merevaigukollasena kui **"limit reached"**. Kui võti on kehtetu või tööruumil puudub Go tellimus, näitab kaart ribade asemel põhjust.

## Vaadeldavuse vahekaart

Vaadeldavuse vahekaart näitab selle instantsi jaoks [OpenTelemetry Tracing](./opentelemetry.md) kirjutuskaitstud olekut: kas jälgimine on lubatud, OTLP endpoint, teenuse nimi, sampler ratio ja milliseid span'e väljastatakse. Jälgimine konfigureeritakse backendi `HEYM_OTEL_*` keskkonnamuutujate kaudu, seega see vahekaart ei muuda midagi. Kui jälgimine on keelatud, loetleb vahekaart keskkonnamuutujad, mis on vajalikud selle sisselülitamiseks. Saladusi, nagu OTLP auth päised, ei näidata siin kunagi. Täieliku konfiguratsiooni viite leiate jaotisest [Keskkonnamuutujad](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

## SSO vahekaart

Nähtav ainult instantsi administraatoritele — kontod, mis on loetletud jaotises `HEYM_ADMIN_EMAILS`. See vahekaart ühendab Heymi välise OpenID Connect pakkujaga, et inimesed saaksid sisse logida kontodega, mis neil juba on. Sisestage issuer URL ja kliendi mandaadid, kopeerige kirjutuskaitstud redirect URI oma pakkujasse ja käivitage **Testi ühendust** enne selle lubamist. Parooliga sisselogimise saab siit välja lülitada, kui test on läbitud. Täieliku seadistuse leiate jaotisest [Ühekordne sisselogimine](./sso.md).

## Heym Worki vahekaart

Instantsi administraatorid ühendavad siin ärimeeskondade liidese [Heym Work](./heym-work.md): selle aadressi, ühekordselt kuvatava integratsioonivõtme ja lüliti **Enable Heym Work**. Vahekaart näitab ka seda, millal Heym Work viimati ühendust võttis, selle versiooni ja litsentsi olekut. Vaata [Heym Worki ühendamine](./heym-work.md#connecting-heym-work).

## Instantside vahekaart

Nähtav ainult instantsi administraatoritele — kontod, mis on loetletud jaotises `HEYM_ADMIN_EMAILS`. See vahekaart loetleb Heymi instantsid, mis on selle andmebaasiga ühendatud, ja määrab, kuidas taustaprotsesside käivitused nende vahel jaotatakse. Iga rida näitab instantsi muudetavat nime, selle rolli, kas see on aktiivne, mõõdetud latentsust andmebaasi suhtes, sisse/välja lülitit ja selle kaalu. Kaalud on nende instantside osakaalud, mis saavad praegu tööd vastu võtta, mitte protsendid 100-st: kui `41 / 26 / 33` ja kolmas instants on välja lülitatud, saavad kaks esimest tegelikult 61% ja 39%. Paneel trükib selle tegeliku jaotuse tabeli alla ja keeldub salvestamast ainult siis, kui ühelgi lubatud instantsil pole üldse kaalu.

**Anna uutele instantsidele osakaal automaatselt** on vaikimisi sisse lülitatud: liituv instants oleks muidu kaaluga 0 ja ei saaks midagi, seega leader annab sellele ühe korra võrdse osakaalu ja skaleerib olemasolevad kaalud alla, säilitades nende suhted. See ei puuduta kunagi instantsi, mille kaalu olete ise määranud.

Paneel teatab ka, kui palju viimase 24 tunni käivitustest sai toimuda ainult põhi-instantsil. Kui see osakaal on suur, ei saa selle all olevad kaalud seda tööd liigutada. Vaadake jaotisest [Koormuse jaotamine](./cluster.md), mis jääb põhi-instantsile ja kuidas numbreid valida.

## Mis ei ole selles dialoogis

| Funktsioon | Kust seda leida |
|---------|-----------------|
| **API võtme haldamine (MCP)** | [MCP vahekaart](../tabs/mcp-tab.md) – vaadake, kopeerige ja genereerige uuesti oma MCP serveri API võti |
| **Teema (tume / hele)** | Päikese/Kuu lülitusnupp päises (kasutaja märgi kõrval) |
| **E-posti muutmine** | Praegu ei toetata |

## Seotud

- [AI assistent](./ai-assistant.md) – Workflow ehitaja chat, mis kasutab kasutaja reegleid
- [Chat vahekaart](../tabs/chat-tab.md) – Töölaua chat, mis kasutab kasutaja reegleid
- [Chat hääl (TTS & STT)](./chat-voice.md) – ElevenLabs hääl, mis on konfigureeritud Voice vahekaardil
- [MCP vahekaart](../tabs/mcp-tab.md) – MCP serveri API võti ja workflow tööriistade eksponeerimine
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – API võtmed AI sõlmede ja integratsioonide jaoks
- [Turvalisus](./security.md) – Sessioonihaldus, rate limiting, mandaatide krüpteerimine
- [Ühekordne sisselogimine](./sso.md) – Ühendage väline OpenID Connect pakkuja
- [OpenTelemetry Tracing](./opentelemetry.md) – Hajutatud jälgimine workflow'de ja sõlmede käivituste jaoks
