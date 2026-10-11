# Guardrails

Guardrails gør det muligt at blokere usikre eller uønskede brugerbeskeder, før de når en [LLM](../nodes/llm-node.md)- eller [Agent](../nodes/agent-node.md)-node. Når en besked matcher en blokeret kategori, kaster noden en fejl i stedet for at eksekvere, hvilket kan håndteres med en [Error Handler](../nodes/error-handler-node.md)-node.

## Aktivering af Guardrails

Åbn egenskabs-panelet for en **LLM**- eller **AI Agent**-node og scroll til **Enable Guardrails**-toggle (skjold-ikon). Ved at markere afkrydsningsfeltet vises konfigurationssektionen.

## Guardrail-legitimationsoplysninger og model

Når guardrails er aktiveret, **skal** der vælges **legitimationsoplysninger og model** til indholdssikkerhed. Guardrail-tjekket bruger de valgte legitimationsoplysninger og model fra noden - ingen fallback, ingen miljøvariabler. Brug OpenAI- eller Google-legitimationsoplysninger til pålidelig indholdsfiltrering, især når hovedmodellen bruger en brugerdefineret udbyder (f.eks. Zhipu, GLM), som muligvis ikke understøtter guardrails eller returnerer API-fejl (f.eks. 404).

Workflowet kan ikke køre, før både Guardrail-legitimationsoplysninger og Guardrail-model er valgt.

## Blokerede kategorier

Vælg en eller flere kategorier at blokere. En besked, der matcher en af de markerede kategorier, afvises.

| Kategori | Blokeret indhold |
|---|---|
| **Violence** | Voldeligt, truende eller fysisk skadeligt indhold |
| **Hate Speech** | Diskrimination, racisme eller bigotteri |
| **Sexual Content** | Eksplicit seksuelt indhold eller scenarier |
| **NSFW / Profanity** | Groft sprog, bandeord, eksplicitte skældsord og voksen slang på alle sprog |
| **Self-Harm** | Selvmord, selvskade eller relateret indhold |
| **Harassment** | Personlige angreb, fornærmelser, mobning eller intimidation |
| **Illegal Activity** | Instruktioner til ulovlige handlinger |
| **Political Extremism** | Ekstremistisk politisk indhold eller voldelig propaganda |
| **Spam / Phishing** | Spam, phishing eller social engineering |
| **Personal Data Request** | Anmodning om private eller personligt identificerbare oplysninger |
| **Prompt Injection** | Forsøg på at tilsidesætte systeminstruktioner, injicere ondsindede prompts eller manipulere modellens adfærd |

## Følsomhed

Indstillingen **Sensitivity** styrer, hvor strengt overtrædelser detekteres:

| Niveau | Adfærd |
|---|---|
| **Low** | Flagger selv grænsetilfælde eller tvivlsomme tilfælde |
| **Medium** *(standard)* | Flagger klare overtrædelser; ignorerer grænsetilfælde |
| **High** | Flagger kun ekstreme, utvetydige overtrædelser |

## Sådan fungerer detektion

Detektion bruger de **valgte guardrail-legitimationsoplysninger og model**:

- **OpenAI-legitimationsoplysninger** - bruger [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratis, hurtig, ingen token-forbrug) til de fem kategorier, den understøtter nativt (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Resterende kategorier tjekkes med et LLM-klassifikationskald ved brug af den valgte guardrail-model.
- **Google / brugerdefinerede legitimationsoplysninger** - alle kategorier tjekkes med et LLM-klassifikationskald ved brug af de valgte guardrail-legitimationsoplysninger og model.

Når hovedmodellen bruger en brugerdefineret udbyder (f.eks. Zhipu, Cerebras), der muligvis returnerer 404 eller andre API-fejl, skal der vælges **OpenAI- eller Google-legitimationsoplysninger** til guardrails.

## Fejlformat

Når en guardrail udløses, kaster noden en fejl med beskeden:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Nodens resultat `output` inkluderer også `guardrail_violated_categories` (array af overtrådte kategori-labels), så Debug Panel og Execution History kan vise "Blokeret af: X, Y" tydeligt.

Brug nodens **Continue on error**-indstilling (eller en [Error Handler](../nodes/error-handler-node.md)) til at dirigere workflowet til en fallback-gren, når guardrails aktiveres.

## Eksempel på workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Bemærkninger

- **Ingen gentagelser**: Guardrail-overtrædelser er bevidste blokeringer og gentages aldrig, selvom noden har "Retry on failure" aktiveret.
- Ingen database-migration kræves - guardrail-indstillinger gemmes i workflowets node-JSON sammen med andre node-data.
- Guardrails tjekker den resulterende **brugerbesked** (efter at template-udtryk er evalueret), ikke den rå template.
- Hvis der **ikke er valgt nogen kategorier** mens guardrails er aktiveret, svarer det til at de er deaktiveret - intet tjek udføres.
- Ved **Low**-følsomhed kører LLM-klassifikation altid (bedste flersprogsdækning). OpenAI-legitimationsoplysninger kører desuden Moderation API.
- Ved **Medium/High**-følsomhed bruger OpenAI-legitimationsoplysninger Moderation API til nativt understøttede kategorier og LLM-klassifikation til resten. Google/brugerdefinerede legitimationsoplysninger bruger altid LLM-klassifikation.
- LLM-klassifikation er **sproguafhængig** - den detekterer overtrædelser på tyrkisk, arabisk, russisk, spansk og andre sprog.
