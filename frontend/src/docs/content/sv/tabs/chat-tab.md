# Chat-fliken

**Chat**-fliken tillhandahåller ett direkt LLM-chattgränssnitt. Använd den för att testa modeller, ställa frågor, köra befintliga Workflows eller skapa en ny Workflow från en begäran i naturligt språk.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

## Konfiguration

1. Välj en [credential](./credentials-tab.md) (API-nyckel för OpenAI, Google, etc.)
2. Välj en modell från listmenyn (modeller laddas från den valda credentialen)
3. Börja skriva för att skicka meddelanden

En konversation kan även startas från chattrutan på [Workflows-fliken](./workflows-tab.md). Den skickar det första meddelandet och öppnar den nya konversationen här med svaret redan strömmande.

## Funktioner

- **Kontext för globala variabler** – [Global Variables](../reference/global-variables.md) är tillgängliga för LLM:en, så det går att ställa frågor om eller referera till lagrade värden
- **Kontext för workspace-mallar** – Delade Workflow- och nodmallar i den aktuella arbetsytan inkluderas som kontext, så Chat kan svara på frågor om tillgängliga mallar
- **Långkörande agent** – Chat fortsätter arbeta i backend även om webbläsaren stängs, så det går att återvända från en annan enhet och fortsätta samma konversation
- **Skapa Workflow** – Be Chat skapa eller konfigurera en Workflow, och den använder samma Workflow AI Builder-motor som redigeringsassistenten för att generera och spara Workflowen
- **Skapa Kanban-uppgift** – Be naturligt om att lägga till en uppgift eller skapa ett kort. Chat lägger till det i den första kolumnen på den begärda tavlan; när det finns flera tavlor och ingen namnges visar Chat en tavlväljare innan kortet skapas
- **Köade uppföljningar** – Skicka fler meddelanden medan ett svar strömmar. Köade meddelanden sparas, kan redigeras eller tas bort innan de startar och körs i ordning efter det aktiva svaret
- **Kanban boards** – Ask naturally to add, assign, move, update or comment on a task, list your overdue tasks or what waits for a review, or create and arrange boards and columns. When you have multiple boards and do not name one, Chat presents a board picker before creating a card. See [Board › From Chat and MCP](./board-tab.md#from-chat-and-mcp)
- **Send now** – Click **Send now** beside a queued message to stop the active reply and send that message immediately. The partial reply stays in the conversation, followed by your message and the new answer. The message keeps its files and chosen model; the other queued messages remain and resume in order afterward
- **Changing direction** – After **Send now**, your latest message controls the task. A cancelled question stays as context and is not another pending job. Interrupted requests appear as **cancelled** in Traces and run history, including ones stopped before the model answers
