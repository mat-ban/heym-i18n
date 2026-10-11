# Udtryksvurderingsdialog

Udtryksvurderingsdialogen er den udvidede editor til felter med udtryksunderstøttelse. Den åbnes via udvidelsesknappen ved siden af et udtryksinput og giver et større arbejdsområde, autofærdiggørelse, live backend-forhåndsvisning og outputgennemgang på ét sted.

## Åbning af dialogen

- Klik på udvidelsesknappen ved siden af et udtryksfelt i egenskabspanellet.
- Flerlinjefelter viser knappen inde i inputfeltet.
- Enkeltlinjefelter viser knappen til højre for inputfeltet.

## Dialoglayout

- Dialogen åbnes som en centreret modal i størrelsen **80vw × 80vh**.
- Overskriften viser **Evaluer — {feltnavn}** når feltetiketten er kendt.
- Editoren bevarer autofærdiggørelse, felt-til-felt-navigation og de sædvanlige handlinger **Anvend** / **Annuller**.
- Forhåndsvisningen opdateres automatisk cirka **300 ms** efter der holdes pause i tastningen.
- Tryk `Ctrl` / `Cmd` + `Enter` for at anvende den aktuelle tekst tilbage på feltet og lukke dialogen (samme som **Anvend**).

## Outputsektion

Outputområdet opdateres automatisk efter pause i redigeringen.

### Evaluering

| Udtrykstype | Resultat |
|---|---|
| Enkelt `$expr` (hele feltet) | Oprindelig værdi bevares |
| Enkelt direkte sti (hele feltet, uden `$`, ingen indlejrede linjeskift) | Samme som `$` + stien (backend normaliserer til evaluering) |
| Tekst med indlejrede `$refs` | Endeligt resultat er altid en streng |
| Bogstavelig tekst (uden `$`, ikke en enkelt sti) | Returneres uændret |

**Eksempler**

| Input | Resultat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (samme som `$input.items` når hele værdien er denne sti) | `[1, 2, 3]` |
| `Hej $input.name` | `Hej John` |
| `$input.count + 1` | `6` |
| `bare tekst` | `bare tekst` |

Evalueringens kontekst bygges i denne rækkefølge:

- **Fastgjorte data** fra opstrømsnoder
- **Seneste kørselsoutput** fra canvas
- `null` når ingen opstrømsdata er tilgængelige

Hvis den aktuelle node har opstrømsafhængigheder, men ingen af dem har fastgjorte data eller et seneste kørselsresultat, udfører dialogen først en testkørsel for at bygge kontekst og evaluerer derefter den aktuelle tekst.

### Outputsti-vælger

Når backend-resultatet er et objekt eller en array, kan Output-området vise en interaktiv stivælger i stedet for rå JSON.

- Dobbeltklik på en række for at tilføje stien til den aktuelle `$node.path`-reference.
- Enkeltklik på udvidelige rækker for at åbne eller lukke grene.
- Brug den indbyggede søgeboks til at søge efter nøgler, værdier og stistrenge.

## Autofærdiggørelse

- Skriv `$` for at åbne forslag til opstrømsnoder, indbyggede funktioner og metoder.
- Tryk `Tab` eller `Enter` for at indsætte det valgte forslag.
- Brug `↑` / `↓` for at navigere i forslagslisten.

### Eksempelsvar

Når en `$…`-reference fortsættes med et punktum, viser hver forslagsrække det svar, som forslaget ville producere, markeret med fed skrift til højre på rækken.

- Ved indtastning af `$set.listItems.first().toString().u` vises `upper`, `urlEncode`, `urlDecode` og `unescape`, hver med det evaluerede resultat — så der kan vælges baseret på output i stedet for navn.
- Ved indtastning af `$node.text.toJson()` parses en JSON-streng til et objekt eller en array. Efter `.toJson()` kan autofærdiggørelse tilbyde de parsed nøgler (f.eks. `repoUrl`) når seneste kørsel eller fastgjort output er tilgængeligt.
- Resultater evalueres i backend mod de samme fastgjorte data og seneste kørselsoutput, som dialogens forhåndsvisning bruger, så de matcher, hvad feltet vil producere.
- Kun forslag, der står alene, evalueres: nul-argumentmetoder (`upper()`, `first()`, `keys()`, `toJson()`) og simple egenskaber (`length`, `year`). Forslag, der kræver argumenter først — `map`, `filter`, `sort`, `replace` — forbliver tomme.
- En række forbliver tom, når kandidaten ikke giver noget svar: en fejl, `null` eller en metode, der ikke gælder for den pågældende værdi.
- Svar forkortes til én linje. Hold markøren over et forkortet svar for at se mere.

## Byg med AI

Knappen **Byg med AI** vises i øverste højre hjørne af evalueringsdialogen, når et workflow er indlæst. Den åbner en indlejret modal, hvor der kan beskrives det ønskede udtryk i almindelig tekst og få en LLM til at generere det.

### Sådan fungerer det

1. Klik på **Byg med AI** i evalueringsdialogens værktøjslinje.
2. Vælg en LLM-legitimationsoplysning og model fra rullemenuerne.
3. Indtast en almindelig tekstbeskrivelse af det ønskede — f.eks. *"Hent kundens navn fra API-svaret"*.
4. Klik på **Generer**. Modalen kalder backend, som bruger [Expression DSL](./expression-dsl.md)-systemprompten plus de seneste workflowkørselsoutput som kontekst og returnerer et enkelt udtryk.
5. Det genererede udtryk evalueres straks mod de samme canvas-data, så resultatet kan ses før anvendelse.
6. Klik på **Anvend** for at erstatte editorindholdet med det genererede udtryk eller **Genindlæs** for at prøve igen.

### Brugt kontekst

Generatoren modtager nodeoutput fra den seneste testkørsel på canvas. Hvis workflowet ikke er kørt endnu, genererer LLM et bedste-forsøg-udtryk baseret på nodeetiketter og DSL-konventioner.

### Krav

- En LLM-legitimationsoplysning (OpenAI, Google eller Custom) skal være konfigureret under fanen [Legitimationsoplysninger](./credentials.md).
- Workflowet skal være åbent i editoren.

## Tastaturgenveje

| Genvej | Handling |
|---|---|
| Pause i tastning (~300 ms) | Opdater backend-forhåndsvisning |
| `Ctrl` / `Cmd` + `Enter` | Anvend og luk dialog |
| `Escape` | Luk autofærdiggørelse først, ellers luk dialog |
## Indlejrede `$` i metodeargumenter

Til dialog-/backendevaluering kan der anvendes en anden reference med en indlejret `$` i kald såsom `.get($other.field)`, når der kræves en dynamisk nøgle. Det er også muligt at bruge en direkte sti inden for `.get(...)` (for eksempel `other.field`); backenden håndterer det på samme måde. Gemte workflow-felter bør stadig følge reglerne for [Expression DSL](./expression-dsl.md). Evaluate-API'en accepterer også en fuld linje med direkte punktsti for nemheds skyld (se tabellen ovenfor).

## Navigation

Set- og Execute-mappingeditorer kan vise **Forrige** / **Næste**-knapper, så der kan navigeres mellem felter uden at lukke dialogen.

## Relateret

- [Expression DSL](./expression-dsl.md)
- [Node-typer](./node-types.md)
- [Legitimationsoplysninger](./credentials.md) — påkrævet til funktionen "Build with AI"
- [LLM-node](../nodes/llm-node.md)
- [Output-node](../nodes/output-node.md)
- [Condition-node](../nodes/condition-node.md)
