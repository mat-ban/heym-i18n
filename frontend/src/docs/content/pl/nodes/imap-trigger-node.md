# Trigger IMAP

Węzeł **Trigger IMAP** odpytuje skrzynkę e-mail w ustalonym interwale i uruchamia workflow raz dla każdej nowo wykrytej wiadomości. Jest to węzeł triggera o zerowym wejściu, przeznaczony do automatyzacji poczty przychodzącej, takiej jak triage zgłoszeń, monitorowanie skrzynek współdzielonych oraz skrzynki zatwierdzeń.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania `imap` zawierające serwer, login, skrzynkę i ustawienia SSL |
| `pollIntervalMinutes` | Integer | Jak często Heym sprawdza skrzynkę w poszukiwaniu nowej poczty |

## Przewodnik konfiguracji

### 1. Utwórz dane logowania `imap`

1. Przejdź do **Settings → Credentials → New Credential**
2. Wybierz typ **IMAP Email Inbox**
3. Wprowadź:
   - **IMAP Host** (na przykład `imap.gmail.com`)
   - **IMAP Port** (`993` dla SSL/TLS u większości dostawców)
   - **Username / Email**
   - **Password / App Password**
   - Opcjonalnie **Mailbox** (domyślnie: `INBOX`)
4. Pozostaw **Use SSL / TLS** włączone, chyba że serwer pocztowy wyraźnie wymaga IMAP bez SSL
5. Zapisz dane logowania

### 2. Dodaj węzeł do workflow

1. Przeciągnij **IMAP Trigger** na canvas
2. Wybierz węzeł, aby otworzyć panel Properties
3. Wybierz swoje dane logowania `imap`
4. Ustaw **Poll Interval (Minutes)** na wartość całkowitą, taką jak `1`, `5` lub `15`

## Semantyka triggera

- Pierwsze odpytanie ustala punkt odniesienia dla bieżącej zawartości skrzynki i **nie** odtwarza starszej poczty.
- Kolejne odpytania uruchamiają trigger raz dla każdej wiadomości, której IMAP UID jest nowszy niż zapisany kursor.
- Jeśli `UIDVALIDITY` skrzynki ulegnie zmianie, Heym resetuje kursor i ponownie ustala punkt odniesienia, aby uniknąć duplikatów przetwarzania.
- Każdy nowy e-mail uruchamia osobne wykonanie workflow z `trigger_source = "imap"`.

## Pola wyjściowe

Po uruchomieniu triggera węzły downstream mogą uzyskać dostęp do:

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.email` | Pełny sparsowany payload e-mail |
| `$nodeLabel.email.subject` | Zdekodowany temat |
| `$nodeLabel.email.from` | Surowy nagłówek `From` |
| `$nodeLabel.email.fromAddresses` | Sparsowana lista nadawców |
| `$nodeLabel.email.toAddresses` | Sparsowana lista odbiorców |
| `$nodeLabel.email.ccAddresses` | Sparsowana lista CC |
| `$nodeLabel.email.replyToAddresses` | Sparsowana lista reply-to |
| `$nodeLabel.email.text` | Treść w postaci zwykłego tekstu |
| `$nodeLabel.email.html` | Treść HTML |
| `$nodeLabel.email.attachments` | Tablica metadanych załączników (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Zdekodowany obiekt nagłówków |
| `$nodeLabel.email.uid` | IMAP UID do deduplikacji lub logowania |
| `$nodeLabel.triggered_by` | Etykieta źródła triggera (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID węzła na canvas, który wykrył e-mail |
| `$nodeLabel.triggered_at` | Znacznik czasu ISO dla wykonania workflow |

## Przykładowy workflow

**Przychodzący e-mail do wsparcia → podsumowanie → routing**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** label: `supportInbox`
- **LLM** user message: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Uwagi

- Wielu dostawców wymaga **app password** do dostępu IMAP zamiast hasła głównego konta.
- Zawartość załączników nie jest wstrzykiwana do wejścia workflow; uwzględniane są wyłącznie metadane załączników.
- Użyj [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) lub [DataTable](./datatable-node.md) downstream, aby kierować lub logować nowe e-maile.

## Powiązane

- [Triggers](../reference/triggers.md) – Przegląd wszystkich punktów wejścia workflow
- [Third-Party Integrations](../reference/integrations.md) – Konfiguracja danych logowania IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie i zarządzanie danymi logowania `imap`
- [Send Email](./send-email-node.md) – Odpowiadanie lub przekazywanie wiadomości przychodzących
