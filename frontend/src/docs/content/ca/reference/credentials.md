# Credencials

Les credencials emmagatzemen claus API i secrets utilitzats pels nodes del workflow. Les afegiu a la [Pestanya de credencials](../tabs/credentials-tab.md) i les referencieu pel nom a la configuració del node.

## Què són les credencials

- **Emmagatzemades per usuari** – Cada credencial pertany a un usuari i es pot [compartir](./credentials-sharing.md) amb altres usuaris o [Equips](./teams.md).
- **Xifrades en repòs** – Els valors sensibles estan xifrats; la interfície d'usuari els emmascara després de la creació.
- **Referenciades pel nom** – Els nodes seleccionen una credencial pel nom (o ID). El motor d'execució resol la credencial per al propietari del workflow en temps d'execució.

## Com les utilitzen els nodes

| Tipus de node | Credencial típica | Propòsit |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | Claus API per al model |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | URL base d'un endpoint de model de decisió, més una clau API opcional |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults, [Evals](../tabs/evals-tab.md) suites de prompts | Model Router (Auto Model) | Selecciona quin dels vostres models serveix cada sol·licitud, utilitzant un model de decisió |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Inici de sessió amb subscripció de ChatGPT (OAuth) o un token d'accés de Codex per al runner, més un PAT de GitHub per a operacions de repositori |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Una clau API de la passarel·la OpenCode Go (URL base opcional) per al runner, més un PAT de GitHub per a operacions de repositori |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Token d'accés personal de GitHub (PAT) per a crides a l'API de GitHub, operacions del node GitHub i integracions MCP |
| [Jira](../nodes/jira-node.md) | Jira | Correu electrònic/token API al núvol, nom d'usuari/contrasenya al Data Center o token d'accés personal, URL base del lloc Jira, mode de desplegament i versió opcional de l'API REST |
| [Linear](../nodes/linear-node.md) | Linear | Clau API personal o OAuth2 per a equips, projectes, incidències i comentaris |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autenticació per a sol·licituds |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token del bot i secret de webhook opcional |
| [Discord](../nodes/discord-node.md) | Discord | URL del webhook entrant |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Clau pública de l'aplicació per a la verificació de signatures |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Connexió a l'emmagatzematge vectorial (Qdrant extern, o el propi Postgres de Heym mitjançant pgvector), amb OpenAI o qualsevol endpoint d'embedding compatible amb OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook o token API |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Connexió a la bústia de correu entrant |
| [Send Email](../nodes/send-email-node.md) | SMTP | Servidor de correu |
| [Redis](../nodes/redis-node.md) | Redis | Connexió |
| [Grist](../nodes/grist-node.md) | Grist | Clau API + URL del servidor |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + consentiment OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + consentiment OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + consentiment OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL del projecte + clau API (+ esquema predeterminat opcional) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + nom d'usuari/contrasenya + base de dades (+ segur) |
| [Notion](../nodes/notion-node.md) | Notion | Token d'integració interna, o Client ID + Client Secret + consentiment OAuth d'integració pública |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token d'autenticació més URL base autoallotjada opcional |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Clau d'accés, clau secreta, regió |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Per a la configuració detallada (hosts, ports, camps específics del proveïdor), consulteu [Integracions de tercers](./integrations.md). Això inclou la configuració del bot de Telegram, el correu electrònic entrant via IMAP i el correu electrònic sortint via SMTP.

Les credencials de GitHub també poden incloure un `base_url` opcional quan us dirigiu a GitHub
Enterprise Server en lloc de GitHub.com. Quan editeu una credencial de GitHub per rotar el token,
deixar `base_url` buit preserva l'endpoint Enterprise existent. Introduïu una URL nova només quan
vulgueu canviar aquest endpoint.

