# Decision

De **Decision**-node stelt getypte vragen aan een beslissingsmodel over de huidige status van de uitvoering en retourneert waarschijnlijkheden. De node genereert geen tekst. Gebruik deze wanneer een workflow een oordeel nodig heeft waarop deze kan vertakken — routering, triage, rangschikking, verificatie of het afschermen van een stap die niet ongedaan kan worden gemaakt.

Beslissingsmodellen (ook wel *System One*-modellen genoemd) zijn een ander soort model dan een LLM. Er is geen prompt, geen systeeminstructie, geen temperatuur en geen tool calling. U verzendt een **state** plus een map met **questions**, en elk antwoord komt terug als een getal met een kansverdeling erachter. Omdat een antwoord slechts enkele tokens bevat, zijn deze modellen snel en goedkoop vergeleken met het vragen aan een [LLM](./llm-node.md) om JSON te produceren en deze te parsen.

Gebruik voor tekstgeneratie de [LLM](./llm-node.md)-node. Gebruik voor een model dat tools aanroept de [Agent Node](./agent-node.md).

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | De providerrespons verbatim — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | Een *Decision Model*-referentie. Geen LLM-referentie. |
| `model` | string | Modelnaam, bijvoorbeeld `jev-latest` |
| `state` | expression | Wat het model moet lezen (standaard `$input.text`) |
| `questions` | array | Geordende vraagrijen; ten minste één |
| `customBodyEnabled` | boolean | Verzend een handmatig geschreven request body in plaats van het formulier |
| `customBody` | expression (JSON) | De body die wordt verzonden wanneer de toggle aan staat |
| `requestTimeoutSeconds` | number | Maximaal aantal seconden om te wachten (standaard: 60) |

### State

**State** is de situatie die het model beoordeelt. Het accepteert een string, een object of een array.

Een veld met exact één expressie behoudt zijn eigen type, dus `$input` verzendt het object zelf in plaats van de tekst ervan. Een sjabloon met een expressie erin (`Ticket: $input.text`) resulteert in een string. Geef elke vraag voldoende om mee te antwoorden: brontekst, identiteiten, relaties, beleidsregels en actuele feiten.

## Vraagtypen

Elke vraag heeft een `id`, een `type`, `instructions` en criteria die afhankelijk zijn van het type.

De `id` is hoe uw workflow het antwoord terugleest. Deze wordt **nooit naar het model verzonden**, dus de volledige betekenis moet in `instructions` staan. Het schrijven van `id: is_urgent` met `instructions: "Is it?"` geeft het model niets om mee te werken.

### Noul

Of een voorwaarde geldt. Retourneert de waarschijnlijkheid dat het antwoord ja is, van 0 tot 1.

Criteria zijn optioneel: **Yes means** en **No means** beschrijven wat elke zijde dekt. Een waarde nabij 0,5 betekent dat het model ja en nee ongeveer even waarschijnlijk acht — niet "gemiddelde intensiteit".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Lees het met `$triage.answers.is_urgent.noul`.

### Choice

Kiest één optie uit een door u gedefinieerde set. Retourneert de gekozen optie, de volledige verdeling en een daarvan afgeleide confidence.

Voeg een optie toe die "geen van deze" dekt wanneer niets kan passen — het model kan geen optie kiezen die u niet heeft aangeboden.

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

Lees het met `$triage.answers.department.choice`, `.probabilities.billing` en `.confidence`.

### Score

Beoordeelt de state volgens een geordend rubric. Retourneert een waarschijnlijkheidsgewogen waarde die **tussen** niveaus kan vallen, plus de legenda en de verdeling.

Niveaus lopen van laagste eerst, ten minste twee en ten hoogste tien. Elk niveau moet een concrete situatie beschrijven en op zichzelf staan.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Lees het met `$triage.answers.frustration.score`, `.legend` en `.confidence`.

## Generate with AI

**Generate with AI** zet een gewone zin om in een voorgesteld state-sjabloon en een set vraagrijen. Beschrijf wat u beoordeeld wilt hebben — "triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds" — en controleer wat er terugkomt voordat u het aan de node toevoegt.

