# Pestanya Vectorstores

La pestanya **Vectorstores** gestiona els magatzems vectorials utilitzats pels nodes [RAG](../nodes/rag-node.md). Creeu magatzems, pugeu documents i compartiu-los amb el vostre equip.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>

## Creació d'un magatzem vectorial

1. Feu clic a **New Vector Store**
2. Introduïu un nom i una descripció opcional
3. Seleccioneu una **credencial** de magatzem vectorial – *RAG: Qdrant + OpenAI* (servidor Qdrant extern), *RAG: Psql + OpenAI* (base de dades Postgres pròpia de Heym mitjançant pgvector), o *RAG: Custom Embeddings* (qualsevol endpoint d'embeddings compatible amb OpenAI, adreçat a qualsevol dels dos backends). La credencial determina el backend del magatzem.
4. Opcionalment, definiu un nom de col·lecció personalitzat (per defecte se'n genera un automàticament)
5. Deseu

> El backend d'un magatzem queda fixat per la seva credencial en el moment de la creació. En un node RAG, el desplegable **Database** filtra els magatzems segons el backend corresponent.

## Pujada de documents

- **Upload files** – Arrossegueu i deixeu anar o seleccioneu fitxers (PDF, TXT, etc.)
- **Duplicate handling** – Trieu entre sobreescriure o ometre els noms de fitxer duplicats
- **Progress** – L'avenç de la pujada es mostra durant la ingesta

## Gestió del contingut

- **View items** – Consulteu els grups d'origen i el recompte de documents per magatzem. Els fitxers pujats s'agrupen
  sota el seu nom de fitxer; els documents que un [node RAG](../nodes/rag-node.md) ha emmagatzemat sense un
  `source` propi s'agrupen sota **Added workflow: _name_**, indicant el workflow que
  els ha escrit
- **Delete sources** – Elimineu fitxers o grups d'origen concrets d'un magatzem, incloent-hi
  tot el que hi hagi afegit un workflow
- **Edit store** – Modifiqueu el nom, la descripció o la credencial

## Compartició

- Compartiu magatzems vectorials amb altres usuaris per correu electrònic
- Els magatzems compartits apareixen amb un indicador
- Revogueu la compartició des del menú de la targeta del magatzem

## Ús en workflows

En un [node RAG](../nodes/rag-node.md), seleccioneu el magatzem vectorial pel seu nom. El node recupera els fragments rellevants i augmenta el context de l'LLM amb ells.

## Relacionat

- [Credentials Tab](./credentials-tab.md) – Configuració de credencials de magatzems vectorials (Qdrant, Postgres o embeddings personalitzats)
- [RAG Node](../nodes/rag-node.md) – Referència del node
- [Workflows Tab](./workflows-tab.md) – Creeu workflows que utilitzin RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgines per a les superfícies del tauler
