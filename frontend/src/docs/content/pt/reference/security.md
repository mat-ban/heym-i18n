# Segurança

Práticas de segurança e configuração para a plataforma Heym.

## Política de palavras-passe

Todas as palavras-passe — no registo e ao alterar a sua palavra-passe — devem cumprir os seguintes requisitos:

| Regra | Requisito |
|------|-------------|
| Comprimento mínimo | 8 caracteres |
| Maiúsculas | Pelo menos uma letra maiúscula (A–Z) |
| Minúsculas | Pelo menos uma letra minúscula (a–z) |
| Dígito | Pelo menos um número (0–9) |

Estas regras são aplicadas tanto no frontend como no backend (validador Pydantic). Um pedido com uma palavra-passe não conforme é rejeitado com uma resposta `422 Unprocessable Entity` antes de ocorrer qualquer escrita na base de dados.

**Exemplo de uma palavra-passe válida:** `MyWorkflow7!`

## Gestão de sessões

- Os tokens de acesso são armazenados em cookies **HttpOnly**, e não em `localStorage`. Isto impede que o JavaScript (incluindo payloads XSS) leia o token.
- O token de atualização está limitado ao caminho `/api/auth/refresh` e não pode ser enviado para outros endpoints.
- Cada chamada a `/api/auth/refresh` **roda** o token de atualização: o token antigo é imediatamente revogado e é emitido um novo. Reutilizar um token de atualização já utilizado devolve `401`.

## Limitação de taxa

Os seguintes endpoints estão sujeitos a limitação de taxa por IP:

| Endpoint | Limite | Duração do bloqueio |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 pedidos / 60 s | 15 min |
| `POST /api/auth/register` | 5 pedidos / 60 s | 10 min |
| `POST /register` (clientes OAuth) | 5 pedidos / 60 s | 10 min |
| Início de sessão no Portal | 3 tentativas | 24 h |

Quando `REDIS_URL` está configurado, os limites de taxa são partilhados entre todos os workers do backend. Sem esta configuração, os limites aplicam-se por processo worker.

## Encriptação de credenciais

Todas as chaves de API, URLs de webhook e tokens bearer armazenados no painel [Credenciais](../tabs/credentials-tab.md) são encriptados em repouso com AES-256 (Fernet) antes de serem escritos na base de dados. A chave é derivada da variável de ambiente `ENCRYPTION_KEY`. Os scripts `run.sh` e `deploy.sh` geram automaticamente um valor forte quando esta está vazia; a aplicação recusa iniciar se `ENCRYPTION_KEY` estiver vazia ou mantida num valor de exemplo conhecido.

## Chave de API MCP

A chave de API MCP é utilizada para autenticar clientes MCP externos que se ligam ao endpoint `/api/mcp/sse`. Quando a ligação SSE é estabelecida, é emitido um token de sessão de curta duração (1 hora) que é incorporado no URL do endpoint de mensagens em vez da chave de API real, evitando que a chave apareça nos registos de acesso do servidor. Consulte o [Separador MCP](../tabs/mcp-tab.md) para a configuração.

## OAuth / PKCE

O servidor de autorização OAuth 2.0 (utilizado para clientes MCP) suporta apenas o grant `authorization_code` com PKCE (`S256`). O formulário de consentimento utiliza tokens CSRF HMAC-SHA256 válidos por 10 minutos. Todos os valores apresentados na página de consentimento são escapados em HTML.

## Tokens de execução

Os [tokens de execução](./execution-tokens.md) são JWTs com âmbito definido para chamar o endpoint de execução de um workflow a partir de sistemas externos. Ao contrário dos tokens de sessão de utilizador, estes são:

- **Limitados a um único workflow** — um token é rejeitado para qualquer outro workflow.
- **Revogáveis de forma independente** — revogar um token não tem qualquer efeito sobre a sessão do utilizador que o emitiu.
- **De curta ou longa duração** — escolha um TTL entre 60 segundos e 10 anos.

Os tokens são assinados com o mesmo segredo da aplicação (`SECRET_KEY`) e verificados em cada pedido: assinatura, expiração, correspondência da claim `wid` e estado de revogação. Consulte [Tokens de execução](./execution-tokens.md) para a configuração e referência da API.

## Segurança de conteúdo

Utilize [Guardrails](./guardrails.md) nos nós LLM e de agente para bloquear mensagens de utilizador inseguras ou que violem políticas antes de chegarem ao modelo. Os Guardrails suportam nove categorias de conteúdo (violência, discurso de ódio, conteúdo sexual, etc.) com níveis de sensibilidade configuráveis.

