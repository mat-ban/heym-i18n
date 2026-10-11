# WebSocket Send

Nodul **WebSocket Send** deschide o conexiune de client outbound către un server WebSocket extern, trimite un singur mesaj și închide conexiunea. Utilizați-l atunci când un workflow trebuie să transmită evenimente către un sistem în timp real fără a expune un endpoint socket deținut de Heym.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `websocketUrl` | string / expresie | URL extern `ws://` sau `wss://` |
| `websocketHeaders` | string obiect JSON / expresie | Headere opționale pentru handshake |
| `websocketSubprotocols` | string | Listă opțională de subprotocoale separate prin virgulă |
| `websocketMessage` | expresie | Payload-ul de trimis |

## Reguli de serializare a mesajelor

- Dacă `websocketMessage` se rezolvă la un **string**, Heym trimite un cadru text.
- Dacă se rezolvă la un **obiect**, **array**, **număr**, **boolean** sau `null`, Heym îl serializează ca text JSON.
- Dacă se rezolvă la **bytes**, Heym trimite un cadru binar.
- Expresiile complete precum `$input` păstrează tipurile native înainte de serializare.

## Câmpuri de ieșire

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` la succes |
| `$nodeLabel.url` | URL-ul destinație rezolvat |
| `$nodeLabel.message_type` | `text`, `json` sau `binary` |
| `$nodeLabel.size_bytes` | Dimensiunea payload-ului în bytes |
| `$nodeLabel.subprotocol` | Subprotocolul negociat, când este prezent |
| `$nodeLabel.sent_at` | Marcaj temporal ISO |

## Exemplu de workflow

**Cerere HTTP → transformare → publicare prin WebSocket**

```
input → set → websocketSend → output
```

- **Set** creează un obiect payload precum `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** utilizează `$payloadNode` ca `websocketMessage`
- **Output** poate returna `$socketSend.status`

## Exemplu JSON pentru nod

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Note

- Nu este necesară nicio [acreditare](../reference/credentials.md) pentru acest nod.
- Dacă serverul remote așteaptă headere de autentificare sau de tenant, transmiteți-le prin `websocketHeaders`.
- Utilizați [HTTP](./http-node.md) atunci când sistemul remote se bazează pe cerere/răspuns în loc de socket.

## Siguranța ieșirii (Egress Safety)

- În mod implicit, URL-ul trebuie să utilizeze `ws://` sau `wss://` și să se rezolve doar la adrese publice. Destinațiile de tip loopback, private, link-local, multicast și cloud-metadata sunt blocate.
- Heym validează fiecare adresă rezolvată și se conectează direct la una dintre aceste adrese. Proxy-urile de mediu și redirectările WebSocket sunt dezactivate cât timp protecția este activă.
- Headerele `Authorization`, `Origin`, `User-Agent` și headerele de date personalizate sunt acceptate. `Origin` este trimis prin opțiunea dedicată a clientului WebSocket. Headerele `Host`, `Connection`, `Upgrade` și `Sec-WebSocket-*` nu pot fi suprascrise.
- Implementările self-hosted de încredere care se conectează intenționat la servicii interne pot seta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Păstrați valoarea implicită pe implementările găzduite sau multi-tenant.

**Notă de upgrade pentru v0.0.105:** această politică la nivel de instanță protejează acum și destinațiile derivate din acreditări utilizate de Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, execuția LLM personalizată și descoperirea modelelor, asistentul AI, guardrails și embedding-urile RAG. Acreditările existente care indică spre adrese loopback, private sau link-local sunt refuzate dacă `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nu este activat pe o instanță self-hosted de încredere. Cât timp protecția este activă, clienții HTTP protejați ignoră `HTTP_PROXY` și `HTTPS_PROXY`; activarea dezactivării le restabilește. Pachetele CA de operator configurate prin `SSL_CERT_FILE` sau `SSL_CERT_DIR` rămân acceptate. ClickHouse este verificat înainte de deschiderea conexiunii, dar nu este fixat la momentul apelului, deoarece clickhouse-connect aduce propriul transport urllib3.

## Resurse conexe

- [WebSocket Trigger](./websocket-trigger-node.md) – Ascultați un socket extern și declanșați workflow-uri pe evenimente
- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a nodurilor de integrare
- [Expression DSL](../reference/expression-dsl.md) – Construiți payload-uri JSON dinamice
- [Integrări terțe](../reference/integrations.md) – Integrări bazate pe acreditări vs. configurare directă
