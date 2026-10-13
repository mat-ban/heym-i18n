# Definições

A caixa de diálogo Definições permite-lhe gerir o seu perfil, definir instruções persistentes para a IA, atualizar a palavra-passe da conta, configurar a voz do chat, definir a credencial e o modelo de IA predefinidos e consultar o estado de observabilidade. Abra-a clicando em **o seu avatar e nome** no canto superior direito do cabeçalho.

## Abrir a Caixa de Diálogo

Clique em **o seu avatar e nome** no canto superior direito do cabeçalho. A caixa de diálogo abre com os seguintes separadores: **Perfil**, **Segurança**, **Voz**, **Predefinições de IA** e **Observabilidade**. Os administradores de instância também veem os separadores **SSO**, **Heym Work** e **Instâncias**.

## Separador Perfil

### Imagem de Perfil

O Heym mostra a sua imagem do [Gravatar](https://gravatar.com) associada ao email da conta no cabeçalho, junto às suas mensagens no [Chat](../tabs/chat-tab.md) e no **Chat com o Heym**, nos comentários do [Board](../tabs/board-tab.md) e junto ao seu nome nas caixas de diálogo de partilha e nas listas de membros da equipa. Para a alterar, atualize a imagem no Gravatar; o Heym adota a nova imagem dentro de algumas horas. Sem uma imagem do Gravatar, o Heym mostra a primeira letra do seu nome.

A imagem é obtida pelo servidor do Heym e armazenada em cache no mesmo, pelo que o seu navegador nunca contacta o Gravatar. Se o servidor não conseguir aceder ao Gravatar, todos continuam a ver as iniciais.

### Nome

O seu nome a apresentar, mostrado em toda a aplicação. Este campo é obrigatório e não pode ficar vazio.

### Regras do Utilizador

As Regras do Utilizador são instruções personalizadas injetadas automaticamente em todos os pedidos à IA — tanto no construtor de workflows como no chat do dashboard. No **construtor de workflows** ([Assistente de IA](./ai-assistant.md)), são anexadas ao prompt de sistema utilizado para gerar o JSON do workflow. No **chat do dashboard**, são aplicadas como contexto ao nível do sistema. Escreve-as uma vez e aplicam-se globalmente, sem necessidade de as repetir em cada prompt.

**Utilizações comuns:**

- Idioma ou tom: `Responder sempre em português. Manter as respostas concisas.`
- Estilo de código: `Usar padrões async/await. Preferir interfaces TypeScript em vez de types.`
- Convenções de workflow: `Incluir tratamento de erros em todos os workflows. Usar etiquetas de nó descritivas.`
- Formato de resposta: `Usar listas com marcas. Evitar explicações extensas.`

**Onde se aplicam:**

| Contexto | Descrição |
|---------|-------------|
| **Construtor de workflows** | Pedidos do [Assistente de IA](./ai-assistant.md) para gerar ou modificar workflows |
| **Chat do dashboard** | Todas as conversas do [separador Chat](../tabs/chat-tab.md) |

As Regras do Utilizador são injetadas ao nível do sistema — são executadas antes de cada prompt automaticamente, sem qualquer configuração adicional por workflow ou conversa.

### Guardar Alterações do Perfil

Clique em **Guardar Alterações** para aplicar. As alterações entram em vigor imediatamente para todos os novos pedidos à IA.

## Separador Segurança

### Alterar Palavra-passe

Utilize o separador Segurança para atualizar a palavra-passe da sua conta.

**Requisitos:**

| Regra | Requisito |
|------|-------------|
| Comprimento mínimo | 8 caracteres |
| Maiúsculas | Pelo menos uma letra maiúscula (A–Z) |
| Minúsculas | Pelo menos uma letra minúscula (a–z) |
| Dígito | Pelo menos um número (0–9) |

A palavra-passe também deve ser diferente da sua palavra-passe atual. Estas regras são aplicadas tanto no frontend como no backend.

**Passos:**

1. Introduza a sua **Palavra-passe Atual**
2. Introduza a sua **Nova Palavra-passe** (deve cumprir todos os requisitos acima)
3. Volte a introduzi-la em **Confirmar Nova Palavra-passe**
4. Clique em **Atualizar Palavra-passe**

Se a palavra-passe atual estiver incorreta, é apresentada uma mensagem de erro em linha. Em caso de sucesso, aparece uma mensagem de confirmação e o formulário é reiniciado automaticamente.

## Separador Voz

O separador Voz configura a voz falada para o [separador Chat](../tabs/chat-tab.md): escolha uma **credencial ElevenLabs** (ou adicione uma em linha), selecione uma **Voz** da sua conta ElevenLabs e clique em **Guardar Definições de Voz**. Isto ativa a leitura em voz alta por mensagem e o modo de voz interativo. Consulte [Voz do Chat (TTS e STT)](./chat-voice.md) para o fluxo completo.

## Separador Predefinições de IA

O separador Predefinições de IA tem duas secções.

### Credencial e modelo preferidos

Escolha uma **credencial LLM preferida** e um **modelo** da mesma. Esta torna-se a predefinição inicial para todas as funcionalidades de IA na aplicação — chat, o [Assistente de IA](./ai-assistant.md) (construtor, analisador e criação de workflows), mapeador de board, widgets de IA do dashboard, [chat de docs](../tabs/chat-tab.md), o auxiliar de esquema de IA das tabelas de dados, o construtor de expressões e as avaliações — sempre que essa superfície não tenha uma seleção própria guardada.

A regra de seleção que cada superfície segue é:

1. **Seleção guardada** — uma escolha que já fez nessa superfície (por exemplo, o último modelo de uma conversa de chat) prevalece sempre.
2. **Preferida** — utilizada quando não existe uma seleção guardada.
3. **Primeira credencial disponível** — a alternativa quando não definiu qualquer preferência.

Pode continuar a alterar a credencial e o modelo por superfície em qualquer momento; a preferência apenas preenche a predefinição inicial. Deixe a credencial como **Sem preferência** para manter o comportamento anterior de primeira credencial. Se a sua credencial preferida for posteriormente eliminada ou deixar de estar partilhada, o separador mostra um aviso e as superfícies recorrem silenciosamente à primeira credencial disponível.

### Utilização do pacote de codificação

Para cada credencial **Codex** (incluindo as partilhadas), o separador apresenta a utilização restante do limite de taxa como uma barra horizontal por janela ativa — por exemplo, uma janela de **5 horas** e/ou uma janela **Semanal**, dependendo do seu plano. Cada barra mostra a percentagem de quota restante e uma contagem decrescente para a reposição. Um botão **Atualizar** volta a obter os dados a pedido (os resultados são colocados em cache brevemente no servidor).

Para cada credencial **OpenCode**, o separador apresenta as janelas de subscrição do OpenCode Go — **5 horas**, **Semanal** e **Mensal** — com o mesmo estilo de barra, lidas a partir do endpoint de utilização autenticado do gateway com a chave de API dessa credencial. Uma janela que atingiu o seu limite é apresentada como **"limite atingido"** em âmbar. Se a chave for inválida ou o espaço de trabalho não tiver uma subscrição Go, o cartão indica o motivo em vez de mostrar barras.

## Separador Observabilidade

O separador Observabilidade mostra o estado apenas de leitura do [OpenTelemetry Tracing](./opentelemetry.md) para esta instância: se o tracing está ativado, o endpoint OTLP, o nome do serviço, a proporção do amostrador e que spans são emitidos. O tracing é configurado através de variáveis de ambiente `HEYM_OTEL_*` no backend, pelo que este separador não edita nada. Quando o tracing está desativado, o separador lista as variáveis de ambiente necessárias para o ativar. Segredos como cabeçalhos de autenticação OTLP nunca são mostrados aqui. Consulte [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) para a referência completa de configuração.

## Separador SSO

Visível apenas para administradores da instância — as contas listadas em `HEYM_ADMIN_EMAILS`. Este separador liga o Heym a um fornecedor externo OpenID Connect para que as pessoas iniciem sessão com as contas que já possuem. Introduza um URL de emissor e credenciais de cliente, copie o URI de redirecionamento apenas de leitura para o seu fornecedor e execute **Testar ligação** antes de o ativar. O início de sessão por palavra-passe pode ser desativado a partir daqui assim que o teste for bem-sucedido. Consulte [Início de Sessão Único](./sso.md) para a configuração completa.

## Separador Heym Work

Os administradores de instância ligam aqui o [Heym Work](./heym-work.md), a interface para equipas de negócios: o respetivo endereço, uma chave de integração apresentada uma única vez e o seletor **Enable Heym Work**. O separador mostra também quando o Heym Work comunicou pela última vez, a sua versão e o estado da licença. Consulte [Ligar o Heym Work](./heym-work.md#connecting-heym-work).

## Separador Instâncias

Visível apenas para administradores da instância — as contas listadas em `HEYM_ADMIN_EMAILS`. Este separador lista as instâncias Heym ligadas a esta base de dados e define como as execuções em segundo plano são divididas entre elas. Cada linha mostra o nome editável da instância, o seu papel, se está ativa, a latência medida até à base de dados, um interruptor de ligar/desligar e o seu peso. Os pesos são quotas das instâncias que podem atualmente assumir trabalho, não percentagens de 100: com `41 / 26 / 33` e a terceira instância desligada, as duas primeiras recebem realmente 61% e 39%. O painel imprime essa divisão efetiva por baixo da tabela e só recusa guardar quando nenhuma instância ativada tem peso algum.

**Atribuir automaticamente uma quota a novas instâncias** está ativado por predefinição: uma instância que se junta ficaria de outra forma com peso 0 e não receberia nada, pelo que o líder atribui-lhe uma quota igual uma vez e reduz os pesos existentes mantendo as suas proporções. Nunca altera uma instância cujo peso tenha sido definido por si.

O painel também indica quantas das execuções das últimas 24 horas só puderam ser executadas na instância principal. Quando essa quota é elevada, os pesos abaixo não conseguem mover esse trabalho. Consulte [Distribuição de Carga](./cluster.md) para saber o que permanece na principal e como escolher os números.

## O Que Não Está Nesta Caixa de Diálogo

| Funcionalidade | Onde Encontrar |
|---------|-----------------|
| **Gestão de chaves de API (MCP)** | [Separador MCP](../tabs/mcp-tab.md) – ver, copiar e regenerar a sua chave de API do servidor MCP |
| **Tema (escuro / claro)** | Botão de alternância Sol/Lua no cabeçalho (junto ao distintivo do utilizador) |
| **Alteração de email** | Atualmente não suportado |

## Relacionado

- [Assistente de IA](./ai-assistant.md) – Chat do construtor de Workflows que utiliza as Regras de Utilizador
- [Separador Chat](../tabs/chat-tab.md) – Chat do Dashboard que utiliza as Regras de Utilizador
- [Voz do Chat (TTS e STT)](./chat-voice.md) – Voz ElevenLabs configurada no separador Voz
- [Separador MCP](../tabs/mcp-tab.md) – Chave de API do servidor MCP e exposição de ferramentas de workflow
- [Separador Credenciais](../tabs/credentials-tab.md) – Chaves de API para nós de IA e integrações
- [Segurança](./security.md) – Gestão de sessões, limitação de taxa, encriptação de credenciais
- [Início de Sessão Único](./sso.md) – Ligar um fornecedor externo OpenID Connect
- [OpenTelemetry Tracing](./opentelemetry.md) – Tracing distribuído para execuções de workflows e nós
