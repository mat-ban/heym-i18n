# Datu tabula

**Datu tabulas** cilne ļauj Jums izveidot un pārvaldīt strukturētas datu tabulas tieši platformā Heym. Tabulas var izmantot darbplūsmās, izmantojot [Datu tabulas mezglu](../nodes/datatable-node.md) programmatiskām CRUD operācijām.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Skatīt Datu tabulas demonstrāciju</a></p>

## Tabulas izveide

1. Pārejiet uz Datu tabulas cilni no informācijas paneļa
2. Noklikšķiniet uz **Izveidot Datu tabulu**
3. Ievadiet nosaukumu un opciju aprakstu
4. Pievienojiet kolonnas, izmantojot kolonnas redaktoru

## Kolonnas

Katram kolonai ir:

| Īpašība | Apraksts |
|----------|-------------|
| Nosaukums | Kolonnas attēlošanas nosaukums |
| Tips | `string`, `number`, `boolean`, `date` vai `json` |
| Nepieciešams | Vai jaunajām rindām jāiekļauj šī kolonna |
| Unikāls | Vai vērtībām jābūt unikālām visās rindās |
| Noklusējuma vērtība | Automātiski aizpildīta, kad rinda izslēdz šo kolonnu |

Pievienojiet, rediģējiet vai noņemiet kolonnas no tabulas detaļu skata galvenes.

## Kolonnu ģenerēšana ar AI

Vietā, lai pievienotu kolonnas manuāli, Jūs varat aprakstīt tabulu vienkāršā valodā (vai ielīmēt parauga JSON) un ļaut LLM ieteikt shēmu. Abi piekļuves punkti atver to pašu dialogu:

- **Ģenerēt ar AI** (Datu tabulas saraksta galvene) — izveido jaunu tabulu no Jūsu apraksta.
- **AI kolonnas** (tabulas detaļu skats, blakus kolonnas kontrolei) — ierosina *jaunas* kolonnas, ko pievienot atvērtajai tabulai.

### Kā tas darbojas

1. Izvēlieties **LLM akreditācijas datus** un **modeli** (noklusējuma iestatījumi ir Jūsu pirmais LLM akreditācijas dati un tā jaunākais modelis).
2. Ievadiet aprakstu — piemēram, *"Grāmatu tabula ar nosaukumu, autoru, lapu skaitu un vai esmu to lasījis"* — vai ielīmējiet JSON paraugu/shēmu.
3. Noklikšķiniet uz **Ģenerēt**. Modelis atgriež ieteikto shēmu.
4. Pārskatiet ģenerētās kolonnas rediģējamā formā: mainiet **nosaukumu**, **tipu**, **noklusējumu**, **unikālo** un **notEmpty** (nepieciešams) katrai, dzēsiet nevēlamās kolonnas vai **Pievienot kolonnu** manuāli. Ja izveidojat jaunu tabulu, Jūs varat arī rediģēt AI ieteikto **nosaukumu** un **aprakstu**.
5. Noklikšķiniet uz **Izveidot tabulu** (jaunai tabulai) vai **Pievienot kolonnas** (esošai tabulai), lai saglabātu. Nospiediet **Esc**, lai jebkurā laikā aizvērtu dialogu.

### Tikai pievienošanai esošām tabulām

Ģenerējot kolonnas esošai tabulai, modelis redz Jūsu pašreizējās kolonnas kā kontekstu un ierosina **tikai jaunas** kolonnas. Esošās kolonnas un to dati nekad netiek modificēti vai dzēsti — ģenerētās kolonnas tiek pievienotas. Dublikātu nosaukumi (neatkarīgi no lielajiem burtiem) tiek automātiski izslēgti.

> LLM akreditācijas dati (OpenAI, Google vai pielāgoti) ir nepieciešami. Ja Jums nav, vispirms pievienojiet tos Iestatījumos.

## Rindu pārvaldība

- **Pievienot rindu**: Noklikšķiniet uz pievienošanas pogas, lai izveidotu jaunu rindu
- **Inline rediģēšana**: Divreiz noklikšķiniet uz jebkuras šūnas, lai rediģētu tās vērtību. Nospiediet Enter vai noklikšķiniet prom, lai saglabātu, Escape, lai atceltu
- **Dzēst rindu**: Izmantojiet rindu darbību izvēlni, lai noņemtu rindu
- **Lappušu navigācija**: Rindas tiek rādītas 25 uz lapu ar lapu navigāciju

## CSV importēšana/eksportēšana

### Importēt
1. Noklikšķiniet uz **Importēt CSV** tabulas detaļu skatā
2. Izvēlieties CSV failu augšupielādei
3. Pārskatiet pirmās 5 rindas un kolonnas kartēšanu
4. Zaļās kolonnas ir saskaņotas ar esošajām tabulas kolonnām; dzeltenās ir nesaskaņotas
5. Noklikšķiniet uz Importēt, lai masveidā ievietotu rindas

### Eksportēt
Noklikšķiniet uz **Eksportēt CSV**, lai lejupielādētu visas rindas kā CSV failu.

## Koplietošana

Koplietojiet tabulas ar citiem lietotājiem vai komandām:

