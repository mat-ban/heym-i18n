# Análise de arquivos

A análise de arquivos permite que o Chat, o [nó Agent](../nodes/agent-node.md) e o [nó Code](../nodes/code-node.md) abram e analisem arquivos grandes do [Drive](./drive.md) em um sandbox Python isolado. PDFs, planilhas, CSV, DOCX e JSON são inspecionados primeiro e depois lidos seletivamente, para que um contrato de 200 páginas ou uma pasta de trabalho com um milhão de linhas nunca precise caber no contexto de um modelo.

## Como funciona

Cada chamada é executada em um novo contêiner sem acesso à rede. Os arquivos necessários são copiados em modo somente leitura, o código é executado e o contêiner é removido. Uma pequena pasta de trabalho persiste entre as chamadas da mesma sessão, permitindo que uma etapa posterior continue a partir dos resultados salvos por uma anterior.

| Caminho | Conteúdo |
|------|--------|
| `/input` | Arquivos do Drive desta sessão, somente leitura |
| `/work` | Espaço de trabalho temporário que persiste durante a sessão, por exemplo `/work/sales.pkl` |
| `/work/out` | Arquivos gravados aqui são salvos no Drive após a chamada e retornados como links |

O sandbox conta com pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx e langdetect pré-instalados, além do OCR Tesseract utilizado pelo [nó Converter](../nodes/converter-node.md).

## Ferramentas

O modelo trabalha com três ferramentas, além de uma quarta no Chat:

| Ferramenta | Função |
|------|----------|
| `list_files` | Lista os arquivos do Drive que você pode abrir: nome, tipo, tamanho, data |
| `inspect_file` | Retorna tipo, metadados e estrutura de um arquivo com uma breve amostra |
| `run_python` | Executa Python sobre os arquivos indicados e retorna o que o código imprime |
| `clear_workspace` | Somente Chat: exclui a pasta de trabalho da conversa |

O `inspect_file` lê apenas o necessário para um resumo:

| Tipo | Resumo |
|-----|-----------------|
| PDF | Contagem de páginas, título e autor, possibilidade de extrair texto, idioma, tamanhos de página, texto e tabelas da primeira página. PDFs digitalizados são lidos com OCR (até 5 páginas) |
| XLSX / XLS | Planilhas com contagem de linhas e colunas, linhas de cabeçalho, tipos, `read_hint` do pandas, intervalos nomeados, primeiras linhas |
| CSV / TSV | Codificação, delimitador, contagem de linhas, colunas com tipos, primeiras linhas |
| DOCX | Estrutura de tópicos, tabelas, contagem de palavras e caracteres, autor e data |
| JSON | Tipo de raiz, chaves, comprimento do array, profundidade de aninhamento, registros de amostra |

Dentro de `run_python`, abra um arquivo com o módulo `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## No Chat

Anexe arquivos PDF, planilhas, DOCX, CSV ou JSON, imagens (PNG, JPG, GIF, WebP) ou arquivos de texto sem formatação na [aba Chat](../tabs/chat-tab.md), no Chat do Heym Work ou por meio da ferramenta MCP `heym_chat`. Uma mensagem pode conter até 10 arquivos. Cada arquivo é armazenado no seu Drive; apenas o nome e o ID entram na mensagem. O Chat inspeciona o arquivo, lê a parte necessária para sua pergunta e responde com tabelas ou trechos.

## Nos Workflows

Uma execução abre apenas seus próprios arquivos: aqueles enviados pelo [nó Trigger de Upload de Arquivo](../nodes/file-upload-trigger-node.md), aqueles que seus nós gravaram no Drive e aqueles que um [nó Drive](../nodes/drive-node.md) buscou na etapa **Get** durante a mesma execução.

- **Nó Agent**: se a entrada ou mensagem do agente contiver um arquivo da execução, ele recebe automaticamente as ferramentas acima para esses arquivos.
- **Nó Code**: defina **Files** com uma expressão como `$Upload.file.id`. Os arquivos são montados e listados em `params.files`.

## Limites

| Limite | Valor |
|-----------|------|
| Memória por chamada | 2 GB |
| Tempo por chamada | 120 segundos |
| Pasta de trabalho por sessão | 2 GB |
| Arquivos de saída por chamada | 20, até 100 MB cada |
| Saída impressa retornada ao modelo | 20.000 caracteres |
| Arquivos por chamada | 20 |

## Segurança

- O sandbox não possui acesso à rede, não acessa configurações nem segredos do Heym e roda como usuário sem privilégios.
- Os arquivos são processados exclusivamente dentro do sandbox.
- No Chat, o acesso segue o Drive: você abre seus próprios arquivos e os compartilhados com seus times.
- A abertura de um arquivo no Chat é registrada no log de auditoria.
- Os conteúdos dos arquivos são tratados estritamente como dados; instruções contidas neles não são executadas.

## Requisitos

A análise de arquivos necessita de um backend de sandbox na instância do Heym (Docker ou [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Relacionados

- [Drive](./drive.md)
- [Nó Code](../nodes/code-node.md)
- [Nó Agent](../nodes/agent-node.md)
- [Aba Chat](../tabs/chat-tab.md)
