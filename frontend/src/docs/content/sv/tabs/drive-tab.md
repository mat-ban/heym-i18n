# Drive-fliken

Drive-fliken visar alla filer som genereras av skills i alla workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Se Drive-demonstration</a></p>

## Översikt

Filer som genereras av skills (PDF, DOCX, CSV, bilder, etc.) lagras och listas automatiskt i Drive-fliken. Varje fil visar namn, typ, storlek, källnod, skapandedatum och status för teamdelning.

## Funktioner

- **Sökning** – Filtrera filer efter namn, typ eller källnod
- **Kopiera fil-ID** – Kopiera filens UUID till urklipp, redo att klistras in i en [Drive](../nodes/drive-node.md)- eller [Converter](../nodes/converter-node.md)-nod
- **Ladda ner** – Autentiserad nedladdning för egna filer och filer som delats via team
- **Dela** – Skapa delbara nedladdningslänkar med valfritt lösenordsskydd och utgångsdatum, eller dela en fil skrivskyddat med aktuella team
- **Radera** – Ta bort filer och deras dellänkar
- **Rensa alla** – Radera samtliga filer och deras dellänkar efter bekräftelse
- **Massåtgärder** – Markera flera filer med kryssrutor (Shift-klick för ett intervall) och tillämpa samma åtgärd på alla samtidigt
- **Paginering** – Bläddra genom stora filsammlingar med en väljare för rader per sida (25 / 50 / 100 / Alla)

## Massåtgärder

Filer som ägs visar en kryssruta i början av raden (filer som delats via ett team är skrivskyddade och kan inte markeras). Markera flera rader – eller använd kryssrutan i rubriken för att markera hela sidan, och **Shift-klicka** för att markera ett intervall – använd sedan åtgärdsfältet som visas ovanför listan:

- **Ladda ner ZIP** paketerar alla markerade filer i ett enda ZIP-arkiv och laddar ner det
- **Massåtgärder** öppnar en dialog för att tillämpa en inställning på alla markerade filer:
  - **Dela alla med mina team** / **Ta bort teamdelning** med ett klick
  - **Skapa dellänk för varje fil** med samma lösenord, utgångsdatum och max antal nedladdningar
- **Radera** tar bort alla markerade filer och deras dellänkar efter en bekräftelse
- **Rensa markering** avmarkerar allt

Dialogen rapporterar hur många filer åtgärden tillämpades på (filer som inte ägs hoppas över). Använd väljaren för rader per sida och alternativet **Alla** för att ladda alla filer på en sida och markera över hela Drive. Vid inmatning i sökrutan växlar väljaren för rader per sida automatiskt till **Alla** så att sökningen omfattar alla filer, inte bara aktuell sida; när sökningen rensas återställs tidigare val.

## Delning

Skapa dellänkar med:
- **Ingen autentisering** – Offentlig token-baserad nedladdnings-URL
- **Basic Auth** – Lösenordsskyddad länk (användarnamn: `file`)
- **Utgångsdatum** – Valfritt tidsbaserat utgångsdatum
- **Nedladdningsgränser** – Valfritt maximalt antal nedladdningar

Aktivera **Dela med mina team** på en fil för att göra den synlig för alla team som för närvarande tillhörs. Delade teammedlemmar får skrivskyddad åtkomst; hanteringsåtgärder förblir endast för ägaren.

## Agent Skill-åtkomst

Skills på Agent-noden kan välja att läsa Drive-filer. När **Aktivera Drive-filer** är på för en skill kan dess Python-kod läsa tillgängliga Drive-filer via fil-id eller exakt filnamn genom hjälpfunktionen `heym_drive.py`. Inställningen är av som standard.

Se [Drive-referens](../reference/drive.md) för fullständig information.

## Relaterat

- [Drive-nod](../nodes/drive-node.md) – Lista filer, hämta metadata, dela med team eller ändra delningsbegränsningar från en workflow
- [Filgenerering](../reference/file-generation.md) – Hur skills genererar filer
- [Drive-referens](../reference/drive.md) – Dellänkar, tokens och rensning
- [Portal](../reference/portal.md) – Fillänkar i portalens chatt-svar
