# 차트 출력

**Chart Output** 노드는 [dashboard widget](../tabs/dashboard-tab.md) Workflow의 종단 노드입니다. 상위 노드에서 생성된 행(row)을 받아 대시보드가 렌더링하는 표준화된 차트 Payload로 변환합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 0 (종단) |
| Output | 표준화된 차트 Payload |

이 노드는 dashboard-widget Workflow에서 **마지막**에 배치하십시오. 바로 앞 노드는 다음과 같이 행 객체의 배열을 생성해야 합니다.

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

예제/샘플 데이터만 있고 실제 소스가 없는 경우, **Set** 노드에서 `$array(dict(...), dict(...))`를 사용하여 이 행들을 생성하십시오. 예를 들어 `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`와 같습니다. `${...}` 또는 순수 `{...}` 객체 리터럴은 사용하지 **마십시오**. Heym은 `dict(key=value)`로만 객체를 생성합니다.

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text`, 또는 `hitl` |
| `orientation` | string | `vertical` 또는 `horizontal` (bar 차트 전용) |
| `dataPath` | string | 상위 출력 내부의 행 배열에 대한 점 표기법 경로 (예: `data` 또는 `result.items`). 비워 두면 자동 감지합니다. |
| `labelField` | string | 카테고리 레이블로 사용되는 행 키 (pie/bar/line) |
| `valueField` | string | 숫자 값으로 사용되는 행 키 (pie/bar/line/numeric/gauge) |
| `series` | array | bar/line용 선택적 다중 시리즈 정의 `[{ "name": "Sent", "field": "sent" }]` (`valueField`를 재정의함) |
| `columns` | array | `table`용 선택적 열 목록 (기본값은 첫 번째 행의 키) |
| `statusColumn` | string | 색상이 지정된 [상태 칩](#status-chips)으로 렌더링되는 선택적 `table` 열입니다. 표시된 열 중 하나여야 합니다. |. `linkColumn`을 사용하면 링크 열과 버튼 텍스트도 함께 포함됩니다.
| `statusTones` | object | 기본값으로 처리되지 않는 값에 대해 상태 값을 톤(`success`, `attention`, `failure`, `waiting`, `neutral`)에 매핑하는 선택적 객체 |
| `linkColumn` | string | 셀에 URL이 들어 있는 선택적 `table` 열로, 새 탭에서 여는 [링크 버튼](#link-buttons)으로 표시됩니다. 표시되는 열 중 하나여야 합니다. |
| `linkLabel` | string | 링크 버튼의 선택적 텍스트입니다. 비워 두면 버튼에 링크 아이콘만 표시됩니다. |
| `xField` / `yField` | string | X 및 Y 숫자 축에 대한 행 키 (scatter) |
| `min` / `max` | number | `gauge`의 숫자 범위 (기본값 `0` / `100`) |
| `unit` | string | `numeric` 또는 `gauge` 값 옆에 표시되는 선택적 단위 |
| `text` | string | `text` 차트 타입용 Markdown 메시지. 비워 두고 `valueField`를 설정하면 상위 데이터에서 가져온 동적 메시지를 렌더링합니다. |
| `title` | string | 선택적 차트 제목 |
| `hitlWorkflowId` | string | `hitl` 전용입니다. 이 Workflow의 리뷰만 표시합니다. 비워 두면 위젯이 모든 리뷰를 표시합니다. |
| `hitlNodeId` | string | `hitl` 전용입니다. `hitlWorkflowId`를 하나의 단계로 좁힙니다. 사람 리뷰가 있는 Agent 또는 Slack 승인, 버튼, 양식 단계입니다. |

## 차트 타입

- **bar / line / area / pie** — `labelField` + `valueField` (또는 다중 시리즈 bar/line/area의 경우 `series`)로 구동되는 카테고리형 차트입니다. `area`는 채워진 추세 차트입니다.
- **table** — `columns`를 사용하여 스크롤 가능한 테이블로 렌더링되는 원시 행입니다. 하나의 열을 [상태 칩](#status-chips)으로 렌더링할 수 있으며, 행을 클릭해 [상세 페이지](../tabs/dashboard-tab.md#detail-pages)를 열 수 있습니다.
- **numeric** — 첫 번째 행에서 가져온 단일 KPI 값이며, 선택적 `unit`을 포함합니다.
- **gauge** — `min`–`max` 범위에 대해 표시되는 단일 값입니다 (예: 백분율). `valueField`를 사용합니다.
- **scatter** — 상관관계 플롯을 위한 `xField` 및 `yField`의 X/Y 포인트입니다.
- **proportion** — 백분율 범례와 함께 지분으로 분할된 단일 수평 막대입니다 (예: 언어별 분포). `labelField` + `valueField`를 사용합니다.
- **barGauge** — 빨강→초록 그라디언트와 값을 가진 행당 하나의 수평 게이지입니다 (예: 여유 디스크 공간). `labelField` + `valueField`를 사용하며, 선택적 `unit` 및 `max` (기본값은 가장 큰 행 값)를 지원합니다.
- **text** — Markdown 메시지입니다 (예: "Last execution at 19:47"과 같은 상태 메모). 정적 메시지의 경우 `text`에 Markdown을 넣거나, `text`를 비워 두고 `valueField`를 설정하여 상위에서 생성된 문자열을 렌더링합니다. 제목, 굵게/기울임, [목록](../nodes/chart-output-node.md#interactive-task-lists), 링크, 인라인 코드를 지원합니다.
- **hitl** — 대기 중인 사람의 리뷰를 보여주는 캐러셀입니다. 헤더에는 `1/n pending`이 표시되며, 첫 번째 카드에서는 왼쪽 화살표가, 마지막 카드에서는 오른쪽 화살표가 비활성화됩니다. Workflow 이름을 클릭하면 캔버스에서 해당 실행이 열립니다. **Approve**, **Request changes**, **Reject**로 리뷰를 처리할 수 있으며, 위젯 제목 옆의 기록 아이콘을 클릭하면 같은 페이지의 기록 대화상자에서 해당 실행이 열립니다. 이 차트 타입은 상위 행을 무시하므로, 위젯 Workflow는 Chart Output 노드만으로 구성됩니다. 로그인한 각 사용자는 자신이 소유한 Workflow의 리뷰를 봅니다. 노드 속성 또는 위젯 설정에서 **Workflow**(리뷰 단계가 여러 개이면 **Select agent**도)를 선택하면, 대신 해당 Workflow의 리뷰가 그 Workflow를 열 수 있는 모든 사용자에게 표시됩니다. [HITL 위젯](../tabs/dashboard-tab.md#hitl-widgets)을 참조하세요.

### 대화형 작업 목록

정적 `text` 필드에서 GitHub-flavored markdown 작업 목록 구문을 사용하십시오.

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

[Dashboard](../tabs/dashboard-tab.md)에서 체크박스는 클릭 가능한 컨트롤로 렌더링됩니다 (다크 및 라이트 모드 모두 지원). 체크박스를 토글하면 위젯 Workflow의 `text` 필드가 업데이트되며 새로고침 후에도 유지됩니다.

**인라인 편집:** 작업 항목의 레이블을 더블클릭하면 해당 위치에서 편집할 수 있습니다. Enter를 누르거나 다른 곳을 클릭하면 저장되고, Escape를 누르면 취소됩니다. 레이블을 완전히 지우면 목록에서 해당 항목이 제거됩니다.

**작업 항목 내 링크:** 레이블에 markdown 링크(`[title](url)`)가 포함된 경우, 링크를 클릭하면 체크박스를 토글하지 않고 URL이 열립니다. 행의 다른 곳을 클릭하면 토글됩니다.

**정적 텍스트 전용:** 대화형 기능을 사용하려면 GFM 작업 목록 구문(`- [ ]` / `- [x]`)이 필요합니다. 작업 항목이 없는 일반 동적 상태 메시지는 읽기 전용으로 유지됩니다. Markdown이 `valueField`에서 오는 경우, 첫 번째 토글 시 해당 내용이 정적 `text` 필드로 복사되어 변경 사항이 유지됩니다.
### 번호 매기기 목록

텍스트 위젯은 **명시적 줄 번호가 보존된** 상태로 markdown을 렌더링합니다. 표시하려는 번호를 각 줄 앞에 붙이십시오(예: `9.`, `8.`, `7.`). Heym은 줄 번호를 자동으로 다시 매기지 않습니다.

**왜 명시적 번호를 사용해야 합니까?** 표준 markdown 순서 목록(`1.`, `2.`, `3.`)은 HTML `<ol>` 목록으로 변환되며, 이는 첫 번째 번호부터 **오름차순**으로만 카운트합니다. `9.` / `8.` / `7.`로 작성된 목록은 일반적인 markdown 렌더러에서 `9`, `10`, `11`로 표시됩니다. 각 줄 앞에 의도한 번호를 붙이면 이러한 문제를 피할 수 있습니다.

**내림차순 목록(예: 최신순):** Workflow Loop에서 markdown을 생성하고 항목별로 표시 번호를 계산하십시오:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

일반적인 패턴:

1. 항목 배열을 가져오거나 생성합니다(예: HTTP → `body.videos`).
2. 배열에 대해 [Loop](./loop-node.md)를 실행하고, body 내부에서 [Variable](./variable-node.md)과 `.add()`를 사용하여 반복마다 번호가 매겨진 줄을 하나씩 추가합니다.
3. Loop의 **done** 분기 이후, 누적된 배열에 `join("\n")`을 적용하여(또는 동등한 방법으로) 단일 markdown 문자열로 [Set](./set-node.md)합니다.
4. **Chart Output**의 `valueField`를 해당 문자열로 지정합니다(또는 정적 `text`를 설정합니다).

Loop 내부의 예시 줄 표현식(레이블 `processVideos`, `title`과 `id`를 가진 항목):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

결과 markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

1부터 시작하는 단순 오름차순 목록의 경우, 각 줄 앞에 번호를 붙이거나(`1.`, `2.`, `3.`) `$loop.index + 1`을 사용하는 Loop를 사용하십시오. 번호가 필요하지 않은 경우 [글머리 기호 목록](#interactive-task-lists)(`- item`)을 사용하십시오.

## 상태 칩

`table`은 한 열을 색상이 있는 칩으로 표시할 수 있습니다. 노드 속성의 **Status column**(또는 DSL의 `statusColumn`)을 열 이름으로 설정하십시오. 각 값은 다섯 가지 톤 중 하나를 받으며, 자주 쓰이는 단어는 별도 설정 없이 자동으로 매핑됩니다:

| 톤 | 기본 단어 |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | 그 외 모든 값 |

일치 여부는 대소문자, `_`, `-`를 구분하지 않으므로 `IN_PROGRESS`와 `in-progress`는 모두 `waiting`이 됩니다. 다른 값에 대해서는 **Status tones**를 추가하십시오. 추가된 항목은 해당 값의 기본값을 재정의합니다:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

서버가 각 값을 해당 톤으로 해석하므로 Heym과 Heym Work에서 동일한 색상이 표시됩니다.

## 상세 페이지: `$page.record`

`?record=<value>`로 열린 대시보드는 해당 값을 `$page.record`로 하여 모든 위젯 Workflow를 실행합니다. 테이블 행 링크는 이러한 페이지를 엽니다([상세 페이지](../tabs/dashboard-tab.md#detail-pages) 참조). 레코드 없이 열린 대시보드와 표현식 대화상자에서 `$page.record`는 `null`입니다. `page`라는 레이블이 지정된 노드가 이보다 우선합니다.

예를 들어 [HTTP](./http-node.md) 노드에서 페이지가 다루는 단일 레코드를 가져오는 데 사용합니다:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record`는 필드를 가진 객체가 아니라 클릭된 행의 값 자체(예: `V-1002`)입니다. [DataTable](./datatable-node.md)에서 해당 레코드를 찾으려면 레코드 열을 해당 값으로 필터링하십시오(`{"vendor_id": "$page.record"}` 필터를 사용한 `find` 작업). `$page.record.id`와 같은 경로는 아무 값으로도 해석되지 않으므로, AI가 생성하거나 미세 조정한 위젯은 그러한 하위 필드를 제거하고 대신 `$page.record`를 읽습니다.

