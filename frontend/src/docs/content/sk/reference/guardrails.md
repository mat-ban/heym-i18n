# Guardrails

Guardrails vám umožňujú zablokovať nebezpečné alebo nežiaduce používateľské správy skôr, než sa dostanú do uzla [LLM](../nodes/llm-node.md) alebo [Agent](../nodes/agent-node.md). Keď správa zodpovedá blokovanej kategórii, uzol namiesto vykonania vyhodí chybu, ktorú môžete zachytiť pomocou uzla [Error Handler](../nodes/error-handler-node.md).

## Zapnutie Guardrails

Otvorte panel Properties pre uzol **LLM** alebo **AI Agent** a posuňte sa k prepínaču **Enable Guardrails** (ikona štítu). Začiarknutím políčka sa zobrazí sekcia konfigurácie.

## Prihlasovacie údaje a model pre Guardrail

Keď sú guardrails zapnuté, **musíte** vybrať **prihlasovacie údaje a model** pre bezpečnosť obsahu. Kontrola guardrail používa vybrané prihlasovacie údaje a model z uzla — žiadny fallback, žiadne environment variables. Pre spoľahlivé filtrovanie obsahu použite prihlasovacie údaje OpenAI alebo Google, najmä ak váš hlavný model používa vlastného poskytovateľa (napr. Zhipu, GLM), ktorý nemusí podporovať guardrails alebo vracia chyby API (napr. 404).

Workflow nemôže bežať, kým nie sú vybrané obe položky Guardrail Credential a Guardrail Model.

## Blokované kategórie

Vyberte jednu alebo viac kategórií na blokovanie. Správa, ktorá zodpovedá ktorejkoľvek začiarknutej kategórii, je odmietnutá.

| Kategória | Čo blokuje |
|---|---|
| **Violence** | Násilný, vyhrážajúci sa alebo fyzicky škodlivý obsah |
| **Hate Speech** | Diskriminácia, rasizmus alebo bigotnosť |
| **Sexual Content** | Explicitný sexuálny obsah alebo scenáre |
| **NSFW / Profanity** | Hrubý jazyk, vulgarizmy, explicitné urážky a dospelý slang v akomkoľvek jazyku |
| **Self-Harm** | Samovražda, sebapoškodzovanie alebo súvisiaci obsah |
| **Harassment** | Osobné útoky, urážky, šikana alebo zastrašovanie |
| **Illegal Activity** | Návody na páchanie nezákonných činov |
| **Political Extremism** | Extrémistický politický obsah alebo násilná propaganda |
| **Spam / Phishing** | Spam, phishing alebo sociálne inžinierstvo |
| **Personal Data Request** | Vyžiadanie súkromných alebo osobne identifikovateľných informácií |
| **Prompt Injection** | Pokusy prepísať systémové inštrukcie, vložiť škodlivé prompty alebo manipulovať so správaním modelu |

## Citlivosť

Nastavenie **Sensitivity** ovláda, ako striktne sa porušenia detegujú:

| Úroveň | Správanie |
|---|---|
| **Low** | Označí aj hraničné alebo nejednoznačné prípady |
| **Medium** *(predvolené)* | Označí jasné porušenia; ignoruje hraničné prípady |
| **High** | Označí iba extrémne, jednoznačné porušenia |

## Ako funguje detekcia

Detekcia používa **vybrané prihlasovacie údaje a model pre guardrail**:

- **Prihlasovacie údaje OpenAI** — používa [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (zadarmo, rýchle, bez spotreby tokenov) pre päť kategórií, ktoré natívne pokrýva (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Zvyšné kategórie sa kontrolujú pomocou LLM klasifikačného volania s použitím vybraného guardrail modelu.
- **Prihlasovacie údaje Google / vlastné** — všetky kategórie sa kontrolujú pomocou LLM klasifikačného volania s použitím vybraných prihlasovacích údajov a modelu pre guardrail.

Keď váš hlavný model používa vlastného poskytovateľa (napr. Zhipu, Cerebras), ktorý môže vracať 404 alebo iné chyby API, vyberte pre guardrails **prihlasovacie údaje OpenAI alebo Google**.

## Formát chyby

Keď sa guardrail spustí, uzol vyhodí chybu so správou:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Výsledok uzla `output` tiež obsahuje `guardrail_violated_categories` (pole označení porušených kategórií), aby Debug Panel a Execution History mohli jasne zobraziť "Blocked by: X, Y".

Použite možnosť uzla **Continue on error** (alebo [Error Handler](../nodes/error-handler-node.md)) na presmerovanie workflow do záložnej vetvy, keď sa guardrails spustia.

## Príklad workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Poznámky

- **Žiadne opakovania**: Porušenia guardrail sú zámerné blokovania a nikdy sa neopakujú, a to ani v prípade, že má uzol zapnuté "Retry on failure".
- Nie je potrebná žiadna migrácia databázy — nastavenia guardrail sa ukladajú do JSON uzla workflow spolu s ostatnými údajmi uzla.
- Guardrails kontrolujú vyriešenú **používateľskú správu** (po vyhodnotení výrazov šablóny), nie surovú šablónu.
- Nastavenie **žiadnych kategórií** pri zapnutých guardrails je ekvivalentné ich vypnutiu — nevykoná sa žiadna kontrola.
- Pri **nízkej** citlivosti sa LLM klasifikácia vždy spúšťa (najlepšie viacjazyčné pokrytie). Prihlasovacie údaje OpenAI navyše spúšťajú Moderation API.
- Pri **strednej/vysokej** citlivosti používajú prihlasovacie údaje OpenAI Moderation API pre natívne podporované kategórie a LLM klasifikáciu pre ostatné. Prihlasovacie údaje Google/vlastné vždy používajú LLM klasifikáciu.
- LLM klasifikácia je **nezávislá od jazyka** — deteguje porušenia v turečtine, arabčine, ruštine, španielčine a ďalších jazykoch.
