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
- **Drag to select** – Klicka och dra i valfritt diagram för att fokusera på ett anpassat datumintervall
- **Selection mode** – Valda intervall uppdaterar sammanfattningskorten, diagrammen och workflow-tabellerna utan att ändra den valda förinställningen
- **Clear Selection** – Återgå till den förinställda tidsperioden när genomgången är klar

## Auto Refresh

- Aktivera auto refresh för att hålla statistiken uppdaterad utan manuell omladdning

## Relaterat

- [Workflows Tab](./workflows-tab.md) – Workflows som mäts
- [Traces Tab](./traces-tab.md) – Detaljerad trace-inspektion
- [Logs Tab](./logs-tab.md) – Runtime-loggar för felsökning
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor

När ett diagram visar en trend som bör meddelas snarare än bevakas, gör om den till en [alert](./alerts-tab.md): felantal, körtid, LLM-kostnad och körningsantal kan alla ges ett tröskelvärde över ett tidsfönster.