## Sandbox de ferramentas Python

As ferramentas Python definidas pelo utilizador no [Nó de agente](../nodes/agent-node.md) executam código não fidedigno. Por predefinição, o Heym executa cada ferramenta dentro de um contentor Docker descartável e reforçado com:

- sem acesso à rede,
- um sistema de ficheiros raiz só de leitura com um pequeno diretório de trabalho `tmpfs`,
- um utilizador não-root com todas as capacidades Linux removidas e `no-new-privileges`,
- limites estritos de CPU, memória e PID, e
- **sem socket Docker** montado, para que uma ferramenta não possa alcançar o daemon Docker do anfitrião.

O backend de execução é controlado pela variável de ambiente `HEYM_PYTHON_TOOL_SANDBOX`:

| Valor | Comportamento |
|-------|----------|
| `auto` (predefinição) | Executar no contentor Docker reforçado. Se o Docker não estiver disponível, a execução **falha de forma segura** — não executa silenciosamente código não fidedigno sem isolamento do sistema operativo. |
| `docker` | Igual a `auto`, mas nunca recorre a alternativas. |
| `subprocess` | Executar num subprocesso local em processo, protegido por uma lista de importações permitidas. Isto **não é uma fronteira de segurança** e destina-se apenas a código fidedigno ou desenvolvimento local. O `run.sh` seleciona-o para desenvolvimento nativo. |

Defina `HEYM_PYTHON_TOOL_IMAGE` para fixar a imagem da sandbox; quando vazia, o Heym deteta automaticamente a imagem do backend em execução. As restrições em processo (uma lista de importações permitidas, além de filtragem de atributos e introspeção) são aplicadas como defesa em profundidade, mas o contentor é a verdadeira fronteira de isolamento — mantenha o modo predefinido `auto` (ou `docker`) para implementações multiusador e em produção.

## Sandbox de Skills

As skills de Python associadas a um [Nó de agente](../nodes/agent-node.md) também executam código não fidedigno — uma skill pode chegar textualmente dentro de um workflow partilhado ou de um modelo com visibilidade `everyone` — pelo que as skills são executadas através do **mesmo** interruptor `HEYM_PYTHON_TOOL_SANDBOX` que as ferramentas de Python e falham de forma segura da mesma maneira. O contentor de skills é reforçado de forma idêntica (não-root, todas as capacidades removidas, `no-new-privileges`, sistema de ficheiros raiz apenas de leitura, limites de CPU/memória/PID e **sem socket Docker**), com duas diferenças deliberadas porque as skills necessitam legitimamente delas:

- **A saída de rede é permitida** (as skills chamam APIs e instalam as suas próprias dependências via `uv`), e
- **é montado um espaço de trabalho gravável** para que as skills possam gerar ficheiros de saída e ler ficheiros do Heym Drive.

