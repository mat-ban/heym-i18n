# Pestaña Vectorstores

La pestaña **Vectorstores** gestiona los almacenes vectoriales utilizados por los nodos [RAG](../nodes/rag-node.md). Cree almacenes, cargue documentos y compártalos con su equipo.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Ver la demostración de Vectorstores</a></p>

## Crear un almacén vectorial

1. Haga clic en **New Vector Store**
2. Introduzca un nombre y una descripción opcional
3. Seleccione una **credencial** de almacén vectorial: *RAG: Qdrant + OpenAI* (servidor Qdrant externo), *RAG: Psql + OpenAI* (base de datos Postgres propia de Heym mediante pgvector) o *RAG: Custom Embeddings* (cualquier endpoint de embeddings compatible con OpenAI, dirigido a cualquiera de los backends). La credencial determina el backend del almacén.
4. De forma opcional, establezca un nombre de colección personalizado (por defecto se genera automáticamente)
5. Guarde

> El backend de un almacén queda fijado por su credencial en el momento de la creación. En un nodo RAG, el desplegable **Database** filtra los almacenes según el backend correspondiente.

## Cargar documentos

- **Upload files** – Arrastre y suelte o seleccione archivos (PDF, TXT, etc.)
- **Duplicate handling** – Elija sobrescribir u omitir los nombres de archivo duplicados
- **Progress** – El progreso de la carga se muestra durante la ingesta

## Gestionar el contenido

- **View items** – Consulte los grupos de origen y el recuento de documentos por almacén. Los archivos cargados se agrupan
  bajo su nombre de archivo; los documentos que un [nodo RAG](../nodes/rag-node.md) almacenó sin un
  `source` propio se agrupan bajo **Added workflow: _name_**, indicando el nombre del workflow que
  los escribió
- **Delete sources** – Elimine archivos concretos o grupos de origen de un almacén, incluido
  todo lo que haya añadido un workflow
- **Edit store** – Modifique el nombre, la descripción o la credencial
- **Buscar** – `POST /api/vector-stores/{id}/search` con una `query` (y un `limit` de 1 a 20,
  por defecto 5) devuelve los fragmentos que devolvería la búsqueda de un nodo RAG, empezando por la mejor coincidencia, cada uno con su
  puntuación y origen. La pantalla RAG de Heym Work lo utiliza para probar la recuperación

## Compartir

- Comparta almacenes vectoriales con otros usuarios por correo electrónico
- Los almacenes compartidos aparecen con un indicador
- Revoque el uso compartido desde el menú de la tarjeta del almacén

## Uso en workflows

En un [nodo RAG](../nodes/rag-node.md), seleccione el almacén vectorial por su nombre. El nodo recupera los fragmentos relevantes y aumenta el contexto del LLM con ellos.

## Relacionado

- [Pestaña Credentials](./credentials-tab.md) – Configuración de credenciales de almacenes vectoriales (Qdrant, Postgres o embeddings personalizados)
- [Nodo RAG](../nodes/rag-node.md) – Referencia del nodo
- [Pestaña Workflows](./workflows-tab.md) – Cree workflows que utilicen RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del panel
