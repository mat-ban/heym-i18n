# 스티커 메모

**Sticky Note** 노드는 캔버스에 리치 Markdown 노트를 추가합니다. 이 노드는 실행되지 않으며, 문서화, 지침, 참조 이미지 또는 Workflow 노트 용도로 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 0 |
| Output | N/A (실행되지 않음) |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `stickyTitle` | string | Sticky Note 상단에 표시되는 제목입니다. |
| `stickyColor` | string | 배경색: `yellow`, `sky`, `emerald`, `rose`, `violet` 또는 `zinc`. |
| `note` | string | Markdown 콘텐츠입니다. 캔버스에서 더블클릭하여 편집할 수 있습니다. 링크 및 `![Alt](https://example.com/image.png)`와 같은 이미지 Markdown을 지원합니다. |

## 예시

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Workflow Organization](../reference/workflow-organization.md) – Workflow 구성
