# Tabblad Analytics

Het tabblad **Analytics** toont uitvoeringsstatistieken en trends voor uw workflows. Monitor gebruik, prestaties en identificeer knelpunten.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Bekijk Analytics-demo</a></p>

## Samenvattingsstatistieken

- **Totale uitvoeringen** – Aantal workflow-runs in de geselecteerde periode
- **Slagingspercentage** – Percentage geslaagde runs
- **Gemiddelde duur** – Gemiddelde uitvoeringstijd
- **Bespaarde tijd** – Totaal geschatte bespaarde tijd: de per workflow geconfigureerde bespaarde minuten per run × het aantal geslaagde runs, opgeteld over het geselecteerde venster
- **Trends** – Stijgings-/dalingsindicatoren ten opzichte van de vorige periode

## Tijdsbereik

- **24u** – Afgelopen 24 uur
- **7d** – Afgelopen 7 dagen
- **30d** – Afgelopen 30 dagen
- **Alles** – Volledige beschikbare geschiedenis

## Workflow-filter

- Filter statistieken op een specifieke workflow
- **Alle workflows** – Aggregeer over alle workflows

## Tabellen

Twee tabellen tonen workflowgebruik: **Meest gebruikt** (breder) en **Meest mislukt**.

- **Bespaarde tijd** – Meest gebruikt toont de opgetelde bespaarde tijd per workflow (bespaarde minuten per run × geslaagde runs). **Niet ingesteld** betekent dat de schatting ontbreekt; klik erop om dat veld op de workflow te openen.
- **Sorteerbare kolommen** – Klik op een kolomkop om op die kolom te sorteren. Klik opnieuw om te wisselen tussen oplopend/aflopend. Pijlindicatoren tonen de sorteerrichting.
- **Mobiele labels** – Op kleine schermen worden kolomlabels verkort (bijv. "Executions" → "Runs", "Success" → "OK", "Error" → "Err") zodat de tabellen passen zonder horizontaal scrollen.

## Grafieken

- **Uitvoeringsvolume in de tijd** – Lijndiagram van uitvoeringen per tijdsinterval
- **Slagings- versus foutpercentage** – Vlakdiagram dat gezonde en mislukte runs vergelijkt
- **Gemiddelde latentie in de tijd** – Lijndiagram dat veranderingen in responstijd toont
- **Slepen om te selecteren** – Klik en sleep op een grafiek om een aangepast datumbereik te selecteren
- **Selectiemodus** – Geselecteerde bereiken verversen de samenvattingskaarten, grafieken en workflowtabellen zonder de basispreset te wijzigen
- **Selectie wissen** – Keer terug naar het vooraf ingestelde tijdvenster wanneer u klaar bent met het verfijnen

## Automatisch verversen

- Schakel automatisch verversen in om statistieken bijgewerkt te houden zonder handmatig herladen

## Gerelateerd

- [Tabblad Workflows](./workflows-tab.md) – Workflows die worden gemeten
- [Tabblad Traces](./traces-tab.md) – Gedetailleerde trace-inspectie
- [Tabblad Logs](./logs-tab.md) – Runtime-logs voor foutopsporing
- [Contextuele showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboardoppervlakken

Wanneer een grafiek een trend toont waarover u op de hoogte wilt worden gesteld in plaats van erop te letten, zet deze dan om in een [waarschuwing](./alerts-tab.md): foutenaantal, uitvoeringsduur, LLM-uitgaven en uitvoeringsaantal kunnen allemaal een drempel krijgen over een tijdvenster.
