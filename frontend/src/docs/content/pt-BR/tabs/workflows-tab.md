# Aba Workflows

A aba **Workflows** é a visualização padrão do dashboard. Ela exibe sua lista de workflows, a estrutura de pastas e permite criar, editar e organizar workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Assista à demonstração de Workflows</a></p>

## Iniciar um Chat

Acima da lista de workflows há uma caixa de chat que cumprimenta você pelo nome e pergunta o que você deseja automatizar. Digite um prompt, opcionalmente anexe um arquivo e escolha a credencial e o modelo desejados. Ambos os menus suspensos são pesquisáveis e iniciam com seus [padrões de IA](../reference/user-settings.md).

O envio cria uma nova conversa e a abre na [aba Chat](./chat-tab.md), onde a resposta é transmitida em tempo real. Os anexos suportados são arquivos de texto, imagens e PDFs, um por mensagem, assim como no compositor do chat.

Se você ainda não possui uma credencial LLM, a caixa exibe um link para a [aba Credentials](./credentials-tab.md) e o envio permanece desabilitado.

Clique no **x** para ocultar a caixa. Um botão **Ask AI** aparece então ao lado do título Workflows e a traz de volta. A escolha é lembrada no seu navegador.

## Lista de Workflows

A lista é uma visualização de dois painéis: workflows e pastas à esquerda, uma pré-visualização do workflow selecionado à direita.

