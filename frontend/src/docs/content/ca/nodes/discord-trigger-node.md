# Trigger de Discord

El node **Trigger de Discord** és un punt d'entrada sense entrades que rep webhooks de l'API d'Interaccions de Discord i inicia un workflow automàticament. Utilitzeu-lo per a slash commands, botons, modals i altres interaccions d'aplicacions de Discord que hagin de fluir cap a nodes d'IA o d'integració posteriors.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `discord_trigger` que conté la clau pública de l'aplicació de Discord |

## Guia de configuració

### 1. Creeu una credencial `discord_trigger`

1. Aneu a **Settings → Credentials → New Credential**
2. Seleccioneu el tipus **Discord Trigger (Public Key)**
3. Enganxeu la **Application Public Key** del Portal de Desenvolupadors de Discord:
   - **Your application → General Information → Public Key**
4. Deseu la credencial

### 2. Afegiu el node al vostre workflow

1. Arrossegueu **Trigger de Discord** al canvas
2. Seleccioneu el node per obrir el panell de Propietats
3. Trieu la vostra credencial `discord_trigger`
4. Copieu la **Interactions URL** que es mostra al panell del node

### 3. Registreu l'endpoint d'Interaccions a Discord

1. Obriu el [Portal de Desenvolupadors de Discord](https://discord.com/developers/applications)
2. Seleccioneu la vostra aplicació
3. Aneu a **General Information** o **Interactions**
4. Enganxeu la **Interactions Endpoint URL** del node al camp de l'endpoint
5. Discord envia una petició `PING` per validar l'endpoint i Heym respon automàticament després de verificar la signatura
6. Deseu els canvis

## Camps de sortida

Un cop el node s'activa, els nodes posteriors poden accedir a:

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.interaction` | Payload complet de la interacció de Discord |
| `$nodeLabel.type` | Tipus d'interacció |
| `$nodeLabel.data` | Payload del command, botó o modal |
| `$nodeLabel.data.name` | Nom del slash command, quan sigui aplicable |
| `$nodeLabel.data.options` | Array d'opcions del slash command |
| `$nodeLabel.headers` | Capçaleres del webhook saneades |
| `$nodeLabel.triggered_by` | Etiqueta d'origen del trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID del node del canvas que ha rebut la interacció de Discord |
| `$nodeLabel.triggered_at` | Marca de temps ISO per a aquesta execució del workflow |

## Workflow d'exemple

**Slash command de Discord → LLM → Output**

```
discordTrigger → llm → output
```

- Etiqueta del **Trigger de Discord**: `discordEvent`
- Missatge d'usuari de l'**LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Missatge de l'**Output**: `$llm.text`

## Seguretat

- Les peticions es verifiquen mitjançant **Ed25519** amb la clau pública de la vostra aplicació
- Es rebutgen les marques de temps anteriors a **5 minuts** per reduir els atacs de repetició
- Les capçaleres sensibles (`x-signature-ed25519`, `authorization`, etc.) s'eliminen abans que les dades arribin als nodes posteriors
- El trigger requereix una credencial `discord_trigger` vàlida; les peticions es rebutgen si la credencial falta o no és vàlida

## Notes

- Heym retorna immediatament una resposta diferida de Discord, executa el workflow en segon pla i publica la sortida final del workflow com a follow-up de Discord quan un node `Output` produeix contingut
- La URL d'interaccions es deriva de l'ID del node i es manté estable encara que el workflow es canviï de nom
- Utilitzeu un [Node de Discord](./discord-node.md) normal només quan també vulgueu una publicació de webhook separada a més del follow-up de la interacció
- Un node `discordTrigger` normalment és suficient; utilitzeu **Switch** o **Condition** aigües avall per encaminar diferents tipus d'interacció

## Relacionat

- [Node de Discord](./discord-node.md) – Enviar missatges sortints de Discord
- [Triggers](../reference/triggers.md) – Visió general de tots els punts d'entrada del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuració de la credencial de Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Afegir i gestionar credencials `discord_trigger`