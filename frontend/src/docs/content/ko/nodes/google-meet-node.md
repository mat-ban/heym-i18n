# Google Meet

Google Calendar에서 사용 가능한 시간 슬롯을 검색하고 Google Meet 링크, 참석자 이메일, 선택한 시간으로 회의 초대를 생성, 업데이트 또는 삭제합니다. 연결된 Google 계정이 이벤트의 소유자가 되며, 참석자는 이메일로 초대를 받습니다.

## 계정 연결

1. [Google Cloud Console](https://console.cloud.google.com)에서 **Google Calendar API**를 사용 설정합니다.
2. OAuth 동의 화면을 구성하고 **웹 애플리케이션** 유형의 OAuth 클라이언트를 만듭니다. 앱이 테스트 모드인 경우 Google 계정을 테스트 사용자로 추가하세요.
3. `https://your-heym-domain/api/credentials/google-meet/oauth/callback`을 승인된 리디렉션 URI로 등록합니다. 로컬 개발의 경우 동일한 경로의 브라우저 Heym 오리진을 사용하세요.
4. **Dashboard → Credentials → 새로 만들기 → Google Meet (OAuth2)**로 이동하여 이름, Client ID, Client Secret을 입력한 다음 **연결**을 클릭하고 Google로 로그인합니다.
5. 두 권한을 모두 부여합니다: 캘린더 이벤트(`calendar.events`) 및 캘린더 여유 시간(`calendar.events.freebusy`). 노드에서 이 자격 증명을 선택합니다.

토큰은 저장소에 암호화되어 저장되며 자동으로 갱신됩니다. 이는 Google AI, Sheets 또는 Drive와 분리된 별도의 자격 증명입니다. 정상적으로 생성되려면 캘린더가 Google Meet 화상 회의를 지원해야 합니다.

## 작업

| 작업 | 동작 | 필수 필드 |
| --- | --- | --- |
| `read` | 캘린더의 사용 가능 및 바쁨 간격을 반환합니다 | 자격 증명 |
| `create` | 새 Meet 회의 및 이메일 초대가 포함된 예약 이벤트를 생성합니다 | 제목, 시작 시간, 종료 시간 |
| `update` | 제공된 이벤트 필드를 수정하고 게스트에게 알립니다 | 이벤트 ID 및 하나 이상의 변경된 필드 |
| `delete` | 이벤트를 삭제하고 게스트에게 취소를 알립니다 | 이벤트 ID |

## 구성

아래 텍스트 필드는 표현식을 지원합니다. 부울 세부 정보 옵션을 포함한 모든 필드는 이 노드가 도구로 연결될 때 Agent에 의해 제공될 수 있습니다.

| 필드 | 기본값 | 용도 |
| --- | --- | --- |
| `gmCalendarId` | `primary` | 연결된 계정의 기본 캘린더 또는 접근 가능한 캘린더 ID/이메일 |
| `gmTimeZone` | `UTC` | 현지 날짜 및 응답 시간에 사용되는 IANA 표준 시간대(예: `Asia/Seoul`) |
| `gmStartDate` | 현재 시간 | ISO 날짜 또는 datetime 형식의 읽기 범위 시작 |
| `gmEndDate` | 다음 달 1일 자정 | 읽기 범위의 배타적 종료 시점; 최대 범위는 60역일입니다 |
| `gmIncludeBusyDetails` | `false` | 읽기 전용: `busy_slots`에 이벤트 제목과 참석자 포함; boolean |
| `gmEventId` | 비어 있음 | update/delete를 위한 캘린더 이벤트 ID; Meet URL이 아닌 반환된 `event_id` 사용 |
| `gmTitle` | 비어 있음 | 초대 제목; `create` 시 필수 |
| `gmDescription` | 비어 있음 | 초대 설명 |
| `gmStartTime` | 비어 있음 | 회의 시작 시간, 예: `2026-11-10T14:00:00+09:00` |
| `gmEndTime` | 비어 있음 | 회의 종료 시간; 시작 시간 이후여야 함 |
| `gmAttendees` | 비어 있음 | 쉼표/세미콜론/줄바꿈으로 구분된 이메일 또는 JSON 이메일 문자열 배열 |
| `gmLocation` | 비어 있음 | Meet 회의와 함께 제공되는 선택적 회의 장소 |

### 사용 가능한 시간 슬롯

기본 읽기는 선택한 표준 시간대에서 현재 시간부터 **다음 달 1일 00:00**까지를 포괄합니다. 다른 시간 범위를 지정하려면 `gmEndDate`를 전달하세요. 60일을 초과하는 범위 또는 유효하지 않은 날짜는 Google 호출 전에 거부됩니다.

결과는 Google의 **free/busy** API를 기반으로 합니다. 바쁨 간격은 병합되어 요청된 기간에서 차감됩니다. `available_slots`에는 `start` 및 `end` 타임스탬프가 포함된 연속된 여유 시간이 포함됩니다.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Availability",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "read",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmStartDate": "2026-11-06",
    "gmEndDate": "2026-11-13"
  }
}
```

### 바쁜 이벤트 세부정보 포함

**사용 가능한 시간 슬롯 읽기**에서 **바쁜 이벤트 세부정보 포함**(`gmIncludeBusyDetails: true`)을 활성화하면 각 바쁜 슬롯에 제목과 참석자가 추가됩니다. 이 옵션은 기본적으로 비활성화되어 있습니다.

```json
{
  "start": "2026-11-06T21:15:00+01:00",
  "end": "2026-11-06T21:30:00+01:00",
  "title": "Daily check-in",
  "attendees": [
    "colleague@example.com"
  ]
}
```

### 미팅 예약하기

1. workflow 소유자의 자격 증명을 사용하여 `read` 노드를 실행합니다.
2. 예약 인터페이스에 `available_slots`를 표시합니다.
3. `email`, `startTime`, `endTime`을 workflow 입력으로 전달합니다.
4. 동일한 자격 증명으로 `create`를 실행합니다. 방문자는 Google 계정이 필요하지 않으며 이메일이 참석자로 등록됩니다.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Booking",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "create",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmTitle": "Meet with me",
    "gmDescription": "A meeting booked through Heym",
    "gmAttendees": "$input.email",
    "gmStartTime": "$input.startTime",
    "gmEndTime": "$input.endTime"
  }
}
```

## 출력

| 작업 | 출력 필드 |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

다운스트림 노드에서 `$Availability.available_slots` 또는 `$Booking.meet_url`을 사용하세요. 모든 작업은 `status: "success"`와 해당 `operation`도 반환합니다.

## 관련 항목

- [Credentials](../reference/credentials.md)
- [서드파티 연동](../reference/integrations.md)
- [자격 증명 공유](../reference/credentials-sharing.md)
- [입력](input-node.md)
- [출력](output-node.md)
