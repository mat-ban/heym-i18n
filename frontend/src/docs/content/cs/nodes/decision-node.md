# Decision

Uzel **Decision** klade rozhodovacímu modelu otázky s typovou kontrolou o aktuálním stavu spuštění a vrací pravděpodobnosti. Negeneruje text. Použijte jej, když workflow potřebuje úsudek, na jehož základě se může větvit — směrování, třídění, řazení, ověřování nebo podmíněné povolení kroku, který nelze vrátit zpět.

Rozhodovací modely (označované také jako modely *System One*) jsou jiným druhem modelu než LLM. Neexistuje zde žádný prompt, žádná systémová instrukce, žádná teplota ani volání nástrojů. Odešlete **stav** spolu s mapou **otázek** a každá odpověď se vrátí jako číslo s pravděpodobnostním rozdělením v pozadí. Protože odpověď tvoří jen několik tokenů, jsou tyto modely rychlé a levné ve srovnání s tím, když požádáte [LLM](./llm-node.md), aby vytvořil JSON, a následně jej parsujete.

Pro generování textu použijte uzel [LLM](./llm-node.md). Pro model, který volá nástroje, použijte [Agent Node](./agent-node.md).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Odpověď poskytovatele doslovně — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj typu *Decision Model*. Nejde o přihlašovací údaj k LLM. |
| `model` | string | Název modelu, například `jev-latest` |
| `state` | expression | Co má model číst (výchozí `$input.text`) |
| `questions` | array | Uspořádané řádky otázek; alespoň jedna |
| `customBodyEnabled` | boolean | Odeslat ručně napsané tělo požadavku místo formuláře |
| `customBody` | expression (JSON) | Tělo, které se odešle, když je přepínač zapnutý |
| `requestTimeoutSeconds` | number | Maximální počet sekund čekání (výchozí: 60) |

### State

**State** je situace, kterou model posuzuje. Přijímá řetězec, objekt nebo pole.

Pole obsahující právě jeden výraz si zachovává svůj vlastní typ, takže `$input` odešle samotný objekt, nikoli jeho text. Šablona s výrazem uvnitř (`Ticket: $input.text`) se vyhodnotí jako řetězec. Poskytněte každé otázce dostatek informací k odpovědi: zdrojový text, identity, vztahy, zásady a aktuální skutečnosti.

## Typy otázek

Každá otázka má `id`, `type`, `instructions` a kritéria, která závisí na typu.

Pomocí `id` workflow čte odpověď zpět. **Nikdy se neodesílá modelu**, takže veškerý význam musí spočívat v `instructions`. Zápis `id: is_urgent` s `instructions: "Is it?"` nedává modelu nic, s čím by mohl pracovat.

### Noul

Zda platí podmínka. Vrací pravděpodobnost, že odpověď je ano, od 0 do 1.

Kritéria jsou volitelná: **Yes means** a **No means** popisují, co každá strana zahrnuje. Hodnota blízká 0,5 znamená, že model považuje ano a ne za přibližně stejně pravděpodobné — nikoli „střední intenzitu".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Přečtěte ji pomocí `$triage.answers.is_urgent.noul`.

### Choice

Vybere jednu možnost z množiny, kterou definujete. Vrací zvolenou možnost, úplné rozdělení a z něj odvozenou míru jistoty.

Vždy přidejte možnost pokrývající „nic z uvedeného", pokud by se nic nemuselo hodit — model nemůže zvolit možnost, kterou jste nenabídli.

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

Přečtěte ji pomocí `$triage.answers.department.choice`, `.probabilities.billing` a `.confidence`.

### Score

Hodnotí stav podle uspořádané škály. Vrací hodnotu váženou pravděpodobností, která může skončit **mezi** úrovněmi, spolu s legendou a rozdělením.

Úrovně jsou seřazeny od nejnižší, minimálně dvě a maximálně deset. Každá úroveň by měla popisovat konkrétní situaci a obstát samostatně.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Přečtěte ji pomocí `$triage.answers.frustration.score`, `.legend` a `.confidence`.

## Generate with AI

**Generate with AI** převádí prostou větu na navrhovanou šablonu stavu a sadu řádků otázek. Popište, co chcete posuzovat — „triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds" — a před přidáním do uzlu si zkontrolujte, co se vrátí.

