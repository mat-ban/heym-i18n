# Análise de arquivos

A análise de ficheiros permite que o Chat, o [nó Agent](../nodes/agent-node.md) e o [nó Code](../nodes/code-node.md) abram e analisem ficheiros grandes a partir do [Drive](./drive.md) numa sandbox Python isolada. Ficheiros PDF, folhas de cálculo, CSV, DOCX e JSON são primeiramente inspecionados e depois lidos seletivamente, para que um contrato de 200 páginas ou uma folha de cálculo com um milhão de linhas nunca tenha de caber na íntegra no contexto de um modelo.

## Como funciona

Cada chamada é executada num novo contentor sem acesso à rede. Os ficheiros necessários são copiados em modo de apenas leitura, o código é executado e o contentor é removido. Uma pequena pasta de trabalho persiste entre as chamadas da mesma sessão, permitindo que um passo posterior continue a partir dos resultados guardados por um anterior.

| Caminho | Conteúdo |
|------|--------|
| `/input` | Ficheiros do Drive desta sessão, apenas leitura |
| `/work` | Espaço de trabalho temporário que persiste durante a sessão, por exemplo `/work/sales.pkl` |
| `/work/out` | Os ficheiros gravados aqui são guardados no Drive após a chamada e devolvidos como links |

A sandbox inclui pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx e langdetect pré-instalados, além do OCR Tesseract utilizado pelo [nó Converter](../nodes/converter-node.md).

## Ferramentas

O modelo trabalha com três ferramentas, além de uma quarta no Chat:

| Ferramenta | Função |
|------|----------|
| `list_files` | Lista os ficheiros do Drive acessíveis: nome, tipo, tamanho, data |
| `inspect_file` | Devolve tipo, metadados e estrutura de um ficheiro com um breve excerto |
| `run_python` | Executa Python sobre os ficheiros indicados e devolve o output da consola |
| `clear_workspace` | Apenas Chat: elimina a pasta de trabalho da conversa |

O `inspect_file` lê apenas o necessário para um resumo:

| Tipo | Resumo |
|-----|-----------------|
| PDF | Contagem de páginas, título e autor, extraibilidade de texto, idioma, tamanhos de página, texto e tabelas da primeira página. PDFs digitalizados são lidos por OCR (até 5 páginas) |
| XLSX / XLS | Folhas com contagem de linhas e colunas, linhas de cabeçalho, tipos, `read_hint` do pandas, intervalos com nome, primeiras linhas |
| CSV / TSV | Codificação, delimitador, contagem de linhas, colunas com tipos, primeiras linhas |
| DOCX | Estrutura de tópicos, tabelas, contagem de palavras e carateres, autor e data |
| JSON | Tipo de raiz, chaves, tamanho do array, profundidade de aninhamento, registos de amostra |

Dentro de `run_python`, abra um ficheiro com o módulo `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## No Chat

Anexe ficheiros PDF, folhas de cálculo, DOCX, CSV ou JSON, imagens (PNG, JPG, GIF, WebP) ou ficheiros de texto simples no [separador Chat](../tabs/chat-tab.md), no Chat do Heym Work ou através da ferramenta MCP `heym_chat`. Uma mensagem pode conter até 10 ficheiros. Cada ficheiro é guardado no seu Drive; apenas o nome e o ID são enviados na mensagem. O Chat inspeciona o ficheiro, lê a parte relevante para a pergunta e responde com tabelas ou excertos.

## Nos Workflows

Uma execução apenas abre os seus próprios ficheiros: aqueles carregados pelo [nó Trigger de Upload de Arquivo](../nodes/file-upload-trigger-node.md), aqueles que os nós escreveram no Drive e aqueles que um [nó Drive](../nodes/drive-node.md) obteve com o passo **Get** na mesma execução.

- **Nó Agent**: se a entrada ou mensagem do agente contiver um ficheiro, este obtém automaticamente as ferramentas acima para esses ficheiros.
- **Nó Code**: defina **Files** com uma expressão como `$Upload.file.id`. Os ficheiros são montados e listados em `params.files`.

## Limites

| Limite | Valor |
|-----------|------|
| Memória por chamada | 2 GB |
| Tempo por chamada | 120 segundos |
| Pasta de trabalho por sessão | 2 GB |
| Ficheiros de saída por chamada | 20, até 100 MB cada |
| Output impresso devolvido ao modelo | 20.000 carateres |
| Ficheiros por chamada | 20 |

## Segurança

- A sandbox não tem acesso à rede, não tem acesso às definições ou segredos do Heym e é executada como utilizador sem privilégios.
- Os ficheiros são processados exclusivamente dentro da sandbox.
- No Chat, o acesso respeita o Drive: abre os seus ficheiros e os partilhados com as suas equipas.
- A abertura de um ficheiro no Chat é registada no log de auditoria.
- Os conteúdos dos ficheiros são tratados como dados brutos; as instruções neles contidas não são executadas.

## Requisitos

A análise de ficheiros necessita de um backend de sandbox na instância do Heym (Docker ou [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Relacionados

- [Drive](./drive.md)
- [Nó Code](../nodes/code-node.md)
- [Nó Agent](../nodes/agent-node.md)
- [Separador Chat](../tabs/chat-tab.md)
