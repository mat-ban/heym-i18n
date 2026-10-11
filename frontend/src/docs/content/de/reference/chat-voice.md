# Chat-Sprache (TTS & STT)

Der Chat-Reiter kann Nachrichten laut vorlesen und einen freihändigen interaktiven Sprachmodus ausführen, bereitgestellt von [ElevenLabs](https://elevenlabs.io). Beide Richtungen verwenden eine ElevenLabs-Anmeldedaten: **Text-to-Speech** für die Wiedergabe und **Scribe Speech-to-Text** für das Mikrofon.

## Einrichtung

1. Öffne **Einstellungen** (dein Avatar, oben rechts) → Reiter **Sprache**.
2. Wähle eine **ElevenLabs-Anmeldedaten** aus oder klicke auf **Anmeldedaten hinzufügen**, um eine zu erstellen. Der API-Schlüssel benötigt die Berechtigungen **Text to Speech**, **Speech to Text** und **Voices**, die in deinem ElevenLabs-Konto aktiviert sein müssen.
3. Wähle eine **Stimme** aus deinem ElevenLabs-Konto.
4. Klicke auf **Spracheinstellungen speichern**.

Wenn du eine Sprachschaltfläche drückst, bevor du dies eingerichtet hast, öffnet sich der Reiter Sprache automatisch, damit du die Konfiguration abschließen kannst.

Der ElevenLabs-API-Schlüssel wird verschlüsselt gespeichert und erreicht niemals den Browser — alle Aufrufe werden über das Heym-Backend weitergeleitet. Siehe [Anmeldedaten](./credentials.md) und [Einstellungen](./user-settings.md).

## Eine Nachricht laut vorlesen

Jede Nachrichtenblase (deine und die des Assistenten) hat eine Lautsprecher-Schaltfläche neben **Kopieren**. Klicke darauf, um die Nachricht abzuspielen; klicke erneut — oder spiele eine andere Nachricht ab — um zu stoppen. Die Wiedergabe verwendet das mehrsprachige Modell von ElevenLabs, sodass die Sprache des Textes automatisch erkannt wird.

## Interaktiver Sprachmodus

Die Wellenform-Schaltfläche in der Chat-Eingabe öffnet einen bildschirmfüllenden, freihändigen Sprachmodus (hell/dunkel und mobilfreundlich):

1. Er hört über dein Mikrofon zu und erkennt, wenn du aufhörst zu sprechen.
2. Deine Sprache wird mit **Scribe** transkribiert (Sprache automatisch erkannt — kein manueller TR/EN-Umschalter).
3. Das Transkript wird als normale Chat-Nachricht in der **gleichen Konversation** gesendet.
4. Die Antwort des Assistenten wird laut vorgelesen, dann nimmt er das Zuhören wieder auf.

Verwende die **Stummschalten**-Schaltfläche, um das Zuhören zu pausieren, und das **✕**, um zu beenden (wodurch das Mikrofon freigegeben wird). Die Aufnahme funktioniert in allen modernen Browsern, einschließlich Firefox.

## Hinweise

- Sprache und Anmeldedaten-Auswahl sind benutzerspezifische Einstellungen; die aktive Konversation, das Modell und die Anmeldedaten für das LLM bleiben unverändert.
- Die ElevenLabs-Nutzung (sowohl TTS als auch STT) wird über dein eigenes ElevenLabs-Konto abgerechnet.

## Verwandte Themen

- [Chat-Reiter](../tabs/chat-tab.md) – Dashboard-Chat, in dem die Sprache lebt
- [Anmeldedaten](./credentials.md) – Wie API-Schlüssel gespeichert und referenziert werden
- [Einstellungen](./user-settings.md) – Wo der Reiter Sprache lebt
