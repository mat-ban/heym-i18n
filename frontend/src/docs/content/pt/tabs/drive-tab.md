# Separador Drive

O separador Drive mostra todos os ficheiros gerados por skills em todos os seus workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Ver demonstração do Drive</a></p>

## Visão geral

Os ficheiros gerados por skills (PDF, DOCX, CSV, imagens, etc.) são automaticamente armazenados e listados no separador Drive. Cada ficheiro apresenta o seu nome, tipo, tamanho, nó de origem, data de criação e estado de partilha com equipas.

## Funcionalidades

- **Pesquisa** - Filtrar ficheiros por nome, tipo ou nó de origem
- **Copiar ID do ficheiro** - Copiar o UUID do ficheiro para a área de transferência, pronto a colar num nó [Drive](../nodes/drive-node.md) ou [Converter](../nodes/converter-node.md)
- **Transferir** - Transferência autenticada dos seus ficheiros e dos ficheiros partilhados consigo através de equipas
- **Partilhar** - Criar ligações de transferência partilháveis com proteção por palavra-passe e expiração opcionais, ou partilhar um ficheiro em modo de leitura com as suas equipas atuais
- **Eliminar** - Remover ficheiros e as respetivas ligações de partilha
- **Limpar tudo** - Eliminar todos os ficheiros e as respetivas ligações de partilha após confirmação
- **Ações em massa** - Selecionar vários ficheiros com caixas de seleção (Shift-clique para um intervalo) e aplicar a mesma ação a todos de uma só vez
- **Paginação** - Navegar por coleções extensas de ficheiros, com um seletor de linhas por página (25 / 50 / 100 / Todas)

## Ações em massa

Os ficheiros que lhe pertencem apresentam uma caixa de seleção no início da respetiva linha (os ficheiros partilhados consigo através de uma equipa são só de leitura e não podem ser selecionados). Selecione várias linhas — ou utilize a caixa de seleção do cabeçalho para selecionar a página inteira, e **Shift-clique** para selecionar um intervalo — e depois utilize a barra de ações em massa que aparece acima da lista:

- **Transferir ZIP** agrupa todos os ficheiros selecionados num único arquivo ZIP e transfere-o
- **Ações em massa** abre uma única caixa de diálogo para aplicar uma definição a todos os ficheiros selecionados:
  - **Partilhar tudo com as minhas equipas** / **Remover partilha com equipas** com um clique
  - **Criar ligação de partilha para cada ficheiro** utilizando as mesmas definições de palavra-passe, expiração e transferências máximas
- **Eliminar** remove todos os ficheiros selecionados e as respetivas ligações de partilha após confirmação
- **Limpar seleção** desmarca tudo

A caixa de diálogo indica a quantos ficheiros foi aplicada a ação (os ficheiros que não lhe pertencem são ignorados). Utilize a opção **Todas** do seletor de linhas por página para carregar todos os ficheiros numa só página e selecionar em todo o seu Drive. Ao escrever na caixa de pesquisa, o seletor de linhas por página muda automaticamente para **Todas**, para que a pesquisa abranja todos os ficheiros e não apenas a página atual; ao limpar a pesquisa, a seleção anterior é restaurada.

## Partilha

Crie ligações de partilha com:
- **Sem autenticação** - URL de transferência pública baseado em token
- **Autenticação básica** - Ligação protegida por palavra-passe (nome de utilizador: `file`)
- **Expiração** - Expiração opcional baseada em tempo
- **Limites de transferência** - Número máximo de transferências opcional

Ative **Partilhar com as minhas equipas** num ficheiro para o tornar visível a todas as equipas a que pertence atualmente. Os membros das equipas partilhadas obtêm acesso só de leitura; as ações de gestão permanecem exclusivas do proprietário.

## Acesso de skills do agente

As skills no nó de agente podem optar por ler ficheiros do Drive. Quando **Ativar ficheiros do Drive** está ligado para uma skill, o respetivo código Python pode ler ficheiros acessíveis do Drive por id de ficheiro ou nome de ficheiro exato através do auxiliar gerado `heym_drive.py`. A definição está desativada por predefinição.

Consulte a [referência do Drive](../reference/drive.md) para obter todos os detalhes.

## Relacionado

- [Nó Drive](../nodes/drive-node.md) - Listar ficheiros, obter metadados, partilhar com equipas ou alterar restrições de partilha a partir de um workflow
- [Geração de ficheiros](../reference/file-generation.md) - Como as skills geram ficheiros
- [Referência do Drive](../reference/drive.md) - Ligações de partilha, tokens e limpeza
- [Portal](../reference/portal.md) - Ligações de ficheiros nas respostas de chat do portal
