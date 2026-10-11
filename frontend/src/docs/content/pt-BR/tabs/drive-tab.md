# Aba Drive

A aba Drive mostra todos os arquivos gerados por skills em seus workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Assistir à demonstração do Drive</a></p>

## Visão Geral

Os arquivos gerados por skills (PDF, DOCX, CSV, imagens, etc.) são automaticamente armazenados e listados na aba Drive. Cada arquivo exibe seu nome, tipo, tamanho, Nó de origem, data de criação e estado de compartilhamento com equipes.

## Recursos

- **Busca** - Filtre arquivos por nome, tipo ou Nó de origem
- **Copiar ID do arquivo** - Copie o UUID do arquivo para a área de transferência, pronto para colar em um Nó [Drive](../nodes/drive-node.md) ou [Converter](../nodes/converter-node.md)
- **Baixar** - Download autenticado para seus arquivos e arquivos compartilhados com você por meio de equipes
- **Compartilhar** - Crie links de download compartilháveis com proteção por senha e expiração opcionais, ou compartilhe um arquivo somente leitura com suas equipes atuais
- **Excluir** - Remova arquivos e seus links de compartilhamento
- **Limpar Tudo** - Exclua todos os arquivos e seus links de compartilhamento após confirmação
- **Ações em massa** - Selecione vários arquivos com caixas de seleção (Shift-click para um intervalo) e aplique a mesma ação a todos de uma vez
- **Paginação** - Navegue por grandes coleções de arquivos, com um seletor de linhas por página (25 / 50 / 100 / Todos)

## Ações em Massa

Os arquivos que você possui exibem uma caixa de seleção no início de sua linha (arquivos compartilhados com você por meio de uma equipe são somente leitura e não podem ser selecionados). Selecione várias linhas — ou use a caixa de seleção do cabeçalho para selecionar a página inteira, e **Shift-click** para selecionar um intervalo — depois use a barra de ações em massa que aparece acima da lista:

- **Baixar ZIP** agrupa todos os arquivos selecionados em um único arquivo ZIP e o baixa
- **Ações em massa** abre uma única caixa de diálogo para aplicar uma configuração a todos os arquivos selecionados:
  - **Compartilhar todos com minhas equipes** / **Remover compartilhamento com equipes** em um clique
  - **Criar link de compartilhamento para cada arquivo** usando as mesmas configurações de senha, expiração e máximo de downloads
- **Excluir** remove todos os arquivos selecionados e seus links de compartilhamento após uma confirmação
- **Limpar seleção** desmarca tudo

A caixa de diálogo informa a quantos arquivos a ação foi aplicada (arquivos que você não possui são ignorados). Use a opção **Todos** do seletor de linhas por página para carregar todos os arquivos em uma única página e selecionar em todo o seu Drive. Digitar na caixa de busca alterna automaticamente o seletor de linhas por página para **Todos**, para que a busca abranja todos os arquivos, não apenas a página atual; limpar a busca restaura sua seleção anterior.

## Compartilhamento

Crie links de compartilhamento com:
- **Sem autenticação** - URL de download público baseado em token
- **Basic Auth** - Link protegido por senha (nome de usuário: `file`)
- **Expiração** - Expiração opcional baseada em tempo
- **Limites de download** - Contagem máxima de downloads opcional

Ative **Compartilhar com minhas equipes** em um arquivo para torná-lo visível a todas as equipes às quais você pertence atualmente. Os membros das equipes compartilhadas obtêm acesso somente leitura; as ações de gerenciamento permanecem exclusivas do proprietário.

## Acesso de Skills do Agente

As skills no Nó Agente podem optar por ler arquivos do Drive. Quando **Habilitar arquivos do Drive** está ativado para uma skill, seu código Python pode ler arquivos acessíveis do Drive por ID de arquivo ou nome de arquivo exato por meio do helper gerado `heym_drive.py`. A configuração fica desativada por padrão.

Consulte a [referência do Drive](../reference/drive.md) para obter detalhes completos.

## Relacionados

- [Nó Drive](../nodes/drive-node.md) - Liste arquivos, recupere metadados, compartilhe com equipes ou altere restrições de compartilhamento a partir de um workflow
- [Geração de Arquivos](../reference/file-generation.md) - Como as skills geram arquivos
- [Referência do Drive](../reference/drive.md) - Links de compartilhamento, tokens e limpeza
- [Portal](../reference/portal.md) - Links de arquivos em respostas de chat do portal
