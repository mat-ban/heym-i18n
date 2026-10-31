# Pestanya Analytics

La pestanya **Analytics** mostra mètriques d'execució i tendències dels vostres workflows. Superviseu l'ús, el rendiment i identifiqueu colls d'ampolla.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

## Estadístiques resumides

- **Total d'execucions** – Recompte d'execucions de workflow en el període seleccionat
- **Taxa d'èxit** – Percentatge d'execucions correctes
- **Durada mitjana** – Temps mitjà d'execució
- **Temps estalviat** – Temps total estimat estalviat: els minuts estalviats per execució configurats de cada workflow × les seves execucions correctes, sumats al llarg de la finestra seleccionada
- **Tendències** – Indicadors d'augment/disminució respecte al període anterior

## Interval de temps

- **1h**, **3h**, **6h** – Darrera hora, 3 hores o 6 hores. Les analítiques es guarden per hora, de manera que comptabilitzen l'hora d'inici de la finestra sencera: Darrera hora a les 15:20 cobreix de 14:00 fins ara
- **24h** – Últimes 24 hores
- **7d** – Últims 7 dies
- **30d** – Últims 30 dies
- **All** – Historial complet disponible

## Filtre de workflow

- Filtreu les mètriques per un workflow específic
- **All workflows** – Agregació de tots els workflows

## Taules

Dues taules mostren l'ús dels workflows: **Most Used** (més àmplia) i **Most Failed**.

- **Time Saved** – Most Used mostra el temps estalviat sumat de cada workflow (minuts estalviats per execució × execucions correctes). **Not Set** indica que falta l'estimació; feu-hi clic per obrir aquest camp al workflow.
- **Columnes ordenables** – Feu clic a la capçalera d'una columna per ordenar per aquesta columna. Torneu-hi a fer clic per alternar entre ordre ascendent i descendent. Els indicadors de fletxa mostren la direcció de l'ordenació.
- **Etiquetes per a mòbil** – En pantalles petites, les etiquetes de columna s'escurcen (p. ex. "Executions" → "Runs", "Success" → "OK", "Error" → "Err") perquè les taules hi càpiguen sense desplaçament horitzontal.

## Gràfics

- **Execution Volume Over Time** – Gràfic de línies d'execucions per interval de temps
- **Success vs Error Rate** – Gràfic d'àrea que compara execucions correctes i fallides
- **Average Latency Over Time** – Gràfic de línies que mostra els canvis en el temps de resposta
- **Arrossegar per seleccionar** – Feu clic i arrossegueu sobre qualsevol gràfic per enfocar un interval de dates personalitzat. Una selecció ha de cobrir almenys dos punts al gràfic; un simple clic no selecciona res
- **Mode de selecció** – Els intervals seleccionats actualitzen les targetes de resum, els gràfics i les taules de workflows sense canviar el preset base
- **Clear Selection** – Torneu a la finestra de temps predefinida quan hàgiu acabat d'aprofundir

## Tipus de nodes

Sota els percentils de latència, tres gràfics mostren on van el temps dels nodes i les fallades, agrupats per tipus de node (Agent, HTTP Request, Code, etc.) en tots els workflows a la vista:

- **Nodes amb més temps dedicat** – Els 10 tipus de nodes amb més temps total d'execució, traçats com a durada mitjana per crida. Una hora sense crides d'un tipus mostra **Sense crides** a la informació sobre eines.
- **Tipus de nodes amb més fallades** – Els 10 tipus de nodes amb més errors (error o timeout), cadascun amb el seu propi recompte d'errors per interval temporal.
- **Tipus de nodes més cridats** – Els 10 tipus de nodes que més s'han executat, cadascun amb el seu propi recompte de crides per interval temporal. Els nodes omesos no es comptabilitzen.

Passeu el cursor per sobre d'un gràfic per veure el tipus de node sota el punter, just al costat. Un tipus de node massa petit per veure's al costat del més gran d'un gràfic (per sota de l'1% d'aquest) s'omet d'aquest gràfic i de la seva llegenda. Els gràfics segueixen el filtre de workflow, l'interval de temps i qualsevol interval que arrossegueu sobre un gràfic. Les analítiques de nodes s'enregistren per a les execucions a partir de la versió que les va introduir, i una execució acabada apareix en aproximadament un minut. Les execucions més antigues no es comptabilitzen.

## Actualització automàtica

- Activeu l'actualització automàtica per mantenir les mètriques actualitzades sense recarregar manualment

## Relacionat

- [Workflows Tab](./workflows-tab.md) – Workflows que es mesuren
- [Traces Tab](./traces-tab.md) – Inspecció detallada de traces
- [Logs Tab](./logs-tab.md) – Logs d'execució per a la depuració
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgina per a les superfícies del tauler

Quan un gràfic mostri una tendència sobre la qual vulgueu rebre notificacions en lloc de vigilar-la, convertiu-la en una [alert](./alerts-tab.md): el recompte d'errors, la durada d'execució, la despesa en LLM i el recompte d'execucions es poden configurar amb un llindar durant una finestra de temps.
