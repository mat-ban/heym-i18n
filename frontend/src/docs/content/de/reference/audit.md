# Audit-Protokollierung

Heym schreibt für jede sicherheitsrelevante Aktion eine Audit-Zeile: wer sie ausgeführt hat, worauf sie sich bezog und ob sie erfolgreich war. Die Zeilen gehen über den `winston.audit`-Logger an die Standardausgabe des Backends, zusammen mit dem Request-Zugriffsprotokoll, und können im Reiter **Logs** oder mit `docker logs` gelesen werden.

Die Audit-Protokollierung ist **immer aktiv**. Es gibt nichts zu aktivieren und keine Umgebungsvariable, die gesetzt werden müsste.

## Zeilenformat

Eine Aktion erzeugt genau eine in sich geschlossene Zeile:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Jede Zeile trägt diese Felder:

| Feld | Beschreibung |
|-------|-------------|
| `action` | Was passiert ist, als `resource.verb` — siehe die Tabelle unten. |
| `outcome` | `success`, `failure` oder `denied`. |
| `actor_id` | UUID des Benutzers, der die Aktion ausgeführt hat. Fehlt nur, wenn niemand authentifiziert war. |
| `actor_email` | E-Mail-Adresse dieses Benutzers. Bei einer fehlgeschlagenen Anmeldung ist dies die versuchte Adresse, kein bestätigtes Konto. |
| `target` | Das Objekt, auf das sich die Aktion bezog, als `type:uuid`. |
| `target_name` | Menschenlesbarer Name dieses Objekts, in Anführungszeichen gesetzt, wenn er Leerzeichen enthält. |

Aktionsspezifische Felder folgen — zum Beispiel `credential_type`, `imported`, `grantee_email`, `team_name`. Werte, die ein Leerzeichen, ein Anführungszeichen oder ein `=` enthalten, werden in Anführungszeichen gesetzt; Werte, die länger als 256 Zeichen sind, werden mit einer `...(truncated)`-Markierung abgeschnitten.

## Das Protokoll lesen

Der Audit-Logger ist ein Kind des Request-Loggers, sodass beide denselben Stream erreichen und dennoch trennbar bleiben:

```bash
# Nur Audit-Zeilen, kein Zugriffsprotokoll-Rauschen
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Alles, was ein Benutzer getan hat
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Fehlgeschlagene Anmeldungen und verweigerter Zugriff
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Alles, was eine bestimmte Anmeldedaten berührt hat
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

In der App liest der Reiter **Logs** dieselbe Container-Ausgabe. Er ist durch `DOCKER_LOGS_ENABLED` und die Allowlist `DOCKER_LOGS_ALLOWED_EMAILS` geschützt.

## Was protokolliert wird

Jede Zustandsänderung wird protokolliert. Lesezugriffe werden nur dort protokolliert, wo das Lesen selbst der sensible Vorgang ist — das Anzeigen des Ausführungsverlaufs eines Workflows, das Öffnen einer Anmeldedaten, das Herunterladen einer Datei. Gewöhnliche Listen- und Detail-Lesezugriffe werden nicht auditiert; das Zugriffsprotokoll zeichnet bereits auf, dass eine Anfrage stattgefunden hat, und jede `GET`-Anfrage zu auditieren würde die Zeilen, auf die es ankommt, unter sich begraben.

### Authentifizierung

| Aktion | Hinweise |
|--------|-------|
| `auth.register` | `outcome=denied`, wenn die Registrierung deaktiviert ist oder wenn die Passwort-Anmeldung aus ist (`reason=password_login_disabled`), `failure`, wenn die E-Mail-Adresse bereits vergeben ist. |
| `auth.login` | `outcome=failure` zeichnet die versuchte Adresse auf und ob die E-Mail-Adresse unbekannt oder das Passwort falsch war. |
| `auth.logout` | Der Akteur wird aus dem Refresh-Cookie ermittelt, sodass eine Abmeldung ohne ein solches ohne Identität protokolliert wird. |
| `auth.token_refresh` | `outcome=denied` mit `reason=refresh_token_replayed_or_revoked` — ein Token-Diebstahl-Signal, das eine Warnung wert ist. |
| `auth.password_change` | `outcome=failure`, wenn das aktuelle Passwort falsch war. |
| `auth.sso_login` | Single Sign-on. `outcome=failure` trägt den Grund, warum die Provider-Antwort abgelehnt wurde; `denied` trägt `email_not_verified`, `domain_not_allowed` oder `provisioning_disabled`. |
| `sso_settings.update` | Ein Administrator hat die [SSO](./sso.md)-Konfiguration geändert. Zeichnet `enabled` und `password_login_disabled` auf, niemals das Client-Secret. |
| `sso_settings.test` | Ein Administrator hat den SSO-Verbindungstest ausgeführt. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` zeichnet `owned=false` auf, wenn ein Mitbearbeiter den Ausführungsverlauf eines anderen liest. `workflow.delete` zeichnet `outcome=denied` mit `reason=not_owner` auf, wenn ein Mitbearbeiter versucht zu löschen.

