# Izpildes Tab

**Izpildes** tabā tiek rādītas LLM izpildes izsekošanas. Pārbaudiet pieprasījumu/atbilžu payloads, laiku, rīku izsaukumus un veiciet atkļūdošanu [Aģenta](../nodes/agent-node.md) un [LLM](../reference/node-types.md) mezglu uzvedībā, kā arī apkopojiet metriku (izsaukumi, tokeni, izmaksas, latentums, kļūdu līmenis) jebkurā laika logā.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Skatīt Izpildes demonstrāciju</a></p>

## Statistika

Lapa tiek atvērta ar statistikas kopsavilkumu virs izpildes saraksta, kas aprēķināts izvēlētajā laika periodā un citu aktīvo filtru ietvaros:

- **KPI kartes** – Kopējie izsaukumi, kopējie tokeni, kopējās izmaksas (USD), vidējais latentums, kļūdu %
- **Tokeni pēc modeļa** – Donut diagramma par tokenu apjomu katram modelim
- **Izmaksas pēc modeļa** – Donut diagramma par USD izdevumiem katram modelim. Modeļiem bez cenu rādījumiem tiek rādīts saite "Konfigurēt cenas" uz [LLM izmaksu tabulu](./datatable-tab.md#llm-cost-table-system-table)
- **Izsaukumi laika gaitā** – Sakrauta laukuma diagramma par veiksmīgiem un neveiksmīgiem izsaukumiem katrā grupā (5 min / 1 stunda / 6 stundas / 1 diena, automātiski izvēlēta pēc diapazona)
- **Nepieejamo modeļu paziņojums** – Parādās zem diagrammām, kad daži izsekotie modeļi nav ar cenu rindu, saistot ar LLM izmaksu tabulu

## Laika Diapazons

Vienkāršs **Laika diapazona** izvēlētājs filtru joslas augšpusē kontrolē gan statistikas virsrakstu, gan izpildes sarakstu. Izvēles: Pēdējā 1 stunda, Pēdējās 24 stundas, Pēdējās 7 dienas (noklusējums), Pēdējās 30 dienas, Visi laiki. Diapazona maiņa atiestatīs lapošanas iestatījumus un atkārtoti ielādēs diagrammas un sarakstu kopā.

## Izpildes Saraksts

- Lapojošs saraksts ar nesenajām izpildēm izvēlētajā laika diapazonā
- Katrs izpildes ieraksts rāda: workflow, mezgls, akreditācijas dati, laika zīmogs, ilgums
- Noklikšķiniet uz izpildes, lai atvērtu detalizētu skatu
- Izmantojiet **Iepriekšējais / Nākamais** iekšējā detalizētā dialogā, lai pārvietotos starp izpildēm, to neaizverot

## Filtrēšana

- **Laika diapazons** – 1h / 24h / 7d / 30d / Visi; filtrē diagrammas un sarakstu kopā
- **Akreditācijas dati** – Filtrēt pēc izmantotajiem akreditācijas datiem (API atslēga)
- **Avots** – Filtrēt pēc workflow vai izpildes avota
- **Meklēšana** – Meklēt pēc modeļa, workflow, akreditācijas datiem vai mezgla etiķetes
- **Atjaunot** – Atkārtoti ielādēt pašreizējo izpildes lapu

## Izpildes Detaļas

Kad Jūs atverat izpildi:

- **Soli** – Laika līnija no augšas uz leju, kas lasa izpildi kā secīgu ķēdi: Sistēma → Lietotājs → Palīgs → Rīks → Atbilde. Katrs solis ir sarokojams; paplašinot vienu, tiek rādīta lasāma detaļa (ziņojuma teksts vai rīka argumenti un rezultāts), kam seko šī soļa JSON. JSON saturs katra notikuma veidā — tostarp MCP izsaukumi un JSON-RPC payloads — pēc noklusējuma tiek atvērts paplašināmā kokā, ar pirmo līmeni paplašinātu. Izmantojiet **Koks / Neapstrādāts**, lai pārslēgtos starp formatēto struktūru un oriģinālo tekstu. Nepareizs JSON paliek redzams kā parasts teksts. Rīku soļi rāda to ilgumu un MCP/Prasmju uzlīmi, ja tas ir piemērojams, kā arī gaidīšanas / laika izbeigšanas / atcelšanas uzlīmes, kad rīka izsaukuma statuss ir iestatīts. Atbildes solis var rādīt apkopotus `tool_metrics` uzlīmes (izsaukumu skaits pēc statusa un kopējais rīka ilgums). Kad izpilde reģistrē katru modeļa izsaukumu, kā to dara Dashboard Chat ziņojums un maršrutēts aģents, **LLM** solis atrodas pirms rīkiem, kas tiek izsaukti, un **Ilguma sadalījums** izklāsta katru modeļa izsaukumu, rīku un maršrutēšanas lēmumu vienā laika līnijā. Dashboard Chat ziņojums ir viena izpilde, neatkarīgi no tā, cik daudz rīku apļu tas prasīja. Izpildes bez ziņojuma ķēdes (piemēram, attēlu ģenerēšana) rāda minimālu Pieprasījums → Atbilde laika līniju.
- **Pieprasījums** – Pilns pieprasījuma payloads, kas nosūtīts uz LLM, ar **Koks / Neapstrādāts** JSON skatiem
- **Atbilde** – Modeļa atbilde, tostarp rīku izsaukumi, ja tādi ir, ar **Koks / Neapstrādāts** JSON skatiem
- **Rīku metrikas** – Kad tās ir klāt atbildē, kompakts rīku izsaukumu skaita kopsavilkums (`success` / `error` / `pending` / `timeout` / `cancelled`) un kopējais rīka ilgums
- **Laika sadalījums** – `llm_ms`, `tools_ms`, `mcp_list_ms` veiktspējas analīzei
- **Rīku izsaukumi** – Rīka nosaukums, argumenti, rezultāts, statuss un pagājušais laiks
- **Iekļautās prasmes** – Prasmes, kas nosūtītas modelim pieprasījumā
- **Doties uz Workflow** – Pāriet tieši uz saistīto workflow no izpildes detaļu dialoga

## Kopēšana un Eksportēšana

- Kopējiet pieprasījuma vai atbildes JSON uz starpliku; kopēšana vienmēr izmanto pilnu neapstrādāto payload, neatkarīgi no aktīvā skata
- Izmantojiet atkļūdošanai vai dalīšanai ar atbalstu

## Apkope

- **Notīrīt visu** – Dzēst visus saglabātos izpildes ierakstus pēc apstiprinājuma
- Lapošanas kontroles rāda pašreizējo redzamo diapazonu (piemēram, `1-25 no 240`)

## Saistītie

- [Kāpēc Heym](../getting-started/why-heym.md) – LLM novērojamība visā aģenta dzīves ciklā
- [Aģenta mezgls](../nodes/agent-node.md) – Aģenta mezgls ar rīku izsaukumiem
- [Mezglu veidi](../reference/node-types.md) – LLM un Aģenta mezgli
- [Akreditācijas datu tabula](./credentials-tab.md) – Akreditācijas dati, kas izmantoti izpildēs
- [OpenTelemetry izsekošana](../reference/opentelemetry.md) – Opt-in OTel eksports workflow, mezgla un Aģenta rīku izsaukumiem
- [Datu tabulas tabula](./datatable-tab.md) – Satur LLM izmaksu tabulu, ko izmanto izmaksu diagrammā
- [Kontekstualizēta demonstrācija](../reference/contextual-showcase.md) – Kompakta lapas rokasgrāmata informācijas paneļa virsmām
