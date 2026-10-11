# Einstellungen

Der Dialog **Einstellungen** ermöglicht es dir, dein Profil zu verwalten, persistente KI-Anweisungen festzulegen, dein Kontopasswort zu aktualisieren, die Chat-Stimme zu konfigurieren, deine Standard-KI-Anmeldedaten und dein Standardmodell festzulegen und den Observability-Status zu überprüfen. Öffne ihn, indem du oben rechts in der Kopfzeile auf **deinen Avatar und Namen** klickst.

## Den Dialog öffnen

Klicke oben rechts in der Kopfzeile auf **deinen Avatar und Namen**. Der Dialog öffnet sich mit folgenden Reitern: **Profil**, **Sicherheit**, **Stimme**, **KI-Standardeinstellungen** und **Observability**. Instanz-Administratoren sehen zusätzlich einen **SSO**-Reiter.

## Reiter „Profil"

### Profilbild

Heym zeigt dein [Gravatar](https://gravatar.com)-Bild für die E-Mail-Adresse deines Kontos in der Kopfzeile, neben deinen Nachrichten im [Chat](../tabs/chat-tab.md) und in **Chat with Heym**, bei Kommentaren im [Board](../tabs/board-tab.md) sowie neben deinem Namen in Freigabedialogen und Teammitgliederlisten. Um es zu ändern, aktualisiere das Bild auf Gravatar; Heym übernimmt das neue innerhalb weniger Stunden. Ohne ein Gravatar-Bild zeigt Heym den ersten Buchstaben deines Namens.

Das Bild wird vom Heym-Server abgerufen und dort zwischengespeichert, sodass dein Browser niemals Gravatar kontaktiert. Wenn der Server Gravatar nicht erreichen kann, sehen alle weiterhin die Initialen.

### Name

Dein Anzeigename, der in der gesamten App angezeigt wird. Dieses Feld ist erforderlich und darf nicht leer bleiben.

### Benutzerregeln

Benutzerregeln sind benutzerdefinierte Anweisungen, die automatisch in jede KI-Anfrage eingefügt werden – sowohl im Workflow-Builder als auch im Dashboard-Chat. Im **Workflow-Builder** ([KI-Assistent](./ai-assistant.md)) werden sie an den System-Prompt angehängt, der zur Generierung von Workflow-JSON verwendet wird. Im **Dashboard-Chat** werden sie als Kontext auf Systemebene angewendet. Du schreibst sie einmal, und sie gelten global, ohne dass du sie in jedem Prompt wiederholen musst.

**Häufige Verwendungen:**

- Sprache oder Ton: `Always respond in English. Keep responses concise.`
- Codestil: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow-Konventionen: `Include error handling in all workflows. Use descriptive node labels.`
- Antwortformat: `Use bullet points. Avoid lengthy explanations.`

**Wo sie gelten:**

| Kontext | Beschreibung |
|---------|-------------|
| **Workflow-Builder** | [KI-Assistent](./ai-assistant.md)-Anfragen zum Generieren oder Ändern von Workflows |
| **Dashboard-Chat** | Alle Konversationen im [Chat-Reiter](../tabs/chat-tab.md) |

Benutzerregeln werden auf Systemebene eingefügt – sie laufen automatisch vor jedem Prompt, ohne zusätzliche Konfiguration pro Workflow oder Konversation.

### Profiländerungen speichern

Klicke auf **Save Changes**, um sie anzuwenden. Änderungen werden sofort für alle neuen KI-Anfragen wirksam.

## Reiter „Sicherheit"

### Passwort ändern

Verwende den Reiter „Sicherheit", um das Passwort deines Kontos zu aktualisieren.

**Anforderungen:**

| Regel | Anforderung |
|------|-------------|
| Mindestlänge | 8 Zeichen |
| Großbuchstaben | Mindestens ein Großbuchstabe (A–Z) |
| Kleinbuchstaben | Mindestens ein Kleinbuchstabe (a–z) |
| Ziffer | Mindestens eine Zahl (0–9) |

Das Passwort muss sich außerdem von deinem aktuellen Passwort unterscheiden. Diese Regeln werden sowohl im Frontend als auch im Backend durchgesetzt.

**Schritte:**

1. Gib dein **Current Password** ein
2. Gib dein **New Password** ein (muss alle oben genannten Anforderungen erfüllen)
3. Gib es erneut in **Confirm New Password** ein
4. Klicke auf **Update Password**

Wenn das aktuelle Passwort falsch ist, wird eine Inline-Fehlermeldung angezeigt. Bei Erfolg erscheint eine Bestätigungsmeldung und das Formular wird automatisch zurückgesetzt.

## Reiter „Stimme"

Der Reiter „Stimme" konfiguriert die gesprochene Stimme für den [Chat-Reiter](../tabs/chat-tab.md): Wähle **ElevenLabs-Anmeldedaten** (oder füge sie inline hinzu), wähle eine **Voice** aus deinem ElevenLabs-Konto und klicke auf **Save Voice Settings**. Dies aktiviert das Vorlesen pro Nachricht und den interaktiven Sprachmodus. Siehe [Chat-Sprache (TTS & STT)](./chat-voice.md) für den vollständigen Ablauf.

## Reiter „KI-Standardeinstellungen"

Der Reiter „KI-Standardeinstellungen" hat zwei Abschnitte.

### Bevorzugte Anmeldedaten & Modell

Wähle **bevorzugte LLM-Anmeldedaten** und ein **Modell** daraus. Dies wird zum anfänglichen Standard für jede KI-Funktion in der App – Chat, der [KI-Assistent](./ai-assistant.md) (Builder, Analyzer und Workflow-Erstellung), Board-Mapper, KI-Dashboard-Widgets, [Docs-Chat](../tabs/chat-tab.md), der KI-Schema-Helfer für Datentabellen, der Expression-Builder und Evaluierungen – immer dann, wenn diese Oberfläche keine eigene gespeicherte Auswahl hat.

Die Auswahlregel, der jede Oberfläche folgt, ist:

1. **Gespeicherte Auswahl** – eine Wahl, die du bereits auf dieser Oberfläche getroffen hast (zum Beispiel das letzte Modell einer Chat-Konversation), gewinnt immer.
2. **Bevorzugt** – wird verwendet, wenn keine gespeicherte Auswahl vorhanden ist.
3. **Erste verfügbare Anmeldedaten** – der Fallback, wenn du keine Präferenz festgelegt hast.

Du kannst die Anmeldedaten und das Modell weiterhin jederzeit pro Oberfläche ändern; die Präferenz füllt nur den anfänglichen Standard. Lasse die Anmeldedaten auf **No preference**, um das vorherige Verhalten mit den ersten Anmeldedaten beizubehalten. Wenn deine bevorzugten Anmeldedaten später gelöscht oder nicht mehr geteilt werden, zeigt der Reiter einen Hinweis an und die Oberflächen fallen still auf die ersten verfügbaren Anmeldedaten zurück.

### Nutzung des Coding-Pakets

Für jede **Codex**-Anmeldedaten (einschließlich geteilter) zeigt der Reiter die verbleibende Rate-Limit-Nutzung als horizontalen Balken pro aktivem Fenster – zum Beispiel ein **5 hours**-Fenster und/oder ein **Weekly**-Fenster, je nach deinem Plan. Jeder Balken zeigt den Prozentsatz des verbleibenden Kontingents und einen Countdown bis zum Zurücksetzen. Eine **Refresh**-Schaltfläche ruft die Daten auf Anfrage erneut ab (Ergebnisse werden kurz auf dem Server zwischengespeichert).

Für jede **OpenCode**-Anmeldedaten zeigt der Reiter die Abonnement-Fenster von OpenCode Go – **5 hours**, **Weekly** und **Monthly** – als Balken im gleichen Stil, gelesen vom authentifizierten Nutzungs-Endpoint des Gateways mit dem API-Schlüssel dieser Anmeldedaten. Ein Fenster, das sein Limit erreicht hat, wird in Bernstein als **„limit reached"** angezeigt. Wenn der Schlüssel ungültig ist oder der Workspace kein Go-Abonnement hat, gibt die Karte den Grund an, anstatt Balken anzuzeigen.
## Reiter „Observability"

Der Reiter „Observability" zeigt den schreibgeschützten Status von [OpenTelemetry Tracing](./opentelemetry.md) für diese Instanz an: ob Tracing aktiviert ist, den OTLP-Endpoint, den Service-Namen, das Sampler-Verhältnis und welche Spans ausgegeben werden. Tracing wird über die Umgebungsvariablen `HEYM_OTEL_*` im Backend konfiguriert, daher bearbeitet dieser Reiter nichts. Wenn Tracing deaktiviert ist, listet der Reiter die Umgebungsvariablen auf, die zum Aktivieren erforderlich sind. Geheimnisse wie OTLP-Auth-Header werden hier niemals angezeigt. Siehe [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) für die vollständige Konfigurationsreferenz.

## Reiter „SSO"

Nur für Instanz-Administratoren sichtbar — die in `HEYM_ADMIN_EMAILS` aufgeführten Konten. Dieser Reiter verbindet Heym mit einem externen OpenID Connect-Provider, sodass sich Personen mit den Konten anmelden können, die sie bereits haben. Geben Sie eine Issuer-URL und Client-Anmeldedaten ein, kopieren Sie die schreibgeschützte Redirect-URI in Ihren Provider und führen Sie **Test connection** aus, bevor Sie es aktivieren. Die Passwort-Anmeldung kann von hier aus deaktiviert werden, sobald der Test erfolgreich ist. Siehe [Single Sign-On](./sso.md) für die vollständige Einrichtung.

## Reiter „Instances"

Nur für Instanz-Administratoren sichtbar — die in `HEYM_ADMIN_EMAILS` aufgeführten Konten. Dieser Reiter listet die mit dieser Datenbank verbundenen Heym-Instanzen auf und legt fest, wie Hintergrundausführungen zwischen ihnen aufgeteilt werden. Jede Zeile zeigt den bearbeitbaren Namen der Instanz, ihre Rolle, ob sie live ist, ihre gemessene Latenz zur Datenbank, einen Ein-/Aus-Schalter und ihr Gewicht. Gewichte sind Anteile der Instanzen, die derzeit Arbeit übernehmen können, keine Prozentsätze von 100: bei `41 / 26 / 33` und ausgeschalteter dritter Instanz erhalten die ersten beiden tatsächlich 61 % und 39 %. Das Panel gibt diese effektive Aufteilung unter der Tabelle aus und verweigert das Speichern nur dann, wenn keine aktivierte Instanz überhaupt ein Gewicht hat.

**Give new instances a share automatically** ist standardmäßig aktiviert: Eine Instanz, die beitritt, würde andernfalls bei Gewicht 0 liegen und nichts erhalten, daher gibt der Leader ihr einmalig einen gleichen Anteil und skaliert die bestehenden Gewichte herunter, wobei deren Verhältnisse erhalten bleiben. Eine Instanz, deren Gewicht Sie selbst festgelegt haben, wird dabei niemals angetastet.

Das Panel meldet außerdem, wie viele der Ausführungen der letzten 24 Stunden nur auf der Hauptinstanz ausgeführt werden konnten. Wenn dieser Anteil hoch ist, können die darunter liegenden Gewichte diese Arbeit nicht verschieben. Siehe [Lastverteilung](./cluster.md) für das, was auf der Hauptinstanz bleibt und wie Sie die Zahlen wählen.

## Was sich nicht in diesem Dialog befindet

| Funktion | Wo zu finden |
|---------|-----------------|
| **API-Key-Verwaltung (MCP)** | [Reiter MCP](../tabs/mcp-tab.md) – MCP-Server-API-Key anzeigen, kopieren und neu generieren |
| **Theme (dunkel / hell)** | Sonne/Mond-Umschaltfläche in der Kopfzeile (neben dem Benutzer-Badge) |
| **E-Mail-Änderung** | Derzeit nicht unterstützt |

## Verwandte Themen

- [KI-Assistent](./ai-assistant.md) – Workflow-Builder-Chat, der User Rules verwendet
- [Reiter Chat](../tabs/chat-tab.md) – Dashboard-Chat, der User Rules verwendet
- [Chat-Sprache (TTS & STT)](./chat-voice.md) – ElevenLabs-Stimme, konfiguriert im Reiter „Voice"
- [Reiter MCP](../tabs/mcp-tab.md) – MCP-Server-API-Key und Workflow-Tool-Bereitstellung
- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – API-Keys für AI-Knoten und Integrationen
- [Security](./security.md) – Session-Verwaltung, Rate Limiting, Anmeldedaten-Verschlüsselung
- [Single Sign-On](./sso.md) – Externen OpenID Connect-Provider verbinden
- [OpenTelemetry Tracing](./opentelemetry.md) – Verteiltes Tracing für Workflow- und Knoten-Ausführungen
