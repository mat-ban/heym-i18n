# Sentry Node

Χρησιμοποιήστε το Sentry node για να αυτοματοποιήσετε λειτουργίες οργανισμού, έργου, ομάδας, ζητήματος, συμβάντος και έκδοσης του Sentry από ένα workflow.

## Διαπιστευτήριο

Δημιουργήστε ένα **Sentry** διαπιστευτήριο με ένα auth token. Αφήστε το Base URL κενό για το Sentry SaaS ή ορίστε το root URL για μια αυτο-φιλοξενούμενη εγκατάσταση Sentry.

## Λειτουργίες

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

Τα `createIssue` και `createOrganization` δεν εκτίθενται επειδή το Sentry δεν τεκμηριώνει δημόσια REST endpoints για αυτά.

## Κοινά Πεδία

| Πεδίο | Περιγραφή |
| --- | --- |
| Credential | Sentry διαπιστευτήριο προς χρήση |
| Operation | Sentry ενέργεια προς εκτέλεση |
| Organization Slug | Sentry organization slug για ενημέρωση οργανισμού και λειτουργίες έργου, ομάδας, ζητήματος, συμβάντος και έκδοσης |
| Project Slug | Project slug για λειτουργίες get/update/delete έργου και συμβάντων· project slug ή ID για φίλτρα ζητημάτων |
| Team Slug | Team slug για δημιουργία έργου και λειτουργίες update/delete ομάδας |
| Issue ID | Issue ID για λειτουργίες get/update/delete ζητήματος |
| Event ID | Event ID για λειτουργίες αναζήτησης συμβάντος |
| Release Version | Release version για λειτουργίες get/update/delete έκδοσης |
| Name | Όνομα έργου ή ομάδας για λειτουργίες δημιουργίας |
| Slug | Προαιρετικό project ή team slug για λειτουργίες δημιουργίας |
| Platform | Προαιρετική Sentry platform για δημιουργία έργου |
| Status / Assigned To | Πεδία ενημέρωσης ζητήματος. Απαιτείται τουλάχιστον ένα για το `updateIssue` |
| Query | Sentry search query. Παραλείψτε το για unresolved issues ή ορίστε το σε κενή συμβολοσειρά για να ανακτήσετε όλα τα issues |
| Limit | Όριο αποτελεσμάτων για λειτουργίες λίστας, με ανώτατο όριο 1.000 συνολικά αποτελέσματα |
| Release Projects JSON | JSON array από project slugs για δημιουργία έκδοσης |
| Release Refs JSON | JSON array από αντικείμενα repository/commit για δημιουργία έκδοσης |
| Payload JSON | JSON object για λειτουργίες ενημέρωσης οργανισμού, έργου, έκδοσης και ομάδας |

## Παραδείγματα

Λίστα unresolved issues:

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

Επίλυση ζητήματος:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Διαγραφή ζητήματος:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Δημιουργία έκδοσης:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Ενημέρωση έργου:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Έξοδοι

Οι λειτουργίες λίστας επιστρέφουν `success`, `operation`, `count` και τη σχετική συλλογή όπως `organizations`, `projects`, `teams`, `issues`, `events` ή `releases`. Οι λειτουργίες μεμονωμένου πόρου επιστρέφουν `organization`, `issue`, `event`, `release`, `project` ή `team`. Οι λειτουργίες διαγραφής επιστρέφουν το σχετικό κλειδί πόρου με `deleted: true` και πεδία αναγνώρισης.
