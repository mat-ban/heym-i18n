# Biến

Node **Variable** đặt hoặc cập nhật một biến có thể truy cập từ bất kỳ node nào thông qua `$vars.variableName` (cục bộ trong workflow) hoặc `$global.variableName` (liên tục). Sử dụng node này cho các bộ đếm, danh sách tích lũy và trạng thái chia sẻ trong toàn bộ workflow.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.value`, hoặc truy cập qua `$vars.variableName` / `$global.variableName` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `variableName` | string | Tên biến (được dùng làm `$vars.variableName` hoặc `$global.variableName`). Tránh [các tên dành riêng](../reference/expression-dsl.md). |
| `variableValue` | expression | Giá trị cần đặt. Hỗ trợ biểu thức. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Ép kiểu (mặc định: auto) |
| `isGlobal` | boolean | Khi `true`, lưu vào [Global Variable Store](../reference/global-variables.md) (liên tục, phạm vi người dùng). Khi `false` hoặc bỏ qua, cục bộ trong workflow (trong bộ nhớ). |

## Biến mảng

Khởi tạo mảng với `$array()` hoặc `$array("a", "b")` trong node Variable trước khi sử dụng `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Sau đó thêm các phần tử (không có `$` bên trong dấu ngoặc đơn):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Quy tắc quan trọng

**Không bao giờ sử dụng `$` bên trong dấu ngoặc đơn của phương thức:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – làm hỏng biểu thức

## Ví dụ – Bộ đếm

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Liên quan

- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Node Loop](./loop-node.md) – Thu thập các phần tử với Variable trong thân vòng lặp
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, các tên dành riêng
- [Biến toàn cục](../reference/global-variables.md) – Biến liên tục với `isGlobal`
