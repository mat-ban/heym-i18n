# Plugin

O nó **Plugin** executa uma ação personalizada fornecida por um plugin instalado. Os plugins
estendem o Heym com novos tipos de nós — ações, integrações de terceiros ou qualquer coisa
expressável em Python — sem modificar a aplicação principal.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.<keys returned by the plugin>` |

Um **pacote** de plugin (um zip) pode conter **múltiplos nós** — qualquer combinação de ações
e triggers. Cada nó aparece na paleta em **Plugins** com seu próprio
nome e descrição. Arrastar um deles para o canvas cria um nó Plugin vinculado a
esse pacote (`pluginId`) e nó (`pluginNodeKey`).

## Quando Usar

Use um nó Plugin quando um operador tiver instalado um plugin que executa a ação
de que você precisa — por exemplo, chamar uma API privada, comunicar-se com um sistema interno ou
executar lógica personalizada escrita para sua implantação.

Para plugins no estilo trigger que iniciam um workflow, consulte o
[nó Plugin Trigger](./plugin-trigger-node.md).

## Configuração

O formulário de configuração do nó é gerado a partir do manifesto do plugin. Cada campo
declarado pelo plugin (`string`, `number`, `boolean` ou `select`) é renderizado
automaticamente. Campos de string não secretos usam a entrada de expressão, e valores de
configuração de string salvos que começam com `$` são resolvidos antes que o handler do plugin
seja executado.

Campos secretos (como chaves de API) são mascarados na interface e nunca são gravados nos logs.

## Como os Plugins São Executados

Os plugins são entregues pelo Heym e instalados por um operador, portanto o código do plugin é
**confiável** e é executado em processo como um nó integrado, com acesso total à rede e
a bibliotecas. Um plugin pode declarar `dependencies` do pip que são instaladas na
instância no momento da instalação.

A instalação e a remoção de plugins são restritas a operadores cujo e-mail está listado
em `HEYM_PLUGIN_ADMIN_EMAILS`, e todo o subsistema é controlado por
`HEYM_PLUGINS_ENABLED` (desabilitado por padrão). Consulte
[Execução e Implantação](../getting-started/running-and-deployment.md) para obter as
variáveis de ambiente.

## Ícones Personalizados

Um plugin pode incluir logos SVG personalizados. Coloque um `icon.svg` na raiz do pacote para definir um
padrão para todos os nós e/ou atribua a um nó seu próprio `"icon": "<file>.svg"` no
manifesto. O ícone é exibido tanto no cartão da paleta quanto no nó do canvas; nós
sem um ícone usam como fallback o glifo padrão de peça de quebra-cabeça.

## AI Builder

Os plugins instalados são disponibilizados ao assistente de IA e ao canvas de chat, para que você possa pedir
ao Heym para "usar o plugin Acme CRM para criar um registro" e ele gerará o
nó Plugin com o `pluginId` e a `config` corretos.

## Criar Plugins

Para criar um pacote de plugin, consulte
[Criação de Plugins](../reference/plugin-authoring.md) para obter o layout do zip,
os campos do manifesto, as assinaturas de handler, os ícones, as dependências e o modelo de
confiança em tempo de execução.
