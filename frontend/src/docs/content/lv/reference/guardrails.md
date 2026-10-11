# Guardrails

Guardrails ļauj bloķēt nedrošus vai nevēlamus lietotāja ziņojumus, pirms tie nonāk [LLM](../nodes/llm-node.md) vai [Agent](../nodes/agent-node.md) mezglā. Kad ziņojums atbilst bloķētajai kategorijai, mezgls izpildes vietā izmet kļūdu, ko varat uztvert ar [Error Handler](../nodes/error-handler-node.md) mezglu.

## Guardrails iespējošana

Atveriet **LLM** vai **AI Agent** mezgla Properties paneli un ritiniet līdz pārslēgam **Enable Guardrails** (vairoga ikona). Atzīmējot izvēles rūtiņu, tiek atklāta konfigurācijas sadaļa.

## Guardrail akreditācijas dati un modelis

Kad guardrails ir iespējoti, Jums **jāizvēlas** **akreditācijas dati un modelis** satura drošībai. Guardrail pārbaude izmanto mezglā izvēlētos akreditācijas datus un modeli — bez rezerves variantiem, bez vides mainīgajiem. Izmantojiet OpenAI vai Google akreditācijas datus uzticamai satura filtrēšanai, jo īpaši, ja Jūsu galvenais modelis izmanto pielāgotu nodrošinātāju (piem., Zhipu, GLM), kas var neatbalstīt guardrails vai atgriezt API kļūdas (piem., 404).

Workflow nevar palaist, kamēr nav izvēlēti gan Guardrail Credential, gan Guardrail Model.

## Bloķētās kategorijas

Izvēlieties vienu vai vairākas kategorijas, ko bloķēt. Ziņojums, kas atbilst jebkurai atzīmētajai kategorijai, tiek noraidīts.

| Kategorija | Ko tā bloķē |
|---|---|
| **Violence** | Vardarbīgs, draudošs vai fiziski kaitīgs saturs |
| **Hate Speech** | Diskriminācija, rasisms vai aizspriedumi |
| **Sexual Content** | Atklāts seksuāls saturs vai scenāriji |
| **NSFW / Profanity** | Rupja valoda, lamuvārdi, atklāti apvainojumi un pieaugušo slengs jebkurā valodā |
| **Self-Harm** | Pašnāvība, paškaitējums vai ar to saistīts saturs |
| **Harassment** | Personiski uzbrukumi, apvainojumi, iebiedēšana vai draudi |
| **Illegal Activity** | Norādījumi nelikumīgu darbību veikšanai |
| **Political Extremism** | Ekstrēmistisks politisks saturs vai vardarbīga propaganda |
| **Spam / Phishing** | Spams, pikšķerēšana vai sociālā inženierija |
| **Personal Data Request** | Privātas vai personu identificējošas informācijas pieprasīšana |
| **Prompt Injection** | Mēģinājumi ignorēt sistēmas instrukcijas, ievadīt ļaunprātīgus promptus vai manipulēt ar modeļa uzvedību |

## Jutīgums

Iestatījums **Sensitivity** kontrolē, cik stingri tiek noteikti pārkāpumi:

| Līmenis | Uzvedība |
|---|---|
| **Low** | Atzīmē pat robežgadījumus vai neskaidrus gadījumus |
| **Medium** *(noklusējums)* | Atzīmē skaidrus pārkāpumus; ignorē robežgadījumus |
| **High** | Atzīmē tikai ekstrēmus, viennozīmīgus pārkāpumus |

## Kā darbojas noteikšana

Noteikšana izmanto **izvēlētos guardrail akreditācijas datus un modeli**:

- **OpenAI akreditācijas dati** — izmanto [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (bezmaksas, ātri, bez token patēriņa) piecām kategorijām, ko tā atbalsta natively (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Pārējās kategorijas tiek pārbaudītas ar LLM klasifikācijas izsaukumu, izmantojot izvēlēto guardrail modeli.
- **Google / pielāgoti akreditācijas dati** — visas kategorijas tiek pārbaudītas ar LLM klasifikācijas izsaukumu, izmantojot izvēlētos guardrail akreditācijas datus un modeli.

Kad Jūsu galvenais modelis izmanto pielāgotu nodrošinātāju (piem., Zhipu, Cerebras), kas var atgriezt 404 vai citas API kļūdas, izvēlieties **OpenAI vai Google akreditācijas datus** guardrails vajadzībām.

## Kļūdas formāts

Kad guardrail tiek iedarbināts, mezgls izmet kļūdu ar ziņojumu:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Mezgla rezultāta `output` arī ietver `guardrail_violated_categories` (pārkāpto kategoriju apzīmējumu masīvs), lai Debug Panel un Execution History varētu skaidri parādīt "Blocked by: X, Y".

Izmantojiet mezgla opciju **Continue on error** (vai [Error Handler](../nodes/error-handler-node.md)), lai novirzītu workflow uz rezerves zaru, kad guardrails tiek iedarbināti.

## Workflow piemērs

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Piezīmes

- **Bez atkārtojumiem**: Guardrail pārkāpumi ir apzināti bloķējumi un nekad netiek atkārtoti, pat ja mezglam ir iespējota opcija "Retry on failure".
- Nav nepieciešama datubāzes migrācija — guardrail iestatījumi tiek glabāti workflow mezgla JSON kopā ar citiem mezgla datiem.
- Guardrails pārbauda atrisināto **lietotāja ziņojumu** (pēc veidnes izteiksmju izvērtēšanas), nevis neapstrādāto veidni.
- Iestatot **nevienu kategoriju**, kamēr guardrails ir iespējoti, tas ir līdzvērtīgi to atspējošanai — pārbaude netiek veikta.
- Pie **Low** jutīguma LLM klasifikācija vienmēr tiek palaista (labākais daudzvalodu pārklājums). OpenAI akreditācijas dati papildus palaiž Moderation API.
- Pie **Medium/High** jutīguma OpenAI akreditācijas dati izmanto Moderation API natively atbalstītajām kategorijām un LLM klasifikāciju pārējām. Google/pielāgoti akreditācijas dati vienmēr izmanto LLM klasifikāciju.
- LLM klasifikācija ir **neatkarīga no valodas** — tā nosaka pārkāpumus turku, arābu, krievu, spāņu un citās valodās.