이 값은 누구나 수정할 수 있는 URL에서 전달됩니다. 대시보드는 지정된 레코드 형식(기본적으로 문자, 숫자, `-`, `_`, `.`)에 맞는 값만 허용하지만, 그럼에도 신뢰할 수 없는 입력으로 취급해야 합니다. HTTP 쿼리 매개변수나 [DataTable](./datatable-node.md) 또는 ClickHouse 필터 값처럼 노드가 값을 이스케이프 처리하는 위치에 전달하고, 문자열 연결로 쿼리 텍스트를 직접 조합하지 마십시오. 누가 페이지를 열든 위젯은 항상 대시보드 소유자 권한으로 실행됩니다.

## 데이터가 해석되는 방식

1. `dataPath`가 설정된 경우, 노드는 해당 점 경로를 따라 상위 출력으로 진입합니다.
2. 그렇지 않으면 배열을 찾습니다: 최상위 목록, `data` 배열, 또는 첫 번째 목록 값 필드입니다.
3. [Data Table](./datatable-node.md) 노드에서 직접 전달된 행(`{id, data, created_at}`)은 해당 열들이 `id` 옆의 최상위 수준에서 읽히므로, `labelField`, `valueField`, `columns`는 테이블 자체의 열 이름을 그대로 가리킵니다.
4. `table`의 경우, 각 행은 `columns`(또는 첫 번째 행의 키)를 사용하여 테이블 행이 됩니다. `statusColumn`이 설정된 경우, Payload는 해당 열에 있는 각 값의 톤도 함께 전달합니다.
5. `numeric`과 `gauge`의 경우, 값은 첫 번째 행의 `valueField`에서 가져옵니다(또는 첫 번째 숫자 필드).
6. `scatter`의 경우, 각 행은 `[xField, yField]` 포인트가 됩니다.
7. `text`의 경우, 메시지는 설정된 경우 첫 번째 행의 `valueField`에서 가져오고, 그렇지 않으면 정적 `text` config에서 가져옵니다(그것도 없으면 첫 번째 행의 첫 번째 문자열 필드).

