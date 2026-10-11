# 전역 변수

**전역 변수 저장소(Global Variable Store)** 는 Workflow 실행 전반에 걸쳐 유지되는 사용자 범위의 영구적인 키-값 데이터를 보관합니다. 구성, 기능 플래그, 카운터 또는 여러 Workflow가 필요로 하는 공유 상태에 사용하십시오.

> **여기에 시크릿을 저장하지 마십시오.** 전역 변수는 시크릿 보관소가 아닙니다. 값은 암호화되지 않은 상태로 저장되며, 공유한 모든 사람에게 전체가 반환되고, 협업자가 편집할 수 있습니다. API 키, 비밀번호 및 Token은 저장 시 암호화되고 클라이언트에 시크릿을 절대 반환하지 않는 [Credentials](./credentials.md)에 속합니다.

## 로컬 vs 전역

| 저장소 | 구문 | 범위 | 지속성 |
|-------|--------|-------|-------------|
| **Workflow-로컬** | `$vars.variableName` | 현재 실행에만 해당 | 메모리 내, 실행 종료 시 소실 |
| **전역** | `$global.variableName` | 사용자의 모든 Workflow | 데이터베이스에 영구 저장 |

## 전역 변수 생성

1. **Variables 탭에서** – [Variables 탭](../tabs/global-variables-tab.md): 변수를 직접 생성, 편집 및 삭제합니다.
2. **Variable 노드에서** – 노드 속성에서 **Store in Global Variable Store** (`isGlobal: true`)를 활성화합니다. Workflow가 실행될 때 변수가 저장소에 기록됩니다.

## 표현식에서 사용

`$global.variableName`으로 전역 변수에 접근합니다:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Workflow-로컬 변수와 동일한 메서드를 사용하십시오 (예: 배열의 경우 `.upper()`, `.length`, `.add()`).

## 값 유형

지원되는 유형: `string`, `number`, `boolean`, `array`, `object`. 변수를 생성하거나 편집할 때 유형을 선택하십시오.

## 전역 변수 공유

전역 변수를 다른 사용자 또는 [Teams](./teams.md)와 공유하여 자신의 Workflow에서 사용할 수 있도록 할 수 있습니다.

- **사용자와 공유** – 소유한 변수 옆의 공유 아이콘을 클릭하고 수신자의 이메일을 입력한 후 **Share**를 클릭합니다. 수신자는 전역 변수 목록에서 **Shared** 배지와 "Shared by &lt;your email&gt;" 레이블이 있는 변수를 보게 됩니다.
- **팀과 공유** – 공유 대화 상자에서 팀을 선택하고 **Add**를 클릭합니다. 모든 팀 구성원이 접근 권한을 얻습니다.
- **편집 가능 접근** – 수신자는 공유 변수를 보고, 편집하고, Workflow에서 `$global.variableName`을 통해 참조할 수 있습니다. 소유자만 변수를 공유, 공유 해제 또는 삭제할 수 있습니다.
- **이름 충돌** – 수신자가 이미 동일한 이름의 변수를 가지고 있는 경우, 자신의 변수가 공유 변수보다 우선합니다.
- **공유 해제** – 변수의 공유 대화 상자를 열고 접근 권한을 제거하려는 사용자 옆의 **×** 버튼을 클릭합니다.

## Chat 통합

전역 변수는 [Chat](../tabs/chat-tab.md) 어시스턴트에서 사용할 수 있습니다. LLM은 질문에 답변하거나 콘텐츠를 생성할 때 이를 참조할 수 있습니다.

## 관련 항목

- [Variables 탭](../tabs/global-variables-tab.md) – UI에서 전역 변수 관리
- [Variable 노드](../nodes/variable-node.md) – `isGlobal`로 변수 설정
- [Expression DSL](./expression-dsl.md) – `$global` 구문
