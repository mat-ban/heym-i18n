# Trigger WebSocket

Nodul **Trigger WebSocket** deschide o conexiune de client de ieșire către un server WebSocket extern și pornește workflow-ul atunci când au loc evenimentele selectate ale socket-ului. Utilizați-l pentru fluxuri de evenimente precum feed-uri de piață, telemetrie sau backplane-uri de chat. Conectarea la sisteme interne în timp real necesită dezactivarea restricției pentru URL-uri private descrisă mai jos.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Comportament important

- Acest nod se conectează **de la Heym către un alt server WebSocket**.
- Acesta **nu** expune un endpoint WebSocket pe Heym.
- Nu este necesară nicio [acreditare](../reference/credentials.md). Configurați URL-ul, anteturile și subprotocoalele direct pe nod.
- Worker-ul lider menține conexiunea deschisă în fundal și se reconectează atunci când este activat.

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `websocketUrl` | string | URL extern `ws://` sau `wss://` |
| `websocketHeaders` | JSON object string | Anteturi opționale pentru handshake |
| `websocketSubprotocols` | string | Listă opțională de subprotocoale separate prin virgulă |
| `websocketTriggerEvents` | array | Oricare dintre `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Reconectare după o deconectare |
| `retryWaitSeconds` | integer | Întârziere înainte de reconectare |

## Evenimente emise

### `onMessage`

Se declanșează atunci când sosește un cadru de la socket-ul remote.

Câmpuri utile:

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.message.data` | Payload JSON analizat sau valoarea brută a mesajului |
| `$nodeLabel.message.text` | Text decodat UTF-8 atunci când este disponibil |
| `$nodeLabel.message.base64` | Payload binar ca base64 |
| `$nodeLabel.message.sizeBytes` | Dimensiunea payload-ului |
| `$nodeLabel.message.isJson` | Dacă mesajul a fost analizat ca JSON |

### `onConnected`

Se declanșează după ce socket-ul se deschide cu succes.

Câmpuri utile:

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` la prima conectare, `true` la reconectările ulterioare |
| `$nodeLabel.connection.subprotocol` | Subprotocolul negociat |

### `onClosed`

Se declanșează atunci când o conexiune stabilită se închide.

Câmpuri utile:

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` sau `unknown` |
| `$nodeLabel.close.code` | Codul de închidere WebSocket |
| `$nodeLabel.close.reason` | Motivul închiderii |
| `$nodeLabel.close.wasClean` | `true` pentru închidere normală `1000` |
| `$nodeLabel.close.reconnecting` | Dacă nodul va încerca să se reconecteze |

## Semantica trigger-ului

- Un nod activ menține o singură conexiune de socket de ieșire de lungă durată.
- Conexiunea rulează doar pe worker-ul lider, similar cu [Trigger IMAP](./imap-trigger-node.md) și modul de recepție [RabbitMQ](./rabbitmq-node.md).
- Dacă reconectarea este activată, Heym așteaptă `retryWaitSeconds` și deschide din nou socket-ul după o întrerupere.
- Fiecare eveniment emis creează o execuție separată a workflow-ului cu `trigger_source = "websocket"`.

## Siguranța ieșirii

- În mod implicit, URL-ul trebuie să utilizeze `ws://` sau `wss://` și să se rezolve doar către adrese publice. Destinațiile loopback, private, link-local, multicast și cloud-metadata sunt blocate.
- Heym revalidează DNS la fiecare reconectare, validează fiecare adresă rezolvată și se conectează direct la una dintre aceste adrese. Proxy-urile de mediu și redirectările WebSocket sunt dezactivate cât timp garda este activă.
- Încălcările permanente ale politicii opresc trigger-ul în loc să reîncerce la nesfârșit. Eșecurile temporare de DNS sau de rețea urmează în continuare setările de reîncercare ale nodului.
- `Authorization`, `Origin`, `User-Agent` și anteturile de date personalizate sunt acceptate. `Origin` este trimis prin opțiunea dedicată a clientului WebSocket. Anteturile `Host`, `Connection`, `Upgrade` și `Sec-WebSocket-*` nu pot fi suprascrise.
- Implementările self-hosted de încredere care se conectează intenționat la servicii interne pot seta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Păstrați valoarea implicită pe implementările găzduite sau multi-tenant.

**Notă de upgrade pentru v0.0.105:** această politică la nivel de instanță protejează acum și destinațiile derivate din acreditări utilizate de Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, execuția LLM personalizată și descoperirea modelelor, asistentul AI, guardrails și RAG embeddings. Acreditările existente care indică spre adrese loopback, private sau link-local sunt refuzate dacă `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nu este activat pe o instanță self-hosted de încredere. Cât timp garda este activă, clienții HTTP protejați ignoră `HTTP_PROXY` și `HTTPS_PROXY`; activarea dezactivării le restabilește. Pachetele CA ale operatorului configurate prin `SSL_CERT_FILE` sau `SSL_CERT_DIR` rămân acceptate. ClickHouse este verificat înainte de deschiderea conexiunii, dar nu este fixat la momentul apelării, deoarece clickhouse-connect aduce propriul transport urllib3.

## Exemplu de workflow

**Flux de evenimente extern → filtrare → notificare**

```
websocketTrigger → condition → slack
```

- **Trigger WebSocket** etichetă: `streamEvent`
- **Condiție**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** mesaj: `"Realtime alert: $streamEvent.message.data.title"`
## Exemplu de JSON pentru nod

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Resurse conexe

- [Triggers](../reference/triggers.md) – Arhitectura trigger-elor în fundal și `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Trimiteți date către un socket extern dintr-un pas de workflow
- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor nodurilor
- [Third-Party Integrations](../reference/integrations.md) – Care noduri utilizează acreditări și care nu
