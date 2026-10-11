# DataTable

**DataTable** 탭에서는 Heym 내에서 직접 구조화된 데이터 테이블을 생성하고 관리할 수 있습니다. 테이블은 [DataTable 노드](../nodes/datatable-node.md)를 통해 Workflow에서 프로그래밍 방식의 CRUD 작업에 사용할 수 있습니다.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ DataTable 데모 시청하기</a></p>

## 테이블 생성하기

1. 대시보드에서 DataTable 탭으로 이동합니다
2. **Create DataTable**을 클릭합니다
3. 이름과 선택적 설명을 입력합니다
4. 컬럼 편집기를 사용하여 컬럼을 추가합니다

## 컬럼

각 컬럼은 다음 속성을 가집니다:

| 속성 | 설명 |
|----------|-------------|
| Name | 컬럼 표시 이름 |
| Type | `string`, `number`, `boolean`, `date` 또는 `json` |
| Required | 새 행에 이 컬럼이 반드시 포함되어야 하는지 여부 |
| Unique | 값이 모든 행에서 고유해야 하는지 여부 |
| Default Value | 행에서 이 컬럼을 생략할 때 자동으로 채워지는 값 |

테이블 상세 보기 헤더에서 컬럼을 추가, 편집 또는 제거할 수 있습니다.

## AI로 컬럼 생성하기

컬럼을 수동으로 추가하는 대신, 자연어로 테이블을 설명하거나 샘플 JSON을 붙여넣으면 LLM이 스키마를 제안하도록 할 수 있습니다. 두 진입점 모두 동일한 대화 상자를 엽니다:

- **Generate with AI** (DataTable 목록 헤더) — 설명을 기반으로 완전히 새로운 테이블을 생성합니다.
- **AI columns** (테이블 상세 보기, 컬럼 컨트롤 옆) — 열려 있는 테이블에 추가할 *새* 컬럼을 제안합니다.

### 작동 방식

1. **LLM credential**과 **model**을 선택합니다 (기본값은 첫 번째 LLM credential과 해당 최신 모델입니다).
2. 설명을 입력합니다 — 예를 들어 *"제목, 저자, 페이지 수, 읽음 여부를 포함하는 책 테이블"* — 또는 JSON 샘플/스키마를 붙여넣습니다.
3. **Generate**를 클릭합니다. 모델이 제안된 스키마를 반환합니다.
4. 편집 가능한 양식에서 생성된 컬럼을 검토합니다: 각 컬럼의 **name**, **type**, **default**, **unique**, **notEmpty** (required)를 변경하거나, 원하지 않는 컬럼을 삭제하거나, **Add column**으로 수동 추가할 수 있습니다. 새 테이블의 경우 AI가 제안한 **name**과 **description**도 편집할 수 있습니다.
5. **Create Table** (새 테이블) 또는 **Add Columns** (기존 테이블)을 클릭하여 저장합니다. 언제든지 **Esc**를 눌러 대화 상자를 닫을 수 있습니다.

### 기존 테이블에 대한 추가 전용

기존 테이블에 컬럼을 생성할 때, 모델은 현재 컬럼을 컨텍스트로 확인하고 **새 컬럼만** 제안합니다. 기존 컬럼과 해당 데이터는 절대 수정되거나 제거되지 않으며 — 생성된 컬럼은 추가됩니다. 중복 이름(대소문자 구분 없음)은 자동으로 제거됩니다.

> LLM credential (OpenAI, Google 또는 Custom)이 필요합니다. 없는 경우 먼저 Settings에서 추가하십시오.

## 행 관리하기

- **행 추가**: 추가 버튼을 클릭하여 새 행을 생성합니다
- **인라인 편집**: 아무 셀이나 더블 클릭하여 값을 편집합니다. Enter를 누르거나 다른 곳을 클릭하여 저장하고, Escape로 취소합니다
- **행 삭제**: 행 작업 메뉴를 사용하여 행을 제거합니다
- **페이지네이션**: 행은 페이지당 25개씩 표시되며 페이지 탐색이 가능합니다

## CSV 가져오기/내보내기

### 가져오기
1. 테이블 상세 보기에서 **Import CSV**를 클릭합니다
2. 업로드할 CSV 파일을 선택합니다
3. 처음 5개 행과 컬럼 매핑을 미리 봅니다
4. 녹색 컬럼은 기존 테이블 컬럼과 매칭된 것이고, 노란색은 매칭되지 않은 것입니다
5. Import를 클릭하여 행을 대량 삽입합니다

### 내보내기
**Export CSV**를 클릭하여 모든 행을 CSV 파일로 다운로드합니다.

