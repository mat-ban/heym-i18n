# Κόμβος Codex

Ο κόμβος **Codex** εκτελεί το OpenAI Codex CLI σε ένα απομονωμένο χώρο εργασίας του Heym, πάνω σε ένα αποθετήριο GitHub. Είναι σχεδιασμένος για εργασίες προγραμματισμού, όπως διόρθωση tests, επεξεργασία αρχείων, παραγωγή patch ή άνοιγμα draft pull request.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1, συν `question` |
| Διαπιστευτήριο | Codex access token + GitHub |
| Έξοδος | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Έλεγχος ταυτότητας

Το διαπιστευτήριο **OpenAI Codex** υποστηρίζει δύο λειτουργίες ελέγχου ταυτότητας:

| Λειτουργία | Περιγραφή |
|------|-------------|
| **Sign in with ChatGPT** (συνιστάται) | Σύνδεση OAuth (PKCE) που χρησιμοποιεί τη συνδρομή σας ChatGPT Plus/Pro, ώστε οι εκτελέσεις να **μην** επιβαρύνονται με κόστος API ανά token. Κάντε κλικ στο **Sign in with ChatGPT** στο παράθυρο διαλόγου του διαπιστευτηρίου, εξουσιοδοτήστε στον browser σας και έπειτα επικολλήστε το URL ανακατεύθυνσης `localhost:1455` πίσω στο Heym. Το Heym αποθηκεύει το προκύπτον token bundle και το ανανεώνει αυτόματα καθώς λήγει. |
| **Access token** | Επικολλήστε ένα ChatGPT/Codex `access_token` που χρησιμοποιείται μόνο από τον τοπικό Codex runner. |

Τα API keys δεν γίνονται δεκτά για το διαπιστευτήριο Codex. Ο κόμβος δεν υποβάλλει cloud Codex tasks· κλωνοποιεί το αποθετήριο εντός του runtime του Heym, γράφει το token bundle του ChatGPT σε ένα απομονωμένο `auth.json` (ή περνά το `CODEX_ACCESS_TOKEN`) μόνο στη διεργασία Codex και κρατά το token εκτός του `$credentials`.

Ο κόμβος απαιτεί επίσης ένα διαπιστευτήριο **GitHub** για την κλωνοποίηση ιδιωτικών αποθετηρίων, το push του working branch και τη δημιουργία draft pull requests.

