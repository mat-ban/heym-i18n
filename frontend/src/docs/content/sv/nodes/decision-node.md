# Decision

Noden **Decision** ställer typade frågor till en beslutsmodell om körningens aktuella tillstånd och returnerar sannolikheter. Den genererar ingen text. Den används när ett workflow behöver en bedömning som det kan förgrena sig på — routning, triage, rangordning, verifiering eller grindning av ett steg som inte kan ångras.

Beslutsmodeller (även kallade *System One*-modeller) är en annan typ av modell än en LLM. Det finns ingen prompt, ingen systeminstruktion, ingen temperatur och inget tool calling. En **state** skickas tillsammans med en map av **questions**, och varje svar kommer tillbaka som ett tal med en sannolikhetsfördelning bakom sig. Eftersom ett svar bara är några få tokens är dessa modeller snabba och billiga jämfört med att be en [LLM](./llm-node.md) producera JSON och sedan parsa det.

För textgenerering används noden [LLM](./llm-node.md). För en modell som anropar verktyg används [Agent Node](./agent-node.md).

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | Leverantörens svar ordagrant — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | En autentiseringsuppgift av typen *Decision Model*. Inte en LLM-autentiseringsuppgift. |
| `model` | string | Modellnamn, till exempel `jev-latest` |
| `state` | expression | Vad modellen ska läsa (standard `$input.text`) |
| `questions` | array | Ordnade frågerader; minst en |
| `customBodyEnabled` | boolean | Skicka en handskriven request-body i stället för formuläret |
| `customBody` | expression (JSON) | Den body som skickas när växeln är på |
| `requestTimeoutSeconds` | number | Max antal sekunder att vänta (standard: 60) |

### State

**State** är den situation som modellen bedömer. Den accepterar en sträng, ett objekt eller en array.

Ett fält som innehåller exakt ett uttryck behåller sin egen typ, så `$input` skickar själva objektet i stället för dess text. En mall med ett uttryck inuti (`Ticket: $input.text`) löses upp till en sträng. Ge varje fråga tillräckligt underlag för att kunna besvaras: källtext, identiteter, relationer, policyer och aktuella fakta.

## Frågetyper

Varje fråga har ett `id`, en `type`, `instructions` samt kriterier som beror på typen.

`id` är det som workflowet använder för att läsa tillbaka svaret. Det skickas **aldrig till modellen**, så hela innebörden måste ligga i `instructions`. Att skriva `id: is_urgent` med `instructions: "Is it?"` ger modellen inget att arbeta med.

### Noul

Huruvida ett villkor är uppfyllt. Returnerar sannolikheten för att svaret är ja, från 0 till 1.

Kriterierna är valfria: **Yes means** och **No means** beskriver vad respektive sida omfattar. Ett värde nära 0,5 betyder att modellen bedömer ja och nej som ungefär lika sannolika — inte "medelhög intensitet".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Läs av det med `$triage.answers.is_urgent.noul`.

### Choice

Väljer ett alternativ ur en mängd som definieras. Returnerar det valda alternativet, hela fördelningen samt en konfidens härledd från den.

Lägg till ett alternativ som täcker "inget av dessa" närhelst inget annat kan passa — modellen kan inte välja ett alternativ som inte erbjuds.

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

Läs av det med `$triage.answers.department.choice`, `.probabilities.billing` och `.confidence`.

### Score

Betygsätter tillståndet enligt en ordnad rubric. Returnerar ett sannolikhetsviktat värde som kan hamna **mellan** nivåer, plus legenden och fördelningen.

Nivåerna anges med den lägsta först, minst två och högst tio. Varje nivå bör beskriva en konkret situation och stå på egna ben.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Läs av det med `$triage.answers.frustration.score`, `.legend` och `.confidence`.

## Generate with AI

**Generate with AI** omvandlar en vanlig mening till en föreslagen state-mall och en uppsättning frågerader. Beskriv vad som ska bedömas — "triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds" — och granska resultatet innan det läggs till i noden.

