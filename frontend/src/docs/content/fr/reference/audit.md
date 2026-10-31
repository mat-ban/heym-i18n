# Journalisation d'audit

Heym écrit une ligne d'audit pour chaque action liée à la sécurité : qui l'a effectuée, sur quoi elle a porté et si elle a réussi. Les lignes sont envoyées vers la sortie standard du backend via le logger `winston.audit`, aux côtés du journal d'accès aux requêtes, et peuvent être consultées depuis l'onglet **Logs** ou avec `docker logs`.

La journalisation d'audit est **toujours active**. Il n'y a rien à activer et aucune variable d'environnement à définir.

## Format des lignes

Une action produit exactement une ligne autonome :

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Chaque ligne comporte les champs suivants :

| Champ | Description |
|-------|-------------|
| `action` | Ce qui s'est produit, sous la forme `resource.verb` — voir le tableau ci-dessous. |
| `outcome` | `success`, `failure` ou `denied`. |
| `actor_id` | UUID de l'utilisateur ayant effectué l'action. Absent uniquement lorsqu'aucun utilisateur n'était authentifié. |
| `actor_email` | Adresse e-mail de cet utilisateur. En cas d'échec de connexion, il s'agit de l'adresse essayée, et non d'un compte confirmé. |
| `target` | L'objet concerné, sous la forme `type:uuid`. |
| `target_name` | Nom lisible de cet objet, entre guillemets lorsqu'il contient des espaces. |

Des champs spécifiques à l'action suivent — par exemple `credential_type`, `imported`, `grantee_email`, `team_name`. Les valeurs contenant un espace, un guillemet ou un `=` sont mises entre guillemets ; les valeurs dépassant 256 caractères sont tronquées avec un marqueur `...(truncated)`.

## Lecture du journal

Le logger d'audit est un enfant du logger de requêtes : les deux atteignent donc le même flux tout en restant séparables :

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Dans l'application, l'onglet **Logs** lit la même sortie du conteneur. Il est conditionné par `DOCKER_LOGS_ENABLED` et par la liste d'autorisation `DOCKER_LOGS_ALLOWED_EMAILS`.

## Ce qui est journalisé

Chaque changement d'état est journalisé. Les lectures ne sont journalisées que lorsque la lecture constitue elle-même l'acte sensible — consulter l'historique d'exécution d'un workflow, ouvrir un identifiant, télécharger un fichier. Les lectures ordinaires de listes et de détails ne sont pas auditées ; le journal d'accès enregistre déjà qu'une requête a eu lieu, et auditer chaque `GET` noierait les lignes qui comptent. La seule exception concerne les [affichages de page](#page-views), qui enregistrent les déplacements d'un utilisateur connecté dans l'application.

### Authentification

| Action | Remarques |
|--------|-----------|
| `auth.register` | `outcome=denied` lorsque l'inscription est désactivée ou lorsque la connexion par mot de passe est désactivée (`reason=password_login_disabled`), `failure` lorsque l'adresse e-mail est déjà prise. |
| `auth.login` | `outcome=failure` enregistre l'adresse essayée et précise si l'e-mail était inconnu ou si le mot de passe était erroné. |
| `auth.logout` | L'acteur est résolu à partir du cookie de rafraîchissement ; une déconnexion sans ce cookie est donc journalisée sans identité. |
| `auth.token_refresh` | `outcome=denied` avec `reason=refresh_token_replayed_or_revoked` — un signal de vol de token qui mérite une alerte. |
| `auth.password_change` | `outcome=failure` lorsque le mot de passe actuel était erroné. |
| `auth.sso_login` | Authentification unique. `outcome=failure` porte la raison du rejet de la réponse du fournisseur ; `denied` porte `email_not_verified`, `domain_not_allowed` ou `provisioning_disabled`. |
| `sso_settings.update` | Un administrateur a modifié la configuration [SSO](./sso.md). Enregistre `enabled` et `password_login_disabled`, jamais le client secret. |
| `sso_settings.test` | Un administrateur a lancé le test de connexion SSO. |

### Affichages de page

