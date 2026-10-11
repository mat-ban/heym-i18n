# Ausführungs-Tokens

Ausführungs-Tokens sind bereichsbezogene JWTs, die Zugriff auf die Execute- und Stream-Endpoints eines einzelnen Workflows gewähren. Sie ermöglichen es dir, einen Workflow aus externen Systemen aufzurufen, ohne dein langlebiges Benutzersitzungs-Token offenzulegen.

## Warum Ausführungs-Tokens verwenden

Wenn die Authentifizierung eines Workflows auf **JWT** gesetzt ist, erfordert der Endpoint normalerweise eine gültige Benutzersitzung. Ausführungs-Tokens ermöglichen es dir:

- Ein aufrufbares Token mit externen Skripts, CI-Pipelines oder Integrationen zu teilen, ohne deine Konto-Anmeldedaten weiterzugeben.
- Die Exposition zu begrenzen — ein Token ist nur für einen bestimmten Workflow gültig.
- Den Zugriff sofort zu widerrufen, ohne dein Passwort zu ändern oder Sitzungs-Tokens zu rotieren.
- Zwischen kurzlebigen Tokens (Minuten oder Stunden) und langlebigen Tokens (bis zu 10 Jahre) zu wählen.

## Ein Token erstellen

Öffne den Dialog **Run with cURL** im Editor (Symbolleiste oben rechts). Wenn die Workflow-Authentifizierung auf **JWT Token** gesetzt ist, zeigt der Dialog einen Token-Manager:

1. Wähle **Short-lived** oder **Long-lived (10yr)**.
2. Gib für kurzlebige Tokens die Dauer in Sekunden ein (Minimum 60).
3. Klicke auf **+ New Token**.

Das Token wird sofort erstellt, zur Liste hinzugefügt und automatisch ausgewählt, sodass der cURL-Befehl aktualisiert wird, um es einzuschließen.

## Token-Liste

Jede Token-Zeile zeigt:

| Spalte | Beschreibung |
|--------|-------------|
| Created | Erstellungszeitstempel |
| Status | **Expires:** Datum, **Expired** oder **Revoked** |
| Augensymbol | Sichtbarkeit des Token-Werts umschalten |
| Revoke-Schaltfläche | Token als widerrufen markieren (unwiderruflich) |

Klicke auf eine aktive (nicht abgelaufene, nicht widerrufene) Zeile, um sie auszuwählen. Das ausgewählte Token wird in die cURL-Befehl-Vorschau eingebettet.

Abgelaufene und widerrufene Tokens bleiben in der Liste sichtbar, können aber nicht ausgewählt werden.

## Ein Token verwenden

Kopiere den Token-Wert aus der Liste (klicke auf das Augensymbol, um ihn anzuzeigen) und füge ihn als `Bearer`-Token ein:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Wenn du **Copy cURL** im Dialog mit einem ausgewählten Token verwendest, ist das Token bereits im Befehl eingebettet — keine manuelle Ersetzung erforderlich.

## Token-Bereichsabgrenzung

Jedes Token trägt diese JWT-Claims:

| Claim | Wert |
|-------|-------|
| `sub` | Benutzer-ID des Token-Erstellers |
| `wid` | Workflow-UUID — das Token wird für jeden anderen Workflow abgelehnt |
| `scope` | `workflow:execute` — unterscheidet es von einem Benutzersitzungs-Token |
| `jti` | Eindeutige Token-ID, die für Widerrufs-Nachschlagevorgänge verwendet wird |
| `exp` | Ablaufzeitstempel |

Das Backend prüft bei jeder Anfrage all dies: Signaturgültigkeit, Ablauf, übereinstimmende `wid` und dass die `jti` nicht widerrufen wurde.

## Widerruf

Klicke auf die Widerruf-Schaltfläche (Kreis-mit-Schrägstrich) neben einem Token, um es zu widerrufen. Der Widerruf wird sofort wirksam — nachfolgende Anfragen mit diesem Token geben `401` zurück. Die Token-Zeile bleibt in der Liste mit der Bezeichnung **Revoked** sichtbar.

Es gibt kein Rückgängigmachen des Widerrufs. Erstelle ein neues Token, wenn du den Zugriff wiederherstellen musst.

## API

Die Token-Verwaltungs-Endpoints werden mit deiner regulären Sitzung authentifiziert.

| Methode | Pfad | Beschreibung |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Ein Token erstellen |
| `GET` | `/api/workflows/{id}/execution-tokens` | Deine Tokens für diesen Workflow auflisten |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Ein Token widerrufen |

**Anfrage-Body zum Erstellen:**

```json
{ "ttl_seconds": 900 }
```

**Antwort zum Erstellen:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Das Feld `token` wird nur einmal bei der Erstellung zurückgegeben. Speichere es sofort; nachfolgende `GET`-Anfragen geben dieselbe Zeile zurück, aber du kannst es auch jederzeit im cURL-Dialog anzeigen.

## Sichtbarkeitsbereich

Jeder Benutzer sieht nur die Tokens, die er erstellt hat. Teammitglieder mit Zugriff auf einen gemeinsam genutzten Workflow können die Tokens der anderen nicht sehen.

## Verwandte Themen

- [Webhooks](./webhooks.md) — HTTP-Trigger-Endpoints und der cURL-Dialog
- [Security](./security.md) — Sitzungsverwaltung und Authentifizierungsübersicht
- [SSE Streaming](./sse-streaming.md) — Ausführungs-Tokens mit dem Streaming-Endpoint verwenden
