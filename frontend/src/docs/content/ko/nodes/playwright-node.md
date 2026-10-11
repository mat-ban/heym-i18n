# Playwright

**Playwright** 노드는 구성 가능한 단계를 통해 브라우저 상호작용을 자동화합니다. 웹 스크래핑, 양식 작성, 브라우저 기반 Workflow에 활용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.results`, `$nodeLabel.screenshot`, 그리고 선택적 network/browser 데이터 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"`(기본값) 또는 `"code"`(Run Code). Properties Panel의 Mode 드롭다운에서 선택합니다 |
| `playwrightSteps` | array | 단계: navigate, click, type, aiStep 등. 각 단계는 action과 selector/params를 가집니다. `disabled: true`는 단계를 목록에 유지하되 런타임에 건너뜁니다 |
| `playwrightCode` | string | Mode가 Run Code일 때 사용되는 사용자 정의 Playwright Python. 강화된 sandbox에서 실행되며 **기본적으로 비활성화**됩니다 — 아래 보안 관련 주의사항을 참조하십시오 |
| `playwrightHeadless` | boolean | headless로 실행 (기본값: true) |
| `playwrightStealth` | boolean | 일반적인 Playwright 자동화 신호를 줄이는 옵트인 Steps 모드 설정 (기본값: false). Properties Panel 레이블: Reduce automation flags |
| `playwrightTimeout` | number | 타임아웃 (ms) (기본값: 30000) |
| `playwrightCaptureNetwork` | boolean | JSON 응답, 헤더, 쿠키, 브라우저 스토리지 캡처 |
| `playwrightAuthEnabled` | boolean | 단계 실행 전 쿠키/storageState에서 브라우저 인증 복원 |
| `playwrightAuthStateExpression` | string | Playwright `storageState` 또는 원시 `cookies[]`로 해석되는 표현식 또는 JSON |
| `playwrightAuthCheckSelector` | string | 인증 부트스트랩 후 반드시 표시되어야 하는 selector |
| `playwrightAuthCheckTimeout` | number | 인증된 selector 확인을 위한 타임아웃 (ms) (기본값: 5000) |
| `playwrightAuthFallbackSteps` | array | 쿠키 복원이 페이지 인증에 실패할 때 실행할 로그인 전용 fallback 단계 |

## 단계 유형

- **navigate** – URL로 이동
- **refresh** – 현재 페이지 새로고침 (선택적 단계 `timeout`(ms)은 새로고침 탐색용)
- **click** – selector로 요소 클릭
- **type** – 입력란에 텍스트 입력 (한 글자씩)
- **fill** – 입력값 채우기
- **wait** – 타임아웃 대기 (ms)
- **screenshot** – 스크린샷 캡처 (`outputKey`가 results에 base64를 저장)
- **getText** – 요소의 텍스트 콘텐츠 (`selector`, 선택적 `outputKey`)
- **getAttribute** – 속성값 (`selector`, `attribute`, 선택적 `outputKey`)
- **getHTML** – 요소의 outer HTML (`selector`, 선택적 `outputKey`)
- **getVisibleTextOnPage** – `document.body.innerText`로 전체 페이지의 표시 텍스트 (selector 없음; `outputKey` 사용; 선택적 단계 `timeout`(ms)은 캡처 전 대기)
- **hover** – 요소 위로 마우스 호버
- **selectOption** – `<select>`에서 옵션 선택
- **scrollDown** / **scrollUp** – 마우스 휠 스크롤 (선택적 `amount`(픽셀))
- **aiStep** – LLM이 수동 단계와 동일한 종류의 action을 반환합니다 (아래 참조); 중첩된 `aiStep`은 지원되지 않습니다

## 단계 끄기

모든 단계는 헤더에 전원 토글을 가집니다. 꺼진 단계는 제목이 취소선과 흐림 처리로 표시되며, 모든 필드를 유지한 채 목록에 남아 있고 노드 실행 시 건너뜁니다 — 작업을 삭제하지 않고 실패하는 selector를 격리할 때 유용합니다. 저장된 단계는 `disabled: true`를 가지며, 해당 플래그가 없는 단계는 정상적으로 실행됩니다.

비활성화된 단계는 노드의 나머지 부분에서 보이지 않습니다: 인증 부트스트랩의 "첫 단계는 반드시 `navigate`여야 한다" 규칙을 충족하지 않으며, 비활성화된 `aiStep`은 LLM 호출을 하지 않고, `playwrightAuthFallbackSteps`의 비활성화된 항목도 건너뜁니다. 모든 단계를 끄면 하나를 활성화하라는 메시지와 함께 실행이 실패합니다.

## AI Step

