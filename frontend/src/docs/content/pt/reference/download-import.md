# Download e Importação

Exporte workflows ou pastas inteiras como arquivos, ou importe-os por meio de arrastar e soltar. Utilize este recurso para backup, compartilhamento ou migração de workflows entre instâncias.

## Download de Workflow (JSON)

**Localização:** Barra de ferramentas do editor → botão **Download** (visível em telas grandes)

**O que é exportado:**
- `nodes` – Todos os nós no canvas
- `edges` – Todas as conexões entre nós

**Nome do arquivo:** `{workflow-name}.json` (derivado do nome do workflow)

**Formato:** Consulte [Workflow Structure](./workflow-structure.md) para o esquema JSON.

## Download de Pasta (ZIP)

**Localização:** Dashboard → aba Workflows → menu de 3 pontos da pasta → **Download as ZIP**

**O que é exportado:**
- Todos os workflows na pasta e em todas as subpastas, recursivamente
- Hierarquia de pastas preservada como diretórios dentro do ZIP

**Estrutura do ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Cada arquivo `.json` contém `{ name, nodes, edges }`.

## Importação

### A partir do Dashboard (Aba Workflows)

1. Acesse a aba [Workflows](../tabs/workflows-tab.md)
2. Arraste um arquivo **JSON** ou **ZIP** para a área de workflows

**Arquivo JSON:** Um novo workflow é criado. O nome do workflow vem do campo `name` no JSON, ou do nome do arquivo caso `name` esteja ausente.

**Arquivo ZIP:** Toda a estrutura de pastas é recriada no nível raiz. Cada arquivo `.json` dentro do ZIP torna-se um workflow posicionado na pasta correspondente. Credenciais e referências entre workflows que não existem na instância atual são removidas automaticamente. Caso alguns workflows falhem na importação, um resumo exibe quantos foram importados com sucesso.

### A partir do Canvas (Editor)

1. Abra um workflow no editor
2. Arraste um arquivo JSON para o canvas
3. Caso o canvas já contenha nós ou edges, uma caixa de diálogo de confirmação pergunta se o workflow atual deve ser substituído
4. Os nós e edges importados substituem ou são mesclados ao workflow atual

## Formatos de Arquivo

### JSON (workflow único)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Obrigatório; array de objetos de nó
- `edges` – Opcional; array de objetos de edge (padrão: `[]`)
- `name` – Opcional; utilizado ao criar um novo workflow a partir da importação pelo Dashboard

### ZIP (pasta)

Arquivo ZIP cuja estrutura de diretórios espelha a hierarquia de pastas. Cada arquivo é um JSON de workflow (consulte acima). Os nomes de pastas e workflows são derivados dos nomes de diretórios e arquivos, respectivamente.

Consulte [Workflow Structure](./workflow-structure.md) para os formatos de nó e edge.

## Casos de Uso

- **Backup** – Baixe workflows ou pastas inteiras antes de alterações significativas
- **Compartilhamento** – Exporte e compartilhe arquivos JSON com membros da equipe
- **Migração** – Mova workflows ou estruturas de pastas entre instâncias do Heym
- **Controle de versão** – Armazene o JSON do workflow no Git junto ao código

## Relacionados

- [Workflow Structure](./workflow-structure.md) – Formato JSON para nós e edges
- [Workflows Tab](../tabs/workflows-tab.md) – Crie workflows e importe por meio de arrastar e soltar
- [Workflow Organization](./workflow-organization.md) – Pastas e subpastas
- [Canvas Features](./canvas-features.md) – Recursos do editor, incluindo importação pelo canvas