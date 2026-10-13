# Wysyłanie e-maila

Węzeł **Send Email** wysyła e-maile przez SMTP. Służy do powiadomień, alertów oraz e-maili transakcyjnych.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania SMTP z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `to` | expression | Odbiorca lub odbiorcy. W przypadku wielu adresów należy rozdzielić je przecinkami. |
| `cc` | expression | Odbiorca lub odbiorcy w kopii (CC). W przypadku wielu adresów należy rozdzielić je przecinkami. |
| `bcc` | expression | Odbiorca lub odbiorcy w kopii ukrytej (BCC). W przypadku wielu adresów należy rozdzielić je przecinkami. Adresy ukryte przed pozostałymi odbiorcami. |
| `subject` | expression | Temat e-maila |
| `emailBody` | expression | Treść e-maila |
| `attachments` | expression | Rozdzielone przecinkami identyfikatory plików z [Drive](./drive-node.md) do załączenia. Załączyć można wyłącznie pliki należące do właściciela workflow lub udostępnione jednemu z jego zespołów. |

## Załączniki

Aby załączyć pliki z [Drive](./drive-node.md), należy przekazać jeden lub więcej identyfikatorów plików Drive
do pola `attachments`. Należy użyć wyrażenia `$`, aby odwołać się do wyjścia `id` węzła Drive znajdującego się wyżej w workflow
(na przykład `$drive.id`), albo podać statyczne identyfikatory rozdzielone przecinkami. Każdy identyfikator jest
rozwiązywany w zakresie właściciela workflow; nieprawidłowy lub niedostępny identyfikator powoduje błąd węzła
zamiast wysłania częściowego e-maila.

## Konfiguracja

Należy dodać dane logowania SMTP wraz z serwerem, portem, adresem e-mail i hasłem. Widocznym nadawcą jest opcjonalne pole **From** w danych logowania; puste pole From powoduje wysyłkę jako nazwa użytkownika. Popularne serwery SMTP:

- Gmail: `smtp.gmail.com`, port 587 (wymagane hasło aplikacji)
- Outlook: `smtp.office365.com`, port 587

## Przykład

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Wartość `attachments` powyżej odwołuje się do węzła [Drive](./drive-node.md) znajdującego się wyżej w workflow,
oznaczonego etykietą `drive`, i załącza plik przez niego utworzony.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Error Handler](./error-handler-node.md) – Wysyłanie e-maila w przypadku błędu
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania SMTP
- [Integracje zewnętrzne](../reference/integrations.md#smtp-email) – Konfiguracja dostawców SMTP (Gmail, Outlook, Mailgun, SendGrid)
