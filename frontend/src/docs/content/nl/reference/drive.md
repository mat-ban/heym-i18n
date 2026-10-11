# Drive

Het tabblad Drive biedt een centrale plek om alle bestanden die door skills zijn gegenereerd te bekijken, te beheren en te delen.

## Drive openen

Navigeer naar het tabblad **Drive** in het dashboard. Alle bestanden die door uw workflow-skills zijn gegenereerd, verschijnen hier, gesorteerd op aanmaakdatum.

## Bestandenlijst

De bestandenlijst toont:

- **Naam** - Oorspronkelijke bestandsnaam met een typespecifiek pictogram
- **Type** - MIME-type van het bestand (bijv. pdf, csv, docx)
- **Grootte** - Leesbare bestandsgrootte
- **Bron** - Het node-label dat het bestand heeft gegenereerd
- **Datum** - Wanneer het bestand is aangemaakt
- **Acties** - Knoppen voor downloaden, delen en verwijderen

## Bulkacties

Elk bestand dat u bezit, heeft een selectievakje aan het begin van de rij. Bestanden die via een team met u zijn gedeeld, zijn alleen-lezen en kunnen niet worden geselecteerd. Selecteer meerdere bestanden (Shift-klik selecteert een aaneengesloten reeks; het selectievakje in de kop selecteert de hele pagina) om de bulkactiebalk boven de lijst te tonen, en klik vervolgens op **Bulkacties** om één dialoogvenster te openen dat dezelfde instelling op elk geselecteerd bestand toepast:

- **Alles delen met mijn teams** / **Teamdeling verwijderen** — schakelt teamdeling voor alle geselecteerde bestanden in één keer in of uit
- **Deellink voor elk bestand aanmaken** — maakt een deellink aan voor elk geselecteerd bestand met dezelfde waarden voor vervaldatum, wachtwoord en maximaal aantal downloads

Het dialoogvenster meldt op hoeveel bestanden de actie is toegepast; bestanden die u niet bezit, worden overgeslagen. Met de selector voor rijen per pagina (25 / 50 / 100 / **Alle**) onderaan de lijst kunt u meer bestanden op één pagina laden, zodat u over uw hele Drive kunt selecteren.

## Bestanden delen

Klik op het pictogram **Delen** om het deelvenster te openen. U kunt meerdere deellinks per bestand aanmaken met verschillende configuraties en het bestand optioneel met uw huidige teams delen.

### Openbare link (token-gebaseerd)

Maak een deellink aan zonder wachtwoord. Iedereen met de link kan het bestand downloaden.

### Wachtwoordbeveiligde link (Basic Auth)

Stel een wachtwoord in bij het aanmaken van de share. De download-URL gebruikt HTTP Basic Authentication - browsers vragen om een gebruikersnaam (`file`) en wachtwoord wanneer de link wordt geopend.

### Linkopties

- **Vervalt (uren)** - Stel optioneel een vervaltijd in
- **Max. downloads** - Beperk optioneel het aantal downloads
- Beide kunnen worden gecombineerd voor maximale controle

### Delen met mijn teams

Schakel **Delen met mijn teams** in om alleen-lezen toegang te verlenen aan alle teams waarvan u momenteel lid bent. Teamleden kunnen het bestand zien en downloaden vanuit Drive en lezen-georiënteerde Drive-node-bewerkingen gebruiken, maar alleen de eigenaar van het bestand kan het bestand verwijderen, openbare links aanmaken of intrekken, of wachtwoord/TTL/downloadlimieten wijzigen.

De instelling is bestandsspecifiek. Als u later lid wordt van een ander team of er een aanmaakt, schakelt u deling opnieuw in of voert u de bewerking `shareWithMyTeams` van de Drive-node uit om dat team toe te voegen. Gebruik `unshareWithMyTeams` om teamshares van het bestand in een workflow te verwijderen.

### Shares beheren

Het deelvenster toont alle bestaande deellinks met:
- Huidig aantal downloads
- Vervalstatus
- Of Basic Auth is ingeschakeld
- Knoppen voor kopiëren en intrekken

## Bestandslinks in Chat & Portal

Wanneer een skill bestanden genereert tijdens een workflow-uitvoering via de Portal-chat of Quick Drawer, verschijnen de downloadlinks automatisch in het antwoord. Gebruikers kunnen erop klikken om direct te downloaden.

## Opslag

Gegenereerde bestanden worden opgeslagen op het bestandssysteem van de server onder `data/files/`. In Docker-implementaties wordt dit als volume gemount voor persistentie.

## Bestanden beheren vanuit Workflows

De [Drive-node](../nodes/drive-node.md) stelt u in staat om Drive-bestanden programmatisch vanuit een workflow te beheren. Gebruik deze om:

- **Bestanden weer te geven** en metadata zoals bestandsnaam, MIME-type, grootte, bron en download-URL te retourneren
- **Een bestand te verwijderen** nadat het aan de gebruiker is geleverd
- **Te delen of delen ongedaan te maken met uw teams**, zodat teamleden het alleen kunnen lezen en downloaden zolang de teamshare bestaat
- **Een wachtwoord in te stellen** op de downloadlink
- **Een TTL in te stellen** zodat de link na N uur vervalt
- **Een limiet voor maximaal aantal downloads in te stellen**

Het converteren van een bestand naar een ander formaat is de taak van de [Converter-node](../nodes/converter-node.md), met `conversion: "fileConvert"`. Deze leest een Drive-bestand en slaat het geconverteerde resultaat op als een nieuw bestand.

Verwijs naar het bestand via zijn ID uit de skill-uitvoer: `$agentLabel._generated_files[0].id`

Zie de [Drive-node-documentatie](../nodes/drive-node.md) voor configuratiedetails.

## Drive-bestanden lezen vanuit Skills

Agent-skills kunnen zich aanmelden voor Drive-leesbewerkingen met de instelling **Drive-bestanden inschakelen** op de skill-kaart. Wanneer ingeschakeld, bevat de skill-runtime een gegenereerde `heym_drive.py`-helper. Skill-code kan helpers importeren zoals `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` en `list_drive_files`.

Drive-leesbewerkingen zijn beperkt tot bestanden die toegankelijk zijn voor de workflow-actor: bestanden in eigendom en bestanden die via teams met de actor zijn gedeeld. Gebruik een bestands-ID voor exacte opzoeking, of een exacte bestandsnaam wanneer de gebruiker naar een bestand verwijst bij naam. Opzoeking op bestandsnaam retourneert het nieuwste toegankelijke bestand met die naam; `list_drive_files(filename="...")` retourneert alle overeenkomsten.

## Gerelateerd

- [Drive-node](../nodes/drive-node.md) - Workflow-bewerkingen (list, get, delete, password, TTL, max downloads, teamdeling)
- [Drive-tabblad](../tabs/drive-tab.md) - Bestanden bekijken in het dashboard
- [Bestandsgeneratie](./file-generation.md) - Hoe `_generated_files` en download-URL's worden geproduceerd

## Opruimen
Vervallen share-tokens worden dagelijks automatisch opgeruimd. Bestanden zelf blijven bestaan totdat ze handmatig via het tabblad Drive worden verwijderd. Gebruik **Alles wissen** om elk bestand en de bijbehorende deellinks in één actie te verwijderen.
