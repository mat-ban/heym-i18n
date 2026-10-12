# Heym Work

**Heym Work** ist eine zweite Benutzeroberfläche für Unternehmensteams, die auf Heym aufbaut. Benutzer beschreiben eine Aufgabe in eigenen Worten, beantworten einige Fragen und erhalten einen Workflow, den Heym erstellt und getestet hat. Sie arbeiten auf für sie erstellten Seiten, beantworten Überprüfungen und sehen jeden Durchlauf mit dem zugehörigen Namen. Heym führt jede Aufgabe im Hintergrund aus.

Heym Work läuft als eigener Container neben Heym, mit einer separaten Lizenz des Heym-Teams. Erfahren Sie mehr und fordern Sie eine Testversion unter [heym.run/enterprise](https://heym.run/enterprise) an. Sehen Sie sich den [Heym Work-Film](https://youtu.be/5Z2gGo6bcpU) für eine zweiminütige Tour an.

## Was Unternehmensteams erhalten

| Bereich | Funktion |
|---------|----------|
| **Chat** | Beschreiben Sie eine Aufgabe per Texteingabe oder Sprache. Heym fragt nach benötigten Informationen, erstellt den Workflow, testet ihn und markiert ihn als Verifiziert. |
| **Seiten** | Angeheftete Seiten mit Widgets: Zahlen, Diagramme, Tabellen mit Status-Chips, Datei-Uploads und Genehmigungen. Eine Tabellenzeile kann eine eigene Detailseite öffnen. |
| **Genehmigungen** | Überprüfungen aus [Human-in-the-Loop](./human-in-the-loop.md)-Schritten warten in Aktivitäten und auf Seiten mit den Optionen Genehmigen, Änderungen anfordern und Ablehnen. |
| **Aktivität** | Jeder Durchlauf mit der Person, die ihn gestartet hat, und der ausführenden Instanz. |
| **Rollen** | Eigentümer, Editor und Betrachter. Die Anmeldung erfolgt über das von Heym bereits genutzte [Single Sign-On](./sso.md). |
| **Brancheneditionen** | Editionen für Recht, Bildung, Finanzen, Logistik, Energie und E-Commerce enthalten vorgefertigte Seiten, Beispieldaten und Workflows für die jeweilige Branche. |

## Heym Work verbinden

Sehen Sie sich das [Installationsvideo](https://youtu.be/zXGfg1HPSLk) für die gesamte Einrichtung an, vom ersten Befehl bis zur Startseite.

Die Verbindung wird unter **Einstellungen → Heym Work** eingerichtet. Dieser Reiter wird nur für Instanz-Administratoren angezeigt, die in `HEYM_ADMIN_EMAILS` aufgeführt sind.

| Feld | Funktion |
|------|----------|
| **Heym Work-Adresse** | Die Adresse, unter der Heym Work ausgeführt wird, z. B. `https://work.example.com`. Die Anmeldung leitet dorthin zurück. Drücken Sie **Speichern**. |
| **Integrationsschlüssel** | **Schlüssel generieren** erstellt den Schlüssel, den Heym Work für jede Anfrage an Heym verwendet. Er wird einmalig mit einer Kopierschaltfläche angezeigt. Heym speichert nur seinen Hashwert. |
| **Heym Work aktivieren** | Aktiviert die Verbindung. Hierfür sind zunächst die Adresse und ein Schlüssel erforderlich. |
| Status | **Zuletzt gesehen**, **Work-Version** und **Lizenz**, wie von Heym Work zuletzt gemeldet. |

Öffnen Sie anschließend die Heym Work-Adresse und schließen Sie die Einrichtung ab:

1. **Lizenz**: Geben Sie den Lizenzschlüssel des Heym-Teams ein.
2. **Heym**: Geben Sie die Heym-Adresse und den Integrationsschlüssel ein.
3. **Eigentümer**: Melden Sie sich mit einem Konto an, das als Heym Work-Eigentümer eingetragen ist.

Die Startseite öffnet sich, bereit für das Team.

### Schlüssel rotieren

**Schlüssel rotieren** ersetzt den Integrationsschlüssel. Heym Work stellt den Betrieb ein, bis der neue Schlüssel dort eingetragen wird, und alle in Heym Work angemeldeten Benutzer werden abgemeldet. Verwenden Sie diese Funktion, wenn der Schlüssel möglicherweise kompromittiert wurde oder eine Person das Team verlässt, die ihn eingesehen hat.

### Verbindung deaktivieren

Schalten Sie **Heym Work aktivieren** aus, um die Verbindung zu trennen. Heym Work fordert daraufhin erneut den Heym-Schlüssel an. Heym führt in jedem Fall weiterhin alle Workflows, Zeitpläne und Webhooks aus.

## Sicherheitsmodell

- **Jede Änderung läuft über Heym.** Heym Work liest die angezeigten Daten aus der Heym-Datenbank und sendet jede Aktion über den schlüsselgeschützten Kanal an Heym, wo Heym die eigenen Zugriffsregeln anwendet. Heym Work speichert eigene Daten in einem separaten `heym_work`-Schema.
- **Der Schlüssel ist im Ruhezustand gehasht.** Heym vergleicht den Hashwert des übergebenen Schlüssels und speichert den Schlüssel selbst niemals.
- **Die Anmeldung verbleibt bei Heym.** Die Authentifizierung erfolgt über Heym mit dem jeweiligen Identity Provider, wenn [SSO](./sso.md) aktiviert ist.
- **Änderungen werden auditiert.** Das Speichern der Verbindung und das Rotieren des Schlüssels schreiben `work_integration.update`- und `work_integration.key_rotate`-Einträge in das [Audit-Protokoll](./audit.md).

## Lizenzierung

Heym Work benötigt einen eigenen Lizenzschlüssel, der vom Heym-Team ausgestellt wird. Heym Work sendet täglich die Lizenz-ID, eine Installations-ID, die Anzahl aktiver Benutzer in den letzten 30 Tagen, die Gesamtzahl der Mitglieder, die Anzahl der Durchläufe in den letzten 24 Stunden sowie die Versionen von Heym und Heym Work an heym.run. Workflow-Inhalte, Eingaben, Ausgaben und Anmeldedaten verbleiben vollständig auf Ihren Servern.

Falls die tägliche Synchronisierung für 30 Tage fehlschlägt, beginnt eine 14-tägige Nachfrist, nach deren Ablauf die Heym Work-Oberfläche einen Eigentümer zur Eingabe eines Schlüssels auffordert. Eine Testversion läuft bis zu ihrem letzten Tag und wird wieder aktiviert, sobald das Heym-Team sie verlängert, mit maximal einer Testversion pro Installation. Heym selbst läuft durchgehend weiter. Netzwerke ohne Internetzugang nutzen eine Offline-Lizenz über enterprise@heym.run.

## Videos

Alle Heym Work-Videos befinden sich in der [Heym Work-Playlist](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Verwandte Themen

- [Enterprise](./enterprise.md): Kommerzielle Lizenzierung und Support
- [Single Sign-On](./sso.md): Die von Heym Work verwendete Anmeldung
- [Human-in-the-Loop](./human-in-the-loop.md): Die in Heym Work angezeigten Prüfungen
- [Audit-Protokollierung](./audit.md): Die durch Verbindungsänderungen erzeugten Protokolleinträge
- [Einstellungen](./user-settings.md): Der Ort des Heym Work-Reiters
