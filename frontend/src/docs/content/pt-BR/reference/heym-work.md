# Heym Work

**Heym Work** é uma segunda interface para equipes de negócios, desenvolvida sobre o Heym. Os usuários descrevem uma tarefa em suas próprias palavras, respondem a algumas perguntas e obtêm um workflow criado e testado pelo Heym. Trabalham a partir de páginas criadas para eles, respondem a revisões e visualizam cada execução com o nome de quem a iniciou. O Heym executa cada tarefa em segundo plano.

O Heym Work roda como seu próprio contêiner ao lado do Heym, com uma licença separada da equipe do Heym. Saiba mais e solicite uma avaliação em [heym.run/enterprise](https://heym.run/enterprise). Assista ao [vídeo do Heym Work](https://youtu.be/5Z2gGo6bcpU) para um tour de dois minutos.

## O que as equipes de negócios recebem

| Área | O que faz |
|------|-----------|
| **Chat** | Descreva uma tarefa digitando ou por voz. O Heym pergunta o que precisa, cria o workflow, testa e marca como Verificado. |
| **Flows** | Os editores criam um flow a partir de opções em vez de um canvas: o que o inicia, um rascunho de IA opcional e ações no Slack, Google Sheets e e-mail. As respostas do Slack continuam a execução, e as aprovações também aguardam em Atividade. Veja [Flows](#flows). |
| **Páginas** | Páginas fixadas com widgets: números, gráficos, tabelas com chips de status, áreas para soltar arquivos e aprovações. Uma linha de tabela pode abrir sua própria página de detalhes. |
| **Aprovações** | As revisões das etapas de [Human-in-the-Loop](./human-in-the-loop.md) aguardam em Atividade e nas páginas, com Aprovar, Solicitar alterações e Rejeitar. |
| **Atividade** | Cada execução, com a pessoa que a iniciou e a instância que a executou. |
| **Funções** | Proprietário, Editor e Visualizador. O login é feito com o [Single Sign-On](./sso.md) que o Heym já utiliza. |
| **Edições setoriais** | As edições para os setores jurídico, educacional, financeiro, logístico, energético e de comércio eletrônico abrem com páginas, dados de exemplo e workflows específicos da área. |

## Flows

**Flows** está no menu do Heym Work para Editores e Proprietários. Um flow é composto por escolhas em vez de nós, e o Heym Work salva-o como um workflow Heym comum através da API do Heym, em nome da pessoa que o criou. Aplicam-se as regras de acesso, histórico de edições e sincronização de triggers do Heym como no editor, e cada execução aparece em Atividade como qualquer outra.

| Parte | Opções |
|---|---|
| **O que o inicia** | Sob demanda, por agendamento, em uma mensagem do Slack, quando uma aba do Google Sheets é alterada (linhas adicionadas, modificadas ou excluídas) ou quando um e-mail chega à caixa de entrada. Os triggers de planilha e e-mail verificam a cada 1, 5, 15 ou 60 minutos. |
| **Rascunho de IA** (opcional) | Um modelo e instruções transformam o que iniciou o flow em texto para as etapas seguintes. Um flow que não comece a partir de uma planilha ou e-mail pode ler primeiro mensagens recentes do Slack de um canal ou thread. |
| **O que acontece a seguir** | Ações em ordem, em qualquer uma das três ferramentas, independentemente do que iniciou o flow. **Slack:** mensagem de canal, mensagem direta, formulário, mensagem com botões, aprovação, resposta a thread, atualização de mensagem e resultado final. **Google Sheets:** adicionar uma linha ou atualizar a linha que mudou. **E-mail:** enviar um e-mail. |

- **As respostas continuam a execução.** Uma aprovação, botões ou formulário pausam a execução até alguém responder no Slack. Uma aprovação também aguarda em Atividade, e uma decisão em qualquer um dos locais remove os botões da mensagem do Slack. As etapas posteriores do Slack permanecem na thread da primeira mensagem.
- **Um único card de Conexões.** Cada flow mostra o workspace do Slack, a conta do Google Sheets e as caixas de correio de onde lê e envia. São credenciais do Heym: **Slack Bot** (token de bot, `xoxb-…`), **Google Sheets**, **IMAP** e **SMTP**; uma credencial ausente pode ser adicionada a partir do próprio flow.
- **Um app Slack para cada flow.** No aplicativo Slack, defina a URL de Requisição de Interatividade para `https://<seu Heym>/api/slack/interactions/<id credencial>` e a URL de Requisição de Inscrições de Eventos para `https://<seu Heym>/api/slack/events/<id credencial>`. O Heym Work mostra ambos para a conexão escolhida. Todos os flows associados a essa credencial compartilham-nos.
- **Os triggers do Slack escolhem o que ouvem:** mensagens em canais e DMs, mensagens diretas ao bot, menções ao bot ou mensagens em um único canal. As próprias publicações do bot nunca iniciam um flow.
- **Requisitos.** Os flows exigem o Heym 0.0.131 ou posterior.

As etapas construídas por um flow são os mesmos nós que você pode usar no canvas: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) e [Cron](../nodes/cron-node.md).

## Conectando o Heym Work

Assista ao [vídeo de instalação](https://youtu.be/zXGfg1HPSLk) para conferir toda a configuração, do primeiro comando à tela inicial.

A conexão é configurada em **Configurações → Heym Work**. A aba só aparece para administradores da instância listados em `HEYM_ADMIN_EMAILS`.

| Campo | O que faz |
|-------|-----------|
| **Endereço do Heym Work** | Onde o Heym Work roda, por exemplo `https://work.example.com`. O login retorna para lá. Clique em **Salvar**. |
| **Chave de integração** | **Gerar chave** cria a chave que o Heym Work usa para cada requisição ao Heym. Ela é exibida uma única vez, com um botão de cópia. O Heym armazena apenas seu hash. |
| **Ativar Heym Work** | Liga a conexão. É necessário informar o endereço e uma chave antes. |
| **Edições para setores e equipes** | Edições para área jurídica, educação, finanças, logística, energia e e-commerce, além de edições de TI, vendas, marketing e RH para equipes empresariais, abrem com páginas, dados de exemplo e workflows dedicados. |

Depois, abra o endereço do Heym Work e conclua sua configuração:

1. **Licença**: insira a chave de licença enviada pela equipe do Heym.
2. **Heym**: informe o endereço do Heym e a chave de integração.
3. **Proprietário**: faça login com uma conta listada como Proprietário do Heym Work.

A tela inicial se abre, pronta para a equipe.

### Rotacionando a chave

**Rotacionar chave** substitui a chave de integração. O Heym Work para de funcionar até que a nova chave seja inserida lá, e todos os usuários conectados ao Heym Work são desconectados. Use esta opção caso a chave tenha vazado ou quando alguém que teve acesso a ela sair da equipe.

### Desativando a conexão

Desative **Ativar Heym Work** para pausar a conexão. O Heym Work solicitará a chave do Heym novamente. O Heym continua executando todos os workflows, agendamentos e webhooks em qualquer situação.

## Modelo de segurança

- **Cada alteração passa pelo Heym.** O Heym Work lê o que exibe a partir do banco de dados do Heym e envia cada ação ao Heym pelo canal protegido por chave, onde o Heym aplica suas próprias regras de acesso. O Heym Work armazena seus dados em um esquema separado `heym_work`.
- **A chave é armazenada com hash.** O Heym compara o hash da chave apresentada e nunca armazena a chave original.
- **O login permanece no Heym.** Os usuários se autenticam através do Heym, usando seu provedor de identidade quando o [SSO](./sso.md) está ativo.
- **As alterações são auditadas.** Salvar a conexão e rotacionar a chave registram linhas `work_integration.update` e `work_integration.key_rotate` no [log de auditoria](./audit.md).

## Licenciamento

O Heym Work precisa de sua própria chave de licença emitida pela equipe do Heym. Diariamente, o Heym Work envia ao heym.run seu ID de licença, um ID de instalação, o número de usuários ativos nos últimos 30 dias, o número total de membros, as execuções nas últimas 24 horas e as versões do Heym e do Heym Work. Conteúdo de workflows, entradas, saídas e credenciais permanecem em seus servidores.

Se a sincronização diária falhar por 30 dias, inicia-se um período de tolerância de 14 dias, após o qual a interface do Heym Work solicitará uma chave a um Proprietário. Uma avaliação funciona até o último dia e reabre quando a equipe do Heym a renova, com uma avaliação por instalação. O Heym segue funcionando normalmente em todo o período. Redes sem acesso à internet usam uma licença offline via enterprise@heym.run.

## Vídeos

Todos os vídeos do Heym Work estão na [playlist do Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Tópicos relacionados

- [Enterprise](./enterprise.md): Licenciamento comercial e suporte
- [Single Sign-On](./sso.md): O login que o Heym Work usa
- [Human-in-the-Loop](./human-in-the-loop.md): As revisões exibidas no Heym Work
- [Log de auditoria](./audit.md): As linhas geradas pelas alterações na conexão
- [Configurações](./user-settings.md): Onde fica a aba do Heym Work
