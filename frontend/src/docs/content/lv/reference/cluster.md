# Slodzes sadalījums

Norādiet otro Heym instance uz to pašu PostgreSQL datu bāzi, un tā pievienojas kā darbinieks. Fona workflow izpildes tiek dalītas starp instancēm pēc procentiem, kurus Jūs iestatāt, tādējādi mašīna, kas nodrošina UI un API, nav vienīgā mašīna, kas izpilda katru workflow.

Instances nekad nesazinās savā starpā. Postgres pārnēsā darbu, tāpēc darbiniekam nav nepieciešams atvērts ports, sertifikāts vai ceļš atpakaļ uz galveno instanci — tikai piekļuve datu bāzei.

## Lomas

Vienai instancei ir **galvenā** loma, ko nosaka vides mainīgais. Tā nodrošina UI, API, MCP un čata portālu, un tai pieder failu glabāšana un instalētie spraudņi. Katrs cits instances ir **darbinieks**: tā sasniedz tikai datu bāzi un izpilda fona izpildes.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # vai: worker
HEYM_INSTANCE_NAME=EU Main    # displeja etiķete, vēlāk rediģējama no Iestatījumiem
HEYM_INSTANCE_ID=eu-main      # opcional; iegūts no nosaukuma, ja tukšs
```

Galvenā loma ir atsevišķa no līdera vēlēšanu. Heym jau izvēlas vienu līderi visā klasterī, kas atbild par cron, brīdinājumu novērtēšanu un avārijas atjaunošanu; ja galvenā instance apstājas, līderība pāriet uz darbinieku dažu sekunžu laikā, un plānotās izpildes turpina darboties. Galvenā loma nepārvietojas, jo failu glabāšana nevar pārvietoties kopā ar to.

## Kas var pamest galveno instanci

Izvietojums tiek noteikts no workflow mezgliem pirms izpildes sākuma. Izpilde paliek uz galvenās instances, kad jebkurš mezgls tajā — tostarp mezgli iekšējās sub-workflows, ko tā izsauc — pieskaras kaut kam, kas eksistē tikai vienā mašīnā:

| Mezgls | Kāpēc tas paliek uz galvenās |
|---|---|
| Codex, OpenCode Go | Kodinga aģenta darba vide paliek uz lokālā diska, lai turpinājums varētu atsākties tajā |
| Aģents ar pievienotu prasmi | Prasmes kods lasa un raksta Heym Drive |
| Drive, Converter, Google Drive | Tie lasa un raksta ģenerētās failus |
| Failu augšupielādes triggers | Augšupielāde nonāk uz galvenās diska |
| Sūtīt e-pastu | Korporatīvie SMTP pārsūtītāji parasti atļauj vienu avota adresi |
| Spraudņu mezgli | Spraudnis ir instalēts uz vienas instances diska |

**Viss pārējais ir sadalīts** — tostarp Code mezgls, Playwright un Agent Python rīki. Katrs instances darbojas ar to pašu attēlu ar savu Docker socket, tāpēc smilškaste nav iemesls, lai saglabātu izpildi uz galvenās, un tie ir visvairāk CPU izsalkušie mezgli produktā.

Workflow, kura sub-workflow tiek izvēlēta ar izteiksmi, nevar tikt pārbaudīta iepriekš, tāpēc tā paliek uz galvenās.

## Procentu izvēle

Svari ir veseli skaitļi, kas iestatīti sadaļā **Iestatījumi → Instances**. Tie ir **daļas no jebkurām instancēm, kas pašlaik var uzņemt darbu**, nevis procenti no 100: plānotājs dalās ar šī baseina kopējo summu.

Šī atšķirība parādās, tiklīdz viena instance izkrīt. Ar `Galvenā 41, Darbinieks A 26, Darbinieks B 33`, izslēdzot Darbinieku B, paliek baseins ar 67, tāpēc Galvenā patiesībā saņem 41/67 = **61%** un Darbinieks A 26/67 = **39%**. Paneļa apakšā tiek izdrukāta efektīvā sadale tieši šī iemesla dēļ, un saglabāšana nekad netiek bloķēta, jo skaitļi nesummējas līdz 100 — tikai sadale, kurā nevienai iespējotai instancei nav svara, tiek atteikta.

Divas lietas ir viegli sajaukt.

**Procenti nav mašīnas jaudas daļa.** Tie attiecas tikai uz izpildēm, kas iet cauri rindai. UI un API apkalpošana, straumēšanas redaktors un portāla izpildes, kā arī failu augšupielādes apstrāde ir visas galvenās darba funkcijas, un neviena no tām netiek skaitīta. Galvenā veic vairāk, nekā norāda tās skaitlis.

**Galvenā procentu daļa ir griesti, nevis grīda.** Izpildes, kas var tikt izpildītas tikai uz galvenās, tiek iekļautas tās kvotā, tāpēc, kad šī kvota ir iztērēta, atlikušās izpildes, kas var tikt sadalītas, pāriet uz darbiniekiem. Iestatot galvenās skaitli zemu, tas ir droši — darbs, kas jāveic tur, joprojām tiek veikts. Iestatot to augstu, darbinieki tiek izsalkuši.

Tātad ar spēcīgu galveno un mazāku darbinieku, sāciet tuvāk 60/40 nekā mašīnu neapstrādātajai attiecībai, pēc tam salīdziniet reālās izpildes ilgumu sadaļā Izpildes un pielāgojiet.

Svari tiek renormalizēti starp instancēm, kas pašlaik ir aktīvas un iespējotas. Ar `galvenā=70, A=15, B=15`, ja A izslēdzas, sadale kļūst 70/85 un 15/85 starp galveno un B, un atgriežas pie 70/15/15, kad A atgriežas.

**Instance, kas atgriežas, nav parādā izpildes, ko tā nokavēja.** Laiks, kas pavadīts Offline, Disabled vai uz nesaderīgas versijas, netiek skaitīts pret to, tāpēc darbinieks, kas pavadīja nakti nepieejams, atgriežas baseina pašreizējā pozīcijā, un sadale atkal ir 70/30 no tās pirmās izpildes — tā neuzsūc katru izpildi, līdz tā ir panākusi. Darbinieks, kas bija pieejams visu laiku, joprojām panāk, kas padara galvenās procentu daļu par griestiem.

### Jauna instance pievienojas ar nulli

Instance, kurai nekad nav piešķirta svara daļa, sāk ar 0, kas atstātu to Aktīvu, Iespējotu un nesaņemot neko. **Automātiski piešķiriet jauniem instancēm daļu** — pēc noklusējuma ieslēgts, zem instanču tabulas — to novērš: nākamajā līdera pārejā jaunpienācējs saņem vienādu daļu no baseina, un esošie svari tiek samazināti, saglabājot to attiecības savā starpā, tāpēc apzināta 70/30 joprojām izskatās aptuveni 70/30 pēc tam. Kopējais paliek tieši 100.

Tas notiek **vienu reizi uz instance**. Gan automātiskā pāreja, gan Jūsu pašu rediģēšana atzīmē instanci kā konfigurētu, tāpēc instance, ko Jūs iestatījāt paši, nekad netiek mainīta aiz Jūsu muguras — tostarp tā, ko Jūs apzināti iestatījāt uz 0. Izslēdziet iestatījumu, ja Jūs labprātāk vēlaties, lai katra jauna mašīna gaida Jūs.

Tikai iespējotas, aktīvas un saderīgas instances piedalās. Daļas piešķiršana mašīnai, kas nevar izpildīt neko, atstātu šo daļu bez pielietojuma.
### Kad procenti nevar palīdzēt

Iestatījumu panelis ziņo, cik no pēdējām 24 stundu izpildēm varēja izpildīt tikai galvenajā mezglā. Ja šis skaitlis ir augsts — Codex vai Drive smags darba slodze — darbinieki paliks bezdarbībā, neskatoties uz svariem, un risinājums ir lielāks galvenais instances, nevis vairāk to.

## PostgreSQL izmērošana klasterim

Savienojumi palielinās ar instancēm, ne tikai lietotājiem. Katrs instances darbojas ar vairākiem uvicorn procesiem, un katrs process satur savienojumu baseinu plus četras `LISTEN` savienojumus (atcelšana, rindas pamodināšana, izpildes rezultāti, čata straumes). Atvērtās čata straumes dalās ar vienu čata savienojumu, tāpēc tās nepievieno datu bāzes savienojumus. Trīs instanču klasteris ar noklusējuma `max_connections = 100` izsīkst, un Heym tad nespēj sasniegt savu datu bāzi.

Plānojiet aptuveni `instances x processes x (async pool + sync pool + 4)` un iestatiet `max_connections` virs tā.

Samaziniet baseinus, nevis tikai paaugstiniet griestus. Viena izvietojuma noklusējums ir 10+20 asinkronajiem un 5+10 sinhronajiem savienojumiem uz procesu, kas ir dāsni vienai mašīnai un pārāk daudz klasterim:

| Mainīgais | Viena instance | Klasteris |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Piemēra kompozīcijas fails iestata tos un `max_connections = 300`. Tas samazina divu instanču klastera 768 savienojumu griestus līdz 192, ar trim instancēm joprojām zem 300.

## Prasības, kuras klasteris nevar uzspiest Jums

**Katram mezglam jāizmanto tas pats `SECRET_KEY` un `ENCRYPTION_KEY`.** Darbinieks ar citu `ENCRYPTION_KEY` nevar atšifrēt akreditācijas datus, un katra akreditāciju izmantojoša izpilde neizdosies ar kļūdu, kas nenosauc neko noderīgu. Heym salīdzina abu atslēgu kopsummu katrā sirdspukstā, kopā ar lietojumprogrammas versiju un datu bāzes revīziju, un atzīmē nesakritīgu instanci kā **Mismatch**, tādējādi tā nesaņem nekādu darbu. Slodze atgriežas pie galvenā mezgla, līdz Jūs to novēršat.

Tas arī nosaka jaunināšanas secību. Galvenā mezgla jaunināšana vispirms atzīmē katru darbinieku kā nesaderīgu; darbs atgriežas pie galvenā, un katrs darbinieks pievienojas, kad tas tiek jaunināts. Lēnāk, redzami un atgriezeniski.

**Norādiet ieeju tikai uz galveno instanci.** Lietotāju satiksmes izkliede starp instancēm nosūtītu faila augšupielādi uz vienu mašīnu un tās lejupielādi uz citu. Nekas kodā to nepieļauj, jo darbinieks darbojas ar to pašu attēlu un atbildēs uz jebkuru saņemto pieprasījumu.

**Katram mezglam nepieciešams `FRONTEND_URL`, kas iestatīts uz to pašu publisko adresi.** Izpilde, kas apstājas cilvēka pārskatīšanai, izveido savu pārskatīšanas saiti uz instanci, kas to izpildīja, nevis uz galveno, un tas pats attiecas uz Codex sekošanas saitēm un uz ģenerēto failu lejupielādes URL. Darbinieks, kuram tas nav, veido šīs saites pret savu lokālo adresi, un ikviens, kurš saņem vienu, to nevar atvērt.

**Darbinieku instancēm ir atšķirīgs izejošais IP.** Jebkura API, kas atļauj avota adreses, redz jauno. Send Email darbojas galvenajā tieši šī iemesla dēļ; HTTP mezglam vai nu piešķiriet klasterim vienu NAT izejošo adresi, vai atļaujiet katru instanci.

## Darbinieka pievienošana citā mašīnā

`docker-compose.worker.yml` repozitorija saknē darbojas darbinieks uz sava hosta. Tam nav datu bāzes un nav UI: tas sasniedz galvenā mezgla PostgreSQL un ņem savu daļu no fona izpildēm.

Aizpildiet `.env` blakus tam - attēla tagu, datu bāzes hostu un akreditācijas datus, abas atslēgas un instanču ID - un sāciet to. Kompozīcija atsakās sākt, līdz visi nepieciešamie vērtības ir iestatītas, nevis nāk ar vietturi, kas vēlāk neizdodas veidā, kas ir grūti lasāms.

Attēla tagam jābūt tādam pašam kā galvenajam, un abām atslēgām jābūt precīzi kopētām. Atšķirība kādā no tām parāda darbinieku kā Mismatch, un tas nesaņem nekādu darbu.

## Instanču tabulas lasīšana

| Kolonna | Nozīme |
|---|---|
| Nosaukums | Rediģējams etiķete; tā tiek uzdrukāta uz katras izpildes, ko šī instance veic |
| Loma | `main` vai `worker`, no vides |
| Statuss | **Live** ar jaunu sirdspukstu, **Offline** pēc 30 sekunžu klusuma, **Mismatch**, kad versija, datu bāzes revīzija vai atslēgas atšķiras no galvenā |
| ms | Aplis no šīs instances uz datu bāzi, ko mēra pati instance |
| On | Izņemiet darbinieku no rotācijas, neapturot to — notiekošās izpildes pabeidzas, jaunas netiek piešķirtas. Bloķēts galvenajai instancei: failu, spraudņu un kodēšanas aģentu darba izpildes notiek tur, neskatoties uz to, ko slēdzis saka |
| Svars | Tās daļa no izplatāmajām izpildēm |

## Konkurences ierobežojumi klasterī

Darbplūsmas [konkurences ierobežojums](./webhooks.md#concurrency-limit-and-queued-runs) tiek uzskaitīts PostgreSQL, tāpēc tas darbojas visās instancēs un visos procesos: divas instances nekad neizpilda vairāk viena workflow izpilžu, nekā atļauj limits. Izpilde, kas gaidīja brīvu vietu, startējot tiek izvietota pēc tiem pašiem noteikumiem kā jebkura cita izpilde, nodrošinot, ka izpilde, kurai jāpaliek uz main, tur arī paliek. Rindas worker, kas veic šīs izpildes, tagad startē katrā instalācijā, tostarp vienā instancē, kur tas apstrādā tikai savas instances rindā ievietotās izpildes. Tas nozīmē, ka pat viena instance uztur rindas modināšanas `LISTEN` savienojumu katrā procesā; plānojiet tās savienojumus tāpat kā klastera instancei.

## Izpildes vēsture

Katrs izpildes vēsturē nosauc instanci, kas to izpildīja, un abas vēstures dialogi var filtrēt uz vienu instanci. Filtrs atbilst instancēm ID, vienlaikus rādīdams tās nosaukumu, tāpēc instancēm pārdēvēšana nepārveido to, ko vecās izpildes saka.

Nekas par to neparādās vienas instancē instalācijā: lauki ir tukši, nav redzama etiķete, un nav piedāvāta filtrēšana.
## Kļūdu uzvedība

**Ja darbinieks mirst izpildes laikā**, tā sirdsdarbība kļūst novecojusi, un līdera esošā atjaunošanas procedūra atkārtoti izpilda uzdevumu dzīvajā instancē. Rindas ieraksts, ko tas bija pieprasījis, tiek atcelts atsevišķi: kad vairs nav aktīvas izpildes un ir pagājušas divas minūtes, līderis atzīmē ierakstu kā neizpildītu un pamodina tos, kas gaidīja rezultātu. Vecums pats par sevi nekad nav izsistējs, tāpēc likumīgi ilga izpilde paliek neskarta; un ieraksts tiek atzīmēts kā neizpildīts, nevis atkārtoti pieprasīts, jo atjaunošana jau pieder atkārtotai izpildei, un atkārtota pieprasīšana izpildītu to pašu workflow divreiz.

**Ja galvenais mezgls avarē**, cron turpina darboties no darbinieka, un izpildes turpina notikt. Izpildes, kas prasa galveno, rindojas un gaida, un iztukšojas, kad tas atgriežas — bet tikai misfire žēlastības logā (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, pēc noklusējuma 600 sekundes). Viss vecāks tiek slēgts kā izlaists, ar iemeslu, kas reģistrēts, nevis atkārtoti izpildot stundām ilgu uzkrājumu vienlaikus.

Lietotāja saskarne, API, MCP un redaktors nav pieejami, kamēr galvenais mezgls ir avarējis, jo tur ir ieejas punkti.

## Saistītie

- [Running & Deployment](../getting-started/running-and-deployment.md) – Vispirms izvietojiet vienu instanci; vides mainīgie un atslēgu iestatījumi atrodas tur
- [Settings](./user-settings.md) – Instances cilne un tas, kas to var redzēt
- [Traces](../tabs/traces-tab.md) – Salīdziniet reālo izpildes ilgumu starp instancēm pirms dalījuma maiņas
- [Security](./security.md) – Kāpēc katrai instancei jādalās ar `SECRET_KEY` un `ENCRYPTION_KEY`
