# 코드

**Code** 노드는 직접 작성한 Python을 자체 `requirements.txt`와 함께 실행하고 JSON을 반환합니다. 모든 실행은 완료 시 폐기되는 완전히 새로운 컨테이너에서 이루어지므로, 한 실행이 다른 실행을 보거나 영향을 줄 수 없습니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.result` (`main`이 반환한 값), 그리고 `$nodeLabel.logs`와 `$nodeLabel.install` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `codeSource` | string | Python 소스. `main(params)`를 정의하고 JSON 직렬화 가능한 값을 반환해야 합니다 |
| `codeParameters` | expression | Workflow 데이터를 코드로 연결하는 JSON 객체. 표현식은 코드 실행 전에 해석됩니다 |
| `codeRequirements` | string | `requirements.txt` 내용으로, 한 줄에 패키지 하나씩 기재합니다. 비어 있으면 설치를 건너뜁니다 |
| `codeAllowNetwork` | boolean | 코드 자체가 네트워크에 접근할 수 있는지 여부 (기본값 `false`) |

## `main` 함수

코드는 하나의 인자를 받는 최상위 `main`을 정의해야 합니다:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

모듈 수준의 구문도 실행되지만, 노드의 출력이 되는 것은 `main`이 반환한 값뿐입니다.

에디터는 줄 번호를 표시하며, **Format** 옆의 확장 버튼은 `Esc`로 닫히는 더 큰 에디터를 엽니다. 편집은 입력하는 즉시 적용되므로 저장할 것이 없습니다. **Format** 버튼은 Ruff로 코드를 재정렬하며 주석을 보존합니다. 또한 붙여넣기가 흔히 유발하는 들여쓰기 손상도 복구합니다. 균일하게 들여쓰기된 블록, 탭과 스페이스가 섞인 경우, 블록에서 한두 칸 어긋난 줄 모두 거부되지 않고 수정됩니다. 진짜 구문 오류는 해당 줄과 열과 함께 보고됩니다. 포맷팅은 노드가 실행되는 것과 동일한 격리된 컨테이너에서 실행됩니다 — 네트워크도, 백엔드 환경도 없으므로 실행과 마찬가지로 Docker가 필요합니다.

## 파라미터 읽기

`params`는 중첩된 객체와 리스트를 포함한 점 표기법을 지원합니다:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]`는 유효한 Python 식별자가 아닌 키를 읽습니다
- `params.get("maybe")`는 키가 없을 때 예외를 발생시키는 대신 `None`을 반환합니다
- `params.to_dict()`는 일반 딕셔너리를 반환합니다
- 제공되지 않은 키를 읽으면 해당 키를 명시하고 사용 가능한 키를 나열하는 오류가 발생합니다

## 출력

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main`의 반환값입니다. 다운스트림 노드는 `$nodeLabel.result.message`를 읽습니다
- `logs` — 코드가 `print`로 보낸 모든 내용으로, 결과를 손상시키지 않도록 별도로 캡처됩니다
- `install` — 의존성을 설치한 도구(`uv`, `pip`, 또는 `none`)와 그 출력입니다

## 의존성

`requirements.txt`에 로컬에서처럼 정확히 패키지를 나열하십시오:

```
requests==2.32.3
feedparser
```

패키지는 코드 실행 전에 `uv`로 일회용 디렉터리에 설치됩니다. `uv`가 패키지를 처리하지 못하면 Heym은 `pip`로 재시도합니다. 실행 간에 아무것도 캐시되지 않으므로 무거운 의존성은 매 실행마다 몇 초를 추가합니다. `requirements.txt`를 비워 두면 설치 단계를 완전히 건너뛰며 눈에 띄게 빠릅니다.

wheel을 제공하지 않고 C 컴파일러가 필요한 패키지는 설치에 실패합니다. 그 이유는 `install.log`에 나타납니다.

## 네트워크

| 단계 | 네트워크 |
|-------|---------|
| 의존성 설치 | 항상 켜짐 — pip과 uv는 PyPI에 접근해야 합니다 |
| 코드 실행 | 기본적으로 꺼짐. `codeAllowNetwork`가 켭니다 |

`codeAllowNetwork`가 꺼져 있으면 `requests.get(...)`과 같은 아웃바운드 호출은 연결 오류로 실패합니다. 이것이 의도된 기본값입니다. 대부분의 Code 노드는 다른 노드가 이미 가져온 데이터를 변환합니다. **HTTP** 노드로 가져와서 `codeParameters`를 통해 본문을 전달하는 것을 선호하십시오.

## 샌드박스와 제한

코드는 모든 Linux capability가 제거되고, `no-new-privileges`가 설정되며, 루트 파일 시스템이 읽기 전용인 컨테이너에서 비루트 사용자로 실행됩니다. Docker 소켓과 백엔드의 시크릿 또는 환경은 전혀 받지 않습니다.

| 제한 | 값 |
|-------|-------|
| 메모리 | 512 MB |
| CPU | 1 |
| 프로세스 | 256 |
| 의존성 설치 타임아웃 | 120초 |
| 실행 타임아웃 | 60초 |

이는 샌드박스의 고정된 속성이며 구성할 수 없습니다.

> **Docker가 필요합니다.** Agent Python 도구 및 스킬과 달리, Code 노드는 로컬 폴백 모드도 없고 이를 완화할 환경 변수도 없습니다. 접근 가능한 Docker 데몬이 없으면 노드는 백엔드 프로세스에서 코드를 실행하는 대신 명확한 오류와 함께 실패합니다. 네이티브 `./run.sh` 개발에서는 이 노드를 사용하기 전에 Docker를 시작하십시오. [Security → Code node sandbox](../reference/security.md#code-node-sandbox)를 참조하십시오.

## 적합한 노드가 있으면 그것을 사용하십시오

| 원하는 작업 | 사용할 노드 |
|-------------|-----|
| CSV, TSV, XML 파싱 또는 생성, 또는 파일 OCR | [Converter](converter-node.md) |
| HTTP API 호출 | [HTTP](http-node.md) |
| 필드 매핑 또는 이름 변경 | [Set](set-node.md) |
| 다른 Workflow 실행 | [Execute](execute-node.md) |

**Code**는 그 노드들에 맞지 않는 로직 — 사용자 정의 수학, 특수한 파싱, 또는 알고리즘 — 일 때 사용하십시오.
## 예시

업스트림 노드에서 생성된 Score 행:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

`codeParameters`를 `{ "rows": "$fetchRows.result" }`로 설정하면, 다운스트림 노드에서 `$scoreRows.result.total`을 읽습니다.
