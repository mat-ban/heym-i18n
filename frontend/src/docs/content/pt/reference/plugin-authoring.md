# Criação de Plugins

Os plugins do Heym são pacotes zip confiáveis instalados por um operador. Um pacote pode
adicionar um ou mais nós personalizados de ação ou trigger sem alterar o aplicativo principal.

## Estrutura do Pacote

Um zip de plugin deve conter `plugin.json` na raiz do pacote e o arquivo de entrada
Python nomeado por `entry` (o padrão é `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` é opcional e é servido como a página de documentação do plugin. Coloque um
`icon.svg` na raiz do pacote para o ícone padrão do nó, ou defina um caminho
`icon` específico do nó em `plugin.json`.

## Manifesto

Use um `plugin.json` com múltiplos nós quando um pacote expõe vários nós:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Manifestos legados de nó único também são aceitos: omita `nodes` e forneça
`kind`, `fields`, `dslHint` e `docSlug` no nível superior.

## Campos do Manifesto

| Campo | Observações |
|-------|-------|
| `id` | Id do pacote em minúsculas usando letras, números e hífens. |
| `name` | Nome do pacote legível por humanos. |
| `version` | Versão do pacote usada para exibição e cache do handler. |
| `description` | Descrição curta exibida na UI e no contexto do assistente. |
| `entry` | Caminho do arquivo handler Python dentro do zip; o padrão é `handler.py`. |
| `dependencies` | Requisitos pip opcionais instalados com `uv pip install`. |
| `nodes` | Nós personalizados expostos por este pacote. |

Cada nó precisa de uma `key` exclusiva, um `name` e um `kind` que seja `action` ou
`trigger`. Se `function` for omitido, as ações chamam `run` e os triggers chamam
`trigger`.

Os tipos de campo suportados são `string`, `number`, `boolean` e `select`. Campos
select usam um array `options` de objetos `{ "label": "...", "value": "..." }`.
Defina `required` para campos obrigatórios e `secret` para entradas mascaradas. O manifesto
também aceita metadados `default`, `dynamic` e `expression` para campos; estes são
armazenados com o manifesto, mas os nós de plugin atualmente leem a configuração salva do nó
em tempo de execução em vez de preencher automaticamente a configuração ausente a partir dos padrões.

Campos de string não secretos são renderizados com a UI de entrada de expressão. Em tempo de execução,
qualquer valor de configuração de string salvo que comece com `$` é resolvido antes que o handler
seja chamado.

## Funções de Handler

Os handlers de ação recebem entradas do workflow, configuração resolvida e um pequeno contexto:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Os handlers de trigger recebem configuração resolvida e contexto:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Retorne um dicionário para expor campos de saída nomeados. Se um handler retornar outro
tipo, o Heym o envolve como `{ "value": result }`.

## Instalação e Tempo de Execução

Os plugins são desabilitados por padrão. Os operadores os habilitam com
`HEYM_PLUGINS_ENABLED=true` e restringem o gerenciamento a
`HEYM_PLUGIN_ADMIN_EMAILS`. Os arquivos de plugin instalados residem em
`HEYM_PLUGINS_DIR` e devem ser montados de forma persistente em implantações de contêiner.

O código do plugin é Python confiável, instalado pelo operador, que é executado em processo com o
backend. Ele pode acessar a rede e bibliotecas instaladas, portanto instale apenas
pacotes que você esteja disposto a executar com o mesmo nível de confiança do próprio Heym.