# Heym Work

**Heym Work** yra antroji sąsaja verslo komandoms, sukurta Heym pagrindu. Vartotojai apibūdina užduotį savais žodžiais, atsako į keletą klausimų ir gauna Heym sukurtą bei išbandytą workflow. Jie dirba specialiai jiems sukurtuose puslapiuose, tvarko peržiūras ir mato kiekvieną vykdymą su atsakingo asmens vardu. Heym kiekvieną užduotį atlieka fone.

Heym Work veikia kaip atskiras konteineris šalia Heym su atskira Heym komandos licencija. Sužinokite daugiau ir paprašykite bandomosios versijos adresu [heym.run/enterprise](https://heym.run/enterprise). Pažiūrėkite [Heym Work vaizdo įrašą](https://youtu.be/5Z2gGo6bcpU) ir susipažinkite per dvi minutes.

## Ką gauna verslo komandos

| Sritis | Paskirtis |
|--------|-----------|
| **Chat** | Apibūdinkite užduotį tekstu arba balsu. Heym paklausia reikiamos informacijos, sukuria workflow, jį išbando ir pažymi kaip Patvirtinta. |
| **Puslapiai** | Prisegti valdiklių puslapiai: skaitinės reikšmės, diagramos, lentelės su būsenos žymomis, failų įkėlimo sritys ir patvirtinimai. Lentelės eilutė gali atidaryti atskirą išsamios informacijos puslapį. |
| **Patvirtinimai** | [Human-in-the-Loop](./human-in-the-loop.md) žingsnių peržiūros laukia skiltyje Veikla ir puslapiuose su parinktimis Patvirtinti, Prašyti pakeitimų ir Atmesti. |
| **Veikla** | Kiekvienas vykdymas kartu su jį paleidusiu asmeniu ir vykdžiusia instancija. |
| **Vaidmenys** | Savininkas, Redaktorius ir Žiūrovas. Prisijungiama naudojant [Single Sign-On](./sso.md), kurį Heym jau taiko. |
| **Pramonės šakų leidimai** | Teisės, švietimo, finansų, logistikos, energetikos ir el. prekybos leidimai atveriami su paruoštais puslapiais, pavyzdiniais duomenimis ir šakai pritaikytais workflows. |

## Heym Work prijungimas

Peržiūrėkite [diegimo vaizdo įrašą](https://youtu.be/zXGfg1HPSLk), kuriame parodytas visas diegimo procesas nuo pirmosios komandos iki pagrindinio puslapio.

Ryšys konfigūruojamas skiltyje **Nustatymai → Heym Work**. Ši kortelė rodoma tik egzemplioriaus administratoriams, nurodytiems kintamajame `HEYM_ADMIN_EMAILS`.

| Laukas | Paskirtis |
|--------|-----------|
| **Heym Work adresas** | Vieta, kurioje veikia Heym Work, pavyzdžiui, `https://work.example.com`. Prisijungus grįžtama čia. Paspauskite **Išsaugoti**. |
| **Integracijos raktas** | Mygtukas **Generuoti raktą** sukuria raktą, kurį Heym Work naudoja kiekvienai Heym užklausai. Jis parodomas tik vieną kartą kartu su kopijavimo mygtuku. Heym išsaugo tik jo maišos (hash) kodą. |
| **Įgalinti Heym Work** | Įjungia ryšį. Prieš tai reikalauja nurodyti adresą ir raktą. |
| Būsena | **Paskutinį kartą matytas**, **Work versija** ir **Licencija**, kaip paskutinį kartą pranešė Heym Work. |

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
