# 다운로드 및 가져오기

Workflow 또는 전체 폴더를 파일로 내보내거나 드래그 앤 드롭으로 가져올 수 있습니다. 백업, 공유 또는 인스턴스 간 Workflow 마이그레이션에 사용하십시오.

## Workflow 다운로드 (JSON)

**위치:** 에디터 툴바 → **Download** 버튼 (큰 화면에서 표시됨)

**내보내는 항목:**
- `nodes` – 캔버스의 모든 노드
- `edges` – 노드 간의 모든 연결

**파일명:** `{workflow-name}.json` (Workflow 이름에서 파생됨)

**형식:** JSON 스키마는 [Workflow Structure](./workflow-structure.md)를 참조하십시오.

## 폴더 다운로드 (ZIP)

**위치:** Dashboard → Workflows 탭 → 폴더 3점 메뉴 → **Download as ZIP**

**내보내는 항목:**
- 폴더 및 모든 하위 폴더의 모든 Workflow (재귀적)
- 폴더 계층 구조가 ZIP 내부의 디렉터리로 유지됨

**ZIP 구조:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

각 `.json` 파일은 `{ name, nodes, edges }`를 포함합니다.

## 가져오기

### Dashboard에서 (Workflows 탭)

1. [Workflows](../tabs/workflows-tab.md) 탭으로 이동하십시오
2. **JSON** 또는 **ZIP** 파일을 Workflow 영역으로 드래그하십시오

**JSON 파일:** 새 Workflow가 생성됩니다. Workflow 이름은 JSON의 `name` 필드에서 가져오며, `name`이 없으면 파일명에서 가져옵니다.

**ZIP 파일:** 전체 폴더 구조가 루트 레벨에 재생성됩니다. ZIP 내부의 각 `.json` 파일은 해당 폴더에 배치되는 Workflow가 됩니다. 현재 인스턴스에 존재하지 않는 Credential 및 교차 Workflow 참조는 자동으로 제거됩니다. 일부 Workflow 가져오기에 실패하면 성공한 개수를 요약하여 표시합니다.

### 캔버스에서 (에디터)

1. 에디터에서 Workflow를 여십시오
2. JSON 파일을 캔버스로 드래그하십시오
3. 캔버스에 이미 노드 또는 엣지가 있는 경우, 현재 Workflow를 교체할지 묻는 확인 대화상자가 표시됩니다
4. 가져온 노드와 엣지가 현재 Workflow를 교체하거나 병합합니다

## 파일 형식

### JSON (단일 Workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – 필수; 노드 객체의 배열
- `edges` – 선택; 엣지 객체의 배열 (기본값 `[]`)
- `name` – 선택; Dashboard 가져오기에서 새 Workflow를 생성할 때 사용됨

### ZIP (폴더)

디렉터리 구조가 폴더 계층 구조를 반영하는 ZIP 아카이브입니다. 각 파일은 Workflow JSON입니다 (위 참조). 폴더 및 Workflow 이름은 각각 디렉터리 및 파일 이름에서 파생됩니다.

노드 및 엣지 형식은 [Workflow Structure](./workflow-structure.md)를 참조하십시오.

## 사용 사례

- **백업** – 주요 변경 전에 Workflow 또는 전체 폴더를 다운로드하십시오
- **공유** – JSON 파일을 내보내어 팀원과 공유하십시오
- **마이그레이션** – Heym 인스턴스 간에 Workflow 또는 폴더 구조를 이동하십시오
- **버전 관리** – Workflow JSON을 코드와 함께 Git에 저장하십시오

## 관련 항목

- [Workflow Structure](./workflow-structure.md) – 노드 및 엣지의 JSON 형식
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow 생성 및 드래그 앤 드롭으로 가져오기
- [Workflow Organization](./workflow-organization.md) – 폴더 및 하위 폴더
- [Canvas Features](./canvas-features.md) – 캔버스 가져오기를 포함한 에디터 기능
