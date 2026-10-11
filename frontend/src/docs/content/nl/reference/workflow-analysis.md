# Workflow-analyse

**Workflow-analyse** is een paneel aan de linkerkant dat één gedeeld, bewerkbaar Markdown-document per workflow bevat. Gebruik het om uit te leggen wat een workflow doet en om verbeterideeën vast te leggen — en laat AI een eerste concept voor u genereren.

Het document is gedeeld: iedereen die toegang heeft tot de workflow kan het lezen en bewerken. Het wordt samen met de workflow opgeslagen en automatisch verwijderd wanneer de workflow wordt verwijderd.

## Het paneel openen

1. Open een workflow in de editor.
2. Klik op **Analyze** (Sparkles-pictogram) in de werkbalk van de editor.
3. Het paneel opent aan de linkerkant. Het node-palet (linkerpaneel) klapt in terwijl het open is; het opnieuw openen van het node-palet sluit het analysepaneel.

Het paneel is alleen beschikbaar voor opgeslagen workflows. Sla een gloednieuwe, niet-opgeslagen workflow eerst op.

## Het document

Het paneel toont één Markdown-document met twee weergaven, die worden gewisseld met de knoppen **Edit** (potlood) en **Preview** (oog):

| Weergave | Doel |
|------|---------|
| **Edit** | Eenvoudige Markdown-editor (textarea). |
| **Preview** | Weergegeven Markdown. |

De koptekst toont **wie het laatst heeft bewerkt** en wanneer.

### Opslaan

Klik op **Save** om uw wijzigingen op te slaan. Opslaan is alleen ingeschakeld wanneer er niet-opgeslagen wijzigingen zijn.

Omdat het document gedeeld is, gebruiken opslagacties optimistische concurrency:

- Als iemand anders een nieuwere versie heeft opgeslagen sinds u het paneel heeft geopend, wordt uw opslagactie geweigerd en verschijnt er een waarschuwing met de naam van de andere bewerker.
- U kunt vervolgens kiezen voor **Reload (discard mine)** om de serverversie over te nemen, of **Overwrite** om uw versie geforceerd over die van hen heen op te slaan.

## AI-analyse

Selecteer bovenaan het paneel een LLM-**Referentie** en **Model** (de modellenlijst wordt geladen op basis van de geselecteerde referentie — zie [Referenties](../tabs/credentials-tab.md)). Voer vervolgens de analyse uit:

- **Analyze my workflow** — wordt getoond wanneer het document leeg is. Het streamt een door AI gegenereerd Markdown-rapport rechtstreeks als niet-opgeslagen concept naar de editor. Controleer en bewerk het, en klik vervolgens op **Save**.
- **Reanalyze** — wordt getoond wanneer het document al inhoud bevat. Het streamt een nieuw rapport naar een aparte **preview**, waarbij uw huidige document ongewijzigd blijft. Kies **Accept** om de inhoud van de editor te vervangen door de nieuwe analyse, of **Discard** om te behouden wat u had.

Beide acties **voeren eerst de workflow uit** (wanneer deze geldig en uitvoerbaar is) en nemen de uitvoeringsresultaten op in de analyse-prompt, zodat het rapport weerspiegelt hoe de workflow zich daadwerkelijk gedraagt. Als de workflow niet kan worden uitgevoerd, gaat de analyse verder op basis van de statische structuur.

Het gegenereerde rapport behandelt drie secties, in deze volgorde: **Verbeterpunten** (concrete suggesties, inclusief een **beveiligings**invalshoek wanneer de workflow te maken heeft met referenties, gebruikersinvoer, externe verzoeken of gegevensblootstelling), het **Doel** van de workflow, en **Wat het doet** (een stapsgewijze doorloop van de nodes).

De sectie **Verbeterpunten** voert altijd vier expliciete controles uit:

1. **Foutdekking** — als het canvas geen [Error Handler](../nodes/error-handler-node.md)-node heeft en er geen foutworkflow is geconfigureerd, wijst het rapport hierop en raadt het aan foutafhandeling toe te voegen.
2. **Bespaarde tijd** — als er geen geschatte bespaarde tijd per uitvoering is ingesteld, raadt het rapport aan er een te configureren zodat de [Analytics](../tabs/analytics-tab.md)-metriek **Time Saved** kan worden gevuld.
3. **Netwerk-nodes** — voor nodes die netwerkoproepen doen (zoals [HTTP](../nodes/http-node.md) en integratienodes), raadt het rapport nodespecifieke foutafhandeling aan (retry en/of continue-on-error) op die nodes.
4. **Waarschuwingen** — wanneer er geen [waarschuwingen](../tabs/alerts-tab.md) zijn geconfigureerd voor de workflow, raadt het rapport aan waarschuwingen in te stellen voordat men naar productie gaat.

### Analyzer uitvoeren vanuit Eigenschappen

Wanneer een workflow nodes op het canvas heeft maar nog geen analysedocument, verschijnt er een knop **Run Analyzer** in het workflow-niveau [Eigenschappen](./canvas-features.md)-paneel (getoond wanneer geen node is geselecteerd). Deze opent dit Workflow-analyse-paneel zodat u een referentie en model kunt kiezen en het rapport kunt genereren.

Elke analyse-uitvoering wordt vastgelegd in [Uitvoeringen](../tabs/traces-tab.md) onder de bron **Workflow Analysis**.

Als er geen LLM-referentie is geconfigureerd, is de Analyze-knop uitgeschakeld — voeg er een toe in het [Referenties-tabblad](../tabs/credentials-tab.md).

## Gerelateerd

- [AI Assistant](./ai-assistant.md) — genereer of wijzig workflow-nodes op basis van natuurlijke taal.
- [Sticky Note](../nodes/sticky-note-node.md) — voor korte notities die direct op het canvas worden vastgezet.
