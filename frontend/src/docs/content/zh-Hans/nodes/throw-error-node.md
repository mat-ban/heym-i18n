# 抛出错误

**Throw Error** 节点会立即停止工作流执行，并返回带有自定义 HTTP 状态码的错误响应。可用于校验失败、未授权访问或其他错误情况。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 0 |
| 输出结果 | 工作流停止；错误响应返回给调用方 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `errorMessage` | expression | 错误消息（支持表达式） |
| `httpStatusCode` | number | HTTP 状态码（例如 400、401、403、404、429、500） |

## 常见状态码

| 状态码 | 使用场景 |
|------|----------|
| 400 | Bad Request（无效输入） |
| 401 | Unauthorized（需要身份验证） |
| 403 | Forbidden（访问被拒绝） |
| 404 | Not Found（资源不存在） |
| 422 | Unprocessable Entity（校验错误） |
| 429 | Too Many Requests（速率限制） |
| 500 | Internal Server Error |

## 示例

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

与 [Condition](./condition-node.md) 配合使用，以校验输入并仅在无效时抛出错误：
- Condition 为 true → 继续到 Output
- Condition 为 false → Throw Error

## 相关

- [Node Types](../reference/node-types.md) – 所有节点类型的概述
- [Condition Node](./condition-node.md) – 在抛出错误前进行校验
- [Error Handler](./error-handler-node.md) – 捕获来自其他节点的错误
