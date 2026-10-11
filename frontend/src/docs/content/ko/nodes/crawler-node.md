# Crawler

**Crawler** 노드는 FlareSolverr를 사용하여 웹 페이지를 스크래핑하며, CSS 선택자를 통한 선택적 HTML 추출을 지원합니다. 웹 스크래핑 및 콘텐츠 추출에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.body` (HTML 또는 추출된 콘텐츠) |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 FlareSolverr credential |
| `crawlerUrl` | expression | 스크래핑할 URL (표현식 지원) |
| `crawlerWaitSeconds` | number | 스크래핑 전 대기 시간(초) (기본값: 0) |
| `crawlerMaxTimeout` | number | 최대 타임아웃(ms) (기본값: 60000) |
| `crawlerMode` | string | `"basic"` 또는 기타 모드 |
| `crawlerSelectors` | array | 추출용 CSS 선택자. 각 항목: `{ selector, attribute? }` |

## 예시

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## 송신(Egress) 안전성

- credential에 저장된 FlareSolverr URL은 `http://` 또는 `https://`를 사용해야 하며, link-local 또는 클라우드 메타데이터 주소로 확인(resolve)되어서는 안 됩니다. 거부되는 집합은 `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud 및 AWS IPv6 메타데이터 주소, 그리고 이들 중 하나를 포함할 수 있는 IPv6 전환 형식입니다. 이는 알려진 endpoint 목록이며, 모든 제공자에 대한 보장은 아닙니다.
- Loopback 및 private 주소는 의도적으로 허용되므로, 문서화된 `http://localhost:8191` 설정과 `http://flaresolverr:8191` 같은 compose 서비스 이름이 계속 작동합니다. 그 결과, 이 필드는 백엔드가 해당 주소에서 접근할 수 있는 다른 모든 서비스를 가리킬 수도 있으며, 응답은 노드 출력으로 반환됩니다. Credential 공유는 이를 차단하지 않습니다. 로그인한 사용자라면 누구나 자신의 FlareSolverr credential을 생성할 수 있으므로, 기존 credential을 제공하지 않는다고 해서 달라지는 것은 없습니다. 실제로 적용되는 제어 수단은 Workflow를 작성할 수 있는 사람을 신뢰하는 것과, 백엔드가 접근할 수 있는 대상을 제한하는 네트워크 규칙입니다.
- Heym은 연결 전에 확인된 주소를 고정(pin)하므로, 검사 이후 DNS 응답이 요청을 메타데이터 주소로 이동시킬 수 없습니다. 가드가 활성화된 동안 환경 프록시는 비활성화되며, 리다이렉트는 따라가지 않습니다.
- 이후 FlareSolverr가 대신 가져오는 페이지는 FlareSolverr가 자체적으로 확인하는 별도의 홉입니다. Heym은 이를 검사하지 않으므로, FlareSolverr 컨테이너가 연결할 수 있는 대상을 제한하는 것은 네트워크 정책의 몫입니다.
- 신뢰할 수 있는 자체 호스팅 배포에서는 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`로 메타데이터 규칙을 해제할 수 있습니다. 호스팅 또는 멀티테넌트 배포에서는 기본값을 유지하십시오.

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Playwright Node](./playwright-node.md) – 브라우저 자동화 대안
- [Credentials Tab](../tabs/credentials-tab.md) – FlareSolverr credential 추가