Utkastet tas fram av en LLM, så dialogrutan begär en LLM-autentiseringsuppgift. Beslutsmodellen besvarar frågorna senare, när workflowet körs. Genererade id:n avdubblas mot de rader som noden redan innehåller, så en andra generering skriver aldrig över en befintlig svarsnyckel.

Varje generering registreras i fliken [Traces](../tabs/traces-tab.md) under källan **Decision Questions**, tillsammans med de `decision.systemone`-spår som noden själv skriver vid körning.
## Anpassad förfrågansbody

Aktivera **Anpassad förfrågansbody** för att skicka JSON som skrivs manuellt i stället för formuläret. Använd detta för en endpoint vars kontrakt skiljer sig från det som formuläret bygger.

Redigeraren initieras från det aktuella formuläret, och uttryck i den löses upp innan förfrågan skickas. Medan växlingsknappen är på ignoreras fältet State och frågeraderna. Svaret skickas vidare oförändrat oavsett, så ett annat kontrakt ger helt enkelt en annan form för uttrycken att läsa.

## Utdata

Noden returnerar exakt det som leverantören returnerade. Ingenting byter namn eller plattas ut.

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

## Förgrening på ett svar

En [Switch](./switch-node.md)-nod dirigerar på det valda alternativet, och en [Condition](./condition-node.md)-nod kan skicka fall med låg konfidens dit en person ser dem:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Ett typat svar garanterar formen, inte sanningen. Välj tröskelvärden utifrån egna data och konsekvenser i stället för att kopiera en siffra från ett exempel.

## Autentiseringsuppgifter

Skapa en **Decision Model**-autentiseringsuppgift i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md) med:

- **Base URL** — endpointen, till exempel `https://api.typesafe.ai`. Heym lägger till `/v1/systemone`.
- **API Key** — valfritt. Endpoints som inte kräver någon nyckel kan lämnas tomma.

Vid redigering av en autentiseringsuppgift behålls den lagrade nyckeln när nyckelfältet lämnas tomt; skriv in den igen endast för att ersätta den.

Samma autentiseringsuppgift kan bedöma [Utvärdering](../tabs/evals-tab.md)-körningar: med **LLM-as-Judge** valt väljs den som domare och beslutsmodellen poängsätter varje svar mot den förväntade utdatan.

Heym blockerar utgående förfrågningar till privata och loopback-adresser som standard, så en beslutsendpoint som körs själv på `localhost` eller ett privat intervall kräver `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Beslutsmodeller visas inte i de LLM-pristabeller som Heym synkroniserar, så kolumnen **Cost** i [Körningar](../tabs/traces-tab.md) förblir tom för dessa anrop. Tokenantal registreras fortfarande, och ett eget pris kan läggas till med en prisöverskridning.

## Fel

| Situation | Vad som händer |
|-----------|--------------|
| Ogiltig API-nyckel | Noden misslyckas med ett meddelande som namnger autentiseringsuppgiften |
| Felaktig fråga | Leverantörens eget fältnivåmeddelande förs in i nodfelet |
| Hastighetsbegränsad eller överbelastad | Noden misslyckas med ett meddelande om att tillståndet är tillfälligt — aktivera [retry](../reference/features.md) för denna nod för att rida ut det |
| Dubblerat eller tomt fråge-id | Noden misslyckas innan någon förfrågan skickas |

## Relaterat

- [LLM-nod](./llm-node.md) – Generera text i stället för en bedömning
- [Agent-nod](./agent-node.md) – Samla bevis med verktyg och bedöm dem sedan här
- [Switch-nod](./switch-node.md) – Dirigera på det valda alternativet
- [Condition-nod](./condition-node.md) – Grinda på konfidens
- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Autentiseringsuppgifter](../reference/credentials.md) – Typer och fält för autentiseringsuppgifter
- [Fliken Körningar](../tabs/traces-tab.md) – Granska beslutsanrop och tokenanvändning
