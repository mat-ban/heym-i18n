# Segurança

Práticas de segurança e configuração para a plataforma Heym.

## Política de Senhas

Todas as senhas — no cadastro e ao alterar sua senha — devem atender aos seguintes requisitos:

| Regra | Requisito |
|------|-------------|
| Comprimento mínimo | 8 caracteres |
| Maiúscula | Pelo menos uma letra maiúscula (A–Z) |
| Minúscula | Pelo menos uma letra minúscula (a–z) |
| Dígito | Pelo menos um número (0–9) |

Essas regras são aplicadas tanto no frontend quanto no backend (validador Pydantic). Uma requisição com senha não compatível é rejeitada com uma resposta `422 Unprocessable Entity` antes que qualquer gravação no banco de dados ocorra.

**Exemplo de senha válida:** `MyWorkflow7!`

## Gerenciamento de Sessão

- Os access tokens são armazenados em cookies **HttpOnly**, não em `localStorage`. Isso impede que JavaScript (incluindo payloads de XSS) leia o token.
- O refresh token é restrito ao caminho `/api/auth/refresh` e não pode ser enviado para outros endpoints.
- Cada chamada a `/api/auth/refresh` **rotaciona** o refresh token: o token antigo é imediatamente revogado e um novo é emitido. Reutilizar um refresh token já usado retorna `401`.

## Rate Limiting

Os seguintes endpoints possuem rate limiting por IP:

| Endpoint | Limite | Duração do banimento |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (clientes OAuth) | 5 req / 60 s | 10 min |
| Login do Portal | 3 tentativas | 24 h |

Quando `REDIS_URL` está configurado, os rate limits são compartilhados entre todos os workers do backend. Sem ele, os limites se aplicam por processo worker.

## Criptografia de Credenciais

Todas as API keys, webhook URLs e bearer tokens armazenados no painel de [Credentials](../tabs/credentials-tab.md) são criptografados em repouso usando AES-256 (Fernet) antes de serem gravados no banco de dados. A chave é derivada da variável de ambiente `ENCRYPTION_KEY`. Os scripts `run.sh` e `deploy.sh` geram um valor forte automaticamente quando ela está vazia; a aplicação se recusa a iniciar se `ENCRYPTION_KEY` estiver vazia ou mantida em um placeholder conhecido.

## MCP API Key

A MCP API key é usada para autenticar clientes MCP externos que se conectam ao endpoint `/api/mcp/sse`. Quando a conexão SSE é estabelecida, um token de sessão de curta duração (1 hora) é emitido e incorporado na URL do endpoint de mensagens em vez da API key real, evitando que a chave apareça nos logs de acesso do servidor. Consulte a [MCP Tab](../tabs/mcp-tab.md) para configuração.

## OAuth / PKCE

O servidor de autorização OAuth 2.0 (usado para clientes MCP) suporta apenas o grant `authorization_code` com PKCE (`S256`). O formulário de consentimento usa tokens CSRF HMAC-SHA256 válidos por 10 minutos. Todos os valores exibidos na página de consentimento são escapados em HTML.

## Execution Tokens

Os [execution tokens](./execution-tokens.md) são JWTs com escopo para chamar o endpoint de execução de um workflow a partir de sistemas externos. Diferentemente dos tokens de sessão de usuário, eles são:

- **Com escopo de workflow único** — um token é rejeitado para qualquer outro workflow.
- **Revogáveis de forma independente** — revogar um token não afeta a sessão do usuário que o emitiu.
- **De curta ou longa duração** — escolha um TTL de 60 segundos a 10 anos.

Os tokens são assinados com o mesmo segredo da aplicação (`SECRET_KEY`) e verificados em cada requisição: assinatura, expiração, correspondência da claim `wid` e status de revogação. Consulte [Execution Tokens](./execution-tokens.md) para configuração e referência da API.

## Segurança de Conteúdo

Use [Guardrails](./guardrails.md) em Nós LLM e Agente para bloquear mensagens de usuário inseguras ou que violem políticas antes que cheguem ao modelo. Os Guardrails suportam nove categorias de conteúdo (violência, discurso de ódio, conteúdo sexual, etc.) com níveis de sensibilidade configuráveis.

## Sandbox de Ferramentas Python

