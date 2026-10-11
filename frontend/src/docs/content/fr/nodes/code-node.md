# Code

Le nœud **Code** exécute le Python que vous écrivez, avec son propre `requirements.txt`, et renvoie du JSON. Chaque exécution dispose d'un conteneur entièrement neuf, détruit à la fin de l'exécution : une exécution ne peut donc jamais voir ni affecter une autre exécution.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.result` (ce que `main` a renvoyé), plus `$nodeLabel.logs` et `$nodeLabel.install` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `codeSource` | string | Code source Python. Doit définir `main(params)` et renvoyer une valeur sérialisable en JSON |
| `codeParameters` | expression | Un objet JSON reliant les données du workflow au code. Les expressions sont résolues avant l'exécution du code |
| `codeRequirements` | string | Contenu du `requirements.txt`, un paquet par ligne. Vide, l'installation est ignorée |
| `codeAllowNetwork` | boolean | Indique si le code lui-même peut accéder au réseau (par défaut `false`) |

## La fonction `main`

Votre code doit définir une fonction `main` de premier niveau prenant un argument :

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Les instructions au niveau du module sont bien exécutées, mais seul ce que `main` renvoie devient la sortie du nœud.

L'éditeur affiche les numéros de ligne, et le bouton d'agrandissement situé à côté de **Format** en ouvre un plus grand qui se ferme avec `Esc` — les modifications s'appliquent au fil de la saisie, il n'y a donc rien à enregistrer. Le bouton **Format** reformate votre code avec Ruff, en préservant les commentaires. Il répare également les dommages d'indentation que provoque habituellement un copier-coller : un bloc uniformément indenté, des tabulations mélangées à des espaces, et une ligne décalée d'un ou deux espaces par rapport à son bloc sont tous corrigés plutôt que rejetés. Une véritable erreur de syntaxe est signalée avec sa ligne et sa colonne. Le formatage s'exécute dans le même conteneur isolé que celui du nœud — sans réseau, sans environnement backend — il nécessite donc Docker tout comme l'exécution.

## Lecture des paramètres

`params` prend en charge la notation pointée, y compris à travers des objets et des listes imbriqués :

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` lit les clés qui ne sont pas des identifiants Python valides
- `params.get("maybe")` renvoie `None` au lieu de lever une exception lorsqu'une clé est absente
- `params.to_dict()` renvoie le dictionnaire brut
- La lecture d'une clé jamais fournie lève une erreur nommant la clé et listant ce qui est disponible

## Sortie

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — la valeur de retour de `main`. Les nœuds en aval lisent `$nodeLabel.result.message`
- `logs` — tout ce que le code a envoyé à `print`, capturé séparément afin de ne jamais corrompre le résultat
- `install` — quel outil a installé les dépendances (`uv`, `pip` ou `none`) et sa sortie

## Dépendances

Listez les paquets dans `requirements.txt` exactement comme vous le feriez en local :

```
requests==2.32.3
feedparser
```

Les paquets sont installés avec `uv` dans un répertoire jetable avant l'exécution du code ; si `uv` ne parvient pas à gérer un paquet, Heym réessaie avec `pip`. Rien n'est mis en cache entre les exécutions, les dépendances lourdes ajoutent donc plusieurs secondes à chaque exécution. Laisser `requirements.txt` vide ignore entièrement l'étape d'installation et est sensiblement plus rapide.

Les paquets qui ne fournissent pas de wheel et nécessitent un compilateur C échoueront à l'installation. La raison apparaît dans `install.log`.

## Réseau

| Phase | Réseau |
|-------|---------|
| Installation des dépendances | Toujours activé — pip et uv doivent joindre PyPI |
| Exécution de votre code | Désactivé par défaut. `codeAllowNetwork` l'active |

Lorsque `codeAllowNetwork` est désactivé, un appel sortant tel que `requests.get(...)` échoue avec une erreur de connexion. C'est le comportement par défaut voulu : la plupart des nœuds Code transforment des données qu'un autre nœud a déjà récupérées. Préférez la récupération avec un nœud **HTTP** et transmettez le corps via `codeParameters`.

## Sandbox et limites

Votre code s'exécute en tant qu'utilisateur non-root dans un conteneur dont toutes les capacités Linux sont retirées, avec `no-new-privileges` activé et un système de fichiers racine en lecture seule. Il ne reçoit ni socket Docker ni aucun secret ou variable d'environnement du backend.

| Limite | Valeur |
|-------|-------|
| Mémoire | 512 MB |
| CPU | 1 |
| Processus | 256 |
| Délai d'installation des dépendances | 120 secondes |
| Délai d'exécution | 60 secondes |

Ce sont des propriétés fixes de la sandbox, non configurables.

> **Docker est requis.** Contrairement aux outils et compétences Python de l'Agent, le nœud Code n'a ni mode de repli local ni variable d'environnement pour l'assouplir. Sans démon Docker accessible, le nœud échoue avec une erreur explicite plutôt que d'exécuter votre code dans le processus backend. En développement natif avec `./run.sh`, démarrez Docker avant d'utiliser ce nœud. Voir [Sécurité → Sandbox du nœud Code](../reference/security.md#code-node-sandbox).
## Utiliser un autre nœud lorsqu'il convient mieux

| Vous souhaitez | Utilisez |
|-------------|-----|
| Analyser ou construire du CSV, TSV, XML, ou effectuer de l'OCR sur un fichier | [Converter](converter-node.md) |
| Appeler une API HTTP | [HTTP](http-node.md) |
| Mapper ou renommer des champs | [Set](set-node.md) |
| Exécuter un autre workflow | [Execute](execute-node.md) |

Recourez au nœud **Code** lorsque la logique ne correspond véritablement à aucun de ces cas — calculs personnalisés, parsing sur mesure ou algorithme spécifique.

## Exemple

Noter les lignes produites par un nœud en amont :

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Avec `codeParameters` défini sur `{ "rows": "$fetchRows.result" }`, les nœuds en aval lisent `$scoreRows.result.total`.
