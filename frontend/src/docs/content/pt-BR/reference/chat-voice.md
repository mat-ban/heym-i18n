# Voz no Chat (TTS & STT)

A aba Chat pode ler mensagens em voz alta e executar um modo de voz interativo mãos-livres, com tecnologia da [ElevenLabs](https://elevenlabs.io). Ambas as direções usam uma única credencial ElevenLabs: **text-to-speech** para reprodução e **Scribe speech-to-text** para o microfone.

## Configuração

1. Abra **Settings** (seu avatar, canto superior direito) → aba **Voice**.
2. Escolha uma **credencial ElevenLabs** ou clique em **Add credential** para criar uma. A chave de API precisa das permissões **Text to Speech**, **Speech to Text** e **Voices** habilitadas na sua conta ElevenLabs.
3. Escolha uma **Voice** da sua conta ElevenLabs.
4. Clique em **Save Voice Settings**.

Se você pressionar um botão de voz antes de concluir esta configuração, a aba Voice será aberta automaticamente para que você finalize a configuração.

A chave de API da ElevenLabs é armazenada de forma criptografada e nunca chega ao navegador — todas as chamadas são intermediadas pelo backend do Heym. Consulte [Credentials](./credentials.md) e [Settings](./user-settings.md).

## Ler uma mensagem em voz alta

Cada balão de mensagem (seu e do assistente) possui um botão de alto-falante ao lado de **Copy**. Clique nele para reproduzir a mensagem; clique novamente — ou reproduza outra mensagem — para parar. A reprodução usa o modelo multilíngue da ElevenLabs, portanto o idioma do texto é detectado automaticamente.

## Modo de voz interativo

O botão de forma de onda no campo de entrada do chat abre um modo de voz mãos-livres em tela cheia (com suporte a tema claro/escuro e dispositivos móveis):

1. Ele escuta através do seu microfone e detecta quando você para de falar.
2. Sua fala é transcrita com o **Scribe** (idioma detectado automaticamente — sem alternância manual entre TR/EN).
3. A transcrição é enviada como uma mensagem de chat normal na **mesma conversa**.
4. A resposta do assistente é lida em voz alta e, em seguida, ele volta a escutar.

Use o botão **mute** para pausar a escuta e o **✕** para sair (o que libera o microfone). A gravação funciona em todos os navegadores modernos, incluindo o Firefox.

## Observações

- A seleção de voz e credencial são preferências por usuário; a conversa ativa, o modelo e a credencial do LLM permanecem inalterados.
- O uso da ElevenLabs (tanto TTS quanto STT) é cobrado na sua própria conta ElevenLabs.

## Relacionados

- [Chat Tab](../tabs/chat-tab.md) – Chat do Dashboard onde a voz está disponível
- [Credentials](./credentials.md) – Como as chaves de API são armazenadas e referenciadas
- [Settings](./user-settings.md) – Onde a aba Voice está localizada
