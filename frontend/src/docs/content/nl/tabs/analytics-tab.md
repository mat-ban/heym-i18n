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

- **1u**, **3u**, **6u** – Afgelopen uur, 3 uur of 6 uur. Analyses worden per uur bijgehouden, dus deze tellen het beginuur van het venster volledig mee: Afgelopen uur om 15:20 dekt 14:00 tot nu
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
- **Slepen om te selecteren** – Klik en sleep op een grafiek om een aangepast datumbereik te selecteren. Een selectie moet ten minste twee punten op de grafiek beslaan; een gewone klik selecteert niets
- **Selectiemodus** – Geselecteerde bereiken verversen de samenvattingskaarten, grafieken en workflowtabellen zonder de basispreset te wijzigen
- **Selectie wissen** – Keer terug naar het vooraf ingestelde tijdvenster wanneer u klaar bent met het verfijnen

## Node-typen

Onder de latentiepercentielen tonen drie diagrammen waar nodetijd en fouten naartoe gaan, gegroepeerd op nodetype (Agent, HTTP Request, Code enzovoort) over de zichtbare workflows:

- **Meest tijdrovende nodes** – De 10 nodetypen met de meeste totale uitvoeringstijd, uitgezet als gemiddelde duur per aanroep. Een uur zonder aanroepen van een type toont **Geen aanroepen** in de tooltip.
- **Nodetypen met de meeste fouten** – De 10 nodetypen met de meeste fouten (fout of time-out), elk met een eigen foutenaantal per tijdsinterval.
- **Meest aangeroepen nodetypen** – De 10 nodetypen die het vaakst zijn uitgevoerd, elk met een eigen aanroepaantal per tijdsinterval. Overgeslagen nodes worden niet meegeteld.

Beweeg over een diagram om het nodetype onder de aanwijzer direct ernaast te zien. Een nodetype dat te klein is om naast het grootste op een diagram te zien (minder dan 1% daarvan), wordt weggelaten uit dat diagram en de bijbehorende legenda. De diagrammen volgen het workflowfilter, het tijdsbereik en elk bereik dat u op een diagram sleept. Node-analyses worden vastgelegd voor uitvoeringen vanaf de release waarin ze zijn toegevoegd, en een voltooide uitvoering verschijnt binnen ongeveer een minuut. Oudere uitvoeringen worden niet meegeteld.

## Automatisch verversen

- Schakel automatisch verversen in om statistieken bijgewerkt te houden zonder handmatig herladen

## Gerelateerd

- [Tabblad Workflows](./workflows-tab.md) – Workflows die worden gemeten
- [Tabblad Traces](./traces-tab.md) – Gedetailleerde trace-inspectie
- [Tabblad Logs](./logs-tab.md) – Runtime-logs voor foutopsporing
- [Contextuele showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboardoppervlakken

Wanneer een grafiek een trend toont waarover u op de hoogte wilt worden gesteld in plaats van erop te letten, zet deze dan om in een [waarschuwing](./alerts-tab.md): foutenaantal, uitvoeringsduur, LLM-uitgaven en uitvoeringsaantal kunnen allemaal een drempel krijgen over een tijdvenster.