1. Atveriet koplietošanas dialogu no tabulas detaļu skata
2. Pievienojiet lietotājus pa e-pastu ar **lasīšanas** vai **rakstīšanas** atļaujām
3. Pievienojiet komandas ar **lasīšanas** vai **rakstīšanas** atļaujām
4. Tikai lasīšanas lietotāji var skatīt datus; lietotāji ar rakstīšanas piekļuvi var modificēt rindas un kolonnas. Tabulas pārdēvēšana, tās apraksta mainīšana un koplietojumu pārvaldība paliek tikai īpašnieka ziņā.

## Tabulu izveide no AI asistenta

Audekla [AI asistents](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) un rīks `heym_chat` [MCP cilnē](./mcp-tab.md) var izvēlēties kādu no jūsu tabulām darbplūsmai, ko tie veido, vai izveidot jaunu. Tie piedāvā nosaukumu un kolonnas un izveido tabulu, kad iesniedzat jautājumu kartīti. Audekla asistents konfigurē darbplūsmas mezglus no tabulas metadatiem. Chat un `heym_chat` var arī pārbaudīt rindas, pievienot vai noņemt kolonnas un tieši ievietot, atjaunināt vai dzēst rindas. Norādiet tabulas nosaukumu vai šīs cilnes saiti. Rakstīšanai nepieciešamas īpašumtiesības vai tieša/komandas **rakstīšanas** piekļuve. Kolonnu pievienošana saglabā esošos datus; kolonnu noņemšana dzēš to vērtības no katras rindas. Kolonnu noņemšana un visu rindu notīrīšana prasa apstiprinājumu, tāpat kā šajā cilnē.

## Izmantošana darbplūsmās

[Datu tabulas mezgls](../nodes/datatable-node.md) savieno tabulas ar darbplūsmām. Operācijas ietver find, getAll, getById, insert, update, remove un upsert. Akreditācijas dati nav nepieciešami.

## LLM izmaksu tabula (sistēmas tabula)

Piespraustā **Sistēmas tabulu** sadaļa parādās virs Jūsu izveidotajām tabulām ar vienu ierakstu: **LLM izmaksu tabula**. Tā ir fiksēta shēma, katram lietotājam rediģējama skata par modeļa cenu, ko izmanto [Izpildes](./traces-tab.md) izmaksu diagrammās.

### No kurienes nāk dati

Heym uztur globālu tabulu par modeļa cenām, kas iegūta no Helicone publiskā cenu gala punkta (`https://www.helicone.ai/api/llm-costs`). Sinhronizācija notiek fona režīmā, kad pirmo reizi atverat tabulu vai Izpildes, un tā ir ierobežota līdz vienai pieprasījuma reizei 24 stundu laikā. Nospiediet **Atsvaidzināt**, lai piespiedu kārtā veiktu tūlītēju atkārtotu sinhronizāciju. Helicone no augšupielādes saraksta izņemto ierakstu netiek dzēsti lokāli, tāpēc vēsturiskie izmaksu meklējumi paliek stabilitātes.

### Shēma (lasāmās kolonnas)

| Kolonna | Nozīme |
|---|---|
| Piegādātājs | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informatīvs, ko izmanto Helicone) |
| Modelis | Modeļa identifikators, kas saskaņots ar `trace.model` |
| Operācija | Saskaņošanas operators: `equals`, `startsWith` vai `includes` |
| Ievade $/1M | USD par 1 miljonu pieprasījuma tokenu |
| Izvade $/1M | USD par 1 miljonu pabeigšanas tokenu |
| Avots | `helicone`, `seed` vai `user` |
### Cenu pielāgošana

- **Rediģējiet rindu**, lai pārrakstītu tās cenas. Jūsu pārrakstījums ir katram lietotājam individuāls un tiek atzīmēts ar `Customized` insigniju; nākotnes Helicone sinhronizācijas to ignorē.
- **Atjaunot uz noklusējumu** noņem pārrakstījumu un atjauno globālo vērtību šai rindai.
- **Pievienot pielāgotu modeli** atver dialoglodziņu, lai izveidotu tikai lietotājam pieejamu rindu (piemēram, privātu precīzi pielāgotu modeli, ko Helicone neuzskaita). Pielāgotās rindas tiek atzīmētas ar `User added`, un to dzēšana pilnībā tās noņem.

### Atbilstība pret izpildēm

Kad Izpildes paneļa aprēķina izmaksas, tas salīdzina katru `trace.model` ar:

1. Jūsu pārrakstījumiem (precīza atbilstība modeļa nosaukumam) vispirms
2. Pretējā gadījumā ar globālo tabulu — `equals` precīza atbilstība ir prioritāra pār `startsWith`/`includes`; saistības tajā pašā operatorā tiek atrisinātas, ņemot vērā garāko atbilstošo modeļa prefiksu/daļu

Ja neviena rinda neatbilst, modelis tiek uzskaitīts zem **Neapmaksātajiem modeļiem** paziņojuma Izpildes lapā; tā izmaksu ieguldījums ir nulle, līdz Jūs pievienojat pielāgotu rindu vai pārrakstāt kādu no tām.

## Saistītie

- [DataTable Node](../nodes/datatable-node.md) - Workflow mezgla atsauce
- [Traces Tab](./traces-tab.md) - Izmanto LLM izmaksu tabulu izmaksu donuta un KPI kartēm
- [Grist Node](../nodes/grist-node.md) - Ārējā izklājlapu alternatīva
- [Variables Tab](./global-variables-tab.md) - Atslēgas-vērtības glabāšanas alternatīva