## 예시

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge(단일 값 대 범위):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter(X/Y 포인트):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion(비율로 분할된 단일 막대 + 백분율 범례):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area(채워진 다중 시리즈 추세):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge(값이 있는 행별 그라데이션 게이지):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text(정적 markdown 메시지 — 상위 행이 필요하지 않음):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text(동적 — 메시지 문자열이 상위에서 생성되어 `valueField`를 통해 가져옴):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## AI 프롬프트 예시

**AI**로 위젯을 생성할 때, 다음과 같은 프롬프트가 각 유형에 명확하게 대응됩니다:

- **Bar** — "지난 6개월간의 월별 매출을 예시 데이터를 사용하여 세로 막대 차트로 표시해 주세요."
- **Line** — "지난 14일간의 일일 활성 사용자를 꺾은선 차트로 그려 주세요."
- **Area** — "지난 24시간 동안의 메모리 및 CPU 사용량을 두 개의 시리즈로 된 영역 차트로 표시해 주세요. 예시 데이터를 사용하세요."
- **Pie** — "실행 상태(성공, 오류, 취소됨)를 원형 차트로 분석해 주세요."
- **Table** — "실행 횟수 기준 상위 10개 Workflow를 name 및 runs 열이 있는 스크롤 가능한 테이블로 표시해 주세요. 예시 데이터를 사용하세요."
- **Numeric** — "오늘의 총 Workflow 실행 횟수를 단위 'runs'의 단일 KPI로 표시해 주세요. 예시 데이터를 사용하세요."
- **Gauge** — "현재 CPU 사용량을 0에서 100퍼센트까지의 게이지로 표시해 주세요."
- **Scatter** — "요청 지연 시간 대비 Payload 크기를 예시 데이터를 사용하여 산점도로 그려 주세요."
- **Proportion** — "가장 많이 사용한 언어를 비율 막대로 표시해 주세요: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. 예시 데이터를 사용하세요."
- **Bar gauge** — "볼륨별(sda1~sda7) 여유 디스크 공간을 GB 단위의 막대 게이지로 표시해 주세요. 예시 데이터를 사용하세요."
- **Text** — "markdown 체크리스트(체크된 항목 하나, 체크되지 않은 항목 둘)가 있는 텍스트 위젯을 추가하거나, 최신 튜토리얼 동영상 5개를 내림차순(5.부터 1.까지)으로 YouTube 링크와 함께 나열해 주세요 — 각 줄 앞에 명시적인 번호를 붙이세요(`5. Title`, `4. Title`, …)."

