# Heym Work

**Heym Work** er en ekstra brugerflade til forretningsteams, bygget oven på Heym. Brugere beskriver en opgave med egne ord, besvarer et par spørgsmål og modtager et workflow, som Heym har bygget og testet. Arbejdet foregår fra sider tilpasset formålet, anmeldelser håndteres direkte, og enhver kørsel vises med navnet på den person, der startede den. Heym afvikler alle opgaver i baggrunden.

Heym Work kører som en selvstændig container ved siden af Heym med en separat licens fra Heym-teamet. Læs mere og anmod om en prøveperiode på [heym.run/enterprise](https://heym.run/enterprise). Se [Heym Work-filmen](https://youtu.be/5Z2gGo6bcpU) for en to minutters introduktion.

## Hvad forretningsteams får

| Område | Funktion |
|--------|----------|
| **Chat** | Beskrivelse af en opgave sker via tekst eller stemme. Heym efterspørger de nødvendige oplysninger, opbygger et workflow, tester det og markerer det som Verificeret. |
| **Sider** | Fastgjorte sider med widgets: tal, grafer, tabeller med statuschips, filoverførselsfelter og godkendelser. En tabelrække kan åbne sin egen detaljeside. |
| **Godkendelser** | Gennemgange fra [Human-in-the-Loop](./human-in-the-loop.md)-trin afventer i Aktivitet og på sider med valgmulighederne Godkend, Anmod om ændringer og Afvis. |
| **Aktivitet** | Hver kørsel med angivelse af den person, der startede den, og instansen, der udførte den. |
| **Roller** | Ejer, Redaktør og Læser. Log ind foregår via det [Single Sign-On](./sso.md), som Heym allerede benytter. |
| **Brancheudgaver** | Udgaver til jura, uddannelse, finans, logistik, energi og e-handel åbnes med færdige sider, eksempeldata og tilpassede workflows til branchen. |

## Tilslutning af Heym Work

Se [installationsvideoen](https://youtu.be/zXGfg1HPSLk) for hele installationsprocessen, fra den første kommando til startsiden.

Forbindelsen konfigureres under **Indstillinger → Heym Work**. Fanen vises udelukkende for instansadministratorer angivet i `HEYM_ADMIN_EMAILS`.

| Felt | Funktion |
|------|----------|
| **Heym Work-adresse** | Placeringen, hvor Heym Work kører, for eksempel `https://work.example.com`. Login returnerer hertil. Tryk på **Gem**. |
| **Integrationsnøgle** | **Generer nøgle** opretter den nøgle, Heym Work anvender til hver anmodning til Heym. Den vises en enkelt gang med en kopieringsknap. Heym gemmer udelukkende dens hash. |
| **Aktivér Heym Work** | Tænder for forbindelsen. Kræver, at adresse og nøgle er angivet forinden. |
| Status | **Sidst set**, **Work-version** og **Licens**, som Heym Work senest har rapporteret dem. |

Åbn derefter Heym Work-adressen og afslut konfigurationen:

1. **Licens**: indtast licensnøglen modtaget fra Heym-teamet.
2. **Heym**: angiv Heym-adressen og integrationsnøglen.
3. **Ejer**: log ind med en konto, der er angivet som Heym Work-ejer.

Startsiden åbnes, klar til teamets arbejde.

### Rotation af nøglen

**Roter nøgle** erstatter integrationsnøglen. Heym Work ophører med at fungere, indtil den nye nøgle er indtastet der, og alle brugere logget på Heym Work logges ud. Anvend denne handling, hvis der er mistanke om lækage, eller hvis en medarbejder med adgang til nøglen fratræder.

### Deaktivering af forbindelsen

Slå **Aktivér Heym Work** fra for at afbryde forbindelsen. Heym Work vil derefter anmode om Heym-nøglen på ny. Heym fortsætter med at afvikle alle workflows, tidsplaner og webhooks under alle omstændigheder.

## Sikkerhedsmodel

- **Enhver ændring går igennem Heym.** Heym Work indlæser de viste data fra Heym-databasen og sender hver handling over den nøglebeskyttede kanal til Heym, hvor Heym anvender sine egne adgangsregler. Heym Work opbevarer sine egne data i et separat `heym_work`-skema.
- **Nøglen er hashet ved hvile.** Heym sammenligner et hash af den fremlagte nøgle og gemmer aldrig selve nøglen i klartekst.
- **Log ind forbliver hos Heym.** Brugere logger ind via Heym med den valgte identitetsudbyder, når [SSO](./sso.md) er slået til.
- **Ændringer revideres.** Gemning af forbindelsen og rotation af nøglen skriver `work_integration.update`- og `work_integration.key_rotate`-linjer i [revisionsloggen](./audit.md).

## Licensering

Heym Work kræver en særskilt licensnøgle udstedt af Heym-teamet. Hver dag sender Heym Work sit licens-ID, et installations-ID, antallet af aktive brugere over de seneste 30 dage, det samlede antal medlemmer, antallet af kørsler inden for de seneste 24 timer samt Heym- og Heym Work-versionerne til heym.run. Indhold i workflows, input, output og legitimationsoplysninger forbliver altid på lokale servere.

Hvis den daglige synkronisering mislykkes i 30 dage, påbegyndes en frist på 14 dage, hvorefter Heym Work-brugerfladen vil anmode en Ejer om en nøgle. En prøveperiode løber frem til den sidste dag og genoptages, så snart Heym-teamet forlænger den (højst én prøveperiode pr. installation). Selve Heym fungerer ufortrødent videre gennem hele forløbet. Netværk uden internetadgang anvender en offline-licens via enterprise@heym.run.

## Videoer

Alle Heym Work-videoer findes samlet i [Heym Work-spillelisten](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Relaterede emner

- [Enterprise](./enterprise.md): Kommerciel licensering og support
- [Single Sign-On](./sso.md): Log ind-løsningen anvendt af Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Gennemgangene vist i Heym Work
- [Revisionslogning](./audit.md): Hændelserne genereret ved forbindelsesændringer
- [Indstillinger](./user-settings.md): Placeringen af Heym Work-fanen
