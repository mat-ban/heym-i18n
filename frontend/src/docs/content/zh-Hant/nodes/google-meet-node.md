# Google Meet

尋找 Google Calendar 中的可用時段，並建立、更新或刪除包含 Google Meet 連結、與會者電子郵件及所選時間的會議邀請。綁定的 Google 帳戶為活動擁有者；與會者將透過電子郵件收到邀請。

## 連線您的帳戶

1. 在 [Google Cloud Console](https://console.cloud.google.com) 中啟用 **Google Calendar API**。
2. 設定 OAuth 同意畫面並建立 **Web 應用程式** 類型的 OAuth 用戶端。若應用程式處於測試模式，請將您的 Google 帳戶新增為測試使用者。
3. 將 `https://your-heym-domain/api/credentials/google-meet/oauth/callback` 註冊為已授權的重新導向 URI。本機開發時，請使用瀏覽器的 Heym 來源與相同路徑。
4. 開啟 **Dashboard → 憑證 → 新增 → Google Meet (OAuth2)**，輸入名稱、Client ID 與 Client Secret，然後按一下 **連線** 並透過 Google 登入。
5. 授予兩項權限：日曆活動 (`calendar.events`) 與日曆空閒狀態 (`calendar.events.freebusy`)。在節點上選取此憑證。

Token 於儲存空間中加密保存並自動重新整理。此為獨立於 Google AI、Sheets 或 Drive 的個別憑證。日曆必須支援 Google Meet 會議功能方可順利建立。

## 操作

| 操作 | 行為 | 必要欄位 |
| --- | --- | --- |
| `read` | 回傳日曆的空閒與忙碌時間間隔 | 憑證 |
| `create` | 建立包含新 Meet 會議與電子郵件邀請的預約活動 | 標題、開始時間、結束時間 |
| `update` | 更新指定的活動欄位並通知受邀者 | 活動 ID 與至少一個變更欄位 |
| `delete` | 刪除活動並通知受邀者取消 | 活動 ID |

## 設定

下方文字欄位支援運算式。當此節點作為工具附加時，所有欄位（包括布林值詳細資訊選項）皆可由 Agent 提供。

| 欄位 | 預設值 | 用途 |
| --- | --- | --- |
| `gmCalendarId` | `primary` | 綁定帳戶的主要日曆，或可存取的日曆 ID/電子郵件 |
| `gmTimeZone` | `UTC` | IANA 時區（例如 `Asia/Taipei`），用於本地日期與回應時間 |
| `gmStartDate` | 目前時間 | 讀取範圍開始時間，ISO 日期或 datetime |
| `gmEndDate` | 次月第一天午夜 | 讀取範圍互斥結束時間；最大範圍為 60 個日曆天 |
| `gmIncludeBusyDetails` | `false` | 僅讀取：在 `busy_slots` 中包含活動標題與與會者；布林值，非運算式欄位 |
| `gmEventId` | 空 | 用於 update/delete 的日曆活動 ID；使用回傳的 `event_id`，非 Meet URL |
| `gmTitle` | 空 | 邀請標題；在 `create` 時必填 |
| `gmDescription` | 空 | 邀請描述 |
| `gmStartTime` | 空 | 會議開始時間，例如 `2026-11-10T14:00:00+08:00` |
| `gmEndTime` | 空 | 會議結束時間；必須晚於開始時間 |
| `gmAttendees` | 空 | 逗號/分號/換行符號分隔的電子郵件或 JSON 電子郵件字串陣列 |
| `gmLocation` | 空 | Meet 會議之外的選用會議地點 |

### 可用時段

預設讀取涵蓋自目前時間至所選時區中**次月 1 日 00:00** 的時間區間。傳入 `gmEndDate` 可指定不同的時間範圍。超過 60 天的範圍或無效日期將在呼叫 Google 前遭到拒絕。

結果基於 Google 的 **free/busy** API。忙碌時段將被合併並自請求的區間中扣除。`available_slots` 包含具有 `start` 與 `end` 時間戳記的連續空閒時段。

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

### 包含忙碌活動詳細資訊

在 **讀取可用時段** 下，啟用 **包含忙碌活動詳細資訊** (`gmIncludeBusyDetails: true`)，為每個忙碌時段加入標題與與會者。此選項預設為關閉。

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

### 預訂會議

1. 使用 workflow 擁有者的憑證執行 `read` 節點。
2. 在您的預訂介面中顯示 `available_slots`。
3. 將 `email`、`startTime` 與 `endTime` 作為 workflow 輸入傳入。
4. 使用相同的憑證執行 `create`。訪客無需擁有 Google 帳戶；其電子郵件將被記錄為與會者。

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

## 輸出

| 操作 | 輸出欄位 |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

在下游節點中使用 `$Availability.available_slots` 或 `$Booking.meet_url`。每個操作亦會回傳 `status: "success"` 與對應的 `operation`。

## 相關內容

- [Credentials](../reference/credentials.md)
- [第三方整合](../reference/integrations.md)
- [憑證共用](../reference/credentials-sharing.md)
- [輸入](input-node.md)
- [輸出](output-node.md)
