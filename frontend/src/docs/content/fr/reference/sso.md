# Authentification unique (Single Sign-On)

Heym peut authentifier les utilisateurs auprès de n'importe quel fournisseur **OpenID Connect** externe. Un administrateur saisit une URL d'émetteur dans **Paramètres → SSO**, et Heym lit tous les autres endpoints à partir du document de découverte de ce fournisseur.

Aucun fournisseur n'est codé en dur. Keycloak, Okta, Entra ID, Auth0, Google et tout autre fournisseur OIDC se connectent via les mêmes champs, car la seule information transmise à Heym est l'émetteur.

La connexion par mot de passe et le SSO fonctionnent côte à côte. La connexion par mot de passe peut être désactivée une fois le SSO vérifié.

## Avant de commencer

Les paramètres SSO s'appliquent à l'ensemble de l'instance ; seuls les administrateurs d'instance peuvent donc les modifier. Les administrateurs sont désignés par une variable d'environnement, et non stockés dans la base de données :

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Une valeur vide n'accorde aucun droit. Redémarrez le backend après modification. Les comptes figurant dans cette liste voient également l'onglet **SSO** dans les Paramètres et conservent l'accès par mot de passe même lorsque la connexion par mot de passe est désactivée — voir [Désactivation de la connexion par mot de passe](#désactivation-de-la-connexion-par-mot-de-passe).

## Enregistrement de Heym auprès de votre fournisseur

Dans votre fournisseur d'identité, créez un **client confidentiel** (également appelé enregistrement d'application) avec :

| Paramètre | Valeur |
|---------|-------|
| Protocole | OpenID Connect |
| Type d'octroi | Authorization Code with PKCE |
| Authentification du client | Activée — Heym utilise un secret client |
| URI de redirection | La valeur exacte affichée dans l'onglet SSO de Heym |
| Scopes | `openid email profile` |

Heym calcule l'URI de redirection à partir de `FRONTEND_URL` et l'affiche en lecture seule dans le formulaire de paramètres avec un bouton de copie. Elle se termine toujours par `/api/auth/sso/callback`. Copiez-la plutôt que de la saisir — une URI de redirection non concordante est la cause d'échec de configuration la plus courante, et les fournisseurs la rejettent sans explication.

