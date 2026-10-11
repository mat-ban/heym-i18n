# Telegram

Nodul **Telegram** trimite un mesaj prin Telegram Bot API. Utilizați-l pentru răspunsuri în chat, alerte operaționale, actualizări de stare a workflow-ului sau orice pas ulterior care trebuie să trimită un mesaj unui utilizator, grup sau canal Telegram.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditarea `telegram` care conține token-ul botului |
| `chatId` | expresie | ID-ul chat-ului, grupului sau canalului destinație |
| `message` | expresie | Textul mesajului de ieșire. Suportă [expresii](../reference/expression-dsl.md). |

## Configurare

1. Creați o [acreditare Telegram Bot](../reference/integrations.md#telegram)
2. Adăugați nodul **Telegram** în workflow-ul dvs.
3. Selectați acreditarea
4. Setați `chatId` la un ID de chat static sau la o expresie precum `$telegramEvent.message.chat.id`
5. Setați `message` la textul de ieșire sau la un șablon construit din datele anterioare

## Exemplu

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Câmpuri de ieșire

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` în caz de succes |
| `$nodeLabel.ok` | Indicatorul de succes al Telegram API |
| `$nodeLabel.result` | Obiectul brut `sendMessage` returnat de Telegram |
| `$nodeLabel.result.message_id` | ID-ul mesajului Telegram |
| `$nodeLabel.result.chat.id` | ID-ul chat-ului destinație returnat de Telegram |

## Modele comune

- Asociați-l cu [Telegram Trigger](./telegram-trigger-node.md) pentru boți conversaționali
- Trimiteți notificări de eroare din [Error Handler](./error-handler-node.md)
- Publicați rezumate generate de [LLM](./llm-node.md) sau [Agent](./agent-node.md)

## Resurse conexe

- [Telegram Trigger](./telegram-trigger-node.md) – Porniți un workflow din mesajele primite de bot
- [Third-Party Integrations](../reference/integrations.md) – Configurarea acreditării Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Adăugați și gestionați acreditările `telegram`
- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
