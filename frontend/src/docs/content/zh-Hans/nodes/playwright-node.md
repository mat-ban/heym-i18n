# Playwright

**Playwright** 节点通过可配置的步骤自动化浏览器交互。可用于网页抓取、表单填写以及基于浏览器的工作流。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.results`、`$nodeLabel.screenshot`，以及可选的网络/浏览器数据 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"`（默认）或 `"code"`（Run Code）。在 Properties Panel 的 Mode 下拉框中选择 |
| `playwrightSteps` | array | 步骤：navigate、click、type、aiStep 等。每个步骤包含 action 和 selector/params。`disabled: true` 会将步骤保留在列表中，但在运行时跳过 |
| `playwrightCode` | string | 当 Mode 为 Run Code 时使用的自定义 Playwright Python。在加固沙箱中运行，且**默认禁用**——请参阅下方的安全说明 |
| `playwrightHeadless` | boolean | 以无头模式运行（默认：true） |
| `playwrightStealth` | boolean | 可选的 Steps 模式设置，可减少常见的 Playwright 自动化信号（默认：false）。Properties Panel 标签：Reduce automation flags |
| `playwrightTimeout` | number | 超时时间，单位 ms（默认：30000） |
| `playwrightCaptureNetwork` | boolean | 捕获 JSON 响应、headers、cookies 以及浏览器存储 |
| `playwrightAuthEnabled` | boolean | 在运行步骤前从 cookies/storageState 恢复浏览器认证 |
| `playwrightAuthStateExpression` | string | 可解析为 Playwright `storageState` 或原始 `cookies[]` 的表达式或 JSON |
| `playwrightAuthCheckSelector` | string | 认证引导后必须可见的 selector |
| `playwrightAuthCheckTimeout` | number | 认证 selector 检查的超时时间，单位 ms（默认：5000） |
| `playwrightAuthFallbackSteps` | array | 当 cookie 恢复未能通过页面认证时运行的仅登录回退步骤 |

## 步骤类型

- **navigate** – 跳转到 URL
- **refresh** – 重新加载当前页面（可选步骤 `timeout`，单位 ms，用于重新加载导航）
- **click** – 通过 selector 点击元素
- **type** – 向输入框逐字符输入文本
- **fill** – 填充输入值
- **wait** – 等待超时（ms）
- **screenshot** – 捕获截图（`outputKey` 将 base64 存储在 results 中）
- **getText** – 获取元素的文本内容（`selector`，可选 `outputKey`）
- **getAttribute** – 获取属性值（`selector`、`attribute`，可选 `outputKey`）
- **getHTML** – 获取元素的外部 HTML（`selector`，可选 `outputKey`）
- **getVisibleTextOnPage** – 以 `document.body.innerText` 获取整个页面的可见文本（无 selector；使用 `outputKey`；可选步骤 `timeout`，单位 ms，在捕获前等待）
- **hover** – 悬停在元素上
- **selectOption** – 在 `<select>` 中选择选项
- **scrollDown** / **scrollUp** – 鼠标滚轮滚动（可选 `amount`，单位像素）
- **aiStep** – LLM 返回与手动步骤相同类型的操作（见下文）；不支持嵌套 `aiStep`

## 关闭步骤

每个步骤的标题栏中都有一个电源开关。关闭的步骤会显示为标题带删除线且变暗，仍保留在列表中并保留其所有字段，并在节点运行时被跳过——这对于隔离失败的 selector 而无需删除工作内容非常有用。存储的步骤会带有 `disabled: true`；没有该标志的步骤会正常运行。

禁用的步骤对节点的其余部分不可见：它们不满足认证引导的“第一步必须是 `navigate`”规则，禁用的 `aiStep` 不会发起 LLM 调用，`playwrightAuthFallbackSteps` 中禁用的条目也会被跳过。将所有步骤都关闭会导致运行失败，并提示你启用其中一个。

## AI Step

