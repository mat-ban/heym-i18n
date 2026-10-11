# Zavihek Vektorske Shrambe

Zavihek **Vektorske Shrambe** upravlja vektorske shrambe, ki jih uporabljajo [RAG](../nodes/rag-node.md) vozlišča. Ustvarite shrambe, naložite dokumente in jih delite s svojo ekipo.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Oglejte si predstavitev Vektorskih Shranb</a></p>

## Ustvarjanje Vektorske Shrambe

1. Kliknite **Nova Vektorska Shramba**
2. Vnesite ime in neobvezni opis
3. Izberite **poverenje** za vektorsko shrambo – *RAG: Qdrant + OpenAI* (zunanji Qdrant strežnik), *RAG: Psql + OpenAI* (Heymova lastna Postgres baza prek pgvector) ali *RAG: Prilagojeni Vektorski Vektorji* (katerikoli OpenAI-ustrezen vektorski endpoint, ki cilja na katerikoli backend). Poverilnica določa backend shrambe.
4. Po želji nastavite prilagojeno ime zbirke (privzeto se samodejno generira)
5. Shranite

> Backend shrambe je določen s poverilnico ob času ustvarjanja. V RAG vozlišču dropdown **Baza** filtrira shrambe glede na ustrezen backend.

## Nalaganje Dokumentov

- **Naložite datoteke** – Povlecite in spustite ali izberite datoteke (PDF, TXT itd.)
- **Obravnava podvojenih** – Izberite, ali želite prepisati ali preskočiti podvojena imena datotek
- **Napredek** – Napredek nalaganja je prikazan med obdelavo

## Upravljanje Vsebine

- **Ogled predmetov** – Oglejte si skupine virov in število dokumentov na shrambo. Naložene datoteke se skupijo pod svojim imenom; dokumenti, ki jih je [RAG vozlišče](../nodes/rag-node.md) shranilo brez lastnega `source`, se skupijo pod **Dodano delovno pot: _ime_**, pri čemer se imenuje delovni postopek, ki jih je zapisal
- **Izbriši vire** – Odstranite specifične datoteke ali skupine virov iz shrambe, vključno z vsemi, ki jih je dodal en delovni postopek
- **Uredi shrambo** – Spremenite ime, opis ali poverilnico

## Deljenje

- Delite vektorske shrambe z drugimi uporabniki po elektronski pošti
- Deljene shrambe se prikažejo z indikatorjem
- Prekličite deljenje iz menija kartice shrambe

## Uporaba v Workflows

V [RAG vozlišču](../nodes/rag-node.md) izberite vektorsko shrambo po imenu. Vozlišče pridobi ustrezne dele in obogati kontekst LLM z njimi.

## Sorodno

- [Zavihek Poverilnice](./credentials-tab.md) – Nastavitev poverilnic za vektorsko shrambo (Qdrant, Postgres ali prilagojeni vektorski vektorji)
- [RAG Vozlišče](../nodes/rag-node.md) – Referenca vozlišča
- [Zavihek Workflows](./workflows-tab.md) – Ustvarite workflows, ki uporabljajo RAG
- [Kontekstualna Predstavitev](../reference/contextual-showcase.md) – Kompaktni vodnik po straneh nadzorne plošče
