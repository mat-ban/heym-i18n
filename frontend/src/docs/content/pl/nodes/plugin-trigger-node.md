# Węzeł Plugin Trigger

Węzeł **Plugin Trigger** jest odpowiednikiem typu trigger dla
[węzła Plugin](./plugin-node.md). Jest dostarczany przez zainstalowany plugin, którego
`kind` to `trigger`, i generuje dane początkowe, od których rozpoczyna się workflow.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.<keys returned by the plugin>` |

Plugin typu trigger może reprezentować dowolne źródło — inną aplikację, usługę
zewnętrzną lub inną technologię — o ile handler pluginu zwraca dane, od których
workflow ma rozpocząć działanie.

## Kiedy stosować

Węzła Plugin Trigger należy użyć, gdy zainstalowany plugin definiuje trigger
rozpoczynający workflow. W przypadku pluginów wykonujących akcję w trakcie
workflow należy użyć [węzła Plugin](./plugin-node.md).

## Konfiguracja

Podobnie jak w przypadku węzła Plugin, formularz konfiguracji jest generowany na
podstawie pól manifestu pluginu. Niebędące danymi wrażliwymi pola tekstowe
korzystają z pola wyrażenia, a pola wrażliwe są maskowane.

## Sposób działania pluginów

Kod pluginu jest zaufany (dostarczany przez Heym, instalowany przez operatora) i
działa w tym samym procesie. Instalacja jest ograniczona do
`HEYM_PLUGIN_ADMIN_EMAILS`, a podsystem jest kontrolowany przez
`HEYM_PLUGINS_ENABLED`. Zobacz
[Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md).

## Tworzenie pluginów

Aby utworzyć pakiet pluginu typu trigger, zapoznaj się z dokumentem
[Tworzenie pluginów](../reference/plugin-authoring.md), który opisuje strukturę
archiwum zip, pola manifestu, sygnatury handlerów, ikony, zależności oraz model
zaufania środowiska uruchomieniowego.
