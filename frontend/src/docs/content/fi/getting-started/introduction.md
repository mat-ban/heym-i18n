# Johdanto

**Rakenna agenttipohjaisia järjestelmiä. Aja niitä luottavaisin mielin.**

Heym on infrastruktuuri tekoälyagenttien ajamiseen ja hallintaan tuotannossa. Orkestroi agentteja, automatisoi liiketoimintaprosesseja, tarkastele jokaista suoritusta ja pidä ihmiset ohjaksissa. Ota Heym käyttöön omalla infrastruktuurillasi.

Heymissä workflow määrittelee, miten agentit, deterministiset vaiheet, työkalut ja data toimivat yhdessä. Runtime suorittaa kyseisen graafin, tallentaa jokaisen ajon ja pysähtyy ihmisen tarkistettavaksi siellä, missä niin pyydetään. Visuaalinen canvas on paikka, jossa workflowit rakennetaan ja niitä tarkastellaan, ja samat workflowit voidaan ajaa myös API:en, aikataulujen, tapahtuma-triggerien, MCP-asiakkaiden ja Portal-keskustelujen kautta. Käy osoitteessa [heym.run](https://heym.run) tutustuaksesi tuotesivustoon ja katso [Miksi Heym](./why-heym.md) nähdäksesi, mitä Heym hoitaa agentin elinkaaren kussakin vaiheessa.

## Mitä voit tehdä

- **Rakenna** – Kokoa agentteja ja deterministisiä vaiheita [canvasilla](../reference/canvas-features.md) [Workflows](../tabs/workflows-tab.md) -välilehdellä, kuvaile ne [AI Assistantille](../reference/ai-assistant.md) tai aloita [Templates](../tabs/templates-tab.md) -pohjista
- **Orkestroi** – Koordinoi [Agent](../nodes/agent-node.md)-, [LLM](../nodes/llm-node.md)- ja [RAG](../nodes/rag-node.md) -solmuja, [alagentteja](../reference/agent-architecture.md), MCP-työkaluja ja [integraatioita](../reference/integrations.md), kuten HTTP, Slack ja sähköposti, hyödyntäen [rinnakkaista suoritusta](../reference/parallel-execution.md) siellä, missä riippuvuudet sen sallivat
- **Aja** – Käynnistä workflowit [webhookeista](../reference/webhooks.md), [Cron](../nodes/cron-node.md) -aikatauluista ja tapahtuma-[triggereistä](../reference/triggers.md), solmukohtaisilla uudelleenyrityksillä, [virheenkäsittelyllä](../nodes/error-handler-node.md) ja [kuorman jakautumisella](../reference/cluster.md) instanssien kesken
- **Havainnoi** – Tarkastele [suoritushistoriaa](../reference/execution-history.md), [LLM-jäljityksiä](../tabs/traces-tab.md) token-kustannuksineen, [analytiikkaa](../tabs/analytics-tab.md) ja [hälytyksiä](../tabs/alerts-tab.md) sekä vie [OpenTelemetry](../reference/opentelemetry.md) -jäljityksiä
- **Arvioi** – Testaa prompteja ja malleja odotettuja tuloksia vasten [Evals](../tabs/evals-tab.md) -välilehdellä
- **Hallitse** – Keskeytä agentit [ihmisen tarkistusta](../reference/human-in-the-loop.md) varten, estä turvaton sisältö [guardrailseilla](../reference/guardrails.md) ja hallinnoi pääsyä [credentialsien](../tabs/credentials-tab.md), [tiimien](../reference/teams.md), [kertakirjautumisen](../reference/sso.md) ja [audit-lokin](../reference/audit.md) avulla
- **Tarjoa** – Palvele workfloweja REST- ja [SSE-suoratoistona](../reference/sse-streaming.md), [MCP](../tabs/mcp-tab.md) -työkaluina ja [Portal](../reference/portal.md) -keskustelukäyttöliittyminä loppukäyttäjille; käytä [Chat](../tabs/chat-tab.md) -välilehteä mallien testaamiseen suoraan
- **Keskustele Heymin kanssa** – Esitä sivukohtaisia tuotekysymyksiä [Chat with Heym](../reference/chat-with-heym.md) -valintaikkunasta dokumentaatiossa

## Keskeiset käsitteet

- **Workflowit** – Suunnattu graafi solmuista ja kaarista. Hallinnoi niitä [Workflows](../tabs/workflows-tab.md) -välilehdellä. Katso [Workflow Structure](../reference/workflow-structure.md).
- **Solmut** – Käsittelyyksiköt ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) jne.). Katso [Node Types](../reference/node-types.md).
- **Kaaret** – Yhteydet, jotka määrittelevät suoritusvirran
- **Credentialsit** – API-avaimet ja salaisuudet, jotka on tallennettu [Credentials](../tabs/credentials-tab.md) -välilehdelle ja joihin solmut viittaavat.
- **Muuttujat** – Pysyvä avain-arvo-data [Variables](../tabs/global-variables-tab.md) -välilehdellä, käytettävissä `$global.variableName` -viittauksella. Katso [Global Variables](../reference/global-variables.md).
- **Lausekkeet** – Viittaa ylävirran dataan `$input`- ja `$nodeName.field` -viittauksilla. Katso [Expression DSL](../reference/expression-dsl.md).

## Aiheeseen liittyvät

- [Miksi Heym](./why-heym.md) – Mitä Heym hoitaa agentin elinkaaren kussakin vaiheessa
- [Pika-aloitus](./quick-start.md) – Rakenna ensimmäinen workflow
- [Ajaminen ja käyttöönotto](./running-and-deployment.md) – Käynnistä paikallisesti `run.sh`-skriptillä tai ota käyttöön `deploy.sh`-skriptillä
- [AI Assistant](../reference/ai-assistant.md) – Luo workfloweja luonnollisella kielellä
- [Chat with Heym](../reference/chat-with-heym.md) – Esitä jatkokysymyksiä dokumentaatiota lukiessa
- [Ydinkäsitteet](./core-concepts.md) – Workflowit, solmut ja suoritusvirta
- [Workflows-välilehti](../tabs/workflows-tab.md) – Hallinnoi workfloweja ja kansioita
- [Credentials-välilehti](../tabs/credentials-tab.md) – Lisää API-avaimia solmuille