- Cada linha exibe o ícone do workflow, o nome, a descrição, quando foi atualizado pela última vez e um [chip de status](#workflow-status)
- Os workflows podem estar na raiz ou dentro de pastas, e workflows fixados aparecem em seu próprio grupo **Pinned** no topo
- **Clique** em uma linha para selecioná-la e carregar sua pré-visualização à direita
- **Clique duas vezes** em uma linha, ou pressione **Enter** enquanto ela estiver em foco, para abri-la no [editor](../getting-started/quick-start.md)
- Use **Ctrl+clique** (ou **Cmd+clique**) para abrir em uma nova aba
- Cada linha traz suas ações de editar, copiar, fixar e excluir à direita. Em celulares elas ficam ocultas para que o nome ocupe toda a largura; **pressione e segure** uma linha nesses dispositivos para abrir a folha de ações
- Fixe workflows usados com frequência no [Quick Drawer](../reference/quick-drawer.md) para executá-los rapidamente a partir da aba Workflows e de outras páginas internas

## Pré-visualização do Workflow

Selecionar um workflow preenche o painel de pré-visualização ao lado da lista. Em telas menores que 1280px, o mesmo painel abre como uma folha a partir da parte inferior da tela.

O painel exibe:

- O nome do workflow, quem o criou e quando, e quando foi editado pela última vez
- **Open Workflow** – abre o workflow no editor
- **Run Now** – abre o workflow no [Quick Drawer](../reference/quick-drawer.md), onde você preenche suas entradas e inicia a execução sem sair da lista
- **Description** – a descrição do workflow
- **Trigger Configuration** – o agendamento de um workflow cron, ou o trigger de escuta de um workflow de evento. Workflows invocados via HTTP exibem um botão **Copy cURL** em vez do endpoint bruto e do texto de autenticação: ele copia uma requisição completa com a URL correta, os headers, o placeholder de autenticação e um body construído a partir dos campos de entrada do workflow. Quando o workflow publica um [portal](../reference/portal.md), seu link de chat público também aparece aqui
- **Last Run Details** – o resultado e a duração da execução mais recente, ou uma observação de que o workflow nunca foi executado
- **Workflow Steps & Sub-agents** – os nós em ordem de execução, cada um com seu modelo, operação ou agendamento e um ponto indicando se está ativo. Selecionar uma etapa abre esse nó no editor com seu painel de propriedades já aberto

O painel permanece fixado ao lado da lista enquanto você rola, mantendo-se legível em uma lista longa de workflows.
## Administração da Instância

Contas listadas em `HEYM_ADMIN_EMAILS` podem listar, abrir, editar, inspecionar o histórico de execução e excluir qualquer workflow na instância sem compartilhamento ou transferência de propriedade. A configuração é uma lista de endereços de e-mail separados por vírgula, correspondidos sem distinção entre maiúsculas e minúsculas. Uma lista vazia não concede esse acesso a ninguém. Reinicie o backend após alterá-la.

Administradores veem o e-mail do proprietário na lista de workflows e podem pesquisar por esse endereço. Selecione um workflow para abrir **Administração da instância** em sua pré-visualização:

1. **Pausar triggers** é exibido apenas para workflows que contêm um Nó Cron. Ele desativa o Cron do workflow e outros Nós de trigger automáticos por meio de um salvamento versionado normal. Execuções existentes podem ser concluídas. Chamadas manuais, de API, do portal e de sub-workflow permanecem disponíveis; esta ação não é um bloqueio de execução para todo o workflow.
2. O botão muda para **Retomar triggers** enquanto pausado, inclusive após recarregar a página. Retomar reativa os triggers pausados pelo administrador e deixa inalterados os triggers que já estavam desativados. Para workflows pausados mais antigos, sem um estado de pausa administrativa salvo, Retomar ativa seus triggers automáticos.
3. Use a ação **Excluir workflow** na linha do workflow depois que as execuções forem concluídas. A exclusão retorna um conflito enquanto houver trabalho em execução, na fila ou aguardando revisão. A exclusão agendada aplica a mesma verificação.

Pause os triggers e deixe as execuções existentes terminarem antes de excluir. Um trigger já despachado no momento da pausa ainda pode ser concluído. Use a exclusão quando o workflow não puder mais ser chamado.

Segredos de webhook e configurações de autenticação exclusivos do proprietário mantêm suas proteções existentes. A administração não transfere a propriedade nem compartilha os registros de credenciais do proprietário. Ações administrativas de pausa, retomada, exclusão e agendamento aparecem na [trilha de auditoria](../reference/audit.md) com o administrador atuante e o proprietário do workflow.

## Status do Workflow

Cada linha carrega um chip de status derivado dos Nós de trigger do workflow, seu estado de execução ativo
e — para workflows sem Nó de trigger — de como sua execução mais recente foi iniciada:

| Status | Significado |
| --- | --- |
| **Running** | O workflow tem uma execução em andamento neste momento |
| **Scheduled** | Ele tem um trigger de [cron](../nodes/cron-node.md) ativo |
| **Listening** | Ele tem um trigger de evento ativo, como um trigger Slack, Telegram, IMAP ou WebSocket |
| **Paused** | Ele tem Nós de trigger, mas todos eles estão desativados |
| **API** | Ele não tem Nós de trigger e foi executado pela última vez por uma chamada HTTP ao seu endpoint de execução |
| **SubWorker** | Ele não tem Nós de trigger e foi executado pela última vez como sub-workflow por um workflow pai |
| **Portal** | Ele não tem Nós de trigger e foi executado pela última vez a partir de seu [portal](../reference/portal.md) |
| **WEB** | Ele não tem Nós de trigger e seu único terminal é um [mapeador de saída HTML](../nodes/html-output-mapper-node.md), portanto chamá-lo retorna uma página web renderizada |
| **Manual** | Ele não tem Nós de trigger e nunca foi executado, ou sua última execução veio de outro lugar |
| **Remove Scheduled** | Ele está [agendado para exclusão](../reference/workflow-organization.md) |

Os chips API, SubWorker e Portal leem a única entrada mais recente no
[histórico de execução](./logs-tab.md) do workflow, portanto um workflow chamado de duas formas exibe
a que ocorreu por último. **WEB** é decidido a partir do grafo, então tem precedência sobre esses três: um
workflow que serve páginas exibe WEB mesmo depois de ter sido chamado via HTTP. Nós de trigger sempre
prevalecem sobre todos eles: um workflow cron que alguém também chama via HTTP permanece **Scheduled**.

Use o menu suspenso **Status** ao lado do campo de pesquisa para exibir apenas um status. O menu suspenso lista quantos workflows correspondem a cada um no momento. Um filtro de status também alcança o interior das pastas: pastas com correspondência são expandidas automaticamente, e pastas sem correspondência ficam ocultas até você limpar o filtro.

## Workflows Ativos

No desktop, o badge circular na barra de ferramentas superior mostra quantos workflows estão em execução
no momento e é atualizado automaticamente a cada 10 segundos. Clique em um badge diferente de zero para abrir a lista
de workflows ativos, que mostra até quatro linhas antes de rolar. Selecione o nome de um workflow para anexar o
editor à visualização ao vivo dessa execução. O badge zero é informativo e não pode ser aberto, e o
badge fica oculto em telas móveis.

## Pesquisa

Use o campo de pesquisa de workflows ao lado de **Status**, ou pressione **Ctrl+F** (ou **Cmd+F**), para filtrar workflows por título ou descrição. Workflows correspondentes dentro de pastas são exibidos com seus ramos de pasta expandidos. Pressione **Escape** para limpar a pesquisa.
## Pastas

- Organize workflows em [pastas e subpastas](../reference/workflow-organization.md)
- Crie pastas com o botão **New Folder**, atribuindo a cada uma um nome e uma descrição opcional exibida abaixo do nome na lista
- Cada linha de pasta mostra quantos workflows ela contém, contando as subpastas, além de suas ações de nova subpasta, renomear, alterar ícone, baixar como ZIP e excluir. Em celulares, a linha exibe um único botão de menu
- Arraste um workflow sobre uma pasta ou subpasta para ver uma prévia de destino do tamanho de um card. A
  prévia destacada mostra o caminho completo da pasta antes de você soltar, e passar o mouse sobre uma pasta
  recolhida a expande brevemente para que você possa alcançar pastas aninhadas.
- Arraste workflows entre pastas ou para a raiz. O card arrastado permanece visível como um fantasma,
  e o destino ativo permanece destacado enquanto você rola a tela.
- Soltar um workflow de volta em sua pasta atual é desabilitado e marcado como **Already in Folder**.
- Renomeie uma pasta, ou altere sua descrição, a partir de sua ação de renomear ou do menu de contexto do clique com o botão direito

## Criando Workflows

1. Clique em **New Workflow**
2. Insira um nome e uma descrição opcional
3. O workflow abre no editor

## Importação

Arraste e solte um arquivo JSON de workflow sobre a área de workflows para criar um novo workflow. Os nós e arestas importados são usados para criar o workflow; o nome vem do campo `name` no JSON ou do nome do arquivo. Consulte [Download & Import](../reference/download-import.md) para o formato JSON e as opções de importação.

## Compartilhamento

Abra um workflow no editor e clique em **Share** para convidar usuários por e-mail ou compartilhar com uma [equipe](./teams-tab.md). Escolha **Read** (visualizar e executar) ou **Write** (também editar) para cada usuário ou equipe, e altere depois no menu suspenso ao lado da entrada. Credenciais e sub-workflows não são compartilhados automaticamente; compartilhe-os separadamente com os mesmos usuários ou equipes. Consulte [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) e [Credentials Sharing](../reference/credentials-sharing.md).

## Editando e Excluindo

- **Edit** – Altere o nome e a descrição do workflow a partir da ação de edição da linha
- **Delete** – Os workflows são [agendados para exclusão](../reference/workflow-organization.md); eles vão para uma área de lixeira antes da remoção permanente

## Edições Simultâneas

Ao salvar, a revisão na qual suas edições se baseiam é enviada, e o servidor rejeita a gravação se o workflow mudou nesse meio tempo — por exemplo, porque um colega de equipe o salvou, ou porque você deixou o mesmo workflow aberto em uma segunda aba. O Heym então exibe um diálogo **Stale Workflow Detected** com duas opções:

- **Cancel** – Mantém suas alterações não salvas no editor para que você possa recarregar em outra aba e reconciliá-las
- **Override** – Salva mesmo assim, substituindo a versão da outra pessoa

**Executar** um workflow o salva primeiro, então ele passa pela mesma verificação. Se o workflow mudou por baixo de você, a execução pausa no diálogo em vez de sobrescrever silenciosamente: **Override and Run** salva sua versão e inicia a execução, **Cancel Run** abandona ambas e deixa suas edições intactas.

A verificação faz parte da própria requisição de salvamento, então não custa nenhuma viagem extra de ida e volta e não há janela na qual um salvamento possa escapar dela. Suas próprias alterações feitas em outro lugar do aplicativo — um renomear, uma alteração de configuração, uma alternância no painel de propriedades — nunca contam como conflito.

## Paleta de Comandos

Pressione **Ctrl+K** (ou **Cmd+K**) para abrir a paleta de comandos. Você pode:
- Pesquisar workflows por nome
- Ir para qualquer [aba do dashboard](./credentials-tab.md)
- Abrir workflows recentes

## Relacionados

- [Quick Start](../getting-started/quick-start.md) – Construa seu primeiro workflow
- [Workflow Organization](../reference/workflow-organization.md) – Pastas, subpastas e exclusão agendada
- [Workflow Structure](../reference/workflow-structure.md) – Formato JSON para workflows
- [Download & Import](../reference/download-import.md) – Exporte e importe workflows como JSON
- [Portal](../reference/portal.md) – Exponha workflows como interfaces públicas de chat
- [Board](./board-tab.md) – Execute workflows a partir de cards kanban via cadeias de colunas
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nós e execução
- [Execution History](../reference/execution-history.md) – Visualize execuções anteriores e o Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Fixe e execute workflows a partir do dashboard, da documentação e de outras páginas que não sejam o editor
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia curto de página para as superfícies do dashboard
