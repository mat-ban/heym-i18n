# Chat Voice (TTS i STT)

Zakładka Chat może odczytywać wiadomości na głos i uruchamiać interaktywny tryb głosowy obsługiwany bez użycia rąk, oparty na [ElevenLabs](https://elevenlabs.io). Oba kierunki korzystają z jednego zestawu danych logowania ElevenLabs: **text-to-speech** do odtwarzania oraz **Scribe speech-to-text** dla mikrofonu.

## Konfiguracja

1. Otwórz **Settings** (awatar w prawym górnym rogu) → zakładka **Voice**.
2. Wybierz **dane logowania ElevenLabs** lub kliknij **Add credential**, aby je utworzyć. Klucz API wymaga włączonych uprawnień **Text to Speech**, **Speech to Text** oraz **Voices** na koncie ElevenLabs.
3. Wybierz **Voice** ze swojego konta ElevenLabs.
4. Kliknij **Save Voice Settings**.

Jeśli przycisk głosu zostanie naciśnięty przed wykonaniem tej konfiguracji, zakładka Voice otworzy się automatycznie, aby dokończyć ustawienia.

Klucz API ElevenLabs jest przechowywany w formie zaszyfrowanej i nigdy nie trafia do przeglądarki — wszystkie wywołania są przekazywane przez backend Heym. Zobacz [Dane logowania](./credentials.md) oraz [Settings](./user-settings.md).

## Odczytywanie wiadomości na głos

Każdy dymek wiadomości (zarówno użytkownika, jak i asystenta) ma przycisk głośnika obok **Copy**. Kliknij go, aby odtworzyć wiadomość; kliknij ponownie — lub odtwórz inną wiadomość — aby zatrzymać. Odtwarzanie korzysta z wielojęzycznego modelu ElevenLabs, więc język tekstu jest wykrywany automatycznie.

## Interaktywny tryb głosowy

Przycisk fali dźwiękowej w polu wprowadzania czatu otwiera pełnoekranowy tryb głosowy obsługiwany bez użycia rąk (z uwzględnieniem trybu jasnego/ciemnego oraz urządzeń mobilnych):

1. Nasłuchuje przez mikrofon i wykrywa moment zakończenia wypowiedzi.
2. Mowa jest transkrybowana za pomocą **Scribe** (język wykrywany automatycznie — bez ręcznego przełącznika TR/EN).
3. Transkrypcja jest wysyłana jako zwykła wiadomość czatu w **tej samej konwersacji**.
4. Odpowiedź asystenta jest odczytywana na głos, po czym następuje powrót do nasłuchiwania.

Użyj przycisku **mute**, aby wstrzymać nasłuchiwanie, oraz **✕**, aby wyjść (co zwalnia mikrofon). Nagrywanie działa we wszystkich nowoczesnych przeglądarkach, w tym w Firefoksie.

## Uwagi

- Wybór głosu i danych logowania to preferencje poszczególnych użytkowników; aktywna konwersacja, model oraz dane logowania dla LLM pozostają bez zmian.
- Wykorzystanie ElevenLabs (zarówno TTS, jak i STT) jest rozliczane na własnym koncie ElevenLabs.

## Powiązane

- [Zakładka Chat](../tabs/chat-tab.md) – czat w Dashboard, w którym dostępny jest głos
- [Dane logowania](./credentials.md) – jak przechowywane i przywoływane są klucze API
- [Settings](./user-settings.md) – gdzie znajduje się zakładka Voice
