# Heym Work

**Heym Work** é uma segunda interface para equipes de negócios, desenvolvida sobre o Heym. Os usuários descrevem uma tarefa em suas próprias palavras, respondem a algumas perguntas e obtêm um workflow criado e testado pelo Heym. Trabalham a partir de páginas criadas para eles, respondem a revisões e visualizam cada execução com o nome de quem a iniciou. O Heym executa cada tarefa em segundo plano.

O Heym Work roda como seu próprio contêiner ao lado do Heym, com uma licença separada da equipe do Heym. Saiba mais e solicite uma avaliação em [heym.run/enterprise](https://heym.run/enterprise). Assista ao [vídeo do Heym Work](https://youtu.be/5Z2gGo6bcpU) para um tour de dois minutos.

## O que as equipes de negócios recebem

| Área | O que faz |
|------|-----------|
| **Chat** | Descreva uma tarefa digitando ou por voz. O Heym pergunta o que precisa, cria o workflow, testa e marca como Verificado. |
| **Páginas** | Páginas fixadas com widgets: números, gráficos, tabelas com chips de status, áreas para soltar arquivos e aprovações. Uma linha de tabela pode abrir sua própria página de detalhes. |
| **Aprovações** | As revisões das etapas de [Human-in-the-Loop](./human-in-the-loop.md) aguardam em Atividade e nas páginas, com Aprovar, Solicitar alterações e Rejeitar. |
| **Atividade** | Cada execução, com a pessoa que a iniciou e a instância que a executou. |
| **Funções** | Proprietário, Editor e Visualizador. O login é feito com o [Single Sign-On](./sso.md) que o Heym já utiliza. |
| **Edições setoriais** | As edições para os setores jurídico, educacional, financeiro, logístico, energético e de comércio eletrônico abrem com páginas, dados de exemplo e workflows específicos da área. |

## Conectando o Heym Work

Assista ao [vídeo de instalação](https://youtu.be/zXGfg1HPSLk) para conferir toda a configuração, do primeiro comando à tela inicial.

A conexão é configurada em **Configurações → Heym Work**. A aba só aparece para administradores da instância listados em `HEYM_ADMIN_EMAILS`.

| Campo | O que faz |
|-------|-----------|
| **Endereço do Heym Work** | Onde o Heym Work roda, por exemplo `https://work.example.com`. O login retorna para lá. Clique em **Salvar**. |
| **Chave de integração** | **Gerar chave** cria a chave que o Heym Work usa para cada requisição ao Heym. Ela é exibida uma única vez, com um botão de cópia. O Heym armazena apenas seu hash. |
| **Ativar Heym Work** | Liga a conexão. É necessário informar o endereço e uma chave antes. |
| Status | **Visto por último**, **Versão do Work** e **Licença**, conforme informado pelo Heym Work pela última vez. |

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
