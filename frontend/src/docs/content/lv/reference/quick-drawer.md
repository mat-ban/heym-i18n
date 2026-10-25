# Ātrā panelis

**Ātrā panelis** ir darbplūsmu ātrās palaišanas panelis labajā pusē. Tas parādās autentificētās lapās, piemēram, informācijas panelī [Workflows cilnē](../tabs/workflows-tab.md), Docs un Evals.

## Piekļuve

- Noklikšķiniet uz fiksētā **Quick / Workflows** trigera ekrāna labās malas vidusdaļā
- Kad ir pieejams arī [Kontekstuālais skatījums](./contextual-showcase.md), tā **Page Guide** trigeris atrodas virs Quick Workflows
- Panelis atveras no labās puses un nedaudz pabīda pašreizējo lapu pa kreisi ar smalku mērogošanas maiņu
- Mobilajās ierīcēs Ātrais panelis ir paslēpts
- Panelis netiek rādīts darbplūsmu redaktorā, pieteikšanās/reģistrācijas, portāla vai HITL pārskatīšanas lapās

## Darbplūsmu meklēšana

Izmantojiet filtra lauku paneļa augšdaļā, lai meklētu darbplūsmas pēc:

- Darbplūsmas nosaukuma
- Darbplūsmas apraksta

Meklēšana nav reģistrjutīga un nekavējoties atjaunina sarakstu.

## Piespraustās darbplūsmas

Piespraudiet darbplūsmas, lai tās saglabātu paneļa augšdaļā.

- Piespraustās darbplūsmas parādās atsevišķā sadaļā virs pilnā saraksta
- Jaunās piespraudes tiek pievienotas augšpusē
- Piespraušanas secība tiek saglabāta starp pārlādes sesijām pārlūkprogrammas krātuvē

## Darbplūsmu palaišana

Atlasiet darbplūsmu, lai atvērtu tās ievades formu.

- Ievades lauki tiek rādīti vertikāli paneļa secībā
- Noklikšķiniet uz **Run Workflow**, lai izpildītu atlasīto darbplūsmu
- Noklikšķiniet uz **Stop Workflow**, lai atceltu notiekošo izpildi no paneļa
- Darbplūsmas bez Input laukiem joprojām var palaist tieši
- Workflow, kas sākas ar [File Upload Trigger](../nodes/file-upload-trigger-node.md), tā vietā parāda nomešanas zonu: ievelciet tajā failu vai noklikšķiniet, lai to izvēlētos. Zonā ir norādīti trigger atbalstītie failu tipi un izmērs, un citi faili tiek noraidīti pirms augšupielādes. Poga **Run Workflow** paliek atspējota, līdz tiek izvēlēts fails.

Panelis izmanto to pašu darbplūsmu izpildes API kā citas Heym palaišanas virsmas, tāpēc izvades un izpildlaika darbība paliek konsekventa.

Izpildes apturēšana no paneļa arī atceļ aktīvo aizmugursistēmas izpildi, tostarp jebkuru notiekošo Playwright pārlūkprogrammas uzdevumu šai darbplūsmas izpildei.

## Progress un rezultāti

Pēc izpildes sākšanas panelis rāda:

- Straumētu soļu progresu mezgliem, kad tie sāk un pabeidz darbību
- Galīgo statusu: `success`, `error` vai `pending`
- Galīgās izvades kompaktā JSON panelī
- Vēstures ierakstus ar atzīmi `Quick Drawer`

`pending` nozīmē, ka darbplūsma gaida vēlāku darbību, piemēram, cilvēka pārskatīšanu.

Quick Drawer izpildes ir produkcijas izpildes, tāpēc darbplūsma ar [vienlaicības ierobežojumu](./webhooks.md#concurrency-limit-and-queued-runs) var likt tām gaidīt. Kamēr izpilde gaida rindā, statuss rāda **Waiting in queue (2/5)**; tas mainās uz "running", kad izpilde sākas, un parāda rezultātu, kad tā beidzas, bez soļu progresa. Izpilde, kurai beidzies derīguma termiņš rindā vai kura tika atcelta gaidīšanas laikā, beidzas kā `error`.

Faila izpilde notiek caur trigger vienreizlietojamo augšupielādes saiti: atvilktne pieprasa no workflow saiti, augšupielādē tajā failu un parāda rezultātu, kad augšupielāde ir pabeigta. Faila izpildes parāda gala statusu un izvades, bet ne soli pa solim progresu, un vēsturē tās arī tiek atzīmētas ar `Quick Drawer`. Izvēlētais fails tiek notīrīts pēc katras izpildes, jo viena saite pieņem vienu failu.

## Pārlūkprogrammas krātuve

Ātrais panelis saglabā personīgos iestatījumus `localStorage`:

- Piesprausto darbplūsmu ID
- Pēdējo atlasīto darbplūsmu

Šajā versijā panelis **neg** saglabā ievades vērtības.

## Tvērums

Ātrais panelis apzināti ir viegla izpildes virsma.

- Iekļauts: meklēšana, piespraušana, atlase, ievade (tostarp fails), palaišana, progress, rezultāts
- Izslēgts: darbplūsmu izveide, rediģēšana, mapju pārvaldība un kanvas darbības

## Saistītie resursi

- [Workflows cilne](../tabs/workflows-tab.md) – Galvenais darbplūsmu saraksts, mapes un pārvaldība
- [Ātrā sākšana](../getting-started/quick-start.md) – Izveidojiet un palaidiet savu pirmo darbplūsmu
- [Izpildes vēsture](./execution-history.md) – Pārskatiet iepriekšējās izpildes
- [Webhooks](./webhooks.md) – Palaidiet darbplūsmas ar HTTP starpniecību
- [Kontekstuālais skatījums](./contextual-showcase.md) – Lapas līmeņa norāžu josla, kas papildina Ātro paneli
