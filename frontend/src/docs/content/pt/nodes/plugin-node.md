# Nó Plugin

O nó **Plugin** executa uma ação personalizada fornecida por um plugin instalado. Os plugins
estendem o Heym com novos tipos de nós — ações, integrações de terceiros ou qualquer coisa
expressável em Python — sem modificar a aplicação principal.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.<keys returned by the plugin>` |

Um **pacote** de plugin (um zip) pode incluir **vários nós** — qualquer combinação de ações
e triggers. Cada nó aparece na paleta em **Plugins** com o seu próprio
nome e descrição. Arrastar um deles para o canvas cria um nó Plugin vinculado a
esse pacote (`pluginId`) e nó (`pluginNodeKey`).

## Quando utilizar

Utilize um nó Plugin quando um operador tiver instalado um plugin que executa a ação
de que necessita — por exemplo, chamar uma API privada, comunicar com um sistema interno ou
executar lógica personalizada escrita para a sua implementação.

Para plugins do tipo trigger que iniciam um workflow, consulte o
[nó Plugin Trigger](./plugin-trigger-node.md).

## Configuração

O formulário de configuração do nó é gerado a partir do manifesto do plugin. Cada campo
declarado pelo plugin (`string`, `number`, `boolean` ou `select`) é renderizado
automaticamente. Os campos de string não secretos utilizam a entrada de expressão, e os valores
de configuração de string guardados que começam por `$` são resolvidos antes de o handler do plugin
ser executado.

Os campos secretos (como chaves de API) são mascarados na UI e nunca são escritos nos logs.

## Como os plugins são executados

Os plugins são disponibilizados pelo Heym e instalados por um operador, pelo que o código do plugin é
**fidedigno** e é executado em processo como um nó integrado, com acesso total à rede e
às bibliotecas. Um plugin pode declarar `dependencies` pip que são instaladas na instância
no momento da instalação.

A instalação e remoção de plugins está restrita a operadores cujo email consta
em `HEYM_PLUGIN_ADMIN_EMAILS`, e todo o subsistema é controlado por
`HEYM_PLUGINS_ENABLED` (desativado por predefinição). Consulte
[Execução e implementação](../getting-started/running-and-deployment.md) para as
variáveis de ambiente.

## Ícones personalizados

Um plugin pode incluir logótipos SVG personalizados. Coloque um `icon.svg` na raiz do pacote para definir um
ícone predefinido para todos os nós e/ou atribua a um nó o seu próprio `"icon": "<file>.svg"` no
manifesto. O ícone é apresentado tanto no cartão da paleta como no nó do canvas; os nós
sem ícone recorrem ao glifo predefinido de peça de puzzle.

## AI Builder

Os plugins instalados são disponibilizados ao assistente de IA e ao chat canvas, pelo que pode pedir
ao Heym para "utilizar o plugin Acme CRM para criar um registo" e este irá gerar o
nó Plugin com o `pluginId` e a `config` corretos.

## Criar plugins

Para criar um pacote de plugin, consulte
[Criação de plugins](../reference/plugin-authoring.md) para o layout do zip,
campos do manifesto, assinaturas de handler, ícones, dependências e o modelo de confiança
em tempo de execução.