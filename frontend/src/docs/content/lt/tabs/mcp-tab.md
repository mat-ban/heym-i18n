# MCP skirtukas

**MCP** skirtukas konfigūruoja Model Context Protocol (MCP) integraciją. MCP leidžia AI klientams (Claude, ChatGPT, Gemini, Cursor ir bet kuriam MCP suderinamam įrankiui) skambinti Jūsų Heym workflows kaip įrankiams.

Heym palaiko du režimus: **numatytąjį serverį**, kuris atskleidžia visus MCP įgalintus workflows po vienu endpoint, ir **pavadintus serverius**, kurie suteikia kiekvienai loginei workflows grupei savo dedikuotą URL ir API raktą.

Abu režimai gali atskleisti du įrankių tipus: individualius **workflows** ir **Heym chat tool** — visą [Chat skirtuko](./chat-tab.md) variklį už vieno `heym_chat` įrankio.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Žiūrėti MCP demonstraciją</a></p>

## Numatytoji MCP serveris

Numatytasis serveris visada prieinamas adresu `{origin}/api/mcp/sse`. Visi workflows, kuriems įjungtas MCP, čia pasirodo kaip įrankiai.

### MCP API raktas

- Raktai saugomi kaip SHA-256 santrumpos, todėl Heym negali parodyti Jums esamo rakto. Skirtukas praneša, ar raktas nustatytas, bet ne kas jis yra.
- **Generuoti** / **Regeneruoti** – Naujas raktas rodomas vieną kartą, iškart po jo sukūrimo. Nukopijuokite jį tada; perkrovus skirtuką, jis bus paslėptas visam laikui.
- Naudokite šį raktą, kai jungiate Claude Desktop, Cursor ar kitus MCP klientus prie Heym.
- Pametėte raktą? Regeneruokite jį. Ankstesnis raktas nustoja veikti iškart.

### Jungties metodai

- **API raktas** – Naudokite MCP API raktą programinėms jungtims. Skirtukas gali nukopijuoti paruoštą JSON konfigūraciją ir apima **Pridėti prie Cursor** mygtuką vieno paspaudimo Cursor nustatymui.
- **Claude** – Skirtukas rodo MCP serverio URL ir nustatymo žingsnius Claude. Palikite OAuth Kliento ID ir Slaptažodį tuščius; Claude registruojasi automatiškai ir autentifikuojasi per Heym OAuth.
- **ChatGPT** – Skirtuke rodomas MCP serverio URL ir „ChatGPT“ programos nustatymo veiksmai. Įjunkite kūrėjo režimą (Developer mode), sukurkite programą su URL ir pasirinkite OAuth; „ChatGPT“ užsiregistruoja automatiškai.
- **Gemini** – Skirtuke rodomas MCP serverio URL ir „Gemini“ tinkintos programos nustatymo veiksmai: adresu gemini.google.com pasirinkite **Settings → Connected Apps → Add a custom app**, įklijuokite URL ir palikite **Advanced features** uždarytą; „Gemini“ automatiškai užsiregistruoja ir autentifikuojasi per Heym OAuth. Prisijungus, Heym taip pat veikia „Gemini“ mobiliojoje programėlėje.

### Workflow MCP perjungimas

Kiekvienas workflow gali būti atskleistas kaip MCP įrankis:

- **Įjungti** – Workflow įrankiai tampa prieinami visiems klientams, prijungtiems prie numatytojo serverio.
- **Išjungti** – Workflow nėra atskleistas.

Workflow kortelės rodo aprašymą ir įvesties laukų pavadinimų peržiūrą, kad galėtumėte pamatyti, ko kiekvienas įrankis tikisi prieš jį įjungiant.

## Heym Chat Tool

**Heym galimybių** skyrius paverčia Chat skirtuko variklį į vieną MCP įrankį, pavadintą `heym_chat`. Įjunkite jį numatytajame serveryje, bet kuriame pavadintame serveryje arba abiejuose — kiekviena aplinka turi savo perjungimą ir modelio pasirinkimą.

Kai jis įjungtas, `heym_chat` pasirodo `tools/list` kartu su Jūsų workflow įrankiais. MCP klientas siunčia vieną natūralios kalbos žinutę, o Heym variklis ją apdoroja, turėdamas tas pačias galimybes, kurias turi Chat skirtukas:

