# Human-in-the-Loop

Human-in-the-Loop (HITL) stelt een [Agent-knooppunt](../nodes/agent-node.md) in staat om op specifieke momenten goedkeuring aan te vragen, te wachten op een menselijke beslissing en vervolgens de workflow vanaf dezelfde uitvoeringssnapshot voort te zetten.

## Wat het doet

- Voegt expliciete goedkeuringscontrolepunten toe aan een agent zonder een aparte goedkeuringsworkflow te bouwen
- Creëert een eenmalige openbare beoordelings-URL op `/review/{token}`
- Stelt een beoordelaar in staat om `Accept`, `Edit & Continue` of `Refuse` te kiezen
- Markeert de uitvoering als `pending` totdat een beslissing binnenkomt
- Hervat de gepauzeerde uitvoering en laat de agent doorgaan na goedkeuring
- Ondersteunt meerdere opeenvolgende HITL-controlepunten in dezelfde agent-run

## Agent-configuratie

Schakel HITL in via het eigenschappenpaneel van de agent.

| Instelling | Beschrijving |
|---------|-------------|
| `hitlEnabled` | Schakelt menselijke beoordeling in voor deze agent |
| `hitlSummary` | Goedkeuringsrichtlijnen voor wanneer de agent menselijke beoordeling moet aanvragen |

HITL voegt een `request_human_review`-tool toe aan de agent. Gebruik de systeem-prompt en de `hitlSummary`-richtlijnen om de agent te vertellen welke acties goedkeuring vereisen. Wanneer de agent besluit dat een controlepunt beoordeling nodig heeft, stuurt deze één Markdown-beoordelingstekst naar de mens. De samenvatting voor de beoordelaar wordt tijdens de uitvoering gegenereerd op basis van het verzoek van de agent; als de agent deze weglaat, leidt Heym er een af uit de Markdown-body. In v1 ondersteunt HITL alleen agent-uitvoer in tekstmodus, dus het kan niet worden gecombineerd met `jsonOutputEnabled`.

Voor MCP-tools vraagt Heym het model om de geschreven HITL-instructies te interpreteren in een van drie goedkeuringsscopes:

- `always` voor zinsneden zoals "always", "on each" of "for each"
- `once` voor zinsneden zoals "once" of "only one time"
- `never` voor zinsneden zoals "never", "do not ask" of "already approved"

Die interpretatie bepaalt of herhaalde MCP-aanroepen opnieuw pauzeren, eenmalig goedgekeurd blijven of menselijke beoordeling volledig overslaan.

Wanneer HITL is ingeschakeld, toont de agent ook een tweede canvas-uitvoerhandle met het label `review`. Gebruik die vertakking om de openstaande beoordelings-URL en samenvatting naar Slack, e-mail, logging of een andere notificatiestroom te sturen terwijl de hoofd-uitvoering op een persoon wacht.

## Beoordelingsproces

1. De agent bereikt een stap waarvoor goedkeuring vereist is en roept `request_human_review` aan
2. Heym creëert een openbaar beoordelingsverzoek en retourneert een beoordelings-URL
3. Alle knooppunten die zijn verbonden met de `review`-handle van de agent worden onmiddellijk uitgevoerd met de openstaande HITL-payload
4. De workflow-uitvoering gaat naar `pending`
5. Een beoordelaar opent `/review/{token}` zonder in te loggen
6. De beoordelaar kiest één actie:
   - `Accept` gaat verder met de originele Markdown
   - `Edit & Continue` gaat verder met de bewerkte Markdown
   - `Refuse` gaat verder met `decision: "refused"` en slaat verdere agent-actie over
7. Heym hervat de workflow vanuit de opgeslagen snapshot en laat de agent doorgaan met de goedgekeurde Markdown-context
8. Als een latere stap ook goedkeuring vereist, kan de agent HITL opnieuw aanroepen en een nieuw openstaand controlepunt creëren

