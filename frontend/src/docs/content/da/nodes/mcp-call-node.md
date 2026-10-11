# MCP Call Node

**MCP Call**-noden kalder et specifikt [Model Context Protocol (MCP)](https://modelcontextprotocol.io)-værktøj direkte, uden at en LLM beslutter hvilket værktøj der skal aktiveres. Den anvendes, når der med sikkerhed kendes det præcise værktøj, der skal kaldes, og der ønskes deterministisk, enkelt-trins eksekvering.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.result` |

## Anvendelsestilfælde

MCP Call-noden anvendes, når:
- Det præcise MCP-værktøj kendes på forhånd
- Der ikke er behov for, at en LLM vælger mellem værktøjer
- Der ønskes en letvægts, deterministisk alternativ til en agent-node for et enkelt værktøjsopkald

[Agent-noden](./agent-node.md) anvendes i stedet, når en LLM skal træffe beslutninger om hvilke værktøjer der skal kaldes, eller når der er behov for multi-trins ræsonnement.

> MCP Call-noden **kan ikke** forbindes til en agent-node som et værktøj.

## Forbindelseskonfiguration

Noden forbindes til en enkelt MCP-server. Vælg en transporttype og udfyld de tilhørende felter.

### SSE / Streamable HTTP

| Felt | Beskrivelse |
|-------|-------------|
| `transport` | `sse` eller `streamable_http` |
| `url` | Fuld URL til MCP-serveren (f.eks. `https://mcp.example.com/sse`). Understøtter DSL-udtryk. |
| `headers` | JSON-objekt med HTTP-headers (f.eks. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Timeout pr. forbindelse i sekunder (standard: 30) |

### stdio

| Felt | Beskrivelse |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Eksekverbar kommando (f.eks. `npx`) |
| `args` | JSON-array med argumenter (f.eks. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON-objekt med miljøvariabler (f.eks. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Timeout pr. forbindelse i sekunder (standard: 30) |

## Værktøjsvalg

1. Udfyld forbindelsesfelterne.
2. Klik på **Hent værktøjer** - noden opretter forbindelse til MCP-serveren og viser tilgængelige værktøjer.
3. Vælg et værktøj fra dropdown-menuen.

**Værktøjsvalg er obligatorisk.** Noden vil ikke eksekvere uden et valgt værktøj.

## Argumenter

Efter valg af værktøj viser noden et inputfelt pr. argument defineret i værktøjets inputskema. Hvert felt accepterer:
- En statisk værdi: `10`
- Et DSL-udtryk: `$userInput.body.text`

Påkrævede argumenter markeres med `*`.

## Output

| Felt | Beskrivelse |
|-------|-------------|
| `$nodeLabel.result` | Værktøjsresultat. Hvis svaret er gyldig JSON, returneres et parsed objekt. Ellers returneres en streng. |

## Eksempel

Kald et `search`-værktøj på en SSE MCP-server med brugerspørgsmål som input:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Adgang til resultatet i efterfølgende noder:

```
$searchCall.result.items   ← hvis resultatet er et JSON-objekt
$searchCall.result         ← hvis resultatet er en simpel streng
```

## Bemærkninger

- Noden resolverer DSL-udtryk i `url`, `headers`, `env` samt alle `toolArguments`-værdier før værktøjskaldet.
- `timeoutSeconds` på nodeniveau gælder for den samlede eksekvering, mens `connection.timeoutSeconds` gælder for selve MCP-sessionen.
- Hvis MCP-serveren ikke er tilgængelig eller returnerer en fejl, fejler noden, og fejlmeddelelsen er tilgængelig i workflowets kørselshistorik.
