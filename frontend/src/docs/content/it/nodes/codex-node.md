# Nodo Codex

Il nodo **Codex** esegue la CLI OpenAI Codex in un workspace Heym isolato su un repository GitHub. È progettato per attività di programmazione quali la correzione di test, la modifica di file, la produzione di una patch o l'apertura di una pull request in bozza.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1, più `question` |
| Credenziale | Token di accesso Codex + GitHub |
| Output | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticazione

La credenziale **OpenAI Codex** supporta due modalità di autenticazione:

| Modalità | Descrizione |
|------|-------------|
| **Sign in with ChatGPT** (consigliata) | Accesso OAuth (PKCE) che utilizza la sottoscrizione ChatGPT Plus/Pro, pertanto le esecuzioni **non** comportano costi API per token. Fare clic su **Sign in with ChatGPT** nella finestra della credenziale, autorizzare nel browser, quindi incollare nuovamente in Heym l'URL di reindirizzamento `localhost:1455`. Heym memorizza il bundle di token risultante e lo aggiorna automaticamente alla scadenza. |
| **Access token** | Incollare un `access_token` ChatGPT/Codex utilizzato esclusivamente dal runner Codex locale. |

Le chiavi API non sono accettate per la credenziale Codex. Il nodo non invia attività Codex al cloud; clona il repository all'interno del runtime Heym, scrive il bundle di token ChatGPT in un `auth.json` isolato (oppure passa `CODEX_ACCESS_TOKEN`) esclusivamente al processo Codex, e mantiene il token al di fuori di `$credentials`.

Il nodo richiede inoltre una credenziale **GitHub** per clonare repository privati, effettuare il push del branch di lavoro e creare pull request in bozza.

Nelle distribuzioni Docker, Heym esegue Codex all'interno di un container sibling della stessa immagine Heym (non di un'immagine GHCR separata). Tale container monta esclusivamente il volume del workspace Codex e consente alla sandbox bubblewrap di Codex di creare namespace e un `/proc` nuovo. Il runner aggiunge `SYS_ADMIN`, seccomp e AppArmor non confinati, e `systempaths=unconfined` (Docker Engine 25+). In assenza di quest'ultimo flag, ogni comando fallisce prima dell'avvio con `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Riferimenti OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Campi

| Campo | Descrizione |
|-------|-------------|
| Codex Credential | Credenziale OpenAI Codex (accesso ChatGPT o `access_token`) |
| GitHub Credential | Credenziale PAT GitHub utilizzata per l'accesso al repository |
| Repository URL | URL HTTPS del repository GitHub |
| Base Branch | Branch da clonare prima dell'esecuzione di Codex, predefinito `main` |
| Model | Modello Codex opzionale (menu a tendina modificabile, ad es. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); se vuoto, utilizza il valore predefinito di Codex |
| Reasoning Effort | Profondità di ragionamento di Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` o `ultra` (predefinito `medium`) |
| Task Prompt | Attività di programmazione per Codex; supporta espressioni quali `$input.text` |
| Publish Mode | Modalità di consegna delle modifiche (vedere la tabella seguente) |
| Branch Name | Branch di lavoro per le modalità PR/commit, predefinito `codex/$executionId` |
| Timeout | Tempo massimo di esecuzione di Codex in secondi |

## Modalità di pubblicazione

| Modalità | Cosa esegue |
|------|--------------|
| `diff_only` | Modifica i file localmente e restituisce la patch e i file modificati. Nulla viene inviato tramite push. |
| `draft_pr` | Esegue il commit sul branch, ne effettua il push e apre una pull request in bozza. |
| `open_pr` | Esegue il commit sul branch, ne effettua il push e apre una pull request pronta per la revisione (non in bozza). |
| `commit_push` | Esegue il commit sul branch e ne effettua il push, senza aprire una pull request. |
| `direct_commit` | Esegue il commit e il push direttamente sul branch di base (nessun branch separato né PR). |
| `open_or_update_pr` | Aggiorna la PR aperta esistente dell'agente, se presente — anche qualora il nome del branch differisca, il runner la individua tramite autore + base — altrimenti ne apre una nuova. Ideale per riesecuzioni e istruzioni del tipo "aggiorna la PR aperta". |
| `update_existing_pr` | Aggiunge un commit al branch/PR esistente; ne apre una se non ne esiste ancora alcuna. |
| `patch_artifact` | Salva il diff come file scaricabile e restituisce `patchUrl`. Nulla viene inviato tramite push. |

## Output

