# Slack

El node **Slack** envia un missatge a un canal de Slack mitjançant un Incoming Webhook. Utilitzeu-lo per a notificacions, alertes i informes d'errors.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | Passa l'entrada |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Slack (URL del webhook) des de [Credencials](../tabs/credentials-tab.md) |
| `message` | expressió | Text del missatge. Admet [expressions](../reference/expression-dsl.md). |

## Configuració

1. Creeu un Incoming Webhook al vostre espai de treball de Slack
2. Afegiu una credencial de Slack a la pestanya Credencials amb l'URL del webhook
3. Referencieu la credencial al node

## Exemple

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Utilitzeu-lo amb [Error Handler](./error-handler-node.md) per a notificacions de fallada:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Seguretat de sortida

- L'URL del webhook emmagatzemat a la credencial ha d'utilitzar `http://` o `https://` i resoldre's únicament a adreces públiques. Les destinacions de loopback, privades, link-local, multicast i de metadades del núvol estan bloquejades.
- Heym valida les adreces resoltes i fixa l'objectiu de connexió abans d'enviar, de manera que una resposta DNS no pot desplaçar la sol·licitud cap a una adreça interna després de la comprovació. Els proxys de l'entorn es desactiven mentre la protecció és activa, i no se segueixen redireccions.
- Els desplegaments que publiquen en un receptor de webhook intern poden establir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` en una instància autoallotjada de confiança. Manteniu el valor per defecte en desplegaments allotjats o multi-tenant.

**Nota d'actualització per a la v0.0.109:** aquesta comprovació és nova per a Slack. Una credencial l'URL del webhook de la qual apunti a loopback o a una adreça privada serà rebutjada tret que el paràmetre anterior estigui habilitat.

## Relacionat

- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Error Handler](./error-handler-node.md) – Enviar Slack en cas de fallada del workflow
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegir un webhook de Slack