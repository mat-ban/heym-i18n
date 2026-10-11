# Discord

El node **Discord** envia un missatge a un canal de Discord mitjançant un Incoming Webhook. Utilitzeu-lo per a alertes, notificacions de workflow, respostes tipus bot i informes d'errors.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `discord` que conté la URL del webhook entrant |
| `message` | expressió | Text del missatge de sortida. Admet [expressions](../reference/expression-dsl.md). |
| `username` | expressió | Nom visible opcional que substitueix el predeterminat per a aquest missatge |
| `avatarUrl` | expressió | URL d'avatar opcional que substitueix la predeterminada per a aquest missatge |

## Configuració

1. Creeu una [credencial de Discord Webhook](../reference/integrations.md#discord)
2. Afegiu el node **Discord** al vostre workflow
3. Seleccioneu la credencial
4. Definiu `message` amb el text de sortida o una plantilla construïda a partir de dades provinents de nodes anteriors
5. Opcionalment, substituïu el `username` visible i l'`avatarUrl`

## Exemple

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Camps de sortida

| Expressió | Descripció |
|------------|-------------|
| `$nodeLabel.status` | Codi d'estat HTTP retornat per Discord, normalment `204` en cas d'èxit |
| `$nodeLabel.response` | Cos de la resposta en brut retornat pel webhook de Discord |
| `$nodeLabel.message` | Text del missatge que Heym ha enviat |
| `$nodeLabel.username` | Nom d'usuari enviat amb el webhook, si s'ha proporcionat |
| `$nodeLabel.avatar_url` | URL de l'avatar enviat amb el webhook, si s'ha proporcionat |

## Patrons habituals

- Utilitzeu-lo conjuntament amb [Discord Trigger](./discord-trigger-node.md) quan vulgueu una publicació addicional al canal més enllà de la resposta a la interacció
- Envieu avisos de fallada des de [Error Handler](./error-handler-node.md)
- Publiqueu resums generats per [LLM](./llm-node.md) o [Agent](./agent-node.md)

## Seguretat de sortida

- La URL del webhook emmagatzemada a la credencial ha d'utilitzar `http://` o `https://` i resoldre's únicament a adreces públiques. Les destinacions de loopback, privades, link-local, multicast i de metadades del núvol estan bloquejades.
- Heym valida les adreces resoltes i fixa l'objectiu de la connexió abans d'enviar, de manera que una resposta DNS no pot redirigir la petició cap a una adreça interna després de la comprovació. Els proxys d'entorn es desactiven mentre la protecció està activa i no se segueixen redireccions.
- Els desplegaments que publiquen cap a un receptor de webhook intern poden establir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` en una instància autoallotjada de confiança. Manteniu el valor predeterminat en desplegaments allotjats o multi-tenant.

**Nota d'actualització per a la v0.0.109:** aquesta comprovació és nova per a Discord. Una credencial la URL del webhook de la qual apunti a loopback o a una adreça privada serà rebutjada tret que el paràmetre anterior estigui habilitat.

## Relacionat

- [Discord Trigger](./discord-trigger-node.md) – Inicia un workflow a partir d'interaccions entrants de Discord
- [Third-Party Integrations](../reference/integrations.md) – Configuració de la credencial de Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Afegiu i gestioneu credencials `discord`
- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node