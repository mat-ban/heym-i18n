# Πίνακας

Η καρτέλα **Πίνακας** είναι ένας agentic πίνακας kanban. Η εργασία κινείται μέσα από στήλες και κάθε
στήλη μπορεί να εκτελεί workflows του Heym. Μια κάρτα δεν είναι απλώς μια εργασία — είναι μια επίμονη
agentic εργασία που μεταφέρει context, ιστορικό συνομιλίας, κατάσταση εκτέλεσης, εξόδους
και εκτελέσεις workflow.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Πίνακες και στήλες

- Μπορείτε να δημιουργήσετε όσους πίνακες χρειάζεστε. Ένας νέος πίνακας ξεκινά με τις προεπιλεγμένες
  στήλες **Backlog → Planning → Development → Done**.
- Κάθε πίνακας χρειάζεται ένα **Agentic Kanban Model** (ένα διαπιστευτήριο συν ένα μοντέλο). Είναι
  υποχρεωτικό — το παράθυρο διαλόγου Νέου πίνακα δεν θα δημιουργήσει πίνακα χωρίς αυτό, και ένας πίνακας
  που δεν έχει κανένα διατηρεί τις ενέργειές του απενεργοποιημένες — επειδή είναι το μοντέλο που αντιστοιχίζει κάθε
  κάρτα στις εισόδους των workflows που εκτελεί και μετατρέπει την έξοδό τους πίσω σε
  αναγνώσιμο κείμενο.
- Το εικονίδιο γραναζιού στην κεφαλίδα του πίνακα ανοίγει τις ρυθμίσεις του πίνακα: όνομα, περιγραφή
  (εμφανίζεται κάτω από την κεφαλίδα) και το Agentic Kanban Model.
- Οι στήλες είναι πλήρως επεξεργάσιμες: προσθέστε, μετονομάστε, αλλάξτε χρώμα, αναδιατάξτε ή διαγράψτε τις από τις
  ρυθμίσεις στήλης (μια στήλη πρέπει να είναι κενή πριν μπορεί να διαγραφεί).
- Οι κάρτες ταξινομούνται κατακόρυφα κατά προτεραιότητα — σύρετε για αναδιάταξη.
- Μπορείτε επίσης να δημιουργήσετε μια κάρτα από την [καρτέλα Chat](./chat-tab.md) με ένα αίτημα
  σε φυσική γλώσσα. Το Chat σάς ζητά να επιλέξετε έναν πίνακα όταν χρειάζεται και πάντα προσθέτει την κάρτα στην πρώτη
  στήλη αυτού του πίνακα.

## Κοινοποίηση πίνακα

Οι ρυθμίσεις του πίνακα επίσης κοινοποιούν τον πίνακα σε **χρήστες** (μέσω email) και σε **ομάδες**, με
άδεια `read` ή `write`:

- **read** — ο πίνακας και οι κάρτες του είναι ορατά, αλλά τίποτα δεν μπορεί να αλλάξει: όχι νέες
  κάρτες, όχι μετακινήσεις, όχι σχόλια, όχι εκτελέσεις.
- **write** — πλήρης χρήση του πίνακα: κάρτες, μετακινήσεις, σχόλια και εκτελέσεις.
- Μόνο ο **ιδιοκτήτης** βλέπει το γρανάζι και τα κουμπιά διαγραφής, και μόνο ο ιδιοκτήτης μπορεί να αλλάξει τις
  ρυθμίσεις του πίνακα, το Agentic Kanban Model ή τις κοινοποιήσεις του.

Οι αλυσίδες σε έναν κοινόχρηστο πίνακα εκτελούνται πάντα με τα διαπιστευτήρια και το Agentic Kanban
Model του **ιδιοκτήτη**, ώστε οι συνεργάτες να μην χρειάζονται ποτέ τα δικά τους.

## Συνημμένα κάρτας

Ανοίξτε μια κάρτα και χρησιμοποιήστε το **Attach file** για να προσθέσετε αρχεία σε αυτήν — αποθέστε τα στο πλαίσιο ή επιλέξτε τα
με το κουμπί, και αφαιρέστε τα από την ίδια λίστα. Τα συνημμένα αποθηκεύονται στο
[Drive](./drive-tab.md).

Κάθε εκτέλεση **επιλύει τα συνημμένα πριν ξεκινήσουν τα workflows**, ανά τύπο:

- **Έγγραφα** (pdf, markdown, csv, json, text) εξάγονται σε κείμενο, με όριο 20.000
  χαρακτήρες ανά αρχείο, στο πεδίο `text` του συνημμένου.
- **Εικόνες** παραδίδονται ως `url` που η διαδρομή όρασης φορτώνει απευθείας (η είσοδος εικόνας ενός node LLM
  το δέχεται ως έχει).
