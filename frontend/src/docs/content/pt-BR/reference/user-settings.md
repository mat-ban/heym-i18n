# Configurações

A caixa de diálogo Configurações permite gerenciar seu perfil, definir instruções persistentes de IA, atualizar a senha da sua conta, configurar a voz do chat, definir sua credencial e modelo de IA padrão e revisar o status de observabilidade. Abra-a clicando em **seu avatar e nome** no canto superior direito do cabeçalho.

## Abrindo a Caixa de Diálogo

Clique em **seu avatar e nome** no canto superior direito do cabeçalho. A caixa de diálogo abre com estas abas: **Perfil**, **Segurança**, **Voz**, **Padrões de IA** e **Observabilidade**. Administradores de instância também veem uma aba **SSO**.

## Aba Perfil

### Foto de Perfil

O Heym exibe sua foto do [Gravatar](https://gravatar.com) referente ao e-mail da sua conta no cabeçalho, ao lado das suas mensagens no [Chat](../tabs/chat-tab.md) e no **Chat with Heym**, nos comentários do [Board](../tabs/board-tab.md) e ao lado do seu nome em caixas de diálogo de compartilhamento e listas de membros da equipe. Para alterá-la, atualize a foto no Gravatar; o Heym captura a nova em algumas horas. Sem uma foto do Gravatar, o Heym exibe a primeira letra do seu nome.

A foto é buscada pelo servidor do Heym e armazenada em cache nele, portanto seu navegador nunca contata o Gravatar. Se o servidor não conseguir acessar o Gravatar, todos continuarão vendo as iniciais.

### Nome

Seu nome de exibição mostrado em todo o aplicativo. Este campo é obrigatório e não pode ficar vazio.

### Regras do Usuário

As Regras do Usuário são instruções personalizadas injetadas automaticamente em cada requisição de IA — tanto no construtor de workflows quanto no chat do dashboard. No **construtor de workflows** ([AI Assistant](./ai-assistant.md)), elas são anexadas ao system prompt usado para gerar o JSON do workflow. No **chat do dashboard**, elas são aplicadas como contexto em nível de sistema. Você as escreve uma vez e elas se aplicam globalmente, sem repeti-las em cada prompt.

**Usos comuns:**

- Idioma ou tom: `Always respond in English. Keep responses concise.`
- Estilo de código: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Convenções de workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Formato de resposta: `Use bullet points. Avoid lengthy explanations.`

**Onde elas se aplicam:**

| Contexto | Descrição |
|---------|-------------|
| **Construtor de workflows** | Requisições do [AI Assistant](./ai-assistant.md) para gerar ou modificar workflows |
| **Chat do dashboard** | Todas as conversas da [aba Chat](../tabs/chat-tab.md) |

As Regras do Usuário são injetadas em nível de sistema — elas são executadas antes de cada prompt automaticamente, sem qualquer configuração extra por workflow ou conversa.

### Salvando Alterações do Perfil

Clique em **Save Changes** para aplicar. As alterações entram em vigor imediatamente para todas as novas requisições de IA.

## Aba Segurança

### Alterar Senha

Use a aba Segurança para atualizar a senha da sua conta.

**Requisitos:**

| Regra | Requisito |
|------|-------------|
| Comprimento mínimo | 8 caracteres |
| Maiúscula | Pelo menos uma letra maiúscula (A–Z) |
| Minúscula | Pelo menos uma letra minúscula (a–z) |
| Dígito | Pelo menos um número (0–9) |

A senha também deve ser diferente da sua senha atual. Essas regras são aplicadas tanto no frontend quanto no backend.

**Passos:**

1. Insira sua **Current Password**
2. Insira sua **New Password** (deve atender a todos os requisitos acima)
3. Redigite em **Confirm New Password**
4. Clique em **Update Password**

Se a senha atual estiver incorreta, uma mensagem de erro inline é exibida. Em caso de sucesso, uma mensagem de confirmação aparece e o formulário é redefinido automaticamente.

## Aba Voz

A aba Voz configura a voz falada para a [aba Chat](../tabs/chat-tab.md): escolha uma **credencial ElevenLabs** (ou adicione uma inline), selecione uma **Voice** da sua conta ElevenLabs e clique em **Save Voice Settings**. Isso habilita a leitura em voz alta por mensagem e o modo de voz interativo. Consulte [Chat Voice (TTS & STT)](./chat-voice.md) para o fluxo completo.

## Aba Padrões de IA

A aba Padrões de IA tem duas seções.

### Credencial e modelo preferidos

Escolha uma **credencial LLM preferida** e um **modelo** a partir dela. Isso se torna o padrão inicial para todos os recursos de IA no aplicativo — chat, o [AI Assistant](./ai-assistant.md) (construtor, analisador e criação de workflows), mapeador de board, widgets de IA do dashboard, [docs chat](../tabs/chat-tab.md), o assistente de schema de IA da tabela de dados, o construtor de expressões e evals — sempre que essa superfície não tiver uma seleção própria salva.

A regra de seleção que cada superfície segue é:

1. **Seleção salva** — uma escolha que você já fez naquela superfície (por exemplo, o último modelo de uma conversa de chat) sempre prevalece.
2. **Preferida** — usada quando não há seleção salva.
3. **Primeira credencial disponível** — o fallback quando você não definiu nenhuma preferência.

Você ainda pode alterar a credencial e o modelo por superfície a qualquer momento; a preferência apenas preenche o padrão inicial. Deixe a credencial como **No preference** para manter o comportamento anterior de primeira credencial. Se sua credencial preferida for posteriormente excluída ou tiver o compartilhamento removido, a aba exibe um aviso e as superfícies recorrem silenciosamente à primeira credencial disponível.
### Uso do pacote de codificação

Para cada credencial do **Codex** (incluindo as compartilhadas), a aba exibe o uso restante do limite de requisições como uma barra horizontal por janela ativa — por exemplo, uma janela de **5 horas** e/ou uma janela **Semanal**, dependendo do seu plano. Cada barra mostra a porcentagem de cota restante e uma contagem regressiva para o reset. Um botão **Refresh** refaz a busca sob demanda (os resultados são armazenados em cache brevemente no servidor).

Para cada credencial do **OpenCode**, a aba exibe as janelas de assinatura do OpenCode Go — **5 horas**, **Semanal** e **Mensal** — no mesmo estilo de barra, lidas a partir do endpoint autenticado de uso do gateway com a API key dessa credencial. Uma janela que atingiu seu limite é exibida como **"limit reached"** em âmbar. Se a key for inválida ou o workspace não tiver uma assinatura Go, o card informa o motivo em vez de exibir as barras.

## Aba Observability

A aba Observability exibe o status somente leitura do [OpenTelemetry Tracing](./opentelemetry.md) para esta instância: se o tracing está habilitado, o endpoint OTLP, o nome do serviço, a proporção do sampler e quais spans são emitidos. O tracing é configurado por meio das variáveis de ambiente `HEYM_OTEL_*` no backend, portanto esta aba não edita nada. Quando o tracing está desabilitado, a aba lista as variáveis de ambiente necessárias para ativá-lo. Segredos como cabeçalhos de autenticação OTLP nunca são exibidos aqui. Consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) para a referência completa de configuração.

