# Scheduled 탭

**Scheduled** 탭은 모든 활성 Cron Workflow를 시각적 캘린더에 표시합니다. 일, 주, 월 보기 간에 전환하여 자동화가 실행되도록 예약된 시점을 확인하십시오.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Scheduled 데모 시청</a></p>

## 보기

- **Day** – 선택한 날짜의 시간대별 타임라인으로, 각 실행 시점이 예약된 시간에 블록으로 표시됩니다
- **Week** – 현재 주에 걸친 7열 그리드로, 동일한 시간에 여러 Workflow가 실행될 경우 블록이 쌓여 표시됩니다
- **Month** – 전체 월 그리드로, 각 셀에 해당 일자에 실행되도록 예약된 Workflow가 나열됩니다

## Workflow 블록

각 블록에는 다음이 표시됩니다:

- **Workflow 이름** – 클릭하면 Workflow 캔버스가 바로 열립니다
- **Cron 표현식** – 마우스를 올리면 표시되며, 원시 스케줄(예: `0 9 * * 1-5`)을 보여줍니다

## 탐색

`HEYM_ADMIN_EMAILS`에 등록된 인스턴스 관리자는 **Show all workflows**를 선택하면 모든 소유자의 스케줄을 확인할 수 있습니다. 선택을 해제하면 자신의 Workflow만 표시됩니다. 그 외 사용자는 **Show shared with me** 옵션을 유지합니다. 직원의 자동화를 중단하려면 Workflows 미리보기의 [인스턴스 관리 제어](./workflows-tab.md#instance-administration)를 사용하여 Trigger를 일시 중지하거나 재개하십시오.

- **이전 / 다음** 화살표를 사용하여 일, 주, 월 단위로 이동하십시오
- **Today** 버튼을 누르면 즉시 현재 날짜로 돌아갑니다

## 관련 항목

- [Cron 노드](../nodes/cron-node.md) – 캔버스에서 예약된 Trigger를 구성합니다
- [Workflows 탭](./workflows-tab.md) – 모든 Workflow를 관리하고 정리합니다
- [Analytics 탭](./analytics-tab.md) – 실행 지표 및 추세
