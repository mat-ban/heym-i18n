# Portal

**Portal** izpostavlja Heym workflows kot javne uporabniške vmesnike v slogu klepeta. Končni uporabniki lahko izvajajo workflows prek URL-ja, ne da bi se prijavili v Heym.

## Kaj to počne

- **Javni URL**: `/chat/{slug}` (npr. `/chat/my-workflow`)
- **Klepetalni vmesnik**: Uporabniki komunicirajo prek klepetalnega vmesnika (sporočila, vnosi, odgovori)
- **Opcijska avtentikacija**: Če so uporabniki portala konfigurirani, je prijava obvezna; sicer je portal javno dostopen
- **Pretakanje**: Napredek vozlišča v realnem času med izvajanjem (ko je omogočeno)
- **Ustavitev aktivnih izvajanj**: Uporabniki lahko ustavijo potekajoče izvajanje portala iz noge klepeta; aktivno izvajanje workflow-a se prekliče tudi na strežniški strani
- **Nalaganje datotek**: Opcijsko nalaganje datotek (besedilo, slike itd.) za vsak vhodno polje
- **Predaja človeški ocenjevalec**: Izvajanja portala lahko prikažejo [povezave za HITL pregled](./human-in-the-loop.md), ko agent ustavi za odobritev
- **Prikaz slik**: Izhodi workflow-a, ki vsebujejo slike (npr. iz generacije slik LLM ali posnetkov zaslona Playwright), se prikažejo kot sličice v klepetu. Kliknite katero koli sliko, da odprete ogled v celozaslonskem načinu; pritisnite **Esc** ali uporabite gumb za nazaj na napravi, da zaprete

## Konfiguracija Workflow-a

| Nastavitev | Opis |
|------------|------|
| `portal_enabled` | Omogoči portal za ta workflow |
| `portal_slug` | URL slug (npr. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Uporabi pretakanje izvajanja |
| `portal_file_upload_enabled` | Dovoli nalaganje datotek |
| `portal_file_config` | Konfiguracija datotek po poljih (tipi, omejitve) |

Konfigurirajte v urejevalniku: **Portal** gumb v glavi workflow-a odpre pogovorno okno za nastavitve portala.

## Potek

1. **Info**: `GET /api/portal/{slug}/info` – Vrne metapodatke workflow-a in vhodna polja (brez avtentikacije)
2. **Prijava** (če je potrebna): `POST /api/portal/{slug}/login` – Vrne se sejni token
3. **Izvedba**: `POST /api/portal/{slug}/execute` – Klepetalni vmesnik portala to kliče (ali njegovo različico za pretakanje, ko je omogočeno); končni uporabniki komunicirajo prek klepetalnega vmesnika, ne pa prek neposrednega klica API-ja.
4. **Ustavitev**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Zahtevano, ko uporabnik pritisne **Ustavi** med aktivnim izvajanjem portala

## Omejitev sočasnosti

Ko ima workflow [omejitev sočasnosti](./webhooks.md#concurrency-limit-and-queued-runs) in so vse reže zasedene, sporočilo portala počaka na vrsto, namesto da bi se izvedlo takoj. Klepet prikazuje **Waiting in queue (2/5)** v vrstici napredka, dokler se zagon ne začne, nato pa odgovor kot običajno. Zagon se še vedno izvede, če uporabnik zapre stran. **Stop** odstrani čakajoči zagon iz čakalne vrste. Ko je čakalna vrsta polna, sporočilo spodleti z "Concurrency queue is full". Zagon, ki je čakal v čakalni vrsti, ne pretaka odgovora token za tokenom; celoten odgovor se prikaže ob zaključku.

## HITL v izvajanju portala

Če workflow portala doseže [Agent Node](../nodes/agent-node.md) z omogočenim [Human-in-the-Loop](./human-in-the-loop.md), se v odzivu portala prikaže povezava za pregled namesto praznega odgovora.

- Status izvajanja workflow-a postane `pending`
- Klepet portala prikazuje URL za pregled
- Vsa vozlišča, povezana z `review` izhodom agenta, lahko takoj obvestijo Slack, e-pošto ali druge kanale
- Ocenjevalec dokonča odločitev na `/review/{token}` brez prijave
- Po pregledu se workflow nadaljuje iz shranjenega posnetka

To omogoča združevanje javnih klepetalnih tokov s koraki zasebnega človeškega odobravanja.

## Vhodna polja

Vhodna polja izhajajo iz [Input](../nodes/input-node.md) vozlišč. API izloči začetna vozlišča tipa `textInput` in njihova `inputFields`. Izvajanje uporablja isti motor kot običajni zagon; vnosi se posredujejo kot `body.inputs` in `conversation_history` za večkratne tokove.

## Avtentikacija in seje

- **WorkflowPortalUser**: Ime uporabnika/geslo za vsak workflow (ko je avtentikacija omogočena)
- **Odstranitev zadnjega uporabnika**: Pri omogočenem portalu brisanje zadnjega uporabnika portala naredi portal znova javen; nastavitveno pogovorno okno najprej zahteva potrditev
- **PortalSession**: Sejni tokeni z 168-urno veljavnostjo
- **Omejevanje hitrosti**: 3 neuspešni poskusi prijave → 24-urna prepoved za vsak workflow+IP
- Potekle seje se očistijo s cron nalogo

## Uporabniški vmesnik za konfiguracijo

**WebPortalSettingsDialog** zavihki:

1. **Splošno**: Omogoči portal, nastavi slug, kopiraj URL portala
2. **Uporabniki**: Dodaj/odstrani uporabnike portala (ime uporabnika/geslo)
3. **Možnosti**: Način pretakanja, nalaganje datotek, ogled vhodnih polj

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – Portal kot klepetalna površina za agente v produkciji
- [Zavihek Workflows](../tabs/workflows-tab.md) – Ustvarite workflows in omogočite portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Javne strani za pregled za čakajoče izhode agentov
- [Triggers](./triggers.md) – Portal kot vstopna točka
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) za vhodne podatke portala
- [Struktura Workflow-a](./workflow-structure.md) – Vozlišča in robovi
