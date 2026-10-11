# Aba Vectorstores

A aba **Vectorstores** gerencia os vector stores utilizados por nós [RAG](../nodes/rag-node.md). Crie stores, faça upload de documentos e compartilhe-os com sua equipe.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Assista à demonstração de Vectorstores</a></p>

## Criando um Vector Store

1. Clique em **New Vector Store**
2. Insira um nome e uma descrição opcional
3. Selecione uma **credential** de vector store – *RAG: Qdrant + OpenAI* (servidor Qdrant externo), *RAG: Psql + OpenAI* (banco de dados Postgres do próprio Heym via pgvector) ou *RAG: Custom Embeddings* (qualquer endpoint de embeddings compatível com OpenAI, direcionado a qualquer um dos backends). A credential determina o backend do store.
4. Opcionalmente, defina um nome de coleção personalizado (o padrão é gerado automaticamente)
5. Salve

> O backend de um store é fixado pela sua credential no momento da criação. Em um nó RAG, o dropdown **Database** filtra os stores para o backend correspondente.

## Fazendo Upload de Documentos

- **Upload de arquivos** – Arraste e solte ou selecione arquivos (PDF, TXT, etc.)
- **Tratamento de duplicatas** – Escolha sobrescrever ou ignorar nomes de arquivo duplicados
- **Progresso** – O progresso do upload é exibido durante a ingestão

## Gerenciando Conteúdo

- **Visualizar itens** – Veja grupos de origem e contagens de documentos por store. Arquivos enviados são agrupados
  sob seu nome de arquivo; documentos que um [nó RAG](../nodes/rag-node.md) armazenou sem um
  `source` próprio são agrupados sob **Added workflow: _name_**, nomeando o workflow que
  os gravou
- **Excluir origens** – Remova arquivos específicos ou grupos de origem de um store, incluindo
  tudo o que um workflow adicionou
- **Editar store** – Altere nome, descrição ou credential

## Compartilhamento

- Compartilhe vector stores com outros usuários por e-mail
- Stores compartilhados aparecem com um indicador
- Revogue o compartilhamento pelo menu do card do store

## Usando em Workflows

Em um [nó RAG](../nodes/rag-node.md), selecione o vector store pelo nome. O nó recupera os chunks relevantes e aumenta o contexto do LLM com eles.

## Relacionados

- [Aba Credentials](./credentials-tab.md) – Configuração de credential de vector store (Qdrant, Postgres ou embeddings personalizados)
- [Nó RAG](../nodes/rag-node.md) – Referência do nó
- [Aba Workflows](./workflows-tab.md) – Crie workflows que usam RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard
