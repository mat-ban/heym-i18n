# Izteiksmes novērtēšanas dialogs

Izteiksmes novērtēšanas dialogs ir paplašinātais redaktors laukiem, kas atbalsta izteiksmes. Tas tiek atvērts no paplašināšanas pogas blakus izteiksmes ievades laukam un nodrošina lielāku darbvietu, automātisko pabeigšanu, tiešsaistes backend priekšskatījumu un izvades pārlūkošanu vienuviet.

## Dialoga atvēršana

- Noklikšķiniet uz paplašināšanas pogas blakus izteiksmes laukam rekvizītu panelī.
- Daudzrindu lauki rāda pogu ievades lauka iekšpusē.
- Vienrindas lauki rāda pogu pa labi no ievades lauka.

## Dialoga izkārtojums

- Dialogs tiek atvērts kā centrēts modālais logs ar izmēru aptuveni **80vw × 80vh**.
- Galvene rāda **Evaluate — {field name}**, ja lauka nosaukums ir zināms.
- Redaktors saglabā automātisko pabeigšanu, pārvietošanos starp laukiem un parastās **Apply** / **Cancel** darbības.
- Priekšskatījums tiek atjaunināts automātiski aptuveni **300 ms** pēc tam, kad pārtraucat rakstīt.
- Nospiediet `Ctrl` / `Cmd` + `Enter`, lai lietotu pašreizējo tekstu atpakaļ laukā un aizvērtu dialogu (tāpat kā **Apply**).

## Izvades sadaļa

Izvades apgabals tiek atjaunināts automātiski pēc tam, kad pārtraucat rakstīt redaktorā.

### Novērtēšana

| Izteiksmes veids | Rezultāts |
|---|---|
| Viens `$expr` (viss lauks) | Vietējā vērtība tiek saglabāta |
| Viens tukšs punktu ceļš (viss lauks, bez `$`, bez iegultas jaunas rindas) | Tāpat kā `$` + šis ceļš (backend normalizē novērtēšanai) |
| Teksts ar iegultiem `$refs` | Gala rezultāts vienmēr ir virkne |
| Literāls teksts (bez `$`, nav viens punktu ceļš) | Tiek atgriezts tāds, kāds ir |

**Piemēri**

| Ievade | Rezultāts |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (tāpat kā `$input.items`, ja visa vērtība ir šis ceļš) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Novērtēšanas konteksts tiek veidots šādā secībā:

- **Pinned data** iepriekšējos mezglos
- **Last run outputs** no kanvas
- `null`, ja iepriekšējie dati nav pieejami

Ja pašreizējam mezglam ir iepriekšējas atkarības, bet nevienai no tām nav pinned data vai nesenā izpildes rezultāta, dialogs vispirms veic testa izpildi, lai izveidotu kontekstu, un pēc tam novērtē pašreizējo tekstu.

### Izvades ceļa izvēlētājs

Kad backend rezultāts ir objekts vai masīvs, izvades apgabals var rādīt interaktīvu ceļa izvēlētāju neapstrādāta JSON vietā.

- Veiciet dubultklikšķi uz rindas, lai pievienotu šo ceļu pašreizējai `$node.path` atsaucei.
- Veiciet vienu klikšķi uz paplašināmām rindām, lai atvērtu vai aizvērtu zarus.
- Izmantojiet iebūvēto vaicājuma lodziņu, lai meklētu atslēgas, vērtības un ceļu virknes.

## Automātiskā pabeigšana

- Ierakstiet `$`, lai atvērtu ieteikumus iepriekšējiem mezgliem, iebūvētajām funkcijām un metodēm.
- Nospiediet `Tab` vai `Enter`, lai ievietotu atlasīto ieteikumu.
- Izmantojiet `↑` / `↓`, lai pārvietotos pa ieteikumu sarakstu.

### Piemēru atbildes

Kad turpināt `$…` atsauci ar punktu, katra ieteikuma rinda rāda atbildi, ko šis ieteikums radītu, treknrakstā rindas labajā pusē.

