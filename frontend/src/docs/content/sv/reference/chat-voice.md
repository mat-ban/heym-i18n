# Chat-röst (TTS och STT)

Fliken Chat kan läsa meddelanden högt och köra ett interaktivt röstläge för handsfree-användning, med stöd av [ElevenLabs](https://elevenlabs.io). Båda riktningarna använder en och samma ElevenLabs-autentiseringsuppgift: **text-till-tal** för uppspelning och **Scribe tal-till-text** för mikrofonen.

## Konfiguration

1. Öppna **Inställningar** (avataren, uppe till höger) → fliken **Röst**.
2. Välj en **ElevenLabs-autentiseringsuppgift**, eller klicka på **Lägg till autentiseringsuppgift** för att skapa en. API-nyckeln behöver behörigheterna **Text to Speech**, **Speech to Text** och **Voices** aktiverade i ElevenLabs-kontot.
3. Välj en **Röst** från ElevenLabs-kontot.
4. Klicka på **Spara röstinställningar**.

Om en röstknapp trycks innan detta har konfigurerats öppnas fliken Röst automatiskt så att konfigurationen kan slutföras.

ElevenLabs API-nyckel lagras krypterad och når aldrig webbläsaren — alla anrop proxas via Heym-backend. Se [Autentiseringsuppgifter](./credentials.md) och [Inställningar](./user-settings.md).

## Läs ett meddelande högt

Varje meddelandebubbla (både egna och assistentens) har en högtalarknapp bredvid **Kopiera**. Klicka på den för att spela upp meddelandet; klicka igen — eller spela upp ett annat meddelande — för att stoppa. Uppspelningen använder ElevenLabs flerspråkiga modell, så textens språk identifieras automatiskt.

## Interaktivt röstläge

Vågforms-knappen i chattinmatningen öppnar ett fullskärms-röstläge för handsfree-användning (anpassat för ljust/mörkt tema och mobil):

1. Det lyssnar via mikrofonen och identifierar när talet upphör.
2. Talet transkriberas med **Scribe** (språk identifieras automatiskt — ingen manuell TR/EN-växling).
3. Transkriptionen skickas som ett vanligt chattmeddelande i **samma konversation**.
4. Assistentens svar läses upp högt och därefter återupptas lyssnandet.

Använd **mute**-knappen för att pausa lyssnandet och **✕** för att avsluta (vilket frigör mikrofonen). Inspelning fungerar i alla moderna webbläsare, inklusive Firefox.

## Anteckningar

- Val av röst och autentiseringsuppgift är användarspecifika inställningar; den aktiva konversationen, modellen och autentiseringsuppgiften för LLM:en påverkas inte.
- ElevenLabs-användning (både TTS och STT) faktureras till det egna ElevenLabs-kontot.

## Relaterat

- [Fliken Chat](../tabs/chat-tab.md) – Dashboardchatten där rösten finns
- [Autentiseringsuppgifter](./credentials.md) – Hur API-nycklar lagras och refereras
- [Inställningar](./user-settings.md) – Var fliken Röst finns
