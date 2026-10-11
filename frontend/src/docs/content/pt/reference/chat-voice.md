# Chat Voice (TTS e STT)

A aba Chat pode ler mensagens em voz alta e executar um modo de voz interativo mãos-livres, com tecnologia da [ElevenLabs](https://elevenlabs.io). Ambas as direções utilizam uma única credencial ElevenLabs: **text-to-speech** para reprodução e **Scribe speech-to-text** para o microfone.

## Configuração

1. Abra **Configurações** (o seu avatar, no canto superior direito) → aba **Voice**.
2. Selecione uma **credencial ElevenLabs** ou clique em **Adicionar credencial** para criar uma. A chave de API necessita das permissões **Text to Speech**, **Speech to Text** e **Voices** ativadas na sua conta ElevenLabs.
3. Escolha uma **Voz** da sua conta ElevenLabs.
4. Clique em **Salvar configurações de voz**.

Se pressionar um botão de voz antes de concluir esta configuração, a aba Voice abre automaticamente para que possa finalizar a configuração.

A chave de API da ElevenLabs é armazenada de forma encriptada e nunca chega ao navegador — todas as chamadas são encaminhadas através do backend do Heym. Consulte [Credenciais](./credentials.md) e [Configurações](./user-settings.md).

## Ler uma mensagem em voz alta

Cada bolha de mensagem (suas e do assistente) tem um botão de altifalante junto a **Copiar**. Clique nele para reproduzir a mensagem; clique novamente — ou reproduza outra mensagem — para parar. A reprodução utiliza o modelo multilingue da ElevenLabs, pelo que o idioma do texto é detetado automaticamente.

## Modo de voz interativo

O botão de forma de onda no campo de entrada do chat abre um modo de voz mãos-livres em ecrã inteiro (com suporte para modo claro/escuro e dispositivos móveis):

1. Escuta através do seu microfone e deteta quando para de falar.
2. A sua fala é transcrita com **Scribe** (idioma detetado automaticamente — sem alternância manual TR/EN).
3. A transcrição é enviada como uma mensagem de chat normal na **mesma conversa**.
4. A resposta do assistente é lida em voz alta e, em seguida, retoma a escuta.

Utilize o botão **silenciar** para pausar a escuta e o **✕** para sair (o que liberta o microfone). A gravação funciona em todos os navegadores modernos, incluindo o Firefox.

## Notas

- A seleção de voz e credencial são preferências por utilizador; a conversa ativa, o modelo e a credencial do LLM permanecem inalterados.
- A utilização da ElevenLabs (tanto TTS como STT) é faturada à sua própria conta ElevenLabs.

## Relacionado

- [Aba Chat](../tabs/chat-tab.md) – Chat do Dashboard onde a voz reside
- [Credenciais](./credentials.md) – Como as chaves de API são armazenadas e referenciadas
- [Configurações](./user-settings.md) – Onde reside a aba Voice