## 공유

다른 사용자 또는 팀과 테이블을 공유할 수 있습니다:

1. 테이블 상세 보기에서 공유 대화 상자를 엽니다
2. 이메일로 사용자를 추가하고 **read** 또는 **write** 권한을 부여합니다
3. 팀을 추가하고 **read** 또는 **write** 권한을 부여합니다
4. 읽기 전용 사용자는 데이터를 볼 수 있고, 쓰기 사용자는 행을 수정할 수 있습니다

## AI Assistant에서 테이블 생성하기

캔버스 [AI Assistant](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) 및 [MCP 탭](./mcp-tab.md)의 `heym_chat` 도구는 빌드하는 Workflow에 사용할 테이블 중 하나를 선택하거나 새 테이블을 생성할 수 있습니다. 이름과 컬럼을 제안하고, 질문 카드를 제출하면 테이블을 생성합니다. 기존 테이블의 컬럼을 변경하거나 행을 건드리지는 않습니다: 컬럼 추가 또는 편집은 여기에서 하십시오.

## Workflow에서 사용하기

[DataTable 노드](../nodes/datatable-node.md)는 테이블을 Workflow에 연결합니다. 작업에는 find, getAll, getById, insert, update, remove, upsert가 포함됩니다. credential은 필요하지 않습니다.

## LLM Cost Table (시스템 테이블)

사용자가 생성한 테이블 위에 고정된 **System tables** 섹션이 나타나며, 단일 항목인 **LLM Cost Table**이 표시됩니다. 이는 [Traces](./traces-tab.md) 비용 차트에서 사용되는 모델별 가격의 고정 스키마, 사용자별 편집 가능 뷰입니다.

### 데이터 출처

Heym은 Helicone의 공개 가격 Endpoint(`https://www.helicone.ai/api/llm-costs`)에서 시드된 모델별 가격의 전역 테이블을 유지합니다. 동기화는 테이블이나 Traces를 처음 열 때 백그라운드에서 실행되며, 24시간당 한 번의 fetch로 제한됩니다. **Refresh**를 누르면 즉시 재동기화를 강제 실행합니다. Helicone에서 업스트림 목록에서 제거된 항목은 로컬에서 삭제되지 않으므로, 과거 비용 조회가 안정적으로 유지됩니다.

### 스키마 (읽기 전용 컬럼)

| 컬럼 | 의미 |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (정보 제공용, Helicone에서 사용) |
| Model | `trace.model`과 매칭되는 모델 식별자 |
| Op | 매칭 연산자: `equals`, `startsWith` 또는 `includes` |
| Input $/1M | 100만 prompt Token당 USD |
| Output $/1M | 100만 completion Token당 USD |
| Source | `helicone`, `seed` 또는 `user` |

### 가격 사용자 정의

- **행을 편집**하여 해당 가격을 재정의할 수 있습니다. 재정의는 사용자별로 적용되며 `Customized` 배지로 표시됩니다. 이후 Helicone 동기화 시에도 이 재정의는 그대로 유지됩니다.
- **기본값으로 재설정**하면 재정의가 제거되고 해당 행의 전역 값이 복원됩니다.
- **사용자 정의 모델 추가**를 클릭하면 사용자 전용 행을 생성하는 대화 상자가 열립니다(예: Helicone에 등록되지 않은 비공개 파인튜닝 모델). 사용자 정의 행은 `User added`로 표시되며, 삭제하면 완전히 제거됩니다.

### Traces와의 매칭

Traces 대시보드에서 비용을 계산할 때 각 `trace.model`을 다음 순서로 매칭합니다:

1. 사용자의 재정의(모델 이름 정확히 일치)를 우선 적용합니다
2. 그렇지 않으면 전역 테이블을 사용합니다 — `equals` 정확히 일치가 `startsWith`/`includes`보다 우선하며, 동일 연산자 내에서 충돌이 발생하면 가장 긴 모델 접두사/부분 문자열이 일치하는 항목으로 결정됩니다

일치하는 행이 없으면 해당 모델은 Traces 페이지의 **Unpriced models** 알림에 나열되며, 사용자 정의 행을 추가하거나 기존 행을 재정의할 때까지 비용 기여도는 0입니다.

## 관련 항목

- [DataTable 노드](../nodes/datatable-node.md) - Workflow 노드 참조
- [Traces 탭](./traces-tab.md) - 비용 도넛 및 KPI 카드에 LLM Cost Table을 사용합니다
- [Grist 노드](../nodes/grist-node.md) - 외부 스프레드시트 대안
- [Variables 탭](./global-variables-tab.md) - 키-값 저장소 대안
