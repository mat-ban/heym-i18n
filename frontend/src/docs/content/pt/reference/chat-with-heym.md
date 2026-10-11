# Chat com Heym

O Chat com Heym é um assistente ciente da página, disponível no cabeçalho da documentação. Ele abre em uma caixa de diálogo centralizada, permite selecionar uma credencial de LLM e um modelo, e responde a perguntas utilizando a página atual da documentação como seu primeiro contexto.

## Abrindo a Caixa de Diálogo

1. Abra qualquer página em `/docs`
2. Clique em **Chat com Heym** no cabeçalho
3. Selecione uma [credencial](../tabs/credentials-tab.md) e um modelo
4. Faça uma pergunta sobre a página ou sobre a plataforma

Em telas menores, o trigger exibe apenas o ícone; em telas maiores, exibe o rótulo completo.

## Qual Contexto É Utilizado

- O caminho da documentação atualmente aberto é injetado na requisição como orientação contextual
- O backend continua utilizando o endpoint de chat existente do dashboard e as ferramentas de busca na documentação
- As [User Rules](./user-settings.md) no nível da sua conta continuam sendo aplicadas, pois o mesmo backend de chat é reutilizado
- As etapas de preparação em tempo real são transmitidas para o balão do assistente antes da resposta final, de forma semelhante ao chat do dashboard
- Perguntas de esclarecimento aparecem como cards, da mesma forma que na [aba Chat](../tabs/chat-tab.md). Quando uma solicitação de workflow exige uma credencial, você pode selecionar uma ou criá-la a partir do card. Quando exige uma tabela de dados, você pode selecionar uma das suas tabelas ou criar uma nova da mesma forma.

Ao abrir a caixa de diálogo em um artigo específico, um pequeno badge exibe o caminho ativo da documentação, permitindo confirmar qual página está sendo priorizada.

## Comportamento da Sessão

- A seleção de credencial e modelo permanece ativa enquanto a caixa de diálogo estiver montada
- O histórico de mensagens é exclusivo da sessão e é limpo quando a caixa de diálogo é fechada
- O clique no backdrop, a tecla `Escape` e o botão de fechar redefinem a sessão
- **Stop** interrompe a resposta em streaming atual
- A caixa de diálogo é intencionalmente ampla e com tamanho fixo; não oferece alternância para tela cheia

## Quando Utilizá-lo

- Faça perguntas de acompanhamento enquanto lê uma página de nó ou de referência
- Esclareça diferenças entre funcionalidades sem sair da documentação
- Encontre o artigo correto antes de abrir o editor

Se você deseja construir ou modificar workflows diretamente, utilize o [AI Assistant](./ai-assistant.md) do lado do editor.

## Relacionados

- [AI Assistant](./ai-assistant.md) – Chat do editor para construir workflows
- [Aba Credentials](../tabs/credentials-tab.md) – Adicione credenciais de LLM utilizadas pela caixa de diálogo
- [Settings](./user-settings.md) – User Rules globais aplicadas às superfícies de IA
- [Quick Start](../getting-started/quick-start.md) – Primeiro passo a passo de workflow