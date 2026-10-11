# Veu del Chat (TTS i STT)

La pestanya Chat pot llegir missatges en veu alta i executar un mode de veu interactiu mans lliures, impulsat per [ElevenLabs](https://elevenlabs.io). Totes dues direccions utilitzen una única credencial d'ElevenLabs: **text-to-speech** per a la reproducció i **Scribe speech-to-text** per al micròfon.

## Configuració

1. Obriu **Settings** (el vostre avatar, a dalt a la dreta) → pestanya **Voice**.
2. Seleccioneu una **credencial d'ElevenLabs**, o feu clic a **Add credential** per crear-ne una. La clau d'API necessita els permisos **Text to Speech**, **Speech to Text** i **Voices** activats al vostre compte d'ElevenLabs.
3. Trieu una **Voice** del vostre compte d'ElevenLabs.
4. Feu clic a **Save Voice Settings**.

Si premeu un botó de veu abans de configurar-ho, la pestanya Voice s'obre automàticament perquè pugueu acabar la configuració.

La clau d'API d'ElevenLabs s'emmagatzema xifrada i mai arriba al navegador — totes les crides es proxien a través del backend de Heym. Vegeu [Credentials](./credentials.md) i [Settings](./user-settings.md).

## Llegir un missatge en veu alta

Cada bombolla de missatge (la vostra i la de l'assistent) té un botó d'altaveu al costat de **Copy**. Feu-hi clic per reproduir el missatge; feu-hi clic de nou — o reproduïu un altre missatge — per aturar-lo. La reproducció utilitza el model multilingüe d'ElevenLabs, de manera que l'idioma del text es detecta automàticament.

## Mode de veu interactiu

El botó de forma d'ona a l'entrada del chat obre un mode de veu a pantalla completa i mans lliures (adaptat a mode clar/fosc i a mòbil):

1. Escolta a través del vostre micròfon i detecta quan deixeu de parlar.
2. La vostra parla es transcriu amb **Scribe** (idioma detectat automàticament — sense commutador manual TR/EN).
3. La transcripció s'envia com un missatge de chat normal a la **mateixa conversa**.
4. La resposta de l'assistent es llegeix en veu alta i, tot seguit, es reprèn l'escolta.

Utilitzeu el botó **mute** per pausar l'escolta i la **✕** per sortir (cosa que allibera el micròfon). L'enregistrament funciona a tots els navegadors moderns, inclòs Firefox.

## Notes

- La selecció de veu i de credencial són preferències per usuari; la conversa activa, el model i la credencial per a l'LLM no es modifiquen.
- L'ús d'ElevenLabs (tant TTS com STT) es factura al vostre propi compte d'ElevenLabs.

## Relacionat

- [Chat Tab](../tabs/chat-tab.md) – El chat del Dashboard on resideix la veu
- [Credentials](./credentials.md) – Com s'emmagatzemen i es referencien les claus d'API
- [Settings](./user-settings.md) – On es troba la pestanya Voice