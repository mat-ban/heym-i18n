# Drive-tabblad

Het Drive-tabblad toont alle bestanden die door skills in uw workflows zijn gegenereerd.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Drive-demo bekijken</a></p>

## Overzicht

Bestanden die door skills worden gegenereerd (PDF, DOCX, CSV, afbeeldingen, enz.) worden automatisch opgeslagen en weergegeven in het Drive-tabblad. Elk bestand toont de naam, het type, de grootte, het bronknooppunt, de aanmaakdatum en de status van teamdeling.

## Functies

- **Zoeken** - Filter bestanden op naam, type of bronknooppunt
- **Bestands-ID kopiëren** - Kopieer de UUID van het bestand naar het klembord, klaar om te plakken in een [Drive](../nodes/drive-node.md)- of [Converter](../nodes/converter-node.md)-knooppunt
- **Downloaden** - Geauthenticeerde download voor uw bestanden en bestanden die via teams met u zijn gedeeld
- **Delen** - Maak deelbare downloadlinks met optionele wachtwoordbeveiliging en vervaldatum, of deel een bestand alleen-lezen met uw huidige teams
- **Verwijderen** - Verwijder bestanden en hun deellinks
- **Alles wissen** - Verwijder elk bestand en de bijbehorende deellinks na bevestiging
- **Bulkacties** - Selecteer meerdere bestanden met selectievakjes (Shift-klik voor een bereik) en pas dezelfde actie op alle geselecteerde bestanden tegelijk toe
- **Paginering** - Blader door grote bestandsverzamelingen, met een selector voor rijen per pagina (25 / 50 / 100 / Alle)

## Bulkacties

Bestanden die u bezit tonen een selectievakje aan het begin van de rij (bestanden die via een team met u zijn gedeeld, zijn alleen-lezen en kunnen niet worden geselecteerd). Selecteer meerdere rijen — of gebruik het selectievakje in de koptekst om de hele pagina te selecteren, en **Shift-klik** om een bereik te selecteren — en gebruik vervolgens de bulkactiebalk die boven de lijst verschijnt:

- **ZIP downloaden** bundelt elk geselecteerd bestand in één ZIP-archief en downloadt dit
- **Bulkacties** opent één dialoogvenster om één instelling op elk geselecteerd bestand toe te passen:
  - **Alles delen met mijn teams** / **Teamdeling verwijderen** met één klik
  - **Deellink voor elk bestand aanmaken** met dezelfde wachtwoord-, verval- en maximale downloadinstellingen
- **Verwijderen** verwijdert elk geselecteerd bestand en de bijbehorende deellinks na een bevestiging
- **Selectie wissen** deselecteert alles

Het dialoogvenster meldt op hoeveel bestanden de actie is toegepast (bestanden die u niet bezit, worden overgeslagen). Gebruik de optie **Alle** in de selector voor rijen per pagina om elk bestand op één pagina te laden en over uw hele Drive te selecteren. Typen in het zoekvak schakelt de selector voor rijen per pagina automatisch naar **Alle**, zodat de zoekopdracht elk bestand dekt, niet alleen de huidige pagina; het wissen van de zoekopdracht herstelt uw vorige selectie.

## Delen

Maak deellinks met:
- **Geen authenticatie** - Openbare download-URL op basis van een token
- **Basic Auth** - Wachtwoordbeveiligde link (gebruikersnaam: `file`)
- **Vervaldatum** - Optionele vervaldatum op basis van tijd
- **Downloadlimieten** - Optioneel maximaal aantal downloads

Schakel **Delen met mijn teams** in voor een bestand om het zichtbaar te maken voor alle teams waartoe u momenteel behoort. Gedeelde teamleden krijgen alleen-lezentoegang; beheeracties blijven alleen voor de eigenaar.

## Toegang voor Agent-skills

Skills op het Agent-knooppunt kunnen zich aanmelden voor het lezen van Drive-bestanden. Wanneer **Drive-bestanden inschakelen** aan staat voor een skill, kan de Python-code toegankelijke Drive-bestanden lezen op bestands-ID of exacte bestandsnaam via de gegenereerde `heym_drive.py`-helper. Deze instelling staat standaard uit.

Zie [Drive-referentie](../reference/drive.md) voor volledige details.

## Gerelateerd

- [Drive-knooppunt](../nodes/drive-node.md) - Bestanden weergeven, metadata ophalen, delen met teams of deelbeperkingen wijzigen vanuit een workflow
- [Bestandsgeneratie](../reference/file-generation.md) - Hoe skills bestanden genereren
- [Drive-referentie](../reference/drive.md) - Deellinks, tokens en opschonen
- [Portaal](../reference/portal.md) - Bestandslinks in chatreacties van het portaal
