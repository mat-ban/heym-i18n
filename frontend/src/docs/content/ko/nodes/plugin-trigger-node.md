# Plugin Trigger

**Plugin Trigger** 노드는 [Plugin 노드](./plugin-node.md)의 트리거 스타일 대응 노드입니다. `kind`가 `trigger`인 설치된 플러그인에 의해 제공되며, Workflow가 시작되는 초기 데이터를 생성합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.<keys returned by the plugin>` |

트리거 플러그인은 플러그인의 핸들러가 Workflow가 시작해야 할 데이터를 반환하는 한, 다른 애플리케이션, 서드파티 서비스 또는 다른 기술 등 어떤 소스든 나타낼 수 있습니다.

## 사용 시점

설치된 플러그인이 Workflow를 시작하는 Trigger를 정의할 때 Plugin Trigger 노드를 사용하십시오. Workflow 중간에 작업을 수행하는 플러그인의 경우에는 대신 [Plugin 노드](./plugin-node.md)를 사용하십시오.

## 구성

Plugin 노드와 마찬가지로, 구성 양식은 플러그인의 manifest 필드에서 생성됩니다. 비밀 정보가 아닌 문자열 필드는 표현식 입력을 사용하며, 비밀 필드는 마스킹됩니다.

## 플러그인 실행 방식

플러그인 코드는 신뢰할 수 있는 코드(Heym 제공, 운영자 설치)이며 프로세스 내에서 실행됩니다. 설치는 `HEYM_PLUGIN_ADMIN_EMAILS`로 제한되며, 하위 시스템은 `HEYM_PLUGINS_ENABLED`로 게이트됩니다. [실행 및 배포](../getting-started/running-and-deployment.md)를 참조하십시오.

## 플러그인 작성

트리거 플러그인 패키지를 빌드하려면 zip 레이아웃, manifest 필드, 핸들러 시그니처, 아이콘, 의존성 및 런타임 신뢰 모델에 대해 [플러그인 작성](../reference/plugin-authoring.md)을 참조하십시오.
