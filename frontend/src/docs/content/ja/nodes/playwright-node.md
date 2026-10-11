# Playwright

**Playwright** ノードは、設定可能なステップでブラウザ操作を自動化します。Web スクレイピング、フォーム入力、ブラウザベースの Workflow にご利用いただけます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.results`、`$nodeLabel.screenshot`、およびオプションの network/browser データ |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"`（デフォルト）または `"code"`（Run Code）。Properties Panel の Mode ドロップダウンで選択します |
| `playwrightSteps` | array | ステップ: navigate、click、type、aiStep など。各ステップは action と selector/params を持ちます。`disabled: true` を指定すると、ステップはリストに残りますが実行時にはスキップされます |
| `playwrightCode` | string | Mode が Run Code の場合に使用されるカスタム Playwright Python。堅牢化されたサンドボックス内で実行され、**デフォルトでは無効化されています** — 以下のセキュリティに関する注意をご参照ください |
| `playwrightHeadless` | boolean | ヘッドレスで実行します（デフォルト: true） |
| `playwrightStealth` | boolean | 一般的な Playwright 自動化シグナルを低減する、オプトインの Steps モード設定です（デフォルト: false）。Properties Panel でのラベル: Reduce automation flags |
| `playwrightTimeout` | number | タイムアウト（ミリ秒、デフォルト: 30000） |
| `playwrightCaptureNetwork` | boolean | JSON レスポンス、ヘッダー、Cookie、ブラウザストレージをキャプチャします |
| `playwrightAuthEnabled` | boolean | ステップ実行前に Cookie/storageState からブラウザ認証を復元します |
| `playwrightAuthStateExpression` | string | Playwright の `storageState` または生の `cookies[]` に解決される式または JSON |
| `playwrightAuthCheckSelector` | string | 認証ブートストラップ後に表示されている必要があるセレクタ |
| `playwrightAuthCheckTimeout` | number | 認証済みセレクタチェックのタイムアウト（ミリ秒、デフォルト: 5000） |
| `playwrightAuthFallbackSteps` | array | Cookie の復元でページが認証されなかった場合に実行する、ログイン専用のフォールバックステップ |

## ステップの種類

- **navigate** – URL へ移動します
- **refresh** – 現在のページを再読み込みします（オプションのステップ `timeout`（ミリ秒）で再読み込みナビゲーションを指定可能）
- **click** – セレクタで要素をクリックします
- **type** – 入力欄にテキストを入力します（1文字ずつ）
- **fill** – 入力欄の値を設定します
- **wait** – タイムアウト（ミリ秒）待機します
- **screenshot** – スクリーンショットを取得します（`outputKey` に base64 を results として保存）
- **getText** – 要素のテキストコンテンツを取得します（`selector`、オプションの `outputKey`）
- **getAttribute** – 属性値を取得します（`selector`、`attribute`、オプションの `outputKey`）
- **getHTML** – 要素の outer HTML を取得します（`selector`、オプションの `outputKey`）
- **getVisibleTextOnPage** – ページ全体の可視テキストを `document.body.innerText` として取得します（セレクタ不要。`outputKey` を使用。オプションのステップ `timeout`（ミリ秒）でキャプチャ前の待機を指定可能）
- **hover** – 要素にホバーします
- **selectOption** – `<select>` 内のオプションを選択します
- **scrollDown** / **scrollUp** – マウスホイールでスクロールします（オプションの `amount`（ピクセル））
- **aiStep** – LLM が手動ステップと同じ種類のアクションを返します（以下をご参照ください）。ネストされた `aiStep` はサポートされていません

## ステップをオフにする

各ステップにはヘッダーに電源トグルがあります。オフにしたステップはタイトルが取り消し線付きで淡色表示になり、すべてのフィールドを保持したままリストに残り、ノード実行時にはスキップされます — 作業内容を削除せずに、失敗しているセレクタを切り分けるのに便利です。保存されたステップには `disabled: true` が付与され、このフラグのないステップは通常どおり実行されます。

無効化されたステップはノードの他の部分からは見えません。認証ブートストラップの「最初のステップは `navigate` でなければならない」というルールを満たすことはなく、無効化された `aiStep` は LLM 呼び出しを行わず、`playwrightAuthFallbackSteps` 内の無効化されたエントリもスキップされます。すべてのステップをオフにすると、いずれかを有効にするよう求めるメッセージとともに実行が失敗します。

## AI Step

