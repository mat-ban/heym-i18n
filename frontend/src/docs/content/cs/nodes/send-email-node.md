# Odeslání e-mailu

Uzel **Odeslání e-mailu** odesílá e-maily prostřednictvím SMTP. Použijte jej pro oznámení, výstrahy a transakční e-maily.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP přihlašovací údaje z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `to` | expression | Příjemce/příjemci. Pro více příjemců oddělte čárkou. |
| `cc` | expression | Příjemce/příjemci v kopii. Pro více příjemců oddělte čárkou. |
| `bcc` | expression | Příjemce/příjemci v skryté kopii. Pro více příjemců oddělte čárkou. Skryté před ostatními příjemci. |
| `subject` | expression | Předmět e-mailu |
| `emailBody` | expression | Obsah těla e-mailu |
| `attachments` | expression | ID souborů z [Drive](./drive-node.md) oddělená čárkou, která mají být přiložena. Přiložit lze pouze soubory vlastněné vlastníkem workflow nebo sdílené s jedním z jeho týmů. |

## Přílohy

Přiložte soubory ze svého [Drive](./drive-node.md) předáním jednoho nebo více ID souborů z Drive do pole `attachments`.
Použijte výraz `$` pro odkaz na výstup `id` předchozího uzlu Drive (například `$drive.id`),
nebo uveďte statická ID oddělená čárkami. Každé ID je vyhodnoceno v rozsahu vlastníka workflow; neplatné nebo
nepřístupné ID způsobí selhání uzlu namísto odeslání částečného e-mailu.

## Nastavení

Přidejte SMTP přihlašovací údaje se serverem, portem, e-mailem a heslem. Viditelným odesílatelem je volitelné pole **From** v přihlašovacích údajích; prázdné pole From odešle zprávu pod uživatelským jménem. Běžné SMTP servery:

- Gmail: `smtp.gmail.com`, port 587 (vyžadováno App Password)
- Outlook: `smtp.office365.com`, port 587

## Příklad

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

Hodnota `attachments` výše odkazuje na předchozí uzel [Drive](./drive-node.md) označený `drive`,
a přikládá soubor, který vytvořil.

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Error Handler](./error-handler-node.md) – Odeslání e-mailu při selhání
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání SMTP přihlašovacích údajů
- [Integrace třetích stran](../reference/integrations.md#smtp-email) – Nastavení SMTP poskytovatele (Gmail, Outlook, Mailgun, SendGrid)