O espaço de trabalho é partilhado com o contentor irmão descartável através do mesmo volume Docker nomeado que o executor do Codex utiliza (`heym-codex-workspaces`, montado em `/app/data/codex-workspaces`). Apenas o subdiretório desta execução é montado no irmão — através de um `volume-subpath` por execução — para que uma skill nunca veja os dados do espaço de trabalho de outra execução ou do Codex. A pilha do Docker Compose monta sempre este volume; o `docker run` de contentor único deve incluir `-v heym-codex-workspaces:/app/data/codex-workspaces` tanto para as skills de Python como para o Codex. Se o volume estiver em falta no modo `auto`/`docker`, a execução da skill **falha de forma segura** em vez de ser executada no backend. Como as montagens de subcaminho por execução exigem o **Docker Engine 25.0 ou mais recente**, os motores mais antigos devem atualizar ou executar skills fidedignas com `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Apenas variáveis de ambiente portáveis e não secretas (definições de proxy e de pacote de CA, locale) são encaminhadas para o contentor; URLs de base de dados, `SECRET_KEY`/`ENCRYPTION_KEY`, chaves de API de fornecedores e segredos OAuth são retidos por uma lista de permissões. Os caminhos dos ficheiros de skills são validados para permanecerem dentro do espaço de trabalho, e as ligações simbólicas colocadas no diretório de saída (incluindo o sentinela `_hitl_request.json`) nunca são seguidas. Substitua os valores predefinidos com `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` e `HEYM_SKILL_USER` se necessário.

Tal como acontece com as ferramentas, o modo `subprocess` executa a skill no processo do backend e **não é uma fronteira de segurança** — utilize-o apenas para desenvolvimento local ou de utilizador único fidedigno (`run.sh` seleciona-o para desenvolvimento nativo).

## Sandbox do Nó de código

O [Nó de código](../nodes/code-node.md) executa Python arbitrário do utilizador juntamente com dependências de terceiros arbitrárias, pelo que é o mais restrito dos três sandboxes e o único com **nenhuma via de escape**: não lê nenhuma variável de modo de sandbox, não tem modo `subprocess` e falha de forma segura quando nenhum daemon Docker está acessível. Nunca recorre à execução de código do utilizador no processo do backend.

A execução consiste em um ou dois contentores descartáveis, ambos reforçados como os sandboxes de ferramentas e de skills (não-root, todas as capacidades removidas, `no-new-privileges`, sistema de ficheiros raiz apenas de leitura, limites de CPU/memória/PID e **sem socket Docker**):

- Com um `requirements.txt` vazio, um **contentor único com `--network none`** executa o código. O executor chega no payload de stdin do contentor, pelo que nada é montado de todo.
- Com dependências, um primeiro contentor instala-as com acesso à rede num diretório `.deps` por execução, e um segundo contentor monta essa subárvore **apenas de leitura** e executa o código. O contentor de execução não tem rede a menos que a opção `codeAllowNetwork` do nó esteja ativada.

As dependências são instaladas com `uv`, repetidas com `pip` e nunca colocadas em cache entre execuções. Quando o backend é executado num contentor, o diretório por execução reside no mesmo volume `heym-codex-workspaces` que o sandbox de skills utiliza, montado através de um `volume-subpath` por execução para que uma execução nunca veja os ficheiros de outra; essa forma exige o **Docker Engine 25.0 ou mais recente**. Um backend nativo (`./run.sh`) não tem esse volume e não precisa dele — o seu diretório por execução é um caminho temporário local montado diretamente no irmão. De qualquer forma, o diretório é eliminado após cada execução, independentemente do resultado.

Apenas variáveis de ambiente portáveis e não secretas são encaminhadas para os contentores — definições de proxy, pacotes de CA e locale, que a instalação de dependências necessita para alcançar o PyPI atrás de um proxy empresarial. URLs de base de dados, `SECRET_KEY`/`ENCRYPTION_KEY`, chaves de API de fornecedores e segredos OAuth são retidos por uma lista de permissões, pelo que um novo segredo do backend é descartado por predefinição em vez de ser exposto até que alguém atualize uma lista de negação. O `HOME` do backend nunca substitui o próprio caminho gravável do sandbox.

O botão **Format** utiliza o mesmo sandbox. O Ruff analisa e reescreve o código-fonte em vez de o executar, mas executá-lo no anfitrião do backend entregaria a um ficheiro não fidedigno um processo que herda todo o ambiente do backend, pelo que obtém o seu próprio contentor descartável `--network none` com os mesmos limites e o mesmo ambiente com lista de permissões. Falha de forma segura sem Docker em vez de formatar no anfitrião.

Os limites do sandbox são constantes em vez de variáveis de ambiente — 512 MB de memória, um CPU, 256 processos, um tempo limite de instalação de 120 segundos e um tempo limite de execução de 60 segundos. A imagem é resolvida a partir da cadeia existente `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; o nó não introduz nenhuma configuração própria.

## Relacionado

- [Execução e Implementação](../getting-started/running-and-deployment.md) – Configure `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` e `HEYM_PYTHON_TOOL_SANDBOX` no arranque
- [Nó de Código](../nodes/code-node.md) – Execução de Python em sandbox com as suas próprias dependências
- [Nó de Agente](../nodes/agent-node.md) – Ferramentas Python personalizadas que são executadas na sandbox
- [Tokens de Execução](./execution-tokens.md) – JWTs com âmbito definido para invocar workflows a partir de sistemas externos
- [Guardrails](./guardrails.md) – Bloqueie conteúdo inseguro em nós LLM e de Agente
- [Definições](./user-settings.md) – Altere a sua palavra-passe
- [Separador Credenciais](../tabs/credentials-tab.md) – Faça a gestão das chaves de API
- [Separador MCP](../tabs/mcp-tab.md) – Chave de API MCP e clientes OAuth
- [Portal](./portal.md) – Controlo de acesso ao portal de chat público
