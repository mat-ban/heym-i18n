# OpenTelemetry -jäljitys

Heym voi lähettää [OpenTelemetry](https://opentelemetry.io/)-jäljitysdataa jokaisesta workflow-suorituksesta, solmujen suorituksista ja Agent-työkalujen käytöistä. Jokainen suoritus luo juurijäljen (root span) lapsijäljineen (child spans) solmuille ja Agent-työkaluille, jolloin näet, mikä vaihe epäonnistui, kuinka kauan se kesti, mitä kutsuja tehtiin ja mitä vastauksia saatiin. Jäljet viedään OTLP/HTTP-yhteydellä yhteensopivaan seurantajärjestelmään kuten Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic tai Grafana Cloud.

Jäljitys on **oletusarvoisesti pois käytöstä**. Kun jäljitys on pois päältä, sillä ei ole mitään mitattavaa suorituskykyvaikutusta eikä jälkiä luoda.

## Jäljityksen käyttöönotto

Aseta seuraavat ympäristömuuttujat backend-palvelimelle ja käynnistä se uudelleen:

Täydellinen ympäristömuuttujalista on saatavilla kohdassa [Ympäristömuuttujat](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Muuttuja | Oletus | Kuvaus |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Pääkytkin. Aseta arvoon `true` ottaa jäljitys käyttöön. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP-päätepisteen perusosoite, esim. `http://collector:4318`. Heym lähettää jäljet osoitteeseen `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Pilkuin erotetut `avain=arvo`-otsikot viejän autentikointia varten, esim. `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name`-resurssiattribuutti. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Päänäytteenottosuhde välillä `0.0`–`1.0`, joka sovelletaan vanhempiin perustuvalla näytteenottajalla. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Kun arvo on `true`, liitetään katkaistuja solmujen syöte- ja tulostepaketteja solmujälkiin. Oletusarvoisesti pois käytöstä yksityisyyden suojelemiseksi. |

Minimaalinen esimerkki:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Aktiivisen konfiguraation voi vahvistaa sovelluksessa kohdassa **Asetukset → Observability** (avaa se otsikon avatarista). Tämä paneeli on vain luku -tilassa eikä koskaan näytä viejän salaisuuksia.

## Mitä jäljitetään

### Workflown juurijälki

Nimi: `heym.workflow.execute`

| Attribuutti | Kuvaus |
|-----------|-------------|
| `heym.workflow.id` | Workflown UUID. |
| `heym.node.count` | Workflowssa olevien solmujen määrä. |
| `heym.workflow.test_mode` | `true` testisuorituksissa. |
| `heym.sub_workflow.depth` | Sisäkkäisyystaso, kun kutsuttu alityönä. |
| `heym.workflow.status` | Suorituksen lopullinen tila. Epäonnistunut suoritus asettaa jäljen tilan arvoon `ERROR`. |

### Solmujälki

Nimi: `heym.node.execute`, luodaan workflow-jäljen lapseksi.

| Attribuutti | Kuvaus |
|-----------|-------------|
| `heym.node.id` | Solmun tunniste. |
| `heym.node.type` | Solmun tyyppi, esim. `agent`, `llm`, `http`. |
| `heym.node.label` | Solmulle canvaksessa näkyvä nimi. |
| `heym.node.status` | `success` tai `error`. Virheet asettavat jäljen tilan arvoon `ERROR`. |
| `heym.node.duration_ms` | Solmun suoritusaika millisekunteina. |
| `heym.llm.model` | Mallin nimi LLM- ja agenttisolmuille, kun saatavilla. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Tokenien käyttö LLM- ja agenttisolmuille, kun saatavilla. |

Solmujäljet sisäkkäistyvät oikein workflow-jäljen alle myös rinnakkaissuorituksissa, koska workflow-konteksti välitetään työntekijäsäikeisiin.

### Agent-työkalun jälki

Nimi: `heym.agent.tool.execute`, luodaan aktiivisen Agent-solmun jäljen alle.

| Attribuutti | Kuvaus |
|-----------|-------------|
| `heym.agent.tool.name` | Mallin valitseman työkalun nimi. |
| `heym.agent.tool.call_id` | Palveluntarjoajan työkutsutunniste, kun saatavilla. |
| `heym.agent.tool.source` | Työkalun lähde, kuten `node_tool`, `mcp`, `skill` tai `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP-palvelimen nimi, kun sovellettavissa. |
| `heym.agent.tool.iteration` | Agentin työkalusilmukan iteraatio. |
| `heym.agent.tool.args_bytes` | Työkalun argumenttien sarjoitetun koon UTF-8-tavuina. |
| `heym.agent.tool.result_bytes` | Työkalun tuloksen sarjoitetun koon UTF-8-tavuina. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` tai `cancelled`. Työkaluvirheet asettavat jäljen tilan arvoon `ERROR`. |

Raakoja työkalun argumentteja ja tuloksia ei oletusarvoisesti liitetä jälkiin.

## Agent-työkalun tietoturva

Tallennetut Agent-seurantadatakokonaisuudet redaktoidaan ja katkaistaan koodissa (`4096` merkkiä merkkijonoa kohti, syvyys `6`, yhteensä `32768` merkkiä LLM-jäljen kirjoitusta kohti). Kokonaisjäljibudjetti jaetaan työkalutietueiden kesken, jotta aikaisin suuri tulos ei peitä myöhempien kutsujen identiteettiä ja elinkaaritilaa. Rajatun `_generated_files` -latausmetatiedot varataan erikseen massiivisten taitotulosten ulkopuolelle:

- LLM-jäljen `request` / `response` -työkalukohdat, mukaan lukien jäljivarastoon kirjoitetut `_hitl_pending` -kopiot
- Agent-tuloksen `tool_calls` -tietueet, jotka näkyvät suoritushistoriassa
- Live Debug -paneelin työkalutulostapahtumat, jotka käyttävät samaa rajoitettua puhdistettua tietuetta

Reaaliaikaiset työkalunsuoritukset, malliin sidotut työkalun viestit ja muistissa oleva HITL-jatkotila (`_hitl_pending.agent_state.messages` / `tool_arguments`) säilyttävät alkuperäiset arvot, jotta jatkaminen ja tarkka argumenttien vertailu toimivat edelleen. Vain tallennetut seurantakopiot puhdistetaan.
## Trace Context -propagointi

Heym noudattaa [W3C Trace Context](https://www.w3.org/TR/trace-context/) -standardia, jotta jäljitykset pysyvät yhteydessä palvelurajojen yli.

- **Saapuvat webhookit:** kun saapuvaan pyyntöön liittyy `traceparent`-otsake, workflown suoritus tallennetaan kyseisen jäljityksen alaisuuteen. Tämä yhdistää Heymin suoritukset niitä käynnistäneeseen ylävirran järjestelmään.
- **Lähtevät HTTP-pyynnöt:** HTTP-solmu lisää `traceparent`-otsakkeen tekemiinsä pyyntöihin, jotta alavirran palvelut voivat jatkaa samaa jäljitystä.
- **Ali-workflowt:** ali-workflown suoritus liitetään sitä käynnistäneen solmun jäljitykseen, säilyttäen kutsuhierarkian yhdessä jäljityksessä.

Käynnistimet ilman saapuvaa kontekstia (kuten Cron, IMAP, RabbitMQ ja WebSocket) alkavat uuden jäljityksen kullekin suoritukselle.

## Luotettavuus

- Hidas tai saavuttamaton kerääjä ei koskaan estä workflown suoritusta. Jäljitysvälit kootaan eräihin ja lähetetään taustalla.
- Jos jäljityksen alustaminen epäonnistuu (esimerkiksi virheellisen päätepisteen vuoksi), taustajärjestelmä kirjaa virheen ja jatkaa jäljitys pois käytöstä sen sijaan, että suoritus epäonnistuisi.
- OTLP-tunnistetietojen otsakkeet luetaan vain ympäristömuuttujista. Niitä ei koskaan tallenneta tietokantaan eikä palauteta tilausrajapinnan kautta.

## Aiheeseen liittyvät

- [Asetukset](./user-settings.md) – Observability-välilehti, joka näyttää jäljityksen tilan
- [Ympäristömuuttujat](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Koko konfiguraatio-ohje
- [Käynnistimet](./triggers.md) – Workflowjen käynnistys, mukaan lukien webhookit
- [Suoritushistoria](./execution-history.md) – Heymin sisäänrakennettu suorituskohtainen historianäkymä
- [HTTP](../nodes/http-node.md) – Solmu, joka välittää jäljityskontekstin alavirran kutsuihin