Ferramentas Python definidas pelo usuário no [Nó Agente](../nodes/agent-node.md) executam código não confiável. Por padrão, o Heym executa cada ferramenta dentro de um container Docker descartável e reforçado com:

- sem acesso à rede,
- um sistema de arquivos raiz somente leitura com um pequeno diretório de trabalho `tmpfs`,
- um usuário não-root com todas as capabilities do Linux removidas e `no-new-privileges`,
- limites estritos de CPU, memória e PID, e
- **sem Docker socket** montado, de modo que uma ferramenta não possa alcançar o daemon Docker do host.

O backend de execução é controlado pela variável de ambiente `HEYM_PYTHON_TOOL_SANDBOX`:

| Valor | Comportamento |
|-------|----------|
| `auto` (padrão) | Executa no container Docker reforçado. Se o Docker estiver indisponível, a execução **falha de forma segura** — ela não executa silenciosamente código não confiável sem isolamento do sistema operacional. |
| `docker` | Igual a `auto`, mas nunca faz fallback. |
| `subprocess` | Executa em um subprocesso local em processo, protegido por uma allowlist de importação. Isso **não é uma fronteira de segurança** e destina-se apenas a código confiável ou desenvolvimento local. O `run.sh` o seleciona para desenvolvimento nativo. |

Defina `HEYM_PYTHON_TOOL_IMAGE` para fixar a imagem do sandbox; quando vazia, o Heym detecta automaticamente a imagem do backend em execução. As restrições em processo (uma allowlist de importação mais filtragem de atributos e introspecção) são aplicadas como defesa em profundidade, mas o container é a verdadeira fronteira de isolamento — mantenha o modo padrão `auto` (ou `docker`) para implantações multiusuário e de produção.
## Sandbox de Skill

Skills Python anexadas a um [Nó Agente](../nodes/agent-node.md) também executam código não confiável — uma skill pode chegar literalmente dentro de um Workflow compartilhado ou de um template com visibilidade `everyone` — portanto, as skills passam pelo **mesmo** switch `HEYM_PYTHON_TOOL_SANDBOX` que as ferramentas Python e falham de forma segura da mesma maneira. O contêiner de skill é endurecido de forma idêntica (não-root, todas as capabilities removidas, `no-new-privileges`, sistema de arquivos raiz somente leitura, limites de CPU/memória/PID e **sem Docker socket**), com duas diferenças deliberadas porque as skills legitimamente precisam delas:

- **A saída de rede é permitida** (as skills chamam APIs e instalam suas próprias dependências via `uv`), e
- **um workspace gravável é montado** para que as skills possam gerar arquivos de saída e ler arquivos do Heym Drive.

