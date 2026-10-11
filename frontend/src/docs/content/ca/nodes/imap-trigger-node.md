# Trigger IMAP

El node **Trigger IMAP** consulta una bústia de correu electrònic a intervals fixos i inicia un workflow una vegada per cada missatge nou detectat. És un node trigger sense entrades, dissenyat per a l'automatització de correu electrònic entrant, com ara la classificació de sol·licituds de suport, la supervisió de bústies compartides i les bústies d'aprovació.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `imap` que conté el servidor, l'inici de sessió, la bústia i la configuració SSL |
| `pollIntervalMinutes` | Enter | Freqüència amb què Heym comprova la bústia per detectar correu nou |

## Guia de configuració

### 1. Creeu una credencial `imap`

1. Aneu a **Settings → Credentials → New Credential**
2. Seleccioneu el tipus **IMAP Email Inbox**
3. Introduïu:
   - **IMAP Host** (per exemple, `imap.gmail.com`)
   - **IMAP Port** (`993` per a SSL/TLS a la majoria de proveïdors)
   - **Username / Email**
   - **Password / App Password**
   - **Mailbox** opcional (per defecte: `INBOX`)
4. Deixeu **Use SSL / TLS** activat tret que el vostre servidor de correu requereixi explícitament IMAP sense SSL
5. Deseu la credencial

### 2. Afegiu el node al vostre workflow

1. Arrossegueu **IMAP Trigger** al canvas
2. Seleccioneu el node per obrir el tauler de propietats
3. Trieu la vostra credencial `imap`
4. Establiu **Poll Interval (Minutes)** amb un valor enter com ara `1`, `5` o `15`

## Semàntica del trigger

- La primera consulta estableix una línia de base del contingut actual de la bústia i **no** reprodueix correu anterior.
- Les consultes posteriors s'activen una vegada per cada missatge el UID IMAP del qual sigui més recent que el cursor desat.
- Si el `UIDVALIDITY` de la bústia canvia, Heym restableix el cursor i torna a establir la línia de base per evitar el processament duplicat.
- Cada correu nou inicia una execució de workflow independent amb `trigger_source = "imap"`.

## Camps de sortida

Un cop el node s'activa, els nodes posteriors poden accedir a:

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.email` | Payload complet del correu analitzat |
| `$nodeLabel.email.subject` | Assumpte descodificat |
| `$nodeLabel.email.from` | Capçalera `From` en brut |
| `$nodeLabel.email.fromAddresses` | Llista de remitents analitzada |
| `$nodeLabel.email.toAddresses` | Llista de destinataris analitzada |
| `$nodeLabel.email.ccAddresses` | Llista de CC analitzada |
| `$nodeLabel.email.replyToAddresses` | Llista de reply-to analitzada |
| `$nodeLabel.email.text` | Cos en text pla |
| `$nodeLabel.email.html` | Cos HTML |
| `$nodeLabel.email.attachments` | Matriu de metadades dels adjunts (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Objecte de capçaleres descodificat |
| `$nodeLabel.email.uid` | UID IMAP per a la deduplicació o el registre |
| `$nodeLabel.triggered_by` | Etiqueta d'origen del trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID del node del canvas que ha detectat el correu |
| `$nodeLabel.triggered_at` | Marca de temps ISO per a l'execució del workflow |

## Workflow d'exemple

**Correu de suport entrant → resum → encaminament**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Etiqueta del **IMAP Trigger**: `supportInbox`
- Missatge d'usuari del **LLM**: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Notes

- Molts proveïdors requereixen una **contrasenya d'aplicació** per a l'accés IMAP en lloc de la contrasenya del compte principal.
- El contingut dels adjunts no s'injecta a l'entrada del workflow; només s'inclouen les metadades dels adjunts.
- Utilitzeu [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) o [DataTable](./datatable-node.md) aigües avall per encaminar o registrar el correu nou.

## Relacionat

- [Triggers](../reference/triggers.md) – Visió general de tots els punts d'entrada del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuració de la credencial IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Afegiu i gestioneu credencials `imap`
- [Send Email](./send-email-node.md) – Responeu o reenvieu missatges entrants