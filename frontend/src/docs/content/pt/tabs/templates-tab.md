# Separador Modelos

O separador Modelos permite-lhe guardar, explorar e reutilizar workflows completos e nós individuais. Partilhe algo que construiu uma vez e aplique-o a novos projetos com um único clique.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Ver demonstração de Modelos</a></p>

## Visão geral

Existem dois tipos de modelos:

- **Modelos de workflow** — guarde um workflow completo (todos os nós e ligações) como ponto de partida reutilizável.
- **Modelos de nó** — guarde um único nó configurado (por exemplo, um Nó LLM ajustado ou um nó HTTP personalizado) para reutilização em diferentes workflows.

Alterne entre os dois utilizando o seletor **Workflows / Nós** no topo do separador.

Utilize a barra de pesquisa para filtrar os modelos visíveis por nome, descrição, etiquetas ou tipo de nó.

---

## Criar um Modelo

### Modelo de workflow

1. Abra o workflow que pretende partilhar no editor.
2. Clique em **Partilhar como Modelo** na barra de ferramentas superior.
3. Preencha o nome, a descrição e as etiquetas opcionais.
4. Escolha a visibilidade: **Todos** (todos os utilizadores) ou **Utilizadores específicos** (introduza nomes de utilizador e/ou selecione equipas).
5. Clique em **Partilhar**. Uma notificação verde confirma o sucesso.

### Modelo de nó

1. Clique com o botão direito em qualquer nó no canvas.
2. Selecione **Partilhar como Modelo** no menu de contexto.
3. Preencha o formulário e clique em **Partilhar**.

---

## Utilizar um Modelo

### Modelo de workflow

1. Abra o separador **Modelos** e certifique-se de que **Workflows** está selecionado.
2. Clique num cartão para pré-visualizá-lo ou clique diretamente em **Utilizar**.
3. O workflow é clonado para um novo workflow que abre no editor.

### Modelo de nó

1. Abra o separador **Modelos** e selecione **Nós**.
2. Clique em **Utilizar** num cartão de modelo de nó.
3. Aparece uma caixa de diálogo — escolha onde adicionar o nó:
   - **Novo workflow** — cria um novo workflow que contém apenas este nó.
   - **Workflow existente** — escolha na sua lista de workflows; o nó é inserido automaticamente quando o editor abre.

---

## Pré-visualização

Clique em qualquer cartão de modelo para abrir uma pré-visualização completa:

- **Miniaturas dos cartões** — os cartões de modelo apresentam uma captura do canvas em modo de leitura, ajustada, tanto para workflows como para modelos de nó único.
- **Modelos de workflow** — um canvas em modo de leitura que corresponde ao estilo de pré-visualização do histórico de edição, incluindo deslocamento e zoom.
- **Modelos de nó** — o nó guardado abre no mesmo canvas em modo de leitura como pré-visualização de nó único.
- **Detalhes do nó** — clique em qualquer nó na pré-visualização para inspecionar a sua configuração guardada no painel lateral.
- As etiquetas, a contagem de utilizações e o **proprietário** são apresentados para todos os modelos.

Prima **ESC** ou clique fora para fechar a pré-visualização.

---

## Gerir Modelos

- **Editar** – Se for o proprietário do modelo, passe o cursor sobre o cartão e clique no ícone de lápis para atualizar o nome, a descrição, as etiquetas ou a visibilidade
- **Eliminar** – Se for o proprietário do modelo, passe o cursor sobre o cartão e elimine o modelo após o pedido de confirmação
- **Ações exclusivas do proprietário** – Os controlos de edição e eliminação são apresentados apenas para os modelos que criou

---

## Paleta de Comandos (CTRL+K)

Os modelos (tanto de workflow como de nó) são pesquisáveis a partir da paleta de comandos **CTRL+K**. Selecione um modelo para o utilizar imediatamente — os modelos de workflow abrem no editor, os modelos de nó solicitam um destino.

---

## Modelos no Chat

Pode fazer perguntas à IA sobre os seus modelos — esta conhece todos os modelos no seu espaço de trabalho.

---

## Visibilidade

| Definição | Quem pode ver |
|---|---|
| Todos | Todos os utilizadores na plataforma |
| Utilizadores específicos | Utilizadores que indicar por nome e/ou equipas que selecionar — todos os membros da equipa obtêm acesso |

Ao partilhar com **Utilizadores específicos**, pode adicionar tanto utilizadores individuais (por nome) como equipas. Os membros da equipa veem o modelo no separador Modelos e podem utilizá-lo.

---

## Relacionado

- [Equipas](../reference/teams.md) – Partilhar modelos com equipas
- [Funcionalidades do Canvas](../reference/canvas-features.md)
- [Estrutura do Workflow](../reference/workflow-structure.md)
- [Tipos de Nó](../reference/node-types.md)
- [Separador Chat](./chat-tab.md)
- [Apresentação Contextual](../reference/contextual-showcase.md) – Guia breve das páginas para os separadores do painel
