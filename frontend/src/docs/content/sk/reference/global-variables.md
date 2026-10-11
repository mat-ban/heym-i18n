# Globálne premenné

**Úložisko globálnych premenných** uchovává trvalé údaje typu kľúč-hodnota s rozsahom platnosti pre používateľa, ktoré pretrvávajú naprieč spusteniami workflowov. Využite ho na konfiguráciu, feature flags, počítadlá alebo zdieľaný stav, ktorý potrebuje viacero workflowov.

> **Neukladajte sem tajné údaje.** Globálne premenné nie sú trezorom tajných údajov: hodnoty sa ukladajú nešifrované, v plnom rozsahu sa vracajú komukoľvek, s kým ich zdieľate, a spolupracovníci ich môžu upravovať. API kľúče, heslá a tokeny patria do [Prihlasovacích údajov](./credentials.md), ktoré ich šifrujú v pokoji a nikdy nevracajú tajný údaj klientovi.

## Lokálne vs globálne

| Úložisko | Syntax | Rozsah | Trvalosť |
|-------|--------|-------|-------------|
| **Lokálne pre workflow** | `$vars.variableName` | Iba aktuálne spustenie | V pamäti, stráca sa po ukončení spustenia |
| **Globálne** | `$global.variableName` | Všetky workflowy používateľa | Uložené v databáze |

## Vytváranie globálnych premenných

1. **Na karte Premenné** – [Karta Premenné](../tabs/global-variables-tab.md): Vytvárajte, upravujte a odstraňujte premenné priamo.
2. **Z uzla Variable** – Povoľte **Store in Global Variable Store** (`isGlobal: true`) vo vlastnostiach uzla. Premenná sa zapíše do úložiska pri spustení workflowu.

## Použitie vo výrazoch

K globálnym premenným pristupujte pomocou `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Použite rovnaké metódy ako pri lokálnych premenných workflowu (napr. `.upper()`, `.length`, `.add()` pre polia).

## Typy hodnôt

Podporované typy: `string`, `number`, `boolean`, `array`, `object`. Typ zvoľte pri vytváraní alebo úprave premennej.

## Zdieľanie globálnych premenných

Globálnu premennú môžete zdieľať s inými používateľmi alebo [Tímami](./teams.md), aby ju mohli používať vo svojich vlastných workflowoch.

- **Zdieľať s používateľom** – Kliknite na ikonu zdieľania vedľa vlastnenej premennej, zadajte e-mail príjemcu a kliknite na **Share**. Príjemca uvidí premennú vo svojom zozname globálnych premenných s odznakom **Shared** a označením „Shared by &lt;your email&gt;“.
- **Zdieľať s tímom** – V dialógovom okne zdieľania vyberte tím a kliknite na **Add**. Prístup získa všetci členovia tímu.
- **Prístup na úpravy** – Príjemcovia môžu zdieľanú premennú zobrazovať, upravovať a odkazovať na ňu prostredníctvom `$global.variableName` vo svojich workflowoch. Iba vlastník môže premennú zdieľať, zrušiť zdieľanie alebo ju odstrániť.
- **Konflikty názvov** – Ak príjemca už má premennú s rovnakým názvom, jeho vlastná premenná má prednosť pred zdieľanou.
- **Zrušenie zdieľania** – Otvorte dialógové okno zdieľania pre premennú a kliknite na tlačidlo **×** vedľa používateľa, ktorému chcete odobrať prístup.

## Integrácia s Chatom

Globálne premenné sú dostupné asistentovi [Chatu](../tabs/chat-tab.md). LLM na ne môže odkazovať pri odpovedaní na otázky alebo generovaní obsahu.

## Súvisiace

- [Karta Premenné](../tabs/global-variables-tab.md) – Správa globálnych premenných v UI
- [Uzol Variable](../nodes/variable-node.md) – Nastavenie premenných pomocou `isGlobal`
- [Expression DSL](./expression-dsl.md) – Syntax `$global`
