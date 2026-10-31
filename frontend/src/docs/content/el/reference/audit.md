# Καταγραφή Ελέγχου (Audit Logging)

Το Heym γράφει μια γραμμή ελέγχου για κάθε ενέργεια που σχετίζεται με την ασφάλεια: ποιος την εκτέλεσε, σε τι την εκτέλεσε και αν ήταν επιτυχής. Οι γραμμές καταγράφονται στην τυπική έξοδο (standard output) του backend μέσω του logger `winston.audit`, μαζί με το αρχείο καταγραφής πρόσβασης αιτημάτων (request access log), και μπορούν να διαβαστούν από την καρτέλα **Logs** ή με την εντολή `docker logs`.

Η καταγραφή ελέγχου είναι **πάντα ενεργή**. Δεν υπάρχει τίποτα να ενεργοποιηθεί και καμία μεταβλητή περιβάλλοντος να οριστεί.

## Μορφή Γραμμής

Μία ενέργεια παράγει ακριβώς μία αυτοτελή γραμμή:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Κάθε γραμμή φέρει τα εξής πεδία:

| Πεδίο | Περιγραφή |
|-------|-------------|
| `action` | Τι συνέβη, με τη μορφή `resource.verb` — δείτε τον παρακάτω πίνακα. |
| `outcome` | `success`, `failure` ή `denied`. |
| `actor_id` | UUID του χρήστη που εκτέλεσε την ενέργεια. Απουσιάζει μόνο όταν δεν ήταν κανείς authenticated. |
| `actor_email` | Email αυτού του χρήστη. Σε αποτυχημένη σύνδεση, αυτή είναι η διεύθυνση που δοκιμάστηκε, όχι επιβεβαιωμένος λογαριασμός. |
| `target` | Το αντικείμενο στο οποίο εκτελέστηκε η ενέργεια, με τη μορφή `type:uuid`. |
| `target_name` | Το όνομα του αντικειμένου σε αναγνώσιμη μορφή, σε εισαγωγικά όταν περιέχει κενά. |

Ακολουθούν πεδία ειδικά για κάθε ενέργεια — για παράδειγμα `credential_type`, `imported`, `grantee_email`, `team_name`. Οι τιμές που περιέχουν κενό, εισαγωγικό ή `=` περικλείονται σε εισαγωγικά· οι τιμές με μήκος μεγαλύτερο από 256 χαρακτήρες κόβονται με δείκτη `...(truncated)`.

## Ανάγνωση του Log

Ο audit logger είναι θυγατρικός του request logger, οπότε και οι δύο καταλήγουν στην ίδια ροή (stream) παραμένοντας διαχωρίσιμοι:

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Στην εφαρμογή, η καρτέλα **Logs** διαβάζει την ίδια έξοδο του container. Ελέγχεται από τη μεταβλητή `DOCKER_LOGS_ENABLED` και τη λίστα επιτρεπόμενων `DOCKER_LOGS_ALLOWED_EMAILS`.

## Τι Καταγράφεται

Κάθε αλλαγή κατάστασης καταγράφεται. Οι αναγνώσεις καταγράφονται μόνο όπου η ίδια η ανάγνωση αποτελεί ευαίσθητη ενέργεια — η προβολή του ιστορικού εκτελέσεων ενός workflow, το άνοιγμα ενός credential, η λήψη ενός αρχείου. Οι συνήθεις αναγνώσεις λιστών και λεπτομερειών δεν ελέγχονται· το access log καταγράφει ήδη ότι συνέβη ένα αίτημα, και ο έλεγχος κάθε `GET` θα έθαβε τις γραμμές που έχουν σημασία. Η μόνη εξαίρεση είναι οι [προβολές σελίδων](#page-views), οι οποίες καταγράφουν πού πλοηγήθηκε ένας συνδεδεμένος χρήστης στην εφαρμογή.

### Authentication

| Ενέργεια | Σημειώσεις |
|--------|-------|
| `auth.register` | `outcome=denied` όταν η εγγραφή είναι απενεργοποιημένη ή όταν η σύνδεση με κωδικό είναι ανενεργή (`reason=password_login_disabled`), `failure` όταν το email χρησιμοποιείται ήδη. |
| `auth.login` | Το `outcome=failure` καταγράφει τη διεύθυνση που δοκιμάστηκε και αν το email ήταν άγνωστο ή ο κωδικός λανθασμένος. |
| `auth.logout` | Ο actor προσδιορίζεται από το refresh cookie, οπότε μια αποσύνδεση χωρίς αυτό καταγράφεται χωρίς ταυτότητα. |
| `auth.token_refresh` | `outcome=denied` με `reason=refresh_token_replayed_or_revoked` — σήμα κλοπής token που αξίζει ειδοποίηση. |
| `auth.password_change` | `outcome=failure` όταν ο τρέχων κωδικός ήταν λανθασμένος. |
| `auth.sso_login` | Single sign-on. Το `outcome=failure` φέρει τον λόγο απόρριψης της απάντησης του παρόχου· το `denied` φέρει `email_not_verified`, `domain_not_allowed` ή `provisioning_disabled`. |
| `sso_settings.update` | Ένας διαχειριστής άλλαξε τη διαμόρφωση [SSO](./sso.md). Καταγράφει `enabled` και `password_login_disabled`, ποτέ το client secret. |
| `sso_settings.test` | Ένας διαχειριστής εκτέλεσε τη δοκιμή σύνδεσης SSO. |

### Προβολές σελίδων

Το `page.view` εγγράφεται κάθε φορά που ένας συνδεδεμένος χρήστης ανοίγει μια σελίδα στην εφαρμογή ιστού, με τη διαδρομή URL σε ένα πεδίο `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Η διαδρομή είναι η εσωτερική διαδρομή της εφαρμογής. Οι καρτέλες του πίνακα ελέγχου αποτελούν μέρος της (`/?tab=traces`), όπως και τα αναγνωριστικά που ονομάζουν αυτό που είναι ανοιχτό, όπως το `/workflows/<id>`. Διατηρείται μόνο μια σύντομη λίστα παραμέτρων ερωτήματος που προσδιορίζουν τη σελίδα (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`). Όλα τα άλλα στο string ερωτήματος και ολόκληρο το τμήμα απορρίπτονται. Οι σελίδες των οποίων ο σύνδεσμος φέρει μυστικό, όπως το `/review/<token>`, καταγράφονται με το σύμβολο κράτησης θέσης `:token` αντί για το μυστικό.