### Anmeldedaten

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` wird auditiert, weil das Öffnen einer Anmeldedaten diese entschlüsselt. Ein Fehlschlag protokolliert `outcome=denied`, was genau das ist, wie ein Versuch der Enumeration von Anmeldedaten-IDs aussieht.
### Weitere Ressourcen

| Ressource | Aktionen |
|----------|---------|
| Variablen | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorspeicher | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Warnungen | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Datentabellen | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Ordner | `folder.create` · `update` · `delete` · `workflow_move` |

Bulk-Operationen werden einmal pro Anfrage mit einer Anzahl protokolliert, nicht einmal pro Zeile. Ein CSV-Import von 5.000 Zeilen erzeugt eine `data_table.import_csv`-Zeile mit `imported`, `rejected` und `total`.

## Secrets werden niemals protokolliert

Eine Audit-Zeile zeichnet Identifikatoren, Namen und Anzahlen auf. Sie zeichnet niemals den Inhalt einer Anmeldedaten, den Wert einer Variable, ein Passwort oder ein Token auf.

Zwei Dinge erzwingen dies. Aufrufstellen sind so geschrieben, dass sie nur sichere Felder übergeben, und der Audit-Helper redigiert als Absicherung: Jedes Feld, dessen Name `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` oder Ähnliches enthält, wird durch `***` ersetzt, bevor die Zeile erstellt wird. Übermäßige Redaktion ist beabsichtigt — eine wenig hilfreiche Zeile ist besser als eine geleakte Anmeldedaten.

Wo ein Secret tatsächlich für den Datensatz relevant ist, wird nur seine Form protokolliert. Eine Dateifreigabe zeichnet `password_protected=true` auf, niemals das Passwort.

## Aufbewahrung

**Audit-Zeilen existieren nur so lange wie die Log-Ausgabe des Containers.** Sie werden nicht in der Datenbank gespeichert. Das Neuerstellen des Backend-Containers verwirft seine Logs.

Wenn Sie einen Audit-Verlauf benötigen, der ein Redeploy übersteht, liefern Sie das stdout des Containers an einen dauerhaften Ort — einen Log-Treiber, einen Sidecar-Collector oder die Log-Aggregation Ihrer Plattform — genauso wie Sie es für jedes andere Container-Log tun würden.

## Für Mitwirkende

Das Ausgeben einer Audit-Zeile erfordert einen Aufruf:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

Der Helper ist synchron, berührt keine Datenbank und verschluckt seine eigenen Fehler, sodass ein Audit-Aufruf eine Anfrage weder fehlschlagen lassen noch verlangsamen kann.

Drei Regeln beim Hinzufügen eines Aufrufs:

1. **Benennen Sie die Aktion `resource.verb` in snake_case.** `backend/tests/test_audit_log.py` durchläuft jeden `audit()`-Aufruf unter `app/api/` und lässt den Build bei einem Namen fehlschlagen, der nicht übereinstimmt, sowie bei einer abgedeckten Ressource, die alle ihre Aufrufstellen verloren hat.

2. **Lesen Sie nur Attribute, die sicher vorhanden sind.** Das `try/except` des Helpers schützt seinen eigenen Rumpf, nicht die Ausdrücke, die Sie ihm übergeben — ein `AttributeError` in `target_name=workflow.name` wird an der Aufrufstelle ausgelöst, bevor `audit()` läuft, und wird die Anfrage brechen. Lesen Sie ORM-Spalten und lokale Variablen, nicht optionale oder lazy-geladene Attribute.

3. **Protokollieren Sie die Löschung vor dem Löschen.** Nach `db.delete(row)` sind der Name und die ID, die Sie aufzeichnen möchten, möglicherweise weg. Platzieren Sie den Aufruf darüber.
