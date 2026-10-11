# Chat Voice (TTS un STT)

Cilne Chat var nolasīt ziņojumus skaļi un nodrošināt brīvroku interaktīvo balss režīmu, ko darbina [ElevenLabs](https://elevenlabs.io). Abi virzieni izmanto vienus ElevenLabs akreditācijas datus: **text-to-speech** atskaņošanai un **Scribe speech-to-text** mikrofonam.

## Iestatīšana

1. Atveriet **Settings** (jūsu avatārs, augšējā labajā stūrī) → cilni **Voice**.
2. Izvēlieties **ElevenLabs akreditācijas datus** vai noklikšķiniet uz **Add credential**, lai tos izveidotu. API atslēgai ir jābūt iespējotām atļaujām **Text to Speech**, **Speech to Text** un **Voices** jūsu ElevenLabs kontā.
3. Izvēlieties **Voice** no sava ElevenLabs konta.
4. Noklikšķiniet uz **Save Voice Settings**.

Ja nospiežat balss pogu pirms šīs iestatīšanas, cilne Voice tiek atvērta automātiski, lai jūs varētu pabeigt konfigurēšanu.

ElevenLabs API atslēga tiek glabāta šifrētā veidā un nekad nenonāk pārlūkā — visi izsaukumi tiek novirzīti caur Heym aizmugursistēmu. Skatiet [Akreditācijas dati](./credentials.md) un [Settings](./user-settings.md).

## Ziņojuma nolasīšana skaļi

Katrai ziņojuma pūslītim (gan jūsu, gan asistenta) blakus **Copy** ir skaļruņa poga. Noklikšķiniet uz tās, lai atskaņotu ziņojumu; noklikšķiniet vēlreiz — vai atskaņojiet citu ziņojumu — lai apturētu. Atskaņošana izmanto ElevenLabs daudzvalodu modeli, tāpēc teksta valoda tiek noteikta automātiski.

## Interaktīvais balss režīms

Viļņu formas poga chat ievadē atver pilnekrāna brīvroku balss režīmu (gaišs/tumšs un mobilajām ierīcēm pielāgots):

1. Tas klausās caur mikrofonu un nosaka, kad pārtraucat runāt.
2. Jūsu runa tiek pārrakstīta ar **Scribe** (valoda tiek noteikta automātiski — nav manuāla TR/EN pārslēga).
3. Pārrakstītais teksts tiek nosūtīts kā parasts chat ziņojums **tajā pašā sarunā**.
4. Asistenta atbilde tiek nolasīta skaļi, pēc tam tas atsāk klausīšanos.

Izmantojiet pogu **mute**, lai pauzētu klausīšanos, un **✕**, lai izietu (kas atbrīvo mikrofonu). Ierakstīšana darbojas visos mūsdienu pārlūkos, tostarp Firefox.

## Piezīmes

- Balss un akreditācijas datu izvēle ir katra lietotāja preferences; aktīvā saruna, modelis un LLM akreditācijas dati paliek nemainīgi.
- ElevenLabs lietojums (gan TTS, gan STT) tiek iekasēts no jūsu paša ElevenLabs konta.

## Saistītie

- [Chat Tab](../tabs/chat-tab.md) – Dashboard chat, kur atrodas balss
- [Akreditācijas dati](./credentials.md) – Kā API atslēgas tiek glabātas un izmantotas
- [Settings](./user-settings.md) – Kur atrodas cilne Voice
