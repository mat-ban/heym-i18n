# Separador Workflows

O separador **Workflows** é a vista de dashboard predefinida. Mostra a sua lista de workflows, a estrutura de pastas e permite-lhe criar, editar e organizar workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Ver demonstração de Workflows</a></p>

## Iniciar um Chat

Acima da lista de workflows existe uma caixa de chat que o cumprimenta pelo nome e pergunta o que pretende automatizar. Introduza um prompt, anexe opcionalmente um ficheiro e escolha a credencial e o modelo pretendidos. Ambos os menus pendentes são pesquisáveis e iniciam com os seus [predefinições de IA](../reference/user-settings.md).

O envio cria uma nova conversa e abre-a no [separador Chat](./chat-tab.md), onde a resposta é transmitida em fluxo. Os anexos suportados são ficheiros de texto, imagens e PDFs, um por mensagem, tal como no compositor de chat.

Se ainda não tiver uma credencial LLM, a caixa mostra uma ligação para o [separador Credenciais](./credentials-tab.md) e o envio permanece desativado.

Clique no **x** para ocultar a caixa. Aparece então um botão **Perguntar à IA** junto ao cabeçalho Workflows, que a volta a mostrar. A escolha é memorizada no seu navegador.

## Lista de Workflows

A lista é uma vista de dois painéis: workflows e pastas à esquerda, uma pré-visualização do workflow selecionado à direita.

