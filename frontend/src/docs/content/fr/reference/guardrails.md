# Guardrails

Les Guardrails vous permettent de bloquer les messages utilisateur dangereux ou indésirables avant qu'ils n'atteignent un nœud [LLM](../nodes/llm-node.md) ou [Agent](../nodes/agent-node.md). Lorsqu'un message correspond à une catégorie bloquée, le nœud génère une erreur au lieu de s'exécuter, que vous pouvez intercepter avec un nœud [Error Handler](../nodes/error-handler-node.md).

## Activation des Guardrails

Ouvrez le panneau Properties d'un nœud **LLM** ou **AI Agent** et faites défiler jusqu'à l'option **Enable Guardrails** (icône bouclier). Cochez la case pour afficher la section de configuration.

## Identifiant et modèle de Guardrail

Lorsque les guardrails sont activés, vous **devez** sélectionner un **identifiant et un modèle** pour la sécurité du contenu. La vérification du guardrail utilise l'identifiant et le modèle sélectionnés sur le nœud — aucun fallback, aucune variable d'environnement. Utilisez un identifiant OpenAI ou Google pour un filtrage de contenu fiable, en particulier lorsque votre modèle principal utilise un fournisseur personnalisé (par ex. Zhipu, GLM) qui peut ne pas prendre en charge les guardrails ou renvoyer des erreurs API (par ex. 404).

Le workflow ne peut pas s'exécuter tant que le Guardrail Credential et le Guardrail Model ne sont pas tous deux sélectionnés.

## Catégories bloquées

Sélectionnez une ou plusieurs catégories à bloquer. Un message correspondant à au moins une catégorie cochée est rejeté.

| Catégorie | Ce qu'elle bloque |
|---|---|
| **Violence** | Contenu violent, menaçant ou physiquement dangereux |
| **Hate Speech** | Discrimination, racisme ou fanatisme |
| **Sexual Content** | Contenu ou scénarios sexuels explicites |
| **NSFW / Profanity** | Langage grossier, insultes, injures explicites et argot adulte dans toutes les langues |
| **Self-Harm** | Suicide, automutilation ou contenu associé |
| **Harassment** | Attaques personnelles, insultes, harcèlement ou intimidation |
| **Illegal Activity** | Instructions pour commettre des actes illégaux |
| **Political Extremism** | Contenu politique extrémiste ou propagande violente |
| **Spam / Phishing** | Spam, phishing ou ingénierie sociale |
| **Personal Data Request** | Sollicitation d'informations privées ou personnellement identifiables |
| **Prompt Injection** | Tentatives de contournement des instructions système, d'injection de prompts malveillants ou de manipulation du comportement du modèle |

## Sensibilité

Le paramètre **Sensitivity** contrôle la rigueur de détection des violations :

| Niveau | Comportement |
|---|---|
| **Low** | Signale même les cas limites ou ambigus |
| **Medium** *(par défaut)* | Signale les violations claires ; ignore les cas limites |
| **High** | Signale uniquement les violations extrêmes et sans ambiguïté |

## Fonctionnement de la détection

La détection utilise **l'identifiant et le modèle de guardrail sélectionnés** :

- **Identifiants OpenAI** — utilise l'[OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratuit, rapide, sans consommation de token) pour les cinq catégories qu'il couvre nativement (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Les catégories restantes sont vérifiées via un appel de classification LLM utilisant le modèle de guardrail sélectionné.
- **Identifiants Google / personnalisés** — toutes les catégories sont vérifiées via un appel de classification LLM utilisant l'identifiant et le modèle de guardrail sélectionnés.

Lorsque votre modèle principal utilise un fournisseur personnalisé (par ex. Zhipu, Cerebras) susceptible de renvoyer des erreurs 404 ou d'autres erreurs API, sélectionnez un **identifiant OpenAI ou Google** pour les guardrails.

## Format d'erreur

Lorsqu'un guardrail est déclenché, le nœud génère une erreur avec le message :

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Le champ `output` du résultat du nœud inclut également `guardrail_violated_categories` (tableau des libellés de catégories violées), afin que le Debug Panel et l'Execution History puissent afficher clairement « Blocked by: X, Y ».

Utilisez l'option **Continue on error** du nœud (ou un [Error Handler](../nodes/error-handler-node.md)) pour rediriger le workflow vers une branche de repli lorsque les guardrails se déclenchent.

## Exemple de workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Remarques

- **Aucune nouvelle tentative** : les violations de guardrail sont des blocages intentionnels et ne sont jamais retentées, même si le nœud a l'option « Retry on failure » activée.
- Aucune migration de base de données n'est requise — les paramètres de guardrail sont stockés dans le JSON du nœud du workflow, aux côtés des autres données du nœud.
- Les guardrails vérifient le **message utilisateur** résolu (après évaluation des expressions de template), et non le template brut.
- Ne définir **aucune catégorie** alors que les guardrails sont activés équivaut à les désactiver — aucune vérification n'est effectuée.
- À la sensibilité **Low**, la classification LLM s'exécute toujours (meilleure couverture multilingue). Les identifiants OpenAI exécutent en plus la Moderation API.
- Aux sensibilités **Medium/High**, les identifiants OpenAI utilisent la Moderation API pour les catégories prises en charge nativement et la classification LLM pour les autres. Les identifiants Google/personnalisés utilisent toujours la classification LLM.
- La classification LLM est **indépendante de la langue** — elle détecte les violations en turc, arabe, russe, espagnol et dans d'autres langues.