## Aba SSO

Visível apenas para administradores da instância — as contas listadas em `HEYM_ADMIN_EMAILS`. Esta aba conecta o Heym a um provedor OpenID Connect externo para que as pessoas façam login com as contas que já possuem. Insira uma URL de issuer e as credenciais do client, copie a redirect URI somente leitura para o seu provedor e execute **Test connection** antes de habilitá-lo. O login por senha pode ser desativado aqui depois que o teste passar. Consulte [Single Sign-On](./sso.md) para a configuração completa.

## Aba Instances

Visível apenas para administradores da instância — as contas listadas em `HEYM_ADMIN_EMAILS`. Esta aba lista as instâncias do Heym conectadas a este banco de dados e define como as execuções em segundo plano são divididas entre elas. Cada linha mostra o nome editável da instância, seu papel, se está ativa, sua latência medida até o banco de dados, um interruptor de ligar/desligar e seu peso. Os pesos são frações das instâncias que podem atualmente assumir trabalho, não porcentagens de 100: com `41 / 26 / 33` e a terceira instância desligada, as duas primeiras realmente recebem 61% e 39%. O painel exibe essa divisão efetiva abaixo da tabela e só se recusa a salvar quando nenhuma instância habilitada tem peso algum.

**Give new instances a share automatically** está ativado por padrão: uma instância que se junta ficaria, de outra forma, com peso 0 e não receberia nada, então o líder concede a ela uma fração igual uma única vez e reduz os pesos existentes mantendo suas proporções. Ele nunca altera uma instância cujo peso você mesmo definiu.

O painel também informa quantas das execuções das últimas 24 horas só puderam ser executadas na instância principal. Quando essa fração é alta, os pesos abaixo dela não conseguem mover esse trabalho. Consulte [Load Distribution](./cluster.md) para saber o que permanece na principal e como escolher os números.

## O Que Não Está Neste Diálogo

| Recurso | Onde Encontrá-lo |
|---------|-----------------|
| **Gerenciamento de API key (MCP)** | [Aba MCP](../tabs/mcp-tab.md) – visualize, copie e regenere sua API key do servidor MCP |
| **Tema (escuro / claro)** | Botão de alternância Sol/Lua no cabeçalho (ao lado do badge do usuário) |
| **Alteração de e-mail** | Atualmente não suportado |

## Relacionados

- [AI Assistant](./ai-assistant.md) – Chat do construtor de Workflow que usa User Rules
- [Aba Chat](../tabs/chat-tab.md) – Chat do Dashboard que usa User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Voz do ElevenLabs configurada na aba Voice
- [Aba MCP](../tabs/mcp-tab.md) – API key do servidor MCP e exposição de ferramentas de workflow
- [Aba Credentials](../tabs/credentials-tab.md) – API keys para nós de IA e integrações
- [Security](./security.md) – Gerenciamento de sessão, limitação de requisições, criptografia de credenciais
- [Single Sign-On](./sso.md) – Conecte um provedor OpenID Connect externo
- [OpenTelemetry Tracing](./opentelemetry.md) – Tracing distribuído para execuções de workflow e nós
