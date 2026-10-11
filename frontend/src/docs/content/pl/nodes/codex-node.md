# Węzeł Codex

Węzeł **Codex** uruchamia OpenAI Codex CLI w izolowanym obszarze roboczym Heym względem repozytorium GitHub. Jest przeznaczony do zadań programistycznych, takich jak poprawianie testów, edycja plików, tworzenie patcha czy otwieranie draft pull requesta.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1, plus `question` |
| Dane logowania | Codex access token + GitHub |
| Wyjście | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Uwierzytelnianie

Dane logowania **OpenAI Codex** obsługują dwa tryby uwierzytelniania:

| Tryb | Opis |
|------|-------------|
| **Sign in with ChatGPT** (zalecany) | Logowanie OAuth (PKCE), które wykorzystuje subskrypcję ChatGPT Plus/Pro, dzięki czemu uruchomienia **nie** generują kosztów API rozliczanych za token. Należy kliknąć **Sign in with ChatGPT** w oknie danych logowania, autoryzować w przeglądarce, a następnie wkleić adres przekierowania `localhost:1455` z powrotem do Heym. Heym przechowuje powstały pakiet tokenów i odświeża go automatycznie wraz z upływem ważności. |
| **Access token** | Wklejenie tokenu `access_token` ChatGPT/Codex używanego wyłącznie przez lokalny runner Codex. |

Klucze API nie są akceptowane dla danych logowania Codex. Węzeł nie zleca zadań Codex w chmurze; klonuje repozytorium wewnątrz środowiska uruchomieniowego Heym, zapisuje pakiet tokenów ChatGPT do izolowanego pliku `auth.json` (lub przekazuje `CODEX_ACCESS_TOKEN`) wyłącznie do procesu Codex i nie umieszcza tokenu w `$credentials`.

Węzeł wymaga również danych logowania **GitHub** do klonowania prywatnych repozytoriów, wypychania gałęzi roboczej i tworzenia draft pull requestów.

W wdrożeniach Docker Heym uruchamia Codex wewnątrz kontenera siostrzanego z tego samego obrazu Heym (nie z osobnego obrazu GHCR). Kontener ten montuje wyłącznie wolumen obszaru roboczego Codex i pozwala własnej sandboxowi Codex opartemu na bubblewrap tworzyć przestrzenie nazw oraz świeży `/proc`. Runner dodaje `SYS_ADMIN`, nieograniczony seccomp i AppArmor oraz `systempaths=unconfined` (Docker Engine 25+). Bez ostatniej flagi każde polecenie kończy się niepowodzeniem przed uruchomieniem z komunikatem `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Odnośniki OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Pola

| Pole | Opis |
|-------|-------------|
| Codex Credential | Dane logowania OpenAI Codex (logowanie ChatGPT lub `access_token`) |
| GitHub Credential | Dane logowania GitHub PAT używane do dostępu do repozytorium |
| Repository URL | Adres URL repozytorium GitHub w protokole HTTPS |
| Base Branch | Gałąź klonowana przed uruchomieniem Codex, domyślnie `main` |
| Model | Opcjonalny model Codex (lista rozwijana z możliwością edycji, np. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); puste pole oznacza użycie domyślnego modelu Codex |
| Reasoning Effort | Głębokość rozumowania Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` lub `ultra` (domyślnie `medium`) |
| Task Prompt | Zadanie programistyczne dla Codex; obsługuje wyrażenia takie jak `$input.text` |
| Publish Mode | Sposób dostarczania zmian (patrz tabela poniżej) |
| Branch Name | Gałąź robocza dla trybów PR/commit, domyślnie `codex/$executionId` |
| Timeout | Maksymalny czas wykonania Codex w sekundach |

## Tryby publikowania

| Tryb | Co robi |
|------|--------------|
| `diff_only` | Edytuje pliki lokalnie i zwraca patch oraz zmienione pliki. Nic nie jest wypychane. |
| `draft_pr` | Zatwierdza zmiany w gałęzi, wypycha ją i otwiera draft pull requesta. |
| `open_pr` | Zatwierdza zmiany w gałęzi, wypycha ją i otwiera pull requesta gotowego do przeglądu (niebędącego draftem). |
| `commit_push` | Zatwierdza zmiany w gałęzi i wypycha ją, bez otwierania pull requesta. |
| `direct_commit` | Zatwierdza zmiany i wypycha je bezpośrednio do gałęzi bazowej (bez osobnej gałęzi ani PR). |
| `open_or_update_pr` | Aktualizuje istniejącego otwartego PR agenta, gdy taki istnieje — nawet jeśli nazwa gałęzi się różni, runner znajduje go po autorze i gałęzi bazowej — w przeciwnym razie otwiera nowego. Najlepszy do ponownych uruchomień i instrukcji typu „zaktualizuj otwartego PR”. |
| `update_existing_pr` | Dodaje commit do istniejącej gałęzi/PR; otwiera nowego, jeśli jeszcze nie istnieje. |
| `patch_artifact` | Zapisuje diff jako plik do pobrania i zwraca `patchUrl`. Nic nie jest wypychane. |

