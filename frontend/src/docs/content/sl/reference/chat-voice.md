# Glasovni klepet (TTS in STT)

Zavihek Chat lahko prebere sporočila na glas in omogoča interaktivni glasovni način brez rok, ki ga poganja [ElevenLabs](https://elevenlabs.io). Obe smeri uporabljata eno poverilnico ElevenLabs: **text-to-speech** za predvajanje in **Scribe speech-to-text** za mikrofon.

## Nastavitev

1. Odprite **Nastavitve** (vaša avatar, zgoraj desno) → zavihek **Glas**.
2. Izberite **ElevenLabs poverilnico** ali kliknite **Dodaj poverilnico**, da ustvarite novo. API ključ mora imeti omogočene pravice **Text to Speech**, **Speech to Text** in **Voices** v vašem računu ElevenLabs.
3. Izberite **Glas** iz vašega računa ElevenLabs.
4. Kliknite **Shrani nastavitve glasu**.

Če pritisnete gumb za glas pred nastavitvijo, se zavihek Glas odpre samodejno, da lahko dokončate konfiguracijo.

API ključ ElevenLabs je shranjen šifriran in nikoli ne doseže brskalnika — vsi klici so posredovani preko Heym backend-a. Oglejte si [Poverilnice](./credentials.md) in [Nastavitve](./user-settings.md).

## Preberite sporočilo na glas

Vsaka sporočilna mehurček (vaša in asistenta) ima gumb z zvočnikom poleg **Kopiraj**. Kliknite ga, da predvajate sporočilo; kliknite ponovno — ali predvajajte drugo sporočilo — da ustavite. Predvajanje uporablja večjezični model ElevenLabs, zato se jezik besedila samodejno zazna.

## Interaktivni glasovni način

Gumb za valovno obliko v vnosu klepeta odpre celozaslonski, brezrokovni glasovni način (prilagojen svetlemu/temnemu in mobilnemu):

1. Posluša preko vašega mikrofona in zazna, kdaj prenehate govoriti.
2. Vaš govor se prepisuje s **Scribe** (jezik se samodejno zazna — brez ročnega preklapljanja TR/EN).
3. Prepis se pošlje kot običajno sporočilo v **isti pogovor**.
4. Asistentov odgovor se prebere na glas, nato pa ponovno začne poslušati.

Uporabite gumb **utišaj**, da začasno ustavite poslušanje, in **✕**, da zapustite (kar sprosti mikrofon). Snemanje deluje v vseh sodobnih brskalnikih, vključno s Firefoxom.

## Opombe

- Izbira glasu in poverilnice je prilagoditev za vsakega uporabnika; aktivni pogovor, model in poverilnica za LLM ostanejo nespremenjeni.
- Uporaba ElevenLabs (tako TTS kot STT) se obračuna na vaš račun ElevenLabs.

## Sorodno

- [Zavihek Chat](../tabs/chat-tab.md) – Nadzorna plošča klepeta, kjer se nahaja glas
- [Poverilnice](./credentials.md) – Kako so API ključi shranjeni in sklicani
- [Nastavitve](./user-settings.md) – Kje se nahaja zavihek Glas
