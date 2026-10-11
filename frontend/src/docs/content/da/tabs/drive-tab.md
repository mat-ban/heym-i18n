# Drev-fanen

Drev-fanen viser alle filer, der er genereret af skills i workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Se Drev-demo</a></p>

## Oversigt

Filer genereret af skills (PDF, DOCX, CSV, billeder osv.) gemmes automatisk og vises i Drev-fanen. Hver fil viser sit navn, type, størrelse, kilde-node, oprettelsesdato og team-delingstatus.

## Funktioner

- **Søgning** - Filtrer filer efter navn, type eller kilde-node
- **Kopier fil-ID** - Kopier filens UUID til udklipsholderen, klar til indsættelse i en [Drive-node](../nodes/drive-node.md) eller [Converter-node](../nodes/converter-node.md)
- **Download** - Autentificeret download af egne filer og filer delt via teams
- **Del** - Opret delingslinks med valgfri adgangskodebeskyttelse og udløbsdato, eller del en fil skrivebeskyttet med nuværende teams
- **Slet** - Fjern filer og deres delingslinks
- **Ryd alt** - Slet alle filer og deres delingslinks efter bekræftelse
- **Massehandlinger** - Vælg flere filer med afkrydsningsfelter (Shift-klik for et interval) og udfør samme handling på alle på én gang
- **Paginering** - Gennemse store filsamlinger med en rækker-per-side-vælger (25 / 50 / 100 / Alle)

## Massehandlinger

Filer man ejer viser et afkrydsningsfelt i starten af deres række (filer delt via et team er skrivebeskyttede og kan ikke vælges). Vælg flere rækker - eller brug overskriftens afkrydsningsfelt til at vælge hele siden, og **Shift-klik** for at vælge et interval - brug derefter massehandlingslinjen, der vises over listen:

- **Download ZIP** pakker alle valgte filer til en enkelt ZIP-fil og downloader den
- **Massehandlinger** åbner en enkelt dialog til at anvende én indstilling på alle valgte filer:
  - **Del alle med mine teams** / **Fjern teamdeling** med ét klik
  - **Opret delingslink for hver fil** med samme adgangskode, udløbsdato og max-downloads-indstillinger
- **Slet** fjerner alle valgte filer og deres delingslinks efter bekræftelse
- **Ryd markering** fjerner alle markeringer

Dialogen rapporterer, hvor mange filer der blev anvendt på (filer man ikke ejer springes over). Brug rækker-per-side-vælgerens **Alle**-indstilling til at indlæse alle filer på én side og markere på tværs af hele Drev. Ved indtastning i søgefeltet skiftes rækker-per-side-vælgeren automatisk til **Alle**, så søgningen dækker alle filer, ikke kun den aktuelle side; ved rydning af søgningen gendannes den tidligere markering.

## Deling

Opret delingslinks med:
- **Ingen autentificering** - Offentligt token-baseret downloadlink
- **Basic Auth** - Adgangskodebeskyttet link (brugernavn: `file`)
- **Udløb** - Valgfri tidsbaseret udløbsdato
- **Downloadbegrænsninger** - Valgfrit maksimalt antal downloads

Aktiver **Del med mine teams** på en fil for at gøre den synlig for alle teams, man tilhører. Delte teammedlemmer får skrivebeskyttet adgang; administrationshandlinger forbeholdes ejeren.

## Agent Skill-adgang

Skills på Agent-noden kan vælge at læse Drev-filer. Når **Aktivér Drev-filer** er tændt for en skill, kan dens Python-kode læse tilgængelige Drev-filer via fil-id eller præcist filnavn gennem den genererede `heym_drive.py`-hjælper. Indstillingen er som standard slået fra.

Se [Drev-reference](../reference/drive.md) for fulde detaljer.

## Relateret

- [Drive-node](../nodes/drive-node.md) - Vis filer, hent metadata, del med teams eller ændre delingsbegrænsninger fra et workflow
- [Filgenerering](../reference/file-generation.md) - Sådan genererer skills filer
- [Drev-reference](../reference/drive.md) - Delingslinks, tokens og oprydning
- [Portal](../reference/portal.md) - Fillinks i portal-chatsvar
