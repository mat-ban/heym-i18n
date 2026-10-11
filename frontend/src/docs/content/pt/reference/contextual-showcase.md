# Vitrine Contextual

A **Vitrine Contextual** é uma guia leve no aplicativo que explica a página em que você se encontra no momento, sem direcioná-lo imediatamente para um fluxo completo de documentação.

## O Que Ela Faz

- Exibe um breve resumo da página atual
- Mantém a primeira camada concisa para não sobrecarregá-lo
- Permite expandir um pequeno volume de detalhes adicionais apenas quando necessário
- Oferece links para a página completa de documentação para leitura mais aprofundada

## Onde Ela Aparece

Na v1, a vitrine está disponível nas principais superfícies autenticadas do Heym:

- Abas do Dashboard
- [Avaliações](../tabs/evals-tab.md)
- [Documentação](../getting-started/introduction.md)
- O canvas do editor de workflow

Páginas públicas como login, registro, portal de chat e revisão HITL não exibem a vitrine.

## Acesso

### Desktop

- Um trigger fixo **Page Guide** aparece na borda direita da tela
- A vitrine abre como um drawer lateral direito
- Permanece fechada por padrão
- Um teaser exibido uma única vez ajuda a revelar que a guia existe sem forçá-la a abrir

### Mobile

- O mesmo conteúdo está disponível a partir de um botão flutuante **Page Guide**
- Abre em uma bottom sheet em vez de uma barra lateral direita

## Modelo de Conteúdo

Cada entrada da vitrine utiliza uma definição estruturada em vez de um componente totalmente personalizado.

- **Título** – O que é esta página
- **Resumo** – Uma breve explicação
- **Bullets** – Algumas indicações de leitura rápida
- **Destaques** – Pequenos cards para valor principal ou padrões de uso
- **Mais Detalhes** – Seções recolhidas para contexto adicional
- **Ações** – Geralmente um ou dois links, na maioria das vezes para a documentação completa

Isso mantém o sistema flexível enquanto evita painéis de ajuda longos e ruidosos.

## Consciência de Contexto

A vitrine muda conforme a superfície atual.

- Cada aba do Dashboard possui seu próprio resumo
- O editor aponta para [Canvas Features](./canvas-features.md)
- A página de documentação utiliza uma visão geral genérica de docs e, quando possível, aponta para o artigo atual que você já tem aberto

## Persistência

A vitrine armazena uma pequena quantidade de estado pessoal de UI no armazenamento do navegador:

- Se o painel ou a sheet estava aberto por último
- Quais contextos de página já exibiram o teaser
- A última seção de detalhes expandida por contexto

## Por Que Ela Existe

O objetivo é tornar o Heym mais fácil de aprender sem adicionar mais elementos pesados de UI.

- Orientação curta e sempre próxima para localização
- Caminho claro para documentação mais aprofundada
- Baixa interrupção para usuários experientes

## Relacionados

- [Workflows Tab](../tabs/workflows-tab.md) – Superfície principal do Dashboard
- [Evals Tab](../tabs/evals-tab.md) – Workflows de avaliação
- [Canvas Features](./canvas-features.md) – Comportamento do editor e depuração
- [Quick Drawer](./quick-drawer.md) – A outra superfície utilitária fixa do lado direito