# Assistente de IA

O **Assistente de IA** é um painel de chat que se abre a partir do painel de Debug e inicia no canto inferior direito do editor. Arraste o cabeçalho para movê-lo e arraste uma borda ou um canto para alterar sua largura ou altura. Ele não encolhe abaixo de 360×480 pixels. A posição e o tamanho são memorizados neste navegador. A opção **Redefinir posição e tamanho** no cabeçalho reposiciona o painel no canto inferior direito. Utilize linguagem natural para criar ou modificar workflows — descreva o que você deseja, e a IA gera nós e conexões que são aplicados ao canvas.

Para dúvidas de documentação fora do editor, utilize [Chat with Heym](./chat-with-heym.md). Essa interface é otimizada para ajuda de produto com reconhecimento de página, em vez de geração de workflows.

## Abrindo o Painel

1. Abra um workflow no editor
2. Localize o **Painel de Debug** na parte inferior (área de resultados de execução)
3. Clique no botão **AI** (ícone Sparkles) na barra de ferramentas do painel
4. O painel do Assistente de IA abre no canto inferior direito. Arraste seu cabeçalho para movê-lo, ou arraste uma borda ou um canto para alterar sua largura e altura.

Pressione `Ctrl + I` / `Cmd + I` em qualquer lugar do editor para abrir ou fechar o painel — o atalho funciona mesmo quando um campo de texto está em foco. Consulte [Keyboard Shortcuts](./keyboard-shortcuts.md).

