# Chat fül

A **Chat** fül közvetlen LLM chat felületet biztosít. Használja modellek tesztelésére, kérdések feltevésére, meglévő workflow-k futtatására vagy új workflow létrehozására természetes nyelvű kérés alapján.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Chat demó megtekintése</a></p>

## Beállítás

1. Válasszon egy [hitelesítési adatot](./credentials-tab.md) (API kulcs az OpenAI-hoz, Google-höz stb.)
2. Válasszon egy modellt a legördülő menüből (a modellek a kiválasztott hitelesítési adatból töltődnek be)
3. Kezdjen el gépelni üzenetek küldéséhez

Beszélgetést a [Workflow-k fül](./workflows-tab.md) chat mezőjéből is indíthat. Ez elküldi az első üzenetét, és itt megnyitja az új beszélgetést, ahol a válasz már streamel.

## Funkciók

- **Globális változók kontextus** – A [Globális változók](../reference/global-variables.md) elérhetők az LLM számára, így kérdezhet vagy hivatkozhat a tárolt értékekre
- **Workspace sablon kontextus** – A workspace-ben megosztott workflow- és csomópont-sablonok kontextusként szerepelnek, így a Chat válaszolni tud az elérhető sablonokkal kapcsolatos kérdésekre
- **Hosszan futó ügynök** – A Chat a háttérben akkor is dolgozik, ha a böngésző bezárul, így egy másik eszközről visszatérve ugyanazt a beszélgetést folytathatja
- **Workflow létrehozás** – Kérje meg a Chatet workflow létrehozására vagy beállítására; ugyanazt a Workflow AI Builder motort használja, mint a szerkesztő asszisztense, hogy létrehozza és mentse a workflow-t
- **Kanban feladat létrehozás** – Kérje természetes módon egy feladat hozzáadását vagy kártya létrehozását. A Chat a kért tábla első oszlopához adja hozzá; ha több táblája van, és nem nevez meg egyet, a Chat táblaválasztót jelenít meg a kártya létrehozása előtt
- **Sorba állított utánkövetések** – Küldjön további üzeneteket, miközben egy válasz streamel. A sorba állított üzenetek megmaradnak, szerkeszthetők vagy törölhetők az indulás előtt, és az aktív válasz után sorrendben futnak le
- **Tervezési szünetek** – Amikor a Chatnek tervezési részletekre van szüksége, tisztázó kérdéseket tesz fel, és szünetelteti a sorba állított utánkövetéseket, amíg Ön nem válaszol. A tervezési válasz befejezése után a sorba állított üzenetek folytatódnak
- **Hitelesítési adatok** – Amikor a Chat által létrehozott vagy szerkesztett workflow-hoz hitelesítési adat szükséges, a Chat megkérdezi, melyiket használja, felajánlja egy új létrehozását a beszélgetésben, vagy hagyja, hogy nélküle folytassa. Azt is kérheti a Chattől, hogy hozzon létre hitelesítési adatot, vagy frissítsen egy Ön által birtokoltat; ez megnyitja a hitelesítési adat űrlapját a beszélgetésben. A modell a hitelesítési adat nevét és típusát látja, az értékeit soha. Lásd: [AI asszisztens › Hitelesítési adatok](../reference/ai-assistant.md#credentials)
- **Adattáblák** – Amikor a Chat által létrehozott vagy szerkesztett workflow rekordokat tárol, a Chat megkérdezi, melyik [adattáblát](./datatable-tab.md) használja, vagy felajánlja egy új létrehozását a workflow-hoz szükséges oszlopokkal. Kilistázhatja a tábláit és azok oszlopait is. Sorokat soha nem olvas vagy ír. Lásd: [AI asszisztens › Adattáblák](../reference/ai-assistant.md#data-tables)
- **Streamelő válaszok** – A modell kimenetének megtekintése streamelés közben
- **Válasz leállítása** – Az aktuális streamelő válasz bármikor megszakítható; a leállítás az adott beszélgetés sorba állított üzeneteit is törli
- **Markdown megjelenítés** – A válaszok támogatják a markdown formázást, beleértve a beágyazott képeket is
- **Kép megjelenítés** – A válaszokba ágyazott képek (pl. LLM képgenerálásból) beágyazottan jelennek meg; kattintson bármely képre a teljes képernyős megtekintéshez. A teljes képernyős nézet bezárásához nyomja meg az **Esc** billentyűt vagy a vissza gombot (mobilon)
- **Üzenetek másolása** – Bármely üzenet vágólapra másolása
- **Chat törlése** – Új beszélgetés indítása
- **Hangbevitel** – Használja a mikrofon gombot beszédfelismeréshez (böngésző által támogatott). Amikor a felvétel leáll, a Heym könnyedén megtisztíthatja az átiratot, mielőtt elküldi
- **Ütemezett workflow-k** – Kérdezze meg, mikor futnak a cron workflow-k (ma, ezen a héten, ebben a hónapban vagy egyéni dátumtartományban). Az asszisztens ugyanazokat az ütemezési adatokat használja, mint az [Ütemezések](./scheduled-tab.md) fül, és az eredményeket korlátozhatja az Ön által birtokolt workflow-kra, vagy az Önnel megosztottakat is belefoglalhatja
- **Workflow futtatási előzmények** – Kérdezzen egy workflow-ról ("hányszor futott le a napi jelentés?", "sikertelen volt?", "mikor futott utoljára?"). A Chat az azonosítója alapján keresi ki a workflow-t, és a futtatási számából, állapot szerinti bontásából, első és utolsó futtatási idejéből, valamint átlagos időtartamából válaszol. Kérdezze meg, miért hibázott egy futtatás, vagy mit adott vissza, és a Chat megnyitja azt az egyetlen futtatást, hogy elolvassa annak bemeneteit, kimeneteit és csomópontonkénti hibáit
- **Élő futtatási állapot** – Kérdezze meg, mi fut éppen most, és a Chat a számmal, a workflow-nevekkel, az egyes futtatások időtartamával, az aktuális csomóponttal és egy közvetlen hivatkozással válaszol az élő futtatásra
## Chat használata MCP-kliensből

A Chat motor a böngészőn kívülről is elérhető. Engedélyezze a **Heym Chat Tool** eszközt az [MCP lapon](./mcp-tab.md), és az MCP-kliensek — a Claude, a Cursor és bármi más, ami MCP-t beszél — egyetlen `heym_chat` eszközt kapnak, amely ugyanezt a motort futtatja, annak minden képességével együtt.

Ezek a beszélgetések e lap előzményeibe kerülnek, és a beszélgetéslistában egy dugasz ikon jelöli őket. Nyisson meg egyet, hogy elolvassa, mit kért a kliens, lássa az általa kiváltott eszközkártyákat, és Ön is folytathassa a beszélgetést. A tisztázó kérdés megválaszolása ugyanúgy működik, akár innen, akár egy MCP-kliensből indult a kör.

MCP-n keresztül a Chat nem listázza, nem választja ki és nem hozza létre a hitelesítési adatokat. Az általa épített workflow-k üresen hagyják a hitelesítési adatok mezőit, és a válasz megnevezi azokat a csomópontokat, amelyekhez hitelesítési adat szükséges, így Ön beállíthatja azokat a szerkesztőben.

Az adattáblák MCP-n keresztül is működnek: a Chat listázza a tábláit, újakat hoz létre, és beköti azokat az általa épített workflow-kba. A táblázatra vonatkozó kérdése szövegként érkezik az eredményben, ezért ugyanazzal a `conversation_id`-vel válaszoljon rá.

## Kontextuslimit

A chat legfeljebb 25 legutóbbi üzenetet tart a kontextusban. A régebbi üzenetek levágásra kerülnek, hogy a modell korlátain belül maradjon.

## Workflow-k létrehozása

Amikor arra kéri a Chatet, hogy hozzon létre, építsen, generáljon vagy állítson be egy workflow-t, az létrehoz egy új, mentett workflow-t egy generált névvel és leírással. A válasz tartalmazza a generált csomópontok és élek írásvédett vászon-előnézetét, valamint egy **Open workflow** hivatkozást, amely új böngészőlapon nyitja meg a workflow-szerkesztőt. Az előnézeti kártya **Run** gombját akkor használja, amikor végre szeretné hajtani a workflow-t.

Az ugyanabban a chatben adott utólagos visszajelzés azt a workflow-t szerkeszti, ahelyett hogy újat hozna létre. Ha például a Chat létrehozott egy workflow-t, mondhatja, hogy „add an approval step", „change the output format" vagy „şöyle yap", és a Chat frissíti a mentett workflow-t, valamint újratölti az előnézetet.

Ez azokra a kérésekre a legalkalmasabb, amelyeknél a munkát újrafelhasználható automatizálásként szeretné elvégezni, nem csupán egyszeri válaszként.

## Kanban-feladatok létrehozása

Kérje a Chatet közönséges nyelven, például: „Add a task called Fix login bug" vagy
„Create a new card Update documentation on the Launch board." Ugyanabban a kérésben
leírást is megadhat. A Chat mindig a kiválasztott tábla első oszlopában hozza létre a kártyát.

Ha a munkaterületén több tábla van, és nem jelöl meg egyet, a Chat szünetel egy
egyszerű választásos táblaválasztóval. Válasszon ki egy táblát a kártya létrehozásának befejezéséhez. Nem szükséges
slash-parancs vagy különleges üzenetformátum.

## Annak megkérdezése, mi fut

Kérdezzen közönséges nyelven — „what is running?", „how many workflows are active right now?",
„which node is the nightly report on?" —, és a Chat beszámol az élő képről:

- **Hány** végrehajtás van folyamatban, futóra és emberi felülvizsgálatra váróra bontva
- **Mely workflow-khoz** tartoznak, név szerint
- **Mennyi ideje** tart már az egyes futtatások (például `1m 35s`, `3h 25m`)
- **Melyik csomópont** hajtódik végre éppen, a vászon-címkéje szerint, valamint az utolsó befejezett csomópont
- **Egy hivatkozás** minden élő futtatáshoz, amely megnyitja a vásznat az adott végrehajtás visszajátszásával

A [Human-in-the-Loop](../reference/human-in-the-loop.md) vagy Codex-felülvizsgálat miatt szüneteltetett futtatások
Önre váróként jelennek meg, nem futóként. Ez ugyanaz az adat, mint a fejlécben lévő aktív futtatások jelvénye,
így a Chat és a jelvény soha nem mond ellent egymásnak. A már befejezett futtatásokhoz kérdezzen rá a legutóbbi végrehajtásokra
— az az [Execution History](../reference/execution-history.md) adatait olvassa.

## Riasztásokra vonatkozó kérdések

A Chat válaszolni tud az Ön által meghatározott [riasztásokkal](./alerts-tab.md) kapcsolatos kérdésekre:

- **Mi létezik** — „what alerts do I have?", „is there an alert on the invoice workflow?",
  „which alerts are firing right now?"
- **Hogyan van beállítva egy** — „what is the threshold on the cost alert?", „how is that configured?"
- **Miért és mikor aktiválódott** — „why did the cost alert fire?", „when did this last trigger?"

Egy „miért aktiválódott" kérdésnél a Chat elolvassa az aktiválási rekordot, és idézi a ténylegesen megfigyelt
értéket, a küszöbértéket és a kiértékelt pontos időablakot, valamint a hozzájáruló részleteket:
a hibás végrehajtás-azonosítókat és hibaüzeneteket a hiba-riasztásokhoz, a modellenkénti költést a költség-riasztásokhoz, vagy
a trigger-forrás szerinti bontást a végrehajtásszám-riasztásokhoz. Azt jelenti, ami az aktiválódás pillanatában igaz volt, ahelyett hogy újraszámolná az időablakot, mert az időablak eltelt, és egy friss számítás más eredményt adhat.

## Felhasználói szabályok

A [User Rules](../reference/user-settings.md) (a Settingsben beállítva) automatikusan bekerülnek minden Chat-beszélgetésbe rendszerszintű utasításként. Állítsa be egyszer, hogy állandó preferenciákat alkalmazzon minden chat-kérésre.
## Kapcsolódó

- [MCP lap](./mcp-tab.md) – Tegye elérhetővé ezt a motort MCP kliensek számára `heym_chat` eszközként
- [Beállítások](../reference/user-settings.md) – Állítsa be az összes chat-kérésre érvényes felhasználói szabályokat
- [Hitelesítési adatok lap](./credentials-tab.md) – API-kulcsok hozzáadása és kezelése
- [Változók lap](./global-variables-tab.md) – A Chat számára elérhető globális változók
- [Csomóponttípusok](../reference/node-types.md) – LLM és Agent csomópontok workflow-khoz
- [Agent csomópont](../nodes/agent-node.md) – AI Agent eszközhívással
- [AI-asszisztens](../reference/ai-assistant.md) – Szerkesztőasszisztens, amelyet ugyanaz a workflow-építő DSL hajt meg
- [Futtatási előzmények](../reference/execution-history.md) – Korábbi futtatások megtekintése (Előzmények gomb a fejlécben)
- [Ütemezések lap](./scheduled-tab.md) – A közelgő cron-futtatások naptára (ugyanazok az adatok, amelyeket a Chat össze tud foglalni)
- [Riasztások lap](./alerts-tab.md) – Küszöbérték-riasztások, amelyeket a Chat listázni és magyarázni tud
- [Kontextuális bemutató](../reference/contextual-showcase.md) – Kompakt, alkalmazáson belüli eligazítás ehhez az oldalhoz
- [Chat hang (TTS és STT)](../reference/chat-voice.md) – Üzenetek felolvasása és kéz nélküli beszélgetés ElevenLabs segítségével

## Eszközhívások és kontextusméret

Minden alkalommal, amikor az asszisztens meghív egy eszközt (workflow futtatása, futtatások listázása, új workflow építése), egy összecsukható kártya jelenik meg a beszélgetésben. A kártya automatikusan kinyílik, amíg az eszköz fut, és megmutatja a pontos argumentumokat. Amikor az eszköz befejeződik, a kártya egy egysoros összefoglalóvá csuklik össze az eltelt idővel együtt. Kattintson bármelyik kártyára az argumentumok és a válasz összefoglalójának újbóli kinyitásához.

A beviteli mező alatti kis gyűrű alakú jelvény a jelenlegi kontextushasználatot mutatja a modell ablakának százalékában (pl. `12% · ~9.2k`). Vigye az egérmutatót a jelvény fölé a részletes bontásért: rendszer-prompt, AGENTS.md, workflow-blokk, felhasználói szabályok, előzmények és az Ön által beírt szöveg. Amikor a használat átlépi a 80%-ot, a gyűrű borostyánsárgára vált; 95%-nál pirosra.

Ha a használat közel kerül a korláthoz, a Heym automatikusan tömöríti a régebbi üzeneteket egy rövid összefoglalóvá, ugyanazzal a mechanizmussal, amelyet az agent csomópontok is használnak. Egy „Kontextus tömörítve" kártya jelenik meg a szövegben, hogy megmutassa, mi történt.
