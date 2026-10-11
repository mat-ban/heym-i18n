# Trigger de Slack

El node **Slack Trigger** és un punt d'entrada sense entrades que rep webhooks de l'API Slack Events i inicia un workflow automàticament. Gestiona el desafiament de verificació d'URL de Slack i verifica les signatures de les sol·licituds amb un signing secret.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `slack_trigger` que conté el signing secret |

## Guia de configuració

### 1. Creeu una credencial `slack_trigger`

1. Aneu a **Settings → Credentials → New Credential**
2. Seleccioneu el tipus **Slack Trigger (Signing Secret)**
3. Enganxeu el **Signing Secret** de la vostra aplicació de Slack:
   - A Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Deseu la credencial

### 2. Afegiu el node al vostre workflow

1. Obriu el canvas del workflow
2. Arrossegueu **Slack Trigger** des del panell de nodes fins al canvas
3. Feu clic al node per obrir el panell de propietats
4. Seleccioneu la vostra credencial `slack_trigger`
5. Copieu la **Webhook URL** que es mostra al panell

### 3. Configureu la vostra aplicació de Slack

1. A la configuració de la vostra aplicació de Slack, aneu a **Event Subscriptions**
2. Activeu **Enable Events**
3. Enganxeu la Webhook URL al camp **Request URL**
4. Slack envia un desafiament de verificació d'URL — Heym respon automàticament en mil·lisegons
5. El camp es torna verd: ✓ Verified
6. Subscriviu-vos als **Bot Events** que necessiteu (per exemple, `message.channels`, `reaction_added`)
7. Deseu els canvis i reinstal·leu l'aplicació al vostre espai de treball si se us sol·licita

## Camps de sortida

Un cop el node s'activa, els nodes posteriors poden accedir a:

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.event` | Objecte complet de l'esdeveniment de Slack |
| `$nodeLabel.event.type` | Tipus d'esdeveniment (per exemple, `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Text del missatge (quan correspongui) |
| `$nodeLabel.event.user` | ID d'usuari de Slack que ha activat l'esdeveniment |
| `$nodeLabel.event.channel` | ID del canal |
| `$nodeLabel.event.ts` | Marca de temps de l'esdeveniment |
| `$nodeLabel.headers` | Capçaleres HTTP sanejades de Slack |
| `$nodeLabel.triggered_by` | Etiqueta d'origen del trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID del node del canvas que ha rebut l'esdeveniment de Slack |

## Workflow d'exemple

**Missatge de Slack → resposta del LLM → enviament a Slack:**

```
slackTrigger → llm → slack
```

- Etiqueta de **slackTrigger**: `slackEvent`
- Missatge d'usuari del **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Missatge de **Slack**: `$llm.text`

## Seguretat

- Les sol·licituds es verifiquen mitjançant **HMAC-SHA256** amb el vostre signing secret
- Es rebutgen les marques de temps anteriors a **5 minuts** (prevenció d'atacs de repetició)
- Les capçaleres sensibles (`x-slack-signature`, `authorization`, etc.) s'eliminen abans d'arribar als nodes posteriors
- Si no s'ha configurat cap credencial, el node s'executa sense verificació — només recomanat per a proves locals

## Notes

- Heym respon amb `200 OK` immediatament i executa el workflow en segon pla — això compleix el requisit de resposta de 3 segons de Slack
- La webhook URL es deriva de l'ID del node i mai canvia, fins i tot després de canviar el nom del workflow
- Només cal un node `slackTrigger` per workflow; utilitzeu nodes **Switch** o **Condition** posteriors per encaminar diferents tipus d'esdeveniments