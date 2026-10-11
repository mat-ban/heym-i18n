# Crawler

**Crawler** 节点使用 FlareSolverr 抓取网页，并可通过 CSS 选择器进行可选的 HTML 提取。将其用于网页抓取和内容提取。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.body`（HTML 或提取的内容） |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自 [Credentials](../tabs/credentials-tab.md) 的 FlareSolverr 凭证 |
| `crawlerUrl` | expression | 要抓取的 URL（支持表达式） |
| `crawlerWaitSeconds` | number | 抓取前等待的秒数（默认：0） |
| `crawlerMaxTimeout` | number | 最大超时时间（毫秒）（默认：60000） |
| `crawlerMode` | string | `"basic"` 或其他模式 |
| `crawlerSelectors` | array | 用于提取的 CSS 选择器。每个为：`{ selector, attribute? }` |

## 示例

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## 出口安全

- 凭证中存储的 FlareSolverr URL 必须使用 `http://` 或 `https://`，且不得解析为链路本地或云元数据地址。被拒绝的集合为 `169.254.0.0/16`、`fe80::/10`、阿里云和 AWS 的 IPv6 元数据地址，以及可携带其中之一的 IPv6 转换形式。这是一个已知 Endpoint 的列表，而非对每个提供商的保证。
- 回环地址和私有地址被有意允许，因此文档中所述的 `http://localhost:8191` 配置以及诸如 `http://flaresolverr:8191` 的 compose 服务名称可继续正常工作。其后果是，此字段也可以指向后端在这些地址上可访问的任何其他服务，并且响应会返回到节点输出中。凭证共享并不能遏制这一点：任何已登录用户都可以创建自己的 FlareSolverr 凭证，因此扣留现有凭证无济于事。真正适用的控制措施是信任能够编写 Workflow 的人员，以及限制后端可访问范围的网络规则。
- Heym 在连接前会固定解析后的地址，因此 DNS 应答无法在检查后将请求转移到元数据地址。在防护生效期间，环境代理会被禁用，且不会跟随重定向。
- FlareSolverr 随后为你抓取的页面是一个单独的跳转，由 FlareSolverr 自行解析。Heym 不会检查它，因此限制 FlareSolverr 容器可连接的位置属于你的网络策略范畴。
- 受信任的自托管部署可通过 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` 解除元数据规则。在托管或多租户部署中请保持默认设置。

## 相关

- [Node Types](../reference/node-types.md) – 所有节点类型的概述
- [Playwright Node](./playwright-node.md) – 浏览器自动化替代方案
- [Credentials Tab](../tabs/credentials-tab.md) – 添加 FlareSolverr 凭证
