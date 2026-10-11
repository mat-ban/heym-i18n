# Nodo Sentry

Utilizzare il nodo Sentry per automatizzare le operazioni su organizzazioni, progetti, team, issue, eventi e release di Sentry all'interno di un workflow.

## Credenziali

Creare una credenziale **Sentry** con un auth token. Lasciare vuoto il campo Base URL per Sentry SaaS, oppure impostare l'URL radice per un'istanza Sentry self-hosted.

## Operazioni

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

Le operazioni `createIssue` e `createOrganization` non sono esposte poiché Sentry non documenta endpoint REST pubblici per esse.

## Campi comuni

| Campo | Descrizione |
| --- | --- |
| Credential | Credenziale Sentry da utilizzare |
| Operation | Azione Sentry da eseguire |
| Organization Slug | Slug dell'organizzazione Sentry per l'aggiornamento dell'organizzazione e per le operazioni su progetti, team, issue, eventi e release |
| Project Slug | Slug del progetto per le operazioni di get/update/delete del progetto e per le operazioni sugli eventi; slug o ID del progetto per i filtri sulle issue |
| Team Slug | Slug del team per la creazione di progetti e per le operazioni di update/delete del team |
| Issue ID | ID dell'issue per le operazioni di get/update/delete dell'issue |
| Event ID | ID dell'evento per le operazioni di ricerca dell'evento |
| Release Version | Versione della release per le operazioni di get/update/delete della release |
| Name | Nome del progetto o del team per le operazioni di creazione |
| Slug | Slug opzionale del progetto o del team per le operazioni di creazione |
| Platform | Piattaforma Sentry opzionale per la creazione del progetto |
| Status / Assigned To | Campi di aggiornamento dell'issue. È richiesto almeno uno per `updateIssue` |
| Query | Query di ricerca Sentry. Ometterla per le issue non risolte, oppure impostarla su una stringa vuota per recuperare tutte le issue |
| Limit | Limite di risultati per le operazioni di elenco, con un massimo di 1.000 risultati totali |
| Release Projects JSON | Array JSON di slug di progetti per la creazione della release |
| Release Refs JSON | Array JSON di oggetti repository/commit per la creazione della release |
| Payload JSON | Oggetto JSON per le operazioni di aggiornamento di organizzazione, progetto, release e team |

## Esempi

Elencare le issue non risolte:

```json
{
  "sentryOperation": "listIssues",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryQuery": "is:unresolved level:error",
  "sentryStatsPeriod": "14d",
  "sentryLimit": "25"
}
```

Risolvere un'issue:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Eliminare un'issue:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Creare una release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Aggiornare un progetto:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Output

Le operazioni di elenco restituiscono `success`, `operation`, `count` e la collezione pertinente, come `organizations`, `projects`, `teams`, `issues`, `events` o `releases`. Le operazioni su risorsa singola restituiscono `organization`, `issue`, `event`, `release`, `project` o `team`. Le operazioni di eliminazione restituiscono la chiave della risorsa pertinente con `deleted: true` e i campi identificativi.