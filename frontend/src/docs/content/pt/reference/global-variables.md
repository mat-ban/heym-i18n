# Variáveis Globais

O **Armazenamento de Variáveis Globais** mantém dados persistentes de chave-valor no escopo do usuário que sobrevivem entre execuções de workflow. Utilize-o para configuração, feature flags, contadores ou estado compartilhado que múltiplos workflows necessitam.

> **Não armazene segredos aqui.** As variáveis globais não são um cofre de segredos: os valores são armazenados sem criptografia, são retornados integralmente a qualquer pessoa com quem você os compartilhe, e os colaboradores podem editá-los. Chaves de API, senhas e tokens pertencem às [Credenciais](./credentials.md), que as criptografa em repouso e nunca retorna o segredo ao cliente.

## Local vs Global

| Armazenamento | Sintaxe | Escopo | Persistência |
|-------|--------|-------|-------------|
| **Local ao workflow** | `$vars.variableName` | Apenas a execução atual | Em memória, perdida quando a execução termina |
| **Global** | `$global.variableName` | Todos os workflows do usuário | Persistida no banco de dados |

## Criando Variáveis Globais

1. **Na aba Variáveis** – [Aba Variáveis](../tabs/global-variables-tab.md): Crie, edite e exclua variáveis diretamente.
2. **A partir de um Nó Variable** – Habilite **Store in Global Variable Store** (`isGlobal: true`) nas propriedades do nó. A variável é gravada no armazenamento quando o workflow é executado.

## Uso em Expressões

Acesse variáveis globais com `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Utilize os mesmos métodos das variáveis locais ao workflow (ex.: `.upper()`, `.length`, `.add()` para arrays).

## Tipos de Valor

Tipos suportados: `string`, `number`, `boolean`, `array`, `object`. Escolha o tipo ao criar ou editar uma variável.

## Compartilhando Variáveis Globais

Você pode compartilhar uma variável global com outros usuários ou [Equipes](./teams.md) para que possam utilizá-la em seus próprios workflows.

- **Compartilhar com usuário** – Clique no ícone de compartilhamento ao lado de uma variável própria, insira o e-mail do destinatário e clique em **Share**. O destinatário verá a variável em sua lista de Variáveis Globais com um selo **Shared** e um rótulo "Shared by &lt;seu e-mail&gt;".
- **Compartilhar com equipe** – No diálogo de compartilhamento, selecione uma equipe e clique em **Add**. Todos os membros da equipe ganham acesso.
- **Acesso editável** – Os destinatários podem visualizar, editar e referenciar a variável compartilhada via `$global.variableName` em seus workflows. Apenas o proprietário pode compartilhar, descompartilhar ou excluir a variável.
- **Conflitos de nome** – Se um destinatário já possuir uma variável com o mesmo nome, sua própria variável tem precedência sobre a compartilhada.
- **Descompartilhar** – Abra o diálogo de compartilhamento da variável e clique no botão **×** ao lado do usuário cujo acesso você deseja remover.

## Integração com o Chat

As variáveis globais estão disponíveis para o assistente de [Chat](../tabs/chat-tab.md). O LLM pode referenciá-las ao responder perguntas ou gerar conteúdo.

## Relacionados

- [Aba Variáveis](../tabs/global-variables-tab.md) – Gerencie variáveis globais na UI
- [Nó Variable](../nodes/variable-node.md) – Defina variáveis com `isGlobal`
- [Expression DSL](./expression-dsl.md) – Sintaxe `$global`