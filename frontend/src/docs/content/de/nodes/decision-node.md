# Entscheidung

Der **Entscheidung**-Knoten stellt einem Entscheidungsmodell typisierte Fragen über den aktuellen Zustand des Laufs und gibt Wahrscheinlichkeiten zurück. Er generiert keinen Text. Greife darauf zurück, wenn ein Workflow ein Urteil benötigt, auf das er verzweigen kann — Routing, Triage, Ranking, Verifikation oder das Absichern eines Schritts, der nicht rückgängig gemacht werden kann.

Entscheidungsmodelle (auch *System One*-Modelle genannt) sind eine andere Art von Modell als ein LLM. Es gibt keinen Prompt, keine Systemanweisung, keine Temperatur und kein Tool-Calling. Du sendest einen **State** plus eine Map von **Fragen**, und jede Antwort kommt als Zahl mit einer dahinterliegenden Wahrscheinlichkeitsverteilung zurück. Da eine Antwort nur wenige Tokens umfasst, sind diese Modelle schnell und günstig im Vergleich dazu, ein [LLM](./llm-node.md) zu bitten, JSON zu erzeugen, und dieses dann zu parsen.

Für die Textgenerierung verwende den [LLM](./llm-node.md)-Knoten. Für ein Modell, das Tools aufruft, verwende den [Agent-Knoten](./agent-node.md).

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | Die Provider-Antwort wörtlich — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Eine *Decision Model*-Anmeldedaten. Keine LLM-Anmeldedaten. |
| `model` | string | Modellname, zum Beispiel `jev-latest` |
| `state` | expression | Was das Modell lesen soll (Standard `$input.text`) |
| `questions` | array | Geordnete Fragezeilen; mindestens eine |
| `customBodyEnabled` | boolean | Einen handgeschriebenen Request-Body anstelle des Formulars senden |
| `customBody` | expression (JSON) | Der Body, der gesendet wird, wenn der Schalter aktiv ist |
| `requestTimeoutSeconds` | number | Maximale Wartezeit in Sekunden (Standard: 60) |

### State

**State** ist die Situation, die das Modell beurteilt. Er akzeptiert einen String, ein Objekt oder ein Array.

Ein Feld, das genau einen Ausdruck enthält, behält seinen eigenen Typ, sodass `$input` das Objekt selbst sendet statt dessen Text. Eine Vorlage mit einem Ausdruck darin (`Ticket: $input.text`) wird zu einem String aufgelöst. Gib jeder Frage genug zum Antworten: Quelltext, Identitäten, Beziehungen, Richtlinien und aktuelle Fakten.

## Fragetypen

Jede Frage hat eine `id`, einen `type`, `instructions` und Kriterien, die vom Typ abhängen.

Die `id` ist der Weg, über den dein Workflow die Antwort zurückliest. Sie wird **niemals an das Modell gesendet**, daher muss die gesamte Bedeutung in `instructions` liegen. `id: is_urgent` mit `instructions: "Is it?"` zu schreiben, gibt dem Modell nichts, womit es arbeiten kann.

### Noul

Ob eine Bedingung zutrifft. Gibt die Wahrscheinlichkeit zurück, dass die Antwort ja lautet, von 0 bis 1.

Kriterien sind optional: **Yes means** und **No means** beschreiben, was jede Seite abdeckt. Ein Wert nahe 0,5 bedeutet, dass das Modell ja und nein als etwa gleich wahrscheinlich einschätzt — nicht „mittlere Intensität".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Lies es mit `$triage.answers.is_urgent.noul`.

### Choice

Wählt eine Option aus einer von dir definierten Menge. Gibt die gewählte Option, die vollständige Verteilung und eine daraus abgeleitete Konfidenz zurück.

Füge eine Option hinzu, die „nichts davon" abdeckt, wann immer nichts passen könnte — das Modell kann keine Option wählen, die du nicht angeboten hast.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Lies es mit `$triage.answers.department.choice`, `.probabilities.billing` und `.confidence`.

### Score

Bewertet den State entlang einer geordneten Bewertungsskala. Gibt einen wahrscheinlichkeitsgewichteten Wert zurück, der **zwischen** den Stufen liegen kann, plus die Legende und die Verteilung.

Die Stufen laufen von der niedrigsten zuerst, mindestens zwei und höchstens zehn. Jede Stufe sollte eine konkrete Situation beschreiben und für sich stehen.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Lies es mit `$triage.answers.frustration.score`, `.legend` und `.confidence`.

## Generate with AI

**Generate with AI** verwandelt einen einfachen Satz in eine vorgeschlagene State-Vorlage und eine Reihe von Fragezeilen. Beschreibe, was beurteilt werden soll — „triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds" — und prüfe, was zurückkommt, bevor du es dem Knoten hinzufügst.