**aiStep** 操作使用 LLM 分析页面 HTML（以及可选的截图），并根据自然语言指令生成 Playwright 操作。API 接受与手动步骤相同的操作名称（包括 `navigate`、`refresh`、`getText`、`getHTML`、`getAttribute`、`getVisibleTextOnPage`、`screenshot`、滚动等）。**Auto heal** 仅会为 click、type、fill、hover 和 selectOption 用替代方案替换失败的基于 selector 的步骤。

| 选项 | 描述 |
|--------|-------------|
| `instructions` | AI 应执行的操作（例如 "Click the Login button"） |
| `credentialId` | LLM 凭证（OpenAI、Google 或 Custom） |
| `model` | 来自所选 LLM 凭证的可搜索模型列表 |
| `saveStepsForFuture` | 缓存生成的步骤以供后续运行使用（避免 LLM 调用） |
| `sendScreenshot` | 将截图发送给 LLM 以识别视觉元素 |
| `aiStepTimeout` | LLM 调用的超时时间，单位 ms（默认 30000） |

### AI Auto Heal

**AI Auto Heal** 使工作流能够抵御 DOM 变化。当某个 selector 失败两次时（例如网站改版后），Heym 会调用 LLM 寻找替代定位器——通常是 `role=button[name='Submit']` 或 `text=Exact text`，而非 CSS selector。

在 AI step 属性中启用 **Auto heal mode**。如果保存的步骤失败：

1. Heym 捕获当前 HTML 和截图
2. 将失败的步骤 + 页面上下文发送给 LLM
3. LLM 返回一个稳健的替代方案（基于 role 的定位器、文本定位器或回退 CSS）
4. 使用新的 selector 重试

这可在网站更新其标记或类名时减少不稳定性。
## 减少自动化标记

当某个站点因标准自动化信号（用户代理中的 `HeadlessChrome`、`navigator.webdriver`、缺失的 `window.chrome`）而将 Playwright 捆绑的 Chromium 视为机器人时，启用 **Reduce automation flags**（`playwrightStealth: true`）。

此选项仅在 **Steps** 模式下生效。它会：

- 移除 Chromium 的 `--enable-automation` 标记，并设置 `--disable-blink-features=AutomationControlled`
- 发送标准 Chrome 用户代理（不含 `HeadlessChrome`）
- 恢复 Playwright 默认留空的常见浏览器表面（`window.chrome`、插件）
- 当有可用 GPU 时（本地 macOS/Windows），保持宿主 GPU 渲染器不变。Linux/Docker 没有 GPU；Chromium 的软件渲染器字符串会被报告为典型的 Mali（ARM）或 Mesa（x86）GPU，而非 SwiftShader。

它不会隐藏会话是通过 Chrome DevTools Protocol 驱动的事实，也不是绕过站点安全、CAPTCHA 或访问控制的手段。请将其用于你有权运行的工作流——内部工具、你自己的站点，以及获得许可的浏览器自动化。

Run Code 模式保持不变——自定义脚本自行启动 Chromium。

## 网络捕获

启用 `playwrightCaptureNetwork` 以在运行期间收集额外的调试数据：

- `networkRequests` – 捕获的 JSON/API 响应
- `cookies` – 运行结束时的浏览器 cookies
- `localStorage` – 浏览器 `localStorage` 键值对
- `sessionStorage` – 浏览器 `sessionStorage` 键值对

当你需要在自动化流程结束后检查隐藏的 API 调用、认证状态或浏览器端数据时，这非常有用。

## Cookie 引导与登录回退

当你希望 Playwright 打开一个已登录的页面时，启用 `playwrightAuthEnabled`。

### 认证状态来源

将 `playwrightAuthStateExpression` 设置为诸如 `$global.authState` 的表达式。该值可以是：

- 一个 Playwright `storageState` 对象：`{"cookies": [...], "origins": [...]}`
- 一个原始的 `cookies[]` 数组
- 包含上述任一形态的 JSON 字符串

推荐模式：

1. 运行一个启用了网络捕获或认证引导的 Playwright 节点
2. 将 `$playwrightNode.cookies` 或完整的认证状态对象存储到[全局变量](../reference/global-variables.md)中
3. 在后续 Playwright 节点中通过 `$global.authState` 复用该变量

