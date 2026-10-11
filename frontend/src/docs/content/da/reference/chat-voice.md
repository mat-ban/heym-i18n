# Chat Voice (TTS & STT)

Chat-fanen kan oplæse beskeder højt og køre en hænderfri, interaktiv stemmemodus, drevet af [ElevenLabs](https://elevenlabs.io). Begge retninger bruger én ElevenLabs-legitimationsoplysning: **text-to-speech** til afspilning og **Scribe speech-to-text** til mikrofonen.

## Opsætning

1. Åbn **Indstillinger** (brugerens avatar, øverst til højre) → fanen **Voice**.
2. Vælg en **ElevenLabs-legitimationsoplysning**, eller klik på **Tilføj legitimationsoplysning** for at oprette en. API-nøglen skal have tilladelser til **Text to Speech**, **Speech to Text** og **Voices** aktiveret i ElevenLabs-kontoen.
3. Vælg en **Voice** fra ElevenLabs-kontoen.
4. Klik på **Gem stemmeindstillinger**.

Hvis der trykkes på en stemmeknap før opsætningen er fuldført, åbnes Voice-fanen automatisk, så konfigurationen kan afsluttes.

ElevenLabs API-nøglen lagres krypteret og når aldrig browseren - alle kald proxyeres gennem Heym-backendet. Se [Legitimationsoplysninger](./credentials.md) og [Indstillinger](./user-settings.md).

## Oplæsning af beskeder

Hver beskedboble (både brugerens og assistentens) har en højttalerknap ved siden af **Kopier**. Klik for at afspille beskeden; klik igen - eller afspil en anden besked - for at stoppe. Afspilningen bruger ElevenLabs' multilingual model, så tekstens sprog detekteres automatisk.

## Interaktiv stemmemodus

Bølgeformsknappen i chat-input åbner en fuldskærms, hænderfri stemmemodus (lys/mørk og mobilvenlig):

1. Den lytter gennem mikrofonen og detekterer, når der holdes op med at tale.
2. Talen transkriberes med **Scribe** (sprog detekteres automatisk - ingen manuel TR/EN-skifter).
3. Transkriptet sendes som en normal chatbesked i den **samme samtale**.
4. Assistents svar oplæses højt, hvorefter den fortsætter med at lytte.

Brug **mute**-knappen til midlertidigt at stoppe lytningen og **✕** for at afslutte (hvilket frigiver mikrofonen). Optagelse fungerer i alle moderne browsere, inklusive Firefox.

## Bemærkninger

- Stemme- og legitimationsvalg er brugerpræferencer; den aktive samtale, model og legitimationsoplysning til LLM ændres ikke.
- ElevenLabs-forbrug (både TTS og STT) faktureres til den egne ElevenLabs-konto.

## Relateret

- [Chat-faneblad](../tabs/chat-tab.md) – Dashboard-chat hvor stemmemodus findes
- [Legitimationsoplysninger](./credentials.md) – Hvordan API-nøgler lagres og refereres
- [Indstillinger](./user-settings.md) – Hvor Voice-fanen findes
