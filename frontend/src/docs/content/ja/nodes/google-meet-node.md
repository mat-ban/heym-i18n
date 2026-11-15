# Google Meet

Google Calendar の空き時間を検索し、Google Meet リンク、参加者のメールアドレス、選択した時間を含む会議の招待を作成、更新、または削除します。接続された Google アカウントがイベントの所有者となり、参加者はメールで招待状を受け取ります。

## アカウントを接続する

1. [Google Cloud Console](https://console.cloud.google.com) で **Google Calendar API** を有効にします。
2. OAuth 同意画面を設定し、**ウェブ アプリケーション** の OAuth クライアントを作成します。アプリがテストモードの場合は、Google アカウントをテストユーザーとして追加してください。
3. `https://your-heym-domain/api/credentials/google-meet/oauth/callback` を承認済みのリダイレクト URI として登録します。ローカル開発の場合は、ブラウザの Heym オリジンと同一のパスを使用します。
4. **Dashboard → Credentials → 新規 → Google Meet (OAuth2)** を開き、名前、Client ID、Client Secret を入力し、**接続** をクリックして Google でログインします。
5. 両方の権限を付与します: カレンダーイベント (`calendar.events`) およびカレンダーの空き時間情報 (`calendar.events.freebusy`)。ノード上でこの credential を選択します。

トークンはストレージ内で暗号化され、自動的に更新されます。これは Google AI、Sheets、または Drive とは別の独立した credential です。イベント作成を成功させるには、カレンダーが Google Meet ビデオ会議をサポートしている必要があります。

## 操作

| 操作 | 動作 | 必須フィールド |
| --- | --- | --- |
| `read` | カレンダーの空き時間および予定ありの間隔を返します | 認証情報 |
| `create` | 新しい Meet 会議とメール招待状を含む予定を作成します | タイトル、開始時刻、終了時刻 |
| `update` | 指定されたイベントフィールドを更新し、ゲストに通知します | イベント ID と少なくとも 1 つの変更されたフィールド |
| `delete` | イベントを削除し、ゲストにキャンセルを通知します | イベント ID |

## 設定

以下のテキストフィールドは式を受け入れます。ブール値の詳細オプションを含むすべてのフィールドは、このノードがツールとして接続されている場合、Agent によって提供されることがあります。

| フィールド | デフォルト | 目的 |
| --- | --- | --- |
| `gmCalendarId` | `primary` | 接続されたアカウントのプライマリカレンダー、またはアクセス可能なカレンダー ID/メール |
| `gmTimeZone` | `UTC` | ローカルの日付と応答時間に使用される IANA タイムゾーン（例: `Asia/Tokyo`） |
| `gmStartDate` | 現在時刻 | ISO 日付または datetime としての読み取り範囲の開始 |
| `gmEndDate` | 翌月 1 日の深夜 0 時 | 読み取り範囲の排他的な終了。最大範囲は 60 カレンダー日です |
| `gmIncludeBusyDetails` | `false` | 読み取り専用: `busy_slots` にイベントのタイトルと参加者を含めます（式フィールドではなく boolean） |
| `gmEventId` | 空 | update/delete 用のカレンダーイベント ID。Meet の URL ではなく、返された `event_id` を使用してください |
| `gmTitle` | 空 | 招待のタイトル。`create` 時に必須 |
| `gmDescription` | 空 | 招待の説明 |
| `gmStartTime` | 空 | 会議の開始時刻（例: `2026-11-10T14:00:00+09:00`） |
| `gmEndTime` | 空 | 会議の終了時刻。開始時刻より後である必要があります |
| `gmAttendees` | 空 | カンマ/セミコロン/改行で区切られたメールアドレス、または JSON メール文字列配列 |
| `gmLocation` | 空 | Meet 会議に付随する任意の会議場所 |

### 利用可能な時間枠

デフォルトの読み取りでは、選択したタイムゾーンにおいて、現在時刻から**翌月 1 日の 00:00** までの期間がカバーされます。別の期間を指定するには `gmEndDate` を渡します。60 日を超える範囲または無効な日付は、Google を呼び出す前に拒否されます。

結果は Google の **free/busy** API に基づいています。予定ありの間隔はマージされ、要求されたウィンドウから差し引かれます。`available_slots` には、`start` と `end` のタイムスタンプを持つ連続した空き時間が含まれます。

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

### 予定の詳細情報を含める

**利用可能な時間枠を読み取る** の下で、**予定の詳細情報を含める** (`gmIncludeBusyDetails: true`) を有効にすると、予定ありの各スロットにタイトルと参加者が追加されます。このオプションはデフォルトで無効になっています。

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

### 会議を予約する

1. ワークフロー所有者の credentials を使用して `read` ノードを実行します。
2. 予約インターフェースに `available_slots` を表示します。
3. `email`、`startTime`、`endTime` をワークフロー入力として渡します。
4. 同じ credentials で `create` を実行します。訪問者は Google アカウントを必要とせず、そのメールアドレスが参加者として登録されます。

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

## 出力

| 操作 | 出力フィールド |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

後続のノードで `$Availability.available_slots` または `$Booking.meet_url` を使用します。すべての操作は `status: "success"` とその `operation` も返します。

## 関連項目

- [Credentials](../reference/credentials.md)
- [サードパーティ連携](../reference/integrations.md)
- [認証情報の共有](../reference/credentials-sharing.md)
- [入力](input-node.md)
- [出力](output-node.md)