`page.view` est consigné chaque fois qu'un utilisateur connecté ouvre une page dans l'application web, avec le chemin d'URL dans un champ `path` :

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Le chemin correspond à la route interne de l'application. Les onglets du tableau de bord en font partie (`/?tab=traces`), tout comme les identifiants désignant l'élément ouvert, tel que `/workflows/<id>`. Seule une sélection restreinte de paramètres de requête identifiant la page est conservée (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`) ; tout le reste de la chaîne de requête et l'intégralité du fragment sont ignorés. Les pages dont le lien transporte un secret, comme `/review/<token>`, sont enregistrées avec l'espace réservé `:token` à la place du secret.

Le navigateur signalant le chemin, une ligne `page.view` reflète la destination déclarée par l'utilisateur. Elle ne prouve pas que le serveur a renvoyé cette page. Les visites de la page de connexion et les liens ouverts en étant déconnecté ne sont pas enregistrés, car aucun utilisateur n'y est associé.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` est consigné lorsqu'une exécution est lancée via l'API : le bouton Exécuter de l'éditeur, l'endpoint d'exécution avec une session, une clé API ou un webhook, le portail de chat et les outils MCP. Il enregistre qui l'a lancée, comment, et comment elle s'est terminée :

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` relie la ligne à l'exécution dans l'historique d'exécution. `outcome` est `failure` lorsque l'exécution s'est terminée par `error`, `cancelled` ou `timeout`. Une exécution en attente de révision humaine ou retenue dans la file de concurrence est une ligne `success` avec `status=pending` ou `status=queued`. Un appel sans utilisateur connecté, tel qu'un webhook anonyme ou un visiteur de portail, ne comporte ni `actor_id` ni `actor_email`. Les entrées et les sorties ne sont jamais consignées.

Les exécutions déclenchées par un planning, un nœud trigger, une file ou un événement ne constituent pas des lignes d'audit. Elles s'exécutent sur l'instance qui les a prises en charge et sont enregistrées dans l'historique d'exécution avec leur source de déclenchement et l'instance d'exécution.

`workflow.history_view` est consigné lorsque quelqu'un ouvre l'historique d'exécution d'un workflow. La consultation ponctuelle affichant la dernière exécution sur le canevas ou dans une liste n'est pas auditée.


`workflow.history_view` enregistre `owned=false` lorsqu'un collaborateur consulte l'historique d'exécution de quelqu'un d'autre. `workflow.delete` enregistre `outcome=denied` avec `reason=not_owner` lorsqu'un collaborateur tente de supprimer.

### Identifiants

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` est audité car l'ouverture d'un identifiant le déchiffre. Un échec journalise `outcome=denied`, ce qui correspond au profil d'une tentative d'énumération d'identifiants.
### Autres ressources

| Ressource | Actions |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Bases vectorielles | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alertes | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Tables de données | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Dossiers | `folder.create` · `update` · `delete` · `workflow_move` |

Les opérations en masse sont journalisées une fois par requête avec un compteur, et non une fois par ligne. Un import CSV de 5 000 lignes produit une seule ligne `data_table.import_csv` portant `imported`, `rejected` et `total`.

## Les secrets ne sont jamais journalisés

Une ligne d'audit enregistre des identifiants, des noms et des compteurs. Elle n'enregistre jamais le contenu d'un identifiant, la valeur d'une variable, un mot de passe ou un token.

Deux mécanismes garantissent cela. Les sites d'appel sont écrits de manière à ne transmettre que des champs sûrs, et l'helper d'audit effectue une rédaction en dernier recours : tout champ dont le nom contient `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` ou un terme similaire est remplacé par `***` avant la construction de la ligne. La sur-rédaction est délibérée — une ligne peu utile vaut mieux qu'un identifiant divulgué.

Lorsqu'un secret est réellement pertinent pour l'enregistrement, seule sa forme est journalisée. Un partage de fichier enregistre `password_protected=true`, jamais le mot de passe.

## Heym Work

Lorsque vous exécutez Heym Work aux côtés de Heym, Work émet des lignes d'audit sur le stdout de son propre conteneur dans le même format Winston :

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work journalise les actions des utilisateurs sur les pages, les tableaux et les enregistrements :

| Action | Signification |
|---|---|
| `page.create`, `page.update`, `page.delete` | Modifications des pages et dispositions de tableau de bord |
| `board.column_create`, `board.column_move`, `board.column_delete` | Modifications de disposition des colonnes Kanban |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Événements du cycle de vie des cartes |
| `record.create`, `record.update`, `record.delete` | Mutations d'enregistrements de table de données via Work |
| `chat.message` | Prompt utilisateur envoyé à l'assistant Work |
| `export.csv`, `export.json` | Exports de données |

Chaque ligne comporte les mêmes champs `actor_id`, `actor_email`, `timestamp` et `outcome` que les lignes d'audit de Heym, permettant aux collecteurs de journaux de traiter les deux avec un pipeline unique.

## Rétention

**Les lignes d'audit ne subsistent que le temps de la sortie de logs du conteneur.** Elles ne sont pas écrites dans la base de données. Recréer le conteneur backend supprime ses logs.

Si vous avez besoin d'un historique d'audit qui survive à un redéploiement, exportez la sortie stdout du conteneur vers un emplacement durable — un log driver, un collecteur sidecar ou l'agrégation de logs de votre plateforme — de la même manière que pour tout autre log de conteneur.

## Pour les contributeurs

Émettre une ligne d'audit ne nécessite qu'un seul appel :

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

L'helper est synchrone, ne touche à aucune base de données et absorbe ses propres erreurs : un appel d'audit ne peut donc ni échouer ni ralentir une requête.

Trois règles à respecter lors de l'ajout d'un appel :

1. **Nommez l'action `resource.verb` en snake_case.** `backend/tests/test_audit_log.py` parcourt chaque appel `audit()` sous `app/api/` et fait échouer le build sur un nom qui ne correspond pas, ainsi que sur une ressource couverte ayant perdu tous ses sites d'appel.

2. **Ne lisez que des attributs certainement présents.** Le `try/except` de l'helper protège son propre corps, pas les expressions que vous lui transmettez — une `AttributeError` dans `target_name=workflow.name` est levée au niveau du site d'appel, avant l'exécution de `audit()`, et fera échouer la requête. Lisez des colonnes ORM et des variables locales, pas des attributs optionnels ou chargés paresseusement.

3. **Journalisez la suppression avant le delete.** Après `db.delete(row)`, le nom et l'id que vous souhaitez enregistrer peuvent avoir disparu. Placez l'appel au-dessus.
