# Čata cilne

**Čata** cilne nodrošina tiešu LLM čata saskarni. Izmantojiet to, lai testētu modeļus, uzdotu jautājumus, izpildītu esošos workflows vai izveidotu jaunu workflow no dabiskās valodas pieprasījuma.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Skatīt čata demonstrāciju</a></p>

## Iestatīšana

1. Izvēlieties [akreditācijas datus](./credentials-tab.md) (API atslēga OpenAI, Google utt.)
2. Izvēlieties modeli no nolaižamā saraksta (modeļi tiek ielādēti no izvēlētajiem akreditācijas datiem)
3. Sāciet rakstīt, lai nosūtītu ziņojumus

Jūs varat arī uzsākt sarunu no čata lodziņa [Workflows cilnē](./workflows-tab.md). Tas nosūta Jūsu pirmo ziņojumu un atver jaunu sarunu šeit ar atbildi, kas jau tiek straumēta.

## Iespējas

- **Globālo mainīgo konteksts** – Jūsu [Globālie mainīgie](../reference/global-variables.md) ir pieejami LLM, tādēļ Jūs varat uzdot jautājumus par vai atsaukties uz saglabātajām vērtībām
- **Darba telpas veidņu konteksts** – Koplietotie workflow un mezglu veidnes Jūsu darba telpā ir iekļautas kā konteksts, tādēļ Čats var atbildēt uz jautājumiem par pieejamajām veidnēm
- **Ilgstošs aģents** – Čats turpina strādāt fonā, pat ja pārlūkprogramma tiek aizvērta, tādēļ Jūs varat atgriezties no citas ierīces un turpināt to pašu sarunu
- **Workflow izveide** – Lūdziet Čatam izveidot vai iestatīt workflow, un tas izmanto to pašu Workflow AI Builder dzinēju kā redaktora palīgu, lai ģenerētu un saglabātu workflow
- **Kanban uzdevumu izveide** – Dabiski lūdziet pievienot uzdevumu vai izveidot karti. Čats pievieno to pieprasītā dēļa pirmajā kolonnā; ja Jums ir vairāki dēļi un neesat nosaucis vienu, Čats piedāvā dēļa izvēli pirms kartes izveides
- **Rindā esošie sekojošie ziņojumi** – Nosūtiet vairāk ziņojumu, kamēr atbilde tiek straumēta. Rindā esošie ziņojumi tiek saglabāti, var tikt rediģēti vai dzēsti pirms to uzsākšanas, un tiek izpildīti secībā pēc aktīvās atbildes
- **Plānošanas pauzes** – Kad Čatam ir nepieciešami plānošanas detalizējumi, tas uzdod precizējošus jautājumus un pauzē rindā esošos sekojošos ziņojumus, līdz Jūs atbildat. Pēc plānošanas atbildes pabeigšanas rindā esošie ziņojumi atsākas
- **Akreditācijas dati** – Kad workflow, ko Čats izveido vai rediģē, prasa akreditācijas datus, Čats jautā, kuru izmantot, piedāvā izveidot jaunu sarunu laikā vai ļauj Jums turpināt bez tā. Jūs varat arī lūgt Čatu izveidot akreditācijas datus vai atjaunināt Jums piederošos; tas atver akreditācijas datu veidlapu sarunā. Modelis redz akreditācijas datu nosaukumu un veidu, nekad to vērtības. Skatiet [AI Palīgs › Akreditācijas dati](../reference/ai-assistant.md#credentials)
- **Datu tabulas** – Kad workflow, ko Čats izveido vai rediģē, glabā ierakstus, Čats jautā, kuru [datu tabulu](./datatable-tab.md) izmantot vai piedāvā izveidot jaunu ar kolonnām, kuras workflow nepieciešams. Tas var arī uzskaitīt Jūsu tabulas un to kolonnas. Tas nekad nelasa vai neraksta rindas. Skatiet [AI Palīgs › Datu tabulas](../reference/ai-assistant.md#data-tables)
- **Straumējošas atbildes** – Redziet modeļa izvadi, kamēr tā tiek straumēta
- **Pārtraukt atbildi** – Pārtrauciet pašreizējo straumējošo atbildi jebkurā laikā; pārtraukšana arī notīra rindā esošos ziņojumus šai sarunai
- **Markdown attēlošana** – Atbildes atbalsta markdown formatējumu, tostarp iekļautas attēlus
- **Attēlu attēlošana** – Atbildēs iekļautie attēli (piemēram, no LLM attēlu ģenerēšanas) parādās iekšēji; noklikšķiniet uz jebkura attēla, lai to skatītu pilnekrāna režīmā. Nospiediet **Esc** vai atpakaļ pogu (mobilajā) lai aizvērtu pilnekrāna skatu
- **Kopēt ziņojumus** – Kopējiet jebkuru ziņojumu starpliktuvē
- **Notīrīt čatu** – Sāciet jaunu sarunu
- **Balss ievade** – Izmantojiet mikrofonu, lai pārvērstu runu tekstā (pārlūkprogrammas atbalstīts). Kad ierakstīšana apstājas, Heym var viegli notīrīt transkriptu pirms Jūs to nosūtāt
- **Ieplānotie workflows** – Jautājiet, kad cron workflows tiek izpildīti (šodien, šonedēļ, šomēnes vai pielāgotā datu diapazonā). Palīgs izmanto tos pašus grafika datus kā [Ieplānotie](./scheduled-tab.md) cilne un var ierobežot rezultātus uz workflows, kas pieder Jums, vai iekļaut tos, kas kopīgoti ar Jums
- **Workflow izpildes vēsture** – Jautājiet par vienu workflow ("cik reizes tika izpildīts ikdienas ziņojums?", "vai tas neizdevās?", "kad tas pēdējo reizi tika izpildīts?"). Čats meklē workflow pēc tā ID un atbild no tā izpildes skaita, statusa sadalījuma, pirmās un pēdējās izpildes laika un vidējā ilguma. Jautājiet, kāpēc izpilde neizdevās vai ko tā atgrieza, un Čats tad atver šo vienīgo izpildi, lai izlasītu tās ievades, izvades un kļūdas pa mezgliem
- **Tiešraides izpildes statuss** – Jautājiet, kas šobrīd tiek izpildīts, un Čats atbild ar skaitu, workflow nosaukumiem, cik ilgi katra izpilde ir notikusi, kurā mezglā tā atrodas, un saiti tieši uz tiešo izpildi
## Izmantojot Chat no MCP klienta

Chat dzinējs ir pieejams arī ārpus pārlūkprogrammas. Iespējojiet **Heym Chat Tool** [MCP cilnē](./mcp-tab.md), un MCP klienti — Claude, Cursor un jebkas cits, kas runā MCP — saņem vienu `heym_chat` rīku, kas darbojas ar šo pašu dzinēju un visām tā iespējām.

Šīs sarunas tiek saglabātas šīs cilnes vēsturē, atzīmētas ar kontaktligzdas ikonu sarunu sarakstā. Atveriet vienu, lai izlasītu, ko klients jautāja, redzētu rīku kartes, kuras tas aktivizēja, un turpinātu pavedienu pats. Atbildot uz precizējošu jautājumu, tas darbojas tāpat, vai nu pagrieziens sākās šeit, vai no MCP klienta.

Pār MCP Chat neuzskaita, neizvēlas, neizveido akreditācijas datus. Workflows, ko tas veido, atstāj akreditācijas lauku tukšus, un atbilde nosauc mezglus, kuriem nepieciešama akreditācija, lai Jūs varētu tos iestatīt redaktorā.

Datu tabulas darbojas arī pār MCP: Chat uzskaita Jūsu tabulas, izveido jaunas un savieno tās ar veidotajiem workflows. Tā tabulas jautājums ierodas kā teksts rezultātā, tādēļ atbildiet uz to ar to pašu `conversation_id`.

## Konteksta ierobežojums

Chat saglabā līdz 25 nesenajām ziņām kontekstā. Vecākas ziņas tiek izgrieztas, lai paliktu modeļa ierobežojumos.

## Workflows izveide

Kad Jūs lūdzat Chat izveidot, būvēt, ģenerēt vai konfigurēt workflow, tas izveido jaunu saglabātu workflow ar ģenerētu nosaukumu un aprakstu. Atbilde ietver lasāmā formātā kanvas priekšskatījumu par ģenerētajiem mezgliem un malām, kā arī **Atvērt workflow** saiti, kas atver workflow redaktoru jaunā pārlūkprogrammas cilnē. Izmantojiet priekšskatījuma kartes **Izpildīt** pogu, kad vēlaties izpildīt workflow.

Sekojot atsauksmēm tajā pašā sarunā, tiek rediģēts šis workflow, nevis izveidots jauns. Piemēram, pēc tam, kad Chat izveido workflow, Jūs varat teikt "pievienot apstiprinājuma soli", "mainīt izejas formātu" vai "şöyle yap", un Chat atjaunina saglabāto workflow un atsvaidzina priekšskatījumu.

Tas ir vislabāk piemērots pieprasījumiem, kur Jūs vēlaties, lai darbs tiktu veikts kā atkārtoti izmantojama automatizācija, nevis tikai kā vienreizēja atbilde.

## Kanban uzdevumu izveide

Jautājiet Chat parastā valodā, piemēram, “Pievienojiet uzdevumu ar nosaukumu Labot pieteikšanās kļūdu” vai “Izveidojiet jaunu karti Atjaunināt dokumentāciju uz Launch dēļa.” Jūs varat iekļaut aprakstu tajā pašā pieprasījumā. Chat vienmēr izveido karti izvēlētā dēļa pirmajā kolonnā.

Ja Jūsu darba telpai ir vairāki dēļi un Jūs nenorādāt vienu, Chat apstājas ar vienas izvēles dēļa izvēlni. Izvēlieties dēli, lai pabeigtu kartes izveidi. Nav nepieciešama ne slīpsvītras komanda, ne īpašs ziņojuma formāts.

## Jautājot, kas notiek

Jautājiet parastā valodā — "kas notiek?", "cik workflows šobrīd ir aktīvi?", "kurš mezgls ir nakts ziņojumā?" — un Chat ziņo par dzīvo situāciju:

- **Cik** izpildes ir procesā, sadalītas starp notiekošām un gaidošām cilvēka pārskatīšanai
- **Kuri workflows** tiem pieder, pēc nosaukuma
- **Cik ilgi** katra izpilde ir notikusi (piemēram, `1m 35s`, `3h 25m`)
- **Kurš mezgls** šobrīd tiek izpildīts, pēc tā kanvas etiķetes, plus pēdējais mezgls, kas pabeigts
- **Saites** uz katru dzīvo izpildi, kas atver kanvu ar to izpildi atkārtojot

Izpildes, kas ir apturētas [Human-in-the-Loop](../reference/human-in-the-loop.md) vai Codex pārskatīšanai, tiek ziņotas kā gaidošas, nevis kā notiekošas. Tas ir tas pats dati kā aktīvo izpildes insignija galvenē, tādēļ Chat un insignija nekad nesakrīt. Par izpildēm, kas jau ir pabeigtas, jautājiet par nesenajām izpildēm — tas attiecas uz [Izpildes vēsturi](../reference/execution-history.md).

## Jautājumi par izpildi

Atlasiet Workflow izpildi [Execution History](../reference/execution-history.md#ask-ai) logā redaktorā vai All History skatā un noklikšķiniet uz **Jautāt AI** blakus dialoga nosaukumam. Chat atver jaunu sarunu ar divām mikroshēmām virs ziņojuma lodziņa:

- **Workflow:** Workflow nosaukums
- **Execution:** atlasītās izpildes ID pirmās rakstzīmes

Noņemiet mikroshēmu ar tās **×**, lai to izlaistu. Pēc tam uzdodiet jautājumu, piemēram, „kāpēc šī izpilde aizņēma tik ilgu laiku?“, „kas šeit neizdevās?“ vai „vai varat to labot?“. Atlikušās mikroshēmas tiek pievienotas šim ziņojumam ar pilniem ID, tāpēc Chat tieši nolasa izpildes ievades, izvades un mezglu trasējumu, nevis meklē Workflow. Lai labotu Workflow, Chat saglabā, pārbauda un verificē izmaiņas, kā aprakstīts sadaļā [Workflow izveide](#workflow-izveide).

Nosūtītajā ziņojumā mikroshēmas tiek rādītas zem jūsu jautājuma. Tās pieder tikai šim ziņojumam; nākamie jautājumi tajā pašā sarunā saglabā kontekstu no vēstures.

## Jautājot par brīdinājumiem

Chat var atbildēt uz jautājumiem par [brīdinājumiem](./alerts-tab.md), kurus Jūs esat definējis:

- **Kas pastāv** — "kādi brīdinājumi man ir?", "vai ir brīdinājums par rēķina workflow?", "kuri brīdinājumi šobrīd darbojas?"
- **Kā viens ir iestatīts** — "kāds ir slieksnis uz izmaksu brīdinājumu?", "kā tas ir konfigurēts?"
- **Kāpēc un kad tas aktivizējās** — "kāpēc izmaksu brīdinājums aktivizējās?", "kad tas pēdējo reizi tika aktivizēts?"

Uz jautājumu "kāpēc tas aktivizējās", Chat lasa aktivizēšanas ierakstu un citē faktisko novēroto vērtību, slieksni un precīzu novērtēto laika logu, kā arī ieguldījuma detaļas: neizpildes identifikatori un kļūdu ziņojumi kļūdu brīdinājumiem, izdevumi pēc modeļa izmaksu brīdinājumiem vai aktivizēšanas avota sadalījums izpildes skaita brīdinājumiem. Tas ziņo par to, kas bija patiesība, kad brīdinājums aktivizējās, nevis pārrēķina logu, jo logs ir pagājis un jauna aprēķināšana var sniegt citu atbildi.

## Lietotāja noteikumi

[Lietotāja noteikumi](../reference/user-settings.md) (konfigurēti Iestatījumos) tiek automātiski iekļauti katrā Chat sarunā kā sistēmas līmeņa instrukcijas. Iestatiet tos vienreiz, lai piemērotu pastāvīgas preferences visiem sarunu pieprasījumiem.
## Saistītie

- [MCP Tab](./mcp-tab.md) – Izvērsiet šo dzinēju MCP klientiem kā `heym_chat` rīku
- [Iestatījumi](../reference/user-settings.md) – Iestatiet lietotāja noteikumus, kas attiecas uz visām čata pieprasījumiem
- [Akreditācijas dati](./credentials-tab.md) – Pievienojiet un pārvaldiet API atslēgas
- [Mainīgie](./global-variables-tab.md) – Globālie mainīgie, kas pieejami Chat
- [Node Types](../reference/node-types.md) – LLM un Agent mezgli darbplūsmām
- [Agent Node](../nodes/agent-node.md) – AI aģents ar rīku izsaukšanu
- [AI Assistant](../reference/ai-assistant.md) – Redaktora asistents, ko nodrošina tas pats darbplūsmu veidotāja DSL
- [Izpildes vēsture](../reference/execution-history.md) – Skatiet iepriekšējās izpildes (Vēstures poga galvenē)
- [Grafiki](./scheduled-tab.md) – Kalendārs gaidāmajām cron izpildēm (tie paši dati, ko Chat var kopsavilkt)
- [Brīdinājumi](./alerts-tab.md) – Sliekšņa brīdinājumi, kurus Chat var uzskaitīt un izskaidrot
- [Konteksta demonstrācija](../reference/contextual-showcase.md) – Kompakta lietotnes orientācija šai lapai
- [Čata balss (TTS & STT)](../reference/chat-voice.md) – Nolasiet ziņojumus skaļi un runājiet bez rokām ar ElevenLabs

## Rīku izsaukumi un konteksta izmērs

Katru reizi, kad asistents izsauc rīku (palaidot darbplūsmu, uzskaitot izpildes, veidojot jaunu darbplūsmu), sarunā parādās saraujamā karte. Karte automātiski paplašinās, kamēr rīks darbojas, parādot precīzus argumentus. Kad rīks pabeidz darbu, karte saraujas līdz vienas rindas kopsavilkumam ar pagājušo laiku. Noklikšķiniet uz jebkuras kartes, lai atkārtoti paplašinātu argumentus un atbildes kopsavilkumu.

Mazs gredzena insignija zem ievades rāda pašreizējo konteksta izmantošanu kā procentu no modeļa loga (piemēram, `12% · ~9.2k`). Pārvietojiet peles rādītāju virs insignijas, lai redzētu sadalījumu: sistēmas prompts, AGENTS.md, darbplūsmu bloks, lietotāja noteikumi, vēsture un Jūsu melnraksta ievade. Kad izmantošana pārsniedz 80%, gredzens kļūst dzeltens; pie 95% tas kļūst sarkans.

Ja izmantošana tuvojas limitam, Heym automātiski saspiest vecākos ziņojumus īsā kopsavilkumā, izmantojot to pašu mehānismu, ko izmanto aģenta mezgli. Parādās karte "Konteksts saspiests", lai parādītu, kas notika.
