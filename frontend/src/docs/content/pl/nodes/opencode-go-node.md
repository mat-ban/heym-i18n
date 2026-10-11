# Węzeł OpenCode Go

Węzeł **OpenCode Go** uruchamia CLI [OpenCode](https://opencode.ai) (Go) w izolowanym, wzmocnionym kontenerze Heym przeciwko repozytorium GitHub. Podobnie jak węzeł Codex, został zaprojektowany do zadań programistycznych, takich jak poprawianie testów, edycja plików, generowanie patcha czy otwieranie pull requesta — wykorzystuje jednak niezależny od dostawcy gateway modeli **OpenCode Go** zamiast OpenAI Codex.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | Klucz API OpenCode Go + GitHub |
| Wyjście | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Uwierzytelnianie

Dane logowania **OpenCode Go** przechowują **klucz API** gateway OpenCode Go (z [opencode.ai/go](https://opencode.ai/go)) oraz opcjonalny **Gateway Base URL** (domyślnie `https://opencode.ai/zen/go/v1`; należy nadpisać wyłącznie dla gateway hostowanego samodzielnie lub za proxy).

Węzeł wymaga również danych logowania **GitHub** do klonowania prywatnych repozytoriów, wypychania gałęzi roboczej i tworzenia pull requestów. Token GitHub **nigdy nie jest umieszczany wewnątrz kontenera sandbox** — Heym wykonuje wszystkie operacje git i GitHub po stronie hosta, dzięki czemu wygenerowany kod nie może wykraść danych logowania do wypychania.

## Izolacja i bezpieczeństwo

Izolacja wykonania jest wybierana przez `HEYM_OPENCODE_CLI_COMMAND`, dokładnie tak jak w węźle Codex:

- **Środowisko lokalne (`run.sh`)** pozostawia ją przy domyślnej wartości `opencode`, więc OpenCode działa jako podproces hosta przeciwko sklonowanemu obszarowi roboczemu — bez wymogu Docker i bez dodatkowych flag.
- **Wdrożenia Docker (`deploy.sh` oraz pojedynczy obraz GHCR)** ustawiają ją na `/usr/local/bin/heym-opencode-docker`, wrapper uruchamiający `opencode run` wewnątrz **wzmocnionego, jednorazowego kontenera siostrzanego** współdzielącego nazwany wolumen obszaru roboczego OpenCode.

Wzmocniony kontener runnera odrzuca wszystkie uprawnienia Linux, ustawia `no-new-privileges`, używa głównego systemu plików tylko do odczytu z tmpfs `/tmp` oraz stosuje limity pid/pamięci/CPU. Ruch wychodzący sieci jest dozwolony (OpenCode musi dotrzeć do gateway modeli). **Token GitHub nigdy nie jest umieszczany wewnątrz kontenera** — wszystkie operacje git i GitHub są wykonywane po stronie hosta, więc wewnątrz znajdują się wyłącznie klucz API OpenCode i pliki repozytorium.

OpenCode jedynie edytuje pliki na dysku; Heym odpowiada za każdą akcję git/GitHub.

## Modele

Lista modeli OpenCode Go zmienia się często, dlatego pole **Model** jest wypełniane na bieżąco z listy modeli gateway (`GET https://opencode.ai/zen/go/v1/models`) i wyświetlane jako przeszukiwalna lista rozwijana. Jeśli lista na żywo jest niedostępna, używana jest wbudowana lista zapasowa. Identyfikatory modeli używają formy `opencode-go/<model>` (na przykład `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` to identyfikator dostawcy CLI OpenCode dla gateway Go. Pozostawienie pola pustego powoduje użycie domyślnego modelu runnera (`opencode-go/kimi-k3`). Identyfikatory modeli zapisane w starszej formie `opencode/<model>` są automatycznie przepisywane w czasie wykonania.

## Pola

| Pole | Opis |
|-------|-------------|
| OpenCode Go Credential | Dane logowania OpenCode Go (klucz API gateway) |
| GitHub Credential | Dane logowania GitHub PAT używane do dostępu do repozytorium |
| Repository URL | Adres URL repozytorium GitHub HTTPS; obsługuje wyrażenia |
| Base Branch | Gałąź do sklonowania przed uruchomieniem OpenCode, domyślnie `main` |
| Model | Model OpenCode Go (przeszukiwalna lista rozwijana na żywo, `opencode-go/<model>`); pusta wartość używa domyślnego modelu runnera |
| Reasoning Variant | Opcjonalne; mapuje się na `opencode run --variant` dla modeli obsługujących reasoning effort |
| Task Prompt | Zadanie programistyczne dla OpenCode; obsługuje wyrażenia takie jak `$input.text` |
| Publish Mode | Sposób dostarczania zmian (patrz tabela poniżej) |
| Branch Name | Gałąź robocza dla trybów PR/commit, domyślnie `opencode/$executionId` |
| Timeout | Maksymalny czas wykonania OpenCode w sekundach |

## Tryby publikowania

| Tryb | Co robi |
|------|--------------|
| `diff_only` | Edytuje pliki lokalnie i zwraca patch oraz zmienione pliki. Nic nie jest wypychane. |
| `draft_pr` | Zatwierdza zmiany w gałęzi, wypycha ją i otwiera draft pull requesta. |
| `open_pr` | Zatwierdza zmiany w gałęzi, wypycha ją i otwiera pull requesta gotowego do przeglądu (nie-draft). |
| `commit_push` | Zatwierdza zmiany w gałęzi i wypycha ją, bez otwierania pull requesta. |
| `direct_commit` | Zatwierdza i wypycha zmiany bezpośrednio do gałęzi bazowej (bez osobnej gałęzi ani PR). |
| `open_or_update_pr` | Aktualizuje istniejącego otwartego PR agenta, gdy taki istnieje — nawet jeśli nazwa gałęzi się różni, runner znajduje go po autorze + gałęzi bazowej — w przeciwnym razie otwiera nowego. Najlepszy dla ponownych uruchomień i instrukcji „zaktualizuj otwarty PR”. |
| `update_existing_pr` | Dodaje commit do istniejącej gałęzi/PR; otwiera nowego, jeśli jeszcze nie istnieje. |
| `patch_artifact` | Zapisuje diff jako plik do pobrania i zwraca `patchUrl`. Nic nie jest wypychane. |

## Wyjścia

| Klucz | Opis |
|-----|-------------|
| `status` | Zawsze `completed` (węzeł OpenCode Go nie zatrzymuje się w oczekiwaniu na dane wejściowe) |
| `summary` | Końcowa wiadomość OpenCode |
| `validation` | Uwagi walidacyjne, gdy zostały zgłoszone |
| `diff` | Patch git, gdy pliki zostały zmienione |
| `changedFiles` | Ścieżki zmienionych plików |
| `branchName` | Nazwa gałęzi roboczej |
| `pullRequestUrl` | Adres URL PR w trybach `draft_pr`, `open_pr`, `open_or_update_pr` i `update_existing_pr` |
| `pushedBranch` | Gałąź, która została wypchnięta w trybach commit/PR |
| `patchUrl` | Link do pobrania diffa w trybie `patch_artifact` |
## Zrzuty ekranu UI w pull requestach

W przypadku zadań związanych z UI/frontendem OpenCode powinien zapisywać zrzuty ekranu w formacie PNG w ścieżce objętej gitignore, takiej jak `frontend/.e2e-artifacts/` (nie w źródłach). Jeśli brakuje zależności frontendu, prompt runnera zezwala na ukierunkowaną instalację pakietów (na przykład `bun install`) oraz krótkotrwały podgląd/`bun run dev` wyłącznie w celu wykonania zrzutu UI. Heym przesyła te obrazy do jednego współdzielonego GitHub **prerelease** (`opencode-pr-assets`) jako zasoby o nazwie `<branch>-…`, a następnie osadza je w opisie PR **przed otwarciem pull requesta**, dzięki czemu nowy PR jest tworzony już z zawartymi zrzutami ekranu (istniejące PR-y są aktualizowane w miejscu).

OpenCode jest również instruowany, aby kończyć linią `PR_TITLE: …`, dzięki czemu Heym może otworzyć pull request z sensownym tematem zamiast symboli zastępczych takich jak `Done.`

OpenCode czasami kończy turę w połowie zadania („…Now let me take a screenshot”), co sfinalizowałoby uruchomienie przed wykonaniem zrzutu ekranu. Aby temu zapobiec, prompt runnera wymaga wykonania zrzutów ekranu **przed** końcową wiadomością, a jeśli uruchomienie mimo to zakończy się bez publikowalnego podsumowania lub ze zmianą UI bez zrzutu ekranu, Heym wykonuje jeszcze jedno przejście OpenCode w tym samym obszarze roboczym w celu dokończenia. Jeśli zmiana UI nadal nie ma zrzutu ekranu, do treści PR dodawana jest widoczna adnotacja, aby luka nigdy nie pozostała niezauważona.

## Co jest publikowane w GitHub

**Task Prompt** jest prywatnym wejściem, a nie treścią PR. Publikowane są tylko dwie rzeczy: sekcja `## Change Summary` opisująca, co robi zmiana w kodzie, oraz sekcja `## Screenshots`, gdy zrzuty ekranu zostały wykonane. Tytuł PR jest wyprowadzany wyłącznie z podsumowania zmian.

Prompt runnera określa tę politykę, a Heym egzekwuje ją również po uruchomieniu: zanim cokolwiek zostanie zatwierdzone lub otwarte jako pull request, usuwa sekcje będące echem promptu (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) oraz wszelkie akapity skopiowane dosłownie z task promptu z podsumowania, treści PR i wiadomości commita.

Heym odczytuje sekcję `## Change Summary` z wiadomości agenta, zamiast brać to, co zostało powiedziane na końcu, ponieważ OpenCode emituje wiadomość na każdy krok, a ostatnia z nich to często komentarz w trakcie uruchomienia. Narracja kroków (`Both pass. Let me do a final review:`) jest również odrzucana jako tytuł PR lub temat commita. Jeśli uruchomienie nie wygeneruje użytecznego podsumowania zmian, pull request zamiast publikowania komentarzy wyświetla listę zmienionych plików.

## Jako narzędzie agenta

Węzeł OpenCode Go można podłączyć do uchwytu narzędzia węzła **AI Agent**, aby agent mógł delegować zadania kodowania. Należy skonfigurować dane logowania, dane logowania GitHub oraz repozytorium w węźle, a następnie oznaczyć **Task Prompt** (oraz opcjonalnie **Repository URL**) przełącznikiem dostarczanym przez agenta, aby agent przekazywał je w momencie wywołania.

## Przykład

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Powiązane

- [Węzeł Codex](./codex-node.md)
- [Węzeł GitHub](./github-node.md)
- [Węzeł Agent](./agent-node.md)
- [Dane logowania](../reference/credentials.md)
- [Udostępnianie danych logowania](../reference/credentials-sharing.md)
- [Typy węzłów](../reference/node-types.md)
