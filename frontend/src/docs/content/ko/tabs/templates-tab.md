# Templates 탭

Templates 탭에서는 완전한 Workflow와 개별 노드를 저장하고, 탐색하고, 재사용할 수 있습니다. 한 번 만든 것을 공유하고 클릭 한 번으로 새 프로젝트에 적용하십시오.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Templates 데모 시청</a></p>

## 개요

템플릿에는 두 가지 종류가 있습니다:

- **Workflow 템플릿** — 완전한 Workflow(모든 노드와 연결)를 재사용 가능한 시작점으로 저장합니다.
- **노드 템플릿** — 단일 구성된 노드(예: 튜닝된 LLM 노드 또는 사용자 정의 HTTP 노드)를 저장하여 여러 Workflow에서 재사용합니다.

탭 상단의 **Workflows / Nodes** 토글을 사용하여 두 종류 간에 전환하십시오.

검색 바를 사용하여 이름, 설명, 태그 또는 노드 유형별로 표시되는 템플릿을 필터링하십시오.

---

## 템플릿 생성하기

### Workflow 템플릿

1. 에디터에서 공유하려는 Workflow를 엽니다.
2. 상단 툴바에서 **Share as Template**을 클릭합니다.
3. 이름, 설명, 선택적 태그를 입력합니다.
4. 공개 범위를 선택합니다: **Everyone**(모든 사용자) 또는 **Specific users**(사용자 이름 입력 및/또는 팀 선택).
5. **Share**를 클릭합니다. 녹색 알림이 성공을 확인합니다.

### 노드 템플릿

1. 캔버스에서 임의의 노드를 마우스 오른쪽 버튼으로 클릭합니다.
2. 컨텍스트 메뉴에서 **Share as Template**을 선택합니다.
3. 양식을 작성하고 **Share**를 클릭합니다.

---

## 템플릿 사용하기

### Workflow 템플릿

1. **Templates** 탭을 열고 **Workflows**가 선택되어 있는지 확인합니다.
2. 카드를 클릭하여 미리 보거나 **Use**를 직접 클릭합니다.
3. Workflow가 에디터에서 열리는 새 Workflow로 복제됩니다.

### 노드 템플릿

1. **Templates** 탭을 열고 **Nodes**를 선택합니다.
2. 노드 템플릿 카드에서 **Use**를 클릭합니다.
3. 대화 상자가 나타납니다 — 노드를 추가할 위치를 선택하십시오:
   - **New workflow** — 이 노드만 포함하는 새 Workflow를 생성합니다.
   - **Existing workflow** — Workflow 목록에서 선택합니다. 에디터가 열릴 때 노드가 자동으로 삽입됩니다.

---

## 미리보기

임의의 템플릿 카드를 클릭하여 전체 미리보기를 엽니다:

- **카드 썸네일** — 템플릿 카드는 Workflow와 단일 노드 템플릿 모두에 대해 맞춰진 읽기 전용 캔버스 스냅샷을 렌더링합니다.
- **Workflow 템플릿** — 팬 및 줌을 포함하여 편집 기록 미리보기 스타일과 일치하는 읽기 전용 캔버스입니다.
- **노드 템플릿** — 저장된 노드가 단일 노드 미리보기로 동일한 읽기 전용 캔버스에서 열립니다.
- **노드 세부 정보** — 미리보기에서 임의의 노드를 클릭하여 측면 패널에서 저장된 구성을 검사합니다.
- 태그, 사용 횟수 및 **소유자**가 모든 템플릿에 대해 표시됩니다.

**ESC**를 누르거나 외부를 클릭하여 미리보기를 닫으십시오.

---

## 템플릿 관리하기

- **편집** – 템플릿 소유자인 경우 카드에 마우스를 올리고 연필 아이콘을 클릭하여 이름, 설명, 태그 또는 공개 범위를 업데이트합니다
- **삭제** – 템플릿 소유자인 경우 카드에 마우스를 올리고 확인 Prompt 후 템플릿을 삭제합니다
- **소유자 전용 작업** – 편집 및 삭제 컨트롤은 본인이 생성한 템플릿에만 표시됩니다

---

## 명령 팔레트 (CTRL+K)

템플릿(Workflow 및 노드 모두)은 **CTRL+K** 명령 팔레트에서 검색할 수 있습니다. 템플릿을 선택하여 즉시 사용하십시오 — Workflow 템플릿은 에디터에서 열리고, 노드 템플릿은 대상을 묻는 메시지를 표시합니다.

---

## Chat에서의 템플릿

AI에게 템플릿에 관한 질문을 할 수 있습니다 — AI는 워크스페이스의 모든 템플릿을 알고 있습니다.

---

## 공개 범위

| 설정 | 볼 수 있는 사람 |
|---|---|
| Everyone | 플랫폼의 모든 사용자 |
| Specific users | 이름으로 나열한 사용자 및/또는 선택한 팀 — 모든 팀 구성원이 접근 권한을 얻습니다 |

**Specific users**와 공유할 때 개별 사용자(이름 기준)와 팀을 모두 추가할 수 있습니다. 팀 구성원은 Templates 탭에서 템플릿을 보고 사용할 수 있습니다.

---

## 관련 항목

- [Teams](../reference/teams.md) – 팀과 템플릿 공유
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 탭에 대한 간단한 페이지 가이드