### 认证检查

第一个主 Playwright 步骤必须是 `navigate`。该步骤加载后，Heym 会检查 `playwrightAuthCheckSelector`。

- 如果该选择器可见，其余主步骤正常继续
- 如果该选择器缺失，Heym 会运行 `playwrightAuthFallbackSteps`
- 回退步骤完成后，Heym 会再次检查同一选择器
- 如果该选择器仍然缺失，节点会以认证引导错误失败

回退步骤在认证失败后负责导航。它们应使浏览器停留在主流程其余部分所期望的已认证页面上。

## 输出字段

- `$playwrightNode.status` – 成功时为 `"ok"`
- `$playwrightNode.results` – 步骤输出（getText、getHTML、getVisibleTextOnPage、getAttribute、screenshot 键等）
- `$playwrightNode.screenshot` – 当某步骤保存截图时的 Base64 截图
- `$playwrightNode.cookies` – 当启用认证引导或网络捕获时的最终浏览器 cookies
- `$playwrightNode.networkRequests` – 捕获的网络响应（当启用时）
- `$playwrightNode.localStorage` – 浏览器本地存储（当启用时）
- `$playwrightNode.sessionStorage` – 浏览器会话存储（当启用时）

## 示例

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

## Run Code 模式

在 Properties Panel 中，将 **Mode** 设置为 **Run Code**，以编辑 `playwrightCode` 而非可视化步骤。认证引导仅适用于 Steps 模式。

示例（sandbox / Docker —— Chromium 需要 `--no-sandbox`）：

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

包装器提供 `inputs`、`headless`、`timeout_ms` 和 `capture_network`。你可以在代码中嵌入 `$nodeLabel.field` 表达式；打印包含 `status` 和 `results` 的 JSON。
## 自定义代码安全

`playwrightCode` 字段会执行任意 Python 代码。由于这等同于代码执行，该功能**默认禁用**，启用后也会在沙箱中运行：

- **默认禁用。** 除非运维人员设置 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`，否则执行设置了 `playwrightCode` 的节点会失败并返回明确的错误。该检查在执行时进行，因此同样覆盖此前已保存的 Workflow 以及定时 / 子 Workflow 运行。
- **启用后隔离运行。** 自定义代码不会在后端进程中运行，而是在一个经过加固的一次性同级容器中运行：无 Docker socket、无后端 bind mount、环境中无后端密钥、已丢弃 capabilities、启用 `no-new-privileges`，并设有 CPU / 内存 / PID 限制。如果 Docker 不可用，运行会以失败关闭（fail closed）方式终止。`HEYM_PLAYWRIGHT_SANDBOX=subprocess` 可退回进程内执行路径，仅适用于受信任或本地开发场景（不构成安全边界）。原生 `./run.sh` 在未设置 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` 时默认使用 `subprocess`。`./deploy.sh`（Compose）和 GHCR 单镜像通过 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`（回退到 `HEYM_CODEX_DOCKER_IMAGE`）解析同级 runner，并使用匹配的 venv 路径（`/app/.venv` 与 `/app/backend/.venv`）。
- **Chromium 注意事项。** 沙箱容器默认以 root 身份运行，而 Chromium 在未指定 `--no-sandbox` 时拒绝以 root 身份运行。启动 Chromium 的自定义代码应传入该参数，例如 `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`。基于步骤（以及 stealth）的启动还会传入 `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`，以防止指纹脚本向 `stun.l.google.com:19302` 发起 STUN UDP 连接。自定义的 `chromium.launch` 调用也应包含该参数。

基于步骤的 Playwright 节点（`playwrightSteps`）完全由 Heym 生成（不含任意代码），不受上述所有内容影响，且始终可用——建议优先使用。

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型概览
- [Crawler 节点](./crawler-node.md) – 使用 FlareSolverr 进行更简单的网页抓取
- [凭据共享](../reference/credentials-sharing.md) – 用于 AI 步骤的 LLM 凭据
