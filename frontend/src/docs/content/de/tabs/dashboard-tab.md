# Reiter Dashboard

Der Reiter **Dashboard** ist eine anpassbare Berichts- und Visualisierungsplattform. Jedes Diagramm-Widget wird im Hintergrund von einem eigenen Heym-Workflow angetrieben.

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Video-Demo zum Dashboard ansehen</a></p>

## Funktionsweise

- Ein Widget ruft Daten aus APIs, PostgreSQL, Vektorspeichern oder Webhooks ab, bereitet diese auf und übergibt sie an den [Diagramm-Ausgabe-Knoten](../nodes/chart-output-node.md).
- Unterstützte Diagrammtypen: Liniendiagramme, Balkendiagramme, Donut-Diagramme, KPI-Zahlen und Tabellen.
- Widgets können manuell erstellt oder mit natürlicher Sprache durch KI generiert werden.
- Passen Sie die Anordnung der Widgets flexibel über das Drag & Drop Raster an.

## Verwandte Themen

- [Diagramm-Ausgabe-Knoten](../nodes/chart-output-node.md) – Diagrammdaten bereitstellen\n