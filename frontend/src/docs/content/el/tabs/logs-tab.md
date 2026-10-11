# Καρτέλα Logs

Η καρτέλα **Logs** εμφανίζει τα logs των Docker containers για το stack του Heym. Χρησιμοποιήστε την για debugging, παρακολούθηση και αντιμετώπιση προβλημάτων. Για logs εκτέλεσης workflow (αποτελέσματα node, outputs), χρησιμοποιήστε το Debug panel στον editor workflow—δείτε [Δυνατότητες Canvas](../reference/canvas-features.md#execution-logs).

Τα logs που βασίζονται στο Docker είναι απενεργοποιημένα από προεπιλογή σε self-hosted εγκαταστάσεις. Για να τα ενεργοποιήσετε, ορίστε `DOCKER_LOGS_ENABLED=true`, ορίστε το `DOCKER_LOGS_ALLOWED_EMAILS` σε μια λίστα email αξιόπιστων χρηστών χωρισμένη με κόμματα που επιτρέπεται να έχουν πρόσβαση στα Docker logs, και βεβαιωθείτε ότι το `/var/run/docker.sock` είναι mounted στο backend container. Το προεπιλεγμένο service του Docker Compose και το παράδειγμα απευθείας `docker run` περιλαμβάνουν αυτό το mount για τα Docker-based MCP stdio εργαλεία· διατηρήστε το μόνο όταν αποδέχεστε το όριο εμπιστοσύνης του Docker socket.

Εάν η εγγραφή είναι ανοιχτή, δημιουργήστε τον αξιόπιστο λογαριασμό διαχειριστή πριν ενεργοποιήσετε τα Docker logs ή διατηρήστε το `ALLOW_REGISTER=false`· διαφορετικά μια μη επαληθευμένη αυτοεγγραφή θα μπορούσε να διεκδικήσει ένα email που βρίσκεται στη λίστα επιτρεπόμενων.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

## Επιλογή Container

- **All Containers** – Συνδυασμένα logs από backend, frontend και PostgreSQL
- **Backend** – container `heym-backend`
- **Frontend** – container `heym-frontend`
- **PostgreSQL** – container `heym-postgres`

## Φίλτρο Επιπέδου Log

- **All** – Εμφάνιση όλων των επιπέδων log
- **INFO** – INFO και άνω
- **WARNING** – Προειδοποιήσεις και σφάλματα
- **ERROR** – Μόνο σφάλματα
- **DEBUG** – Debug και άνω

## Αναζήτηση

- Φιλτράρετε τα logs με αναζήτηση κειμένου
- Τα αποτελέσματα επισημαίνονται στην έξοδο των logs

## Δυνατότητες

- **Auto scroll** – Αυτόματη κύλιση προς τα κάτω καθώς φτάνουν νέα logs
- **Stream** – Μετάδοση logs σε πραγματικό χρόνο (όταν υποστηρίζεται)
- **Copy** – Αντιγραφή logs στο clipboard
- **Download** – Λήψη logs ως αρχείο

## Περιπτώσεις Χρήσης

- Debug αποτυχιών εκτέλεσης workflow
- Επιθεώρηση logs αιτημάτων/απαντήσεων API
- Παρακολούθηση ερωτημάτων βάσης δεδομένων
- Έλεγχος μηνυμάτων εκκίνησης και υγείας

## Σχετικά

- [Δυνατότητες Canvas](../reference/canvas-features.md) – Logs εκτέλεσης στο Debug panel του workflow
- [Καρτέλα Traces](./traces-tab.md) – Επιθεώρηση LLM trace
- [Καρτέλα Analytics](./analytics-tab.md) – Μετρικές εκτέλεσης
- [Καρτέλα Workflows](./workflows-tab.md) – Διαχείριση workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Συνοπτικός οδηγός σελίδας για τις επιφάνειες του dashboard
