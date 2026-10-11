# Εκτέλεση & Ανάπτυξη

Το Heym παρέχει δύο scripts για διαφορετικά περιβάλλοντα: το `run.sh` για τοπική ανάπτυξη και το `deploy.sh` για deployments παραγωγής με χρήση Docker Compose.

> **Βίντεο παρουσίασης:** [Ρύθμιση του Heym τοπικά σε λιγότερο από 2 λεπτά](https://www.youtube.com/watch?v=P6YvlupUboU) — κλωνοποιήστε το repository, ξεκινήστε το PostgreSQL, συμπληρώστε τις απαιτούμενες μεταβλητές περιβάλλοντος και δημιουργήστε τον πρώτο σας λογαριασμό σε τοπικό instance.

## Προαπαιτούμενα

Και τα δύο scripts απαιτούν την εγκατάσταση των παρακάτω εργαλείων:

| Εργαλείο | Σκοπός |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Container βάσης δεδομένων (dev) και πλήρες stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Διαχειριστής πακέτων Python για το backend |
| [bun](https://bun.sh) | Runtime JavaScript για το frontend |

## Ρύθμιση Περιβάλλοντος

Τόσο το `run.sh` όσο και το `deploy.sh` διαβάζουν από ένα αρχείο `.env` στη ρίζα του project. Εάν αυτό δεν υπάρχει, το script δημιουργεί αυτόματα ένα από το `.env.example` — τόσο για τοπική ανάπτυξη όσο και για παραγωγή.

Τα `SECRET_KEY` και `ENCRYPTION_KEY` περιλαμβάνονται κενά στο `.env.example`. Όταν κάποιο από αυτά είναι κενό, τα `run.sh` και `deploy.sh` δημιουργούν αυτόματα μια κρυπτογραφικά ισχυρή τιμή και την εγγράφουν πίσω στο `.env`, ώστε μια νέα εγκατάσταση να μην απαιτεί χειροκίνητο χειρισμό κλειδιών. Εάν ένα υπάρχον `.env` εξακολουθεί να περιέχει το legacy placeholder `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), τα scripts σταματούν με ρητό σφάλμα αντί να το αντικαταστήσουν — η εναλλαγή αυτού του κλειδιού θα καθιστούσε τα προηγουμένως κρυπτογραφημένα credentials μη αναγνώσιμα. Το ίδιο το backend επίσης αρνείται να ξεκινήσει εάν κάποιο από τα κλειδιά είναι κενό ή έχει παραμείνει σε γνωστό placeholder.

Για να δημιουργήσετε το αρχείο χειροκίνητα (προαιρετικό — τα scripts το κάνουν για εσάς):

```bash
cp .env.example .env
```

Βασικές μεταβλητές περιβάλλοντος:

Για κάθε υποστηριζόμενη μεταβλητή, προεπιλεγμένη τιμή και σημείωση παραγωγής, δείτε [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `SECRET_KEY` | **Απαιτείται.** Μυστικό για την υπογραφή JWT. Δημιουργείται αυτόματα από τα `run.sh`/`deploy.sh` όταν είναι κενό. |
| `ENCRYPTION_KEY` | **Απαιτείται.** Κλειδί κρυπτογράφησης credentials. Δημιουργείται αυτόματα από τα `run.sh`/`deploy.sh` όταν είναι κενό. |
| `DATABASE_URL` | Προαιρετική παράκαμψη του connection string της βάσης δεδομένων. Εάν είναι κενό, το Heym το δημιουργεί από τις ρυθμίσεις `POSTGRES_*`. |
| `BACKEND_PORT` | Θύρα του backend API — προεπιλογή `10105` |
| `FRONTEND_PORT` | Θύρα του frontend — προεπιλογή `4017` |
| `FRONTEND_URL` | **Απαιτείται στην παραγωγή.** Δημόσιο URL της εφαρμογής (scheme + host, π.χ. `https://heym.example.com`). Χρησιμοποιείται για τα redirect URIs του OAuth (Google Sheets, BigQuery, Notion και παρόμοια), καθώς και για τους συνδέσμους review, Codex follow-up και αρχείων που δημιουργούν τα background runs· πρέπει να ταιριάζει με το URL που χρησιμοποιούν οι χρήστες στον browser. Σε ένα cluster, ορίστε την ίδια τιμή σε κάθε instance. |
| `ALLOW_REGISTER` | Ανοιχτή εγγραφή χρηστών (`false` στην prod, `true` στην dev). Αλλάξτε το σε `false` μόνο αφού υπάρχει ο λογαριασμός διαχειριστή σας — δεν υπάρχει bootstrap πρώτου χρήστη, οπότε μια κενή βάση δεδομένων μαζί με απενεργοποιημένη εγγραφή δεν αφήνει τρόπο δημιουργίας ενός. |
| `DOCKER_LOGS_ENABLED` | Ενεργοποιεί την πρόσβαση στην καρτέλα Logs που υποστηρίζεται από Docker όταν οριστεί σε `true`· απαιτεί επίσης πρόσβαση στο Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Λίστα έμπιστων emails χρηστών, χωρισμένων με κόμμα, που επιτρέπεται να έχουν πρόσβαση στα Docker logs όταν `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Μέγιστο μέγεθος σώματος HTTP request που γίνεται δεκτό πριν εκτελεστούν οι handlers των endpoint· προεπιλογή `100`, ένα MB πάνω από το `FILE_MAX_SIZE_MB` για να υπάρχει περιθώριο για το overhead του multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Πώς εκτελούνται τα εργαλεία Python που ορίζει ο χρήστης: `auto` (προεπιλογή — ενισχυμένο, απομονωμένο Docker container· fail closed εάν το Docker δεν είναι διαθέσιμο), `docker` (ίδιο, χωρίς ποτέ fallback), ή `subprocess` (τοπικό fallback εντός της διεργασίας· δεν αποτελεί όριο ασφαλείας, μόνο για έμπιστα/dev περιβάλλοντα). Το `run.sh` ορίζει `subprocess` για native dev. Δείτε [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image που χρησιμοποιείται για το Docker sandbox των εργαλείων Python. Κενό = αυτόματη ανίχνευση του τρέχοντος backend image. |

Οι προεπιλογές σύνδεσης στη βάση δεδομένων (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) τεκμηριώνονται στο [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) και στο `.env.example`.

---

## Ανάπτυξη: `run.sh`

Το `run.sh` εκκινεί και τις τρεις υπηρεσίες τοπικά — τη βάση δεδομένων (ως Docker container), το FastAPI backend και τον Vite dev server — με μία μόνο εντολή.

```bash
./run.sh
```

**Τι κάνει, βήμα προς βήμα:**

1. Ελέγχει ότι τα `docker`, `bun` και `uv` είναι διαθέσιμα
2. Δημιουργεί το `.env` από το `.env.example` αν λείπει, και παράγει τυχαία `SECRET_KEY` και `ENCRYPTION_KEY` όταν κάποιο από αυτά είναι κενό
3. Εκκινεί (ή δημιουργεί) ένα Docker container βάσης δεδομένων στην πόρτα `6543`, αποθηκεύοντας τα δεδομένα του στον Docker volume `heym-postgres-data` αντί για κατάλογο του host
4. Εγκαθιστά τις εξαρτήσεις Python μέσω `uv sync`
5. Εκτελεί τις migrations της βάσης δεδομένων με Alembic (`alembic upgrade head`)
6. Ελευθερώνει τις πόρτες του backend και του frontend αν είναι κατειλημμένες
7. Εκκινεί το FastAPI backend με `--reload` (hot-reload στις αλλαγές κώδικα)
8. Εγκαθιστά τις εξαρτήσεις του frontend μέσω `bun install`
9. Εκκινεί τον Vite dev server

**Επιλογές:**

| Flag | Περιγραφή |
|------|-------------|
| *(κανένα)* | Εκκίνηση με ενεργοποιημένο το debug logging (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Εκκίνηση με το προεπιλεγμένο επίπεδο καταγραφής (χωρίς debug output) |
| `--help` | Εμφάνιση πληροφοριών χρήσης |

**Διευθύνσεις υπηρεσιών (dev):**

| Υπηρεσία | Διεύθυνση |
|---------|---------|
| Frontend | `localhost` στην `FRONTEND_PORT` (προεπιλογή: 4017) |
| Backend API | `localhost` στην `BACKEND_PORT` (προεπιλογή: 10105) |
| Interactive API Docs | `localhost:10105/docs` |
| Βάση δεδομένων | `localhost:6543` |

Πατήστε `Ctrl+C` για ομαλή διακοπή όλων των υπηρεσιών.

---

## End-to-End Tests: `run_e2e.sh`

Η σουίτα Playwright του frontend εκτελείται απέναντι στην πραγματική εφαρμογή Vue, στο FastAPI backend και σε μια
απομονωμένη βάση δεδομένων PostgreSQL:

```bash
./run_e2e.sh
```

Η σουίτα είναι μια σουίτα smoke και regression για βασικές διαδρομές, όχι εξαντλητική κάλυψη του προϊόντος. Καλύπτει
τον έλεγχο ταυτότητας, τον κύκλο ζωής και την εκτέλεση βασικών workflow, επιλεγμένους πόρους του dashboard, δημόσιες
διαδρομές και ένα mocked UI αξιολόγησης HITL. Οι ενσωματώσεις παρόχων, κάθε τύπος κόμβου, οι πίνακες
κοινοποίησης/δικαιωμάτων και η πλήρης εκτέλεση συνέχισης HITL καλύπτονται κυρίως από backend tests ή απαιτούν
ειδικά περιβάλλοντα ενσωμάτωσης.

Κάθε εκτέλεση αποκτά το δικό της προσωρινό container PostgreSQL 16, τυχαίες διαθέσιμες πόρτες
βάσης δεδομένων/backend/frontend, κατάσταση ελέγχου ταυτότητας, αποτελέσματα δοκιμών και αναφορά HTML. Αυτό επιτρέπει σε πολλαπλές
διεργασίες `run_e2e.sh` να εκτελούνται ταυτόχρονα χωρίς κοινή χρήση κατάστασης ή αντικατάσταση artifacts. Το script αφαιρεί
το container της βάσης δεδομένων του όταν ολοκληρωθεί η εκτέλεση και εκτυπώνει τον κατάλογο artifacts και τη διαδρομή της αναφοράς.

Χρήσιμες εντολές:

```bash
./run_e2e.sh --ui         # Interactive Playwright runner με απομονωμένη βάση δεδομένων
cd frontend
bun run test:e2e:report   # Άνοιγμα της πιο πρόσφατα ολοκληρωμένης τοπικής εκτέλεσης
```

Οι απευθείας εκτελέσεις `bun run test:e2e` και `bun run test:e2e:ui` απαιτούν ρητή `DATABASE_URL`, ώστε να
μην μπορούν να εκκινήσουν σιωπηλά απέναντι στην τοπική βάση δεδομένων ανάπτυξης. Χρησιμοποιήστε το `./run_e2e.sh` για κανονικές τοπικές
εκτελέσεις.

Το `./check.sh` εκτελεί lint, typecheck, formatting και backend tests χωρίς τη σουίτα E2E, διατηρώντας τη
προεπιλεγμένη διαδρομή τοπικού ελέγχου γρήγορη. Εκτελέστε τα Playwright E2E tests ξεχωριστά με το `./run_e2e.sh`. Τα pull
requests εκτελούν πάντα τη σουίτα E2E του Chromium στο GitHub Actions και διατηρούν traces, screenshots,
videos και την αναφορά HTML όταν προκύπτουν αποτυχίες.

---

## Παραγωγή: `deploy.sh`

Το `deploy.sh` δημιουργεί και εκτελεί ολόκληρο το stack χρησιμοποιώντας το Docker Compose. Και οι τρεις υπηρεσίες — η βάση δεδομένων, το backend και το frontend — εκτελούνται ως containers. Το entrypoint του backend εκτελεί αυτόματα τις migrations πριν ξεκινήσει τον server με 8 workers.

**Αρχική ανάπτυξη (build + εκκίνηση):**

```bash
./deploy.sh
```

Αυτό εκτελεί μια ανάπτυξη χωρίς διακοπή λειτουργίας (zero-downtime): τα images δημιουργούνται πρώτα ενώ οι υπάρχοντες containers συνεχίζουν να εκτελούνται, και στη συνέχεια η νέα έκδοση αντικαθίσταται.

**Διαθέσιμες εντολές:**

| Εντολή | Περιγραφή |
|---------|-------------|
| `./deploy.sh` | Δημιουργία images και εκκίνηση/ενημέρωση όλων των υπηρεσιών |
| `./deploy.sh --status` | Εμφάνιση κατάστασης containers |
| `./deploy.sh --logs` | Ροή logs από όλα τα containers |
| `./deploy.sh --restart` | Επανεκκίνηση όλων των containers |
| `./deploy.sh --down` | Διακοπή και αφαίρεση όλων των containers |
| `./deploy.sh --migrate-pgdata` | Μετάβαση μίας φοράς: αντιγραφή ενός υπάρχοντος καταλόγου `data/postgres` στο Docker volume `heym-postgres-data` και αναδημιουργία των indexes του |
| `./deploy.sh --help` | Εμφάνιση πληροφοριών χρήσης |

**Αποθήκευση βάσης δεδομένων: ένα Docker named volume, όχι ένας κατάλογος του host.**

Το Compose αποθηκεύει το PostgreSQL στο Docker volume `heym-postgres-data`. Προηγούμενες εκδόσεις χρησιμοποιούσαν bind mount του καταλόγου `./data/postgres` του host. Τα host bind mounts σε macOS (virtiofs) και Windows/WSL2 δεν παρέχουν στο PostgreSQL τις εγγυήσεις `fsync` και κλεισίματος αρχείων που απαιτεί: τα clusters εκεί αντιμετωπίζουν `PANIC: could not close file … Input/output error` σε WAL segments και καταστρέφονται με την πάροδο του χρόνου. Τα bind mounts του Linux δεν επηρεάστηκαν ποτέ, αλλά πλέον κάθε πλατφόρμα χρησιμοποιεί την ίδια διάταξη.

Η αναβάθμιση μιας ανάπτυξης που έχει ακόμη δεδομένα στο `./data/postgres` είναι ένα βήμα μίας φοράς. Το `./deploy.sh` το ανιχνεύει, σταματά πριν από το build και σας ζητά να κάνετε πρώτα τη μετάβαση:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**Η μετάβαση αναδημιουργεί επίσης τα indexes.** Η αντιγραφή είναι byte-for-byte, οπότε τυχόν ζημιά στα indexes που προκλήθηκε από το παλιό bind mount μεταφέρεται μαζί της. Γι' αυτό το `--migrate-pgdata` ξεκινά μόνο την υπηρεσία `postgres` στο νέο volume, εκτελεί `reindexdb` σε αυτό και τη σταματά ξανά πριν ξεκινήσει το υπόλοιπο stack. Αυτό έχει σημασία επειδή αυτή η κατηγορία καταστροφής αφήνει καταχωρήσεις indexes να δείχνουν πέρα από το τέλος του heap — μια κατάσταση που το `pg_amcheck` αναφέρει ως καθαρή, οπότε ένας επιτυχής έλεγχος δεν αποτελεί απόδειξη υγιούς πίνακα. Το REINDEX επιδιορθώνει αυτές τις καταχωρήσεις· δεν μπορεί να επαναφέρει σελίδες heap που το παλιό filesystem έχει ήδη χάσει. Σε μια μεγάλη, γνωστά υγιή βάση δεδομένων μπορείτε να παρακάμψετε την αναδημιουργία με `./deploy.sh --migrate-pgdata --skip-reindex`.

Η αντιγραφή είναι μη καταστροφική. Το `./data/postgres` παραμένει στη θέση του ως backup, και η μετάβαση αρνείται να αντικαταστήσει ένα volume που περιέχει ήδη μια βάση δεδομένων. Εάν αποτύχει οποιοδήποτε βήμα, το νέο volume αφαιρείται, ώστε ένα μισο-μεταφερμένο cluster να μην μπορεί ποτέ να αναπτυχθεί κατά λάθος. Διαγράψτε τον παλιό κατάλογο αφού επιβεβαιώσετε ότι τα Workflows σας είναι άθικτα. Το container `postgres` φέρει την ίδια προστασία, ώστε μια χειροκίνητη εντολή `docker compose up` να μην μπορεί να αρχικοποιήσει σιωπηλά μια κενή βάση δεδομένων πάνω από τα δεδομένα σας. Οι νέες εγκαταστάσεις δεν απαιτούν καμία ενέργεια.

**Διευθύνσεις υπηρεσιών (παραγωγή):**

Το container του frontend εκτίθεται στο `FRONTEND_PORT` (προεπιλογή: 4017). Το backend API σερβίρεται στη διαδρομή `/api`, με proxy μέσω του container του frontend — επομένως υπάρχει μόνο μία δημόσια θύρα στην παραγωγή.

**Επισκόπηση containers:**

| Container | Περιγραφή |
|-----------|-------------|
| `heym-db` | Σχεσιακή βάση δεδομένων |
| `heym-backend` | FastAPI API server (8 workers, χτισμένο από το `backend/Dockerfile`) |
| `heym-frontend` | Container προεπισκόπησης frontend που σερβίρει την χτισμένη εφαρμογή Vue (χτισμένο από το `frontend/Dockerfile`) |

**Σήμα ενημέρωσης έκδοσης:**

Η κεφαλίδα της εφαρμογής εμφανίζει την έκδοση του τρέχοντος Docker build. Όταν αυτή η έκδοση είναι παλαιότερη από την τελευταία έκδοση του Heym στο GitHub, εμφανίζεται ένα μωβ σήμα **Update** δίπλα στην έκδοση. Κάντε κλικ στην έκδοση ή στο σήμα για να ανοίξετε τη σελίδα εκδόσεων του Heym στο GitHub.

---

## Έτοιμη Εικόνα: `docker run`

Εάν προτιμάτε να μη δημιουργήσετε την εφαρμογή τοπικά, μπορείτε να κάνετε pull τη δημοσιευμένη εικόνα container και να την εκτελέσετε απευθείας.

Η εικόνα εκκινεί το frontend και το backend μαζί σε ένα container. Το PostgreSQL παραμένει εξωτερικό, αλλά μπορείτε να παρέχετε είτε το `DATABASE_URL` είτε τις μεταβλητές `POSTGRES_*` από το `.env.example`.

> **Αποθηκεύστε τη βάση δεδομένων σας σε ένα Docker named volume.** Η εικόνα έκδοσης δεν περιλαμβάνει βάση δεδομένων, επομένως το PostgreSQL πίσω από το `DATABASE_URL` είναι δική σας ευθύνη να το εκτελέσετε. Προσαρτήστε το ως `-v heym-postgres-data:/var/lib/postgresql/data` αντί για host path: σε macOS (virtiofs) και Windows/WSL2, ένας bind-mounted κατάλογος δεδομένων PostgreSQL δεν τηρεί τις εγγυήσεις `fsync` που απαιτεί η βάση δεδομένων και διαφθείρει το cluster με την πάροδο του χρόνου.

> **Backend vector store.** Τα `run.sh` και `deploy.sh` εκτελούν την επίσημη εικόνα `postgres:16` και εγκαθιστούν αυτόματα το πακέτο `postgresql-16-pgvector` κατά την εκκίνηση, οπότε το **Postgres (pgvector) RAG backend** λειτουργεί εκεί χωρίς αλλαγές στα δεδομένα σας. Η έτοιμη εικόνα ενός container, ωστόσο, συνδέεται σε ένα PostgreSQL που **εσείς** παρέχετε — αυτή η βάση δεδομένων πρέπει να υποστηρίζει την επέκταση `vector` για να χρησιμοποιηθεί το Postgres backend. Το Heym δεν μπορεί να εγκαταστήσει το pgvector σε μια βάση δεδομένων που δεν διαχειρίζεται. Χωρίς αυτό, η migration εκκίνησης παραλείπει ομαλά τον πίνακα pgvector — το deploy εξακολουθεί να επιτυγχάνει, το Qdrant RAG συνεχίζει να λειτουργεί, και η δημιουργία ή η μεταφόρτωση σε ένα Postgres vector store επιστρέφει ένα σαφές μήνυμα "backend unavailable" μέχρι να ενεργοποιηθεί το pgvector.

**Ορίστε τα κλειδιά μόνοι σας για απευθείας εκτελέσεις της εικόνας.** Σε αντίθεση με τα `run.sh`/`deploy.sh`, η έτοιμη εικόνα δεν δημιουργεί αυτόματα κλειδιά. Μετά το `cp .env.example .env`, συμπληρώστε τα δύο κενά κλειδιά (η αντικατάσταση επί τόπου αποφεύγει διπλές καταχωρήσεις):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Κάντε τα mounts αρχείων και plugins απόλυτα.** Τα `FILE_STORAGE_DIR` και `HEYM_PLUGINS_DIR` έχουν ως προεπιλογή τις σχετικές διαδρομές `./data/files` και `data/plugins`, και η εικόνα έκδοσης εκκινεί το backend από το `/app/backend`. Αν παραμείνουν σχετικές, επιλύονται σε `/app/backend/data/files` και `/app/backend/data/plugins`, οπότε τα δύο bind mounts παραπάνω δεν λαμβάνουν τίποτα και οι μεταφορτώσεις χάνονται όταν το container αντικατασταθεί. Τα flags `-e` υπερισχύουν των σχετικών τιμών που παρέχει το `.env.example` μέσω του `--env-file`, επειδή το `-e` της γραμμής εντολών υπερισχύει του `--env-file`. Το Compose (`./deploy.sh`) δεν το χρειάζεται: αυτή η εικόνα εκτελεί το backend από το `/app`, όπου οι σχετικές προεπιλογές καταλήγουν ήδη στα mounts.

> **Πρόσβαση στο Docker socket.** Το mount του `/var/run/docker.sock` δίνει στο backend ευρύ έλεγχο του Docker daemon του host. Η προεπιλεγμένη υπηρεσία Docker Compose και το παράδειγμα απευθείας `docker run` το περιλαμβάνουν για Docker-based MCP stdio εργαλεία που εκτελούν εντολές `docker`. Η καρτέλα Logs εξακολουθεί να απαιτεί `DOCKER_LOGS_ENABLED=true` και `DOCKER_LOGS_ALLOWED_EMAILS` με λίστα email έμπιστων χρηστών χωρισμένη με κόμμα. Δημιουργήστε τον έμπιστο λογαριασμό διαχειριστή πριν ενεργοποιήσετε τα Docker logs, ή διατηρήστε το `ALLOW_REGISTER=false`, ώστε μια μη επαληθευμένη αυτοεγγραφή να μην μπορεί να διεκδικήσει ένα email της allow-list. Τα εργαλεία Python που ορίζονται από τον χρήστη **δεν** λαμβάνουν αυτό το socket: εκτελούνται σε ξεχωριστό ενισχυμένο container χωρίς Docker socket. Δείτε [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Ο κόμβος Codex χρησιμοποιεί την ίδια εικόνα `ghcr.io/heymrun/heym` ως sibling runner container (`--entrypoint codex`) ώστε το Linux sandbox του Codex να μπορεί να δημιουργεί namespaces. Διατηρήστε το mount του volume `heym-codex-workspaces` αν θέλετε Workflow του Codex στη ρύθμιση απευθείας εικόνας· ο runner δεν λαμβάνει το Docker socket ούτε τα secrets του backend.

> **OpenCode Go runner.** Ο κόμβος OpenCode Go χρησιμοποιεί την ίδια εικόνα ως ενισχυμένο sibling runner (`--entrypoint opencode`) που μοιράζεται το `heym-opencode-workspaces`. Διατηρήστε αυτό το mount volume αν θέλετε Workflow του OpenCode στη ρύθμιση απευθείας εικόνας· ο runner δεν λαμβάνει το Docker socket ούτε το GitHub token.

> **Skill sandbox.** Τα Python skills στον κόμβο Agent εκτελούνται σε ένα ενισχυμένο sibling container που μοιράζεται το volume `heym-codex-workspaces`, οπότε διατηρήστε αυτό το mount volume και για τα skills — όχι μόνο για το Codex. Κάθε εκτέλεση λαμβάνει ένα απομονωμένο per-run subpath, και το sibling δεν λαμβάνει ούτε το Docker socket ούτε τα secrets του backend. Αυτό απαιτεί **Docker Engine 25.0+**· σε παλαιότερα engines, ή χωρίς το volume, το `HEYM_PYTHON_TOOL_SANDBOX=auto` αποτυγχάνει κλειστά — ορίστε `HEYM_PYTHON_TOOL_SANDBOX=subprocess` μόνο για έμπιστες ρυθμίσεις ενός χρήστη. Δείτε [Security](../reference/security.md#skill-sandbox).

> **Το `--shm-size 2g` απαιτείται για το Playwright.** Το Docker δίνει σε ένα container 64 MB `/dev/shm` και το Chromium καταρρέει τον renderer του κάτω από αυτό το όριο. Οι step-based κόμβοι Playwright εκτελούν το Chromium ως subprocess μέσα σε αυτό το container, οπότε το όριο είναι αυτού του container· το custom `playwrightCode` εκτελείται σε sibling container που ορίζει το δικό του. Το `docker-compose.yml` δηλώνει ήδη `shm_size: "2gb"`, οπότε τα `run.sh` και `deploy.sh` δεν επηρεάζονται — μόνο ένα απλό `docker run` χρειάζεται το flag.

> **Playwright Run Code.** Το custom Playwright Python απαιτεί `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` και το mount του Docker socket παραπάνω. Η εικόνα έκδοσης ορίζει τα `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` για τη διάταξη GHCR (`/app/backend/.venv`). Το Compose `./deploy.sh` έχει ως προεπιλογή για την εικόνα sandbox το `heym-backend:local`. Διατηρήστε το `--no-sandbox` στα ορίσματα εκκίνησης του Chromium μέσα στα sandbox containers.

**Ελάχιστες μεταβλητές περιβάλλοντος για απευθείας εκτελέσεις της εικόνας:**

| Μεταβλητή | Απαιτείται | Σκοπός |
|----------|----------|---------|
| `DATABASE_URL` | Προαιρετικό | Πλήρης παράκαμψη του connection string PostgreSQL |
| `POSTGRES_HOST` | Ναι, αν το `DATABASE_URL` είναι κενό | Host PostgreSQL |
| `POSTGRES_PORT` | Ναι, αν το `DATABASE_URL` είναι κενό | Θύρα PostgreSQL |
| `POSTGRES_USER` | Ναι, αν το `DATABASE_URL` είναι κενό | Όνομα χρήστη PostgreSQL |
| `POSTGRES_PASSWORD` | Ναι, αν το `DATABASE_URL` είναι κενό | Κωδικός πρόσβασης PostgreSQL |
| `POSTGRES_DB` | Ναι, αν το `DATABASE_URL` είναι κενό | Όνομα βάσης δεδομένων PostgreSQL |
| `SECRET_KEY` | Ναι | Secret υπογραφής JWT |
| `ENCRYPTION_KEY` | Ναι | Κλειδί κρυπτογράφησης διαπιστευτηρίων |
| `FRONTEND_URL` | Συνιστάται | Δημόσιο URL browser, ειδικά για OAuth callbacks |
| `CORS_ORIGINS` | Συνιστάται | Επιτρεπόμενες προελεύσεις browser |
| `FILE_STORAGE_DIR` | Συνιστάται | Ορίστε το σε απόλυτο `/app/data/files` όταν κάνετε mount αυτή τη διαδρομή· η σχετική προεπιλογή `./data/files` επιλύεται κάτω από το `/app/backend` σε αυτή την εικόνα και χάνει το mount |
| `ALLOW_REGISTER` | Συνιστάται | Ορίστε `false` σε production εκτός αν επιθυμείτε ανοιχτή εγγραφή, αλλά μόνο αφού υπάρχει ο λογαριασμός διαχειριστή σας — δεν υπάρχει bootstrap πρώτου χρήστη |
| `DOCKER_LOGS_ENABLED` | Προαιρετικό | Ορίστε `true` για να επιτρέψετε στην καρτέλα Logs να χρησιμοποιεί πρόσβαση στο Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Απαιτείται όταν `DOCKER_LOGS_ENABLED=true` | Λίστα email έμπιστων χρηστών χωρισμένη με κόμμα που επιτρέπεται να έχουν πρόσβαση στα Docker logs |
| `HEYM_PLUGINS_ENABLED` | Προαιρετικό | Ορίστε `true` για να ενεργοποιήσετε το υποσύστημα plugins (custom nodes που εγκαθίστανται ως zip). Απενεργοποιημένο από προεπιλογή |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Απαιτείται όταν `HEYM_PLUGINS_ENABLED=true` | Λίστα email χειριστών χωρισμένη με κόμμα που επιτρέπεται να εγκαθιστούν/απεγκαθιστούν plugins |
| `HEYM_PLUGINS_DIR` | Προαιρετικό | Πού αποθηκεύονται τα αρχεία plugin. Ορίστε το σε απόλυτο `/app/data/plugins` όταν κάνετε mount αυτή τη διαδρομή· η σχετική προεπιλογή `data/plugins` επιλύεται κάτω από το `/app/backend` σε αυτή την εικόνα και χάνει το mount |
| `HEYM_PYTHON_TOOL_SANDBOX` | Προαιρετικό | Λειτουργία απομόνωσης εργαλείων Python· προεπιλογή `auto` (ενισχυμένο Docker sandbox, αποτυγχάνει κλειστά). Δείτε [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Προαιρετικό | Παράκαμψη της εικόνας sandbox εργαλείων Python· κενό = αυτόματη ανίχνευση της εικόνας backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Προαιρετικό | Docker volume που χρησιμοποιείται από sibling runner containers του Codex· προεπιλογή `heym-codex-workspaces` σε Docker deployments |
| `HEYM_CODEX_NETWORK_ACCESS` | Προαιρετικό | Επιτρέπει στις sandboxed εντολές του Codex να κατεβάζουν αρχεία/εξαρτήσεις· τα Docker deployments το ενεργοποιούν από προεπιλογή |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Προαιρετικό | Docker volume που χρησιμοποιείται από sibling runner containers του OpenCode· προεπιλογή `heym-opencode-workspaces` σε Docker deployments |

**Σημειώσεις:**

- Η εικόνα εκθέτει τη θύρα `4017`
- Το backend παραμένει εσωτερικό και γίνεται proxy κάτω από το `/api`
- Όταν `POSTGRES_HOST=localhost`, η εικόνα έκδοσης το ξαναγράφει αυτόματα σε `host.docker.internal` όταν χρειάζεται, ώστε το ίδιο `.env` να λειτουργεί με ένα container PostgreSQL σε επίπεδο host σε εργαλεία macOS Docker/Desktop
- Διατηρήστε το mount `data/files` αν θέλετε οι μεταφορτώσεις στο Drive και τα αρχεία που δημιουργούνται από skills να επιβιώνουν από επανεκκινήσεις container
- **Plugins:** για να τα ενεργοποιήσετε, ορίστε `HEYM_PLUGINS_ENABLED=true` και `HEYM_PLUGIN_ADMIN_EMAILS`, και κάντε mount το `data/plugins` ώστε τα εγκατεστημένα αρχεία plugin να παραμένουν μετά από επαναδημιουργίες container. Τα metadata των plugin βρίσκονται στο PostgreSQL σας, οπότε επιβιώνουν επίσης. Οι δηλωμένες pip `dependencies` ενός plugin εγκαθίστανται στο container κατά την εγκατάσταση· επειδή το filesystem της εικόνας είναι εφήμερο, **επανεγκαθίστανται αυτόματα κατά την εκκίνηση** για κάθε εγκατεστημένο plugin (το venv `uv` της εικόνας έκδοσης είναι εγγράψιμο, οπότε αυτό λειτουργεί και στην εικόνα ενός container)

### Μεταφορά υπάρχουσας βάσης δεδομένων σε named volume

Το `./deploy.sh --migrate-pgdata` γνωρίζει μόνο το Compose stack. Αν εκτελείτε την εικόνα έκδοσης απέναντι στο δικό σας container PostgreSQL και αυτό το container κάνει bind-mount έναν κατάλογο host, μεταφέρετέ το μόνοι σας.

Ελέγξτε πρώτα τι χρησιμοποιεί το container της βάσης δεδομένων σας:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Αν το `"Type"` δείχνει `bind`, μεταφέρετέ το σε ένα named volume:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    volume name if this Docker host runs more than one Heym deployment.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Start PostgreSQL again on the volume, reusing the flags you had before
#    but replacing the bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Once it accepts connections, rebuild indexes.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Χρησιμοποιήστε τη δική σας εικόνα στα βήματα 2 και 3, όχι την `postgres:16`.** Αν η βάση δεδομένων σας εκτελεί `pgvector/pgvector:pg16` ή άλλη παραλλαγή, η εκκίνηση του αντιγραμμένου cluster με τη stock εικόνα μπορεί να αποτύχει επειδή λείπουν οι βιβλιοθήκες επεκτάσεων που αναμένει.

Ο αρχικός κατάλογος δεδομένων σας παραμένει ανέπαφος από αυτή τη διαδικασία, οπότε αποτελεί τη διαδρομή επαναφοράς σας. Διαγράψτε τον μόνο αφού επιβεβαιώσετε ότι η μεταφερμένη βάση δεδομένων εξυπηρετεί τα Workflow σας. Το βήμα 4 έχει σημασία για τον ίδιο λόγο που έχει και στη migration του Compose: το αντίγραφο μεταφέρει μαζί του τυχόν υπάρχουσα ζημιά στα indexes.

---

## Εκτέλεση Περισσότερων από Μία Παρουσιών

Όλα τα παραπάνω αναπτύσσουν μία μόνο παρουσία του Heym. Όταν ένα μηχάνημα δεν επαρκεί πλέον, μπορείτε να κατευθύνετε μια δεύτερη παρουσία στην ίδια βάση δεδομένων PostgreSQL και αυτή θα ενταχθεί ως worker: οι εκτελέσεις στο παρασκήνιο — cron, webhooks, κλήσεις εργαλείων MCP, chat triggers — κατανέμονται τότε μεταξύ των παρουσιών με ένα ποσοστό που ορίζετε στις **Settings → Instances**.

Οι παρουσίες δεν επικοινωνούν ποτέ μεταξύ τους. Η Postgres μεταφέρει το φόρτο εργασίας, επομένως ένας worker δεν χρειάζεται ανοιχτή θύρα ούτε διαδρομή επιστροφής προς την κύρια παρουσία, και δεν εμπλέκεται κανένας message broker. Η εργασία που αγγίζει τον τοπικό δίσκο — αρχεία Drive, χώροι εργασίας coding-agent, εγκατεστημένα plugins — εκτελείται πάντα στην κύρια παρουσία, οπότε τίποτα δεν χρειάζεται να διαμοιραστεί μέσω filesystem.

Δύο κανόνες που το cluster δεν μπορεί να επιβάλει για εσάς: κάθε παρουσία πρέπει να χρησιμοποιεί το ίδιο `SECRET_KEY` και `ENCRYPTION_KEY`, και το ingress πρέπει να δείχνει μόνο στην κύρια παρουσία. Και οι δύο εξηγούνται, μαζί με τους κανόνες τοποθέτησης και τον τρόπο επιλογής των ποσοστών, στο [Load Distribution](../reference/cluster.md).

> Αυτή είναι κατανομή φόρτου, όχι υψηλή διαθεσιμότητα. Η κύρια παρουσία παραμένει σημείο μοναδικής αστοχίας για το ingress, την αποθήκευση αρχείων και τον editor.

## Συνήθη Workflows

**Αρχική ρύθμιση:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Για το προκατασκευασμένο image του `docker run`, δημιουργήστε πρώτα τα κλειδιά χειροκίνητα (δείτε την ενότητα **Prebuilt Image** παραπάνω).

**Ενημέρωση του production μετά από αλλαγή κώδικα:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Έλεγχος των logs του production:**

```bash
./deploy.sh --logs
```

**Διακοπή των υπηρεσιών production:**

```bash
./deploy.sh --down
```

---

## Σχετικά

- [Εισαγωγή](./introduction.md) – Επισκόπηση πλατφόρμας
- [Γρήγορη Εκκίνηση](./quick-start.md) – Δημιουργήστε το πρώτο σας workflow
- [Μεταβλητές Περιβάλλοντος](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Πλήρης αναφορά διαμόρφωσης
- [Ασφάλεια](../reference/security.md) – Ρυθμίσεις JWT, κρυπτογράφησης και CORS
- [Κατανομή Φόρτου](../reference/cluster.md) – Εκτέλεση πολλαπλών instances σε μία βάση δεδομένων
