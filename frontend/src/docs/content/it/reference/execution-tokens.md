# Execution Tokens

Gli Execution Token sono JWT con ambito limitato che concedono l'accesso agli endpoint di esecuzione e streaming di un singolo workflow. Consentono di richiamare un workflow da sistemi esterni senza esporre il token di sessione utente a lunga durata.

## Perché utilizzare gli Execution Token

Quando l'autenticazione di un workflow è impostata su **JWT**, l'endpoint richiede normalmente una sessione utente valida. Gli Execution Token consentono di:

- Condividere un token richiamabile con script esterni, pipeline CI o integrazioni senza condividere le credenziali dell'account.
- Limitare l'esposizione — un token è valido solo per uno specifico workflow.
- Revocare l'accesso istantaneamente senza modificare la password o ruotare i token di sessione.
- Scegliere tra token a breve durata (minuti o ore) e token a lunga durata (fino a 10 anni).

## Creazione di un Token

Aprire la finestra di dialogo **Run with cURL** nell'editor (barra degli strumenti in alto a destra). Quando l'autenticazione del workflow è impostata su **JWT Token**, la finestra di dialogo mostra un gestore di token:

1. Scegliere **Short-lived** o **Long-lived (10yr)**.
2. Per i token a breve durata, inserire la durata in secondi (minimo 60).
3. Fare clic su **+ New Token**.

Il token viene creato immediatamente, aggiunto all'elenco e selezionato automaticamente, in modo che il comando cURL venga aggiornato per includerlo.

## Elenco dei Token

Ogni riga del token mostra:

| Colonna | Descrizione |
|--------|-------------|
| Created | Timestamp di creazione |
| Status | **Expires:** data, **Expired** o **Revoked** |
| Icona a forma di occhio | Attiva/disattiva la visibilità del valore del token |
| Pulsante Revoke | Contrassegna il token come revocato (irreversibile) |

Fare clic su una riga attiva (non scaduta, non revocata) per selezionarla. Il token selezionato viene incorporato nell'anteprima del comando cURL.

I token scaduti e revocati rimangono visibili nell'elenco ma non possono essere selezionati.

## Utilizzo di un Token

Copiare il valore del token dall'elenco (fare clic sull'icona a forma di occhio per visualizzarlo) e includerlo come token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Quando si utilizza **Copy cURL** nella finestra di dialogo con un token selezionato, il token è già incorporato nel comando — non è necessaria alcuna sostituzione manuale.

## Ambito del Token

Ogni token contiene le seguenti claim JWT:

| Claim | Valore |
|-------|-------|
| `sub` | ID utente del creatore del token |
| `wid` | UUID del workflow — il token viene rifiutato per qualsiasi altro workflow |
| `scope` | `workflow:execute` — lo distingue da un token di sessione utente |
| `jti` | ID univoco del token utilizzato per le ricerche di revoca |
| `exp` | Timestamp di scadenza |

Il backend verifica tutti questi elementi a ogni richiesta: validità della firma, scadenza, corrispondenza del `wid` e che il `jti` non sia stato revocato.

## Revoca

Fare clic sul pulsante di revoca (cerchio barrato) accanto a un token per revocarlo. La revoca ha effetto immediato — le richieste successive che utilizzano quel token restituiscono `401`. La riga del token rimane visibile nell'elenco con l'etichetta **Revoked**.

Non è possibile annullare la revoca. Creare un nuovo token se è necessario ripristinare l'accesso.

## API

Gli endpoint di gestione dei token sono autenticati con la sessione regolare.

| Metodo | Percorso | Descrizione |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Creare un token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Elencare i propri token per questo workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Revocare un token |

**Corpo della richiesta di creazione:**

```json
{ "ttl_seconds": 900 }
```

**Risposta di creazione:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Il campo `token` viene restituito una sola volta al momento della creazione. Conservarlo immediatamente; le richieste `GET` successive restituiscono la stessa riga, ma è anche possibile visualizzarlo nella finestra di dialogo cURL in qualsiasi momento.

## Ambito di visibilità

Ogni utente vede solo i token che ha creato. I membri del team con accesso a un workflow condiviso non possono vedere i token altrui.

## Correlati

- [Webhooks](./webhooks.md) — endpoint di trigger HTTP e finestra di dialogo cURL
- [Security](./security.md) — panoramica sulla gestione delle sessioni e sull'autenticazione
- [SSE Streaming](./sse-streaming.md) — utilizzare gli Execution Token con l'endpoint di streaming