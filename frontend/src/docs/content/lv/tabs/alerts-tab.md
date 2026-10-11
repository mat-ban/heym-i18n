# Brīdinājumu cilne

**Brīdinājumu** cilne ļauj Jums definēt sliekšņa nosacījumus laika logā un saņemt paziņojumus, kad tie tiek pārkāpti. Heym jau reģistrē izpildes rezultātus, izpildes ilgumu un LLM izdevumus, taču nekad to neizsaka brīvprātīgi. Brīdinājums ir veids, kā Jūs to lūdzat.

Katrs brīdinājums tiek novērtēts laika logā, ko Jūs izvēlaties, nekad nevis uz vienu notikumu. Viens neizdevies izpildījums ir troksnis. Divpadsmit neizdevušos izpildījumu desmit minūtēs ir incidents.

## Brīdinājumu veidi

| Veids | Jautājums, uz kuru tas atbild | No kurienes nāk skaitlis |
|---|---|---|
| **Kļūdas slieksnis** | Vai šis neizdevās vairāk nekā N reizes laika logā? | [Izpildes vēsture](../reference/execution-history.md) rindiņas ar kļūdas statusu |
| **Darba plūsmas ilgums** | Vai izpildes kļuva lēnākas nekā gaidīts laika logā? | Izpildes laiks, apkopots kā maksimālais, vidējais vai 95. percentils |
| **Token / USD izmaksas** | Vai izdevumi pārsniedza budžetu laika logā? | [LLM izpildes](./traces-tab.md) plus LLM izmaksu tabula |
| **Izpildījumu skaits** | Vai šis izpildījums notika daudz biežāk, nekā tam vajadzētu? | Izpildes vēstures rindiņu skaits |

### Kļūdas slieksnis

Saskaita neizdevušos izpildījumus laika logā un aktivizējas, kad skaitlis sasniedz Jūsu slieksni. Tā kā tas skaita laika logā, nevis pieslēdz katru kļūdu, viens pārejošs kļūda Jūs neizsistīs.

### Darba plūsmas ilgums

Mēra izpildes ilgumu laika logā. Izvēlieties **maksimālo** (lēnāko izpildījumu), **vidējo** vai **p95**. P95 skaitlis izmanto to pašu percentila aprēķinu kā [Analītikas cilne](./analytics-tab.md), tādējādi brīdinājums un latentuma diagramma nekad nesaskan par to pašu logu.

**Minimālais izpildījumu skaits laika logā** uztur šo godīgu. Lēnākais izpildījums gandrīz tukšā logā ir tikai tas viens izpildījums, tādēļ, nosakot minimālo, piemēram, 3, tiek apturēts brīdinājuma aktivizēšanās uz troksni.

### Token / USD izmaksas

