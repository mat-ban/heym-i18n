# Teams

As Teams permitem compartilhar workflows, credenciais, variáveis globais, armazenamentos vetoriais e arquivos do Drive com um grupo de usuários de uma só vez.

## Visão geral

- **Team** – Um grupo nomeado com um criador e membros
- **Criador** – É sempre um membro; pode editar a equipe, excluir a equipe e adicionar membros
- **Membro** – Pode adicionar e remover outros membros (exceto o criador); tem acesso aos recursos compartilhados com a equipe

## Criação e gerenciamento de Teams

Crie equipes a partir da [guia Teams](../tabs/teams-tab.md). Adicione membros por e-mail; eles devem ter uma conta. O criador não pode ser removido. A exclusão de uma equipe remove todos os compartilhamentos da equipe.

## Modelo de compartilhamento

Os recursos podem ser compartilhados com:

1. **Usuários individuais** – Por e-mail (compartilhamento entre usuários)
2. **Teams** – Selecionando uma equipe (compartilhamento de equipe)

Ambos os modelos são aditivos. Um usuário obtém acesso se:

- For compartilhado diretamente (compartilhamento de usuário), ou
- For membro de uma equipe que possui um compartilhamento de equipe

## O que pode ser compartilhado com Teams

| Recurso | Local do compartilhamento |
|----------|----------------|
| Workflows | Diálogo de compartilhamento no editor de workflow |
| Modelos de workflow | Diálogo de compartilhamento ao criar/editar um modelo de workflow |
| Modelos de nó | Diálogo de compartilhamento ao criar/editar um modelo de nó |
| Credenciais | Diálogo de compartilhamento na guia Credenciais |
| Variáveis globais | Diálogo de compartilhamento na guia Variáveis |
| Armazenamentos vetoriais | Diálogo de compartilhamento na guia Vetores |
| Arquivos do Drive | Diálogo de compartilhamento na guia Drive ou operações `shareWithMyTeams` / `unshareWithMyTeams` do Nó Drive |

Para modelos, quando a visibilidade for **Usuários específicos**, você também pode selecionar equipes. Todos os membros das equipes selecionadas obtêm acesso ao modelo.
Os compartilhamentos de arquivos do Drive com equipes são somente leitura para os membros da equipe; o proprietário do arquivo mantém as permissões de gerenciamento.

## Endpoints da API

- `GET /api/teams` – Lista as equipes às quais o usuário pertence
- `GET /api/teams/{id}` – Obtém os detalhes da equipe com os membros
- `GET /api/teams/{id}/shared-entities` – Retorna as entidades compartilhadas com a equipe (workflows, credenciais, variáveis globais, armazenamentos vetoriais, arquivos, modelos de workflow, modelos de nó)
- `POST /api/teams` – Cria uma equipe
- `PATCH /api/teams/{id}` – Atualiza uma equipe
- `DELETE /api/teams/{id}` – Exclui uma equipe (somente o criador)
- `POST /api/teams/{id}/members` – Adiciona um membro (corpo: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Remove um membro

Compartilhamentos de equipe por recurso:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – o corpo do POST aceita `permission` (`read` ou `write`, padrão `write`); publicar uma equipe existente novamente atualiza sua permissão
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Relacionados

- [Guia Teams](../tabs/teams-tab.md) – Crie e gerencie equipes
- [Guia Modelos](../tabs/templates-tab.md) – Compartilhe modelos de workflow e de nó com equipes
- [Compartilhamento de credenciais](./credentials-sharing.md) – Compartilhe credenciais com usuários e equipes
- [Organização de workflows](./workflow-organization.md) – Pastas e compartilhamento de workflows