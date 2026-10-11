# Chat Balsas (TTS & STT)

Chat skiltis gali perskaityti žinutes garsiai ir veikti interaktyviu balso režimu be rankų, kurį palaiko [ElevenLabs](https://elevenlabs.io). Abi kryptys naudoja vieną ElevenLabs kredencialą: **text-to-speech** atkūrimui ir **Scribe speech-to-text** mikrofonui.

## Nustatymas

1. Atidarykite **Nustatymai** (Jūsų avataras, viršutiniame dešiniajame kampe) → **Balsas** skiltis.
2. Pasirinkite **ElevenLabs kredencialą**, arba spustelėkite **Pridėti kredencialą**, kad sukurtumėte naują. API raktas turi turėti įgalintas **Text to Speech**, **Speech to Text** ir **Voices** teises Jūsų ElevenLabs paskyroje.
3. Pasirinkite **Balsą** iš savo ElevenLabs paskyros.
4. Spustelėkite **Išsaugoti balsų nustatymus**.

Jei paspausite balso mygtuką prieš tai nustatydami, Balsas skiltis atsidarys automatiškai, kad galėtumėte užbaigti konfigūraciją.

ElevenLabs API raktas yra saugomas užšifruotas ir niekada nepasiekia naršyklės — visi skambučiai yra perduodami per Heym backend. Žr. [Kredencialai](./credentials.md) ir [Nustatymai](./user-settings.md).

## Perskaityti žinutę garsiai

Kiekviena žinutės burbuliukas (Jūsų ir asistento) turi garsiakalbio mygtuką šalia **Kopijuoti**. Spustelėkite jį, kad atkurtumėte žinutę; spustelėkite dar kartą — arba atkurtumėte kitą žinutę — kad sustabdytumėte. Atkūrimas naudoja ElevenLabs daugiakalbį modelį, todėl teksto kalba automatiškai nustatoma.

## Interaktyvus balso režimas

Bangų formos mygtukas pokalbių įvestyje atidaro viso ekrano, be rankų balso režimą (šviesus/tamsus ir mobiliesiems pritaikytas):

1. Jis klausosi per Jūsų mikrofoną ir nustato, kada nustojate kalbėti.
2. Jūsų kalba yra transkribuojama su **Scribe** (kalba automatiškai nustatoma — nėra rankinio TR/EN perjungimo).
3. Transkripcija siunčiama kaip įprasta pokalbio žinutė **toje pačioje pokalbio**.
4. Asistento atsakymas perskaitytas garsiai, tada jis vėl pradeda klausytis.

Naudokite **nutildymo** mygtuką, kad sustabdytumėte klausymąsi, ir **✕**, kad išeitumėte (kas atlaisvina mikrofoną). Įrašymas veikia visuose moderniuose naršyklėse, įskaitant Firefox.

## Pastabos

- Balsas ir kredencialų pasirinkimas yra kiekvieno vartotojo pageidavimai; aktyvus pokalbis, modelis ir kredencialas LLM lieka nepakitę.
- ElevenLabs naudojimas (tiek TTS, tiek STT) yra apmokestinamas Jūsų pačių ElevenLabs paskyroje.

## Susiję

- [Chat Skiltis](../tabs/chat-tab.md) – Valdymo skydelio pokalbis, kuriame yra balsas
- [Kredencialai](./credentials.md) – Kaip API raktai yra saugomi ir nurodomi
- [Nustatymai](./user-settings.md) – Kur yra Balsas skiltis
