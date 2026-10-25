# GitHub Node

Ο **GitHub** node προσθέτει εγγενείς λειτουργίες GitHub REST σε ένα workflow, παρόμοια με τους multi-operation GitHub nodes που ίσως γνωρίζετε από εργαλεία όπως το n8n.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | GitHub |
| Έξοδος | `$nodeLabel.*` |

## Υποστηριζόμενες Λειτουργίες

Ο node παρέχει αυτή τη στιγμή 40 ενέργειες:

| Πόρος | Ενέργειες |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Διαπιστευτήριο

Δημιουργήστε ένα **GitHub** διαπιστευτήριο στην [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) με:

- Ένα personal access token
- Προαιρετικό πλήρες REST API base URL για GitHub Enterprise Server

Αφήστε το base URL κενό για το GitHub.com. Συνιστώνται fine-grained PATs.

Για το GitHub Enterprise Server, εισαγάγετε το πλήρες REST API endpoint συμπεριλαμβανομένου του `/api/v3`, όπως
`https://github.example.com/api/v3`. Μην εισαγάγετε μόνο τη ρίζα του web UI
(`https://github.example.com`).

Εάν χρησιμοποιείτε GitHub Enterprise Server και αργότερα επεξεργαστείτε το διαπιστευτήριο για να εναλλάξετε το token, αφήνοντας
το `base_url` κενό διατηρείται το υπάρχον Enterprise endpoint. Εισαγάγετε νέο URL μόνο όταν θέλετε
να αλλάξετε αυτό το endpoint.

## Κοινά Πεδία

Οι περισσότερες λειτουργίες χρησιμοποιούν:

- **Owner** – Ιδιοκτήτης repository, όνομα οργανισμού ή όνομα χρήστη
- **Repository** – Όνομα repository

Το `List Organization Repositories` απαιτεί μόνο το **Owner** (το όνομα του οργανισμού) και δεν χρησιμοποιεί το πεδίο repository.

Το `List User Repositories` απαιτεί μόνο το **Owner** (το όνομα χρήστη) και δεν χρησιμοποιεί το πεδίο repository.

Το `Get User Repositories` αντιγράφει την ενέργεια User → Get Repositories του n8n. Το `Get User Issues` επιστρέφει
issues που έχουν ανατεθεί στον πιστοποιημένο χρήστη GitHub από προεπιλογή. Ορίστε το **Mentioned Filter** σε οποιαδήποτε
μη κενή τιμή για να επιστραφούν issues που αναφέρουν τον πιστοποιημένο χρήστη. Υποστηρίζει επίσης
φίλτρα state, labels, updated-since, sort, direction και per-page. Το `Invite User` απαιτεί
οργανισμό και διεύθυνση email και δεν χρησιμοποιεί τα Owner ή Repository.

## Repository

Οι λειτουργίες Repository περιλαμβάνουν metadata, περιεχόμενο ανιχνευμένης άδειας, προφίλ υγείας κοινότητας και
πληροφορίες επισκεψιμότητας. Τα `List Popular Paths for Repository` και
`List Top Referrers for Repository` επιστρέφουν τις κορυφαίες καταχωρήσεις επισκεψιμότητας του GitHub για τις τελευταίες 14 ημέρες και
απαιτούν δικαιώματα push διαχείρισης repository.

Το `List Issues` υποστηρίζει προαιρετικά φίλτρα assignee, creator, mentioned user, labels χωρισμένα με κόμμα,
updated-since timestamp, sort και direction. Το `List Pull Requests` υποστηρίζει state, sort,
direction και per-page controls.

Τα `Get Repository Issues` και `Get Repository Pull Requests` εκθέτουν τα ίδια APIs με τα List
ομόλογά τους υπό ρητά συμβατά με n8n ονόματα ενεργειών repository.

### Λήψη metadata Repository

Το `Get Repository` αποθηκεύει την πλήρη απάντηση του GitHub στο `$github.repository` και επίσης εκθέτει
τα `$github.full_name`, `$github.default_branch`, `$github.private` και `$github.url`.

Το payload του repository συνήθως περιλαμβάνει:

- Ταυτότητα και ιδιοκτησία: ID, όνομα, πλήρες όνομα, περιγραφή, owner και ορατότητα
- Κατάσταση repository: private, fork, archived, disabled και default branch
- URLs: σελίδα GitHub, API, clone, SSH και Git URLs
- Δραστηριότητα και μέγεθος: timestamps δημιουργίας, ενημέρωσης και push, μέγεθος, stars, watchers, forks, subscribers και open issues
- Χαρακτηριστικά: issues, projects, wiki, Pages, discussions, topics, language και homepage
- Άδεια, ρυθμίσεις merge, δικαιώματα caller, ρυθμίσεις ασφαλείας και metadata fork parent/source όταν είναι διαθέσιμα

