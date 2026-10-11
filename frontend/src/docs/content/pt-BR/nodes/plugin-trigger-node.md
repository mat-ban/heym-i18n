# Plugin Trigger

O nó **Plugin Trigger** é a contraparte do tipo trigger do
[nó Plugin](./plugin-node.md). Ele é fornecido por um plugin instalado cujo
`kind` é `trigger`, e produz os dados iniciais a partir dos quais um workflow é iniciado.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.<keys returned by the plugin>` |

Um plugin do tipo trigger pode representar qualquer fonte — um aplicativo diferente, um serviço
de terceiros ou outra tecnologia — desde que o handler do plugin retorne os dados
com os quais o workflow deve ser iniciado.

## Quando Usar

Utilize um nó Plugin Trigger quando um plugin instalado definir um trigger que inicia
o seu workflow. Para plugins que executam uma ação no meio do workflow, utilize o
[nó Plugin](./plugin-node.md) em vez disso.

## Configuração

Assim como o nó Plugin, o formulário de configuração é gerado a partir dos campos do manifest do plugin. Campos de string não secretos utilizam a entrada de expressão, e campos secretos são mascarados.

## Como os Plugins São Executados

O código do plugin é confiável (fornecido pela Heym, instalado pelo operador) e é executado in-process.
A instalação é restrita a `HEYM_PLUGIN_ADMIN_EMAILS` e o subsistema é
controlado por `HEYM_PLUGINS_ENABLED`. Consulte
[Execução e Implantação](../getting-started/running-and-deployment.md).

## Criar Plugins

Para construir um pacote de plugin do tipo trigger, consulte
[Autoria de Plugins](../reference/plugin-authoring.md) para obter o layout do zip,
os campos do manifest, as assinaturas de handler, os ícones, as dependências e o modelo de confiança em tempo de execução.
