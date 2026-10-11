# Quyết định

Node **Decision** đặt các câu hỏi có định kiểu cho một decision model về trạng thái hiện tại của lượt chạy và trả về xác suất. Node này không sinh văn bản. Hãy dùng nó khi một workflow cần một phán đoán để rẽ nhánh — định tuyến, phân loại, xếp hạng, xác minh, hoặc gác một bước không thể hoàn tác.

Decision model (còn gọi là mô hình *System One*) là một loại mô hình khác với LLM. Không có prompt, không có system instruction, không có temperature và không có tool calling. Bạn gửi một **state** cùng một map các **question**, và mỗi câu trả lời trở về dưới dạng một con số kèm theo một phân phối xác suất. Vì câu trả lời chỉ gồm vài token, các mô hình này nhanh và rẻ hơn so với việc yêu cầu một [LLM](./llm-node.md) sinh JSON rồi phân tích nó.

Để sinh văn bản, hãy dùng node [LLM](./llm-node.md). Để dùng một mô hình có gọi công cụ, hãy dùng [Agent Node](./agent-node.md).

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | Phản hồi của provider nguyên văn — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Một credential *Decision Model*. Không phải credential LLM. |
| `model` | string | Tên mô hình, ví dụ `jev-latest` |
| `state` | expression | Những gì mô hình nên đọc (mặc định `$input.text`) |
| `questions` | array | Các hàng câu hỏi có thứ tự; ít nhất một |
| `customBodyEnabled` | boolean | Gửi một request body viết tay thay vì dùng form |
| `customBody` | expression (JSON) | Body để gửi khi bật toggle |
| `requestTimeoutSeconds` | number | Số giây chờ tối đa (mặc định: 60) |

### State

**State** là tình huống mà mô hình phán đoán. Nó chấp nhận một string, một object hoặc một array.

Một trường chứa đúng một expression sẽ giữ nguyên kiểu của chính nó, nên `$input` gửi chính object đó thay vì text của nó. Một template có chứa expression bên trong (`Ticket: $input.text`) sẽ được resolve thành một string. Hãy cung cấp cho mỗi câu hỏi đủ dữ liệu để trả lời: văn bản nguồn, danh tính, mối quan hệ, chính sách và các dữ kiện hiện tại.

## Các loại câu hỏi

Mỗi câu hỏi có một `id`, một `type`, `instructions`, và các tiêu chí phụ thuộc vào type.

`id` là cách workflow của bạn đọc lại câu trả lời. Nó **không bao giờ được gửi tới mô hình**, nên toàn bộ ý nghĩa phải nằm trong `instructions`. Viết `id: is_urgent` với `instructions: "Is it?"` sẽ không cho mô hình bất cứ thứ gì để làm việc.

### Noul

Liệu một điều kiện có đúng hay không. Trả về xác suất rằng câu trả lời là có, từ 0 đến 1.

Các tiêu chí là tùy chọn: **Yes means** và **No means** mô tả mỗi phía bao gồm những gì. Một giá trị gần 0.5 nghĩa là mô hình thấy có và không gần như ngang bằng nhau — không phải "cường độ trung bình".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Đọc nó bằng `$triage.answers.is_urgent.noul`.

### Choice

Chọn một tùy chọn từ một tập hợp do bạn định nghĩa. Trả về tùy chọn được chọn, toàn bộ phân phối, và một độ tin cậy được suy ra từ đó.

Hãy thêm một tùy chọn bao quát "không có cái nào ở trên" mỗi khi có thể không có gì phù hợp — mô hình không thể chọn một tùy chọn mà bạn không đưa ra.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Đọc nó bằng `$triage.answers.department.choice`, `.probabilities.billing` và `.confidence`.

### Score

Đánh giá trạng thái theo một rubric có thứ tự. Trả về một giá trị được gia trọng theo xác suất có thể nằm **giữa** các mức, cùng với legend và phân phối.

Các mức chạy từ thấp nhất trước, ít nhất hai và nhiều nhất mười. Mỗi mức nên mô tả một tình huống cụ thể và tự đứng độc lập.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Đọc nó bằng `$triage.answers.frustration.score`, `.legend` và `.confidence`.

## Generate with AI

**Generate with AI** biến một câu đơn giản thành một state template gợi ý và một tập các hàng câu hỏi. Hãy mô tả những gì bạn muốn phán đoán — "triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds" — và xem lại những gì trả về trước khi thêm nó vào node.

