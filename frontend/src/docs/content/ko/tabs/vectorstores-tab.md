# Vectorstores 탭

**Vectorstores** 탭은 [RAG](../nodes/rag-node.md) 노드에서 사용하는 벡터 스토어를 관리합니다. 스토어를 생성하고, 문서를 업로드하며, 팀과 공유하십시오.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vectorstores 데모 시청</a></p>

## 벡터 스토어 생성

1. **New Vector Store**를 클릭합니다
2. 이름과 선택적 설명을 입력합니다
3. 벡터 스토어 **credential**을 선택합니다 – *RAG: Qdrant + OpenAI*(외부 Qdrant 서버), *RAG: Psql + OpenAI*(pgvector를 통한 Heym 자체 Postgres 데이터베이스), 또는 *RAG: Custom Embeddings*(OpenAI 호환 임베딩 Endpoint, 두 백엔드 중 하나를 대상으로 함). credential이 스토어의 백엔드를 결정합니다.
4. 선택적으로 사용자 지정 컬렉션 이름을 설정합니다(기본값은 자동 생성됨)
5. 저장합니다

> 스토어의 백엔드는 생성 시점에 credential에 의해 고정됩니다. RAG 노드에서 **Database** 드롭다운은 일치하는 백엔드로 스토어를 필터링합니다.

## 문서 업로드

- **파일 업로드** – 파일을 드래그 앤 드롭하거나 선택합니다(PDF, TXT 등)
- **중복 처리** – 중복 파일명을 덮어쓸지 건너뛸지 선택합니다
- **진행 상황** – 수집 중 업로드 진행 상황이 표시됩니다

## 콘텐츠 관리

- **항목 보기** – 스토어별 소스 그룹과 문서 수를 확인합니다. 업로드된 파일은
  파일명 아래에 그룹화되며, 자체 `source`가 없는 상태로 [RAG 노드](../nodes/rag-node.md)가
  저장한 문서는 **Added workflow: _name_** 아래에 그룹화되어 해당 문서를 기록한
  Workflow의 이름을 표시합니다
- **소스 삭제** – 특정 파일 또는 소스 그룹을 스토어에서 제거합니다. 하나의 Workflow가
  추가한 모든 항목도 포함됩니다
- **스토어 편집** – 이름, 설명 또는 credential을 변경합니다

## 공유

- 이메일로 다른 사용자와 벡터 스토어를 공유합니다
- 공유된 스토어는 표시자와 함께 나타납니다
- 스토어 카드 메뉴에서 공유를 취소합니다

## Workflow에서 사용

[RAG 노드](../nodes/rag-node.md)에서 이름으로 벡터 스토어를 선택합니다. 노드는 관련 청크를 검색하여 LLM 컨텍스트를 보강합니다.

## 관련 항목

- [Credentials 탭](./credentials-tab.md) – 벡터 스토어 credential 설정(Qdrant, Postgres 또는 사용자 지정 임베딩)
- [RAG 노드](../nodes/rag-node.md) – 노드 레퍼런스
- [Workflows 탭](./workflows-tab.md) – RAG를 사용하는 Workflow 생성
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간략한 페이지 가이드
