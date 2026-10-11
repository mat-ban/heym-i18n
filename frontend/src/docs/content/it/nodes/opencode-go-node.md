# Nodo OpenCode Go

Il nodo **OpenCode Go** esegue la CLI [OpenCode](https://opencode.ai) (Go) in un container Heym isolato e rafforzato, operando su un repository GitHub. Analogamente al nodo Codex, è progettato per attività di sviluppo quali la correzione di test, la modifica di file, la produzione di una patch o l'apertura di una pull request — ma utilizza il gateway di modelli provider-agnostico **OpenCode Go** anziché OpenAI Codex.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | Chiave API OpenCode Go + GitHub |
| Output | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticazione

La credenziale **OpenCode Go** memorizza una **chiave API** del gateway OpenCode Go (ottenibile da [opencode.ai/go](https://opencode.ai/go)) e un **Gateway Base URL** opzionale (predefinito a `https://opencode.ai/zen/go/v1`; da sovrascrivere unicamente per un gateway self-hosted o proxato).

Il nodo richiede inoltre una credenziale **GitHub** per clonare repository privati, effettuare il push del branch di lavoro e creare pull request. Il token GitHub **non viene mai inserito all'interno del container sandbox** — Heym esegue tutte le operazioni git e GitHub sull'host, affinché il codice generato non possa esfiltrare le credenziali di push.

## Isolamento e sicurezza

L'isolamento dell'esecuzione è determinato da `HEYM_OPENCODE_CLI_COMMAND`, esattamente come per il nodo Codex:

- **Sviluppo locale (`run.sh`)** lo mantiene al valore predefinito `opencode`, pertanto OpenCode viene eseguito come sottoprocesso dell'host sul workspace clonato — nessun Docker richiesto, nessun flag aggiuntivo.
- **Deployment Docker (`deploy.sh` e l'immagine singola GHCR)** lo impostano a `/usr/local/bin/heym-opencode-docker`, un wrapper che esegue `opencode run` all'interno di un **container sibling effimero e rafforzato** che condivide il volume nominato del workspace OpenCode.

Il container runner rafforzato rimuove tutte le capability Linux, imposta `no-new-privileges`, utilizza una root di sola lettura con un tmpfs `/tmp` e applica limiti di pid/memoria/CPU. L'egress di rete è consentito (OpenCode deve raggiungere il gateway dei modelli). Il **token GitHub non viene mai inserito all'interno del container** — tutte le operazioni git e GitHub vengono eseguite lato host, pertanto soltanto la chiave API OpenCode e i file del repository risiedono all'interno.

OpenCode modifica esclusivamente i file su disco; Heym gestisce ogni azione git/GitHub.

## Modelli

Il roster dei modelli di OpenCode Go cambia frequentemente, pertanto il campo **Model** viene popolato in tempo reale dall'elenco dei modelli del gateway (`GET https://opencode.ai/zen/go/v1/models`) e mostrato come menu a tendina ricercabile. Qualora l'elenco in tempo reale non sia disponibile, viene utilizzato un elenco di fallback integrato. Gli id dei modelli adottano la forma `opencode-go/<model>` (ad esempio `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` è l'id del provider della CLI OpenCode per il gateway Go. Lasciare il campo vuoto per utilizzare il valore predefinito del runner (`opencode-go/kimi-k3`). Gli id dei modelli salvati nella forma precedente `opencode/<model>` vengono riscritti automaticamente al momento dell'esecuzione.

## Campi

| Campo | Descrizione |
|-------|-------------|
| OpenCode Go Credential | Credenziale OpenCode Go (chiave API del gateway) |
| GitHub Credential | Credenziale PAT GitHub utilizzata per l'accesso al repository |
| Repository URL | URL HTTPS del repository GitHub; supporta le espressioni |
| Base Branch | Branch da clonare prima dell'esecuzione di OpenCode, predefinito `main` |
| Model | Modello OpenCode Go (menu a tendina ricercabile in tempo reale, `opencode-go/<model>`); se vuoto utilizza il valore predefinito del runner |
| Reasoning Variant | Opzionale; mappa su `opencode run --variant` per i modelli che supportano il reasoning effort |
| Task Prompt | Attività di sviluppo per OpenCode; supporta espressioni quali `$input.text` |
| Publish Mode | Modalità di consegna delle modifiche (vedere la tabella sottostante) |
| Branch Name | Branch di lavoro per le modalità PR/commit, predefinito `opencode/$executionId` |
| Timeout | Tempo massimo di esecuzione di OpenCode in secondi |

## Modalità di pubblicazione

| Modalità | Cosa esegue |
|------|--------------|
| `diff_only` | Modifica i file localmente e restituisce la patch e i file modificati. Nulla viene sottoposto a push. |
| `draft_pr` | Esegue il commit sul branch, ne effettua il push e apre una pull request in bozza. |
| `open_pr` | Esegue il commit sul branch, ne effettua il push e apre una pull request pronta per la revisione (non in bozza). |
| `commit_push` | Esegue il commit sul branch e ne effettua il push, senza aprire una pull request. |
| `direct_commit` | Esegue il commit e il push direttamente sul branch di base (nessun branch separato né PR). |
| `open_or_update_pr` | Aggiorna la PR aperta esistente dell'agente qualora ne esista una — anche se il nome del branch differisce, il runner la individua per autore + base — altrimenti ne apre una nuova. Ideale per riesecuzioni e istruzioni del tipo "aggiorna la PR aperta". |
| `update_existing_pr` | Aggiunge un commit al branch/PR esistente; ne apre una qualora non ne esista ancora alcuna. |
| `patch_artifact` | Salva il diff come file scaricabile e restituisce `patchUrl`. Nulla viene sottoposto a push. |
## Output

| Chiave | Descrizione |
|-----|-------------|
| `status` | Sempre `completed` (il nodo OpenCode Go non si arresta in attesa di input) |
| `summary` | Messaggio finale di OpenCode |
| `validation` | Note di validazione quando segnalate |
| `diff` | Patch Git quando i file sono stati modificati |
| `changedFiles` | Percorsi dei file modificati |
| `branchName` | Nome del branch di lavoro |
| `pullRequestUrl` | URL della PR nelle modalità `draft_pr`, `open_pr`, `open_or_update_pr` e `update_existing_pr` |
| `pushedBranch` | Branch sottoposto a push nelle modalità commit/PR |
| `patchUrl` | Link di download per il diff nella modalità `patch_artifact` |

## Screenshot dell'interfaccia sulle pull request

Per le attività di UI/frontend, OpenCode deve salvare gli screenshot PNG in un percorso escluso da Git, ad esempio `frontend/.e2e-artifacts/` (non nel codice sorgente). Se le dipendenze frontend risultano mancanti, il prompt del runner consente un'installazione mirata dei pacchetti (ad esempio `bun install`) e un'anteprima temporanea/`bun run dev` al solo scopo di acquisire l'interfaccia. Heym carica tali immagini su un'unica **prerelease** GitHub condivisa (`opencode-pr-assets`) come asset denominati `<branch>-…`, per poi incorporarle nella descrizione della PR **prima dell'apertura della pull request**, cosicché una nuova PR venga creata già contenente i relativi screenshot (le PR esistenti vengono aggiornate sul posto).

A OpenCode viene inoltre richiesto di terminare con una riga `PR_TITLE: …`, affinché Heym possa aprire la pull request con un oggetto significativo anziché con segnaposto quali `Done.`

Talvolta OpenCode conclude un turno a metà attività ("…Now let me take a screenshot"), il che finalizzerebbe l'esecuzione prima dell'acquisizione dello screenshot. Per evitarlo, il prompt del runner impone di acquisire gli screenshot **prima** del messaggio finale e, qualora l'esecuzione si concluda comunque senza un riepilogo pubblicabile oppure con una modifica all'interfaccia ma senza screenshot, Heym esegue un ulteriore passaggio di OpenCode nel medesimo workspace per completare il lavoro. Se una modifica all'interfaccia rimane priva di screenshot anche in seguito, viene aggiunta una nota visibile nel corpo della PR, affinché tale mancanza non passi mai inosservata.

## Cosa viene pubblicato su GitHub

Il **Task Prompt** costituisce un input privato, non un contenuto della PR. Vengono pubblicati soltanto due elementi: una sezione `## Change Summary` che descrive l'effetto della modifica al codice e una sezione `## Screenshots` quando sono stati acquisiti degli screenshot. Il titolo della PR deriva esclusivamente dal riepilogo delle modifiche.

Il prompt del runner enuncia questa policy e Heym la applica altresì dopo l'esecuzione: prima che qualsiasi contenuto venga sottoposto a commit o aperto come pull request, vengono rimosse le sezioni di eco del prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) e qualsiasi paragrafo copiato testualmente dal task prompt, dal riepilogo, dal corpo della PR e dal messaggio di commit.

Heym legge la sezione `## Change Summary` dai messaggi dell'agente anziché prendere l'ultimo messaggio emesso, poiché OpenCode genera un messaggio per ogni passaggio e quello finale è spesso un commento a metà esecuzione. Anche la narrazione dei passaggi (`Both pass. Let me do a final review:`) viene rifiutata come titolo della PR o oggetto del commit. Se l'esecuzione non produce alcun riepilogo delle modifiche utilizzabile, la pull request ripiega sull'elenco dei file modificati anziché pubblicare commenti.

## Come strumento dell'agente

Il nodo OpenCode Go può essere collegato all'handle degli strumenti di un nodo **AI Agent**, affinché l'agente possa delegare attività di programmazione. Configurare la credenziale, la credenziale GitHub e il repository sul nodo, quindi contrassegnare **Task Prompt** (e facoltativamente **Repository URL**) con l'interruttore fornito dall'agente, affinché l'agente li fornisca al momento della chiamata.

## Esempio

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

## Correlati

- [Nodo Codex](./codex-node.md)
- [Nodo GitHub](./github-node.md)
- [Nodo Agent](./agent-node.md)
- [Credenziali](../reference/credentials.md)
- [Condivisione delle credenziali](../reference/credentials-sharing.md)
- [Tipi di nodo](../reference/node-types.md)
