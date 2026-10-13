# Vektorių saugyklos skirtukas

**Vektorių saugyklos** skirtukas valdo vektorių saugyklas, naudojamas [RAG](../nodes/rag-node.md) mazguose. Kurkite saugyklas, įkelkite dokumentus ir dalinkitės jais su savo komanda.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Žiūrėti Vektorių saugyklų demonstraciją</a></p>

## Vektorių saugyklos kūrimas

1. Paspauskite **Nauja vektorių saugykla**
2. Įveskite pavadinimą ir pasirenkamą aprašymą
3. Pasirinkite vektorių saugyklos **kredencialą** – *RAG: Qdrant + OpenAI* (išorinis Qdrant serveris), *RAG: Psql + OpenAI* (Heym nuosavas Postgres duomenų bazė per pgvector) arba *RAG: Custom Embeddings* (bet koks OpenAI suderinamas embedding endpoint, orientuotas į bet kurį backend). Kredencialas nustato saugyklos backend.
4. Pasirinktinai nustatykite pasirinktą kolekcijos pavadinimą (pagal nutylėjimą automatiškai sugeneruojamas)
5. Išsaugokite

> Saugyklos backend yra fiksuotas pagal jos kredencialą sukūrimo metu. RAG mazge **Duomenų bazės** išskleidžiamasis meniu filtruoja saugyklas pagal atitinkamą backend.

## Dokumentų įkėlimas

- **Įkelti failus** – Vilkite ir mesti arba pasirinkite failus (PDF, TXT ir kt.)
- **Dublikato tvarkymas** – Pasirinkite, ar perrašyti, ar praleisti dublikuojančius failų pavadinimus
- **Progresas** – Įkėlimo progresas rodomas per įkėlimo procesą

## Turinys valdymas

- **Peržiūrėti elementus** – Matykite šaltinio grupes ir dokumentų skaičių kiekvienoje saugykloje. Įkelti failai grupuojami pagal jų failo pavadinimą; dokumentai, kuriuos [RAG mazgas](../nodes/rag-node.md) saugojo be savo `source`, grupuojami po **Pridėtas workflow: _pavadinimas_**, nurodant workflow, kuris juos sukūrė
- **Ištrinti šaltinius** – Pašalinkite konkrečius failus arba šaltinio grupes iš saugyklos, įskaitant viską, ką pridėjo viena workflow
- **Redaguoti saugyklą** – Keiskite pavadinimą, aprašymą arba kredencialą
- **Paieška** – `POST /api/vector-stores/{id}/search` su `query` (ir `limit` nuo 1 iki 20, numatytasis 5) grąžina fragmentus (chunks), kuriuos grąžintų RAG mazgo paieška, pirmiausia geriausią atitikmenį, kiekvieną su jo balu ir šaltiniu. „Heym Work" RAG ekranas jį naudoja išgavimui testuoti

## Dalinimasis

- Dalinkitės vektorių saugyklomis su kitais vartotojais el. paštu
- Bendrinamos saugyklos pasirodo su indikatoriumi
- Atšaukite dalinimąsi iš saugyklos kortelės meniu

## Naudojimas Workflows

[ RAG mazge](../nodes/rag-node.md) pasirinkite vektorių saugyklą pagal pavadinimą. Mazgas gauna atitinkamus fragmentus ir papildomai praturtina LLM kontekstą su jais.

## Susiję

- [Kredencialų skirtukas](./credentials-tab.md) – Vektorių saugyklos kredencialų nustatymas (Qdrant, Postgres arba pasirinktinių embedding)
- [RAG mazgas](../nodes/rag-node.md) – Mazgo nuoroda
- [Workflows skirtukas](./workflows-tab.md) – Kurkite workflows, kurios naudoja RAG
- [Kontekstinis demonstravimas](../reference/contextual-showcase.md) – Kompaktiška puslapio gairė valdymo skydeliui
