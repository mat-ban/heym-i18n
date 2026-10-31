# Chat skirtas

**Chat** skirtas suteikia tiesioginę LLM pokalbių sąsają. Naudokite jį modelių testavimui, klausimų uždavimui, esamų workflows vykdymui arba naujo workflow kūrimui iš natūralios kalbos užklausos.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Žiūrėti Chat demonstraciją</a></p>

## Nustatymas

1. Pasirinkite [kredencialą](./credentials-tab.md) (API raktą OpenAI, Google ir kt.)
2. Iš išskleidžiamojo sąrašo pasirinkite modelį (modeliai įkeliami iš pasirinkto kredencialo)
3. Pradėkite rašyti, kad siųstumėte žinutes

Taip pat galite pradėti pokalbį iš pokalbių lango [Workflows skirtuke](./workflows-tab.md). Tai išsiunčia jūsų pirmąją žinutę ir atidaro naują pokalbį čia su jau transliuojamu atsakymu.

## Funkcijos

- **Globalių kintamųjų kontekstas** – Jūsų [Globalūs kintamieji](../reference/global-variables.md) yra prieinami LLM, todėl galite klausti apie arba nurodyti saugomus vertes
- **Darbo erdvės šablonų kontekstas** – Bendri workflow ir mazgų šablonai jūsų darbo erdvėje yra įtraukti kaip kontekstas, todėl Chat gali atsakyti į klausimus apie prieinamus šablonus
- **Ilgalaikis agentas** – Chat tęsia darbą fone, net jei naršyklė uždaroma, todėl galite grįžti iš kito įrenginio ir tęsti tą patį pokalbį
- **Workflow kūrimas** – Paprašykite Chat sukurti arba sukonfigūruoti workflow, ir jis naudoja tą pačią Workflow AI Builder variklį kaip redaktoriaus asistentas, kad sugeneruotų ir išsaugotų workflow
- **Kanban užduočių kūrimas** – Natūraliai paprašykite pridėti užduotį arba sukurti kortelę. Chat prideda ją prie pirmosios prašomos lentos stulpelio; kai turite kelias lentas ir nepavadinate vienos, Chat pateikia lentos pasirinkimo langą prieš kuriant kortelę
- **Paskirstyti sekantys klausimai** – Siųskite daugiau žinučių, kol atsakymas transliuojamas. Paskirstytos žinutės išlieka, gali būti redaguojamos arba trinamos prieš pradedant, ir vykdomos eilės tvarka po aktyvaus atsakymo
- **Planavimo pertraukos** – Kai Chat reikia planavimo detalių, jis užduoda paaiškinimo klausimus ir sustabdo paskirstytus sekantys klausimus, kol atsakysite. Po planavimo atsakymo pabaigos, paskirstytos žinutės tęsiasi
- **Kredencialai** – Kai workflow, kurį Chat sukuria arba redaguoja, reikia kredencialo, Chat klausia, kurį naudoti, siūlo sukurti naują pokalbyje arba leidžia tęsti be jo. Taip pat galite paprašyti Chat sukurti kredencialą arba atnaujinti turimą; jis atidaro kredencialo formą pokalbyje. Modelis mato kredencialo pavadinimą ir tipą, bet niekada jo vertes, tiek jūsų turimiems, tiek su jumis bendrinamiems kredencialams. Chat pridėti LLM ir Agent mazgai veikia su pokalbiui pasirinktu kredencialu ir modeliu, įskaitant bendrinamus kredencialus; kai Chat redaguoja workflow, esami LLM ir Agent mazgai išlaiko savo kredencialą ir modelį. Žr. [AI Asistentas › Kredencialai](../reference/ai-assistant.md#credentials)
- **Dashboards** – Paklauskite, kokius [dashboards](./dashboard-tab.md) turite, kas yra viename iš jų arba kuriame skydelyje yra workflow. Paprašykite Chat pridėti naują valdiklį prie skydelio (jis ten įdeda tuščią valdiklį, tada sukuria ir išbando jo workflow), įdėti esamą workflow į skydelį kaip valdiklį, pervadinti arba ištrinti valdiklį arba sutvarkyti skydelio išdėstymą. Heym Work rodo šiuos skydelius kaip savo puslapius. Žr. [Dashboard › Iš Chat ir MCP](./dashboard-tab.md#iš-chat-ir-mcp)
- **Duomenų lentelės** – Kai Chat sukurtas ar redaguotas workflow išsaugo įrašus, Chat paklausia, kurią [duomenų lentelę](./datatable-tab.md) naudoti, arba pasiūlo sukurti naują su reikalingais stulpeliais. Jis taip pat gali tikrinti eilutes, pridėti arba pašalinti stulpelius ir tiesiogiai įterpti, atnaujinti arba ištrinti eilutes lentelėse, kurias valdote arba galite redaguoti. Nurodykite lentelės pavadinimą arba DataTable nuorodą. Stulpelių šalinimas ir visų eilučių išvalymas reikalauja patvirtinimo; stulpelių pridėjimas išlaiko esamus duomenis. Žr. [AI asistentas › Duomenų lentelės](../reference/ai-assistant.md#data-tables)
- **Transliuojami atsakymai** – Matykite modelio išvestį, kai ji transliuojama
- **Sustabdyti atsakymą** – Bet kuriuo metu nutraukite esamą transliuojamą atsakymą; sustabdymas taip pat išvalo paskirstytas žinutes tam pokalbiui
- **Markdown formatavimas** – Atsakymai palaiko markdown formatavimą, įskaitant įterptas nuotraukas
- **Vaizdų rodymas** – Atsakymuose įterpti vaizdai (pvz., iš LLM vaizdų generavimo) rodomi įterptai; spustelėkite bet kurį vaizdą, kad jį peržiūrėtumėte visame ekrane. Paspauskite **Esc** arba atgalinį mygtuką (mobiliajame) norėdami uždaryti viso ekrano peržiūrą
- **Kopijuoti žinutes** – Kopijuokite bet kurią žinutę į iškarpinę
- **Išvalyti pokalbį** – Pradėkite naują pokalbį
- **Balso įvestis** – Naudokite mikrofono mygtuką balso į tekstą (naršyklėje palaikoma). Kai įrašymas baigiasi, Heym gali šiek tiek išvalyti transkripciją prieš ją siunčiant
- **Planuoti workflows** – Paklauskite, kada cron workflows vykdomi (šiandien, šią savaitę, šį mėnesį arba pagal pasirinktą datų intervalą). Asistentas naudoja tuos pačius tvarkaraščio duomenis kaip [Tvarkaraščiai](./scheduled-tab.md) skirtuke ir gali apriboti rezultatus iki jūsų turimų workflows arba įtraukti tuos, kurie buvo bendrinti su jumis
- **Workflow vykdymo istorija** – Paklauskite apie vieną workflow ("kiek kartų buvo vykdoma kasdienė ataskaita?", "ar ji nepavyko?", "kada ji paskutinį kartą buvo vykdyta?"). Chat ieško workflow pagal jo ID ir atsako iš jo vykdymo skaičiaus, būsenos pasiskirstymo, pirmo ir paskutinio vykdymo laiko bei vidutinio trukmės. Paklauskite, kodėl vykdymas nepavyko arba ką jis grąžino, ir Chat tada atidaro tą vieną vykdymą, kad perskaitytų jo įvestis, išvestis ir klaidas pagal mazgus
- **Kur vykdymo procesai nepavyksta ir kodėl jie yra lėti** – Paklauskite, kur jūsų workflow nepavyksta arba kodėl jie yra lėti, ir Chat nurodys workflow, kurie veikė dažniausiai, patyrė daugiausiai nesėkmių ir yra lėčiausi, taip pat mazgų tipus, kurie užima daugiausiai laiko (vidutiniškai vienam iškvietimui ir iš viso), dažniausiai patiria nesėkmių ir veikia dažniausiai – tuos pačius skaičius kaip skirtuke [Analytics](./analytics-tab.md). Mazgų tipai skaičiuojami vykdymams nuo leidimo, kuriame buvo įdiegta mazgų analitika. Teiraukitės apie pastarąją valandą, 3 ar 6 valandas, 24 valandas, 7 ar 30 dienų arba visą laiką; valandų langai prasideda lygiai valandą, todėl „pastaroji valanda“ 15:20 apima laikotarpį nuo 14:00 iki dabar.
- **Gyvas vykdymo statusas** – Paklauskite, kas šiuo metu vykdoma, ir Chat atsako su skaičiumi, workflow pavadinimais, kiek laiko kiekvienas vykdymas vyksta, kuriame mazge jis yra, ir nuoroda tiesiai į gyvą vykdymą
## Naudojimasis Chat iš MCP kliento

Chat variklis taip pat gali būti pasiekiamas išorėje, ne tik naršyklėje. Įgalinkite **Heym Chat Tool** MCP skirtuke [MCP / A2A tab](./mcp-tab.md), ir MCP klientai — Claude, Cursor ir bet kas kitas, kas kalba MCP — gauna vieną `heym_chat` įrankį, kuris veikia su tuo pačiu varikliu ir visomis jo galimybėmis.

Šios pokalbos patenka į šio skirtuko istoriją, pažymėtos kištuko ikona pokalbių sąraše. Atidarykite vieną, kad perskaitytumėte, ką klientas klausė, pamatytumėte įrankių korteles, kurias jis suaktyvino, ir tęstumėte temą patys. Atsakymas į paaiškinimo klausimą veikia taip pat, nesvarbu, ar posūkis prasidėjo čia, ar iš MCP kliento.

Per MCP Chat neskelbia, nepasirenka ir nesukuria kredencialų. Workflow, kuriuos jis kuria, palieka kredencialų laukus tuščius, o atsakyme nurodomi mazgai, kuriems reikia kredencialo, kad galėtumėte juos nustatyti redaktoriuje.

Duomenų lentelės veikia ir per MCP: Chat gali tiesiogiai redaguoti stulpelius ir eilutes, kurti lenteles ir sujungti jas į workflow. Klausimai apie lenteles ir trynimo patvirtinimai pateikiami kaip tekstas rezultate; atsakykite naudodami tą patį `conversation_id`.

## Konteksto ribos

Chat išlaiko iki 25 nesenų žinučių kontekste. Senesnės žinutės yra pašalinamos, kad būtų laikomasi modelio ribų.

## Workflows kūrimas

Kai prašote Chat sukurti, sukurti, generuoti ar sukonfigūruoti workflow, jis sukuria naują išsaugotą workflow su sugeneruotu pavadinimu ir aprašymu. Atsakyme pateikiama tik skaitymui skirta drobės peržiūra su sugeneruotais mazgais ir briaunomis, taip pat **Atidaryti workflow** nuoroda, kuri atidaro workflow redaktorių naujame naršyklės skirtuke. Naudokite peržiūros kortelės **Vykdyti** mygtuką, kai norite įvykdyti workflow.

Sekančio atsiliepimo toje pačioje pokalbio srityje redaguoja tą workflow, o ne sukuria kitą. Pavyzdžiui, po to, kai Chat sukuria workflow, galite pasakyti "pridėti patvirtinimo žingsnį", "pakeisti išvesties formatą" arba "şöyle yap", ir Chat atnaujina išsaugotą workflow ir atnaujina peržiūrą.

Tai geriausia prašymams, kai norite, kad darbas būtų atliktas kaip pakartotinai naudojama automatizacija, o ne tik vienkartinis atsakymas.

## Kanban užduočių kūrimas

Prašykite Chat įprasta kalba, pavyzdžiui, „Pridėti užduotį pavadinimu Išspręsti prisijungimo klaidą“ arba „Sukurti naują kortelę Atnaujinti dokumentaciją paleidimo lentoje“. Galite įtraukti aprašymą tame pačiame prašyme. Chat visada sukuria kortelę pasirinkto lento pirmame stulpelyje.

Jei jūsų darbo erdvėje yra kelios lentos ir nesate nurodę vienos, Chat sustoja su vieno pasirinkimo lentos pasirinkimo įrankiu. Pasirinkite lentą, kad užbaigtumėte kortelės kūrimą. Nereikia jokių slash komandų ar specialaus žinutės formato.

## Klausimas, kas vyksta

Klausykite įprasta kalba — "kas vyksta?", "kiek workflow šiuo metu yra aktyvūs?", "kuris mazgas yra naktinis ataskaitos?" — ir Chat pateiks gyvą vaizdą:

- **Kiek** vykdymų yra vykdomi, padalinti į vykdomus ir laukiančius žmogaus peržiūros
- **Kuriems workflows** jie priklauso, pagal pavadinimą
- **Kiek laiko** kiekvienas vykdymas jau vyksta (pavyzdžiui, `1m 35s`, `3h 25m`)
- **Kuris mazgas** šiuo metu vykdomas, pagal jo drobės etiketę, plius paskutinis baigtas mazgas
- **Nuoroda** į kiekvieną gyvą vykdymą, kuri atidaro drobę su tuo vykdymu, kuris yra atkuriamas

Vykdymai, sustabdyti dėl [Human-in-the-Loop](../reference/human-in-the-loop.md) arba Codex peržiūros, yra pranešami kaip laukiančių, o ne kaip vykdomų. Tai yra tie patys duomenys, kaip aktyvių vykdymų ženklelis antraštėje, todėl Chat ir ženklelis niekada nesutampa. Užbaigtiems vykdymams klauskite apie nesenus vykdymus — tai skaito [Vykdymo istorija](../reference/execution-history.md).

## Klausimai apie vykdymą

Pasirinkite Workflow vykdymą [Execution History](../reference/execution-history.md#ask-ai) lange redaktoriuje arba All History rodinyje ir spustelėkite **Klausti AI** šalia dialogo lango pavadinimo. Chat atveria naują pokalbį su dviem lustais virš pranešimo laukelio:

- **Workflow:** Workflow pavadinimas
- **Execution:** pasirinkto vykdymo ID pirmieji simboliai

Pašalinkite lustą naudodami jo **×**, kad jo neįtrauktumėte. Tada užduokite klausimą, pavyzdžiui, „kodėl šis vykdymas truko taip ilgai?“, „kas čia nepavyko?“ arba „ar galite tai ištaisyti?“. Likę lustai pridedami prie šio pranešimo su visais ID, todėl Chat tiesiogiai nuskaito vykdymo įvestis, išvestis ir mazgų pėdsakus, o ne ieško Workflow. Norėdami ištaisyti Workflow, Chat išsaugo, išbando ir patikrina pakeitimą, kaip aprašyta skyriuje [Workflow kūrimas](#workflow-kurimas).

Išsiųstame pranešime lustai rodomi po jūsų klausimu. Jie priklauso tik tam pranešimui; tolesni klausimai tame pačiame pokalbyje išlaiko kontekstą iš istorijos.

## Klausimas apie įspėjimus

Chat gali atsakyti į klausimus apie [įspėjimus](./alerts-tab.md), kuriuos esate nustatę:

- **Kas egzistuoja** — "kokius įspėjimus turiu?", "ar yra įspėjimas dėl sąskaitos workflow?", "kurie įspėjimai šiuo metu veikia?"
- **Kaip vienas yra sukonfigūruotas** — "koks yra slenkstis dėl sąnaudų įspėjimo?", "kaip tai sukonfigūruota?"
- **Kodėl ir kada jis įsijungė** — "kodėl įsijungė sąnaudų įspėjimas?", "kada tai paskutinį kartą įvyko?"

Klausimui "kodėl jis įsijungė", Chat perskaito įsijungimo įrašą ir cituoja tiksliai stebėtą vertę, slenkstį ir tikslų langą, kuris buvo įvertintas, plius prisidedančią informaciją: nesėkmingų vykdymų ID ir klaidų pranešimus dėl klaidų įspėjimų, pagal modelio išlaidas dėl sąnaudų įspėjimų arba įvykdymo skaičiaus įspėjimų šaltinio suvestinę. Jis praneša, kas buvo tiesa, kai įspėjimas įsijungė, o ne perskaičiuoja langą, nes langas jau praėjo, o naujas skaičiavimas gali duoti kitą atsakymą.

## Vartotojo taisyklės

[Vartotojo taisyklės](../reference/user-settings.md) (nustatytos Nustatymuose) automatiškai įterpiamos į kiekvieną Chat pokalbį kaip sistemos lygio instrukcijos. Nustatykite jas vieną kartą, kad taikytumėte nuolatines nuostatas visiems pokalbių prašymams.

## Darbas su Evals

Chat gali kurti, modifikuoti ir vykdyti rinkinius skiltyje [Evals](./evals-tab.md), tiek užklausų, tiek agentų rinkinius:

- **Užklausų rinkinys**: „sukurk užklausų rinkinį mano pagalbos atsakymo užklausai su 8 testo atvejais ir palygink gpt-4o su gpt-4.1-mini“. Chat surašo testo atvejus su laukiamais atsakymais, pasirenka vertinimo metodą ir išsaugo rinkinį.
  - Prieš kurdamas rinkinį, jis nustato, kokius LLM kredencialus ir modelius naudoti. Esant lygiai vieniems LLM kredencialams, naudoja juos ir apie tai praneša; kitu atveju paklausia.
  - LLM-as-Judge vertinimui taip pat pasiteirauja, ar atsakymus turėtų vertinti atskiras teisėjas.
- **Agento rinkinys**: „patikrink, ar mano pagalbos agentas visada ieško dokumentacijoje ir niekada nesiunčia el. laiškų“. Chat suranda agentą ir išsaugo įrankių patikras bei ribas. Paprašius, paleidžia workflow, sukurdamas skirtingą įvestį kiekvienam vykdymui.
  - Agento rinkinio vykdymai yra tikri workflow vykdymai, todėl pasireiškia jų šalutinis poveikis. Chat nurodo, kiek vykdymų pradeda.
- **Baseline**: Chat gali dirbti su agento bazine linija trimis būdais:
  - Pateikti ją iš naujausių agento vykdymų.
  - Sukurti ją iš vykdymų, kuriuos pats pradeda („paleisk 5 kartus ir naudok tai kaip baseline“).
  - Išsaugoti jūsų nurodytus skaičius („nustatyk baseline į 3 sekundes p95 ir 0,01 $ už vykdymą“).
- **Vykdymai**: Chat laukia vykdymo iki vienos minutės, o tada praneša rezultatą:
  - Užklausų rinkiniui: kiekvieno modelio sėkmingų testų skaičių ir nepavykusius atvejus.
  - Agento rinkiniui: sėkmės rodiklį, nepavykusias patikras ir nuokrypį nuo bazinės linijos.
  - Ilgesnis vykdymas tęsiamas Evals; paprašykite Chat patikrinti jį vėl.

Kai Chat sukuria arba pakeičia rinkinį, atsakyme rodoma kortelė su rinkinio pavadinimu, jo tipu ir mygtuku **Atidaryti Evals**, panašiai kaip išsaugoto workflow kortelė. Per MCP `heym_chat` rezultate pateikiama kiekvieno tame iškvietime išsaugoto rinkinio nuoroda.

Tas pats veikia iš MCP kliento per `heym_chat` (žr. [Chat naudojimas iš MCP kliento](#chat-naudojimas-iš-mcp-kliento)). Vertinimo įrankiai lieka `heym_chat` viduje; MCP klientai nemato jų kaip atskirų įrankių.

Redaktoriaus AI asistentas rinkinių nekuria.

## Darbas su Evals

Chat gali kurti, modifikuoti ir vykdyti rinkinius skiltyje [Evals](./evals-tab.md), tiek užklausų, tiek agentų rinkinius:

- **Užklausų rinkinys**: „sukurk užklausų rinkinį mano pagalbos atsakymo užklausai su 8 testo atvejais ir palygink gpt-4o su gpt-4.1-mini“. Chat surašo testo atvejus su laukiamais atsakymais, pasirenka vertinimo metodą ir išsaugo rinkinį.
  - Prieš kurdamas rinkinį, jis nustato, kokius LLM kredencialus ir modelius naudoti. Esant lygiai vieniems LLM kredencialams, naudoja juos ir apie tai praneša; kitu atveju paklausia.
  - LLM-as-Judge vertinimui taip pat pasiteirauja, ar atsakymus turėtų vertinti atskiras teisėjas.
- **Agento rinkinys**: „patikrink, ar mano pagalbos agentas visada ieško dokumentacijoje ir niekada nesiunčia el. laiškų“. Chat suranda agentą ir išsaugo įrankių patikras bei ribas. Paprašius, paleidžia workflow, sukurdamas skirtingą įvestį kiekvienam vykdymui.
  - Agento rinkinio vykdymai yra tikri workflow vykdymai, todėl pasireiškia jų šalutinis poveikis. Chat nurodo, kiek vykdymų pradeda.
- **Baseline**: Chat gali dirbti su agento bazine linija trimis būdais:
  - Pateikti ją iš naujausių agento vykdymų.
  - Sukurti ją iš vykdymų, kuriuos pats pradeda („paleisk 5 kartus ir naudok tai kaip baseline“).
  - Išsaugoti jūsų nurodytus skaičius („nustatyk baseline į 3 sekundes p95 ir 0,01 $ už vykdymą“).
- **Vykdymai**: Chat laukia vykdymo iki vienos minutės, o tada praneša rezultatą:
  - Užklausų rinkiniui: kiekvieno modelio sėkmingų testų skaičių ir nepavykusius atvejus.
  - Agento rinkiniui: sėkmės rodiklį, nepavykusias patikras ir nuokrypį nuo bazinės linijos.
  - Ilgesnis vykdymas tęsiamas Evals; paprašykite Chat patikrinti jį vėl.

Kai Chat sukuria arba pakeičia rinkinį, atsakyme rodoma kortelė su rinkinio pavadinimu, jo tipu ir mygtuku **Atidaryti Evals**, panašiai kaip išsaugoto workflow kortelė. Per MCP `heym_chat` rezultate pateikiama kiekvieno tame iškvietime išsaugoto rinkinio nuoroda.

Tas pats veikia iš MCP kliento per `heym_chat` (žr. [Chat naudojimas iš MCP kliento](#chat-naudojimas-iš-mcp-kliento)). Vertinimo įrankiai lieka `heym_chat` viduje; MCP klientai nemato jų kaip atskirų įrankių.

Redaktoriaus AI asistentas rinkinių nekuria.

## Susiję

- [MCP / A2A Tab](./mcp-tab.md) – Pateikite šį variklį MCP klientams kaip `heym_chat` įrankį
- [Nustatymai](../reference/user-settings.md) – Nustatykite vartotojo taisykles, taikomas visiems pokalbių užklausoms
- [Kredencialų Tab](./credentials-tab.md) – Pridėkite ir valdykite API raktus
- [Kintamųjų Tab](./global-variables-tab.md) – Globalūs kintamieji, prieinami Chat
- [Mazgų tipai](../reference/node-types.md) – LLM ir Agent mazgai workflows
- [Agent mazgas](../nodes/agent-node.md) – AI Agent su įrankių skambinimu
- [AI Asistentas](../reference/ai-assistant.md) – Redaktoriaus asistentas, veikiantis pagal tą pačią workflow kūrimo DSL
- [Vykdymo istorija](../reference/execution-history.md) – Peržiūrėkite ankstesnius vykdymus (Istorijos mygtukas antraštėje)
- [Tvarkaraščio Tab](./scheduled-tab.md) – Artėjančių cron vykdymų kalendorius (tos pačios duomenys, kuriuos Chat gali apibendrinti)
- [Įspėjimų Tab](./alerts-tab.md) – Slenkstinės įspėjimai, kuriuos Chat gali išvardyti ir paaiškinti
- [Kontekstinis demonstravimas](../reference/contextual-showcase.md) – Kompaktiška programėlės orientacija šiai svetainei
- [Chat balsas (TTS & STT)](../reference/chat-voice.md) – Skaitykite pranešimus garsiai ir kalbėkite be rankų su ElevenLabs

## Įrankių skambučiai ir konteksto dydis

Kiekvieną kartą, kai asistentas iškviečia įrankį (vykdydamas workflow, išvardydamas vykdymus, kurdamas naują workflow), pokalbyje pasirodo suskleidžiamas kortelė. Kortelė automatiškai išsiplečia, kol įrankis veikia, rodydama tikslius argumentus. Kai įrankis baigia darbą, kortelė suskleidžia į vienos eilutės santrauką su praėjusiu laiku. Paspauskite bet kurią kortelę, kad vėl išplėstumėte argumentus ir atsakymo santrauką.

Maža žiedinė ženklo piktograma po įvesties lauku rodo dabartinį konteksto naudojimą kaip procentą nuo modelio lango (pvz., `12% · ~9.2k`). Užveskite pelę ant ženklo, kad pamatytumėte išsamią informaciją: sistemos prompt, AGENTS.md, workflows blokas, vartotojo taisyklės, istorija ir jūsų juodraštinė įvestis. Kai naudojimas viršija 80%, žiedas tampa gintarinis; 95% jis tampa raudonas.

Jei naudojimas artėja prie ribos, Heym automatiškai suspaudžia senesnius pranešimus į trumpą santrauką, naudodamas tą pačią mechaniką, kurią naudoja agentų mazgai. Inline pasirodo kortelė "Kontekstas suspaustas", kad parodytų, kas įvyko.
