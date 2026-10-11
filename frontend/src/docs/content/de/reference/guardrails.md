# Guardrails

Guardrails ermöglichen es dir, unsichere oder unerwünschte Benutzernachrichten zu blockieren, bevor sie einen [LLM](../nodes/llm-node.md)- oder [Agent](../nodes/agent-node.md)-Knoten erreichen. Wenn eine Nachricht mit einer blockierten Kategorie übereinstimmt, wirft der Knoten einen Fehler, anstatt ausgeführt zu werden. Diesen kannst du mit einem [Error Handler](../nodes/error-handler-node.md)-Knoten abfangen.

## Guardrails aktivieren

Öffne das Eigenschaften-Panel für einen **LLM**- oder **AI Agent**-Knoten und scrolle zum Schalter **Enable Guardrails** (Schild-Symbol). Wenn du das Kontrollkästchen aktivierst, wird der Konfigurationsbereich eingeblendet.

## Guardrail-Anmeldedaten und -Modell

Wenn Guardrails aktiviert sind, **musst** du **Anmeldedaten und Modell** für die Inhaltssicherheit auswählen. Die Guardrail-Prüfung verwendet die ausgewählten Anmeldedaten und das ausgewählte Modell des Knotens — kein Fallback, keine Umgebungsvariablen. Verwende OpenAI- oder Google-Anmeldedaten für eine zuverlässige Inhaltsfilterung, insbesondere wenn dein Hauptmodell einen benutzerdefinierten Anbieter verwendet (z. B. Zhipu, GLM), der Guardrails möglicherweise nicht unterstützt oder API-Fehler zurückgibt (z. B. 404).

Der Workflow kann nicht ausgeführt werden, bis sowohl Guardrail-Anmeldedaten als auch Guardrail-Modell ausgewählt sind.

## Blockierte Kategorien

Wähle eine oder mehrere Kategorien zum Blockieren aus. Eine Nachricht, die mit einer der aktivierten Kategorien übereinstimmt, wird abgelehnt.

| Kategorie | Was blockiert wird |
|---|---|
| **Violence** | Gewalttätige, bedrohliche oder körperlich schädliche Inhalte |
| **Hate Speech** | Diskriminierung, Rassismus oder Bigotterie |
| **Sexual Content** | Explizite sexuelle Inhalte oder Szenarien |
| **NSFW / Profanity** | Vulgäre Sprache, Kraftausdrücke, explizite Beleidigungen und Erwachsenen-Slang in jeder Sprache |
| **Self-Harm** | Suizid, Selbstverletzung oder verwandte Inhalte |
| **Harassment** | Persönliche Angriffe, Beleidigungen, Mobbing oder Einschüchterung |
| **Illegal Activity** | Anleitungen zur Begehung illegaler Handlungen |
| **Political Extremism** | Extremistische politische Inhalte oder gewalttätige Propaganda |
| **Spam / Phishing** | Spam, Phishing oder Social Engineering |
| **Personal Data Request** | Erfragung privater oder personenbezogener Daten |
| **Prompt Injection** | Versuche, Systemanweisungen zu überschreiben, bösartige Prompts einzuschleusen oder das Verhalten des Modells zu manipulieren |

## Sensitivität

Die Einstellung **Sensitivity** steuert, wie streng Verstöße erkannt werden:

| Stufe | Verhalten |
|---|---|
| **Low** | Markiert selbst grenzwertige oder mehrdeutige Fälle |
| **Medium** *(Standard)* | Markiert eindeutige Verstöße; ignoriert grenzwertige Fälle |
| **High** | Markiert nur extreme, eindeutige Verstöße |

## Wie die Erkennung funktioniert

Die Erkennung verwendet die **ausgewählten Guardrail-Anmeldedaten und das ausgewählte Modell**:

- **OpenAI-Anmeldedaten** — verwendet die [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (kostenlos, schnell, kein Token-Verbrauch) für die fünf Kategorien, die sie nativ abdeckt (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Die übrigen Kategorien werden mit einem LLM-Klassifizierungsaufruf unter Verwendung des ausgewählten Guardrail-Modells geprüft.
- **Google-/benutzerdefinierte Anmeldedaten** — alle Kategorien werden mit einem LLM-Klassifizierungsaufruf unter Verwendung der ausgewählten Guardrail-Anmeldedaten und des ausgewählten Modells geprüft.

Wenn dein Hauptmodell einen benutzerdefinierten Anbieter verwendet (z. B. Zhipu, Cerebras), der 404 oder andere API-Fehler zurückgeben kann, wähle **OpenAI- oder Google-Anmeldedaten** für Guardrails aus.

## Fehlerformat

Wenn ein Guardrail ausgelöst wird, wirft der Knoten einen Fehler mit der folgenden Meldung:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Das `output` des Knotenergebnisses enthält außerdem `guardrail_violated_categories` (Array der Bezeichnungen der verletzten Kategorien), damit das Debug-Panel und der Verlauf „Blocked by: X, Y" klar anzeigen können.

Verwende die Option **Continue on error** des Knotens (oder einen [Error Handler](../nodes/error-handler-node.md)), um den Workflow zu einem Fallback-Zweig zu leiten, wenn Guardrails ausgelöst werden.

## Beispiel-Workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Hinweise

- **Keine Wiederholungsversuche**: Guardrail-Verstöße sind beabsichtigte Blockierungen und werden niemals wiederholt, selbst wenn der Knoten „Retry on failure" aktiviert hat.
- Es ist keine Datenbankmigration erforderlich — Guardrail-Einstellungen werden im Knoten-JSON des Workflows zusammen mit anderen Knotendaten gespeichert.
- Guardrails prüfen die aufgelöste **Benutzernachricht** (nach Auswertung der Template-Ausdrücke), nicht das rohe Template.
- Wenn **keine Kategorien** festgelegt werden, während Guardrails aktiviert sind, ist das gleichbedeutend damit, dass sie deaktiviert sind — es wird keine Prüfung durchgeführt.
- Bei **Low**-Sensitivität wird immer eine LLM-Klassifizierung ausgeführt (beste mehrsprachige Abdeckung). OpenAI-Anmeldedaten führen zusätzlich die Moderation API aus.
- Bei **Medium/High**-Sensitivität verwenden OpenAI-Anmeldedaten die Moderation API für nativ unterstützte Kategorien und die LLM-Klassifizierung für die übrigen. Google-/benutzerdefinierte Anmeldedaten verwenden immer die LLM-Klassifizierung.
- Die LLM-Klassifizierung ist **sprachunabhängig** — sie erkennt Verstöße in Türkisch, Arabisch, Russisch, Spanisch und anderen Sprachen.
