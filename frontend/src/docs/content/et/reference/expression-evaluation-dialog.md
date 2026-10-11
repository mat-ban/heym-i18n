# Avaldise hindamise dialoog

Avaldise hindamise dialoog on avaldisevõimeliste väljade laiendatud redaktor. See avaneb avaldise sisestusvälja kõrval asuvast laiendusnupust ning pakub ühes kohas suuremat tööruumi, automaattäitmist, reaalajas taustapreview'd ja väljundi sirvimist.

## Dialoogi avamine

- Klõpsake atribuutide paneelis avaldise välja kõrval asuvat laiendusnuppu.
- Mitmerealised väljad kuvavad nuppu sisestusvälja sees.
- Üherealised väljad kuvavad nuppu sisestusväljast paremal.

## Dialoogi paigutus

- Dialoog avaneb tsentreeritud modaalina suurusega ligikaudu **80vw × 80vh**.
- Päis kuvab **Evaluate — {välja nimi}**, kui välja silt on teada.
- Redaktor säilitab automaattäitmise, väljalt-väljale navigeerimise ja tavapärased **Apply** / **Cancel** toimingud.
- Preview värskendub automaatselt umbes **300 ms** pärast trükkimise lõpetamist.
- Vajutage `Ctrl` / `Cmd` + `Enter`, et rakendada praegune tekst tagasi väljale ja sulgeda dialoog (sama mis **Apply**).

## Väljundi jaotis

Väljundi ala värskendub automaatselt pärast seda, kui olete redaktoris trükkimise pausile pannud.

### Hindamine

| Avaldise tüüp | Tulemus |
|---|---|
| Üksik `$expr` (kogu väli) | Natiivne väärtus säilitatakse |
| Üksik paljas punktteega (kogu väli, ilma `$`, ilma manustatud reavahetuseta) | Sama mis `$` + see teega (taustaprotsess normaliseerib hindamiseks) |
| Tekst manustatud `$refs`-idega | Lõpptulemus on alati string |
| Literaalne tekst (ilma `$`, ei ole üksik punktteega) | Tagastatakse muutmata kujul |

**Näited**

| Sisend | Tulemus |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (sama mis `$input.items`, kui kogu väärtus on see teega) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Hindamiskontekst luuakse järgmises järjekorras:

- **Kinnitatud andmed** ülesvoolu sõlmedel
- **Viimase käivituse väljundid** lõuendilt
- `null`, kui ülesvoolu andmed puuduvad

Kui praegusel sõlmel on ülesvoolu sõltuvused, kuid ühelgi neist pole kinnitatud andmeid ega hiljutist käivitustulemust, teostab dialoog esmalt testkäivituse konteksti loomiseks ja hindab seejärel praegust teksti.

### Väljundi tee valija

Kui taustaprotsessi tulemus on objekt või massiiv, võib väljundi ala kuvada interaktiivse tee valija toores JSON-i asemel.

- Topeltklõpsake real, et lisada see tee praegusele `$node.path` viitele.
- Üksikklõps laiendatavatel ridadel avab või sulgeb harud.
- Kasutage sisseehitatud päringukasti võtmete, väärtuste ja teestringide otsimiseks.

## Automaattäitmine

- Tippige `$`, et avada soovitused ülesvoolu sõlmede, sisseehitatud funktsioonide ja meetodite jaoks.
- Vajutage `Tab` või `Enter`, et sisestada valitud soovitus.
- Kasutage `↑` / `↓`, et liikuda soovituste loendis.

### Näidisvastused

Kui jätkate `$…` viidet punktiga, kuvab iga soovitusrida vastuse, mille see soovitus annaks, paksus kirjas rea paremal küljel.

