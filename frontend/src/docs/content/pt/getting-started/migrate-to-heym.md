# Migrar para o Heym

Já tem workflows noutra ferramenta? O **AI Convert** transforma-os em workflows do Heym por si. Cole um workflow do n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces — ou descreva simplesmente o que pretende — e o Heym constrói o workflow equivalente num canvas ativo que pode descarregar e importar.

Abra-o em **[heym.run/convert](https://heym.run/convert)**, ou utilize o botão **✨ AI Convert** no cabeçalho do site.

## Como funciona

1. **Escolha a ferramenta de origem** (opcional) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, ou deixe em *Auto*.
2. **Forneça o seu workflow** — cole o JSON exportado da sua ferramenta atual, ou escreva uma descrição em linguagem natural da automatização que pretende.
3. **Gere** — o Heym transmite o resultado para um canvas, desenhando nós e ligações à medida que são produzidos.
4. **Descarregue ou copie** o workflow gerado como JSON.
5. **Importe para o Heym** — utilize o fluxo [Descarregar e Importar](../reference/download-import.md) para colar o JSON no seu canvas e, em seguida, execute-o.

A conversão também adiciona uma pequena *Sticky Note* no canvas, assinalando o workflow como gerado pelo Heym — elimine-a sempre que desejar.

## O que obtém

O conversor mapeia os conceitos de origem para nós nativos do Heym — triggers, passos de [LLM](../nodes/llm-node.md), chamadas [HTTP](../nodes/http-node.md), ações de [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Condições](../nodes/condition-node.md) e [Output](../nodes/output-node.md). Reveja o resultado no canvas, configure as suas [Credenciais](../reference/credentials.md) e ajuste tudo o que a ferramenta de origem tenha expressado de forma diferente.

> O AI Convert é um ponto de partida, não uma porta 1:1 garantida. Reveja sempre o workflow gerado antes de o executar em produção.

## Informações úteis

- **Com tecnologia de IA:** as conversões são produzidas por um modelo de linguagem de grande dimensão, pelo que os resultados podem variar entre execuções. Gere novamente se o primeiro resultado não for o mais adequado.
- **Dimensão da entrada:** a entrada que cola ou escreve está limitada a aproximadamente **25 000 tokens**. Reduza exportações muito extensas antes de converter.
- **Limites de utilização:** para manter a ferramenta disponível para todos, os pedidos estão limitados a **1 por minuto, 5 por hora e 10 por dia** por visitante.
- **Segurança:** os pedidos são analisados e apenas são processados os pedidos de construção de workflows.

## Próximos passos

- É novo no canvas? Comece pelo [Início Rápido](./quick-start.md).
- Saiba como funciona a importação em [Descarregar e Importar](../reference/download-import.md).
- Aloja o Heym por conta própria? Consulte as [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) para a referência completa de configuração.
- Construa de raiz com o [Assistente de IA](../reference/ai-assistant.md) integrado na aplicação.
