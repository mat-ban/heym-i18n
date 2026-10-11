# Chat Voice (TTS & STT)

Fila Chat poate citi mesajele cu voce tare și poate rula un mod vocal interactiv hands-free, alimentat de [ElevenLabs](https://elevenlabs.io). Ambele direcții folosesc o singură acreditare ElevenLabs: **text-to-speech** pentru redare și **Scribe speech-to-text** pentru microfon.

## Configurare

1. Deschideți **Settings** (avatarul dvs., în dreapta sus) → fila **Voice**.
2. Alegeți o **acreditare ElevenLabs** sau faceți clic pe **Add credential** pentru a crea una. Cheia API necesită permisiunile **Text to Speech**, **Speech to Text** și **Voices** activate în contul dvs. ElevenLabs.
3. Alegeți o **Voice** din contul dvs. ElevenLabs.
4. Faceți clic pe **Save Voice Settings**.

Dacă apăsați un buton vocal înainte de a finaliza această configurare, fila Voice se deschide automat pentru a putea finaliza configurarea.

Cheia API ElevenLabs este stocată criptat și nu ajunge niciodată în browser — toate apelurile sunt redirecționate prin backend-ul Heym. Consultați [Credentials](./credentials.md) și [Settings](./user-settings.md).

## Citirea unui mesaj cu voce tare

Fiecare bulă de mesaj (a dvs. și a asistentului) are un buton de difuzor lângă **Copy**. Faceți clic pe el pentru a reda mesajul; faceți clic din nou — sau redați alt mesaj — pentru a opri. Redarea folosește modelul multilingv ElevenLabs, astfel încât limba textului este detectată automat.

## Mod vocal interactiv

Butonul cu formă de undă din câmpul de introducere a chat-ului deschide un mod vocal hands-free pe tot ecranul (compatibil cu modul luminos/întunecat și cu dispozitivele mobile):

1. Ascultă prin microfonul dvs. și detectează când încetați să vorbiți.
2. Vorbirea dvs. este transcrisă cu **Scribe** (limba detectată automat — fără comutare manuală TR/EN).
3. Transcrierea este trimisă ca mesaj normal de chat în **aceeași conversație**.
4. Răspunsul asistentului este citit cu voce tare, apoi reluarea ascultării.

Folosiți butonul **mute** pentru a întrerupe ascultarea și **✕** pentru a ieși (ceea ce eliberează microfonul). Înregistrarea funcționează în toate browserele moderne, inclusiv Firefox.

## Note

- Selectarea vocii și a acreditării sunt preferințe per utilizator; conversația activă, modelul și acreditarea pentru LLM rămân neschimbate.
- Utilizarea ElevenLabs (atât TTS, cât și STT) este facturată pe propriul dvs. cont ElevenLabs.

## Resurse conexe

- [Chat Tab](../tabs/chat-tab.md) – Chat-ul din Dashboard unde se află funcționalitatea vocală
- [Credentials](./credentials.md) – Cum sunt stocate și referențiate cheile API
- [Settings](./user-settings.md) – Unde se află fila Voice
