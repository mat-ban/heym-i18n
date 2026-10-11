# Zmienne globalne

**Magazyn zmiennych globalnych** przechowuje trwałe dane typu klucz-wartość w zakresie użytkownika, które przetrwają między wykonaniami workflow. Należy go używać do konfiguracji, flag funkcji, liczników lub współdzielonego stanu potrzebnego wielu workflow.

> **Nie należy przechowywać tu sekretów.** Zmienne globalne nie są sejfem sekretów: wartości są przechowywane bez szyfrowania, są zwracane w całości każdemu, z kim zostaną udostępnione, a współpracownicy mogą je edytować. Klucze API, hasła i tokeny należą do [Danych logowania](./credentials.md), które szyfrują je w spoczynku i nigdy nie zwracają sekretu do klienta.

## Lokalne a globalne

| Magazyn | Składnia | Zakres | Trwałość |
|-------|--------|-------|-------------|
| **Lokalny dla workflow** | `$vars.variableName` | Tylko bieżące wykonanie | W pamięci, tracone po zakończeniu wykonania |
| **Globalny** | `$global.variableName` | Wszystkie workflow użytkownika | Przechowywane w bazie danych |

## Tworzenie zmiennych globalnych

1. **Z zakładki Zmienne** – [Zakładka Zmienne](../tabs/global-variables-tab.md): Tworzenie, edycja i usuwanie zmiennych bezpośrednio.
2. **Z węzła Zmienna** – Należy włączyć **Store in Global Variable Store** (`isGlobal: true`) we właściwościach węzła. Zmienna jest zapisywana w magazynie podczas uruchomienia workflow.

## Używanie w wyrażeniach

Dostęp do zmiennych globalnych uzyskuje się przez `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Należy stosować te same metody co w przypadku zmiennych lokalnych dla workflow (np. `.upper()`, `.length`, `.add()` dla tablic).

## Typy wartości

Obsługiwane typy: `string`, `number`, `boolean`, `array`, `object`. Typ należy wybrać podczas tworzenia lub edycji zmiennej.

## Udostępnianie zmiennych globalnych

Zmienną globalną można udostępnić innym użytkownikom lub [Zespołom](./teams.md), aby mogli jej używać we własnych workflow.

- **Udostępnianie użytkownikowi** – Należy kliknąć ikonę udostępniania obok posiadanej zmiennej, wprowadzić adres e-mail odbiorcy i kliknąć **Share**. Odbiorca zobaczy zmienną na swojej liście Zmiennych globalnych z plakietką **Shared** i etykietą „Shared by &lt;your email&gt;".
- **Udostępnianie zespołowi** – W oknie udostępniania należy wybrać zespół i kliknąć **Add**. Wszyscy członkowie zespołu uzyskują dostęp.
- **Dostęp edycyjny** – Odbiorcy mogą wyświetlać, edytować i odwoływać się do udostępnionej zmiennej przez `$global.variableName` w swoich workflow. Tylko właściciel może udostępniać, cofać udostępnienie lub usuwać zmienną.
- **Konflikty nazw** – Jeśli odbiorca ma już zmienną o tej samej nazwie, jego własna zmienna ma pierwszeństwo przed udostępnioną.
- **Cofanie udostępnienia** – Należy otworzyć okno udostępniania zmiennej i kliknąć przycisk **×** obok użytkownika, któremu ma zostać odebrany dostęp.

## Integracja z Chat

Zmienne globalne są dostępne dla asystenta [Chat](../tabs/chat-tab.md). LLM może się do nich odwoływać podczas odpowiadania na pytania lub generowania treści.

## Powiązane

- [Zakładka Zmienne](../tabs/global-variables-tab.md) – Zarządzanie zmiennymi globalnymi w interfejsie
- [Węzeł Zmienna](../nodes/variable-node.md) – Ustawianie zmiennych z `isGlobal`
- [Expression DSL](./expression-dsl.md) – Składnia `$global`
