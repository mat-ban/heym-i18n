# IMAP Trigger

Le nœud **IMAP Trigger** interroge une boîte de réception email à intervalle fixe et démarre un workflow une fois pour chaque nouveau message détecté. Il s'agit d'un nœud Trigger sans entrée, conçu pour l'automatisation des emails entrants tels que le triage du support, la surveillance des boîtes partagées et les boîtes d'approbation.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant `imap` contenant le serveur, le login, la boîte aux lettres et les paramètres SSL |
| `pollIntervalMinutes` | Integer | Fréquence à laquelle Heym vérifie la boîte aux lettres pour les nouveaux emails |

## Guide de configuration

### 1. Créer un identifiant `imap`

1. Accédez à **Settings → Credentials → New Credential**
2. Sélectionnez le type **IMAP Email Inbox**
3. Saisissez :
   - **IMAP Host** (par exemple `imap.gmail.com`)
   - **IMAP Port** (`993` pour SSL/TLS chez la plupart des fournisseurs)
   - **Username / Email**
   - **Password / App Password**
   - **Mailbox** facultatif (par défaut : `INBOX`)
4. Laissez **Use SSL / TLS** activé, sauf si votre serveur de messagerie exige explicitement un IMAP sans SSL
5. Enregistrez l'identifiant

### 2. Ajouter le nœud à votre workflow

1. Faites glisser **IMAP Trigger** sur le canvas
2. Sélectionnez le nœud pour ouvrir le panneau Properties
3. Choisissez votre identifiant `imap`
4. Définissez **Poll Interval (Minutes)** avec une valeur entière telle que `1`, `5` ou `15`

## Sémantique du Trigger

- Le premier poll établit une référence du contenu actuel de la boîte aux lettres et ne rejoue **pas** les emails plus anciens.
- Les polls suivants déclenchent une fois par message dont l'UID IMAP est plus récent que le curseur enregistré.
- Si le `UIDVALIDITY` de la boîte aux lettres change, Heym réinitialise le curseur et établit une nouvelle référence afin d'éviter tout traitement en double.
- Chaque nouvel email démarre une exécution de workflow distincte avec `trigger_source = "imap"`.

## Champs de sortie

Une fois le nœud déclenché, les nœuds en aval peuvent accéder à :

| Expression | Description |
|------------|-------------|
| `$nodeLabel.email` | Payload email complet analysé |
| `$nodeLabel.email.subject` | Objet décodé |
| `$nodeLabel.email.from` | En-tête `From` brut |
| `$nodeLabel.email.fromAddresses` | Liste des expéditeurs analysée |
| `$nodeLabel.email.toAddresses` | Liste des destinataires analysée |
| `$nodeLabel.email.ccAddresses` | Liste CC analysée |
| `$nodeLabel.email.replyToAddresses` | Liste reply-to analysée |
| `$nodeLabel.email.text` | Corps en texte brut |
| `$nodeLabel.email.html` | Corps HTML |
| `$nodeLabel.email.attachments` | Tableau des métadonnées de pièces jointes (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Objet d'en-têtes décodé |
| `$nodeLabel.email.uid` | UID IMAP pour la déduplication ou la journalisation |
| `$nodeLabel.triggered_by` | Libellé de la source du Trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID du nœud du canvas ayant détecté l'email |
| `$nodeLabel.triggered_at` | Horodatage ISO de l'exécution du workflow |

## Exemple de workflow

**Email de support entrant → résumé → routage**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Libellé **IMAP Trigger** : `supportInbox`
- Message utilisateur **LLM** : `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition** : `$supportInbox.email.subject.lower().contains("urgent")`

## Remarques

- De nombreux fournisseurs exigent un **app password** pour l'accès IMAP plutôt que le mot de passe de votre compte principal.
- Le contenu des pièces jointes n'est pas injecté dans l'entrée du workflow ; seules les métadonnées des pièces jointes sont incluses.
- Utilisez [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) ou [DataTable](./datatable-node.md) en aval pour router ou journaliser les nouveaux emails.

## Voir aussi

- [Triggers](../reference/triggers.md) – Aperçu de tous les points d'entrée de workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuration des identifiants IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Ajouter et gérer les identifiants `imap`
- [Send Email](./send-email-node.md) – Répondre ou transférer les messages entrants
