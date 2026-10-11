# Guardrails

Guardrails vám umožňují zablokovat nebezpečné nebo nežádoucí zprávy uživatelů dříve, než dorazí do uzlu [LLM](../nodes/llm-node.md) nebo [Agent](../nodes/agent-node.md). Pokud zpráva odpovídá blokované kategorii, uzel místo spuštění vyvolá chybu, kterou můžete zachytit pomocí uzlu [Error Handler](../nodes/error-handler-node.md).

## Aktivace Guardrails

Otevřete panel Vlastnosti pro uzel **LLM** nebo **AI Agent** a přejděte k přepínači **Enable Guardrails** (ikona štítu). Zaškrtnutím políčka se zobrazí konfigurační sekce.

## Přihlašovací údaje a model pro Guardrail

Pokud jsou guardrails aktivovány, **musíte** vybrat **přihlašovací údaje a model** pro kontrolu obsahu. Kontrola guardrail používá vybrané přihlašovací údaje a model z uzlu — žádné záložní řešení, žádné proměnné prostředí. Pro spolehlivé filtrování obsahu použijte přihlašovací údaje OpenAI nebo Google, zejména pokud váš hlavní model používá vlastního poskytovatele (např. Zhipu, GLM), který nemusí podporovat guardrails nebo vrací chyby API (např. 404).

Workflow nelze spustit, dokud nejsou vybrány jak Guardrail Credential, tak Guardrail Model.

## Blokované kategorie

Vyberte jednu nebo více kategorií k blokování. Zpráva, která odpovídá jakékoli zaškrtnuté kategorii, je odmítnuta.

| Kategorie | Co blokuje |
|---|---|
| **Violence** | Násilný, výhružný nebo fyzicky škodlivý obsah |
| **Hate Speech** | Diskriminace, rasismus nebo bigotnost |
| **Sexual Content** | Explicitní sexuální obsah nebo scénáře |
| **NSFW / Profanity** | Hrubý jazyk, vulgarity, explicitní urážky a slang pro dospělé v jakémkoli jazyce |
| **Self-Harm** | Sebevražda, sebepoškozování nebo související obsah |
| **Harassment** | Osobní útoky, urážky, šikana nebo zastrašování |
| **Illegal Activity** | Návody k páchání nezákonných činů |
| **Political Extremism** | Extremistický politický obsah nebo násilná propaganda |
| **Spam / Phishing** | Spam, phishing nebo sociální inženýrství |
| **Personal Data Request** | Vyžadování soukromých nebo osobně identifikovatelných informací |
| **Prompt Injection** | Pokusy přepsat systémové instrukce, vložit škodlivé prompty nebo manipulovat s chováním modelu |

## Citlivost

Nastavení **Sensitivity** určuje, jak přísně jsou porušení detekována:

| Úroveň | Chování |
|---|---|
| **Low** | Označí i hraniční nebo nejednoznačné případy |
| **Medium** *(výchozí)* | Označí jasná porušení; ignoruje hraniční případy |
| **High** | Označí pouze extrémní, jednoznačná porušení |

## Jak detekce funguje

Detekce používá **vybrané přihlašovací údaje a model pro guardrail**:

- **Přihlašovací údaje OpenAI** — používá [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (zdarma, rychlé, bez spotřeby tokenů) pro pět kategorií, které nativně pokrývá (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Zbývající kategorie jsou kontrolovány pomocí klasifikačního volání LLM s vybraným modelem pro guardrail.
- **Přihlašovací údaje Google / vlastní** — všechny kategorie jsou kontrolovány pomocí klasifikačního volání LLM s vybranými přihlašovacími údaji a modelem pro guardrail.

Pokud váš hlavní model používá vlastního poskytovatele (např. Zhipu, Cerebras), který může vracet 404 nebo jiné chyby API, vyberte pro guardrails **přihlašovací údaje OpenAI nebo Google**.

## Formát chyby

Když je guardrail spuštěn, uzel vyvolá chybu se zprávou:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Výsledek uzlu `output` také obsahuje `guardrail_violated_categories` (pole označení porušených kategorií), takže Debug Panel a Historie spuštění mohou jasně zobrazit „Blocked by: X, Y".

Použijte možnost uzlu **Continue on error** (nebo [Error Handler](../nodes/error-handler-node.md)) k přesměrování workflow do záložní větve, když se guardrails spustí.

## Příklad workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Poznámky

- **Žádné opakování**: Porušení guardrail jsou záměrná blokování a nikdy se neopakují, i když má uzel povoleno „Retry on failure".
- Není vyžadována žádná migrace databáze — nastavení guardrail jsou uložena v JSON uzlu workflow spolu s ostatními daty uzlu.
- Guardrails kontrolují vyhodnocenou **zprávu uživatele** (po vyhodnocení výrazů šablony), nikoli surovou šablonu.
- Nastavení **žádných kategorií** při aktivovaných guardrails je ekvivalentní jejich deaktivaci — žádná kontrola se neprovádí.
- Při **Low** citlivosti se klasifikace LLM vždy spouští (nejlepší vícejazyčné pokrytí). Přihlašovací údaje OpenAI navíc spouštějí Moderation API.
- Při **Medium/High** citlivosti používají přihlašovací údaje OpenAI Moderation API pro nativně podporované kategorie a klasifikaci LLM pro ostatní. Přihlašovací údaje Google/vlastní vždy používají klasifikaci LLM.
- Klasifikace LLM je **nezávislá na jazyce** — detekuje porušení v turečtině, arabštině, ruštině, španělštině a dalších jazycích.
