# Analyticsi vahekaart

**Analyticsi** vahekaart näitab teie workflow'de käivituste mõõdikuid ja trende. Jälgige kasutust, jõudlust ja tuvastage kitsaskohti.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Vaadake Analyticsi demot</a></p>

## Kokkuvõtlikud näitajad

- **Käivituste koguarv** – workflow'de käivituste arv valitud perioodil
- **Õnnestumise määr** – edukate käivituste protsent
- **Keskmine kestus** – keskmine käivituse aeg
- **Säästetud aeg** – hinnanguline kogu säästetud aeg: iga workflow konfigureeritud säästetud minutid käivituse kohta × selle edukad käivitused, summeerituna valitud ajavahemikus
- **Trendid** – üles/alla indikaatorid võrreldes eelmise perioodiga

## Ajavahemik

- **1h**, **3h**, **6h** – Viimane tund, 3 tundi või 6 tundi. Analüütikat peetakse tunnikaupa, nii et need arvestavad akna algustundi tervikuna: Viimane tund kell 15:20 katab aja alates 14:00 kuni praeguseni
- **24h** – viimased 24 tundi
- **7d** – viimased 7 päeva
- **30d** – viimased 30 päeva
- **Kõik** – kogu saadaolev ajalugu

## Workflow filter

- Filtreerige mõõdikuid kindla workflow järgi
- **Kõik workflow'd** – koondnäitajad kõigi workflow'de lõikes

## Tabelid

Kaks tabelit näitavad workflow'de kasutust: **Enim kasutatud** (laiem) ja **Enim ebaõnnestunud**.

- **Säästetud aeg** – Enim kasutatud näitab iga workflow summeeritud säästetud aega (säästetud minutid käivituse kohta × edukad käivitused). **Määramata** tähendab, et hinnang puudub; klõpsake sellel, et avada vastav väli workflow'l.
- **Sorteeritavad veerud** – klõpsake veeru päisel, et sorteerida selle veeru järgi. Klõpsake uuesti, et vahetada kasvav/langev järjekord. Nooleindikaatorid näitavad sorteerimissuunda.
- **Mobiilsildid** – väikestel ekraanidel on veerusildid lühendatud (nt "Executions" → "Runs", "Success" → "OK", "Error" → "Err"), et tabelid mahuksid ilma horisontaalse kerimiseta.

## Diagrammid

- **Käivituste maht ajas** – joondiagramm käivituste kohta ajavahemiku lõikes
- **Õnnestumise ja vigade määr** – pinddiagramm, mis võrdleb õnnestunud ja ebaõnnestunud käivitusi
- **Keskmine latentsus ajas** – joondiagramm, mis näitab vastuseaja muutusi
- **Lohistage valimiseks** – Klõpsake ja lohistage mis tahes diagrammil, et teravustada kohandatud kuupäevavahemikku. Valik peab hõlmama diagrammil vähemalt kahte punkti; lihtne klõps ei vali midagi
- **Valikurežiim** – valitud vahemikud värskendavad kokkuvõtvaid kaarte, diagramme ja workflow'de tabeleid ilma põhiseadet muutmata
- **Tühjendage valik** – naaske eelseadistatud ajavahemikku, kui olete süvitsi uurimise lõpetanud

## Sõlmetüübid

Latentsuse persentiilide all näitavad kolm diagrammi, kuhu kuluvad sõlmede aeg ja vead, rühmitatuna sõlmetüübi järgi (Agent, HTTP Request, Code jne) kuvatavates workflow'des:

- **Enim aega võtvad sõlmed** – 10 sõlmetüüpi, millel on suurim kogutäitmisaeg, esitatuna keskmise kestusena kutse kohta. Tund ilma teatud tüüpi kutseteta kuvab kohtspikris **Kutseid pole**.
- **Enim ebaõnnestunud sõlmetüübid** – 10 sõlmetüüpi, kus esineb enim vigu (viga või timeout), igaüks oma veakordade arvuga ajavahemiku kohta.
- **Enim kutsutud sõlmetüübid** – 10 sõlmetüüpi, mida käitati kõige rohkem, igaüks oma kutsete arvuga ajavahemiku kohta. Vahelejäänud sõlmi ei arvestata.

Hõljutage kursorit diagrammi kohal, et näha sõlmetüüpi otse kursori kõrval. Sõlmetüüp, mis on liiga väike, et paista diagrammi suurima kõrval (alla 1% sellest), jäetakse diagrammilt ja selle legendist välja. Diagrammid järgivad workflow filtrit, ajavahemikku ja mis tahes vahemikku, mille diagrammile lohistate. Sõlmeanalüütika salvestatakse käituste jaoks alates versioonist, mis selle lisas, ning lõppenud käitus ilmub umbes minuti jooksul. Vanemaid käitusi ei arvestata.

## Automaatne värskendamine

- Lubage automaatne värskendamine, et hoida mõõdikud ajakohastena ilma käsitsi uuesti laadimiseta

## Seotud

- [Workflowsi vahekaart](./workflows-tab.md) – workflow'd, mida mõõdetakse
- [Käivituste vahekaart](./traces-tab.md) – üksikasjalik käivituste uurimine
- [Logide vahekaart](./logs-tab.md) – käitusaegsed logid silumiseks
- [Kontekstuaalne showcase](../reference/contextual-showcase.md) – kompaktne lehejuhend armatuurlaua vaadetele

Kui diagramm näitab trendi, millest soovite pigem teavitust kui ise jälgimist, muutke see [teavituseks](./alerts-tab.md): vigade arvule, käivituse kestusele, LLM kulule ja käivituste arvule saab kõigile määrata lävendi ajavahemiku kohta.
