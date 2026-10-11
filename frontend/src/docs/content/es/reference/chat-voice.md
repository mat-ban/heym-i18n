# Chat de voz (TTS y STT)

La pestaña Chat puede leer los mensajes en voz alta y ejecutar un modo de voz interactivo manos libres, impulsado por [ElevenLabs](https://elevenlabs.io). Ambas direcciones utilizan una única credencial de ElevenLabs: **text-to-speech** para la reproducción y **Scribe speech-to-text** para el micrófono.

## Configuración

1. Abra **Settings** (su avatar, arriba a la derecha) → pestaña **Voice**.
2. Seleccione una **credencial de ElevenLabs** o haga clic en **Add credential** para crear una. La clave de API requiere que los permisos **Text to Speech**, **Speech to Text** y **Voices** estén habilitados en su cuenta de ElevenLabs.
3. Elija una **Voice** de su cuenta de ElevenLabs.
4. Haga clic en **Save Voice Settings**.

Si pulsa un botón de voz antes de realizar esta configuración, la pestaña Voice se abre automáticamente para que pueda finalizar la configuración.

La clave de API de ElevenLabs se almacena cifrada y nunca llega al navegador: todas las llamadas se realizan a través del backend de Heym. Consulte [Credenciales](./credentials.md) y [Settings](./user-settings.md).

## Leer un mensaje en voz alta

Cada burbuja de mensaje (tanto la suya como la del asistente) tiene un botón de altavoz junto a **Copy**. Haga clic en él para reproducir el mensaje; haga clic de nuevo —o reproduzca otro mensaje— para detenerlo. La reproducción utiliza el modelo multilingüe de ElevenLabs, por lo que el idioma del texto se detecta automáticamente.

## Modo de voz interactivo

El botón de forma de onda en la entrada del chat abre un modo de voz manos libres a pantalla completa (compatible con modo claro/oscuro y dispositivos móviles):

1. Escucha a través de su micrófono y detecta cuándo deja de hablar.
2. Su voz se transcribe con **Scribe** (idioma detectado automáticamente — sin conmutador manual TR/EN).
3. La transcripción se envía como un mensaje de chat normal en la **misma conversación**.
4. La respuesta del asistente se lee en voz alta y, a continuación, se reanuda la escucha.

Utilice el botón **mute** para pausar la escucha y el botón **✕** para salir (lo que libera el micrófono). La grabación funciona en todos los navegadores modernos, incluido Firefox.

## Notas

- La selección de voz y credencial son preferencias por usuario; la conversación activa, el modelo y la credencial para el LLM no cambian.
- El uso de ElevenLabs (tanto TTS como STT) se factura a su propia cuenta de ElevenLabs.

## Relacionado

- [Pestaña Chat](../tabs/chat-tab.md) – Chat del Dashboard donde reside la voz
- [Credenciales](./credentials.md) – Cómo se almacenan y referencian las claves de API
- [Settings](./user-settings.md) – Dónde se encuentra la pestaña Voice