Ορισμένα πεδία διαχείρισης, δικαιωμάτων, merge και ασφαλείας εξαρτώνται από τα δικαιώματα repository
του διαπιστευτηρίου.

Παράδειγμα:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Οι λειτουργίες Issue υποστηρίζουν πεδία title/body και προαιρετικά πεδία JSON-array για labels και assignees.

Το `List Issues` επιστρέφει μόνο issues repository. Τα pull requests εξαιρούνται· χρησιμοποιήστε το `List Pull Requests` για αποτελέσματα PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Σημασιολογία πεδίων Edit Issue

Για το `Edit Issue`, μόνο τα πεδία που ορίζετε ρητά αποστέλλονται στο GitHub:

- **State** – Επιλέξτε `Don't change`, `Open` ή `Closed`. Αφήστε το μη ορισμένο για να διατηρήσετε την τρέχουσα κατάσταση.
- **State Reason** – Προαιρετικά ορίστε `Completed`, `Not Planned`, `Duplicate` ή `Reopened`.
- **Title / Body** – Αφήστε κενό για να διατηρήσετε την τρέχουσα τιμή.
- **Labels / Assignees** – Αφήστε το πεδίο κενό για να διατηρήσετε την τρέχουσα τιμή. Χρησιμοποιήστε `[]` για να καθαρίσετε όλα τα labels ή assignees. Χρησιμοποιήστε ένα JSON array όπως `["bug"]` για να τα αντικαταστήσετε.

Το `Edit Issue` απαιτεί τουλάχιστον ένα πεδίο προς αλλαγή κατά τον χρόνο εκτέλεσης. Εάν παρέχετε μόνο έναν αριθμό issue, η εκτέλεση αποτυγχάνει με σφάλμα επικύρωσης από το επίπεδο GitHub API.
## Κλείδωμα ζητήματος

Το `Lock Issue` δέχεται ένα προαιρετικό **Lock reason**. Όταν παρέχεται, πρέπει να είναι μία από τις υποστηριζόμενες τιμές του GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Αφήστε το reason κενό για κλείδωμα χωρίς συγκεκριμένο λόγο.

## Pull Requests

Η δημιουργία PR απαιτεί:

- Title
- Head branch
- Base branch
- Προαιρετικό body
- Προαιρετική λειτουργία draft

## Pull Request Reviews

Οι λειτουργίες review αντιστοιχούν στο pull request review API του GitHub:

| Λειτουργία | Απαιτούμενα πεδία | Προαιρετικά πεδία |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request number, event | Body, commit ID |
| `Get Review` | Pull request number, review ID | — |
| `List Reviews` | Pull request number | Per page |
| `Update Review` | Pull request number, review ID, body | — |

Το `Create Review` υποστηρίζει `Approve`, `Request Changes`, `Comment` και `Pending`.
Το body είναι απαραίτητο για `Request Changes` και `Comment`. Όταν το Commit ID είναι κενό, το GitHub
εξετάζει το τελευταίο commit του pull request.

## Releases

| Λειτουργία | Απαιτούμενα πεδία κατά την εκτέλεση | Συνήθως προαιρετικά |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

Το `Update Release` μπορεί να ορίσει ρητά τα `draft` / `prerelease` είτε σε `true` είτε σε `false`.

## Workflows

Οι λειτουργίες workflow υποστηρίζουν:

- Καταγραφή των workflow του repository
- Ανάκτηση ενός workflow μέσω αριθμητικού ID ή ονόματος αρχείου workflow
- Ενεργοποίηση ή απενεργοποίηση ενός workflow
- Ανάγνωση χρεώσιμης χρήσης workflow ανά λειτουργικό σύστημα runner
- Εκτέλεση ενός workflow με ref ή branch και προαιρετικό αντικείμενο JSON inputs

Το GitHub βρίσκεται στη διαδικασία κατάργησης του endpoint `Get Workflow Usage`. Τα workflow που
χρησιμοποιούν αυτή τη λειτουργία ενδέχεται να χρειαστεί να μεταναστεύσουν όταν το GitHub καταργήσει το endpoint.

Το `Dispatch Workflow` δέχεται και τις δύο μορφές απόκρισης του GitHub: την παλαιότερη `204 No Content` και τη νεότερη
απόκριση `200` που περιέχει `workflow_run_id`, `run_url` και `html_url`.

