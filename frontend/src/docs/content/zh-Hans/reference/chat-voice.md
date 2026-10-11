# 语音对话 (TTS 与 STT)

Chat 标签页可以朗读消息，并运行免手动交互式语音模式，由 [ElevenLabs](https://elevenlabs.io) 提供支持。两个方向共用同一个 ElevenLabs 凭证：用于播放的 **text-to-speech** 和用于麦克风的 **Scribe speech-to-text**。

## 设置

1. 打开 **Settings**（右上角你的头像）→ **Voice** 标签页。
2. 选择一个 **ElevenLabs 凭证**，或点击 **Add credential** 创建一个。该 API key 需要在你的 ElevenLabs 账户中启用 **Text to Speech**、**Speech to Text** 和 **Voices** 权限。
3. 从你的 ElevenLabs 账户中选择一个 **Voice**。
4. 点击 **Save Voice Settings**。

如果你在完成此设置之前按下语音按钮，Voice 标签页会自动打开，以便你完成配置。

ElevenLabs API key 以加密方式存储，绝不会到达浏览器——所有调用都通过 Heym 后端代理。参见 [Credentials](./credentials.md) 和 [Settings](./user-settings.md)。

## 朗读消息

每个消息气泡（你的和助手的）在 **Copy** 旁边都有一个扬声器按钮。点击它即可播放该消息；再次点击——或播放另一条消息——即可停止。播放使用 ElevenLabs 多语言模型，因此文本语言会自动检测。

## 交互式语音模式

聊天输入框中的波形按钮会打开一个全屏、免手动的语音模式（适配浅色/深色和移动端）：

1. 它通过你的麦克风监听，并检测你何时停止说话。
2. 你的语音使用 **Scribe** 转写（语言自动检测——无需手动 TR/EN 切换）。
3. 转写文本作为普通聊天消息发送到**同一对话**中。
4. 助手的回复会被朗读出来，然后它恢复监听。

使用 **mute** 按钮暂停监听，使用 **✕** 退出（退出会释放麦克风）。录音在所有现代浏览器中均可工作，包括 Firefox。

## 说明

- 语音和凭证选择是每用户偏好设置；LLM 的活动对话、模型和凭证保持不变。
- ElevenLabs 的使用量（TTS 和 STT 两者）计入你自己的 ElevenLabs 账户。

## 相关

- [Chat Tab](../tabs/chat-tab.md) – 语音功能所在的 Dashboard 聊天
- [Credentials](./credentials.md) – API key 如何存储和引用
- [Settings](./user-settings.md) – Voice 标签页所在位置
