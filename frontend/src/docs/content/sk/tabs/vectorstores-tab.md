# Karta Vektorové úložiská

Karta **Vektorové úložiská** spravuje vektorové úložiská používané uzlami [RAG](../nodes/rag-node.md). Vytvárajte úložiská, nahrávajte dokumenty a zdieľajte ich so svojím tímom.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Pozrite si ukážku Vektorových úložísk</a></p>

## Vytvorenie vektorového úložiska

1. Kliknite na **Nové vektorové úložisko**
2. Zadajte názov a voliteľný popis
3. Vyberte **prihlasovacie údaje** vektorového úložiska – *RAG: Qdrant + OpenAI* (externý server Qdrant), *RAG: Psql + OpenAI* (vlastná databáza Postgres v Hey m cez pgvector) alebo *RAG: Custom Embeddings* (akýkoľvek embedding endpoint kompatibilný s OpenAI, cielený na jeden z backendov). Prihlasovacie údaje určujú backend úložiska.
4. Voliteľne nastavte vlastný názov kolekcie (predvolene sa generuje automaticky)
5. Uložte

> Backend úložiska je pevne daný jeho prihlasovacími údajmi v čase vytvorenia. V uzle RAG rozbaľovací zoznam **Database** filtruje úložiská podľa zodpovedajúceho backendu.

## Nahrávanie dokumentov

- **Nahrať súbory** – Presuňte súbory metódou drag and drop alebo ich vyberte (PDF, TXT atď.)
- **Spracovanie duplikátov** – Zvoľte prepísanie alebo preskočenie duplicitných názvov súborov
- **Priebeh** – Priebeh nahrávania sa zobrazuje počas ingestácie

## Správa obsahu

- **Zobrazenie položiek** – Zobrazte skupiny zdrojov a počty dokumentov pre jednotlivé úložiská. Nahrané súbory sa zoskupujú
  pod názvom súboru; dokumenty, ktoré uložil [uzol RAG](../nodes/rag-node.md) bez
  vlastného `source`, sa zoskupujú pod **Added workflow: _name_**, pričom sa uvádza názov workflowu, ktorý
  ich zapísal
- **Odstránenie zdrojov** – Odstráňte konkrétne súbory alebo skupiny zdrojov z úložiska vrátane
  všetkého, čo pridal jeden workflow
- **Úprava úložiska** – Zmeňte názov, popis alebo prihlasovacie údaje

## Zdieľanie

- Zdieľajte vektorové úložiská s ostatnými používateľmi prostredníctvom e-mailu
- Zdieľané úložiská sa zobrazujú s indikátorom
- Zrušte zdieľanie v ponuke karty úložiska

## Použitie vo workflowoch

V [uzle RAG](../nodes/rag-node.md) vyberte vektorové úložisko podľa názvu. Uzol načíta relevantné časti a obohatí o ne kontext LLM.

## Súvisiace

- [Karta Prihlasovacie údaje](./credentials-tab.md) – Nastavenie prihlasovacích údajov vektorového úložiska (Qdrant, Postgres alebo vlastné embeddingy)
- [Uzol RAG](../nodes/rag-node.md) – Referencia uzla
- [Karta Workflowy](./workflows-tab.md) – Vytvárajte workflowy, ktoré používajú RAG
- [Kontextová ukážka](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkami pre povrchy dashboardu