Saskaita LLM izdevumus laika logā, vai nu kā kopējos tokenus, vai kā ASV dolārus. Dolāru summas tiek aprēķinātas, izmantojot to pašu cenu tabulu, ko izmanto [Izpildes cilne](./traces-tab.md) un [LLM izmaksu tabula](./datatable-tab.md#llm-cost-table-system-table), tādējādi izmaksu brīdinājums un izmaksu lapa vienmēr saskan.

Kad apjoms ir visi Jūsu darba plūsmas, tas ietver LLM izsaukumus, kas veikti ārpus darba plūsmas, piemēram, [Čata cilne](./chat-tab.md) un [AI asistents](../reference/ai-assistant.md). Kodu aģenta izmantošana (Codex, OpenCode) nav iekļauta.

Modeļi, kuriem nav cenu rindiņas, tiek ziņoti brīdinājuma kontekstā kā necenoti, nevis klusi skaitīti kā nulle.

### Izpildījumu skaits

Saskaita izpildījumus ar jebkuru statusu laika logā. Tas ir tas, kas noķer nepareizu aktivizēšanu: darba plūsma, kas parasti notiek 20 reizes stundā, pēkšņi notiek 2,000 reizes. Aktivizēšanas ieraksts ietver katra aktivizēšanas avota sadalījumu, jo tas parasti ir atbilde uz jautājumu "kāpēc tas notika".

## Apjoms

Brīdinājums uzrauga vai nu **vienu darba plūsmu**, vai **visas Jūsu darba plūsmas**.

"Visas Jūsu darba plūsmas" nozīmē katru darba plūsmu, kurai brīdinājuma īpašnieks var piekļūt. Tas apzināti nenozīmē katru darba plūsmu Heym instance: brīdinājumi var tikt kopīgoti, un brīdinājuma kopīgošana nedrīkst nodot kādam apkopotus skaitļus par darba plūsmām, kuras viņš nevar atvērt.

## Burvju rīks

Brīdinājuma izveide ietver piecus soļus.

1. **Veids** — izvēlieties vienu no četriem iepriekš minētajiem.
2. **Apjoms** — viena darba plūsma vai visas.
3. **Nosacījums** — laika logs, plus sliekšņa lauki attiecīgajam veidam.
4. **Atbilde** — kas notiek, kad tas aktivizējas, un cik bieži Jums jāziņo.
5. **Pārskats** — nosauciet to un apskatiet atpakaļtestu.

### Atpakaļtests

Pārskata solis atbild uz jautājumu, kas patiešām ir svarīgs pirms Jūs saglabājat: *pēdējās 24 stundās, cik bieži tas būtu aktivizējies?*

Tas ziņo par aktivizēšanas skaitu un augstāko novēroto vērtību pret Jūsu slieksni. Ja tas saka, ka nosacījums būtu aktivizējies 400 reizes, Jūs labojat slieksni pirms saglabāšanas, nevis pēc tam, kad esat saņēmis paziņojumu. Jūs varat paplašināt atpakaļskatu uz 3 vai 7 dienām.

## AI projektēšana

Pirmajā soļa augšpusē ir kaste, kurā Jūs aprakstāt, ko vēlaties, vienkāršā valodā:

> Brīdiniet mani, ja rēķinu sinhronizācija neizdodas vairāk nekā 5 reizes 10 minūtēs

Heym to pārvērš brīdinājuma definīcijā, aizpilda katru soli, ko tas var, un pāriet uz priekšu ar AI aizpildītajiem laukiem, kas atzīmēti, lai Jūs apstiprinātu, nevis pārrakstītu. Pilnīga pieprasījuma gadījumā Jūs nonākat pie Pārskata.

**Daļējs pieprasījums joprojām virzīs Jūs uz priekšu.** Sakiet tikai "brīdiniet mani, ja tas neizdodas 5 reizes", un Jūs saņemat kļūdas sliekšņa brīdinājumu ar aizpildītu skaitli, noklusējumiem pārējiem un burvju rīks atveras pirmajā solī, kas joprojām prasa Jūsu iejaukšanos: šajā gadījumā Apjoms, jo nav nosaukta darba plūsma. Piezīme augšpusē norāda, kas vēl jāizlemj. Tas nekad neapturēs Nākamo vai Izveidot.

Tas pats attiecas, kad modelis nosauc darba plūsmu, kurai Jūs nevarat piekļūt, vai atgriež nosacījumu ar trūkstošiem laukiem. Daļas, kas ir jēgpilnas, tiek saglabātas, pārējais atgriežas pie noklusējumiem attiecīgajam brīdinājuma veidam, un Jūs to pielāgojat no turienes. Nekas šeit neizvairās no validācijas: burvju rīka noteikumi un API abi atkārtoti pārbauda brīdinājumu, kad Jūs to saglabājat.
## Atkārtošanās uzvedība

Kad brīdinājums tiek aktivizēts, tas nonāk aktivizētā stāvoklī. Kas notiek tālāk, ir Jūsu izvēle 4. solī.

- **Paziņot vienu reizi, līdz tas atgūstas** (noklusējums) — aktivizējas vienu reizi, pēc tam klusē, kamēr nosacījums ir spēkā. Kad metrika atkal nokrīt zem sliekšņa, brīdinājums atgriežas pie OK un kļūst atkal piemērots aktivizēšanai. Atgūšana ir stāvokļa maiņa, nevis notikums: tā nerada aktivizēšanas ierakstu un neizpilda paziņošanas workflow.
- **Turpināt paziņot noteiktā intervālā** — aktivizējas atkārtoti ik pēc N minūtēm, kamēr nosacījums ir spēkā.

Noklusējums pastāv, jo salauzts workflow, kas tiek pārbaudīts ik pēc 60 sekundēm, citādi radītu 60 aktivizēšanas stundā, kas ir veids, kā brīdinājumi tiek nomākti.

## Workflow izpilde aktivizēšanas brīdī

4. solis piedāvā trīs atbildes uz jautājumu "kas jādara, kad tas tiek aktivizēts":

- **Izveidot un piešķirt jaunu workflow** (noklusējums) — saglabājot brīdinājumu, tiek izveidots arī workflow ar nosaukumu *"&lt;brīdinājuma nosaukums&gt; paziņojums"* un tas tiek saistīts. Tas ierodas ar ievades mezglu, kura lauki ir tieši tādi paši kā zemāk esošais payload, tāpēc `$alert.body.observed_value` un pārējie tiek atrisināti nekavējoties, un Jums tikai jāpiestiprina mezgls, kas piegādā ziņojumu. **Doties uz workflow** brīdinājuma kartē to atver. Tas ir noklusējums, jo brīdinājums, kas aktivizējas nekam, ir viegli palaist garām.
- **Izvēlēties esošu workflow** — izpildīt kaut ko, ko Jūs jau esat izveidojis.
- **Nekas nedarīt** — aktivizēšana joprojām tiek reģistrēta tabulā, tā vienkārši neizpilda neko.

Brīdinājuma payload ierodas kā šī workflow ievades ķermenis:

```json
{
  "alert_id": "...",
  "alert_name": "Rēķinu sinhronizācijas kļūmes",
  "alert_type": "error_threshold",
  "condition": "5+ kļūdas 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Rēķinu sinhronizācija", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Kurš workflow radīja skaitli

`workflows` ir vienīgā vieta, kur workflow parādās. Tas uzskaita katru workflow, kas veicināja rādījumu, katram ar savu `value` — šī workflow kļūdu skaits, izpildes skaits, lēnākā izpilde milisekundēs vai izdevumi, atkarībā no brīdinājuma veida. Saraksts ir sakārtots pēc `value`, visaugstāk pirmais, tāpēc `workflows[0]` ir sliktākais pārkāpējs.

Tas ir **vienmēr masīvs**: vienas vienības gadījumā zem viena workflow apjoma, daudzi zem "visi mani workflow", un tukšs, nevis null, kad nekas nav attiecināms. Paziņošanas workflow var to iterēt bez formas pārbaudes.

Apzināti nav vienota `workflow_id`. Tas aprakstīja brīdinājuma apjomu, nevis metriku, tāpēc tas bija `null` sistēmas apjomā, kas ir tieši tas gadījums, kad "kurš workflow?" ir vissvarīgākais. `observed_value` paliek agregāts, pret kuru tika salīdzināts slieksnis; katra workflow `value` lauki izskaidro, no kurienes tas nāca.

Tā ir veids, kā brīdinājumi sasniedz Slack, e-pastu, Telegram vai jebkur citur: ar [mezgliem](../reference/node-types.md), kurus Jūs jau esat izveidojis, nevis atsevišķu paziņošanas sistēmu.

Brīdinājums nevar paziņot workflow, kuru tas uzrauga. Tas būtu cikls, visredzamāk izpildes skaita brīdinājumam, kur katrs paziņojums pievieno skaitam, ko tas mēra.

Paziņošanas izpildes ir parastas izpildes, tāpēc tās parādās [izpildes vēsturē](../reference/execution-history.md) kā jebkura cita izpilde. Paziņošanas workflow, kas neizdodas, tiek reģistrēta aktivizēšanā, bet nekad neaptur aktivizēšanu no reģistrēšanas.

Paziņošanas workflow darbojas kā brīdinājuma īpašnieks, ar viņu akreditācijas datiem un globālajiem mainīgajiem, tieši tāpat kā ja viņi to būtu izpildījuši paši. Izvēloties workflow, ko kāds ir dalījies ar Jums, nenozīmē, ka tiek aizņemti šīs personas akreditācijas dati. Ja īpašnieks zaudē piekļuvi paziņošanas workflow, aktivizēšana joprojām tiek reģistrēta, bet paziņošanas izpilde tiek izlaista.

## Aktivizēšanas vēsture

Zem brīdinājumu saraksta ir aktivizēšanas vēsture: kas tika aktivizēts, kad, novērotais vērtība pret slieksni, precīzs logs, kas tika novērtēts, un paziņošanas iznākums.

Apstiprinot aktivizēšanu, tiek atzīmēta rinda un mainīts brīdinājuma emblēma no **Aktivizēts** uz **Apstiprināts**. Tas ir paziņojums par Jums, nevis par brīdinājumu: nosacījums joprojām ir spēkā, un brīdinājums atgriežas pie **OK** pats, kad metrika atkal nokrīt zem sliekšņa.

Katrs ieraksts glabā veicinošo detaļu brīdī, kad tas tika aktivizēts: neizdoto izpildes ID un kļūdu ziņojumus, katra modeļa izdevumus vai aktivizēšanas avota sadalījumu. Tas ir apzināti. Logs ir pagājis, un tā atkārtota aprēķināšana vēlāk var sniegt citu atbildi.

Aktivizēšanas ieraksti tiek glabāti 90 dienas.

## Jautājumi par brīdinājumiem čatā

[Čata cilne](./chat-tab.md) var atbildēt uz jautājumiem par Jūsu brīdinājumiem:

- "Kādi brīdinājumi man ir?"
- "Vai ir brīdinājums par rēķinu workflow?"
- "Kāpēc aktivizējās izmaksu brīdinājums?"
- "Kad tas pēdējo reizi tika aktivizēts?"

Uz jautājumu "kāpēc tas aktivizējās" Čats citē faktisko novēroto vērtību, slieksni un laika logu no aktivizēšanas ieraksta, kopā ar veicinošo detaļu.

## Dalīšanās

Brīdinājumus var dalīt ar individuāliem lietotājiem vai ar [komandām](./teams-tab.md). Cilvēki, ar kuriem Jūs dalāties, var redzēt brīdinājumu un tā aktivizēšanas vēsturi. Tikai īpašnieks var rediģēt, apturēt, dzēst vai atkārtoti dalīties ar to.
### Kad tiek noņemta piekļuve darba plūsmai

Brīdinājums par vienu darba plūsmu turpina lasīt šīs darba plūsmas izpildes metriku, tāpēc, noņemot kāda lietotāja piekļuvi darba plūsmai, tiek noteikts, kas notiek ar viņa brīdinājumiem:

- **Noņemot lietotāja vai komandas koplietošanu**, tiek jautāts darba plūsmas īpašniekam, vai arī jāpārtrauc šī lietotāja vai komandas brīdinājumi par darba plūsmu. Pārtraukšana ir noklusējuma opcija. Pārtrauktie brīdinājumi tiek apturēti, nevis dzēsti, un katrs no tiem tiek reģistrēts kā `alert.disable_on_access_revoke` auditācijas žurnālā [audit log](../reference/audit.md).
- **Noņemot komandas biedru vai dzēšot komandu**, vienmēr tiek pārtraukti attiecīgie brīdinājumi, jo persona, kas veic šo izmaiņu, nav obligāti darba plūsmas īpašnieks.
- Brīdinājums tiek pārtraukts tikai tad, ja tā īpašniekam nav citu ceļu uz darba plūsmu, piemēram, tiešas koplietošanas vai citas komandas.
- Atsākot vai pārbaudot apturētu brīdinājumu, tiek vēlreiz pārbaudīta īpašnieka piekļuve, tāpēc pārtraukts brīdinājums nevar tikt ieslēgts atpakaļ vai izmantots, lai lasītu darba plūsmas metriku bez piekļuves. Nospiežot **Atsākt** bez piekļuves, tiek parādīts paziņojums, kas skaidro, ka darba plūsmas īpašniekam vispirms jāveic atkārtota koplietošana.

## Brīdinājumu pārvaldība

- **Apturēt / Atsākt** — apturēts brīdinājums nekad netiek novērtēts. Atsākšana pārbauda to nekavējoties, nevis gaida nākamo intervālu.
- **Rediģēt** — izmaiņas tiek validētas kopumā, tāpēc daļēja rediģēšana nevar atstāt brīdinājumu nederīgā stāvoklī.
- **Dzēst** — noņem brīdinājumu un tā izsistēšanas vēsturi.

## Skatīt arī

- [Analytics Tab](./analytics-tab.md) — diagrammas, no kurām šie sliekšņi ir izveidoti
- [Traces Tab](./traces-tab.md) — no kurienes nāk LLM izmaksu skaitļi
- [Execution History](../reference/execution-history.md) — izpildes, kuras kļūdās, ilgums un skaits, ko mēra brīdinājumi
- [Chat Tab](./chat-tab.md) — brīdinājumu vaicāšana dabiskā valodā
- [Teams](./teams-tab.md) — brīdinājumu koplietošana ar komandu
