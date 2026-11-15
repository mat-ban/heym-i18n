# Google Meet

查找 Google Calendar 中的可用时间段，并创建、更新或删除包含 Google Meet 链接、参与者电子邮件和选定时间的会议邀请。绑定的 Google 账号是活动的所有者；受邀者会通过电子邮件收到邀请。

## 连接您的账号

1. 在 [Google Cloud Console](https://console.cloud.google.com) 中，启用 **Google Calendar API**。
2. 配置 OAuth 同意屏幕并创建 **Web 应用程序** 类型的 OAuth 客户端。如果应用处于测试模式，请将您的 Google 账号添加为测试用户。
3. 将 `https://your-heym-domain/api/credentials/google-meet/oauth/callback` 注册为已获授权的重定向 URI。对于本地开发，请使用浏览器的 Heym 域名与相同路径。
4. 打开 **Dashboard → 凭据 → 新建 → Google Meet (OAuth2)**，输入名称、Client ID 和 Client Secret，然后点击 **连接** 并使用 Google 登录。
5. 授予两项权限：日历活动 (`calendar.events`) 和日历可用性 (`calendar.events.freebusy`)。在节点上选择该凭据。

Token 在存储中加密保存并自动刷新。这是独立于 Google AI、Sheets 或 Drive 的单独凭据。日历必须支持 Google Meet 会议功能，创建方可成功。

## 操作

| 操作 | 行为 | 必需字段 |
| --- | --- | --- |
| `read` | 返回日历的可用与忙碌时间间隔 | 凭据 |
| `create` | 创建带有新 Meet 会议和电子邮件邀请的定时活动 | 标题、开始时间、结束时间 |
| `update` | 修补提供的活动字段并通知受邀者 | 活动 ID 以及至少一个修改字段 |
| `delete` | 删除活动并通知受邀者取消 | 活动 ID |

## 配置

以下文本字段支持表达式。当此节点作为工具附加时，所有字段（包括布尔型详情选项）均可由 Agent 提供。

| 字段 | 默认值 | 用途 |
| --- | --- | --- |
| `gmCalendarId` | `primary` | 绑定账号的主日历，或可访问的日历 ID/电子邮件 |
| `gmTimeZone` | `UTC` | IANA 时区（例如 `Asia/Shanghai`），用于本地日期和响应时间 |
| `gmStartDate` | 当前时间 | 读取范围开始时间，ISO 日期或 datetime |
| `gmEndDate` | 次月第一天午夜 | 读取范围独占结束时间；最大范围为 60 个日历日 |
| `gmIncludeBusyDetails` | `false` | 仅读取：在 `busy_slots` 中包含活动标题和参与者；布尔值，非表达式字段 |
| `gmEventId` | 空 | 用于 update/delete 的日历活动 ID；使用返回的 `event_id`，而非 Meet URL |
| `gmTitle` | 空 | 邀请标题；在 `create` 时必填 |
| `gmDescription` | 空 | 邀请描述 |
| `gmStartTime` | 空 | 会议开始时间，例如 `2026-11-10T14:00:00+08:00` |
| `gmEndTime` | 空 | 会议结束时间；必须在开始时间之后 |
| `gmAttendees` | 空 | 逗号/分号/换行符分隔的电子邮件或 JSON 电子邮件字符串数组 |
| `gmLocation` | 空 | Meet 会议之外的可选会议地点 |

### 可用时间段

默认读取涵盖从当前时间到所选时区中**次月 1 日 00:00** 的时间段。传递 `gmEndDate` 可指定不同的时间窗口。超过 60 天的范围或无效日期将在调用 Google 之前被拒绝。

结果基于 Google 的 **free/busy** API。忙碌时间间隔将被合并并从请求的窗口中扣除。`available_slots` 包含具有 `start` 和 `end` 时间戳的连续空闲时间段。

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Availability",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "read",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmStartDate": "2026-11-06",
    "gmEndDate": "2026-11-13"
  }
}
```

### 包含忙碌活动详情

在 **读取可用时间段** 下，启用 **包含忙碌活动详情** (`gmIncludeBusyDetails: true`)，以便为每个忙碌时段添加标题和参与者。此选项默认处于禁用状态。

```json
{
  "start": "2026-11-06T21:15:00+01:00",
  "end": "2026-11-06T21:30:00+01:00",
  "title": "Daily check-in",
  "attendees": [
    "colleague@example.com"
  ]
}
```

### 预订会议

1. 使用 workflow 所有者的凭据运行 `read` 节点。
2. 在您的预订界面中显示 `available_slots`。
3. 将 `email`、`startTime` 和 `endTime` 作为 workflow 输入传递。
4. 使用相同的凭据运行 `create`。访客无需拥有 Google 账号；其电子邮件会被记录为参与者。

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Booking",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "create",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmTitle": "Meet with me",
    "gmDescription": "A meeting booked through Heym",
    "gmAttendees": "$input.email",
    "gmStartTime": "$input.startTime",
    "gmEndTime": "$input.endTime"
  }
}
```

## 输出

| 操作 | 输出字段 |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

在下游节点中使用 `$Availability.available_slots` 或 `$Booking.meet_url`。每个操作还会返回 `status: "success"` 及其 `operation`。

## 相关

- [Credentials](../reference/credentials.md)
- [第三方集成](../reference/integrations.md)
- [凭据共享](../reference/credentials-sharing.md)
- [输入](input-node.md)
- [输出](output-node.md)
