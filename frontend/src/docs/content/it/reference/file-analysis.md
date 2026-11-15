# Analisi dei file

L'analisi dei file consente a Chat, al [nodo Agent](../nodes/agent-node.md) e al [nodo Code](../nodes/code-node.md) di aprire e analizzare file di grandi dimensioni provenienti da [Drive](./drive.md) in un ambiente sandbox Python isolato. File PDF, fogli di calcolo, CSV, DOCX e JSON vengono prima ispezionati e poi letti in modo selettivo, così un contratto di 200 pagine o una tabella con un milione di righe non deve mai essere inserito per intero nel contesto di un modello.

## Come funziona

Ogni chiamata viene eseguita in un nuovo container privo di accesso alla rete. I file necessari vengono copiati in modalità di sola lettura, il codice viene eseguito e il container viene rimosso. Una cartella di lavoro temporanea persiste tra le chiamate della stessa sessione, consentendo a un passaggio successivo di basarsi sui risultati memorizzati da quello precedente.

| Percorso | Contenuto |
|------|--------|
| `/input` | I file Drive di questa sessione, in sola lettura |
| `/work` | Spazio di lavoro persistente per la sessione, ad esempio `/work/sales.pkl` |
| `/work/out` | I file scritti qui vengono salvati in Drive dopo la chiamata e restituiti come link |

Nella sandbox sono preinstallati pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx e langdetect, oltre all'OCR Tesseract utilizzato anche dal [nodo Convertitore](../nodes/converter-node.md).

## Strumenti

Il modello interagisce con tre strumenti, più un quarto in Chat:

| Strumento | Funzione |
|------|----------|
| `list_files` | Elenca i file Drive accessibili: nome, tipo, dimensione, data |
| `inspect_file` | Restituisce tipo, metadati e struttura di un file con un breve estratto |
| `run_python` | Esegue codice Python sui file indicati e restituisce l'output della console |
| `clear_workspace` | Solo Chat: elimina la cartella di lavoro della conversazione |

`inspect_file` legge solo quanto necessario per un riepilogo:

| Tipo | Riepilogo |
|-----|-----------------|
| PDF | Conteggio pagine, titolo e autore, possibilità di estrarre testo, lingua, dimensioni pagine, testo e tabelle della prima pagina. I PDF scansionati vengono letti tramite OCR (fino a 5 pagine) |
| XLSX / XLS | Fogli con conteggio di righe e colonne, intestazioni, tipi, `read_hint` per pandas, intervalli denominati, prime righe |
| CSV / TSV | Codifica, delimitatore, conteggio righe, colonne con tipi, prime righe |
| DOCX | Struttura dei titoli, tabelle, conteggio parole e caratteri, autore e data |
| JSON | Tipo radice, chiavi, lunghezza array, profondità di annidamento, record di esempio |

All'interno di `run_python`, aprite un file utilizzando il modulo `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Nella Chat

Allegate file PDF, fogli di calcolo, DOCX, CSV o JSON, immagini (PNG, JPG, GIF, WebP) o file di testo normale nella [scheda Chat](../tabs/chat-tab.md), nella Chat di Heym Work o tramite lo strumento MCP `heym_chat`. Un messaggio può contenere fino a 10 file. Ogni file viene archiviato nel vostro Drive; solo il nome e l'ID vengono inseriti nel messaggio. Chat ispeziona il file, legge la parte necessaria per la domanda e risponde con tabelle o estratti.

## Nei Workflow

Un'esecuzione apre esclusivamente i propri file: quelli caricati tramite il [nodo Trigger Caricamento File](../nodes/file-upload-trigger-node.md), quelli generati dai nodi su Drive e quelli che un [nodo Drive](../nodes/drive-node.md) ha acquisito con il passaggio **Get** nella medesima esecuzione.

- **Nodo Agent**: se l'input o il messaggio dell'agente include un file, riceve automaticamente gli strumenti di cui sopra per tali file.
- **Nodo Code**: impostate **File** su un'espressione come `$Upload.file.id`. I file vengono montati e inclusi nell'elenco `params.files`.

## Limiti

| Limite | Valore |
|-----------|------|
| Memoria per chiamata | 2 GB |
| Tempo per chiamata | 120 secondi |
| Cartella di lavoro per sessione | 2 GB |
| File di output per chiamata | 20, fino a 100 MB ciascuno |
| Output a console restituito al modello | 20.000 caratteri |
| File per chiamata | 20 |

## Sicurezza

- La sandbox non ha accesso alla rete, non può accedere alle impostazioni o ai segreti di Heym e viene eseguita come utente non privilegiato.
- I file vengono analizzati unicamente all'interno della sandbox.
- Nella Chat, l'accesso segue le autorizzazioni di Drive: aprite i file personali e quelli condivisi con i vostri team.
- L'apertura di un file nella Chat viene annotata nel registro di audit.
- Il contenuto dei file viene trattato rigorosamente come dato; le istruzioni contenute al loro interno non vengono eseguite.

## Requisiti

L'analisi dei file richiede un backend sandbox sull'istanza Heym (Docker o [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Correlati

- [Drive](./drive.md)
- [Nodo Code](../nodes/code-node.md)
- [Nodo Agent](../nodes/agent-node.md)
- [Scheda Chat](../tabs/chat-tab.md)
