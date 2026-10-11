# Chat Vocal (TTS & STT)

L'onglet Chat peut lire les messages à voix haute et exécuter un mode vocal interactif mains libres, propulsé par [ElevenLabs](https://elevenlabs.io). Les deux directions utilisent un seul identifiant ElevenLabs : **text-to-speech** pour la lecture et **Scribe speech-to-text** pour le microphone.

## Configuration

1. Ouvrez **Settings** (votre avatar, en haut à droite) → onglet **Voice**.
2. Sélectionnez un **identifiant ElevenLabs**, ou cliquez sur **Add credential** pour en créer un. La clé API doit disposer des permissions **Text to Speech**, **Speech to Text** et **Voices** activées dans votre compte ElevenLabs.
3. Choisissez une **Voice** depuis votre compte ElevenLabs.
4. Cliquez sur **Save Voice Settings**.

Si vous appuyez sur un bouton vocal avant d'avoir effectué cette configuration, l'onglet Voice s'ouvre automatiquement pour vous permettre de terminer le paramétrage.

La clé API ElevenLabs est stockée de manière chiffrée et n'atteint jamais le navigateur — tous les appels sont relayés via le backend Heym. Consultez [Identifiants](./credentials.md) et [Settings](./user-settings.md).

## Lire un message à voix haute

Chaque bulle de message (la vôtre comme celle de l'assistant) dispose d'un bouton haut-parleur à côté de **Copy**. Cliquez dessus pour lire le message ; cliquez à nouveau — ou lancez la lecture d'un autre message — pour l'arrêter. La lecture utilise le modèle multilingue d'ElevenLabs, la langue du texte est donc détectée automatiquement.

## Mode vocal interactif

Le bouton en forme d'onde dans la zone de saisie du chat ouvre un mode vocal plein écran mains libres (compatible clair/sombre et mobile) :

1. Il écoute via votre microphone et détecte lorsque vous arrêtez de parler.
2. Votre parole est transcrite avec **Scribe** (langue détectée automatiquement — aucun basculement manuel TR/EN).
3. La transcription est envoyée comme un message de chat normal dans la **même conversation**.
4. La réponse de l'assistant est lue à voix haute, puis l'écoute reprend.

Utilisez le bouton **mute** pour suspendre l'écoute et le **✕** pour quitter (ce qui libère le microphone). L'enregistrement fonctionne dans tous les navigateurs modernes, y compris Firefox.

## Remarques

- La sélection de la voix et de l'identifiant relève des préférences par utilisateur ; la conversation active, le modèle et l'identifiant du LLM restent inchangés.
- L'utilisation d'ElevenLabs (TTS et STT) est facturée sur votre propre compte ElevenLabs.

## Voir aussi

- [Onglet Chat](../tabs/chat-tab.md) – Chat du Dashboard où réside la fonctionnalité vocale
- [Identifiants](./credentials.md) – Comment les clés API sont stockées et référencées
- [Settings](./user-settings.md) – Où se trouve l'onglet Voice
