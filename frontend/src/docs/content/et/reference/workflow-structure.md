# Workflow struktuur

Workflow'd salvestatakse JSON-ina koos sõlmede ja servadega. Saadaolevate sõlmetüüpide kohta vaadake [Sõlmetüübid](./node-types.md) ja avaldise süntaksi kohta väljades `data` vaadake [Avaldise DSL](./expression-dsl.md).

## Workflow objekt

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Sõlme objekt

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent sõlme `data` (püsiv mälu)

[Agent](../nodes/agent-node.md) sõlmed toetavad valikulist teadmiste graafi iga lõuendi sõlme kohta:

| Väli | Tüüp | Kirjeldus |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kui `true`, laaditakse salvestatud graaf süsteemi prompti ja ühendatakse uued faktid pärast edukaid käivitusi |
| `memoryShares` | array (valikuline) | Annab teistele agentidele juurdepääsu selle sõlme mälugraafile (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Vaadake [Agendi püsiv mälu](./agent-persistent-memory.md). |

Näide:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

API-teede, redaktori käitumise ja ekstraktimise semantika kohta vaadake [Agendi püsiv mälu](./agent-persistent-memory.md).

## Serva objekt

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Sõlmetüübid

Levinumad `type` väärtused: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) ja paljud teised. Täielik nimekiri: [Sõlmetüübid](./node-types.md). Sama käivitustasandi sõlmed töötavad [paralleelselt](./parallel-execution.md).

## Redaktori paigutus

Igal sõlmel on `position.x` ja `position.y` töölaua lõuendi paigutuse jaoks. Ekraanidel, mis on alla
768px murdepunkti, asendab redaktor vaba Vue Flow lõuendi täisekraanilise, taandatud
workflow puuga. Puu järgib ühendatud käivitusteid, märgib paralleelseid harusid ning kasutab
samasuguseid sõlme silte, ikoone ja viimase käivituse olekut nagu töölaua redaktor.

Sõlme valimiseks puudutage seda. Kui sellel on salvestatud käivituse tulemus, avaneb selle täisekraaniline detailvaade
sisendi, väljundi ja vigade vahekaartidega. Mobiili alumine navigatsioon pakub **Sõlmed**, **Atribuudid**,
**Käivita** ja **Rohkem**; päis säilitab salvestamise, ajaloo, otsingu, seadete ja jagamise toimingud.
Töölaud jätkab vaba Vue Flow lõuendi ja külgpaneelide kasutamist.

Kasutage mobiili Sõlmed vahekaardil **Lisa sõlm**, et otsida sõlmeteraamatukogust. Tavaline sõlm avab
ühenduse lehe kohe pärast lisamist: valige ankursõlm ja paigutage see **Järele**,
**Ette** või **Paralleelse** haruna. Redigeerimisrežiimis puudutage olemasolevat tavalist sõlme, et avada sama
leht selle praeguse ühendusega valitud kujul. Trigger sõlmed jäävad sõltumatuks, kuna need ei võta vastu
tavalist sisendit. Redigeerimise juhtelement pakub valitud sõlme jaoks ka eemaldamise toimingut. Käivituse detailid
sisaldavad eelmise ja järgmise nooli, kui külgnevate
sõlmede tulemused on saadaval. AI-assistent avaneb mobiilse puu kohal alumise lehena, muutmata aktiivset
redaktori vahekaarti.

## Seotud

- [Sõlmetüübid](./node-types.md) – Kõik sõlmetüübid ja kirjeldused
- [Lõuendi funktsioonid](./canvas-features.md) – Redaktori funktsioonid (andmete pin, käivituste logid, lubamine/keelamine, ekstraktimine alam-workflow'ks)
- [Allalaadimine ja importimine](./download-import.md) – Workflow'de eksportimine ja importimine JSON-ina
- [Agendi sõlm](../nodes/agent-node.md) – Agendi sõlme `data` struktuur
- [Agendi püsiv mälu](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` ja mälugraafi API
- [Avaldise DSL](./expression-dsl.md) – Süntaks väljadele `userMessage`, `condition`, `$vars`, `$global` jne
- [Paralleelne käivitamine](./parallel-execution.md) – Kuidas sõlmed töötavad paralleelselt
- [Triggerid](./triggers.md) – Algussõlmed ja sisenemispunktid
- [Workflows vahekaart](../tabs/workflows-tab.md) – Workflow'de loomine ja haldamine
