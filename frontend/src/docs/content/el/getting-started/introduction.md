# Εισαγωγή

**Δημιουργήστε agentic συστήματα. Εκτελέστε τα με σιγουριά.**

Το Heym είναι υποδομή για την εκτέλεση και τη διακυβέρνηση AI agents σε παραγωγή. Ενορχηστρώστε agents, αυτοματοποιήστε επιχειρησιακές διαδικασίες, επιθεωρήστε κάθε εκτέλεση και κρατήστε τους ανθρώπους στον έλεγχο. Αναπτύξτε το Heym στη δική σας υποδομή.

Στο Heym, ένα Workflow ορίζει πώς agents, ντετερμινιστικά βήματα, εργαλεία και δεδομένα συνεργάζονται. Το runtime εκτελεί αυτό το γράφημα, καταγράφει κάθε εκτέλεση και κάνει παύση για ανθρώπινη αξιολόγηση όπου το ζητήσετε. Ο οπτικός καμβάς είναι το σημείο όπου δημιουργείτε και επιθεωρείτε Workflows, και τα ίδια Workflows εκτελούνται επίσης από APIs, χρονοδιαγράμματα, event triggers, MCP clients και συνομιλίες στο Portal. Επισκεφθείτε το [heym.run](https://heym.run) για τον ιστότοπο του προϊόντος και δείτε το [Why Heym](./why-heym.md) για το τι διαχειρίζεται το Heym σε κάθε στάδιο του κύκλου ζωής ενός agent.

## Τι Μπορείτε να Κάνετε

- **Δημιουργία** – Συνθέστε agents και ντετερμινιστικά βήματα στον [καμβά](../reference/canvas-features.md) στην καρτέλα [Workflows](../tabs/workflows-tab.md), περιγράψτε τα στον [AI Assistant](../reference/ai-assistant.md) ή ξεκινήστε από τα [Templates](../tabs/templates-tab.md)
- **Ενορχήστρωση** – Συντονίστε κόμβους [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) και [RAG](../nodes/rag-node.md), [sub-agents](../reference/agent-architecture.md), εργαλεία MCP και [integrations](../reference/integrations.md) όπως HTTP, Slack και email, με [παράλληλη εκτέλεση](../reference/parallel-execution.md) όπου το επιτρέπουν οι εξαρτήσεις
- **Εκτέλεση** – Ξεκινήστε Workflows από [webhooks](../reference/webhooks.md), χρονοδιαγράμματα [Cron](../nodes/cron-node.md) και event [triggers](../reference/triggers.md), με επαναλήψεις ανά κόμβο, [διαχείριση σφαλμάτων](../nodes/error-handler-node.md) και [κατανομή φόρτου](../reference/cluster.md) μεταξύ instances
- **Παρατήρηση** – Επιθεωρήστε το [ιστορικό εκτελέσεων](../reference/execution-history.md), τα [LLM traces](../tabs/traces-tab.md) με κόστη token, τα [analytics](../tabs/analytics-tab.md) και τις [ειδοποιήσεις](../tabs/alerts-tab.md), και εξάγετε traces [OpenTelemetry](../reference/opentelemetry.md)
- **Αξιολόγηση** – Δοκιμάστε prompts και μοντέλα έναντι αναμενόμενων αποτελεσμάτων στην καρτέλα [Evals](../tabs/evals-tab.md)
- **Έλεγχος** – Κάντε παύση των agents για [ανθρώπινη αξιολόγηση](../reference/human-in-the-loop.md), αποκλείστε μη ασφαλές περιεχόμενο με [guardrails](../reference/guardrails.md) και διαχειριστείτε την πρόσβαση με [credentials](../tabs/credentials-tab.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) και [audit trail](../reference/audit.md)
- **Έκθεση** – Παρέχετε Workflows μέσω REST και [SSE streaming](../reference/sse-streaming.md), ως εργαλεία [MCP](../tabs/mcp-tab.md) και ως διεπαφές συνομιλίας [Portal](../reference/portal.md) για τελικούς χρήστες· χρησιμοποιήστε την καρτέλα [Chat](../tabs/chat-tab.md) για να δοκιμάσετε μοντέλα απευθείας
- **Συνομιλία με το Heym** – Υποβάλετε ερωτήσεις για το προϊόν με consciencia της σελίδας από το παράθυρο διαλόγου [Chat with Heym](../reference/chat-with-heym.md) στην τεκμηρίωση

## Βασικές Έννοιες

- **Workflows** – Ένα κατευθυνόμενο γράφημα από nodes και edges. Τα διαχειρίζεστε στην καρτέλα [Workflows](../tabs/workflows-tab.md). Δείτε τη [Δομή Workflow](../reference/workflow-structure.md).
- **Nodes** – Μονάδες επεξεργασίας ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) κ.λπ.). Δείτε τους [Τύπους Node](../reference/node-types.md).
- **Edges** – Συνδέσεις που καθορίζουν τη ροή εκτέλεσης
- **Credentials** – API keys και μυστικά που αποθηκεύονται στην καρτέλα [Credentials](../tabs/credentials-tab.md) και στα οποία αναφέρονται τα nodes.
- **Variables** – Μόνιμα δεδομένα key-value στην καρτέλα [Variables](../tabs/global-variables-tab.md), προσβάσιμα μέσω `$global.variableName`. Δείτε τις [Global Variables](../reference/global-variables.md).
- **Expressions** – Αναφέρετε δεδομένα ανάντη με `$input` και `$nodeName.field`. Δείτε το [Expression DSL](../reference/expression-dsl.md).

## Σχετικά

- [Γιατί Heym](./why-heym.md) – Τι διαχειρίζεται το Heym σε κάθε στάδιο του κύκλου ζωής του agent
- [Γρήγορη Εκκίνηση](./quick-start.md) – Δημιουργήστε το πρώτο σας workflow
- [Εκτέλεση & Deployment](./running-and-deployment.md) – Ξεκινήστε τοπικά με `run.sh` ή κάντε deploy με `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Δημιουργήστε workflows με φυσική γλώσσα
- [Συνομιλία με το Heym](../reference/chat-with-heym.md) – Κάντε συμπληρωματικές ερωτήσεις κατά την ανάγνωση της τεκμηρίωσης
- [Βασικές Έννοιες](./core-concepts.md) – Workflows, nodes και ροή εκτέλεσης
- [Καρτέλα Workflows](../tabs/workflows-tab.md) – Διαχείριση workflows και φακέλων
- [Καρτέλα Credentials](../tabs/credentials-tab.md) – Προσθήκη API keys για nodes
