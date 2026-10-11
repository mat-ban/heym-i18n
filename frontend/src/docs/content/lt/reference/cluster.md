# Apkrovos paskirstymas

Nukreipkite antrąją Heym instanciją į tą pačią PostgreSQL duomenų bazę, ir ji prisijungs kaip darbuotojas. Fono workflow vykdymai tada bus dalijami tarp instancijų pagal nustatytą procentą, todėl mašina, teikianti UI ir API, nebus vienintelė mašina, vykdanti kiekvieną workflow.

Instancijos niekada nesikalba tarpusavyje. Postgres neša darbą, todėl darbuotojui nereikia atviro prievado, sertifikato ar kelio atgal į pagrindinę instanciją — tik prieigos prie duomenų bazės.

## Rolės

Vienas instancija yra **pagrindinė**, kurią nustato aplinkos kintamasis. Ji teikia UI, API, MCP ir pokalbių portalą, ir ji valdo failų saugyklą bei įdiegtus papildinius. Kiekviena kita instancija yra **darbuotojas**: ji pasiekia tik duomenų bazę ir vykdo fono vykdymus.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # arba: worker
HEYM_INSTANCE_NAME=EU Main    # rodymo etiketė, vėliau redaguojama iš Nustatymų
HEYM_INSTANCE_ID=eu-main      # neprivaloma; gauta iš pavadinimo, kai tuščia
```

Pagrindinė rolė yra atskirta nuo lyderio rinkimų. Heym jau pasirenka vieną lyderį visame klasteryje, kuris valdo cron, įspėjimų vertinimą ir avarijų atkūrimą; jei pagrindinė instancija sugenda, lyderystė perkelia į darbuotoją per kelias sekundes, o suplanuoti vykdymai toliau vyksta. Pagrindinė rolė nesikeičia, nes failų saugykla negali judėti kartu su ja.

## Kas gali palikti pagrindinę instanciją

Paskirstymas nustatomas iš workflow mazgų prieš pradedant vykdymą. Vykdymas lieka pagrindinėje instancijoje, kai bet kuris mazgas jame — įskaitant mazgus vidiniuose sub-workflow, kuriuos jis kviečia — liečia kažką, kas egzistuoja tik vienoje mašinoje:

| Mazgas | Kodėl jis lieka pagrindinėje |
|---|---|
| Codex, OpenCode Go | Kodo agento darbo aplinka lieka vietiniame diske, kad vėlesnis vykdymas galėtų tęstis |
| Agentas su prijungta įgūdžių | Įgūdžių kodas skaito ir rašo į Heym Drive |
| Drive, Converter, Google Drive | Jie skaito ir rašo sugeneruotus failus |
| Failo įkėlimo triggeris | Įkėlimas patenka į pagrindinės disko |
| Siųsti el. laišką | Įmonių SMTP relės dažnai leidžia vieną šaltinio adresą |
| Papildinių mazgai | Papildinys įdiegtas vienos instancijos diske |

**Viskas kitas yra paskirstyta** — įskaitant Kodo mazgą, Playwright ir Agent Python įrankius. Kiekviena instancija vykdo tą pačią vaizdą su savo Docker lizdu, todėl smėlio dėžė nėra priežastis išlaikyti vykdymą pagrindinėje, o tai yra labiausiai CPU reikalaujantys mazgai produkte.

Workflow, kurio sub-workflow pasirenkamas išraiška, negali būti tikrinamas iš anksto, todėl jis lieka pagrindinėje.

## Procentų pasirinkimas

Svoriai yra sveikieji skaičiai, nustatyti po **Nustatymai → Instancijos**. Jie yra **dalys tų instancijų, kurios šiuo metu gali priimti darbą**, o ne 100 procentų: planuotojas dalina pagal to baseino bendrą.

Šis skirtumas pasirodo, kai viena instancija iškrenta. Su `Main 41, Worker A 26, Worker B 33`, išjungus Worker B, lieka 67, todėl Main iš tikrųjų gauna 41/67 = **61%**, o Worker A 26/67 = **39%**. Panelei spausdinama efektyvi dalis po lentele būtent dėl šios priežasties, o išsaugojimas niekada nėra blokuojamas, nes skaičiai nesudaro 100 — tik dalis, kurioje nėra svorio, yra atmetama.

Dar dvi dalykai gali būti lengvai neteisingai suprasti.

**Procentas nėra mašinos galios dalis.** Jis apima tik vykdymus, kurie praeina per eilę. UI ir API aptarnavimas, srautinio redaktoriaus ir portalo vykdymai, bei failų įkėlimų tvarkymas yra visi pagrindinės darbo užduotys, ir nė vienas iš jų nėra skaičiuojamas. Pagrindinė daro daugiau, nei rodo jos skaičius.

**Pagrindinės procentas yra lubos, o ne grindys.** Vykdymai, kurie gali būti vykdomi tik pagrindinėje, yra įskaitomi į jos kvotą, todėl kai ta kvota išnaudojama, likę paskirstomi vykdymai pereina darbuotojams. Nustatyti pagrindinės skaičių žemai yra saugu — darbas, kuris turi vykti ten, vis tiek vyksta. Nustatyti jį aukštai bado darbuotojus.

Taigi, su stipria pagrindine ir mažesniu darbuotoju, pradėkite arčiau 60/40 nei mašinų žaliavų santykis, tada palyginkite realius vykdymo trukmes Traces skiltyje ir koreguokite.

Svoriai yra pernormalizuojami tarp šiuo metu gyvų ir įgalintų instancijų. Su `main=70, A=15, B=15`, jei A iškrenta, dalis tampa 70/85 ir 15/85 tarp pagrindinės ir B, ir grįžta į 70/15/15, kai A grįžta.

**Instancijai, kuri grįžta, nėra skolingi praleisti vykdymai.** Laikas, praleistas Offline, Disabled arba nesuderinamoje versijoje, nėra skaičiuojamas, todėl darbuotojas, kuris praleido naktį neprieinamas, vėl prisijungia prie baseino dabartinės padėties, o dalis vėl skaito 70/30 nuo pirmo vykdymo — jis neabsorbuoja kiekvieno vykdymo, kol pasivys. Darbuotojas, kuris buvo prieinamas visą laiką, vis tiek pasivys, kas ir daro pagrindinės procentą lubomis.

### Nauja instancija prisijungia su nuliu

Instancija, kuri niekada nebuvo suteikta svorio, pradeda nuo 0, kas paliktų ją Gyvą, Įgalintą ir nieko negaunančią. **Automatiškai suteikite naujoms instancijoms dalį** — pagal numatytuosius nustatymus, po instancijų lentele — tai išsprendžia: kitame lyderio praeityje naujokas gauna lygią dalį baseine, o esami svoriai sumažinami, išlaikant jų santykius tarpusavyje, todėl tyčia nustatytas 70/30 vis tiek skaitomas maždaug 70/30 po to. Iš viso lieka tiksliai 100.

Tai vyksta **vieną kartą per instanciją**. Tiek automatinis praeinimas, tiek jūsų redagavimas žymi instanciją kaip sukonfigūruotą, todėl instancija, kurią nustatėte patys, niekada nėra keičiama už Jūsų nugaros — įskaitant tą, kurią tyčia nustatėte į 0. Išjunkite nustatymą, jei norite, kad kiekviena nauja mašina lauktų Jūsų.

Tik įgalintos, gyvos ir suderinamos instancijos dalyvauja. Suteikus dalį mašinai, kuri negali vykdyti nieko, ta dalis būtų palikta be priežiūros.
### Kai procentai negali padėti

Nustatymų skydelyje pateikiama informacija, kiek iš paskutinių 24 valandų vykdymų galėjo būti vykdomi tik pagrindiniame mazge. Jei šis skaičius didelis — tai Codex ar Drive apkrovos — darbuotojai liks neveiksmingi, nesvarbu, ką rodo svoriai, ir sprendimas bus didesnis pagrindinis mazgas, o ne daugiau jų.

## PostgreSQL dydžio nustatymas klasteriui

Jungtys didėja kartu su mazgais, o ne tik vartotojais. Kiekvienas mazgas vykdo kelis uvicorn procesus, o kiekvienas procesas turi jungčių baseiną ir keturias `LISTEN` jungtis (nutraukimas, eilės pabudimai, vykdymo rezultatai, pokalbių srautai). Atviri pokalbių srautai dalijasi viena pokalbių jungtimi, todėl jie neprideda duomenų bazės jungčių. Trys mazgai klasteryje su numatytuoju `max_connections = 100` greitai pasieks ribą, ir tada Heym nepasieks savo duomenų bazės.

Apskaičiuokite maždaug `mazgai x procesai x (asinchroninis baseinas + sinchroninis baseinas + 4)` ir nustatykite `max_connections` virš šios vertės.

Sumažinkite baseinus, o ne tik didinkite lubas. Vienas diegimas pagal numatytuosius nustatymus turi 10+20 asinchroninių ir 5+10 sinchroninių jungčių kiekvienam procesui, kas yra dosnu vienam mazgui ir per daug klasteriui:

| Kintamasis | Vienas mazgas | Klasteris |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Pavyzdinis sudarymo failas nustato šiuos parametrus ir `max_connections = 300`. Tai sumažina dviejų mazgų klasterio 768 jungčių lubas iki 192, o trijų mazgų vis dar lieka po 300.

## Reikalavimai, kurių klasteris negali užtikrinti už Jus

**Kiekvienas mazgas turi naudoti tą patį `SECRET_KEY` ir `ENCRYPTION_KEY`.** Darbuotojas su kitu `ENCRYPTION_KEY` negali iššifruoti kredencialų, ir kiekvienas vykdymas, naudojantis kredencialus, nepavyks su klaida, nenurodant nieko naudingo. Heym palygina abiejų raktų santrauką kiekviename širdies plakime, kartu su programos versija ir duomenų bazės revizija, ir pažymi nesuderinamą mazgą kaip **Mismatch**, todėl jis negauna jokio darbo. Apkrova grįžta į pagrindinį mazgą, kol tai ištaisysite.

Tai taip pat apibrėžia atnaujinimo tvarką. Pirmiausia atnaujinus pagrindinį mazgą, visi darbuotojai bus pažymėti kaip nesuderinami; darbas grįžta į pagrindinį mazgą, o kiekvienas darbuotojas prisijungia, kai jis atnaujinamas. Lėtesnis, matomas ir atšaukiamas.

**Nukreipkite įėjimą tik į pagrindinį mazgą.** Apvalus robinas vartotojų srautą tarp mazgų siųs failo įkėlimą į vieną mašiną, o jo atsisiuntimą į kitą. Niekas kode to neapsaugo, nes darbuotojas vykdo tą pačią vaizdą ir atsakys į bet kokį gautą užklausimą.

**Kiekvienam mazgui reikia `FRONTEND_URL`, nustatyto į tą pačią viešą adresą.** Vykdymas, kuris sustoja žmogaus peržiūrai, sukuria savo peržiūros nuorodą tame mazge, kuris jį vykdė, o ne pagrindiniame, ir tas pats galioja Codex sekimo nuorodoms ir sugeneruotų failų atsisiuntimo URL. Darbuotojas, paliktas be jo, kuria tas nuorodas pagal savo vietinį adresą, ir kas nors, gavęs tokią nuorodą, negali jos atidaryti.

**Darbuotojų mazgai turi skirtingą išėjimo IP.** Bet kuri API, leidžianti šaltinio adresus, matys naują. Send Email veikia pagrindiniame mazge dėl šios priežasties; HTTP mazgui arba suteikite klasteriui vieną NAT išėjimo adresą, arba leiskite kiekvienam mazgui.

## Darbuotojo pridėjimas kitame kompiuteryje

`docker-compose.worker.yml` failas saugyklos šaknyje vykdo darbuotoją savo host'e. Jis neturi duomenų bazės ir vartotojo sąsajos: jis pasiekia pagrindinio mazgo PostgreSQL ir gauna savo dalį fono vykdymų.

Užpildykite šalia jo esančią `.env` - vaizdo žymą, duomenų bazės host'ą ir kredencialus, abu raktus ir mazgo ID - ir pradėkite jį. Sudarymas atsisako pradėti, kol visi reikalaujami parametrai nėra nustatyti, o ne pasirodo su užpildymu, kuris vėliau nepavyksta sunkiai skaitomu būdu.

Vaizdo žyma turi būti ta pati versija, kurią vykdo pagrindinis mazgas, ir abu raktai turi būti tiksliai nukopijuoti. Bet koks skirtumas rodo darbuotoją kaip Mismatch, ir jis negauna jokio darbo.

## Instancijų lentelės skaitymas

| Stulpelis | Reikšmė |
|---|---|
| Pavadinimas | Redaguojamas žymėjimas; jis uždedamas ant kiekvieno vykdymo, kurį vykdo šis mazgas |
| Rolė | `main` arba `worker`, iš aplinkos |
| Statusas | **Gyvas** su nauju širdies plakimu, **Išjungtas** po 30 sekundžių tylos, **Mismatch**, kai versija, duomenų bazės revizija ar raktai skiriasi nuo pagrindinio mazgo |
| ms | Apskaitos laikas nuo to mazgo iki duomenų bazės, matuojamas paties mazgo |
| On | Pašalina darbuotoją iš rotacijos, nesustabdydamas jo — vykdomi vykdymai baigiasi, nauji nebepriskiriami. Užrakinta pagrindiniam mazgui: failų, papildinių ir kodavimo agentų darbo vykdymai vyksta ten, nesvarbu, ką rodo perjungimas |
| Svoris | Jo dalis paskirstomų vykdymų |

## Vykdymo istorija

Kiekvienas vykdymas vykdymo istorijoje nurodo mazgą, kuris jį vykdė, o abu istorijos dialogai gali filtruoti iki vieno mazgo. Filtras atitinka mazgo ID, rodydamas jo pavadinimą, todėl pervadinus mazgą, nesikeičia tai, ką sako seni vykdymai.

Nieko apie tai nepasirodo vieno mazgo diegime: laukai tušti, žymėjimas nerodomas, ir filtras nesiūlomas.
## Klaidų elgesys

**Jei darbininkas miršta vykdymo metu**, jo širdies plakimas pasensta, o lyderio esamas atkūrimo procesas pakartoja vykdymą gyvame egzemplioriuje. Eilutė, kurią jis buvo užėmęs, yra atšaukta atskirai: kai nebelieka aktyvaus vykdymo ir praėjo dvi minutės malonės laikotarpis, lyderis pažymi eilutę kaip nesėkmingą ir pažadina tuos, kurie laukė rezultato. Amžius niekada nėra priežastis, todėl teisėtai ilgas vykdymas paliekamas ramybėje; eilutė pažymima kaip nesėkminga, o ne vėl įtraukiama į eilę, nes atkūrimas jau valdo pakartojimą, o vėl įtraukti būtų tas pats workflow vykdomas du kartus.

**Jei pagrindinis mazgas sugenda**, cron toliau veikia iš darbininko, o paskirstomi vykdymai tęsiasi. Vykdymai, kuriems reikia pagrindinio mazgo, kaupiasi ir laukia, o kai jis grįžta, jie išsikrauna — tačiau tik per klaidų malonės langą (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, numatytasis 600 sekundžių). Viskas, kas senesnė, uždaroma kaip praleista, su priežastimi, užfiksuota, o ne atkuriant valandas atidėjimo vienu metu.

UI, API, MCP ir redaktorius yra neprieinami, kol pagrindinis mazgas neveikia, nes tai yra įėjimo taškai.

## Susiję

- [Vykdymas ir diegimas](../getting-started/running-and-deployment.md) – Pirmiausia diekite vieną egzempliorių; aplinkos kintamieji ir raktų nustatymai yra ten
- [Nustatymai](./user-settings.md) – Egzempliorių skirtukas ir kas gali jį matyti
- [Vykdymo pėdsakai](../tabs/traces-tab.md) – Palyginkite realius vykdymo trukmės skirtumus tarp egzempliorių prieš keisdami padalijimą
- [Saugumas](./security.md) – Kodėl kiekvienas egzempliorius turi dalintis `SECRET_KEY` ir `ENCRYPTION_KEY`
