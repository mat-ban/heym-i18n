# Google Sheets

Node **Google Sheets** đọc, ghi và quản lý dữ liệu trong bảng tính Google Sheets thông qua OAuth2. Sử dụng node này để tự động hóa các workflow bảng tính — đọc báo cáo, ghi log kết quả, cập nhật bảng theo dõi, v.v.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Google Sheets (OAuth2) |
| Output | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential Google Sheets từ [Credentials](../tabs/credentials-tab.md) |
| `gsOperation` | string | Thao tác: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID bảng tính hoặc URL Google Sheets đầy đủ |
| `gsSheetName` | expression | Tên tab sheet (ví dụ: `Sheet1`). Không bắt buộc với `getSheetInfo`. |
| `gsStartRow` | expression | Với `readRange`: hàng dữ liệu đầu tiên (đánh số từ 1; khi có `gsHasHeader`, hàng 1 là header). |
| `gsMaxRows` | expression | Với `readRange`: số hàng dữ liệu tối đa (0 = tất cả). |
| `gsHasHeader` | boolean | Với `readRange`: khi true, coi hàng 1 là tên cột. |
| `gsUpdateRow` | expression | Chỉ với `updateRange`: số hàng sheet (đánh số từ 1) cần cập nhật (cột A–Z); nếu không đặt, dùng `gsStartRow`. Không phải batchUpdate — một lệnh PUT values API. |
| `gsRange` | expression | Phạm vi theo ký hiệu A1 (ví dụ: `A1:D100`). Ví dụ cũ; editor dùng các trường hàng cho read/update. |
| `gsKeepHeader` | boolean | Chỉ với `clearRange`: khi true, giữ hàng 1 và xóa các hàng dữ liệu bên dưới (cột A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Chỉ với `appendRows`: **Bottom** thêm sau hàng cuối cùng có dữ liệu; **Top** chèn hàng mới ngay dưới hàng 1 (đẩy dữ liệu xuống). |
| `gsValuesInputMode` | `raw` \| `selective` | Với `appendRows` / `updateRange`: **Raw** = mảng JSON đầy đủ; **Selective** = một hàng sheet, chỉ các trường cột (không có nhãn A1). |
| `gsValuesSelectiveCols` | string | Chế độ Selective: số cột (A–Z). |
| `gsValues` | expression | Mảng JSON 2 chiều chứa giá trị (ví dụ: `[["Name","Age"],["Alice",30]]`). Bắt buộc với `appendRows`, `updateRange`. |

## Spreadsheet ID

Trường `gsSpreadsheetId` chấp nhận **ID thuần** (chuỗi chữ và số dài nằm giữa `/d/` và `/edit` trong URL Google Sheets) hoặc **URL đầy đủ** — Heym tự động trích xuất ID.

## Thiết lập Credential

Google Sheets sử dụng mô hình **OAuth2 "Bring Your Own App"**. Bạn cung cấp credential OAuth2 Google Cloud của riêng mình.

**Cấu hình backend:** Đặt **`FRONTEND_URL`** trên backend Heym thành URL công khai của ứng dụng (địa chỉ người dùng nhập trên trình duyệt), ví dụ: `https://your-heym-domain`. URI chuyển hướng OAuth luôn là `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — nó chỉ được suy ra từ cài đặt này, không phải từ header của request.

1. Truy cập [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → bật **Google Sheets API**.
2. Vào **Credentials** → **Create Credentials** → **OAuth client ID** → chọn **Web application**.
3. Trong **Authorized redirect URIs**, thêm chính xác: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (ví dụ: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Sao chép **Client ID** và **Client Secret**.
5. Trong Heym Dashboard → **Credentials** → **New** → chọn **Google Sheets (OAuth2)**.
6. Nhập Client ID, Client Secret và tên, sau đó nhấp **Connect** để hoàn tất đồng ý OAuth2 trong cửa sổ popup trình duyệt.

Token tự động làm mới trong nền — không cần quản lý token thủ công.

## Các thao tác

| Thao tác | Trường bắt buộc | Mô tả |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Đọc giá trị ô (A–Z); `gsRange` tùy chọn trong các flow cũ |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Thêm hàng ở cuối (`gsAppendPlacement` append) hoặc dưới hàng 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Ghi đè hàng bắt đầu từ `gsUpdateRow` (A–Z); JSON nhiều hàng ghi vào các hàng liên tiếp |
| `clearRange` | gsSpreadsheetId, gsSheetName | Xóa tất cả giá trị trong cột A–Z của tab; `gsKeepHeader` tùy chọn giữ hàng đầu tiên |
| `getSheetInfo` | gsSpreadsheetId | Lấy tiêu đề bảng tính và danh sách các tab sheet |

## Tham chiếu Output

| Thao tác | Trường output | Kiểu | Mô tả |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Đối tượng hàng: khóa cột (tên header hoặc A, B, …) cộng với **`rowIndex`** (hàng sheet đánh số từ 1) |
| `readRange` | `.total` | number | Số hàng dữ liệu trả về |
| `appendRows` | `.updatedRange` | string | Phạm vi đã ghi |
| `appendRows` | `.updates` | number | Số hàng đã thêm |
| `updateRange` | `.updatedRange` | string | Phạm vi đã ghi |
| `updateRange` | `.updatedCells` | number | Số ô đã cập nhật |
| `clearRange` | `.clearedRange` | string | Phạm vi đã xóa |
| `getSheetInfo` | `.title` | string | Tiêu đề bảng tính |
| `getSheetInfo` | `.sheets` | array | Danh sách các đối tượng `{sheetId, title}` |

Tất cả thao tác đều bao gồm `success: true` và `operation: "<name>"` trong output.
## Ví dụ – Đọc một Range

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Truy cập output: `$readReport.rows[0]` (đối tượng hàng dữ liệu đầu tiên), `$readReport.rows[0].Name` (cột theo tiêu đề), `$readReport.rows[0].rowIndex` (chỉ số hàng trong sheet, bắt đầu từ 1).

## Ví dụ – Thêm một hàng từ Input

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## Liên quan

- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Tab Credentials](../tabs/credentials-tab.md) – Thêm credential Google Sheets OAuth2
- [Tích hợp bên thứ ba](../reference/integrations.md#google-sheets-oauth2) – Thiết lập credential Google Sheets
