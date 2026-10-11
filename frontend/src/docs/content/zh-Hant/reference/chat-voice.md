# 語音對話 (TTS 與 STT)

Chat 分頁可以朗讀訊息，並執行免持互動語音模式，由 [ElevenLabs](https://elevenlabs.io) 提供技術支援。雙向功能皆使用同一組 ElevenLabs 認證：用於播放的 **text-to-speech**，以及用於麥克風的 **Scribe speech-to-text**。

## 設定

1. 開啟 **Settings**（右上角您的頭像）→ **Voice** 分頁。
2. 選擇一組 **ElevenLabs 認證**，或點擊 **Add credential** 建立一組。此 API key 需要在您的 ElevenLabs 帳戶中啟用 **Text to Speech**、**Speech to Text** 與 **Voices** 權限。
3. 從您的 ElevenLabs 帳戶中選擇一個 **Voice**。
4. 點擊 **Save Voice Settings**。

若您在完成設定前按下語音按鈕，Voice 分頁會自動開啟，讓您完成設定。

ElevenLabs API key 以加密方式儲存，且永遠不會傳送至瀏覽器——所有呼叫皆透過 Heym 後端代理。請參閱 [Credentials](./credentials.md) 與 [Settings](./user-settings.md)。

## 朗讀訊息

每個訊息泡泡（您的與助理的）在 **Copy** 旁都有一個喇叭按鈕。點擊即可播放該訊息；再次點擊——或播放其他訊息——即可停止。播放使用 ElevenLabs 多語言模型，因此會自動偵測文字的語言。

## 互動語音模式

聊天輸入區中的波形按鈕會開啟全螢幕、免持的語音模式（支援淺色/深色主題與行動裝置）：

1. 它會透過您的麥克風聆聽，並偵測您何時停止說話。
2. 您的語音會以 **Scribe** 轉錄（自動偵測語言——無需手動切換 TR/EN）。
3. 轉錄內容會以一般聊天訊息的形式，傳送至**同一個對話**中。
4. 助理的回覆會被朗讀出來，接著繼續聆聽。

使用 **mute** 按鈕可暫停聆聽，使用 **✕** 可結束（並釋放麥克風）。錄音功能在所有現代瀏覽器皆可運作，包括 Firefox。

## 備註

- 語音與認證的選擇屬於每位使用者的偏好設定；LLM 的作用中對話、模型與認證維持不變。
- ElevenLabs 的使用量（TTS 與 STT 兩者）皆計費於您自己的 ElevenLabs 帳戶。

## 相關

- [Chat Tab](../tabs/chat-tab.md) – 語音功能所在的 Dashboard 聊天
- [Credentials](./credentials.md) – API key 的儲存與參照方式
- [Settings](./user-settings.md) – Voice 分頁所在的位置
