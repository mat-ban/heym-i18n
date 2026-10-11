# Telegram

El node **Telegram** envia un missatge a través de la Telegram Bot API. Utilitzeu-lo per a respostes de Chat, alertes operatives, actualitzacions d'estat del Workflow o qualsevol pas posterior que hagi d'enviar un missatge a un usuari, grup o canal de Telegram.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `telegram` que conté el token del bot |
| `chatId` | expressió | ID del Chat, grup o canal de destinació |
| `message` | expressió | Text del missatge de sortida. Admet [expressions](../reference/expression-dsl.md). |

## Configuració

1. Creeu una [credencial de Telegram Bot](../reference/integrations.md#telegram)
2. Afegiu el node **Telegram** al vostre Workflow
3. Seleccioneu la credencial
4. Establiu `chatId` a un ID de Chat estàtic o a una expressió com ara `$telegramEvent.message.chat.id`
5. Establiu `message` al text de sortida o a una Plantilla construïda a partir de dades dels nodes anteriors

## Exemple

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

## Camps de sortida

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` en cas d'èxit |
| `$nodeLabel.ok` | Indicador d'èxit de la Telegram API |
| `$nodeLabel.result` | Objecte de resultat `sendMessage` en brut retornat per Telegram |
| `$nodeLabel.result.message_id` | ID del missatge de Telegram |
| `$nodeLabel.result.chat.id` | ID del Chat de destinació retornat per Telegram |

## Patrons habituals

- Combineu-lo amb [Telegram Trigger](./telegram-trigger-node.md) per a bots conversacionals
- Envieu avisos d'error des del [Error Handler](./error-handler-node.md)
- Publiqueu resums generats per [LLM](./llm-node.md) o [Agent](./agent-node.md)

## Relacionat

- [Telegram Trigger](./telegram-trigger-node.md) – Inicieu un Workflow a partir de missatges entrants del bot
- [Third-Party Integrations](../reference/integrations.md) – Configuració de la credencial de Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Afegiu i gestioneu credencials `telegram`
- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node