# Chat Voice (TTS & STT)

Het tabblad Chat kan berichten hardop voorlezen en een handsfree interactieve spraakmodus uitvoeren, mogelijk gemaakt door [ElevenLabs](https://elevenlabs.io). Beide richtingen gebruiken één ElevenLabs-referentie: **text-to-speech** voor afspelen en **Scribe speech-to-text** voor de microfoon.

## Configuratie

1. Open **Settings** (uw avatar, rechtsboven) → tabblad **Voice**.
2. Kies een **ElevenLabs-referentie**, of klik op **Add credential** om er een aan te maken. De API-sleutel vereist de machtigingen **Text to Speech**, **Speech to Text** en **Voices** die zijn ingeschakeld in uw ElevenLabs-account.
3. Kies een **Voice** uit uw ElevenLabs-account.
4. Klik op **Save Voice Settings**.

Als u op een spraakknop drukt voordat u dit hebt geconfigureerd, wordt het tabblad Voice automatisch geopend zodat u de configuratie kunt voltooien.

De ElevenLabs API-sleutel wordt versleuteld opgeslagen en bereikt nooit de browser — alle aanroepen worden via de Heym-backend geproxied. Zie [Referenties](./credentials.md) en [Settings](./user-settings.md).

## Een bericht hardop voorlezen

Elke berichtballon (de uwe en die van de assistent) heeft een luidsprekerknop naast **Copy**. Klik erop om het bericht af te spelen; klik nogmaals — of speel een ander bericht af — om te stoppen. Bij het afspelen wordt het meertalige model van ElevenLabs gebruikt, zodat de taal van de tekst automatisch wordt gedetecteerd.

## Interactieve spraakmodus

De golfvormknop in de chatinvoer opent een schermvullende, handsfree spraakmodus (licht/donker en mobielbewust):

1. Er wordt via uw microfoon geluisterd en gedetecteerd wanneer u stopt met spreken.
2. Uw spraak wordt getranscribeerd met **Scribe** (taal automatisch gedetecteerd — geen handmatige TR/EN-schakelaar).
3. Het transcript wordt verzonden als een normaal chatbericht in **dezelfde conversatie**.
4. Het antwoord van de assistent wordt hardop voorgelezen, waarna het luisteren wordt hervat.

Gebruik de **mute**-knop om het luisteren te pauzeren en de **✕** om af te sluiten (waarbij de microfoon wordt vrijgegeven). Opnemen werkt in alle moderne browsers, inclusief Firefox.

## Opmerkingen

- Spraak- en referentiekeuze zijn gebruikersvoorkeuren; de actieve conversatie, het model en de referentie voor de LLM blijven ongewijzigd.
- ElevenLabs-gebruik (zowel TTS als STT) wordt gefactureerd op uw eigen ElevenLabs-account.

## Gerelateerd

- [Chat Tab](../tabs/chat-tab.md) – Dashboardchat waar spraak zich bevindt
- [Referenties](./credentials.md) – Hoe API-sleutels worden opgeslagen en gerefereerd
- [Settings](./user-settings.md) – Waar het tabblad Voice zich bevindt
