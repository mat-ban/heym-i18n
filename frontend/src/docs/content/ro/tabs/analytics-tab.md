# Filă Analytics

Fila **Analytics** afișează metrici de execuție și tendințe pentru workflow-urile dumneavoastră. Monitorizați utilizarea, performanța și identificați blocajele.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Urmăriți demonstrația Analytics</a></p>

## Statistici sumare

- **Total execuții** – Numărul de rulări ale workflow-ului în perioada selectată
- **Rată de succes** – Procentul rulărilor reușite
- **Durată medie** – Timpul mediu de execuție
- **Timp economisit** – Timpul total estimat economisit: minutele configurate per rulare pentru fiecare workflow × rulările sale reușite, însumate pe fereastra selectată
- **Tendințe** – Indicatori de creștere/scădere față de perioada anterioară

## Interval de timp

- **24h** – Ultimele 24 de ore
- **7d** – Ultimele 7 zile
- **30d** – Ultimele 30 de zile
- **All** – Întregul istoric disponibil

## Filtru workflow

- Filtrați metricile după un workflow specific
- **Toate workflow-urile** – Agregare pentru toate workflow-urile

## Tabele

Două tabele afișează utilizarea workflow-urilor: **Cele mai utilizate** (mai lat) și **Cele mai multe erori**.

- **Timp economisit** – Tabelul Cele mai utilizate afișează timpul economisit însumat pentru fiecare workflow (minute economisite per rulare × rulări reușite). **Nesetat** înseamnă că estimarea lipsește; faceți clic pentru a deschide acel câmp în workflow.
- **Coloane sortabile** – Faceți clic pe antetul unei coloane pentru a sorta după acea coloană. Faceți clic din nou pentru a comuta între crescător/descrescător. Indicatorii cu săgeți arată direcția de sortare.
- **Etichete pentru mobil** – Pe ecranele mici, etichetele coloanelor sunt prescurtate (de ex. „Executions" → „Runs", „Success" → „OK", „Error" → „Err") pentru ca tabelele să încapă fără derulare orizontală.

## Grafice

- **Volumul execuțiilor în timp** – Grafic cu linii al execuțiilor per interval de timp
- **Rata de succes vs eroare** – Grafic cu arie care compară rulările reușite și cele eșuate
- **Latența medie în timp** – Grafic cu linii care arată variațiile timpului de răspuns
- **Trageți pentru a selecta** – Faceți clic și trageți pe orice grafic pentru a focaliza un interval de date personalizat
- **Modul de selecție** – Intervalele selectate reîmprospătează cardurile sumare, graficele și tabelele de workflow-uri fără a modifica presetarea de bază
- **Golește selecția** – Reveniți la fereastra de timp presetată după ce ați terminat analiza detaliată

## Reîmprospătare automată

- Activați reîmprospătarea automată pentru a menține metricile actualizate fără reîncărcare manuală

## Resurse conexe

- [Fila Workflows](./workflows-tab.md) – Workflow-urile măsurate
- [Fila Traces](./traces-tab.md) – Inspecție detaliată a traces
- [Fila Logs](./logs-tab.md) – Loguri de runtime pentru depanare
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului

Când un grafic arată o tendință despre care doriți să fiți notificat în loc să o urmăriți, transformați-o într-o [alertă](./alerts-tab.md): numărul de erori, durata rulării, cheltuiala LLM și numărul de execuții pot primi toate un prag pe o fereastră de timp.
