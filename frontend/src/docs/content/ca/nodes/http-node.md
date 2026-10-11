# HTTP

El node **HTTP** fa peticions HTTP mitjançant la sintaxi cURL. Pot ser un punt d'inici del workflow (sense aresta d'entrada) o rebre entrada de nodes anteriors.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 o 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `curl` | string | Comanda cURL (p. ex. `curl -X GET https://api.example.com`) |

## Format de resposta

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Accés a la resposta

- `$httpNode.status` – Codi d'estat HTTP
- `$httpNode.body` – Cos de la resposta (string o JSON analitzat)
- `$httpNode.body.fieldName` – Accés als camps JSON
- `$httpNode.headers` – Capçaleres de la resposta

## Exemple

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Utilitzeu la sintaxi cURL amb `-H` per a les capçaleres, `-d` per al cos de la petició POST, etc. Les expressions es poden utilitzar a qualsevol lloc de la cadena curl, incloent-hi la URL, una capçalera o una línia de capçalera sencera. Una [credencial de tipus Header](../reference/credentials.md) es resol com a `key: value`, de manera que `-H "$credentials.MyApiKey"` envia la capçalera completa:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Les cometes i els espais dins d'una expressió pertanyen a l'expressió, no a la comanda cURL, de manera que els mètodes que accepten arguments de tipus string funcionen en línia:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autenticació amb credencials

`$credentials.Name` es resol en un valor diferent per a cada tipus de [credencial](../reference/credentials.md), de manera que la línia de capçalera depèn del tipus:

| Tipus de credencial | `$credentials.Name` es resol com a | Capçalera |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | La clau API en cru | `-H "Authorization: Bearer $credentials.Name"` |
| Google | La clau API en cru | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | La clau API en cru | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Un token d'accés OAuth nou, renovat quan caduca | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | El token | `-H "Authorization: Bearer $credentials.Name"` |

Una credencial Bearer ja porta el prefix `Bearer `, de manera que afegir-ne un altre envia `Bearer Bearer …`. Les credencials de Google Sheets i Google Drive permeten cridar APIs de Google que el seu node no cobreix, com ara afegir una pestanya a un full de càlcul, dins dels àmbits que s'hagin concedit a la credencial. Quan un nom no és un identificador simple (conté `-`, comença amb un dígit o és una paraula reservada), utilitzeu la forma amb claudàtors: `-H "Authorization: $credentials["my-api-key"]"`.

Quan l'[Assistent d'IA](../reference/ai-assistant.md) o el [Chat](../tabs/chat-tab.md) construeixen una petició HTTP que necessita autenticació i cap node dedicat cobreix el servei, pregunten quina credencial utilitzar. Trieu-ne una, canvieu el nom de capçalera preomplert si l'API n'espera un de diferent, i escriuran la línia de capçalera per vosaltres. L'assistent veu els noms i tipus de les credencials, mai els seus valors. Si no teniu cap credencial adequada, la pregunta ofereix crear-ne una. Els secrets que arriben a la sortida del node, com ara les `request.headers` enviades, s'emmasqueren als resultats de l'execució.
## Seguretat de sortida

- Per defecte, l'URL ha d'utilitzar `http://` o `https://` i resoldre's únicament a adreces públiques. Les destinacions de loopback, privades, link-local, multicast i de metadades del núvol estan bloquejades.
- Heym valida les adreces resoluides i fixa l'objectiu de connexió per evitar el DNS rebinding. Els proxys d'entorn es desactiven mentre la protecció està activa. Per defecte no se segueixen les redireccions; afegiu l'opció `-L` de cURL per seguir-les. Quan està activada, cada salt de redirecció es comprova contra la mateixa política d'adreces públiques i es fixa abans de connectar.
- Els desplegaments autoallotjats de confiança que es connecten intencionadament a serveis interns poden establir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Manteniu el valor per defecte en desplegaments allotjats o multi-tenant.

**Nota d'actualització per a la v0.0.105:** aquesta política a nivell d'instància ara també protegeix les destinacions derivades de credencials utilitzades per Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'execució personalitzada de LLM i el descobriment de models, l'assistent d'IA, els guardrails i els embeddings de RAG. Les credencials existents que apunten a adreces de loopback, privades o link-local es rebutgen tret que `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` estigui habilitat en una instància autoallotjada de confiança. Mentre la protecció està activa, els clients HTTP protegits ignoren `HTTP_PROXY` i `HTTPS_PROXY`; habilitar l'exempció els restaura. Els paquets de CA de l'operador configurats mitjançant `SSL_CERT_FILE` o `SSL_CERT_DIR` continuen essent compatibles. ClickHouse es comprova abans que s'obri la connexió, però no es fixa en el moment de la marcació, perquè clickhouse-connect aporta el seu propi transport urllib3.

## Relacionat

- [Tipus de node](../reference/node-types.md) – Visió general de tots els tipus de node
- [Triggers](../reference/triggers.md) – HTTP com a punt d'entrada del workflow
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu claus d'API per a sol·licituds autenticades
