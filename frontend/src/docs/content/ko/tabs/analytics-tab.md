# Analytics 탭

**Analytics** 탭은 Workflow의 실행 지표와 추세를 보여줍니다. 사용량과 성능을 모니터링하고 병목 지점을 식별하십시오.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Analytics 데모 시청</a></p>

## 요약 통계

- **총 실행 수** – 선택한 기간 동안의 Workflow 실행 횟수
- **성공률** – 성공한 실행의 비율
- **평균 소요 시간** – 평균 실행 시간
- **절약된 시간** – 추정된 총 절약 시간: 각 Workflow에 설정된 실행당 절약 분 × 성공한 실행 수를 선택한 기간 전체에 대해 합산한 값
- **추세** – 이전 기간 대비 상승/하락 지표

## 시간 범위

- **24h** – 최근 24시간
- **7d** – 최근 7일
- **30d** – 최근 30일
- **All** – 사용 가능한 전체 이력

## Workflow 필터

- 특정 Workflow별로 지표를 필터링합니다
- **All workflows** – 모든 Workflow에 걸쳐 집계합니다

## 테이블

두 개의 테이블이 Workflow 사용량을 보여줍니다: **Most Used**(더 넓음)와 **Most Failed**.

- **Time Saved** – Most Used는 각 Workflow의 합산된 절약 시간(실행당 절약 분 × 성공한 실행 수)을 표시합니다. **Not Set**은 추정치가 누락되었음을 의미하며, 이를 클릭하면 해당 Workflow의 해당 필드가 열립니다.
- **정렬 가능한 열** – 열 헤더를 클릭하면 해당 열을 기준으로 정렬합니다. 다시 클릭하면 오름차순/내림차순이 전환됩니다. 화살표 지표가 정렬 방향을 표시합니다.
- **모바일 레이블** – 작은 화면에서는 열 레이블이 축약되어(예: "Executions" → "Runs", "Success" → "OK", "Error" → "Err") 테이블이 가로 스크롤 없이 맞춰집니다.

## 차트

- **Execution Volume Over Time** – 시간 구간별 실행 수를 나타내는 선 차트
- **Success vs Error Rate** – 정상 실행과 실패한 실행을 비교하는 영역 차트
- **Average Latency Over Time** – 응답 시간 변화를 보여주는 선 차트
- **드래그하여 선택** – 차트 위에서 클릭 후 드래그하여 사용자 지정 날짜 범위에 집중합니다
- **선택 모드** – 선택한 범위는 기본 프리셋을 변경하지 않고 요약 카드, 차트, Workflow 테이블을 새로 고칩니다
- **Clear Selection** – 세부 분석을 마친 후 프리셋 시간 범위로 돌아갑니다

## 자동 새로 고침

- 자동 새로 고침을 활성화하면 수동으로 다시 로드하지 않고도 지표를 최신 상태로 유지합니다

## 관련 항목

- [Workflows 탭](./workflows-tab.md) – 측정 대상 Workflow
- [Traces 탭](./traces-tab.md) – 상세 Trace 검사
- [Logs 탭](./logs-tab.md) – 디버깅을 위한 런타임 로그
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간결한 페이지 가이드

차트에서 지켜보기보다 알림을 받고 싶은 추세가 나타나면 이를 [alert](./alerts-tab.md)로 전환하십시오: 오류 수, 실행 시간, LLM 지출, 실행 횟수 모두 시간 범위에 대한 임계값을 설정할 수 있습니다.
