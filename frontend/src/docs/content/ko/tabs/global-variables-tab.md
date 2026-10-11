# Variables 탭

**Variables** 탭은 모든 Workflow에서 공유되는 영구적인 키-값 데이터인 **Global Variable Store**를 관리합니다.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Variables 데모 시청</a></p>

## 개요

- 전역 변수를 생성, 편집, 삭제할 수 있습니다
- 변수는 사용자 범위로 관리되며 Workflow 실행 전반에 걸쳐 유지됩니다
- 표현식에서 `$global.variableName`을 통해 참조할 수 있습니다

## 변수 생성

1. **New Variable**을 클릭합니다
2. **이름**을 입력합니다 (표현식에서 사용됩니다)
3. **값**을 설정합니다 (문자열, 숫자, 불리언, 배열 또는 객체)
4. **값 유형**을 선택합니다 (Auto, String, Number, Boolean, Array, Object)

## 편집 및 삭제

- **편집** – 변수 행에서 편집 아이콘을 클릭합니다
- **삭제** – 휴지통 아이콘을 클릭합니다. 해당 변수를 사용하는 Workflow는 대체 변수가 필요합니다
- **일괄 삭제** – 여러 변수를 선택한 후 **Delete selected**를 사용합니다

## Workflow에서 사용하기

모든 표현식에서 변수를 참조할 수 있습니다:

```
$global.environment
$global.settings.baseUrl
```

[Variable 노드](../nodes/variable-node.md)에서 **Store in Global Variable Store**를 활성화하여 전역 변수를 설정할 수도 있습니다.

## 관련 항목

- [Global Variables](../reference/global-variables.md) – 참조 가이드
- [Variable 노드](../nodes/variable-node.md) – `isGlobal`로 변수 설정
- [Expression DSL](../reference/expression-dsl.md) – `$global` 문법
- [Chat 탭](./chat-tab.md) – Chat에서 전역 변수에 접근할 수 있습니다
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간략한 페이지 가이드
