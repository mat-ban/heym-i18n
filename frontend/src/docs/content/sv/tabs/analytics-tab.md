# Analytics-fliken

Fliken **Analytics** visar körningsstatistik och trender för workflows. Användning, prestanda och flaskhalsar kan övervakas här.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

## Sammanfattande statistik

- **Total executions** – Antal workflow-körningar under den valda perioden
- **Success rate** – Andel lyckade körningar
- **Average duration** – Genomsnittlig körtid
- **Time saved** – Total uppskattad tidsbesparing: varje workflows konfigurerade minuter-sparade-per-körning × dess lyckade körningar, summerat över det valda intervallet
- **Trends** – Upp-/nedindikatorer jämfört med föregående period

## Tidsintervall

- **1h**, **3h**, **6h** – Senaste timmen, 3 timmarna eller 6 timmarna. Analyser sparas per timme, så dessa räknar hela starttimmen för fönstret: Senaste timmen vid 15:20 täcker 14:00 fram till nu
- **24h** – Senaste 24 timmarna
- **7d** – Senaste 7 dagarna
- **30d** – Senaste 30 dagarna
- **All** – Hela tillgängliga historiken

## Workflow-filter

- Filtrera statistik efter en specifik workflow
- **All workflows** – Aggregera över alla workflows

## Tabeller

Två tabeller visar workflow-användning: **Most Used** (bredare) och **Most Failed**.

- **Time Saved** – Most Used visar varje workflows summerade tidsbesparing (minuter sparade per körning × lyckade körningar). **Not Set** innebär att uppskattningen saknas; klicka på det för att öppna fältet på workflowen.
- **Sorterbara kolumner** – Klicka på en kolumnrubrik för att sortera efter den kolumnen. Klicka igen för att växla mellan stigande och fallande ordning. Pilindikatorer visar sorteringsriktningen.
- **Mobila etiketter** – På små skärmar förkortas kolumnetiketter (t.ex. "Executions" → "Runs", "Success" → "OK", "Error" → "Err") så att tabellerna får plats utan horisontell scrollning.

## Diagram

- **Execution Volume Over Time** – Linjediagram över körningar per tidsintervall
- **Success vs Error Rate** – Ytdiagram som jämför lyckade och misslyckade körningar
- **Average Latency Over Time** – Linjediagram som visar förändringar i svarstid
- **Dra för att välja** – Klicka och dra på valfritt diagram för att fokusera på ett anpassat datumintervall. En markering måste omfatta minst två punkter i diagrammet; ett enkelt klick väljer ingenting
- **Selection mode** – Valda intervall uppdaterar sammanfattningskorten, diagrammen och workflow-tabellerna utan att ändra den valda förinställningen
- **Clear Selection** – Återgå till den förinställda tidsperioden när genomgången är klar

## Nodtyper

Under latenspercentilerna visar tre diagram var nodtid och fel hamnar, grupperade efter nodtyp (Agent, HTTP Request, Code och så vidare) över de visade workflowen:

- **Noder som tar mest tid** – De 10 nodtyperna med mest total körningstid, ritade som genomsnittlig varaktighet per anrop. En timme utan anrop av en viss typ visar **Inga anrop** i verktygstipset.
- **Nodtyper med flest fel** – De 10 nodtyperna med flest fel (fel eller timeout), var och en med sitt eget felantal per tidsintervall.
- **Mest anropade nodtyper** – De 10 nodtyperna som kördes mest, var och en med sitt eget anropsantal per tidsintervall. Överhoppade noder räknas inte.

Hovra över ett diagram för att se nodtypen under pekaren precis bredvid. En nodtyp som är för liten för att synas bredvid den största på ett diagram (under 1 % av den) utelämnas från det diagrammet och dess teckenförklaring. Diagrammen följer workflow-filtret, tidsintervallet och eventuellt intervall som dras på ett diagram. Nodanlyser registreras för körningar från och med versionen som introducerade dem, och en slutförd körning visas inom ungefär en minut. Äldre körningar räknas inte in.

## Auto Refresh

- Aktivera auto refresh för att hålla statistiken uppdaterad utan manuell omladdning

## Relaterat

- [Workflows Tab](./workflows-tab.md) – Workflows som mäts
- [Traces Tab](./traces-tab.md) – Detaljerad trace-inspektion
- [Logs Tab](./logs-tab.md) – Runtime-loggar för felsökning
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor

När ett diagram visar en trend som bör meddelas snarare än bevakas, gör om den till en [alert](./alerts-tab.md): felantal, körtid, LLM-kostnad och körningsantal kan alla ges ett tröskelvärde över ett tidsfönster.
