# OpenTelemetry nyomkövetés

A Heym [OpenTelemetry](https://opentelemetry.io/) nyomvonalakat (trace) képes kibocsátani minden workflow-futtatáshoz, csomópont-végrehajtáshoz és Agent eszközhíváshoz. Minden futtatás létrehoz egy gyökér-span-t, amelynek gyermek-span-jei vannak csomópontonként és Agent eszközönként, így látható, melyik lépés hibázott, mennyi ideig tartott, mit hívott meg, és mi érkezett vissza. A span-ek OTLP/HTTP protokollon keresztül kerülnek exportálásra bármely kompatibilis backend felé, például Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic vagy Grafana Cloud.

A nyomkövetés **alapértelmezés szerint le van tiltva**. Kikapcsolt állapotban nincs mérhető többletterhelés, és nem jönnek létre span-ek.

## A nyomkövetés engedélyezése

Állítsa be a következő környezeti változókat a backenden, majd indítsa újra azt:

A környezeti változók teljes listáját lásd: [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Változó | Alapértelmezett | Leírás |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Főkapcsoló. Állítsa `true` értékre a nyomkövetés bekapcsolásához. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP alap endpoint, például `http://collector:4318`. A Heym a span-eket a `<endpoint>/v1/traces` címre küldi. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Vesszővel elválasztott `key=value` fejlécek az exporter hitelesítéséhez, például `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | A `service.name` erőforrás-attribútum. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Fej-mintavételezési arány `0.0` és `1.0` között, parent-based sampler-rel alkalmazva. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Ha `true`, a csomópont-span-ekhez csatolja a csonkolt csomópont bemeneti és kimeneti payloadokat. Adatvédelem miatt alapértelmezés szerint kikapcsolva. |

Minimális példa:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Az aktív konfigurációt az alkalmazásban a **Settings → Observability** menüpontban ellenőrizheti (a fejlécben található avatar ikonról nyithatja meg). Ez a panel csak olvasható, és soha nem jeleníti meg az exporter titkos adatait.

## Mit követ nyomon a rendszer

### Workflow gyökér-span

Név: `heym.workflow.execute`

| Attribútum | Leírás |
|-----------|-------------|
| `heym.workflow.id` | A workflow UUID-ja. |
| `heym.node.count` | A workflow-ban található csomópontok száma. |
| `heym.workflow.test_mode` | `true` tesztfuttatások esetén. |
| `heym.sub_workflow.depth` | A beágyazás mélysége, amikor al-workflow-ként kerül meghívásra. |
| `heym.workflow.status` | A futtatás végső állapota. Egy sikertelen futtatás a span állapotát `ERROR` értékre állítja. |

### Csomópont-span

Név: `heym.node.execute`, a workflow-span gyermekeként létrehozva.

| Attribútum | Leírás |
|-----------|-------------|
| `heym.node.id` | A csomópont azonosítója. |
| `heym.node.type` | A csomópont típusa, például `agent`, `llm`, `http`. |
| `heym.node.label` | A vásznon megjelenő csomópont-címke. |
| `heym.node.status` | `success` vagy `error`. A hibák a span állapotát `ERROR` értékre állítják. |
| `heym.node.duration_ms` | A csomópont végrehajtási ideje milliszekundumban. |
| `heym.llm.model` | Az LLM és agent csomópontok modellneve, amikor elérhető. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Token-felhasználás az LLM és agent csomópontokhoz, amikor elérhető. |

A csomópont-span-ek akkor is helyesen ágyazódnak be a workflow-span alá, ha a csomópontok párhuzamosan futnak, mivel a workflow-kontextus átadódik a worker szálakba.

### Agent eszköz-span

Név: `heym.agent.tool.execute`, az aktív Agent csomópont span-je alatt létrehozva.

| Attribútum | Leírás |
|-----------|-------------|
| `heym.agent.tool.name` | A modell által kiválasztott eszköz neve. |
| `heym.agent.tool.call_id` | A szolgáltató eszközhívás-azonosítója, amikor elérhető. |
| `heym.agent.tool.source` | Az eszköz forrása, például `node_tool`, `mcp`, `skill` vagy `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Az MCP szerver címkéje, amikor alkalmazható. |
| `heym.agent.tool.iteration` | Az Agent eszköz-ciklus iterációja. |
| `heym.agent.tool.args_bytes` | A szerializált eszközargumentumok UTF-8 mérete. |
| `heym.agent.tool.result_bytes` | A szerializált eszközeremény UTF-8 mérete. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` vagy `cancelled`. Az eszközhibák a span állapotát `ERROR` értékre állítják. |

A nyers eszközargumentumok és -eredmények alapértelmezés szerint nem kerülnek csatolásra a span-ekhez.

## Az Agent eszköz payloadok biztonsága

A tárolt Agent observability payloadok a kódban kerülnek kitakarásra és csonkolásra (`4096` karakter sztringenként, `6` mélység, `32768` összes karakter LLM trace írásonként). A teljes trace-keret felosztásra kerül az eszközrekordok között, így egy korai nagy eredmény nem rejtheti el a későbbi hívások identitását és életciklus-állapotát. A korlátozott `_generated_files` letöltési metaadatok külön vannak fenntartva a terjedelmes skill-kimenettől:

- LLM trace `request` / `response` eszközszakaszok, beleértve a trace-tárba írt `_hitl_pending` másolatokat
- Az Agent eredmény `tool_calls` rekordjai, amelyek a futtatási előzményekben jelennek meg
- A Live Debug panel eszközeredmény-eseményei, amelyek ugyanazt a korlátozott, sanitizált rekordot használják újra

Az élő eszközvégrehajtás, a modellhez kötött eszközüzenetek és a memóriabeli HITL folytatási állapot (`_hitl_pending.agent_state.messages` / `tool_arguments`) megőrzik az eredeti értékeket, így a folytatás és a pontos argumentum-egyeztetés továbbra is működik. Csak a tárolt observability másolatok kerülnek sanitizálásra.
## Trace Context Propagation

A Heym követi a [W3C Trace Context](https://www.w3.org/TR/trace-context/) szabványt, így a trace-ek a szolgáltatások határain át is összekapcsolva maradnak.

- **Bejövő webhookok:** amikor egy bejövő kérés `traceparent` fejlécet tartalmaz, a workflow-futtatás az adott trace gyermekeként kerül rögzítésre. Ez összekapcsolja a Heym futtatásait az őket kiváltó upstream rendszerrel.
- **Kimenő HTTP:** a HTTP csomópont `traceparent` fejlécet injektál az általa indított kérésekbe, így a downstream szolgáltatások ugyanazt a trace-t folytathatják.
- **Al-workflow-k:** egy al-workflow futtatása ahhoz a csomóponthoz kapcsolódik szülőként, amely meghívta, megőrizve a hívási hierarchiát egyetlen trace-en belül.

A bejövő kontextus nélküli triggerek (például Cron, IMAP, RabbitMQ és WebSocket) futtatásonként új trace-t indítanak.

## Megbízhatóság

- A lassú vagy elérhetetlen collector soha nem blokkolja a workflow végrehajtását. A spane-ek kötegekben, a háttérben kerülnek exportálásra.
- Ha a tracing inicializálása meghiúsul (például hibás endpoint esetén), a backend naplózza a hibát, és letiltott tracinggel folytatja a működést ahelyett, hogy az indítás meghiúsulna.
- Az OTLP hitelesítési fejlécek kizárólag a környezetből kerülnek beolvasásra. Soha nem tárolódnak az adatbázisban, és a status API soha nem adja vissza őket.

## Kapcsolódó

- [Settings](./user-settings.md) – Az Observability fül, amely a tracing állapotát mutatja
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Teljes konfigurációs referencia
- [Triggers](./triggers.md) – Hogyan indulnak a workflow-k, beleértve a webhookokat
- [Execution History](./execution-history.md) – A Heym beépített futtatásonkénti előzménynézete
- [HTTP](../nodes/http-node.md) – A csomópont, amely a trace kontextust a downstream hívások felé propagálja
