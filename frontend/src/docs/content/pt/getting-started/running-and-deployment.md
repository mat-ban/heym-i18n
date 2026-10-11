# Execução e Implementação

O Heym disponibiliza dois scripts para ambientes distintos: `run.sh` para desenvolvimento local e `deploy.sh` para implementações em produção com Docker Compose.

> **Vídeo demonstrativo:** [Configurar o Heym localmente em menos de 2 minutos](https://www.youtube.com/watch?v=P6YvlupUboU) — clone o repositório, inicie o PostgreSQL, preencha as variáveis de ambiente necessárias e crie a sua primeira conta numa instância local.

## Pré-requisitos

Ambos os scripts exigem a instalação das seguintes ferramentas:

| Ferramenta | Finalidade |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Contentor de base de dados (dev) e stack completa (prod) |
| [uv](https://github.com/astral-sh/uv) | Gestor de pacotes Python para o backend |
| [bun](https://bun.sh) | Runtime JavaScript para o frontend |

## Configuração do Ambiente

Tanto o `run.sh` como o `deploy.sh` leem a partir de um ficheiro `.env` na raiz do projeto. Caso este não exista, o script cria-o automaticamente a partir de `.env.example` — tanto para desenvolvimento local como para produção.

`SECRET_KEY` e `ENCRYPTION_KEY` são fornecidas vazias em `.env.example`. Quando qualquer uma delas está vazia, o `run.sh` e o `deploy.sh` geram automaticamente um valor criptograficamente forte e escrevem-no de volta no `.env`, pelo que uma configuração nova não exige qualquer tratamento manual das chaves. Se um `.env` existente ainda contiver o marcador de posição legado de `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), os scripts param com um erro explícito em vez de o substituírem — a rotação dessa chave tornaria ilegíveis as credenciais previamente encriptadas. O próprio backend também recusa iniciar se qualquer das chaves estiver vazia ou mantiver um marcador de posição conhecido.

Para criar o ficheiro manualmente (opcional — os scripts fazem-no por si):

```bash
cp .env.example .env
```

Variáveis de ambiente principais:

Para conhecer todas as variáveis suportadas, valores predefinidos e notas de produção, consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variável | Descrição |
|----------|-------------|
| `SECRET_KEY` | **Obrigatória.** Segredo de assinatura JWT. Gerada automaticamente pelo `run.sh`/`deploy.sh` quando vazia. |
| `ENCRYPTION_KEY` | **Obrigatória.** Chave de encriptação de credenciais. Gerada automaticamente pelo `run.sh`/`deploy.sh` quando vazia. |
| `DATABASE_URL` | Substituição opcional da cadeia de ligação à base de dados. Se vazia, o Heym constrói-a a partir das definições `POSTGRES_*`. |
| `BACKEND_PORT` | Porta da API do backend — predefinição `10105` |
| `FRONTEND_PORT` | Porta do frontend — predefinição `4017` |
| `FRONTEND_URL` | **Obrigatória em produção.** URL pública da aplicação (esquema + host, por exemplo `https://heym.example.com`). Utilizada para os URIs de redirecionamento OAuth (Google Sheets, BigQuery, Notion e similares) e para as ligações de revisão, de seguimento do Codex e de ficheiros que as execuções em segundo plano geram; deve corresponder ao URL que os utilizadores usam no navegador. Num cluster, defina o mesmo valor em todas as instâncias. |
| `ALLOW_REGISTER` | Registo de utilizadores aberto (`false` em prod, `true` em dev). Altere para `false` apenas depois de a sua conta de administrador existir — não há inicialização do primeiro utilizador, pelo que uma base de dados vazia com o registo desativado não deixa forma de criar uma. |
| `DOCKER_LOGS_ENABLED` | Ativa o acesso ao separador Logs suportado por Docker quando definido como `true`; requer também acesso ao socket do Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Lista de emails de utilizadores de confiança, separados por vírgulas, autorizados a aceder aos logs do Docker quando `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Tamanho máximo do corpo do pedido HTTP aceite antes de os handlers do endpoint serem executados; predefinição `100`, um MB acima de `FILE_MAX_SIZE_MB` para deixar margem para a sobrecarga do multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Como são executadas as ferramentas Python definidas pelo utilizador: `auto` (predefinição — contentor Docker isolado e reforçado; falha de forma segura se o Docker não estiver disponível), `docker` (o mesmo, nunca recorre a alternativa), ou `subprocess` (alternativa local em processo; não constitui uma fronteira de segurança, apenas para ambientes de confiança/dev). O `run.sh` define `subprocess` para desenvolvimento nativo. Consulte [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Imagem utilizada para a sandbox Docker das ferramentas Python. Vazio = detetar automaticamente a imagem do backend em execução. |

As predefinições de ligação à base de dados (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) estão documentadas em [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) e em `.env.example`.

---

## Desenvolvimento: `run.sh`

O `run.sh` inicia os três serviços localmente — a base de dados (como contentor Docker), o backend FastAPI e o servidor de desenvolvimento Vite — com um único comando.

```bash
./run.sh
```

**O que faz, passo a passo:**

1. Verifica se `docker`, `bun` e `uv` estão disponíveis
2. Cria o `.env` a partir do `.env.example` caso este não exista e gera um `SECRET_KEY` e uma `ENCRYPTION_KEY` aleatórios sempre que algum esteja vazio
3. Inicia (ou cria) um contentor Docker da base de dados na porta `6543`, armazenando os seus dados no volume Docker `heym-postgres-data` em vez de um diretório do anfitrião
4. Instala as dependências Python através de `uv sync`
5. Executa as migrações da base de dados Alembic (`alembic upgrade head`)
6. Liberta as portas do backend e do frontend caso estejam ocupadas
7. Inicia o backend FastAPI com `--reload` (recarregamento automático em alterações ao código)
8. Instala as dependências do frontend através de `bun install`
9. Inicia o servidor de desenvolvimento Vite

**Opções:**

| Flag | Descrição |
|------|-------------|
| *(nenhuma)* | Inicia com o registo de depuração ativado (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Inicia com o nível de registo predefinido (sem saída de depuração) |
| `--help` | Mostra informações de utilização |

**Endereços dos serviços (dev):**

| Serviço | Endereço |
|---------|---------|
| Frontend | `localhost` em `FRONTEND_PORT` (predefinição: 4017) |
| API do backend | `localhost` em `BACKEND_PORT` (predefinição: 10105) |
| Documentação interativa da API | `localhost:10105/docs` |
| Base de dados | `localhost:6543` |

Prima `Ctrl+C` para parar todos os serviços de forma graciosa.

---

## Testes ponta a ponta: `run_e2e.sh`

A suite Playwright do frontend é executada contra a aplicação Vue real, o backend FastAPI e uma base de dados PostgreSQL isolada:

```bash
./run_e2e.sh
```

A suite é uma suite de fumo e regressão sobre os caminhos críticos, não uma cobertura exaustiva do produto. Abrange a autenticação, o ciclo de vida e a execução dos workflows principais, alguns recursos do painel, rotas públicas e uma interface de revisão HITL simulada. As integrações com fornecedores, todos os tipos de nó, as matrizes de partilha/permissões e a execução completa de retoma HITL continuam a ser cobertas principalmente por testes de backend ou exigem ambientes de integração dedicados.

Cada execução obtém o seu próprio contentor temporário PostgreSQL 16, portas aleatórias disponíveis para a base de dados/backend/frontend, estado de autenticação, resultados de testes e relatório HTML. Isto permite que vários processos `run_e2e.sh` sejam executados em simultâneo sem partilhar estado nem sobrescrever artefactos. O script remove o seu contentor de base de dados quando a execução termina e imprime o diretório de artefactos e o caminho do relatório.

Comandos úteis:

```bash
./run_e2e.sh --ui         # Executor Playwright interativo com uma base de dados isolada
cd frontend
bun run test:e2e:report   # Abrir a execução local concluída mais recentemente
```

As execuções diretas de `bun run test:e2e` e `bun run test:e2e:ui` exigem um `DATABASE_URL` explícito, para que não possam ser iniciadas silenciosamente contra a base de dados de desenvolvimento local. Utilize `./run_e2e.sh` para execuções locais normais.

O `./check.sh` executa lint, verificação de tipos, formatação e testes de backend sem a suite E2E, mantendo o caminho de verificação local predefinido rápido. Execute os testes Playwright E2E separadamente com `./run_e2e.sh`. Os pull requests executam sempre a suite E2E do Chromium no GitHub Actions e retêm traces, capturas de ecrã, vídeos e o relatório HTML quando ocorrem falhas.

---

## Produção: `deploy.sh`

O `deploy.sh` compila e executa a stack completa através do Docker Compose. Os três serviços — a base de dados, o backend e o frontend — são executados como contentores. O entrypoint do backend executa automaticamente as migrações antes de iniciar o servidor com 8 workers.

**Implementação inicial (compilar + iniciar):**

```bash
./deploy.sh
```

Esta operação realiza uma implementação sem tempo de inatividade: as imagens são compiladas primeiro enquanto os contentores existentes continuam em execução, e só depois a nova versão é colocada em produção.

**Comandos disponíveis:**

| Comando | Descrição |
|---------|-------------|
| `./deploy.sh` | Compilar imagens e iniciar/atualizar todos os serviços |
| `./deploy.sh --status` | Mostrar o estado dos contentores |
| `./deploy.sh --logs` | Transmitir os registos de todos os contentores |
| `./deploy.sh --restart` | Reiniciar todos os contentores |
| `./deploy.sh --down` | Parar e remover todos os contentores |
| `./deploy.sh --migrate-pgdata` | Migração única: copiar um diretório `data/postgres` existente para o volume Docker `heym-postgres-data` e reconstruir os seus índices |
| `./deploy.sh --help` | Mostrar informações de utilização |

**Armazenamento da base de dados: um volume nomeado do Docker, não um diretório do anfitrião.**

O Compose armazena o PostgreSQL no volume Docker `heym-postgres-data`. Versões anteriores montavam o diretório do anfitrião `./data/postgres` através de bind mount. As montagens bind do anfitrião em macOS (virtiofs) e Windows/WSL2 não proporcionam ao PostgreSQL as garantias de `fsync` e de fecho de ficheiros que este exige: os clusters nessas plataformas encontram `PANIC: could not close file … Input/output error` em segmentos WAL e corrompem-se ao longo do tempo. As montagens bind em Linux nunca foram afetadas, mas todas as plataformas utilizam agora o mesmo esquema.

Atualizar uma implementação que ainda tem dados em `./data/postgres` é um passo único. O `./deploy.sh` deteta essa situação, para antes de compilar e solicita que se realize primeiro a migração:

```bash
./deploy.sh --migrate-pgdata   # parar serviços, copiar para o volume, reconstruir índices
./deploy.sh                    # implementar como habitualmente
```

**A migração também reconstrói os índices.** A cópia é byte a byte, pelo que os danos nos índices causados pela antiga montagem bind são transportados com ela. Por esse motivo, o `--migrate-pgdata` inicia apenas o serviço `postgres` no novo volume, executa `reindexdb` sobre ele e volta a pará-lo antes de o resto da stack arrancar. Isto é relevante porque este tipo de corrupção deixa entradas de índice a apontar para além do fim da heap — um estado que o `pg_amcheck` reporta como íntegro, pelo que uma verificação bem-sucedida não é prova de uma tabela saudável. O REINDEX repara essas entradas; não consegue restaurar páginas da heap que o antigo sistema de ficheiros já perdeu. Numa base de dados grande e reconhecidamente saudável, é possível contornar a reconstrução com `./deploy.sh --migrate-pgdata --skip-reindex`.

A cópia é não destrutiva. O `./data/postgres` permanece no lugar como cópia de segurança, e a migração recusa-se a substituir um volume que já contém uma base de dados. Se qualquer passo falhar, o novo volume é removido, pelo que um cluster meio migrado nunca pode ser implementado por engano. Elimine o diretório antigo depois de confirmar que os seus workflows estão intactos. O contentor `postgres` tem a mesma proteção, pelo que um `docker compose up` manual também não pode inicializar silenciosamente uma base de dados vazia sobre os seus dados. As instalações novas não requerem qualquer ação.

**Endereços dos serviços (produção):**

O contentor do frontend é exposto em `FRONTEND_PORT` (predefinição: 4017). A API do backend é servida sob o caminho `/api`, com proxy através do contentor do frontend — pelo que existe apenas uma porta pública em produção.

**Visão geral dos contentores:**

| Contentor | Descrição |
|-----------|-------------|
| `heym-db` | Base de dados relacional |
| `heym-backend` | Servidor da API FastAPI (8 workers, compilado a partir de `backend/Dockerfile`) |
| `heym-frontend` | Contentor de pré-visualização do frontend que serve a aplicação Vue compilada (compilado a partir de `frontend/Dockerfile`) |

**Distintivo de atualização de versão:**

O cabeçalho da aplicação mostra a versão da compilação Docker em execução. Quando essa versão está atrás da versão mais recente do Heym no GitHub, aparece um distintivo roxo **Update** junto à versão. Clique na versão ou no distintivo para abrir a página de versões do Heym no GitHub.

---

## Imagem Pré-construída: `docker run`

Se preferir não compilar a aplicação localmente, pode obter a imagem de contentor publicada e executá-la diretamente.

A imagem inicia o frontend e o backend em conjunto num único contentor. O PostgreSQL continua a ser externo, mas pode fornecer `DATABASE_URL` ou as variáveis `POSTGRES_*` a partir de `.env.example`.

> **Armazene a base de dados num volume nomeado do Docker.** A imagem de lançamento não inclui qualquer base de dados, pelo que o PostgreSQL por trás de `DATABASE_URL` é da sua responsabilidade. Monte-o como `-v heym-postgres-data:/var/lib/postgresql/data` em vez de um caminho do anfitrião: no macOS (virtiofs) e no Windows/WSL2, um diretório de dados do PostgreSQL montado por bind não respeita as garantias de `fsync` exigidas pela base de dados e corrompe o cluster ao longo do tempo.

> **Backend do armazenamento vetorial.** Os scripts `run.sh` e `deploy.sh` executam a imagem oficial `postgres:16` e instalam automaticamente o pacote `postgresql-16-pgvector` no arranque, pelo que o **backend RAG Postgres (pgvector)** funciona de imediato nesses casos, sem alterações aos seus dados. A imagem pré-construída de contentor único, no entanto, liga-se a um PostgreSQL **fornecido por si** — essa base de dados tem de suportar a extensão `vector` para utilizar o backend Postgres. O Heym não consegue instalar o pgvector numa base de dados que não gere. Sem ele, a migração de arranque ignora a tabela pgvector de forma graciosa — o deploy continua a ter sucesso, o RAG Qdrant continua a funcionar, e criar ou carregar para um armazenamento vetorial Postgres devolve uma mensagem clara de "backend indisponível" até o pgvector ser ativado.

**Defina as chaves manualmente para execuções diretas da imagem.** Ao contrário de `run.sh`/`deploy.sh`, a imagem pré-construída não gera chaves automaticamente. Após `cp .env.example .env`, preencha as duas chaves vazias (substituir no local evita entradas duplicadas):

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

> **Torne absolutas as montagens de ficheiros e plugins.** `FILE_STORAGE_DIR` e `HEYM_PLUGINS_DIR` assumem por omissão os caminhos relativos `./data/files` e `data/plugins`, e a imagem de lançamento inicia o backend a partir de `/app/backend`. Se permanecerem relativos, resolvem para `/app/backend/data/files` e `/app/backend/data/plugins`, pelo que as duas montagens bind acima não recebem nada e os carregamentos perdem-se quando o contentor é substituído. Os sinalizadores `-e` sobrepõem-se aos valores relativos que `.env.example` fornece através de `--env-file`, porque o `-e` da linha de comandos prevalece sobre `--env-file`. O Compose (`./deploy.sh`) não precisa disto: essa imagem executa o backend a partir de `/app`, onde os valores relativos por omissão já coincidem com as montagens.

> **Acesso ao socket do Docker.** Montar `/var/run/docker.sock` concede ao backend um controlo amplo sobre o daemon Docker do anfitrião. O serviço predefinido do Docker Compose e o exemplo direto de `docker run` incluem-no para ferramentas MCP stdio baseadas em Docker que executam comandos `docker`. O separador Logs continua a exigir `DOCKER_LOGS_ENABLED=true` e `DOCKER_LOGS_ALLOWED_EMAILS` com uma lista separada por vírgulas de emails de utilizadores de confiança. Crie a conta de administrador de confiança antes de ativar os logs do Docker, ou mantenha `ALLOW_REGISTER=false`, para que um auto-registo não verificado não possa reclamar um email da lista de permitidos. As ferramentas Python definidas pelo utilizador **não** recebem este socket: são executadas num contentor separado e reforçado, sem socket do Docker. Consulte [Segurança](../reference/security.md#python-tool-sandbox).

> **Executor Codex.** O nó Codex utiliza a mesma imagem `ghcr.io/heymrun/heym` como contentor executor irmão (`--entrypoint codex`), para que a sandbox Linux do Codex possa criar namespaces. Mantenha a montagem do volume `heym-codex-workspaces` se pretender workflows Codex na configuração direta da imagem; o executor não recebe o socket do Docker nem segredos do backend.

> **Executor OpenCode Go.** O nó OpenCode Go utiliza a mesma imagem como executor irmão reforçado (`--entrypoint opencode`), partilhando `heym-opencode-workspaces`. Mantenha essa montagem de volume se pretender workflows OpenCode na configuração direta da imagem; o executor não recebe o socket do Docker nem o token do GitHub.

> **Sandbox de skills.** As skills Python no nó Agent são executadas num contentor irmão reforçado que partilha o volume `heym-codex-workspaces`, pelo que deve manter essa montagem de volume também para as skills — não apenas para o Codex. Cada execução recebe um subcaminho isolado por execução, e o irmão não recebe nem o socket do Docker nem segredos do backend. Isto requer **Docker Engine 25.0+**; em motores mais antigos, ou sem o volume, `HEYM_PYTHON_TOOL_SANDBOX=auto` falha de forma segura — defina `HEYM_PYTHON_TOOL_SANDBOX=subprocess` apenas para configurações de utilizador único de confiança. Consulte [Segurança](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` é obrigatório para o Playwright.** O Docker atribui a um contentor 64 MB de `/dev/shm` e o Chromium faz cair o seu renderer abaixo desse valor. Os nós Playwright baseados em passos executam o Chromium como subprocesso dentro deste contentor, pelo que o limite é o deste contentor; o `playwrightCode` personalizado é executado num contentor irmão que define o seu próprio. O `docker-compose.yml` já declara `shm_size: "2gb"`, pelo que o `run.sh` e o `deploy.sh` não são afetados — apenas um `docker run` simples necessita da flag.

> **Playwright Run Code.** O Playwright Python personalizado necessita de `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` e da montagem do socket Docker acima. A imagem de lançamento define `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` para o layout GHCR (`/app/backend/.venv`). O `./deploy.sh` do Compose define por omissão a imagem sandbox como `heym-backend:local`. Mantenha `--no-sandbox` nos argumentos de arranque do Chromium dentro dos contentores sandbox.

**Variáveis de ambiente mínimas para execuções diretas da imagem:**

| Variável | Obrigatória | Finalidade |
|----------|----------|---------|
| `DATABASE_URL` | Opcional | Substituição completa da string de ligação ao PostgreSQL |
| `POSTGRES_HOST` | Sim, se `DATABASE_URL` estiver vazia | Host do PostgreSQL |
| `POSTGRES_PORT` | Sim, se `DATABASE_URL` estiver vazia | Porta do PostgreSQL |
| `POSTGRES_USER` | Sim, se `DATABASE_URL` estiver vazia | Nome de utilizador do PostgreSQL |
| `POSTGRES_PASSWORD` | Sim, se `DATABASE_URL` estiver vazia | Palavra-passe do PostgreSQL |
| `POSTGRES_DB` | Sim, se `DATABASE_URL` estiver vazia | Nome da base de dados PostgreSQL |
| `SECRET_KEY` | Sim | Segredo de assinatura JWT |
| `ENCRYPTION_KEY` | Sim | Chave de encriptação de credenciais |
| `FRONTEND_URL` | Recomendada | URL público do navegador, especialmente para callbacks OAuth |
| `CORS_ORIGINS` | Recomendada | Origens de navegador permitidas |
| `FILE_STORAGE_DIR` | Recomendada | Defina-a como um caminho absoluto `/app/data/files` quando montar esse caminho; o valor predefinido relativo `./data/files` é resolvido em `/app/backend` nesta imagem e não encontra a montagem |
| `ALLOW_REGISTER` | Recomendada | Defina como `false` em produção, a menos que se pretenda registo aberto, mas apenas depois de a sua conta de administrador existir — não existe bootstrap de primeiro utilizador |
| `DOCKER_LOGS_ENABLED` | Opcional | Defina como `true` para permitir que o separador Logs utilize o acesso ao socket Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Obrigatória quando `DOCKER_LOGS_ENABLED=true` | Lista separada por vírgulas de emails de utilizadores de confiança autorizados a aceder aos logs do Docker |
| `HEYM_PLUGINS_ENABLED` | Opcional | Defina como `true` para ativar o subsistema de plugins (nós personalizados instalados como zip). Desativado por omissão |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Obrigatória quando `HEYM_PLUGINS_ENABLED=true` | Lista separada por vírgulas de emails de operadores autorizados a instalar/desinstalar plugins |
| `HEYM_PLUGINS_DIR` | Opcional | Onde os ficheiros de plugins são armazenados. Defina-a como um caminho absoluto `/app/data/plugins` quando montar esse caminho; o valor predefinido relativo `data/plugins` é resolvido em `/app/backend` nesta imagem e não encontra a montagem |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opcional | Modo de isolamento da ferramenta Python; por omissão `auto` (sandbox Docker reforçado, fail closed). Consulte [Segurança](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opcional | Substituir a imagem sandbox da ferramenta Python; vazio = detetar automaticamente a imagem do backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opcional | Volume Docker utilizado pelos contentores irmãos do executor Codex; por omissão `heym-codex-workspaces` em implementações Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opcional | Permitir que os comandos em sandbox do Codex descarreguem ficheiros/dependências; as implementações Docker ativam isto por omissão |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opcional | Volume Docker utilizado pelos contentores irmãos do executor OpenCode; por omissão `heym-opencode-workspaces` em implementações Docker |

**Notas:**

- A imagem expõe a porta `4017`
- O backend permanece interno e é encaminhado por proxy sob `/api`
- Quando `POSTGRES_HOST=localhost`, a imagem de lançamento reescreve-o automaticamente para `host.docker.internal` quando necessário, para que o mesmo `.env` funcione com um contentor PostgreSQL ao nível do host em ferramentas Docker/Desktop do macOS
- Mantenha a montagem `data/files` se pretender que os carregamentos para o Drive e os ficheiros gerados por skills sobrevivam aos reinícios do contentor
- **Plugins:** para os ativar, defina `HEYM_PLUGINS_ENABLED=true` e `HEYM_PLUGIN_ADMIN_EMAILS`, e monte `data/plugins` para que os ficheiros de plugins instalados persistam entre recriações do contentor. Os metadados dos plugins residem no seu PostgreSQL, pelo que também sobrevivem. As `dependencies` pip declaradas por um plugin são instaladas no contentor no momento da instalação; como o sistema de ficheiros da imagem é efémero, são **reinstaladas automaticamente no arranque** para cada plugin instalado (o venv `uv` da imagem de lançamento é gravável, pelo que isto também funciona na imagem de contentor único)

### Mover uma base de dados existente para um volume nomeado

O `./deploy.sh --migrate-pgdata` apenas conhece a stack do Compose. Se executar a imagem de lançamento contra o seu próprio contentor PostgreSQL e esse contentor fizer bind-mount de um diretório do host, migre-o manualmente.

Verifique primeiro o que o seu contentor de base de dados utiliza:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Se `"Type"` indicar `bind`, mova-o para um volume nomeado:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
```

# nome do volume se este host Docker executar mais do que uma implementação do Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Inicie novamente o PostgreSQL no volume, reutilizando os flags que tinha antes
#    mas substituindo o bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Assim que aceitar ligações, reconstrua os índices.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Utilize a sua própria imagem nos passos 2 e 3, não `postgres:16`.** Se a sua base de dados executar `pgvector/pgvector:pg16` ou outra variante, iniciar o cluster copiado com a imagem padrão pode falhar porque as bibliotecas de extensão esperadas estão em falta.

O seu diretório de dados original não é afetado por este procedimento, pelo que permanece como o seu caminho de reversão. Elimine-o apenas após confirmar que a base de dados migrada serve os seus workflows. O passo 4 é importante pela mesma razão que é na migração do Compose: a cópia transporta consigo qualquer dano de índice existente.

---

## Executar Mais do Que Uma Instância

Tudo o que foi descrito acima implementa uma única instância do Heym. Quando uma máquina já não é suficiente, aponte uma segunda instância para a mesma base de dados PostgreSQL e esta junta-se como worker: as execuções em segundo plano — cron, webhooks, chamadas de ferramentas MCP, triggers de chat — são então partilhadas entre as instâncias segundo uma percentagem que define em **Settings → Instances**.

As instâncias nunca comunicam entre si. O Postgres transporta o trabalho, pelo que um worker não necessita de nenhuma porta aberta nem de rota de retorno para a instância principal, e não está envolvido nenhum message broker. O trabalho que toca no disco local — ficheiros do Drive, espaços de trabalho de agentes de programação, plugins instalados — é sempre executado na instância principal, pelo que nada tem de ser partilhado através de um sistema de ficheiros.

Duas regras que o cluster não consegue impor por si: cada instância deve utilizar a mesma `SECRET_KEY` e `ENCRYPTION_KEY`, e o ingress deve apontar apenas para a instância principal. Ambas são explicadas, juntamente com as regras de colocação e a forma de escolher as percentagens, em [Distribuição de Carga](../reference/cluster.md).

> Isto é distribuição de carga, não alta disponibilidade. A instância principal continua a ser um ponto único de falha para o ingress, o armazenamento de ficheiros e o editor.

## Workflows Comuns

**Configuração inicial:**

```bash
./run.sh          # desenvolvimento — cria .env a partir de .env.example e gera SECRET_KEY/ENCRYPTION_KEY automaticamente
# ou
./deploy.sh       # produção — mesma geração automática de .env e chaves
```

Para a imagem pré-construída `docker run`, gere as chaves manualmente primeiro (ver a secção **Imagem Pré-construída** acima).

**Atualizar produção após uma alteração de código:**

```bash
git pull
./deploy.sh       # reconstrói imagens, substituição sem tempo de inatividade
```

**Verificar os registos de produção:**

```bash
./deploy.sh --logs
```

**Parar os serviços de produção:**

```bash
./deploy.sh --down
```

---

## Relacionado

- [Introdução](./introduction.md) – Visão geral da plataforma
- [Início Rápido](./quick-start.md) – Construa o seu primeiro workflow
- [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referência completa de configuração
- [Segurança](../reference/security.md) – Definições de JWT, encriptação e CORS
- [Distribuição de Carga](../reference/cluster.md) – Executar várias instâncias contra uma base de dados
