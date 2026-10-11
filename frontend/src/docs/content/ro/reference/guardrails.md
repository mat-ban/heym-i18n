# Guardrails

Guardrails vă permit să blocați mesajele utilizatorilor care sunt nesigure sau nedorite înainte ca acestea să ajungă la un nod [LLM](../nodes/llm-node.md) sau [Agent](../nodes/agent-node.md). Atunci când un mesaj corespunde unei categorii blocate, nodul generează o eroare în loc să se execute, eroare pe care o puteți intercepta cu un nod [Error Handler](../nodes/error-handler-node.md).

## Activarea Guardrails

Deschideți panoul Properties pentru un nod **LLM** sau **AI Agent** și derulați până la comutatorul **Enable Guardrails** (pictograma scut). Bifarea casetei afișează secțiunea de configurare.

## Acreditări și model pentru Guardrail

Atunci când guardrails sunt activate, **trebuie** să selectați o **acreditare și un model** pentru siguranța conținutului. Verificarea guardrail utilizează acreditarea și modelul selectate din nod — fără fallback, fără variabile de mediu. Utilizați o acreditare OpenAI sau Google pentru filtrarea fiabilă a conținutului, în special atunci când modelul principal utilizează un furnizor personalizat (de ex. Zhipu, GLM) care ar putea să nu accepte guardrails sau să returneze erori API (de ex. 404).

Workflow-ul nu poate rula până când nu sunt selectate atât Guardrail Credential, cât și Guardrail Model.

## Categorii blocate

Selectați una sau mai multe categorii de blocat. Un mesaj care corespunde oricărei categorii bifate este respins.

| Categorie | Ce blochează |
|---|---|
| **Violence** | Conținut violent, amenințător sau dăunător fizic |
| **Hate Speech** | Discriminare, rasism sau intoleranță |
| **Sexual Content** | Conținut sau scenarii sexuale explicite |
| **NSFW / Profanity** | Limbaj vulgar, înjurături, insulte explicite și argou pentru adulți în orice limbă |
| **Self-Harm** | Sinucidere, auto-vătămare sau conținut asociat |
| **Harassment** | Atacuri personale, insulte, hărțuire sau intimidare |
| **Illegal Activity** | Instrucțiuni pentru comiterea de acte ilegale |
| **Political Extremism** | Conținut politic extremist sau propagandă violentă |
| **Spam / Phishing** | Spam, phishing sau inginerie socială |
| **Personal Data Request** | Solicitarea de informații private sau de identificare personală |
| **Prompt Injection** | Încercări de a suprascrie instrucțiunile de sistem, de a injecta prompt-uri malițioase sau de a manipula comportamentul modelului |

## Sensibilitate

Setarea **Sensitivity** controlează cât de strict sunt detectate încălcările:

| Nivel | Comportament |
|---|---|
| **Low** | Semnalează chiar și cazurile limită sau ambigue |
| **Medium** *(implicit)* | Semnalează încălcările clare; ignoră cazurile limită |
| **High** | Semnalează doar încălcările extreme, lipsite de ambiguitate |

## Cum funcționează detectarea

Detectarea utilizează **acreditarea și modelul guardrail selectate**:

- **Acreditări OpenAI** — utilizează [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratuit, rapid, fără consum de token-uri) pentru cele cinci categorii pe care le acoperă nativ (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Categoriile rămase sunt verificate printr-un apel de clasificare LLM utilizând modelul guardrail selectat.
- **Acreditări Google / personalizate** — toate categoriile sunt verificate printr-un apel de clasificare LLM utilizând acreditarea și modelul guardrail selectate.

Atunci când modelul principal utilizează un furnizor personalizat (de ex. Zhipu, Cerebras) care ar putea returna 404 sau alte erori API, selectați o **acreditare OpenAI sau Google** pentru guardrails.

## Formatul erorii

Atunci când un guardrail este declanșat, nodul generează o eroare cu mesajul:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Câmpul `output` al rezultatului nodului include de asemenea `guardrail_violated_categories` (matrice de etichete ale categoriilor încălcate), astfel încât Debug Panel și Execution History să poată afișa clar „Blocked by: X, Y”.

Utilizați opțiunea **Continue on error** a nodului (sau un [Error Handler](../nodes/error-handler-node.md)) pentru a direcționa workflow-ul către o ramură de rezervă atunci când guardrails se declanșează.

## Exemplu de Workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Note

- **Fără reîncercări**: Încălcările guardrail sunt blocări intenționate și nu sunt niciodată reîncercate, chiar dacă nodul are activată opțiunea „Retry on failure”.
- Nu este necesară nicio migrare a bazei de date — setările guardrail sunt stocate în JSON-ul nodului din workflow, alături de celelalte date ale nodului.
- Guardrails verifică **mesajul utilizatorului** rezolvat (după evaluarea expresiilor șablon), nu șablonul brut.
- Setarea **niciunei categorii** în timp ce guardrails sunt activate este echivalentă cu dezactivarea acestora — nu se efectuează nicio verificare.
- La severitatea **Low**, clasificarea LLM rulează întotdeauna (cea mai bună acoperire multilingvă). Acreditările OpenAI rulează suplimentar Moderation API.
- La severitatea **Medium/High**, acreditările OpenAI utilizează Moderation API pentru categoriile acceptate nativ și clasificarea LLM pentru restul. Acreditările Google/personalizate utilizează întotdeauna clasificarea LLM.
- Clasificarea LLM este **independentă de limbă** — detectează încălcări în turcă, arabă, rusă, spaniolă și alte limbi.
