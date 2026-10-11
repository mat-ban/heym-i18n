# Separador Armazenamentos vetoriais

O separador **Armazenamentos vetoriais** gere os armazenamentos vetoriais utilizados pelos nós [RAG](../nodes/rag-node.md). Crie armazenamentos, carregue documentos e partilhe-os com a sua equipa.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Ver demonstração dos Armazenamentos vetoriais</a></p>

## Criar um Armazenamento vetorial

1. Clique em **Novo Armazenamento vetorial**
2. Introduza um nome e uma descrição opcional
3. Selecione uma **credencial** de armazenamento vetorial – *RAG: Qdrant + OpenAI* (servidor Qdrant externo), *RAG: Psql + OpenAI* (base de dados Postgres do próprio Heym via pgvector) ou *RAG: Custom Embeddings* (qualquer endpoint de embeddings compatível com OpenAI, direcionado a qualquer um dos backends). A credencial determina o backend do armazenamento.
4. Opcionalmente, defina um nome de coleção personalizado (por predefinição, é gerado automaticamente)
5. Guarde

> O backend de um armazenamento é fixado pela sua credencial no momento da criação. Num nó RAG, a lista pendente **Database** filtra os armazenamentos pelo backend correspondente.

## Carregar documentos

- **Carregar ficheiros** – Arraste e largue ou selecione ficheiros (PDF, TXT, etc.)
- **Tratamento de duplicados** – Escolha substituir ou ignorar nomes de ficheiro duplicados
- **Progresso** – O progresso do carregamento é apresentado durante a ingestão

## Gerir conteúdo

- **Ver itens** – Consulte os grupos de origem e as contagens de documentos por armazenamento. Os ficheiros carregados agrupam-se
  sob o respetivo nome de ficheiro; os documentos que um [nó RAG](../nodes/rag-node.md) armazenou sem uma
  `source` própria agrupam-se sob **Added workflow: _name_**, indicando o workflow que
  os escreveu
- **Eliminar origens** – Remova ficheiros específicos ou grupos de origem de um armazenamento, incluindo
  tudo o que um workflow adicionou
- **Editar armazenamento** – Altere o nome, a descrição ou a credencial

## Partilha

- Partilhe armazenamentos vetoriais com outros utilizadores por email
- Os armazenamentos partilhados aparecem com um indicador
- Revogue a partilha a partir do menu do cartão do armazenamento

## Utilização em Workflows

Num [nó RAG](../nodes/rag-node.md), selecione o armazenamento vetorial pelo nome. O nó obtém os fragmentos relevantes e aumenta o contexto do LLM com eles.

## Relacionado

- [Separador Credenciais](./credentials-tab.md) – Configuração de credenciais de armazenamento vetorial (Qdrant, Postgres ou embeddings personalizados)
- [Nó RAG](../nodes/rag-node.md) – Referência do nó
- [Separador Workflows](./workflows-tab.md) – Crie workflows que utilizam RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto das páginas do dashboard
