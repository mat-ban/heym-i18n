# Zakładka Magazyny wektorowe

Zakładka **Magazyny wektorowe** zarządza magazynami wektorowymi używanymi przez węzły [RAG](../nodes/rag-node.md). Twórz magazyny, przesyłaj dokumenty i udostępniaj je zespołowi.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Obejrzyj demonstrację Magazynów wektorowych</a></p>

## Tworzenie magazynu wektorowego

1. Kliknij **Nowy magazyn wektorowy**
2. Wprowadź nazwę i opcjonalny opis
3. Wybierz **dane logowania** magazynu wektorowego – *RAG: Qdrant + OpenAI* (zewnętrzny serwer Qdrant), *RAG: Psql + OpenAI* (własna baza danych Postgres Heym z rozszerzeniem pgvector) lub *RAG: Custom Embeddings* (dowolny endpoint embeddingów zgodny z OpenAI, kierowany do wybranego backendu). Dane logowania określają backend magazynu.
4. Opcjonalnie ustaw niestandardową nazwę kolekcji (domyślnie generowana automatycznie)
5. Zapisz

> Backend magazynu jest ustalany przez jego dane logowania w momencie tworzenia. W węźle RAG lista rozwijana **Database** filtruje magazyny do pasującego backendu.

## Przesyłanie dokumentów

- **Przesyłanie plików** – Przeciągnij i upuść lub wybierz pliki (PDF, TXT itp.)
- **Obsługa duplikatów** – Wybierz nadpisanie lub pominięcie zduplikowanych nazw plików
- **Postęp** – Postęp przesyłania jest wyświetlany podczas przetwarzania

## Zarządzanie zawartością

- **Wyświetlanie elementów** – Zobacz grupy źródeł i liczbę dokumentów w każdym magazynie. Przesłane pliki są grupowane
  pod nazwą pliku; dokumenty zapisane przez [węzeł RAG](../nodes/rag-node.md) bez własnego
  `source` są grupowane pod **Added workflow: _nazwa_**, wskazując workflow, który
  je zapisał
- **Usuwanie źródeł** – Usuń określone pliki lub grupy źródeł z magazynu, w tym
  wszystko, co dodał dany workflow
- **Edycja magazynu** – Zmień nazwę, opis lub dane logowania

## Udostępnianie

- Udostępniaj magazyny wektorowe innym użytkownikom przez adres e-mail
- Udostępnione magazyny są oznaczone wskaźnikiem
- Cofnij udostępnianie z menu karty magazynu

## Używanie w workflow

W [węźle RAG](../nodes/rag-node.md) wybierz magazyn wektorowy po nazwie. Węzeł pobiera odpowiednie fragmenty i wzbogaca kontekst LLM o ich treść.

## Powiązane

- [Zakładka Dane logowania](./credentials-tab.md) – Konfiguracja danych logowania magazynu wektorowego (Qdrant, Postgres lub niestandardowe embeddingi)
- [Węzeł RAG](../nodes/rag-node.md) – Dokumentacja węzła
- [Zakładka Workflows](./workflows-tab.md) – Twórz workflow korzystające z RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Zwięzły przewodnik po stronach panelu
