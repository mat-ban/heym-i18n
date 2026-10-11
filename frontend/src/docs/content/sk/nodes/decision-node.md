# Rozhodnutie

Uzol **Rozhodnutie** kladie rozhodovaciemu modelu otázky s typmi o aktuálnom stave spustenia a vracia pravdepodobnosti. Negeneruje text. Použite ho, keď workflow potrebuje úsudok, na ktorom sa dá vetviť — smerovanie, triedenie, zoraďovanie, overovanie alebo blokovanie kroku, ktorý sa nedá vrátiť späť.

Rozhodovacie modely (nazývané aj modely *System One*) sú iným druhom modelu než LLM. Neexistuje tu žiadny prompt, žiadna systémová inštrukcia, žiadna teplota ani volanie nástrojov. Odošlete **stav** spolu s mapou **otázok** a každá odpoveď sa vráti ako číslo s pravdepodobnostným rozdelením za ním. Keďže odpoveď má len niekoľko tokenov, tieto modely sú rýchle a lacné v porovnaní s požiadaním [LLM](./llm-node.md), aby vytvoril JSON, a jeho následným parsovaním.

Na generovanie textu použite uzol [LLM](./llm-node.md). Pre model, ktorý volá nástroje, použite uzol [Agent Node](./agent-node.md).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | Odpoveď poskytovateľa doslovne — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje *Decision Model*. Nie prihlasovacie údaje LLM. |
| `model` | string | Názov modelu, napríklad `jev-latest` |
| `state` | expression | Čo má model čítať (predvolené `$input.text`) |
| `questions` | array | Usporiadané riadky otázok; aspoň jedna |
| `customBodyEnabled` | boolean | Odoslať ručne napísané telo požiadavky namiesto formulára |
| `customBody` | expression (JSON) | Telo, ktoré sa má odoslať, keď je prepínač zapnutý |
| `requestTimeoutSeconds` | number | Maximálny počet sekúnd čakania (predvolené: 60) |

### Stav

**Stav** je situácia, ktorú model posudzuje. Prijíma reťazec, objekt alebo pole.

Pole obsahujúce presne jeden výraz si zachováva vlastný typ, takže `$input` odošle samotný objekt namiesto jeho textu. Šablóna s výrazom vnútri (`Ticket: $input.text`) sa vyhodnotí ako reťazec. Poskytnite každej otázke dostatok informácií na odpoveď: zdrojový text, identity, vzťahy, pravidlá a aktuálne skutočnosti.

## Typy otázok

Každá otázka má `id`, `type`, `instructions` a kritériá, ktoré závisia od typu.

`id` je spôsob, akým váš workflow číta odpoveď späť. **Nikdy sa neodosiela modelu**, takže celý význam musí spočívať v `instructions`. Napísanie `id: is_urgent` s `instructions: "Is it?"` nedáva modelu nič, s čím by mohol pracovať.

### Noul

Či platí podmienka. Vracia pravdepodobnosť, že odpoveď je áno, od 0 do 1.

Kritériá sú voliteľné: **Yes means** a **No means** opisujú, čo každá strana pokrýva. Hodnota blízka 0,5 znamená, že model považuje áno a nie za približne rovnako pravdepodobné — nie „strednú intenzitu".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Čítajte ho pomocou `$triage.answers.is_urgent.noul`.

### Choice

Vyberie jednu možnosť z množiny, ktorú definujete. Vracia zvolenú možnosť, celé rozdelenie a odvodenú spoľahlivosť.

Vždy pridajte možnosť pokrývajúcu „žiadna z týchto", keď sa nič nemusí hodiť — model nemôže zvoliť možnosť, ktorú ste neponúkli.

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

Čítajte ho pomocou `$triage.answers.department.choice`, `.probabilities.billing` a `.confidence`.

### Score

Hodnotí stav podľa usporiadanej rubriky. Vracia hodnotu váženú pravdepodobnosťou, ktorá môže skončiť **medzi** úrovňami, spolu s legendou a rozdelením.

Úrovne idú od najnižšej, aspoň dve a najviac desať. Každá úroveň by mala opisovať konkrétnu situáciu a stáť samostatne.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Čítajte ho pomocou `$triage.answers.frustration.score`, `.legend` a `.confidence`.

## Generovať pomocou AI

**Generovať pomocou AI** mení jednoduchú vetu na navrhovanú šablónu stavu a sadu riadkov otázok. Opíšte, čo chcete posudzovať — „triediť prichádzajúci tiket podpory: aká je naliehavosť, ktorý tím ho vlastní a ako frustrovaný zákazník znie" — a pred pridaním do uzla skontrolujte, čo sa vráti.

