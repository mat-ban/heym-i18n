# Workflow'de korraldamine

Heym võimaldab workflow'sid kaustadesse korraldada, luua alamkaustu ja ajastada workflow'sid kustutamiseks. UI ülevaate leiate jaotisest [Workflows Tab](../tabs/workflows-tab.md).

## Kaustad ja alamkaustad

Kaustad moodustavad puu. Igal kaustal on:

- **Name** – Kuvatav nimi
- **Parent** – `parent_id` viitab teisele kaustale; `null` tähendab juurkausta
- **Workflows** – Workflow'sid saab kaustadesse teisaldada `folder_id` kaudu

### API

| Endpoint | Otstarve |
|----------|---------|
| `GET /folders` | Ainult juurkaustad |
| `GET /folders/tree` | Täielik puu (alamkaustad + workflow'd) |
| `GET /folders/{id}` | Üksik kaust koos sisuga |
| `POST /folders` | Kausta loomine (`parent_id` valikuline) |
| `PUT /folders/{id}` | Nime või `parent_id` uuendamine |
| `DELETE /folders/{id}` | Kausta kustutamine (kaskaadne) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Workflow teisaldamine kausta |
| `DELETE /folders/workflows/{workflow_id}/folder` | Workflow eemaldamine kaustast |
| `GET /folders/{id}/export` | Kausta + kõigi alamkaustade allalaadimine ZIP-failina |

### Puu struktuur

Puu vastus sisaldab iga kausta kohta `children` ja `workflows`. Jagatud workflow'd võivad kaustas ilmuda `WorkflowShare.folder_id` kaudu.

## Workflow'de jagamine

Workflow redaktoris avage **Share**, et kutsuda kasutajaid e-posti teel või jagada [team'iga](./teams.md). Igal kutsel ja igal team'i jagamisel on õigus:

| Õigus | Mida koostöötegija saab teha |
|------------|------------------------------|
| **Read** | Workflow avada, seda uurida, käivituste ajalugu vaadata ja seda käivitada. Redaktor avaneb ainult lugemise režiimis: Salvesta on keelatud ja lõuendit ei saa muuta. |
| **Write** | Kõik, mida Read lubab, pluss lõuendi, seadete, analüüsidokumendi ja agendi mälu muutmine. |

Õigus kuvatakse Share dialoogis iga kirje kõrval ja seda saab igal ajal samast rippmenüüst muuta, ilma jagamist eemaldamata ja uuesti lisamata. Kui kasutaja jõuab workflow'ni mitme tee kaudu (otsene jagamine ja üks või mitu team'i), võidab **kõrgeim** õigus. Jagamised, mis eksisteerisid enne õiguste kasutuselevõttu, on **Write**, ja API kliendid, mis jätavad `permission` välja, saavad samuti **Write**.

Ainult omanikule kuuluvad toimingud ei sõltu kunagi õigusest: workflow kustutamine, versioonide tagasipööramine või tühjendamine, ajaloo tühjendamine, jagamiste haldamine ja allpool kirjeldatud [ainult omanikule kuuluvad seaded](#owner-only-settings) jäävad omanikule ka **Write** koostöötegijate puhul. **Read** koostöötegija, kes saadab muudatuse API kaudu (`PUT /api/workflows/{id}`, analüüsi märge, agendi mälu, vahemälu tühjendamine) või AI Assistanti kaudu, saab `403` vastusega `You have read-only access to this workflow`.

Workflow jagamine annab juurdepääsu lõuendile, käivituste ajaloole ja analüüsidokumendile. See **ei** jaga automaatselt:

- **Mandaate**, millele workflow's olevad sõlmed viitavad
- **Alam-workflow'sid**, mida kutsuvad [Execute](../nodes/execute-node.md) sõlmed või agendid

Saajad vajavad neid mandaate ja alam-workflow'sid eraldi jagatuna (samadele kasutajatele või team'idele). Mandaate saab jagada [Credentials tab](../tabs/credentials-tab.md) kaudu; vt [Credentials Sharing](./credentials-sharing.md). Iga alam-workflow'd saab jagada selle enda redaktori jagamisdialoogist.

### Ainult omanikule kuuluvad seaded

Kogu **Run with cURL** konfiguratsioon jääb pärast jagamist omanikule. Koostöötegijad saavad dialoogi siiski avada ja genereeritud käsu kopeerida, kuid juhtnupud on ainult lugemiseks.

Nende muutmine mitteomanikuna lükatakse tagasi `403`-ga:

- **Authentication** (`auth_type`) ja **Header Key** (`auth_header_key`)
- **Request Body** režiim (`webhook_body_mode`) ja **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) ja **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) käitub erinevalt: see on koostöötegijate eest täielikult peidetud ja koostöötegija kirjutamine eiratakse, mitte ei lükata tagasi. Redaktor kuvab välja maskeerituna, seega `403` seal rikuks tavalise salvestamise, mitte ei annaks märku ründest.

