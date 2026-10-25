# Jira Node

Ο **Jira** node συνδέει τα workflows με το Jira REST API για αυτοματοποίηση έργων, ζητημάτων, σχολίων, συνημμένων, χρηστών, ειδοποιήσεων και μεταβάσεων. Η προεπιλεγμένη λειτουργία είναι **Search Issues**.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | Jira (Cloud email/API token, Data Center username/password ή personal access token, base URL, deployment mode, προαιρετική έκδοση REST API) |
| Έξοδος | `$nodeLabel.*` |

## Διαπιστευτήριο

Δημιουργήστε ένα **Jira** διαπιστευτήριο στην [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md). Τα αποθηκευμένα κλειδιά ρυθμίσεων είναι `email`, `api_token`, `base_url`, `deployment`, `auth_mode` και προαιρετικά `api_version`. Για το Jira Cloud, το `email` αποθηκεύει το email του λογαριασμού Atlassian και το `api_token` αποθηκεύει το Atlassian API token. Για το Jira Data Center / Server, αυτά τα ίδια κλειδιά αποθηκεύουν το όνομα χρήστη και τον κωδικό πρόσβασης του Basic auth, ή, με `auth_mode: pat`, το `api_token` αποθηκεύει ένα personal access token που αποστέλλεται ως Bearer token και το `email` δεν χρησιμοποιείται. Ανατρέξτε στις [Ενσωματώσεις Τρίτων](../reference/integrations.md#jira) για τα βήματα ρύθμισης.

| Πεδίο | Κλειδί ρύθμισης | Περιγραφή |
| --- | --- | --- |
| Jira Email / Username | `email` | Email λογαριασμού Atlassian για Jira Cloud, ή όνομα χρήστη για Jira Data Center / Server |
| Έλεγχος ταυτότητας | `auth_mode` | `basic` (προεπιλογή) ή `pat` (μόνο Data Center / Server) |
| API Token / Password / Personal Access Token | `api_token` | Atlassian API token για Jira Cloud, κωδικός πρόσβασης για Basic auth σε Jira Data Center / Server ή personal access token του Data Center σε λειτουργία `pat` |
| Base URL | `base_url` | URL του ιστότοπου Jira, για παράδειγμα `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` για Jira Cloud ή `data_center` για Jira Data Center / Server |
| REST API Version | `api_version` | Προεπιλογή `3` για Jira Cloud. Το Data Center / Server χρησιμοποιεί REST API v2 |

Τα personal access tokens απαιτούν Jira Data Center / Server 8.14 ή νεότερη έκδοση. Η αλλαγή μεθόδου ελέγχου ταυτότητας εκκαθαρίζει το αποθηκευμένο μυστικό, επομένως εισαγάγετε τον νέο κωδικό πρόσβασης ή το νέο token κατά την εναλλαγή.

Χρησιμοποιήστε το **Test Connection** για να επαληθεύσετε το διαπιστευτήριο έναντι του τρέχοντος χρήστη Jira.

## Λειτουργίες

| Λειτουργία | Απαιτούμενα πεδία | Έξοδος |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Προαιρετικά Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Προαιρετικά JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key ή ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key ή ID και τουλάχιστον ένα τροποποιημένο πεδίο | `issue`, `key` |
| Delete Issue | Issue Key ή ID | `deleted` |
| Get Issue Changelog | Issue Key ή ID; προαιρετικά Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key ή ID, Subject, Text Body | `notified` |
| List Comments | Issue Key ή ID; προαιρετικά Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key ή ID, Comment Body | `comment` |
| Get Comment | Issue Key ή ID, Comment ID | `comment` |
| Update Comment | Issue Key ή ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key ή ID, Comment ID | `deleted` |
| Add Attachment | Issue Key ή ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; προαιρετικά Include Binary | `attachment` |
| List Attachments | Issue Key ή ID; προαιρετικά Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key ή ID | `transitions`, `count` |
| Transition Issue | Issue Key ή ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Τα πεδία κειμένου που υποστηρίζουν εκφράσεις δέχονται [εκφράσεις](../reference/expression-dsl.md) όπως `$input.text`. Το `jiraIncludeBinary` είναι boolean toggle και δεν υποστηρίζει εκφράσεις, αλλά μπορεί να επισημανθεί ως παρεχόμενο από agent όταν ο Jira node είναι συνδεδεμένος σε Agent tool handle.

## Πεδία ζητημάτων και ενημέρωσης

- Το **Project Key** είναι το σύντομο κλειδί έργου, όπως `ENG`. Χρησιμοποιήστε το List Projects για να ανακαλύψετε κλειδιά.
- Το **Issue Key ή ID** δέχεται κλειδιά όπως `ENG-123` ή αριθμητικά IDs ζητημάτων. Χρησιμοποιήστε το Search Issues ή το List Projects για να ανακαλύψετε τιμές.
- Το **Transition ID** προέρχεται από το List Transitions. Κάθε αντικείμενο μετάβασης περιλαμβάνει ένα πεδίο `id`.
- Το **Comment ID** και το **Attachment ID** προέρχονται από το List Comments, το List Attachments ή προηγούμενες αποκρίσεις create/get.
- Το **Account ID / Username** είναι η τιμή `accountId` του Jira Cloud ή το όνομα χρήστη του Jira Data Center / Server. Τα Get Myself ή Get User μπορούν να σας βοηθήσουν να το ανακαλύψετε.
- Το κείμενο της **description** του ζητήματος και του **body** του σχολίου αποστέλλονται ως Atlassian Document Format στο REST
  API v3· όταν το deployment του διαπιστευτηρίου είναι Data Center / Server, αποστέλλονται ως απλό κείμενο.
  Στο v3, οι χαρακτήρες νέας γραμμής γίνονται ξεχωριστές παράγραφοι.
- Το **Get Issue Changelog** χρησιμοποιεί το σελιδοποιημένο endpoint changelog του Jira Cloud. Για το Data Center / Server, διαβάζει εκτεταμένα δεδομένα changelog του ζητήματος και εφαρμόζει το διαμορφωμένο offset/limit στα επιστρεφόμενα histories.
- Στο **Update Issue**, αφήστε τα προαιρετικά πεδία κενά για να διατηρήσετε τις τρέχουσες τιμές τους.
- Ορίστε το **Description** ή το **Assignee Account ID / Username** σε `null` κατά την ενημέρωση για να εκκαθαρίσετε αυτά τα πεδία. Οι ετικέτες δεν μπορούν να εκκαθαριστούν με `null`.
- Το **Recipients JSON** στο Notify Issue έχει προεπιλογή `{"assignee":true}` όταν παραλείπεται. Συνήθη κλειδιά περιλαμβάνουν `assignee`, `reporter`, `watchers` και `voters` (για παράδειγμα `{"assignee":true,"watchers":true}`).
- Το **Add Attachment** δέχεται raw base64 ή περιεχόμενο data URL και περιορίζεται από τη ρύθμιση μεγέθους αρχείου της πλατφόρμας (προεπιλογή 99 MB).
## Σελιδοποίηση

- **Search Issues** χρησιμοποιεί σελιδοποίηση με δείκτη (cursor pagination) μέσω `jiraNextPageToken` για το Jira Cloud. Διαβάστε το `pagination.nextPageToken` από την προηγούμενη εκτέλεση και περάστε το στο επόμενο node Search Issues.
- **Search Issues** χρησιμοποιεί σελιδοποίηση με μετατόπιση (offset pagination) μέσω `jiraStartAt` για το Jira Data Center / Server. Διαβάστε τα `pagination.startAt`, `pagination.maxResults` και `pagination.total` για να υπολογίσετε την επόμενη σελίδα.
- **List Projects**, **Get Issue Changelog**, **List Comments** και **List Attachments** χρησιμοποιούν σελιδοποίηση με μετατόπιση (offset pagination) με `jiraLimit` και `jiraStartAt`. Τα σελιδοποιημένα αποτελέσματα επιστρέφουν `pagination.startAt`, `pagination.maxResults`, `pagination.total` και `pagination.isLast`.
- **List Attachments** ανακτά πρώτα όλα τα συνημμένα από το issue και στη συνέχεια τεμαχίζει το αποτέλεσμα στην πλευρά του client. Τα πεδία σελιδοποίησης εξακολουθούν να περιγράφουν τη σελίδα που επιστρέφεται, αλλά τα μεγάλα issues ενδέχεται να προκαλέσουν πρόσθετο κόστος ανάκτησης.
- **List Transitions** δεν σελιδοποιείται.

## Βασικά πεδία

| Πεδίο | Χρησιμοποιείται από | Σημειώσεις |
| --- | --- | --- |
| `credentialId` | Όλες τις λειτουργίες | UUID διαπιστευτηρίου Jira που ανήκει στον χρήστη |
| `jiraOperation` | Όλες τις λειτουργίες | Προεπιλογή: `searchIssues` |
| `jiraProjectKey` | Create Issue | Κλειδί έργου, όπως `ENG` |
| `jiraIssueKey` | Λειτουργίες issue, σχολίου, συνημμένου, ειδοποίησης και μετάβασης | Κλειδί issue, όπως `ENG-123` ή αριθμητικό ID issue |
| `jiraIssueType` | Create Issue | Προεπιλογή: `Task` |
| `jiraIssueTypeId` | Create Issue | Προαιρετικό ID τύπου issue· υπερισχύει του `jiraIssueType` όταν οριστεί |
| `jiraSummary` | Create/Update Issue | Απαιτείται για Create Issue |
| `jiraDescription` | Create/Update Issue | Αποστέλλεται ως ADF στο REST API v3 ή ως απλό κείμενο στο REST API v2· χρησιμοποιήστε `null` κατά την ενημέρωση για να διαγράψετε την περιγραφή |
| `jiraJql` | Search Issues | Προεπιλογή: `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Προαιρετικός JSON πίνακας ή πεδία issue χωρισμένα με κόμμα· προεπιλογή στα `key`, `summary`, `status`, `assignee` και `issuetype` όταν είναι κενό |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId του Jira Cloud ή όνομα χρήστη Data Center / Server· χρησιμοποιήστε `null` κατά την ενημέρωση για να διαγράψετε τον αναθέτοντα |
| `jiraLabels` | Create/Update Issue | JSON πίνακας ή κείμενο χωρισμένο με κόμμα |
| `jiraCommentBody` | Create/Update Comment | Αποστέλλεται ως ADF στο REST API v3 ή ως απλό κείμενο στο REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID σχολίου Jira |
| `jiraTransitionId` | Transition Issue | Ανακαλύψτε το με το List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID συνημμένου Jira |
| `jiraAttachmentFilename` | Add Attachment | Όνομα αρχείου που ανέβηκε |
| `jiraAttachmentBase64` | Add Attachment | Ακατέργαστο base64 ή περιεχόμενο data URL· υπόκειται σε όριο μεγέθους αρχείου |
| `jiraAttachmentMimeType` | Add Attachment | Προαιρετικός τύπος MIME· συνάγεται από το όνομα αρχείου όταν είναι κενό |
| `jiraIncludeBinary` | Get/List Attachment | Δυαδικός διακόπτης· προσθέτει `content_base64` όταν είναι ενεργοποιημένος |
| `jiraNotifySubject` | Notify Issue | Απαιτούμενο θέμα ειδοποίησης |
| `jiraNotifyTextBody` | Notify Issue | Απαιτούμενο σώμα ειδοποίησης σε απλό κείμενο |
| `jiraNotifyHtmlBody` | Notify Issue | Προαιρετικό σώμα HTML |
| `jiraNotifyTo` | Notify Issue | JSON παραληπτών· προεπιλογή: `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId του Jira Cloud ή όνομα χρήστη Data Center / Server |
| `jiraUserEmail` | Create User | Διεύθυνση email νέου χρήστη |
| `jiraUsername` | Create User | Προαιρετικό όνομα χρήστη Data Center / Server· εναλλακτικά χρησιμοποιείται το `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Προαιρετικό όνομα εμφάνισης |
| `jiraUserProducts` | Create User | JSON πίνακας ή κλειδιά προϊόντων χωρισμένα με κόμμα· μόνο για Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Προεπιλογή: `50`· εύρος 1–100 |
| `jiraStartAt` | Search Issues στο Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Δείκτης έναρξης σελιδοποίησης με μετατόπιση |
| `jiraNextPageToken` | Search Issues στο Jira Cloud | Token δείκτη από προηγούμενη απάντηση αναζήτησης |

## Παραδείγματα

Δημιουργία issue από ανάντη είσοδο:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Ενημέρωση issue και διαγραφή του αναθέτοντα:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Αναζήτηση issues με προσαρμοσμένα πεδία και σελιδοποίηση με δείκτη:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Αναζήτηση issues στο Data Center με σελιδοποίηση με μετατόπιση:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Μετάβαση issue αφού παραθέσετε τις διαθέσιμες μεταβάσεις:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Στη συνέχεια εκτελέστε **Transition Issue** με Transition ID: `$listTransitions.transitions[0].id`

Ειδοποίηση παρατηρητών σχετικά με ενημέρωση issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Έξοδος

Κάθε επιτυχής λειτουργία ορίζει:

- `$jira.success`
- `$jira.operation`

**Get Myself** εκθέτει το `user`.

**Paginated list operations** εκθέτουν το `count`, ένα πεδίο συλλογής και το `pagination`:

| Λειτουργία | Κλειδί συλλογής | Μορφή σελιδοποίησης |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** εκθέτει τα `transitions` και `count` χωρίς σελιδοποίηση.

**Issue mutations and reads** εκθέτουν το payload του Jira issue καθώς και το `key` όπου είναι εφαρμόσιμο.

**Comment** get/create/update εκθέτουν το `comment`; το delete εκθέτει το `deleted`.

**Transition Issue** εκθέτει το `transition` ως `{ transitionId }`, καθώς και το ανανεωμένο `issue` και `key`.

**Attachment add** εκθέτει τα `attachments` και `count`. **Get Attachment** εκθέτει το `attachment`; **List Attachments** εκθέτει τα `attachments`, `count` και `pagination`. Όταν είναι ενεργοποιημένο το **Include Binary**, κάθε αντικείμενο attachment μπορεί να περιλαμβάνει `content_base64`. Το Delete εκθέτει το `deleted`.

**User** get/create εκθέτουν το `user`; το delete εκθέτει το `deleted`.

**Notify Issue** εκθέτει το `notified`.

Συνήθη μοτίβα πρόσβασης:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Σχετικά

- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md)
- [Ενσωματώσεις Τρίτων](../reference/integrations.md#jira)
- [Τύποι Κόμβων](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
