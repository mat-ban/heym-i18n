# Analitikos skirtukas

**Analitikos** skirtukas rodo vykdymo metriką ir tendencijas Jūsų workflows. Stebėkite naudojimą, našumą ir identifikuokite problemas.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Žiūrėti Analitikos demonstraciją</a></p>

## Santraukos statistika

- **Bendras vykdymų skaičius** – Workflow vykdymų skaičius pasirinktu laikotarpiu
- **Sėkmės rodiklis** – Sėkmingų vykdymų procentas
- **Vidutinė trukmė** – Vidutinė vykdymo trukmė
- **Išsaugotas laikas** – Bendras apskaičiuotas išsaugotas laikas: kiekvieno workflow sukonfigūruoti išsaugoti minutės per vykdymą × sėkmingi vykdymai, sumuojami per pasirinktą laikotarpį
- **Tendencijos** – Aukštyn/žemyn rodikliai palyginus su ankstesniu laikotarpiu

## Laiko intervalas

- **24h** – Paskutinės 24 valandos
- **7d** – Paskutinės 7 dienos
- **30d** – Paskutinės 30 dienų
- **Visi** – Visa turima istorija

## Workflow filtras

- Filtruoti metriką pagal konkretų workflow
- **Visi workflows** – Agreguoti visus workflows

## Lentelės

Dvi lentelės rodo workflow naudojimą: **Dažniausiai naudojami** (platesnė) ir **Dažniausiai nepavykę**.

- **Išsaugotas laikas** – Dažniausiai naudojami rodo kiekvieno workflow sumuotą išsaugotą laiką (minutės išsaugotos per vykdymą × sėkmingi vykdymai). **Nenurodyta** reiškia, kad įvertinimas trūksta; spustelėkite, kad atidarytumėte tą lauką workflow.
- **Rūšiuojami stulpeliai** – Spustelėkite stulpelio antraštę, kad rūšiuotumėte pagal tą stulpelį. Spustelėkite dar kartą, kad pakeistumėte didėjimo/mažėjimo tvarką. Rodyklės rodikliai rodo rūšiavimo kryptį.
- **Mobilūs etiketės** – Mažose ekranuose stulpelių etiketės sutrumpinamos (pvz., "Vykdymai" → "Vykd.", "Sėkmė" → "OK", "Klaida" → "Klaida"), kad lentelės tilptų be horizontalios slinkties.

## Grafikai

- **Vykdymo apimtis per laiką** – Linijinė diagrama, rodanti vykdymus per laiko intervalus
- **Sėkmės vs Klaidos rodiklis** – Ploto diagrama, lyginanti sėkmingus ir nepavykusius vykdymus
- **Vidutinė latencija per laiką** – Linijinė diagrama, rodanti atsako laiko pokyčius
- **Vilkti pasirinkti** – Spustelėkite ir vilkite bet kurioje diagramoje, kad sutelktumėte dėmesį į pasirinktą datų intervalą
- **Pasirinkimo režimas** – Pasirinkti intervalai atnaujina santraukos korteles, diagramas ir workflow lenteles, nekeisdami pagrindinio nustatymo
- **Išvalyti pasirinkimą** – Grįžkite prie numatyto laiko lango, kai baigsite tyrinėti

## Automatinis atnaujinimas

- Įgalinkite automatinį atnaujinimą, kad metrikos būtų atnaujinamos be rankinio perkrovimo

## Susiję

- [Workflows skirtukas](./workflows-tab.md) – Matuojami workflows
- [Vykdymų skirtukas](./traces-tab.md) – Išsami vykdymo analizė
- [Žurnalo skirtukas](./logs-tab.md) – Vykdymo žurnalai derinimui
- [Kontekstinis demonstravimas](../reference/contextual-showcase.md) – Kompaktiška puslapio gairė valdymo skydeliams

Kai diagrama rodo tendenciją, apie kurią norite būti informuoti, o ne stebėti, paverskite ją [įspėjimu](./alerts-tab.md): klaidų skaičius, vykdymo trukmė, LLM išlaidos ir vykdymų skaičius gali turėti slenkstį per laiko langą.
