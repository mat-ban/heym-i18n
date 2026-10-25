# Heym Work

**Heym Work** ir papildu saskarne biznesa komandām, kas izveidota uz Heym platformas bāzes. Lietotāji apraksta uzdevumu saviem vārdiem, atbild uz dažiem jautājumiem un saņem workflow, ko Heym ir izveidojis un pārbaudījis. Darbs norit īpaši viņiem izveidotās lapās, tiek apstrādāti saskaņošanas pieprasījumi un katrs izpildes process tiek attēlots ar iesniedzēja vārdu. Heym katru uzdevumu izpilda fonā.

Heym Work darbojas kā atsevišķs konteiners līdzās Heym ar atsevišķu Heym komandas licenci. Uzziniet vairāk un piesakieties izmēģinājumam vietnē [heym.run/enterprise](https://heym.run/enterprise). Noskatieties [Heym Work video](https://youtu.be/5Z2gGo6bcpU), lai iepazītos ar divu minūšu pārskatu.

## Ko iegūst biznesa komandas

| Joma | Funkcionalitāte |
|------|-----------------|
| **Chat** | Aprakstiet uzdevumu teksta vai balss veidā. Heym jautā nepieciešamo informāciju, izveido workflow, to pārbauda un atzīmē kā Pārbaudīts. |
| **Flows** | Redaktori veido flow no izvēlēm, nevis uz audekla: kas to sāk, neobligāts AI melnraksts un darbības programmās Slack, Google Sheets un e-pastā. Slack atbildes turpina izpildi, un apstiprinājumi gaida arī sadaļā Aktivitāte. Skatiet [Flows](#flows). |
| **Lapas** | Piespraustas logrīku lapas: skaitļi, diagrammas, tabulas ar statusa iezīmēm, failu ievilkšanas zonas un apstiprinājumi. Tabulas rinda var atvērt savu detalizētās informācijas lapu. |
| **Apstiprinājumi** | Pārbaudes no [Human-in-the-Loop](./human-in-the-loop.md) posmiem gaida sadaļā Aktivitāte un lapās ar iespējām Apstiprināt, Pieprasīt izmaiņas un Noraidīt. |
| **Aktivitāte** | Katra izpilde kopā ar personu, kas to palaida, un instanci, kas to veica. |
| **Lomas** | Īpašnieks, Redaktors un Skatītājs. Pierakstīšanās notiek ar [Single Sign-On](./sso.md), ko Heym jau izmanto. |
| **Nozaru izdevumi** | Juridisko pakalpojumu, izglītības, finanšu, loģistikas, enerģētikas un e-komercijas izdevumos ir iekļautas gatavas lapas, paraugdati un nozarei pielāgoti darbplūsmu risinājumi. |

## Flows

**Flows** atrodas Heym Work izvēlnē Redaktoriem un Īpašniekiem. Flow tiek veidots no izvēlēm, nevis mezgliem, un Heym Work to saglabā kā parastu Heym darbplūsmu, izmantojot Heym API, tās personas vārdā, kura to izveidoja. Heym piekļuves noteikumi, rediģēšanas vēsture un trigeru sinhronizācija attiecas tāpat kā redaktorā, un katra izpilde parādās Aktivitātē kā jebkura cita.

| Daļa | Izvēles |
|---|---|
| **Kas to sāk** | Pēc pieprasījuma, saskaņā ar grafiku, saņemot Slack ziņojumu, mainoties Google Sheets cilnei (pievienotas, mainītas vai dzēstas rindas) vai e-pastam sasniedzot iesūtni. Izklājlapu un e-pasta trigeri pārbauda ik pēc 1, 5, 15 vai 60 minūtēm. |
| **AI melnraksts** (neobligāti) | Modelis un instrukcijas pārvērš to, kas sāka flow, tekstā nākamajiem soļiem. Flow, kas nesākas no izklājlapas vai e-pasta, vispirms var nolasīt jaunākos Slack ziņojumus no kanāla vai pavediena. |
| **Kas notiek tālāk** | Darbības pēc kārtas jebkurā no trim rīkiem neatkarīgi no tā, kas sāka flow. **Slack:** kanāla ziņojums, tiešais ziņojums, veidlapa, ziņojums ar pogām, apstiprinājums, pavediena atbilde, ziņojuma atjaunināšana un gala rezultāts. **Google Sheets:** pievienot rindu vai atjaunināt mainīto rindu. **E-pasts:** nosūtīt e-pastu. |

- **Atbildes turpina izpildi.** Apstiprinājums, pogas vai veidlapa aptur izpildi, līdz kāds atbild programmā Slack. Apstiprinājums gaida arī Aktivitātē, un lēmums jebkurā vietā noņem pogas no Slack ziņojuma. Vēlākie Slack soļi paliek pirmā ziņojuma pavedienā.
- **Viena Savienojumu kartīte.** Katrs flow parāda Slack darbvietu, Google Sheets kontu un iesūtnes, no kurām tas lasa un sūta. Tie ir Heym akreditācijas dati: **Slack Bot** (bota marķieris, `xoxb-…`), **Google Sheets**, **IMAP** un **SMTP**; trūkstošos datus var pievienot tieši no paša flow.
- **Viena Slack lietotne katram flow.** Slack lietotnē iestatiet Interaktivitātes pieprasījuma URL uz `https://<jūsu Heym>/api/slack/interactions/<akreditācijas id>` un Notikumu abonēšanas pieprasījuma URL uz `https://<jūsu Heym>/api/slack/events/<akreditācijas id>`. Heym Work parāda abus izvēlētajam savienojumam. Visi flow ar šo akreditācijas datu kopu tos koplieto.
- **Slack trigeri izvēlas, ko klausīties:** ziņojumus kanālos un tiešajos ziņojumos, tiešos ziņojumus botam, bota pieminējumus vai ziņojumus vienā kanālā. Paša bota ieraksti nekad nesāk flow.
- **Prasības.** Flows prasa Heym 0.0.131 vai jaunāku versiju.

Soļi, ko veido flow, ir tie paši mezgli, kurus varat izmantot uz audekla: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) un [Cron](../nodes/cron-node.md).

## Heym Work savienošana

Noskatieties [uzstādīšanas video](https://youtu.be/zXGfg1HPSLk), lai uzzinātu par visu konfigurācijas gaitu no pirmās komandas līdz sākumlapai.

Savienojumu konfigurē sadaļā **Iestatījumi → Heym Work**. Cilne ir redzama tikai instances administratoriem, kuri norādīti mainīgajā `HEYM_ADMIN_EMAILS`.

| Lauks | Funkcionalitāte |
|-------|-----------------|
| **Heym Work adrese** | Vieta, kur darbojas Heym Work, piemēram, `https://work.example.com`. Pēc pieteikšanās notiek atgriešanās šeit. Nospiediet **Saglabāt**. |
| **Integrācijas atslēga** | Poga **Ģenerēt atslēgu** izveido atslēgu, ko Heym Work izmanto katram pieprasījumam uz Heym. Tā tiek parādīta tikai vienu reizi kopā ar kopēšanas pogu. Heym saglabā tikai tās jaucējkodu (hash). |
| **Iespējot Heym Work** | Ieslēdz savienojumu. Vispirms nepieciešams ievadīt adresi un atslēgu. |
| **Nozaru un komandu izdevumi** | Izdevumi juridiskajai nozarei, izglītībai, finansēm, loģistikai, enerģētikai un e-komercijai, kā arī IT, pārdošanas, mārketinga un personāla atlases izdevumi uzņēmumu komandām tiek atvērti ar lapām, parauga datiem un workflowiem šim darbam. |

Pēc tam atveriet Heym Work adresi un pabeidziet iestatīšanu:

1. **Licence**: ievadiet Heym komandas piešķirto licences atslēgu.
2. **Heym**: ievadiet Heym adresi un integrācijas atslēgu.
3. **Īpašnieks**: pierakstieties ar kontu, kas norādīts kā Heym Work īpašnieks.

Tiek atvērta sākumlapa, kas ir gatava komandas darbam.

### Atslēgas maiņa

Darbība **Nomainīt atslēgu** aizstāj integrācijas atslēgu. Heym Work pārtrauc darbību, līdz tajā tiek ievadīta jaunā atslēga, un visi Heym Work pierakstītie lietotāji tiek izrakstīti. Izmantojiet šo iespēju, ja pastāv aizdomas par atslēgas noplūdi vai ja organizāciju pamet darbinieks, kuram tā bija pieejama.

### Savienojuma atspējošana

Izslēdziet slēdzi **Iespējot Heym Work**, lai pārtrauktu savienojumu. Pēc tam Heym Work atkārtoti pieprasīs Heym atslēgu. Heym jebkurā gadījumā turpina izpildīt visas darbplūsmas, grafikus un tīmekļa aizķeres (webhooks).

## Drošības modelis

- **Katra izmaiņa iet caur Heym.** Heym Work nolasa rādītos datus no Heym datubāzes un nosūta katru darbību uz Heym pa kanālu, kas aizsargāts ar atslēgu, kur Heym piemēro savus piekļuves noteikumus. Heym Work glabā savus datus atsevišķā shēmā `heym_work`.
- **Atslēga miera stāvoklī tiek glabāta kā jaucējkods.** Heym salīdzina iesniegtās atslēgas jaucējkodu un nekad nesaglabā atslēgu atklātā veidā.
- **Pierakstīšanās paliek Heym pārziņā.** Lietotāji piesakās caur Heym, izmantojot jūsu identitātes nodrošinātāju, kad ir ieslēgts [SSO](./sso.md).
- **Izmaiņas tiek auditētas.** Savienojuma saglabāšana un atslēgas maiņa ieraksta rindas `work_integration.update` un `work_integration.key_rotate` [audita žurnālā](./audit.md).

## Licencēšana

Heym Work nepieciešama sava licences atslēga, ko izsniedz Heym komanda. Katru dienu Heym Work nosūta vietnei heym.run savu licences ID, instalācijas ID, aktīvo lietotāju skaitu pēdējās 30 dienās, kopējo dalībnieku skaitu, izpildīto procesu skaitu pēdējās 24 stundās un Heym un Heym Work versijas. Darbplūsmu saturs, ievades dati, izvades dati un akreditācijas dati paliek tikai jūsu serveros.

Ja ikdienas sinhronizācija neizdodas 30 dienas, sākas 14 dienu labvēlības periods, pēc kura Heym Work saskarne pieprasa atslēgu Īpašniekam. Izmēģinājuma versija darbojas līdz pēdējai dienai un atsākas, kad Heym komanda to pagarina (atļauts viens izmēģinājums vienai instalācijai). Pats Heym turpina darboties bez pārtraukuma visu šo laiku. Tīkli bez interneta piekļuves izmanto bezsaistes licenci, kas pieejama caur enterprise@heym.run.

## Video

Visi Heym Work video ir pieejami [Heym Work atskaņošanas sarakstā](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Saistītās tēmas

- [Enterprise](./enterprise.md): Komerciālā licencēšana un atbalsts
- [Single Sign-On](./sso.md): Pierakstīšanās risinājums, ko izmanto Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Heym Work saskarnē attēlotās pārbaudes
- [Audita žurnāls](./audit.md): Ieraksti, kas rodas savienojuma izmaiņu rezultātā
- [Iestatījumi](./user-settings.md): Kur atrodas cilne Heym Work
