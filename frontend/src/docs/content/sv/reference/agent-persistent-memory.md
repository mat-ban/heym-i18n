# Agent Persistent Memory

Agentnoder kan hålla en **per-nod kunskapsgraf** lagrad i databasen: entiteter (med typer och egenskaper) och relationer mellan dem. När funktionen är aktiverad **injicerar Heym en sammanfattning av grafen i systemprompten** vid varje körning (om grafen inte är tom). Efter en lyckad körning sammanfogar ett **LLM-extraheringsjobb** nya fakta från konversationen i grafen i bakgrunden.

Sub-agenter och orkestratorer använder var och en grafen som är knuten till **sin egen canvas-nod** som standard. Det går även att **bevilja andra agenter läs- eller läs-/skrivåtkomst** till denna nods graf (inklusive agenter i **andra workflows** som man äger) — se [Dela med andra agenter](#sharing-with-other-agents).

## Aktivering

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | När `true` läses denna nods graf in i systemprompten och extrahering efter körning schemaläggs för denna nods graf |
| `memoryShares` | array (valfritt) | Beviljar andra agentnoder åtkomst till **denna** nods minnesgraf; se [Delning](#sharing-with-other-agents) |

Aktivera funktionen i agentnodens egenskaper (**Persistent memory (graph)**). En rosa **hjärn**-ikon på noden öppnar grafredigeraren när minnet är aktiverat (eller när en modell visas).

## Grafredigerare

Dialogrutan renderar entiteter som en animerad, kraftstyrd graf — färgade cirklar vars storlek styrs av antalet anslutningar och som grupperas efter entitetstyp — samt redigering och navigering (anpassa vy, städa layout, tangentbordsgenvägar). Noder och kanter kan **läggas till, redigeras eller tas bort** manuellt; väljarna för Source/Target-relationer är sökbara för grafer med många entiteter. Att välja en nod visar dess utgående och inkommande anslutningar, som var och en kan klickas för att hoppa till den noden. Ändringar tillämpas endast på **denna** agents graf (grafen för den canvas-nod vars hjärna öppnades).

## Dela med andra agenter

I dialogrutan för minnesgrafen gör **Share memory with other agents** det möjligt att koppla **peers** som får konsumera denna graf vid körning:

1. Välj en **workflow** (valfri workflow som kan öppnas i redigeraren).
2. Välj en **agent**-nod i den workflowen.
3. Ange **Read only** eller **Read & write**.

| Behörighet | Effekt |
|------------|--------|
| Read only | När **peer**-agenten körs sammanfogas denna graf i peer-agentens systemprompt (om den har entiteter). Ingen extrahering till denna graf från peer-körningen. |
| Read & write | Samma promptbeteende som för läsning, och efter en **lyckad** peer-slutförande kan den vanliga minnesextraheringen även **sammanfogas i denna (ägarens) graf** med hjälp av peer-körningens autentiseringsuppgift. |

Peers lagras per ägarnod som `memoryShares`-poster med `peerWorkflowId` och `peerCanvasNodeId` (samt `permission`). Äldre workflows kan utelämna `peerWorkflowId` för peers i **samma** workflow; redigeraren behandlar det som den aktuella workflowen.

**Delning mellan workflows** löses vid körning genom att skanna workflows som **man äger**. Körningar utan autentiserad användarkontext löser endast delningar som definierats i den **aktuella** workflowens JSON (samma canvas).

## Beteende vid körning

### Egen graf (`persistentMemoryEnabled`)

1. **Före LLM-anropet** — Om grafen har entiteter läggs ett block till i systeminstruktionen som förklarar att dessa är fakta från tidigare körningar (kan vara ofullständiga; aktuellt användarmeddelande har företräde vid konflikt).
2. **Efter ett lyckat slutförande** — Ett bakgrundsjobb begär strukturerad JSON (entiteter + relationer) från modellen (samma autentiseringsuppgift som agentkörningen). Denna payload sammanfogas i databasen (deduplicering och relationsrensning tillämpas för vissa typer, t.ex. anställningsliknande kanter).

### Peer som tar emot delade grafer

När en agent körs hittar systemet **ägarnoder** (i någon av ens workflows, när möjligt) vars `memoryShares` pekar på denna körnings workflow och canvas-nod. För varje träff läggs ägarens graf till som ett **shared memory**-avsnitt i systemprompten. **Read & write**-peers schemalägger dessutom extraheringsmål för **ägarens** workflow/graf när körningen lyckas.

Extrahering körs **inte** när körningen misslyckas eller avslutas i ett väntande HITL-tillstånd.

## Workflow JSON (`data`-fält)

Lagras på agentnoden som andra inställningar:

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

`permission` är `"read"` eller `"write"`. Utelämna `memoryShares` eller använd `[]` när ingen delning sker.

Se [Workflow Structure](./workflow-structure.md) för den fullständiga nodobjektsformen.

## Relaterat

- [Agent Node](../nodes/agent-node.md) — Fullständig agentkonfiguration
- [Agent Architecture](./agent-architecture.md) — Orkestrator, sub-agenter, verktyg
- [Workflow Structure](./workflow-structure.md) — JSON-format för workflow
- [Canvas Features](./canvas-features.md) — Hjärnkontroll och graf-dialog
- [Traces tab](../tabs/traces-tab.md) — Observabilitet för LLM-förfrågningar/svar
