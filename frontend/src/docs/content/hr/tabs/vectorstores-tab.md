# Zavičajna spremišta

Tablica **Zavičajna spremišta** upravlja vektorskim spremištima koja koriste [RAG](../nodes/rag-node.md) čvorovi. Kreirajte spremišta, učitajte dokumente i dijelite ih sa svojim timom.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Pogledajte demo Zavičajnih spremišta</a></p>

## Kreiranje vektorskog spremišta

1. Kliknite **Novo vektorsko spremište**
2. Unesite naziv i opcionalni opis
3. Odaberite **vjerodajnicu** vektorskog spremišta – *RAG: Qdrant + OpenAI* (vanjski Qdrant poslužitelj), *RAG: Psql + OpenAI* (Heymova vlastita Postgres baza putem pgvector), ili *RAG: Prilagođene ugradnje* (bilo koji OpenAI-kompatibilni endpoint za ugradnje, usmjeren na bilo koji backend). Vjerodajnica određuje backend spremišta.
4. Opcionalno postavite prilagođeni naziv kolekcije (zadano se generira automatski)
5. Spremite

> Backend spremišta je fiksiran njegovom vjerodajnicom u trenutku kreiranja. U RAG čvoru, **Baza podataka** padajući izbornik filtrira spremišta prema odgovarajućem backendu.

## Učitavanje dokumenata

- **Učitajte datoteke** – Povucite i ispustite ili odaberite datoteke (PDF, TXT, itd.)
- **Rukovanje dupliciranim datotekama** – Odaberite hoćete li zamijeniti ili preskočiti duplicirane nazive datoteka
- **Napredak** – Napredak učitavanja prikazan je tijekom unosa

## Upravljanje sadržajem

- **Pogledajte stavke** – Vidite izvorne grupe i broj dokumenata po spremištu. Učitane datoteke grupiraju se prema svom nazivu; dokumenti koje je [RAG čvor](../nodes/rag-node.md) pohranio bez vlastitog `source` grupiraju se pod **Dodani workflow: _naziv_**, nazivajući workflow koji ih je napisao
- **Izbrišite izvore** – Uklonite specifične datoteke ili izvorne grupe iz spremišta, uključujući sve što je jedan workflow dodao
- **Uredite spremište** – Promijenite naziv, opis ili vjerodajnicu

## Dijeljenje

- Dijelite vektorska spremišta s drugim korisnicima putem e-pošte
- Dijeljena spremišta pojavljuju se s indikatorom
- Oduzmite dijeljenje iz izbornika kartice spremišta

## Korištenje u Workflows

U [RAG čvoru](../nodes/rag-node.md), odaberite vektorsko spremište po nazivu. Čvor preuzima relevantne dijelove i obogaćuje LLM kontekst njima.

## Povezano

- [Tablica Vjerodajnica](./credentials-tab.md) – Postavke vjerodajnica vektorskog spremišta (Qdrant, Postgres ili prilagođene ugradnje)
- [RAG Čvor](../nodes/rag-node.md) – Referenca na čvor
- [Tablica Workflows](./workflows-tab.md) – Kreirajte workflows koji koriste RAG
- [Kontekstualna izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče
