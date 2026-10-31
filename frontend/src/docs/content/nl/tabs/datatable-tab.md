# DataTable

Het tabblad **DataTable** biedt de mogelijkheid om gestructureerde gegevenstabellen direct in Heym aan te maken en te beheren. Tabellen kunnen in workflows worden gebruikt via het [DataTable-knooppunt](../nodes/datatable-node.md) voor programmatische CRUD-bewerkingen.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ DataTable-demo bekijken</a></p>

## Een tabel aanmaken

1. Navigeer vanuit het dashboard naar het tabblad DataTable
2. Klik op **Create DataTable**
3. Voer een naam en optionele beschrijving in
4. Voeg kolommen toe met de kolom-editor

## Kolommen

Elke kolom heeft:

| Eigenschap | Beschrijving |
|----------|-------------|
| Naam | Weergavenaam van de kolom |
| Type | `string`, `number`, `boolean`, `date` of `json` |
| Verplicht | Of nieuwe rijen deze kolom moeten bevatten |
| Uniek | Of waarden uniek moeten zijn over alle rijen |
| Standaardwaarde | Automatisch ingevuld wanneer een rij deze kolom weglaat |

Kolommen kunnen worden toegevoegd, bewerkt of verwijderd via de koptekst van de tabeldetailweergave.

## Kolommen genereren met AI

In plaats van kolommen handmatig toe te voegen, kan de tabel in natuurlijke taal worden beschreven (of een voorbeeld-JSON worden geplakt) waarna een LLM het schema voorstelt. Beide ingangen openen dezelfde dialoog:

- **Generate with AI** (koptekst van de DataTable-lijst) — maakt een geheel nieuwe tabel op basis van de beschrijving.
- **AI columns** (tabeldetailweergave, naast de kolombediening) — stelt *nieuwe* kolommen voor om toe te voegen aan de geopende tabel.

### Hoe het werkt

1. Selecteer een **LLM-referentie** en **model** (standaard wordt de eerste LLM-referentie en het meest recente model gebruikt).
2. Typ een beschrijving — bijvoorbeeld *"Een tabel met boeken met titel, auteur, aantal pagina's en of ik het gelezen heb"* — of plak een JSON-voorbeeld/schema.
3. Klik op **Generate**. Het model retourneert een voorgesteld schema.
4. Controleer de gegenereerde kolommen in een bewerkbaar formulier: wijzig de **naam**, het **type**, de **standaardwaarde**, **uniek** en **notEmpty** (verplicht) voor elke kolom, verwijder ongewenste kolommen of voeg handmatig een kolom toe via **Add column**. Voor een nieuwe tabel kunnen ook de door AI voorgestelde **naam** en **beschrijving** worden bewerkt.
5. Klik op **Create Table** (nieuwe tabel) of **Add Columns** (bestaande tabel) om op te slaan. Druk op **Esc** om de dialoog op elk moment te sluiten.

### Alleen toevoegen bij bestaande tabellen

Bij het genereren van kolommen voor een bestaande tabel ziet het model de huidige kolommen als context en stelt het **uitsluitend nieuwe** kolommen voor. Bestaande kolommen en hun gegevens worden nooit gewijzigd of verwijderd — gegenereerde kolommen worden toegevoegd. Dubbele namen (hoofdletterongevoelig) worden automatisch verwijderd.

> Een LLM-referentie (OpenAI, Google of Custom) is vereist. Indien er geen aanwezig is, voeg deze eerst toe via Settings.

## Rijen beheren

- **Rij toevoegen**: Klik op de toevoegknop om een nieuwe rij aan te maken
- **Inline bewerken**: Dubbelklik op een cel om de waarde te bewerken. Druk op Enter of klik buiten de cel om op te slaan, Escape om te annuleren
- **Rij verwijderen**: Gebruik het actiemenu van de rij om een rij te verwijderen
- **Paginering**: Rijen worden weergegeven met 25 per pagina, met paginanavigatie

## CSV importeren/exporteren

### Importeren
1. Klik op **Import CSV** in de tabeldetailweergave
2. Selecteer een CSV-bestand om te uploaden
3. Bekijk een voorbeeld van de eerste 5 rijen en de kolomtoewijzing
4. Groene kolommen zijn gekoppeld aan bestaande tabelkolommen; gele zijn niet gekoppeld
5. Klik op Import om rijen in bulk in te voegen

### Exporteren
Klik op **Export CSV** om alle rijen als CSV-bestand te downloaden.

## Delen

Tabellen delen met andere gebruikers of teams:

1. Open de deel-dialoog vanuit de tabeldetailweergave
2. Voeg gebruikers toe via e-mail met **lees-** of **schrijfrechten**
3. Voeg teams toe met **lees-** of **schrijfrechten**
4. Alleen-lezen gebruikers kunnen gegevens bekijken; schrijfgebruikers kunnen rijen en kolommen wijzigen. Het hernoemen van de tabel, het wijzigen van de beschrijving en het beheren van shares blijven voorbehouden aan de eigenaar.

## Tabellen aanmaken vanuit de AI Assistant

De canvas [AI-assistent](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) en de `heym_chat`-tool op het [MCP-tabblad](./mcp-tab.md) kunnen een van uw tabellen kiezen voor een workflow die ze bouwen, of een nieuwe aanmaken. Ze stellen een naam en kolommen voor en maken de tabel aan wanneer u de vragenkaart indient. De canvas-assistent configureert workflow-knooppunten op basis van tabelmetagegevens. Chat en `heym_chat` kunnen ook rijen inspecteren, kolommen toevoegen of verwijderen en rechtstreeks rijen invoegen, bijwerken of verwijderen. Geef ze een tabelnaam of de link van dit tabblad. Schrijfbewerkingen vereisen eigendom of directe/team **schrijftoegang**. Kolommen toevoegen behoudt bestaande gegevens; kolommen verwijderen wist hun waarden uit elke rij. Het verwijderen van kolommen en het wissen van alle rijen vraagt om bevestiging, net als op dit tabblad.

## Gebruik in workflows

Het [DataTable-knooppunt](../nodes/datatable-node.md) verbindt tabellen met workflows. Bewerkingen omvatten find, getAll, getById, insert, update, remove en upsert. Er zijn geen referenties vereist.

## LLM Cost Table (systeemtabel)

Een vastgezette sectie **System tables** verschijnt boven de door gebruikers aangemaakte tabellen met één vermelding: **LLM Cost Table**. Dit is een per gebruiker bewerkbare weergave met vast schema van prijsstelling per model, gebruikt door de kosten-grafieken van [Traces](./traces-tab.md).

### Herkomst van de gegevens

Heym onderhoudt een globale tabel met prijsstelling per model, gevuld vanuit het openbare prijseindpunt van Helicone (`https://www.helicone.ai/api/llm-costs`). De synchronisatie wordt op de achtergrond uitgevoerd bij het eerste bezoek aan de tabel of Traces en is beperkt tot één ophaalactie per 24 uur. Klik op **Refresh** om een onmiddellijke hersynchronisatie af te dwingen. Modellen die Helicone uit de upstream-lijst verwijdert, worden lokaal niet verwijderd, zodat historische kostenopzoekingen stabiel blijven.

### Schema (alleen-lezen kolommen)

| Kolom | Betekenis |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informatief, gebruikt door Helicone) |
| Model | Modelidentificatie die wordt vergeleken met `trace.model` |
| Op | Vergelijkingsoperator: `equals`, `startsWith` of `includes` |
| Input $/1M | USD per 1 miljoen prompt-tokens |
| Output $/1M | USD per 1 miljoen completion-tokens |
| Source | `helicone`, `seed` of `user` |

### Prijsaanpassing

- **Een rij bewerken** om de prijzen ervan te overschrijven. Uw overschrijving is per gebruiker en wordt gemarkeerd met een `Customized`-badge; toekomstige Helicone-synchronisaties laten deze ongemoeid.
- **Terugzetten naar standaard** verwijdert de overschrijving en herstelt de globale waarde voor die rij.
- **Aangepast model toevoegen** opent een dialoogvenster om een gebruikersspecifieke rij aan te maken (bijvoorbeeld een privé-fine-tuned model dat Helicone niet vermeldt). Aangepaste rijen worden gemarkeerd met `User added` en bij verwijdering worden ze volledig verwijderd.

### Matchen tegen traces

Wanneer het Traces-dashboard de kosten berekent, wordt elke `trace.model` gematcht tegen:

1. Uw overschrijvingen (exacte overeenkomst op modelnaam) eerst
2. Anders de globale tabel — `equals` exacte overeenkomst heeft prioriteit boven `startsWith`/`includes`; gelijke gevallen binnen dezelfde operator worden opgelost door de langst overeenkomende modelprefix/substring

Als geen rij overeenkomt, wordt het model vermeld onder de **Unpriced models**-melding op de Traces-pagina; de kostbijdrage is nul totdat u een aangepaste rij toevoegt of er een overschrijft.

## Gerelateerd

- [DataTable Node](../nodes/datatable-node.md) - Workflow node reference
- [Traces Tab](./traces-tab.md) - Uses the LLM Cost Table for the cost donut and KPI cards
- [Grist Node](../nodes/grist-node.md) - External spreadsheet alternative
- [Variables Tab](./global-variables-tab.md) - Key-value storage alternative