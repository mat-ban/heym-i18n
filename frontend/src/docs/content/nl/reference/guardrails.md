# Guardrails

Guardrails stellen u in staat om onveilige of ongewenste gebruikersberichten te blokkeren voordat deze een [LLM](../nodes/llm-node.md)- of [Agent](../nodes/agent-node.md)-node bereiken. Wanneer een bericht overeenkomt met een geblokkeerde categorie, genereert de node een fout in plaats van deze uit te voeren. U kunt deze fout opvangen met een [Error Handler](../nodes/error-handler-node.md)-node.

## Guardrails inschakelen

Open het eigenschappenpaneel voor een **LLM**- of **AI Agent**-node en scrol naar de schakelaar **Enable Guardrails** (schildpictogram). Door het vakje aan te vinken wordt de configuratiesectie weergegeven.

## Guardrail-referentie en -model

Wanneer guardrails zijn ingeschakeld, **moet** u een **referentie en model** voor inhoudsveiligheid selecteren. De guardrail-controle gebruikt de geselecteerde referentie en het geselecteerde model van de node — geen fallback, geen omgevingsvariabelen. Gebruik een OpenAI- of Google-referentie voor betrouwbare inhoudsfiltering, vooral wanneer uw hoofdmodel een aangepaste provider gebruikt (bijv. Zhipu, GLM) die mogelijk geen guardrails ondersteunt of API-fouten retourneert (bijv. 404).

De workflow kan niet worden uitgevoerd totdat zowel Guardrail Credential als Guardrail Model zijn geselecteerd.

## Geblokkeerde categorieën

Selecteer een of meer categorieën om te blokkeren. Een bericht dat overeenkomt met een aangevinkte categorie wordt geweigerd.

| Categorie | Wat het blokkeert |
|---|---|
| **Violence** | Gewelddadige, bedreigende of lichamelijk schadelijke inhoud |
| **Hate Speech** | Discriminatie, racisme of onverdraagzaamheid |
| **Sexual Content** | Expliciete seksuele inhoud of scenario's |
| **NSFW / Profanity** | Grove taal, vloeken, expliciete scheldwoorden en volwassen straattaal in elke taal |
| **Self-Harm** | Zelfdoding, zelfverwonding of gerelateerde inhoud |
| **Harassment** | Persoonlijke aanvallen, beledigingen, pesten of intimidatie |
| **Illegal Activity** | Instructies voor het plegen van illegale handelingen |
| **Political Extremism** | Extremistische politieke inhoud of gewelddadige propaganda |
| **Spam / Phishing** | Spam, phishing of social engineering |
| **Personal Data Request** | Het vragen om privé- of persoonlijk identificeerbare informatie |
| **Prompt Injection** | Pogingen om systeeminstructies te overschrijven, kwaadaardige prompts te injecteren of het gedrag van het model te manipuleren |

## Gevoeligheid

De instelling **Sensitivity** bepaalt hoe strikt overtredingen worden gedetecteerd:

| Niveau | Gedrag |
|---|---|
| **Low** | Markeert zelfs grensgevallen of dubbelzinnige gevallen |
| **Medium** *(standaard)* | Markeert duidelijke overtredingen; negeert grensgevallen |
| **High** | Markeert alleen extreme, ondubbelzinnige overtredingen |

## Hoe detectie werkt

Detectie gebruikt de **geselecteerde guardrail-referentie en -model**:

- **OpenAI-referenties** — gebruikt de [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratis, snel, geen tokenverbruik) voor de vijf categorieën die het native dekt (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). De overige categorieën worden gecontroleerd met een LLM-classificatieaanroep met behulp van het geselecteerde guardrail-model.
- **Google / aangepaste referenties** — alle categorieën worden gecontroleerd met een LLM-classificatieaanroep met behulp van de geselecteerde guardrail-referentie en -model.

Wanneer uw hoofdmodel een aangepaste provider gebruikt (bijv. Zhipu, Cerebras) die 404 of andere API-fouten kan retourneren, selecteer dan een **OpenAI- of Google-referentie** voor guardrails.

## Foutformaat

Wanneer een guardrail wordt geactiveerd, genereert de node een fout met het bericht:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

De `output` van het node-resultaat bevat ook `guardrail_violated_categories` (een array met labels van overtreden categorieën), zodat het Debug Panel en de Execution History "Blocked by: X, Y" duidelijk kunnen weergeven.

Gebruik de optie **Continue on error** van de node (of een [Error Handler](../nodes/error-handler-node.md)) om de workflow naar een fallback-tak te leiden wanneer guardrails worden geactiveerd.

## Voorbeeldworkflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Opmerkingen

- **Geen nieuwe pogingen**: Guardrail-overtredingen zijn opzettelijke blokkeringen en worden nooit opnieuw geprobeerd, zelfs niet als de node "Retry on failure" heeft ingeschakeld.
- Er is geen databasemigratie vereist — guardrail-instellingen worden opgeslagen in de node-JSON van de workflow, samen met andere node-gegevens.
- Guardrails controleren het opgeloste **gebruikersbericht** (nadat sjabloonexpressies zijn geëvalueerd), niet de onbewerkte sjabloon.
- Het instellen van **geen categorieën** terwijl guardrails zijn ingeschakeld, is gelijk aan het uitschakelen ervan — er wordt geen controle uitgevoerd.
- Bij **Low**-gevoeligheid wordt LLM-classificatie altijd uitgevoerd (beste meertalige dekking). OpenAI-referenties voeren daarnaast de Moderation API uit.
- Bij **Medium/High**-gevoeligheid gebruiken OpenAI-referenties de Moderation API voor native ondersteunde categorieën en LLM-classificatie voor de rest. Google-/aangepaste referenties gebruiken altijd LLM-classificatie.
- LLM-classificatie is **taalonafhankelijk** — het detecteert overtredingen in het Turks, Arabisch, Russisch, Spaans en andere talen.
