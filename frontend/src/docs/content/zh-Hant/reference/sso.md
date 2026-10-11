# Single Sign-On

Heym 可透過任何外部 **OpenID Connect** 供應商驗證使用者身分。管理員在 **Settings → SSO** 下輸入 issuer URL，Heym 便會從該供應商的 discovery document 讀取所有其他 endpoint。

沒有任何供應商是硬編碼的。Keycloak、Okta、Entra ID、Auth0、Google 以及任何其他 OIDC 供應商都透過相同的欄位連接，因為 Heym 唯一被告知的資訊就是 issuer。

密碼登入與 SSO 可並行運作。一旦 SSO 驗證完成，即可關閉密碼登入。

## 開始之前

SSO 設定是整個 instance 共用的，因此僅有 instance 管理員可以變更。管理員是透過環境變數指定，而非儲存於資料庫中：

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

空值不會授予任何人權限。變更後請重新啟動後端。此清單中的帳號也會在 Settings 中看到 **SSO** 分頁，且即使密碼登入已停用，仍保有密碼存取權——請參閱 [Disabling Password Sign-In](#disabling-password-sign-in)。

## 向您的供應商註冊 Heym

在您的身分供應商中，建立一個 **confidential client**（也稱為 app registration），並設定：

| 設定 | 值 |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | 開啟——Heym 使用 client secret |
| Redirect URI | Heym 的 SSO 分頁中所顯示的確切值 |
| Scopes | `openid email profile` |

Heym 會根據 `FRONTEND_URL` 計算 redirect URI，並在設定表單中以唯讀方式顯示，附有複製按鈕。它一律以 `/api/auth/sso/callback` 結尾。請複製而非手動輸入——redirect URI 不一致是最常見的設定失敗原因，且供應商會拒絕且不提供任何說明。

您的供應商必須回傳已驗證的電子郵件地址。請參閱 [Account Mapping](#account-mapping)。

## 設定 Heym

開啟 **Settings → SSO**。此分頁僅會對 `HEYM_ADMIN_EMAILS` 中的帳號顯示。

| 欄位 | 功能 |
|-------|--------------|
| **Enable single sign-on** | 在登入畫面顯示登入按鈕。 |
| **Issuer URL** | 供應商的 base URL，例如 `https://idp.example.com/realms/your-realm`。Heym 會附加 `/.well-known/openid-configuration`，並從該處讀取其餘資訊。 |
| **Client ID** | 來自您供應商的 client 識別碼。 |
| **Client secret** | 以加密方式儲存。將欄位留空以保留已儲存的值——Heym 絕不會回傳它所持有的 secret。 |
| **Redirect URI** | 唯讀。請將此複製到您供應商的允許清單中。 |
| **Scopes** | 預設為 `openid email profile`。 |
| **Sign-in button label** | 登入畫面按鈕上的文字，例如「Sign in with Okta」。 |
| **Create an account on first sign-in** | 未知的使用者是否會自動取得 Heym 帳號。 |
| **Allowed email domains** | 以逗號分隔。留空則允許供應商所驗證的任何網域。 |
| **Disable password sign-in** | 在整個 instance 關閉密碼驗證。 |

### 先測試連線

**Test connection** 會擷取 discovery document 與供應商的簽署金鑰，然後回報它所找到的 token endpoint。您可以在尚未儲存的 issuer 上執行測試，因此錯誤的 URL 只需付出一次點擊的代價，而非一次儲存。

唯有當所測試的 issuer 正是已儲存的那一個時，測試才會*記錄*為通過的結果。草稿測試只會告訴您該 URL 是否可解析；它不會為尚未儲存的設定背書。基於相同理由，變更 issuer、client ID、scopes 或 secret 都會清除已記錄的結果。

## 登入的運作方式

1. 使用者在登入畫面點擊登入按鈕。
2. Heym 以 `state`、`nonce` 及 PKCE challenge 將使用者重新導向至供應商。
3. 使用者向供應商進行驗證。
4. 供應商以 authorization code 將使用者重新導向回 Heym 的 callback。
5. Heym 以該 code 交換 tokens，並依據供應商公開的金鑰驗證 ID token，檢查簽章、audience、issuer、到期時間及 nonce。
6. Heym 解析帳號並簽發自己的 session，與密碼登入完全相同。

第 6 步之後的所有流程皆維持不變：相同的 session cookies、相同的 token 生命週期、相同的權限。

## Account Mapping

Heym 依下列順序解析帳號：

1. **`(issuer, subject)`**——供應商在先前登入時所宣稱的身分。此為權威來源，且在供應商端變更電子郵件後仍能存續。
2. **已驗證的電子郵件**——具有該地址的既有 Heym 帳號會被認領，並自此在該帳號上記錄供應商的 subject。
3. **新帳號**——若 **Create an account on first sign-in** 已開啟且網域被允許，則會建立新帳號。

唯有當 ID token 帶有 `email_verified: true` 時，電子郵件才計為已驗證。若該 claim 為 `false` 或缺少，登入將被拒絕。僅憑供應商不願背書的地址來認領既有帳號——或建立新帳號——是一條帳號接管的途徑，因此 Heym 不會這麼做。若供應商從不發出 `email_verified`，則需要將其設定為會發出。

以此方式建立的帳號沒有密碼。它們僅能透過供應商登入。

## 停用密碼登入

**停用密碼登入**開關在三件事同時成立之前都會保持無法使用：

1. 已啟用 SSO。
2. 連線測試已通過，因此錯誤的 issuer 不會把自己鎖在門外。
3. `HEYM_ADMIN_EMAILS` 中至少有一個帳號確實擁有密碼。

當開關開啟時，所有三個會產生或接受密碼驗證的介面都會拒絕密碼驗證：登入表單、**註冊**，以及 MCP OAuth 同意頁面。註冊之所以算在內，是因為它會發出密碼；若放任它開放，任何能存取 `/register` 的人都能繞過此設定。

列於 `HEYM_ADMIN_EMAILS` 的帳號不受這三者限制。能編輯環境檔案的人本來就能復原執行個體，因此這項保證存在於程式碼中，而非仰賴操作者的記憶。

### 為什麼會有第三個條件

若管理員的 Heym 帳號是*透過* SSO 建立的，則該帳號完全沒有密碼。豁免機制會讓他們通過閘門，但他們沒有任何東西可以用來登入——因此一旦 provider 故障，執行個體將無法復原。Heym 拒絕進入該狀態，並會明確說明。

若您遇到該訊息，請透過 SSO 登入，並在您的其中一個管理員地址上註冊一個密碼帳號（註冊之所以仍對管理員地址開放，正是為了這個原因），或將一個已有密碼的地址加入 `HEYM_ADMIN_EMAILS`。

### 當 provider 故障時進行復原

依偏好順序如下：

1. **使用緊急管理員密碼登入。** 當密碼登入關閉時，登入畫面會隱藏密碼表單，因此請點擊 SSO 按鈕下方的 **Sign in with a password instead** 以顯示它。該表單並非繞道機制：`HEYM_ADMIN_EMAILS` 以外的每個地址仍會被拒絕，並會收到原因說明。
2. **將您自己加入環境檔案中的 `HEYM_ADMIN_EMAILS`**，並重新啟動後端。已有密碼的帳號便可登入。
3. **直接在資料庫中重新開啟密碼登入**，若完全沒有管理員擁有密碼：

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   不需要重新啟動；此設定會在每次請求時讀取。

Portal 終端使用者不受影響。他們是對個別的目錄進行驗證——請參閱 [Portal](./portal.md)。

## 登入錯誤

登入失敗時會返回登入畫面並顯示可讀的訊息。Heym 絕不會顯示 provider 的原始錯誤文字。

| 訊息 | 原因 |
|---------|-------|
| That sign-in attempt expired | 該次嘗試超過十分鐘，或瀏覽器丟棄了交易 cookie。請再試一次。 |
| Could not reach the identity provider | Discovery 或 Token 交換失敗。請檢查 issuer URL，並確認可從後端連線至該 provider。 |
| The provider's response could not be verified | ID token 未通過簽章、audience、issuer、到期時間或 nonce 驗證。通常是 client ID 不符。 |
| The provider did not return an email address | 缺少 `email` scope，或 provider 未釋出該 claim。 |
| Your email address is not verified | provider 傳送了 `email_verified: false`，或省略了該 claim。 |
| Your email domain is not allowed | 該地址不在 **Allowed email domains** 之內。 |
| No Heym account exists for you | **Create an account on first sign-in** 已關閉，且沒有符合的帳號。必須由管理員建立一個。 |
| Single sign-on is not configured | SSO 已停用，或缺少 issuer、client ID 或 secret。 |

## 安全性注意事項

- **client secret 會加密儲存於靜態資料中**，且絕不會由任何 Endpoint 回傳。設定表單只會回報是否已儲存。
- **PKCE verifier 絕不會離開 Heym。** 它保存在短效的 `HttpOnly` cookie 中，而非放在 `state` 參數裡——後者會以明文形式經由 provider 往返。
- **僅接受非對稱簽章。** 無論 provider 宣告什麼，`none` 與對稱式演算法都會被拒絕。
- **登入後的目的地會經過驗證**，必須是同源路徑，因此回呼無法被當作開放重新導向使用。
- **每次登入都會被稽核。** 成功、失敗與拒絕都會以 `auth.sso_login` 記錄行呈現，設定變更則以 `sso_settings.update` 呈現——請參閱 [Audit Logging](./audit.md)。

## 不支援的項目

- **SAML。** OIDC 是唯一的協定。
- **多個同時運作的 provider。** 一個執行個體只連線至一個 provider。
- **從 provider claims 進行群組或角色對應。**
- **單一登出。** 登出 Heym 並不會讓您登出 provider。
