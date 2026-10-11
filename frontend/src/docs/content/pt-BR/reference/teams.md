# Equipes

Teams permitem que você compartilhe workflows, credenciais, variáveis globais, vector stores e arquivos do Drive com um grupo de usuários de uma só vez.

## Visão Geral

- **Team** – Um grupo nomeado com um criador e membros
- **Criador** – Sempre um membro; pode editar o team, excluir o team e adicionar membros
- **Membro** – Pode adicionar e remover outros membros (exceto o criador); tem acesso aos recursos compartilhados com o team

## Criando e Gerenciando Teams

Crie teams a partir da [aba Teams](../tabs/teams-tab.md). Adicione membros por e-mail; eles precisam ter uma conta. O criador não pode ser removido. Excluir um team remove todos os compartilhamentos do team.

## Modelo de Compartilhamento

Os recursos podem ser compartilhados com:

1. **Usuários individuais** – Por e-mail (compartilhamento usuário para usuário)
2. **Teams** – Selecionando um team (compartilhamento de team)

Ambos os modelos são aditivos. Um usuário obtém acesso se for:

- Compartilhado diretamente (compartilhamento de usuário), ou
- Membro de um team que possui um compartilhamento de team

## O Que Pode Ser Compartilhado com Teams

| Recurso | Local do Compartilhamento |
|----------|----------------|
| Workflows | Diálogo de compartilhamento no editor de workflow |
| Workflow Templates | Diálogo de compartilhamento ao criar/editar um workflow template |
| Node Templates | Diálogo de compartilhamento ao criar/editar um node template |
| Credenciais | Diálogo de compartilhamento na aba Credentials |
| Variáveis Globais | Diálogo de compartilhamento na aba Variables |
| Vector Stores | Diálogo de compartilhamento na aba Vectors |
| Arquivos do Drive | Diálogo de compartilhamento na aba Drive ou nas operações `shareWithMyTeams` / `unshareWithMyTeams` do nó Drive |

Para templates, quando a visibilidade é **Specific users**, você também pode selecionar teams. Todos os membros dos teams selecionados obtêm acesso ao template.
Os compartilhamentos de team de arquivos do Drive são somente leitura para os membros do team; o proprietário do arquivo mantém as permissões de gerenciamento.

## Endpoints da API

- `GET /api/teams` – Lista os teams aos quais o usuário pertence
- `GET /api/teams/{id}` – Obtém os detalhes do team com os membros
- `GET /api/teams/{id}/shared-entities` – Retorna as entidades compartilhadas com o team (workflows, credenciais, variáveis globais, vector stores, arquivos, workflow templates, node templates)
- `POST /api/teams` – Cria um team
- `PATCH /api/teams/{id}` – Atualiza um team
- `DELETE /api/teams/{id}` – Exclui um team (somente o criador)
- `POST /api/teams/{id}/members` – Adiciona um membro (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Remove um membro

Compartilhamentos de team por recurso:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – o body do POST aceita `permission` (`read` ou `write`, padrão `write`); enviar um team existente novamente atualiza sua permissão
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Relacionados

- [Aba Teams](../tabs/teams-tab.md) – Crie e gerencie teams
- [Aba Templates](../tabs/templates-tab.md) – Compartilhe workflow e node templates com teams
- [Compartilhamento de Credenciais](./credentials-sharing.md) – Compartilhe credenciais com usuários e teams
- [Organização de Workflows](./workflow-organization.md) – Pastas e compartilhamento de workflows
