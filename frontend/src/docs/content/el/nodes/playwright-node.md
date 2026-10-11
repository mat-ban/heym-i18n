# Playwright

Ο **node** **Playwright** αυτοματοποιεί αλληλεπιδράσεις με τον browser μέσω διαμορφώσιμων βημάτων. Χρησιμοποιήστε τον για web scraping, συμπλήρωση φορμών και ροές εργασίας που βασίζονται σε browser.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.results`, `$nodeLabel.screenshot` και προαιρετικά δεδομένα δικτύου/browser |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (προεπιλογή) ή `"code"` (Run Code). Επιλέξτε από το αναπτυσσόμενο μενού Mode στο Properties Panel |
| `playwrightSteps` | array | Βήματα: navigate, click, type, aiStep, κ.λπ. Κάθε βήμα έχει action και selector/params. Το `disabled: true` διατηρεί ένα βήμα στη λίστα αλλά το παραλείπει κατά την εκτέλεση |
| `playwrightCode` | string | Προσαρμοσμένο Playwright Python που χρησιμοποιείται όταν το Mode είναι Run Code. Εκτελείται στο ενισχυμένο sandbox και είναι **απενεργοποιημένο από προεπιλογή** — δείτε τη σημείωση ασφαλείας παρακάτω |
| `playwrightHeadless` | boolean | Εκτέλεση headless (προεπιλογή: true) |
| `playwrightStealth` | boolean | Ρύθμιση opt-in για τη λειτουργία Steps που μειώνει τα συνήθη σήματα αυτοματοποίησης του Playwright (προεπιλογή: false). Ετικέτα στο Properties Panel: Reduce automation flags |
| `playwrightTimeout` | number | Χρονικό όριο σε ms (προεπιλογή: 30000) |
| `playwrightCaptureNetwork` | boolean | Καταγραφή απαντήσεων JSON, headers, cookies και αποθήκευσης browser |
| `playwrightAuthEnabled` | boolean | Επαναφορά ταυτοποίησης browser από cookies/storageState πριν από την εκτέλεση των βημάτων |
| `playwrightAuthStateExpression` | string | Έκφραση ή JSON που επιλύεται σε Playwright `storageState` ή ακατέργαστα `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selector που πρέπει να είναι ορατός μετά την εκκίνηση ταυτοποίησης |
| `playwrightAuthCheckTimeout` | number | Χρονικό όριο σε ms για τον έλεγχο του selector ταυτοποιημένης κατάστασης (προεπιλογή: 5000) |
| `playwrightAuthFallbackSteps` | array | Βήματα fallback μόνο για σύνδεση, που εκτελούνται όταν η επαναφορά cookie δεν ταυτοποιεί τη σελίδα |

## Τύποι Βημάτων

- **navigate** – Μετάβαση σε URL
- **refresh** – Επαναφόρτωση της τρέχουσας σελίδας (προαιρετικό βήμα `timeout` σε ms για την πλοήγηση επαναφόρτωσης)
- **click** – Κλικ σε στοιχείο μέσω selector
- **type** – Πληκτρολόγηση κειμένου σε πεδίο εισόδου (χαρακτήρα προς χαρακτήρα)
- **fill** – Συμπλήρωση τιμής πεδίου εισόδου
- **wait** – Αναμονή για χρονικό όριο (ms)
- **screenshot** – Λήψη screenshot (το `outputKey` αποθηκεύει base64 στα results)
- **getText** – Περιεχόμενο κειμένου ενός στοιχείου (`selector`, προαιρετικό `outputKey`)
- **getAttribute** – Τιμή γνωρίσματος (`selector`, `attribute`, προαιρετικό `outputKey`)
- **getHTML** – Εξωτερικό HTML ενός στοιχείου (`selector`, προαιρετικό `outputKey`)
- **getVisibleTextOnPage** – Πλήρες ορατό κείμενο σελίδας ως `document.body.innerText` (χωρίς selector· χρησιμοποιήστε `outputKey`· προαιρετικό βήμα `timeout` σε ms περιμένει πριν από τη λήψη)
- **hover** – Hover πάνω από στοιχείο
- **selectOption** – Επιλογή option σε `<select>`
- **scrollDown** / **scrollUp** – Κύλιση με τροχό ποντικιού (προαιρετικό `amount` σε pixels)
- **aiStep** – Το LLM επιστρέφει τους ίδιους τύπους ενεργειών με τα χειροκίνητα βήματα (δείτε παρακάτω)· το ένθετο `aiStep` δεν υποστηρίζεται

## Απενεργοποίηση Βήματος

Κάθε βήμα διαθέτει διακόπτη ενεργοποίησης στην κεφαλίδα του. Ένα βήμα που έχει απενεργοποιηθεί εμφανίζει τον τίτλο του με διακριτή διαγραφή και θαμπάδα, παραμένει στη λίστα με όλα τα πεδία του και παραλείπεται κατά την εκτέλεση του node — χρήσιμο για την απομόνωση ενός selector που αποτυγχάνει χωρίς να διαγραφεί η εργασία. Το αποθηκευμένο βήμα φέρει `disabled: true`· τα βήματα χωρίς τη σημαία εκτελούνται κανονικά.

Τα απενεργοποιημένα βήματα είναι αόρατα για τα υπόλοιπα μέρη του node: δεν ικανοποιούν τον κανόνα «το πρώτο βήμα πρέπει να είναι `navigate`» της εκκίνησης ταυτοποίησης, ένα απενεργοποιημένο `aiStep` δεν πραγματοποιεί κλήση LLM και οι απενεργοποιημένες καταχωρήσεις στο `playwrightAuthFallbackSteps` παραλείπονται επίσης. Η απενεργοποίηση όλων των βημάτων προκαλεί αποτυχία της εκτέλεσης με μήνυμα που ζητά να ενεργοποιήσετε ένα.

## AI Step

