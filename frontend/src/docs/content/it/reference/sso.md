# Single Sign-On

Heym può autenticare gli utenti tramite qualsiasi provider esterno **OpenID Connect**. Un amministratore inserisce un issuer URL in **Impostazioni → SSO** e Heym legge tutti gli altri endpoint dal documento di discovery di quel provider.

Nessun provider è hardcoded. Keycloak, Okta, Entra ID, Auth0, Google e qualsiasi altro provider OIDC si collegano attraverso gli stessi campi, perché l'unica informazione fornita a Heym è l'issuer.

L'accesso con password e l'SSO funzionano affiancati. L'accesso con password può essere disattivato una volta verificato l'SSO.

## Prima di iniziare

Le impostazioni SSO sono a livello di istanza, quindi solo gli amministratori dell'istanza possono modificarle. Gli amministratori sono definiti da una variabile d'ambiente, non memorizzati nel database:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Un valore vuoto non concede l'accesso a nessuno. Riavviare il backend dopo la modifica. Gli account presenti in questo elenco vedono anche la scheda **SSO** nelle Impostazioni e mantengono l'accesso con password anche quando l'accesso con password è disabilitato — vedere [Disabilitazione dell'accesso con password](#disabilitazione-dellaccesso-con-password).

## Registrazione di Heym presso il provider

Nel provider di identità, creare un **client riservato** (detto anche app registration) con:

| Impostazione | Valore |
|---------|-------|
| Protocollo | OpenID Connect |
| Tipo di grant | Authorization Code con PKCE |
| Autenticazione client | Attiva — Heym utilizza un client secret |
| Redirect URI | Il valore esatto mostrato nella scheda SSO di Heym |
| Scope | `openid email profile` |

Heym calcola il redirect URI da `FRONTEND_URL` e lo mostra in sola lettura nel modulo delle impostazioni con un pulsante di copia. Termina sempre con `/api/auth/sso/callback`. Copiarlo anziché digitarlo — un redirect URI non corrispondente è la causa più comune di errore nella configurazione e i provider lo rifiutano senza spiegazioni.

Il provider deve restituire un indirizzo email verificato. Vedere [Mappatura degli account](#mappatura-degli-account).

## Configurazione di Heym

Aprire **Impostazioni → SSO**. La scheda appare solo per gli account presenti in `HEYM_ADMIN_EMAILS`.

| Campo | Funzione |
|-------|--------------|
| **Abilita single sign-on** | Mostra il pulsante di accesso nella schermata di login. |
| **Issuer URL** | L'URL di base del provider, ad esempio `https://idp.example.com/realms/your-realm`. Heym aggiunge `/.well-known/openid-configuration` e legge il resto da lì. |
| **Client ID** | L'identificatore client fornito dal provider. |
| **Client secret** | Memorizzato cifrato. Lasciare il campo vuoto per mantenere il valore memorizzato — Heym non restituisce mai un secret che detiene. |
| **Redirect URI** | Sola lettura. Copiare questo valore nella allowlist del provider. |
| **Scope** | `openid email profile` per impostazione predefinita. |
| **Etichetta del pulsante di accesso** | Il testo sul pulsante della schermata di login, ad esempio "Sign in with Okta". |
| **Crea un account al primo accesso** | Se le persone sconosciute ottengono automaticamente un account Heym. |
| **Domini email consentiti** | Separati da virgola. Vuoto consente qualsiasi dominio autenticato dal provider. |
| **Disabilita l'accesso con password** | Disattiva l'autenticazione con password a livello di istanza. |

### Verificare prima la connessione

**Test connessione** recupera il documento di discovery e le chiavi di firma del provider, quindi segnala il token endpoint trovato. È possibile eseguirlo su un issuer digitato ma non ancora salvato, così un URL errato costa un clic anziché un salvataggio.

Un test *registra* un esito positivo solo quando l'issuer testato è quello già memorizzato. Un test su una bozza indica se l'URL si risolve; non autorizza una configurazione non salvata. Modificare l'issuer, il client ID, gli scope o il secret cancella il risultato registrato per lo stesso motivo.

## Come funziona l'accesso

1. Qualcuno fa clic sul pulsante di accesso nella schermata di login.
2. Heym lo reindirizza al provider con uno `state`, un `nonce` e una challenge PKCE.
3. L'utente si autentica presso il provider.
4. Il provider reindirizza al callback di Heym con un authorization code.
5. Heym scambia il code con i token e verifica l'ID token rispetto alle chiavi pubblicate dal provider, controllando firma, audience, issuer, scadenza e nonce.
6. Heym risolve l'account ed emette la propria sessione, esattamente come fa un accesso con password.

Tutto ciò che segue il passo 6 rimane invariato: gli stessi cookie di sessione, le stesse durate dei token, gli stessi permessi.

## Mappatura degli account

Heym risolve un account in questo ordine:

1. **`(issuer, subject)`** — l'identità che il provider ha attestato in un accesso precedente. Questa è autorevole e sopravvive a un cambio di email presso il provider.
2. **Email verificata** — un account Heym esistente con quell'indirizzo viene rivendicato e da quel momento il subject del provider vi viene registrato.
3. **Un nuovo account** — creato se **Crea un account al primo accesso** è attivo e il dominio è consentito.

Un'email è considerata verificata solo quando l'ID token contiene `email_verified: true`. Se tale claim è `false` o assente, l'accesso viene rifiutato. Rivendicare un account esistente — o crearne uno nuovo — sulla base di un indirizzo che il provider non garantisce costituisce un percorso di account takeover, quindi Heym non lo fa. Un provider che non emette mai `email_verified` deve essere configurato per farlo.

Gli account creati in questo modo non hanno password. Accedono esclusivamente tramite il provider.

## Disattivazione dell'accesso con password

L'interruttore **Disable password sign-in** rimane non disponibile finché non sussistono tre condizioni:

1. L'SSO è abilitato.
2. Un test di connessione è stato superato, affinché un issuer errato non possa chiudere la porta alle proprie spalle.
3. Almeno un account in `HEYM_ADMIN_EMAILS` dispone effettivamente di una password.

Quando è attivo, l'autenticazione tramite password viene rifiutata su tutte e tre le superfici che ne generano o ne accettano una: il modulo di login, la **registrazione** e la pagina di consenso OAuth del MCP. La registrazione rientra nel conteggio perché emette una password; lasciarla aperta renderebbe l'impostazione aggirabile da chiunque possa raggiungere `/register`.

Gli account elencati in `HEYM_ADMIN_EMAILS` sono esenti da tutte e tre. Chiunque possa modificare il file di ambiente è già in grado di recuperare l'istanza, pertanto questa garanzia risiede nel codice anziché nella memoria di un operatore.

### Perché esiste la terza condizione

Un amministratore il cui account Heym è stato creato *tramite* SSO non possiede alcuna password. L'esenzione gli consentirebbe di superare il controllo, ma non avrebbe nulla con cui accedere — di conseguenza l'istanza non avrebbe alcuna via di ripristino qualora il provider diventasse irraggiungibile. Heym rifiuta di entrare in tale stato e lo segnala esplicitamente.

Se si incontra tale messaggio, accedere tramite SSO e registrare un account con password su uno dei propri indirizzi amministrativi (la registrazione rimane aperta agli indirizzi amministrativi proprio per questo motivo), oppure aggiungere a `HEYM_ADMIN_EMAILS` un indirizzo che disponga già di una password.

### Recupero quando il provider è irraggiungibile

In ordine di preferenza:

1. **Accedere con una password amministrativa di emergenza.** La schermata di login nasconde il modulo della password quando l'accesso con password è disattivato, pertanto fare clic su **Sign in with a password instead** sotto il pulsante SSO per visualizzarlo. Il modulo non costituisce un bypass: ogni indirizzo al di fuori di `HEYM_ADMIN_EMAILS` viene comunque rifiutato, con relativa motivazione.
2. **Aggiungere il proprio indirizzo a `HEYM_ADMIN_EMAILS`** nel file di ambiente e riavviare il backend. Un account che dispone già di una password può quindi accedere.
3. **Riattivare l'accesso con password direttamente nel database**, qualora nessun amministratore disponga di una password:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Non è necessario alcun riavvio; l'impostazione viene letta a ogni richiesta.

Gli utenti finali del Portale non sono interessati. Essi si autenticano su una directory separata — vedere [Portale](./portal.md).

## Errori di accesso

Un accesso non riuscito riporta alla schermata di login con un messaggio leggibile. Heym non mostra mai il testo grezzo dell'errore del provider.

| Messaggio | Causa |
|---------|-------|
| That sign-in attempt expired | Il tentativo ha richiesto più di dieci minuti, oppure il browser ha eliminato il cookie di transazione. Riprovare. |
| Could not reach the identity provider | La discovery o lo scambio di token non è riuscito. Verificare l'URL dell'issuer e che il provider sia raggiungibile dal backend. |
| The provider's response could not be verified | L'ID token non ha superato la validazione di firma, audience, issuer, scadenza o nonce. Di norma si tratta di una mancata corrispondenza del client ID. |
| The provider did not return an email address | Lo scope `email` è mancante, oppure il provider non rilascia il claim. |
| Your email address is not verified | Il provider ha inviato `email_verified: false`, oppure ha omesso il claim. |
| Your email domain is not allowed | L'indirizzo è al di fuori dei **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** è disattivato e nessun account corrisponde. Un amministratore deve crearne uno. |
| Single sign-on is not configured | L'SSO è disabilitato, oppure mancano issuer, client ID o secret. |

## Note di sicurezza

- **Il client secret è cifrato a riposo** e non viene mai restituito da alcun endpoint. Il modulo delle impostazioni segnala unicamente se ne è memorizzato uno.
- **Il verifier PKCE non lascia mai Heym.** È conservato in un cookie `HttpOnly` a breve scadenza anziché nel parametro `state`, che compie un round-trip attraverso il provider in chiaro.
- **Sono accettate solo firme asimmetriche.** Gli algoritmi `none` e simmetrici vengono rifiutati indipendentemente da quanto pubblicizzato dal provider.
- **La destinazione post-login è validata** come percorso same-origin, pertanto il callback non può essere utilizzato come open redirect.
- **Ogni accesso è sottoposto ad audit.** Successi, fallimenti e rifiuti compaiono come righe `auth.sso_login`, e le modifiche di configurazione come `sso_settings.update` — vedere [Audit Logging](./audit.md).

## Cosa non è supportato

- **SAML.** OIDC è l'unico protocollo.
- **Provider multipli simultanei.** Un'istanza si connette a un solo provider.
- **Mappatura di gruppi o ruoli** dai claim del provider.
- **Single logout.** La disconnessione da Heym non comporta la disconnessione dal provider.
