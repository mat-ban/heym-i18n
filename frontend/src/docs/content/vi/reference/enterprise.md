# Enterprise

Cấp phép thương mại, hỗ trợ chuyên nghiệp và dịch vụ triển khai cho nền tảng Heym.

## Tổng quan

Heym được sử dụng miễn phí và tự lưu trữ (self-host) theo giấy phép source-available. Đối với các tổ chức cần cấp phép thương mại, hỗ trợ triển khai cấp sản xuất (production-grade), hoặc hỗ trợ chuyên biệt, gói Enterprise cung cấp các dịch vụ trực tiếp từ đội ngũ Heym.

| Dịch vụ | Mô tả |
|---------|-------------|
| **Hỗ trợ Agent cho Production** | Đánh giá kiến trúc, hướng dẫn thiết kế agent và workflow, và hỗ trợ trực tiếp đưa agent vào môi trường production |
| **Đào tạo công cụ** | Các buổi onboarding và đào tạo cho đội ngũ của bạn về trình soạn thảo workflow, các node AI, agent và tích hợp |
| **Hỏi đáp về Heym** | Truy cập trực tiếp đội ngũ kỹ thuật Heym để giải đáp thắc mắc về nền tảng, best practices và xử lý sự cố |
| **Triển khai Kubernetes** | Hỗ trợ thiết lập nhiều worker node, sidecar container, chiến lược mở rộng (scaling) và cấu hình cluster |
| **Tư vấn giải pháp** | Thiết kế giải pháp tùy chỉnh cho use case cụ thể của bạn, bao gồm lập kế hoạch tích hợp và đề xuất kiến trúc |
| **Hỗ trợ ưu tiên & SLA** | Thời gian phản hồi được đảm bảo và giải quyết vấn đề ưu tiên |
| **Phát triển tùy chỉnh** | Phát triển tính năng và sửa đổi phù hợp với yêu cầu của tổ chức bạn |

## Hỗ trợ Agent cho Production

Đội ngũ Heym giúp bạn thiết kế, xây dựng và gia cố (harden) agent và workflow cho các quy trình nghiệp vụ của bạn. Điều này bao gồm việc xem xét yêu cầu, đề xuất cấu hình node, và đảm bảo workflow của bạn tuân theo best practices về độ tin cậy, khả năng quan sát (observability) và quản trị (governance).

Hỗ trợ bao gồm tất cả các loại node như [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), và trigger [Cron](../nodes/cron-node.md) — cũng như các pattern nâng cao như [điều phối đa agent](./agent-architecture.md), các checkpoint [Human-in-the-Loop](./human-in-the-loop.md), và [thực thi song song](./parallel-execution.md) trên nhiều nhánh.

## Đào tạo công cụ

Các buổi đào tạo thực hành được thiết kế phù hợp với trình độ và use case của đội ngũ bạn:

- Trình soạn thảo workflow và [các tính năng canvas](./canvas-features.md)
- Các node hỗ trợ AI: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Kiến trúc agent](./agent-architecture.md) và điều phối đa agent
- Quản lý [Credentials](./credentials.md) và [tích hợp bên thứ ba](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md), và lập lịch với [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) và [biến toàn cục](./global-variables.md)
- Cộng tác [Teams](./teams.md) và [chia sẻ credentials](./credentials-sharing.md)
- Triển khai [Portal](./portal.md) cho giao diện chat hướng tới khách hàng
- [Traces](../tabs/traces-tab.md) và [Evals](../tabs/evals-tab.md) để quan sát workflow AI

## Triển khai Kubernetes

Hướng dẫn tiêu chuẩn [Chạy & Triển khai](../getting-started/running-and-deployment.md) bao gồm Docker Compose cho thiết lập production trên một máy chủ. Khách hàng Enterprise nhận được hỗ trợ triển khai Kubernetes cho production nhằm đạt tính sẵn sàng cao (high availability) và mở rộng theo chiều ngang (horizontal scaling):

- **Nhiều worker node** — Phân phối các backend worker của Heym trên nhiều node Kubernetes để dự phòng và cân bằng tải
- **Sidecar container** — Cấu hình các pattern sidecar cho thu thập log, monitoring agent, service mesh (Istio, Linkerd), và tiêm secret (Vault)
- **Lập kế hoạch tài nguyên** — Yêu cầu/giới hạn CPU và bộ nhớ, pod disruption budget, và chính sách horizontal pod autoscaling
- **Mạng** — Cấu hình Ingress controller, kết thúc TLS, và giao tiếp dịch vụ nội bộ giữa các pod backend, frontend và database
- **Lưu trữ bền vững** — Cấp phát volume cho database và vector store với StorageClass phù hợp và chiến lược sao lưu
- **Giám sát** — Tích hợp với Prometheus, Grafana, hoặc stack observability hiện có của bạn cho metrics container, log và cảnh báo

## Tư vấn giải pháp

Mỗi tổ chức vận hành agent trên các hệ thống và ràng buộc khác nhau. Đội ngũ Heym cung cấp dịch vụ tư vấn giúp bạn:

- Đánh giá liệu Heym có phù hợp với use case cụ thể của bạn không
- Thiết kế kiến trúc agent và workflow đầu-cuối (end-to-end)
- Lập kế hoạch tích hợp với hạ tầng hiện có và các dịch vụ bên thứ ba
- Gỡ lỗi (debug) các workflow phức tạp và giải quyết vấn đề production
- Di chuyển (migrate) các workflow hiện có từ các công cụ như n8n, Zapier, hoặc Make.com

## Liên hệ

Liên hệ đội ngũ enterprise tại **enterprise@heym.run** để được giải đáp về cấp phép, báo giá, hoặc đặt lịch một buổi gọi giới thiệu.

## Liên quan

- [Chạy & Triển khai](../getting-started/running-and-deployment.md) — Triển khai production với Docker Compose
- [Bảo mật](./security.md) — Các thực hành và cấu hình bảo mật nền tảng
- [Thực thi song song](./parallel-execution.md) — Mô hình thực thi đa worker
- [Teams](./teams.md) — Cộng tác nhóm và chia sẻ tài nguyên
- [Bộ tính năng đầy đủ](./features.md) — Tổng quan đầy đủ về các khả năng của Heym
