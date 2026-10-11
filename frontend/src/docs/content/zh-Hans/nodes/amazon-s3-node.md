# Amazon S3

Amazon S3 节点用于在 [Amazon S3](https://aws.amazon.com/s3/) 中读取和写入对象。

## 支持的操作

- `Create Bucket`：在凭证所属区域中创建存储桶。
- `Delete Bucket`：删除空存储桶。
- `List Buckets`：列出凭证可见的存储桶。
- `Create Folder`：创建空文件夹标记（以 `/` 结尾的零字节 key）。
- `Delete Folder`：删除文件夹前缀下的所有对象（包括嵌套 key）。
- `Get All in Folder`：列出文件夹前缀下的所有对象元数据（服务端分页）。
- `Upload Object`：将文本 payload 写入存储桶/key。
- `Get Object`：下载对象并返回解码后的文本或 base64 内容。
- `Copy Object`：将对象复制到另一个 key 或存储桶。
- `List Objects`：列出前缀下的对象元数据（单页，最多 1000 个 key；支持 continuation token）。
- `Delete Object`：按 key 删除单个对象。

## 凭证设置

在 Credentials 标签页中创建 `Amazon S3` 凭证，需填写：

- Access Key ID
- Secret Access Key
- Region
- 可选的 Session Token（用于临时 AWS STS 凭证）

## 通用字段

- `Bucket`：目标存储桶名称（复制操作的目标存储桶）。
- `Object Key`：类似路径的对象 key，例如 `reports/daily.json`。
- `Folder Path`：文件夹操作的前缀（例如 `docs/archive`）。
- `Source Bucket`：复制操作的可选源存储桶；默认为目标存储桶。
- `Source Object Key`：复制操作的源 key。
- `Prefix`：用于列表操作以限定结果范围。
- `Continuation Token`：来自上一次列表响应的可选 token，用于获取下一页。
- `Max Keys`：List Objects 的页大小（1–1000）。
- `Include Binary`：在 Get Object 上启用时，返回 `body_base64` 而非 `body_text`。
- `Body`：要上传的文本内容。
- `Content Type`：上传对象的可选 MIME 类型。

## 输出示例

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## 注意事项

- `Upload Object` 目前上传 UTF-8 文本内容。
- `Get Object` 可通过启用 binary 选项为二进制文件返回 base64。
- `Create Bucket` 使用凭证所属区域，并需要 `s3:CreateBucket` 权限。
- `Delete Bucket` 要求存储桶为空，并需要 `s3:DeleteBucket` 权限。
- `List Buckets` 需要 `s3:ListAllMyBuckets` 权限。
- `Create Folder` 上传一个零字节标记对象；S3 没有原生目录类型。
- `Delete Folder` 会删除 key 以该文件夹前缀开头的所有对象；请谨慎使用。
- `Get All in Folder` 会自动对该前缀进行分页，直到返回所有对象。
- `List Objects` 返回一页（最多 1000 个 key）。当 `truncated` 为 true 时，将 `next_continuation_token` 传入下一次调用的 Continuation Token 字段。
- `Copy Object` 需要对源对象具有 `s3:GetObject` 权限，并对目标具有 `s3:PutObject` 权限。

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [凭证](../reference/credentials.md) – 凭证类型与用法
- [第三方集成](../reference/integrations.md) – Amazon S3 凭证设置
