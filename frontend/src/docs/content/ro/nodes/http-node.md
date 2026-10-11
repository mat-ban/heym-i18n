# HTTP

Nodul **HTTP** realizează cereri HTTP folosind sintaxa cURL. Poate reprezenta un punct de pornire al unui workflow (fără muchie de intrare) sau poate primi date de la nodurile anterioare.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 sau 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `curl` | string | Comandă cURL (de ex. `curl -X GET https://api.example.com`) |

## Formatul răspunsului

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Accesarea răspunsului

- `$httpNode.status` – Codul de stare HTTP
- `$httpNode.body` – Corpul răspunsului (șir de caractere sau JSON analizat)
- `$httpNode.body.fieldName` – Accesarea câmpurilor JSON
- `$httpNode.headers` – Antetele răspunsului

## Exemplu

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Utilizați sintaxa cURL cu `-H` pentru antete, `-d` pentru corpul unei cereri POST etc. Expresiile pot fi folosite oriunde în șirul curl, inclusiv în URL, într-un antet sau într-o linie întreagă de antet. O [acreditare de tip Header](../reference/credentials.md) se rezolvă la `key: value`, astfel încât `-H "$credentials.MyApiKey"` trimite antetul complet:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Ghilimelele și spațiile din interiorul unei expresii aparțin expresiei, nu comenzii cURL, astfel încât metodele care primesc argumente de tip șir de caractere funcționează inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentificarea cu acreditări

`$credentials.Name` se rezolvă la o valoare diferită pentru fiecare tip de [acreditare](../reference/credentials.md), astfel încât linia de antet depinde de tip:

| Tip de acreditare | `$credentials.Name` se rezolvă la | Antet |
|-----------------|-----------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Cheia API brută | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Cheia API brută | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Cheia API brută | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Un token de acces OAuth proaspăt, reînnoit la expirare | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token-ul | `-H "Authorization: Bearer $credentials.Name"` |

O acreditare de tip Bearer conține deja prefixul `Bearer `, astfel încât adăugarea unui alt prefix trimite `Bearer Bearer …`. Acreditările Google Sheets și Google Drive permit apelarea API-urilor Google pe care nodul lor nu le acoperă, cum ar fi adăugarea unei file într-un spreadsheet, în limitele permisiunilor acordate acreditării. Când un nume nu este un identificator simplu (conține `-`, începe cu o cifră sau este un cuvânt rezervat), utilizați forma cu paranteze pătrate: `-H "Authorization: $credentials["my-api-key"]"`.

Când [Asistentul AI](../reference/ai-assistant.md) sau [Chat](../tabs/chat-tab.md) construiește o cerere HTTP care necesită autentificare și niciun nod dedicat nu acoperă serviciul respectiv, acesta întreabă ce acreditare să utilizeze. Alegeți una, modificați numele antetului precompletat dacă API-ul așteaptă altul, iar asistentul scrie linia de antet pentru dvs. Asistentul vede numele și tipurile acreditărilor, niciodată valorile acestora. Dacă nu aveți o acreditare potrivită, întrebarea oferă opțiunea de a crea una. Secretele care ajung în ieșirea nodului, cum ar fi `request.headers` trimise, sunt mascate în rezultatele execuției.

## Siguranța ieșirii

- În mod implicit, URL-ul trebuie să utilizeze `http://` sau `https://` și să se rezolve doar la adrese publice. Destinațiile de tip loopback, private, link-local, multicast și cloud-metadata sunt blocate.
- Heym validează adresele rezolvate și fixează ținta conexiunii pentru a preveni DNS rebinding. Proxy-urile de mediu sunt dezactivate cât timp protecția este activă. Redirecționările nu sunt urmărite în mod implicit; adăugați opțiunea `-L` a cURL pentru a le urmări. Când este activată, fiecare salt de redirecționare este verificat conform aceleiași politici de adrese publice și fixat înainte de conectare.
- Implementările self-hosted de încredere care se conectează intenționat la servicii interne pot seta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Păstrați valoarea implicită pe implementările găzduite sau multi-tenant.

**Notă de actualizare pentru v0.0.105:** această politică la nivel de instanță protejează acum și destinațiile derivate din acreditări utilizate de Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, execuția LLM personalizată și descoperirea modelelor, asistentul AI, guardrails și embeddings RAG. Acreditările existente care indică spre adrese loopback, private sau link-local sunt refuzate dacă `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nu este activat pe o instanță self-hosted de încredere. Cât timp protecția este activă, clienții HTTP protejați ignoră `HTTP_PROXY` și `HTTPS_PROXY`; activarea dezactivării le restabilește. Pachetele CA ale operatorului configurate prin `SSL_CERT_FILE` sau `SSL_CERT_DIR` rămân acceptate. ClickHouse este verificat înainte de deschiderea conexiunii, dar nu este fixat la momentul apelării, deoarece clickhouse-connect aduce propriul transport urllib3.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Trigger](../reference/triggers.md) – HTTP ca punct de intrare în workflow
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați chei API pentru cereri autentificate