Para trabalhar em um único nó, passe o cursor sobre ele no canvas e clique em **AI** acima dele. O painel abre focado nesse nó. Veja [Modificar um único nó](#changing-one-node).

## Fechando o Painel

Clique no botão **X**, pressione `Ctrl + I` / `Cmd + I`, ou alterne o botão **AI** na barra de ferramentas do Painel de Debug. O cabeçalho arrasta o painel; ele não o fecha.

## Configuração

Antes de enviar mensagens, selecione:

| Configuração | Descrição |
|---------|-------------|
| **Credential** | Credencial de LLM (chave de API) em [Credentials](../tabs/credentials-tab.md) |
| **Model** | Nome do modelo (ex.: `gpt-4o`, `gemini-2.5-flash`) |

Adicione credenciais na [Credentials Tab](../tabs/credentials-tab.md). A lista de modelos é carregada a partir da credencial selecionada.

## Agent Mode vs Ask Mode

O painel possui dois modos, alternados pelo chip **Agent / Ask** no cabeçalho do painel.

| Modo | Padrão | Comportamento |
|------|---------|-----------|
| **Agent** | ✓ | Constrói e modifica o canvas. A IA gera um bloco JSON de workflow que é aplicado automaticamente ao canvas quando a resposta é concluída. |
| **Ask** | | Apenas responde a perguntas. O canvas nunca é alterado. Utilize este modo para perguntar sobre seu workflow, recursos do Heym, ou obter orientações sem acionar uma atualização do canvas. |

Alterne entre os modos a qualquer momento. Mudar o modo não limpa a conversa.

No modo Agent, a caixa **YOLO mode** abaixo do campo de mensagem faz o assistente executar e corrigir o que ele constrói. Consulte [YOLO Mode](#yolo-mode).

## Usando o Chat

- Digite sua solicitação no campo de entrada (ex.: "Crie um workflow que recebe entrada do usuário e a envia para um LLM")
- Pressione **Enter** para enviar (Shift+Enter para nova linha)
- A IA transmite sua resposta em streaming. No modo **Agent**, se a resposta incluir um workflow em um bloco de código \`\`\`json, ele é automaticamente analisado e aplicado ao canvas. No modo **Ask**, o canvas nunca é modificado.
- Utilize **Clear** para redefinir a conversa
- Passe o mouse sobre uma mensagem e clique em seu ícone de cópia para copiar o texto exibido, incluindo qualquer JSON de workflow
- Arraste a linha acima da caixa de mensagem para aumentar a altura da caixa. A área de entrada pode crescer até 60% do painel, e retorna à sua altura padrão quando a página é recarregada

## Aplicação Automática de Workflow

Quando a resposta da IA contém um bloco JSON de workflow válido (com `nodes` e, opcionalmente, `edges`) em um bloco de código \`\`\`json, o Heym:

1. Analisa o JSON da resposta
2. Substitui o canvas atual pelos novos nós e conexões
3. Organiza o layout dos nós
4. Marca o workflow como não salvo

Se a análise falhar, um botão **Retry** aparece para regenerar a resposta.

## Modificar um único nó

Passe o cursor sobre um nó no canvas e clique em **AI** acima dele. O painel abre no modo Agent, focado nesse nó, e mostra qual nó está modificando:

| O nó tem... | O painel mostra |
|---|---|
| Nenhum resultado na execução atual | **Modifying Node:** em uma linha compacta com o ícone e o nome do nó. O assistente edita apenas a partir da configuração do nó; execute o nó primeiro se ele precisar ver a saída |
| Um resultado na execução atual | **Modifying Node: (Has Node Output)** acima do próprio nó: ícone, nome e tipo, último status e duração, e o erro caso tenha falhado. O assistente vê essa saída e o erro quando edita o nó |

Passe o cursor sobre o rótulo para ver em qual estado o painel se encontra.

Em qualquer estado do painel, o assistente também lê a página de documentação do nó, atrás do ícone de livro no cabeçalho do nó. Ele usa a página para entender as opções do nó e responder a perguntas sobre elas.

Abaixo das mensagens, três opções iniciam a solicitação:

| Opção | O que faz |
|---|---|
| **Change this node as ...** | Preenche a caixa de mensagem com *Modificar este nó para* para você terminar a frase |
| **Fix error in this node ...** | Preenche *Corrigir o erro neste nó.* O assistente lê o erro deste nó da última execução |
| **Other** | Foca uma caixa de mensagem vazia |

Edite o texto e pressione **Send**. O assistente retorna apenas este nó e o Heym o atualiza no local: o nó mantém seu id, tipo e nome, para que expressões como `$checkLinkedIn.result` em outros nós continuem funcionando. Outros nós, conexões e o layout não mudam, e **Undo** restaura a configuração anterior.

Se a solicitação não couber no nó, por exemplo se precisar de outro tipo de nó ou de um novo nó, o assistente indica o que teria de mudar em vez de editar. Feche o foco do nó com o **X** no card do nó para editar todo o workflow novamente. Fechar o painel também limpa o foco.

O [modo YOLO](#yolo-mode) funciona com um nó focado: o assistente altera o nó, executa o workflow e corrige o nó até a execução ser bem-sucedida. No modo **Ask**, o foco indica ao assistente sobre qual nó é sua pergunta e o canvas não é alterado.

## YOLO Mode

O **YOLO mode** permite que o assistente teste o que ele constrói. Marque a caixa **YOLO mode** abaixo do campo de mensagem e, em seguida, envie sua solicitação. A caixa aparece apenas no modo Agent. Ela fica desativada por padrão e retorna ao estado desativado quando a página é recarregada. Passe o mouse sobre o ícone de informação ao lado dela para ver um breve resumo.

Com o YOLO mode ativado, o assistente não para após aplicar um workflow:

1. Ele aplica o workflow ao canvas.
2. Antes da primeira execução, ele solicita entradas de teste. O cartão lista os campos de entrada do workflow, preenchidos com valores sugeridos pelo assistente. Edite-os e pressione **Run**. Execuções posteriores reutilizam esses valores. O cartão só reaparece quando os campos de entrada mudam ou o assistente precisa de dados de teste diferentes.
3. Ele executa o workflow no canvas exatamente como o botão **Run**: alterações não salvas são salvas primeiro, os nós se iluminam, e a execução aparece no Painel de Debug e no [Execution History](./execution-history.md).
4. Ele lê o resultado. Se a execução fez o que você pediu, ele finaliza com **Verified** e um breve resumo. Caso contrário, ele corrige o workflow e o executa novamente.

Ele realiza no máximo **5 execuções** por mensagem. Pressione **Stop** a qualquer momento para encerrar o loop e interromper uma execução em andamento.

Cada resposta exibe suas etapas conforme elas acontecem:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, com uma linha `Executing <node>` para cada nó;
- o veredito final.

Após cada execução, uma breve linha como *Attempt 1 result sent · error in 1.2s* indica que o resultado foi enviado de volta ao assistente.
### Executando seus outros workflows

No modo YOLO, o assistente também pode executar seus outros workflows quando precisar do resultado deles. Por exemplo, ele pode verificar o que um workflow retorna antes de chamá-lo a partir de um nó [Execute](../nodes/execute-node.md). Essas execuções aparecem como etapas `Running workflow "<name>"...` e são registradas no Histórico de Execuções com a origem do trigger `ai_assistant`. O workflow que está sendo editado é sempre testado no canvas.

### Quando ele para antecipadamente

| Situação | O que acontece |
|---|---|
| O assistente precisa de uma decisão, informação, uma credencial ou uma tabela de dados | Ele pergunta com o card de pergunta habitual. Responder continua o loop. |
| A execução aguarda uma [revisão humana](./human-in-the-loop.md) | O loop para. Aprove a revisão e envie uma mensagem. |
| O workflow aguarda o upload de um arquivo | O loop para. O modo YOLO não consegue testar execuções acionadas por upload. |
| Uma versão mais recente do workflow foi salva em outro lugar | O loop para. Resolva o conflito de salvamento e envie uma mensagem. |

> **As execuções são reais.** E-mails, mensagens e chamadas de API no workflow são realmente enviados a cada tentativa, e os nós DataTable gravam linhas reais. Toda execução salva o workflow, então as versões anteriores permanecem no [Histórico de Edições](./edit-history.md).

## Entrada de Voz

Em navegadores compatíveis, um botão **Voice** habilita a conversão de fala em texto. Clique para iniciar a gravação, clique novamente para parar. O texto transcrito é enviado à IA para correção gramatical antes de você enviar.

## Nó Agent vs Assistente de IA

| | Nó Agent | Assistente de IA |
|---|------------|---------------|
| **Propósito** | Nó de LLM dentro de um workflow; executa durante a execução | Interface de chat para construir workflows com linguagem natural |
| **Localização** | Nó no canvas | Painel de depuração → painel flutuante |
| **Quando** | Em tempo de execução | Durante a edição |

Consulte [Nó Agent](../nodes/agent-node.md) para o nó de workflow que executa chamadas de LLM com ferramentas e MCP.

## Como Funciona (AI Builder DSL)

O Assistente de IA é alimentado por uma **DSL de workflow** (linguagem de domínio específico) que descreve nós, arestas e expressões. Quando você envia uma mensagem:

1. Sua mensagem, mais as [Regras do Usuário](./user-settings.md) e o workflow atual (se houver), são enviados ao backend.
2. O backend constrói um **system prompt** que inclui:
   - A DSL completa do workflow (tipos de nó, sintaxe de expressão, regras, exemplos)
   - Suas Regras do Usuário anexadas como "User Custom Rules"
   - O JSON do workflow atual quando você está editando um workflow existente
   - A lista de workflows disponíveis se você usar o nó Execute
   - Os nomes, tipos e ids das credenciais que você possui ou que foram compartilhadas com você (nunca seus valores)
   - Os nomes, ids, descrições e colunas das tabelas de dados que você pode usar (nunca suas linhas)
3. O modelo retorna um único bloco JSON de workflow (com `nodes` e `edges`). O frontend o interpreta e o aplica ao canvas.

### Credenciais

Quando um workflow precisa de uma credencial, o assistente pergunta antes de construí-lo. Se você tiver credenciais de um tipo adequado, ele as lista junto com **Create a new credential**; se você não tiver nenhuma, ele pergunta se deseja criar uma. Toda pergunta também permite que você continue sem uma credencial.

Escolher criar uma abre o formulário de credencial no painel, predefinido com o tipo correto e um nome sugerido. Os valores vão diretamente para o Heym; o assistente só conhece o nome e o tipo. Credenciais OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) conectam-se em um popup, e um link para a página de autorização aparece caso o popup seja bloqueado. Depois que a credencial é salva, o card mostra seu nome e o botão de criação é desativado; pressione **Submit answers** e o assistente coloca a nova credencial no nó.

Você também pode pedir uma credencial por conta própria ("create a GitHub credential") ou pedir para alterar uma que você possui ("update my sheet credential", "reconnect my Google Sheets"). O assistente responde com o mesmo card: criar abre um formulário vazio, atualizar abre o formulário naquela credencial com seus segredos mascarados.

O assistente prefere um nó dedicado. Quando nenhum nó cobre uma operação, como adicionar uma aba a um Google Sheet, ele usa uma requisição HTTP e escreve a linha de cabeçalho para a credencial escolhida. Consulte [HTTP › Autenticando com Credenciais](../nodes/http-node.md#authenticating-with-credentials).

Perguntas de esclarecimento das quais o workflow pode prescindir exibem **Optional** em sua entrada e podem ser ignoradas.

A DSL impõe rótulos em camelCase, regras de expressão unificadas e campos específicos de cada nó. Se o valor de um campo for um único `$expr`, o backend preserva o tipo nativo; se o valor misturar texto com `$refs`, o resultado é uma string. A regra do único `$` ainda se aplica: nenhum `$` dentro de parênteses. As Regras do Usuário em [Configurações](./user-settings.md) são injetadas nesse system prompt para que suas preferências se apliquem a todo workflow gerado por IA.

Se o workflow atual contiver Agent skills, o Assistente de IA inclui apenas o `SKILL.md` de cada skill naquele contexto de workflow. Arquivos `.py` anexados e assets binários de skill são removidos antes da requisição para que o builder permaneça dentro dos limites de contexto do modelo mesmo quando as skills contiverem implementações grandes.
### Tabelas de dados

Quando um workflow salva, armazena ou consulta registros e você não nomeou outro armazenamento, o assistente utiliza um nó [DataTable](../nodes/datatable-node.md). Se você nomear uma de suas tabelas e ela tiver as colunas de que o workflow precisa, o assistente a utiliza. Caso contrário, ele pergunta qual tabela usar. O card lista as tabelas compatíveis, cada uma com sua descrição e tipos de colunas, além de **Criar uma nova tabela** com um nome e colunas propostos. Tabelas compartilhadas com você também são oferecidas; uma tabela que você só pode ler é oferecida apenas para leitura.

Selecione a nova tabela e pressione **Enviar respostas**: o card cria a tabela, e o assistente coloca seu id no nó e utiliza os nomes exatos de suas colunas. Você também pode solicitar uma tabela isoladamente, por exemplo "crie uma tabela para meus leads".

O assistente vê nomes de tabelas, descrições e colunas, nunca as linhas. Ele nunca altera as colunas de uma tabela existente: se uma tabela não tiver uma coluna de que o workflow precisa, ele nomeia a coluna e oferece uma nova tabela em vez disso. Adicione colunas na [aba DataTable](../tabs/datatable-tab.md).

## Relacionados

- [Por que o Heym](../getting-started/why-heym.md) – Construção em linguagem natural como o primeiro estágio do ciclo de vida do agente
- [Início Rápido](../getting-started/quick-start.md) – Construa seu primeiro workflow
- [Configurações](./user-settings.md) – Regras do usuário injetadas no prompt de sistema do Assistente de IA
- [Chat com o Heym](./chat-with-heym.md) – Assistente ciente da página dentro da área de documentação
- [Conceitos Fundamentais](../getting-started/core-concepts.md) – Workflows, nós e fluxo de execução
- [Nó Agent](../nodes/agent-node.md) – Nó de LLM com ferramentas e MCP
- [Aba Credentials](../tabs/credentials-tab.md) – Adicione chaves de API para o Assistente de IA
- [Estrutura do Workflow](./workflow-structure.md) – Formato JSON para workflows
