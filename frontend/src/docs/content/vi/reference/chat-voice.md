# Giọng nói trò chuyện (TTS & STT)

Tab Chat có thể đọc tin nhắn thành tiếng và chạy chế độ thoại tương tác rảnh tay, được cung cấp bởi [ElevenLabs](https://elevenlabs.io). Cả hai chiều đều sử dụng một credential ElevenLabs: **text-to-speech** để phát lại và **Scribe speech-to-text** cho microphone.

## Thiết lập

1. Mở **Settings** (avatar của bạn, góc trên bên phải) → tab **Voice**.
2. Chọn một **ElevenLabs credential**, hoặc nhấp **Add credential** để tạo mới. API key cần bật các quyền **Text to Speech**, **Speech to Text** và **Voices** trong tài khoản ElevenLabs của bạn.
3. Chọn một **Voice** từ tài khoản ElevenLabs của bạn.
4. Nhấp **Save Voice Settings**.

Nếu bạn nhấn nút voice trước khi thiết lập, tab Voice sẽ tự động mở để bạn hoàn tất cấu hình.

API key của ElevenLabs được lưu trữ mã hóa và không bao giờ tiếp cận trình duyệt — mọi lệnh gọi đều được proxy qua backend của Heym. Xem [Credentials](./credentials.md) và [Settings](./user-settings.md).

## Đọc tin nhắn thành tiếng

Mỗi bong bóng tin nhắn (của bạn và của trợ lý) đều có nút loa bên cạnh **Copy**. Nhấp vào để phát tin nhắn; nhấp lại — hoặc phát tin nhắn khác — để dừng. Phát lại sử dụng model đa ngôn ngữ của ElevenLabs, vì vậy ngôn ngữ của văn bản được tự động nhận diện.

## Chế độ thoại tương tác

Nút waveform trong ô nhập chat mở chế độ thoại toàn màn hình, rảnh tay (hỗ trợ light/dark và mobile):

1. Nó lắng nghe qua microphone và phát hiện khi bạn ngừng nói.
2. Giọng nói của bạn được chuyển thành văn bản bằng **Scribe** (tự động nhận diện ngôn ngữ — không cần chuyển đổi thủ công TR/EN).
3. Bản chuyển văn bản được gửi như một tin nhắn chat bình thường trong **cùng cuộc hội thoại**.
4. Phản hồi của trợ lý được đọc thành tiếng, sau đó tiếp tục lắng nghe.

Sử dụng nút **mute** để tạm dừng lắng nghe và nút **✕** để thoát (giải phóng microphone). Ghi âm hoạt động trên mọi trình duyệt hiện đại, bao gồm Firefox.

## Ghi chú

- Lựa chọn voice và credential là tùy chọn theo từng người dùng; cuộc hội thoại đang hoạt động, model và credential cho LLM không thay đổi.
- Việc sử dụng ElevenLabs (cả TTS và STT) được tính phí vào tài khoản ElevenLabs của riêng bạn.

## Liên quan

- [Chat Tab](../tabs/chat-tab.md) – Chat trên Dashboard nơi voice hoạt động
- [Credentials](./credentials.md) – Cách API key được lưu trữ và tham chiếu
- [Settings](./user-settings.md) – Nơi tab Voice nằm
