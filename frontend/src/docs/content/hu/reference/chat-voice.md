# Chat Voice (TTS és STT)

A Chat fül képes a üzenetek felolvasására és egy kéz nélküli interaktív hangmód futtatására, amelyet a [ElevenLabs](https://elevenlabs.io) működtet. Mindkét irány egyetlen ElevenLabs hitelesítési adatot használ: **text-to-speech** a lejátszáshoz és **Scribe speech-to-text** a mikrofonhoz.

## Beállítás

1. Nyissa meg a **Settings** (a profilképe, jobb felső sarok) → **Voice** fület.
2. Válasszon egy **ElevenLabs hitelesítési adatot**, vagy kattintson az **Add credential** gombra új létrehozásához. Az API-kulcsnak a **Text to Speech**, **Speech to Text** és **Voices** jogosultságokkal kell rendelkeznie az Ön ElevenLabs-fiókjában.
3. Válasszon egy **Voice**-ot az ElevenLabs-fiókjából.
4. Kattintson a **Save Voice Settings** gombra.

Ha a beállítás befejezése előtt megnyom egy hanggombot, a Voice fül automatikusan megnyílik, hogy befejezhesse a konfigurálást.

Az ElevenLabs API-kulcs titkosítva tárolódik, és soha nem kerül a böngészőbe — minden hívás a Heym backendjén keresztül történik proxyként. Lásd: [Hitelesítési adatok](./credentials.md) és [Settings](./user-settings.md).

## Üzenet felolvasása

Minden üzenetbuborék (az Öné és az asszisztensé is) rendelkezik egy hangszóró gombbal a **Copy** mellett. Kattintson rá az üzenet lejátszásához; kattintson ismét — vagy játsszon le egy másik üzenetet — a leállításhoz. A lejátszás az ElevenLabs többnyelvű modelljét használja, így a szöveg nyelve automatikusan felismerésre kerül.

## Interaktív hangmód

A chat bemenetében lévő hullámforma gomb egy teljes képernyős, kéz nélküli hangmódot nyit meg (világos/sötét és mobilbarát):

1. A mikrofonon keresztül figyel, és érzékeli, amikor Ön abbahagyja a beszédet.
2. A beszédét a **Scribe** segítségével írja át (nyelv automatikusan felismerve — nincs szükség manuális TR/EN váltásra).
3. Az átirat normál chat üzenetként kerül elküldésre ugyanabban a beszélgetésben.
4. Az asszisztens válasza felolvasásra kerül, majd újra figyelni kezd.

Használja a **mute** gombot a figyelés szüneteltetéséhez és a **✕** gombot a kilépéshez (amely felszabadítja a mikrofont). A felvétel minden modern böngészőben működik, beleértve a Firefoxot is.

## Megjegyzések

- A hang és a hitelesítési adat kiválasztása felhasználónkénti beállítás; az aktív beszélgetés, a modell és az LLM hitelesítési adata változatlan marad.
- Az ElevenLabs használata (mind a TTS, mind az STT) az Ön saját ElevenLabs-fiókjára kerül kiszámlázásra.

## Kapcsolódó

- [Chat fül](../tabs/chat-tab.md) – Dashboard chat, ahol a hang található
- [Hitelesítési adatok](./credentials.md) – Hogyan tárolódnak és hivatkoznak az API-kulcsok
- [Settings](./user-settings.md) – Ahol a Voice fül található
