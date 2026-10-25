# Heym Work

**Heym Work** on Heymi peale ehitatud täiendav kasutajaliides äritiimidele. Kasutajad kirjeldavad ülesannet oma sõnadega, vastavad mõnele küsimusele ja saavad valmis töövoo, mille Heym on koostanud ja testinud. Nad töötavad spetsiaalselt nende jaoks loodud lehtedel, vaatavad üle kinnitusi ning näevad iga käivitust koos algataja nimega. Heym käitab iga ülesannet taustal.

Heym Work töötab eraldi konteinerina Heymi kõrval ning vajab eraldi litsentsi Heymi meeskonnalt. Lisateabe saamiseks ja prooviversiooni taotlemiseks külastage veebilehte [heym.run/enterprise](https://heym.run/enterprise). Kaheminutilise ülevaate saamiseks vaadake [Heym Worki videot](https://youtu.be/5Z2gGo6bcpU).

## Mida äritiimid saavad

| Valdkond | Funktsioon |
|----------|------------|
| **Chat** | Kirjeldage ülesannet teksti või hääle abil. Heym küsib vajalikud andmed, koostab töövoo, testib seda ning märgib selle Kinnitatuks. |
| **Flows** | Toimetajad loovad flow valikute põhjal, mitte lõuendil: mis seda alustab, valikuline AI-mustand ja toimingud Slackis, Google Sheetsis ja e-postis. Slacki vastused jätkavad käitust ning kinnitused ootavad samuti Tegevuses. Vaadake [Flows](#flows). |
| **Lehed** | Kinnitatud vidinate lehed: numbrid, diagrammid, olekumärkidega tabelid, failide lohistamisalad ja heakskiidud. Tabeli rida võib avada omaette üksikasjade lehe. |
| **Heakskiidud** | [Human-in-the-Loop](./human-in-the-loop.md) etappidest tulenevad ülevaatused ootavad vaates Tegevus ja lehtedel valikutega Kiida heaks, Taotle muudatusi ja Lükka tagasi. |
| **Tegevus** | Iga käivitus koos selle algatanud isiku ja seda käitanud eksemplariga. |
| **Rollid** | Omanik, Toimetaja ja Vaataja. Sisselogimine toimub Heymi poolt juba kasutatava [Single Sign-On](./sso.md) lahenduse kaudu. |
| **Valdkondlikud väljaanded** | Õiguse, hariduse, rahanduse, logistika, energeetika ja e-kaubanduse eriväljaanded avanevad valmis lehtede, näidisandmete ja valdkonnale kohandatud töövoogudega. |

## Flows

**Flows** asub Heym Worki menüüs Toimetajatele ja Omanikele. Flow koostatakse valikutest, mitte sõlmedest, ja Heym Work salvestab selle tavalise Heym workflow'na Heymi API kaudu selle loonud isiku nimel. Heymi juurdepääsureeglid, redigeerimisajalugu ja trigerite sünkroonimine kehtivad nagu redaktoris, ning iga käitus kuvatakse Tegevuses nagu mis tahes muu.

| Osa | Valikud |
|---|---|
| **Mis seda käivitab** | Nõudmisel, ajakava järgi, Slacki sõnumi peale, Google Sheetsi vahekaardi muutumisel (read lisatud, muudetud või kustutatud) või e-kirja saabumisel postkasti. Tabeli- ja e-posti trigerid kontrollivad iga 1, 5, 15 või 60 minuti järel. |
| **AI-mustand** (valikuline) | Mudel ja juhised muudavad flow käivitanud sündmuse tekstiks järgmiste sammude jaoks. Flow, mis ei alga tabelist ega e-kirjast, saab esmalt lugeda hiljutisi Slacki sõnumeid kanalist või teemast. |
| **Mis juhtub järgmiseks** | Toimingud järjekorras mis tahes kolmest tööriistast, olenemata sellest, mis flow käivitas. **Slack:** kanalisõnum, otsesõnum, vorm, nuppudega sõnum, kinnitus, teemalõime vastus, sõnumi värskendus ja lõpptulemus. **Google Sheets:** lisa rida või värskenda muudetud rida. **E-post:** saada e-kiri. |

- **Vastused jätkavad käitust.** Kinnitus, nupud või vorm peatavad käituse, kuni keegi Slackis vastab. Kinnitus ootab ka Tegevuses ja otsus mis tahes kohas eemaldab nupud Slacki sõnumilt. Hilisemad Slacki sammud jäävad esimese sõnumi lõime.
- **Üks Ühenduste kaart.** Iga flow näitab Slacki tööruumi, Google Sheetsi kontot ja postkaste, millest see loeb ja millega saadab. Need on Heymi volitused: **Slack Bot** (boti luba, `xoxb-…`), **Google Sheets**, **IMAP** ja **SMTP**; puuduva volituse saab lisada otse flow seest.
- **Üks Slacki rakendus iga flow jaoks.** Slacki rakenduses määrake Interaktiivsuse päringu URL-iks `https://<teie Heym>/api/slack/interactions/<volituse id>` ja Sündmuste tellimuste päringu URL-iks `https://<teie Heym>/api/slack/events/<volituse id>`. Heym Work näitab mõlemat valitud ühenduse jaoks. Kõik selle volitusega flow'd jagavad neid.
- **Slacki trigerid valivad, mida nad kuulavad:** sõnumeid kanalites ja otsesõnumites, otsesõnumeid botile, boti mainimisi või sõnumeid ühes kanalis. Boti enda postitused ei käivita kunagi flowd.
- **Nõuded.** Flows vajab Heym 0.0.131 või uuemat versiooni.

Sammud, mida flow ehitab, on samad sõlmed, mida saate lõuendil kasutada: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) ja [Cron](../nodes/cron-node.md).

## Heym Worki ühendamine

Kogu seadistusprotsessi nägemiseks alates esimesest käsust kuni avaleheni vaadake [paigaldusvideot](https://youtu.be/zXGfg1HPSLk).

Ühendus seadistatakse menüüs **Seaded → Heym Work**. Vahekaart kuvatakse ainult keskkonna administraatoritele, kes on märgitud muutujas `HEYM_ADMIN_EMAILS`.

| Väli | Funktsioon |
|------|------------|
| **Heym Worki aadress** | Asukoht, kus Heym Work töötab, näiteks `https://work.example.com`. Sisselogimine suunab siia tagasi. Vajutage **Salvesta**. |
| **Integratsioonivõti** | Nupp **Genereeri võti** loob võtme, mida Heym Work kasutab iga Heymile suunatud päringu jaoks. Seda kuvatakse ainult üks kord koos kopeerimisnupuga. Heym salvestab üksnes selle räsi. |
| **Luba Heym Work** | Lülitab ühenduse sisse. Nõuab eelnevalt aadressi ja võtme sisestamist. |
| **Valdkonna- ja meeskonnaväljaanded** | Õigus-, haridus-, finants-, logistika-, energia- ja e-kaubanduse väljaanded ning ettevõtte meeskondadele mõeldud IT-, müügi-, turundus- ja personali väljaanded avanevad selle töö jaoks mõeldud lehtede, näidisandmete ja workflow'dega. |

Seejärel avage Heym Worki aadress ja viige seadistamine lõpule:

1. **Litsents**: sisestage Heymi meeskonnalt saadud litsentsivõti.
2. **Heym**: sisestage Heymi aadress ja integratsioonivõti.
3. **Omanik**: logige sisse kontoga, mis on märgitud Heym Worki omanikuks.

Avaneb avaleht, mis on valmis meeskonna tööks.

### Võtme vahetamine

Valik **Vaheta võti** asendab senise integratsioonivõtme. Heym Worki töö peatub, kuni sinna sisestatakse uus võti, ning kõik Heym Worki sisse logitud kasutajad logitakse välja. Kasutage seda võimalust võtme lekke kahtluse korral või võtmega kokku puutunud töötaja lahkumisel.

### Ühenduse keelamine

Ühenduse katkestamiseks lülitage **Luba Heym Work** välja. Heym Work küsib seejärel uuesti Heymi võtit. Heym jätkab igal juhul kõigi töövoogude, ajakavade ja veebikonksude käitamist.

## Turvamudel

- **Iga muudatus läbib Heymi.** Heym Work loeb kuvatavaid andmeid Heymi andmebaasist ja saadab iga toimingu Heymile võtmega kaitstud kanali kaudu, kus Heym rakendab oma juurdepääsureegleid. Heym Work hoiab oma andmeid eraldi `heym_work` skeemis.
- **Võti on salvestatud räsina.** Heym võrdleb esitatud võtme räsi ega salvesta võtit kunagi tavatekstina.
- **Autentimine toimub Heymi kaudu.** Kasutajad logivad sisse Heymi kaudu, kasutades teie identiteedipakkujat, kui [SSO](./sso.md) on sisse lülitatud.
- **Muudatused auditeeritakse.** Ühenduse salvestamine ja võtme vahetamine kirjutavad kirjed `work_integration.update` ja `work_integration.key_rotate` [auditilogisse](./audit.md).

## Litsentsimine

Heym Work vajab eraldi litsentsivõtit, mille väljastab Heymi meeskond. Iga päev saadab Heym Work aadressile heym.run oma litsentsi ID, paigalduse ID, viimase 30 päeva aktiivsete kasutajate arvu, liikmete koguarvu, viimase 24 tunni käivituste arvu ning Heymi ja Heym Worki versioonid. Töövoogude sisu, sisendid, väljundid ja mandaadid jäävad alati teie kohalikesse serveritesse.

Kui igapäevane sünkroonimine ebaõnnestub 30 päeva jooksul, algab 14-päevane ajapikendus, mille järel Heym Worki liides küsib Omanikult võtit. Prooviperiood kestab kuni viimase päevani ning jätkub, kui Heymi meeskond seda pikendab (lubatud on üks prooviperiood paigalduse kohta). Heym ise töötab katkestusteta edasi kogu selle aja jooksul. Internetiühenduseta võrgud saavad kasutada võrguühenduseta litsentsi aadressilt enterprise@heym.run.

## Videod

Kõik Heym Worki videod on kogutud [Heym Worki esitusloendisse](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Seotud teemad

- [Enterprise](./enterprise.md): Ärilitsentsid ja tugi
- [Single Sign-On](./sso.md): Heym Worki kasutatav autentimislahendus
- [Human-in-the-Loop](./human-in-the-loop.md): Heym Workis kuvatavad ülevaatused
- [Auditilogimine](./audit.md): Ühenduse muutmisel salvestatavad logisündmused
- [Seaded](./user-settings.md): Asukoht, kus asub vahekaart Heym Work