Σε Docker deployments, το Heym εκτελεί το Codex μέσα σε ένα sibling container από το ίδιο Heym image (όχι ξεχωριστό GHCR image). Αυτό το container προσαρτά μόνο το volume του χώρου εργασίας του Codex και επιτρέπει στο δικό του bubblewrap sandbox του Codex να δημιουργήσει namespaces και ένα νέο `/proc`. Ο runner προσθέτει `SYS_ADMIN`, unconfined seccomp και AppArmor, καθώς και `systempaths=unconfined` (Docker Engine 25+). Χωρίς το τελευταίο flag, κάθε εντολή αποτυγχάνει πριν από την εκκίνηση με `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Αναφορές OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| Codex Credential | Διαπιστευτήριο OpenAI Codex (σύνδεση ChatGPT ή `access_token`) |
| GitHub Credential | Διαπιστευτήριο GitHub PAT που χρησιμοποιείται για την πρόσβαση στο αποθετήριο |
| Repository URL | URL αποθετηρίου GitHub μέσω HTTPS |
| Base Branch | Branch προς κλωνοποίηση πριν από την εκτέλεση του Codex, προεπιλογή `main` |
| Model | Προαιρετικό μοντέλο Codex (επεξεργάσιμο dropdown, π.χ. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`)· κενό χρησιμοποιεί το προεπιλεγμένο του Codex |
| Reasoning Effort | Βάθος συλλογισμού του Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` ή `ultra` (προεπιλογή `medium`) |
| Task Prompt | Εργασία προγραμματισμού για το Codex· υποστηρίζει εκφράσεις όπως `$input.text` |
| Publish Mode | Πώς παραδίδονται οι αλλαγές (δείτε τον πίνακα παρακάτω) |
| Branch Name | Working branch για τις λειτουργίες PR/commit, προεπιλογή `codex/$executionId` |
| Timeout | Μέγιστος χρόνος εκτέλεσης του Codex σε δευτερόλεπτα |

## Λειτουργίες δημοσίευσης

| Λειτουργία | Τι κάνει |
|------|--------------|
| `diff_only` | Επεξεργάζεται αρχεία τοπικά και επιστρέφει το patch και τα αρχεία που άλλαξαν. Δεν γίνεται push. |
| `draft_pr` | Κάνει commit στο branch, το κάνει push και ανοίγει ένα draft pull request. |
| `open_pr` | Κάνει commit στο branch, το κάνει push και ανοίγει ένα pull request έτοιμο για review (μη draft). |
| `commit_push` | Κάνει commit στο branch και το κάνει push, χωρίς άνοιγμα pull request. |
| `direct_commit` | Κάνει commit και push απευθείας στο base branch (χωρίς ξεχωριστό branch ή PR). |
| `open_or_update_pr` | Ενημερώνει το υπάρχον ανοιχτό PR του agent όταν υπάρχει — ακόμη και αν το όνομα του branch διαφέρει, ο runner το εντοπίζει με βάση author + base — διαφορετικά ανοίγει νέο. Ιδανικό για επανεκτελέσεις και οδηγίες «update the open PR». |
| `update_existing_pr` | Προσθέτει commit στο υπάρχον branch/PR· ανοίγει ένα αν δεν υπάρχει ακόμη. |
| `patch_artifact` | Αποθηκεύει το diff ως αρχείο προς λήψη και επιστρέφει `patchUrl`. Δεν γίνεται push. |

## Έξοδοι

| Κλειδί | Περιγραφή |
|-----|-------------|
| `status` | `completed` ή `needs_input` |
| `summary` | Η σύνοψη του Codex |
| `validation` | Σημειώσεις επικύρωσης, tests ή έλεγχοι που ανέφερε το Codex |
| `diff` | Git patch όταν άλλαξαν αρχεία |
| `changedFiles` | Διαδρομές αρχείων που άλλαξαν |
| `threadId` | Αναγνωριστικό thread/session του Codex όταν είναι διαθέσιμο |
| `branchName` | Όνομα του working branch |
| `pullRequestUrl` | URL του PR στις λειτουργίες `draft_pr`, `open_pr`, `open_or_update_pr` και `update_existing_pr` |
| `pushedBranch` | Το branch που έγινε push στις λειτουργίες commit/PR |
| `patchUrl` | Σύνδεσμος λήψης για το diff στη λειτουργία `patch_artifact` |
| `usage` | Μεταδεδομένα χρήσης που ανέφερε το Codex CLI όταν είναι διαθέσιμα |
## Στιγμιότυπα οθόνης UI σε pull requests

Για εργασίες UI/frontend, το Codex θα πρέπει να αποθηκεύει στιγμιότυπα οθόνης PNG σε μια διαδρομή που αγνοείται από το git, όπως `frontend/.e2e-artifacts/` (όχι στον πηγαίο κώδικα). Εάν λείπουν οι εξαρτήσεις του frontend, το Codex μπορεί να εκτελέσει `bun install` (ή npm/pnpm install) και να ξεκινήσει μια βραχύβια προεπισκόπηση/`bun run dev` αποκλειστικά για τη λήψη του στιγμιότυπου της διεπαφής. Το Heym ανεβάζει αυτές τις εικόνες σε ένα κοινόχρηστο GitHub **prerelease** (`codex-pr-assets`) ως assets με ονόματα `<branch>-…` και έπειτα τις ενσωματώνει στην περιγραφή του PR **πριν ανοίξει το pull request**, ώστε ένα νέο PR να δημιουργείται έχοντας ήδη τα στιγμιότυπα οθόνης του (τα υπάρχοντα PR ενημερώνονται επιτόπου). Το Codex πρέπει επίσης να ορίζει ένα ουσιαστικό `pull_request_title` (ποτέ placeholders όπως `Done.`).

Το Codex μερικές φορές τερματίζει μια εκτέλεση στη μέση της εργασίας («…Now let me take a screenshot»), γεγονός που θα οριστικοποιούσε την εκτέλεση πριν ληφθεί το στιγμιότυπο οθόνης. Για να αποτραπεί αυτό, το prompt του runner απαιτεί τη λήψη στιγμιοτύπων οθόνης **πριν** από το τελικό αποτέλεσμα, και εάν η εκτέλεση ολοκληρωθεί ακόμη χωρίς δημοσιεύσιμη σύνοψη ή με αλλαγή UI αλλά χωρίς στιγμιότυπο οθόνης, το Heym εκτελεί ένα ακόμη πέρασμα του Codex στον ίδιο χώρο εργασίας για να ολοκληρωθεί. Εάν μια αλλαγή UI εξακολουθεί να μην έχει στιγμιότυπο οθόνης μετά από αυτό, προστίθεται μια ορατή σημείωση στο σώμα του PR, ώστε το κενό να μην περνά ποτέ σιωπηλά.

## Τι δημοσιεύεται στο GitHub

Το **Task Prompt** σας αποτελεί ιδιωτικό input, όχι περιεχόμενο του PR. Μόνο δύο πράγματα δημοσιεύονται: μια ενότητα `## Change Summary` που περιγράφει τι κάνει η αλλαγή κώδικα και μια ενότητα `## Screenshots` όταν έχουν ληφθεί στιγμιότυπα οθόνης. Ο τίτλος του PR προκύπτει αποκλειστικά από τη σύνοψη αλλαγών.

