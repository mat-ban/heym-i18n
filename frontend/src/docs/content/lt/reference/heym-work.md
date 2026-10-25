# Heym Work

**Heym Work** yra antroji sąsaja verslo komandoms, sukurta Heym pagrindu. Vartotojai apibūdina užduotį savais žodžiais, atsako į keletą klausimų ir gauna Heym sukurtą bei išbandytą workflow. Jie dirba specialiai jiems sukurtuose puslapiuose, tvarko peržiūras ir mato kiekvieną vykdymą su atsakingo asmens vardu. Heym kiekvieną užduotį atlieka fone.

Heym Work veikia kaip atskiras konteineris šalia Heym su atskira Heym komandos licencija. Sužinokite daugiau ir paprašykite bandomosios versijos adresu [heym.run/enterprise](https://heym.run/enterprise). Pažiūrėkite [Heym Work vaizdo įrašą](https://youtu.be/5Z2gGo6bcpU) ir susipažinkite per dvi minutes.

## Ką gauna verslo komandos

| Sritis | Paskirtis |
|--------|-----------|
| **Chat** | Apibūdinkite užduotį tekstu arba balsu. Heym paklausia reikiamos informacijos, sukuria workflow, jį išbando ir pažymi kaip Patvirtinta. |
| **Flows** | Redaktoriai kuria flow iš pasirinkimų, o ne drobėje: kas jį paleidžia, pasirenkamas AI juodraštis ir veiksmai programose Slack, Google Sheets bei el. pašte. Slack atsakymai tęsia vykdymą, o patvirtinimai taip pat laukia Veikloje. Žr. [Flows](#flows). |
| **Puslapiai** | Prisegti valdiklių puslapiai: skaitinės reikšmės, diagramos, lentelės su būsenos žymomis, failų įkėlimo sritys ir patvirtinimai. Lentelės eilutė gali atidaryti atskirą išsamios informacijos puslapį. |
| **Patvirtinimai** | [Human-in-the-Loop](./human-in-the-loop.md) žingsnių peržiūros laukia skiltyje Veikla ir puslapiuose su parinktimis Patvirtinti, Prašyti pakeitimų ir Atmesti. |
| **Veikla** | Kiekvienas vykdymas kartu su jį paleidusiu asmeniu ir vykdžiusia instancija. |
| **Vaidmenys** | Savininkas, Redaktorius ir Žiūrovas. Prisijungiama naudojant [Single Sign-On](./sso.md), kurį Heym jau taiko. |
| **Pramonės šakų leidimai** | Teisės, švietimo, finansų, logistikos, energetikos ir el. prekybos leidimai atveriami su paruoštais puslapiais, pavyzdiniais duomenimis ir šakai pritaikytais workflows. |

## Flows

**Flows** yra Heym Work meniu Redaktoriams ir Savininkams. Flow sudedamas iš pasirinkimų, o ne mazgų, ir Heym Work išsaugo jį kaip įprastą Heym workflow per Heym API jį sukūrusio asmens vardu. Prieigos taisyklės, redagavimo istorija ir trigerių sinchronizavimas taikomi kaip ir redaktoriuje, o kiekvienas vykdymas rodomas Veikloje kaip ir bet kuris kitas.

| Dalis | Pasirinkimai |
|---|---|
| **Kas jį paleidžia** | Pagal pareikalavimą, pagal tvarkaraštį, gavus Slack pranešimą, pasikeitus Google Sheets skirtukui (pridėtos, pakeistos ar ištrintos eilutės) arba el. laiškui pasiekus pašto dėžutę. Skaičiuoklių ir el. pašto trigeriai tikrina kas 1, 5, 15 arba 60 minučių. |
| **AI juodraštis** (neprivaloma) | Modelis ir instrukcijos paverčia tai, kas paleido flow, tekstu tolesniems žingsniams. Flow, kuris neprasideda nuo skaičiuoklės ar el. laiško, pirmiausia gali perskaityti naujausius Slack pranešimus iš kanalo ar gijos. |
| **Kas vyksta toliau** | Veiksmai iš eilės bet kuriame iš trijų įrankių, nesvarbu, kas paleido flow. **Slack:** kanalo pranešimas, tiesioginis pranešimas, forma, pranešimas su mygtukais, patvirtinimas, atsakymas į giją, pranešimo atnaujinimas ir galutinis rezultatas. **Google Sheets:** pridėti eilutę arba atnaujinti pakeistą eilutę. **El. paštas:** išsiųsti el. laišką. |

- **Atsakymai tęsia vykdymą.** Patvirtinimas, mygtukai arba forma pristabdo vykdymą, kol kas nors atsakys Slack. Patvirtinimas taip pat laukia Veikloje, o sprendimas bet kurioje vietoje pašalina mygtukus iš Slack pranešimo. Vėlesni Slack žingsniai lieka pirmojo pranešimo gijoje.
- **Viena Ryšių kortelė.** Kiekvienas flow rodo Slack darbo erdvę, Google Sheets paskyrą ir pašto dėžutes, iš kurių skaito ir siunčia. Tai Heym kredencialai: **Slack Bot** (boto prieigos raktas, `xoxb-…`), **Google Sheets**, **IMAP** ir **SMTP**; trūkstamą kredencialą galima pridėti tiesiai iš paties flow.
- **Viena Slack programa kiekvienam flow.** Slack programoje nustatykite Interaktyvumo užklausos URL į `https://<jūsų Heym>/api/slack/interactions/<kredencialo id>` ir Įvykių prenumeratų užklausos URL į `https://<jūsų Heym>/api/slack/events/<kredencialo id>`. Heym Work rodo abu pasirinktam ryšiui. Visi flow su tuo kredencialu jais dalijasi.
- **Slack trigeriai pasirenka, ko klausytis:** pranešimų kanaluose ir DM, tiesioginių pranešimų botui, boto paminėjimų arba pranešimų viename kanale. Paties boto įrašai niekada nepaleidžia flow.
- **Reikalavimai.** Flows reikalinga Heym 0.0.131 arba naujesnė versija.

Žingsniai, kuriuos sukuria flow, yra tie patys mazgai, kuriuos galite naudoti drobėje: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) ir [Cron](../nodes/cron-node.md).

## Heym Work prijungimas

Peržiūrėkite [diegimo vaizdo įrašą](https://youtu.be/zXGfg1HPSLk), kuriame parodytas visas diegimo procesas nuo pirmosios komandos iki pagrindinio puslapio.

Ryšys konfigūruojamas skiltyje **Nustatymai → Heym Work**. Ši kortelė rodoma tik egzemplioriaus administratoriams, nurodytiems kintamajame `HEYM_ADMIN_EMAILS`.

| Laukas | Paskirtis |
|--------|-----------|
| **Heym Work adresas** | Vieta, kurioje veikia Heym Work, pavyzdžiui, `https://work.example.com`. Prisijungus grįžtama čia. Paspauskite **Išsaugoti**. |
| **Integracijos raktas** | Mygtukas **Generuoti raktą** sukuria raktą, kurį Heym Work naudoja kiekvienai Heym užklausai. Jis parodomas tik vieną kartą kartu su kopijavimo mygtuku. Heym išsaugo tik jo maišos (hash) kodą. |
| **Įgalinti Heym Work** | Įjungia ryšį. Prieš tai reikalauja nurodyti adresą ir raktą. |
| **Pramonės ir komandų leidimai** | Teisės, švietimo, finansų, logistikos, energetikos ir el. prekybos leidimai, taip pat IT, pardavimų, rinkodaros ir personalo leidimai įmonių komandoms atidaromi su puslapiais, pavyzdiniais duomenimis ir workflowais šiam darbui. |

Tada atidarykite Heym Work adresą ir užbaikite konfigūravimą:

1. **Licencija**: įveskite Heym komandos suteiktą licencijos raktą.
2. **Heym**: įveskite Heym adresą ir integracijos raktą.
3. **Savininkas**: prisijunkite su paskyra, nurodyta kaip Heym Work savininkas.

Atidaromas pagrindinis puslapis, paruoštas komandos darbui.

### Rakto keitimas

Parinktis **Pakeisti raktą** pakeičia integracijos raktą. Heym Work sustabdo veikimą, kol ten neįvedamas naujas raktas, o visi prisijungę Heym Work vartotojai atjungiami. Naudokite šį veiksmą, jei įtariamas rakto nutekėjimas arba iš komandos išeina asmuo, kuris jį matė.

### Ryšio išjungimas

Išjunkite parinktį **Įgalinti Heym Work**, kad nutrauktumėte ryšį. Heym Work vėl paprašys Heym rakto. Heym bet kuriuo atveju toliau vykdo visus workflows, tvarkaraščius ir webhooks.

## Saugumo modelis

- **Kiekvienas pakeitimas atliekamas per Heym.** Heym Work nuskaito rodomus duomenis iš Heym duomenų bazės ir siunčia kiekvieną veiksmą į Heym raktu apsaugotu kanalu, kuriame Heym taiko savo prieigos taisykles. Heym Work saugo savo duomenis atskiroje schemoje `heym_work`.
- **Raktas saugykloje yra apsaugotas maiša.** Heym palygina pateikto rakto maišos kodą ir niekada nesaugo rakto atviru tekstu.
- **Prisijungimas lieka Heym žinioje.** Vartotojai jungiasi per Heym naudodami jūsų tapatybės teikėją, kai įjungtas [SSO](./sso.md).
- **Pakeitimai yra audituojami.** Išsaugojus ryšį ir pakeitus raktą, [audito žurnale](./audit.md) įrašomi įrašai `work_integration.update` ir `work_integration.key_rotate`.

## Licencijavimas

Heym Work reikalingas atskiras Heym komandos išduotas licencijos raktas. Kiekvieną dieną Heym Work siunčia į heym.run savo licencijos ID, diegimo ID, aktyvių vartotojų skaičių per pastarąsias 30 dienų, bendrą narių skaičių, paleidimų skaičių per pastarąsias 24 valandas bei Heym ir Heym Work versijas. Darbo eigų turinys, įvestys, išvestys ir prisijungimo duomenys lieka jūsų serveriuose.

Jei kasdienis sinchronizavimas nepavyksta 30 dienų iš eilės, prasideda 14 dienų lengvatinis laikotarpis, po kurio Heym Work sąsaja paprašo Savininko įvesti raktą. Bandomasis laikotarpis tęsiasi iki paskutinės dienos ir atnaujinamas, kai Heym komanda jį pratęsia (leidžiamas vienas bandomasis laikotarpis vienam diegimui). Pats Heym veikia be pertrūkių visą šį laiką. Tinklai be interneto prieigos naudoja neprisijungus veikiančią licenciją adresu enterprise@heym.run.

## Vaizdo įrašai

Visi Heym Work vaizdo įrašai pateikiami [Heym Work grojaraštyje](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Susijusios temos

- [Enterprise](./enterprise.md): Komercinis licencijavimas ir palaikymas
- [Single Sign-On](./sso.md): Prisijungimo būdas, kurį naudoja Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Peržiūros, rodomos Heym Work
- [Audito žurnalas](./audit.md): Įrašai, generuojami keičiant ryšio nustatymus
- [Nustatymai](./user-settings.md): Kur yra Heym Work kortelė
