# Αρχιτεκτονική Agent

Ο [Agent Node](../nodes/agent-node.md) υποστηρίζει sub-agents, sub-workflows, εργαλεία κόμβων canvas, μοτίβο orchestrator, skills, συνδέσεις MCP, tool calling, προαιρετική [persistent memory](./agent-persistent-memory.md) (ανά κόμβο canvas, με προαιρετική κοινή χρήση σε άλλους agents) και προαιρετική [human review](./human-in-the-loop.md). Αυτή η σελίδα περιγράφει την αρχιτεκτονική.

## Sub-Agents

Τα sub-agents είναι agent nodes που ένας orchestrator μπορεί να καλέσει μέσω του εργαλείου `call_sub_agent`.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agents**: Πρέπει να χρησιμοποιούν `$input.text` στο User Message τους, ώστε να λαμβάνουν το prompt του orchestrator
- **Εργαλείο**: `call_sub_agent` με `sub_agent_label` (enum) και `prompt`
- **Όριο βάθους**: Μέγιστο 5 ένθετες κλήσεις sub-agent

### Ροή Εκτέλεσης

1. Ο orchestrator αποφασίζει να καλέσει ένα sub-agent
2. Το `_execute_sub_agent_tool` εντοπίζει τον target agent μέσω label
3. Δημιουργείται `synthetic_inputs = {"input": {"text": prompt}}`
4. Εκτελείται το `_execute_agent_node` για το sub-agent
5. Το αποτέλεσμα επιστρέφεται στον orchestrator

### Παράλληλη Εκτέλεση Sub-Agent

Όταν ο orchestrator επιστρέφει πολλαπλές κλήσεις εργαλείου `call_sub_agent` σε ένα μόνο turn, αυτές εκτελούνται **παράλληλα**. Για παράδειγμα, αν ο χρήστης ρωτήσει για το "Paris" και ο orchestrator καλέσει ταυτόχρονα τους `distanceAgent` και `foodAgent`, και οι δύο εκτελούνται ταυτόχρονα αντί διαδοχικά.

- **Όφελος**: Ο συνολικός χρόνος είναι περίπου όσο ο πιο αργός sub-agent, όχι το άθροισμα όλων.
- **Υπόδειξη**: Ενθαρρύνετε τον orchestrator να καλεί πολλαπλά sub-agents σε ένα turn όταν η εργασία το απαιτεί.

## Sub-Workflows

Όταν έχει ρυθμιστεί το `subWorkflowIds`, ο agent μπορεί να καλέσει άλλα workflows μέσω του εργαλείου `call_sub_workflow`.

- **Διαμόρφωση**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Εργαλείο**: `call_sub_workflow` με `workflow_id` (enum) και `inputs` (object)
- **Όριο βάθους**: Μέγιστο 5 ένθετες κλήσεις sub-workflow

### Ροή Εκτέλεσης

