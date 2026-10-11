# Guardrails

Els Guardrails permeten bloquejar missatges d'usuari insegurs o no desitjats abans que arribin a un node [LLM](../nodes/llm-node.md) o [Agent](../nodes/agent-node.md). Quan un missatge coincideix amb una categoria bloquejada, el node genera un error en lloc d'executar-se, el qual podeu capturar amb un node [Error Handler](../nodes/error-handler-node.md).

## Habilitar els Guardrails

Obriu el panell de Propietats d'un node **LLM** o **AI Agent** i desplaceu-vos fins a l'opció **Enable Guardrails** (icona d'escut). En marcar la casella es mostra la secció de configuració.

## Credencial i model de Guardrail

Quan els guardrails estan habilitats, **cal** seleccionar una **credencial i un model** per a la seguretat de contingut. La comprovació del guardrail utilitza la credencial i el model seleccionats al node — sense fallback ni variables d'entorn. Utilitzeu una credencial d'OpenAI o Google per a un filtratge de contingut fiable, especialment quan el vostre model principal utilitza un proveïdor personalitzat (p. ex. Zhipu, GLM) que pot no admetre guardrails o retornar errors d'API (p. ex. 404).

El workflow no es pot executar fins que s'hagin seleccionat tant la Guardrail Credential com el Guardrail Model.

## Categories bloquejades

Seleccioneu una o més categories per bloquejar. Un missatge que coincideixi amb qualsevol categoria marcada serà rebutjat.

| Categoria | Què bloqueja |
|---|---|
| **Violence** | Contingut violent, amenaçador o físicament perjudicial |
| **Hate Speech** | Discriminació, racisme o intolerància |
| **Sexual Content** | Contingut o escenaris sexuals explícits |
| **NSFW / Profanity** | Llenguatge groller, blasfèmies, insults explícits i argot adult en qualsevol idioma |
| **Self-Harm** | Suïcidi, autolesió o contingut relacionat |
| **Harassment** | Atacs personals, insults, assetjament o intimidació |
| **Illegal Activity** | Instruccions per cometre actes il·legals |
| **Political Extremism** | Contingut polític extremista o propaganda violenta |
| **Spam / Phishing** | Spam, phishing o enginyeria social |
| **Personal Data Request** | Sol·licitud d'informació privada o d'identificació personal |
| **Prompt Injection** | Intents de sobreescriure les instruccions del sistema, injectar prompts maliciosos o manipular el comportament del model |

## Sensibilitat

La configuració de **Sensitivity** controla amb quin rigor es detecten les infraccions:

| Nivell | Comportament |
|---|---|
| **Low** | Marca fins i tot els casos límit o ambigus |
| **Medium** *(per defecte)* | Marca les infraccions clares; ignora els casos límit |
| **High** | Marca només les infraccions extremes i inequívoques |

## Com funciona la detecció

La detecció utilitza la **credencial i el model de guardrail seleccionats**:

- **Credencials d'OpenAI** — utilitza l'[OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratuïta, ràpida, sense consum de tokens) per a les cinc categories que cobreix de manera nativa (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). La resta de categories es comproven amb una crida de classificació LLM utilitzant el model de guardrail seleccionat.
- **Credencials de Google / personalitzades** — totes les categories es comproven amb una crida de classificació LLM utilitzant la credencial i el model de guardrail seleccionats.

Quan el vostre model principal utilitza un proveïdor personalitzat (p. ex. Zhipu, Cerebras) que pot retornar errors 404 o altres errors d'API, seleccioneu una **credencial d'OpenAI o Google** per als guardrails.

## Format de l'error

Quan es dispara un guardrail, el node genera un error amb el missatge:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

El `output` del resultat del node també inclou `guardrail_violated_categories` (matriu d'etiquetes de categories infringides) per tal que el Debug Panel i l'Execution History puguin mostrar "Blocked by: X, Y" de manera clara.

Utilitzeu l'opció **Continue on error** del node (o un [Error Handler](../nodes/error-handler-node.md)) per redirigir el workflow a una branca alternativa quan es disparin els guardrails.

## Workflow d'exemple

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Notes

- **Sense reintents**: les infraccions de guardrail són bloquejos intencionats i mai es reintenten, fins i tot si el node té habilitat "Retry on failure".
- No cal cap migració de base de dades — la configuració dels guardrails s'emmagatzema al JSON del node del workflow juntament amb la resta de dades del node.
- Els guardrails comproven el **missatge d'usuari** resolt (després d'avaluar les expressions de plantilla), no la plantilla en brut.
- Establir **cap categoria** amb els guardrails habilitats equival a tenir-los deshabilitats — no es realitza cap comprovació.
- Amb sensibilitat **Low**, la classificació LLM sempre s'executa (millor cobertura multilingüe). Les credencials d'OpenAI executen addicionalment la Moderation API.
- Amb sensibilitat **Medium/High**, les credencials d'OpenAI utilitzen la Moderation API per a les categories admeses de manera nativa i la classificació LLM per a la resta. Les credencials de Google/personalitzades sempre utilitzen la classificació LLM.
- La classificació LLM és **agnòstica pel que fa a l'idioma** — detecta infraccions en turc, àrab, rus, castellà i altres idiomes.