# Chat med Heym

Chat med Heym er en sidebevidst assistent, der er tilgængelig fra dokumentationsheaderen. Den åbner i en centreret dialog, hvor det er muligt at vælge en LLM-legitimationsoplysning og model, og den besvarer spørgsmål med den aktuelle dokumentationsside som første kontekst.

## Åbning af dialogen

1. Åbn enhver side under `/docs`
2. Klik på **Chat med Heym** i headeren
3. Vælg en [legitimationsoplysning](../tabs/credentials-tab.md) og model
4. Stil et spørgsmål om siden eller platformen

På mindre skærme er triggeren kun et ikon; på større skærme vises hele etiketten.

## Hvilken kontekst der anvendes

- Den aktuelt åbne dokumentationssti injiceres i anmodningen som kontekstuel vejledning
- Backend'en bruger stadig det eksisterende dashboard-chat-endpoint og dokumentationssøgeværktøjer
- Brugerens konto-niveau [Brugerregler](./user-settings.md) fortsætter med at gælde, da den samme chat-backend genbruges
- Live forberedelsestrin streames ind i assistentboblen før det endelige svar, svarende til dashboard-chatten
- Afklaringsspørgsmål vises som kort, på samme måde som i [Chat-fanen](../tabs/chat-tab.md). Når en workflow-anmodning kræver en legitimationsoplysning, kan man vælge en eller oprette den fra kortet. Når der kræves en datatabel, kan man vælge en af tabellerne eller oprette en ny på samme måde.

Når dialogen åbnes på en specifik artikel, vises et lille badge med den aktive dokumentationssti, så det er muligt at bekræfte, hvilken side der prioriteres.

## Sessionadfærd

- Valg af legitimationsoplysning og model forbliver på plads, mens dialogen er monteret
- Beskedhistorik er kun sessionsbaseret og nulstilles, når dialogen lukkes
- Klik på baggrund, `Escape` og luk-knappen nulstiller alle sessionen
- **Stop** afbryder det aktuelle streaming-svar
- Dialogen er bevidst bred og fast størrelse; den tilbyder ikke en fuldskærmstoggle

## Når den skal bruges

- Stil opfølgende spørgsmål, mens der læses en node eller reference-side
- Afklar funktionsforskelle uden at forlade dokumentationen
- Find den rigtige artikel, før editoren åbnes

Hvis der ønskes at opbygge eller ændre workflows direkte, skal editorens [AI Assistant](./ai-assistant.md) bruges i stedet.

## Relateret

- [AI Assistant](./ai-assistant.md) – Editor-chat til opbygning af workflows
- [Legitimationsoplysninger-fan](../tabs/credentials-tab.md) – Tilføj LLM-legitimationsoplysninger, der bruges af dialogen
- [Indstillinger](./user-settings.md) – Globale brugerregler, der anvendes på AI-overflader
- [Hurtig start](../getting-started/quick-start.md) – Første workflow-gennemgang
