# Aba Teams

A aba **Teams** permite criar e gerenciar equipes para compartilhar workflows, credenciais, variáveis, vector stores e arquivos do Drive com grupos de usuários.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Assista à demonstração do Teams</a></p>

## Criando uma Equipe

1. Clique em **New Team**
2. Insira um nome e uma descrição opcional
3. Clique em **Create**

Você se torna o criador da equipe e o primeiro membro automaticamente.

## Gerenciando Membros

- **Adicionar membro** – Insira o e-mail de um usuário na caixa de diálogo de detalhes da equipe e clique em **Add**
- **Remover membro** – Clique no X ao lado de um membro (o criador não pode ser removido)
- **Editar equipe** – Os criadores podem editar o nome e a descrição
- **Excluir equipe** – Os criadores podem excluir a equipe; todos os compartilhamentos da equipe são removidos
- **Recursos compartilhados** – A caixa de diálogo de detalhes da equipe exibe workflows, credenciais, variáveis, vector stores, arquivos do Drive, workflow templates e node templates compartilhados com a equipe. Clique em um workflow para abri-lo no editor; alterne para a aba relevante para outros recursos.

## Compartilhando com Equipes

Compartilhe recursos com equipes a partir de:

- **Workflows** – Caixa de diálogo de compartilhamento no editor de workflow
- **Workflow Templates** – Caixa de diálogo de compartilhamento ao criar/editar um workflow template (visibilidade: Specific users)
- **Node Templates** – Caixa de diálogo de compartilhamento ao criar/editar um node template (visibilidade: Specific users)
- **Credenciais** – Caixa de diálogo de compartilhamento na aba Credentials
- **Variáveis** – Caixa de diálogo de compartilhamento na aba Variables
- **Vector Stores** – Caixa de diálogo de compartilhamento na aba Vectors
- **Dashboards** – Configurações do dashboard na aba Dashboard (leitura ou escrita)
- **Arquivos do Drive** – Caixa de diálogo de compartilhamento na aba Drive ou operações `shareWithMyTeams` / `unshareWithMyTeams` do Nó Drive

Ao compartilhar com uma equipe, todos os membros da equipe ganham acesso. Consulte [Teams](../reference/teams.md) para obter detalhes.

Ao compartilhar um workflow com uma equipe, compartilhe também as credenciais e os sub-workflows dos quais esse workflow depende com a mesma equipe. O acesso apenas ao workflow não concede acesso a credenciais ou workflows filhos.

## Integração com o Chat

O assistente de IA da [aba Chat](./chat-tab.md) pode listar suas equipes. Pergunte "my teams" para ver a quais equipes você pertence.

## Relacionados

- [Teams](../reference/teams.md) – Referência de Teams e modelo de compartilhamento
- [Credentials Sharing](../reference/credentials-sharing.md) – Compartilhe credenciais com usuários e equipes
- [Workflow Organization](../reference/workflow-organization.md) – Pastas e compartilhamento
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard
