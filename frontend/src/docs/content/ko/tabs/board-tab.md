# Board

**Board** 탭은 에이전트 기반 칸반 보드입니다. 작업은 컬럼을 통해 이동하며, 각 컬럼은 Heym Workflow를 실행할 수 있습니다. 카드는 단순한 작업이 아니라 컨텍스트, 대화 기록, 실행 상태, 출력, Workflow 실행을 함께 지니는 지속적인 에이전트 기반 작업입니다.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## 보드와 컬럼

- 필요한 만큼 보드를 생성할 수 있습니다. 새 보드는 기본 컬럼인 **Backlog → Planning → Development → Done**으로 시작합니다.
- 모든 보드에는 **Agentic Kanban Model**(credential과 모델)이 필요합니다. 이는 필수 사항입니다 — New board 대화상자는 이것 없이 보드를 생성하지 않으며, 이를 갖추지 못한 보드는 해당 작업이 비활성화된 상태로 유지됩니다 — 각 카드를 실행하는 Workflow의 입력으로 매핑하고 그 출력을 다시 읽을 수 있는 텍스트로 변환하는 것이 바로 이 모델이기 때문입니다.
- 보드 헤더의 톱니바퀴 아이콘을 클릭하면 보드 설정이 열립니다: 이름, 설명(헤더 아래에 표시됨), 그리고 Agentic Kanban Model입니다.
- 컬럼은 완전히 편집 가능합니다: 컬럼 설정에서 추가, 이름 변경, 색상 변경, 순서 변경, 삭제가 가능합니다(컬럼을 삭제하려면 먼저 비어 있어야 합니다).
- 카드는 우선순위에 따라 세로로 정렬됩니다 — 드래그하여 순서를 변경하십시오.
- [Chat 탭](./chat-tab.md)에서 자연어 요청으로 카드를 생성할 수도 있습니다. Chat은 필요할 때 보드를 선택하도록 요청하며, 항상 해당 보드의 첫 번째 컬럼에 카드를 추가합니다.

## 보드 공유

보드 설정에서는 **users**(이메일 기준) 및 **teams**와 보드를 공유할 수 있으며, `read` 또는 `write` 권한을 부여할 수 있습니다:

- **read** — 보드와 카드가 표시되지만 아무것도 변경할 수 없습니다: 새 카드, 이동, 댓글, 실행 모두 불가합니다.
- **write** — 보드를 완전히 사용할 수 있습니다: 카드, 이동, 댓글, 실행이 가능합니다.
- **owner**만이 톱니바퀴와 삭제 버튼을 볼 수 있으며, owner만이 보드 설정, Agentic Kanban Model, 공유 설정을 변경할 수 있습니다.

공유된 보드의 체인은 항상 **owner**의 credential과 Agentic Kanban Model로 실행되므로, 협업자는 자신의 credential을 준비할 필요가 없습니다.

## 카드 첨부 파일

카드를 열고 **Attach file**을 사용하여 파일을 추가하십시오 — 상자에 드롭하거나 버튼으로 선택할 수 있으며, 동일한 목록에서 제거할 수 있습니다. 첨부 파일은 [Drive](./drive-tab.md)에 저장됩니다.

모든 실행은 **Workflow가 시작되기 전에 첨부 파일을 유형별로 해석**합니다:

- **Documents**(pdf, markdown, csv, json, text)는 텍스트로 추출되며, 파일당 최대 20,000자로 제한되고 첨부 파일의 `text` 필드에 저장됩니다.
- **Images**는 비전 경로가 직접 로드하는 `url`로 전달됩니다(LLM 노드의 이미지 입력이 그대로 받아들입니다).
- **그 외의 모든 항목**은 단순 참조(`name`, `url`, `mime_type`)로 전달됩니다.

Workflow는 `$input.card.attachments`에서 이를 읽습니다(그리고 매퍼가 매핑한 것과 관계없이 항상 `$input.board.attachments`에서도 읽습니다). Agentic Kanban Model은 추출된 텍스트와 이미지 URL도 볼 수 있으므로, 첨부 파일을 Workflow가 기대하는 필드에 바로 매핑할 수 있습니다.

## 컬럼 Workflow 체인

각 컬럼에는 **순서가 지정된 Workflow 목록**(체인)을 구성할 수 있습니다. 카드가 체인이 있는 컬럼으로 이동하면:

