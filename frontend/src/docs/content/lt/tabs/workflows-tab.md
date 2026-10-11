# Workflows Skirtis

**Workflows** skirtis yra numatytoji informacijos suvestinė. Jis rodo jūsų workflow sąrašą, aplankų struktūrą ir leidžia kurti, redaguoti bei organizuoti workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Žiūrėti Workflows demonstraciją</a></p>

## Pradėti Pokalbį

Virš workflow sąrašo yra pokalbių langelis, kuris pasveikina Jus vardu ir klausia, ką norite automatizuoti. Įveskite prompt, pasirinktinai pridėkite vieną failą ir pasirinkite norimus kredencialus bei modelį. Abu išskleidžiamieji sąrašai yra paieškos galimybė ir prasideda nuo Jūsų [AI numatytųjų nustatymų](../reference/user-settings.md).

Siuntimas sukuria naują pokalbį ir atidaro jį [Chat skirtis](./chat-tab.md), kur atsakymas bus perduodamas. Palaikomi priedai yra tekstiniai failai, vaizdai ir PDF, po vieną žinutėje, kaip ir pokalbių kūrėjas.

Jei dar neturite LLM kredencialo, langelis rodo nuorodą į [Kredencialų skirtį](./credentials-tab.md), o siuntimas lieka neaktyvus.

Paspauskite **x**, kad paslėptumėte langelį. Tada šalia Workflows antraštės pasirodo **Ask AI** mygtukas, kuris jį atneša atgal. Pasirinkimas įsimenamas Jūsų naršyklėje.

## Workflow Sąrašas

Sąrašas yra dviejų panelių vaizdas: workflows ir aplankai kairėje, pasirinkto workflow peržiūra dešinėje.