**aiStep** action은 LLM을 사용하여 페이지 HTML(그리고 선택적으로 스크린샷)을 분석하고 자연어 지시로부터 Playwright action을 생성합니다. API는 수동 단계와 동일한 action 이름을 허용합니다 (`navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, 스크롤 등 포함). **Auto heal**은 click, type, fill, hover, selectOption에 대해 실패한 selector 기반 단계만 대안으로 대체합니다.

| 옵션 | 설명 |
|--------|-------------|
| `instructions` | AI가 수행해야 할 작업 (예: "Click the Login button") |
| `credentialId` | LLM credential (OpenAI, Google, 또는 Custom) |
| `model` | 선택한 LLM credential에서 검색 가능한 모델 목록 |
| `saveStepsForFuture` | 다음 실행을 위해 생성된 단계를 캐시 (LLM 호출 방지) |
| `sendScreenshot` | 시각적 요소를 위해 LLM에 스크린샷 전송 |
| `aiStepTimeout` | LLM 호출 타임아웃 (ms) (기본값 30000) |

### AI Auto Heal

**AI Auto Heal**은 Workflow를 DOM 변경에 강인하게 만듭니다. selector가 두 번 실패하면(예: 사이트 재설계 후), Heym은 LLM을 호출하여 대체 locator를 찾습니다—일반적으로 CSS selector 대신 `role=button[name='Submit']` 또는 `text=Exact text`를 사용합니다.

AI step 속성에서 **Auto heal mode**를 활성화하십시오. 저장된 단계가 실패하면:

1. Heym이 현재 HTML과 스크린샷을 캡처합니다
2. 실패한 단계 + 페이지 컨텍스트를 LLM에 전송합니다
3. LLM이 강인한 대안(role 기반 locator, text locator, 또는 fallback CSS)을 반환합니다
4. 새 selector로 재시도합니다

이는 사이트가 마크업이나 클래스 이름을 업데이트할 때 발생하는 불안정성을 줄여줍니다.
## 자동화 플래그 감소

사이트가 표준 자동화 신호(user agent의 `HeadlessChrome`, `navigator.webdriver`, 누락된 `window.chrome`) 때문에 Playwright에 번들된 Chromium을 봇으로 간주하는 경우 **Reduce automation flags** (`playwrightStealth: true`)를 활성화하십시오.

이 옵션은 **Steps** 모드에서만 적용됩니다. 이 옵션은 다음을 수행합니다:

- Chromium의 `--enable-automation` 플래그를 제거하고 `--disable-blink-features=AutomationControlled`를 설정합니다
- 표준 Chrome user agent를 전송합니다 (`HeadlessChrome` 없음)
- Playwright가 비워두는 일반적인 브라우저 표면(`window.chrome`, plugins)을 복원합니다
- GPU를 사용할 수 있는 경우(로컬 macOS/Windows) 호스트 GPU 렌더러를 변경하지 않고 유지합니다. Linux/Docker에는 GPU가 없으므로 Chromium의 소프트웨어 렌더러 문자열이 SwiftShader 대신 일반적인 Mali(ARM) 또는 Mesa(x86) GPU로 보고됩니다.

이 옵션은 세션이 Chrome DevTools Protocol을 통해 구동된다는 사실을 숨기지 않으며, 사이트 보안, CAPTCHA 또는 접근 제어를 우회하는 방법이 아닙니다. 권한이 부여된 Workflow — 내부 도구, 자체 사이트, 허용된 브라우저 자동화 — 에 사용하십시오.

Run Code 모드는 변경되지 않습니다 — 사용자 정의 스크립트가 Chromium을 직접 실행합니다.

## 네트워크 캡처

`playwrightCaptureNetwork`를 활성화하면 실행 중 추가 디버깅 데이터를 수집합니다:

- `networkRequests` – 캡처된 JSON/API 응답
- `cookies` – 실행 종료 시점의 브라우저 cookies
- `localStorage` – 브라우저 `localStorage` 키-값 쌍
- `sessionStorage` – 브라우저 `sessionStorage` 키-값 쌍

이는 자동화된 흐름 이후 숨겨진 API 호출, 인증 상태 또는 브라우저 측 데이터를 검사해야 할 때 유용합니다.

## Cookie 부트스트랩 및 로그인 폴백

Playwright가 이미 로그인된 상태로 페이지를 열도록 하려면 `playwrightAuthEnabled`를 활성화하십시오.

### 인증 상태 소스

`playwrightAuthStateExpression`을 `$global.authState`와 같은 표현식으로 설정하십시오. 값은 다음 중 하나일 수 있습니다:

- Playwright `storageState` 객체: `{"cookies": [...], "origins": [...]}`
- 원시 `cookies[]` 배열
- 두 형태 중 하나를 포함하는 JSON 문자열

권장 패턴:

1. 네트워크 캡처 또는 인증 부트스트랩이 활성화된 Playwright 노드를 실행합니다
2. `$playwrightNode.cookies` 또는 전체 인증 상태 객체를 [Global Variable](../reference/global-variables.md)에 저장합니다
3. 이후 Playwright 노드에서 `$global.authState`를 통해 해당 변수를 재사용합니다

### 인증 확인

첫 번째 주요 Playwright 단계는 반드시 `navigate`여야 합니다. 해당 단계가 로드된 후 Heym은 `playwrightAuthCheckSelector`를 확인합니다.

- selector가 표시되면 나머지 주요 단계가 정상적으로 계속됩니다
- selector가 없으면 Heym은 `playwrightAuthFallbackSteps`를 실행합니다
- 폴백 단계가 완료된 후 Heym은 동일한 selector를 다시 확인합니다
- selector가 여전히 없으면 노드는 인증 부트스트랩 오류와 함께 실패합니다

폴백 단계는 인증 실패 이후의 탐색을 담당합니다. 폴백 단계는 나머지 주요 흐름이 기대하는 인증된 페이지에 브라우저를 남겨두어야 합니다.

## 출력 필드

- `$playwrightNode.status` – 성공 시 `"ok"`
- `$playwrightNode.results` – 단계 출력(getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot 키 등)
- `$playwrightNode.screenshot` – 단계에서 저장한 경우 Base64 screenshot
- `$playwrightNode.cookies` – 인증 부트스트랩 또는 네트워크 캡처가 활성화된 경우 최종 브라우저 cookies
- `$playwrightNode.networkRequests` – 캡처된 네트워크 응답(활성화된 경우)
- `$playwrightNode.localStorage` – 브라우저 local storage(활성화된 경우)
- `$playwrightNode.sessionStorage` – 브라우저 session storage(활성화된 경우)

## 예제

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Run Code 모드

Properties Panel에서 **Mode**를 **Run Code**로 설정하면 시각적 단계 대신 `playwrightCode`를 편집할 수 있습니다. 인증 부트스트랩은 Steps 모드에만 적용됩니다.

예제 (sandbox / Docker — Chromium에 `--no-sandbox` 필요):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

래퍼는 `inputs`, `headless`, `timeout_ms`, `capture_network`를 제공합니다. 코드에 `$nodeLabel.field` 표현식을 삽입할 수 있으며, `status`와 `results`를 포함한 JSON을 출력하십시오.
## 사용자 정의 코드 보안

`playwrightCode` 필드는 임의의 Python을 실행합니다. 이는 코드 실행과 동일하므로 **기본적으로 비활성화**되며, 활성화된 경우 샌드박스 환경에서 실행됩니다:

- **기본적으로 비활성화됩니다.** `playwrightCode`가 설정된 노드를 실행하면 운영자가 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`를 설정하지 않는 한 명확한 오류와 함께 실패합니다. 이 검사는 실행 시점에 수행되므로 이전에 저장된 Workflow와 예약/하위 Workflow 실행에도 적용됩니다.
- **활성화 시 격리됩니다.** 사용자 정의 코드는 백엔드 프로세스에서 실행되지 않습니다. Docker 소켓, 백엔드 bind mount, 환경 변수의 백엔드 시크릿이 없고, capability가 제거되며, `no-new-privileges`가 적용되고, CPU/메모리/PID 제한이 설정된 강화된 일회용 형제 컨테이너에서 실행됩니다. Docker를 사용할 수 없는 경우 실행은 fail-closed 방식으로 실패합니다. `HEYM_PLAYWRIGHT_SANDBOX=subprocess`는 신뢰할 수 있거나 로컬 개발 용도로만(보안 경계가 아님) 프로세스 내 경로를 다시 선택합니다. 네이티브 `./run.sh`는 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`가 설정되지 않은 경우 기본적으로 `subprocess`를 사용합니다. `./deploy.sh`(Compose)와 GHCR 단일 이미지는 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`(없으면 `HEYM_CODEX_DOCKER_IMAGE`로 대체)를 통해 형제 runner를 확인하고 일치하는 venv 경로(`/app/.venv` 대 `/app/backend/.venv`)를 사용합니다.
- **Chromium 참고 사항.** 샌드박스 컨테이너는 기본적으로 root로 실행되며, Chromium은 `--no-sandbox` 없이 root로 실행되는 것을 거부합니다. Chromium을 실행하는 사용자 정의 코드는 이를 전달해야 합니다. 예: `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. 단계 기반(및 stealth) 실행도 `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`를 전달하여 fingerprint 스크립트가 `stun.l.google.com:19302`로 STUN UDP를 열 수 없도록 합니다. 사용자 정의 `chromium.launch` 호출에도 해당 플래그를 포함해야 합니다.

단계 기반 Playwright 노드(`playwrightSteps`)는 Heym이 완전히 생성하며(임의 코드 없음), 위의 모든 사항에 영향을 받지 않고 항상 사용할 수 있습니다 — 이 방식을 권장합니다.

## 관련 문서

- [노드 유형](../reference/node-types.md) – 모든 노드 유형 개요
- [Crawler 노드](./crawler-node.md) – FlareSolverr를 사용한 더 간단한 웹 스크래핑
- [Credentials 공유](../reference/credentials-sharing.md) – AI 단계용 LLM credentials