- **Οτιδήποτε άλλο** περνά ως απλή αναφορά (`name`, `url`, `mime_type`).

Τα workflows τα διαβάζουν στο `$input.card.attachments` (και πάντα στο `$input.board.attachments`,
ανεξάρτητα από το τι αντιστοίχισε ο mapper). Το Agentic Kanban Model βλέπει το εξαγόμενο κείμενο και τα URL
των εικόνων επίσης, ώστε να μπορεί να αντιστοιχίσει ένα συνημμένο απευθείας στο πεδίο που αναμένει ένα workflow.

## Αλυσίδες workflow στηλών

Κάθε στήλη μπορεί να ρυθμιστεί με μια **διατεταγμένη λίστα workflows** (την αλυσίδα).
Όταν μια κάρτα μετακινείται σε μια στήλη που έχει αλυσίδα:

1. Η αλυσίδα ξεκινά αυτόματα στο παρασκήνιο — η ίδια η μετακίνηση δεν περιμένει ποτέ.
2. Τα workflows εκτελούνται **διαδοχικά**. Η έξοδος κάθε workflow προσαρτάται στο context
   της κάρτας πριν ξεκινήσει το επόμενο.
3. Αν ένα workflow αποτύχει, η αλυσίδα σταματά: οι υπόλοιποι κρίκοι παραλείπονται και η
   κάρτα γίνεται **κόκκινη**.
4. Όταν κάθε κρίκος πετύχει, η κάρτα γίνεται **πράσινη**. Ενώ η αλυσίδα εκτελείται
   η κάρτα πάλλεται **πορτοκαλί**· μια εκτέλεση που έχει παυθεί για ανθρώπινη αξιολόγηση εμφανίζει μια στατική πορτοκαλί
   κατάσταση.

Οι εκτελέσεις καταγράφονται στο [Execution History](../reference/execution-history.md) με
την πηγή trigger `board`, και κάθε κάρτα διατηρεί τη δική της λίστα εκτελέσεων με εξόδους
και σφάλματα ανά workflow. Ανοίξτε μια κάρτα ενώ εκτελείται ένα workflow και επιλέξτε **Open live** δίπλα
στην εκτέλεση για να προσαρτήσετε τον editor σε αυτήν την ακριβή εκτέλεση. Η ίδια κινούμενη εικόνα canvas, τα σταδιακά
Debug logs και το τελικό αποτέλεσμα εμφανίζονται χωρίς να ξεκινήσει δεύτερη εκτέλεση.
## Τι λαμβάνουν τα workflows