- Kiekviena eilutė rodo workflow ikoną, pavadinimą, aprašymą, kada jis buvo paskutinį kartą atnaujintas, ir [būsenos žetoną](#workflow-status)
- Workflows gali būti šaknyje arba aplankuose, o prisegti workflows pasirodo savo **Prisegtų** grupėje viršuje
- **Paspauskite** eilutę, kad ją pasirinktumėte ir įkeltumėte jos peržiūrą dešinėje
- **Dvigubai paspauskite** eilutę arba paspauskite **Enter**, kai ji yra pasirinkta, kad atidarytumėte ją [redaktoriuje](../getting-started/quick-start.md)
- Naudokite **Ctrl+click** (arba **Cmd+click**), kad atidarytumėte naujame skirtuke
- Kiekviena eilutė turi savo redagavimo, kopijavimo, prisegimo ir trynimo veiksmus dešinėje. Telefonuose jie yra paslėpti, kad pavadinimas užimtų visą plotį; **ilgai paspauskite** eilutę ten, kad atidarytumėte veiksmų sąrašą
- Prisegkite dažnai naudojamus workflows [Greitame Dėkle](../reference/quick-drawer.md), kad galėtumėte juos greitai vykdyti iš Workflows skirsnio ir kitų vidinių puslapių

## Workflow Peržiūra

Pasirinkus workflow, užpildoma peržiūros panelė šalia sąrašo. Ekranuose, kurių plotis mažesnis nei 1280px, ta pati panelė atsidaro kaip lapas iš ekrano apačios.

Panelė rodo:

- Workflow pavadinimą, kas jį sukūrė ir kada, ir kada jis buvo paskutinį kartą redaguotas
- **Atidaryti Workflow** – atidaro workflow redaktoriuje
- **Vykdyti Dabar** – atidaro workflow [Greitame Dėkle](../reference/quick-drawer.md), kur užpildote jo įvestis ir pradedate vykdymą neišėję iš sąrašo
- **Aprašymas** – workflow aprašymas
- **Trigger Konfigūracija** – cron workflow tvarkaraštis arba klausantis triggeris įvykio workflow. Workflows, kurie yra kviečiami per HTTP, rodo **Kopijuoti cURL** mygtuką vietoj žaliavos endpoint ir auth teksto: jis kopijuoja visą užklausą su teisingu URL, antraštėmis, auth vieta ir kūnu, sudarytu iš workflow įvesties laukų. Kai workflow paskelbia [portalą](../reference/portal.md), jo vieša pokalbio nuoroda taip pat pasirodo čia
- **Paskutinio Vykdymo Detalės** – rezultatas ir trukmė paskutinio vykdymo arba pastaba, kad workflow niekada nebuvo vykdytas
- **Workflow Žingsniai & Sub-agentai** – mazgai vykdymo tvarka, kiekvienas su savo modeliu, operacija ar tvarkaraščiu ir taškas, rodantis, ar jis yra aktyvus. Pasirinkus žingsnį, atidaromas tas mazgas redaktoriuje su jau atidaryta jo savybių panelė

Panelė lieka prisegta šalia sąrašo, kol slenkate, todėl ji išlieka skaitoma ilgame workflow sąraše.
## Instance Administration

`HEYM_ADMIN_EMAILS` sąraše nurodyti vartotojai gali peržiūrėti, atidaryti, redaguoti, tikrinti vykdymo istoriją ir ištrinti bet kurį workflow instancijoje be dalijimosi ar nuosavybės perdavimo. Nustatymas yra kableliais atskirtas el. pašto adresų sąrašas, kuris atitinka atvejų nesvarbu. Tuščias sąrašas nesuteikia niekam šio prieigos. Po pakeitimo reikia perkrauti backend'ą.

Administratoriai mato savininko el. pašto adresą workflow sąraše ir gali ieškoti pagal šį adresą. Pasirinkite workflow, kad atidarytumėte **Instance administration** jo peržiūroje:

1. **Pause triggers** rodomas tik workflow, kuriuose yra Cron mazgas. Tai išjungia workflow Cron ir kitus automatinio iškvietimo mazgus per įprastą versijuotą išsaugojimą. Esami vykdymai gali užbaigti. Rankiniai, API, portalų ir sub-workflow iškvietimai lieka prieinami; ši veika nėra workflow lygio vykdymo užraktas.
2. Mygtukas keičiasi į **Resume triggers**, kol jis yra sustabdytas, įskaitant po puslapio perkrovimo. Resume vėl įjungia administratoriaus sustabdytus iškvietimus ir palieka jau išjungtus iškvietimus nepakitusius. Senesniems sustabdytam workflow, neturintiems išsaugotos administratoriaus sustabdymo būsenos, Resume įjungia jų automatinį iškvietimą.
3. Naudokite workflow eilutės **Delete workflow** veiksmą, kai vykdymai jau yra stabilizuoti. Ištrynimas grąžina konfliktą, kol vykdomi, laukia arba yra peržiūrai. Planuojamas ištrynimas taiko tą patį patikrinimą.

Sustabdykite iškvietimus ir leiskite esamiems vykdymams užbaigti prieš ištrindami. Iškvietimas, jau išsiųstas sustabdymo metu, vis tiek gali užbaigti. Naudokite ištrynimą, kai workflow daugiau neturi būti pasiekiamas.

Savininko tik webhook slaptažodžiai ir autentifikavimo nustatymai išlaiko esamas apsaugas. Administravimas neperduoda nuosavybės ar nesidalina savininko kredencialų įrašais. Administraciniai sustabdymai, atnaujinimai, ištrynimai ir planavimo veiksmai pasirodo [audit trail](../reference/audit.md) su veikiančiu administratoriumi ir workflow savininku.

## Workflow Status

Kiekviena eilutė turi statuso žetoną, gautą iš workflow iškvietimo mazgų, jo gyvo vykdymo būsenos ir — workflow, neturinčių iškvietimo mazgo — kaip buvo pradėtas jo paskutinis vykdymas:

| Status | Meaning |
| --- | --- |
| **Running** | Workflow šiuo metu vykdomas |
| **Scheduled** | Jis turi aktyvų [cron](../nodes/cron-node.md) iškvietimą |
| **Listening** | Jis turi aktyvų įvykio iškvietimą, pvz., Slack, Telegram, IMAP ar WebSocket iškvietimą |
| **Paused** | Jis turi iškvietimo mazgus, tačiau visi jie yra deaktyvuoti |
| **API** | Jis neturi iškvietimo mazgų ir paskutinį kartą buvo vykdomas HTTP skambučiu į jo vykdymo endpoint'ą |
| **SubWorker** | Jis neturi iškvietimo mazgų ir paskutinį kartą buvo vykdomas kaip sub-workflow tėvinio workflow |
| **Portal** | Jis neturi iškvietimo mazgų ir paskutinį kartą buvo vykdomas iš savo [portal](../reference/portal.md) |
| **WEB** | Jis neturi iškvietimo mazgų ir jo vienintelis terminalas yra [HTML output mapper](../nodes/html-output-mapper-node.md), todėl jo iškvietimas grąžina sugeneruotą tinklalapį |
| **Manual** | Jis neturi iškvietimo mazgų ir niekada nebuvo vykdomas, arba jo paskutinis vykdymas buvo iš kitos vietos |
| **Remove Scheduled** | Jis yra [planuojamas ištrinti](../reference/workflow-organization.md) |

API, SubWorker ir Portal žetonai skaito vienintelį naujausią įrašą workflow [vykdymo istorijoje](./logs-tab.md), todėl workflow, kuris yra iškviečiamas dviem būdais, rodo tą, kuris buvo paskutinis. **WEB** nustatomas iš grafiko, todėl jis turi pirmenybę prieš tuos tris: puslapį teikiantis workflow rodo WEB net ir po to, kai jis buvo iškviečiamas per HTTP. Iškvietimo mazgai visada laimi prieš visus juos: cron workflow, kurį kažkas taip pat iškviečia per HTTP, lieka **Scheduled**.

Naudokite **Status** išskleidžiamąjį meniu šalia paieškos lauko, kad parodytumėte tik vieną statusą. Išskleidžiamasis meniu rodo, kiek workflow šiuo metu atitinka kiekvieną statusą. Statuso filtras taip pat pasiekia aplankus: aplankai, turintys atitikmenį, automatiškai plečiami, o aplankai, neturintys atitikmens, slepiami, kol nepašalinsite filtro.

## Active Workflows

Darbalaukyje apvalus ženkliukas viršutiniame įrankių juostoje rodo, kiek workflow šiuo metu vykdomi, ir automatiškai atnaujinamas kas 10 sekundžių. Paspauskite ne nulinį ženkliuką, kad atidarytumėte aktyvių workflow sąrašą, kuris rodo iki keturių eilučių prieš slinkimą. Pasirinkite workflow pavadinimą, kad prijungtumėte redaktorių prie to vykdymo gyvos peržiūros. Nulinis ženkliukas yra informacinis ir negali būti atidarytas, o ženkliukas yra paslėptas mobiliose ekranuose.

## Search

Naudokite workflow paieškos laukelį šalia **Status**, arba paspauskite **Ctrl+F** (arba **Cmd+F**), kad filtruotumėte workflow pagal pavadinimą ar aprašymą. Atitinkantys workflow aplankuose rodomi su išplėstomis jų aplanko šakomis. Paspauskite **Escape**, kad išvalytumėte paiešką.
## Katalogai

- Organizuoja workflows į [katalogus ir subkatalogus](../reference/workflow-organization.md)
- Sukurkite katalogus naudodami mygtuką **Naujas katalogas**, suteikdami kiekvienam pavadinimą ir pasirinktą aprašymą, kuris bus rodomas po pavadinimu sąraše
- Kiekviena katalogo eilutė rodo, kiek workflows ji talpina, skaičiuojant subkatalogus, kartu su naujo subkatalogo, pervadinimo, ikonos keitimo, atsisiuntimo kaip ZIP ir ištrynimo veiksmais. Telefonuose eilutė rodo tik vieną meniu mygtuką
- Vilkite workflow virš katalogo ar subkatalogo, kad pamatytumėte kortelės dydžio paskirties peržiūrą. Išryškinta peržiūra rodo visą katalogo kelią prieš jums paleidžiant, o užvedus pelę ant suskleisto katalogo, jis trumpai išsiplečia, kad galėtumėte pasiekti įdėtus katalogus.
- Vilkite workflows tarp katalogų arba į šaknį. Vilkimo kortelė lieka matoma kaip vaiduoklis, o aktyvi paskirties vieta išlieka išryškinta, kol slenkate.
- Vilkimas workflow atgal į dabartinį katalogą yra išjungtas ir pažymėtas kaip **Jau kataloge**.
- Pervadinkite katalogą arba pakeiskite jo aprašymą iš pervadinimo veiksmo arba dešiniuoju pelės mygtuku atidaryto kontekstinio meniu

## Workflows kūrimas

1. Paspauskite **Naujas workflow**
2. Įveskite pavadinimą ir pasirinktą aprašymą
3. Workflow atsidaro redaktoriuje

## Importavimas

Vilkti ir mesti JSON workflow failą į workflow sritį, kad sukurtumėte naują workflow. Importuoti mazgai ir briaunos naudojami workflow kūrimui; pavadinimas gaunamas iš `name` lauko JSON faile arba failo pavadinimo. Žr. [Atsisiųsti ir importuoti](../reference/download-import.md) dėl JSON formato ir importavimo parinkčių.

## Dalinimasis

Atidarykite workflow redaktoriuje ir paspauskite **Dalintis**, kad pakviestumėte vartotojus el. paštu arba pasidalintumėte su [komanda](./teams-tab.md). Pasirinkite **Skaityti** (peržiūrėti ir vykdyti) arba **Rašyti** (taip pat redaguoti) kiekvienam vartotojui ar komandai, ir vėliau pakeiskite iš išskleidžiamojo meniu šalia įrašo. Kredencialai ir sub-workflows automatiškai nesidalina; dalinkitės jais atskirai su tais pačiais vartotojais ar komandomis. Žr. [Workflow organizavimas](../reference/workflow-organization.md#sharing-workflows) ir [Kredencialų dalinimasis](../reference/credentials-sharing.md).

## Redagavimas ir ištrynimas

- **Redaguoti** – Pakeiskite workflow pavadinimą ir aprašymą iš eilutės redagavimo veiksmo
- **Ištrinti** – Workflows yra [planuojami ištrinti](../reference/workflow-organization.md); jie perkelti į šiukšlių sritį prieš nuolatinį pašalinimą

## Lygiagretūs redagavimai

Išsaugojimas siunčia peržiūrą, kuria remiasi jūsų redagavimai, o serveris atmeta rašymą, jei workflow tuo tarpu pasikeitė — pavyzdžiui, nes kolega jį išsaugojo, arba jūs palikote tą patį workflow atidarytą antrame skirtuke. Heym tada rodo dialogą **Aptiktas pasenęs workflow** su dviem pasirinkimais:

- **Atšaukti** – Išlaiko jūsų neišsaugotus pakeitimus redaktoriuje, kad galėtumėte perkrauti kitame skirtuke ir suderinti juos
- **Pakeisti** – Išsaugo vis tiek, pakeisdamas kito asmens versiją

**Vykdant** workflow, jis pirmiausia išsaugomas, todėl jis pereina per tą patį patikrinimą. Jei workflow pasikeitė po jumis, vykdymas sustoja dialoge, o ne tyliai perrašomas: **Pakeisti ir vykdyti** išsaugo jūsų versiją ir pradeda vykdymą, **Atšaukti vykdymą** atsisako abiejų ir palieka jūsų redagavimus nepaliestus.

Patikrinimas yra dalis išsaugojimo užklausos, todėl jis nekainuoja papildomo kelionės laiko ir nėra lango, kuriame išsaugojimas galėtų praeiti. Jūsų patys pakeitimai iš kitur programoje — pervadinimas, nustatymų pakeitimas, savybių skydelio perjungimas — niekada nesiskaito kaip konfliktas.

## Komandų paletė

Paspauskite **Ctrl+K** (arba **Cmd+K**), kad atidarytumėte komandų paletę. Galite:
- Ieškoti workflows pagal pavadinimą
- Pereiti į bet kurį [prietaisų skydelio skirtuką](./credentials-tab.md)
- Atidaryti neseniai naudotus workflows

## Susiję

- [Greitas pradžia](../getting-started/quick-start.md) – Sukurkite savo pirmąjį workflow
- [Workflow organizavimas](../reference/workflow-organization.md) – Katalogai, subkatalogai ir suplanuotas ištrynimas
- [Workflow struktūra](../reference/workflow-structure.md) – JSON formatas workflows
- [Atsisiųsti ir importuoti](../reference/download-import.md) – Eksportuoti ir importuoti workflows kaip JSON
- [Portalas](../reference/portal.md) – Pateikti workflows kaip viešas chat UI
- [Lenta](./board-tab.md) – Vykdyti workflows iš kanban kortelių per stulpelių grandines
- [Pagrindinės sąvokos](../getting-started/core-concepts.md) – Workflows, mazgai ir vykdymas
- [Vykdymo istorija](../reference/execution-history.md) – Peržiūrėti praeities vykdymus ir perkelti į Drobę
- [Greitas stalčius](../reference/quick-drawer.md) – Prisegti ir vykdyti workflows iš prietaisų skydelio, dokumentų ir kitų ne redaktoriaus puslapių
- [Kontekstinis demonstravimas](../reference/contextual-showcase.md) – Trumpas puslapio vadovas prietaisų skydelio paviršiams
