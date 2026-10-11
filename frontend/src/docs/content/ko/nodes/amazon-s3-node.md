# Amazon S3

Amazon S3 노드는 [Amazon S3](https://aws.amazon.com/s3/)에서 객체를 읽고 씁니다.

## 지원되는 작업

- `Create Bucket`: credential region에 버킷을 생성합니다.
- `Delete Bucket`: 비어 있는 버킷을 삭제합니다.
- `List Buckets`: credential에서 볼 수 있는 버킷을 나열합니다.
- `Create Folder`: 빈 폴더 마커(`/`로 끝나는 0바이트 키)를 생성합니다.
- `Delete Folder`: 폴더 prefix 아래의 모든 객체(중첩 키 포함)를 삭제합니다.
- `Get All in Folder`: 폴더 prefix 아래의 모든 객체 메타데이터를 나열합니다(서버 측 페이지네이션).
- `Upload Object`: 텍스트 payload를 버킷/키에 씁니다.
- `Get Object`: 객체를 다운로드하여 디코딩된 텍스트 또는 base64 콘텐츠를 반환합니다.
- `Copy Object`: 객체를 다른 키 또는 버킷으로 복사합니다.
- `List Objects`: prefix 아래의 객체 메타데이터를 나열합니다(단일 페이지, 최대 1000개 키, continuation token 지원).
- `Delete Object`: 키로 단일 객체를 삭제합니다.

## Credential 설정

Credentials 탭에서 `Amazon S3` credential을 생성하고 다음을 입력하십시오:

- Access Key ID
- Secret Access Key
- Region
- 선택적 Session Token (임시 AWS STS 자격 증명용)

## 공통 필드

- `Bucket`: 대상 버킷 이름(복사 작업의 경우 대상 버킷).
- `Object Key`: `reports/daily.json`과 같은 경로 형태의 객체 키.
- `Folder Path`: 폴더 작업용 prefix(예: `docs/archive`).
- `Source Bucket`: 복사용 선택적 소스 버킷이며, 기본값은 대상 버킷입니다.
- `Source Object Key`: 복사 작업의 소스 키.
- `Prefix`: 목록 작업에서 결과 범위를 지정하는 데 사용됩니다.
- `Continuation Token`: 이전 목록 응답에서 다음 페이지를 가져오기 위한 선택적 token.
- `Max Keys`: List Objects의 페이지 크기(1–1000).
- `Include Binary`: Get Object에서 활성화하면 `body_text` 대신 `body_base64`를 반환합니다.
- `Body`: 업로드할 텍스트 콘텐츠.
- `Content Type`: 업로드된 객체의 선택적 MIME 타입.

## 출력 예시

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## 참고 사항

- `Upload Object`는 현재 UTF-8 텍스트 콘텐츠를 업로드합니다.
- `Get Object`는 바이너리 옵션을 활성화하여 바이너리 파일에 대해 base64를 반환할 수 있습니다.
- `Create Bucket`은 credential region을 사용하며 `s3:CreateBucket` 권한이 필요합니다.
- `Delete Bucket`은 버킷이 비어 있어야 하며 `s3:DeleteBucket` 권한이 필요합니다.
- `List Buckets`는 `s3:ListAllMyBuckets` 권한이 필요합니다.
- `Create Folder`는 0바이트 마커 객체를 업로드합니다. S3에는 네이티브 디렉터리 타입이 없습니다.
- `Delete Folder`는 키가 폴더 prefix로 시작하는 모든 객체를 제거하므로 주의해서 사용하십시오.
- `Get All in Folder`는 모든 객체가 반환될 때까지 prefix를 자동으로 페이지네이션합니다.
- `List Objects`는 한 페이지(최대 1000개 키)를 반환합니다. `truncated`가 true이면 `next_continuation_token`을 다음 호출의 Continuation Token 필드에 전달하십시오.
- `Copy Object`는 소스에 `s3:GetObject`, 대상에 `s3:PutObject` 권한이 필요합니다.

## 관련 문서

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Credentials](../reference/credentials.md) – Credential 타입 및 사용법
- [Third-Party Integrations](../reference/integrations.md) – Amazon S3 credential 설정
