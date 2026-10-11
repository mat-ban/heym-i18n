# Decision

**Decision**-noden stiller en beslutningsmodel typificerede spørgsmål om kørslens aktuelle tilstand og returnerer sandsynligheder. Den genererer ikke tekst. Den anvendes, når en workflow har brug for en vurdering, der kan bruges til forgrening - routing, triage, rangering, verifikation eller styring af et trin, der ikke kan fortrydes.

Beslutningsmodeller (også kaldet *System One*-modeller) adskiller sig fra LLM-modeller. Der er ingen prompt, ingen systeminstruktion, ingen temperatur og ingen værktøjskald. Der sendes en **tilstand** samt et kort over **spørgsmål**, og hvert svar returneres som et tal med en sandsynlighedsfordeling bagved. Da et svar kun består af få tokens, er disse modeller hurtige og billige sammenlignet med at bede en [LLM](./llm-node.md)-node om at producere JSON og parse det.

Til tekstgenerering anvendes [LLM](./llm-node.md)-noden. Til en model, der kalder værktøjer, anvendes [Agent Node](./agent-node.md).

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | Providerens svar direkte - `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | En *Decision Model*-legitimationsoplysning. Ikke en LLM-legitimationsoplysning. |
| `model` | string | Modelnavn, f.eks. `jev-latest` |
| `state` | expression | Hvad modellen skal læse (standard `$input.text`) |
| `questions` | array | Ordnet række af spørgsmål; mindst ét |
| `customBodyEnabled` | boolean | Send en håndskrevet request body i stedet for formularen |
| `customBody` | expression (JSON) | Body, der sendes, når toggle er tændt |
| `requestTimeoutSeconds` | number | Maksimal ventetid i sekunder (standard: 60) |

### Tilstand

**Tilstand** er den situation, modellen vurderer. Den accepterer en streng, et objekt eller et array.

Et felt, der indeholder præcis ét udtryk, beholder sin egen type, så `$input` sender selve objektet i stedet for dets tekst. En skabelon med et udtryk indeni (`Ticket: $input.text`) bliver til en streng. Giv hvert spørgsmål nok at svare på: kildetekst, identiteter, relationer, politikker og aktuelle fakta.

## Spørgsmålstyper

Hvert spørgsmål har et `id`, en `type`, `instructions` og kriterier, der afhænger af typen.

`id` er, hvordan workflowet læser svaret tilbage. Det **sendes aldrig til modellen**, så hele betydningen skal ligge i `instructions`. At skrive `id: is_urgent` med `instructions: "Is it?"` giver modellen intet at arbejde med.

### Noul

Om en betingelse holder. Returnerer sandsynligheden for, at svaret er ja, fra 0 til 1.

Kriterier er valgfrie: **Yes means** og **No means** beskriver, hvad hver side dækker. En værdi tæt på 0,5 betyder, at modellen finder ja og nej omtrent lige sandsynlige - ikke "medium intensitet".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Læses med `$triage.answers.is_urgent.noul`.

### Choice

Vælger en mulighed fra et defineret sæt. Returnerer den valgte mulighed, den fulde fordeling og en tillid afledt af den.

Tilføj en mulighed, der dækker "ingen af disse", når intet kan passe - modellen kan ikke vælge en mulighed, der ikke er tilbudt.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Læses med `$triage.answers.department.choice`, `.probabilities.billing` og `.confidence`.

### Score

Vurderer tilstanden langs en ordnet rubrik. Returnerer en sandsynlighedsvægtet værdi, der kan lande **mellem** niveauer, plus legenden og fordelingen.

Niveauer rangeres lavest først, mindst to og højst ti. Hvert niveau bør beskrive en konkret situation og stå alene.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Læses med `$triage.answers.frustration.score`, `.legend` og `.confidence`.

## Generer med AI

**Generer med AI** omdanner en simpel sætning til en foreslået tilstandsskabelon og et sæt spørgsmålsrækker. Beskriv, hvad der skal vurderes - "triage en indgående supportbillet: hvor presserende den er, hvilket team der ejer den, og hvor frustreret kunden lyder" - og gennemgå, hvad der returneres, før det tilføjes til noden.

Udkastet udføres af en LLM, så dialogen beder om en LLM-legitimationsoplysning. Beslutningsmodellen besvarer spørgsmålene senere, når workflowet kører. Genererede id'er de-duplikeres mod de rækker, noden allerede indeholder, så generering to gange overskriver aldrig en eksisterende svarnøgle.

Hver generering registreres under fanen [Kørsler](../tabs/traces-tab.md) under kilden **Decision Questions**, sammen med `decision.systemone`-spor, der skrives af selve noden under kørsel.
## Brugerdefineret request body

Aktiver **Brugerdefineret request body** for at sende selvskrevet JSON i stedet for formularen. Anvend dette til en endpoint, hvis kontrakt afviger fra den, som formularen genererer.

Editoren præfyldes med den aktuelle form, og udtryk i den løses, før anmodningen sendes. Når tilvalget er aktiveret, ignoreres feltet State og spørgsmålsrækkerne. Svaret sendes uændret igennem uanset tilvalg, så en alternativ kontrakt producerer blot en anden struktur for udtrykkene at læse.

## Output

Noden returnerer præcis det, som udbyderen returnerede. Intet omdøbes eller flades ud.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Forgreningslogik baseret på svar

En [Switch](./switch-node.md)-node dirigerer baseret på det valgte alternativ, og en [Condition](./condition-node.md)-node kan sende lavtillids-sager til et sted, hvor en person vil se dem:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Et typet svar garanterer strukturen, ikke sandheden. Vælg tærskler mod egne data og konsekvenser i stedet for at kopiere et tal fra et eksempel.

## Legitimationsoplysninger

Opret en **Decision Model**-legitimationsoplysning under fanen [Legitimationsoplysninger](../tabs/credentials-tab.md) med:

- **Base URL** - endpointet, f.eks. `https://api.typesafe.ai`. Heym tilføjer `/v1/systemone`.
- **API Key** - valgfri. Endpoints, der ikke kræver nøgle, kan efterlades tomme.

