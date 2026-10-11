# Single Sign-On

Heym kann Personen gegen jeden externen **OpenID Connect**-Anbieter authentifizieren. Ein Administrator gibt unter **Einstellungen → SSO** eine Issuer-URL ein, und Heym liest alle weiteren Endpoints aus dem Discovery-Dokument dieses Anbieters.

Kein Anbieter ist fest verdrahtet. Keycloak, Okta, Entra ID, Auth0, Google und jeder andere OIDC-Anbieter werden über dieselben Felder verbunden, denn das Einzige, was Heym mitgeteilt wird, ist der Issuer.

Passwort-Anmeldung und SSO funktionieren nebeneinander. Die Passwort-Anmeldung kann abgeschaltet werden, sobald SSO verifiziert ist.

## Bevor Sie beginnen

SSO-Einstellungen gelten instanzweit, daher dürfen nur Instanz-Administratoren sie ändern. Administratoren werden durch eine Umgebungsvariable benannt, nicht in der Datenbank gespeichert:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Ein leerer Wert gewährt niemandem Zugriff. Starten Sie das Backend nach der Änderung neu. Konten auf dieser Liste sehen außerdem den Reiter **SSO** in den Einstellungen und behalten den Passwortzugang, auch wenn die Passwort-Anmeldung deaktiviert ist — siehe [Passwort-Anmeldung deaktivieren](#passwort-anmeldung-deaktivieren).

## Heym bei Ihrem Anbieter registrieren

Erstellen Sie in Ihrem Identity Provider einen **vertraulichen Client** (auch App-Registrierung genannt) mit:

| Einstellung | Wert |
|---------|-------|
| Protokoll | OpenID Connect |
| Grant-Typ | Authorization Code mit PKCE |
| Client-Authentifizierung | An — Heym verwendet ein Client-Secret |
| Redirect-URI | Der exakte Wert, der im SSO-Reiter von Heym angezeigt wird |
| Scopes | `openid email profile` |

Heym berechnet die Redirect-URI aus `FRONTEND_URL` und zeigt sie schreibgeschützt im Einstellungsformular mit einer Kopierschaltfläche an. Sie endet immer auf `/api/auth/sso/callback`. Kopieren Sie sie, statt sie einzutippen — eine nicht übereinstimmende Redirect-URI ist der häufigste Einrichtungsfehler, und Anbieter lehnen sie ohne Erklärung ab.

Ihr Anbieter muss eine verifizierte E-Mail-Adresse zurückgeben. Siehe [Kontozuordnung](#kontozuordnung).

## Heym konfigurieren

Öffnen Sie **Einstellungen → SSO**. Der Reiter erscheint nur für Konten in `HEYM_ADMIN_EMAILS`.

| Feld | Was es bewirkt |
|-------|--------------|
| **Single Sign-On aktivieren** | Zeigt die Anmeldeschaltfläche auf dem Anmeldebildschirm an. |
| **Issuer-URL** | Die Basis-URL des Anbieters, zum Beispiel `https://idp.example.com/realms/your-realm`. Heym hängt `/.well-known/openid-configuration` an und liest den Rest von dort. |
| **Client-ID** | Die Client-Kennung aus Ihrem Anbieter. |
| **Client-Secret** | Verschlüsselt gespeichert. Lassen Sie das Feld leer, um den gespeicherten Wert zu behalten — Heym gibt niemals ein Secret zurück, das es besitzt. |
| **Redirect-URI** | Schreibgeschützt. Kopieren Sie diese in die Allowlist Ihres Anbieters. |
| **Scopes** | Standardmäßig `openid email profile`. |
| **Beschriftung der Anmeldeschaltfläche** | Der Text auf der Schaltfläche des Anmeldebildschirms, zum Beispiel „Mit Okta anmelden". |
| **Bei der ersten Anmeldung ein Konto erstellen** | Ob unbekannte Personen automatisch ein Heym-Konto erhalten. |
| **Erlaubte E-Mail-Domains** | Kommagetrennt. Leer erlaubt jede Domain, die der Anbieter authentifiziert. |
| **Passwort-Anmeldung deaktivieren** | Schaltet die Passwort-Authentifizierung instanzweit ab. |

### Zuerst die Verbindung testen

**Verbindung testen** ruft das Discovery-Dokument und die Signaturschlüssel des Anbieters ab und meldet dann den gefundenen Token-Endpoint. Sie können ihn für einen Issuer ausführen, den Sie eingegeben, aber noch nicht gespeichert haben, sodass eine falsche URL einen Klick kostet statt eines Speicherns.

Ein Test *verzeichnet* ein bestandenes Ergebnis nur, wenn der getestete Issuer der bereits gespeicherte ist. Ein Entwurfstest sagt Ihnen, ob die URL auflösbar ist; er legitimiert keine Konfiguration, die nicht gespeichert ist. Das Ändern von Issuer, Client-ID, Scopes oder Secret löscht das verzeichnete Ergebnis aus demselben Grund.

## Wie die Anmeldung funktioniert

1. Jemand klickt auf die Anmeldeschaltfläche auf dem Anmeldebildschirm.
2. Heym leitet ihn mit einem `state`, einem `nonce` und einer PKCE-Challenge zum Anbieter weiter.
3. Er authentifiziert sich beim Anbieter.
4. Der Anbieter leitet mit einem Autorisierungscode zurück zu Heyms Callback weiter.
5. Heym tauscht den Code gegen Tokens und verifiziert das ID-Token gegen die veröffentlichten Schlüssel des Anbieters, wobei Signatur, Audience, Issuer, Ablaufzeit und Nonce geprüft werden.
6. Heym löst das Konto auf und stellt seine eigene Session aus, genau wie bei einer Passwort-Anmeldung.

Alles nach Schritt 6 bleibt unverändert: dieselben Session-Cookies, dieselben Token-Laufzeiten, dieselben Berechtigungen.

## Kontozuordnung

Heym löst ein Konto in dieser Reihenfolge auf:

1. **`(issuer, subject)`** — die Identität, die der Anbieter bei einer früheren Anmeldung zugesichert hat. Diese ist maßgeblich und übersteht eine E-Mail-Änderung beim Anbieter.
2. **Verifizierte E-Mail** — ein bestehendes Heym-Konto mit dieser Adresse wird beansprucht, und das Subject des Anbieters wird von da an darauf verzeichnet.
3. **Ein neues Konto** — erstellt, wenn **Bei der ersten Anmeldung ein Konto erstellen** aktiviert ist und die Domain erlaubt ist.

Eine E-Mail gilt nur dann als verifiziert, wenn das ID-Token `email_verified: true` trägt. Wenn dieser Claim `false` ist oder fehlt, wird die Anmeldung abgelehnt. Ein bestehendes Konto zu beanspruchen — oder ein neues zu erstellen — auf Grundlage einer Adresse, für die der Anbieter nicht bürgt, ist ein Pfad zur Kontoübernahme, daher tut Heym das nicht. Ein Anbieter, der niemals `email_verified` ausgibt, muss entsprechend konfiguriert werden.

Auf diese Weise erstellte Konten haben kein Passwort. Sie melden sich ausschließlich über den Anbieter an.

## Passwort-Anmeldung deaktivieren

Der Schalter **Passwort-Anmeldung deaktivieren** bleibt nicht verfügbar, bis drei Dinge zutreffen:

1. SSO ist aktiviert.
2. Ein Verbindungstest wurde bestanden, sodass ein falscher Issuer die Tür nicht hinter sich selbst verriegeln kann.
3. Mindestens ein Konto in `HEYM_ADMIN_EMAILS` hat tatsächlich ein Passwort.

Wenn er aktiviert ist, wird die Passwort-Authentifizierung auf allen drei Oberflächen abgelehnt, die ein Passwort erzeugen oder akzeptieren: das Anmeldeformular, die **Registrierung** und die MCP-OAuth-Consent-Seite. Die Registrierung zählt, weil sie ein Passwort ausstellt; sie offen zu lassen würde die Einstellung für jeden umgehbar machen, der `/register` erreichen kann.

Konten, die in `HEYM_ADMIN_EMAILS` aufgeführt sind, sind von allen dreien ausgenommen. Wer die Umgebungsdatei bearbeiten kann, kann die Instanz ohnehin bereits wiederherstellen, daher lebt diese Garantie im Code statt im Gedächtnis eines Betreibers.
### Warum die dritte Bedingung existiert

Ein Administrator, dessen Heym-Konto *durch* SSO erstellt wurde, hat überhaupt kein Passwort. Die Ausnahme würde ihn am Tor vorbeilassen, aber es gibt nichts, womit er sich anmelden könnte – die Instanz hätte also keinen Weg zurück, wenn der Provider ausfiele. Heym weigert sich, diesen Zustand einzunehmen, und sagt es auch.

Wenn Sie auf diese Meldung stoßen, melden Sie sich über SSO an und registrieren Sie ein Passwort-Konto auf einer Ihrer Admin-Adressen (die Registrierung ist aus genau diesem Grund weiterhin für Admin-Adressen offen), oder fügen Sie eine Adresse, die bereits ein Passwort hat, zu `HEYM_ADMIN_EMAILS` hinzu.

### Wiederherstellung, wenn der Provider ausgefallen ist

In der Reihenfolge der Präferenz:

1. **Melden Sie sich mit einem Break-Glass-Admin-Passwort an.** Der Anmeldebildschirm blendet das Passwortformular aus, wenn die Passwort-Anmeldung deaktiviert ist. Klicken Sie daher unterhalb der SSO-Schaltfläche auf **Sign in with a password instead**, um es einzublenden. Das Formular ist keine Umgehung: Jede Adresse außerhalb von `HEYM_ADMIN_EMAILS` wird weiterhin abgelehnt, und es wird ihr auch gesagt, warum.
2. **Fügen Sie sich selbst zu `HEYM_ADMIN_EMAILS`** in der Umgebungsdatei hinzu und starten Sie das Backend neu. Ein Konto, das bereits ein Passwort hat, kann sich dann anmelden.
3. **Aktivieren Sie die Passwort-Anmeldung direkt in der Datenbank wieder**, falls kein Administrator überhaupt ein Passwort hat:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Ein Neustart ist nicht erforderlich; die Einstellung wird pro Anfrage gelesen.

Portal-Endbenutzer sind nicht betroffen. Sie authentifizieren sich gegen ein separates Verzeichnis – siehe [Portal](./portal.md).

## Anmeldefehler

Eine fehlgeschlagene Anmeldung kehrt mit einer lesbaren Meldung zum Anmeldebildschirm zurück. Heym zeigt niemals den rohen Fehlertext des Providers an.

| Meldung | Ursache |
|---------|-------|
| That sign-in attempt expired | Der Versuch dauerte länger als zehn Minuten, oder der Browser hat das Transaktions-Cookie verworfen. Versuchen Sie es erneut. |
| Could not reach the identity provider | Die Discovery oder der Token-Austausch ist fehlgeschlagen. Prüfen Sie die Issuer-URL und ob der Provider vom Backend aus erreichbar ist. |
| The provider's response could not be verified | Das ID-Token hat die Validierung von Signatur, Audience, Issuer, Ablaufzeit oder Nonce nicht bestanden. Meist liegt ein Client-ID-Mismatch vor. |
| The provider did not return an email address | Der `email`-Scope fehlt, oder der Provider gibt den Claim nicht heraus. |
| Your email address is not verified | Der Provider hat `email_verified: false` gesendet oder den Claim weggelassen. |
| Your email domain is not allowed | Die Adresse liegt außerhalb von **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** ist aus und kein Konto passt. Ein Administrator muss eines erstellen. |
| Single sign-on is not configured | SSO ist deaktiviert, oder Issuer, Client-ID oder Secret fehlen. |

## Sicherheitshinweise

- **Das Client-Secret wird im Ruhezustand verschlüsselt** und wird von keinem Endpoint zurückgegeben. Das Einstellungsformular meldet nur, ob eines gespeichert ist.
- **Der PKCE-Verifier verlässt Heym nie.** Er wird in einem kurzlebigen `HttpOnly`-Cookie gehalten statt im `state`-Parameter, der in aller Öffentlichkeit durch den Provider läuft.
- **Es werden nur asymmetrische Signaturen akzeptiert.** `none` und symmetrische Algorithmen werden abgelehnt, unabhängig davon, was der Provider bewirbt.
- **Das Ziel nach der Anmeldung wird validiert** als Same-Origin-Pfad, sodass der Callback nicht als offenes Redirect verwendet werden kann.
- **Jede Anmeldung wird auditiert.** Erfolge, Fehlschläge und Ablehnungen erscheinen als `auth.sso_login`-Zeilen und Konfigurationsänderungen als `sso_settings.update` – siehe [Audit-Protokollierung](./audit.md).

## Was nicht unterstützt wird

- **SAML.** OIDC ist das einzige Protokoll.
- **Mehrere gleichzeitige Provider.** Eine Instanz verbindet sich mit einem Provider.
- **Gruppen- oder Rollenzuordnung** aus Provider-Claims.
- **Single Logout.** Das Abmelden von Heym meldet Sie nicht vom Provider ab.
