# 팀

Teams를 사용하면 Workflow, Credential, 전역 변수, Vector Store, Drive 파일을 한 번에 여러 사용자 그룹과 공유할 수 있습니다.

## 개요

- **Team** – 생성자와 멤버로 구성된 이름이 지정된 그룹
- **생성자(Creator)** – 항상 멤버이며, Team 편집, Team 삭제, 멤버 추가 가능
- **멤버(Member)** – 다른 멤버(생성자 제외)를 추가 및 제거할 수 있으며, Team에 공유된 리소스에 접근 가능

## Team 생성 및 관리

[Teams 탭](../tabs/teams-tab.md)에서 Team을 생성합니다. 이메일로 멤버를 추가하며, 해당 사용자는 계정을 보유해야 합니다. 생성자는 제거할 수 없습니다. Team을 삭제하면 모든 Team 공유가 제거됩니다.

## 공유 모델

리소스는 다음 대상과 공유할 수 있습니다:

1. **개별 사용자** – 이메일 기준 (사용자 간 공유)
2. **Teams** – Team 선택 기준 (Team 공유)

두 모델은 모두 누적 적용됩니다. 사용자는 다음 중 하나에 해당하면 접근 권한을 얻습니다:

- 직접 공유된 경우 (사용자 공유), 또는
- Team 공유가 설정된 Team의 멤버인 경우

## Teams와 공유할 수 있는 항목

| 리소스 | 공유 위치 |
|----------|----------------|
| Workflows | Workflow 편집기의 공유 대화 상자 |
| Workflow Templates | Workflow Template 생성/편집 시 공유 대화 상자 |
| Node Templates | Node Template 생성/편집 시 공유 대화 상자 |
| Credentials | Credentials 탭의 공유 대화 상자 |
| Global Variables | Variables 탭의 공유 대화 상자 |
| Vector Stores | Vectors 탭의 공유 대화 상자 |
| Drive Files | Drive 탭의 공유 대화 상자 또는 Drive 노드의 `shareWithMyTeams` / `unshareWithMyTeams` 작업 |

Template의 경우, 가시성이 **Specific users**로 설정된 경우 Teams도 선택할 수 있습니다. 선택된 Team의 모든 멤버가 해당 Template에 접근 권한을 얻습니다.
Drive 파일의 Team 공유는 Team 멤버에게 읽기 전용이며, 파일 소유자가 관리 권한을 유지합니다.

## API Endpoints

- `GET /api/teams` – 사용자가 속한 Team 목록 조회
- `GET /api/teams/{id}` – 멤버를 포함한 Team 상세 정보 조회
- `GET /api/teams/{id}/shared-entities` – Team에 공유된 엔터티(Workflow, Credential, 전역 변수, Vector Store, 파일, Workflow Template, Node Template) 반환
- `POST /api/teams` – Team 생성
- `PATCH /api/teams/{id}` – Team 업데이트
- `DELETE /api/teams/{id}` – Team 삭제 (생성자만 가능)
- `POST /api/teams/{id}/members` – 멤버 추가 (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – 멤버 제거

리소스별 Team 공유:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST body는 `permission`(`read` 또는 `write`, 기본값 `write`)을 허용하며, 기존 Team을 다시 POST하면 해당 권한이 업데이트됩니다
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## 관련 문서

- [Teams 탭](../tabs/teams-tab.md) – Team 생성 및 관리
- [Templates 탭](../tabs/templates-tab.md) – Workflow 및 Node Template을 Teams와 공유
- [Credentials 공유](./credentials-sharing.md) – Credential을 사용자 및 Teams와 공유
- [Workflow 구성](./workflow-organization.md) – 폴더 및 Workflow 공유