Η ενέργεια **aiStep** χρησιμοποιεί ένα LLM για να αναλύσει το HTML της σελίδας (και προαιρετικά ένα screenshot) και να δημιουργήσει ενέργειες Playwright από οδηγίες φυσικής γλώσσας. Το API δέχεται τα ίδια ονόματα ενεργειών με τα χειροκίνητα βήματα (συμπεριλαμβανομένων των `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, κυλίσεων, κ.λπ.). Το **Auto heal** αντικαθιστά μόνο τα αποτυχημένα βήματα που βασίζονται σε selector με εναλλακτικές για click, type, fill, hover και selectOption.

| Επιλογή | Περιγραφή |
|--------|-------------|
| `instructions` | Τι πρέπει να κάνει το AI (π.χ. «Click the Login button») |
| `credentialId` | Διαπιστευτήριο LLM (OpenAI, Google ή Custom) |
| `model` | Λίστα μοντέλων με δυνατότητα αναζήτησης από το επιλεγμένο διαπιστευτήριο LLM |
| `saveStepsForFuture` | Αποθήκευση των παραγόμενων βημάτων για επόμενες εκτελέσεις (αποφεύγει την κλήση LLM) |
| `sendScreenshot` | Αποστολή screenshot στο LLM για οπτικά στοιχεία |
| `aiStepTimeout` | Χρονικό όριο για την κλήση LLM σε ms (προεπιλογή 30000) |

### AI Auto Heal

Το **AI Auto Heal** καθιστά τις ροές εργασίας ανθεκτικές σε αλλαγές του DOM. Όταν ένας selector αποτυγχάνει δύο φορές (π.χ. μετά από ανασχεδιασμό ιστοτόπου), το Heym καλεί το LLM για να βρει έναν εναλλακτικό locator—συνήθως `role=button[name='Submit']` ή `text=Exact text` αντί για CSS selectors.

Ενεργοποιήστε το **Auto heal mode** στις ιδιότητες του AI step. Εάν το αποθηκευμένο βήμα αποτύχει:

1. Το Heym καταγράφει το τρέχον HTML και screenshot
2. Στέλνει το αποτυχημένο βήμα + το περιβάλλον της σελίδας στο LLM
3. Το LLM επιστρέφει μια ανθεκτική εναλλακτική (locator βάσει role, locator βάσει κειμένου ή εφεδρικό CSS)
4. Επαναλαμβάνει με τον νέο selector

Αυτό μειώνει την αστάθεια όταν οι ιστότοποι ενημερώνουν τη σήμανση ή τα ονόματα κλάσεων τους.
## Μείωση σημαιών αυτοματισμού

Ενεργοποιήστε τη **Μείωση σημαιών αυτοματισμού** (`playwrightStealth: true`) όταν ένας ιστότοπος αντιμετωπίζει το ενσωματωμένο Chromium του Playwright ως bot λόγω τυπικών σημάτων αυτοματισμού (`HeadlessChrome` στο user agent, `navigator.webdriver`, απουσία `window.chrome`).

Αυτή η επιλογή εφαρμόζεται μόνο στη λειτουργία **Steps**. Ενέργειες:

- Αφαιρεί τη σημαία `--enable-automation` του Chromium και ορίζει `--disable-blink-features=AutomationControlled`
- Αποστέλλει ένα τυπικό user agent Chrome (χωρίς `HeadlessChrome`)
- Επαναφέρει κοινές επιφάνειες του browser που ο Playwright αφήνει κενές (`window.chrome`, plugins)
- Διατηρεί αμετάβλητο τον renderer της GPU του host όταν υπάρχει διαθέσιμη GPU (τοπικά macOS/Windows). Σε Linux/Docker δεν υπάρχει GPU· η συμβολοσειρά του software renderer του Chromium αναφέρεται ως τυπική GPU Mali (ARM) ή Mesa (x86) αντί για SwiftShader.

Δεν αποκρύπτει ότι η συνεδρία καθοδηγείται μέσω Chrome DevTools Protocol και δεν αποτελεί τρόπο παράκαμψης της ασφάλειας ιστότοπων, των CAPTCHA ή των ελέγχων πρόσβασης. Χρησιμοποιήστε τη για workflows που είστε εξουσιοδοτημένοι να εκτελείτε — εσωτερικά εργαλεία, δικούς σας ιστότοπους και επιτρεπόμενο αυτοματισμό browser.

Η λειτουργία Run Code παραμένει αμετάβλητη — τα προσαρμοσμένα scripts εκκινούν το Chromium μόνα τους.

## Καταγραφή δικτύου

Ενεργοποιήστε το `playwrightCaptureNetwork` για να συλλέξετε πρόσθετα δεδομένα εντοπισμού σφαλμάτων κατά τη διάρκεια της εκτέλεσης:

- `networkRequests` – Καταγεγραμμένες αποκρίσεις JSON/API
- `cookies` – Cookies του browser στο τέλος της εκτέλεσης
- `localStorage` – Ζεύγη κλειδιού-τιμής του `localStorage` του browser
- `sessionStorage` – Ζεύγη κλειδιού-τιμής του `sessionStorage` του browser

Αυτό είναι χρήσιμο όταν χρειάζεται να εξετάσετε κρυφές κλήσεις API, κατάσταση ταυτοποίησης ή δεδομένα της πλευράς του browser μετά από μια αυτοματοποιημένη ροή.

## Εκκίνηση Cookies και Εφεδρική Σύνδεση

Ενεργοποιήστε το `playwrightAuthEnabled` όταν θέλετε ο Playwright να ανοίξει μια σελίδα ήδη συνδεδεμένος.

### Πηγή Κατάστασης Ταυτοποίησης

Ορίστε το `playwrightAuthStateExpression` σε μια έκφραση όπως `$global.authState`. Η τιμή μπορεί να είναι:

- Ένα αντικείμενο `storageState` του Playwright: `{"cookies": [...], "origins": [...]}`
- Ένας ακατέργαστος πίνακας `cookies[]`
- Μια συμβολοσειρά JSON που περιέχει οποιαδήποτε από τις δύο μορφές

Προτεινόμενο μοτίβο:

1. Εκτελέστε έναν node Playwright με ενεργοποιημένη την καταγραφή δικτύου ή την εκκίνηση ταυτοποίησης
2. Αποθηκεύστε το `$playwrightNode.cookies` ή ένα πλήρες αντικείμενο κατάστασης ταυτοποίησης σε μια [Καθολική Μεταβλητή](../reference/global-variables.md)
3. Επαναχρησιμοποιήστε αυτή τη μεταβλητή σε μεταγενέστερους nodes Playwright μέσω `$global.authState`

### Έλεγχος Ταυτοποίησης

Το πρώτο κύριο βήμα του Playwright πρέπει να είναι `navigate`. Αφού φορτωθεί αυτό το βήμα, το Heym ελέγχει το `playwrightAuthCheckSelector`.

- Εάν ο selector είναι ορατός, τα υπόλοιπα κύρια βήματα συνεχίζονται κανονικά
- Εάν ο selector λείπει, το Heym εκτελεί τα `playwrightAuthFallbackSteps`
- Αφού ολοκληρωθούν τα εφεδρικά βήματα, το Heym ελέγχει ξανά τον ίδιο selector
- Εάν ο selector εξακολουθεί να λείπει, ο node αποτυγχάνει με σφάλμα εκκίνησης ταυτοποίησης

Τα εφεδρικά βήματα αναλαμβάνουν την πλοήγηση μετά την αποτυχία ταυτοποίησης. Θα πρέπει να αφήνουν τον browser στη σελίδα ταυτοποιημένης πρόσβασης που αναμένει το υπόλοιπο κύριο flow.

## Πεδία Εξόδου

- `$playwrightNode.status` – `"ok"` σε περίπτωση επιτυχίας
- `$playwrightNode.results` – Έξοδοι βημάτων (getText, getHTML, getVisibleTextOnPage, getAttribute, κλειδιά screenshot κ.λπ.)
- `$playwrightNode.screenshot` – Screenshot σε Base64 όταν ένα βήμα αποθηκεύει ένα
- `$playwrightNode.cookies` – Τελικά cookies του browser όταν είναι ενεργοποιημένη η εκκίνηση ταυτοποίησης ή η καταγραφή δικτύου
- `$playwrightNode.networkRequests` – Καταγεγραμμένες αποκρίσεις δικτύου (όταν είναι ενεργοποιημένο)
- `$playwrightNode.localStorage` – Τοπικός χώρος αποθήκευσης του browser (όταν είναι ενεργοποιημένο)
- `$playwrightNode.sessionStorage` – Χώρος αποθήκευσης συνεδρίας του browser (όταν είναι ενεργοποιημένο)

## Παράδειγμα

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Λειτουργία Run Code

Στο Properties Panel, ορίστε το **Mode** σε **Run Code** για να επεξεργαστείτε το `playwrightCode` αντί για οπτικά βήματα. Η εκκίνηση ταυτοποίησης εφαρμόζεται μόνο στη λειτουργία Steps.

Παράδειγμα (sandbox / Docker — το Chromium χρειάζεται `--no-sandbox`):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Ο wrapper παρέχει `inputs`, `headless`, `timeout_ms` και `capture_network`. Μπορείτε να ενσωματώσετε εκφράσεις `$nodeLabel.field` στον κώδικα· εκτυπώστε JSON με `status` και `results`.
## Ασφάλεια προσαρμοσμένου κώδικα

Το πεδίο `playwrightCode` εκτελεί αυθαίρετο κώδικα Python. Επειδή αυτό ισοδυναμεί με εκτέλεση κώδικα, είναι **απενεργοποιημένο από προεπιλογή** και, όταν ενεργοποιηθεί, εκτελείται σε sandbox:

- **Απενεργοποιημένο από προεπιλογή.** Η εκτέλεση ενός node που έχει οριστεί `playwrightCode` αποτυγχάνει με σαφές σφάλμα, εκτός εάν ένας διαχειριστής ορίσει `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Ο έλεγχος εκτελείται τη στιγμή της εκτέλεσης, επομένως καλύπτει επίσης προηγουμένως αποθηκευμένα workflows και εκτελέσεις που έχουν προγραμματιστεί ή αποτελούν sub-workflow.
- **Απομονωμένο όταν ενεργοποιηθεί.** Ο προσαρμοσμένος κώδικας δεν εκτελείται στη διεργασία του backend. Εκτελείται σε ένα ενισχυμένο, προσωρινό sibling container χωρίς Docker socket, χωρίς backend bind mounts, χωρίς backend secrets στο περιβάλλον του, με περιορισμένες δυνατότητες, `no-new-privileges` και όρια CPU / μνήμης / PID. Εάν το Docker δεν είναι διαθέσιμο, η εκτέλεση αποτυγχάνει με ασφάλεια (fails closed). Το `HEYM_PLAYWRIGHT_SANDBOX=subprocess` επανέρχεται στη διαδρομή εντός της διεργασίας μόνο για αξιόπιστη χρήση ή χρήση σε τοπικό περιβάλλον ανάπτυξης (δεν αποτελεί όριο ασφαλείας). Το εγγενές `./run.sh` χρησιμοποιεί προεπιλεγμένα `subprocess` όταν δεν έχει οριστεί `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. Το `./deploy.sh` (Compose) και το μεμονωμένο image του GHCR εντοπίζουν τον sibling runner μέσω του `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (με εναλλακτική το `HEYM_CODEX_DOCKER_IMAGE`) και χρησιμοποιούν τη αντίστοιχη διαδρομή venv (`/app/.venv` έναντι `/app/backend/.venv`).
- **Σημείωση για το Chromium.** Το sandbox container εκτελείται ως root από προεπιλογή και το Chromium αρνείται να εκτελεστεί ως root χωρίς το `--no-sandbox`. Ο προσαρμοσμένος κώδικας που εκκινεί το Chromium θα πρέπει να το περνά, για παράδειγμα `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Οι εκκινήσεις βάσει βημάτων (και stealth) περνούν επίσης το `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, ώστε τα fingerprint scripts να μην μπορούν να ανοίξουν STUN UDP προς το `stun.l.google.com:19302`. Οι προσαρμοσμένες κλήσεις `chromium.launch` θα πρέπει επίσης να περιλαμβάνουν αυτό το flag.

Τα Playwright nodes βάσει βημάτων (`playwrightSteps`) παράγονται πλήρως από το Heym (χωρίς αυθαίρετο κώδικα), δεν επηρεάζονται από όλα τα παραπάνω και είναι πάντα διαθέσιμα — προτιμήστε τα.

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Crawler Node](./crawler-node.md) – Απλούστερη εξαγωγή δεδομένων από τον ιστό με FlareSolverr
- [Credentials Sharing](../reference/credentials-sharing.md) – Διαπιστευτήρια LLM για βήματα AI