Votre fournisseur doit renvoyer une adresse e-mail vérifiée. Voir [Mappage des comptes](#mappage-des-comptes).

## Configuration de Heym

Ouvrez **Paramètres → SSO**. L'onglet n'apparaît que pour les comptes figurant dans `HEYM_ADMIN_EMAILS`.

| Champ | Rôle |
|-------|--------------|
| **Activer l'authentification unique** | Affiche le bouton de connexion sur l'écran de connexion. |
| **URL de l'émetteur** | L'URL de base du fournisseur, par exemple `https://idp.example.com/realms/your-realm`. Heym ajoute `/.well-known/openid-configuration` et lit le reste à partir de là. |
| **Client ID** | L'identifiant client fourni par votre fournisseur. |
| **Client secret** | Stocké de manière chiffrée. Laissez le champ vide pour conserver la valeur enregistrée — Heym ne renvoie jamais un secret qu'il détient. |
| **URI de redirection** | En lecture seule. Copiez cette valeur dans la liste d'autorisation de votre fournisseur. |
| **Scopes** | `openid email profile` par défaut. |
| **Libellé du bouton de connexion** | Le texte du bouton sur l'écran de connexion, par exemple « Se connecter avec Okta ». |
| **Créer un compte lors de la première connexion** | Indique si les personnes inconnues obtiennent automatiquement un compte Heym. |
| **Domaines e-mail autorisés** | Séparés par des virgules. Vide autorise tout domaine authentifié par le fournisseur. |
| **Désactiver la connexion par mot de passe** | Désactive l'authentification par mot de passe à l'échelle de l'instance. |

### Testez d'abord la connexion

**Tester la connexion** récupère le document de découverte et les clés de signature du fournisseur, puis indique l'endpoint de jeton trouvé. Vous pouvez l'exécuter sur un émetteur que vous avez saisi mais pas encore enregistré, de sorte qu'une URL erronée coûte un clic plutôt qu'un enregistrement.

Un test n'*enregistre* un résultat concluant que lorsque l'émetteur testé est celui déjà stocké. Un test sur un brouillon vous indique si l'URL se résout ; il ne valide pas une configuration non enregistrée. Modifier l'émetteur, le client ID, les scopes ou le secret efface le résultat enregistré pour la même raison.

## Fonctionnement de la connexion

1. Une personne clique sur le bouton de connexion sur l'écran de connexion.
2. Heym la redirige vers le fournisseur avec un `state`, un `nonce` et un défi PKCE.
3. Elle s'authentifie auprès du fournisseur.
4. Le fournisseur redirige vers le callback de Heym avec un code d'autorisation.
5. Heym échange le code contre des jetons et vérifie l'ID token par rapport aux clés publiées du fournisseur, en contrôlant la signature, l'audience, l'émetteur, l'expiration et le nonce.
6. Heym résout le compte et émet sa propre session, exactement comme pour une connexion par mot de passe.

Tout ce qui suit l'étape 6 reste inchangé : les mêmes cookies de session, les mêmes durées de vie de jeton, les mêmes permissions.

## Mappage des comptes

Heym résout un compte dans cet ordre :

1. **`(issuer, subject)`** — l'identité que le fournisseur a affirmée lors d'une connexion précédente. Elle fait autorité et survit à un changement d'adresse e-mail chez le fournisseur.
2. **E-mail vérifié** — un compte Heym existant possédant cette adresse est revendiqué, et le subject du fournisseur y est enregistré à partir de ce moment.
3. **Un nouveau compte** — créé si **Créer un compte lors de la première connexion** est activé et si le domaine est autorisé.

Une adresse e-mail n'est considérée comme vérifiée que lorsque l'ID token porte `email_verified: true`. Si cette revendication vaut `false` ou est absente, la connexion est refusée. Revendiquer un compte existant — ou en créer un nouveau — sur la foi d'une adresse que le fournisseur ne garantit pas constitue une voie de détournement de compte, c'est pourquoi Heym ne le fait pas. Un fournisseur qui n'émet jamais `email_verified` doit être configuré pour le faire.

Les comptes créés de cette manière n'ont pas de mot de passe. Ils se connectent uniquement via le fournisseur.

## Désactivation de la connexion par mot de passe

Le commutateur **Disable password sign-in** reste indisponible tant que trois conditions ne sont pas réunies :

1. Le SSO est activé.
2. Un test de connexion a réussi, afin qu'un émetteur erroné ne puisse pas verrouiller la porte derrière lui.
3. Au moins un compte figurant dans `HEYM_ADMIN_EMAILS` dispose effectivement d'un mot de passe.

Lorsqu'il est activé, l'authentification par mot de passe est refusée sur les trois surfaces qui en émettent ou en acceptent un : le formulaire de connexion, l'**inscription** et la page de consentement OAuth du MCP. L'inscription compte parce qu'elle émet un mot de passe ; la laisser ouverte rendrait ce paramètre contournable par quiconque peut atteindre `/register`.

Les comptes listés dans `HEYM_ADMIN_EMAILS` sont exemptés de ces trois surfaces. Quiconque peut modifier le fichier d'environnement peut déjà récupérer l'instance ; cette garantie réside donc dans le code plutôt que dans la mémoire d'un opérateur.

### Pourquoi la troisième condition existe

Un administrateur dont le compte Heym a été créé *via* le SSO ne dispose d'aucun mot de passe. L'exemption lui permettrait de franchir la barrière, mais il n'aurait rien avec quoi se connecter — l'instance n'aurait donc aucun moyen de revenir en arrière si le fournisseur tombait en panne. Heym refuse d'entrer dans cet état et le signale.

Si ce message apparaît, connectez-vous via le SSO et enregistrez un compte avec mot de passe sur l'une de vos adresses d'administration (l'inscription reste ouverte aux adresses d'administration précisément pour cette raison), ou ajoutez à `HEYM_ADMIN_EMAILS` une adresse disposant déjà d'un mot de passe.

### Récupération lorsque le fournisseur est indisponible

Par ordre de préférence :

1. **Connectez-vous avec un mot de passe d'administration de secours.** L'écran de connexion masque le formulaire de mot de passe lorsque la connexion par mot de passe est désactivée ; cliquez donc sur **Sign in with a password instead** sous le bouton SSO pour le révéler. Le formulaire n'est pas un contournement : toute adresse en dehors de `HEYM_ADMIN_EMAILS` reste refusée, et la raison lui est indiquée.
2. **Ajoutez-vous à `HEYM_ADMIN_EMAILS`** dans le fichier d'environnement et redémarrez le backend. Un compte disposant déjà d'un mot de passe peut alors se connecter.
3. **Réactivez directement la connexion par mot de passe dans la base de données**, si aucun administrateur ne dispose d'un mot de passe :

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Aucun redémarrage n'est nécessaire ; le paramètre est lu à chaque requête.

Les utilisateurs finaux du Portail ne sont pas concernés. Ils s'authentifient auprès d'un annuaire distinct — voir [Portail](./portal.md).

## Erreurs de connexion

Une connexion échouée renvoie à l'écran de connexion avec un message lisible. Heym n'affiche jamais le texte d'erreur brut du fournisseur.

| Message | Cause |
|---------|-------|
| That sign-in attempt expired | La tentative a duré plus de dix minutes, ou le navigateur a perdu le cookie de transaction. Réessayez. |
| Could not reach the identity provider | La découverte ou l'échange de jetons a échoué. Vérifiez l'URL de l'émetteur et que le fournisseur est joignable depuis le backend. |
| The provider's response could not be verified | Le jeton d'ID a échoué à la validation de la signature, de l'audience, de l'émetteur, de l'expiration ou du nonce. Généralement une inadéquation de l'ID client. |
| The provider did not return an email address | Le scope `email` est absent, ou le fournisseur ne transmet pas la revendication. |
| Your email address is not verified | Le fournisseur a envoyé `email_verified: false`, ou a omis la revendication. |
| Your email domain is not allowed | L'adresse est en dehors des **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** est désactivé et aucun compte ne correspond. Un administrateur doit en créer un. |
| Single sign-on is not configured | Le SSO est désactivé, ou l'émetteur, l'ID client ou le secret est manquant. |

## Notes de sécurité

- **Le secret client est chiffré au repos** et n'est jamais renvoyé par un endpoint. Le formulaire de paramètres indique uniquement si un secret est stocké.
- **Le vérificateur PKCE ne quitte jamais Heym.** Il est conservé dans un cookie `HttpOnly` de courte durée plutôt que dans le paramètre `state`, qui transite par le fournisseur à la vue de tous.
- **Seules les signatures asymétriques sont acceptées.** Les algorithmes `none` et symétriques sont rejetés, indépendamment de ce que le fournisseur annonce.
- **La destination après connexion est validée** en tant que chemin de même origine, de sorte que le callback ne peut pas servir de redirection ouverte.
- **Chaque connexion est auditée.** Les succès, échecs et refus apparaissent sous forme de lignes `auth.sso_login`, et les modifications de configuration sous `sso_settings.update` — voir [Journalisation d'audit](./audit.md).

## Ce qui n'est pas pris en charge

- **SAML.** OIDC est le seul protocole.
- **Plusieurs fournisseurs simultanés.** Une instance se connecte à un seul fournisseur.
- **Le mappage de groupes ou de rôles** à partir des revendications du fournisseur.
- **La déconnexion unique.** Se déconnecter de Heym ne vous déconnecte pas du fournisseur.