Ved redigering af legitimationsoplysninger bevares den gemte nøgle, når nøglefeltet efterlades tomt; indtast den kun på ny for at erstatte den.

Den samme legitimationsoplysning kan bedømme [Evalueringer](../tabs/evals-tab.md)-kørsler: ved valg af **LLM-as-Judge** vælges den som bedømmer, og beslutningsmodellen scorer hvert svar mod det forventede output.

Heym blokerer som standard udgående anmodninger til private og loopback-adresser, så et beslutningsendpoint, der køres lokalt på `localhost` eller et privat netværk, kræver `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Beslutningsmodeller optræder ikke i de LLM-pristabeller, som Heym synkroniserer, så kolonnen **Cost** i [Kørsler](../tabs/traces-tab.md) forbliver tom for disse kald. Tokenantal registreres stadig, og det er muligt at tilføje en brugerdefineret pris med en prisoverride.

## Fejl

| Situation | Hvad der sker |
|-----------|--------------|
| Ugyldig API-nøgle | Noden fejler med en besked, der nævner legitimationsoplysningen |
| Ugyldigt formateret spørgsmål | Udbyderens egen feltniveau-besked overføres til nodefejlen |
| Rate begrænset eller overbelastet | Noden fejler med en besked om, at tilstanden er midlertidig - aktiver [retry](../reference/features.md) for denne node for at overleve det |
| Duplikeret eller tomt spørgsmål-id | Noden fejler, før nogen anmodning sendes |

## Relateret

- [LLM Node](./llm-node.md) – Generer tekst i stedet for en vurdering
- [Agent Node](./agent-node.md) – Indsaml beviser med værktøjer, og vurder dem herefter
- [Switch Node](./switch-node.md) – Diriger baseret på valgt mulighed
- [Condition Node](./condition-node.md) – Filtrer baseret på tillid
- [Node Types](../reference/node-types.md) – Oversigt over alle nodetyper
- [Credentials](../reference/credentials.md) – Typer af legitimationsoplysninger og felter
- [Traces Tab](../tabs/traces-tab.md) – Inspicer beslutningskald og tokenforbrug
