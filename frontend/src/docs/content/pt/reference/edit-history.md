# Histórico

O Histórico rastreia versões salvas de um workflow. Utilize-o para visualizar alterações ao longo do tempo, comparar versões ou reverter para um estado anterior.

**Nota:** O Histórico é diferente do [Histórico de Execuções](./execution-history.md). O Histórico rastreia **salvamentos** (alterações na estrutura do workflow); o Histórico de Execuções rastreia **execuções** (execuções anteriores).

## Onde Encontrá-lo

**Barra de ferramentas do Editor** → **Histórico** (ícone GitBranch)

## Versões

Uma nova versão é criada cada vez que você **Salva** o workflow. A lista exibe:

- **Atual** – O estado salvo mais recente (o que você vê no canvas)
- **Versão N** – Salvamentos anteriores com carimbos de data e hora

Versões sem alterações em relação à anterior são ocultadas.

## Visualização de Diferenças

Selecione uma versão para ver o que mudou em relação ao workflow atual:

| Tipo de Alteração | Descrição |
|-------------|--------------|
| **Nós** | Nós adicionados, removidos ou modificados |
| **Conexões** | Conexões adicionadas, removidas ou modificadas |
| **Config** | Configurações em nível de workflow (autenticação, limites de taxa, etc.) |

Expanda cada alteração para ver as diferenças em nível de campo (por exemplo, quais propriedades do nó foram alteradas).

## Pré-visualização

Para ver como o workflow estava em uma versão anterior, clique em **Pré-visualizar** ao lado de Reverter.

Um canvas somente leitura é aberto exibindo os nós e conexões daquela versão. Você pode deslocar e ampliar para explorar o layout; nenhuma alteração pode ser feita a partir desta visualização.

## Reverter

Para restaurar uma versão anterior:

1. Selecione a versão desejada
2. Clique em **Reverter**
3. Confirme a ação
4. O workflow atual é substituído pela versão selecionada; a página é recarregada

Reverter cria um novo estado "atual" — você pode reverter novamente se necessário.

## Limpar Histórico

Clique no ícone de lixeira no cabeçalho da caixa de diálogo para remover todo o histórico de versões. Esta ação não pode ser desfeita. O workflow atual permanece; apenas as versões anteriores são excluídas.

## Quando as Versões São Criadas

As versões são criadas apenas quando você **Salva** (Ctrl/Cmd+S ou o botão Salvar). Alterações não salvas não são armazenadas no Histórico até que você salve.

Edições de habilidades de Agent são incluídas nesses snapshots. Para navegar ou restaurar uma única habilidade sem reverter o workflow inteiro, utilize o botão **Histórico** naquele cartão de habilidade no painel de propriedades do Nó Agent. Consulte [Nó Agent](../nodes/agent-node.md#skill-history).

## Relacionados

- [Histórico de Execuções](./execution-history.md) – Execuções anteriores e Bring to Canvas
- [Estrutura do Workflow](./workflow-structure.md) – Formato de nós e conexões
- [Aba Workflows](../tabs/workflows-tab.md) – Criar e gerenciar workflows