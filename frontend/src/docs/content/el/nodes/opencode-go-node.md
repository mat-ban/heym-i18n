# Κόμβος OpenCode Go

Ο κόμβος **OpenCode Go** εκτελεί το CLI του [OpenCode](https://opencode.ai) (Go) σε ένα απομονωμένο, ενισχυμένο container του Heym, με αντικείμενο ένα αποθετήριο GitHub. Όπως ο κόμβος Codex, είναι σχεδιασμένος για εργασίες προγραμματισμού, όπως διόρθωση δοκιμών, επεξεργασία αρχείων, παραγωγή patch ή άνοιγμα pull request — αλλά χρησιμοποιεί την ανεξάρτητη από πάροχο πύλη μοντέλων **OpenCode Go** αντί για το OpenAI Codex.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | Κλειδί API του OpenCode Go + GitHub |
| Έξοδος | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Έλεγχος ταυτότητας

Το διαπιστευτήριο **OpenCode Go** αποθηκεύει ένα **κλειδί API** της πύλης OpenCode Go (από το [opencode.ai/go](https://opencode.ai/go)) και ένα προαιρετικό **Gateway Base URL** (προεπιλογή: `https://opencode.ai/zen/go/v1`· παρακάμψτε το μόνο για αυτο-φιλοξενούμενη ή proxied πύλη).

Ο κόμβος απαιτεί επίσης ένα διαπιστευτήριο **GitHub** για την κλωνοποίηση ιδιωτικών αποθετηρίων, το push του working branch και τη δημιουργία pull requests. Το token του GitHub **δεν τοποθετείται ποτέ μέσα στο sandbox container** — το Heym εκτελεί όλες τις ενέργειες git και GitHub στον host, ώστε ο παραγόμενος κώδικας να μην μπορεί να διαρρεύσει διαπιστευτήρια push.

## Απομόνωση και ασφάλεια

Η απομόνωση εκτέλεσης επιλέγεται από τη μεταβλητή `HEYM_OPENCODE_CLI_COMMAND`, ακριβώς όπως στον κόμβο Codex:

- **Τοπική ανάπτυξη (`run.sh`)** την αφήνει στην προεπιλεγμένη τιμή `opencode`, οπότε το OpenCode εκτελείται ως υποδιεργασία του host με αντικείμενο τον κλωνοποιημένο χώρο εργασίας — χωρίς ανάγκη για Docker, χωρίς πρόσθετες παραμέτρους.
- **Αναπτύξεις Docker (`deploy.sh` και το ενιαίο image GHCR)** την ορίζουν σε `/usr/local/bin/heym-opencode-docker`, ένα wrapper που εκτελεί το `opencode run` μέσα σε ένα **ενισχυμένο, εφήμερο sibling container** που μοιράζεται το named volume του χώρου εργασίας του OpenCode.

Το ενισχυμένο runner container απορρίπτει όλες τις δυνατότητες Linux, ορίζει `no-new-privileges`, χρησιμοποιεί read-only root με tmpfs `/tmp` και εφαρμόζει όρια σε pid/memory/CPU. Η δικτυακή έξοδος επιτρέπεται (το OpenCode πρέπει να φτάσει στην πύλη μοντέλων). Το **token του GitHub δεν τοποθετείται ποτέ μέσα στο container** — όλες οι ενέργειες git και GitHub εκτελούνται στην πλευρά του host, οπότε μόνο το κλειδί API του OpenCode και τα αρχεία του αποθετηρίου βρίσκονται ποτέ στο εσωτερικό.

Το OpenCode επεξεργάζεται μόνο αρχεία στον δίσκο· το Heym κατέχει κάθε ενέργεια git/GitHub.

## Μοντέλα

Η λίστα μοντέλων του OpenCode Go αλλάζει συχνά, οπότε το πεδίο **Model** συμπληρώνεται ζωντανά από τη λίστα μοντέλων της πύλης (`GET https://opencode.ai/zen/go/v1/models`) και εμφανίζεται ως αναζητήσιμο dropdown. Εάν η ζωντανή λίστα δεν είναι διαθέσιμη, χρησιμοποιείται μια ενσωματωμένη εφεδρική λίστα. Τα αναγνωριστικά μοντέλων χρησιμοποιούν τη μορφή `opencode-go/<model>` (για παράδειγμα `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — το `opencode-go` είναι το αναγνωριστικό παρόχου του CLI του OpenCode για την πύλη Go. Αφήστε το πεδίο κενό για να χρησιμοποιηθεί η προεπιλογή του runner (`opencode-go/kimi-k3`). Τα αναγνωριστικά μοντέλων που έχουν αποθηκευτεί στην παλαιότερη μορφή `opencode/<model>` ξαναγράφονται αυτόματα κατά τον χρόνο εκτέλεσης.

## Πεδία

| Πεδίο | Περιγραφή |
|-------|-------------|
| OpenCode Go Credential | Διαπιστευτήριο OpenCode Go (κλειδί API της πύλης) |
| GitHub Credential | Διαπιστευτήριο PAT του GitHub που χρησιμοποιείται για την πρόσβαση στο αποθετήριο |
| Repository URL | HTTPS URL αποθετηρίου GitHub· υποστηρίζει εκφράσεις |
| Base Branch | Branch που κλωνοποιείται πριν εκτελεστεί το OpenCode, προεπιλογή `main` |
| Model | Μοντέλο OpenCode Go (ζωντανό αναζητήσιμο dropdown, `opencode-go/<model>`)· κενό χρησιμοποιεί την προεπιλογή του runner |
| Reasoning Variant | Προαιρετικό· αντιστοιχίζεται στο `opencode run --variant` για μοντέλα που υποστηρίζουν reasoning effort |
| Task Prompt | Εργασία προγραμματισμού για το OpenCode· υποστηρίζει εκφράσεις όπως `$input.text` |
| Publish Mode | Πώς παραδίδονται οι αλλαγές (δείτε τον πίνακα παρακάτω) |
| Branch Name | Working branch για τις λειτουργίες PR/commit, προεπιλογή `opencode/$executionId` |
| Timeout | Μέγιστος χρόνος εκτέλεσης του OpenCode σε δευτερόλεπτα |

## Λειτουργίες δημοσίευσης

| Λειτουργία | Τι κάνει |
|------|--------------|
| `diff_only` | Επεξεργάζεται αρχεία τοπικά και επιστρέφει το patch και τα αρχεία που άλλαξαν. Τίποτα δεν γίνεται push. |
| `draft_pr` | Κάνει commit στο branch, το κάνει push και ανοίγει draft pull request. |
| `open_pr` | Κάνει commit στο branch, το κάνει push και ανοίγει pull request έτοιμο για review (μη-draft). |
| `commit_push` | Κάνει commit στο branch και το κάνει push, χωρίς να ανοίξει pull request. |
| `direct_commit` | Κάνει commit και push απευθείας στο base branch (χωρίς ξεχωριστό branch ή PR). |
| `open_or_update_pr` | Ενημερώνει το υπάρχον ανοιχτό PR του agent όταν υπάρχει — ακόμη και αν το όνομα του branch διαφέρει, ο runner το βρίσκει με βάση τον author + το base — διαφορετικά ανοίγει νέο. Ιδανικό για επανεκτελέσεις και οδηγίες «ενημέρωσε το ανοιχτό PR». |
| `update_existing_pr` | Προσθέτει commit στο υπάρχον branch/PR· ανοίγει ένα αν δεν υπάρχει ακόμη. |
| `patch_artifact` | Αποθηκεύει το diff ως λήψιμο αρχείο και επιστρέφει `patchUrl`. Τίποτα δεν γίνεται push. |

## Έξοδοι

| Κλειδί | Περιγραφή |
|-----|-------------|
| `status` | Πάντα `completed` (ο κόμβος OpenCode Go δεν σταματά για είσοδο) |
| `summary` | Το τελικό μήνυμα του OpenCode |
| `validation` | Σημειώσεις επικύρωσης όταν αναφέρονται |
| `diff` | Git patch όταν άλλαξαν αρχεία |
| `changedFiles` | Διαδρομές αρχείων που άλλαξαν |
| `branchName` | Όνομα του working branch |
| `pullRequestUrl` | URL του PR στις λειτουργίες `draft_pr`, `open_pr`, `open_or_update_pr` και `update_existing_pr` |
| `pushedBranch` | Branch που έγινε push στις λειτουργίες commit/PR |
| `patchUrl` | Σύνδεσμος λήψης για το diff στη λειτουργία `patch_artifact` |
## Στιγμιότυπα οθόνης UI σε pull requests

Για εργασίες UI/frontend, το OpenCode θα πρέπει να αποθηκεύει στιγμιότυπα οθόνης PNG σε μια διαδρομή που αγνοείται από το git, όπως `frontend/.e2e-artifacts/` (όχι στον πηγαίο κώδικα). Εάν λείπουν οι εξαρτήσεις του frontend, το prompt του runner επιτρέπει μια στοχευμένη εγκατάσταση πακέτων (για παράδειγμα `bun install`) καθώς και μια βραχύβια προεπισκόπηση/`bun run dev` αποκλειστικά για τη λήψη του UI. Το Heym ανεβάζει αυτές τις εικόνες σε ένα κοινόχρηστο GitHub **prerelease** (`opencode-pr-assets`) ως assets με ονόματα `<branch>-…`, και έπειτα τις ενσωματώνει στην περιγραφή του PR **πριν ανοίξει το pull request**, ώστε ένα νέο PR να δημιουργείται έχοντας ήδη τα στιγμιότυπα οθόνης του (τα υπάρχοντα PR ενημερώνονται επί τόπου).

Το OpenCode επίσης καθοδηγείται να τελειώνει με μια γραμμή `PR_TITLE: …`, ώστε το Heym να μπορεί να ανοίξει το pull request με ένα ουσιαστικό θέμα αντί για placeholders όπως `Done.`

Το OpenCode μερικές φορές τελειώνει μια στροφή στη μέση της εργασίας ("…Now let me take a screenshot"), κάτι που θα οριστικοποιούσε την εκτέλεση πριν ληφθεί το στιγμιότυπο οθόνης. Για να αποτραπεί αυτό, το prompt του runner απαιτεί τη λήψη στιγμιότυπων οθόνης **πριν** από το τελικό μήνυμα, και εάν η εκτέλεση ολοκληρωθεί ακόμη χωρίς δημοσιεύσιμη σύνοψη ή με αλλαγή UI αλλά χωρίς στιγμιότυπο οθόνης, το Heym εκτελεί ένα ακόμη πέρασμα του OpenCode στον ίδιο χώρο εργασίας για να ολοκληρωθεί. Εάν μια αλλαγή UI εξακολουθεί να μην έχει στιγμιότυπο οθόνης μετά από αυτό, προστίθεται μια ορατή σημείωση στο σώμα του PR, ώστε το κενό να μην περνά ποτέ σιωπηλά.

## Τι δημοσιεύεται στο GitHub

Το **Task Prompt** σας είναι ιδιωτικό δεδομένο εισόδου, όχι περιεχόμενο του PR. Μόνο δύο πράγματα δημοσιεύονται: μια ενότητα `## Change Summary` που περιγράφει τι κάνει η αλλαγή κώδικα, και μια ενότητα `## Screenshots` όταν έχουν ληφθεί στιγμιότυπα οθόνης. Ο τίτλος του PR προκύπτει αποκλειστικά από τη σύνοψη αλλαγών.

Το prompt του runner δηλώνει αυτή την πολιτική, και το Heym την επιβάλλει επίσης μετά την εκτέλεση: πριν γίνει commit ή άνοιγμα ως pull request, αφαιρεί ενότητες που επαναλαμβάνουν το prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) και οποιαδήποτε παράγραφο αντιγραμμένη αυτολεξεί από το task prompt, από τη σύνοψη, το σώμα του PR και το μήνυμα του commit.

Το Heym διαβάζει την ενότητα `## Change Summary` από τα μηνύματα του agent αντί να παίρνει ό,τι ειπώθηκε τελευταίο, επειδή το OpenCode εκπέμπει ένα μήνυμα ανά βήμα και το τελικό είναι συχνά σχολιασμός στα μέσα της εκτέλεσης. Η αφήγηση βημάτων (`Both pass. Let me do a final review:`) επίσης απορρίπτεται ως τίτλος PR ή θέμα commit. Εάν η εκτέλεση δεν παράγει χρησιμοποιήσιμη σύνοψη αλλαγών, το pull request καταφεύγει στην απαρίθμηση των αλλαγμένων αρχείων αντί να δημοσιεύει σχολιασμό.

## Ως εργαλείο agent

Ο node OpenCode Go μπορεί να συνδεθεί στη λαβή εργαλείου ενός node **AI Agent**, ώστε ο agent να μπορεί να αναθέτει εργασίες κωδικοποίησης. Διαμορφώστε το διαπιστευτήριο, το διαπιστευτήριο GitHub και το αποθετήριο στον node, και έπειτα επισημάνετε το **Task Prompt** (και προαιρετικά το **Repository URL**) με τον διακόπτη που παρέχει ο agent, ώστε ο agent να τα παρέχει κατά τον χρόνο κλήσης.

## Παράδειγμα

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Σχετικά

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
