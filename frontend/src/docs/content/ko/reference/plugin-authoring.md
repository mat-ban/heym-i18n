# Plugin 개발

Heym 플러그인은 운영자가 설치하는 신뢰할 수 있는 zip 패키지입니다. 하나의 패키지는 코어 앱을 변경하지 않고도 하나 이상의 사용자 정의 액션 또는 트리거 노드를 추가할 수 있습니다.

## 패키지 레이아웃

플러그인 zip은 패키지 루트에 `plugin.json`을 포함해야 하며, `entry`로 지정된 Python 엔트리 파일(기본값은 `handler.py`)도 포함해야 합니다.

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md`는 선택 사항이며 플러그인의 문서 페이지로 제공됩니다. 기본 노드 아이콘을 사용하려면 패키지 루트에 `icon.svg`를 두거나, `plugin.json`에서 노드별 `icon` 경로를 설정하십시오.

## 매니페스트

하나의 패키지가 여러 노드를 노출하는 경우 다중 노드 `plugin.json`을 사용하십시오:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

레거시 단일 노드 매니페스트도 허용됩니다: `nodes`를 생략하고 최상위 수준의 `kind`, `fields`, `dslHint`, `docSlug`를 제공하십시오.

## 매니페스트 필드

| 필드 | 설명 |
|-------|-------|
| `id` | 문자, 숫자, 하이픈을 사용하는 소문자 패키지 id입니다. |
| `name` | 사람이 읽을 수 있는 패키지 이름입니다. |
| `version` | 표시 및 핸들러 캐싱에 사용되는 패키지 버전입니다. |
| `description` | UI 및 어시스턴트 컨텍스트에 표시되는 간단한 설명입니다. |
| `entry` | zip 내부의 Python 핸들러 파일 경로이며, 기본값은 `handler.py`입니다. |
| `dependencies` | `uv pip install`로 설치되는 선택적 pip 요구 사항입니다. |
| `nodes` | 이 패키지가 노출하는 사용자 정의 노드입니다. |

각 노드는 고유한 `key`, `name`, 그리고 `action` 또는 `trigger` 중 하나의 `kind`가 필요합니다. `function`을 생략하면 액션은 `run`을 호출하고 트리거는 `trigger`를 호출합니다.

지원되는 필드 타입은 `string`, `number`, `boolean`, `select`입니다. Select 필드는 `{ "label": "...", "value": "..." }` 객체의 `options` 배열을 사용합니다. 필수 필드에는 `required`를, 마스킹된 입력에는 `secret`을 설정하십시오. 매니페스트는 필드에 대해 `default`, `dynamic`, `expression` 메타데이터도 허용합니다. 이들은 매니페스트와 함께 저장되지만, 현재 플러그인 노드는 기본값에서 누락된 config를 자동으로 채우는 대신 런타임에 저장된 노드 config를 읽습니다.

비밀 값이 아닌 문자열 필드는 표현식 입력 UI로 렌더링됩니다. 런타임에서 `$`로 시작하는 저장된 문자열 config 값은 핸들러가 호출되기 전에 해석됩니다.

## 핸들러 함수

액션 핸들러는 Workflow 입력, 해석된 config, 그리고 작은 컨텍스트를 받습니다:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

트리거 핸들러는 해석된 config와 컨텍스트를 받습니다:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

명명된 출력 필드를 노출하려면 딕셔너리를 반환하십시오. 핸들러가 다른 타입을 반환하면 Heym은 이를 `{ "value": result }`로 감쌉니다.

## 설치 및 런타임

플러그인은 기본적으로 비활성화되어 있습니다. 운영자는 `HEYM_PLUGINS_ENABLED=true`로 활성화하고 `HEYM_PLUGIN_ADMIN_EMAILS`로 관리를 제한합니다. 설치된 플러그인 파일은 `HEYM_PLUGINS_DIR` 아래에 위치하며, 컨테이너 배포에서는 영구적으로 마운트해야 합니다.

플러그인 코드는 백엔드와 동일한 프로세스에서 실행되는 신뢰할 수 있는 운영자 설치 Python입니다. 네트워크와 설치된 라이브러리에 접근할 수 있으므로, Heym 자체와 동일한 신뢰 수준으로 실행할 의향이 있는 패키지만 설치하십시오.
