# Workflow organizavimas

Heym leidžia organizuoti darbo eigas aplankuose, kurti poaplankius ir suplanuoti darbo eigos ištrynimą. Daugiau informacijos rasite [Darbo eigos skirtuke](../tabs/workflows-tab.md).

## Aplankai ir poaplankiai

Aplankai sudaro medį. Kiekvienas aplankas turi:

- **Pavadinimas** – Rodomas pavadinimas
- **Tėvas** – `parent_id` nuoroda į kitą aplanką; `null` reiškia šaknį
- **Darbo eigos** – Darbo eigos gali būti perkeltos į aplankus per `folder_id`

### API

| Endpoint | Paskirtis |
|----------|-----------|
| `GET /folders` | Tik šakniniai aplankai |
| `GET /folders/tree` | Pilnas medis (vaikai + darbo eigos) |
| `GET /folders/{id}` | Vienas aplankas su turiniu |
| `POST /folders` | Sukurti aplanką (`parent_id` neprivalomas) |
| `PUT /folders/{id}` | Atnaulinti pavadinimą arba `parent_id` |
| `DELETE /folders/{id}` | Ištrinti aplanką (kaskadinė) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Perkelti darbo eigą į aplanką |
| `DELETE /folders/workflows/{workflow_id}/folder` | Pašalinti darbo eigą iš aplanko |
| `GET /folders/{id}/export` | Atsisiųsti aplanką + visus poaplankius kaip ZIP |

### Medžio struktūra

Medžio atsakymas apima `children` ir `workflows` kiekvienam aplankui. Bendrinamos darbo eigos gali pasirodyti aplanke per `WorkflowShare.folder_id`.

## Darbo eigos bendrinimas

Atidarykite **Bendrinkti** darbo eigos redaktoriuje, kad pakviestumėte vartotojus el. paštu arba bendrintumėte su [komanda](./teams.md). Kiekvienas kvietimas ir kiekvienas komandos bendrinimas turi leidimą:

| Leidimas | Ką gali daryti bendradarbis |
|----------|------------------------------|
| **Skaityti** | Atidaryti darbo eigą, ją apžiūrėti, peržiūrėti vykdymo istoriją ir ją vykdyti. Redaktorius atsidaro tik skaitymo režimu: Išsaugoti yra išjungta, o drobė negali būti keičiama. |
| **Rašyti** | Viskas, ką leidžia Skaityti, plius redaguoti drobę, nustatymus, analizės dokumentą ir agento atmintį. |

Leidimas rodomas šalia kiekvieno įrašo Bendrinimo dialoge ir gali būti keičiamas bet kuriuo metu iš šio išskleidžiamojo meniu, nepašalinant ir neperduodant bendrinimo. Kai vartotojas pasiekia darbo eigą per kelis kelius (tiesioginis bendrinimas ir viena ar daugiau komandų), **aukščiausias** leidimas laimi. Bendrinimai, kurie egzistavo prieš leidimų įvedimą, yra **Rašyti**, o API klientai, kurie praleidžia `permission`, taip pat gauna **Rašyti**.

