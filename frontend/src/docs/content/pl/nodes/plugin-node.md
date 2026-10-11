# Węzeł Plugin

Węzeł **Plugin** uruchamia niestandardową akcję udostępnianą przez zainstalowany plugin. Pluginy rozszerzają Heym o nowe typy węzłów — akcje, integracje z rozwiązaniami zewnętrznych dostawców lub dowolną logikę wyrażalną w Pythonie — bez modyfikowania rdzenia aplikacji.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.<keys returned by the plugin>` |

**Pakiet** pluginu (pojedynczy plik zip) może zawierać **wiele węzłów** — dowolną kombinację akcji i triggerów. Każdy węzeł pojawia się w palecie w sekcji **Plugins** z własną nazwą i opisem. Przeciągnięcie węzła na canvas tworzy węzeł Plugin powiązany z tym pakietem (`pluginId`) oraz węzłem (`pluginNodeKey`).

## Kiedy stosować

Węzeł Plugin należy stosować, gdy operator zainstalował plugin wykonujący wymaganą akcję — na przykład wywołujący prywatne API, komunikujący się z systemem wewnętrznym lub uruchamiający logikę napisaną specjalnie dla danego wdrożenia.

W przypadku pluginów typu trigger, które rozpoczynają workflow, należy zapoznać się z dokumentacją [Węzeł Plugin Trigger](./plugin-trigger-node.md).

## Konfiguracja

Formularz konfiguracji węzła jest generowany na podstawie manifestu pluginu. Każde pole zadeklarowane przez plugin (`string`, `number`, `boolean` lub `select`) jest renderowane automatycznie. Niebędące sekretami pola tekstowe korzystają z pola wyrażenia, a zapisane wartości konfiguracji tekstowej rozpoczynające się od `$` są rozwiązywane przed uruchomieniem handlera pluginu.

Pola sekretów (takie jak klucze API) są maskowane w interfejsie i nigdy nie są zapisywane w logach.

## Jak działają pluginy

Pluginy są dostarczane przez Heym i instalowane przez operatora, dlatego kod pluginu jest **zaufany** i działa w tym samym procesie co węzły wbudowane, z pełnym dostępem do sieci i bibliotek. Plugin może zadeklarować zależności pip (`dependencies`), które są instalowane w instancji w momencie instalacji.

Instalowanie i usuwanie pluginów jest ograniczone do operatorów, których adres e‑mail znajduje się na liście `HEYM_PLUGIN_ADMIN_EMAILS`, a cały podsystem jest kontrolowany przez `HEYM_PLUGINS_ENABLED` (domyślnie wyłączony). Zmienne środowiskowe opisano w sekcji [Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md).

## Niestandardowe ikony

Plugin może zawierać niestandardowe logo SVG. Plik `icon.svg` w katalogu głównym pakietu ustawia domyślną ikonę dla wszystkich węzłów, a pojedynczy węzeł może mieć własny wpis `"icon": "<file>.svg"` w manifeście. Ikona jest wyświetlana zarówno na karcie w palecie, jak i na węźle na canvasie; węzły bez ikony używają domyślnego glifu w kształcie puzzla.

## AI Builder

Zainstalowane pluginy są udostępniane asystentowi AI oraz canvasowi chat, dzięki czemu można poprosić Heym o „użycie pluginu Acme CRM do utworzenia rekordu”, a system wygeneruje węzeł Plugin z odpowiednim `pluginId` i `config`.

## Tworzenie pluginów

Aby zbudować pakiet pluginu, należy zapoznać się z dokumentacją [Tworzenie pluginów](../reference/plugin-authoring.md), która opisuje strukturę pliku zip, pola manifestu, sygnatury handlerów, ikony, zależności oraz model zaufania w czasie działania.
