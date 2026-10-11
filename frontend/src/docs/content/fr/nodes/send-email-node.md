# Envoyer un Email

Le nœud **Envoyer un Email** envoie des emails via SMTP. Utilisez-le pour les notifications, les alertes et les emails transactionnels.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant SMTP depuis [Identifiants](../tabs/credentials-tab.md) |
| `to` | expression | Destinataire(s). Séparés par des virgules pour plusieurs destinataires. |
| `cc` | expression | Destinataire(s) en copie carbone. Séparés par des virgules pour plusieurs destinataires. |
| `bcc` | expression | Destinataire(s) en copie carbone invisible. Séparés par des virgules pour plusieurs destinataires. Masqués aux autres destinataires. |
| `subject` | expression | Objet de l'email |
| `emailBody` | expression | Contenu du corps de l'email |
| `attachments` | expression | IDs de fichiers [Drive](./drive-node.md) séparés par des virgules à joindre. Seuls les fichiers appartenant au propriétaire du workflow ou partagés avec l'une de ses équipes peuvent être joints. |

## Pièces jointes

Joignez des fichiers depuis votre [Drive](./drive-node.md) en transmettant un ou plusieurs IDs de fichiers Drive au champ `attachments`. Utilisez une expression `$` pour référencer la sortie `id` d'un nœud Drive en amont (par exemple `$drive.id`), ou listez des IDs statiques séparés par des virgules. Chaque ID est résolu dans le périmètre du propriétaire du workflow ; un ID invalide ou inaccessible fait échouer le nœud plutôt que d'envoyer un email partiel.

## Configuration

Ajoutez un identifiant SMTP avec le serveur, le port, l'email et le mot de passe. Serveurs SMTP courants :

- Gmail : `smtp.gmail.com`, port 587 (mot de passe d'application requis)
- Outlook : `smtp.office365.com`, port 587

## Exemple

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

La valeur `attachments` ci-dessus référence un nœud [Drive](./drive-node.md) en amont étiqueté `drive`, joignant le fichier qu'il a produit.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Gestionnaire d'erreurs](./error-handler-node.md) – Envoyer un email en cas d'échec
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des identifiants SMTP
- [Intégrations tierces](../reference/integrations.md#smtp-email) – Configuration des fournisseurs SMTP (Gmail, Outlook, Mailgun, SendGrid)
