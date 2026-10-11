# Vektorhoidlate vahekaart

**Vektorhoidlate** vahekaart haldab vektorhoidlaid, mida kasutavad [RAG](../nodes/rag-node.md) sõlmed. Looge hoidlaid, laadige üles dokumente ja jagage neid oma meeskonnaga.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vaadake vektorhoidlate demo</a></p>

## Vektorhoidla loomine

1. Klõpsake **Uus vektorhoidla**
2. Sisestage nimi ja valikuline kirjeldus
3. Valige vektorhoidla **mandaat** – *RAG: Qdrant + OpenAI* (väline Qdrant server), *RAG: Psql + OpenAI* (Heymi enda Postgres andmebaas pgvectori kaudu) või *RAG: Custom Embeddings* (ükskõik milline OpenAI-ga ühilduv embedding endpoint, mis on suunatud kummale tahes taustsüsteemile). Mandaat määrab hoidla taustsüsteemi.
4. Soovi korral määrake kohandatud kogu nimi (vaikimisi automaatselt genereeritud)
5. Salvestage

> Hoidla taustsüsteem määratakse selle mandaadiga loomise hetkel. RAG sõlmes filtreerib **Database** rippmenüü hoidlad vastava taustsüsteemi järgi.

## Dokumentide üleslaadimine

- **Failide üleslaadimine** – Lohistage või valige failid (PDF, TXT jne)
- **Duplikaatide käsitlemine** – Valige, kas duplikaatfailinimed kirjutatakse üle või jäetakse vahele
- **Edenemine** – Üleslaadimise edenemist kuvatakse ingestimise ajal

## Sisu haldamine

- **Üksuste vaatamine** – Vaadake allikarühmi ja dokumentide arvu hoidla kohta. Üleslaaditud failid
  rühmitatakse nende failinime järgi; dokumendid, mille [RAG sõlm](../nodes/rag-node.md) salvestas ilma
  oma `source`-ita, rühmitatakse **Lisatud workflow: _nimi_** alla, nimetades workflow'd, mis
  need kirjutas
- **Allikate kustutamine** – Eemaldage hoidlast konkreetseid faile või allikarühmi, sealhulgas
  kõik, mille üks workflow lisas
- **Hoidla muutmine** – Muutke nime, kirjeldust või mandaati

## Jagamine

- Jagage vektorhoidlaid teiste kasutajatega e-posti teel
- Jagatud hoidlad kuvatakse indikaatoriga
- Tühistage jagamine hoidla kaardi menüüst

## Kasutamine workflow'des

Valige [RAG sõlmes](../nodes/rag-node.md) vektorhoidla nime järgi. Sõlm otsib välja asjakohased tükid ja täiendab nendega LLM-i konteksti.

## Seotud

- [Mandaatide vahekaart](./credentials-tab.md) – Vektorhoidla mandaadi seadistamine (Qdrant, Postgres või kohandatud embeddingud)
- [RAG sõlm](../nodes/rag-node.md) – Sõlme viide
- [Workflow'de vahekaart](./workflows-tab.md) – Looge workflow'sid, mis kasutavad RAG-i
- [Kontekstuaalne showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend armatuurlaua vaadete jaoks
