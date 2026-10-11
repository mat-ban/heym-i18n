# Chat Glas (TTS & STT)

Zaslon Chat može čitati poruke naglas i pokrenuti interaktivni glasovni način rada bez ruku, potpomognut [ElevenLabs](https://elevenlabs.io). Obje funkcionalnosti koriste jednu ElevenLabs vjerodajnicu: **text-to-speech** za reprodukciju i **Scribe speech-to-text** za mikrofon.

## Postavljanje

1. Otvorite **Postavke** (Vaša ikona, gornji desni kut) → **Glas** karticu.
2. Odaberite **ElevenLabs vjerodajnicu**, ili kliknite **Dodaj vjerodajnicu** za kreiranje nove. API ključ treba imati omogućene dozvole **Text to Speech**, **Speech to Text** i **Voices** u Vašem ElevenLabs računu.
3. Odaberite **Glas** iz Vašeg ElevenLabs računa.
4. Kliknite **Spremi postavke glasa**.

Ako pritisnete gumb za glas prije nego što to postavite, kartica Glas se automatski otvara kako biste završili konfiguraciju.

API ključ za ElevenLabs pohranjuje se šifrirano i nikada ne dolazi do preglednika — svi pozivi se prosljeđuju kroz Heym backend. Pogledajte [Vjerodajnice](./credentials.md) i [Postavke](./user-settings.md).

## Čitanje poruke naglas

Svaka poruka (Vaša i asistentova) ima gumb zvučnika pored **Kopiraj**. Kliknite ga za reprodukciju poruke; kliknite ponovno — ili reproducirajte drugu poruku — da zaustavite. Reprodukcija koristi ElevenLabs višelingvalni model, tako da se jezik teksta automatski prepoznaje.

## Interaktivni glasovni način

Gumb valnog oblika u unosu chata otvara način rada s punim ekranom, bez ruku (prilagođen svjetlu/tamnom i mobilnim uređajima):

1. Sluša kroz Vaš mikrofon i prepoznaje kada prestanete govoriti.
2. Vaš govor se transkribira s **Scribe** (jezik se automatski prepoznaje — bez ručnog prebacivanja TR/EN).
3. Transkript se šalje kao normalna chat poruka u **isto razgovoru**.
4. Asistentov odgovor se čita naglas, a zatim se nastavlja s slušanjem.

Koristite gumb **mute** za pauziranje slušanja i **✕** za izlazak (što oslobađa mikrofon). Snimanje radi u svim modernim preglednicima, uključujući Firefox.

## Napomene

- Odabir glasa i vjerodajnice su postavke po korisniku; aktivni razgovor, model i vjerodajnica za LLM ostaju nepromijenjeni.
- Korištenje ElevenLabs (i TTS i STT) naplaćuje se na Vaš vlastiti ElevenLabs račun.

## Povezano

- [Chat Kartica](../tabs/chat-tab.md) – Upravljačka ploča chata gdje se nalazi glas
- [Vjerodajnice](./credentials.md) – Kako se API ključevi pohranjuju i referenciraju
- [Postavke](./user-settings.md) – Gdje se nalazi kartica Glas
