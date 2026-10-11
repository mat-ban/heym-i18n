# OpenTelemetry Sledenje

Heym lahko oddaja [OpenTelemetry](https://opentelemetry.io/) sledi za vsak zagon workflow, izvajanje vozlišča in klic orodja agenta. Vsak zagon ustvari osnovno span s podrejenimi spani za vsako vozlišče in orodje agenta, tako da lahko vidite, kateri korak je spodletel, koliko časa je trajal, kaj je klical in kaj se je vrnilo. Spani se izvažajo preko OTLP/HTTP v katerikoli združljiv backend, kot so Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic ali Grafana Cloud.

Sledenje je **privzeto onemogočeno**. Ko je izklopljeno, ni merljivega preobremenitve in spani se ne ustvarjajo.

## Omogočanje Sledenja

Nastavite naslednje okoljske spremenljivke na backendu, nato ga ponovno zaženite:

Za celoten seznam okoljskih spremenljivk si oglejte [Okoljske spremenljivke](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Spremenljivka | Privzeto | Opis |
|---------------|----------|------|
| `HEYM_OTEL_ENABLED` | `false` | Glavni stikalo. Nastavite na `true`, da omogočite sledenje. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP osnovni endpoint, na primer `http://collector:4318`. Heym pošlje spane na `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Z vejicami ločeni `key=value` glave za avtentikacijo izvoznika, na primer `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Atribut vira `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Razmerje vzorčenja glave med `0.0` in `1.0`, uporabljeno z vzorčnikom, ki temelji na staršu. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Ko je `true`, priložite skrajšane vhodne in izhodne payloade vozlišča k spanom vozlišča. Privzeto izklopljeno zaradi zasebnosti. |

Minimalen primer:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Aktivno konfiguracijo lahko potrdite v aplikaciji pod **Nastavitve → Opazovanje** (odprite jo iz svojega avatarja v glavi). Ta plošča je samo za branje in nikoli ne prikazuje skrivnosti izvoznika.

## Kaj Se Sledi

### Osnovni span workflow

Ime: `heym.workflow.execute`

| Atribut | Opis |
|---------|------|
| `heym.workflow.id` | UUID workflow. |
| `heym.node.count` | Število vozlišč v workflow. |
| `heym.workflow.test_mode` | `true` za testne zagone. |
| `heym.sub_workflow.depth` | Globina gnezdenja, ko je klican kot pod-workflow. |
| `heym.workflow.status` | Končni status zagona. Neuspešen zagon nastavi status spana na `ERROR`. |

### Span vozlišča

Ime: `heym.node.execute`, ustvarjen kot podrejeni span osnovnega workflow.

| Atribut | Opis |
|---------|------|
| `heym.node.id` | ID vozlišča. |
| `heym.node.type` | Tip vozlišča, na primer `agent`, `llm`, `http`. |
| `heym.node.label` | Oznaka vozlišča, prikazana na platnu. |
| `heym.node.status` | `success` ali `error`. Napake nastavi status spana na `ERROR`. |
| `heym.node.duration_ms` | Čas izvajanja vozlišča v milisekundah. |
| `heym.llm.model` | Ime modela za LLM in vozlišča agenta, ko je na voljo. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Uporaba tokenov za LLM in vozlišča agenta, ko je na voljo. |

Spani vozlišč se pravilno gnezdijo pod osnovnim spanom workflow, tudi ko vozlišča delujejo vzporedno, ker se kontekst workflow prenaša v delovne niti.

### Span orodja agenta

Ime: `heym.agent.tool.execute`, ustvarjen pod aktivnim spanom vozlišča agenta.

| Atribut | Opis |
|---------|------|
| `heym.agent.tool.name` | Ime orodja, izbrano z modelom. |
| `heym.agent.tool.call_id` | ID klica orodja ponudnika, ko je na voljo. |
| `heym.agent.tool.source` | Vir orodja, kot so `node_tool`, `mcp`, `skill` ali `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Oznaka MCP strežnika, ko je to primerno. |
| `heym.agent.tool.iteration` | Iteracija zanke orodja agenta. |
| `heym.agent.tool.args_bytes` | Velikost serializiranih argumentov orodja v UTF-8. |
| `heym.agent.tool.result_bytes` | Velikost serializiranega rezultata orodja v UTF-8. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` ali `cancelled`. Napake orodja nastavi status spana na `ERROR`. |

Nerazredčeni argumenti orodja in rezultati se privzeto ne priložijo spanom.

## Varnost payloadov orodja agenta

Ohranjeni payloadi opazovanja agenta so redigirani in skrajšani v kodi (`4096` znakov na niz, globina `6`, `32768` skupnih znakov na zapis LLM sledi). Skupni proračun sledi je razdeljen med zapise orodij, tako da velik zgodnji rezultat ne more skriti identitete in statusa življenjskega cikla kasnejših klicev. Omejeni metapodatki za prenos `_generated_files` so rezervirani ločeno od obsežnih izhodov veščin:

- Orodja LLM trace `request` / `response`, vključno z `_hitl_pending` kopijami, zapisanimi v skladišče sledi
- Zapisi `tool_calls` rezultatov agenta, prikazani v zgodovini izvajanja
- Dogodki rezultatov orodij v živo Debug plošči, ki ponovno uporabijo isti omejeni sanirani zapis

Živo izvajanje orodij, sporočila orodij, vezana na model, in stanje nadaljevanja HITL v pomnilniku (`_hitl_pending.agent_state.messages` / `tool_arguments`) ohranijo izvirne vrednosti, tako da nadaljevanje in natančno ujemanje argumentov še vedno delujeta. Samo shranjene kopije opazovanja so sanirane.
## Propagacija konteksta sledenja

Heym sledi standardu [W3C Trace Context](https://www.w3.org/TR/trace-context/), tako da ostanejo sledi povezane čez meje storitev.

- **Vhodni webhooks:** ko prihajajoča zahteva vsebuje glavo `traceparent`, se izvajanje workflow-a zabeleži kot otrok te sledi. To povezuje izvajanja Heym z zgornjim sistemom, ki jih je sprožil.
- **Izhodni HTTP:** HTTP vozlišče vstavi `traceparent` v zahteve, ki jih pošilja, tako da lahko spodnje storitve nadaljujejo isto sled.
- **Pod-workflows:** izvajanje pod-workflow-a je povezano z vozliščem, ki ga je poklicalo, kar ohranja hierarhijo klicev v eni sledi.

Trigerji brez vhodnega konteksta (kot so Cron, IMAP, RabbitMQ in WebSocket) začenjajo novo sled za vsako izvajanje.

## Zanesljivost

- Počasen ali nedosegljiv zbiralnik nikoli ne blokira izvajanja workflow-a. Razponi se združujejo in izvažajo v ozadju.
- Če inicializacija sledenja ne uspe (na primer, slaba končna točka), backend zabeleži napako in nadaljuje s sledenjem onemogočenim, namesto da bi se zagnal neuspešno.
- OTLP avtentikacijske glave se berejo iz okolja samo. Nikoli niso shranjene v bazo podatkov in nikoli niso vrnjene s statusnim API-jem.

## Sorodno

- [Nastavitve](./user-settings.md) – Zavihek Opazovanje, ki prikazuje stanje sledenja
- [Spremenljivke okolja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Celotna referenca za konfiguracijo
- [Trigerji](./triggers.md) – Kako se začenjajo workflows, vključno z webhooks
- [Zgodovina izvajanja](./execution-history.md) – Vgrajen pogled zgodovine za vsako izvajanje v Heym
- [HTTP](../nodes/http-node.md) – Vozlišče, ki propagira kontekst sledenja do spodnjih klicev
