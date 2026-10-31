# Analytics-fanen

**Analytics**-fanen viser eksekveringsmålinger og tendenser for workflows. Overvåg brug, ydeevne og identificer flaskehalse.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Se Analytics-demo</a></p>

## Oversigtsstatistik

- **Samlede kørsler** – Antal workflow-eksekveringer i den valgte periode
- **Succesrate** – Procentdel af vellykkede kørsler
- **Gennemsnitlig varighed** – Middel eksekveringstid
- **Tid sparet** – Samlet estimeret tid sparet: hvert workflows konfigurerede minutter-sparet-per-kørsel × dets vellykkede kørsler, summeret over det valgte vindue
- **Tendenser** – Op/ned-indikatorer i forhold til foregående periode

## Tidsinterval

- **1t**, **3t**, **6t** – Sidste time, 3 timer eller 6 timer. Analyser gemmes pr. time, så disse tæller hele starttimen for vinduet med: Sidste time kl. 15:20 dækker fra 14:00 indtil nu
- **24t** – Seneste 24 timer
- **7d** – Seneste 7 dage
- **30d** – Seneste 30 dage
- **Alle** – Hele tilgængelige historik

## Workflow-filter

- Filtrer målinger efter specifikt workflow
- **Alle workflows** – Aggreger på tværs af alle workflows

## Tabeller

To tabeller viser workflow-brug: **Mest brugte** (bredere) og **Mest fejlende**.

- **Tid sparet** – Mest brugte viser hvert workflows summerede tid sparet (minutter sparet per kørsel × vellykkede kørsler). **Ikke angivet** betyder estimatet mangler; klik for at åbne det felt på workflowet.
- **Sorterbare kolonner** – Klik på en kolonneoverskrift for at sortere efter den kolonne. Klik igen for at skifte mellem stigende/faldende. Pilindikatorer viser sorteringsretning.
- **Mobilmærkater** – På små skærme forkortes kolonneoverskrifter (f.eks. "Eksekveringer" → "Kørsler", "Succes" → "OK", "Fejl" → "Err") så tabellerne passer uden horisontal rulning.

## Diagrammer

- **Eksekveringsvolumen over tid** – Linjediagram over eksekveringer per tidsinterval
- **Succes vs fejlrate** – Områdediagram der sammenligner sunde og fejlende kørsler
- **Gennemsnitlig ventetid over tid** – Linjediagram der viser ændringer i responstid
- **Træk for at vælge** – Klik og træk på et vilkårligt diagram for at fokusere på et brugerdefineret datointerval. En markering skal dække mindst to punkter på diagrammet; et almindeligt klik vælger intet
- **Udvalgsmode** – Valgte intervaller opdaterer oversigtskortene, diagrammer og workflow-tabeller uden at ændre basispræsentationen
- **Ryd udvalg** – Vend tilbage til det forudindstillede tidsvindue når der er færdig med at analysere

## Knudetyper

Under latenstidsprocentilerne viser tre diagrammer, hvor knudetid og fejl opstår, grupperet efter knudetype (Agent, HTTP Request, Code osv.) på tværs af de viste workflow:

- **Knuder med mest tidsforbrug** – De 10 knudetyper med mest samlet kørselstid, afbildet som gennemsnitlig varighed pr. kald. En time uden kald af en given type viser **Ingen kald** i værktøjstippet.
- **Knudetyper med flest fejl** – De 10 knudetyper med flest fejl (fejl eller timeout), hver med sit eget antal fejl pr. tidsinterval.
- **Mest kaldte knudetyper** – De 10 knudetyper, der kørte mest, hver med sit eget antal kald pr. tidsinterval. Sprungne knuder tælles ikke med.

Hold markøren over et diagram for at se knudetypen under markøren lige ved siden af. En knudetype, der er for lille til at kunne ses ved siden af den største på et diagram (under 1 % af den), udelades fra det diagram og dets forklaring. Diagrammerne følger workflow-filteret, tidsintervallet og ethvert interval, der trækkes på et diagram. Knudeanalyser registreres for kørsler fra og med versionen, der introducerede dem, og en afsluttet kørsel vises inden for cirka et minut. Ældre kørsler tælles ikke med.

## Auto-opdatering

- Aktivér auto-opdatering for at holde målinger ajour uden manuel genindlæsning

## Relateret

- [Workflows-fanen](./workflows-tab.md) – Workflows der måles på
- [Traces-fanen](./traces-tab.md) – Detaljeret sporingsinspektion
- [Logs-fanen](./logs-tab.md) – Runtime-logs til fejlfinding
- [Kontekstuel showcase](../reference/contextual-showcase.md) – Kompakt sideguide til dashboard-overflader

Når et diagram viser en tendens der ønskes advaret om i stedet for at overvåge manuelt, kan den konverteres til en [advarsel](./alerts-tab.md): fejltælling, kørselsvarighed, LLM-forbrug og eksekveringsantal kan alle tildeles en tærskelværdi over et tidsvindue.
