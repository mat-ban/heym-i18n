# Tokeny wykonań

Tokeny wykonań to ograniczone zakresowo tokeny JWT, które przyznają dostęp do endpointów execute i stream pojedynczego workflow. Umożliwiają wywoływanie workflow z systemów zewnętrznych bez ujawniania długoterminowego tokenu sesji użytkownika.

## Dlaczego warto używać tokenów wykonań

Gdy uwierzytelnianie workflow jest ustawione na **JWT**, endpoint domyślnie wymaga ważnej sesji użytkownika. Tokeny wykonań pozwalają:

- Udostępnić token wywołujący zewnętrznym skryptom, pipeline'om CI lub integracjom bez udostępniania danych logowania do konta.
- Ograniczyć ekspozycję — token jest ważny tylko dla jednego konkretnego workflow.
- Natychmiast odwołać dostęp bez zmiany hasła ani rotacji tokenów sesji.
- Wybrać między tokenami krótkotrwałymi (minuty lub godziny) a długotrwałymi (do 10 lat).

## Tworzenie tokenu

Należy otworzyć okno dialogowe **Run with cURL** w edytorze (pasek narzędzi w prawym górnym rogu). Gdy uwierzytelnianie workflow jest ustawione na **JWT Token**, okno dialogowe wyświetla menedżer tokenów:

1. Wybrać **Short-lived** lub **Long-lived (10yr)**.
2. Dla tokenów krótkotrwałych wprowadzić czas trwania w sekundach (minimum 60).
3. Kliknąć **+ New Token**.

Token jest tworzony natychmiast, dodawany do listy i automatycznie wybierany, dzięki czemu polecenie cURL zostaje zaktualizowane o jego wartość.

## Lista tokenów

Każdy wiersz tokenu zawiera:

| Kolumna | Opis |
|--------|-------------|
| Created | Znacznik czasu utworzenia |
| Status | **Expires:** data, **Expired** lub **Revoked** |
| Ikona oka | Przełącza widoczność wartości tokenu |
| Przycisk Revoke | Oznacza token jako odwołany (nieodwracalnie) |

Należy kliknąć dowolny aktywny wiersz (niewygasły, nieodwołany), aby go wybrać. Wybrany token jest osadzany w podglądzie polecenia cURL.

Wygasłe i odwołane tokeny pozostają widoczne na liście, ale nie można ich wybrać.

## Używanie tokenu

Należy skopiować wartość tokenu z listy (kliknąć ikonę oka, aby ją ujawnić) i dołączyć go jako token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

W przypadku użycia **Copy cURL** w oknie dialogowym z wybranym tokenem, token jest już osadzony w poleceniu — ręczne podstawianie nie jest konieczne.

## Zakres tokenu

Każdy token zawiera następujące roszczenia JWT:

| Roszczenie | Wartość |
|-------|-------|
| `sub` | ID użytkownika będącego twórcą tokenu |
| `wid` | UUID workflow — token jest odrzucany dla każdego innego workflow |
| `scope` | `workflow:execute` — odróżnia go od tokenu sesji użytkownika |
| `jti` | Unikalny identyfikator tokenu używany do wyszukiwania przy odwoływaniu |
| `exp` | Znacznik czasu wygaśnięcia |

Backend sprawdza wszystkie te elementy przy każdym żądaniu: ważność podpisu, wygaśnięcie, zgodność `wid` oraz to, czy `jti` nie zostało odwołane.

## Odwoływanie

Należy kliknąć przycisk odwołania (przekreślone koło) obok tokenu, aby go odwołać. Odwołanie działa natychmiast — kolejne żądania używające tego tokenu zwracają `401`. Wiersz tokenu pozostaje widoczny na liście z etykietą **Revoked**.

Nie ma możliwości cofnięcia odwołania. Aby przywrócić dostęp, należy utworzyć nowy token.

## API

Endpointy zarządzania tokenami są uwierzytelniane przy użyciu zwykłej sesji.

| Metoda | Ścieżka | Opis |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Utworzenie tokenu |
| `GET` | `/api/workflows/{id}/execution-tokens` | Wyświetlenie listy tokenów użytkownika dla tego workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Odwołanie tokenu |

**Treść żądania utworzenia:**

```json
{ "ttl_seconds": 900 }
```

**Odpowiedź na utworzenie:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Pole `token` jest zwracane tylko raz, przy tworzeniu. Należy je natychmiast zapisać; kolejne żądania `GET` zwracają ten sam wiersz, ale można go również ujawnić w oknie dialogowym cURL w dowolnym momencie.

## Zakres widoczności

Każdy użytkownik widzi wyłącznie tokeny, które sam utworzył. Członkowie zespołu mający dostęp do współdzielonego workflow nie widzą nawzajem swoich tokenów.

## Powiązane

- [Webhooks](./webhooks.md) — endpointy triggerów HTTP i okno dialogowe cURL
- [Security](./security.md) — zarządzanie sesjami i przegląd uwierzytelniania
- [SSE Streaming](./sse-streaming.md) — używanie tokenów wykonań z endpointem strumieniowania
