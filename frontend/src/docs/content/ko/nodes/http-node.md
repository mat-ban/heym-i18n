# HTTP

**HTTP** 노드는 cURL 구문을 사용하여 HTTP 요청을 수행합니다. Workflow의 시작점(들어오는 엣지 없음)이 될 수도 있고, 업스트림 노드로부터 입력을 받을 수도 있습니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 또는 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `curl` | string | cURL 명령어 (예: `curl -X GET https://api.example.com`) |

## 응답 형식

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## 응답 접근

- `$httpNode.status` – HTTP 상태 코드
- `$httpNode.body` – 응답 본문 (문자열 또는 파싱된 JSON)
- `$httpNode.body.fieldName` – JSON 필드 접근
- `$httpNode.headers` – 응답 헤더

## 예제

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

헤더에는 `-H`, POST 본문에는 `-d` 등을 사용하는 cURL 구문을 사용하십시오. 표현식은 URL, 헤더, 또는 전체 헤더 라인을 포함하여 curl 문자열 내 어디에서나 사용할 수 있습니다. [Header credential](../reference/credentials.md)은 `key: value`로 해석되므로, `-H "$credentials.MyApiKey"`는 완전한 헤더를 전송합니다:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

표현식 내부의 따옴표와 공백은 cURL 명령어가 아닌 표현식에 속하므로, 문자열 인수를 받는 메서드도 인라인으로 동작합니다:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Credential로 인증하기

`$credentials.Name`은 각 [credential](../reference/credentials.md) 타입마다 다른 값으로 해석되므로, 헤더 라인은 타입에 따라 달라집니다:

| Credential 타입 | `$credentials.Name`이 해석되는 값 | 헤더 |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | 원시 API 키 | `-H "Authorization: Bearer $credentials.Name"` |
| Google | 원시 API 키 | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | 원시 API 키 | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | 만료 시 갱신되는 새로운 OAuth 액세스 토큰 | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | 토큰 | `-H "Authorization: Bearer $credentials.Name"` |

Bearer credential은 이미 `Bearer ` 접두사를 포함하고 있으므로, 또 하나를 추가하면 `Bearer Bearer …`가 전송됩니다. Google Sheets 및 Google Drive credential을 사용하면 해당 노드가 다루지 않는 Google API(예: 스프레드시트에 탭 추가)를 credential에 부여된 스코프 내에서 호출할 수 있습니다. 이름이 단순 식별자가 아닌 경우(`-`를 포함하거나, 숫자로 시작하거나, 예약어인 경우)에는 대괄호 형식을 사용하십시오: `-H "Authorization: $credentials["my-api-key"]"`.

[AI Assistant](../reference/ai-assistant.md) 또는 [Chat](../tabs/chat-tab.md)이 인증이 필요한 HTTP 요청을 생성할 때 해당 서비스를 다루는 전용 노드가 없으면, 어떤 credential을 사용할지 묻습니다. 하나를 선택하고, API가 다른 헤더 이름을 기대하는 경우 미리 채워진 헤더 이름을 변경하면, 헤더 라인을 대신 작성해 줍니다. 어시스턴트는 credential의 이름과 타입만 보며, 값은 절대 보지 않습니다. 적합한 credential이 없다면, 생성할 것을 제안하는 질문이 표시됩니다. 전송된 `request.headers`와 같이 노드의 출력에 도달하는 비밀 값은 실행 결과에서 마스킹됩니다.

## 이그레스 안전성

- 기본적으로 URL은 `http://` 또는 `https://`를 사용해야 하며, 공용 주소로만 해석되어야 합니다. Loopback, private, link-local, multicast, cloud-metadata 목적지는 차단됩니다.
- Heym은 해석된 주소를 검증하고 DNS 리바인딩을 방지하기 위해 연결 대상을 고정합니다. 가드가 활성화된 동안 환경 프록시는 비활성화됩니다. 리다이렉트는 기본적으로 따라가지 않으며, 따라가려면 cURL의 `-L` 옵션을 추가하십시오. 활성화된 경우, 모든 리다이렉트 홉은 동일한 공용 주소 정책에 대해 검사되고 연결 전에 고정됩니다.
- 의도적으로 내부 서비스에 연결하는 신뢰할 수 있는 자체 호스팅 배포에서는 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`를 설정할 수 있습니다. 호스팅 또는 멀티 테넌트 배포에서는 기본값을 유지하십시오.

**v0.0.105 업그레이드 참고 사항:** 이 인스턴스 전역 정책은 이제 Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, 사용자 정의 LLM 실행 및 모델 검색, AI 어시스턴트, guardrails, RAG 임베딩에서 사용되는 credential 파생 목적지도 보호합니다. Loopback, private, link-local 주소를 가리키는 기존 credential은 신뢰할 수 있는 자체 호스팅 인스턴스에서 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`가 활성화되지 않는 한 거부됩니다. 가드가 켜져 있는 동안 가드된 HTTP 클라이언트는 `HTTP_PROXY` 및 `HTTPS_PROXY`를 무시하며, 옵트아웃을 활성화하면 이들이 복원됩니다. `SSL_CERT_FILE` 또는 `SSL_CERT_DIR`을 통해 구성된 운영자 CA 번들은 계속 지원됩니다. ClickHouse는 연결이 열리기 전에 검사되지만, clickhouse-connect가 자체 urllib3 전송을 사용하기 때문에 dial 시점에 고정되지는 않습니다.

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Triggers](../reference/triggers.md) – Workflow 진입점으로서의 HTTP
- [Credentials Tab](../tabs/credentials-tab.md) – 인증된 요청을 위한 API 키 추가