Beoordelingslinks verlopen na 168 uur als niemand reageert.

## Openbare beoordelingspagina

De openbare beoordelingspagina toont:

- De workflownaam en het agent-label
- Een automatisch gegenereerde samenvatting voor de beoordelaar op basis van het beoordelingsverzoek van de agent
- De Markdown-beoordelingstekst eerst, als de hoofdinhoud
- Een bewerkingsvak dat pas opent nadat de beoordelaar op `Edit` klikt
- Een live Markdown-voorbeeld tijdens het bewerken
- Actieknoppen voor `Accept`, `Edit & Continue` en `Refuse`

Zodra een beslissing is ingediend, wordt de token vergrendeld en kan deze niet opnieuw worden gebruikt.

## Uitvoer en uitvoeringsstatus

Terwijl er op beoordeling wordt gewacht, bevat de agent-uitvoer een openstaande payload:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Nadat de beoordelaar heeft gereageerd en de workflow is hervat, bevat de definitieve agent-uitvoer de beslissingsmetadata:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Gebruik `$agentLabel.decision` in downstream-knooppunten om te vertakken op geaccepteerde, bewerkte of geweigerde uitkomsten.

## Canvas-beoordelingsvertakking

De `review`-uitvoerhandle is alleen beschikbaar wanneer `hitlEnabled` is ingeschakeld voor een agent.

- Deze wordt uitgevoerd voordat de menselijke beslissing binnenkomt
- Deze ontvangt de openstaande HITL-payload, inclusief `summary`, `draftText`, `reviewUrl`, `shareText` en `shareMarkdown`
- Deze is bedoeld voor notificatie- of overdrachtsstappen zoals Slack, e-mail of audit-logging
- Deze wordt één keer uitgevoerd voor elk HITL-controlepunt
- Deze wordt niet opnieuw uitgevoerd nadat de beoordelaar heeft gereageerd; alleen het normale agent-uitvoerpad gaat verder bij hervatting

## Waar het verschijnt

- [Uitvoeringsgeschiedenis](./execution-history.md) toont `pending`-uitvoeringen onmiddellijk en slaat de review-URL op in knooppuntresultaten
- [Portaal](./portal.md) chat-antwoorden tonen de human review-link in plaats van een leeg antwoord
- Het Debug-paneel en geschiedenisdialogen tonen de definitieve HITL-beslissing en de gereviewde tekst
- De review-uitvoerhandle kan externe kanalen op de hoogte stellen, zelfs wanneer de workflow werd geactiveerd door cron, curl of portaalverkeer
- Meerdere HITL-controlepunten hergebruiken dezelfde vermelding in de uitvoeringsgeschiedenis, terwijl voor elke pauze een nieuwe eenmalige review-link wordt aangemaakt

## Huidige beperkingen

- HITL is alleen beschikbaar op Agent-knooppunten
- HITL gebruikt de tekstuitvoer van de agent en ondersteunt geen JSON-uitvoer in v1
- Een gepauzeerde uitvoering wordt hervat vanuit de opgeslagen workflow-snapshot, niet vanuit de laatst bewerkte workflow-versie
- Geneste sub-workflows kunnen in v1 geen pending HITL-status bereiken; vraag review aan vanuit de bovenliggende agent voordat deze worden aangeroepen

## Gerelateerd

- [Agent-knooppunt](../nodes/agent-node.md) - HITL configureren op een agent
- [Agent-architectuur](./agent-architecture.md) - Hoe agenten, tools, sub-agenten en HITL samenwerken
- [Uitvoeringsgeschiedenis](./execution-history.md) - Pending en hervatte uitvoeringen inspecteren
- [Board](../tabs/board-tab.md) - Board-keteninguitvoeringen pauzeren de kaart in een pending (amber) status bij HITL
- [Portaal](./portal.md) - Openbare chat-flows en HITL review-links
