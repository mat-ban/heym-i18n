# HTTP-Knoten

Der **HTTP-Knoten** sendet REST-Anfragen an externe APIs oder Web-Services und übergibt die Antwort an nachfolgende Knoten.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 1 |
| Ausgabe | `$nodeLabel.data` (geparstes JSON oder Text), `$nodeLabel.status` (HTTP-Statuscode), `$nodeLabel.headers` |

## Konfiguration

- **Methode**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- **URL**: Ziel-Endpoint (unterstützt DSL-Ausdrücke z. B. `https://api.example.com/users/{{ $input.userId }}`)
- **Authentifizierung**: Keine, Bearer-Token, Basic Auth oder benutzerdefinierte Header
- **Body**: JSON, Rohdaten oder Form-Data mit dynamischen Ausdrücken
- **Distributed Tracing**: Automatische Injektion des W3C `traceparent`-Headers zur Weitergabe des OpenTelemetry-Kontexts

## Verwandte Themen

- [Webhooks](../reference/webhooks.md) – Eingehende HTTP-Aufrufe verarbeiten\n