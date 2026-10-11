# Chat Voice (TTS ja STT)

Vahekaart Chat saab sõnumeid valjusti ette lugeda ja käivitada käed-vabad interaktiivse häälerežiimi, mida toetab [ElevenLabs](https://elevenlabs.io). Mõlemad suunad kasutavad üht ElevenLabs mandaati: **text-to-speech** taasesituseks ja **Scribe speech-to-text** mikrofoni jaoks.

## Seadistamine

1. Avage **Settings** (teie avatar, ülal paremal) → **Voice** vahekaart.
2. Valige **ElevenLabs mandaat** või klõpsake **Add credential**, et see luua. API võti vajab ElevenLabs kontol lubatud **Text to Speech**, **Speech to Text** ja **Voices** õigusi.
3. Valige oma ElevenLabs kontolt **Voice**.
4. Klõpsake **Save Voice Settings**.

Kui vajutate häälenuppu enne seadistamist, avaneb Voice vahekaart automaatselt, et saaksite konfigureerimise lõpetada.

ElevenLabs API võti salvestatakse krüpteeritult ega jõua kunagi brauserini — kõik päringud suunatakse Heymi backend'i kaudu. Vt [Mandaadid](./credentials.md) ja [Settings](./user-settings.md).

## Sõnumi valjusti lugemine

Igal sõnumimullil (nii teie kui assistendi omal) on **Copy** kõrval kõlarinupp. Klõpsake sellel sõnumi esitamiseks; klõpsake uuesti — või esitage teine sõnum — peatamiseks. Taasesitus kasutab ElevenLabs mitmekeelset mudelit, seega teksti keel tuvastatakse automaatselt.

## Interaktiivne häälerežiim

Chat-sisendi lainekuju nupp avab täisekraanil käed-vabad häälerežiimi (hele/tume ja mobiilisõbralik):

1. See kuulab teie mikrofoni kaudu ja tuvastab, millal te rääkimise lõpetate.
2. Teie kõne transkribeeritakse **Scribe**'iga (keel tuvastatakse automaatselt — käsitsi TR/EN lülitit pole).
3. Transkript saadetakse tavalise chat-sõnumina **samas vestluses**.
4. Assistendi vastus loetakse valjusti ette, seejärel jätkab see kuulamist.

Kasutage **mute** nuppu kuulamise peatamiseks ja **✕** väljumiseks (mis vabastab mikrofoni). Salvestamine töötab kõigis kaasaegsetes brauserites, sealhulgas Firefoxis.

## Märkused

- Hääle ja mandaadi valik on kasutajapõhised eelistused; aktiivne vestlus, mudel ja LLM-i mandaat jäävad muutumatuks.
- ElevenLabs kasutus (nii TTS kui STT) arveldatakse teie enda ElevenLabs konto alusel.

## Seotud

- [Chat Tab](../tabs/chat-tab.md) – Töölaua chat, kus hääl asub
- [Mandaadid](./credentials.md) – Kuidas API võtmeid salvestatakse ja viidatakse
- [Settings](./user-settings.md) – Kus Voice vahekaart asub
