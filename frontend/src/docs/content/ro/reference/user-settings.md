# Setări

Dialogul Setări vă permite să vă gestionați profilul, să setați instrucțiuni AI persistente, să vă actualizați parola contului, să configurați vocea chatului, să setați credențialul și modelul AI implicite și să verificați starea de observabilitate. Deschideți-l făcând clic pe **avatarul și numele dumneavoastră** din colțul din dreapta sus al antetului.

## Deschiderea dialogului

Faceți clic pe **avatarul și numele dumneavoastră** din colțul din dreapta sus al antetului. Dialogul se deschide cu următoarele file: **Profile**, **Security**, **Voice**, **AI Defaults** și **Observability**. Administratorii de instanță văd de asemenea filele **SSO**, **Heym Work** și **Instances**.

## Fila Profile

### Fotografia de profil

Heym afișează fotografia dumneavoastră de [Gravatar](https://gravatar.com) pentru adresa de email a contului în antet, lângă mesajele dumneavoastră din [Chat](../tabs/chat-tab.md) și **Chat with Heym**, pe comentariile din [Board](../tabs/board-tab.md) și lângă numele dumneavoastră în dialogurile de partajare și în listele de membri ai echipei. Pentru a o schimba, actualizați fotografia pe Gravatar; Heym o preia pe cea nouă în câteva ore. Fără o fotografie Gravatar, Heym afișează prima literă a numelui dumneavoastră.

Fotografia este preluată de serverul Heym și stocată în cache acolo, astfel încât browserul dumneavoastră nu contactează niciodată Gravatar. Dacă serverul nu poate accesa Gravatar, toată lumea continuă să vadă iniţialele.

### Nume

Numele dumneavoastră afișat în întreaga aplicație. Acest câmp este obligatoriu și nu poate fi lăsat gol.

### User Rules

User Rules sunt instrucțiuni personalizate injectate automat în fiecare cerere AI—atât în constructorul de workflow-uri, cât și în chatul din dashboard. În **constructorul de workflow-uri** ([AI Assistant](./ai-assistant.md)), acestea sunt adăugate la promptul de sistem folosit pentru generarea JSON-ului de workflow. În **chatul din dashboard**, acestea sunt aplicate ca context la nivel de sistem. Le scrieți o dată și se aplică global fără a le repeta în fiecare prompt.

**Utilizări frecvente:**

- Limbă sau ton: `Always respond in English. Keep responses concise.`
- Stil de codare: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Convenții de workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Format de răspuns: `Use bullet points. Avoid lengthy explanations.`

**Unde se aplică:**

| Context | Descriere |
|---------|-------------|
| **Constructor de workflow-uri** | Cereri [AI Assistant](./ai-assistant.md) pentru generarea sau modificarea workflow-urilor |
| **Chat din dashboard** | Toate conversațiile din [Chat tab](../tabs/chat-tab.md) |

User Rules sunt injectate la nivel de sistem—rulează înaintea fiecărui prompt automat, fără configurare suplimentară per workflow sau conversație.

### Salvarea modificărilor de profil

Faceți clic pe **Save Changes** pentru a aplica. Modificările intră în vigoare imediat pentru toate cererile AI noi.

## Fila Security

### Schimbarea parolei

Utilizați fila Security pentru a vă actualiza parola contului.

**Cerințe:**

| Regulă | Cerință |
|------|-------------|
| Lungime minimă | 8 caractere |
| Majuscule | Cel puțin o literă majusculă (A–Z) |
| Minuscule | Cel puțin o literă minusculă (a–z) |
| Cifră | Cel puțin un număr (0–9) |

Parola trebuie de asemenea să difere de parola dumneavoastră actuală. Aceste reguli sunt impuse atât pe frontend, cât și pe backend.

**Pași:**

1. Introduceți **Current Password**
2. Introduceți **New Password** (trebuie să îndeplinească toate cerințele de mai sus)
3. Reintroduceți în **Confirm New Password**
4. Faceți clic pe **Update Password**

Dacă parola actuală este incorectă, se afișează un mesaj de eroare inline. La succes, apare un mesaj de confirmare și formularul se resetează automat.

## Fila Voice

Fila Voice configurează vocea vorbită pentru [Chat tab](../tabs/chat-tab.md): alegeți un **ElevenLabs credential** (sau adăugați unul inline), alegeți o **Voice** din contul dumneavoastră ElevenLabs și **Save Voice Settings**. Aceasta activează citirea cu voce tare per mesaj și modul vocal interactiv. Consultați [Chat Voice (TTS & STT)](./chat-voice.md) pentru fluxul complet.

## Fila AI Defaults

Fila AI Defaults are două secțiuni.

### Credențial și model preferate

Alegeți un **preferred LLM credential** și un **model** din acesta. Acesta devine valoarea implicită de pornire pentru fiecare funcție AI din aplicație — chat, [AI Assistant](./ai-assistant.md) (builder, analyzer și creare de workflow-uri), board mapper, widget-uri AI de dashboard, [docs chat](../tabs/chat-tab.md), ajutorul de schemă AI pentru tabele de date, constructorul de expresii și evals — ori de câte ori acea suprafață nu are o selecție salvată proprie.

Regula de selecție pe care o urmează fiecare suprafață este:

1. **Selecție salvată** — o alegere pe care ați făcut-o deja pe acea suprafață (de exemplu, ultimul model al unei conversații de chat) câștigă întotdeauna.
2. **Preferred** — utilizat atunci când nu există o selecție salvată.
3. **Primul credențial disponibil** — valoarea de rezervă atunci când nu ați setat nicio preferință.

Puteți schimba în continuare credențialul și modelul per suprafață în orice moment; preferința completează doar valoarea implicită inițială. Lăsați credențialul ca **No preference** pentru a păstra comportamentul anterior al primului credențial. Dacă credențialul dumneavoastră preferat este ulterior șters sau nepartajat, fila afișează o notificare și suprafețele revin silențios la primul credențial disponibil.
### Utilizarea pachetului de codare

Pentru fiecare acreditare **Codex** (inclusiv cele partajate), fila afișează utilizarea rămasă din limita de rată sub forma unei bare orizontale pentru fiecare fereastră activă — de exemplu o fereastră de **5 ore** și/sau o fereastră **Săptămânală**, în funcție de planul dumneavoastră. Fiecare bară afișează procentul de cotă rămasă și o numărătoare inversă până la resetare. Un buton **Refresh** reîncarcă datele la cerere (rezultatele sunt stocate temporar în cache pe server).

Pentru fiecare acreditare **OpenCode**, fila afișează ferestrele de abonament OpenCode Go — **5 ore**, **Săptămânal** și **Lunar** — sub forma aceluiași stil de bară, citite din endpoint-ul de utilizare autentificat al gateway-ului cu cheia API a respectivei acreditări. O fereastră care și-a atins plafonul este afișată ca **„limită atinsă"** în culoarea chihlimbar. Dacă cheia este invalidă sau spațiul de lucru nu are un abonament Go, cardul explică motivul în loc să afișeze bare.

## Fila Observability

Fila Observability afișează starea read-only a [OpenTelemetry Tracing](./opentelemetry.md) pentru această instanță: dacă tracing-ul este activat, endpoint-ul OTLP, numele serviciului, raportul sampler-ului și ce span-uri sunt emise. Tracing-ul este configurat prin variabilele de mediu `HEYM_OTEL_*` de pe backend, astfel încât această filă nu editează nimic. Când tracing-ul este dezactivat, fila listează variabilele de mediu necesare pentru a-l activa. Secretele precum anteturile de autentificare OTLP nu sunt niciodată afișate aici. Consultați [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) pentru referința completă de configurare.

## Fila SSO

Vizibilă doar administratorilor instanței — conturile listate în `HEYM_ADMIN_EMAILS`. Această filă conectează Heym la un furnizor extern OpenID Connect, astfel încât utilizatorii să se autentifice cu conturile pe care le dețin deja. Introduceți un URL de issuer și acreditările de client, copiați URI-ul de redirecționare read-only în furnizorul dumneavoastră și rulați **Test connection** înainte de a-l activa. Autentificarea prin parolă poate fi dezactivată de aici după ce testul trece. Consultați [Single Sign-On](./sso.md) pentru configurarea completă.

## Fila Heym Work

Administratorii de instanță conectează aici [Heym Work](./heym-work.md), interfața pentru echipele de business: adresa acesteia, o cheie de integrare afișată o singură dată și comutatorul **Enable Heym Work**. Fila arată, de asemenea, când a raportat ultima dată Heym Work, versiunea sa și starea licenței. Consultați [Conectarea Heym Work](./heym-work.md#connecting-heym-work).

## Fila Instances

Vizibilă doar administratorilor instanței — conturile listate în `HEYM_ADMIN_EMAILS`. Această filă listează instanțele Heym conectate la această bază de date și stabilește modul în care rulările din fundal sunt împărțite între ele. Fiecare rând afișează numele editabil al instanței, rolul acesteia, dacă este activă, latența măsurată către baza de date, un comutator on/off și ponderea sa. Ponderile sunt cote din instanțele care pot prelua lucru în momentul respectiv, nu procente din 100: cu `41 / 26 / 33` și a treia instanță oprită, primele două primesc efectiv 61% și 39%. Panoul afișează această împărțire efectivă sub tabel și refuză salvarea doar atunci când nicio instanță activată nu are deloc pondere.

**Give new instances a share automatically** este activat implicit: o instanță care se alătură ar sta altfel la ponderea 0 și nu ar primi nimic, astfel încât leader-ul îi acordă o cotă egală o singură dată și scalează ponderile existente în jos păstrându-le raporturile. Nu atinge niciodată o instanță a cărei pondere ați stabilit-o dumneavoastră.

Panoul raportează, de asemenea, câte dintre rulările ultimelor 24 de ore au putut fi executate doar pe instanța principală. Când această cotă este ridicată, ponderile de dedesubt nu pot muta acel lucru. Consultați [Load Distribution](./cluster.md) pentru ce rămâne pe main și cum să alegeți numerele.

## Ce nu se află în acest dialog

| Funcție | Unde o găsiți |
|---------|-----------------|
| **Gestionarea cheilor API (MCP)** | [MCP Tab](../tabs/mcp-tab.md) – vizualizați, copiați și regenerați cheia API a serverului MCP |
| **Temă (întunecată / luminoasă)** | Butonul de comutare Soare/Lună din antet (lângă insigna utilizatorului) |
| **Schimbarea adresei de email** | Momentan neacceptată |

## Resurse conexe

- [AI Assistant](./ai-assistant.md) – Chat-ul constructorului de Workflow care utilizează User Rules
- [Chat Tab](../tabs/chat-tab.md) – Chat-ul din Dashboard care utilizează User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Vocea ElevenLabs configurată în fila Voice
- [MCP Tab](../tabs/mcp-tab.md) – Cheia API a serverului MCP și expunerea instrumentelor de workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Chei API pentru nodurile AI și integrări
- [Security](./security.md) – Gestionarea sesiunilor, limitarea ratei, criptarea acreditărilor
- [Single Sign-On](./sso.md) – Conectați un furnizor extern OpenID Connect
- [OpenTelemetry Tracing](./opentelemetry.md) – Tracing distribuit pentru execuțiile de workflow și noduri
