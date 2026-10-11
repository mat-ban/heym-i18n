# 実行とデプロイ

Heym は環境ごとに 2 つのスクリプトを提供しています。ローカル開発用の `run.sh` と、Docker Compose を使用した本番デプロイ用の `deploy.sh` です。

> **動画チュートリアル:** [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU) — リポジトリをクローンし、PostgreSQL を起動し、必要な環境変数を入力して、ローカルインスタンスで最初のアカウントを作成します。

## 前提条件

両方のスクリプトは、以下のツールがインストールされている必要があります。

| ツール | 用途 |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | データベースコンテナ（開発）およびフルスタック（本番） |
| [uv](https://github.com/astral-sh/uv) | バックエンド用の Python パッケージマネージャー |
| [bun](https://bun.sh) | フロントエンド用の JavaScript ランタイム |

## 環境のセットアップ

`run.sh` と `deploy.sh` はどちらも、プロジェクトルートの `.env` ファイルを読み込みます。ファイルが存在しない場合、スクリプトは `.env.example` から自動的に作成します — ローカル開発と本番の両方で同様です。

`SECRET_KEY` と `ENCRYPTION_KEY` は `.env.example` では空の状態で提供されます。いずれかが空の場合、`run.sh` と `deploy.sh` は暗号学的に強力な値を自動生成し、`.env` に書き戻すため、新規セットアップ時に手動でキーを扱う必要はありません。既存の `.env` に従来の `ENCRYPTION_KEY` プレースホルダー（`change_this_to_a_random_32_byte_hex_value`）がまだ含まれている場合、スクリプトは上書きせずに明示的なエラーで停止します — そのキーをローテーションすると、以前に暗号化された認証情報が読み取れなくなるためです。バックエンド自体も、いずれかのキーが空または既知のプレースホルダーのままである場合、起動を拒否します。

手動でファイルを作成する場合（任意 — スクリプトが自動で行います）:

```bash
cp .env.example .env
```

主要な環境変数:

サポートされているすべての変数、デフォルト値、本番環境での注意事項については、[Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) を参照してください。

| 変数 | 説明 |
|----------|-------------|
| `SECRET_KEY` | **必須。** JWT 署名シークレット。空の場合、`run.sh`/`deploy.sh` によって自動生成されます。 |
| `ENCRYPTION_KEY` | **必須。** 認証情報の暗号化キー。空の場合、`run.sh`/`deploy.sh` によって自動生成されます。 |
| `DATABASE_URL` | 任意のデータベース接続文字列の上書き。空の場合、Heym は `POSTGRES_*` 設定から構築します。 |
| `BACKEND_PORT` | バックエンド API のポート — デフォルトは `10105` |
| `FRONTEND_PORT` | フロントエンドのポート — デフォルトは `4017` |
| `FRONTEND_URL` | **本番環境では必須。** アプリの公開 URL（スキーム + ホスト、例: `https://heym.example.com`）。OAuth リダイレクト URI（Google Sheets、BigQuery、Notion など）や、バックグラウンド実行が生成するレビュー、Codex フォローアップ、ファイルリンクに使用されます。ユーザーがブラウザで使用する URL と一致している必要があります。Cluster 内では、すべてのインスタンスに同じ値を設定してください。 |
| `ALLOW_REGISTER` | ユーザー登録の開放（本番では `false`、開発では `true`）。管理者アカウントが作成された後にのみ `false` に切り替えてください — 初回ユーザーのブートストラップは存在しないため、空のデータベースと登録無効化の組み合わせではアカウントを作成する手段がなくなります。 |
| `DOCKER_LOGS_ENABLED` | `true` に設定すると、Docker を利用した Logs タブへのアクセスを有効化します。Docker ソケットへのアクセスも必要です。 |
| `DOCKER_LOGS_ALLOWED_EMAILS` | `DOCKER_LOGS_ENABLED=true` の場合に Docker ログへのアクセスを許可する、信頼されたユーザーメールアドレスのカンマ区切りリスト |
| `REQUEST_BODY_MAX_SIZE_MB` | Endpoint ハンドラーが実行される前に受け入れられる HTTP リクエストボディの最大サイズ。デフォルトは `100` で、マルチパートのオーバーヘッド分の余裕を確保するため `FILE_MAX_SIZE_MB` より 1 MB 大きく設定されています。 |
| `HEYM_PYTHON_TOOL_SANDBOX` | ユーザー定義の Python ツールの実行方法: `auto`（デフォルト — 堅牢化された分離 Docker コンテナ。Docker が利用できない場合はフェイルクローズ）、`docker`（同様だがフォールバックしない）、または `subprocess`（インプロセスのローカルフォールバック。セキュリティ境界ではなく、信頼済み/開発専用）。`run.sh` はネイティブ開発用に `subprocess` を設定します。詳細は [Security](../reference/security.md#python-tool-sandbox) を参照してください。 |
| `HEYM_PYTHON_TOOL_IMAGE` | Python ツールの Docker サンドボックスで使用されるイメージ。空 = 実行中のバックエンドイメージを自動検出。 |

データベース接続のデフォルト値（`POSTGRES_HOST`、`POSTGRES_PORT`、`POSTGRES_USER`、`POSTGRES_PASSWORD`、`POSTGRES_DB`）は、[Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) および `.env.example` に記載されています。

---

## 開発: `run.sh`

`run.sh` は、データベース（Docker コンテナとして）、FastAPI バックエンド、Vite 開発サーバーの3つのサービスをすべてローカルで単一のコマンドで起動します。

```bash
./run.sh
```

**実行内容（ステップごとの説明）:**

1. `docker`、`bun`、`uv` が利用可能であることを確認します
2. `.env.example` から `.env` が存在しない場合に作成し、`SECRET_KEY` と `ENCRYPTION_KEY` が空の場合はランダムな値を生成します
3. ポート `6543` でデータベースの Docker コンテナを起動（または作成）します。データはホストディレクトリではなく `heym-postgres-data` Docker ボリュームに保存されます
4. `uv sync` で Python 依存関係をインストールします
5. Alembic データベースマイグレーション（`alembic upgrade head`）を実行します
6. バックエンドとフロントエンドのポートが使用中の場合は解放します
7. `--reload` 付きで FastAPI バックエンドを起動します（コード変更時にホットリロード）
8. `bun install` でフロントエンド依存関係をインストールします
9. Vite 開発サーバーを起動します

**オプション:**

| フラグ | 説明 |
|------|-------------|
| *(なし)* | デバッグログを有効にして起動します（`LOG_LEVEL=DEBUG`） |
| `--no-debug` | デフォルトのログレベルで起動します（デバッグ出力なし） |
| `--help` | 使用方法を表示します |

**サービスアドレス（開発環境）:**

| サービス | アドレス |
|---------|---------|
| フロントエンド | `localhost` の `FRONTEND_PORT`（デフォルト: 4017） |
| バックエンド API | `localhost` の `BACKEND_PORT`（デフォルト: 10105） |
| インタラクティブ API ドキュメント | `localhost:10105/docs` |
| データベース | `localhost:6543` |

`Ctrl+C` を押すと、すべてのサービスが正常に停止します。

---

## エンドツーエンドテスト: `run_e2e.sh`

フロントエンドの Playwright スイートは、実際の Vue アプリケーション、FastAPI バックエンド、および分離された PostgreSQL データベースに対して実行されます:

```bash
./run_e2e.sh
```

このスイートは主要パスのスモークテストおよびリグレッションテストスイートであり、網羅的な製品カバレッジではありません。認証、コア Workflow のライフサイクルと実行、選択されたダッシュボードリソース、公開ルート、およびモック化された HITL レビュー UI をカバーしています。プロバイダー統合、すべてのノードタイプ、共有/権限マトリクス、および完全な HITL 再開実行は、主にバックエンドテストでカバーされるか、専用の統合環境が必要です。

各実行には、専用の一時的な PostgreSQL 16 コンテナ、ランダムに割り当てられた利用可能なデータベース/バックエンド/フロントエンドポート、認証状態、テスト結果、および HTML レポートが割り当てられます。これにより、複数の `run_e2e.sh` プロセスが状態を共有したりアーティファクトを上書きしたりすることなく、同時に実行できます。スクリプトは実行終了時にデータベースコンテナを削除し、アーティファクトディレクトリとレポートパスを出力します。

便利なコマンド:

```bash
./run_e2e.sh --ui         # 分離されたデータベースを使用したインタラクティブ Playwright ランナー
cd frontend
bun run test:e2e:report   # 直近に完了したローカル実行のレポートを開く
```

直接 `bun run test:e2e` および `bun run test:e2e:ui` を実行する場合は、明示的な `DATABASE_URL` が必要です。これにより、ローカル開発データベースに対して意図せず起動することを防ぎます。通常のローカル実行には `./run_e2e.sh` を使用してください。

`./check.sh` は、E2E スイートを除いた lint、typecheck、フォーマット、およびバックエンドテストを実行し、デフォルトのローカルチェックパスを高速に保ちます。Playwright E2E テストは `./run_e2e.sh` で別途実行してください。プルリクエストでは常に GitHub Actions で Chromium E2E スイートが実行され、失敗時にはトレース、スクリーンショット、動画、および HTML レポートが保持されます。

---

## 本番環境: `deploy.sh`

`deploy.sh` は Docker Compose を使用してフルスタックをビルドおよび起動します。データベース、バックエンド、フロントエンドの3つのサービスはすべてコンテナとして実行されます。バックエンドのエントリーポイントは、8ワーカーでサーバーを起動する前にマイグレーションを自動的に実行します。

**初回デプロイ（ビルド + 起動）:**

```bash
./deploy.sh
```

これはゼロダウンタイムデプロイを実行します。既存のコンテナを稼働させたままイメージを先にビルドし、その後で新しいバージョンに切り替えます。

**利用可能なコマンド:**

| コマンド | 説明 |
|---------|-------------|
| `./deploy.sh` | イメージをビルドし、すべてのサービスを起動/更新します |
| `./deploy.sh --status` | コンテナのステータスを表示します |
| `./deploy.sh --logs` | すべてのコンテナからログをストリーミング表示します |
| `./deploy.sh --restart` | すべてのコンテナを再起動します |
| `./deploy.sh --down` | すべてのコンテナを停止して削除します |
| `./deploy.sh --migrate-pgdata` | 一回限りのマイグレーション: 既存の `data/postgres` ディレクトリを `heym-postgres-data` Docker ボリュームにコピーし、そのインデックスを再構築します |
| `./deploy.sh --help` | 使用方法を表示します |

**データベースストレージ: ホストディレクトリではなく Docker 名前付きボリューム。**

Compose は PostgreSQL を `heym-postgres-data` Docker ボリュームに保存します。以前のバージョンでは、代わりにホストディレクトリ `./data/postgres` をバインドマウントしていました。macOS（virtiofs）および Windows/WSL2 上のホストバインドマウントは、PostgreSQL が必要とする `fsync` およびファイルクローズの保証を提供しません。これらの環境では Cluster が WAL セグメントで `PANIC: could not close file … Input/output error` に遭遇し、時間の経過とともに破損します。Linux のバインドマウントは影響を受けませんでしたが、現在ではすべてのプラットフォームが同じレイアウトを使用しています。

`./data/postgres` にまだデータがあるデプロイメントのアップグレードは、一回限りの手順です。`./deploy.sh` はそれを検出すると、ビルドの前に停止し、先にマイグレーションを実行するよう促します:

```bash
./deploy.sh --migrate-pgdata   # サービスを停止し、ボリュームにコピーし、インデックスを再構築します
./deploy.sh                    # 通常どおりデプロイします
```

**マイグレーションはインデックスも再構築します。** コピーはバイト単位で行われるため、古いバインドマウントが引き起こしたインデックスの損傷もそのまま引き継がれます。そのため `--migrate-pgdata` は、新しいボリューム上で `postgres` サービスだけを起動し、それに対して `reindexdb` を実行し、スタックの残りが起動する前に再度停止します。これは重要です。この種の破損は、インデックスエントリがヒープの末尾を超えてポイントしたままになる状態を残します。この状態は `pg_amcheck` ではクリーンと報告されるため、チェックを通過してもテーブルが健全である証拠にはなりません。REINDEX はそれらのエントリを修復しますが、古いファイルシステムがすでに失ったヒープページを復元することはできません。大規模で健全であることが判明しているデータベースでは、`./deploy.sh --migrate-pgdata --skip-reindex` で再構築をスキップできます。

コピーは非破壊的です。`./data/postgres` はバックアップとしてそのまま残り、マイグレーションはすでにデータベースを保持しているボリュームへの上書きを拒否します。いずれかの手順が失敗した場合、新しいボリュームは削除されるため、中途半端にマイグレーションされた Cluster が誤ってデプロイされることはありません。Workflow が無事であることを確認したら、古いディレクトリを削除してください。`postgres` コンテナにも同じガードがあるため、手動で `docker compose up` を実行しても、データの上に空のデータベースが黙って初期化されることはありません。新規インストールでは何もする必要はありません。

**サービスアドレス（本番環境）:**

フロントエンドコンテナは `FRONTEND_PORT`（デフォルト: 4017）で公開されます。バックエンド API は `/api` パスの下で提供され、フロントエンドコンテナを経由してプロキシされます。そのため、本番環境では公開向けのポートは1つだけです。

**コンテナの概要:**

| コンテナ | 説明 |
|-----------|-------------|
| `heym-db` | リレーショナルデータベース |
| `heym-backend` | FastAPI API サーバー（8ワーカー、`backend/Dockerfile` からビルド） |
| `heym-frontend` | ビルドされた Vue アプリを配信するフロントエンドプレビューコンテナ（`frontend/Dockerfile` からビルド） |

**バージョン更新バッジ:**

アプリのヘッダーには、実行中の Docker ビルドバージョンが表示されます。そのバージョンが最新の Heym GitHub リリースより古い場合、バージョンの隣に紫色の **Update** バッジが表示されます。バージョンまたはバッジをクリックすると、Heym GitHub リリースページが開きます。

---

## ビルド済みイメージ: `docker run`

アプリをローカルでビルドしたくない場合は、公開されているコンテナイメージをプルして直接実行できます。

このイメージは、フロントエンドとバックエンドを1つのコンテナ内で同時に起動します。PostgreSQL は引き続き外部にありますが、`.env.example` から `DATABASE_URL` または `POSTGRES_*` 変数のいずれかを指定できます。

> **データベースは Docker の名前付きボリュームに保存してください。** リリースイメージにはデータベースが同梱されていないため、`DATABASE_URL` の背後にある PostgreSQL はご自身で運用していただく必要があります。ホストパスではなく `-v heym-postgres-data:/var/lib/postgresql/data` としてマウントしてください。macOS（virtiofs）および Windows/WSL2 では、バインドマウントされた PostgreSQL のデータディレクトリはデータベースが要求する `fsync` の保証を満たさず、時間の経過とともに Cluster が破損します。

> **ベクトルストアのバックエンド。** `run.sh` と `deploy.sh` は公式の `postgres:16` イメージを実行し、起動時に `postgresql-16-pgvector` パッケージを自動インストールするため、**Postgres（pgvector）RAG バックエンド**はデータを変更することなくそのまま動作します。一方、ビルド済みのシングルコンテナイメージは、**お客様が用意した** PostgreSQL に接続します。そのデータベースは Postgres バックエンドを使用するために `vector` 拡張機能をサポートしている必要があります。Heym は自身が管理していないデータベースに pgvector をインストールすることはできません。これがない場合、起動時のマイグレーションは pgvector テーブルを安全にスキップします。デプロイは引き続き成功し、Qdrant RAG は動作し続け、Postgres ベクトルストアの作成やアップロードは pgvector が有効になるまで明確な「バックエンド利用不可」メッセージを返します。

**イメージを直接実行する場合は、キーをご自身で設定してください。** `run.sh`/`deploy.sh` とは異なり、ビルド済みイメージはキーを自動生成しません。`cp .env.example .env` の後、2つの空のキーを設定してください（その場で置換することで重複エントリを回避できます）：

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

> **ファイルとプラグインのマウントは絶対パスにしてください。** `FILE_STORAGE_DIR` と `HEYM_PLUGINS_DIR` はデフォルトで相対パス `./data/files` と `data/plugins` になり、リリースイメージはバックエンドを `/app/backend` から起動します。相対パスのままにすると、`/app/backend/data/files` と `/app/backend/data/plugins` に解決されるため、上記の2つのバインドマウントには何も渡らず、コンテナを置き換えた際にアップロードが失われます。`-e` フラグは、`.env.example` が `--env-file` を通じて提供する相対値を上書きします。これは、コマンドラインの `-e` が `--env-file` より優先されるためです。Compose（`./deploy.sh`）ではこれは不要です。そのイメージはバックエンドを `/app` から実行し、相対デフォルト値がすでにマウント先に配置されるためです。

> **Docker ソケットへのアクセス。** `/var/run/docker.sock` をマウントすると、バックエンドにホストの Docker デーモンに対する広範な制御が与えられます。デフォルトの Docker Compose サービスと直接の `docker run` の例では、`docker` コマンドを実行する Docker ベースの MCP stdio ツールのためにこれを含めています。Logs タブには引き続き `DOCKER_LOGS_ENABLED=true` と、信頼できるユーザーのメールアドレスをカンマ区切りで列挙した `DOCKER_LOGS_ALLOWED_EMAILS` が必要です。Docker ログを有効にする前に信頼できる管理者アカウントを作成するか、`ALLOW_REGISTER=false` を維持して、未検証の自己登録が許可リストのメールアドレスを取得できないようにしてください。ユーザー定義の Python ツールにはこのソケットは**付与されません**。これらは Docker ソケットのない、別の堅牢化されたコンテナで実行されます。詳細は[セキュリティ](../reference/security.md#python-tool-sandbox)を参照してください。

> **Codex ランナー。** Codex ノードは、Codex の Linux サンドボックスが名前空間を作成できるように、同じ `ghcr.io/heymrun/heym` イメージを兄弟ランナーコンテナ（`--entrypoint codex`）として使用します。直接イメージセットアップで Codex Workflow を使用する場合は、`heym-codex-workspaces` ボリュームマウントを維持してください。ランナーは Docker ソケットやバックエンドのシークレットを受け取りません。

> **OpenCode Go ランナー。** OpenCode Go ノードは、同じイメージを堅牢化された兄弟ランナー（`--entrypoint opencode`）として使用し、`heym-opencode-workspaces` を共有します。直接イメージセットアップで OpenCode Workflow を使用する場合は、そのボリュームマウントを維持してください。ランナーは Docker ソケットや GitHub Token を受け取りません。

> **Skill サンドボックス。** Agent ノード上の Python スキルは、`heym-codex-workspaces` ボリュームを共有する堅牢化された兄弟コンテナで実行されるため、Codex だけでなくスキルのためにもそのボリュームマウントを維持してください。各実行には分離された実行ごとのサブパスが割り当てられ、兄弟コンテナは Docker ソケットもバックエンドのシークレットも受け取りません。これには **Docker Engine 25.0+** が必要です。古いエンジンでは、またはボリュームがない場合、`HEYM_PYTHON_TOOL_SANDBOX=auto` はフェイルクローズします。信頼できるシングルユーザーセットアップに限り `HEYM_PYTHON_TOOL_SANDBOX=subprocess` を設定してください。詳細は[セキュリティ](../reference/security.md#skill-sandbox)を参照してください。

> **Playwright には `--shm-size 2g` が必要です。** Docker はコンテナに 64 MB の `/dev/shm` を割り当てますが、Chromium はその容量ではレンダラーがクラッシュします。ステップベースの Playwright ノードはこのコンテナ内で Chromium をサブプロセスとして実行するため、制限はこのコンテナのものになります。カスタム `playwrightCode` は独自の設定を持つ兄弟コンテナで実行されます。`docker-compose.yml` はすでに `shm_size: "2gb"` を宣言しているため、`run.sh` と `deploy.sh` は影響を受けません。プレーンな `docker run` のみがこのフラグを必要とします。

> **Playwright Run Code。** カスタム Playwright Python には `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` と上記の Docker ソケットマウントが必要です。リリースイメージは GHCR レイアウト（`/app/backend/.venv`）用に `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` を設定します。Compose の `./deploy.sh` はサンドボックスイメージをデフォルトで `heym-backend:local` に設定します。サンドボックスコンテナ内の Chromium 起動引数には `--no-sandbox` を維持してください。

**イメージを直接実行する場合の最小環境変数：**

| 変数 | 必須 | 目的 |
|----------|----------|---------|
| `DATABASE_URL` | 任意 | PostgreSQL 接続文字列の完全な上書き |
| `POSTGRES_HOST` | `DATABASE_URL` が空の場合は必須 | PostgreSQL ホスト |
| `POSTGRES_PORT` | `DATABASE_URL` が空の場合は必須 | PostgreSQL ポート |
| `POSTGRES_USER` | `DATABASE_URL` が空の場合は必須 | PostgreSQL ユーザー名 |
| `POSTGRES_PASSWORD` | `DATABASE_URL` が空の場合は必須 | PostgreSQL パスワード |
| `POSTGRES_DB` | `DATABASE_URL` が空の場合は必須 | PostgreSQL データベース名 |
| `SECRET_KEY` | 必須 | JWT 署名シークレット |
| `ENCRYPTION_KEY` | 必須 | 認証情報の暗号化キー |
| `FRONTEND_URL` | 推奨 | 公開ブラウザ URL。特に OAuth コールバック用 |
| `CORS_ORIGINS` | 推奨 | 許可するブラウザオリジン |
| `FILE_STORAGE_DIR` | 推奨 | そのパスをマウントする場合は絶対パス `/app/data/files` を設定してください。相対パスのデフォルト `./data/files` はこのイメージでは `/app/backend` 配下に解決され、マウントを外してしまいます |
| `ALLOW_REGISTER` | 推奨 | オープンサインアップを意図しない限り、本番環境では `false` に設定してください。ただし管理者アカウントが存在してからにしてください。初回ユーザーのブートストラップはありません |
| `DOCKER_LOGS_ENABLED` | 任意 | Logs タブで Docker ソケットアクセスを使用できるようにするには `true` に設定します |
| `DOCKER_LOGS_ALLOWED_EMAILS` | `DOCKER_LOGS_ENABLED=true` の場合は必須 | Docker ログへのアクセスを許可する信頼済みユーザーのメールアドレスのカンマ区切りリスト |
| `HEYM_PLUGINS_ENABLED` | 任意 | プラグインサブシステム（zip としてインストールされるカスタムノード）を有効にするには `true` に設定します。デフォルトでは無効 |
| `HEYM_PLUGIN_ADMIN_EMAILS` | `HEYM_PLUGINS_ENABLED=true` の場合は必須 | プラグインのインストール/アンインストールを許可するオペレーターのメールアドレスのカンマ区切りリスト |
| `HEYM_PLUGINS_DIR` | 任意 | プラグインファイルの保存場所。そのパスをマウントする場合は絶対パス `/app/data/plugins` を設定してください。相対パスのデフォルト `data/plugins` はこのイメージでは `/app/backend` 配下に解決され、マウントを外してしまいます |
| `HEYM_PYTHON_TOOL_SANDBOX` | 任意 | Python ツールの分離モード。デフォルトは `auto`（強化された Docker サンドボックス、フェイルクローズ）。[Security](../reference/security.md#python-tool-sandbox) を参照してください |
| `HEYM_PYTHON_TOOL_IMAGE` | 任意 | Python ツールサンドボックスイメージの上書き。空 = バックエンドイメージを自動検出 |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | 任意 | 兄弟 Codex ランナーコンテナが使用する Docker ボリューム。Docker デプロイではデフォルトで `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | 任意 | Codex のサンドボックス化されたコマンドがファイル/依存関係をダウンロードできるようにします。Docker デプロイではデフォルトで有効 |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | 任意 | 兄弟 OpenCode ランナーコンテナが使用する Docker ボリューム。Docker デプロイではデフォルトで `heym-opencode-workspaces` |

**注記：**

- イメージはポート `4017` を公開します
- バックエンドは内部に留まり、`/api` 配下でプロキシされます
- `POSTGRES_HOST=localhost` の場合、リリースイメージは必要に応じて自動的に `host.docker.internal` に書き換えるため、macOS Docker/Desktop ツール上のホストレベルの PostgreSQL コンテナでも同じ `.env` が機能します
- Drive アップロードとスキル生成ファイルをコンテナ再起動後も保持したい場合は、`data/files` マウントを維持してください
- **プラグイン：** 有効にするには、`HEYM_PLUGINS_ENABLED=true` と `HEYM_PLUGIN_ADMIN_EMAILS` を設定し、インストールされたプラグインファイルがコンテナ再作成後も保持されるように `data/plugins` をマウントしてください。プラグインメタデータは PostgreSQL に保存されるため、これも保持されます。プラグインが宣言する pip `dependencies` はインストール時にコンテナにインストールされます。イメージのファイルシステムは一時的であるため、インストールされたすべてのプラグインに対して**起動時に自動的に再インストールされます**（リリースイメージの `uv` venv は書き込み可能なため、シングルコンテナイメージでも機能します）

### 既存のデータベースを名前付きボリュームに移動する

`./deploy.sh --migrate-pgdata` は Compose スタックのみを認識します。独自の PostgreSQL コンテナに対してリリースイメージを実行し、そのコンテナがホストディレクトリをバインドマウントしている場合は、自分で移行してください。

まずデータベースコンテナが何を使用しているかを確認します：

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

`"Type"` が `bind` と表示される場合は、名前付きボリュームに移動します：

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

# このDockerホストで複数のHeymデプロイメントを実行する場合は、ボリューム名を指定します。
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. ボリューム上でPostgreSQLを再度起動します。以前使用していたフラグを再利用しますが、
#    バインドマウントは置き換えます。
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. 接続を受け付けるようになったら、インデックスを再構築します。
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**ステップ2と3では、`postgres:16`ではなく独自のイメージを使用してください。** データベースが`pgvector/pgvector:pg16`やその他のバリアントで実行されている場合、コピーしたClusterを標準イメージで起動すると、必要な拡張ライブラリが存在しないため失敗する可能性があります。

この手順では元のデータディレクトリは変更されないため、ロールバック用のパスとして残ります。移行したデータベースがWorkflowにサービスを提供していることを確認した後にのみ削除してください。ステップ4が重要なのは、Compose移行の場合と同じ理由です。コピーには既存のインデックス損傷もそのまま引き継がれます。

---

## 複数インスタンスの実行

ここまでの内容はすべて、単一のHeymインスタンスをデプロイするものです。1台のマシンでは足りなくなったら、2つ目のインスタンスを同じPostgreSQLデータベースに向けると、ワーカーとして参加します。バックグラウンド実行（Cron、Webhook、MCPツール呼び出し、チャットTrigger）は、**Settings → Instances**で設定した割合に応じてインスタンス間で共有されます。

インスタンス同士が通信することはありません。作業はPostgresが担うため、ワーカーには開いたポートもメインインスタンスへの戻り経路も不要で、メッセージブローカーも関与しません。ローカルディスクに触れる作業（Driveファイル、コーディングエージェントのワークスペース、インストール済みプラグイン）は常にメインインスタンスで実行されるため、ファイルシステム経由で共有する必要はありません。

Cluster側では強制できない2つのルールがあります。すべてのインスタンスが同じ`SECRET_KEY`と`ENCRYPTION_KEY`を使用すること、そしてイングレスはメインインスタンスのみを指すことです。どちらも、配置ルールや割合の選び方とあわせて[Load Distribution](../reference/cluster.md)で説明しています。

> これは負荷分散であり、高可用性ではありません。メインインスタンスは、イングレス、ファイルストレージ、エディタにとって単一障害点であり続けます。

## 一般的なWorkflow

**初回セットアップ:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

ビルド済みの`docker run`イメージの場合は、先に手動でキーを生成してください（上記の**Prebuilt Image**セクションを参照）。

**コード変更後に本番環境を更新:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**本番環境のログを確認:**

```bash
./deploy.sh --logs
```

**本番環境のサービスを停止:**

```bash
./deploy.sh --down
```

---

## 関連項目

- [Introduction](./introduction.md) – プラットフォームの概要
- [Quick Start](./quick-start.md) – 最初のWorkflowを構築する
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 設定の完全リファレンス
- [Security](../reference/security.md) – JWT、暗号化、CORS設定
- [Load Distribution](../reference/cluster.md) – 1つのデータベースに対して複数のインスタンスを実行する
