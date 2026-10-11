# Separador Teams

O separador **Teams** permite criar e gerir equipas para partilhar workflows, credenciais, variáveis, armazenamentos vetoriais e ficheiros do Drive com grupos de utilizadores.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Ver demonstração do Teams</a></p>

## Criar uma Equipa

1. Clique em **Nova Equipa**
2. Introduza um nome e uma descrição opcional
3. Clique em **Criar**

Torna-se automaticamente o criador da equipa e o primeiro membro.

## Gerir Membros

- **Adicionar membro** – Introduza o email de um utilizador na caixa de diálogo de detalhes da equipa e clique em **Adicionar**
- **Remover membro** – Clique no X junto a um membro (o criador não pode ser removido)
- **Editar equipa** – Os criadores podem editar o nome e a descrição
- **Eliminar equipa** – Os criadores podem eliminar a equipa; todas as partilhas da equipa são removidas
- **Recursos partilhados** – A caixa de diálogo de detalhes da equipa apresenta workflows, credenciais, variáveis, armazenamentos vetoriais, ficheiros do Drive, modelos de workflow e modelos de nó partilhados com a equipa. Clique num workflow para o abrir no editor; mude para o separador relevante para os restantes recursos.

## Partilhar com Equipas

Partilhe recursos com equipas a partir de:

- **Workflows** – Caixa de diálogo de partilha no editor de workflows
- **Modelos de Workflow** – Caixa de diálogo de partilha ao criar/editar um modelo de workflow (visibilidade: Utilizadores específicos)
- **Modelos de Nó** – Caixa de diálogo de partilha ao criar/editar um modelo de nó (visibilidade: Utilizadores específicos)
- **Credenciais** – Caixa de diálogo de partilha no separador Credenciais
- **Variáveis** – Caixa de diálogo de partilha no separador Variáveis
- **Armazenamentos Vetoriais** – Caixa de diálogo de partilha no separador Vectors
- **Dashboards** – Definições do dashboard no separador Dashboard (leitura ou escrita)
- **Ficheiros do Drive** – Caixa de diálogo de partilha no separador Drive ou operações `shareWithMyTeams` / `unshareWithMyTeams` do nó Drive

Ao partilhar com uma equipa, todos os membros da equipa obtêm acesso. Consulte [Teams](../reference/teams.md) para obter detalhes.

Ao partilhar um workflow com uma equipa, partilhe também as credenciais e os sub-workflows dos quais esse workflow depende com a mesma equipa. O acesso ao workflow por si só não concede acesso às credenciais nem aos workflows subordinados.

## Integração com o Chat

O assistente de IA do [separador Chat](./chat-tab.md) pode listar as suas equipas. Pergunte "as minhas equipas" para ver a que equipas pertence.

## Relacionado

- [Teams](../reference/teams.md) – Referência de Teams e modelo de partilha
- [Partilha de Credenciais](../reference/credentials-sharing.md) – Partilhar credenciais com utilizadores e equipas
- [Organização de Workflows](../reference/workflow-organization.md) – Pastas e partilha
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de página para superfícies de dashboard
