# Guardrails

Os Guardrails permitem bloquear mensagens de usuário inseguras ou indesejadas antes que elas cheguem a um nó [LLM](../nodes/llm-node.md) ou [Agent](../nodes/agent-node.md). Quando uma mensagem corresponde a uma categoria bloqueada, o nó lança um erro em vez de executar, o qual você pode capturar com um nó [Error Handler](../nodes/error-handler-node.md).

## Habilitando os Guardrails

Abra o painel de Propriedades de um nó **LLM** ou **AI Agent** e role até o toggle **Enable Guardrails** (ícone de escudo). Marcar a caixa revela a seção de configuração.

## Credencial e Modelo de Guardrail

Quando os guardrails estão habilitados, você **deve** selecionar uma **credencial e um modelo** para segurança de conteúdo. A verificação de guardrail utiliza a credencial e o modelo selecionados no nó — sem fallback, sem variáveis de ambiente. Utilize uma credencial OpenAI ou Google para filtragem de conteúdo confiável, especialmente quando seu modelo principal usa um provedor personalizado (por exemplo, Zhipu, GLM) que pode não oferecer suporte a guardrails ou retornar erros de API (por exemplo, 404).

O workflow não pode ser executado até que tanto a Guardrail Credential quanto o Guardrail Model estejam selecionados.

## Categorias Bloqueadas

Selecione uma ou mais categorias para bloquear. Uma mensagem que corresponda a qualquer categoria marcada é rejeitada.

| Categoria | O que bloqueia |
|---|---|
| **Violence** | Conteúdo violento, ameaçador ou fisicamente nocivo |
| **Hate Speech** | Discriminação, racismo ou intolerância |
| **Sexual Content** | Conteúdo ou cenários sexuais explícitos |
| **NSFW / Profanity** | Linguagem vulgar, profanidade, insultos explícitos e gírias adultas em qualquer idioma |
| **Self-Harm** | Suicídio, automutilação ou conteúdo relacionado |
| **Harassment** | Ataques pessoais, insultos, bullying ou intimidação |
| **Illegal Activity** | Instruções para cometer atos ilegais |
| **Political Extremism** | Conteúdo político extremista ou propaganda violenta |
| **Spam / Phishing** | Spam, phishing ou engenharia social |
| **Personal Data Request** | Solicitação de informações privadas ou de identificação pessoal |
| **Prompt Injection** | Tentativas de sobrepor instruções do sistema, injetar prompts maliciosos ou manipular o comportamento do modelo |

## Sensibilidade

A configuração de **Sensitivity** controla quão rigorosamente as violações são detectadas:

| Nível | Comportamento |
|---|---|
| **Low** | Sinaliza até casos limítrofes ou ambíguos |
| **Medium** *(padrão)* | Sinaliza violações claras; ignora casos limítrofes |
| **High** | Sinaliza apenas violações extremas e inequívocas |

## Como Funciona a Detecção

A detecção utiliza a **credencial e o modelo de guardrail selecionados**:

- **Credenciais OpenAI** — utiliza a [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratuita, rápida, sem consumo de tokens) para as cinco categorias que ela cobre nativamente (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). As categorias restantes são verificadas com uma chamada de classificação por LLM usando o modelo de guardrail selecionado.
- **Credenciais Google / personalizadas** — todas as categorias são verificadas com uma chamada de classificação por LLM usando a credencial e o modelo de guardrail selecionados.

Quando seu modelo principal usa um provedor personalizado (por exemplo, Zhipu, Cerebras) que pode retornar 404 ou outros erros de API, selecione uma **credencial OpenAI ou Google** para os guardrails.

## Formato do Erro

Quando um guardrail é acionado, o nó lança um erro com a mensagem:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

O `output` do resultado do nó também inclui `guardrail_violated_categories` (array de rótulos de categorias violadas) para que o Debug Panel e o Execution History possam exibir "Blocked by: X, Y" de forma clara.

Utilize a opção **Continue on error** do nó (ou um [Error Handler](../nodes/error-handler-node.md)) para encaminhar o workflow a um branch de fallback quando os guardrails forem acionados.

## Workflow de Exemplo

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Observações

- **Sem retries**: violações de guardrail são bloqueios intencionais e nunca são repetidas, mesmo que o nó tenha "Retry on failure" habilitado.
- Nenhuma migração de banco de dados é necessária — as configurações de guardrail são armazenadas no JSON do nó do workflow, junto com os demais dados do nó.
- Os guardrails verificam a **mensagem do usuário** resolvida (após a avaliação das expressões de template), não o template bruto.
- Definir **nenhuma categoria** com os guardrails habilitados equivale a tê-los desabilitado — nenhuma verificação é realizada.
- Com severidade **Low**, a classificação por LLM sempre é executada (melhor cobertura multilíngue). Credenciais OpenAI executam adicionalmente a Moderation API.
- Com severidade **Medium/High**, credenciais OpenAI utilizam a Moderation API para as categorias com suporte nativo e classificação por LLM para as demais. Credenciais Google/personalizadas sempre utilizam classificação por LLM.
- A classificação por LLM é **agnóstica de idioma** — ela detecta violações em turco, árabe, russo, espanhol e outros idiomas.