Η αλυσίδα μεταβιβάζει ένα τυπικό payload ως είσοδο του workflow. Διαβάστε το με κανονικές
[εκφράσεις](../reference/expression-dsl.md) όπως `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — κάθε σχόλιο στην κάρτα, από το παλαιότερο πρώτα.
- `history` — το πλήρες χρονολόγιο δραστηριότητας (σχόλια, μετακινήσεις, outputs), με όριο τις
  200 πιο πρόσφατες εγγραφές.
- `previous_outputs` — outputs από προηγούμενες ολοκληρωμένες εκτελέσεις (προηγούμενες στήλες και
  επόμενοι γύροι).
- `chain.previous_workflow_outputs` — outputs προηγούμενων συνδέσμων στην *τρέχουσα*
  αλυσίδα.
- Στους επόμενους γύρους το `move` είναι `null` και το `rerun` είναι `true`.

## Ο βρόχος σχεδιασμού (επόμενοι γύροι)

Ένα συνηθισμένο μοτίβο είναι να τοποθετήσετε ένα workflow σχεδιασμού στη **δεύτερη στήλη** (από προεπιλογή
ονομάζεται Planning — το όνομα δεν έχει σημασία· η θέση έχει). Αυτό το workflow εμπλουτίζει την
κάρτα και θέτει ερωτήσεις παρακολούθησης:

1. Μετακινήστε μια κάρτα στη δεύτερη στήλη — το workflow γράφει έναν εμπλουτισμένο σχεδιασμό και τις
   ερωτήσεις του πίσω στην κάρτα ως output.
2. Απαντήστε στο νήμα σχολίων της κάρτας. Η απάντηση απελευθερώνει την κάρτα: προχωρά στην
   επόμενη στήλη, η οποία την παραλαμβάνει με την απάντηση στο πλαίσιο. Η αλυσίδα της δεύτερης στήλης
   δεν εκτελείται ξανά.
3. Για να βελτιώσετε τον σχεδιασμό επί τόπου, πατήστε **Run follow-up round**. Η ίδια
   αλυσίδα εκτελείται ξανά με όλο το συσσωρευμένο πλαίσιο, και στη συνέχεια η κάρτα περιμένει σε αυτή τη στήλη
   μέχρι να προσθέσετε ένα σχόλιο για να την απελευθερώσετε.

Η πύλη σχεδιασμού είναι θεσική, όχι βασισμένη σε όνομα: η αριστερότερη στήλη και η στήλη
αμέσως δεξιά της δεν προχωρούν ποτέ μόνες τους — εκτελούν την αλυσίδα τους και περιμένουν
εκεί για εσάς (ένα σχόλιο απελευθερώνει τη δεύτερη στήλη). Από την τρίτη στήλη και μετά, μια
επιτυχημένη αλυσίδα προωθεί την κάρτα προς τα δεξιά μόνη της, μέχρι την τελευταία
στήλη. Η μετονομασία ή η αφαίρεση της προεπιλεγμένης ετικέτας "Planning" δεν αλλάζει ποια θέση
είναι η πύλη. Μια κάρτα μπορεί να έχει μόνο μία ενεργή εκτέλεση κάθε φορά.

## Human-in-the-loop και ερωτήσεις Codex

Εάν ένα workflow της αλυσίδας παύσει — σε έναν node [Human-in-the-Loop](../reference/human-in-the-loop.md),
σε ένα εργαλείο HITL ενός agent, ή επειδή ένας node [Codex](../nodes/codex-node.md) χρειάζεται
περισσότερες πληροφορίες — η εκτέλεση διατηρείται ως εκκρεμής και η κάρτα εμφανίζει την κεχριμπαρένια κατάσταση
εκκρεμότητας. Κάθε παύση διατηρεί τη δική της επιφάνεια απάντησης: έναν σύνδεσμο αξιολόγησης HITL για το HITL, την οθόνη
παρακολούθησης Codex για το Codex.

Μόλις απαντήσετε, η αλυσίδα συνεχίζεται μόνη της: το workflow που είχε παύσει ολοκληρώνεται, το output του
προσγειώνεται στην κάρτα, το υπόλοιπο της αλυσίδας αυτής της στήλης εκτελείται και η κάρτα προχωρά ως συνήθως.
Εάν η εκτέλεση που συνεχίστηκε αποτύχει, η κάρτα γίνεται κόκκινη και οι υπόλοιποι σύνδεσμοι παραλείπονται.

## Σχετικά

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)

- **Advance cards automatically** in the board settings is on by default. Turn it off for
  a plain team task board: cards then stay in the column people put them in, and column
  workflows still run when a card enters their column.
- You can also manage the board from the [Chat tab](./chat-tab.md) or any MCP client; see
  [From Chat and MCP](#from-chat-and-mcp).

## Card details

Card details open in a wide dialog on desktop and fit the viewport on phones.
Use **Preview** beside **Description** to view Markdown formatting, including unsaved
edits. Choose **Edit** to return to the source text, then **Save description** to keep
your changes. Label chips use brighter text in dark mode; hover over a shortened label
to read its full name.

Open a card to set its **Details**:

- **Assignee** — anyone who can open the board: its owner, and the people and team
  members it is shared with.
- **Priority** — Urgent, High, Medium or Low.
- **Due date** — the card shows it as a chip, amber when it is due today and red when it
  is overdue.
- **Labels** — up to ten short labels, such as a client or a project.

Column workflows receive these fields in the card's `metadata` (`assignee_user_id`,
`priority`, `due_date`, `labels`).

If someone else changes the card while you edit it, saving shows a notice and loads their
version instead of overwriting it. An open board checks for changes made elsewhere (by a
teammate, in Heym Work, from Chat or MCP) every few seconds and redraws.

Moving a card that waits for a review asks first: the move cancels that review. A move
never approves a review; reviews are approved only from the review itself.

## From Chat and MCP

The [Chat tab](./chat-tab.md), Heym Work's chat, and any MCP client through `heym_chat`
can manage boards in plain language, with the same permissions as the Board tab:

- list boards, read a board's columns and cards, and list cards across boards filtered by
  assignee ("my tasks"), column, priority, due date (overdue, today, this week), label or
  review state;
- create a board (Chat turns off automatic advancing for a plain task board), rename it or
  change its settings, and delete it after you confirm its name (owner only). A board Chat
  creates uses the chat's credential and model as its Agentic Kanban Model; ask Chat to
  give its model to one of your boards that has none, such as a board made before this;
- add, rename, reorder and delete columns;
- add, edit, assign, move, reorder and delete cards;
- comment on a card, as you. A comment on a card waiting at the planning step answers its
  agent's questions, and the card moves on, as in the card's own comment box. A comment
  never approves a review.
