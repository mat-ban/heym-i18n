# Bevezetés

**Építsen ügynök-alapú rendszereket. Futtassa őket magabiztosan.**

A Heym infrastruktúra AI-ügynökök produkciós futtatásához és irányításához. Hangoljon össze ügynököket, automatizáljon üzleti folyamatokat, vizsgáljon meg minden végrehajtást, és tartsa az embereket irányítás alatt. Telepítse a Heymet saját infrastruktúráján.

A Heymben egy workflow határozza meg, hogyan működnek együtt az ügynökök, a determinisztikus lépések, az eszközök és az adatok. A runtime végrehajtja ezt a gráfot, rögzít minden futást, és szüneteltet emberi felülvizsgálat céljából ott, ahol Ön kéri. A vizuális vászon az a hely, ahol workflow-kat épít és vizsgál meg, és ugyanezek a workflow-k API-kból, ütemezésekből, esemény-triggerekből, MCP-kliensekből és Portal-chatekbol is futtathatók. Látogasson el a [heym.run](https://heym.run) oldalra a termék webhelyéért, és tekintse meg a [Why Heym](./why-heym.md) oldalt arról, hogy mit kezel a Heym az ügynök életciklusának egyes szakaszaiban.

## Mit tehet Ön

- **Építés** – Állítson össze ügynököket és determinisztikus lépéseket a [vásznon](../reference/canvas-features.md) a [Workflows](../tabs/workflows-tab.md) lapon, írja le őket az [AI Assistant](../reference/ai-assistant.md) számára, vagy induljon ki [Templates](../tabs/templates-tab.md) sablonokból
- **Összehangolás** – Koordinálja az [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) és [RAG](../nodes/rag-node.md) csomópontokat, [sub-agents](../reference/agent-architecture.md) alügynököket, MCP-eszközöket és [integrációkat](../reference/integrations.md), például HTTP-t, Slacket és e-mailt, [párhuzamos végrehajtással](../reference/parallel-execution.md) ott, ahol a függőségek engedik
- **Futtatás** – Indítson workflow-kat [webhookokból](../reference/webhooks.md), [Cron](../nodes/cron-node.md) ütemezésekből és esemény-[triggerekből](../reference/triggers.md), csomópontonkénti újrapróbálkozásokkal, [hibakezeléssel](../nodes/error-handler-node.md) és [terheléselosztással](../reference/cluster.md) a példányok között
- **Megfigyelés** – Vizsgálja meg a [végrehajtási előzményeket](../reference/execution-history.md), az [LLM-nyomokat](../tabs/traces-tab.md) tokenköltségekkel, az [analitikát](../tabs/analytics-tab.md) és a [riasztásokat](../tabs/alerts-tab.md), és exportáljon [OpenTelemetry](../reference/opentelemetry.md) nyomokat
- **Értékelés** – Tesztelje a promptokat és modelleket a várt kimenetekkel szemben az [Evals](../tabs/evals-tab.md) lapon
- **Irányítás** – Szüneteltesse az ügynököket [emberi felülvizsgálat](../reference/human-in-the-loop.md) céljából, blokkolja a nem biztonságos tartalmat [guardrails](../reference/guardrails.md) segítségével, és kezelje a hozzáférést [credentials](../tabs/credentials-tab.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) és egy [audit trail](../reference/audit.md) segítségével
- **Közzététel** – Szolgálja ki a workflow-kat REST és [SSE streaming](../reference/sse-streaming.md) formájában, [MCP](../tabs/mcp-tab.md) eszközként és [Portal](../reference/portal.md) chat-felületként a végfelhasználók számára; használja a [Chat](../tabs/chat-tab.md) lapot a modellek közvetlen teszteléséhez
- **Csevegés a Heymmel** – Tegyen fel oldalfüggő termékkérdéseket a dokumentációban található [Chat with Heym](../reference/chat-with-heym.md) párbeszédablakból

## Kulcsfogalmak

- **Workflows** – Csomópontok és élek irányított gráfja. Kezelje őket a [Workflows](../tabs/workflows-tab.md) lapon. Lásd: [Workflow Structure](../reference/workflow-structure.md).
- **Nodes** – Feldolgozó egységek ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) stb.). Lásd: [Node Types](../reference/node-types.md).
- **Edges** – A végrehajtási folyamatot meghatározó kapcsolatok
- **Credentials** – A [Credentials](../tabs/credentials-tab.md) lapon tárolt API-kulcsok és titkos kulcsok, amelyekre a csomópontok hivatkoznak.
- **Variables** – Tartós kulcs-érték adatok a [Variables](../tabs/global-variables-tab.md) lapon, amelyek a `$global.variableName` segítségével érhetők el. Lásd: [Global Variables](../reference/global-variables.md).
- **Expressions** – Hivatkozzon a felsőbb adatokra a `$input` és a `$nodeName.field` segítségével. Lásd: [Expression DSL](../reference/expression-dsl.md).

## Kapcsolódó

- [Why Heym](./why-heym.md) – Mit kezel a Heym az ügynök életciklusának egyes szakaszaiban
- [Quick Start](./quick-start.md) – Építse meg első workflow-ját
- [Running & Deployment](./running-and-deployment.md) – Indítsa el helyben a `run.sh` segítségével, vagy telepítse a `deploy.sh` segítségével
- [AI Assistant](../reference/ai-assistant.md) – Hozzon létre workflow-kat természetes nyelv segítségével
- [Chat with Heym](../reference/chat-with-heym.md) – Tegyen fel további kérdéseket a dokumentáció olvasása közben
- [Core Concepts](./core-concepts.md) – Workflow-k, csomópontok és végrehajtási folyamat
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow-k és mappák kezelése
- [Credentials Tab](../tabs/credentials-tab.md) – API-kulcsok hozzáadása a csomópontokhoz