- Ierakstot `$set.listItems.first().toString().u`, tiek uzskaitīti `upper`, `urlEncode`, `urlDecode` un `unescape`, katrs ar tā novērtēto rezultātu — tāpēc varat izvēlēties pēc iznākuma, nevis pēc nosaukuma.
- Ierakstot `$node.text.toJson()`, tiek parsēta JSON virkne objektā vai masīvā. Pēc `.toJson()` automātiskā pabeigšana var piedāvāt parsētās atslēgas (piemēram, `repoUrl`), ja ir pieejama last-run vai pinned izvade.
- Rezultāti tiek novērtēti backend pusē pret tiem pašiem pinned data un last-run outputs, ko izmanto dialoga priekšskatījums, tāpēc tie atbilst tam, ko lauks radīs.
- Tiek novērtēti tikai tie ieteikumi, kas pastāv patstāvīgi: metodes bez argumentiem (`upper()`, `first()`, `keys()`, `toJson()`) un vienkāršas īpašības (`length`, `year`). Ieteikumi, kuriem vispirms nepieciešami argumenti — `map`, `filter`, `sort`, `replace` — tiek atstāti tukši.
- Rinda paliek tukša, ja kandidāts nerada atbildi: kļūda, `null` vai metode, kas neattiecas uz šo vērtību.
- Atbildes tiek saīsinātas līdz vienai rindai. Novietojiet kursoru uz saīsinātas atbildes, lai redzētu vairāk.

## Veidošana ar AI

Poga **Build with AI** parādās novērtēšanas dialoga augšējā labajā stūrī, kad ir ielādēts workflow. Tā atver iegultu modālo logu, kurā varat aprakstīt vēlamo izteiksmi vienkāršā tekstā un likt LLM to ģenerēt jūsu vietā.

### Kā tas darbojas

1. Noklikšķiniet uz **Build with AI** novērtēšanas dialoga rīkjoslā.
2. Izvēlieties LLM akreditācijas datus un modeli no nolaižamajām izvēlnēm.
3. Ierakstiet vienkārša teksta aprakstu par to, ko vēlaties — piemēram, *"Get the customer name from the API response"*.
4. Noklikšķiniet uz **Generate**. Modālais logs izsauc backend, kas izmanto [Expression DSL](./expression-dsl.md) sistēmas promptu kopā ar jūsu pēdējās workflow izpildes izvadēm kā kontekstu un atgriež vienu izteiksmes virkni.
5. Ģenerētā izteiksme tiek nekavējoties novērtēta pret tiem pašiem kanvas datiem, lai jūs varētu redzēt rezultātu pirms lietošanas.
6. Noklikšķiniet uz **Apply**, lai aizstātu redaktora saturu ar ģenerēto izteiksmi, vai uz **Regenerate**, lai mēģinātu vēlreiz.

### Izmantotais konteksts

Ģenerators saņem mezglu izvades no pēdējās testa izpildes kanvā. Ja workflow vēl nav palaists, LLM ģenerē pēc iespējas labāku izteiksmi, pamatojoties uz mezglu nosaukumiem un DSL konvencijām.

### Prasības

- LLM akreditācijas datiem (OpenAI, Google vai Custom) jābūt konfigurētiem cilnē [Credentials](./credentials.md).
- Workflow ir jābūt atvērtam redaktorā.

## Tastatūras saīsnes

| Saīsne | Darbība |
|---|---|
| Rakstīšanas pauze (~300 ms) | Atjaunināt backend priekšskatījumu |
| `Ctrl` / `Cmd` + `Enter` | Lietot un aizvērt dialogu |
| `Escape` | Vispirms aizvērt automātisko pabeigšanu, citādi aizvērt dialogu |
## Ligzdots `$` metodes argumentos

Dialog / backend novērtējumam varat nodot citu atsauci ar ligzdotu `$` tādos izsaukumos kā `.get($other.field)`, ja nepieciešama dinamiska atslēga. Varat arī izmantot tukšu ceļu `.get(...)` iekšienē (piemēram, `other.field`); backend to atrisina tāpat. Saglabātajiem workflow laukiem joprojām ir jāatbilst [Expression DSL](./expression-dsl.md) noteikumiem; evaluate API ērtības labad pieņem arī pilnas rindas tukšu punktu ceļu (skatiet tabulu iepriekš).

## Navigācija

Set and Execute mapping redaktori var rādīt pogas **Prev** / **Next**, lai varētu pārvietoties starp laukiem, neaizverot dialogu.

## Saistītie

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — nepieciešami Build with AI funkcijai
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