## Wyjścia

| Klucz | Opis |
|-----|-------------|
| `status` | `completed` lub `needs_input` |
| `summary` | Podsumowanie Codex |
| `validation` | Uwagi dotyczące walidacji, testy lub sprawdzenia zgłoszone przez Codex |
| `diff` | Patch Git, gdy pliki zostały zmienione |
| `changedFiles` | Ścieżki zmienionych plików |
| `threadId` | Identyfikator wątku/sesji Codex, gdy jest dostępny |
| `branchName` | Nazwa gałęzi roboczej |
| `pullRequestUrl` | Adres URL PR w trybach `draft_pr`, `open_pr`, `open_or_update_pr` i `update_existing_pr` |
| `pushedBranch` | Gałąź, która została wypchnięta w trybach commit/PR |
| `patchUrl` | Link do pobrania diffu w trybie `patch_artifact` |
| `usage` | Metadane użycia zgłoszone przez Codex CLI, gdy są dostępne |
## Zrzuty ekranu UI w pull requestach

W przypadku zadań dotyczących UI/frontendu Codex powinien zapisywać zrzuty ekranu w formacie PNG w ścieżce objętej gitignore, takiej jak `frontend/.e2e-artifacts/` (nie w źródłach). Jeśli brakuje zależności frontendu, Codex może uruchomić `bun install` (lub npm/pnpm install) i uruchomić krótkotrwały podgląd/`bun run dev` wyłącznie w celu wykonania zrzutu UI. Heym przesyła te obrazy do jednego wspólnego GitHub **prerelease** (`codex-pr-assets`) jako zasoby o nazwie `<branch>-…`, a następnie osadza je w opisie PR **przed otwarciem pull requesta**, dzięki czemu nowy PR jest tworzony już z zawartymi zrzutami ekranu (istniejące PR-y są aktualizowane w miejscu). Codex musi również ustawić znaczący `pull_request_title` (nigdy placeholdery takie jak `Done.`).

Codex czasami kończy turę w połowie zadania („…Teraz zrobię zrzut ekranu"), co sfinalizowałoby uruchomienie przed wykonaniem zrzutu. Aby temu zapobiec, prompt runnera wymaga wykonania zrzutów ekranu **przed** końcowym wynikiem, a jeśli uruchomienie mimo to zakończy się bez publikowalnego podsumowania lub ze zmianą UI bez zrzutu ekranu, Heym uruchamia jeszcze jedno przejście Codex w tym samym obszarze roboczym w celu dokończenia. Jeśli zmiana UI nadal nie ma zrzutu ekranu, do treści PR dodawana jest widoczna adnotacja, aby luka nigdy nie pozostała niezauważona.

## Co jest publikowane na GitHubie

**Task Prompt** jest prywatnym wejściem, a nie treścią PR. Publikowane są tylko dwie rzeczy: sekcja `## Change Summary` opisująca, co robi zmiana w kodzie, oraz sekcja `## Screenshots`, gdy zrzuty ekranu zostały wykonane. Tytuł PR jest tworzony wyłącznie na podstawie podsumowania zmian.

Prompt runnera określa tę politykę, a Heym egzekwuje ją również po uruchomieniu: zanim cokolwiek zostanie zatwierdzone lub otwarte jako pull request, usuwa sekcje będące echem promptu (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) oraz wszelkie akapity skopiowane dosłownie z task promptu z podsumowania, treści PR i wiadomości commita. Narracja kroków, taka jak `Both pass. Let me do a final review:`, jest również odrzucana jako tytuł PR lub temat commita.

## Pytania uzupełniające

Jeśli Codex potrzebuje brakujących wymagań lub decyzji produktowej, zwraca `needs_input`. Heym wstrzymuje wykonanie i udostępnia uchwyt wyjściowy `question`. Należy podłączyć ten uchwyt do gałęzi powiadomień, na przykład Slack lub Send Email, aby wysłać recenzentowi publiczny link do pytań uzupełniających.

Gdy recenzent odpowie, Heym wznawia ten sam snapshot wykonania i wątek Codex na podstawie zapisanych metadanych obszaru roboczego.

## Jako narzędzie agenta

Węzeł Codex można podłączyć do uchwytu narzędziowego węzła **AI Agent**, aby agent mógł delegować zadania kodowania. Należy skonfigurować dane logowania, dane logowania GitHub oraz repozytorium w węźle, a następnie oznaczyć **Task Prompt** (i opcjonalnie **Repository URL**) przełącznikiem dostarczanym przez agenta, aby agent przekazywał je w momencie wywołania. Gdy Codex działa jako narzędzie, wynik `needs_input` jest zwracany bezpośrednio do agenta zamiast wstrzymywania workflow, dzięki czemu agent może doprecyzować żądanie i ponownie wywołać Codex.

## Przykład

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Powiązane

- [Węzeł GitHub](./github-node.md)
- [Węzeł agenta](./agent-node.md)
- [Dane logowania](../reference/credentials.md)
- [Udostępnianie danych logowania](../reference/credentials-sharing.md)
- [Typy węzłów](../reference/node-types.md)