Το `Dispatch Workflow and Wait` εκτελεί το workflow και κάνει polling στο run μέχρι η κατάστασή του να γίνει
`completed`. Ρυθμίστε το timeout και το διάστημα polling σε δευτερόλεπτα. Το Heym χρησιμοποιεί
το `workflow_run_id` όταν το GitHub επιστρέφει τη νεότερη απόκριση `200`. Για την παραδοσιακή απόκριση `204 No
Content`, το Heym εντοπίζει το νεοδημιουργημένο run `workflow_dispatch` για το επιλεγμένο
workflow και ref, και στη συνέχεια περιμένει αυτό το run.

## File Contents

Το `Get File` διαβάζει ένα αρχείο του repository μέσω του contents API του GitHub και αποκωδικοποιεί το περιεχόμενο κειμένου όταν είναι διαθέσιμο. Τα δυαδικά αρχεία και το περιεχόμενο που δεν είναι UTF-8 ενδέχεται να επιστρέψουν metadata χωρίς αποκωδικοποιημένο πεδίο `content`.

Το `List Files` επιστρέφει τις καταχωρίσεις καταλόγου από το contents API του repository για μια δεδομένη διαδρομή φακέλου και προαιρετικό ref. Αφήστε το **Directory Path** κενό για να καταγραφεί η ρίζα του repository.

Το `Create or Update File` γράφει περιεχόμενο κειμένου σε μια διαδρομή του repository χρησιμοποιώντας:

- File path
- Commit message
- File content
- Προαιρετικό branch

Το `Delete File` αφαιρεί μια διαδρομή του repository χρησιμοποιώντας ένα commit message και προαιρετικό branch. Εάν το αρχείο υπάρχει, το Heym ανακτά αυτόματα το τρέχον SHA πριν το διαγράψει.

Εάν το αρχείο υπάρχει ήδη, το Heym ανακτά αυτόματα το τρέχον SHA πριν το ενημερώσει.

## Σελιδοποίηση

Τα `List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` και `Get User Repositories` υποστηρίζουν
**Per Page** (1–100). Το Heym ζητά μία σελίδα αποτελεσμάτων· δεν υπάρχει πεδίο `page` για την ανάκτηση
επιπλέον σελίδων στην ίδια λειτουργία.


### Return all pages

Ενεργοποιήστε το **Return all pages** ώστε μία εκτέλεση να ακολουθεί κάθε σελίδα, ξεκινώντας από το **Cursor** όταν έχει οριστεί. Κάθε αίτημα ζητά 100 στοιχεία, ανεξάρτητα από την τιμή του **Per Page**. Ο κόμβος σταματά μετά από περίπου 1.000 στοιχεία (ή 100 αιτήματα): τα αντικείμενα issue είναι περίπου 6 KB το καθένα, επομένως ένα μεγαλύτερο όριο θα παρήγαγε πολύ μεγάλες εξόδους κόμβου. Όταν σταματά νωρίτερα, επιστρέφει ό,τι έχει συλλέξει με `has_more: true` και ένα `next_cursor` αντί να προκαλέσει σφάλμα, και μπορείτε να συνεχίσετε περνώντας αυτόν τον δρομέα στην επόμενη εκτέλεση. Η διακοπή του Workflow ή η συμπλήρωση του χρονικού ορίου του τερματίζει τη λήψη ανάμεσα στις σελίδες.

## Έξοδος

Η ακριβής μορφή εξαρτάται από την επιλεγμένη λειτουργία. Συνήθη πεδία περιλαμβάνουν:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Αντικαταστήστε το `github` με την ετικέτα του node σας.

## Σημειώσεις

- Τα labels και οι assignees πρέπει να είναι έγκυρα JSON arrays όταν παρέχονται.
- Τα inputs του workflow dispatch πρέπει να είναι ένα έγκυρο JSON object όταν παρέχονται.
- Το `Edit Issue` χρησιμοποιεί το `state` μόνο όταν το ορίσετε ρητά· αφήστε το μη ορισμένο για να διατηρηθεί η τρέχουσα κατάσταση του ζητήματος.
- Τα δικαιώματα του GitHub API εξαρτώνται από τα token scopes ή τα fine-grained δικαιώματα repository που εκχωρείτε.

## Σχετικά

- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη και διαχείριση διαπιστευτηρίων GitHub
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίων GitHub και Enterprise `base_url`
- [Agent Node](./agent-node.md) – Χρήση διαπιστευτηρίων GitHub με `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Πλήρης κατάλογος nodes
