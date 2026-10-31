# Reiter Evaluierung

Der Reiter **Evaluierung** ist eine eigenständige Seite unter `/evals`. Sie ermöglicht das Erstellen von Evaluierungs-Suites, das Definieren von Testfällen und das Ausführen von Evaluierungen für Ihre [Agent-Knoten](../nodes/agent-node.md)-Workflows. Eine [Agent-Suite](#agent-suites) führt einen Agent aus oder liest dessen reale Ausführungen und prüft die aufgerufenen Tools, Latenz, USD-Kosten, Tokens und die Anzahl der Tool-Aufrufe.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Video-Demo zur Evaluierung ansehen</a></p>

## Zugriff

- Klicken Sie in der Tab-Leiste des Dashboards auf **Evaluierung**
- Oder navigieren Sie zu `/evals`
- Oder nutzen Sie **Strg+K** (Cmd+K) und wählen Sie „Evaluierung“ aus der Befehlspalette

## Evaluierungs-Suites

- **Neue Suite** – Wählen Sie **Prompt-Suite**, um einen System-Prompt über mehrere Modelle hinweg zu testen, oder **Agent-Suite**, um reale Ausführungen eines Agents zu prüfen (siehe [Agent-Suites](#agent-suites))
- **Suite-Auswahl** – Listet Prompt- und Agent-Suites zusammen mit dem jeweiligen Typ neben dem Namen auf; tippen Sie zum Suchen
- **Suite erstellen** – Definieren Sie eine Suite mit Name und Beschreibung
- **Workflow auswählen** – Wählen Sie den zu evaluierenden Workflow
- **Anmeldedaten auswählen** – API-Schlüssel zum Ausführen des Workflows
- **System-Prompt** – Bearbeiten Sie den System-Prompt auf Suite-Ebene direkt im linken Panel
- **Prompt optimieren** – Bitten Sie ein LLM, den aktuellen System-Prompt zu verbessern

## Testfälle

- Fügen Sie Testfälle mit Eingabe-Prompts und erwarteten Ausgaben hinzu
- Jeder Fall kann einen benutzerdefinierten erwarteten Wert für den Abgleich enthalten
- Bearbeiten oder löschen Sie Fälle aus der Suite
- **Testdaten generieren** – Verwenden Sie die ausgewählten Anmeldedaten / das Modell, um Testfälle automatisch aus dem Suite-Prompt zu generieren

## Evaluierungen ausführen

- **Ein oder mehrere Modelle auswählen** – Führen Sie dieselbe Suite gegen mehrere Modelle in einer einzigen Evaluierung aus
- **Bewertungsmethode** – Wählen Sie `Exact Match`, `Contains` oder `LLM-as-Judge`
- **Judge** – Für `LLM-as-Judge` wählen Sie optional OpenAI-, OpenAI-kompatible (Custom), Gemini (Google)- oder [Decision Model](../nodes/decision-node.md)-Anmeldedaten und geben das Judge-Modell ein (z. B. `gpt-4o-mini` oder `jev-latest`), um mit einem unabhängigen Judge zu bewerten
- **Durchläufe pro Test** – Wiederholen Sie jeden Testfall mehrfach in einem Durchlauf
- **Gespeicherte Einstellungen** – Eine Suite öffnet sich mit den Einstellungen ihres neuesten Durchlaufs: Anmeldedaten, Modelle, Bewertungsmethode und Judge, Temperature, Reasoning-Aufwand und Durchläufe pro Test. Das Öffnen eines vergangenen Durchlaufs lädt dessen Einstellungen, sodass **Evaluierung wiederholen** denselben Test wiederholt
- **Temperature** – Modell-Temperature festlegen (`Exact Match` und `Contains`)
- **Reasoning-Aufwand** – Legen Sie den Reasoning-Aufwand für Reasoning-Modelle fest, von Niedrig bis Extra hoch und Max, genau wie bei den LLM- und Agent-Knoten (`Exact Match` und `Contains`)

### LLM-as-Judge

Mit einem Judge beantwortet jedes Modell die Testeingabe allein mit dem Suite-Prompt; anschließend bewertet der Judge, wie genau die Antwort mit der erwarteten Ausgabe übereinstimmt (von 0 bis 100):

- **Ein Modell-Judge** (OpenAI, OpenAI-kompatibel oder Gemini) liest die Frage, die erwartete Ausgabe sowie die Antwort und gibt eine Punktzahl samt einzeiliger Begründung zurück. Er läuft mit Temperature `0` oder bei Reasoning-Modellen mit `low` Reasoning-Aufwand, sodass dieselbe Antwort dasselbe Urteil erhält.
- **Ein Entscheidungsmodell-Judge** bewertet die Antwort anhand einer fünfstufigen Rubrik, von *Völlig daneben* bis *Stimmt vollständig überein*. Die Punktzahl ist die wahrscheinlichkeitsgewichtete Position auf dieser Rubrik; sie stammt somit aus einer vom Modell berechneten Verteilung und nicht aus einer geschriebenen Zahl.

Die Hover-Karte der Zelle zeigt die Begründung des Judges bzw. bei einem Entscheidungsmodell die Stufe, die Punktzahl und das Konfidenzniveau. Latenz und Tokens beschreiben das getestete Modell; die eigenen Aufrufe des Judges erscheinen in [Ausführungen](./traces-tab.md) unter der Quelle **Evaluierung**. Die Judge-Auswahl schließt Model-Router-Anmeldedaten aus, da ein Judge ein festes Modell sein muss. Die Anmeldedaten für die getesteten Modelle können ein [Model Router](../reference/credentials.md#model-router-auto-model) sein: Dessen **Auto**-Modell wählt pro Anfrage ein Modell aus, genau wie in einem Workflow.

Ohne Judge beantwortet und bewertet jedes Modell seine eigene Antwort in einer einzigen Anfrage.

Temperature und Reasoning-Aufwand sind in diesem Modus ausgeblendet, und der Durchlauf verwendet feste Einstellungen: Temperature `0.7` für Standardmodelle und `medium` Reasoning-Aufwand für Reasoning-Modelle (`low`, wenn sie ihre eigenen Antworten bewerten).

## Ergebnisse

- Bestanden/Fehlgeschlagen pro Testfall einsehen
- Tatsächliche vs. erwartete Ausgaben untersuchen
- Modellausgaben nebeneinander vergleichen, wenn ein Durchlauf mehrere Modelle umfasst
- Verlauf früherer Evaluierungen einsehen; ein `LLM-as-Judge`-Durchlauf zeigt sein Judge-Modell in der Verlaufsliste
- Historische Durchläufe aus dem Ergebnispanel öffnen und gespeicherte Snapshots von Prompt, Eingabe und Ausgabe prüfen
- Das Öffnen eines vergangenen Durchlaufs lädt dessen Bewertungsmethode und Judge in das linke Panel, sodass **Evaluierung wiederholen** dieselbe Evaluierung wiederholt
- **Exportieren** lädt den Durchlauf als JSON herunter, einschließlich `judge_credential_id` und `judge_model`

## Agent-Suites

Eine Agent-Suite prüft einen [Agent-Knoten](../nodes/agent-node.md) anhand seiner Ausführungen. Sie liest diese aus [Ausführungen](./traces-tab.md), wo jeder Durchlauf bereits Zeit, Tokens, Kosten und Tool-Aufrufe aufzeichnet, und kann den Workflow auch für Sie ausführen.

Erstellen Sie eine mit **Neue Suite** → **Agent-Suite** und folgen Sie drei Schritten:

1. **Agent** – Wählen Sie den Workflow und anschließend dessen Agent-Knoten aus. Nur Workflows mit einem Agent-Knoten werden aufgelistet; ein Workflow oder Agent, der noch nicht ausgeführt wurde, wird angezeigt, kann aber nicht ausgewählt werden. Die Einstellungen des gewählten Agents (Modell, Instruktionen, Tools und Limits) werden rechts angezeigt, und darunter erscheint eine schreibgeschützte Canvas seines Workflows mit hervorgehobenem Agent.
2. **Baseline** – Die letzten 10 Durchläufe des Agents: Latenz p50 und p95, Kosten pro Durchlauf, Tokens pro Durchlauf und Tool-Aufrufe pro Durchlauf, welche Tools aufgerufen wurden und wie oft, sowie die individuellen Werte jedes Durchlaufs. Läufe, die mit einem Fehler endeten, werden aufgeführt, fließen jedoch nicht in die Baseline ein.
3. **Prüfungen** – Markieren Sie jedes Tool mit **Muss aufrufen**, **Darf nicht aufrufen** oder **Beliebig**. Jede Art von Aufruf wird mit ihrem Typ aufgelistet: Python- und Knoten-Tools, **MCP**-Tools mit ihrem Server, **Sub-Agents** nach Label, **Sub-Workflows** nach Name und **Skills**. Fügen Sie ein Tool nach Typ und Name hinzu, wenn es noch nicht ausgeführt wurde, und entfernen Sie es wieder über das **X**. Legen Sie Obergrenzen für Latenz, Kosten, Gesamt-Tokens und Tool-Aufrufe fest; jede beginnt 20 % über dem p95 der Baseline und kann deaktiviert werden.

Eine gespeicherte Suite öffnet sich unter **Ergebnisse**, mit **Baseline** und **Prüfungen bearbeiten** daneben:

- **Workflow ausführen** – Wählen Sie die Anzahl der Durchläufe (bis zu 20); vier laufen gleichzeitig. Die Eingaben werden aus dem jüngsten Workflow-Durchlauf übernommen, können bearbeitet werden und werden von jedem Durchlauf verwendet. Aktivieren Sie **Eingaben generieren** (das Glitzer-Symbol) und wählen Sie anschließend Anmeldedaten und ein Modell, damit das Modell für jeden Durchlauf eine andere Eingabe generiert. Es liest die System-Instruktionen des Agents und orientiert sich eng an den von Ihnen eingegebenen Werten; die Eingabe eines Stadtnamens liefert beispielsweise andere Städtenamen. Jeder Durchlauf führt den gesamten Workflow wie jede reguläre Ausführung aus und wird im Ausführungsverlauf mit dem Trigger `agent_suite` gelistet. Um spätere Schritte zu überspringen (z. B. den E-Mail-Versand), öffnen Sie den Workflow über **Zum Workflow** im Panel und deaktivieren Sie diese Knoten zuerst. **Stoppen** beendet einen Suite-Durchlauf: Es starten keine neuen Läufe und laufende werden abgebrochen. Ein Suite-Durchlauf, dessen Server gestoppt wurde (z. B. bei einem Neustart), wird nach einer Minute als unterbrochen angezeigt, anstatt hängenzubleiben.
- **Ergebnisse** – Der neueste Suite-Durchlauf wird standardmäßig bewertet. Jeder Suite-Durchlauf wird mit Datum in der Durchlauf-Auswahl gespeichert, wo Sie ihn öffnen oder löschen können; oder wechseln Sie zu den letzten 10, 20 oder 50 Durchläufen des Agents, um auch andere Ausführungen einzubeziehen. Sie sehen die Erfolgsquote, wie oft jede Prüfung bestanden wurde, Latenz, Kosten, Tokens und Tool-Aufrufe neben der gespeicherten Baseline sowie jeden Durchlauf mit dem Grund des Fehlerschlags und einem Link zu seinem Trace.
- **Zum Workflow** öffnet den Workflow des Agents in einem neuen Tab. Im Namensfeld löscht **Esc** oder das **X** die Eingabe.

Wie die Zahlen interpretiert werden:

- **Latenz** ist die Zeit des Modells plus die Zeit der Tool-Aufrufe des Durchlaufs.
- **Kosten** verwenden dieselben Preise wie Traces. Ein Durchlauf eines Modells ohne hinterlegte Preise überspringt die Kostenprüfung, anstatt fehlzuschlagen.
- Ein Durchlauf gilt als **bestanden**, wenn er fehlerfrei abgeschlossen wurde und jede Prüfung bestanden hat.
- Die Suite liest nur Ihre eigenen Traces, nach denselben Regeln wie der Traces-Reiter.
- **Neueste Durchläufe als Baseline verwenden** in **Prüfungen bearbeiten** ersetzt die gespeicherte Baseline durch die neuesten Durchläufe des Agents.

Die Baseline einer Suite stammt aus einer von drei Quellen. **Prüfungen bearbeiten** zeigt neben **Gespeicherte Baseline**, welche aktiv ist:

- die neuesten Durchläufe des Agents (Standard und das, was **Neueste Durchläufe als Baseline verwenden** übernimmt),
- ein abgeschlossener Suite-Durchlauf,
- manuell eingegebene Zahlen.

Die letzten beiden werden über [Chat](./chat-tab.md#working-with-evals) oder die API festgelegt:

- `PATCH /api/evals/agent-suites/{id}` akzeptiert `baseline: {"source": "suite_run", "run_id": "…"}` oder `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` akzeptiert `inputs_list`: ein Eingabeobjekt pro Durchlauf, bis zu 20.

### Über Chat und MCP

[Chat](./chat-tab.md#working-with-evals) und das MCP-Tool `heym_chat` können Prompt- und Agent-Suites erstellen, anpassen und ausführen:

- Sie formulieren Testfälle und Eingaben für Testläufe eigenständig.
- Sie fragen vor dem Erstellen einer Prompt-Suite nach den zu verwendenden Anmeldedaten, es sei denn, es kommt nur eine Option infrage.
- Sie verlinken jede Suite, die sie auf dieser Seite erwähnen.

## Benchmark-Matrix-Ideen

Wenn Sie eine Benchmark-Matrix für Agent-Workflows aufbauen, sollten Sie HITL-Szenarien als primäre Testfälle und nicht als Randfälle behandeln.

- Decken Sie alle drei Review-Entscheidungen ab: `accepted`, `edited` und `refused`
- Beziehen Sie mehrere Trigger-Quellen ein, wie z. B. Editor-Läufe, Portal, cURL/Webhook und per Cron getriggerte Ausführungen
- Fügen Sie Szenarien mit wiederholten Reviews hinzu, in denen ein Agent-Lauf mehrfach pausiert
- Prüfen Sie Benachrichtigungszweige, die mit dem `review`-Ausgang des Agents verknüpft sind
- Validieren Sie das nachgelagerte Verhalten nach einer Ablehnung, insbesondere wenn nachfolgende Knoten auf `$agent.decision` verzweigen

## Verwandte Themen

- [Warum Heym](../getting-started/why-heym.md) – Evaluierungen als Testphase im Agent-Lebenszyklus
- [Agent-Knoten](../nodes/agent-node.md) – Zu evaluierende Workflows
- [Reiter Anmeldedaten](./credentials-tab.md) – Anmeldedaten für Evaluierungsdurchläufe
- [Reiter Ausführungen](./traces-tab.md) – Detaillierte Trace-Inspektion
- [Reiter Workflows](./workflows-tab.md) – Zu evaluierende Workflows erstellen
- [Ausführungsverlauf](../reference/execution-history.md) – Frühere Durchläufe einsehen (Verlauf-Button in der Kopfzeile)
- [Kontextuelle Feature-Tour](../reference/contextual-showcase.md) – Kompakter Seitenleitfaden auf der Evaluierungsseite
