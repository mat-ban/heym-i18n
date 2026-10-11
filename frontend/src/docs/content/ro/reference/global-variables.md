# Variabile Globale

**Depozitul de Variabile Globale** păstrează date persistente de tip cheie-valoare, la nivel de utilizator, care supraviețuiesc de-a lungul execuțiilor workflow-urilor. Utilizați-l pentru configurare, feature flags, contoare sau stare partajată de care au nevoie mai multe workflow-uri.

> **Nu stocați secrete aici.** Variabilele globale nu sunt un seif de secrete: valorile sunt stocate necriptate, sunt returnate în întregime oricui le partajați, iar colaboratorii le pot edita. Cheile API, parolele și token-urile aparțin secțiunii [Acreditări](./credentials.md), care le criptează în repaus și nu returnează niciodată secretul către client.

## Local vs Global

| Depozit | Sintaxă | Domeniu de aplicare | Persistență |
|-------|--------|-------|-------------|
| **Local workflow-ului** | `$vars.variableName` | Doar execuția curentă | În memorie, pierdut la încheierea execuției |
| **Global** | `$global.variableName` | Toate workflow-urile utilizatorului | Persistat în baza de date |

## Crearea Variabilelor Globale

1. **Din fila Variabile** – [Fila Variabile](../tabs/global-variables-tab.md): Creați, editați și ștergeți variabile direct.
2. **Dintr-un nod Variable** – Activați **Store in Global Variable Store** (`isGlobal: true`) în proprietățile nodului. Variabila este scrisă în depozit la rularea workflow-ului.

## Utilizarea în Expresii

Accesați variabilele globale cu `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Utilizați aceleași metode ca pentru variabilele locale workflow-ului (de ex. `.upper()`, `.length`, `.add()` pentru array-uri).

## Tipuri de Valori

Tipuri acceptate: `string`, `number`, `boolean`, `array`, `object`. Alegeți tipul la crearea sau editarea unei variabile.

## Partajarea Variabilelor Globale

Puteți partaja o variabilă globală cu alți utilizatori sau cu [Echipe](./teams.md) pentru ca aceștia să o poată utiliza în propriile workflow-uri.

- **Partajare cu utilizator** – Faceți clic pe pictograma de partajare de lângă o variabilă deținută, introduceți adresa de email a destinatarului și faceți clic pe **Share**. Destinatarul va vedea variabila în lista sa de Variabile Globale cu un badge **Shared** și o etichetă „Shared by &lt;adresa dvs. de email&gt;".
- **Partajare cu echipă** – În dialogul de partajare, selectați o echipă și faceți clic pe **Add**. Toți membrii echipei obțin acces.
- **Acces editabil** – Destinatarii pot vizualiza, edita și referi variabila partajată prin `$global.variableName` în workflow-urile lor. Doar proprietarul poate partaja, anula partajarea sau șterge variabila.
- **Conflicte de nume** – Dacă un destinatar are deja o variabilă cu același nume, variabila proprie are prioritate față de cea partajată.
- **Anularea partajării** – Deschideți dialogul de partajare pentru variabilă și faceți clic pe butonul **×** de lângă utilizatorul pentru care doriți să eliminați accesul.

## Integrare cu Chat

Variabilele globale sunt disponibile pentru asistentul [Chat](../tabs/chat-tab.md). LLM-ul le poate referi atunci când răspunde la întrebări sau generează conținut.

## Resurse Conexe

- [Fila Variabile](../tabs/global-variables-tab.md) – Gestionați variabilele globale în interfața UI
- [Nod Variable](../nodes/variable-node.md) – Setați variabile cu `isGlobal`
- [Expression DSL](./expression-dsl.md) – Sintaxa `$global`