- Tippides `$set.listItems.first().toString().u` loetletakse `upper`, `urlEncode`, `urlDecode` ja `unescape`, igaüks koos oma hinnatud tulemusega — nii saate valida tulemuse, mitte nime järgi.
- Tippides `$node.text.toJson()` parsitakse JSON-string objektiks või massiiviks. Pärast `.toJson()` võib automaattäitmine pakkuda parsitud võtmeid (näiteks `repoUrl`), kui viimase käivituse või kinnitatud väljund on saadaval.
- Tulemused hinnatakse taustaprotsessis samade kinnitatud andmete ja viimase käivituse väljundite vastu, mida dialoogi preview kasutab, seega need vastavad sellele, mida väli toodab.
- Hinnatakse ainult soovitusi, mis seisavad iseseisvalt: nullargumendilised meetodid (`upper()`, `first()`, `keys()`, `toJson()`) ja tavalised atribuudid (`length`, `year`). Soovitused, mis vajavad esmalt argumente — `map`, `filter`, `sort`, `replace` — jäetakse tühjaks.
- Rida jääb tühjaks, kui kandidaat ei anna vastust: viga, `null` või meetod, mis ei rakendu sellele väärtusele.
- Vastused lühendatakse ühele reale. Hõljuge lühendatud vastuse kohal, et näha sellest rohkem.

## Loomine AI-ga

Nupp **Build with AI** kuvatakse hindamise dialoogi paremas ülanurgas, kui workflow on laaditud. See avab pesastatud modaali, kus saate kirjeldada soovitud avaldist lihttekstina ja lasta LLM-il selle teie eest genereerida.

### Kuidas see töötab

1. Klõpsake hindamise dialoogi tööriistaribal **Build with AI**.
2. Valige rippmenüüdest LLM-i mandaat ja mudel.
3. Tippige lihttekstiline kirjeldus sellest, mida soovite — näiteks *"Get the customer name from the API response"*.
4. Klõpsake **Generate**. Modaal kutsub taustaprotsessi, mis kasutab [Expression DSL](./expression-dsl.md) süsteemiprompt'i ja teie viimase workflow käivituse väljundeid kontekstina, ning tagastab üksiku avaldise stringi.
5. Genereeritud avaldist hinnatakse kohe samade lõuendi andmete vastu, et näeksite tulemust enne rakendamist.
6. Klõpsake **Apply**, et asendada redaktori sisu genereeritud avaldisega, või **Regenerate**, et uuesti proovida.

### Kasutatav kontekst

Generaator saab sõlmede väljundid lõuendi viimasest testkäivitusest. Kui workflow'd pole veel käivitatud, genereerib LLM parima võimaliku avaldise sõlmede siltide ja DSL-i konventsioonide põhjal.

### Nõuded

- LLM-i mandaat (OpenAI, Google või Custom) peab olema konfigureeritud vahekaardil [Credentials](./credentials.md).
- Workflow peab olema redaktoris avatud.

## Kiirklahvid

| Kiirklahv | Toiming |
|---|---|
| Trükkimise paus (~300 ms) | Värskenda taustaprotsessi preview'd |
| `Ctrl` / `Cmd` + `Enter` | Rakenda ja sulge dialoog |
| `Escape` | Sulge esmalt automaattäitmine, vastasel juhul sulge dialoog |
## Pesastatud `$` meetodi argumentides

Dialoogi / backend-hindamise jaoks saate edastada teise viite, mille sees on pesastatud `$`, sellistes väljakutsetes nagu `.get($other.field)`, kui vajate dünaamilist võtit. Võite kasutada ka paljast teed `.get(...)` sees (näiteks `other.field`); backend lahendab selle samal viisil. Salvestatud workflow'de väljad peaksid siiski järgima [Expression DSL](./expression-dsl.md) reegleid; evaluate API aktsepteerib mugavuse huvides ka täisrea paljast punktteed (vt tabelit ülalpool).

## Navigeerimine

Set and Execute mapping redaktorid võivad kuvada nuppe **Prev** / **Next**, et saaksite liikuda väljade vahel ilma dialoogi sulgemata.

## Seotud

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — nõutav Build with AI funktsiooni jaoks
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
