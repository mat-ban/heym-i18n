# Redigeringshistorik

Redigeringshistorik sporer gemte versioner af et workflow. Den bruges til at se ændringer over tid, sammenligne versioner eller vende tilbage til en tidligere tilstand.

**Bemærk:** Redigeringshistorik adskiller sig fra [Kørselshistorik](./execution-history.md). Redigeringshistorik sporer **gemte versioner** (ændringer i workflow-strukturen), mens kørselshistorik sporer **udførelser** (tidligere kørsler).

## Hvor den findes

**Editorværktøjslinje** → **Redigeringshistorik** (GitBranch-ikon)

## Versioner

En ny version oprettes hver gang workflowet **gemmes**. Listen viser:

- **Nuværende** – Den seneste gemte tilstand (hvad der vises på canvas)
- **Version N** – Tidligere gemte versioner med tidsstempler

Versioner uden ændringer i forhold til den foregående vises ikke.

## Diff-visning

Vælg en version for at se, hvad der er ændret i forhold til det nuværende workflow:

| Ændringstype | Beskrivelse |
|-------------|--------------|
| **Noder** | Tilføjede, fjernede eller modificerede noder |
| **Forbindelser** | Tilføjede, fjernede eller modificerede forbindelser |
| **Konfiguration** | Workflow-niveau-indstillinger (auth, rate limits osv.) |

Udvid hver ændring for at se feltniveau-diffs (f.eks. hvilke node-egenskaber der er ændret).

## Forhåndsvisning

For at se, hvordan workflowet så ud i en tidligere version, klikkes **Forhåndsvisning** ved siden af Tilbagefør.

En skrivebeskyttet canvas åbnes med noder og forbindelser fra den pågældende version. Det er muligt at panorerer og zoome for at udforske layoutet; ingen ændringer kan foretages fra denne visning.

## Tilbageførsel

For at gendanne en tidligere version:

1. Vælg den ønskede version
2. Klik **Tilbagefør**
3. Bekræft handlingen
4. Det nuværende workflow erstattes med den valgte version; siden genindlæses

Tilbageførsel opretter en ny "nuværende" tilstand - det er muligt at tilbageføre igen, hvis nødvendigt.

## Ryd historik

Klik skraldespandsikonet i dialoghovedet for at fjerne hele versionshistorikken. Denne handling kan ikke fortrydes. Det nuværende workflow forbliver; kun tidligere versioner slettes.

## Hvornår versioner oprettes

Versioner oprettes kun, når der **gemmes** (Ctrl/Cmd+S eller Gem-knappen). Ugemte ændringer gemmes ikke i redigeringshistorikken, før de gemmes.

Ændringer i agentfærdigheder inkluderes i disse snapshots. For at gennemse eller gendanne en enkelt færdighed uden at tilbageføre hele workflowet, bruges **Historik**-knappen på færdighedskortet i Agent node-egenskabspanel. Se [Agent Node](../nodes/agent-node.md#skill-history).

## Relateret

- [Kørselshistorik](./execution-history.md) – Tidligere kørsler og Bring to Canvas
- [Workflow-struktur](./workflow-structure.md) – Node- og forbindelsesformat
- [Workflows-fanen](../tabs/workflows-tab.md) – Opret og administrer workflows
