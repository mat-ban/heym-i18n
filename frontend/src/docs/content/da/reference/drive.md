# Drev

Drev-fanen giver et centralt sted til at se, administrere og dele alle filer, der genereres af skills.

## Adgang til Drev

Naviger til **Drev**-fanen i dashboardet. Alle filer, der genereres af workflow-skills, vises her, sorteret efter oprettelsesdato.

## Filliste

Fillisten viser:

- **Navn** - Originalt filnavn med en type-specifik ikon
- **Type** - Filens MIME-type (f.eks. pdf, csv, docx)
- **Størrelse** - Læsbar filstørrelse
- **Kilde** - Nodenavnet, der genererede filen
- **Dato** - Hvornår filen blev oprettet
- **Handlinger** - Download-, del- og slet-knapper

## Massehandlinger

Hver fil, der ejes, har en afkrydsningsboks i starten af rækken. Filer, der deles via et team, er skrivebeskyttede og kan ikke vælges. Vælg flere filer (Shift-klik vælger en sammenhængende række; header-afkrydsningsboksen vælger hele siden) for at få vist massehandlingslinjen over listen. Klik derefter på **Massehandlinger** for at åbne en dialog, der anvender de samme indstillinger på alle valgte filer:

- **Del alle med mine teams** / **Fjern teamdeling** - aktiverer eller deaktiverer teamdeling for alle valgte filer på én gang
- **Opret delingslink for hver fil** - opretter et delingslink på hver valgt fil med samme udløbsdato, adgangskode og max-downloads-værdier

Dialogen rapporterer, hvor mange filer der blev anvendt på; filer, der ikke ejes, springes over. Rækker-per-side-vælgeren (25 / 50 / 100 / **Alle**) nederst på listen giver mulighed for at indlæse flere filer på én side, så der kan vælges på tværs af hele Drev.

## Deling af filer

Klik på **Del**-ikonet for at åbne delingsdialogen. Det er muligt at oprette flere delingslinks pr. fil med forskellige konfigurationer og eventuelt dele filen med de aktuelle teams.

### Offentligt link (Token-baseret)

Opret et delingslink uden adgangskode. Enhver med linket kan downloade filen.

### Adgangskodebeskyttet link (Basic Auth)

Indstil en adgangskode ved oprettelse af linket. Download-URL'en bruger HTTP Basic Authentication - browsere vil bede om brugernavn (`file`) og adgangskode, når linket åbnes.

### Link-indstillinger

- **Udløber (timer)** - Valgfrit indstil en udløbstid
- **Max downloads** - Valgfrit begræns antallet af downloads
- Begge kan kombineres for maksimal kontrol

### Del med mine teams

Aktiver **Del med mine teams** for at give skrivebeskyttet adgang til alle teams, der tilhører. Teammedlemmer kan se og downloade filen fra Drev og bruge læseorienterede Drev-node-operationer, men kun filens ejer kan slette filen, oprette eller tilbagekalde offentlige links eller ændre adgangskode/TTL/download-grænser.

Indstillingen er fil-specifik. Hvis der tilmeldes eller oprettes et nyt team senere, skal deling aktiveres igen, eller Drive-nodens `shareWithMyTeams`-operation skal køres for at tilføje det team. Brug `unshareWithMyTeams` til at fjerne teamdeling fra filen i et workflow.

### Håndtering af delinger

Delingsdialogen viser alle eksisterende delingslinks med:
- Aktuelt downloadantal
- Udløbsstatus
- Om Basic Auth er aktiveret
- Kopier- og tilbagekald-knapper

## Fil-links i Chat & Portal

Når en skill genererer filer under en workflow-kørsel via Portal-chat eller Quick Drawer, vises download-links automatisk i svaret. Brugere kan klikke for at downloade direkte.

## Lager

Genererede filer lagres på serverens filsystem under `data/files/`. I Docker-installationer er dette monteret som et volumen for persistence.

## Håndtering af filer fra workflows

[Drive-noden](../nodes/drive-node.md) giver mulighed for at administrere Drev-filer programmatisk fra et workflow. Brug den til:

- **Liste** filer og returnere metadata såsom filnavn, MIME-type, størrelse, kilde og download-URL
- **Slette** en fil, efter den er leveret til brugeren
- **Dele eller fjerne deling med teams**, så teammedlemmer kun kan læse og downloade den, mens teamdelingen eksisterer
- **Indstille en adgangskode** på download-linket
- **Indstille en TTL**, så linket udløber efter N timer
- **Indstille en max downloads**-grænse

Konvertering af en fil til et andet format er [Converter-nodens](../nodes/converter-node.md) opgave med `conversion: "fileConvert"`. Den læser en Drev-fil og gemmer det konverterede resultat som en ny fil.

Referer til filen via dens ID fra skill-outputtet: `$agentLabel._generated_files[0].id`

Se [Drive-node-dokumentationen](../nodes/drive-node.md) for konfigurationsdetaljer.

## Læsning af Drev-filer fra Skills

Agent-skills kan aktivere Drev-læsning via skill-kortets **Aktivér Drev-filer**-indstilling. Når aktiveret, inkluderer skill-runtime en genereret `heym_drive.py`-hjælper. Skill-kode kan importere hjælpere såsom `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` og `list_drive_files`.

Drev-læsninger er begrænset til filer, der er tilgængelige for workflow-aktøren: ejede filer og filer delt med aktøren via teams. Brug et fil-id til præcis opslag, eller et præcist filnavn, når brugeren refererer til en fil ved navn. Filnavnsopslag returnerer den nyeste tilgængelige fil med det navn; `list_drive_files(filename="...")` returnerer alle matches.

## Relateret

- [Drive Node](../nodes/drive-node.md) - Workflow-operationer (liste, hent, slet, adgangskode, TTL, max downloads, teamdeling)
- [Drev-fane](../tabs/drive-tab.md) - Gennemse filer i dashboardet
- [Filgenerering](./file-generation.md) - Hvordan `_generated_files` og download-URL'er produceres

## Oprydning
Udløbne delingstokens ryddes automatisk op dagligt. Filerne selv forbliver, indtil de slettes manuelt via Drev-fanen. Brug **Ryd alt** til at slette alle filer og deres delingslinks i én handling.
