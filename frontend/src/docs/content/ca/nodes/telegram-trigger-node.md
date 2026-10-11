# Trigger de Telegram

El node **Trigger de Telegram** és un punt d'entrada sense entrades que inicia un workflow quan el vostre bot de Telegram rep una actualització de webhook. Utilitzeu-lo per a chatbots, triatge de suport, comandes tipus slash o callbacks de botons en línia que s'hagin de ramificar cap a nodes d'IA i d'integració posteriors.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `telegram` que conté el token del bot i, opcionalment, el token secret del webhook |

## Guia de configuració

### 1. Creeu una credencial `telegram`

1. Aneu a **Settings → Credentials → New Credential**
2. Seleccioneu el tipus **Telegram Bot**
3. Enganxeu el **Bot Token** de BotFather
4. Opcionalment, establiu un **Webhook Secret Token** si voleu que Telegram enviï una capçalera de verificació coincident
5. Deseu la credencial

### 2. Afegiu el node al vostre workflow

1. Arrossegueu **Trigger de Telegram** al canvas
2. Seleccioneu el node per obrir el tauler de propietats
3. Trieu la vostra credencial `telegram`
4. Copieu la **Webhook URL** que es mostra al tauler del node

### 3. Registreu el webhook a Telegram

Utilitzeu el mètode `setWebhook` de la Bot API amb l'URL del node:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Si heu configurat un token secret a Heym, envieu el mateix valor en establir el webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Camps de sortida

Un cop el node s'activa, els nodes posteriors poden accedir a:

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.update` | Payload complet de l'actualització de Telegram |
| `$nodeLabel.message` | Objecte principal tipus missatge de l'actualització |
| `$nodeLabel.message.text` | Text del missatge entrant |
| `$nodeLabel.message.chat.id` | ID del xat per respondre des dels nodes posteriors |
| `$nodeLabel.message.from.id` | ID d'usuari de Telegram |
| `$nodeLabel.callback_query` | Payload del callback quan l'actualització prové d'un teclat en línia |
| `$nodeLabel.headers` | Capçaleres del webhook saneades |
| `$nodeLabel.triggered_by` | Etiqueta d'origen del trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID del node del canvas que ha rebut l'actualització de Telegram |
| `$nodeLabel.triggered_at` | Marca de temps ISO per a aquesta execució del workflow |

## Workflow d'exemple

**Missatge de Telegram → LLM → resposta de Telegram**

```
telegramTrigger → llm → telegram
```

- Etiqueta del **Trigger de Telegram**: `telegramEvent`
- Missatge d'usuari de l'**LLM**: `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId de **Telegram**: `$telegramEvent.message.chat.id`

## Seguretat

- Si la vostra credencial té un `secret_token`, Heym verifica `x-telegram-bot-api-secret-token` abans d'executar el workflow.
- Les capçaleres de sol·licitud sensibles s'eliminen abans que el payload arribi als nodes posteriors.
- L'URL del webhook és estàtica per a l'ID del node, de manera que només cal tornar-lo a registrar quan el node mateix canvia.

## Relacionat

- [Node de Telegram](./telegram-node.md) – Enviar una resposta o notificació de sortida
- [Triggers](../reference/triggers.md) – Visió general de tots els punts d'entrada del workflow
- [Integracions de tercers](../reference/integrations.md) – Configuració de la credencial de Telegram
- [Pestanya de credencials](../tabs/credentials-tab.md) – Afegir i gestionar credencials `telegram`