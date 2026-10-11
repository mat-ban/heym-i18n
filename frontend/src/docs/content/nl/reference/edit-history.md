# Geschiedenis

Geschiedenis houdt opgeslagen versies van een workflow bij. Gebruik het om wijzigingen in de loop van de tijd te bekijken, versies te vergelijken of terug te keren naar een eerdere status.

**Opmerking:** Geschiedenis is iets anders dan [Uitvoeringsgeschiedenis](./execution-history.md). Geschiedenis houdt **opslagmomenten** bij (wijzigingen in de workflowstructuur); Uitvoeringsgeschiedenis houdt **uitvoeringen** bij (eerdere runs).

## Waar te vinden

**Editor-werkbalk** → **Geschiedenis** (GitBranch-pictogram)

## Versies

Er wordt een nieuwe versie aangemaakt telkens wanneer u de workflow **opslaat**. De lijst toont:

- **Huidige** – De laatst opgeslagen status (wat u op het canvas ziet)
- **Versie N** – Eerdere opslagmomenten met tijdstempels

Versies zonder wijzigingen ten opzichte van de vorige worden verborgen.

## Diff-weergave

Selecteer een versie om te zien wat er is gewijzigd ten opzichte van de huidige workflow:

| Wijzigingstype | Beschrijving |
|-------------|--------------|
| **Nodes** | Toegevoegde, verwijderde of gewijzigde nodes |
| **Edges** | Toegevoegde, verwijderde of gewijzigde verbindingen |
| **Config** | Instellingen op workflowniveau (auth, rate limits, enz.) |

Vouw elke wijziging uit om diffs op veldniveau te zien (bijv. welke node-eigenschappen zijn gewijzigd).

## Voorbeeld

Om te zien hoe de workflow eruitzag bij een eerdere versie, klikt u op **Voorbeeld** naast Terugdraaien.

Er opent een alleen-lezen canvas met de nodes en edges van die versie. U kunt pannen en zoomen om de lay-out te verkennen; vanuit deze weergave kunnen geen wijzigingen worden aangebracht.

## Terugdraaien

Om een eerdere versie te herstellen:

1. Selecteer de gewenste versie
2. Klik op **Terugdraaien**
3. Bevestig de actie
4. De huidige workflow wordt vervangen door de geselecteerde versie; de pagina wordt opnieuw geladen

Terugdraaien maakt een nieuwe "huidige" status aan—u kunt indien nodig opnieuw terugdraaien.

## Geschiedenis wissen

Klik op het prullenbakpictogram in de kop van het dialoogvenster om alle versiegeschiedenis te verwijderen. Deze actie kan niet ongedaan worden gemaakt. De huidige workflow blijft behouden; alleen eerdere versies worden verwijderd.

## Wanneer versies worden aangemaakt

Versies worden alleen aangemaakt wanneer u **opslaat** (Ctrl/Cmd+S of de knop Opslaan). Niet-opgeslagen wijzigingen worden niet in de Geschiedenis opgeslagen totdat u opslaat.

Bewerkingen van Agent-skills worden in deze snapshots opgenomen. Om een enkele skill te bekijken of te herstellen zonder de hele workflow terug te draaien, gebruikt u de knop **Geschiedenis** op die skill-kaart in het eigenschappenpaneel van de Agent-node. Zie [Agent-node](../nodes/agent-node.md#skill-history).

## Gerelateerd

- [Uitvoeringsgeschiedenis](./execution-history.md) – Eerdere runs en Naar canvas brengen
- [Workflowstructuur](./workflow-structure.md) – Node- en edge-indeling
- [Tabblad Workflows](../tabs/workflows-tab.md) – Workflows aanmaken en beheren