Das Entwerfen erfolgt durch ein LLM, daher fragt der Dialog nach einer LLM-Anmeldedaten. Das Entscheidungsmodell beantwortet die Fragen später, wenn der Workflow läuft. Generierte ids werden gegen die Zeilen dedupliziert, die der Knoten bereits enthält, sodass zweimaliges Generieren niemals einen bestehenden Antwortschlüssel überschreibt.

Jede Generierung wird im Reiter [Traces](../tabs/traces-tab.md) unter der Quelle **Decision Questions** aufgezeichnet, zusammen mit den `decision.systemone`-Traces, die der Knoten selbst zur Laufzeit schreibt.

## Custom request body

Aktiviere **Custom request body**, um JSON zu senden, das du selbst schreibst, anstelle des Formulars. Verwende es für einen Endpoint, dessen Vertrag von dem abweicht, den das Formular erstellt.

Der Editor wird aus dem aktuellen Formular vorbefüllt, und Ausdrücke darin werden aufgelöst, bevor die Anfrage gesendet wird. Solange der Schalter aktiv ist, werden das State-Feld und die Fragezeilen ignoriert. Die Antwort wird in beiden Fällen unverändert weitergegeben, sodass ein anderer Vertrag einfach eine andere Form für deine Ausdrücke zum Lesen erzeugt.
## Ausgabe

Der Knoten gibt genau das zurück, was der Anbieter zurückgegeben hat. Nichts wird umbenannt oder abgeflacht.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Verzweigung anhand einer Antwort

Ein [Switch](./switch-node.md)-Knoten leitet anhand der gewählten Option weiter, und ein [Condition](./condition-node.md)-Knoten kann Fälle mit geringer Konfidenz dorthin senden, wo eine Person sie sieht:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Eine typisierte Antwort garantiert die Form, nicht die Wahrheit. Wähle Schwellenwerte anhand deiner eigenen Daten und Konsequenzen, statt eine Zahl aus einem Beispiel zu übernehmen.

## Anmeldedaten

Erstelle eine **Decision Model**-Anmeldedaten im Reiter [Anmeldedaten](../tabs/credentials-tab.md) mit:

- **Base URL** — der Endpoint, zum Beispiel `https://api.typesafe.ai`. Heym hängt `/v1/systemone` an.
- **API Key** — optional. Endpoints, die keinen Key benötigen, können leer gelassen werden.

Beim Bearbeiten einer Anmeldedaten bleibt der gespeicherte Key erhalten, wenn das Key-Feld leer gelassen wird; gib ihn nur neu ein, um ihn zu ersetzen.

Dieselbe Anmeldedaten kann [Evaluierung](../tabs/evals-tab.md)-Läufe bewerten: mit ausgewähltem **LLM-as-Judge** wähle sie als Judge aus, und das Decision Model bewertet jede Antwort gegen die erwartete Ausgabe.

Heym blockiert standardmäßig ausgehende Anfragen an private und Loopback-Adressen, daher benötigt ein Decision-Endpoint, den du selbst auf `localhost` oder in einem privaten Bereich betreibst, `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Decision Models erscheinen nicht in den LLM-Preistabellen, die Heym synchronisiert, daher bleibt die Spalte **Cost** in [Traces](../tabs/traces-tab.md) für diese Aufrufe leer. Token-Zahlen werden dennoch aufgezeichnet, und du kannst deinen eigenen Preis mit einem Pricing Override hinzufügen.

## Fehler

| Situation | Was passiert |
|-----------|--------------|
| Ungültiger API Key | Der Knoten schlägt mit einer Meldung fehl, die die Anmeldedaten benennt |
| Fehlerhafte Frage | Die eigene feldbezogene Meldung des Anbieters wird in den Knotenfehler übernommen |
| Rate Limited oder überlastet | Der Knoten schlägt mit einer Meldung fehl, die besagt, dass die Bedingung vorübergehend ist — aktiviere [retry](../reference/features.md) für diesen Knoten, um sie zu überstehen |
| Doppelte oder leere Frage-ID | Der Knoten schlägt fehl, bevor eine Anfrage gesendet wird |

## Verwandtes

- [LLM-Knoten](./llm-node.md) – Text generieren statt eines Urteils
- [Agent-Knoten](./agent-node.md) – Belege mit Tools sammeln und dann hier bewerten
- [Switch-Knoten](./switch-node.md) – Anhand der gewählten Option weiterleiten
- [Bedingungs-Knoten](./condition-node.md) – Anhand der Konfidenz filtern
- [Knotentypen](../reference/node-types.md) – Überblick über alle Knotentypen
- [Credentials](../reference/credentials.md) – Anmeldedaten-Typen und -Felder
- [Reiter Ausführungen](../tabs/traces-tab.md) – Decision-Aufrufe und Token-Nutzung untersuchen
