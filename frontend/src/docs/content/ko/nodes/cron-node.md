# Cron

**Cron** 노드는 cron 표현식을 사용하여 일정에 따라 Workflow를 트리거합니다. 사용자 입력이 필요하지 않으며, 지정된 시간에 Workflow가 자동으로 실행됩니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력 | Trigger 이벤트 (Payload 없음) |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `cronExpression` | string | Cron 표현식 (예: 매시간 실행은 `0 * * * *`) |

## Cron 표현식 형식

표준 5필드 cron: `minute hour day-of-month month day-of-week`

| 필드 | 값 | 예시 |
|-------|--------|---------|
| 분 | 0–59 | `0` = 0분에 실행 |
| 시 | 0–23 | `*` = 매시간 |
| 일 | 1–31 | `*` = 매일 |
| 월 | 1–12 | `*` = 매월 |
| 요일 | 0–7 (0과 7 = 일요일) | `*` = 매일 |

**일반적인 예시:**

- `0 * * * *` – 매시간
- `0 0 * * *` – 매일 자정
- `*/15 * * * *` – 15분마다
- `0 9 * * 1-5` – 평일 9:00

## 예시

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## 관련 항목

- [노드 타입](../reference/node-types.md) – 모든 노드 타입 개요
- [Trigger](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable 노드](./disable-node.md) – 조건 이후 cron Trigger 중지
- [Enable 노드](./enable-node.md) – 비활성화된 cron Trigger 다시 시작
