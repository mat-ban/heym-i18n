# Nodul Sentry

Utilizați nodul Sentry pentru a automatiza operațiunile Sentry privind organizațiile, proiectele, echipele, problemele, evenimentele și versiunile direct dintr-un workflow.

## Acreditări

Creați o acreditare **Sentry** cu un token de autentificare. Lăsați Base URL gol pentru Sentry SaaS sau setați URL-ul rădăcină pentru o instanță Sentry self-hosted.

## Operațiuni

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` și `createOrganization` nu sunt expuse deoarece Sentry nu documentează endpoint-uri REST publice pentru acestea.

## Câmpuri comune

| Câmp | Descriere |
| --- | --- |
| Credential | Acreditarea Sentry de utilizat |
| Operation | Acțiunea Sentry de executat |
| Organization Slug | Slug-ul organizației Sentry pentru actualizarea organizației și pentru operațiunile privind proiectele, echipele, problemele, evenimentele și versiunile |
| Project Slug | Slug-ul proiectului pentru operațiunile get/update/delete asupra proiectului și pentru operațiunile privind evenimentele; slug-ul sau ID-ul proiectului pentru filtrele de probleme |
| Team Slug | Slug-ul echipei pentru crearea proiectelor și pentru operațiunile update/delete asupra echipelor |
| Issue ID | ID-ul problemei pentru operațiunile get/update/delete asupra problemei |
| Event ID | ID-ul evenimentului pentru operațiunile de căutare a evenimentelor |
| Release Version | Versiunea lansării pentru operațiunile get/update/delete asupra lansării |
| Name | Numele proiectului sau al echipei pentru operațiunile de creare |
| Slug | Slug-ul opțional al proiectului sau al echipei pentru operațiunile de creare |
| Platform | Platforma Sentry opțională pentru crearea proiectului |
| Status / Assigned To | Câmpuri pentru actualizarea problemei. Cel puțin unul este obligatoriu pentru `updateIssue` |
| Query | Interogarea de căutare Sentry. Omiteți-o pentru problemele nerezolvate sau setați-o la un șir gol pentru a prelua toate problemele |
| Limit | Limita de rezultate pentru operațiunile de listare, plafonată la 1.000 de rezultate în total |
| Release Projects JSON | Array JSON de slug-uri de proiecte pentru crearea lansării |
| Release Refs JSON | Array JSON de obiecte repository/commit pentru crearea lansării |
| Payload JSON | Obiect JSON pentru operațiunile de actualizare a organizației, proiectului, lansării și echipei |

## Exemple

Listați problemele nerezolvate:

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

Rezolvați o problemă:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Ștergeți o problemă:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Creați o lansare:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Actualizați un proiect:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Ieșiri

Operațiunile de listare returnează `success`, `operation`, `count` și colecția relevantă, precum `organizations`, `projects`, `teams`, `issues`, `events` sau `releases`. Operațiunile asupra unei singure resurse returnează `organization`, `issue`, `event`, `release`, `project` sau `team`. Operațiunile de ștergere returnează cheia resursei relevante cu `deleted: true` și câmpurile de identificare.
