# Heym Work

**Heym Work** é uma segunda interface para equipas de negócio, construída sobre o Heym. Os utilizadores descrevem uma tarefa com as suas próprias palavras, respondem a algumas perguntas e obtêm um workflow criado e testado pelo Heym. Trabalham a partir de páginas criadas para eles, respondem a revisões e visualizam cada execução associada ao respetivo responsável. O Heym executa cada tarefa em segundo plano.

O Heym Work funciona como um contentor próprio ao lado do Heym, com uma licença separada da equipa do Heym. Saiba mais e solicite uma versão de avaliação em [heym.run/enterprise](https://heym.run/enterprise). Assista ao [vídeo de apresentação do Heym Work](https://youtu.be/5Z2gGo6bcpU) para uma visita guiada de dois minutos.

## O que as equipas de negócio obtêm

| Área | O que faz |
|------|-----------|
| **Chat** | Descreva uma tarefa através de texto ou por voz. O Heym solicita as informações necessárias, cria o workflow, testa-o e marca-o como Verificado. |
| **Páginas** | Páginas fixadas com widgets: números, gráficos, tabelas com etiquetas de estado, áreas para largar ficheiros e aprovações. Uma linha da tabela pode abrir uma página de detalhes própria. |
| **Aprovações** | As revisões provenientes de passos [Human-in-the-Loop](./human-in-the-loop.md) aguardam em Atividade e nas páginas, com as opções Aprovar, Solicitar alterações e Rejeitar. |
| **Atividade** | Cada execução, com a indicação de quem a iniciou e da instância que a executou. |
| **Funções** | Proprietário, Editor e Visualizador. O início de sessão é feito através do [Single Sign-On](./sso.md) já utilizado pelo Heym. |
| **Edições setoriais** | As edições jurídica, educação, finanças, logística, energia e comércio eletrónico abrem com páginas, dados de exemplo e workflows específicos para cada setor. |

## Ligar o Heym Work

Assista ao [vídeo de instalação](https://youtu.be/zXGfg1HPSLk) para conhecer todo o processo de configuração, desde o primeiro comando até à página inicial.

A ligação é configurada em **Definições → Heym Work**. O separador só surge para administradores da instância indicados em `HEYM_ADMIN_EMAILS`.

| Campo | O que faz |
|-------|-----------|
| **Endereço do Heym Work** | Onde o Heym Work é executado, por exemplo `https://work.example.com`. O início de sessão redireciona para lá. Prima **Guardar**. |
| **Chave de integração** | **Gerar chave** cria a chave que o Heym Work utiliza para cada pedido ao Heym. É apresentada apenas uma vez, com um botão para copiar. O Heym guarda apenas o seu hash. |
| **Ativar Heym Work** | Liga a ligação. Requer previamente o endereço e uma chave. |
| Estado | **Visto pela última vez**, **Versão do Work** e **Licença**, conforme comunicado pelo Heym Work no relatório mais recente. |

De seguida, abra o endereço do Heym Work e conclua a configuração:

1. **Licença**: introduza a chave de licença fornecida pela equipa do Heym.
2. **Heym**: introduza o endereço do Heym e a chave de integração.
3. **Proprietário**: inicie sessão com uma conta registada como Proprietário do Heym Work.

A página inicial abre-se, pronta para a equipa.

### Rodar a chave

**Rodar chave** substitui a chave de integração. O Heym Work deixará de funcionar até que a nova chave seja aí introduzida, e todos os utilizadores com sessão iniciada no Heym Work serão desligados. Utilize esta funcionalidade caso suspeite de fuga da chave ou na saída de um colaborador que tenha tido acesso a ela.

### Desativar a ligação

Desative **Ativar Heym Work** para interromper a ligação. O Heym Work pedirá novamente a chave do Heym. O Heym continua a executar todos os workflows, agendamentos e webhooks em qualquer situação.

## Modelo de segurança

- **Todas as alterações passam pelo Heym.** O Heym Work lê os dados apresentados a partir da base de dados do Heym e envia todas as ações para o Heym através do canal protegido por chave, onde o Heym aplica as suas próprias regras de acesso. O Heym Work guarda os seus próprios dados num esquema separado `heym_work`.
- **A chave é guardada sob a forma de hash.** O Heym compara o hash da chave fornecida e nunca armazena a chave original.
- **A autenticação permanece no Heym.** Os utilizadores iniciam sessão através do Heym, recorrendo ao respetivo fornecedor de identidade quando o [SSO](./sso.md) está ativo.
- **As alterações são auditadas.** Guardar a ligação e rodar a chave registam entradas `work_integration.update` e `work_integration.key_rotate` no [registo de auditoria](./audit.md).

## Licenciamento

O Heym Work necessita de uma chave de licença própria emitida pela equipa do Heym. Diariamente, o Heym Work envia para heym.run o seu ID de licença, um ID de instalação, o número de utilizadores ativos nos últimos 30 dias, o número total de membros, as execuções nas últimas 24 horas e as versões do Heym e do Heym Work. Os conteúdos dos workflows, entradas, saídas e credenciais permanecem sempre nos seus servidores.

Caso a sincronização diária falhe durante 30 dias, tem início um período de tolerância de 14 dias, após o qual a interface do Heym Work solicitará uma chave a um Proprietário. Uma versão de avaliação vigora até ao seu último dia e é reativada quando a equipa do Heym a renova (com o limite de uma avaliação por instalação). O Heym continua em funcionamento normal durante todo o processo. Redes sem acesso à Internet utilizam uma licença offline disponível através de enterprise@heym.run.

## Vídeos

Todos os vídeos do Heym Work encontram-se na [lista de reprodução Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Temas relacionados

- [Enterprise](./enterprise.md): Licenciamento comercial e suporte
- [Single Sign-On](./sso.md): O início de sessão utilizado pelo Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): As revisões apresentadas no Heym Work
- [Registo de auditoria](./audit.md): As linhas registadas pelas alterações na ligação
- [Definições](./user-settings.md): Onde se localiza o separador Heym Work
