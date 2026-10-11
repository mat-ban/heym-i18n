# Rinnakkaissuoritus

Heym suorittaa solmuja rinnakkain, kun niillä ei ole riippuvuuksia toisiinsa, ja sallii useiden workflow-suoritusten tapahtua samanaikaisesti.

## Yhden suorituksen sisällä

### DAG-pohjainen aikataulutus

Suoritin ryhmittelee solmut **suoritustason** mukaan käyttäen suunnattua syklitöntä graafia (DAG):

1. **Taso 0** – Solmut, joilla ei ole saapuvia yhteyksiä (alkusolmut)
2. **Taso N** – Solmut, joiden kaikki ylävirran riippuvuudet ovat tasoilla 0..N-1

Samalla tasolla olevilla solmuilla ei ole riippuvuuksia toisiinsa, ja ne suoritetaan rinnakkain.

### Säikeiden allokointi

- **Jaettu allokointi**: `ThreadPoolExecutor(max_workers=8)` solmujen suorittamiseen
- **Aikataulutus**: `wait(..., return_when=FIRST_COMPLETED)` – heti kun jokin solmu valmistuu, alavirran solmut aikataulutetaan
- **Säieturvallinen**: Solmujen tulokset tallennetaan lukituksen (`store_node_output`) avulla

### Orchestrator-aliaagentit

Kun orchestrator-agentti palauttaa useita `call_sub_agent` -työkutsuja yhdellä kierroksella, ne suoritetaan rinnakkain. Katso [Agenttien arkkitehtuuri](./agent-architecture.md).

### Yhdistelmäsolmu

[Yhdistelmäsolmu](../nodes/merge-node.md) yhdistää tuloksia useista rinnakkaisista haaroista. Käytä sitä, kun on tarpeen yhdistää tulokset eksplisiittisesti; muuten rinnakkaiset haarat voivat päättyä erillisiin tulostussolmuihin.

### Silmukat

Silmukan iteraatiot suoritetaan **peräkkäin**. Silmukan runkosolmut aikataulutetaan uudelleen jokaisella iteraatiolla.

### Aikainen paluu

Tulostussolmut, joissa on `allowDownstream`, voivat palata aikaisin. Loput alavirran työt suoritetaan taustalla.

## Samanaikaiset workflow-suoritukset

- **Ei workflow-kohtaista lukkoa** – Useat pyynnöt voivat suorittaa samaa workflowa samanaikaisesti
- **Async-rajapinta** – FastAPI-päätepisteet käyttävät `asyncio.to_thread(execute_workflow)` pitääkseen tapahtumasilmukan responsiivisena
- **Eristys** – Jokainen suoritus saa oman `WorkflowExecutor`-instanssin ja tilan

Workflowja käynnistävät triggerit ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) kutsuvat `execute_workflow` -funktiota itsenäisesti.

## Suoratoisto

Suoratoisto käyttää samaa rinnakkaismallia, mutta lähettää tapahtumia solmujen valmistuessa. Editori ja portal-keskustelukäyttöliittymä käyttävät suoratoistoa sisäisesti reaaliaikaisen edistymisen näyttämiseen, ja webhook-käyttäjät voivat nyt osallistua samaan tapahtumavirtaan [SSE-suoratoiston](./sse-streaming.md) execute-päätepisteen kautta.

## Liittyvät aiheet

- [Miksi Heym](../getting-started/why-heym.md) – Rinnakkais-DAG-suoritus Heym-runtime-ympäristössä
- [Workflown rakenne](./workflow-structure.md) – Solmut, yhteydet ja suorituskulku
- [Keskeiset käsitteet](../getting-started/core-concepts.md) – Suorituskulun yleiskatsaus
- [Solmutyypit](./node-types.md) – [Yhdistelmäsolmu](../nodes/merge-node.md) ja muut tyypit
- [Triggerit](./triggers.md) – Suorituksen käynnistävät päätepisteet
- [SSE-suoratoisto](./sse-streaming.md) – Tapahtumavirran muoto `/execute/stream` -päätepisteelle
