# シングルサインオン

Heym は、任意の外部 **OpenID Connect** プロバイダーに対してユーザーを認証できます。管理者が **Settings → SSO** で issuer URL を入力すると、Heym はそのプロバイダーの discovery document から他のすべての endpoint を読み取ります。

ハードコードされたプロバイダーはありません。Keycloak、Okta、Entra ID、Auth0、Google、その他あらゆる OIDC プロバイダーが同じフィールドを通じて接続できます。Heym に伝えられる情報は issuer だけだからです。

パスワードサインインと SSO は併用できます。SSO の検証が完了すれば、パスワードサインインを無効化できます。

## 開始する前に

SSO 設定はインスタンス全体に適用されるため、インスタンス管理者のみが変更できます。管理者はデータベースに保存されるのではなく、環境変数で指定します：

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

空の値では誰にも権限が付与されません。変更後はバックエンドを再起動してください。このリストに含まれるアカウントは Settings の **SSO** タブも表示でき、パスワードサインインが無効化されている場合でもパスワードアクセスを維持します — [パスワードサインインの無効化](#disabling-password-sign-in) を参照してください。

## プロバイダーへの Heym の登録

アイデンティティプロバイダーで、以下の設定を持つ **confidential client**（アプリ登録とも呼ばれます）を作成します：

| 設定 | 値 |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | オン — Heym は client secret を使用します |
| Redirect URI | Heym の SSO タブに表示される正確な値 |
| Scopes | `openid email profile` |

Heym は `FRONTEND_URL` から redirect URI を計算し、設定フォームに読み取り専用でコピーボタン付きで表示します。常に `/api/auth/sso/callback` で終わります。入力するのではなくコピーしてください — redirect URI の不一致は最も一般的なセットアップ失敗の原因であり、プロバイダーは説明なしに拒否します。

プロバイダーは検証済みのメールアドレスを返す必要があります。[アカウントマッピング](#account-mapping) を参照してください。

## Heym の設定

**Settings → SSO** を開きます。このタブは `HEYM_ADMIN_EMAILS` に含まれるアカウントにのみ表示されます。

| フィールド | 機能 |
|-------|--------------|
| **Enable single sign-on** | ログイン画面にサインインボタンを表示します。 |
| **Issuer URL** | プロバイダーのベース URL。例：`https://idp.example.com/realms/your-realm`。Heym は `/.well-known/openid-configuration` を付加し、そこから残りを読み取ります。 |
| **Client ID** | プロバイダーの client identifier。 |
| **Client secret** | 暗号化して保存されます。保存済みの値を維持するにはフィールドを空のままにしてください — Heym は保持している secret を返すことはありません。 |
| **Redirect URI** | 読み取り専用。これをプロバイダーの許可リストにコピーしてください。 |
| **Scopes** | デフォルトは `openid email profile`。 |
| **Sign-in button label** | ログイン画面のボタンのテキスト。例：「Sign in with Okta」。 |
| **Create an account on first sign-in** | 未知のユーザーに Heym アカウントを自動的に付与するかどうか。 |
| **Allowed email domains** | カンマ区切り。空欄の場合、プロバイダーが認証する任意のドメインを許可します。 |
| **Disable password sign-in** | インスタンス全体でパスワード認証を無効化します。 |

### まず接続をテストする

**Test connection** は discovery document とプロバイダーの署名鍵を取得し、見つかった token endpoint を報告します。まだ入力しただけで保存していない issuer に対しても実行できるため、URL の誤りは保存ではなくクリック1回で済みます。

テストが合格結果を*記録*するのは、テストした issuer が既に保存されているものと一致する場合のみです。ドラフトのテストは URL が解決するかどうかを示すだけで、保存されていない設定を承認するものではありません。同じ理由で、issuer、client ID、scopes、または secret を変更すると、記録された結果はクリアされます。

## サインインの仕組み

1. ユーザーがログイン画面のサインインボタンをクリックします。
2. Heym は `state`、`nonce`、PKCE challenge を付けてユーザーをプロバイダーにリダイレクトします。
3. ユーザーはプロバイダーで認証します。
4. プロバイダーは authorization code を付けて Heym の callback にリダイレクトして戻します。
5. Heym は code を tokens と交換し、プロバイダーが公開している鍵に対して ID token を検証します。署名、audience、issuer、有効期限、nonce をチェックします。
6. Heym はアカウントを解決し、パスワードサインインとまったく同じように独自のセッションを発行します。

ステップ6以降はすべて変更されません。同じセッション Cookie、同じ token の有効期間、同じ権限です。

## アカウントマッピング

Heym は以下の順序でアカウントを解決します：

1. **`(issuer, subject)`** — 以前のサインインでプロバイダーが表明したアイデンティティ。これは権威ある情報であり、プロバイダー側でメールが変更されても維持されます。
2. **検証済みメール** — そのアドレスを持つ既存の Heym アカウントが取得され、それ以降プロバイダーの subject がそのアカウントに記録されます。
3. **新規アカウント** — **Create an account on first sign-in** がオンで、ドメインが許可されている場合に作成されます。

メールが検証済みと見なされるのは、ID token に `email_verified: true` が含まれている場合のみです。このクレームが `false` または欠落している場合、サインインは拒否されます。プロバイダーが保証しないアドレスを根拠に既存アカウントを取得したり、新規アカウントを作成したりすることはアカウント乗っ取りの経路となるため、Heym はそれを行いません。`email_verified` を決して発行しないプロバイダーは、発行するように設定する必要があります。

この方法で作成されたアカウントにはパスワードがありません。プロバイダー経由でのみサインインします。

## パスワードサインインの無効化

**Disable password sign-in** スイッチは、次の3つの条件がすべて満たされるまで利用できません：

1. SSOが有効になっていること。
2. 接続テストに合格していること。これにより、誤ったissuerが自身の背後でドアをロックしてしまうことを防ぎます。
3. `HEYM_ADMIN_EMAILS` 内の少なくとも1つのアカウントが、実際にパスワードを持っていること。

これがオンの場合、パスワードを発行または受け入れる3つのサーフェスすべてでパスワード認証が拒否されます：ログインフォーム、**registration**、そしてMCP OAuth同意ページです。registrationが対象に含まれるのは、これがパスワードを発行するためです。これを開いたままにすると、`/register` に到達できる誰もがこの設定を回避できてしまいます。

`HEYM_ADMIN_EMAILS` にリストされたアカウントは、これら3つすべてから免除されます。環境ファイルを編集できる者はすでにインスタンスを復旧できるため、この保証はオペレーターの記憶ではなくコード内に存在します。

### 3番目の条件が存在する理由

HeymアカウントがSSOを*通じて*作成された管理者は、パスワードを一切持っていません。免除があればゲートを通過できますが、サインインする手段が何もないため、プロバイダーがダウンした場合にインスタンスを復旧する方法がなくなってしまいます。Heymはその状態に入ることを拒否し、その旨を通知します。

このメッセージが表示された場合は、SSOでサインインし、管理者アドレスの1つでパスワードアカウントを登録してください（まさにこの理由により、管理者アドレスへのregistrationは依然として開かれています）。または、すでにパスワードを持つアドレスを `HEYM_ADMIN_EMAILS` に追加してください。

### プロバイダーがダウンしている場合の復旧

優先順位の高い順に：

1. **緊急用管理者パスワードでサインインします。** パスワードサインインがオフの場合、ログイン画面はパスワードフォームを非表示にするため、SSOボタンの下にある **Sign in with a password instead** をクリックして表示させます。このフォームはバイパスではありません。`HEYM_ADMIN_EMAILS` 外のすべてのアドレスは依然として拒否され、その理由が通知されます。
2. **環境ファイルで自分自身を `HEYM_ADMIN_EMAILS` に追加**し、バックエンドを再起動します。すでにパスワードを持つアカウントであれば、サインインできるようになります。
3. **管理者が誰もパスワードを持っていない場合は、データベースで直接パスワードサインインを再有効化します**：

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   再起動は不要です。この設定はリクエストごとに読み取られます。

Portalのエンドユーザーは影響を受けません。彼らは別のディレクトリに対して認証を行います — [Portal](./portal.md) を参照してください。

## サインインエラー

サインインに失敗すると、読みやすいメッセージとともにログイン画面に戻ります。Heymはプロバイダーの生のエラーテキストを決して表示しません。

| メッセージ | 原因 |
|---------|-------|
| That sign-in attempt expired | 試行が10分以上かかったか、ブラウザがトランザクションCookieを破棄しました。再試行してください。 |
| Could not reach the identity provider | Discoveryまたはtoken exchangeが失敗しました。issuer URLと、プロバイダーがバックエンドから到達可能であることを確認してください。 |
| The provider's response could not be verified | ID tokenが署名、audience、issuer、有効期限、またはnonceの検証に失敗しました。通常はclient IDの不一致です。 |
| The provider did not return an email address | `email` スコープが欠落しているか、プロバイダーがクレームを解放していません。 |
| Your email address is not verified | プロバイダーが `email_verified: false` を送信したか、クレームを省略しました。 |
| Your email domain is not allowed | アドレスが **Allowed email domains** の範囲外です。 |
| No Heym account exists for you | **Create an account on first sign-in** がオフで、一致するアカウントがありません。管理者がアカウントを作成する必要があります。 |
| Single sign-on is not configured | SSOが無効であるか、issuer、client ID、またはsecretが欠落しています。 |

## セキュリティに関する注意事項

- **client secretは保存時に暗号化され**、いかなるendpointからも返されることはありません。設定フォームは、secretが保存されているかどうかのみを報告します。
- **PKCE verifierはHeymから決して出ません。** これは `state` パラメータではなく、短命な `HttpOnly` Cookieに保持されます。`state` パラメータはプロバイダーを経由して平文で往復するためです。
- **非対称署名のみが受け入れられます。** プロバイダーが何をアドバタイズしていようと、`none` および対称アルゴリズムは拒否されます。
- **ログイン後の遷移先は同一オリジンのパスとして検証される**ため、コールバックをオープンリダイレクトとして使用することはできません。
- **すべてのサインインは監査されます。** 成功、失敗、拒否は `auth.sso_login` 行として、設定変更は `sso_settings.update` として記録されます — [Audit Logging](./audit.md) を参照してください。

## サポートされないもの

- **SAML。** OIDCが唯一のプロトコルです。
- **複数のプロバイダーの同時利用。** 1つのインスタンスは1つのプロバイダーに接続します。
- **プロバイダーのクレームからのグループまたはロールのマッピング。**
- **シングルログアウト。** Heymからサインアウトしても、プロバイダーからサインアウトされることはありません。
