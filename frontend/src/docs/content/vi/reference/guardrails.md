# Guardrails

Guardrails cho phép bạn chặn các tin nhắn người dùng không an toàn hoặc không mong muốn trước khi chúng đến node [LLM](../nodes/llm-node.md) hoặc [Agent](../nodes/agent-node.md). Khi một tin nhắn khớp với danh mục bị chặn, node sẽ ném ra lỗi thay vì thực thi, và bạn có thể bắt lỗi này bằng node [Error Handler](../nodes/error-handler-node.md).

## Bật Guardrails

Mở bảng Properties cho node **LLM** hoặc **AI Agent** và cuộn đến công tắc **Enable Guardrails** (biểu tượng khiên). Đánh dấu vào ô để hiển thị phần cấu hình.

## Guardrail Credential và Model

Khi guardrails được bật, bạn **bắt buộc** phải chọn **credential và model** cho kiểm tra an toàn nội dung. Việc kiểm tra guardrail sử dụng credential và model đã chọn từ node — không có phương án dự phòng, không có biến môi trường. Hãy dùng credential OpenAI hoặc Google để lọc nội dung đáng tin cậy, đặc biệt khi model chính của bạn dùng nhà cung cấp tùy chỉnh (ví dụ: Zhipu, GLM) có thể không hỗ trợ guardrails hoặc trả về lỗi API (ví dụ: 404).

Workflow không thể chạy cho đến khi cả Guardrail Credential và Guardrail Model đều được chọn.

## Danh mục bị chặn

Chọn một hoặc nhiều danh mục để chặn. Tin nhắn khớp với bất kỳ danh mục nào được đánh dấu sẽ bị từ chối.

| Danh mục | Nội dung bị chặn |
|---|---|
| **Violence** | Nội dung bạo lực, đe dọa hoặc gây hại về thể chất |
| **Hate Speech** | Phân biệt đối xử, phân biệt chủng tộc hoặc cố chấp |
| **Sexual Content** | Nội dung hoặc tình huống khiêu dâm rõ ràng |
| **NSFW / Profanity** | Ngôn ngữ thô tục, chửi thề, lăng mạ rõ ràng và tiếng lóng người lớn bằng bất kỳ ngôn ngữ nào |
| **Self-Harm** | Tự tử, tự gây thương tích hoặc nội dung liên quan |
| **Harassment** | Tấn công cá nhân, xúc phạm, bắt nạt hoặc đe dọa |
| **Illegal Activity** | Hướng dẫn thực hiện hành vi phạm pháp |
| **Political Extremism** | Nội dung chính trị cực đoan hoặc tuyên truyền bạo lực |
| **Spam / Phishing** | Spam, lừa đảo hoặc tấn công kỹ thuật xã hội |
| **Personal Data Request** | Yêu cầu thông tin riêng tư hoặc thông tin nhận dạng cá nhân |
| **Prompt Injection** | Nỗ lực ghi đè hướng dẫn hệ thống, chèn prompt độc hại hoặc thao túng hành vi của model |

## Độ nhạy

Cài đặt **Sensitivity** kiểm soát mức độ nghiêm ngặt trong việc phát hiện vi phạm:

| Mức | Hành vi |
|---|---|
| **Low** | Đánh dấu cả các trường hợp ranh giới hoặc mơ hồ |
| **Medium** *(mặc định)* | Đánh dấu các vi phạm rõ ràng; bỏ qua các trường hợp ranh giới |
| **High** | Chỉ đánh dấu các vi phạm cực đoan, không thể nhầm lẫn |

## Cách hoạt động của việc phát hiện

Việc phát hiện sử dụng **guardrail credential và model đã chọn**:

- **Credential OpenAI** — sử dụng [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (miễn phí, nhanh, không tiêu tốn token) cho năm danh mục được hỗ trợ gốc (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Các danh mục còn lại được kiểm tra bằng lệnh gọi phân loại LLM sử dụng guardrail model đã chọn.
- **Credential Google / tùy chỉnh** — tất cả danh mục được kiểm tra bằng lệnh gọi phân loại LLM sử dụng guardrail credential và model đã chọn.

Khi model chính của bạn dùng nhà cung cấp tùy chỉnh (ví dụ: Zhipu, Cerebras) có thể trả về 404 hoặc lỗi API khác, hãy chọn **credential OpenAI hoặc Google** cho guardrails.

## Định dạng lỗi

Khi guardrail được kích hoạt, node ném ra lỗi với thông báo:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Kết quả của node `output` cũng bao gồm `guardrail_violated_categories` (mảng các nhãn danh mục bị vi phạm) để Debug Panel và Execution History có thể hiển thị "Blocked by: X, Y" một cách rõ ràng.

Sử dụng tùy chọn **Continue on error** của node (hoặc node [Error Handler](../nodes/error-handler-node.md)) để định tuyến workflow sang nhánh dự phòng khi guardrails kích hoạt.

## Workflow ví dụ

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Lưu ý

- **Không thử lại**: Vi phạm guardrail là các chặn có chủ đích và không bao giờ được thử lại, ngay cả khi node có bật "Retry on failure".
- Không cần migration cơ sở dữ liệu — cài đặt guardrail được lưu trong JSON node của workflow cùng với dữ liệu node khác.
- Guardrails kiểm tra **tin nhắn người dùng** đã được giải quyết (sau khi các biểu thức template được đánh giá), không phải template thô.
- Đặt **không có danh mục** trong khi guardrails được bật tương đương với việc tắt chúng — không có kiểm tra nào được thực hiện.
- Ở mức **Low**, phân loại LLM luôn chạy (độ phủ đa ngôn ngữ tốt nhất). Credential OpenAI còn chạy thêm Moderation API.
- Ở mức **Medium/High**, credential OpenAI sử dụng Moderation API cho các danh mục được hỗ trợ gốc và phân loại LLM cho phần còn lại. Credential Google/tùy chỉnh luôn sử dụng phân loại LLM.
- Phân loại LLM **không phụ thuộc ngôn ngữ** — nó phát hiện vi phạm bằng tiếng Thổ Nhĩ Kỳ, tiếng Ả Rập, tiếng Nga, tiếng Tây Ban Nha và các ngôn ngữ khác.