- Sukurti workflow, išbandyti jį su pavyzdiniais įvesties duomenimis, pataisyti ir užbaigti, kai vykdymas pavyksta (žr. [Kūrimo režimas](#build-mode))
- Tikrinti ir vykdyti esamus workflows
- Pranešti apie analitiką, neseniai vykdytus vykdymus ir artėjančius cron tvarkaraščius.
- Pranešti apie vieno workflow vykdymo istoriją: kiek kartų jis buvo vykdytas, būsenos skaičius, kada jis buvo vykdytas, ir pagal užklausą įvestis, išvestis bei klaidos kiekviename mazge.
- Pranešti, kas šiuo metu vykdoma: kiek vykdymų yra aktyvių, jų workflow pavadinimai, kiek laiko kiekvienas veikia, kurį mazgą kiekvienas šiuo metu naudoja, ir nuorodą į gyvą vykdymą.
- Išvardyti lentas, kurti korteles ir skaityti kortelių detales [Lentos skirtuke](./board-tab.md).
- Išvardyti Jūsų duomenų lenteles su jų stulpeliais, kurti naujas ir prijungti jas prie workflows, kuriuos jis kuria.
- Skaityti komandas ir globalius kintamuosius, bei ieškoti dokumentacijoje.
- Patvirtinti, redaguoti arba atmesti laukiančius žmogaus įsikišimo atsiliepimus.

Galimybės, pridėtos prie Chat skirtuko, vėliau automatiškai tampa prieinamos per `heym_chat` — nėra jokio per galimybę perjungimo, kad būtų galima sinchronizuoti.

### Kūrimo režimas

`heym_chat` visada vykdo Chat variklį kūrimo režimu (build mode). Vieno iškvietimo metu asistentas gali išsaugoti naują workflow, paleisti jį su tikroviškais pavyzdiniais įvesties duomenimis, perskaityti vykdymo ataskaitą, ištaisyti tai, kas nepavyko, ir paleisti jį dar kartą – iki penkių bandomųjų paleidimų per vieną iškvietimą. Kai paskutinio išsaugojimo naujausias paleidimas pavyksta, jis baigia vieno sakinio santrauka, o atsakymas baigiasi tekstu `Verified: the latest test run of the saved workflow passed.`

- Bandomieji paleidimai yra tikri paleidimai. Jų šalutiniai poveikiai įvyksta ir jie rodomi workflow vykdymo istorijoje kaip ir bet kuris kitas paleidimas.
- Išsaugojimai vyksta redaktoriaus keliu: grafo pakeitimas išsaugo ankstesnį grafą workflow redagavimo istorijoje (**Edit History**).
- Norėdami pakeisti anksčiau sukurtą workflow, tęskite giją su tuo pačiu `conversation_id`. Asistentas atnaujina tą workflow, o ne kuria naują, ir keičia tik tuos workflows, kuriuos galite redaguoti.
- Kai išnaudojami visi penki bandomieji paleidimai, asistentas sustoja ir paaiškina, kas vis dar nepavyksta.

Kredencialai lieka UI: `heym_chat` niekada nerodo, nepasirenka ar nesukuria jų. Kai jis kuria ar redaguoja workflow, nauji mazgai, kuriems reikia kredencialo, paliekami tušti, o atsakymas juos pavadina, kad galėtumėte nustatyti juos redaktoriuje.

Duomenų lentelės yra kitokios. Lentelė neturi paslapčių, todėl `heym_chat` gali išvardyti Jūsų lenteles, paklausti, kurią workflow turėtų naudoti, ir sukurti naują su jos stulpeliais. Ji niekada neskaito ar nerašo eilučių.

### Kredencialas ir modelis

`heym_chat` vykdo variklį Jūsų Heym paskyroje, todėl jam reikia savo LLM kredencialo:

| Laukas | Elgsena |
|--------|---------|
| **Kredencialas** | Pasirinkite bet kurį OpenAI, Google ar Custom kredencialą, prie kurio turite prieigą. Išankstinis užpildymas iš pageidaujamo kredencialo [Nustatymuose](../reference/user-settings.md), kai nesate pasirinkę jokio. |
| **Modelis** | Įkeltas iš pasirinkto kredencialo. Išankstinis užpildymas iš Jūsų pageidaujamo modelio, kai kredencialas atitinka. |

Jei kuris nors trūksta, įrankis vis tiek pasirodo `tools/list`, tačiau kiekvienas skambutis grąžina klaidą, pranešančią, kad turite užbaigti nustatymą šiame skirtuke.

### Argumentai ir istorija

| Argumentas | Privalomas | Aprašymas |
|------------|------------|-----------|
| `message` | Taip | Nurodymas arba klausimas, natūralia kalba. |
| `conversation_id` | Ne | `conversation_id` iš ankstesnio `heym_chat` rezultato, kad tęstumėte tą temą. |

Kiekvienas skambutis įrašomas į Jūsų [Chat skirtuko](./chat-tab.md) istoriją kaip įprasta pokalbis, pažymėtas kištuko ikona pokalbių sąraše. Žinutės, įrankių kortelės ir paaiškinimo pertraukos atrodo lygiai taip pat kaip pokalbis, kurį pradėjote patys, ir galite atidaryti temą ir toliau kalbėtis naršyklėje. Kiekvienas rezultatas grąžina savo `conversation_id`, kad MCP klientas galėtų tęsti tą pačią temą, o ne atidaryti naują kiekviename skambutyje.

Kai asistentui reikia paaiškinimo, jis sustoja ir tai sako; atsakykite su atsakymais naudodami tą patį `conversation_id`.
## Pavadinti MCP Serveriai

Pavadinti serveriai leidžia segmentuoti workflows į izoliuotus MCP endpointus. Kiekvienas serveris turi savo URL ir API raktą, todėl skirtingi AI klientai, komandos ar naudojimo atvejai gali prisijungti prie būtent tų workflows, kurių jiems reikia.

### Pavadinto Serverio Sukūrimas

1. Įveskite pavadinimą į įvesties laukelį MCP skiltyje (pvz., **CRM Tools**)
2. Paspauskite **Create** — nauja serverio kortelė iš karto pasirodo
3. Paspauskite kortelę, kad ją išplėstumėte

### Serverio Nustatymai

Kiekviena serverio kortelė rodo:

| Nustatymas | Aprašymas |
|------------|-----------|
| **SSE Endpoint** | Unikalus URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Nepriklausomas raktas, rodomas vieną kartą, kai jis sugeneruojamas arba regeneruojamas. Nukopijuokite jį iš karto; jis saugomas užšifruotas ir vėliau negali būti atskleistas |
| **Kaip prisijungti** | **Copy JSON** nukopijuoja paruoštą MCP konfigūraciją; **Add to Cursor** įdiegia ją vienu paspaudimu |
| **Heym Galimybės** | Įjunkite `heym_chat` įrankį šiam serveriui ir pasirinkite jo kredencialus bei modelį |
| **Priskirti Workflows** | Įjunkite, kurie iš jūsų workflows šis serveris atskleidžia |

### Workflow Priskyrimas

Workflow priskyrimas yra kiekvienam serveriui ir nepriklauso nuo numatyto serverio perjungimo. Workflow gali būti įjungtas numatytame serveryje ir keliuose pavadintuose serveriuose tuo pačiu metu arba nė viename.

Perjungus workflow, jis perkeltas į pradinę priskirtų sąrašą, todėl eilutė, kurią ką tik pakeitėte, lieka matoma, o ne nuslenka.

### Autentifikacija

Pavadinti serveriai palaiko tas pačias autentifikavimo metodikas kaip ir numatytas serveris:

- **X-MCP-Key header** – Tiesiogiai perduokite serverio API raktą (API klientai, Cursor). Tik antraštė: raktai nėra priimami kaip `?key=` užklausos parametras, nes URL patenka į prieigos žurnalus, proxy žurnalus ir naršyklės istoriją.
- **Claude, ChatGPT ir Gemini OAuth** – Pridėkite serverio URL prie kliento jungčių arba tinkintų programų; palikite kredencialus tuščius, o klientas automatiškai registruojasi per OAuth. Nešiklio tokenas turi keliauti `Authorization` antraštėje, o ne kaip `?token=`.
- **Sesijos tokenas** – Išduodamas SSE rankos paspaudimo metu; apribotas konkrečiam serveriui, todėl vieno pavadinto serverio tokenai negali pasiekti kito. Šis trumpalaikis `?session=` parametras nėra paveiktas.

### Pavadinto Serverio Ištrynimas

Paspauskite **X** piktogramą serverio kortelės antraštėje. Ištrynimas pašalina serverį ir visus jo workflow priskyrimus; patys workflows nėra paveikti.

## SSE Endpoint

| Serveris | Endpoint |
|----------|----------|
| Numatyta | `{origin}/api/mcp/sse` |
| Pavadinta | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Abu endpointai palaiko SSE transportą (GET, MCP specifikacija 2024-11-05) ir Streamable HTTP transportą (POST, MCP specifikacija 2025-03-26). Claude, ChatGPT ir Gemini naudoja OAuth 2.1 / PKCE saugiam prisijungimui abiem atvejais.

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – MCP kaip pirmos klasės primityvas Heym
- [Agent Node](../nodes/agent-node.md) – Agent node su MCP įrankių palaikymu
- [Agent Architektūra](../reference/agent-architecture.md) – MCP klientas, įrankių paskirstymas, orkestratorius
- [Triggeriai](../reference/triggers.md) – MCP kaip workflow įėjimo taškas
- [Chat Tab](./chat-tab.md) – Variklis už `heym_chat` įrankio
- [Workflows Tab](./workflows-tab.md) – Kurti ir valdyti workflows
- [Mazgų Tipai](../reference/node-types.md) – AI mazgų apžvalga
- [Kontekstinis Pavyzdys](../reference/contextual-showcase.md) – Kompaktiška puslapio instrukcija valdymo skydeliams