Návrh vytváří LLM, takže dialog vyžaduje přihlašovací údaj k LLM. Rozhodovací model odpovídá na otázky později, až se workflow spustí. Generovaná id jsou deduplikována vůči řádkům, které uzel již obsahuje, takže dvojí generování nikdy nepřepíše existující klíč odpovědi.

Každé generování se zaznamenává na kartě [Traces](../tabs/traces-tab.md) pod zdrojem **Decision Questions**, společně se stopami `decision.systemone`, které uzel zapisuje sám za běhu.
## Vlastní tělo požadavku

Zapněte **Vlastní tělo požadavku**, chcete-li odeslat JSON, který si sami napíšete, namísto formuláře. Použijte jej pro endpoint, jehož kontrakt se liší od toho, který sestavuje formulář.

Editor je inicializován z aktuálního formuláře a výrazy v něm jsou vyhodnoceny před odesláním požadavku. Dokud je přepínač zapnutý, pole State a řádky s otázkami jsou ignorovány. Odpověď je v obou případech předána beze změny, takže odlišný kontrakt jednoduše vytvoří odlišný tvar pro čtení vašimi výrazy.

## Výstup

Uzel vrací přesně to, co vrátil poskytovatel. Nic není přejmenováno ani zploštěno.

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

## Větvení podle odpovědi

Uzel [Switch](./switch-node.md) směruje podle zvolené možnosti a uzel [Condition](./condition-node.md) může případy s nízkou spolehlivostí poslat tam, kde je uvidí člověk:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Typovaná odpověď zaručuje tvar, nikoli pravdivost. Prahové hodnoty volte podle vlastních dat a důsledků, nikoli opsáním čísla z příkladu.

## Přihlašovací údaje

Vytvořte přihlašovací údaje typu **Decision Model** na kartě [Přihlašovací údaje](../tabs/credentials-tab.md) s těmito hodnotami:

- **Base URL** — endpoint, například `https://api.typesafe.ai`. Heym připojí `/v1/systemone`.
- **API Key** — volitelné. Endpointy, které klíč nevyžadují, lze ponechat prázdné.

Při úpravě přihlašovacích údajů zůstane uložený klíč zachován, pokud pole s klíčem ponecháte prázdné; přepište jej pouze v případě, že jej chcete nahradit.

Stejné přihlašovací údaje mohou hodnotit běhy [Evaluací](../tabs/evals-tab.md): při zvoleném **LLM-as-Judge** jej vyberte jako hodnotitele a model rozhodování ohodnotí každou odpověď vůči očekávanému výstupu.

Heym ve výchozím nastavení blokuje odchozí požadavky na privátní a loopback adresy, takže rozhodovací endpoint, který provozujete sami na `localhost` nebo v privátním rozsahu, vyžaduje `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Modely rozhodování se nezobrazují v cenových tabulkách LLM, které Heym synchronizuje, takže sloupec **Cost** v [Spuštěních](../tabs/traces-tab.md) zůstává u těchto volání prázdný. Počty tokenů se stále zaznamenávají a vlastní cenu můžete přidat pomocí přepsání ceny.

## Chyby

| Situace | Co se stane |
|-----------|--------------|
| Neplatný API klíč | Uzel selže s chybou, která uvádí název přihlašovacích údajů |
| Nesprávně zadaná otázka | Vlastní zpráva poskytovatele na úrovni pole je přenesena do chyby uzlu |
| Překročen limit požadavků nebo přetížení | Uzel selže s chybou, že jde o přechodný stav — zapněte [retry](../reference/features.md) pro tento uzel, abyste jej překlenuli |
| Duplicitní nebo prázdné ID otázky | Uzel selže ještě před odesláním jakéhokoli požadavku |

## Související

- [LLM Node](./llm-node.md) – Generujte text namísto posudku
- [Agent Node](./agent-node.md) – Shromážděte důkazy pomocí nástrojů a poté je zde posuďte
- [Switch Node](./switch-node.md) – Směrujte podle zvolené možnosti
- [Condition Node](./condition-node.md) – Podmiňte podle spolehlivosti
- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Credentials](../reference/credentials.md) – Typy přihlašovacích údajů a jejich pole
- [Traces Tab](../tabs/traces-tab.md) – Zkontrolujte rozhodovací volání a spotřebu tokenů