**aiStep** アクションは、LLM を使用してページの HTML（およびオプションでスクリーンショット）を分析し、自然言語の指示から Playwright アクションを生成します。API は手動ステップと同じアクション名（`navigate`、`refresh`、`getText`、`getHTML`、`getAttribute`、`getVisibleTextOnPage`、`screenshot`、スクロールなど）を受け付けます。**Auto heal** は、失敗したセレクタベースのステップを、click、type、fill、hover、selectOption の代替手段にのみ置き換えます。

| オプション | 説明 |
|--------|-------------|
| `instructions` | AI が実行すべき内容（例: 「Login ボタンをクリックする」） |
| `credentialId` | LLM 認証情報（OpenAI、Google、または Custom） |
| `model` | 選択した LLM 認証情報から取得した、検索可能なモデル一覧 |
| `saveStepsForFuture` | 生成されたステップを次回実行用にキャッシュします（LLM 呼び出しを回避） |
| `sendScreenshot` | 視覚的要素のためにスクリーンショットを LLM へ送信します |
| `aiStepTimeout` | LLM 呼び出しのタイムアウト（ミリ秒、デフォルト 30000） |

### AI Auto Heal

**AI Auto Heal** は、Workflow を DOM の変更に対して耐性のあるものにします。セレクタが2回失敗すると（例: サイトのリニューアル後）、Heym は LLM を呼び出して代替ロケータ—通常は CSS セレクタの代わりに `role=button[name='Submit']` や `text=Exact text`—を探します。

AI step のプロパティで **Auto heal mode** を有効にします。保存されたステップが失敗した場合:

1. Heym が現在の HTML とスクリーンショットをキャプチャします
2. 失敗したステップとページコンテキストを LLM へ送信します
3. LLM が堅牢な代替手段（role ベースのロケータ、text ロケータ、またはフォールバック CSS）を返します
4. 新しいセレクタで再試行します

これにより、サイトがマークアップやクラス名を更新した際の不安定さを軽減できます。
## 自動化フラグの低減

サイトが標準的な自動化シグナル（ユーザーエージェント内の `HeadlessChrome`、`navigator.webdriver`、`window.chrome` の欠如）を理由に Playwright 同梱の Chromium をボットとして扱う場合は、**Reduce automation flags**（`playwrightStealth: true`）を有効にしてください。

このオプションは **Steps** モードでのみ適用されます。以下を実行します：

- Chromium の `--enable-automation` フラグを削除し、`--disable-blink-features=AutomationControlled` を設定します
- 標準的な Chrome ユーザーエージェントを送信します（`HeadlessChrome` を含みません）
- Playwright が空のままにする一般的なブラウザサーフェス（`window.chrome`、plugins）を復元します
- GPU が利用可能な場合（ローカルの macOS/Windows）、ホストの GPU レンダラーを変更せずに維持します。Linux/Docker には GPU がないため、Chromium のソフトウェアレンダラー文字列は SwiftShader ではなく、一般的な Mali（ARM）または Mesa（x86）GPU として報告されます。

これはセッションが Chrome DevTools Protocol 経由で駆動されていることを隠すものではなく、サイトのセキュリティ、CAPTCHA、アクセス制御を回避する手段でもありません。実行を許可されている Workflow（内部ツール、自身のサイト、許可されたブラウザ自動化）に使用してください。

Run Code モードは変更されません。カスタムスクリプトは自身で Chromium を起動します。

## ネットワークキャプチャ

`playwrightCaptureNetwork` を有効にすると、実行中に追加のデバッグデータを収集できます：

- `networkRequests` – キャプチャされた JSON/API レスポンス
- `cookies` – 実行終了時のブラウザ Cookie
- `localStorage` – ブラウザの `localStorage` キーと値のペア
- `sessionStorage` – ブラウザの `sessionStorage` キーと値のペア

これは、自動化フローの後に隠れた API 呼び出し、認証状態、ブラウザ側のデータを検査する必要がある場合に便利です。

## Cookie ブートストラップとログインフォールバック

Playwright で既にログイン済みのページを開きたい場合は、`playwrightAuthEnabled` を有効にしてください。

### 認証状態のソース

`playwrightAuthStateExpression` に `$global.authState` のような式を設定します。値は以下のいずれかです：

- Playwright の `storageState` オブジェクト：`{"cookies": [...], "origins": [...]}`
- 生の `cookies[]` 配列
- いずれかの形式を含む JSON 文字列

推奨パターン：

1. ネットワークキャプチャまたは認証ブートストラップを有効にした Playwright ノードを実行します
2. `$playwrightNode.cookies` または完全な認証状態オブジェクトを [Global Variable](../reference/global-variables.md) に保存します
3. 以降の Playwright ノードで `$global.authState` を介してその変数を再利用します

