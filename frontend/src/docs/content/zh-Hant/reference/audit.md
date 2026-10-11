# 稽核記錄

Heym 會為每個與安全性相關的動作寫入一行稽核記錄：誰執行了該動作、對什麼執行了該動作，以及是否成功。這些記錄會透過 `winston.audit` logger 寫入後端的標準輸出，與請求存取記錄並列，並可從 **Logs** 分頁或使用 `docker logs` 讀取。

稽核記錄**永遠開啟**。無需啟用任何項目，也無需設定任何環境變數。

## 記錄行格式

一個動作會產生恰好一行自成一體的記錄：

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

每一行都帶有以下欄位：

| 欄位 | 說明 |
|-------|-------------|
| `action` | 發生的事情，格式為 `resource.verb` — 請參閱下方表格。 |
| `outcome` | `success`、`failure` 或 `denied`。 |
| `actor_id` | 執行該動作之使用者的 UUID。僅在無人通過驗證時才會缺席。 |
| `actor_email` | 該使用者的電子郵件。在登入失敗時，這是嘗試使用的位址，而非已確認的帳號。 |
| `target` | 被操作的物件，格式為 `type:uuid`。 |
| `target_name` | 該物件的人類可讀名稱，當包含空格時會加上引號。 |

接著是動作專屬欄位 — 例如 `credential_type`、`imported`、`grantee_email`、`team_name`。包含空格、引號或 `=` 的值會加上引號；長度超過 256 個字元的值會被截斷並加上 `...(truncated)` 標記。

## 讀取記錄

稽核 logger 是請求 logger 的子項，因此兩者會到達同一個串流，同時仍可區分：

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

在應用程式中，**Logs** 分頁會讀取相同的容器輸出。它受 `DOCKER_LOGS_ENABLED` 與 `DOCKER_LOGS_ALLOWED_EMAILS` 允許清單控管。

## 記錄的內容

每一次狀態變更都會被記錄。讀取僅在讀取本身即為敏感動作時才會被記錄 — 檢視 Workflow 的執行歷史、開啟 Credential、下載檔案。一般的清單與詳細資料讀取不會被稽核；存取記錄已記錄了請求曾發生，而稽核每一個 `GET` 會淹沒真正重要的記錄行。

### 驗證

| 動作 | 備註 |
|--------|-------|
| `auth.register` | 當註冊功能停用，或密碼登入關閉時為 `outcome=denied`（`reason=password_login_disabled`）；當電子郵件已被使用時為 `failure`。 |
| `auth.login` | `outcome=failure` 會記錄嘗試使用的位址，以及是電子郵件未知還是密碼錯誤。 |
| `auth.logout` | actor 是從 refresh cookie 解析而來，因此沒有該 cookie 的登出會以無身分的方式記錄。 |
| `auth.token_refresh` | `outcome=denied` 並帶有 `reason=refresh_token_replayed_or_revoked` — 這是值得發出警示的 Token 竊取訊號。 |
| `auth.password_change` | 當目前密碼錯誤時為 `outcome=failure`。 |
| `auth.sso_login` | 單一登入。`outcome=failure` 會帶有提供者回應遭拒的原因；`denied` 會帶有 `email_not_verified`、`domain_not_allowed` 或 `provisioning_disabled`。 |
| `sso_settings.update` | 管理員變更了 [SSO](./sso.md) 設定。會記錄 `enabled` 與 `password_login_disabled`，絕不會記錄 client secret。 |
| `sso_settings.test` | 管理員執行了 SSO 連線測試。 |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

當協作者讀取他人的執行歷史時，`workflow.history_view` 會記錄 `owned=false`。當協作者嘗試刪除時，`workflow.delete` 會記錄 `outcome=denied` 並帶有 `reason=not_owner`。

### Credentials

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` 會被稽核，因為開啟 Credential 會將其解密。未命中時會記錄 `outcome=denied`，這正是 Credential ID 列舉嘗試的樣貌。
### 其他資源

| 資源 | 動作 |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vector stores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerts | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Data tables | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

批次操作每次請求僅記錄一行，並附帶筆數，而非每列各記錄一行。匯入 5,000 列的 CSV 只會產生一行 `data_table.import_csv`，其中包含 `imported`、`rejected` 與 `total`。

## 機密永不記錄

稽核記錄行會記錄識別碼、名稱與筆數。它絕不會記錄憑證的內容、變數的值、密碼或 Token。

有兩項機制確保這一點。呼叫端在撰寫時僅傳遞安全欄位，而稽核輔助函式則作為最後防線進行遮蔽：任何名稱包含 `password`、`secret`、`token`、`api_key`、`value`、`authorization`、`cookie` 或類似字樣的欄位，在建立記錄行之前都會被替換為 `***`。過度遮蔽是刻意為之——一行無用的記錄，總比外洩的憑證來得好。

若某項機密確實與記錄相關，則僅記錄其形式。檔案分享會記錄 `password_protected=true`，絕不會記錄密碼本身。

## 保留期限

**稽核記錄行的存續時間僅與容器的日誌輸出相同。** 它們不會寫入資料庫。重新建立後端容器即會捨棄其日誌。

若您需要能在重新部署後存續的稽核歷史記錄，請將容器的 stdout 傳送至某個持久的位置——例如 log driver、sidecar collector，或您平台的日誌聚合服務——就如同您對任何其他容器日誌所做的一樣。

## 給貢獻者

發出稽核記錄行只需一次呼叫：

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

此輔助函式為同步執行、不觸碰任何資料庫，並會自行吞掉錯誤，因此稽核呼叫不會導致請求失敗或變慢。

新增稽核呼叫時的三項規則：

1. **以 snake_case 將動作命名為 `resource.verb`。** `backend/tests/test_audit_log.py` 會走訪 `app/api/` 下的每一個 `audit()` 呼叫，並在名稱不符時使建置失敗，若某個已涵蓋的資源遺失其所有呼叫端，也會使建置失敗。

2. **僅讀取確定存在的屬性。** 輔助函式的 `try/except` 保護的是其自身的內容，而非您傳入的運算式——`target_name=workflow.name` 中的 `AttributeError` 會在呼叫端、於 `audit()` 執行之前被引發，並將導致請求中斷。請讀取 ORM 欄位與區域變數，而非選用或延遲載入的屬性。

3. **在刪除之前記錄刪除。** 在 `db.delete(row)` 之後，您想記錄的名稱與 id 可能已不存在。請將呼叫置於其上方。