- Cada linha mostra o ícone do workflow, o nome, a descrição, quando foi atualizado pela última vez e um [chip de estado](#estado-do-workflow)
- Os workflows podem estar na raiz ou dentro de pastas, e os workflows fixados aparecem no seu próprio grupo **Fixados** no topo
- **Clique** numa linha para a selecionar e carregar a sua pré-visualização à direita
- **Faça duplo clique** numa linha, ou prima **Enter** enquanto esta está focada, para a abrir no [editor](../getting-started/quick-start.md)
- Utilize **Ctrl+clique** (ou **Cmd+clique**) para abrir num novo separador
- Cada linha apresenta as suas ações de editar, copiar, fixar e eliminar à direita. Nos telemóveis estas ficam ocultas para que o nome mantenha a largura total; **mantenha premida** uma linha para abrir o painel de ações
- Fixe workflows utilizados com frequência no [Quick Drawer](../reference/quick-drawer.md) para os poder executar rapidamente a partir do separador Workflows e de outras páginas internas

## Pré-visualização do Workflow

Selecionar um workflow preenche o painel de pré-visualização ao lado da lista. Em ecrãs com menos de 1280px, o mesmo painel abre como uma folha a partir da parte inferior do ecrã.

O painel mostra:

- O nome do workflow, quem o criou e quando, e quando foi editado pela última vez
- **Abrir Workflow** – abre o workflow no editor
- **Executar Agora** – abre o workflow no [Quick Drawer](../reference/quick-drawer.md), onde preenche as suas entradas e inicia a execução sem sair da lista
- **Descrição** – a descrição do workflow
- **Configuração do Trigger** – o agendamento de um workflow cron, ou o trigger de escuta de um workflow de evento. Os workflows invocados por HTTP mostram um botão **Copiar cURL** em vez do endpoint em bruto e do texto de autenticação: copia um pedido completo com o URL correto, cabeçalhos, marcador de autenticação e um corpo construído a partir dos campos de entrada do workflow. Quando o workflow publica um [portal](../reference/portal.md), a sua ligação de chat pública aparece aqui também
- **Detalhes da Última Execução** – o resultado e a duração da execução mais recente, ou uma nota de que o workflow nunca foi executado
- **Passos do Workflow e Sub-agentes** – os nós por ordem de execução, cada um com o seu modelo, operação ou agendamento e um ponto que indica se está ativo. Selecionar um passo abre esse nó no editor com o respetivo painel de propriedades já aberto

O painel permanece fixo ao lado da lista enquanto faz scroll, mantendo-se legível numa lista de workflows extensa.

## Administração da Instância

As contas listadas em `HEYM_ADMIN_EMAILS` podem listar, abrir, editar, inspecionar o histórico de execuções e eliminar qualquer workflow na instância sem partilha ou transferência de propriedade. A definição é uma lista de endereços de e-mail separados por vírgulas, correspondidos sem distinção entre maiúsculas e minúsculas. Uma lista vazia não concede este acesso a ninguém. Reinicie o backend após a alteração.

Os administradores veem o e-mail do proprietário na lista de workflows e podem pesquisar por esse endereço. Selecione um workflow para abrir a **Administração da instância** na sua pré-visualização:

1. **Pausar triggers** é apresentado apenas para workflows que contenham um Nó Cron. Desativa o Cron do workflow e outros nós de trigger automáticos através de uma gravação versionada normal. As execuções existentes podem terminar. As chamadas manuais, de API, de portal e de sub-workflow permanecem disponíveis; esta ação não é um bloqueio de execução à escala do workflow.
2. O botão muda para **Retomar triggers** enquanto estiver em pausa, inclusive após recarregar a página. Retomar reativa os triggers pausados pelo administrador e deixa inalterados os triggers que já estavam desativados. Para workflows mais antigos em pausa sem um estado de pausa administrativa gravado, Retomar ativa os seus triggers automáticos.
3. Utilize a ação **Eliminar workflow** da linha do workflow depois de as execuções terem terminado. A eliminação devolve um conflito enquanto existir trabalho em execução, em fila ou pendente de revisão. A eliminação agendada aplica a mesma verificação.

Pause os triggers e deixe as execuções existentes terminar antes de eliminar. Um trigger já despachado quando pausado ainda pode terminar. Utilize a eliminação quando o workflow já não puder ser invocado.

Os segredos de webhook e as definições de autenticação exclusivos do proprietário mantêm as suas proteções existentes. A administração não transfere a propriedade nem partilha os registos de credenciais do proprietário. As ações administrativas de pausa, retoma, eliminação e agendamento aparecem no [registo de auditoria](../reference/audit.md) com o administrador atuante e o proprietário do workflow.

## Estado do Workflow

Cada linha apresenta um chip de estado derivado dos nós de trigger do workflow, do seu estado de execução em tempo real e — para workflows sem nó de trigger — de como a sua execução mais recente foi iniciada:

| Estado | Significado |
| --- | --- |
| **Running** | O workflow tem uma execução em curso neste momento |
| **Scheduled** | Tem um trigger [cron](../nodes/cron-node.md) ativo |
| **Listening** | Tem um trigger de evento ativo, como um trigger Slack, Telegram, IMAP ou WebSocket |
| **Paused** | Tem nós de trigger, mas todos eles estão desativados |
| **API** | Não tem nós de trigger e foi executado pela última vez por uma chamada HTTP ao seu endpoint de execução |
| **SubWorker** | Não tem nós de trigger e foi executado pela última vez como sub-workflow por um workflow principal |
| **Portal** | Não tem nós de trigger e foi executado pela última vez a partir do seu [portal](../reference/portal.md) |
| **WEB** | Não tem nós de trigger e o seu único terminal é um [mapeador de saída HTML](../nodes/html-output-mapper-node.md), pelo que a sua chamada devolve uma página web renderizada |
| **Manual** | Não tem nós de trigger e nunca foi executado, ou a sua última execução veio de outro local |
| **Remove Scheduled** | Está [agendado para eliminação](../reference/workflow-organization.md) |

Os chips API, SubWorker e Portal leem a única entrada mais recente no [histórico de execuções](./logs-tab.md) do workflow, pelo que um workflow chamado de duas formas mostra a que ocorreu por último. **WEB** é determinado a partir do grafo, pelo que tem precedência sobre esses três: um workflow que serve páginas lê WEB mesmo depois de ter sido chamado por HTTP. Os nós de trigger prevalecem sempre sobre todos eles: um workflow cron que alguém também chama por HTTP permanece **Scheduled**.

Utilize o menu pendente **Status** junto ao campo de pesquisa para mostrar apenas um estado. O menu pendente indica quantos workflows correspondem atualmente a cada um. Um filtro de estado também alcança o interior das pastas: as pastas com correspondência são expandidas automaticamente e as pastas sem correspondência ficam ocultas até limpar o filtro.

## Workflows Ativos

No ambiente de trabalho, o distintivo circular na barra de ferramentas superior mostra quantos workflows estão atualmente em execução e atualiza-se automaticamente a cada 10 segundos. Clique num distintivo diferente de zero para abrir a lista de workflows ativos, que mostra até quatro linhas antes de permitir deslocamento. Selecione o nome de um workflow para associar o editor à vista em tempo real dessa execução. O distintivo zero é informativo e não pode ser aberto, e o distintivo fica oculto em ecrãs móveis.

## Pesquisa

Utilize o campo de pesquisa de workflows junto a **Status**, ou prima **Ctrl+F** (ou **Cmd+F**), para filtrar workflows por título ou descrição. Os workflows correspondentes dentro de pastas são apresentados com os respetivos ramos de pasta expandidos. Prima **Escape** para limpar a pesquisa.

## Pastas

- Organize workflows em [pastas e subpastas](../reference/workflow-organization.md)
- Crie pastas com o botão **Nova Pasta**, atribuindo a cada uma um nome e uma descrição opcional apresentada sob o nome na lista
- Cada linha de pasta mostra quantos workflows contém, contando as subpastas, juntamente com as ações de nova subpasta, renomear, alterar ícone, transferir como ZIP e eliminar. Em telemóveis, a linha apresenta apenas um único botão de menu
- Arraste um workflow sobre uma pasta ou subpasta para visualizar uma pré-visualização do destino em formato de cartão. A
  pré-visualização destacada mostra o caminho completo da pasta antes de largar, e ao pairar sobre uma pasta
  recolhida esta expande-se brevemente para que possa alcançar pastas aninhadas.
- Arraste workflows entre pastas ou para a raiz. O cartão arrastado permanece visível como um fantasma,
  e o destino ativo permanece destacado enquanto faz scroll.
- Largar um workflow de volta na sua pasta atual está desativado e marcado como **Já na Pasta**.
- Renomeie uma pasta, ou altere a sua descrição, a partir da ação de renomear ou do menu de contexto do clique direito

## Criar Workflows

1. Clique em **Novo Workflow**
2. Introduza um nome e uma descrição opcional
3. O workflow abre no editor

## Importar

Arraste e largue um ficheiro JSON de workflow sobre a área de workflows para criar um novo workflow. Os nós e arestas importados são utilizados para criar o workflow; o nome provém do campo `name` no JSON ou do nome do ficheiro. Consulte [Transferir e Importar](../reference/download-import.md) para o formato JSON e opções de importação.

## Partilha

Abra um workflow no editor e clique em **Partilhar** para convidar utilizadores por email ou partilhar com uma [equipa](./teams-tab.md). Escolha **Leitura** (ver e executar) ou **Escrita** (também editar) para cada utilizador ou equipa, e altere posteriormente a partir do menu pendente junto à entrada. As credenciais e sub-workflows não são partilhados automaticamente; partilhe-os separadamente com os mesmos utilizadores ou equipas. Consulte [Organização de Workflows](../reference/workflow-organization.md#sharing-workflows) e [Partilha de Credenciais](../reference/credentials-sharing.md).

## Editar e Eliminar

- **Editar** – Altere o nome e a descrição do workflow a partir da ação de edição da linha
- **Eliminar** – Os workflows são [agendados para eliminação](../reference/workflow-organization.md); transitam para uma área de reciclagem antes da remoção permanente

## Edições Simultâneas

Ao guardar, é enviada a revisão na qual as suas edições se baseiam, e o servidor rejeita a escrita se o workflow tiver sido alterado entretanto — por exemplo, porque um colega o guardou, ou porque deixou o mesmo workflow aberto num segundo separador. O Heym apresenta então uma caixa de diálogo **Stale Workflow Detected** com duas opções:

- **Cancelar** – Mantém as suas alterações não guardadas no editor para que possa recarregar noutro separador e reconciliá-las
- **Substituir** – Guarda de qualquer forma, substituindo a versão da outra pessoa

**Executar** um workflow guarda-o primeiro, pelo que passa pela mesma verificação. Se o workflow tiver sido alterado entretanto, a execução pausa na caixa de diálogo em vez de substituir silenciosamente: **Substituir e Executar** guarda a sua versão e inicia a execução, **Cancelar Execução** abandona ambas e deixa as suas edições intactas.

A verificação faz parte do próprio pedido de guardar, pelo que não acarreta qualquer round trip adicional e não existe qualquer janela na qual uma gravação possa escapar-lhe. As suas próprias alterações provenientes de outras partes da aplicação — uma renomeação, uma alteração de definições, um interruptor no painel de propriedades — nunca contam como conflito.

## Paleta de Comandos

Prima **Ctrl+K** (ou **Cmd+K**) para abrir a paleta de comandos. Pode:
- Pesquisar workflows por nome
- Saltar para qualquer [separador do dashboard](./credentials-tab.md)
- Abrir workflows recentes

## Relacionado

- [Início Rápido](../getting-started/quick-start.md) – Construa o seu primeiro workflow
- [Organização de Workflows](../reference/workflow-organization.md) – Pastas, subpastas e eliminação agendada
- [Estrutura de Workflows](../reference/workflow-structure.md) – Formato JSON para workflows
- [Transferir e Importar](../reference/download-import.md) – Exportar e importar workflows como JSON
- [Portal](../reference/portal.md) – Exponha workflows como interfaces de chat públicas
- [Quadro](./board-tab.md) – Execute workflows a partir de cartões kanban através de cadeias de colunas
- [Conceitos Fundamentais](../getting-started/core-concepts.md) – Workflows, nós e execução
- [Histórico de Execuções](../reference/execution-history.md) – Consulte execuções anteriores e Bring to Canvas
- [Gaveta Rápida](../reference/quick-drawer.md) – Fixe e execute workflows a partir do dashboard, documentação e outras páginas fora do editor
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia breve de página para superfícies do dashboard
