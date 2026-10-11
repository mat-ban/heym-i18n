# Chat com Heym

O Chat with Heym é um assistente ciente da página, disponível no cabeçalho da documentação. Ele abre em um diálogo centralizado, permite selecionar uma credencial de LLM e um modelo, e responde a perguntas usando a página atual da documentação como primeiro contexto.

## Abrindo o Diálogo

1. Abra qualquer página em `/docs`
2. Clique em **Chat with Heym** no cabeçalho
3. Selecione uma [credencial](../tabs/credentials-tab.md) e um modelo
4. Faça uma pergunta sobre a página ou sobre a plataforma

Em telas menores, o acionador exibe apenas o ícone; em telas maiores, ele mostra o rótulo completo.

## Qual Contexto Ele Utiliza

- O caminho da documentação aberto no momento é injetado na requisição como orientação contextual
- O backend continua utilizando o endpoint de chat existente do dashboard e as ferramentas de busca na documentação
- Suas [User Rules](./user-settings.md) no nível da conta continuam sendo aplicadas, pois o mesmo backend de chat é reutilizado
- As etapas de preparação em tempo real são transmitidas para o balão do assistente antes da resposta final, de forma semelhante ao chat do dashboard
- Perguntas de esclarecimento aparecem como cards, assim como na [Chat tab](../tabs/chat-tab.md). Quando uma solicitação de workflow precisa de uma credencial, você pode selecionar uma ou criá-la a partir do card. Quando precisa de uma tabela de dados, você pode selecionar uma das suas tabelas ou criar uma nova da mesma forma.

Ao abrir o diálogo em um artigo específico, um pequeno badge exibe o caminho ativo da documentação, para que você possa confirmar qual página está sendo priorizada.

## Comportamento da Sessão

- A seleção de credencial e modelo permanece no lugar enquanto o diálogo estiver montado
- O histórico de mensagens é apenas da sessão e é limpo quando o diálogo é fechado
- O clique no backdrop, a tecla `Escape` e o botão de fechar redefinem a sessão
- **Stop** interrompe a resposta em streaming atual
- O diálogo é intencionalmente amplo e de tamanho fixo; ele não oferece alternância para tela cheia

## Quando Utilizá-lo

- Faça perguntas de acompanhamento enquanto lê um nó ou uma página de referência
- Esclareça diferenças entre recursos sem sair da documentação
- Encontre o artigo certo antes de abrir o editor

Se você deseja construir ou modificar workflows diretamente, utilize o [AI Assistant](./ai-assistant.md) do lado do editor.

## Relacionados

- [AI Assistant](./ai-assistant.md) – Chat do editor para construir workflows
- [Credentials Tab](../tabs/credentials-tab.md) – Adicione credenciais de LLM usadas pelo diálogo
- [Settings](./user-settings.md) – User Rules globais aplicadas às superfícies de IA
- [Quick Start](../getting-started/quick-start.md) – Passo a passo do primeiro workflow
