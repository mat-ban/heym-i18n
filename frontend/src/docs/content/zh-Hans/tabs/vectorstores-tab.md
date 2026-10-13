# Vectorstores 标签页

**Vectorstores** 标签页用于管理 [RAG](../nodes/rag-node.md) 节点所使用的向量存储。您可以创建存储、上传文档，并与团队共享。

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ 观看 Vectorstores 演示</a></p>

## 创建向量存储

1. 点击 **New Vector Store**
2. 输入名称和可选描述
3. 选择向量存储 **credential** —— *RAG: Qdrant + OpenAI*（外部 Qdrant 服务器）、*RAG: Psql + OpenAI*（Heym 自有的 Postgres 数据库，通过 pgvector 实现），或 *RAG: Custom Embeddings*（任意兼容 OpenAI 的 embedding Endpoint，可指向任一后端）。credential 决定了该存储的后端。
4. 可选设置自定义 collection 名称（默认为自动生成）
5. 保存

> 存储的后端在创建时由其 credential 固定。在 RAG 节点中，**Database** 下拉菜单会按匹配的后端筛选存储。

## 上传文档

- **上传文件** —— 拖放或选择文件（PDF、TXT 等）
- **重复处理** —— 选择覆盖或跳过重复文件名
- **进度** —— 摄取过程中显示上传进度

## 管理内容

- **查看条目** —— 查看每个存储的源分组和文档数量。上传的文件按其文件名分组；[RAG 节点](../nodes/rag-node.md)存储的、自身没有 `source` 的文档则归入 **Added workflow: _name_** 分组，其中 _name_ 为写入这些文档的 Workflow 名称
- **删除源** —— 从存储中移除特定文件或源分组，包括某个 Workflow 添加的全部内容
- **编辑存储** —— 修改名称、描述或 credential
- **搜索** —— 使用 `query`（以及 1 到 20 之间的 `limit`，默认为 5）调用 `POST /api/vector-stores/{id}/search`，会返回 RAG 节点搜索将返回的文本块（chunks），最佳匹配排在最前，每个文本块均附带其得分和来源。Heym Work 的 RAG 界面使用它来测试检索效果

## 共享

- 通过电子邮件与其他用户共享向量存储
- 共享的存储会带有指示标记
- 可从存储卡片菜单中撤销共享

## 在 Workflows 中使用

在 [RAG 节点](../nodes/rag-node.md)中，按名称选择向量存储。该节点会检索相关分块，并将其加入 LLM 上下文。

## 相关

- [Credentials 标签页](./credentials-tab.md) —— 向量存储 credential 设置（Qdrant、Postgres 或自定义 embeddings）
- [RAG 节点](../nodes/rag-node.md) —— 节点参考
- [Workflows 标签页](./workflows-tab.md) —— 创建使用 RAG 的 Workflows
- [Contextual Showcase](../reference/contextual-showcase.md) —— 仪表盘界面的精简页面指南
