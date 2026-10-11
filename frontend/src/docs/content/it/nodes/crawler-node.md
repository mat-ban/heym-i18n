# Crawler

Il nodo **Crawler** esegue lo scraping di pagine web tramite FlareSolverr, con estrazione HTML opzionale mediante selettori CSS. Utilizzarlo per lo scraping web e l'estrazione di contenuti.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.body` (HTML o contenuto estratto) |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale FlareSolverr da [Credenziali](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL da sottoporre a scraping (supporta espressioni) |
| `crawlerWaitSeconds` | number | Secondi di attesa prima dello scraping (predefinito: 0) |
| `crawlerMaxTimeout` | number | Timeout massimo in ms (predefinito: 60000) |
| `crawlerMode` | string | `"basic"` o altre modalità |
| `crawlerSelectors` | array | Selettori CSS per l'estrazione. Ciascuno: `{ selector, attribute? }` |

## Esempio

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Sicurezza dell'egress

- L'URL di FlareSolverr memorizzato nella credenziale deve utilizzare `http://` o `https://` e non può risolversi in un indirizzo link-local o di metadati cloud. L'insieme degli indirizzi rifiutati è `169.254.0.0/16`, `fe80::/10`, gli indirizzi di metadati IPv6 di Alibaba Cloud e AWS, e le forme di transizione IPv6 che possono veicolarne uno. Si tratta di un elenco di endpoint noti, non di una garanzia relativa a ogni provider.
- Gli indirizzi di loopback e privati sono consentiti intenzionalmente, affinché la configurazione documentata `http://localhost:8191` e i nomi dei servizi compose quali `http://flaresolverr:8191` continuino a funzionare. La conseguenza è che questo campo può essere indirizzato anche verso qualsiasi altro servizio raggiungibile dal backend su tali indirizzi, e la risposta viene restituita nell'output del nodo. La condivisione delle credenziali non contiene questo rischio: qualsiasi utente autenticato può creare la propria credenziale FlareSolverr, pertanto negarne una esistente non cambia nulla. I controlli effettivamente applicabili sono la fiducia riposta nelle persone autorizzate a creare Workflow e le regole di rete che limitano ciò che il backend può raggiungere.
- Heym fissa l'indirizzo risolto prima della connessione, affinché una risposta DNS non possa spostare la richiesta su un indirizzo di metadati dopo il controllo. I proxy d'ambiente sono disabilitati mentre la protezione è attiva e i redirect non vengono seguiti.
- La pagina che FlareSolverr recupera successivamente per conto dell'utente costituisce un hop separato che FlareSolverr risolve autonomamente. Heym non la ispeziona, pertanto limitare le destinazioni a cui il container FlareSolverr può connettersi rientra nella policy di rete dell'utente.
- Le distribuzioni self-hosted affidabili possono disattivare la regola sui metadati con `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenere l'impostazione predefinita nelle distribuzioni hosted o multi-tenant.

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Nodo Playwright](./playwright-node.md) – Alternativa per l'automazione del browser
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere una credenziale FlareSolverr