### 認証チェック

最初のメイン Playwright ステップは `navigate` である必要があります。そのステップが読み込まれた後、Heym は `playwrightAuthCheckSelector` をチェックします。

- セレクターが表示されている場合、残りのメインステップは通常どおり続行されます
- セレクターが存在しない場合、Heym は `playwrightAuthFallbackSteps` を実行します
- フォールバックステップの完了後、Heym は同じセレクターを再度チェックします
- セレクターが依然として存在しない場合、ノードは認証ブートストラップエラーで失敗します

フォールバックステップは認証失敗後のナビゲーションを担います。メインフローの残りの部分が期待する認証済みページにブラウザを残す必要があります。

## 出力フィールド

- `$playwrightNode.status` – 成功時は `"ok"`
- `$playwrightNode.results` – ステップの出力（getText、getHTML、getVisibleTextOnPage、getAttribute、screenshot キーなど）
- `$playwrightNode.screenshot` – ステップが保存した場合の Base64 スクリーンショット
- `$playwrightNode.cookies` – 認証ブートストラップまたはネットワークキャプチャが有効な場合の最終ブラウザ Cookie
- `$playwrightNode.networkRequests` – キャプチャされたネットワークレスポンス（有効な場合）
- `$playwrightNode.localStorage` – ブラウザのローカルストレージ（有効な場合）
- `$playwrightNode.sessionStorage` – ブラウザのセッションストレージ（有効な場合）

## 例

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Run Code モード

Properties Panel で **Mode** を **Run Code** に設定すると、ビジュアルステップの代わりに `playwrightCode` を編集できます。認証ブートストラップは Steps モードにのみ適用されます。

例（サンドボックス / Docker — Chromium には `--no-sandbox` が必要）：

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

ラッパーは `inputs`、`headless`、`timeout_ms`、`capture_network` を提供します。コード内に `$nodeLabel.field` 式を埋め込むことができます。`status` と `results` を含む JSON を出力してください。
## カスタムコードのセキュリティ

`playwrightCode` フィールドは任意の Python を実行します。これはコード実行と等価であるため、**デフォルトでは無効**であり、有効化された場合もサンドボックス化されます：

- **デフォルトでは無効。** `playwrightCode` が設定されたノードを実行すると、オペレーターが `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` を設定しない限り、明確なエラーで失敗します。このチェックは実行時に実施されるため、以前に保存された Workflow やスケジュール実行／サブ Workflow 実行にも適用されます。
- **有効化時は隔離。** カスタムコードはバックエンドプロセス内では実行されません。Docker ソケットなし、バックエンドのバインドマウントなし、環境変数にバックエンドのシークレットなし、ケイパビリティのドロップ、`no-new-privileges`、CPU／メモリ／PID 制限を備えた、堅牢化された使い捨ての兄弟コンテナ内で実行されます。Docker が利用できない場合、実行はフェイルクローズします。`HEYM_PLAYWRIGHT_SANDBOX=subprocess` を指定すると、信頼済みまたはローカル開発用途に限りインプロセス経路へ戻せます（セキュリティ境界ではありません）。ネイティブの `./run.sh` は、`HEYM_PLAYWRIGHT_SANDBOX_IMAGE` が設定されていない場合、デフォルトで `subprocess` になります。`./deploy.sh`（Compose）および GHCR 単一イメージは、`HEYM_PLAYWRIGHT_SANDBOX_IMAGE`（フォールバックとして `HEYM_CODEX_DOCKER_IMAGE`）を介して兄弟ランナーを解決し、対応する venv パス（`/app/.venv` または `/app/backend/.venv`）を使用します。
- **Chromium に関する注意。** サンドボックスコンテナはデフォルトで root として実行され、Chromium は `--no-sandbox` なしで root として実行することを拒否します。Chromium を起動するカスタムコードでは、例えば `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])` のように、このフラグを渡す必要があります。ステップベース（およびステルス）の起動でも `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` を渡すため、フィンガープリントスクリプトが `stun.l.google.com:19302` への STUN UDP を開くことはできません。カスタムの `chromium.launch` 呼び出しにも、このフラグを含める必要があります。

ステップベースの Playwright ノード（`playwrightSteps`）は完全に Heym によって生成され（任意のコードを含みません）、上記のいずれの影響も受けず、常に利用可能です。こちらを優先してください。

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Crawler ノード](./crawler-node.md) – FlareSolverr を使用したよりシンプルな Web スクレイピング
- [Credentials の共有](../reference/credentials-sharing.md) – AI ステップ用の LLM 認証情報
