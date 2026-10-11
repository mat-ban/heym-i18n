# Sentry-Knoten

Verwende den Sentry-Knoten, um Sentry-Organisations-, Projekt-, Team-, Issue-, Event- und Release-Operationen aus einem Workflow heraus zu automatisieren.

## Anmeldedaten

Erstelle eine **Sentry**-Anmeldedaten mit einem Auth-Token. Lasse die Base URL für Sentry SaaS leer oder setze die Root-URL für eine selbst gehostete Sentry-Instanz.

## Operationen

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` und `createOrganization` werden nicht bereitgestellt, da Sentry hierfür keine öffentlichen REST-Endpoints dokumentiert.

## Gemeinsame Felder

| Feld | Beschreibung |
| --- | --- |
| Credential | Zu verwendende Sentry-Anmeldedaten |
| Operation | Auszuführende Sentry-Aktion |
| Organization Slug | Sentry-Organisations-Slug für die Organisationsaktualisierung sowie für Projekt-, Team-, Issue-, Event- und Release-Operationen |
| Project Slug | Projekt-Slug für Projekt-Get/Update/Delete- und Event-Operationen; Projekt-Slug oder ID für Issue-Filter |
| Team Slug | Team-Slug für die Projekterstellung sowie für Team-Update/Delete-Operationen |
| Issue ID | Issue-ID für Issue-Get/Update/Delete-Operationen |
| Event ID | Event-ID für Event-Lookup-Operationen |
| Release Version | Release-Version für Release-Get/Update/Delete-Operationen |
| Name | Projekt- oder Teamname für Create-Operationen |
| Slug | Optionaler Projekt- oder Team-Slug für Create-Operationen |
| Platform | Optionale Sentry-Plattform für die Projekterstellung |
| Status / Assigned To | Issue-Update-Felder. Mindestens eines ist für `updateIssue` erforderlich |
| Query | Sentry-Suchabfrage. Lasse sie für ungelöste Issues weg oder setze sie auf eine leere Zeichenkette, um alle Issues abzurufen |
| Limit | Ergebnislimit für Listen-Operationen, begrenzt auf insgesamt 1.000 Ergebnisse |
| Release Projects JSON | JSON-Array von Projekt-Slugs für die Release-Erstellung |
| Release Refs JSON | JSON-Array von Repository-/Commit-Objekten für die Release-Erstellung |
| Payload JSON | JSON-Objekt für Update-Operationen an Organisation, Projekt, Release und Team |

## Beispiele

Ungelöste Issues auflisten:

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

Ein Issue lösen:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Ein Issue löschen:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Ein Release erstellen:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Ein Projekt aktualisieren:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Ausgaben

Listen-Operationen geben `success`, `operation`, `count` und die relevante Sammlung wie `organizations`, `projects`, `teams`, `issues`, `events` oder `releases` zurück. Operationen auf einzelne Ressourcen geben `organization`, `issue`, `event`, `release`, `project` oder `team` zurück. Delete-Operationen geben den relevanten Ressourcen-Schlüssel mit `deleted: true` und identifizierenden Feldern zurück.
