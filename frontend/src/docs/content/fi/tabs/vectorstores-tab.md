# Vektorivarastot-välilehti

**Vektorivarastot**-välilehdellä hallinnoidaan [RAG](../nodes/rag-node.md)-solmuissa käytettäviä vektorivarastoja. Voit luoda varastoja, ladata tiedostoja ja jakaa niitä tiimisi kanssa.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Katso Vektorivarastot-esittely</a></p>

## Vektorivaraston luominen

1. Valitse **Uusi vektorivarasto**
2. Anna nimi ja valinnainen kuvaus
3. Valitse vektorivaraston **tunnistetiedot** – *RAG: Qdrant + OpenAI* (ulkoinen Qdrant-palvelin), *RAG: Psql + OpenAI* (Heymin oma Postgres-tietokanta pgvectorin kautta) tai *RAG: Custom Embeddings* (mikä tahansa OpenAI-yhteensopiva upotuspäätepiste, kumpaan tahansa taustajärjestelmään). Tunnistetiedot määrittävät varaston taustajärjestelmän.
4. Aseta valinnainen mukautettu kokoelmannimi (oletuksena automaattisesti luotu)
5. Tallenna

> Varaston taustajärjestelmä määräytyy sen tunnistetietojen perusteella luontivaiheessa. RAG-solmun **Tietokanta**-pudotusvalikossa suodatetaan varastot vastaamaan valittua taustajärjestelmää.

## Tiedostojen lataaminen

- **Lataa tiedostoja** – Vedä ja pudota tai valitse tiedostot (PDF, TXT jne.)
- **Kaksoiskappaleiden käsittely** – Valitse, korvataanko vai ohitetaanko samannimiset tiedostot
- **Edistyminen** – Latauksen edistyminen näkyy tiedostojen käsittelyn aikana

## Sisällön hallinta

- **Näytä kohteet** – Näe lähderyhmät ja dokumenttien määrät varastokohtaisesti. Ladatut tiedostot ryhmittyvät tiedostonimen alle; [RAG-solmun](../nodes/rag-node.md) tallentamat dokumentit, joilla ei ole omaa `source`-arvoa, ryhmittyvät **Lisätty workflow: _nimi_** -otsikon alle, nimettynä niitä kirjoittaneen workflown mukaan
- **Poista lähteet** – Poista tiettyjä tiedostoja tai lähderyhmiä varastosta, mukaan lukien kaikki yhden workflown lisäämät dokumentit
- **Muokkaa varastoa** – Muuta nimeä, kuvausta tai tunnistetietoja

## Jakaminen

- Jaa vektorivarastoja muille käyttäjille sähköpostitse
- Jaetut varastot merkitään erityisellä kuvakkeella
- Peruuta jakaminen varastokortin valikosta

## Käyttö workflowissa

[RAG-solmun](../nodes/rag-node.md) asetuksissa valitse vektorivarasto nimen perusteella. Solmu hakee relevantit osiot ja täydentää LLM-kontekstia niillä.

## Liittyvät aiheet

- [Tunnistetiedot-välilehti](./credentials-tab.md) – Vektorivarastojen tunnistetietojen asetukset (Qdrant, Postgres tai mukautetut upotukset)
- [RAG-solmu](../nodes/rag-node.md) – Solmun viite
- [Workflowt-välilehti](./workflows-tab.md) – Luo RAGia käyttäviä workflowja
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiivis sivun opas hallintapaneelin käyttöliittymäosille
