# Dashboard

Het tabblad **Dashboard** is een ruimte in Grafana-stijl waar u rasters van grafiekwidgets bouwt. Elke widget wordt weergegeven op basis van de uitvoer van zijn eigen verborgen Heym-workflow, zodat alle gegevens die u in een workflow kunt produceren — databasequery's, API-aanroepen, RAG-opzoekacties, LLM-uitvoer — in een grafiek kunnen worden omgezet. U kunt meerdere dashboards bijhouden en elk dashboard delen met personen of teams.

## Dashboards

Iedereen begint met één dashboard, dat wordt aangemaakt wanneer het tabblad voor het eerst wordt geopend. Gebruik de dashboardselector boven aan het tabblad om tussen dashboards te wisselen, en **+** ernaast om een nieuw dashboard te maken. De selector toont eerst uw eigen dashboards en daarna de dashboards die met u zijn gedeeld, voorzien van de naam van de persoon die ze heeft gedeeld.

Het tabblad opent opnieuw het dashboard dat u het laatst hebt gebruikt, en de adresbalk bevat het geopende dashboard (`?tab=dashboard&dashboard=<id>`), zodat een link dat exacte dashboard opent voor iedereen die er toegang toe heeft.

De instellingenknop (alleen voor eigenaren) wijzigt de naam van het dashboard, stelt in welke records het accepteert als [detailpagina](#detail-pages), beheert het delen en verwijdert het. Bij het verwijderen van een dashboard worden de widgets en hun workflows verwijderd. U behoudt altijd ten minste één eigen dashboard, zodat het laatste dashboard niet kan worden verwijderd.

## Widgets

Een widget is een enkele grafiek op het raster. Ondersteunde grafiektypen:

- **Bar** (verticaal of horizontaal)
- **Line**
- **Area** (gevulde trend, ondersteunt meerdere reeksen)
- **Pie**
- **Table** (scrollbaar; één kolom kan worden weergegeven als [statuschips](../nodes/chart-output-node.md#status-chips), en rijen kunnen een [detailpagina](#detail-pages) openen)
- **Numeric** (één KPI-waarde met een optionele eenheid)
- **Gauge** (één waarde tegen een min–max-bereik, bijvoorbeeld een percentage)
- **Scatter** (X/Y-punten voor correlatiegrafieken)
- **Proportion** (één balk opgesplitst in aandelen met een percentagelegenda, bijvoorbeeld een taalverdeling)
- **Bar gauge** (één horizontale gauge per rij met een rood→groen verloop en een waarde, bijvoorbeeld vrije schijfruimte)
- **Text** (een markdown-bericht, bijvoorbeeld een statusnotitie zoals "Laatste uitvoering om 19:47"; ondersteunt [interactieve selectievakjes](../nodes/chart-output-node.md#interactive-task-lists) wanneer de markdown statisch is, en [expliciete genummerde lijsten](../nodes/chart-output-node.md#numbered-lists) voor aangepaste of aflopende nummering)
- **HITL** (uw openstaande menselijke beoordelingen. De kop toont `1/n pending`. De workflownaam opent die uitvoering op het canvas. **Approve**, **Request changes** en **Reject** lossen deze op. Het geschiedenis-pictogram naast de widgettitel opent die uitvoering in het geschiedenisdialoogvenster op deze pagina. De widget gebruikt geen bovenliggende rijen en elke persoon ziet zijn eigen wachtrij)

Naast grafieken voert een **Run a workflow**-widget een van uw workflows rechtstreeks vanaf het dashboard uit: op een gesleept bestand, met de invoervelden ervan, of met een knop Run; zie [Run-widgets](#run-widgets).

Elke widget laadt zijn gegevens asynchroon wanneer u het tabblad opent, zodat de pagina responsief blijft terwijl de grafieken worden gevuld.

## Een widget toevoegen

1. Klik op **Add widget**, geef het een titel en kies een grafiektype. Onder de kiezer toont het dialoogvenster een voorbeeld van dat grafiektype met voorbeeldgegevens en worden de verwachte rijen benoemd, zodat u typen kunt vergelijken voordat u iets bouwt.
2. De widget wordt geopend in de workflow-editor met een startgraaf: een [Set](../nodes/set-node.md)-knooppunt dat de rijen produceert, verbonden met een [Chart Output](../nodes/chart-output-node.md)-knooppunt. Vervang het Set-knooppunt door een willekeurige gegevensbron. Een **HITL**-widget is alleen het Chart Output-knooppunt; het leest uw openstaande beoordelingen en heeft geen gegevensbron nodig.
3. Bouw de workflow zodat het knooppunt dat **Chart Output** voedt een array van rijen produceert, en configureer vervolgens de veldtoewijzing van het Chart Output-knooppunt (labelveld, waardeveld, enz.).
4. Sla op, keer terug naar het tabblad Dashboard en de widget wordt weergegeven.

Voor een **Run a workflow**-widget kiest u in plaats daarvan de workflow die moet worden uitgevoerd; de kiezer vermeldt hoe de widget elke workflow zal uitvoeren. De widget wordt rechtstreeks aan het raster toegevoegd; er hoeft geen nieuwe workflow te worden gebouwd.

Dubbelklik op een widget (of gebruik de bewerkknop) om de bijbehorende workflow op elk moment opnieuw te openen. Gebruik **Clone widget** in de widgetkop om zowel de widget als de volledige workflow te dupliceren. De kopie wordt onder het origineel geplaatst en voorzien van het label **(Copy)**, zodat u deze onafhankelijk kunt bewerken.

## Detailpagina's

Een tabelwidget kan zijn rijen koppelen aan een ander dashboard, dat vervolgens werkt als een detailpagina: één dashboard dat elke klant, factuur of ticket bedient.

1. Open de **Settings** van de tabelwidget en kies het dashboard onder **Row link**.
2. Voer de **Record column** in, de kolom waarvan de waarde de rij identificeert (bijvoorbeeld `id`), en optioneel een **Label column** die deze een naam geeft (bijvoorbeeld `name`).
3. Sla op. Als u op een rij klikt (of deze focust en op Enter drukt), wordt het gekoppelde dashboard geopend met `?record=<value>&label=<name>`.

Op het detaildashboard leest elke widget-workflow de waarde als `$page.record` (zie [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), en toont de pagina `Dashboard / <label>` boven het raster met een knop om het record te wissen. Met Terug keert u terug naar de tabel waar u vandaan kwam.

- **Wie het kan openen.** Rijen zijn alleen klikbaar voor kijkers die het gekoppelde dashboard kunnen openen. Anderen zien dezelfde tabel zonder links.
- **Recordformaat.** Het record komt uit de URL, dus het detaildashboard bepaalt wat het accepteert. In de instellingen ervan is **Detail page records** een van de volgende: ID's (letters, cijfers, `-`, `_` en `.`, tot 128 tekens; de standaardwaarde), getallen, UUID's of e-mailadressen. Elke andere waarde wordt geweigerd voordat een widget wordt uitgevoerd, en de widgets tonen "This page does not accept that record".
- **Nog steeds uitgevoerd als de eigenaar.** Ook op een detailpagina worden widgets uitgevoerd als de eigenaar van het dashboard. Bouwers moeten `$page.record` alleen doorgeven waar een node het escapet, nooit rechtstreeks in querytekst.
- **Caching.** Elke widget cachet zijn grafiek per record, gedurende dezelfde time-to-live als de widget, en bewaart de 50 meest recent gebruikte records.

## Run-widgets

Een **Run a workflow**-widget voert een van uw workflows uit en toont het resultaat: status, uitvoeringstijd en uitvoer. Wat er wordt getoond, hangt af van wat de workflow verwacht:

- **Een bestand.** Voor een workflow die begint met een [File Upload Trigger](../nodes/file-upload-trigger-node.md), sleept u er een bestand naartoe (of klikt u om er een te kiezen), waarna de widget het uploadt via de eenmalige uploadlink van de trigger. De widget toont de bestandstypen en -grootte die de trigger accepteert en weigert andere bestanden vóór het uploaden. Wanneer de workflow ook begint met een Text Input-node, toont de widget de bijbehorende velden naast de dropzone: kies een bestand, vul de velden in en **Run** verzendt beide. De waarden reizen mee met de uploadlink die de widget aanmaakt, zodat een gedeelde uploadlink ze niet kan instellen.
- **Invoervelden.** Voor een workflow die begint met een Text Input-node, toont de widget de velden met hun standaardwaarden; **Run** voert de workflow uit met uw waarden. Waarden voor velden die de workflow niet heeft, worden genegeerd.
- **Niets.** Een workflow zonder invoer krijgt een **Run**-knop.

De knop **Wrap** bij het resultaat breekt lange uitvoerregels binnen het vak af; schakel deze uit om de JSON-indeling van de uitvoer te lezen.

- Iedereen die het dashboard kan openen, kan de widget uitvoeren, net zoals iedereen een grafiek kan vernieuwen. Toegang tot de workflow verloopt via de eigenaar van het dashboard: voor het toevoegen van de widget is een workflow nodig die zowel u als de eigenaar kunnen uitvoeren, en de uitvoering zelf gebruikt de referenties van de workflow-eigenaar, net als elke uploadlink.
- Het resultaat blijft op uw scherm staan totdat u de pagina verlaat; andere kijkers zien uw bestanden, waarden of resultaten niet. De uitvoering verschijnt in de uitvoeringsgeschiedenis met de trigger `dashboard`.
- Het delen van een dashboard verleent nooit toegang tot de workflow zelf. **Edit workflow** opent deze voor mensen die al toegang hebben, en **Fine-tune with AI** wordt niet aangeboden.
- Bestandsuitvoeringen worden uitgevoerd op de hoofdinstantie, waar geüploade bestanden worden opgeslagen, net als elke uitvoering van een File Upload Trigger.

## Een widget genereren met AI

Klik op **AI**, beschrijf de gewenste metriek (bijvoorbeeld "workflow success rate over the last 30 days as a bar chart") en kies een LLM-referentie en -model. Heym genereert een volledige widgetworkflow die eindigt in een Chart Output-knooppunt en voegt deze toe aan het raster. Zie [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) voor voorbeeldprompts per grafiektype.

Gebruik de knop **Fine-tune with AI** van een widget om een bestaande widget met een nieuwe instructie te herzien. Elke AI-finetuning maakt een momentopname van de vorige workflow in de **Edit History** van de widget, zodat u wijzigingen kunt bekijken of terugdraaien vanuit de workflow-editor.

## De lay-out bewerken

Schakel **Edit** in om de bewerkingsmodus te openen, waarin u widgets kunt slepen en het formaat ervan kunt wijzigen op een raster van 12 kolommen. Lay-outwijzigingen worden automatisch opgeslagen. Widgettitels kunnen inline vanuit de widgetkop worden bewerkt.

## Caching en vernieuwen

Elke widget cachet zijn laatst berekende gegevens op de server gedurende een configureerbare time-to-live (TTL). Zolang de cache vers is, levert het opnieuw openen van het dashboard het opgeslagen resultaat in plaats van de workflow opnieuw uit te voeren. De cache wordt telkens ter plaatse vervangen wanneer de gegevens opnieuw worden berekend (één cache per widget, plus één per record op een [detailpagina](#detail-pages)), en wordt automatisch ongeldig gemaakt wanneer u de workflow van de widget bewerkt.

Gebruik de knop **Refresh** van een widget (of **Refresh** in de werkbalk) om de cache te omzeilen en onmiddellijk opnieuw te berekenen.

## Delen

Eigenaren delen een dashboard vanuit de instellingen, met individuele gebruikers (via e-mail) of met elk [team](teams-tab.md) waartoe zij behoren. Elke deling is **Lezen** of **Schrijven**; wanneer iemand zowel een persoonlijke als een teamdeling heeft, geldt de sterkste.

| Actie | Eigenaar | Schrijven | Lezen |
|--------|:-----:|:-----:|:----:|
| Widgets bekijken, vernieuwen, automatisch vernieuwen gebruiken | ✓ | ✓ | ✓ |
| Detailpagina's openen, run-widgets uitvoeren | ✓ | ✓ | ✓ |
| Widgets toevoegen, klonen, verwijderen, hernoemen en formaat wijzigen; AI-generatie en fijnafstelling; checklistitems afvinken | ✓ | ✓ | |
| De workflow van een widget openen in de editor | ✓ | ✓ | |
| Het dashboard hernoemen of verwijderen, het recordformaat instellen, deling beheren | ✓ | | |

**Widgets worden altijd uitgevoerd als de eigenaar van het dashboard.** Wie er ook meekijkt, een widget gebruikt de inloggegevens en globale variabelen van de eigenaar, en de uitvoeringen verschijnen in de uitvoeringsgeschiedenis en traces van de eigenaar. Teamleden zien dus dezelfde gegevens zonder toegang tot de onderliggende accounts, en elke kijker deelt het ene gecachte resultaat per widget. Widgets die een samenwerker met schrijfrechten toevoegt of kloont, behoren eveneens toe aan de eigenaar.

Daarom draagt **Schrijven** hetzelfde vertrouwen als het delen van een workflow ter bewerking: een samenwerker met schrijfrechten kan wijzigen wat met uw inloggegevens wordt uitgevoerd. Verleen dit alleen aan personen die u uw workflows zou laten bewerken. Een testuitvoering die een samenwerker vanuit de workflow-editor start, gebruikt diens eigen inloggegevens, zoals bij elke gedeelde workflow; alleen het dashboard zelf wordt uitgevoerd als de eigenaar. **Lezen** verleent geen toegang tot de widget-workflows, en alleen-lezen-kijkers ontvangen de grafiek zelf, maar niet de uitvoeringsdetails per knooppunt erachter.

Het verwijderen van een deling, of het verlagen van schrijven naar lezen, wordt onmiddellijk van kracht.

## Gerelateerd

- [Chart Output-knooppunt](../nodes/chart-output-node.md)
- [Analytics-tab](analytics-tab.md) — ingebouwde uitvoeringsstatistieken (te onderscheiden van door gebruikers gebouwde dashboards)
