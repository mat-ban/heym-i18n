# Agent Persistent Hukommelse

Agent-noder kan opretholde en **per-node vidensgraf** gemt i databasen: enheder (med typer og egenskaber) og relationer mellem dem. Når funktionen er aktiveret, **injicerer Heym en resumé af denne graf i system-prompten** ved hver kørsel (hvis grafen ikke er tom). Efter en vellykket kørsel fusionerer en **LLM-udtrækningsjob** nye fakta fra samtalen ind i grafen i baggrunden.

Underagenter og orkestratorer bruger hver den graf, der er knyttet til **deres egen canvas-node**, som standard. Det er også muligt at **give andre agenter læse- eller læse/skrive-adgang** til denne nodes graf (inklusive agenter i **andre workflows**, der ejes) – se [Deling med andre agenter](#deling-med-andre-agenter).

## Aktivering

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Når `true`, indlæses denne nodes graf i system-prompten, og post-run-udtrækning planlægges for denne nodes graf |
| `memoryShares` | array (valgfri) | Giver andre agent-noder adgang til **denne** nodes hukommelsesgraf; se [Deling](#deling-med-andre-agenter) |

Funktionen aktiveres i Agent-node-egenskaberne (**Persistent hukommelse (graf)**). En pink **hjerne**-ikon på noden åbner grafeditoren, når hukommelsen er aktiveret (eller når en model vises).

## Grafeditor

Dialogen viser enheder som en animeret, kraft-dirigeret graf – farvede cirkler størrelsesjusteret efter forbindelsesantal og grupperet efter enhedstype – samt redigering og navigation (fit view, tidy layout, tastaturgenveje). Det er muligt at **tilføje, redigere eller slette** noder og kanter manuelt; Source/Target-relationsvælgerne er søgbare for grafer med mange enheder. Ved valg af en node vises dens udgående og indgående forbindelser, hvor hver kan klikkes for at hoppe til den pågældende node. Ændringer anvendes kun på **denne** agents graf (grafen for canvas-noden, hvis hjerne der er åbnet).

## Deling med andre agenter

I hukommelsesgrafdialogen giver **Del hukommelse med andre agenter** mulighed for at tilknytte **peers**, der kan anvende denne graf under kørsel:

1. Vælg et **workflow** (ethvert workflow, der kan åbnes i editoren).
2. Vælg en **agent**-node i dette workflow.
3. Indstil **Kun læs** eller **Læs & skriv**.

| Tilladelse | Effekt |
|------------|--------|
| Kun læs | Når **peer**-agenten kører, fusioneres denne graf ind i peerens system-prompt (hvis den har enheder). Ingen udtrækning ind i denne graf fra peerens kørsel. |
| Læs & skriv | Samme prompt-adfærd som ved læsning, og efter en **vellykket** peer-afslutning kan den sædvanlige hukommelsesudtrækning også **fusioneres ind i denne (ejer)graf** ved brug af peer-kørslens legitimationsoplysninger. |

Peers gemmes per ejer-node som `memoryShares`-indgange med `peerWorkflowId` og `peerCanvasNodeId` (og `permission`). Ældre workflows kan udelade `peerWorkflowId` for peers i det **samme** workflow; editoren behandler dette som det aktuelle workflow.

**Cross-workflow-deling** løses under kørsel ved at scanne workflows, **der ejes**. Kørsler uden en autentificeret brugerkontekst løser kun shares defineret i det **aktuelle** workflows JSON (samme canvas).

## Runtime-adfærd

### Egen graf (`persistentMemoryEnabled`)

1. **Før LLM-kaldet** – Hvis grafen har enheder, tilføjes en blok til systeminstruktionen, der forklarer, at disse er fakta fra tidligere kørsler (kan være ufuldstændige; nuværende brugerbesked prioriteres ved konflikt).
2. **Efter en vellykket afslutning** – Et baggrundsjob spørger modellen (samme legitimationsoplysninger som agentkørslen) om struktureret JSON (enheder + relationer). Denne payload fusioneres ind i databasen (deduplikering og relationsoprydning anvendes for visse typer, f.eks. ansættelsesstil-kanter).

### Peer, der modtager delte grafer

Når en agent kører, finder systemet **ejer**-noder (i alle relevante workflows, når muligt), hvis `memoryShares` peger på denne kørsels workflow og canvas-node. For hvert match tilføjes ejerens graf som et **delt hukommelses**-afsnit i system-prompten. **Læs & skriv**-peers planlægger desuden udtrækningsmål for **ejer**-workflow/graf, når kørslen lykkes.

Udtrækning kører **ikke**, når kørslen fejler eller ender i en HITL-afventende tilstand.

## Workflow-JSON (`data`-felt)

Persisteret på agent-noden som andre indstillinger:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` er `"read"` eller `"write"`. Udelad `memoryShares` eller brug `[]`, når der ikke deles.

Se [Workflow-struktur](./workflow-structure.md) for den fulde node-objektform.

## Relateret

- [Agent Node](../nodes/agent-node.md) – Fuldfør agentkonfiguration
- [Agent-arkitektur](./agent-architecture.md) – Orchestrator, underagenter, værktøjer
- [Workflow-struktur](./workflow-structure.md) – JSON-workflow-format
- [Canvas-funktioner](./canvas-features.md) – Hjernekontrol og graf-dialog
- [Traces-fane](../tabs/traces-tab.md) – LLM-anmodning/svar-observabilitet
