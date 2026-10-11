# 음성 채팅 (TTS & STT)

Chat 탭에서는 메시지를 소리 내어 읽어주고, [ElevenLabs](https://elevenlabs.io)의 지원을 받는 핸즈프리 대화형 음성 모드를 실행할 수 있습니다. 양방향 모두 하나의 ElevenLabs credential을 사용합니다. 재생을 위한 **text-to-speech**와 마이크 입력을 위한 **Scribe speech-to-text**입니다.

## 설정

1. **Settings**(오른쪽 상단의 아바타) → **Voice** 탭을 엽니다.
2. **ElevenLabs credential**을 선택하거나 **Add credential**을 클릭하여 새로 만듭니다. API key는 ElevenLabs 계정에서 **Text to Speech**, **Speech to Text**, **Voices** 권한이 활성화되어 있어야 합니다.
3. ElevenLabs 계정에서 **Voice**를 선택합니다.
4. **Save Voice Settings**를 클릭합니다.

설정을 완료하기 전에 음성 버튼을 누르면 Voice 탭이 자동으로 열려 구성을 마칠 수 있습니다.

ElevenLabs API key는 암호화되어 저장되며 브라우저에 전달되지 않습니다. 모든 호출은 Heym 백엔드를 통해 프록시됩니다. [Credentials](./credentials.md) 및 [Settings](./user-settings.md)를 참조하십시오.

## 메시지 소리 내어 읽기

모든 메시지 버블(사용자 및 어시스턴트)에는 **Copy** 옆에 스피커 버튼이 있습니다. 클릭하면 메시지가 재생되고, 다시 클릭하거나 다른 메시지를 재생하면 중지됩니다. 재생에는 ElevenLabs 다국어 모델이 사용되므로 텍스트의 언어가 자동으로 감지됩니다.

## 대화형 음성 모드

Chat 입력창의 파형 버튼을 누르면 전체 화면 핸즈프리 음성 모드가 열립니다(라이트/다크 및 모바일 대응):

1. 마이크를 통해 듣고 말을 멈춘 시점을 감지합니다.
2. 음성은 **Scribe**로 전사됩니다(언어 자동 감지 — 수동 TR/EN 전환 불필요).
3. 전사된 내용은 **동일한 대화**에 일반 Chat 메시지로 전송됩니다.
4. 어시스턴트의 응답이 소리 내어 재생된 후 다시 듣기를 시작합니다.

**mute** 버튼으로 듣기를 일시 중지하고 **✕**로 종료할 수 있습니다(마이크가 해제됩니다). 녹음은 Firefox를 포함한 모든 최신 브라우저에서 작동합니다.

## 참고 사항

- Voice 및 credential 선택은 사용자별 환경설정이며, LLM의 활성 대화, 모델, credential은 변경되지 않습니다.
- ElevenLabs 사용량(TTS 및 STT 모두)은 사용자의 ElevenLabs 계정에 청구됩니다.

## 관련 항목

- [Chat Tab](../tabs/chat-tab.md) – 음성 기능이 위치한 Dashboard Chat
- [Credentials](./credentials.md) – API key가 저장되고 참조되는 방식
- [Settings](./user-settings.md) – Voice 탭이 위치한 곳