Návrh vytvára LLM, takže dialóg žiada prihlasovacie údaje LLM. Rozhodovací model odpovie na otázky neskôr, keď sa workflow spustí. Generované id sú deduplikované voči riadkom, ktoré uzol už obsahuje, takže dvojité generovanie nikdy neprepíše existujúci kľúč odpovede.

Každé generovanie sa zaznamená na karte [Traces](../tabs/traces-tab.md) pod zdrojom **Decision Questions**, spolu s `decision.systemone` stopami, ktoré zapisuje samotný uzol v čase spustenia.
## Vlastné telo požiadavky

Zapnite **Vlastné telo požiadavky**, ak chcete odoslať JSON, ktorý napíšete sami, namiesto formulára. Použite to pre endpoint, ktorého kontrakt sa líši od toho, ktorý zostavuje formulár.

Editor sa inicializuje z aktuálneho formulára a výrazy v ňom sa vyhodnotia pred odoslaním požiadavky. Kým je prepínač zapnutý, pole State a riadky otázok sa ignorujú. Odpoveď sa v oboch prípadoch odovzdáva nezmenená, takže odlišný kontrakt jednoducho vytvorí odlišný tvar, ktorý môžu vaše výrazy čítať.

## Výstup

Uzol vracia presne to, čo vrátil poskytovateľ. Nič sa nepremenúva ani nezjednocuje.

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

## Vetvenie na základe odpovede

Uzol [Switch](./switch-node.md) smeruje na základe zvolenej možnosti a uzol [Condition](./condition-node.md) môže prípady s nízkou mierou istoty poslať tam, kde ich uvidí človek:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Typovaná odpoveď zaručuje tvar, nie pravdivosť. Prahové hodnoty vyberajte na základe vlastných údajov a dôsledkov, nie kopírovaním čísla z príkladu.

## Prihlasovacie údaje

Vytvorte prihlasovacie údaje **Decision Model** na karte [Prihlasovacie údaje](../tabs/credentials-tab.md) s týmito hodnotami:

- **Base URL** — endpoint, napríklad `https://api.typesafe.ai`. Heym pripojí `/v1/systemone`.
- **API Key** — voliteľné. Endpointy, ktoré nevyžadujú kľúč, môžete nechať prázdne.

Pri úprave prihlasovacích údajov sa uložený kľúč zachová, ak pole pre kľúč necháte prázdne; znova ho zadajte len v prípade, že ho chcete nahradiť.

Rovnaké prihlasovacie údaje môžu hodnotiť spustenia [Evals](../tabs/evals-tab.md): pri zvolenej možnosti **LLM-as-Judge** ich vyberte ako hodnotiaceho sudcu a model rozhodovania ohodnotí každú odpoveď voči očakávanému výstupu.

Heym štandardne blokuje odchádzajúce požiadavky na súkromné a loopback adresy, takže rozhodovací endpoint, ktorý prevádzkujete sami na `localhost` alebo v súkromnom rozsahu, vyžaduje `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Modely rozhodovania sa nezobrazujú v cenových tabuľkách LLM, ktoré Heym synchronizuje, takže stĺpec **Cost** v [Spusteniach](../tabs/traces-tab.md) zostáva pri týchto volaniach prázdny. Počty tokenov sa stále zaznamenávajú a vlastnú cenu môžete pridať pomocou prepísania ceny.

## Chyby

| Situácia | Čo sa stane |
|-----------|--------------|
| Neplatný API kľúč | Uzol zlyhá so správou, ktorá pomenúva prihlasovacie údaje |
| Nesprávne naformátovaná otázka | Vlastná správa poskytovateľa na úrovni poľa sa prenesie do chyby uzla |
| Prekročený limit alebo preťaženie | Uzol zlyhá so správou, že ide o prechodný stav — zapnite [retry](../reference/features.md) pre tento uzol, aby to prekonal |
| Duplicitné alebo prázdne id otázky | Uzol zlyhá pred odoslaním akejkoľvek požiadavky |

## Súvisiace

- [LLM Node](./llm-node.md) – Generovanie textu namiesto úsudku
- [Agent Node](./agent-node.md) – Zhromaždenie dôkazov pomocou nástrojov a ich následné posúdenie tu
- [Switch Node](./switch-node.md) – Smerovanie na základe zvolenej možnosti
- [Condition Node](./condition-node.md) – Podmienenie na základe miery istoty
- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Credentials](../reference/credentials.md) – Typy prihlasovacích údajov a ich polia
- [Traces Tab](../tabs/traces-tab.md) – Kontrola rozhodovacích volaní a spotreby tokenov
