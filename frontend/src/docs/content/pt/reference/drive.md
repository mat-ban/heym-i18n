# Drive

A aba Drive oferece um local central para visualizar, gerenciar e compartilhar todos os arquivos gerados pelas skills.

## Acessando o Drive

Navegue até a aba **Drive** no dashboard. Todos os arquivos gerados pelas skills do seu workflow aparecem aqui, ordenados por data de criação.

## Lista de arquivos

A lista de arquivos exibe:

- **Name** - Nome original do arquivo com um ícone específico do tipo
- **Type** - Tipo MIME do arquivo (ex.: pdf, csv, docx)
- **Size** - Tamanho do arquivo em formato legível
- **Source** - O rótulo do nó que gerou o arquivo
- **Date** - Quando o arquivo foi criado
- **Actions** - Botões de download, compartilhamento e exclusão

## Ações em massa

Cada arquivo que você possui tem uma caixa de seleção no início da sua linha. Arquivos compartilhados com você por meio de uma equipe são somente leitura e não podem ser selecionados. Selecione vários arquivos (Shift-clique seleciona um intervalo contíguo; a caixa de seleção do cabeçalho seleciona a página inteira) para revelar a barra de ações em massa acima da lista e, em seguida, clique em **Bulk actions** para abrir uma única caixa de diálogo que aplica a mesma configuração a todos os arquivos selecionados:

- **Share all with my teams** / **Remove team sharing** — alterna o compartilhamento com equipes para todos os arquivos selecionados de uma só vez
- **Create share link for each file** — cria um link de compartilhamento em cada arquivo selecionado usando os mesmos valores de expiração, senha e máximo de downloads

A caixa de diálogo informa a quantos arquivos a configuração foi aplicada; arquivos que você não possui são ignorados. O seletor de linhas por página (25 / 50 / 100 / **All**) na parte inferior da lista permite carregar mais arquivos em uma única página, para que você possa selecionar em todo o seu Drive.

## Compartilhando arquivos

Clique no ícone **Share** para abrir a caixa de diálogo de compartilhamento. Você pode criar vários links de compartilhamento por arquivo com configurações diferentes e, opcionalmente, compartilhar o arquivo com suas equipes atuais.

### Link público (baseado em Token)

Crie um link de compartilhamento sem senha. Qualquer pessoa com o link pode baixar o arquivo.

### Link protegido por senha (Basic Auth)

Defina uma senha ao criar o compartilhamento. A URL de download usa HTTP Basic Authentication - os navegadores solicitarão o nome de usuário (`file`) e a senha quando o link for aberto.

### Opções de link

- **Expires (hours)** - Opcionalmente, defina um tempo de expiração
- **Max downloads** - Opcionalmente, limite o número de downloads
- Ambos podem ser combinados para controle máximo

### Compartilhar com minhas equipes

Ative **Share with my teams** para conceder acesso somente leitura a todas as equipes às quais você pertence atualmente. Os membros da equipe podem ver e baixar o arquivo pelo Drive e usar operações de leitura do nó Drive, mas apenas o proprietário do arquivo pode excluí-lo, criar ou revogar links públicos, ou alterar senha/TTL/limites de download.

A configuração é específica por arquivo. Se você entrar ou criar outra equipe posteriormente, alterne o compartilhamento novamente ou execute a operação `shareWithMyTeams` do nó Drive para adicionar essa equipe. Use `unshareWithMyTeams` para remover os compartilhamentos de equipe do arquivo em um workflow.

### Gerenciando compartilhamentos

A caixa de diálogo de compartilhamento exibe todos os links de compartilhamento existentes com:
- Contagem atual de downloads
- Status de expiração
- Se o Basic Auth está habilitado
- Botões de copiar e revogar

## Links de arquivos no Chat e no Portal

Quando uma skill gera arquivos durante uma execução de workflow por meio do chat do Portal ou do Quick Drawer, os links de download aparecem automaticamente na resposta. Os usuários podem clicar para baixar diretamente.

## Armazenamento

Os arquivos gerados são armazenados no sistema de arquivos do servidor em `data/files/`. Em implantações Docker, isso é montado como um volume para persistência.

## Gerenciando arquivos a partir de Workflows

O [nó Drive](../nodes/drive-node.md) permite gerenciar arquivos do Drive programaticamente de dentro de um workflow. Use-o para:

- **Listar** seus arquivos e retornar metadados como nome do arquivo, tipo MIME, tamanho, origem e URL de download
- **Excluir** um arquivo após ele ter sido entregue ao usuário
- **Compartilhar ou descompartilhar com suas equipes** para que os membros da equipe possam lê-lo e baixá-lo apenas enquanto o compartilhamento de equipe existir
- **Definir uma senha** no link de download
- **Definir um TTL** para que o link expire após N horas
- **Definir um limite máximo de downloads**

Converter um arquivo para outro formato é tarefa do [nó Converter](../nodes/converter-node.md), com `conversion: "fileConvert"`. Ele lê um arquivo do Drive e armazena o resultado convertido como um novo arquivo.

Referencie o arquivo pelo seu ID a partir da saída da skill: `$agentLabel._generated_files[0].id`

Consulte a [documentação do nó Drive](../nodes/drive-node.md) para detalhes de configuração.

## Lendo arquivos do Drive a partir de Skills

As skills de Agent podem optar por leituras do Drive com a configuração **Enable Drive files** do cartão da skill. Quando habilitada, o runtime da skill inclui um helper gerado `heym_drive.py`. O código da skill pode importar helpers como `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` e `list_drive_files`.

As leituras do Drive são limitadas aos arquivos acessíveis ao ator do workflow: arquivos próprios e arquivos compartilhados com o ator por meio de equipes. Use um ID de arquivo para busca exata, ou um nome de arquivo exato quando o usuário se referir a um arquivo pelo nome. A busca por nome de arquivo retorna o arquivo acessível mais recente com esse nome; `list_drive_files(filename="...")` retorna todas as correspondências.
## Relacionado

- [Nó Drive](../nodes/drive-node.md) - Operações de Workflow (listar, obter, excluir, senha, TTL, máximo de downloads, compartilhamento em equipe)
- [Aba Drive](../tabs/drive-tab.md) - Navegue pelos arquivos no dashboard
- [Geração de Arquivos](./file-generation.md) - Como `_generated_files` e as URLs de download são produzidos

## Limpeza
Os tokens de compartilhamento expirados são limpos automaticamente todos os dias. Os arquivos em si persistem até serem excluídos manualmente por meio da aba Drive. Utilize **Clear All** para excluir todos os arquivos e seus links de compartilhamento em uma única ação.
