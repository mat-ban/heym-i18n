# 代码

**Code** 节点运行你编写的 Python 代码，支持自带的 `requirements.txt`，并返回 JSON。每次执行都会获得一个全新的容器，运行结束后即被销毁，因此一次执行永远无法看到或影响另一次执行。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.result`（即 `main` 返回的内容），以及 `$nodeLabel.logs` 和 `$nodeLabel.install` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `codeSource` | string | Python 源代码。必须定义 `main(params)` 并返回一个可 JSON 序列化的值 |
| `codeParameters` | expression | 一个 JSON 对象，用于将工作流数据接入代码。表达式会在代码运行前解析 |
| `codeRequirements` | string | `requirements.txt` 的内容，每行一个包。留空则跳过安装 |
| `codeAllowNetwork` | boolean | 代码本身是否可以访问网络（默认 `false`） |

## `main` 函数

你的代码必须定义一个顶层 `main`，它接收一个参数：

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

模块级语句确实会执行，但只有 `main` 返回的内容才会成为节点的输出。

编辑器会显示行号，**Format** 旁边的展开按钮会打开一个更大的编辑器，按 `Esc` 即可关闭——编辑会随输入实时生效，因此无需保存。**Format** 按钮会使用 Ruff 重新格式化你的代码，并保留注释。它还会修复粘贴通常导致的缩进损坏：统一缩进的代码块、制表符与空格混用、以及某一行与其所属代码块相差一两个空格的情况，都会被修复而非拒绝。真正的语法错误则会报告其行号和列号。格式化在与节点运行相同的隔离容器中执行——无网络、无后端环境——因此它和代码执行一样需要 Docker。

## 读取参数

`params` 支持点号表示法，包括穿透嵌套对象和列表：

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` 用于读取不是合法 Python 标识符的键
- `params.get("maybe")` 在键不存在时返回 `None`，而不是抛出异常
- `params.to_dict()` 返回普通字典
- 读取一个从未提供的键会抛出错误，错误中会指明该键并列出可用的键

## 输出

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main` 的返回值。下游节点通过 `$nodeLabel.result.message` 读取
- `logs` — 代码发送到 `print` 的所有内容，单独捕获，因此永远不会破坏结果
- `install` — 安装依赖所使用的工具（`uv`、`pip` 或 `none`）及其输出

## 依赖

在 `requirements.txt` 中列出包，格式与你在本地使用完全一致：

```
requests==2.32.3
feedparser
```

包会在代码运行前使用 `uv` 安装到一个临时目录中；如果 `uv` 无法处理某个包，Heym 会改用 `pip` 重试。运行之间不会缓存任何内容，因此重量级依赖会为每次执行增加数秒时间。将 `requirements.txt` 留空会完全跳过安装步骤，速度明显更快。

不提供 wheel 且需要 C 编译器的包将安装失败。原因会出现在 `install.log` 中。

## 网络

| 阶段 | 网络 |
|-------|---------|
| 安装依赖 | 始终开启——pip 和 uv 必须访问 PyPI |
| 运行你的代码 | 默认关闭。`codeAllowNetwork` 可将其开启 |

当 `codeAllowNetwork` 关闭时，诸如 `requests.get(...)` 之类的出站调用会因连接错误而失败。这是预期的默认行为：大多数 Code 节点转换的是另一个节点已经获取的数据。优先使用 **HTTP** 节点获取数据，并通过 `codeParameters` 将响应体传入。

## 沙箱与限制

你的代码以非 root 用户身份在容器中运行，所有 Linux capabilities 均被丢弃，设置了 `no-new-privileges`，并且根文件系统为只读。它不会获得 Docker socket，也无法访问后端的任何密钥或环境。

| 限制 | 值 |
|-------|-------|
| 内存 | 512 MB |
| CPU | 1 |
| 进程数 | 256 |
| 依赖安装超时 | 120 秒 |
| 执行超时 | 60 秒 |

这些是沙箱的固定属性，而非可配置项。

> **需要 Docker。** 与 Agent Python 工具和技能不同，Code 节点没有本地回退模式，也没有可放宽限制的环境变量。如果没有可访问的 Docker daemon，节点会以明确的错误失败，而不是在后端进程中运行你的代码。在原生 `./run.sh` 开发环境中，请在使用此节点前启动 Docker。参见 [Security → Code node sandbox](../reference/security.md#code-node-sandbox)。

## 当有合适的节点时，请使用其他节点

| 你想要 | 使用 |
|-------------|-----|
| 解析或构建 CSV、TSV、XML，或对文件进行 OCR | [Converter](converter-node.md) |
| 调用 HTTP API | [HTTP](http-node.md) |
| 映射或重命名字段 | [Set](set-node.md) |
| 运行另一个工作流 | [Execute](execute-node.md) |

当逻辑确实不适合上述节点时——自定义数学运算、定制解析或某种算法——再使用 **Code**。
## 示例

由上游节点生成的评分行：

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

将 `codeParameters` 设置为 `{ "rows": "$fetchRows.result" }` 后，下游节点可读取 `$scoreRows.result.total`。
