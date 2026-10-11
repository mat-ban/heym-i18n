# Tokens de Execução

Execution tokens são JWTs com escopo definido que concedem acesso aos endpoints de execução e streaming de um único workflow. Eles permitem que você chame um workflow a partir de sistemas externos sem expor seu token de sessão de usuário de longa duração.

## Por Que Usar Execution Tokens

Quando a autenticação de um workflow está definida como **JWT**, o endpoint normalmente exige uma sessão de usuário válida. Os execution tokens permitem que você:

- Compartilhe um token chamável com scripts externos, pipelines de CI ou integrações sem compartilhar as credenciais da sua conta.
- Limite a exposição — um token é válido apenas para um workflow específico.
- Revogue o acesso instantaneamente sem alterar sua senha ou rotacionar tokens de sessão.
- Escolha entre tokens de curta duração (minutos ou horas) e tokens de longa duração (até 10 anos).

## Criando um Token

Abra o diálogo **Run with cURL** no editor (barra de ferramentas no canto superior direito). Quando a autenticação do workflow está definida como **JWT Token**, o diálogo exibe um gerenciador de tokens:

1. Escolha **Short-lived** ou **Long-lived (10yr)**.
2. Para tokens de curta duração, insira a duração em segundos (mínimo de 60).
3. Clique em **+ New Token**.

O token é criado imediatamente, adicionado à lista e selecionado automaticamente, de modo que o comando cURL é atualizado para incluí-lo.

## Lista de Tokens

Cada linha de token exibe:

| Coluna | Descrição |
|--------|-------------|
| Created | Timestamp de criação |
| Status | **Expires:** data, **Expired** ou **Revoked** |
| Eye icon | Alterna a visibilidade do valor do token |
| Revoke button | Marca o token como revogado (irreversível) |

Clique em qualquer linha ativa (não expirada, não revogada) para selecioná-la. O token selecionado é incorporado à pré-visualização do comando cURL.

Tokens expirados e revogados permanecem visíveis na lista, mas não podem ser selecionados.

## Usando um Token

Copie o valor do token da lista (clique no eye icon para revelá-lo) e inclua-o como um token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Ao usar **Copy cURL** no diálogo com um token selecionado, o token já está incorporado ao comando — nenhuma substituição manual é necessária.

## Escopo do Token

Cada token carrega estas claims JWT:

| Claim | Valor |
|-------|-------|
| `sub` | ID do usuário criador do token |
| `wid` | UUID do workflow — o token é rejeitado para qualquer outro workflow |
| `scope` | `workflow:execute` — distingue-o de um token de sessão de usuário |
| `jti` | ID único do token usado para consultas de revogação |
| `exp` | Timestamp de expiração |

O backend verifica todos esses itens em cada requisição: validade da assinatura, expiração, correspondência do `wid` e se o `jti` não foi revogado.

## Revogação

Clique no botão de revogar (circle-slash) ao lado de um token para revogá-lo. A revogação entra em vigor imediatamente — requisições subsequentes usando esse token retornam `401`. A linha do token permanece visível na lista com o rótulo **Revoked**.

Não há como desfazer a revogação. Crie um novo token se precisar restaurar o acesso.

## API

Os endpoints de gerenciamento de tokens são autenticados com sua sessão regular.

| Método | Caminho | Descrição |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Cria um token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Lista seus tokens para este workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Revoga um token |

**Corpo da requisição de criação:**

```json
{ "ttl_seconds": 900 }
```

**Resposta da criação:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

O campo `token` é retornado apenas uma vez, na criação. Armazene-o imediatamente; requisições `GET` subsequentes retornam a mesma linha, mas você também pode revelá-lo no diálogo cURL a qualquer momento.

## Escopo de Visibilidade

Cada usuário vê apenas os tokens que criou. Membros da equipe com acesso a um workflow compartilhado não podem ver os tokens uns dos outros.

## Relacionados

- [Webhooks](./webhooks.md) — endpoints de trigger HTTP e o diálogo cURL
- [Security](./security.md) — visão geral de gerenciamento de sessão e autenticação
- [SSE Streaming](./sse-streaming.md) — use execution tokens com o endpoint de streaming