| Chiave | Descrizione |
|-----|-------------|
| `status` | `completed` o `needs_input` |
| `summary` | Riepilogo di Codex |
| `validation` | Note di validazione, test o controlli segnalati da Codex |
| `diff` | Patch Git quando i file sono stati modificati |
| `changedFiles` | Percorsi dei file modificati |
| `threadId` | Id thread/sessione Codex quando disponibile |
| `branchName` | Nome del branch di lavoro |
| `pullRequestUrl` | URL della PR nelle modalità `draft_pr`, `open_pr`, `open_or_update_pr` e `update_existing_pr` |
| `pushedBranch` | Branch inviato tramite push nelle modalità commit/PR |
| `patchUrl` | Link di download del diff nella modalità `patch_artifact` |
| `usage` | Metadati di utilizzo segnalati dalla CLI Codex quando disponibili |
## Screenshot dell'interfaccia utente sulle pull request

Per le attività relative all'interfaccia utente/frontend, Codex deve salvare gli screenshot in formato PNG in un percorso escluso da Git, ad esempio `frontend/.e2e-artifacts/` (non nel codice sorgente). Qualora le dipendenze del frontend risultino mancanti, Codex può eseguire `bun install` (oppure npm/pnpm install) e avviare un'anteprima temporanea/`bun run dev` al solo scopo di acquisire l'interfaccia utente. Heym carica tali immagini in un'unica **prerelease** GitHub condivisa (`codex-pr-assets`) come asset denominati `<branch>-…`, per poi incorporarli nella descrizione della PR **prima dell'apertura della pull request**, cosicché una nuova PR venga creata già contenente i relativi screenshot (le PR esistenti vengono aggiornate sul posto). Codex deve inoltre impostare un `pull_request_title` significativo (mai segnaposto quali `Done.`).

Talvolta Codex conclude un turno a metà attività ("…Now let me take a screenshot"), il che finalizzerebbe l'esecuzione prima che lo screenshot venga acquisito. Per evitarlo, il prompt del runner richiede di acquisire gli screenshot **prima** del risultato finale e, qualora l'esecuzione termini comunque senza un riepilogo pubblicabile oppure con una modifica all'interfaccia utente ma senza screenshot, Heym esegue un ulteriore passaggio di Codex nel medesimo workspace per completare. Se una modifica all'interfaccia utente rimane priva di screenshot anche successivamente, viene aggiunta una nota visibile al corpo della PR affinché tale lacuna non rimanga mai silenziosa.

## Cosa viene pubblicato su GitHub

Il **Task Prompt** costituisce un input privato, non un contenuto della PR. Vengono pubblicati soltanto due elementi: un `## Change Summary` che descrive l'effetto della modifica al codice e una sezione `## Screenshots` qualora siano stati acquisiti degli screenshot. Il titolo della PR deriva esclusivamente dal riepilogo delle modifiche.

Il prompt del runner enuncia questa policy e Heym la applica altresì dopo l'esecuzione: prima che qualsiasi cosa venga sottoposta a commit o aperta come pull request, vengono rimosse le sezioni di eco del prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) e qualsiasi paragrafo copiato testualmente dal task prompt, dal riepilogo, dal corpo della PR e dal messaggio di commit. Anche la narrazione dei passaggi, quale `Both pass. Let me do a final review:`, viene rifiutata come titolo della PR o oggetto del commit.

## Domande di follow-up

Qualora a Codex occorrano requisiti mancanti o una decisione di prodotto, esso restituisce `needs_input`. Heym sospende l'esecuzione ed espone un handle di output `question`. Collegare tale handle a un ramo di notifica, ad esempio Slack o Send Email, per inviare al revisore il link pubblico di follow-up.

Quando il revisore risponde, Heym riprende lo stesso snapshot di esecuzione e il medesimo thread di Codex a partire dai metadati del workspace salvati.

## Come strumento di un agente

Il Nodo Codex può essere collegato all'handle degli strumenti di un Nodo **AI Agent**, affinché l'agente possa delegare attività di programmazione. Configurare la credenziale, la credenziale GitHub e il repository sul nodo, quindi contrassegnare **Task Prompt** (e facoltativamente **Repository URL**) con l'interruttore fornito dall'agente, affinché sia l'agente a fornirli al momento della chiamata. Quando Codex viene eseguito come strumento, un risultato `needs_input` viene restituito inline all'agente anziché sospendere il workflow, così che l'agente possa perfezionare la richiesta e richiamare nuovamente Codex.

## Esempio

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

## Correlati

- [Nodo GitHub](./github-node.md)
- [Nodo Agent](./agent-node.md)
- [Credenziali](../reference/credentials.md)
- [Condivisione delle credenziali](../reference/credentials-sharing.md)
- [Tipi di nodo](../reference/node-types.md)
