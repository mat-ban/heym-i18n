# Código

O nó **Code** executa o Python que você escreve, com o seu próprio `requirements.txt`, e retorna JSON. Cada execução recebe um container totalmente novo, que é destruído quando a execução termina, de modo que uma execução nunca pode ver ou afetar outra.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.result` (o que `main` retornou), além de `$nodeLabel.logs` e `$nodeLabel.install` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `codeSource` | string | Código-fonte Python. Deve definir `main(params)` e retornar um valor serializável em JSON |
| `codeParameters` | expression | Um objeto JSON que conecta os dados do workflow ao código. As expressões são resolvidas antes da execução do código |
| `codeRequirements` | string | Conteúdo do `requirements.txt`, um pacote por linha. Vazio ignora a instalação |
| `codeAllowNetwork` | boolean | Define se o próprio código pode acessar a rede (padrão `false`) |

## A função `main`

O seu código deve definir um `main` de nível superior que recebe um argumento:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Instruções no nível do módulo são executadas, mas apenas o que `main` retorna se torna a saída do nó.

O editor exibe números de linha, e o botão de expandir ao lado de **Format** abre um editor maior que fecha com `Esc` — as edições são aplicadas conforme você digita, portanto não há nada a salvar. O botão **Format** reformata o seu código com o Ruff, preservando os comentários. Ele também corrige os danos de indentação que a colagem costuma causar: um bloco uniformemente indentado, tabs misturados com espaços e uma linha deslocada um ou dois espaços do seu bloco são todos corrigidos em vez de rejeitados. Um erro de sintaxe genuíno é reportado com a sua linha e coluna. A formatação é executada no mesmo container isolado em que o nó é executado — sem rede, sem ambiente de backend — portanto exige Docker, assim como a execução.

## Leitura de parâmetros

`params` suporta notação de ponto, inclusive através de objetos e listas aninhados:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` lê chaves que não são identificadores Python válidos
- `params.get("maybe")` retorna `None` em vez de gerar erro quando uma chave está ausente
- `params.to_dict()` retorna o dicionário simples
- Ler uma chave que nunca foi fornecida gera um erro que nomeia a chave e lista o que está disponível

## Saída

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — o valor de retorno de `main`. Os nós subsequentes leem `$nodeLabel.result.message`
- `logs` — tudo o que o código enviou para `print`, capturado separadamente para que nunca corrompa o resultado
- `install` — qual ferramenta instalou as dependências (`uv`, `pip` ou `none`) e a sua saída

## Dependências

Liste os pacotes no `requirements.txt` exatamente como você faria localmente:

```
requests==2.32.3
feedparser
```

Os pacotes são instalados com `uv` em um diretório descartável antes da execução do código; se o `uv` não conseguir lidar com um pacote, o Heym tenta novamente com o `pip`. Nada é armazenado em cache entre execuções, portanto dependências pesadas adicionam vários segundos a cada execução. Deixar o `requirements.txt` vazio ignora completamente a etapa de instalação e é consideravelmente mais rápido.

Pacotes que não fornecem wheel e precisam de um compilador C falharão na instalação. O motivo aparece em `install.log`.

## Rede

| Fase | Rede |
|-------|---------|
| Instalação de dependências | Sempre ativa — pip e uv precisam acessar o PyPI |
| Execução do seu código | Desativada por padrão. `codeAllowNetwork` a ativa |

Com `codeAllowNetwork` desativado, uma chamada de saída como `requests.get(...)` falha com um erro de conexão. Esse é o padrão pretendido: a maioria dos nós Code transforma dados que outro nó já buscou. Prefira buscar com um nó **HTTP** e passar o corpo através de `codeParameters`.

## Sandbox e limites

O seu código é executado como um usuário não-root em um container com todas as capacidades do Linux removidas, `no-new-privileges` definido e um sistema de arquivos raiz somente leitura. Ele não recebe o socket do Docker nem qualquer um dos segredos ou do ambiente do backend.

| Limite | Valor |
|-------|-------|
| Memória | 512 MB |
| CPUs | 1 |
| Processos | 256 |
| Timeout de instalação de dependências | 120 segundos |
| Timeout de execução | 60 segundos |

Essas são propriedades fixas do sandbox, não configurações.

> **O Docker é obrigatório.** Diferentemente das ferramentas e skills do Agent Python, o nó Code não tem modo de fallback local nem variável de ambiente para relaxá-lo. Sem um daemon Docker acessível, o nó falha com um erro claro em vez de executar o seu código no processo do backend. No desenvolvimento nativo com `./run.sh`, inicie o Docker antes de usar este nó. Consulte [Segurança → Sandbox do nó Code](../reference/security.md#code-node-sandbox).
## Use outro nó quando um for adequado

| Se você deseja | Use |
|-------------|-----|
| Analisar ou construir CSV, TSV, XML ou aplicar OCR a um arquivo | [Converter](converter-node.md) |
| Chamar uma API HTTP | [HTTP](http-node.md) |
| Mapear ou renomear campos | [Set](set-node.md) |
| Executar outro workflow | [Execute](execute-node.md) |

Recorra ao **Code** quando a lógica genuinamente não se encaixar nesses casos — cálculos personalizados, análise sob medida ou um algoritmo.

## Exemplo

Pontue as linhas produzidas por um nó upstream:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Com `codeParameters` definido como `{ "rows": "$fetchRows.result" }`, os nós downstream leem `$scoreRows.result.total`.