Το πρόγραμμα περιήγησης αναφέρει τη διαδρομή, επομένως μια γραμμή `page.view` δείχνει πού δήλωσε ο χρήστης ότι πήγε. Δεν αποδεικνύει ότι ο διακομιστής επέστρεψε αυτή τη σελίδα. Οι επισκέψεις στη σελίδα σύνδεσης και σε συνδέσμους που ανοίγουν ενώ είστε αποσυνδεδεμένοι δεν καταγράφονται, επειδή δεν συνδέεται χρήστης με αυτές.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

Το `workflow.run` εγγράφεται όταν ξεκινά μια εκτέλεση μέσω του API: το κουμπί Εκτέλεση του επεξεργαστή, το τελικό σημείο execute με περίοδο σύνδεσης, κλειδί API ή webhook, η πύλη συνομιλίας και τα εργαλεία MCP. Καταγράφει ποιος την ξεκίνησε, πώς και πώς τελείωσε:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

Το `execution_id` συνδέει τη γραμμή με την εκτέλεση στο Ιστορικό εκτελέσεων. Το `outcome` είναι `failure` όταν η εκτέλεση ολοκληρώθηκε με `error`, `cancelled` ή `timeout`. Μια εκτέλεση που διακόπτεται για ανθρώπινη αναθεώρηση ή διατηρείται στην ουρά ταυτόχρονης εκτέλεσης είναι μια γραμμή `success` με `status=pending` ή `status=queued`. Μια κλήση χωρίς συνδεδεμένο χρήστη, όπως ένα ανώνυμο webhook ή ένας επισκέπτης πύλης, δεν έχει `actor_id` ή `actor_email`. Οι είσοδοι και οι έξοδοι δεν εγγράφονται ποτέ.

Οι εκτελέσεις που ξεκινούν από χρονοδιάγραμμα, κόμβο trigger, ουρά ή συμβάν δεν αποτελούν γραμμές ελέγχου. Εκτελούνται σε οποιαδήποτε παρουσία τις διεκδίκησε και καταγράφονται στο Ιστορικό εκτελέσεων με την πηγή trigger και την παρουσία που τις εκτέλεσε.

Το `workflow.history_view` εγγράφεται όταν κάποιος ανοίγει το ιστορικό εκτελέσεων μιας ροής εργασίας. Η σύντομη αναζήτηση που εμφανίζει την τελευταία εκτέλεση ενός workflow στον καμβά ή σε μια λίστα δεν ελέγχεται.


Το `workflow.history_view` καταγράφει `owned=false` όταν ένας συνεργάτης διαβάζει το ιστορικό εκτελέσεων κάποιου άλλου. Το `workflow.delete` καταγράφει `outcome=denied` με `reason=not_owner` όταν ένας συνεργάτης επιχειρεί διαγραφή.

### Διαπιστευτήρια

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

Το `credential.detail_view` ελέγχεται επειδή το άνοιγμα ενός credential το αποκρυπτογραφεί. Μια αποτυχία καταγράφει `outcome=denied`, που είναι η εικόνα μιας απόπειρας απαρίθμησης credential-id.
### Άλλοι πόροι

| Πόρος | Ενέργειες |
|----------|---------|
| Μεταβλητές | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Διανυσματικοί χώροι αποθήκευσης | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Ειδοποιήσεις | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Πίνακες δεδομένων | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

Οι μαζικές ενέργειες καταγράφονται μία φορά ανά αίτημα με πλήθος, όχι μία φορά ανά γραμμή. Μια εισαγωγή CSV 5.000 γραμμών παράγει μία γραμμή `data_table.import_csv` που φέρει τα `imported`, `rejected` και `total`.

