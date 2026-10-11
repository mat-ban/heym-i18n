# Agent Persistent Memory

Agent-nodes kunnen een **per-node knowledge graph** in de database bijhouden: entiteiten (met types en eigenschappen) en relaties daartussen. Indien ingeschakeld, **injecteert Heym een samenvatting van die graph in de system prompt** bij elke uitvoering (als de graph niet leeg is). Na een succesvolle uitvoering voegt een **LLM-extractietaak** op de achtergrond nieuwe feiten uit het gesprek samen in de graph.

Sub-agents en orchestrators gebruiken standaard elk de graph die aan **hun eigen canvas-node** is gekoppeld. U kunt ook **andere agents lees- of lees/schrijftoegang verlenen** tot de graph van deze node (inclusief agents in **andere workflows** die u bezit)—zie [Delen met andere agents](#sharing-with-other-agents).

## Inschakelen

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Indien `true`, wordt de graph van deze node in de system prompt geladen en wordt na de uitvoering een extractietaak voor de graph van deze node gepland |
| `memoryShares` | array (optioneel) | Verleent andere agent-nodes toegang tot de memory graph van **deze** node; zie [Delen](#sharing-with-other-agents) |

Schakel dit in via de eigenschappen van de Agent-node (**Persistent memory (graph)**). Een roze **brein**-pictogram op de node opent de graph-editor wanneer memory is ingeschakeld (of wanneer een model wordt weergegeven).

## Graph-editor

Het dialoogvenster toont entiteiten als een geanimeerde, force-directed graph — gekleurde cirkels waarvan de grootte afhangt van het aantal verbindingen en die gegroepeerd zijn op entiteitstype — plus bewerken en navigeren (fit view, tidy layout, sneltoetsen). U kunt nodes en edges handmatig **toevoegen, bewerken of verwijderen**; de Source/Target-relatiekiezers zijn doorzoekbaar voor graphs met veel entiteiten. Bij het selecteren van een node worden de uitgaande en inkomende verbindingen getoond, elk aanklikbaar om naar die node te springen. Wijzigingen gelden alleen voor de graph van **deze** agent (de graph van de canvas-node waarvan u het brein hebt geopend).

## Delen met andere agents

In het memory graph-dialoogvenster kunt u via **Share memory with other agents** **peers** koppelen die deze graph tijdens runtime mogen gebruiken:

1. Kies een **workflow** (elke workflow die u in de editor kunt openen).
2. Kies een **agent**-node in die workflow.
3. Stel **Read only** of **Read & write** in.

| Permissie | Effect |
|------------|--------|
| Read only | Wanneer de **peer**-agent wordt uitgevoerd, wordt deze graph samengevoegd in de system prompt van de peer (als deze entiteiten bevat). Geen extractie in deze graph vanuit de uitvoering van de peer. |
| Read & write | Hetzelfde promptgedrag als read, en na een **succesvolle** afronding van de peer kan de gebruikelijke memory-extractie ook **samenvoegen in deze (eigenaar)graph** met behulp van de referentie van de peer-uitvoering. |

Peers worden per eigenaar-node opgeslagen als `memoryShares`-items met `peerWorkflowId` en `peerCanvasNodeId` (en `permission`). Oudere workflows kunnen `peerWorkflowId` weglaten voor peers in **dezelfde** workflow; de editor behandelt dat als de huidige workflow.

**Delen tussen workflows** wordt tijdens runtime bepaald door workflows te scannen die **u bezit**. Uitvoeringen zonder geauthenticeerde gebruikerscontext lossen alleen shares op die zijn gedefinieerd in de JSON van de **huidige** workflow (zelfde canvas).

## Runtime-gedrag

### Eigen graph (`persistentMemoryEnabled`)

1. **Vóór de LLM-aanroep** — Als de graph entiteiten bevat, wordt een blok toegevoegd aan de system instruction dat uitlegt dat dit feiten uit eerdere uitvoeringen zijn (mogelijk onvolledig; het huidige gebruikersbericht prevaleert bij conflicten).
2. **Na een succesvolle afronding** — Een achtergrondtaak vraagt het model (met dezelfde referentie als de agent-uitvoering) om gestructureerde JSON (entiteiten + relaties). Die payload wordt samengevoegd in de database (deduplicatie en opschoning van relaties gelden voor sommige types, bijvoorbeeld employment-achtige edges).

### Peer die gedeelde graphs ontvangt

Wanneer een agent wordt uitgevoerd, vindt het systeem **eigenaar**-nodes (in elk van uw workflows, indien mogelijk) waarvan de `memoryShares` verwijzen naar de workflow en canvas-node van deze uitvoering. Voor elke overeenkomst wordt de graph van die eigenaar toegevoegd als een **shared memory**-sectie in de system prompt. **Read & write**-peers plannen daarnaast extractiedoelen voor de **eigenaar**-workflow/graph wanneer de uitvoering slaagt.

Extractie wordt **niet** uitgevoerd wanneer de uitvoering mislukt of eindigt in een HITL-pending-status.

## Workflow JSON (`data`-veld)

Wordt opgeslagen op de agent-node zoals andere instellingen:

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

`permission` is `"read"` of `"write"`. Laat `memoryShares` weg of gebruik `[]` wanneer er geen deling is.

Zie [Workflow Structure](./workflow-structure.md) voor de volledige vorm van het node-object.

## Gerelateerd

- [Agent Node](../nodes/agent-node.md) — Volledige agent-configuratie
- [Agent Architecture](./agent-architecture.md) — Orchestrator, sub-agents, tools
- [Workflow Structure](./workflow-structure.md) — JSON-workflowformaat
- [Canvas Features](./canvas-features.md) — Brein-besturing en graph-dialoogvenster
- [Traces tab](../tabs/traces-tab.md) — LLM request/response-observability