1. Ο agent αποφασίζει να καλέσει ένα sub-workflow
2. Το `_execute_sub_workflow_tool` ανακτά το workflow από το `workflow_cache`
3. Δημιουργείται `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Εκτελείται το `WorkflowExecutor.execute()` για το sub-workflow
5. Το αποτέλεσμα επιστρέφεται στον agent

Τα sub-workflows δεν μπορούν να κάνουν παύση για HITL στην v1. Αν ένα ένθετο sub-workflow επιχειρήσει να εισέλθει σε κατάσταση pending review, η εκτέλεση αποτυγχάνει αντί να ανασταλεί εντός της ένθετης κλήσης.

## Εργαλεία Κόμβων Canvas

Τα εργαλεία κόμβων canvas είναι κόμβοι workflow συνδεδεμένοι σε έναν agent μέσω του handle `tool-input`. Κατά τη ρύθμιση του agent, το `_build_node_tool_schemas` σαρώνει αυτές τις συνδέσεις και προσθέτει ένα συμβατό με OpenAI schema εργαλείου ανά συνδεδεμένο κόμβο.

- **Πηγή εργαλείου**: `_source: "node_tool"`
- **Όνομα εργαλείου**: προκύπτει από το label του συνδεδεμένου κόμβου, με προσθήκη επιθημάτων για διπλότυπα
- **Παράμετροι εργαλείου**: δημιουργούνται από τα `agentProvidedFields` του κόμβου
- **Σταθερά πεδία**: όλα τα πεδία του κόμβου που δεν αναφέρονται στα `agentProvidedFields` παραμένουν στη διαμόρφωση του κόμβου

### Ροή Εκτέλεσης

1. Ο agent αποφασίζει να καλέσει ένα εργαλείο συνδεδεμένου κόμβου
2. Το `_execute_node_tool` αντιγράφει τα δεδομένα του κόμβου
3. Τα ορίσματα που παρέχει ο agent συγχωνεύονται στα διαμορφωμένα πεδία του κόμβου
4. Το `execute_node` εκτελεί αυτόν τον κόμβο μία φορά με απενεργοποιημένο τον προγραμματισμό διακλάδωσης
5. Τα αρχικά δεδομένα του κόμβου επαναφέρονται
6. Η έξοδος του κόμβου επιστρέφεται στον agent ως αποτέλεσμα του εργαλείου

Οι κόμβοι εργαλείων εξαιρούνται από τον κανονικό προγραμματισμό workflow, ώστε να μην εκτελούνται δύο φορές. Εκτελούνται μόνο μέσω της διαδρομής κλήσης εργαλείου του agent.

## Human-in-the-Loop

Όταν έχει οριστεί το `hitlEnabled` σε έναν agent, ο agent λαμβάνει ένα εργαλείο `request_human_review` που μπορεί να καλέσει σε συγκεκριμένα σημεία ελέγχου έγκρισης.

1. Το system prompt και οι οδηγίες HITL του κόμβου υποδεικνύουν στον agent ποιες ενέργειες απαιτούν έγκριση
2. Όταν ο agent φτάσει σε ένα από αυτά τα βήματα, καλεί το `request_human_review`
3. Το Heym αποθηκεύει ένα snapshot εκτέλεσης workflow και δημιουργεί ένα δημόσιο αίτημα review
4. Το αποτέλεσμα του κόμβου επισημαίνεται ως `pending` με ένα URL review
5. Το handle εξόδου `review` του agent προγραμματίζεται αμέσως, ώστε οι διακλαδώσεις ειδοποίησης να μπορούν να εκτελεστούν με το pending payload
6. Ο κύριος προγραμματισμός εκτέλεσης σταματά μέχρι να απαντήσει ο reviewer
7. Σε `accept`, `edit` ή `refuse`, ο executor αναδομείται από το αποθηκευμένο snapshot
8. Ο σε παύση agent συνεχίζει με το εγκεκριμένο context review ή εξέρχεται αμέσως σε `refuse`
9. Οι downstream κόμβοι συνεχίζουν αφού ολοκληρωθεί ο resumed agent, χωρίς επανεκτέλεση της διακλάδωσης `review`
10. Αν μια μεταγενέστερη ενέργεια απαιτεί επίσης έγκριση, ο agent μπορεί να δημιουργήσει άλλο σημείο ελέγχου HITL στην ίδια εκτέλεση

Η σύνοψη που απευθύνεται στον reviewer δημιουργείται από το ίδιο το αίτημα review, ώστε το πεδίο του κόμβου να μπορεί να παραμένει εστιασμένο στην πολιτική έγκρισης και τον χρονισμό.

Αυτό επιτρέπει στα agent workflows να αναμένουν εξωτερική έγκριση, διατηρώντας παράλληλα το ιστορικό συνομιλίας, τις ολοκληρωμένες εξόδους κόμβων, την κατάσταση loop και άλλο runtime context.

## Orchestrator Tool Executor

Ο προσαρμοσμένος executor εργαλείων δρομολογεί:

- **Κλήσεις sub-agent** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Κλήσεις sub-workflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Εργαλεία κόμβων canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Human review** (`_source == "hitl"`) → δημιουργεί ένα pending σημείο ελέγχου HITL
- **Άλλα εργαλεία** → `_unified_tool_executor` (Python, MCP, εργαλεία skill)

Χρησιμοποιείται όταν είναι ενεργοποιημένο το HITL, όταν έχει οριστεί `isOrchestrator` με `subAgentLabels` ή όταν έχει ρυθμιστεί το `subWorkflowIds`.
## Δεξιότητες

Οι Δεξιότητες επεκτείνουν το system context του agent και μπορούν να προσθέσουν εργαλεία Python.

- **Μορφή**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Περιεχόμενο**: Προστίθεται στην αρχή της system instruction (ενωμένο με `---`)
- **Εργαλεία Python**: Για κάθε δεξιότητα με αρχεία `.py`, προστίθεται ένα εργαλείο `skill_{skill_name}`
- **Εκτέλεση**: Το `skill_python_executor.py` εκτελεί scripts με `uv run python` σε προσωρινό κατάλογο· τα args ως JSON στο stdin, το αποτέλεσμα ως JSON στο stdout

Οι Δεξιότητες μπορούν να προστεθούν με απόθεση ενός αρχείου `.zip` ή `.md` στην περιοχή Δεξιοτήτων στη διαμόρφωση του [Agent Node](../nodes/agent-node.md).

## MCP Client

Ο client MCP (Model Context Protocol) συνδέεται με εξωτερικούς διακομιστές εργαλείων.

- **Transports**: `stdio` (command + args) ή `sse` (url + headers)
- **Λίστα εργαλείων**: `list_mcp_tools` → `ClientSession.list_tools()` → μετατροπή σε μορφή συνάρτησης OpenAI με `_source: "mcp"`
- **Εκτέλεση**: `execute_mcp_tool` → `ClientSession.call_tool()` → αποτέλεσμα μέσω `_extract_tool_result`

Διαμορφώστε τις συνδέσεις MCP στην [MCP Tab](../tabs/mcp-tab.md) ή στο `mcpConnections` του agent node.

## Κλήση Εργαλείων

Η υπηρεσία LLM εκτελεί έναν βρόχο `execute_with_tools`:

1. **Έλεγχος συμπίεσης context** — πριν από κάθε επανάληψη, εκτιμήστε τη χρήση token και συμπιέστε εάν χρειάζεται (δείτε παρακάτω)
2. Κλήση του μοντέλου με `tools` και `tool_choice: "auto"`
3. Εάν υπάρχουν `tool_calls`: για κάθε κλήση, εκτελέστε `tool_executor(tool_def, name, args, timeout)`
4. Προσθήκη του αποτελέσματος του εργαλείου στα messages, επανάληψη
5. Διακοπή όταν δεν υπάρχουν άλλες κλήσεις εργαλείων ή όταν επιτευχθεί το `max_tool_iterations`

### Αποστολή Εργαλείων

Το `_unified_tool_executor` δρομολογεί με βάση το `_source`:

| Πηγή | Χειριστής |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (προεπιλογή) | `execute_tool` (εργαλεία κώδικα Python) |

Τα εργαλεία χρησιμοποιούν τη μορφή function-calling του OpenAI: `name`, `description`, `parameters` (JSON schema).

## Συμπίεση Context

Για να αποτραπεί η υπερχείλιση του context σε agents μακράς διάρκειας, το Heym συμπιέζει αυτόματα τη συσσωρευμένη λίστα `messages` πριν από κάθε επανάληψη εργαλείου.

### Αλγόριθμος

1. **Εκτίμηση token**: `total_chars / 4` σε όλα τα messages (γρήγορο, χωρίς ανάγκη tokenizer)
2. **Έλεγχος ορίου**: εάν `estimated_tokens < context_limit × 0.80`, παράλειψη συμπίεσης
3. **Όριο context**: δοκιμή `client.models.retrieve(model).context_window`· εναλλακτικά χρήση ενσωματωμένου πίνακα (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, κ.λπ.)· προεπιλογή 128K
4. **Διατήρηση anchors**: πάντα διατηρούνται
   - Το πρώτο μήνυμα `system` (ταυτότητα και οδηγίες του agent)
   - Το πρώτο μήνυμα `user` (αρχική εργασία)
   - Το τελευταίο μήνυμα `user` (πιο πρόσφατη οδηγία)
5. **Σύνοψη μέσου**: ό,τι βρίσκεται μεταξύ του πρώτου και του τελευταίου μηνύματος user σειριοποιείται και αποστέλλεται στο ίδιο μοντέλο με prompt σύνοψης
6. **Αναδόμηση**: `[system, first_user, assistant(summary), last_user]`

Η συμπίεση παραλείπεται εάν υπάρχουν λιγότερα από 2 διακριτά μηνύματα user (δεν υπάρχει μέσο για σύνοψη) ή εάν η κλήση σύνοψης του LLM αποτύχει (ασφαλής εναλλακτική: επιστροφή των αρχικών messages).

### Παρατηρησιμότητα

Κάθε συμβάν συμπίεσης καταγράφεται ως:
- Μια καταχώρηση `_context_compression` στο `tool_calls_collected` → ορατή στη λεπτομέρεια εκτέλεσης του Execution History
- Ένα συμβάν `on_tool_call` με `phase: "compression"` → αποδίδεται στο Debug panel ως `Context compressed (N messages → summary)`
- Μια καταχώρηση LLM trace `context.compression` → ορατή στο Traces tab με εκτιμήσεις token πριν/μετά

Οι κλήσεις εργαλείων του agent εκπέμπουν επίσης πλουσιότερη παρατηρησιμότητα:

- Πεδία κύκλου ζωής ανά κλήση στα `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Συγκεντρωτικά `tool_metrics` στο αποτέλεσμα του agent (πλήθη ανά status συν συνολική/μέγιστη διάρκεια)· οι καταχωρήσεις `_context_compression` εξαιρούνται από αυτά τα πλήθη
- Προαιρετικά child spans OpenTelemetry με όνομα `heym.agent.tool.execute` (δείτε [OpenTelemetry Tracing](./opentelemetry.md))
- Τα αποθηκευμένα payloads `tool_calls` του LLM trace / execution-history είναι redacted και περιορισμένα σε μέγεθος· η ζωντανή κατάσταση HITL resume διατηρεί τα πρωτότυπα για αντιστοίχιση

## Σχετικά

- [Why Heym](../getting-started/why-heym.md) – Multi-agent orchestration σε όλο τον κύκλο ζωής του agent
- [Agent Node](../nodes/agent-node.md) – Διαμόρφωση και παράμετροι
- [Agent Persistent Memory](./agent-persistent-memory.md) – Γράφος γνώσης ανά agent node και peer sharing
- [Human-in-the-Loop](./human-in-the-loop.md) – Σύνδεσμοι αναθεώρησης, εκκρεμή payloads και συμπεριφορά resume
- [OpenTelemetry Tracing](./opentelemetry.md) – Spans Workflow, node και Agent tool
- [Node Types](./node-types.md) – Agent και σχετικοί κόμβοι
- [Parallel Execution](./parallel-execution.md) – Παράλληλη εκτέλεση βασισμένη σε DAG και sub-agent
- [MCP Tab](../tabs/mcp-tab.md) – Διαμόρφωση συνδέσεων MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` για sub-agents
