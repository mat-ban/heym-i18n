# Vektoru krātuves cilne

**Vektoru krātuves** cilne pārvalda vektoru krātuves, ko izmanto [RAG](../nodes/rag-node.md) mezgli. Izveidojiet krātuves, augšupielādējiet dokumentus un dalieties ar tiem ar savu komandu.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Skatīt Vektoru krātuves demonstrāciju</a></p>

## Vektoru krātuves izveide

1. Noklikšķiniet uz **Jauna vektoru krātuve**
2. Ievadiet nosaukumu un opciju aprakstu
3. Izvēlieties vektoru krātuves **akreditācijas datus** – *RAG: Qdrant + OpenAI* (ārējais Qdrant serveris), *RAG: Psql + OpenAI* (Heym paša Postgres datubāze, izmantojot pgvector) vai *RAG: Pielāgotas iekļaušanas* (jebkura OpenAI saderīga iekļaušanas galapunkts, mērķējot uz jebkuru aizmuguri). Akreditācijas dati nosaka krātuves aizmuguri.
4. Pēc izvēles iestatiet pielāgotu kolekcijas nosaukumu (noklusējuma iestatījums ir automātiski ģenerēts)
5. Saglabājiet

> Krātuves aizmugure tiek noteikta ar tās akreditācijas datiem izveides laikā. RAG mezglā **Datubāzes** nolaižamajā sarakstā tiek filtrētas krātuves, kas atbilst atbilstošajai aizmugurei.

## Dokumentu augšupielāde

- **Augšupielādēt failus** – Velciet un nometiet vai izvēlieties failus (PDF, TXT utt.)
- **Dublikātu apstrāde** – Izvēlieties, vai pārrakstīt vai izlaist dublikātu failu nosaukumus
- **Progres** – Augšupielādes progress tiek rādīts laikā, kad notiek ievade

## Satura pārvaldība

- **Skatīt vienumus** – Redziet avota grupas un dokumentu skaitu katrā krātuvē. Augšupielādētie faili tiek grupēti pēc to nosaukuma; dokumenti, ko [RAG mezgls](../nodes/rag-node.md) ir saglabājis bez sava `source`, tiek grupēti zem **Pievienotā darba plūsma: _nosaukums_**, nosaucot darba plūsmu, kas tos rakstījusi
- **Dzēst avotus** – Noņemiet konkrētus failus vai avota grupas no krātuves, tostarp visu, ko pievienojusi viena darba plūsma
- **Rediģēt krātuvi** – Mainiet nosaukumu, aprakstu vai akreditācijas datus
- **Meklēšana** – `POST /api/vector-stores/{id}/search` ar `query` (un `limit` no 1 līdz 20, noklusējums 5) atgriež fragmentus (chunks), ko atgrieztu RAG mezgla meklēšana, vispirms labāko atbilstību, katru ar tā rezultātu un avotu. Heym Work RAG ekrāns to izmanto izgūšanas testēšanai

## Dalīšanās

- Dalieties ar vektoru krātuvēm ar citiem lietotājiem pa e-pastu
- Kopīgās krātuves parādās ar indikatoru
- Atcelt dalīšanos no krātuves kartes izvēlnes

## Izmantošana darba plūsmās

[RAG mezglā](../nodes/rag-node.md) izvēlieties vektoru krātuvi pēc nosaukuma. Mezgls iegūst attiecīgās daļas un papildina LLM kontekstu ar tām.

## Saistītie

- [Akreditācijas datu cilne](./credentials-tab.md) – Vektoru krātuves akreditācijas datu iestatīšana (Qdrant, Postgres vai pielāgotas iekļaušanas)
- [RAG mezgls](../nodes/rag-node.md) – Mezglu atsauce
- [Darba plūsmu cilne](./workflows-tab.md) – Izveidojiet darba plūsmas, kas izmanto RAG
- [Kontekstuālais demonstrējums](../reference/contextual-showcase.md) – Kompakta lapas rokasgrāmata informācijas paneļa virsmām
