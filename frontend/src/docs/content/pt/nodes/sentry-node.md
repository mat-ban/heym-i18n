# Nó Sentry

Use o nó Sentry para automatizar operações de organização, projeto, equipe, issue, evento e release do Sentry a partir de um workflow.

## Credencial

Crie uma credencial **Sentry** com um token de autenticação. Deixe a Base URL vazia para o Sentry SaaS, ou defina a URL raiz para uma instância Sentry auto-hospedada.

## Operações

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` e `createOrganization` não são expostos porque o Sentry não documenta endpoints REST públicos para eles.

## Campos Comuns

| Campo | Descrição |
| --- | --- |
| Credential | Credencial Sentry a ser utilizada |
| Operation | Ação do Sentry a ser executada |
| Organization Slug | Slug da organização Sentry para atualização de organização e operações de projeto, equipe, issue, evento e release |
| Project Slug | Slug do projeto para operações de get/update/delete de projeto e operações de evento; slug ou ID do projeto para filtros de issue |
| Team Slug | Slug da equipe para criação de projeto e operações de update/delete de equipe |
| Issue ID | ID da issue para operações de get/update/delete de issue |
| Event ID | ID do evento para operações de consulta de evento |
| Release Version | Versão da release para operações de get/update/delete de release |
| Name | Nome do projeto ou da equipe para operações de criação |
| Slug | Slug opcional do projeto ou da equipe para operações de criação |
| Platform | Plataforma Sentry opcional para criação de projeto |
| Status / Assigned To | Campos de atualização de issue. Ao menos um é obrigatório para `updateIssue` |
| Query | Consulta de busca do Sentry. Omita-a para issues não resolvidas, ou defina-a como uma string vazia para buscar todas as issues |
| Limit | Limite de resultados para operações de listagem, limitado a 1.000 resultados no total |
| Release Projects JSON | Array JSON de slugs de projetos para criação de release |
| Release Refs JSON | Array JSON de objetos de repositório/commit para criação de release |
| Payload JSON | Objeto JSON para operações de atualização de organização, projeto, release e equipe |

## Exemplos

Listar issues não resolvidas:

```json
{
  "sentryOperation": "listIssues",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryQuery": "is:unresolved level:error",
  "sentryStatsPeriod": "14d",
  "sentryLimit": "25"
}
```

Resolver uma issue:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Excluir uma issue:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Criar uma release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Atualizar um projeto:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Saídas

As operações de listagem retornam `success`, `operation`, `count` e a coleção relevante, como `organizations`, `projects`, `teams`, `issues`, `events` ou `releases`. As operações de recurso único retornam `organization`, `issue`, `event`, `release`, `project` ou `team`. As operações de exclusão retornam a chave do recurso relevante com `deleted: true` e os campos identificadores.