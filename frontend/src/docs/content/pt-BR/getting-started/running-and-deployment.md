# Execução e Implantação

O Heym fornece dois scripts para ambientes diferentes: `run.sh` para desenvolvimento local e `deploy.sh` para implantações em produção usando Docker Compose.

> **Vídeo tutorial:** [Configure o Heym Localmente em Menos de 2 Minutos](https://www.youtube.com/watch?v=P6YvlupUboU) — clone o repositório, inicie o PostgreSQL, preencha as variáveis de ambiente necessárias e crie sua primeira conta em uma instância local.

## Pré-requisitos

Ambos os scripts exigem que as seguintes ferramentas estejam instaladas:

| Ferramenta | Finalidade |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Contêiner de banco de dados (dev) e stack completa (prod) |
| [uv](https://github.com/astral-sh/uv) | Gerenciador de pacotes Python para o backend |
| [bun](https://bun.sh) | Runtime JavaScript para o frontend |

## Configuração do Ambiente

Tanto `run.sh` quanto `deploy.sh` leem de um arquivo `.env` na raiz do projeto. Se ele não existir, o script cria automaticamente um a partir de `.env.example` — tanto para desenvolvimento local quanto para produção.

`SECRET_KEY` e `ENCRYPTION_KEY` vêm vazias em `.env.example`. Quando qualquer uma delas está vazia, `run.sh` e `deploy.sh` geram um valor criptograficamente forte automaticamente e o gravam de volta em `.env`, de modo que uma configuração nova não exige manipulação manual de chaves. Se um `.env` existente ainda contiver o placeholder legado de `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), os scripts param com um erro explícito em vez de sobrescrevê-lo — rotacionar essa chave tornaria credenciais previamente criptografadas ilegíveis. O próprio backend também se recusa a iniciar se qualquer uma das chaves estiver vazia ou permanecer em um placeholder conhecido.

Para criar o arquivo manualmente (opcional — os scripts fazem isso por você):

```bash
cp .env.example .env
```

Variáveis de ambiente principais:

Para cada variável suportada, valor padrão e observação de produção, consulte [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variável | Descrição |
|----------|-------------|
| `SECRET_KEY` | **Obrigatória.** Segredo de assinatura JWT. Gerada automaticamente por `run.sh`/`deploy.sh` quando vazia. |
| `ENCRYPTION_KEY` | **Obrigatória.** Chave de criptografia de credenciais. Gerada automaticamente por `run.sh`/`deploy.sh` quando vazia. |
| `DATABASE_URL` | Substituição opcional da string de conexão do banco de dados. Se vazia, o Heym a constrói a partir das configurações `POSTGRES_*`. |
| `BACKEND_PORT` | Porta da API do backend — padrão `10105` |
| `FRONTEND_PORT` | Porta do frontend — padrão `4017` |
| `FRONTEND_URL` | **Obrigatória em produção.** URL pública do aplicativo (esquema + host, ex.: `https://heym.example.com`). Usada para URIs de redirecionamento OAuth (Google Sheets, BigQuery, Notion e similares) e para os links de revisão, acompanhamento do Codex e de arquivos que execuções em segundo plano geram; deve corresponder à URL que os usuários usam no navegador. Em um cluster, defina o mesmo valor em todas as instâncias. |
| `ALLOW_REGISTER` | Registro de usuário aberto (`false` em prod, `true` em dev). Altere para `false` somente depois que sua conta de administrador existir — não há bootstrap do primeiro usuário, então um banco de dados vazio com registro desabilitado não deixa nenhuma forma de criar uma conta. |
| `DOCKER_LOGS_ENABLED` | Habilita o acesso à aba Logs com suporte do Docker quando definido como `true`; também exige acesso ao socket do Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Lista separada por vírgulas de e-mails de usuários confiáveis autorizados a acessar os logs do Docker quando `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Tamanho máximo do corpo da requisição HTTP aceito antes da execução dos handlers de endpoint; padrão `100`, um MB acima de `FILE_MAX_SIZE_MB` para deixar espaço para overhead de multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Como ferramentas Python definidas pelo usuário são executadas: `auto` (padrão — contêiner Docker isolado e reforçado; falha de forma segura se o Docker estiver indisponível), `docker` (o mesmo, nunca recorre a fallback) ou `subprocess` (fallback local em processo; não é uma fronteira de segurança, apenas para ambientes confiáveis/dev). `run.sh` define `subprocess` para desenvolvimento nativo. Consulte [Segurança](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Imagem usada para o sandbox Docker de ferramentas Python. Vazio = detecta automaticamente a imagem do backend em execução. |

Os padrões de conexão com o banco de dados (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) estão documentados em [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) e `.env.example`.

---
## Desenvolvimento: `run.sh`

O `run.sh` inicia todos os três serviços localmente — o banco de dados (como um container Docker), o backend FastAPI e o servidor de desenvolvimento Vite — com um único comando.

```bash
./run.sh
```

**O que ele faz, passo a passo:**

1. Verifica se `docker`, `bun` e `uv` estão disponíveis
2. Cria o `.env` a partir do `.env.example` caso esteja ausente, e gera um `SECRET_KEY` e uma `ENCRYPTION_KEY` aleatórios quando qualquer um deles estiver vazio
3. Inicia (ou cria) um container Docker de banco de dados na porta `6543`, armazenando seus dados no volume Docker `heym-postgres-data` em vez de um diretório do host
4. Instala as dependências Python via `uv sync`
5. Executa as migrações de banco de dados do Alembic (`alembic upgrade head`)
6. Libera as portas do backend e do frontend caso estejam ocupadas
7. Inicia o backend FastAPI com `--reload` (hot-reload em alterações de código)
8. Instala as dependências do frontend via `bun install`
9. Inicia o servidor de desenvolvimento Vite

**Opções:**

| Flag | Descrição |
|------|-------------|
| *(nenhuma)* | Inicia com o log de debug habilitado (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Inicia com o nível de log padrão (sem saída de debug) |
| `--help` | Exibe as informações de uso |

**Endereços dos serviços (dev):**

| Serviço | Endereço |
|---------|---------|
| Frontend | `localhost` na `FRONTEND_PORT` (padrão: 4017) |
| Backend API | `localhost` na `BACKEND_PORT` (padrão: 10105) |
| Documentação Interativa da API | `localhost:10105/docs` |
| Banco de dados | `localhost:6543` |

Pressione `Ctrl+C` para encerrar todos os serviços de forma graciosa.

---

## Testes End-to-End: `run_e2e.sh`

A suíte Playwright do frontend é executada contra a aplicação Vue real, o backend FastAPI e um banco de dados PostgreSQL isolado:

```bash
./run_e2e.sh
```

A suíte é uma suíte de smoke e regressão de caminhos críticos, não uma cobertura exaustiva do produto. Ela cobre autenticação, ciclo de vida e execução de Workflows principais, recursos selecionados do dashboard, rotas públicas e uma UI de revisão HITL simulada. Integrações com provedores, todos os tipos de Nó, matrizes de compartilhamento/permissão e a execução completa de retomada HITL permanecem cobertas principalmente por testes de backend ou exigem ambientes de integração dedicados.

Cada execução recebe seu próprio container PostgreSQL 16 temporário, portas aleatórias disponíveis de banco de dados/backend/frontend, estado de autenticação, resultados de testes e relatório HTML. Isso permite que múltiplos processos `run_e2e.sh` sejam executados simultaneamente sem compartilhar estado ou sobrescrever artefatos. O script remove seu container de banco de dados quando a execução termina e imprime o diretório de artefatos e o caminho do relatório.

Comandos úteis:

```bash
./run_e2e.sh --ui         # Executor Playwright interativo com um banco de dados isolado
cd frontend
bun run test:e2e:report   # Abre a execução local concluída mais recentemente
```

Execuções diretas de `bun run test:e2e` e `bun run test:e2e:ui` exigem uma `DATABASE_URL` explícita para que não possam ser iniciadas silenciosamente contra o banco de dados de desenvolvimento local. Use `./run_e2e.sh` para execuções locais normais.

O `./check.sh` executa lint, typecheck, formatação e testes de backend sem a suíte E2E, mantendo o caminho de verificação local padrão rápido. Execute os testes Playwright E2E separadamente com `./run_e2e.sh`. Os pull requests sempre executam a suíte E2E do Chromium no GitHub Actions e retêm traces, screenshots, vídeos e o relatório HTML quando ocorrem falhas.

---
## Produção: `deploy.sh`

O `deploy.sh` compila e executa toda a stack usando Docker Compose. Todos os três serviços — o banco de dados, o backend e o frontend — são executados como containers. O entrypoint do backend executa as migrações automaticamente antes de iniciar o servidor com 8 workers.

**Deploy inicial (build + start):**

```bash
./deploy.sh
```

Isso realiza um deploy sem downtime: as imagens são compiladas primeiro enquanto os containers existentes continuam em execução, e então a nova versão é trocada.

**Comandos disponíveis:**

| Comando | Descrição |
|---------|-------------|
| `./deploy.sh` | Compila as imagens e inicia/atualiza todos os serviços |
| `./deploy.sh --status` | Exibe o status dos containers |
| `./deploy.sh --logs` | Transmite os logs de todos os containers |
| `./deploy.sh --restart` | Reinicia todos os containers |
| `./deploy.sh --down` | Para e remove todos os containers |
| `./deploy.sh --migrate-pgdata` | Migração única: copia um diretório `data/postgres` existente para o volume Docker `heym-postgres-data` e reconstrói seus índices |
| `./deploy.sh --help` | Exibe informações de uso |

**Armazenamento do banco de dados: um volume nomeado do Docker, não um diretório do host.**

O Compose armazena o PostgreSQL no volume Docker `heym-postgres-data`. Versões anteriores faziam bind mount do diretório do host `./data/postgres`. Bind mounts de host no macOS (virtiofs) e Windows/WSL2 não oferecem ao PostgreSQL as garantias de `fsync` e fechamento de arquivo que ele exige: clusters nesses ambientes encontram `PANIC: could not close file … Input/output error` em segmentos WAL e se corrompem ao longo do tempo. Bind mounts no Linux nunca foram afetados, mas agora todas as plataformas usam o mesmo layout.

Atualizar um deploy que ainda tem dados em `./data/postgres` é um passo único. O `./deploy.sh` detecta isso, para antes de compilar e solicita que você migre primeiro:

```bash
./deploy.sh --migrate-pgdata   # para os serviços, copia para o volume, reconstrói os índices
./deploy.sh                    # faz o deploy normalmente
```

**A migração também reconstrói os índices.** A cópia é byte a byte, portanto danos aos índices causados pelo antigo bind mount são transportados junto. Por isso, o `--migrate-pgdata` inicia o serviço `postgres` sozinho no novo volume, executa `reindexdb` contra ele e o para novamente antes que o restante da stack seja iniciado. Isso é importante porque esse tipo de corrupção deixa entradas de índice apontando além do fim do heap — um estado que o `pg_amcheck` reporta como íntegro, de modo que uma verificação bem-sucedida não é evidência de uma tabela saudável. O REINDEX repara essas entradas; ele não consegue restaurar páginas do heap que o sistema de arquivos antigo já perdeu. Em um banco de dados grande e sabidamente saudável, você pode ignorar a reconstrução com `./deploy.sh --migrate-pgdata --skip-reindex`.

A cópia é não destrutiva. O `./data/postgres` permanece no lugar como backup, e a migração se recusa a sobrescrever um volume que já contém um banco de dados. Se qualquer etapa falhar, o novo volume é removido, de modo que um cluster parcialmente migrado nunca pode ser implantado por engano. Exclua o diretório antigo depois de confirmar que seus workflows estão intactos. O container `postgres` carrega a mesma proteção, então um `docker compose up` manual também não pode inicializar silenciosamente um banco de dados vazio sobre seus dados. Instalações novas não precisam de nenhuma ação.

**Endereços dos serviços (produção):**

O container do frontend é exposto em `FRONTEND_PORT` (padrão: 4017). A API do backend é servida sob o caminho `/api`, com proxy através do container do frontend — portanto, há apenas uma porta voltada para o público em produção.

**Visão geral dos containers:**

| Container | Descrição |
|-----------|-------------|
| `heym-db` | Banco de dados relacional |
| `heym-backend` | Servidor de API FastAPI (8 workers, compilado a partir de `backend/Dockerfile`) |
| `heym-frontend` | Container de preview do frontend que serve o app Vue compilado (compilado a partir de `frontend/Dockerfile`) |

**Badge de atualização de versão:**

O cabeçalho do app exibe a versão do build Docker em execução. Quando essa versão está atrás do último release do Heym no GitHub, um badge roxo **Update** aparece ao lado da versão. Clique na versão ou no badge para abrir a página de releases do Heym no GitHub.

---
## Imagem Pré-construída: `docker run`

Se você preferir não compilar o aplicativo localmente, pode baixar a imagem de container publicada e executá-la diretamente.

A imagem inicia o frontend e o backend juntos em um único container. O PostgreSQL ainda é externo, mas você pode fornecer tanto a `DATABASE_URL` quanto as variáveis `POSTGRES_*` do `.env.example`.

> **Armazene seu banco de dados em um volume nomeado do Docker.** A imagem de release não inclui banco de dados, portanto o PostgreSQL por trás da `DATABASE_URL` é de sua responsabilidade executar. Monte-o como `-v heym-postgres-data:/var/lib/postgresql/data` em vez de um caminho do host: no macOS (virtiofs) e no Windows/WSL2, um diretório de dados do PostgreSQL montado via bind mount não honra as garantias de `fsync` exigidas pelo banco de dados e corrompe o cluster ao longo do tempo.

> **Backend do vector store.** Os scripts `run.sh` e `deploy.sh` executam a imagem oficial `postgres:16` e instalam automaticamente o pacote `postgresql-16-pgvector` na inicialização, de modo que o **backend RAG Postgres (pgvector)** funciona imediatamente nesses casos, sem alteração nos seus dados. A imagem pré-construída de container único, no entanto, conecta-se a um PostgreSQL **fornecido por você** — esse banco de dados precisa suportar a extensão `vector` para usar o backend Postgres. O Heym não consegue instalar o pgvector em um banco de dados que ele não gerencia. Sem ele, a migração de inicialização ignora a tabela pgvector de forma elegante — o deploy ainda é bem-sucedido, o RAG do Qdrant continua funcionando, e criar ou enviar para um vector store Postgres retorna uma mensagem clara de "backend indisponível" até que o pgvector seja habilitado.

**Defina as chaves você mesmo para execuções diretas da imagem.** Diferentemente de `run.sh`/`deploy.sh`, a imagem pré-construída não gera chaves automaticamente. Após `cp .env.example .env`, preencha as duas chaves vazias (substituir no local evita entradas duplicadas):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Torne os mounts de arquivos e plugins absolutos.** `FILE_STORAGE_DIR` e `HEYM_PLUGINS_DIR` usam por padrão os caminhos relativos `./data/files` e `data/plugins`, e a imagem de release inicia o backend a partir de `/app/backend`. Se deixados relativos, eles resolvem para `/app/backend/data/files` e `/app/backend/data/plugins`, de modo que os dois bind mounts acima não recebem nada e os uploads são perdidos quando o container é substituído. As flags `-e` sobrescrevem os valores relativos que o `.env.example` fornece através de `--env-file`, porque o `-e` da linha de comando tem precedência sobre o `--env-file`. O Compose (`./deploy.sh`) não precisa disso: essa imagem executa o backend a partir de `/app`, onde os padrões relativos já apontam para os mounts.

> **Acesso ao socket do Docker.** Montar `/var/run/docker.sock` concede ao backend amplo controle sobre o daemon Docker do host. O serviço padrão do Docker Compose e o exemplo direto de `docker run` o incluem para ferramentas MCP stdio baseadas em Docker que executam comandos `docker`. A aba Logs ainda requer `DOCKER_LOGS_ENABLED=true` e `DOCKER_LOGS_ALLOWED_EMAILS` com uma lista separada por vírgulas de e-mails de usuários confiáveis. Crie a conta de administrador confiável antes de habilitar os logs do Docker, ou mantenha `ALLOW_REGISTER=false`, para que um auto-registro não verificado não possa reivindicar um e-mail da lista de permissões. Ferramentas Python definidas pelo usuário **não** recebem esse socket: elas são executadas em um container separado e reforçado, sem socket do Docker. Consulte [Segurança](../reference/security.md#python-tool-sandbox).

> **Runner do Codex.** O Nó Codex usa a mesma imagem `ghcr.io/heymrun/heym` como um container runner irmão (`--entrypoint codex`) para que o sandbox Linux do Codex possa criar namespaces. Mantenha o mount do volume `heym-codex-workspaces` se você quiser Workflows do Codex na configuração direta da imagem; o runner não recebe o socket do Docker nem os segredos do backend.

> **Runner do OpenCode Go.** O Nó OpenCode Go usa a mesma imagem como um runner irmão reforçado (`--entrypoint opencode`) compartilhando `heym-opencode-workspaces`. Mantenha esse mount de volume se você quiser Workflows do OpenCode na configuração direta da imagem; o runner não recebe o socket do Docker nem o token do GitHub.

> **Sandbox de Skills.** Skills Python no Nó Agente são executadas em um container irmão reforçado que compartilha o volume `heym-codex-workspaces`, portanto mantenha esse mount de volume também para as skills — não apenas para o Codex. Cada execução recebe um subcaminho isolado por execução, e o irmão não recebe nem o socket do Docker nem os segredos do backend. Isso requer **Docker Engine 25.0+**; em engines mais antigas, ou sem o volume, `HEYM_PYTHON_TOOL_SANDBOX=auto` falha de forma segura — defina `HEYM_PYTHON_TOOL_SANDBOX=subprocess` apenas para configurações confiáveis de usuário único. Consulte [Segurança](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` é obrigatório para o Playwright.** O Docker concede a um contêiner 64 MB de `/dev/shm` e o Chromium trava seu renderizador abaixo disso. Nós Playwright baseados em etapas executam o Chromium como subprocesso dentro deste contêiner, portanto o limite é o deste contêiner; o `playwrightCode` personalizado é executado em um contêiner irmão que define o seu próprio. O `docker-compose.yml` já declara `shm_size: "2gb"`, então `run.sh` e `deploy.sh` não são afetados — apenas um `docker run` simples precisa da flag.

> **Playwright Run Code.** O Playwright Python personalizado precisa de `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` e da montagem do socket do Docker acima. A imagem de release define `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` para o layout do GHCR (`/app/backend/.venv`). O `./deploy.sh` do Compose define a imagem de sandbox como `heym-backend:local` por padrão. Mantenha `--no-sandbox` nos argumentos de inicialização do Chromium dentro dos contêineres de sandbox.

**Variáveis de ambiente mínimas para execuções diretas da imagem:**

| Variável | Obrigatória | Finalidade |
|----------|----------|---------|
| `DATABASE_URL` | Opcional | Substituição completa da string de conexão do PostgreSQL |
| `POSTGRES_HOST` | Sim, se `DATABASE_URL` estiver vazia | Host do PostgreSQL |
| `POSTGRES_PORT` | Sim, se `DATABASE_URL` estiver vazia | Porta do PostgreSQL |
| `POSTGRES_USER` | Sim, se `DATABASE_URL` estiver vazia | Nome de usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | Sim, se `DATABASE_URL` estiver vazia | Senha do PostgreSQL |
| `POSTGRES_DB` | Sim, se `DATABASE_URL` estiver vazia | Nome do banco de dados PostgreSQL |
| `SECRET_KEY` | Sim | Segredo de assinatura do JWT |
| `ENCRYPTION_KEY` | Sim | Chave de criptografia de credenciais |
| `FRONTEND_URL` | Recomendada | URL pública do navegador, especialmente para callbacks OAuth |
| `CORS_ORIGINS` | Recomendada | Origens de navegador permitidas |
| `FILE_STORAGE_DIR` | Recomendada | Defina como um caminho absoluto `/app/data/files` quando você montar esse caminho; o padrão relativo `./data/files` é resolvido em `/app/backend` nesta imagem e não encontra a montagem |
| `ALLOW_REGISTER` | Recomendada | Defina como `false` em produção, a menos que o cadastro aberto seja intencional, mas apenas depois que sua conta de administrador existir — não há bootstrap de primeiro usuário |
| `DOCKER_LOGS_ENABLED` | Opcional | Defina como `true` para permitir que a aba Logs use o acesso ao socket do Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Obrigatória quando `DOCKER_LOGS_ENABLED=true` | Lista separada por vírgulas de e-mails de usuários confiáveis autorizados a acessar os logs do Docker |
| `HEYM_PLUGINS_ENABLED` | Opcional | Defina como `true` para habilitar o subsistema de plugins (nós personalizados instalados como zip). Desativado por padrão |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Obrigatória quando `HEYM_PLUGINS_ENABLED=true` | E-mails de operadores separados por vírgulas autorizados a instalar/desinstalar plugins |
| `HEYM_PLUGINS_DIR` | Opcional | Onde os arquivos de plugin são armazenados. Defina como um caminho absoluto `/app/data/plugins` quando você montar esse caminho; o padrão relativo `data/plugins` é resolvido em `/app/backend` nesta imagem e não encontra a montagem |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opcional | Modo de isolamento da ferramenta Python; o padrão é `auto` (sandbox Docker reforçado, fail closed). Consulte [Segurança](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opcional | Substitui a imagem de sandbox da ferramenta Python; vazio = detecta automaticamente a imagem do backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opcional | Volume Docker usado por contêineres irmãos do executor Codex; o padrão é `heym-codex-workspaces` em implantações Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opcional | Permite que os comandos em sandbox do Codex baixem arquivos/dependências; implantações Docker habilitam isso por padrão |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opcional | Volume Docker usado por contêineres irmãos do executor OpenCode; o padrão é `heym-opencode-workspaces` em implantações Docker |

**Observações:**

- A imagem expõe a porta `4017`
- O backend permanece interno e é proxiado sob `/api`
- Quando `POSTGRES_HOST=localhost`, a imagem de release o reescreve automaticamente para `host.docker.internal` quando necessário, para que o mesmo `.env` funcione com um contêiner PostgreSQL no nível do host em ferramentas Docker/Desktop do macOS
- Mantenha a montagem `data/files` se você quiser que uploads do Drive e arquivos gerados por skills sobrevivam a reinicializações do contêiner
- **Plugins:** para habilitá-los, defina `HEYM_PLUGINS_ENABLED=true` e `HEYM_PLUGIN_ADMIN_EMAILS`, e monte `data/plugins` para que os arquivos de plugin instalados persistam entre recriações do contêiner. Os metadados de plugin ficam no seu PostgreSQL, então também persistem. As `dependencies` pip declaradas por um plugin são instaladas no contêiner no momento da instalação; como o sistema de arquivos da imagem é efêmero, elas são **reinstaladas automaticamente na inicialização** para cada plugin instalado (o venv `uv` da imagem de release é gravável, então isso funciona também na imagem de contêiner único)

### Movendo um banco de dados existente para um volume nomeado

`./deploy.sh --migrate-pgdata` só conhece a stack do Compose. Se você executar a imagem de release contra seu próprio contêiner PostgreSQL e esse contêiner fizer bind-mount de um diretório do host, migre-o você mesmo.

Verifique primeiro o que seu contêiner de banco de dados usa:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Se `"Type"` indicar `bind`, mova-o para um volume nomeado:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    nome do volume se este host Docker executar mais de uma implantação do Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Inicie o PostgreSQL novamente no volume, reutilizando as flags que você tinha antes
#    mas substituindo o bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Assim que ele aceitar conexões, reconstrua os índices.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Use sua própria imagem nos passos 2 e 3, não `postgres:16`.** Se o seu banco de dados executa `pgvector/pgvector:pg16` ou outra variante, iniciar o cluster copiado com a imagem padrão pode falhar porque as bibliotecas de extensão esperadas estarão ausentes.

Seu diretório de dados original permanece intacto por este procedimento, portanto ele continua sendo seu caminho de rollback. Exclua-o apenas após confirmar que o banco de dados migrado atende aos seus workflows. O passo 4 é importante pelo mesmo motivo que é na migração via Compose: a cópia carrega consigo qualquer dano de índice existente.

---

## Executando Mais de Uma Instância

Tudo acima implanta uma única instância do Heym. Quando uma máquina não é mais
suficiente, aponte uma segunda instância para o mesmo banco de dados PostgreSQL e ela se junta como
um worker: execuções em segundo plano — cron, webhooks, chamadas de ferramentas MCP, chat triggers — são
então compartilhadas entre as instâncias por uma porcentagem que você define em
**Settings → Instances**.

As instâncias nunca conversam entre si. O Postgres carrega o trabalho, então um worker
não precisa de porta aberta nem de rota de volta para a instância principal, e nenhum message broker
está envolvido. Trabalho que toca o disco local — arquivos do Drive, workspaces de coding-agent, plugins instalados — sempre executa na instância principal, então nada precisa
ser compartilhado via filesystem.

Duas regras que o cluster não pode impor por você: toda instância deve usar o mesmo
`SECRET_KEY` e `ENCRYPTION_KEY`, e o ingress deve apontar apenas para a instância principal. Ambas são explicadas, junto com as regras de posicionamento e como escolher as
porcentagens, em [Load Distribution](../reference/cluster.md).

> Isto é distribuição de carga, não alta disponibilidade. A instância principal continua sendo um
> ponto único de falha para ingress, armazenamento de arquivos e o editor.

## Workflows Comuns

**Configuração inicial:**

```bash
./run.sh          # desenvolvimento — cria .env a partir de .env.example e gera SECRET_KEY/ENCRYPTION_KEY automaticamente
# ou
./deploy.sh       # produção — mesma geração automática de .env e chaves
```

Para a imagem pré-compilada `docker run`, gere as chaves manualmente primeiro (veja a seção **Prebuilt Image** acima).

**Atualizar produção após uma mudança de código:**

```bash
git pull
./deploy.sh       # reconstrói imagens, troca sem downtime
```

**Verificar logs de produção:**

```bash
./deploy.sh --logs
```

**Parar serviços de produção:**

```bash
./deploy.sh --down
```

---

## Relacionados

- [Introduction](./introduction.md) – Visão geral da plataforma
- [Quick Start](./quick-start.md) – Construa seu primeiro workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referência completa de configuração
- [Security](../reference/security.md) – Configurações de JWT, criptografia e CORS
- [Load Distribution](../reference/cluster.md) – Execute várias instâncias contra um único banco de dados
