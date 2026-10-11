# 控制台日志

**Console Log** 节点将某个值记录到后端（服务器）控制台。可在开发过程中用于调试和检查。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | 透传输入 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `logMessage` | expression | 要记录的值。支持[表达式](../reference/expression-dsl.md)。 |

## 示例

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

输出会显示在服务器日志中（例如运行 `uvicorn` 时的终端输出）。

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [Logs 标签页](../tabs/logs-tab.md) – 查看应用程序日志