Les credencials de Jira, Linear, Supabase, Notion, Sentry i ClickHouse exposen **Test Connection** al diàleg de credencials. Per a Jira, la comprovació crida l'endpoint d'usuari actual de Jira. Per a Linear,
la comprovació crida l'API de Linear amb `getViewer` i confirma que la clau API o el token OAuth són vàlids.
En editar, podeu provar sense tornar a introduir la clau API si el secret emmagatzemat encara és present. Per a Notion,
trieu **Internal token** o **OAuth** al diàleg; OAuth utilitza el Client ID i el Client Secret
de la vostra integració pública de Notion. Consulteu [Integracions de tercers](./integrations.md#notion) per als
detalls de configuració de Notion.
## Ús del paquet de codificació

La pestanya **AI Defaults** a [Settings](./user-settings.md) mostra l'ús restant del paquet de codificació per a les vostres credencials de Codex (pròpies i compartides). Per a cada credencial de Codex, es mostra una barra horitzontal per cada finestra activa de límit de velocitat — normalment una finestra de **5 hores** i/o **setmanal**, segons el vostre pla — amb el percentatge de quota restant i un compte enrere de restabliment. Les dades provenen de les capçaleres de resposta de límit de velocitat del backend de Codex, obtingudes sota demanda.

Les credencials d'OpenCode Go també es mostren aquí, però marcades com a **"usage unavailable"**: la passarel·la OpenCode zen no exposa dades de quota restant, de manera que no es pot mostrar cap barra.

## En expressions

Alguns Nodes permeten expressions per a l'autenticació. Utilitzeu [Expression DSL](./expression-dsl.md) amb `$credentials.CredentialName` per referenciar el secret resolt d'una credencial dins d'una expressió. Per a la línia de capçalera que cada tipus de credencial necessita en una petició HTTP, consulteu [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Les credencials de Codex s'exclouen intencionadament de `$credentials`. Tant si inicieu sessió amb ChatGPT (subscripció, sense cost d'API per token) com si enganxeu un `access_token` de Codex, els tokens només es passen al procés local del runner de Codex. Els tokens d'inici de sessió de ChatGPT es renoven automàticament quan caduquen.

Les credencials de Jira també s'exclouen de `$credentials`. El [Node de Jira](../nodes/jira-node.md) carrega la credencial per `credentialId` en temps d'execució. Per a crides REST personalitzades de Jira no cobertes pel Node de Jira, utilitzeu el [Node HTTP](../nodes/http-node.md) amb Jira Basic Auth (`email:api_token` per a Jira Cloud o `username:password` per a Data Center / Server), per exemple `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. També podeu utilitzar una credencial [Header](../nodes/http-node.md) amb `Authorization: Basic <base64(user:secret)>`. Per als tokens d'accés personal de Jira Data Center / Server, envieu en canvi `Authorization: Bearer <token>`; la pròpia credencial de Jira ho admet mitjançant el seu mode d'autenticació **Personal Access Token**.

| Tipus de credencial | Valor exposat a `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Cadena de token Bearer |
| Header | Línia completa `header key: header value`, a punt per inserir en un argument `-H` de cURL |
| GitHub | Token d'accés personal |
| Notion | `api_token` intern o `access_token` d'OAuth (token Bearer per a crides a l'API de Notion) |
| Sentry | Token d'autenticació de Sentry |
| Discord / Slack | URL de Webhook |

Exemple:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Utilitzeu el **Node** de Notion per a operacions natives de base de dades, pàgina i bloc. Utilitzeu `$credentials` quan una petició [HTTP](../nodes/http-node.md) personalitzada necessiti el mateix token Bearer de Notion.

## Creació de credencials des del xat

L'[Assistent d'IA](./ai-assistant.md#credentials), la [pestanya Chat](../tabs/chat-tab.md) i [Chat with Heym](./chat-with-heym.md) poden crear una credencial quan un Workflow en necessiti una, o sempre que en demaneu una. L'assistent suggereix el tipus i un nom, i el formulari habitual de credencial s'obre a la conversa. Demaneu actualitzar una credencial que posseïu i el mateix formulari s'obre sobre ella, amb els seus secrets emmascarats. L'assistent només veu el nom i el tipus. `heym_chat` a través de [MCP](../tabs/mcp-tab.md) no pot crear, actualitzar ni triar credencials.

## Relacionat

- [Credentials Tab](../tabs/credentials-tab.md) – Afegir, editar, eliminar credencials
- [GitHub Node](../nodes/github-node.md) – Operacions natives de GitHub REST
- [Jira Node](../nodes/jira-node.md) – Automatització de projectes, incidències, comentaris, adjunts, usuaris, notificacions i transicions de Jira
- [Linear Node](../nodes/linear-node.md) – Automatització d'espais de treball i incidències de Linear GraphQL
- [Notion Node](../nodes/notion-node.md) – Cercar i gestionar contingut de Notion
- [Sentry Node](../nodes/sentry-node.md) – Automatització d'organitzacions, projectes, equips, incidències, esdeveniments i versions de Sentry
- [Credentials Sharing](./credentials-sharing.md) – Compartir amb usuaris i equips
- [Third-Party Integrations](./integrations.md) – Guia de configuració per tipus de credencial
- [Expression DSL](./expression-dsl.md) – `$credentials` en expressions

## Model Router (Auto Model)

Un Model Router no conté cap clau. Conté una **credencial de model de decisió**, una llista d'**opcions de model** — cadascuna una credencial existent d'OpenAI, Google o Custom més un model — i, per a cada opció, text lliure indicant quan s'hauria d'utilitzar aquesta opció.

Apareix a tots els selectors que ofereixen un model: els Nodes [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, el constructor d'expressions i Data Tables. El seu únic model és **Auto**. Trieu-lo, i el model de decisió llegeix cada petició i l'encamina. [Evals](../tabs/evals-tab.md) l'omet, perquè una avaluació compara models específics i un router tria el seu propi.

Un agent torna a encaminar a mesura que avança el seu bucle d'eines, de manera que un model econòmic pot encarregar-se dels primers torns i un de més potent del torn que el necessiti. Les entrades idèntiques reutilitzen la decisió anterior, de manera que un bucle només paga per una decisió quan la conversa realment ha avançat.

### Què no pot fer

Auto Model no es pot combinar amb la **Responses API**, el **Batch mode** ni la **sortida d'imatge**. Aquests commutadors es desactiven ells mateixos quan se selecciona un router, i cadascun indica per què. Les comprovacions de Guardrail i el classificador de polítiques de revisió humana són crides fixes d'un sol model i mai no s'encaminen.
### Quan l'encaminament falla

Marqueu una opció **Utilitza aquesta opció quan l'encaminament falla** i una interrupció del model de decisió mai
atura una execució; s'utilitza el fallback i el motiu es registra a l'execució. Sense cap opció marcada, el
Node falla en lloc de fer suposicions.

### Veure on ha anat una sol·licitud

Traces mostra `Auto Model / GPT-5` en lloc del model sol, i el cost es manté atribuït
al model que realment s'ha executat. El Registre d'execució del canvas i la Vista d'Spans mostren la mateixa parella,
i la Vista d'Spans indica quin torn ha anat a on.
