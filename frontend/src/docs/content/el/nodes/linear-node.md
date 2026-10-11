# Linear Node

Ο **Linear** node συνδέει τα workflows με το Linear GraphQL API για αυτοματοποίηση issues και workspace.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | Linear personal API key ή OAuth2 |
| Έξοδος | `$nodeLabel.*` |

## Διαπιστευτήριο

Δημιουργήστε ένα **Linear** διαπιστευτήριο στην [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md). Επιλέξτε μία
λειτουργία authentication:

**Personal API key**

1. Στο Linear, ανοίξτε **Settings → Security & Access → Personal API keys**.
2. Δημιουργήστε ένα key με πρόσβαση στο workspace που θέλετε να αυτοματοποιήσετε.
3. Επικολλήστε το key σε ένα νέο Linear διαπιστευτήριο στο Heym και χρησιμοποιήστε το **Test Connection** για να το επαληθεύσετε.

**OAuth2**

1. Δημιουργήστε μια εφαρμογή Linear OAuth.
2. Καταχωρίστε το `{FRONTEND_URL}/api/credentials/linear/oauth/callback` ως redirect URI.
3. Στο Heym, επιλέξτε **OAuth2**, εισαγάγετε το Client ID και το Client Secret και, στη συνέχεια, κάντε κλικ στο **Connect**.

Τα Personal API keys και τα OAuth tokens ενεργούν ως ο χρήστης που τα δημιούργησε ή τα εξουσιοδότησε.

## Λειτουργίες

| Λειτουργία | Απαιτούμενα πεδία | Έξοδος |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; προαιρετικό After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; προαιρετικό After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; προαιρετικό Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; προαιρετικό After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID ή identifier όπως `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID ή identifier και τουλάχιστον ένα πεδίο που άλλαξε | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID ή identifier | `deleted` |
| Add Issue Link | Issue ID ή identifier, Link URL | `link` |
| Create Comment | Issue ID ή identifier, Comment Body | `comment` |
| List Comments | Issue ID ή identifier, Limit; προαιρετικό After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Όλα τα πεδία κειμένου υποστηρίζουν [expressions](../reference/expression-dsl.md).

## Πεδία Issue

- Τα **Team ID** και **Project ID** είναι Linear UUIDs. Χρησιμοποιήστε τα List Teams ή List Projects για να τα ανακαλύψετε.
- Το **State ID** είναι το workflow-state UUID που χρησιμοποιείται κατά τη δημιουργία ή την ενημέρωση ενός issue. Χρησιμοποιήστε το List Workflow States για να το ανακαλύψετε.
- Το **Assignee ID** είναι ένα Linear user UUID. Χρησιμοποιήστε το List Team Members για να το ανακαλύψετε.
- Το **Priority** δέχεται τιμές από `0` έως `4`: no priority, urgent, high, normal και low.
- Αφήστε τα προαιρετικά πεδία ενημέρωσης κενά για να διατηρήσετε τις τρέχουσες τιμές τους.
- Ορίστε ένα πεδίο ενημέρωσης σε `null` για να διαγράψετε το description, το project, τον assignee ή το state.
- Το **Link URL** προσθέτει έναν σύνδεσμο εξωτερικού συνημμένου σε ένα issue.
- Το **Comment ID** είναι το Linear UUID για ένα υπάρχον σχόλιο. Χρησιμοποιήστε το List Comments για να το ανακαλύψετε.
- Το **Parent Comment ID** απαντά σε ένα υπάρχον Linear σχόλιο κατά τη δημιουργία ενός σχολίου.

## Σελιδοποίηση

Οι λειτουργίες List μπορούν είτε να επιστρέψουν μία σελίδα είτε να ανακτήσουν αυτόματα κάθε σελίδα:

- Αφήστε το **Return All** ανενεργό για να χρησιμοποιήσετε χειροκίνητα τα `Limit` και `After Cursor`.
- Ενεργοποιήστε το **Return All** για να ακολουθήσετε τα Linear cursors server-side, έως 10.000 αποτελέσματα.

Τα σελιδοποιημένα αποτελέσματα επιστρέφουν `pageInfo.hasNextPage` και `pageInfo.endCursor`. Περάστε το cursor στο
**After Cursor** στην επόμενη εκτέλεση του node για να ανακτήσετε την επόμενη σελίδα όταν το **Return All** είναι ανενεργό.

## Παραδείγματα

Δημιουργία ενός issue από upstream input:

- Λειτουργία: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Προσθήκη σχολίου σε ένα issue που δημιουργήθηκε:

- Λειτουργία: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: προαιρετικό, όταν απαντάτε σε άλλο σχόλιο

Επίλυση ενός comment thread:

- Λειτουργία: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Προσθήκη εξωτερικού συνδέσμου σε ένα issue:

- Λειτουργία: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Σελιδοποίηση μέσω team members:

- Λειτουργία: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` στην επόμενη εκτέλεση όταν το `hasNextPage` είναι true

Ανακάλυψη workflow state IDs πριν από την ενημέρωση ενός issue:

- Λειτουργία: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Στη συνέχεια, χρησιμοποιήστε το `$listStates.states[0].id` ως **State ID** στο **Update Issue**

## Έξοδος

Κάθε επιτυχημένη λειτουργία ορίζει:

- `$linear.success`
- `$linear.operation`

Οι λειτουργίες List εκθέτουν επίσης το `count` και, όπου ισχύει, το `pageInfo`. Οι λειτουργίες Issue εκθέτουν το
πλήρες Linear issue payload και πεδία ευκολίας όπως `identifier` και `url`.
Οι μεταλλάξεις Comment εκθέτουν το πλήρες `comment` payload, εκτός από το Delete Comment, το οποίο εκθέτει
`deleted` και `entityId`.

## Σχετικά

- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