Veiklos, skirtos tik savininkui, niekada nepriklauso nuo leidimo: darbo eigos ištrynimas, versijų atstatymas ar išvalymas, istorijos išvalymas, bendrinimų valdymas ir [savininkui skirti nustatymai](#owner-only-settings) žemiau lieka su savininku net ir **Rašyti** bendradarbiams. **Skaityti** bendradarbis, kuris siunčia redagavimą per API (`PUT /api/workflows/{id}`, analizės pastaba, agento atmintis, talpyklos išvalymas) arba per AI Asistentą, gauna `403` su pranešimu `Jūs turite tik skaitymo prieigą prie šios darbo eigos`.

Bendrinant darbo eigą suteikiama prieiga prie drobės, vykdymo istorijos ir analizės dokumento. Tai **ne** automatiškai bendrina:

- **Kredencialai**, į kuriuos nuorodą turi mazgai darbo eigoje
- **Po-darbo eigos**, kurios yra kviečiamos per [Execute](../nodes/execute-node.md) mazgus arba agentus

Gavėjams reikia, kad šie kredencialai ir vaikai darbo eigos būtų bendrinami atskirai (tos pačios vartotojų ar komandų grupės). Bendrinkite kredencialus iš [Kredencialų skirtuko](../tabs/credentials-tab.md); žr. [Kredencialų bendrinimą](./credentials-sharing.md). Bendrinkite kiekvieną po-darbo eigą iš jos pačios redaktoriaus bendrinimo dialogo.

### Savininkui skirti nustatymai

Visas **Vykdyti su cURL** konfigūracija lieka su savininku po bendrinimo. Bendradarbiai vis tiek gali atidaryti dialogą ir kopijuoti sugeneruotą komandą, tačiau valdikliai yra tik skaitymo režimu.

Bet koks šių keitimas kaip ne savininkui yra atmetamas su `403`:

- **Autentifikacija** (`auth_type`) ir **Antraštės raktas** (`auth_header_key`)
- **Užklausos kūno** režimas (`webhook_body_mode`) ir **Užklausos metodas** (`http_method`)
- **Atsakymo talpykla** (`cache_ttl_seconds`) ir **Greitis** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE srautas** (`sse_enabled`, `sse_node_config`)

**Antraštės reikšmė** (`auth_header_value`) elgiasi kitaip: ji visiškai paslėpta nuo bendradarbių, o bendradarbio rašymas ignoruojamas, o ne atmetamas. Redaktorius rodo lauką užmaskuotą, todėl `403` ten sugadintų įprastą išsaugojimą, o ne signalizuotų apie ataką.

Autentifikacija yra priežastis, kodėl blokas yra skirtas tik savininkui: `Anonymous` leidžia neautentifikuotiems skambintojams vykdyti darbo eigą, o vykdymas be prisijungusio skambintojo išsprendžia kredencialus ir globalius kintamuosius kaip **savininką**, o ne skambintoją. Likusi bloko dalis yra paskelbtas užklausos kontraktas ir savininko kaštų valdymas, todėl ji juda su juo.

**Klaidos atveju vykdyti darbo eigą** (`error_workflow_id`) darbo eigos lygio **Savybėse** yra tik savininkui, dėl tos pačios priežasties: [klaidos darbo eiga](./features.md#error-workflow) vyksta su nesėkmingo vykdymo kredencialais ir globaliais kintamaisiais, kurie yra savininko užduotims ir anoniminiams vykdymams. Bendradarbiai mato nustatymą tik skaitymo režimu, o pridėjimas, pakeitimas ar išvalymas kaip ne savininkui yra atmetamas su `403`.

Drobės, pavadinimo ir aprašymo redagavimas nėra paveiktas.

### Vykdymo tokenai

Bendradarbis gali sukurti vykdymo tokeną darbo eigai, su kuria jis buvo bendrinamas. Vykdymas priskiriamas **tam, kas sukūrė tokeną**, todėl jis naudoja to vartotojo kredencialus ir globalius kintamuosius, o ne savininko. Tik tikrai anoniminis skambinimas — `auth_type: anonymous` be skambintojo — vyksta savininko kontekste.

## Suplanuota ištrynimui

Darbo eigos gali būti suplanuotos ištrynimui, o ne iš karto pašalinamos.

- **Laukas**: `scheduled_for_deletion` (nullable datetime)
- **Elgsena**: Kai nustatyta, darbo eiga perkeliama į `folder_id = null` ir pasirodo "Suplanuota ištrynimui" skyriuje.
### API

| Endpoint | Paskirtis |
|----------|-----------|
| `PUT /workflows/{id}/schedule-deletion` | Nustatyti `scheduled_for_deletion`, išvalyti `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Išvalyti `scheduled_for_deletion` (atkurti) |

### UI

- **Vilkti į šiukšliadėžę** – Perkelkite workflows į "Scheduled for Deletion" sritį, kad juos suplanuotumėte
- **Atkurti** – Pašalinti iš tvarkaraščio
- **Ištrinti iš karto** – Šiukšliadėžės piktograma nuolatiniam pašalinimui

### Valymo logika

Cron užduotis vykdoma kasdien **23:59** (konfigūruota laiko zona). Workflow bus ištrintas tik tada, kai:

- **Visi pradžios mazgai** (mazgai be įeinančių briaunų, neįskaitant sticky/errorHandler) turi `active === false`

Jei bet kuris pradžios mazgas vis dar aktyvus, workflow liks iki kito vykdymo.

## Dashboard UI

- **Katalogų eilutės** – Naujas katalogas, rekursyvi katalogų struktūra su plėtimais/suspaudimais. Kiekvienas katalogas turi neprivalomą aprašymą po pavadinimu ir ženkliuką, skaičiuojantį jame esančius workflows, įskaitant subkatalogus.
- **Katalogo veiksmai** – Naujas subkatalogas, pervadinti, pakeisti piktogramą, atsisiųsti kaip ZIP ir ištrinti yra pateikti kiekvienoje katalogo eilutėje; dešiniuoju pelės mygtuku atidaromas kontekstinis meniu siūlo tą pačią rinkinį, o telefonai rodo vieną meniu mygtuką.
- **Pagrindinė sritis** – Šaknies workflows (be katalogo, nesuplanuoti) ir Scheduled for Deletion
- **Katalogo numatymas** – Vilkdami workflow, išryškinamas tikslus katalogas arba subkatalogas ir rodomas jo pilnas kelias kortelės dydžio peržiūroje. Suspaustas katalogas išsiplečia po trumpo užlaikymo.
- **Stabilus vilkimo atsiliepimas** – Šaltinio kortelė naudoja vilkimo ghost, o aktyvus numatytasis taškas lieka pasirinktas, kol slenkama arba kertama valdikliai tame pačiame kataloge.
- **Tikslo patikrinimas** – Dabartinis katalogas rodomas kaip **Already in Folder** ir nepriima perteklinio perkėlimo.
- **Kitos numatytos zonos** – Šaknies ir "Scheduled for Deletion" išryškinamos, kai gali priimti vilkimą workflow.
- **ZIP numetimas** – Numeskite ZIP failą į workflow sritį, kad importuotumėte katalogų struktūrą šaknies lygyje

## Susiję

- [Workflows Tab](../tabs/workflows-tab.md) – Kurti ir valdyti workflows
- [Credentials Sharing](./credentials-sharing.md) – Dalintis kredencialais su workflow bendradarbiais
- [Teams](./teams.md) – Dalintis workflows ir kredencialais su komandomis
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, mazgai ir vykdymas
- [Workflow Structure](./workflow-structure.md) – JSON formatas workflows
- [Triggers](./triggers.md) – Pradžios mazgai ir įėjimo taškai