## Τα Μυστικά Δεν Καταγράφονται Ποτέ

Μια γραμμή ελέγχου καταγράφει αναγνωριστικά, ονόματα και πλήθη. Δεν καταγράφει ποτέ τα περιεχόμενα ενός διαπιστευτηρίου, την τιμή μιας μεταβλητής, έναν κωδικό πρόσβασης ή ένα token.

Δύο πράγματα το επιβάλλουν αυτό. Τα σημεία κλήσης είναι γραμμένα ώστε να περνούν μόνο ασφαλή πεδία, και ο βοηθός ελέγχου αποκρύπτει ως δικλείδα ασφαλείας: οποιοδήποτε πεδίο του οποίου το όνομα περιέχει `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` ή παρόμοιο αντικαθίσταται με `***` πριν κατασκευαστεί η γραμμή. Η υπερβολική απόκρυψη είναι σκόπιμη — μια μη χρήσιμη γραμμή είναι καλύτερη από ένα διαρρεύσαν διαπιστευτήριο.

Όπου ένα μυστικό είναι πραγματικά σχετικό με την εγγραφή, καταγράφεται μόνο η μορφή του. Μια κοινή χρήση αρχείου καταγράφει `password_protected=true`, ποτέ τον κωδικό πρόσβασης.

## Heym Work

Όταν εκτελείτε το Heym Work παράλληλα με το Heym, το Work εκπέμπει γραμμές ελέγχου στο stdout του δικού του κοντέινερ στην ίδια μορφή Winston:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Το Work καταγράφει τις ενέργειες των χρηστών σε σελίδες, πίνακες και εγγραφές:

| Ενέργεια | Σημασία |
|---|---|
| `page.create`, `page.update`, `page.delete` | Αλλαγές σε σελίδες και διατάξεις πίνακα ελέγχου |
| `board.column_create`, `board.column_move`, `board.column_delete` | Αλλαγές διάταξης στηλών Kanban |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Συμβάντα κύκλου ζωής καρτών |
| `record.create`, `record.update`, `record.delete` | Μεταλλάξεις εγγραφών πίνακα δεδομένων μέσω του Work |
| `chat.message` | Προτροπή χρήστη που στάλθηκε στον βοηθό Work |
| `export.csv`, `export.json` | Εξαγωγές δεδομένων |

Κάθε γραμμή φέρει τα ίδια πεδία `actor_id`, `actor_email`, `timestamp` και `outcome` με τις γραμμές ελέγχου του Heym, ώστε οι συλλέκτες αρχείων καταγραφής να μπορούν να αναλύσουν και τα δύο με έναν ενιαίο αγωγό.

## Διατήρηση

**Οι γραμμές ελέγχου υπάρχουν μόνο όσο διαρκεί η έξοδος καταγραφής του container.** Δεν εγγράφονται στη βάση δεδομένων. Η επαναδημιουργία του backend container απορρίπτει τις καταγραφές του.

Εάν χρειάζεστε ιστορικό ελέγχου που επιβιώνει από μια επανανάπτυξη, διοχετεύστε το stdout του container κάπου ανθεκτικό — έναν log driver, έναν sidecar collector ή τη συγκέντρωση καταγραφών της πλατφόρμας σας — με τον ίδιο τρόπο που θα κάνατε για οποιαδήποτε άλλη καταγραφή container.

## Για Συνεισφέροντες

Η εκπομπή μιας γραμμής ελέγχου απαιτεί μία κλήση:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

Ο βοηθός είναι σύγχρονος, δεν αγγίζει καμία βάση δεδομένων και καταπίνει τα δικά του σφάλματα, ώστε μια κλήση ελέγχου να μην μπορεί να αποτύχει ή να επιβραδύνει ένα αίτημα.

Τρεις κανόνες κατά την προσθήκη μιας:

1. **Ονομάστε την ενέργεια `resource.verb` σε snake_case.** Το `backend/tests/test_audit_log.py` διατρέχει κάθε κλήση `audit()` κάτω από το `app/api/` και αποτυγχάνει το build σε ένα όνομα που δεν ταιριάζει, και σε έναν καλυμμένο πόρο που έχει χάσει όλα τα σημεία κλήσης του.

2. **Διαβάστε μόνο χαρακτηριστικά που είναι σίγουρα παρόντα.** Το `try/except` του βοηθού προστατεύει το δικό του σώμα, όχι τις εκφράσεις που του περνάτε — ένα `AttributeError` στο `target_name=workflow.name` εγείρεται στο σημείο κλήσης, πριν εκτελεστεί το `audit()`, και θα σπάσει το αίτημα. Διαβάστε στήλες ORM και τοπικές μεταβλητές, όχι προαιρετικά ή αργά φορτωμένα χαρακτηριστικά.

3. **Καταγράψτε τη διαγραφή πριν τη διαγραφή.** Μετά το `db.delete(row)` το όνομα και το id που θέλετε να καταγράψετε μπορεί να έχουν χαθεί. Τοποθετήστε την κλήση πάνω από αυτό.