1. 체인이 백그라운드에서 자동으로 시작됩니다 — 이동 자체는 결코 대기하지 않습니다.
2. Workflow는 **순차적으로** 실행됩니다. 각 Workflow의 출력은 다음 Workflow가 시작되기 전에 카드 컨텍스트에 추가됩니다.
3. Workflow가 실패하면 체인이 중단됩니다: 나머지 링크는 건너뛰고 카드는 **빨간색**으로 변합니다.
4. 모든 링크가 성공하면 카드는 **초록색**으로 변합니다. 체인이 실행되는 동안 카드는 **호박색**으로 깜박입니다. 사람의 검토를 위해 일시 중지된 실행은 정적인 호박색 상태를 표시합니다.

실행은 `board` Trigger 소스와 함께 [Execution History](../reference/execution-history.md)에 기록되며, 각 카드는 Workflow별 출력과 오류를 포함한 자체 실행 목록을 유지합니다. Workflow가 실행되는 동안 카드를 열고 실행 옆의 **Open live**를 선택하면 편집기를 해당 실행에 정확히 연결할 수 있습니다. 동일한 캔버스 애니메이션, 증분 Debug 로그, 최종 결과가 두 번째 실행을 시작하지 않고도 표시됩니다.

## Workflow가 수신하는 데이터

체인은 표준 Payload를 Workflow의 입력으로 전달합니다. `$input.card.title`과 같은 일반적인 [표현식](../reference/expression-dsl.md)으로 이를 읽을 수 있습니다:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — 카드의 모든 댓글로, 오래된 순서대로 정렬됩니다.
- `history` — 전체 활동 타임라인(댓글, 이동, 출력)으로, 최근 200개 항목으로 제한됩니다.
- `previous_outputs` — 이전에 완료된 실행(이전 컬럼 및 후속 라운드)의 출력입니다.
- `chain.previous_workflow_outputs` — *현재* 체인에서 앞선 링크들의 출력입니다.
- 후속 라운드에서는 `move`가 `null`이고 `rerun`이 `true`입니다.

## 기획 루프 (후속 라운드)

일반적인 패턴은 기획 Workflow를 **두 번째 컬럼**(기본 이름은 Planning이지만 이름은 중요하지 않으며 슬롯 위치가 중요합니다)에 배치하는 것입니다. 해당 Workflow는 카드를 보강하고 후속 질문을 합니다:

1. 카드를 두 번째 컬럼으로 이동합니다 — Workflow가 보강된 계획과 질문을 출력으로 카드에 다시 작성합니다.
2. 카드의 댓글 스레드에서 답변합니다. 답변이 카드를 해제합니다: 카드가 다음 컬럼으로 이동하고, 해당 컬럼이 답변을 컨텍스트에 포함하여 카드를 처리합니다. 두 번째 컬럼의 체인은 다시 실행되지 않습니다.
3. 대신 계획을 그 자리에서 개선하려면 **Run follow-up round**를 누르십시오. 동일한 체인이 누적된 모든 컨텍스트와 함께 다시 실행되고, 그런 다음 카드는 해당 컬럼에서 대기하며 댓글을 추가하여 해제할 때까지 기다립니다.

기획 게이트는 이름이 아닌 위치 기반입니다: 가장 왼쪽 컬럼과 바로 오른쪽 컬럼은 스스로 이동하지 않습니다 — 체인을 실행하고 그 자리에서 대기합니다(댓글이 두 번째 컬럼을 해제합니다). 세 번째 컬럼부터는 성공적인 체인이 카드를 자동으로 오른쪽으로 이동시키며, 마지막 컬럼까지 진행됩니다. 기본 "Planning" 레이블의 이름을 바꾸거나 제거해도 어떤 슬롯이 게이트인지는 변경되지 않습니다. 카드는 한 번에 하나의 활성 실행만 가질 수 있습니다.

## Human-in-the-Loop 및 Codex 질문

체인 Workflow가 일시 중지되는 경우 — [Human-in-the-Loop](../reference/human-in-the-loop.md) 노드에서, Agent의 HITL 도구에서, 또는 [Codex](../nodes/codex-node.md) 노드가 더 많은 정보를 필요로 하여 — 실행은 대기 상태로 유지되고 카드에 황색 대기 상태가 표시됩니다. 각 일시 중지는 자체적인 답변 화면을 유지합니다: HITL의 경우 HITL 검토 링크, Codex의 경우 Codex 후속 화면입니다.

답변을 하면 체인이 자동으로 재개됩니다: 일시 중지된 Workflow가 완료되고, 출력이 카드에 반영되며, 해당 컬럼 체인의 나머지가 실행되고, 카드가 평소처럼 이동합니다. 재개된 실행이 실패하면 카드가 빨간색으로 바뀌고 나머지 링크는 건너뜁니다.

## 관련 항목

- [Workflow](./workflows-tab.md)
- [실행 기록](../reference/execution-history.md)
- [표현식 DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
