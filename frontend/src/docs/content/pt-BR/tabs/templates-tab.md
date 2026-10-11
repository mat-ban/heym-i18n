# Aba Templates

A aba Templates permite salvar, navegar e reutilizar workflows completos e nós individuais. Compartilhe algo que você criou uma vez e aplique-o a novos projetos com um clique.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Assista à demonstração de Templates</a></p>

## Visão Geral

Existem dois tipos de templates:

- **Templates de workflow** — salve um workflow completo (todos os nós e conexões) como ponto de partida reutilizável.
- **Templates de nó** — salve um único nó configurado (por exemplo, um Nó LLM ajustado ou um Nó HTTP personalizado) para reutilização em diferentes workflows.

Alterne entre os dois usando o seletor **Workflows / Nodes** no topo da aba.

Use a barra de busca para filtrar os templates visíveis por nome, descrição, tags ou tipo de nó.

---

## Criando um Template

### Template de workflow

1. Abra o workflow que deseja compartilhar no editor.
2. Clique em **Share as Template** na barra de ferramentas superior.
3. Preencha nome, descrição e tags opcionais.
4. Escolha a visibilidade: **Everyone** (todos os usuários) ou **Specific users** (insira nomes de usuário e/ou selecione equipes).
5. Clique em **Share**. Uma notificação verde confirma o sucesso.

### Template de nó

1. Clique com o botão direito em qualquer nó no canvas.
2. Selecione **Share as Template** no menu de contexto.
3. Preencha o formulário e clique em **Share**.

---

## Usando um Template

### Template de workflow

1. Abra a aba **Templates** e certifique-se de que **Workflows** esteja selecionado.
2. Clique em um card para visualizá-lo ou clique diretamente em **Use**.
3. O workflow é clonado em um novo workflow que abre no editor.

### Template de nó

1. Abra a aba **Templates** e selecione **Nodes**.
2. Clique em **Use** no card do template de nó.
3. Um diálogo aparece — escolha onde adicionar o nó:
   - **New workflow** — cria um novo workflow contendo apenas este nó.
   - **Existing workflow** — escolha na sua lista de workflows; o nó é inserido automaticamente quando o editor abrir.

---

## Pré-visualização

Clique em qualquer card de template para abrir uma pré-visualização completa:

- **Miniaturas dos cards** — os cards de template renderizam um snapshot ajustado do canvas em modo somente leitura, tanto para workflows quanto para templates de nó único.
- **Templates de workflow** — um canvas somente leitura que corresponde ao estilo de pré-visualização do histórico de edição, incluindo pan e zoom.
- **Templates de nó** — o nó salvo abre no mesmo canvas somente leitura como pré-visualização de nó único.
- **Detalhes do nó** — clique em qualquer nó na pré-visualização para inspecionar sua configuração salva no painel lateral.
- Tags, contagem de usos e **owner** são exibidos para todos os templates.

Pressione **ESC** ou clique fora para fechar a pré-visualização.

---

## Gerenciando Templates

- **Edit** – Se você for o proprietário do template, passe o mouse sobre o card e clique no ícone de lápis para atualizar seu nome, descrição, tags ou visibilidade
- **Delete** – Se você for o proprietário do template, passe o mouse sobre o card e exclua o template após o prompt de confirmação
- **Ações exclusivas do proprietário** – Os controles de edição e exclusão são exibidos apenas para templates que você criou

---

## Command Palette (CTRL+K)

Os templates (tanto de workflow quanto de nó) são pesquisáveis na command palette **CTRL+K**. Selecione um template para usá-lo imediatamente — templates de workflow abrem no editor, templates de nó solicitam um destino.

---

## Templates no Chat

Você pode fazer perguntas à IA sobre seus templates — ela conhece todos os templates do seu workspace.

---

## Visibilidade

| Configuração | Quem pode ver |
|---|---|
| Everyone | Todos os usuários da plataforma |
| Specific users | Usuários que você lista por nome e/ou equipes que você seleciona — todos os membros da equipe ganham acesso |

Ao compartilhar com **Specific users**, você pode adicionar tanto usuários individuais (por nome) quanto equipes. Os membros da equipe veem o template na aba Templates e podem usá-lo.

---

## Relacionados

- [Teams](../reference/teams.md) – Compartilhe templates com equipes
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia resumido das abas do dashboard
