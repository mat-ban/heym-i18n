# Showcase Contextual

O **Contextual Showcase** é um guia leve dentro do aplicativo que explica a página em que você está no momento, sem direcioná-lo imediatamente para um fluxo completo de documentação.

## O Que Ele Faz

- Exibe um resumo curto da página atual
- Mantém a primeira camada concisa para não sobrecarregá-lo
- Permite expandir um pequeno volume de detalhes adicionais apenas quando necessário
- Oferece links para a página completa de documentação para leitura mais aprofundada

## Onde Ele Aparece

Na v1, o showcase está disponível nas principais superfícies autenticadas do Heym:

- Abas do Dashboard
- [Evals](../tabs/evals-tab.md)
- [Documentation](../getting-started/introduction.md)
- A tela do editor de workflow

Páginas públicas como login, registro, portal de chat e revisão HITL não exibem o showcase.

## Acesso

### Desktop

- Um acionador fixo **Page Guide** aparece na borda direita da tela
- O showcase abre como um drawer lateral direito
- Ele permanece fechado por padrão
- Um teaser exibido uma única vez ajuda a revelar que o guia existe, sem forçá-lo a abrir

### Mobile

- O mesmo conteúdo está disponível a partir de um botão flutuante **Page Guide**
- Ele abre em um bottom sheet em vez de uma barra lateral direita

## Modelo de Conteúdo

Cada entrada do showcase utiliza uma definição estruturada em vez de um componente totalmente personalizado.

- **Title** – O que é esta página
- **Summary** – Uma explicação curta
- **Bullets** – Algumas dicas de leitura rápida
- **Highlights** – Pequenos cards para valores-chave ou padrões de uso
- **More Detail** – Seções recolhidas para contexto adicional
- **Actions** – Geralmente um ou dois links, na maioria das vezes para a documentação completa

Isso mantém o sistema flexível, evitando painéis de ajuda longos e poluídos.

## Consciência de Contexto

O showcase muda conforme a superfície atual.

- Cada aba do Dashboard tem seu próprio resumo
- O editor aponta para [Canvas Features](./canvas-features.md)
- A página de docs utiliza uma visão geral genérica de documentação e, quando possível, aponta para o artigo atual que você já tem aberto

## Persistência

O showcase armazena uma pequena quantidade de estado pessoal de UI no armazenamento do navegador:

- Se o painel ou sheet estava aberto por último
- Quais contextos de página já exibiram o teaser
- A última seção de detalhes expandida por contexto

## Por Que Ele Existe

O objetivo é tornar o Heym mais fácil de aprender sem adicionar mais elementos pesados de UI.

- Orientação curta e sempre próxima para localização
- Caminho claro para documentação mais aprofundada
- Baixa interrupção para usuários experientes

## Relacionados

- [Workflows Tab](../tabs/workflows-tab.md) – Superfície principal do dashboard
- [Evals Tab](../tabs/evals-tab.md) – Workflows de avaliação
- [Canvas Features](./canvas-features.md) – Comportamento do editor e depuração
- [Quick Drawer](./quick-drawer.md) – A outra superfície utilitária fixa do lado direito
