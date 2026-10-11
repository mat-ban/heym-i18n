# Google Sheets

Le nœud **Google Sheets** lit, écrit et gère des données dans des feuilles de calcul Google Sheets via OAuth2. Utilisez-le pour automatiser des Workflows de tableur — lecture de rapports, journalisation de résultats, mise à jour de trackers, etc.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | Google Sheets (OAuth2) |
| Sortie | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant Google Sheets depuis [Identifiants](../tabs/credentials-tab.md) |
| `gsOperation` | string | Opération : `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID du tableur ou URL complète Google Sheets |
| `gsSheetName` | expression | Nom de l'onglet (ex. `Sheet1`). Non requis pour `getSheetInfo`. |
| `gsStartRow` | expression | Pour `readRange` : première ligne de données (base 1) (avec `gsHasHeader`, la ligne 1 est l'en-tête). |
| `gsMaxRows` | expression | Pour `readRange` : nombre max de lignes de données (0 = toutes). |
| `gsHasHeader` | boolean | Pour `readRange` : traiter la ligne 1 comme noms de colonnes lorsque true. |
| `gsUpdateRow` | expression | Pour `updateRange` uniquement : numéro de ligne (base 1) à mettre à jour (colonnes A–Z) ; si non défini, `gsStartRow` est utilisé. Pas de batchUpdate — un seul PUT de l'API values. |
| `gsRange` | expression | Plage en notation A1 (ex. `A1:D100`). Exemples hérités ; l'éditeur utilise les champs de ligne pour la lecture/mise à jour. |
| `gsKeepHeader` | boolean | Pour `clearRange` uniquement : lorsque true, la ligne 1 est conservée et les lignes de données en dessous sont effacées (colonnes A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Pour `appendRows` uniquement : **Bottom** ajoute après la dernière ligne contenant des données ; **Top** insère de nouvelles lignes directement sous la ligne 1 (décale les données vers le bas). |
| `gsValuesInputMode` | `raw` \| `selective` | Pour `appendRows` / `updateRange` : **Raw** = tableau JSON complet ; **Selective** = une ligne de la feuille, champs de colonnes uniquement (sans libellés A1). |
| `gsValuesSelectiveCols` | string | Mode Selective : nombre de colonnes (A–Z). |
| `gsValues` | expression | Tableau JSON 2D de valeurs (ex. `[["Name","Age"],["Alice",30]]`). Requis pour `appendRows`, `updateRange`. |

## ID du tableur

Le champ `gsSpreadsheetId` accepte soit l'**ID brut** (la longue chaîne alphanumérique entre `/d/` et `/edit` dans une URL Google Sheets), soit l'**URL complète** — Heym extrait automatiquement l'ID.

## Configuration de l'identifiant

Google Sheets utilise un modèle **OAuth2 « Bring Your Own App »**. Vous fournissez vos propres identifiants OAuth2 Google Cloud.

**Configuration du backend :** définissez **`FRONTEND_URL`** sur le backend Heym avec l'URL publique de l'application (l'adresse que les utilisateurs saisissent dans le navigateur), par ex. `https://your-heym-domain`. L'URI de redirection OAuth est toujours `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — elle est dérivée uniquement de ce paramètre, et non des en-têtes de requête.

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activez **Google Sheets API**.
2. Allez dans **Credentials** → **Create Credentials** → **OAuth client ID** → sélectionnez **Web application**.
3. Sous **Authorized redirect URIs**, ajoutez exactement : `{votre FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (par exemple `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Copiez le **Client ID** et le **Client Secret**.
5. Dans le Dashboard Heym → **Identifiants** → **Nouveau** → sélectionnez **Google Sheets (OAuth2)**.
6. Saisissez le Client ID, le Client Secret et un nom, puis cliquez sur **Connect** pour finaliser le consentement OAuth2 dans une fenêtre popup du navigateur.

Les Tokens se rafraîchissent automatiquement en arrière-plan — aucune gestion manuelle des Tokens n'est nécessaire.

## Opérations

| Opération | Champs requis | Description |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Lire les valeurs des cellules (A–Z) ; `gsRange` facultatif dans les Workflows hérités |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Ajouter des lignes en bas (`gsAppendPlacement` append) ou sous la ligne 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Écraser la ou les lignes à partir de `gsUpdateRow` (A–Z) ; un JSON multi-lignes écrit des lignes consécutives |
| `clearRange` | gsSpreadsheetId, gsSheetName | Effacer toutes les valeurs des colonnes A–Z de l'onglet ; `gsKeepHeader` facultatif conserve la première ligne |
| `getSheetInfo` | gsSpreadsheetId | Obtenir le titre du tableur et la liste des onglets |
## Référence de sortie

| Opération | Champ de sortie | Type | Description |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Objets de ligne : clés de colonne (noms d'en-tête ou A, B, …) plus **`rowIndex`** (ligne de feuille basée sur 1) |
| `readRange` | `.total` | number | Nombre de lignes de données renvoyées |
| `appendRows` | `.updatedRange` | string | Plage écrite |
| `appendRows` | `.updates` | number | Nombre de lignes ajoutées |
| `updateRange` | `.updatedRange` | string | Plage écrite |
| `updateRange` | `.updatedCells` | number | Nombre de cellules mises à jour |
| `clearRange` | `.clearedRange` | string | Plage qui a été effacée |
| `getSheetInfo` | `.title` | string | Titre de la feuille de calcul |
| `getSheetInfo` | `.sheets` | array | Liste d'objets `{sheetId, title}` |

Toutes les opérations incluent `success: true` et `operation: "<name>"` dans la sortie.

## Exemple – Lire une plage

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Accès à la sortie : `$readReport.rows[0]` (premier objet de ligne de données), `$readReport.rows[0].Name` (colonne par en-tête), `$readReport.rows[0].rowIndex` (ligne de feuille basée sur 1).

## Exemple – Ajouter une ligne à partir de l'entrée

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter un identifiant Google Sheets OAuth2
- [Intégrations tierces](../reference/integrations.md#google-sheets-oauth2) – Configuration de l'identifiant Google Sheets
