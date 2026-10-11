# Chat Voice (TTS a STT)

Karta Chat umí předčítat zprávy nahlas a spouštět interaktivní hlasový režim bez použití rukou, který je poháněn službou [ElevenLabs](https://elevenlabs.io). Oba směry využívají jeden přihlašovací údaj ElevenLabs: **text-to-speech** pro přehrávání a **Scribe speech-to-text** pro mikrofon.

## Nastavení

1. Otevřete **Settings** (váš avatar vpravo nahoře) → karta **Voice**.
2. Vyberte **přihlašovací údaj ElevenLabs**, nebo klikněte na **Add credential** a vytvořte jej. API klíč vyžaduje ve vašem účtu ElevenLabs povolená oprávnění **Text to Speech**, **Speech to Text** a **Voices**.
3. Zvolte **Voice** ze svého účtu ElevenLabs.
4. Klikněte na **Save Voice Settings**.

Pokud stisknete tlačítko hlasu před dokončením tohoto nastavení, karta Voice se automaticky otevře, abyste mohli konfiguraci dokončit.

API klíč ElevenLabs je uložen šifrovaně a nikdy se nedostane do prohlížeče — všechna volání jsou proxyována přes backend Heym. Viz [Přihlašovací údaje](./credentials.md) a [Settings](./user-settings.md).

## Přečtení zprávy nahlas

Každá bublina zprávy (vaše i asistentova) má vedle tlačítka **Copy** tlačítko reproduktoru. Kliknutím zprávu přehrajete; dalším kliknutím — nebo přehráním jiné zprávy — přehrávání zastavíte. Přehrávání využívá vícejazyčný model ElevenLabs, takže jazyk textu je rozpoznán automaticky.

## Interaktivní hlasový režim

Tlačítko průběhu zvuku ve vstupu chatu otevře celoobrazovkový hlasový režim bez použití rukou (přizpůsobený světlému/tmavému režimu i mobilu):

1. Naslouchá prostřednictvím vašeho mikrofonu a rozpozná, kdy přestanete mluvit.
2. Váš hlas je přepsán pomocí **Scribe** (jazyk rozpoznán automaticky — bez ručního přepínání TR/EN).
3. Přepis je odeslán jako běžná zpráva chatu ve **stejné konverzaci**.
4. Odpověď asistenta je přečtena nahlas a poté se obnoví naslouchání.

Tlačítkem **mute** pozastavíte naslouchání a tlačítkem **✕** režim ukončíte (čímž se uvolní mikrofon). Nahrávání funguje ve všech moderních prohlížečích, včetně Firefoxu.

## Poznámky

- Volba hlasu a přihlašovacího údaje je předvolbou jednotlivých uživatelů; aktivní konverzace, model a přihlašovací údaj pro LLM zůstávají nezměněny.
- Využití ElevenLabs (jak TTS, tak STT) je účtováno na váš vlastní účet ElevenLabs.

## Související

- [Karta Chat](../tabs/chat-tab.md) – Chat na dashboardu, kde hlas sídlí
- [Přihlašovací údaje](./credentials.md) – Jak jsou API klíče ukládány a odkazovány
- [Settings](./user-settings.md) – Kde se nachází karta Voice
