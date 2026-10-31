# Assistente de IA

O **Assistente de IA** é um painel de chat que abre a partir do painel de Depuração e inicia no canto inferior direito do editor. Arraste o cabeçalho para movê-lo e arraste uma borda ou um canto para alterar a sua largura ou altura. Ele não encolhe abaixo de 360×480 pixels. A posição e o tamanho são memorizados neste navegador. A opção **Redefinir posição e tamanho** no cabeçalho repõe o painel no canto inferior direito. Utilize linguagem natural para criar ou modificar workflows — descreva o que pretende e a IA gera nós e arestas que são aplicados ao canvas.

Para questões de documentação fora do editor, utilize [Chat com o Heym](./chat-with-heym.md). Essa superfície está otimizada para ajuda de produto com reconhecimento de página, em vez de geração de workflows.

## Abrir o Painel

1. Abra um workflow no editor
2. Localize o **painel de Depuração** na parte inferior (área de resultados de execução)
3. Clique no botão **IA** (ícone Sparkles) na barra de ferramentas do painel
4. O painel do Assistente de IA abre no canto inferior direito. Arraste o seu cabeçalho para o mover, ou arraste uma borda ou um canto para alterar a sua largura e altura.

Prima `Ctrl + I` / `Cmd + I` em qualquer parte do editor para abrir ou fechar o painel — o atalho funciona mesmo quando um campo de texto está em foco. Consulte [Atalhos de Teclado](./keyboard-shortcuts.md).