Het opstellen wordt gedaan door een LLM, dus de dialoog vraagt om een LLM-referentie. Het beslissingsmodel beantwoordt de vragen later, wanneer de workflow wordt uitgevoerd. Gegenereerde id's worden gededupliceerd tegen de rijen die de node al bevat, dus tweemaal genereren overschrijft nooit een bestaande antwoordsleutel.

Elke generatie wordt vastgelegd in het tabblad [Traces](../tabs/traces-tab.md) onder de bron **Decision Questions**, naast de `decision.systemone`-traces die door de node zelf tijdens de uitvoering worden geschreven.
## Aangepaste request body

Schakel **Aangepaste request body** in om JSON te verzenden die u zelf schrijft in plaats van het formulier. Gebruik dit voor een endpoint waarvan het contract afwijkt van het contract dat het formulier opbouwt.

De editor wordt gevuld vanuit het huidige formulier en expressies erin worden opgelost voordat het verzoek wordt verzonden. Zolang de schakelaar is ingeschakeld, worden het veld State en de vraagrijen genegeerd. De response wordt in beide gevallen ongewijzigd doorgegeven, dus een ander contract levert eenvoudigweg een andere vorm op die uw expressies kunnen lezen.

## Uitvoer

De node retourneert exact wat de provider heeft geretourneerd. Niets wordt hernoemd of afgevlakt.

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

## Vertakken op een antwoord

Een [Switch](./switch-node.md)-node routeert op de gekozen optie, en een [Condition](./condition-node.md)-node kan gevallen met een lage confidence ergens naartoe sturen waar een persoon ze ziet:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Een getypeerd antwoord garandeert de vorm, niet de waarheid. Kies drempelwaarden op basis van uw eigen gegevens en consequenties in plaats van een getal uit een voorbeeld over te nemen.

## Referentie

Maak een **Decision Model**-referentie aan in het tabblad [Referenties](../tabs/credentials-tab.md) met:

- **Base URL** — het endpoint, bijvoorbeeld `https://api.typesafe.ai`. Heym voegt `/v1/systemone` toe.
- **API Key** — optioneel. Endpoints die geen key nodig hebben, kunnen leeg worden gelaten.

Bij het bewerken van een referentie blijft de opgeslagen key behouden wanneer het key-veld leeg wordt gelaten; typ deze alleen opnieuw om deze te vervangen.

Dezelfde referentie kan [Evaluatie](../tabs/evals-tab.md)-uitvoeringen beoordelen: met **LLM-as-Judge** geselecteerd, kiest u deze als de judge en het decision model beoordeelt elk antwoord tegen de verwachte uitvoer.

Heym blokkeert standaard uitgaande verzoeken naar private en loopback-adressen, dus een decision endpoint die u zelf draait op `localhost` of een private reeks heeft `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nodig.

Decision models verschijnen niet in de LLM-prijstabellen die Heym synchroniseert, dus de kolom **Cost** in [Uitvoeringen](../tabs/traces-tab.md) blijft leeg voor deze aanroepen. Token-tellingen worden nog steeds vastgelegd en u kunt uw eigen prijs toevoegen met een pricing override.

## Fouten

| Situatie | Wat er gebeurt |
|-----------|--------------|
| Ongeldige API key | De node mislukt met een bericht dat de referentie benoemt |
| Misvormde vraag | Het veldniveau-bericht van de provider zelf wordt doorgegeven aan de node-fout |
| Rate limited of overbelast | De node mislukt met een bericht dat de conditie tijdelijk is — schakel [retry](../reference/features.md) in voor deze node om het uit te zitten |
| Dubbele of lege vraag-id | De node mislukt voordat er een verzoek wordt verzonden |

## Gerelateerd

- [LLM Node](./llm-node.md) – Genereer tekst in plaats van een beoordeling
- [Agent Node](./agent-node.md) – Verzamel bewijs met tools en beoordeel het hier
- [Switch Node](./switch-node.md) – Routeer op de gekozen optie
- [Condition Node](./condition-node.md) – Gate op confidence
- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Referenties](../reference/credentials.md) – Referentietypen en velden
- [Traces Tab](../tabs/traces-tab.md) – Inspecteer decision-aanroepen en token-gebruik
