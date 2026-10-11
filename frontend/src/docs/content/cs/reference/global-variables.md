# Globální proměnné

**Úložiště globálních proměnných** uchovává trvalá data typu klíč-hodnota vázaná na uživatele, která přetrvávají napříč spuštěními workflow. Využijte je pro konfiguraci, přepínače funkcí, čítače nebo sdílený stav, který potřebuje více workflow.

> **Neukládejte sem tajné údaje.** Globální proměnné nejsou trezor tajných údajů: hodnoty jsou uloženy nešifrovaně, jsou vráceny v plném rozsahu komukoli, s kým je sdílíte, a spolupracovníci je mohou upravovat. API klíče, hesla a tokeny patří do [Přihlašovacích údajů](./credentials.md), které je šifrují v klidu a nikdy nevracejí tajný údaj klientovi.

## Lokální vs globální

| Úložiště | Syntaxe | Rozsah | Trvalost |
|-------|--------|-------|-------------|
| **Lokální pro workflow** | `$vars.variableName` | Pouze aktuální spuštění | V paměti, ztraceno po ukončení spuštění |
| **Globální** | `$global.variableName` | Všechna workflow daného uživatele | Uloženo v databázi |

## Vytváření globálních proměnných

1. **Na kartě Proměnné** – [Karta Proměnné](../tabs/global-variables-tab.md): Vytvářejte, upravujte a mažte proměnné přímo.
2. **Z uzlu Proměnná** – Povolte **Store in Global Variable Store** (`isGlobal: true`) ve vlastnostech uzlu. Proměnná se zapíše do úložiště při spuštění workflow.

## Použití ve výrazech

Přistupujte ke globálním proměnným pomocí `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Použijte stejné metody jako u proměnných lokálních pro workflow (např. `.upper()`, `.length`, `.add()` pro pole).

## Typy hodnot

Podporované typy: `string`, `number`, `boolean`, `array`, `object`. Typ zvolte při vytváření nebo úpravě proměnné.

## Sdílení globálních proměnných

Globální proměnnou můžete sdílet s dalšími uživateli nebo [Týmy](./teams.md), aby ji mohli používat ve svých vlastních workflow.

- **Sdílet s uživatelem** – Klikněte na ikonu sdílení vedle vlastněné proměnné, zadejte e-mail příjemce a klikněte na **Share**. Příjemce uvidí proměnnou ve svém seznamu globálních proměnných se štítkem **Shared** a označením „Shared by &lt;your email&gt;“.
- **Sdílet s týmem** – V dialogu sdílení vyberte tým a klikněte na **Add**. Přístup získají všichni členové týmu.
- **Právo úprav** – Příjemci mohou sdílenou proměnnou zobrazit, upravit a odkazovat na ni prostřednictvím `$global.variableName` ve svých workflow. Pouze vlastník může proměnnou sdílet, zrušit sdílení nebo ji smazat.
- **Konflikty názvů** – Pokud příjemce již má proměnnou se stejným názvem, má jeho vlastní proměnná přednost před sdílenou.
- **Zrušení sdílení** – Otevřete dialog sdílení dané proměnné a klikněte na tlačítko **×** vedle uživatele, kterému chcete odebrat přístup.

## Integrace s Chatem

Globální proměnné jsou dostupné asistentovi v [Chatu](../tabs/chat-tab.md). LLM na ně může odkazovat při odpovídání na otázky nebo generování obsahu.

## Související

- [Karta Proměnné](../tabs/global-variables-tab.md) – Správa globálních proměnných v UI
- [Uzel Proměnná](../nodes/variable-node.md) – Nastavení proměnných pomocí `isGlobal`
- [Expression DSL](./expression-dsl.md) – Syntaxe `$global`
