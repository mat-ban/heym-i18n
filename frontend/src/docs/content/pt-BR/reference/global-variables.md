# Variáveis Globais

O **Global Variable Store** armazena dados persistentes de chave-valor com escopo de usuário que sobrevivem entre execuções de workflow. Utilize-o para configurações, feature flags, contadores ou estado compartilhado que múltiplos workflows precisam acessar.

> **Não armazene segredos aqui.** Variáveis globais não são um cofre de segredos: os valores são armazenados sem criptografia, são retornados integralmente a qualquer pessoa com quem você os compartilhar, e colaboradores podem editá-los. API keys, senhas e tokens pertencem às [Credentials](./credentials.md), que as criptografa em repouso e nunca retorna o segredo ao cliente.

## Local vs Global

| Store | Sintaxe | Escopo | Persistência |
|-------|--------|-------|-------------|
| **Workflow-local** | `$vars.variableName` | Apenas a execução atual | Em memória, perdida quando a execução termina |
| **Global** | `$global.variableName` | Todos os workflows do usuário | Persistida no banco de dados |

## Criando Variáveis Globais

1. **Na aba Variables** – [Variables Tab](../tabs/global-variables-tab.md): Crie, edite e exclua variáveis diretamente.
2. **A partir de um nó Variable** – Habilite **Store in Global Variable Store** (`isGlobal: true`) nas propriedades do nó. A variável é gravada no store quando o workflow é executado.

## Uso em Expressões

Acesse variáveis globais com `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Utilize os mesmos métodos das variáveis workflow-local (por exemplo, `.upper()`, `.length`, `.add()` para arrays).

## Tipos de Valor

Tipos suportados: `string`, `number`, `boolean`, `array`, `object`. Escolha o tipo ao criar ou editar uma variável.

## Compartilhando Variáveis Globais

Você pode compartilhar uma variável global com outros usuários ou [Teams](./teams.md) para que eles possam utilizá-la em seus próprios workflows.

- **Compartilhar com usuário** – Clique no ícone de compartilhamento ao lado de uma variável própria, insira o e-mail do destinatário e clique em **Share**. O destinatário verá a variável em sua lista de Global Variables com um selo **Shared** e um rótulo "Shared by &lt;seu e-mail&gt;".
- **Compartilhar com team** – No diálogo de compartilhamento, selecione um team e clique em **Add**. Todos os membros do team ganham acesso.
- **Acesso editável** – Os destinatários podem visualizar, editar e referenciar a variável compartilhada via `$global.variableName` em seus workflows. Apenas o proprietário pode compartilhar, descompartilhar ou excluir a variável.
- **Conflitos de nome** – Se um destinatário já possui uma variável com o mesmo nome, sua própria variável tem precedência sobre a compartilhada.
- **Descompartilhar** – Abra o diálogo de compartilhamento da variável e clique no botão **×** ao lado do usuário cujo acesso você deseja remover.

## Integração com o Chat

As variáveis globais estão disponíveis para o assistente de [Chat](../tabs/chat-tab.md). O LLM pode referenciá-las ao responder perguntas ou gerar conteúdo.

## Relacionados

- [Variables Tab](../tabs/global-variables-tab.md) – Gerencie variáveis globais na UI
- [Variable Node](../nodes/variable-node.md) – Defina variáveis com `isGlobal`
- [Expression DSL](./expression-dsl.md) – Sintaxe `$global`
