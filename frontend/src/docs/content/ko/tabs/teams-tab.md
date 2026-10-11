# Teams 탭

**Teams** 탭에서는 사용자 그룹과 Workflow, 자격 증명, 변수, 벡터 스토어, Drive 파일을 공유하기 위한 팀을 생성하고 관리할 수 있습니다.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Teams 데모 시청하기</a></p>

## 팀 생성하기

1. **New Team**을 클릭합니다
2. 이름과 선택적 설명을 입력합니다
3. **Create**를 클릭합니다

자동으로 팀 생성자이자 첫 번째 멤버가 됩니다.

## 멤버 관리하기

- **멤버 추가** – 팀 상세 대화상자에서 사용자 이메일을 입력하고 **Add**를 클릭합니다
- **멤버 제거** – 멤버 옆의 X를 클릭합니다 (생성자는 제거할 수 없습니다)
- **팀 편집** – 생성자는 이름과 설명을 편집할 수 있습니다
- **팀 삭제** – 생성자는 팀을 삭제할 수 있으며, 모든 팀 공유가 제거됩니다
- **공유 리소스** – 팀 상세 대화상자에는 팀과 공유된 Workflow, 자격 증명, 변수, 벡터 스토어, Drive 파일, Workflow 템플릿, 노드 템플릿이 표시됩니다. Workflow를 클릭하면 편집기에서 열리며, 다른 리소스는 해당 탭으로 전환하십시오.

## 팀과 공유하기

다음 위치에서 팀과 리소스를 공유할 수 있습니다:

- **Workflows** – Workflow 편집기의 공유 대화상자
- **Workflow Templates** – Workflow 템플릿 생성/편집 시 공유 대화상자 (공개 범위: Specific users)
- **Node Templates** – 노드 템플릿 생성/편집 시 공유 대화상자 (공개 범위: Specific users)
- **Credentials** – Credentials 탭의 공유 대화상자
- **Variables** – Variables 탭의 공유 대화상자
- **Vector Stores** – Vectors 탭의 공유 대화상자
- **Dashboards** – Dashboard 탭의 대시보드 설정 (읽기 또는 쓰기)
- **Drive Files** – Drive 탭의 공유 대화상자 또는 Drive 노드의 `shareWithMyTeams` / `unshareWithMyTeams` 작업

팀과 공유하면 모든 팀 멤버가 접근 권한을 얻게 됩니다. 자세한 내용은 [Teams](../reference/teams.md)를 참조하십시오.

Workflow를 팀과 공유할 때는 해당 Workflow가 의존하는 자격 증명과 하위 Workflow도 동일한 팀과 공유하십시오. Workflow 접근 권한만으로는 자격 증명이나 하위 Workflow 접근 권한이 부여되지 않습니다.

## Chat 통합

[Chat 탭](./chat-tab.md) AI 어시스턴트는 소속된 팀을 나열할 수 있습니다. "my teams"를 질문하면 소속된 팀을 확인할 수 있습니다.

## 관련 항목

- [Teams](../reference/teams.md) – Teams 레퍼런스 및 공유 모델
- [Credentials Sharing](../reference/credentials-sharing.md) – 사용자 및 팀과 자격 증명 공유하기
- [Workflow Organization](../reference/workflow-organization.md) – 폴더 및 공유
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간략한 페이지 가이드