Việc soạn thảo được thực hiện bởi một LLM, nên hộp thoại yêu cầu một credential LLM. Decision model sẽ trả lời các câu hỏi sau đó, khi workflow chạy. Các id được sinh ra sẽ được loại trùng với các hàng mà node đã có, nên việc sinh hai lần không bao giờ ghi đè một answer key đã tồn tại.

Mỗi lần sinh được ghi lại trong tab [Traces](../tabs/traces-tab.md) dưới nguồn **Decision Questions**, cùng với các trace `decision.systemone` do chính node ghi tại thời điểm chạy.
## Custom request body

Bật **Custom request body** để gửi JSON do bạn tự viết thay vì dùng form. Sử dụng tính năng này cho endpoint có contract khác với contract mà form tạo ra.

Editor được khởi tạo từ form hiện tại, và các biểu thức bên trong nó được resolve trước khi request được gửi đi. Khi toggle được bật, trường State và các hàng câu hỏi sẽ bị bỏ qua. Response được truyền qua nguyên vẹn trong cả hai trường hợp, vì vậy một contract khác sẽ chỉ tạo ra một shape khác để các biểu thức của bạn đọc.

## Output

Node trả về chính xác những gì provider trả về. Không có gì bị đổi tên hay làm phẳng.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Branching theo một câu trả lời

Một node [Switch](./switch-node.md) định tuyến theo option được chọn, và một node [Condition](./condition-node.md) có thể gửi các trường hợp có độ tin cậy thấp đến nơi mà con người sẽ nhìn thấy chúng:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Một câu trả lời có kiểu đảm bảo shape, không đảm bảo tính đúng đắn. Hãy chọn ngưỡng dựa trên dữ liệu và hậu quả của chính bạn thay vì sao chép một con số từ ví dụ.

## Credential

Tạo một credential **Decision Model** trong tab [Credentials](../tabs/credentials-tab.md) với:

- **Base URL** — endpoint, ví dụ `https://api.typesafe.ai`. Heym sẽ thêm `/v1/systemone`.
- **API Key** — tùy chọn. Các endpoint không cần key có thể để trống.

Khi chỉnh sửa credential, key đã lưu sẽ được giữ nguyên nếu trường key để trống; chỉ nhập lại khi bạn muốn thay thế nó.

Cùng một credential có thể đánh giá các lần chạy [Evals](../tabs/evals-tab.md): với **LLM-as-Judge** được chọn, hãy chọn nó làm judge và decision model sẽ chấm điểm mọi câu trả lời so với output mong đợi.

Heym chặn các request outbound đến địa chỉ private và loopback theo mặc định, vì vậy một decision endpoint bạn tự chạy trên `localhost` hoặc dải private cần `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Decision model không xuất hiện trong bảng giá LLM mà Heym đồng bộ, vì vậy cột **Cost** trong [Traces](../tabs/traces-tab.md) sẽ trống đối với các lần gọi này. Số lượng token vẫn được ghi lại, và bạn có thể thêm giá của riêng mình bằng một pricing override.

## Errors

| Tình huống | Điều gì xảy ra |
|-----------|--------------|
| API key không hợp lệ | Node thất bại với thông báo nêu tên credential |
| Câu hỏi sai định dạng | Thông báo ở cấp trường của chính provider được đưa vào lỗi của node |
| Bị giới hạn tốc độ hoặc quá tải | Node thất bại với thông báo rằng tình trạng này là tạm thời — hãy bật [retry](../reference/features.md) cho node này để vượt qua |
| Question id bị trùng hoặc rỗng | Node thất bại trước khi bất kỳ request nào được gửi đi |

## Related

- [LLM Node](./llm-node.md) – Tạo văn bản thay vì đưa ra phán đoán
- [Agent Node](./agent-node.md) – Thu thập bằng chứng bằng các tool, rồi phán đoán tại đây
- [Switch Node](./switch-node.md) – Định tuyến theo option được chọn
- [Condition Node](./condition-node.md) – Gate theo độ tin cậy
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Credentials](../reference/credentials.md) – Các loại credential và các trường
- [Traces Tab](../tabs/traces-tab.md) – Kiểm tra các lần gọi decision và mức sử dụng token
