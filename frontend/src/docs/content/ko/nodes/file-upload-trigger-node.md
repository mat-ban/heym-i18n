# 파일 업로드 Trigger

**File Upload Trigger** 노드는 JSON 요청 내에 base64로 포함할 수 없는 **대용량 파일**(오디오, 비디오, 압축 파일)이 필요한 Workflow를 위한 제로 입력(zero-input) 진입점입니다. Workflow를 호출하면 미리 채워진 일회용 `curl` 업로드 링크가 반환되며, 해당 링크에 파일을 업로드하면 파일이 첨부된 상태로 실행이 시작됩니다.

Claude나 ChatGPT와 같이 샌드박스에서 실행되는 AI 에이전트를 포함한 호출자가 20MB 음성 녹음이나 75MB 비디오를 Heym Workflow에 전달해야 할 때 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## 작동 방식

이 노드는 두 단계로 실행됩니다.

1. **발급(Mint).** Workflow가 HTTP(`POST /api/workflows/{id}/execute`), MCP 도구, 또는 캔버스의 **Run Workflow** 버튼을 통해 호출되면, 실행은 본문을 **실행하지 않습니다**. 대신 일회용 업로드 슬롯을 발급하고 다음을 반환합니다.

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **업로드 + 실행.** 호출자가 자신의 파일로 `curl`을 실행합니다. 업로드 Endpoint는 슬롯을 검증하고, 파일을 저장하고, Workflow를 **동기적으로** 실행한 뒤, 업로드 응답에 Workflow 출력을 반환합니다. 링크는 **일회용**이므로 두 번째 업로드는 `409`를 반환합니다.

캔버스에서 **Run Workflow**는 발급된 `curl`을 복사 버튼과 함께 디버그 패널에 표시합니다.

## 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | 업로드 링크가 유효하게 유지되는 시간(1–10080분 / 최대 7일). |
| `maxSizeMb` | number | `100` | 허용되는 최대 파일 크기. 하드 상한은 **100 MB**입니다. |
| `allowedTypes` | string | (비어 있음) | 선택적 쉼표 구분 MIME/확장자 허용 목록. 예: `audio/*, .wav`. 비어 있으면 모든 타입을 허용합니다. |

## 출력 필드

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.file.id` | 저장된 파일 UUID(Drive 파일). |
| `$nodeLabel.file.name` | 원본 파일명. |
| `$nodeLabel.file.mime` | 감지된 콘텐츠 타입. |
| `$nodeLabel.file.size` | 바이트 단위 크기. |
| `$nodeLabel.file.download_url` | 다운스트림 노드용 인증된 다운로드 URL. |
| `$nodeLabel.uploaded_at` | 업로드의 ISO 타임스탬프. |

## 예시

전사(transcription) Workflow:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. 에이전트가 Workflow의 MCP 도구를 호출하고 `curl`을 수신합니다.
2. 에이전트가 샌드박스의 녹음 파일로 `curl`을 실행합니다.
3. 업로드가 Workflow를 실행하고 `curl` 응답에 전사 요약이 포함됩니다.

## 보안

- 업로드 URL에는 고엔트로피 Token이 내장되어 있습니다. Token 자체가 **능력(capability)**이므로 샌드박스 에이전트는 업로드에 Heym 자격 증명이 필요하지 않습니다. 서버 측에는 Token의 해시만 저장됩니다.
- 발급에는 일반적인 Workflow 인증이 필요하므로, 권한이 부여된 호출자만 업로드 링크를 생성할 수 있습니다.
- 모든 발급과 모든 업로드 시도(수락 또는 거부 — 만료, 재사용, 크기 초과, 허용되지 않은 타입, 알 수 없는 Token)는 추가 전용(append-only) 감사 로그에 기록됩니다.
- 업로드는 일회용, TTL 제한, 크기 제한이 적용되며, 크기 초과 업로드는 거부됩니다.

## 참고 사항

- 일반적인 HTTP, MCP, 캔버스 호출 채널은 JSON 전용으로 유지됩니다. 이 노드는 multipart 파일 업로드를 수용하는 지원되는 방법입니다.
- 업로드된 파일은 일반 Drive 파일로 저장되므로, 파일 참조를 받는 모든 다운스트림 노드(전사, 이메일 첨부 전송 등)가 `$nodeLabel.file`을 사용할 수 있습니다.
