# Single Sign-On

Heym은 모든 외부 **OpenID Connect** 제공자에 대해 사용자를 인증할 수 있습니다. 관리자가 **Settings → SSO**에서 issuer URL을 입력하면, Heym은 해당 제공자의 discovery document에서 나머지 모든 endpoint를 읽어옵니다.

하드코딩된 제공자는 없습니다. Keycloak, Okta, Entra ID, Auth0, Google 및 기타 모든 OIDC 제공자는 동일한 필드를 통해 연결됩니다. Heym이 전달받는 유일한 정보는 issuer이기 때문입니다.

비밀번호 로그인과 SSO는 나란히 작동합니다. SSO가 검증되면 비밀번호 로그인을 비활성화할 수 있습니다.

## 시작하기 전에

SSO 설정은 인스턴스 전역에 적용되므로, 인스턴스 관리자만 변경할 수 있습니다. 관리자는 데이터베이스에 저장되지 않고 환경 변수로 지정됩니다:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

값이 비어 있으면 아무에게도 권한이 부여되지 않습니다. 변경 후에는 백엔드를 재시작하십시오. 이 목록에 있는 계정은 Settings에서 **SSO** 탭도 볼 수 있으며, 비밀번호 로그인이 비활성화된 경우에도 비밀번호 접근 권한을 유지합니다 — [비밀번호 로그인 비활성화](#disabling-password-sign-in)를 참조하십시오.

## 제공자에 Heym 등록하기

ID 제공자에서 다음 설정으로 **confidential client**(앱 등록이라고도 함)를 생성하십시오:

| 설정 | 값 |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | On — Heym은 client secret을 사용합니다 |
| Redirect URI | Heym의 SSO 탭에 표시된 정확한 값 |
| Scopes | `openid email profile` |

Heym은 `FRONTEND_URL`에서 redirect URI를 계산하여 설정 양식에 읽기 전용으로 표시하고 복사 버튼을 제공합니다. 이 URI는 항상 `/api/auth/sso/callback`으로 끝납니다. 직접 입력하지 말고 복사하십시오 — redirect URI 불일치는 가장 흔한 설정 실패 원인이며, 제공자는 별다른 설명 없이 이를 거부합니다.

제공자는 검증된 이메일 주소를 반환해야 합니다. [계정 매핑](#account-mapping)을 참조하십시오.

## Heym 구성하기

**Settings → SSO**를 여십시오. 이 탭은 `HEYM_ADMIN_EMAILS`에 있는 계정에만 표시됩니다.

| 필드 | 기능 |
|-------|--------------|
| **Enable single sign-on** | 로그인 화면에 로그인 버튼을 표시합니다. |
| **Issuer URL** | 제공자의 기본 URL입니다. 예: `https://idp.example.com/realms/your-realm`. Heym은 `/.well-known/openid-configuration`을 추가하고 나머지를 여기서 읽어옵니다. |
| **Client ID** | 제공자의 client 식별자입니다. |
| **Client secret** | 암호화되어 저장됩니다. 저장된 값을 유지하려면 필드를 비워 두십시오 — Heym은 보유한 secret을 절대 반환하지 않습니다. |
| **Redirect URI** | 읽기 전용입니다. 이를 복사하여 제공자의 허용 목록에 넣으십시오. |
| **Scopes** | 기본값은 `openid email profile`입니다. |
| **Sign-in button label** | 로그인 화면 버튼의 텍스트입니다. 예: "Sign in with Okta". |
| **Create an account on first sign-in** | 알려지지 않은 사용자에게 Heym 계정이 자동으로 생성되는지 여부입니다. |
| **Allowed email domains** | 쉼표로 구분합니다. 비워 두면 제공자가 인증하는 모든 도메인을 허용합니다. |
| **Disable password sign-in** | 인스턴스 전역에서 비밀번호 인증을 끕니다. |

### 먼저 연결을 테스트하십시오

**Test connection**은 discovery document와 제공자의 서명 키를 가져온 후, 발견한 token endpoint를 보고합니다. 아직 저장하지 않고 입력만 한 issuer에 대해서도 실행할 수 있으므로, 잘못된 URL은 저장이 아닌 클릭 한 번으로 끝납니다.

테스트는 테스트한 issuer가 이미 저장된 issuer와 동일한 경우에만 통과 결과를 *기록*합니다. 초안 테스트는 URL이 확인되는지만 알려줄 뿐, 저장되지 않은 구성을 허가하지는 않습니다. 같은 이유로 issuer, client ID, scopes 또는 secret을 변경하면 기록된 결과가 지워집니다.

## 로그인 작동 방식

1. 사용자가 로그인 화면에서 로그인 버튼을 클릭합니다.
2. Heym은 `state`, `nonce` 및 PKCE challenge와 함께 사용자를 제공자로 리디렉션합니다.
3. 사용자가 제공자로 인증합니다.
4. 제공자가 authorization code와 함께 Heym의 callback으로 다시 리디렉션합니다.
5. Heym은 code를 token으로 교환하고, 제공자가 게시한 키로 ID token을 검증하며, 서명, audience, issuer, 만료 및 nonce를 확인합니다.
6. Heym은 계정을 확인하고 비밀번호 로그인과 정확히 동일하게 자체 세션을 발급합니다.

6단계 이후의 모든 것은 변경되지 않습니다: 동일한 세션 쿠키, 동일한 token 수명, 동일한 권한입니다.

## 계정 매핑

Heym은 다음 순서로 계정을 확인합니다:

1. **`(issuer, subject)`** — 이전 로그인 시 제공자가 주장한 identity입니다. 이는 권위 있는 정보이며 제공자에서 이메일이 변경되어도 유지됩니다.
2. **검증된 이메일** — 해당 주소를 가진 기존 Heym 계정이 청구되고, 이후부터 제공자의 subject가 그 계정에 기록됩니다.
3. **새 계정** — **Create an account on first sign-in**이 켜져 있고 도메인이 허용된 경우 생성됩니다.

이메일은 ID token에 `email_verified: true`가 포함된 경우에만 검증된 것으로 간주됩니다. 해당 클레임이 `false`이거나 누락된 경우 로그인이 거부됩니다. 제공자가 보증하지 않는 주소를 근거로 기존 계정을 청구하거나 새 계정을 생성하는 것은 계정 탈취 경로이므로, Heym은 이를 수행하지 않습니다. `email_verified`를 절대 내보내지 않는 제공자는 이를 내보내도록 구성해야 합니다.

이런 방식으로 생성된 계정에는 비밀번호가 없습니다. 해당 계정은 제공자를 통해서만 로그인합니다.

## 비밀번호 로그인 비활성화

**Disable password sign-in** 스위치는 다음 세 가지 조건이 충족될 때까지 사용할 수 없는 상태로 유지됩니다:

1. SSO가 활성화되어 있어야 합니다.
2. 연결 테스트가 통과되어야 합니다. 잘못된 issuer가 스스로 문을 잠그는 상황을 방지하기 위함입니다.
3. `HEYM_ADMIN_EMAILS`의 계정 중 최소 하나에 실제로 비밀번호가 있어야 합니다.

이 스위치가 켜져 있으면 비밀번호를 발급하거나 수락하는 세 가지 경로 모두에서 비밀번호 인증이 거부됩니다: 로그인 폼, **registration**, 그리고 MCP OAuth 동의 페이지입니다. Registration이 포함되는 이유는 이것이 비밀번호를 발급하기 때문이며, 이를 열어두면 `/register`에 접근할 수 있는 누구나 이 설정을 우회할 수 있게 됩니다.

`HEYM_ADMIN_EMAILS`에 나열된 계정은 세 경로 모두에서 예외입니다. 환경 파일을 편집할 수 있는 사람은 이미 인스턴스를 복구할 수 있으므로, 이 보장은 운영자의 기억이 아닌 코드에 존재합니다.

### 세 번째 조건이 존재하는 이유

SSO를 *통해* 생성된 Heym 계정을 가진 관리자는 비밀번호가 전혀 없습니다. 예외 조항이 이들이 게이트를 통과하게 해주지만, 로그인할 수단이 없으므로 provider가 다운되면 인스턴스를 되돌릴 방법이 없게 됩니다. Heym은 이러한 상태에 진입하는 것을 거부하며 그 이유를 안내합니다.

해당 메시지가 표시되면 SSO를 통해 로그인한 후 관리자 주소 중 하나에 비밀번호 계정을 등록하거나(바로 이 이유로 관리자 주소에 대한 registration이 여전히 열려 있습니다), 이미 비밀번호가 있는 주소를 `HEYM_ADMIN_EMAILS`에 추가하십시오.

### Provider가 다운되었을 때 복구하기

선호 순서대로:

1. **비상용 관리자 비밀번호로 로그인합니다.** 비밀번호 로그인이 꺼져 있으면 로그인 화면에서 비밀번호 폼이 숨겨지므로, SSO 버튼 아래의 **Sign in with a password instead**를 클릭하여 표시하십시오. 이 폼은 우회 수단이 아닙니다. `HEYM_ADMIN_EMAILS` 외부의 모든 주소는 여전히 거부되며 그 이유가 안내됩니다.
2. **환경 파일에서 자신을 `HEYM_ADMIN_EMAILS`에 추가**하고 백엔드를 재시작하십시오. 이미 비밀번호가 있는 계정은 그 후 로그인할 수 있습니다.
3. **관리자 중 비밀번호가 있는 사람이 전혀 없다면, 데이터베이스에서 직접 비밀번호 로그인을 다시 활성화합니다**:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   재시작은 필요하지 않습니다. 이 설정은 요청마다 읽힙니다.

Portal 최종 사용자는 영향을 받지 않습니다. 이들은 별도의 디렉터리에 대해 인증합니다 — [Portal](./portal.md)을 참조하십시오.

## 로그인 오류

로그인 실패 시 읽을 수 있는 메시지와 함께 로그인 화면으로 돌아갑니다. Heym은 provider의 원시 오류 텍스트를 절대 표시하지 않습니다.

| 메시지 | 원인 |
|---------|-------|
| That sign-in attempt expired | 시도가 10분을 초과했거나 브라우저가 트랜잭션 쿠키를 삭제했습니다. 다시 시도하십시오. |
| Could not reach the identity provider | Discovery 또는 token exchange가 실패했습니다. issuer URL과 백엔드에서 provider에 도달할 수 있는지 확인하십시오. |
| The provider's response could not be verified | ID token이 서명, audience, issuer, 만료 또는 nonce 검증에 실패했습니다. 일반적으로 client ID 불일치입니다. |
| The provider did not return an email address | `email` scope가 누락되었거나 provider가 클레임을 제공하지 않았습니다. |
| Your email address is not verified | Provider가 `email_verified: false`를 전송했거나 클레임을 생략했습니다. |
| Your email domain is not allowed | 주소가 **Allowed email domains** 범위를 벗어났습니다. |
| No Heym account exists for you | **Create an account on first sign-in**이 꺼져 있고 일치하는 계정이 없습니다. 관리자가 계정을 생성해야 합니다. |
| Single sign-on is not configured | SSO가 비활성화되었거나 issuer, client ID 또는 secret이 누락되었습니다. |

## 보안 참고 사항

- **Client secret은 저장 시 암호화**되며 어떤 endpoint에서도 반환되지 않습니다. 설정 폼은 저장 여부만 보고합니다.
- **PKCE verifier는 Heym을 벗어나지 않습니다.** 이는 provider를 통해 평문으로 왕복하는 `state` 파라미터가 아닌, 수명이 짧은 `HttpOnly` 쿠키에 보관됩니다.
- **비대칭 서명만 허용됩니다.** Provider가 무엇을 광고하든 `none` 및 대칭 알고리즘은 거부됩니다.
- **로그인 후 목적지가 검증됩니다.** 동일 출처 경로로 검증되므로 callback이 오픈 리다이렉트로 사용될 수 없습니다.
- **모든 로그인이 감사됩니다.** 성공, 실패, 거부는 `auth.sso_login` 라인으로, 구성 변경은 `sso_settings.update`로 나타납니다 — [Audit Logging](./audit.md)을 참조하십시오.

## 지원되지 않는 사항

- **SAML.** OIDC가 유일한 프로토콜입니다.
- **다중 동시 provider.** 하나의 인스턴스는 하나의 provider에 연결됩니다.
- **Provider 클레임으로부터의 그룹 또는 역할 매핑.**
- **Single logout.** Heym에서 로그아웃해도 provider에서 로그아웃되지 않습니다.
