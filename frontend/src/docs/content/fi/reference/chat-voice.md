# Chat Voice (TTS & STT)

Chat-välilehdessä viestejä voidaan lukea ääneen ja käyttää kädetöntä äänipohjaista vuoropuhelutilaa, joka perustuu [ElevenLabs](https://elevenlabs.io) -palveluun. Molempiin suuntiin käytetään yhtä ElevenLabs -tunnistetietoa: **text-to-speech** äänentoistoon ja **Scribe speech-to-text** mikrofonia varten.

## Asennus

1. Avaa **Asetukset** (avatarisi, oikeassa yläkulmassa) → **Voice**-välilehti.
2. Valitse **ElevenLabs -tunnistetiedot** tai napsauta **Lisää tunnistetiedot** luodaksesi uuden. API-avaimen tulee olla ElevenLabs-tililläsi käytössä **Text to Speech**, **Speech to Text** ja **Voices** -oikeuksilla varustettu.
3. Valitse **Voice** ElevenLabs-tililtäsi.
4. Napsauta **Tallenna ääniasetukset**.

Jos painat äänipainiketta ennen tämän asetuksen määrittämistä, Voice-välilehti avautuu automaattisesti, jotta voit viimeistellä konfiguroinnin.

ElevenLabs API-avain tallennetaan salattuna, eikä selain koskaan pääse käsiksi siihen – kaikki kutsut välitetään Heymin taustajärjestelmän kautta. Katso [Tunnistetiedot](./credentials.md) ja [Asetukset](./user-settings.md).

## Viestin lukeminen ääneen

Jokaisessa viestikuplassa (omat ja avustajan) on kaiutinpainike **Copy** -painikkeen vieressä. Napsauta sitä toistaaksesi viesti ääneen; napsauta uudelleen tai toista toinen viesti keskeyttääksesi toiston. Toisto käyttää ElevenLabsin monikielistä mallia, joten tekstin kieli tunnistetaan automaattisesti.

## Vuorovaikutteinen äänitila

Aaltomuotopainike chat-syöttökentässä avaa koko näytön kattavan, kädetön äänitilan (valoisa/tumma tila ja mobiiliystävällinen):

1. Se kuuntelee mikrofoniisi ja havaitsee, kun lopetetaan puhuminen.
2. Puheesi transkriptoidaan **Scribe** -palvelulla (kieli tunnistetaan automaattisesti – ei manuaalista TR/EN-valintaa).
3. Transkriptio lähetetään normaalina chat-viestinä **samassa keskustelussa**.
4. Avustajan vastaus luetaan ääneen, minkä jälkeen kuuntelu jatkuu.

Käytä **mykistys**-painiketta keskeyttääksesi kuuntelun ja **✕**-painiketta poistuaksesi (jolloin mikrofoni vapautetaan). Tallennus toimii kaikissa moderneissa selaimissa, mukaan lukien Firefox.

## Huomioita

- Ääni- ja tunnistetiedon valinta ovat käyttäjäkohtaisia asetuksia; aktiivinen keskustelu, malli ja LLM:n tunnistetiedot pysyvät muuttumattomina.
- ElevenLabsin käyttö (sekä TTS että STT) laskutetaan omaan ElevenLabs-tiliisi.

## Aiheeseen liittyvät

- [Chat-välilehti](../tabs/chat-tab.md) – Koontinäytön chat, jossa äänitoiminto sijaitsee
- [Tunnistetiedot](./credentials.md) – API-avainten tallennus ja viittaus
- [Asetukset](./user-settings.md) – Paikka, jossa Voice-välilehti sijaitsee
