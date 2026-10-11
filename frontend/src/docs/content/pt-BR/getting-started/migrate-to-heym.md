# Migrar para o Heym

Já tem workflows em outra ferramenta? O **AI Convert** os transforma em workflows do Heym para você. Cole um workflow do n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces — ou apenas descreva o que você deseja — e o Heym constrói o workflow equivalente em um canvas ao vivo que você pode baixar e importar.

Abra em **[heym.run/convert](https://heym.run/convert)**, ou use o botão **✨ AI Convert** no cabeçalho do site.

## Como funciona

1. **Escolha sua ferramenta de origem** (opcional) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, ou deixe em *Auto*.
2. **Forneça seu workflow** — cole o JSON exportado da sua ferramenta atual, ou escreva uma descrição em linguagem natural da automação que você deseja.
3. **Gere** — o Heym transmite o resultado em um canvas, desenhando nós e conexões conforme são produzidos.
4. **Baixe ou copie** o workflow gerado como JSON.
5. **Importe para o Heym** — use o fluxo de [Download & Import](../reference/download-import.md) para colar o JSON no seu canvas e, em seguida, execute-o.

A conversão também adiciona uma pequena *Sticky Note* no canvas marcando o workflow como gerado pelo Heym — exclua-a quando quiser.

## O que você obtém

O conversor mapeia os conceitos de origem para Nós nativos do Heym — Triggers, etapas de [LLM](../nodes/llm-node.md), chamadas [HTTP](../nodes/http-node.md), ações de [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) e [Output](../nodes/output-node.md). Revise o resultado no canvas, configure suas [Credentials](../reference/credentials.md) e ajuste qualquer coisa que a ferramenta de origem tenha expressado de forma diferente.

> O AI Convert é um ponto de partida, não uma porta 1:1 garantida. Sempre revise o workflow gerado antes de executá-lo em produção.

## Bom saber

- **Com IA:** as conversões são produzidas por um modelo de linguagem de grande porte, então os resultados podem variar entre execuções. Gere novamente se o primeiro resultado não estiver exatamente certo.
- **Tamanho da entrada:** a entrada que você cola ou digita é limitada a aproximadamente **25.000 tokens**. Reduza exportações muito grandes antes de converter.
- **Limites de taxa:** para manter a ferramenta disponível para todos, as requisições são limitadas a **1 por minuto, 5 por hora e 10 por dia** por visitante.
- **Segurança:** as requisições são filtradas, e apenas requisições de construção de workflow são processadas.

## Próximos passos

- Novo no canvas? Comece com o [Quick Start](./quick-start.md).
- Saiba como a importação funciona em [Download & Import](../reference/download-import.md).
- Fazendo self-hosting do Heym? Consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) para a referência completa de configuração.
- Construa do zero com o [AI Assistant](../reference/ai-assistant.md) no aplicativo.
