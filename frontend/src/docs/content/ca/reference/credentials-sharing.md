# Compartició de credencials

Les credencials es poden compartir amb altres usuaris perquè els seus workflows puguin utilitzar les vostres claus d'API. Consulteu [Credencials](./credentials.md) per a una visió general i [Pestanya de credencials](../tabs/credentials-tab.md) per afegir i gestionar credencials.

## Compartir credencials amb un LLM

Per permetre que un LLM o un agent d'IA utilitzi una clau d'API, emmagatzemeu la clau com a credencial i deixeu que el node que fa la petició l'adjunti. El model decideix què cridar; el node autentica la crida quan s'executa.

- **Emmagatzemeu el secret com a credencial.** Els valors sensibles s'encripten en repòs i s'emmasqueren a la interfície d'usuari després de la creació.
- **Referencieu-la on es fa la petició.** Els nodes [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md) seleccionen la seva credencial de model per ID, i les peticions HTTP posen `$credentials.CredentialName` a la capçalera d'autenticació. Mantingueu els secrets fora dels camps de prompt, perquè tot el que hi ha en un prompt s'envia al proveïdor del model com a text.
- **Doneu eines a l'agent, no claus.** Quan un Agent crida un node HTTP, un servidor MCP o un sub-workflow com a eina, la credencial s'aplica dins d'aquesta eina i el model rep el resultat de l'eina.
- **Les sortides s'emmasqueren.** Quan un valor de credencial de més de set caràcters apareix a la sortida d'un node, només es conserven els seus set primers caràcters, de manera que una resposta que reprodueixi una clau només mostra aquest prefix als resultats i a les execucions. Vegeu [Emmascarament de sortides](#output-masking).
- **Deixeu que l'assistent creï credencials.** Quan l'[Assistent d'IA](./ai-assistant.md#credentials) o la pestanya Chat crea una credencial, només veu el nom i el tipus, i vosaltres introduïu el secret al formulari habitual de credencials.
- **Compartiu amb les persones de la mateixa manera.** Compartiu la credencial amb un usuari o un equip, tal com es descriu a continuació, i els seus workflows podran utilitzar la vostra clau a través dels seus propis nodes LLM i Agent.

## Model de compartició

- **CredentialShare** – Enllaça `credential_id` amb `user_id` (únic per parella)
- **Compartir per correu electrònic** – `POST /api/credentials/{credential_id}/shares` amb el correu electrònic; es busca l'usuari i s'afegeix
- **Revocar** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

També podeu compartir credencials amb [Equips](./teams.md):

- **CredentialTeamShare** – Enllaça `credential_id` amb `team_id`; tots els membres de l'equip obtenen accés
- **Compartir amb un equip** – `POST /api/credentials/{credential_id}/team-shares` amb `team_id`
- **Revocar la compartició amb un equip** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Les credencials compartides mostren un indicador a la interfície de la [Pestanya de credencials](../tabs/credentials-tab.md).

## Credencials d'abast ampli

Compartir una credencial atorga al destinatari tot el que aquesta credencial pot fer. Per a la majoria d'integracions, això es limita a un espai de treball o als permisos d'una clau d'API, però algunes credencials són molt més àmplies.

> **Les credencials de Google Drive atorguen accés complet al Drive.** La credencial de [Google Drive](../nodes/google-drive-node.md) s'autoritza amb l'àmbit `https://www.googleapis.com/auth/drive` perquè el node pugui operar sobre fitxers que ja poseïu. Compartir-la amb un usuari o un equip dona a cadascun d'ells la capacitat de **llegir, modificar i eliminar permanentment qualsevol cosa del vostre Google Drive** mitjançant un workflow — no només els fitxers que teníeu al cap. Compartiu-la només amb persones a qui donaríeu accés complet al Drive directament.

Si necessiteu limitar l'exposició, creeu un compte de Google dedicat amb accés només a les carpetes que el workflow necessita, i connecteu la credencial amb aquest compte en lloc del vostre compte principal.

Una credencial de **Decision Model** porta l'endpoint i, quan s'estableix, una clau d'API. Compartir-la permet al destinatari gastar contra aquesta clau des de qualsevol workflow que pugui executar, exactament igual que una credencial d'LLM.

Una credencial de **Model Router** comparteix tot allò que enruta. Les persones amb qui la compartiu poden executar peticions contra totes les credencials de la seva llista d'opcions, i aquestes peticions gasten les vostres claus. No poden llegir les claus, i les credencials no apareixen a la seva pròpia llista de credencials.

Això és la mateixa concessió que compartir una credencial d'OpenAI directament, i és el que fa que un router sigui útil per a un equip. Si no ho voleu, compartiu les credencials individuals en lloc d'això i deixeu que cada persona triï un model.

## Compartir amb col·laboradors de workflows

Quan compartiu un workflow, els col·laboradors poden obrir-lo i executar-lo, però no poden utilitzar les vostres credencials tret que els compartiu també aquestes credencials. Això s'aplica a les credencials del workflow principal i de qualsevol sub-workflow que cridi. Compartiu cada credencial amb els mateixos usuaris o equips que hàgiu convidat al workflow. Els sub-workflows també s'han de compartir per separat des de l'editor del workflow fill. Vegeu [Organització de workflows](./workflow-organization.md#sharing-workflows).
## Context d'execució

Quan s'executa un workflow, les credencials es resolen per al **propietari del workflow** (o l'usuari actual en el moment de l'execució). `get_credentials_context()` fusiona:

1. **Credencials pròpies** – `Credential.owner_id == user_id`
2. **Credencials compartides per l'usuari** – `CredentialShare` on `CredentialShare.user_id == user_id`
3. **Credencials compartides per l'equip** – `CredentialTeamShare` on l'usuari és membre de l'equip

Totes es fusionen en un únic diccionari de context indexat pel nom de la credencial.

## Ús en workflows

### Per nom (Expression DSL)

Les credencials s'exposen com a `$credentials.CredentialName` a l'[Expression DSL](./expression-dsl.md). Utilitzeu-ho per a:

- Nodes HTTP (autenticació Bearer/Header)
- Nodes de Telegram
- Nodes de Slack
- Tokens bearer de Notion en sol·licituds HTTP personalitzades (token intern o token d'accés OAuth)
- Qualsevol node que accepti expressions per a l'autenticació

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Per ID (credentialId)

Alguns nodes emmagatzemen `credentialId` (UUID) a `node.data`:

| Tipus de node | Camp | Descripció |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Credencial de l'API del LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Credencial del token d'accés de Codex i credencial de GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Credencial de la passarel·la d'OpenCode Go i credencial de GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Credencial de correu electrònic/token d'API de Jira Cloud o credencial d'usuari/contrasenya de Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Token intern de Notion o credencial d'espai de treball OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Token d'autenticació de Sentry i URL base opcional |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL del projecte Supabase i clau d'API |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Detalls de connexió de ClickHouse (host, port, autenticació, base de dades) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Credencial del bot de Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Clau pública de Discord o credencial de webhook |
| Vector Store | `credential_id` | Base de dades vectorial Qdrant o Postgres (pgvector), mitjançant una credencial RAG de Qdrant, Psql o Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Credencial del model; una credencial de model o Decision Model per al jutge LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) pas d'IA | `credentialId` | Model LLM/Vision (per al pas d'IA i [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

L'executor carrega la credencial directament de la base de dades per ID i desxifra la configuració.

## Emmascarament de la sortida

Després de l'execució, `mask_sensitive_output()` emmascara els valors de les credencials a les sortides, conservant els primers set caràcters de cada secret de més de set caràcters i substituint la resta per `**`, de manera que els secrets no quedin exposats als resultats ni a les execucions.

## Relacionat

- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu i compartiu credencials
- [Integracions de tercers](./integrations.md) – Configuració detallada per a cada tipus de credencial
- [Equips](./teams.md) – Compartiu amb equips
- [Expression DSL](./expression-dsl.md) – Sintaxi de `$credentials`
- [Tipus de node](./node-types.md) – Nodes que utilitzen credencials ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Node Agent](../nodes/agent-node.md) – Utilitza `credentialId` per al LLM
