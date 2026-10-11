# Chat med Heym

Chat med Heym är en siddmedveten assistent som är tillgänglig från dokumentationens sidhuvud. Den öppnas i en centrerad dialogruta, låter användaren välja en autentiseringsuppgift och modell för LLM samt besvarar frågor med den aktuella dokumentsidan som första kontext.

## Öppna dialogrutan

1. Öppna valfri sida under `/docs`
2. Klicka på **Chat med Heym** i sidhuvudet
3. Välj en [autentiseringsuppgift](../tabs/credentials-tab.md) och modell
4. Ställ en fråga om sidan eller plattformen

På mindre skärmar visas endast en ikon för utlösaren; på större skärmar visas hela etiketten.

## Vilken kontext som används

- Den för närvarande öppna docs-sökvägen injiceras i begäran som kontextuell vägledning
- Backend använder fortfarande den befintliga dashboard-chat-endpointen och sökverktygen för dokumentation
- Kontonivåns [användarregler](./user-settings.md) fortsätter att gälla eftersom samma chat-backend återanvänds
- Förberedelsesteg i realtid streamas in i assistentbubblan före det slutliga svaret, på samma sätt som i dashboard-chatten
- Förtydligandefrågor visas som kort, precis som i [Chat-fliken](../tabs/chat-tab.md). När en workflow-begäran behöver en autentiseringsuppgift går det att välja en eller skapa en från kortet. När den behöver en datatabell går det att välja en av sina tabeller eller skapa en ny på samma sätt.

När dialogrutan öppnas på en specifik artikel visas en liten badge med den aktiva docs-sökvägen så att det går att bekräfta vilken sida som prioriteras.

## Sessionsbeteende

- Val av autentiseringsuppgift och modell ligger kvar så länge dialogrutan är monterad
- Meddelandehistoriken är endast sessionsbaserad och rensas när dialogrutan stängs
- Klick på bakgrunden, `Escape` och stängningsknappen återställer alla sessionen
- **Stop** avbryter det aktuella streamande svaret
- Dialogrutan är avsiktligt bred och har fast storlek; den erbjuder ingen växling till fullskärm

## När den bör användas

- Ställ följdfrågor medan en nod- eller referenssida läses
- Klargör funktionsskillnader utan att lämna dokumentationen
- Hitta rätt artikel innan editorn öppnas

För att bygga eller ändra workflows direkt används istället [AI-assistenten](./ai-assistant.md) på editorsidan.

## Relaterat

- [AI-assistent](./ai-assistant.md) – Editorchat för att bygga workflows
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till LLM-autentiseringsuppgifter som används av dialogrutan
- [Inställningar](./user-settings.md) – Globala användarregler som tillämpas på AI-ytor
- [Snabbstart](../getting-started/quick-start.md) – Genomgång av det första workflowet
