# Decisão

O nó **Decision** faz perguntas tipadas a um modelo de decisão sobre o estado atual da execução e retorna probabilidades. Ele não gera texto. Recorra a ele quando um workflow precisar de um julgamento sobre o qual possa ramificar — roteamento, triagem, classificação, verificação ou bloqueio de uma etapa que não pode ser desfeita.

Modelos de decisão (também chamados de modelos *System One*) são um tipo diferente de modelo em relação a um LLM. Não há prompt, nem instrução de sistema, nem temperatura e nem chamada de ferramentas. Você envia um **state** mais um mapa de **questions**, e cada resposta retorna como um número com uma distribuição de probabilidade por trás. Como uma resposta tem apenas alguns tokens, esses modelos são rápidos e baratos em comparação com pedir a um [LLM](./llm-node.md) que produza JSON e depois analisá-lo.

Para geração de texto, use o nó [LLM](./llm-node.md). Para um modelo que chama ferramentas, use o [Agent Node](./agent-node.md).

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | A resposta do provedor na íntegra — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Uma credencial do tipo *Decision Model*. Não é uma credencial de LLM. |
| `model` | string | Nome do modelo, por exemplo `jev-latest` |
| `state` | expression | O que o modelo deve ler (padrão `$input.text`) |
| `questions` | array | Linhas de perguntas ordenadas; pelo menos uma |
| `customBodyEnabled` | boolean | Enviar um corpo de requisição escrito manualmente em vez do formulário |
| `customBody` | expression (JSON) | O corpo a ser enviado quando a opção estiver ativada |
| `requestTimeoutSeconds` | number | Tempo máximo em segundos para aguardar (padrão: 60) |

### State

**State** é a situação que o modelo julga. Aceita uma string, um objeto ou um array.

Um campo que contém exatamente uma expressão mantém seu próprio tipo, então `$input` envia o próprio objeto em vez de seu texto. Um template com uma expressão dentro dele (`Ticket: $input.text`) é resolvido como uma string. Forneça a cada pergunta informação suficiente para responder: texto de origem, identidades, relacionamentos, políticas e fatos atuais.

## Tipos de pergunta

Cada pergunta tem um `id`, um `type`, `instructions` e critérios que dependem do tipo.

O `id` é como o seu workflow lê a resposta de volta. Ele **nunca é enviado ao modelo**, portanto todo o significado precisa estar em `instructions`. Escrever `id: is_urgent` com `instructions: "Is it?"` não dá ao modelo nada com que trabalhar.

### Noul

Se uma condição é válida. Retorna a probabilidade de a resposta ser sim, de 0 a 1.

Os critérios são opcionais: **Yes means** e **No means** descrevem o que cada lado abrange. Um valor próximo de 0,5 significa que o modelo considera sim e não praticamente igualmente prováveis — não "intensidade média".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Leia com `$triage.answers.is_urgent.noul`.

### Choice

Escolhe uma opção de um conjunto que você define. Retorna a opção escolhida, a distribuição completa e uma confiança derivada dela.

Adicione uma opção que cubra "nenhuma destas" sempre que nada puder se encaixar — o modelo não pode escolher uma opção que você não ofereceu.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Leia com `$triage.answers.department.choice`, `.probabilities.billing` e `.confidence`.

### Score

Avalia o estado ao longo de uma rubrica ordenada. Retorna um valor ponderado por probabilidade que pode ficar **entre** níveis, além da legenda e da distribuição.

Os níveis vão do mais baixo primeiro, no mínimo dois e no máximo dez. Cada nível deve descrever uma situação concreta e ser autossuficiente.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Leia com `$triage.answers.frustration.score`, `.legend` e `.confidence`.

## Generate with AI

**Generate with AI** transforma uma frase simples em um template de state sugerido e um conjunto de linhas de perguntas. Descreva o que você quer que seja julgado — "faça a triagem de um ticket de suporte recebido: quão urgente é, qual equipe é responsável por ele e quão frustrado o cliente parece" — e revise o que retornar antes de adicioná-lo ao nó.

A elaboração é feita por um LLM, então o diálogo solicita uma credencial de LLM. O modelo de decisão responde às perguntas depois, quando o workflow é executado. Os ids gerados são deduplicados em relação às linhas que o nó já contém, então gerar duas vezes nunca sobrescreve uma chave de resposta existente.

Cada geração é registrada na aba [Traces](../tabs/traces-tab.md) sob a fonte **Decision Questions**, junto com os traces `decision.systemone` gravados pelo próprio nó em tempo de execução.
## Corpo da requisição personalizado

Ative **Corpo da requisição personalizado** para enviar um JSON escrito por você mesmo em vez do formulário. Utilize-o para um endpoint cujo contrato difere daquele que o formulário constrói.

O editor é preenchido a partir do formulário atual, e as expressões dentro dele são resolvidas antes do envio da requisição. Enquanto o toggle estiver ativado, o campo State e as linhas de perguntas são ignorados. A resposta é repassada sem alterações de qualquer forma, portanto um contrato diferente simplesmente produz um formato diferente para suas expressões lerem.

## Saída

O nó retorna exatamente o que o provedor retornou. Nada é renomeado ou achatado.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Ramificação com base em uma resposta

Um nó [Switch](./switch-node.md) roteia com base na opção escolhida, e um nó [Condition](./condition-node.md) pode encaminhar casos de baixa confiança para algum lugar onde uma pessoa os veja:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Uma resposta tipada garante o formato, não a veracidade. Escolha os thresholds com base nos seus próprios dados e consequências, em vez de copiar um número de um exemplo.

## Credencial

Crie uma credencial **Decision Model** na aba [Credentials](../tabs/credentials-tab.md) com:

- **Base URL** — o endpoint, por exemplo `https://api.typesafe.ai`. O Heym acrescenta `/v1/systemone`.
- **API Key** — opcional. Endpoints que não exigem chave podem ser deixados em branco.

Editar uma credencial mantém a chave armazenada quando o campo de chave é deixado em branco; redigite-a apenas para substituí-la.

A mesma credencial pode avaliar execuções de [Evals](../tabs/evals-tab.md): com **LLM-as-Judge** selecionado, escolha-a como juiz e o decision model pontuará cada resposta em relação à saída esperada.

O Heym bloqueia requisições de saída para endereços privados e de loopback por padrão, portanto um endpoint de decisão que você mesmo executa em `localhost` ou em um intervalo privado precisa de `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Os decision models não aparecem nas tabelas de preços de LLM que o Heym sincroniza, portanto a coluna **Cost** em [Traces](../tabs/traces-tab.md) permanece vazia para essas chamadas. As contagens de tokens ainda são registradas, e você pode adicionar seu próprio preço com um pricing override.

## Erros

| Situação | O que acontece |
|-----------|--------------|
| API key inválida | O nó falha com uma mensagem nomeando a credencial |
| Pergunta malformada | A mensagem em nível de campo do próprio provedor é transportada para o erro do nó |
| Rate limited ou sobrecarregado | O nó falha com uma mensagem dizendo que a condição é transitória — ative [retry](../reference/features.md) para este nó para superá-la |
| ID de pergunta duplicado ou vazio | O nó falha antes que qualquer requisição seja enviada |

## Relacionados

- [LLM Node](./llm-node.md) – Gere texto em vez de um julgamento
- [Agent Node](./agent-node.md) – Reúna evidências com ferramentas e depois julgue-as aqui
- [Switch Node](./switch-node.md) – Roteie com base na opção escolhida
- [Condition Node](./condition-node.md) – Faça o gate com base na confiança
- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Credentials](../reference/credentials.md) – Tipos e campos de credenciais
- [Traces Tab](../tabs/traces-tab.md) – Inspecione chamadas de decisão e uso de tokens
