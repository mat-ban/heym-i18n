# Drive

Fliken Drive utgör en central plats för att visa, hantera och dela alla filer som genereras av skills.

## Åtkomst till Drive

Navigera till fliken **Drive** i instrumentpanelen. Alla filer som genereras av workflowets skills visas här, sorterade efter skapandedatum.

## Fillista

Fillistan visar:

- **Namn** – Ursprungligt filnamn med en typspecifik ikon
- **Typ** – Filens MIME-typ (t.ex. pdf, csv, docx)
- **Storlek** – Filstorlek i läsbart format
- **Källa** – Etiketten för den nod som genererade filen
- **Datum** – När filen skapades
- **Åtgärder** – Knappar för nedladdning, delning och borttagning

## Massåtgärder

Varje fil som användaren äger har en kryssruta i början av sin rad. Filer som delats med användaren via ett team är skrivskyddade och kan inte väljas. Välj flera filer (Shift-klick markerar ett sammanhängande intervall; kryssrutan i rubriken markerar hela sidan) för att visa åtgärdsfältet för massåtgärder ovanför listan, och klicka sedan på **Massåtgärder** för att öppna en dialog som tillämpar samma inställning på varje vald fil:

- **Dela alla med mina team** / **Ta bort teamdelning** – växlar teamdelning för alla valda filer samtidigt
- **Skapa delningslänk för varje fil** – skapar en delningslänk på varje vald fil med samma värden för utgång, lösenord och maximalt antal nedladdningar

Dialogen rapporterar hur många filer den tillämpades på; filer som användaren inte äger hoppas över. Väljaren för rader per sida (25 / 50 / 100 / **Alla**) längst ned i listan gör det möjligt att läsa in fler filer på en sida så att markering kan göras över hela Drive.

## Dela filer

Klicka på ikonen **Dela** för att öppna delningsdialogen. Flera delningslänkar per fil kan skapas med olika konfigurationer, och filen kan även delas med aktuella team.

### Offentlig länk (Token-baserad)

Skapa en delningslänk utan lösenord. Alla med länken kan ladda ned filen.

### Lösenordsskyddad länk (Basic Auth)

Ange ett lösenord när delningen skapas. Nedladdnings-URL:en använder HTTP Basic Authentication – webbläsare efterfrågar användarnamn (`file`) och lösenord när länken öppnas.

### Länkalternativ

- **Utgår (timmar)** – Ange valfritt en utgångstid
- **Max nedladdningar** – Begränsa valfritt antalet nedladdningar
- Båda kan kombineras för maximal kontroll

### Dela med mina team

Aktivera **Dela med mina team** för att bevilja skrivskyddad åtkomst till alla team som användaren för närvarande tillhör. Teammedlemmar kan se och ladda ned filen från Drive samt använda läsorienterade Drive-nodoperationer, men endast filens ägare kan ta bort filen, skapa eller återkalla offentliga länkar eller ändra lösenord/TTL/nedladdningsgränser.

Inställningen är filspecifik. Om användaren senare går med i eller skapar ett annat team måste delningen växlas igen eller Drive-nodens `shareWithMyTeams`-operation köras för att lägga till det teamet. Använd `unshareWithMyTeams` för att ta bort teamdelningar från filen i ett workflow.

### Hantera delningar

Delningsdialogen visar alla befintliga delningslänkar med:
- Aktuellt antal nedladdningar
- Utgångsstatus
- Huruvida Basic Auth är aktiverat
- Knappar för kopiering och återkallning

## Fillänkar i Chat & Portal

När en skill genererar filer under en workflow-körning via Portal-chatten eller Quick Drawer visas nedladdningslänkarna automatiskt i svaret. Användare kan klicka för att ladda ned direkt.

## Lagring

Genererade filer lagras på serverns filsystem under `data/files/`. I Docker-distributioner monteras detta som en volym för beständighet.

## Hantera filer från Workflows

[Drive-noden](../nodes/drive-node.md) gör det möjligt att hantera Drive-filer programmatiskt inifrån ett workflow. Använd den för att:

- **Lista** filer och returnera metadata såsom filnamn, MIME-typ, storlek, källa och nedladdnings-URL
- **Ta bort** en fil efter att den levererats till användaren
- **Dela eller ta bort delning med team** så att teammedlemmar kan läsa och ladda ned filen endast så länge teamdelningen finns
- **Ange ett lösenord** på nedladdningslänken
- **Ange en TTL** så att länken upphör att gälla efter N timmar
- **Ange en gräns för maximalt antal nedladdningar**

Att konvertera en fil till ett annat format är [Converter-nodens](../nodes/converter-node.md) uppgift, med `conversion: "fileConvert"`. Den läser en Drive-fil och lagrar det konverterade resultatet som en ny fil.

Referera till filen via dess ID från skill-utdata: `$agentLabel._generated_files[0].id`

Se [dokumentationen för Drive-noden](../nodes/drive-node.md) för konfigurationsdetaljer.

## Läsa Drive-filer från Skills

Agent-skills kan aktivera Drive-läsning via skill-kortets inställning **Aktivera Drive-filer**. När den är aktiverad inkluderar skill-runtime en genererad `heym_drive.py`-hjälpare. Skill-kod kan importera hjälpare såsom `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` och `list_drive_files`.

Drive-läsningar är begränsade till filer som är åtkomliga för workflowets aktör: ägda filer och filer som delats med aktören via team. Använd ett fil-ID för exakt uppslagning, eller ett exakt filnamn när användaren refererar till en fil vid namn. Filnamnsuppslagning returnerar den nyaste åtkomliga filen med det namnet; `list_drive_files(filename="...")` returnerar alla träffar.

## Relaterat

- [Drive-nod](../nodes/drive-node.md) – Workflow-operationer (lista, hämta, ta bort, lösenord, TTL, max nedladdningar, teamdelning)
- [Fliken Drive](../tabs/drive-tab.md) – Bläddra bland filer i instrumentpanelen
- [Filgenerering](./file-generation.md) – Hur `_generated_files` och nedladdnings-URL:er skapas

## Rensning
Utgångna delningstokens rensas automatiskt dagligen. Filerna själva finns kvar tills de tas bort manuellt via fliken Drive. Använd **Rensa alla** för att ta bort samtliga filer och deras delningslänkar i en enda åtgärd.