O workspace é compartilhado com o contêiner irmão descartável através do mesmo volume Docker nomeado que o executor do Codex usa (`heym-codex-workspaces`, montado em `/app/data/codex-workspaces`). Apenas o subdiretório da própria execução é montado no irmão — via um `volume-subpath` por execução — de modo que uma skill nunca vê os dados de workspace de outra execução ou do Codex. A stack do Docker Compose sempre monta esse volume; o `docker run` de contêiner único deve incluir `-v heym-codex-workspaces:/app/data/codex-workspaces` tanto para skills Python quanto para o Codex. Se o volume estiver ausente nos modos `auto`/`docker`, a execução da skill **falha de forma segura** em vez de rodar no backend. Como as montagens de subpath por execução exigem **Docker Engine 25.0 ou mais recente**, engines mais antigos devem atualizar ou executar skills confiáveis com `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Apenas variáveis de ambiente portáveis e não secretas (configurações de proxy e CA-bundle, locale) são repassadas para o contêiner; URLs de banco de dados, `SECRET_KEY`/`ENCRYPTION_KEY`, chaves de API de provedores e segredos OAuth são retidos por uma allowlist. Os caminhos de arquivo das skills são validados para permanecerem dentro do workspace, e symlinks plantados no diretório de saída (incluindo o sentinel `_hitl_request.json`) nunca são seguidos. Substitua os padrões com `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` e `HEYM_SKILL_USER`, se necessário.

Assim como nas ferramentas, o modo `subprocess` executa a skill no processo do backend e **não é uma fronteira de segurança** — use-o apenas para desenvolvimento local ou de usuário único confiável (`run.sh` o seleciona para desenvolvimento nativo).

## Sandbox do Nó Code

O [Nó Code](../nodes/code-node.md) executa Python arbitrário do usuário junto com dependências de terceiros arbitrárias, portanto é o mais rigoroso dos três sandboxes e o único com **nenhuma válvula de escape**: ele não lê nenhuma variável de modo de sandbox, não tem modo `subprocess` e falha de forma segura quando nenhum daemon Docker está acessível. Ele nunca recorre à execução de código do usuário no processo do backend.

A execução consiste em um ou dois contêineres descartáveis, ambos endurecidos como os sandboxes de ferramentas e skills (não-root, todas as capabilities removidas, `no-new-privileges`, sistema de arquivos raiz somente leitura, limites de CPU/memória/PID e **sem Docker socket**):

- Com um `requirements.txt` vazio, um **contêiner único com `--network none`** executa o código. O runner chega no payload de stdin do contêiner, então nada é montado.
- Com dependências, um primeiro contêiner as instala com acesso à rede em um diretório `.deps` por execução, e um segundo contêiner monta essa subárvore **somente leitura** e executa o código. O contêiner de execução não tem rede, a menos que a opção `codeAllowNetwork` do nó esteja ativada.

As dependências são instaladas com `uv`, com nova tentativa via `pip`, e nunca são cacheadas entre execuções. Quando o backend roda em um contêiner, o diretório por execução fica no mesmo volume `heym-codex-workspaces` que o sandbox de skill usa, montado através de um `volume-subpath` por execução, de modo que uma execução nunca vê os arquivos de outra; essa forma exige **Docker Engine 25.0 ou mais recente**. Um backend nativo (`./run.sh`) não tem esse volume e não precisa dele — seu diretório por execução é um caminho temporário local montado diretamente no irmão via bind mount. De qualquer forma, o diretório é excluído após cada execução, independentemente do resultado.

Apenas variáveis de ambiente portáveis e não secretas são repassadas para os contêineres — configurações de proxy, CA bundles e locale, que a instalação de dependências precisa para alcançar o PyPI atrás de um proxy corporativo. URLs de banco de dados, `SECRET_KEY`/`ENCRYPTION_KEY`, chaves de API de provedores e segredos OAuth são retidos por uma allowlist, de modo que um novo segredo do backend é descartado por padrão em vez de vazar até que alguém atualize uma denylist. O `HOME` do backend nunca sobrescreve o próprio caminho gravável do sandbox.

O botão **Format** usa o mesmo sandbox. O Ruff analisa e reescreve o código-fonte em vez de executá-lo, mas executá-lo no host do backend entregaria a um arquivo não confiável um processo que herda todo o ambiente do backend, então ele recebe seu próprio contêiner descartável `--network none` com os mesmos limites e o mesmo ambiente em allowlist. Ele falha de forma segura sem Docker em vez de formatar no host.

Os limites do sandbox são constantes em vez de variáveis de ambiente — 512 MB de memória, uma CPU, 256 processos, um timeout de instalação de 120 segundos e um timeout de execução de 60 segundos. A imagem é resolvida a partir da cadeia existente `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; o nó não introduz nenhuma configuração própria.
## Relacionados

- [Execução e Implantação](../getting-started/running-and-deployment.md) – Configure `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` e `HEYM_PYTHON_TOOL_SANDBOX` na inicialização
- [Nó de Código](../nodes/code-node.md) – Execução de Python em sandbox com suas próprias dependências
- [Nó Agente](../nodes/agent-node.md) – Ferramentas Python personalizadas que são executadas no sandbox
- [Tokens de Execução](./execution-tokens.md) – JWTs com escopo para chamar Workflows a partir de sistemas externos
- [Guardrails](./guardrails.md) – Bloqueie conteúdo inseguro em Nós LLM e Agente
- [Configurações](./user-settings.md) – Altere sua senha
- [Aba Credenciais](../tabs/credentials-tab.md) – Gerencie chaves de API
- [Aba MCP](../tabs/mcp-tab.md) – Chave de API MCP e clientes OAuth
- [Portal](./portal.md) – Controle de acesso ao portal de chat público
