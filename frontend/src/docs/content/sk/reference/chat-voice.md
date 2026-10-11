# Chat Voice (TTS a STT)

Karta Chat dokáže čítať správy nahlas a spustiť interaktívny hlasový režim s voľnými rukami, ktorý poháňa [ElevenLabs](https://elevenlabs.io). Oba smery využívajú jeden ElevenLabs prihlasovací údaj: **text-to-speech** na prehrávanie a **Scribe speech-to-text** pre mikrofón.

## Nastavenie

1. Otvorte **Settings** (váš avatar, vpravo hore) → karta **Voice**.
2. Vyberte **ElevenLabs prihlasovací údaj** alebo kliknite na **Add credential** a vytvorte ho. API kľúč vyžaduje povolenia **Text to Speech**, **Speech to Text** a **Voices** vo vašom účte ElevenLabs.
3. Vyberte **Voice** zo svojho účtu ElevenLabs.
4. Kliknite na **Save Voice Settings**.

Ak stlačíte tlačidlo hlasu pred dokončením tohto nastavenia, karta Voice sa otvorí automaticky, aby ste mohli konfiguráciu dokončiť.

API kľúč ElevenLabs je uložený zašifrovaný a nikdy sa nedostane do prehliadača — všetky volania sú sprostredkované cez backend Heym. Pozrite si [Prihlasovacie údaje](./credentials.md) a [Settings](./user-settings.md).

## Čítanie správy nahlas

Každá bublina správy (vaša aj asistentova) má vedľa **Copy** tlačidlo reproduktora. Kliknutím naň správu prehráte; ďalším kliknutím — alebo prehratím inej správy — prehrávanie zastavíte. Prehrávanie využíva viacjazyčný model ElevenLabs, takže jazyk textu sa rozpozná automaticky.

## Interaktívny hlasový režim

Tlačidlo s priebehom zvuku v poli pre vstup do chatu otvorí celoobrazovkový hlasový režim s voľnými rukami (prispôsobený svetlému/tmavému režimu a mobilným zariadeniam):

1. Počúva cez váš mikrofón a rozpozná, kedy prestanete hovoriť.
2. Vaša reč sa prepíše pomocou **Scribe** (jazyk sa rozpozná automaticky — žiadne manuálne prepínanie TR/EN).
3. Prepis sa odošle ako bežná správa v chate v **tej istej konverzácii**.
4. Odpoveď asistenta sa prečíta nahlas a potom sa obnoví počúvanie.

Tlačidlom **mute** pozastavíte počúvanie a tlačidlom **✕** režim ukončíte (čím sa uvoľní mikrofón). Nahrávanie funguje vo všetkých moderných prehliadačoch vrátane Firefoxu.

## Poznámky

- Výber hlasu a prihlasovacích údajov sú preferencie jednotlivých používateľov; aktívna konverzácia, model a prihlasovací údaj pre LLM zostávajú nezmenené.
- Využitie ElevenLabs (TTS aj STT) sa účtuje na váš vlastný účet ElevenLabs.

## Súvisiace

- [Karta Chat](../tabs/chat-tab.md) – Chat v dashboarde, kde hlas sídli
- [Prihlasovacie údaje](./credentials.md) – Ako sa API kľúče ukladajú a odkazujú
- [Settings](./user-settings.md) – Kde sa nachádza karta Voice