Το prompt του runner δηλώνει αυτήν την πολιτική και το Heym την επιβάλλει επίσης μετά την εκτέλεση: πριν γίνει οποιαδήποτε δέσμευση ή άνοιγμα ως pull request, αφαιρεί ενότητες που επαναλαμβάνουν το prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) και οποιαδήποτε παράγραφο αντιγραμμένη αυτολεξεί από το task prompt, από τη σύνοψη, το σώμα του PR και το μήνυμα δέσμευσης. Η αφήγηση βημάτων όπως `Both pass. Let me do a final review:` απορρίπτεται επίσης ως τίτλος PR ή θέμα δέσμευσης.

## Ερωτήσεις παρακολούθησης

Εάν το Codex χρειάζεται απαιτήσεις που λείπουν ή μια απόφαση προϊόντος, επιστρέφει `needs_input`. Το Heym θέτει σε παύση την εκτέλεση και εκθέτει ένα output handle `question`. Συνδέστε αυτό το handle σε έναν κλάδο ειδοποίησης, για παράδειγμα Slack ή Send Email, για να στείλετε στον reviewer τον δημόσιο σύνδεσμο παρακολούθησης.

Όταν ο reviewer απαντήσει, το Heym συνεχίζει το ίδιο snapshot εκτέλεσης και το ίδιο thread του Codex από τα αποθηκευμένα μεταδεδομένα του χώρου εργασίας.

## Ως εργαλείο agent

Ο node Codex μπορεί να συνδεθεί στο tool handle ενός node **AI Agent**, ώστε ο agent να μπορεί να αναθέτει εργασίες κωδικοποίησης. Διαμορφώστε το διαπιστευτήριο, το GitHub credential και το repository στον node και έπειτα επισημάνετε το **Task Prompt** (και προαιρετικά το **Repository URL**) με τον διακόπτη που παρέχεται από τον agent, ώστε ο agent να τα παρέχει κατά τον χρόνο κλήσης. Όταν το Codex εκτελείται ως εργαλείο, ένα αποτέλεσμα `needs_input` επιστρέφεται ενσωματωμένα στον agent αντί να θέτει σε παύση το workflow, ώστε ο agent να μπορεί να βελτιώσει το αίτημα και να καλέσει ξανά το Codex.

## Παράδειγμα

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Σχετικά

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
