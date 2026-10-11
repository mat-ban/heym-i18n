# Globale Variabler

**Global Variable Store** indeholder persistente nøgle-værdi-data med brugeromfang, som bevares på tværs af workflow-kørsler. Anvend dem til konfiguration, feature flags, tællere eller delt tilstand, som flere workflows har brug for.

> **Gem ikke hemmeligheder her.** Globale variabler er ikke til opbevaring af hemmeligheder: værdier gemmes ukrypterede, de returneres i fuldt omfang til alle, der deles med, og samarbejdspartnere kan redigere dem. API-nøgler, adgangskoder og tokens hører til i [Credentials](./credentials.md), som krypterer dem i hviletilstand og aldrig returnerer den hemmelige værdi til klienten.

## Lokale vs Globale

| Lager | Syntaks | Omfang | Persistens |
|-------|--------|-------|-------------|
| **Workflow-lokal** | `$vars.variableName` | Kun nuværende kørsel | I hukommelsen, tabes ved afslutning af kørsel |
| **Global** | `$global.variableName` | Alle workflows for brugeren | Persisteret i databasen |

## Oprettelse af Globale Variabler

1. **Fra fanen Variabler** – [Variabel-fanen](../tabs/global-variables-tab.md): Opret, rediger og slet variabler direkte.
2. **Fra en Variable-node** – Aktivér **Store in Global Variable Store** (`isGlobal: true`) i nodens egenskaber. Variablen skrives til lageret, når workflowet kører.

## Brug i Udtryk

Adgang til globale variabler med `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Anvend de samme metoder som for workflow-lokale variabler (f.eks. `.upper()`, `.length`, `.add()` for arrays).

## Værdityper

Understøttede typer: `string`, `number`, `boolean`, `array`, `object`. Vælg typen ved oprettelse eller redigering af en variabel.

## Deltagelse af Globale Variabler

Det er muligt at dele en global variabel med andre brugere eller [Teams](./teams.md), så de kan bruge den i deres egne workflows.

- **Del med bruger** – Klik på delingsikonet ved siden af en ejet variabel, indtast modtagerens e-mail, og klik på **Del**. Modtageren vil se variablen på deres liste over Globale Variabler med et **Delt**-mærke og en "Delt af &lt;den relevante e-mail&gt;"-etikette.
- **Del med team** – I delingsdialogen vælges et team, og der klikkes på **Tilføj**. Alle teammedlemmer får adgang.
- **Redigerbar adgang** – Modtagere kan se, redigere og referere til den delte variabel via `$global.variableName` i deres workflows. Kun ejeren kan dele, fjerne deling eller slette variablen.
- **Navnekonflikter** – Hvis en modtager allerede har en variabel med samme navn, har deres egen variabel forrang frem for den delte.
- **Fjern deling** – Åbn delingsdialogen for variablen, og klik på **×**-knappen ved siden af den bruger, der skal fjernes adgang for.

## Chat-integration

Globale variabler er tilgængelige for [Chat](../tabs/chat-tab.md)-assistenten. LLM'en kan referere til dem, når der besvares spørgsmål eller genereres indhold.

## Relateret

- [Variabel-fanen](../tabs/global-variables-tab.md) – Håndtering af globale variabler i brugergrænsefladen
- [Variable-node](../nodes/variable-node.md) – Indstilling af variabler med `isGlobal`
- [Expression DSL](./expression-dsl.md) – `$global`-syntaks