## 관련 항목

- [Dashboard 탭](../tabs/dashboard-tab.md) — 위젯 구성 및 배치
- [Output 노드](output-node.md) — 일반 Workflow용 터미널 노드


## 링크 버튼

`table`은 한 열을 링크를 여는 버튼으로 바꿀 수 있습니다. 노드 속성에서 **Link column**(DSL에서는 `linkColumn`)을 셀에 URL이 들어 있는 열로 설정하고, 필요하면 **Link button text**(`linkLabel`)도 설정하세요. 각 셀은 해당 URL을 새 탭에서 여는 버튼이 됩니다. 버튼 텍스트가 없으면 버튼에는 링크 아이콘만 표시됩니다.

| 셀 값 | 여는 대상 |
| --- | ----- |
| `https://jira.example.com/browse/T-1` | 다른 사이트(새 탭) |
| `/dashboards` | Heym 내부 페이지(새 탭) |

`http://` 및 `https://` 주소와 단일 `/`로 시작하는 경로만 버튼이 됩니다. `javascript:`나 `//host` 같은 다른 값은 일반 텍스트로 유지되며, 빈 셀에는 아무것도 표시되지 않습니다.

이 버튼은 [행 링크](../tabs/dashboard-tab.md#detail-pages)와 함께 사용할 수 있습니다. 버튼을 클릭하면 해당 링크가 새 탭에서 열리고, 행의 다른 곳을 클릭하면 기존처럼 상세 페이지가 열립니다.