Autentimine on põhjus, miks see plokk on ainult omanikule: `Anonymous` lubab autentimata kutsujatel workflow'd käivitada ja käivitus ilma sisselogitud kutsujata lahendab mandaadid ja globaalsed muutujad **omanikuna**, mitte kutsujana. Ülejäänud plokk on avaldatud päringu leping ja omaniku kulukontrollid, seega liigub see koos sellega.

**On error, run workflow** (`error_workflow_id`) workflow-tasemel **Properties** paneelis on ainult omanikule samal põhjusel: [error workflow](./features.md#error-workflow) käivitub ebaõnnestunud käivituse mandaatide ja globaalsete muutujatega, mis on triggerdatud ja anonüümsete käivituste puhul omaniku omad. Koostöötegijad näevad seadet ainult lugemiseks ja selle lisamine, asendamine või tühjendamine mitteomanikuna lükatakse tagasi `403`-ga.

Lõuendi, nime ja kirjelduse muutmine ei ole mõjutatud.

### Käivituse tokenid

Koostöötegija saab vermida käivituse tokeni workflow'le, mis on temaga jagatud. Käivitus omistatakse **sellele, kes tokeni vermis**, seega see kasutab selle kasutaja mandaate ja globaalseid muutujaid, mitte omaniku omi. Ainult tõeliselt anonüümne kutse — `auth_type: anonymous` ilma kutsujata — käivitub omaniku kontekstis.

## Kustutamiseks ajastatud

Workflow'sid saab kohese eemaldamise asemel ajastada kustutamiseks.

- **Field**: `scheduled_for_deletion` (nullable datetime)
- **Behavior**: Kui see on seatud, liigub workflow asukohta `folder_id = null` ja ilmub jaotises "Scheduled for Deletion".
### API

| Endpoint | Eesmärk |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Määrab `scheduled_for_deletion`, tühjendab `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Tühjendab `scheduled_for_deletion` (taastamine) |

### UI

- **Lohistage prügikasti** – Kukutage workflow'd "Kustutamiseks ajastatud" alale, et need ajastada
- **Taasta** – Eemaldage ajakavast
- **Kustuta kohe** – Prügikasti ikoon jäädavaks eemaldamiseks

### Koristusloogika

Cron-töö käivitub iga päev kell **23:59** (konfigureeritud ajavööndis). Workflow kustutatakse ainult siis, kui:

- **Kõik algussõlmed** (sõlmed, millel puuduvad sissetulevad servad, välja arvatud sticky/errorHandler) on `active === false`

Kui mõni algussõlm on endiselt aktiivne, jääb workflow alles kuni järgmise käivituseni.

## Töölaua UI

- **Kaustade read** – Uus kaust, rekursiivne kaustapuu koos laiendamise/ahendamisega. Iga kaust kannab
  oma nime all valikulist kirjeldust ja märki, mis loendab selles sisalduvaid workflow'sid, kaasa
  arvatud alamkaustad.
- **Kausta toimingud** – Uus alamkaust, Nimeta ümber, Muuda ikooni, Laadi alla ZIP-failina ja Kustuta asuvad reasiseselt
  igal kaustareal; paremklõpsu kontekstimenüü pakub sama komplekti ning telefonides kuvatakse üks
  menüünupp.
- **Põhiala** – Juurkausta workflow'd (ilma kaustata, mitte ajastatud) ja Kustutamiseks ajastatud
- **Kausta kukutamise eelvaade** – Workflow' lohistamine tõstab esile täpse kausta või alamkausta ja
  kuvab selle täieliku tee kaardisuuruses eelvaates. Ahendatud kaust laieneb pärast lühikest hõljumist.
- **Stabiilne lohistamise tagasiside** – Allikakaart kasutab lohistamise kummitust ning aktiivne kukutamise sihtmärk jääb
  valituks kerimise või sama kausta sees olevate juhtelementide ületamise ajal.
- **Sihtkoha kontroll** – Praegune kaust kuvatakse kui **Juba kaustas** ega võta vastu
  üleliigset teisaldamist.
- **Muud kukutamisalad** – Juurkaust ja "Kustutamiseks ajastatud" tõstetakse esile, kui need saavad
  lohistatavat workflow'd vastu võtta.
- **ZIP-faili kukutamine** – Kukutage ZIP-fail workflow' alale, et importida kaustastruktuur juurtasemel

## Seotud

- [Workflows vahekaart](../tabs/workflows-tab.md) – Looge ja haldake workflow'sid
- [Mandaatide jagamine](./credentials-sharing.md) – Jagage mandaate workflow' koostööpartneritega
- [Tiimid](./teams.md) – Jagage workflow'sid ja mandaate tiimidega
- [Põhikontseptsioonid](../getting-started/core-concepts.md) – Workflow'd, sõlmed ja käivitamine
- [Workflow struktuur](./workflow-structure.md) – Workflow'de JSON-vorming
- [Triggerid](./triggers.md) – Algussõlmed ja sisendpunktid