Para trabalhar num único nó, passe o cursor sobre ele na tela e clique em **AI** acima dele. O painel abre focado nesse nó. Consulte [Modificar um único nó](#changing-one-node).

## Fechar o Painel

Clique no botão **X**, prima `Ctrl + I` / `Cmd + I`, ou alterne o botão **IA** na barra de ferramentas do painel de Depuração. O cabeçalho arrasta o painel; não o fecha.

## Configuração

Antes de enviar mensagens, selecione:

| Definição | Descrição |
|---------|-------------|
| **Credencial** | Credencial de LLM (chave de API) a partir de [Credenciais](../tabs/credentials-tab.md) |
| **Modelo** | Nome do modelo (ex.: `gpt-4o`, `gemini-2.5-flash`) |

Adicione credenciais no [Separador de Credenciais](../tabs/credentials-tab.md). A lista de modelos é carregada a partir da credencial selecionada.

## Modo Agent vs Modo Ask

O painel tem dois modos, alternados com o chip **Agent / Ask** no cabeçalho do painel.

| Modo | Predefinição | Comportamento |
|------|---------|-----------|
| **Agent** | ✓ | Constrói e modifica o canvas. A IA gera um bloco JSON de workflow que é aplicado automaticamente ao canvas quando a resposta está concluída. |
| **Ask** | | Responde apenas a perguntas. O canvas nunca é alterado. Utilize este modo para perguntar sobre o seu workflow, funcionalidades do Heym, ou obter conselhos sem desencadear uma atualização do canvas. |

Alterne entre modos em qualquer momento. Mudar de modo não limpa a conversa.

No modo Agent, a caixa **Modo YOLO** sob o campo de mensagem faz com que o assistente execute e corrija o que constrói. Consulte [Modo YOLO](#yolo-mode).

## Utilizar o Chat

- Escreva o seu pedido no campo de entrada (ex.: "Crie um workflow que recebe a entrada do utilizador e a envia para um LLM")
- Prima **Enter** para enviar (Shift+Enter para nova linha)
- A IA transmite a sua resposta em streaming. No modo **Agent**, se a resposta incluir um workflow num bloco de código \`\`\`json, este é automaticamente analisado e aplicado ao canvas. No modo **Ask** o canvas nunca é modificado.
- Utilize **Limpar** para reiniciar a conversa
- Passe o cursor sobre uma mensagem e clique no seu ícone de cópia para copiar o texto que apresenta, incluindo qualquer JSON de workflow
- Arraste a linha acima da caixa de mensagem para tornar a caixa mais alta. A área de entrada pode crescer até 60% do painel, e regressa à sua altura predefinida quando a página é recarregada

## Aplicação Automática de Workflow

Quando a resposta da IA contém um bloco JSON de workflow válido (com `nodes` e, opcionalmente, `edges`) num bloco de código \`\`\`json, o Heym:

1. Analisa o JSON a partir da resposta
2. Substitui o canvas atual pelos novos nós e arestas
3. Organiza o layout dos nós
4. Marca o workflow como não guardado

Se a análise falhar, aparece um botão **Tentar novamente** para regenerar a resposta.
## Modificar um único nó

Passe o cursor sobre um nó na tela e clique em **AI** acima dele. O painel abre no modo Agent, focado nesse nó, e mostra qual nó está modificando:

| O nó tem... | O painel mostra |
|---|---|
| Nenhum resultado na execução atual | **Modifying Node:** numa linha compacta com o ícone e o nome do nó. O assistente edita apenas a partir da configuração do nó; execute o nó primeiro se ele precisar ver a saída |
| Um resultado na execução atual | **Modifying Node: (Has Node Output)** acima do próprio nó: ícone, nome e tipo, último estado e duração, e o erro caso tenha falhado. O assistente vê essa saída e o erro quando edita o nó |

Passe o cursor sobre o rótulo para ver em que estado o painel se encontra.

Qualquer que seja o estado do painel, o assistente também lê a página de documentação do nó, atrás do ícone de livro no cabeçalho do nó. Ele usa a página para entender as opções do nó e responder a perguntas sobre elas.

Abaixo das mensagens, três opções iniciam o pedido:

| Opção | O que faz |
|---|---|
| **Change this node as ...** | Preenche a caixa de mensagem com *Modificar este nó para* para você concluir a frase |
| **Fix error in this node ...** | Preenche *Corrigir o erro neste nó.* O assistente lê o erro deste nó da última execução |
| **Other** | Foca uma caixa de mensagem vazia |

Edite o texto e prima **Send**. O assistente devolve apenas este nó e o Heym atualiza-o no local: o nó mantém o seu id, tipo e nome, para que expressões como `$checkLinkedIn.result` noutros nós continuem a funcionar. Outros nós, ligações e o layout não mudam, e **Undo** restaura a configuração anterior.

Se o pedido não couber no nó, por exemplo se necessitar de outro tipo de nó ou de um novo nó, o assistente indica o que teria de mudar em vez de editar. Feche o foco do nó com o **X** no cartão do nó para editar todo o workflow novamente. Fechar o painel também limpa o foco.

O [modo YOLO](#yolo-mode) funciona com um nó focado: o assistente altera o nó, executa o workflow e corrige o nó até a execução ser bem-sucedida. No modo **Ask**, o foco indica ao assistente sobre qual nó é a sua pergunta e a tela não é alterada.

## Modo YOLO

O **Modo YOLO** permite que o assistente teste aquilo que constrói. Marque a caixa **Modo YOLO** abaixo do campo de mensagem e, em seguida, envie o seu pedido. A caixa aparece apenas no modo Agent. Está desativada por predefinição e volta a ficar desativada quando a página é recarregada. Passe o cursor sobre o ícone de informação ao lado para ver um breve resumo.

Com o Modo YOLO ativado, o assistente não para depois de aplicar um workflow:

1. Aplica o workflow ao canvas.
2. Antes da primeira execução, solicita as entradas de teste. O cartão lista os campos de entrada do workflow, preenchidos com valores sugeridos pelo assistente. Edite-os e prima **Run**. As execuções seguintes reutilizam estes valores. O cartão só volta a aparecer quando os campos de entrada forem alterados ou quando o assistente precisar de dados de teste diferentes.
3. Executa o workflow no canvas exatamente como o botão **Run**: as alterações não guardadas são guardadas primeiro, os nós acendem-se e a execução aparece no painel Debug e no [Histórico de Execuções](./execution-history.md).
4. Lê o resultado. Se a execução fez o que pediu, termina com **Verified** e um breve resumo. Caso contrário, corrige o workflow e executa-o novamente.

Realiza no máximo **5 execuções** por mensagem. Prima **Stop** em qualquer momento para terminar o ciclo e interromper uma execução em curso.

Cada resposta mostra os seus passos à medida que acontecem:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, com uma linha `Executing <node>` para cada nó;
- o veredicto final.

Após cada execução, uma breve linha como *Attempt 1 result sent · error in 1.2s* mostra que o resultado foi devolvido ao assistente.

### Executar os seus outros workflows

No Modo YOLO, o assistente também pode executar os seus outros workflows quando necessita do respetivo resultado. Por exemplo, pode verificar o que um workflow devolve antes de o invocar a partir de um nó [Execute](../nodes/execute-node.md). Estas execuções aparecem como passos `Running workflow "<name>"...` e são registadas no Histórico de Execuções com a origem do trigger `ai_assistant`. O workflow que está a ser editado é sempre testado no canvas.

### Quando para antecipadamente

| Situação | O que acontece |
|---|---|
| O assistente necessita de uma decisão, informação, uma credencial ou uma tabela de dados | Pergunta através do cartão de pergunta habitual. Responder dá continuidade ao ciclo. |
| A execução aguarda uma [revisão humana](./human-in-the-loop.md) | O ciclo para. Aprove a revisão e, em seguida, envie uma mensagem. |
| O workflow aguarda o carregamento de um ficheiro | O ciclo para. O Modo YOLO não consegue testar execuções acionadas por carregamento de ficheiros. |
| Foi guardada noutro local uma versão mais recente do workflow | O ciclo para. Resolva o conflito de gravação e, em seguida, envie uma mensagem. |

> **As execuções são reais.** Os e-mails, mensagens e chamadas API no workflow são efetivamente enviados em cada tentativa, e os nós DataTable escrevem linhas reais. Cada execução guarda o workflow, pelo que as versões anteriores permanecem no [Histórico de Edição](./edit-history.md).

## Entrada de Voz

Nos navegadores suportados, um botão **Voice** ativa a conversão de voz em texto. Clique para iniciar a gravação, clique novamente para parar. O texto transcrito é enviado à IA para correção gramatical antes de o enviar.

## Nó Agent vs Assistente de IA

| | Nó Agent | Assistente de IA |
|---|------------|---------------|
| **Objetivo** | Nó LLM dentro de um workflow; é executado durante a execução | Interface de Chat para construir workflows com linguagem natural |
| **Localização** | Nó no canvas | Painel Debug → painel flutuante |
| **Quando** | Em tempo de execução | Durante a edição |

Consulte [Nó Agent](../nodes/agent-node.md) para obter informações sobre o nó de workflow que executa chamadas LLM com ferramentas e MCP.

## Como Funciona (AI Builder DSL)

O Assistente de IA é suportado por uma **workflow DSL** (linguagem específica de domínio) que descreve nós, arestas e expressões. Quando envia uma mensagem:

1. A sua mensagem, juntamente com as [Regras do Utilizador](./user-settings.md) e o workflow atual (caso exista), são enviados para o backend.
2. O backend constrói um **prompt de sistema** que inclui:
   - A workflow DSL completa (tipos de nós, sintaxe de expressões, regras, exemplos)
   - As suas Regras do Utilizador anexadas como "User Custom Rules"
   - O JSON do workflow atual quando está a editar um workflow existente
   - A lista de workflows disponíveis caso utilize o nó Execute
   - Os nomes, tipos e ids das credenciais que possui ou que foram partilhadas consigo (nunca os respetivos valores)
   - Os nomes, ids, descrições e colunas das tabelas de dados que pode utilizar (nunca as respetivas linhas)
3. O modelo devolve um único bloco JSON de workflow (com `nodes` e `edges`). O frontend analisa-o e aplica-o ao canvas.
### Credenciais

Quando um workflow precisa de uma credencial, o assistente pergunta antes de construí-lo. Se você tiver credenciais de um tipo adequado, ele as lista juntamente com **Criar uma nova credencial**; se não tiver nenhuma, ele pergunta se deseja criar uma. Toda pergunta também permite continuar sem uma credencial.

Optar por criar uma abre o formulário de credencial no painel, predefinido com o tipo correto e um nome sugerido. Os valores vão diretamente para o Heym; o assistente aprende apenas o nome e o tipo. Credenciais OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) conectam-se em um popup, e um link para a página de autorização aparece caso o popup seja bloqueado. Depois que a credencial é salva, o cartão exibe seu nome e o botão de criação é desativado; pressione **Enviar respostas** e o assistente coloca a nova credencial no nó.

Você também pode solicitar uma credencial isoladamente ("criar uma credencial do GitHub") ou pedir para alterar uma que você possui ("atualizar minha credencial do sheet", "reconectar meu Google Sheets"). O assistente responde com o mesmo cartão: criar abre um formulário vazio, atualizar abre o formulário naquela credencial com seus segredos mascarados.

O assistente prefere um nó dedicado. Quando nenhum nó cobre uma operação, como adicionar uma aba a um Google Sheet, ele usa uma requisição HTTP e escreve a linha de cabeçalho para a credencial escolhida. Consulte [HTTP › Autenticando com Credenciais](../nodes/http-node.md#authenticating-with-credentials).

Perguntas de esclarecimento das quais o workflow pode prescindir exibem **Opcional** em sua entrada e podem ser ignoradas.

A DSL impõe rótulos em camelCase, regras de expressão unificadas e campos específicos de cada nó. Se o valor de um campo for um único `$expr`, o backend preserva o tipo nativo; se o valor misturar texto com `$refs`, o resultado será uma string. A regra do `$` único ainda se aplica: nenhum `$` dentro de parênteses. As Regras de Usuário em [Configurações](./user-settings.md) são injetadas neste prompt de sistema para que suas preferências se apliquem a todo workflow gerado por IA.

Se o workflow atual contiver habilidades de Agent, o Assistente de IA inclui apenas o `SKILL.md` de cada habilidade naquele contexto de workflow. Arquivos `.py` anexados e ativos binários de habilidades são removidos antes da requisição para que o construtor permaneça dentro dos limites de contexto do modelo, mesmo quando as habilidades contiverem implementações extensas.

### Tabelas de dados

Quando um workflow salva, armazena ou consulta registros e você não nomeou outro armazenamento, o assistente usa um nó [DataTable](../nodes/datatable-node.md). Se você nomear uma de suas tabelas e ela tiver as colunas de que o workflow precisa, o assistente a utiliza. Caso contrário, ele pergunta qual tabela usar. O cartão lista as tabelas adequadas, cada uma com sua descrição e tipos de coluna, além de **Criar uma nova tabela** com um nome e colunas propostos. Tabelas compartilhadas com você também são oferecidas; uma que você só pode ler é oferecida apenas para leitura.

Escolha a nova tabela e pressione **Enviar respostas**: o cartão cria a tabela, e o assistente coloca seu id no nó e usa seus nomes de coluna exatos. Você também pode solicitar uma tabela isoladamente, por exemplo "criar uma tabela para meus leads".

O assistente do canvas vê nomes de tabelas, descrições e colunas, nunca linhas. Configura os nós do workflow a partir desses metadados; adicione colunas no [separador DataTable](../tabs/datatable-tab.md) ou solicite-o no [Chat](../tabs/chat-tab.md). O Chat e o `heym_chat` podem inspecionar linhas e adicionar ou remover colunas diretamente, bem como inserir, atualizar ou eliminar linhas em tabelas de que seja proprietário ou para as quais tenha permissão de escrita, incluindo partilhas de equipa. A remoção de colunas e a limpeza de todas as linhas solicitam confirmação antes de eliminar dados.

## Relacionados

- [Por que o Heym](../getting-started/why-heym.md) – Construção em linguagem natural como o primeiro estágio do ciclo de vida do agente
- [Início Rápido](../getting-started/quick-start.md) – Construa seu primeiro workflow
- [Configurações](./user-settings.md) – Regras de Usuário injetadas no prompt de sistema do Assistente de IA
- [Chat com o Heym](./chat-with-heym.md) – Assistente ciente da página dentro da área de documentação
- [Conceitos Fundamentais](../getting-started/core-concepts.md) – Workflows, nós e fluxo de execução
- [Nó Agent](../nodes/agent-node.md) – Nó de LLM com ferramentas e MCP
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicione chaves de API para o Assistente de IA
- [Estrutura do Workflow](./workflow-structure.md) – Formato JSON para workflows
