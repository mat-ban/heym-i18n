# Reiter MCP

Der Reiter **MCP** konfiguriert das [Model Context Protocol](https://modelcontextprotocol.io/) – den offenen Standard zur sicheren Anbindung externer Tools an KI-Modelle.

## Heym als MCP-Client

- Verbinden Sie externe MCP-Server über **stdio** (lokale Prozesse oder Docker-Container) oder **SSE** (Remote-Server über HTTP)
- Werkzeuge, Ressourcen und Prompts des MCP-Servers werden automatisch erkannt und im UI aufgelistet
- [Agent-Knoten](../nodes/agent-node.md) können diese Werkzeuge dynamisch in ihre Tool-Calling-Schleife einbinden

## Heym als MCP-Server

- Veröffentlichen Sie Heym-Workflows als wiederverwendbare MCP-Tools
- Externe Clients wie Claude Desktop oder Cursor können Heym-Workflows direkt über den Endpoint `/api/mcp/sse` aufrufen

## Heym Chat Tool

Aktivieren Sie das **Heym Chat Tool**, um die gesamte KI-Funktionalität von Heym (inklusive Workflow-Erstellung und Board-Steuerung) über MCP für externe Assistenten nutzbar zu machen.

## Verwandte Themen

- [Agent-Knoten](../nodes/agent-node.md) – MCP-Tools im Workflow nutzen
- [MCP-Aufruf-Knoten](../nodes/mcp-call-node.md) – Deterministische Tool-Ausführung\n