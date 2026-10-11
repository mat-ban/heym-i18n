# Registro de Auditoria

O Heym grava uma linha de auditoria para cada ação relevante para a segurança: quem a executou, sobre o que ela foi executada e se teve êxito. As linhas são enviadas para a saída padrão do backend por meio do logger `winston.audit`, juntamente com o log de acesso às requisições, e podem ser lidas na aba **Logs** ou com `docker logs`.

O registro de auditoria está **sempre ativo**. Não há nada a habilitar nem variável de ambiente a definir.

## Formato da Linha

Uma ação produz exatamente uma linha autocontida:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Cada linha carrega os seguintes campos:

| Campo | Descrição |
|-------|-------------|
| `action` | O que aconteceu, no formato `resource.verb` — consulte a tabela abaixo. |
| `outcome` | `success`, `failure` ou `denied`. |
| `actor_id` | UUID do usuário que executou a ação. Ausente apenas quando ninguém estava autenticado. |
| `actor_email` | Email desse usuário. Em um login malsucedido, este é o endereço tentado, não uma conta confirmada. |
| `target` | O objeto sobre o qual se agiu, no formato `type:uuid`. |
| `target_name` | Nome legível desse objeto, entre aspas quando contém espaços. |

Seguem-se campos específicos da ação — por exemplo `credential_type`, `imported`, `grantee_email`, `team_name`. Valores que contenham espaço, aspas ou `=` são colocados entre aspas; valores com mais de 256 caracteres são truncados com um marcador `...(truncated)`.

## Leitura do Log

O logger de auditoria é filho do logger de requisições, portanto ambos chegam ao mesmo stream, permanecendo separáveis:

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

No aplicativo, a aba **Logs** lê a mesma saída do contêiner. Ela é controlada por `DOCKER_LOGS_ENABLED` e pela allowlist `DOCKER_LOGS_ALLOWED_EMAILS`.

## O Que É Registrado

Toda mudança de estado é registrada. As leituras são registradas apenas quando a própria leitura é o ato sensível — visualizar o histórico de execuções de um workflow, abrir uma credencial, baixar um arquivo. Leituras comuns de listagem e de detalhe não são auditadas; o log de acesso já registra que uma requisição ocorreu, e auditar cada `GET` sepultaria as linhas que importam.

### Autenticação

| Ação | Observações |
|--------|-------|
| `auth.register` | `outcome=denied` quando o registro está desabilitado ou quando o login por senha está desligado (`reason=password_login_disabled`), `failure` quando o email já está em uso. |
| `auth.login` | `outcome=failure` registra o endereço tentado e se o email era desconhecido ou a senha estava errada. |
| `auth.logout` | O autor é resolvido a partir do cookie de refresh, portanto um logout sem ele é registrado sem identidade. |
| `auth.token_refresh` | `outcome=denied` com `reason=refresh_token_replayed_or_revoked` — um sinal de roubo de token que merece alerta. |
| `auth.password_change` | `outcome=failure` quando a senha atual estava errada. |
| `auth.sso_login` | Login único. `outcome=failure` carrega o motivo pelo qual a resposta do provedor foi rejeitada; `denied` carrega `email_not_verified`, `domain_not_allowed` ou `provisioning_disabled`. |
| `sso_settings.update` | Um administrador alterou a configuração de [SSO](./sso.md). Registra `enabled` e `password_login_disabled`, nunca o client secret. |
| `sso_settings.test` | Um administrador executou o teste de conexão SSO. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` registra `owned=false` quando um colaborador lê o histórico de execuções de outra pessoa. `workflow.delete` registra `outcome=denied` com `reason=not_owner` quando um colaborador tenta excluir.

### Credenciais

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` é auditada porque abrir uma credencial a descriptografa. Uma tentativa malsucedida registra `outcome=denied`, que é exatamente o aspecto de uma tentativa de enumeração de credential-id.
### Outros recursos

| Recurso | Ações |
|----------|---------|
| Variáveis | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Armazenamentos vetoriais | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alertas | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Tabelas de dados | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Equipes | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Pastas | `folder.create` · `update` · `delete` · `workflow_move` |

As operações em massa são registradas uma vez por requisição, com uma contagem, e não uma vez por linha. Uma importação de CSV com 5.000 linhas produz uma única linha `data_table.import_csv`, contendo `imported`, `rejected` e `total`.

## Segredos Nunca São Registrados

Uma linha de auditoria registra identificadores, nomes e contagens. Ela nunca registra o conteúdo de uma credencial, o valor de uma variável, uma senha ou um token.

Dois mecanismos garantem isso. Os pontos de chamada são escritos para passar apenas campos seguros, e o helper de auditoria aplica redação como salvaguarda: qualquer campo cujo nome contenha `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` ou similares é substituído por `***` antes que a linha seja construída. A redação excessiva é intencional — uma linha pouco útil é melhor do que uma credencial vazada.

Quando um segredo é genuinamente relevante para o registro, apenas a sua forma é registrada. Um compartilhamento de arquivo registra `password_protected=true`, nunca a senha.

## Retenção

**As linhas de auditoria existem apenas enquanto durar a saída de log do contêiner.** Elas não são gravadas no banco de dados. Recriar o contêiner de backend descarta os seus logs.

Caso você precise de um histórico de auditoria que sobreviva a um redeploy, envie o stdout do contêiner para algum destino durável — um log driver, um coletor sidecar ou a agregação de logs da sua plataforma — da mesma forma que você faria para qualquer outro log de contêiner.

## Para Contribuidores

Emitir uma linha de auditoria exige uma única chamada:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

O helper é síncrono, não acessa nenhum banco de dados e suprime os seus próprios erros, de modo que uma chamada de auditoria não pode falhar nem tornar uma requisição mais lenta.

Três regras ao adicionar uma:

1. **Nomeie a ação como `resource.verb` em snake_case.** O arquivo `backend/tests/test_audit_log.py` percorre todas as chamadas `audit()` sob `app/api/` e faz o build falhar diante de um nome que não corresponda ao padrão, bem como diante de um recurso coberto que tenha perdido todos os seus pontos de chamada.

2. **Leia apenas atributos que estejam certamente presentes.** O `try/except` do helper protege o seu próprio corpo, não as expressões que você passa para ele — um `AttributeError` em `target_name=workflow.name` é lançado no ponto de chamada, antes de `audit()` ser executado, e quebrará a requisição. Leia colunas ORM e variáveis locais, não atributos opcionais ou carregados de forma lazy.

3. **Registre a exclusão antes de excluir.** Após `db.delete(row)`, o nome e o id que você deseja registrar podem já não existir. Posicione a chamada acima dessa linha.
