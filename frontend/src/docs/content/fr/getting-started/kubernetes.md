# Heym sur Kubernetes

Déployez Heym sur Kubernetes sans socket Docker. Exécutez chaque sandbox dans son propre pod, avec des guides pour le stockage, le réseau et les workers.

Exemples de manifestes pour exécuter Heym sans socket Docker. Chaque sandbox (outils Python, skills, nœud Code, analyse de fichiers, Playwright, MCP stdio, Codex, OpenCode) s'exécute dans son propre pod via l'API Kubernetes.

## Prérequis

- Kubernetes 1.30 ou plus récent (le stdin de sandbox utilise le protocole d'attachement `v5.channel.k8s.io`).
- Un CNI appliquant NetworkPolicy. Heym vérifie cela avant la première sandbox hors ligne et refuse d'exécuter des sandbox hors ligne lorsqu'un pod de test peut encore établir des connexions.
- Un `podPidsLimit` sur le kubelet. Les pods n'ont pas de champ de limite de PID par pod ; il s'agit donc de la seule protection contre les fork bombs en dehors de la mémoire, du CPU et du délai limite. Heym ne peut pas le vérifier : le `/sys/fs/cgroup/pids.max` d'un conteneur correspond à son propre cgroup, pas à celui du pod. Talos est livré sans cette limite par défaut.

## Installation

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) est un chart communautaire maintenu par Alexey Masolov et publié sur [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), avec des préréglages de plateforme pour OpenShift, EKS, AKS et GKE :

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Stockage

`heym-data` contient les fichiers Drive, les plugins et les espaces de travail Codex/OpenCode. Les pods de sandbox montent un `subPath` de ce volume par exécution. Avec `ReadWriteMany`, ils peuvent s'exécuter sur n'importe quel nœud. Avec `ReadWriteOnce`, ils sont épinglés au nœud du backend. `ReadWriteOncePod` n'est pas pris en charge.

## Paquets d'autorités de certification (CA) personnalisés

Montez votre bundle CA dans le pod backend et faites pointer `SSL_CERT_FILE` (ou `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) vers celui-ci. Heym copie le fichier dans `codex-workspaces/_ca/` sur la revendication de volume et monte cette copie en lecture seule au même chemin dans chaque sandbox recevant la variable. Avec une revendication `ReadWriteOnce`, ces sandbox s'exécutent sur le nœud du backend.

Une CA n'ouvre pas le réseau. L'egress de sandbox n'atteint que les adresses publiques ; un miroir de paquets interne, un proxy ou une API interne nécessite donc sa propre règle, par exemple :

    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: heym-sandbox-egress-internal-mirror
    spec:
      podSelector:
        matchLabels:
          app.kubernetes.io/managed-by: heym
          heym.run/network: egress
      policyTypes: [Egress]
      egress:
        - to:
            - ipBlock: {cidr: 10.20.30.40/32}
          ports:
            - {protocol: TCP, port: 443}

## Un namespace dédié aux sandbox

Définissez `HEYM_SANDBOX_K8S_NAMESPACE` pour exécuter les sandbox dans un namespace distinct, étiquetez ce namespace avec `pod-security.kubernetes.io/enforce: restricted`, déplacez-y le Role, et conservez dans le namespace de Heym un Role accordant `get` sur les `pods`. Les sandbox d'espace de travail nécessitent ensuite une revendication nommée `heym-data` dans le namespace de sandbox liée au même partage RWX (un second PersistentVolume provisionné statiquement).

## Credentials issus de Kubernetes Secrets

Un Secret étiqueté `heym.run/credential: "true"` devient un credential en lecture seule. Les valeurs restent dans la mémoire de chaque processus et n'atteignent jamais la base de données ni ses sauvegardes ; modifier le Secret applique la rotation du credential sans redémarrage. Tout outil écrivant un Secret fonctionne : External Secrets Operator, SealedSecrets, SOPS via Flux ou Argo CD, ou `kubectl`.

Ajoutez le composant à votre overlay. Il accorde au ServiceAccount les droits `get`, `list` et `watch` sur les Secrets et définit `HEYM_K8S_CREDENTIALS=true` sur chaque Deployment :

    components:
      - ../../components/kubernetes-credentials

Le RBAC des Secrets ne pouvant pas être restreint par label, Heym peut lire tous les Secrets du namespace surveillé. Exécutez Heym dans son propre namespace, ou définissez `HEYM_K8S_CREDENTIALS_NAMESPACE` sur un namespace ne contenant que des credentials Heym. Le démarrage échoue si l'une des variables `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` ou `HEYM_MCP_STDIO_SANDBOX` est configurée sur `subprocess`, car le code utilisateur s'exécuterait à côté du token du ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nom du credential affiché dans Heym
        heym.run/type: custom                   # Un type de credential
        heym.run/owner: admin@example.com       # Un utilisateur existant
        heym.run/share-users: alice@example.com # E-mails optionnels séparés par des virgules
        heym.run/share-teams: automation        # Noms d'équipes optionnels séparés par des virgules
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Chaque clé de données correspond à un champ de configuration. Pour un type avec des champs imbriqués ou non-chaînes, placez toute la configuration au format JSON sous une seule clé `config.json`. Les types stockant des tokens OAuth rafraîchis (Codex, Google, BigQuery, et Linear ou Notion en mode OAuth) ne peuvent pas être en lecture seule et sont refusés.

Avec External Secrets Operator, placez le label et les annotations sur le template cible :

    apiVersion: external-secrets.io/v1
    kind: ExternalSecret
    metadata:
      name: heym-cred-llm-gateway
    spec:
      secretStoreRef: {kind: ClusterSecretStore, name: parameter-store}
      target:
        template:
          metadata:
            labels: {heym.run/credential: "true"}
            annotations:
              heym.run/name: llm-gateway
              heym.run/type: custom
              heym.run/owner: admin@example.com
          data:
            base_url: http://llm-gateway.internal/v1
            api_key: "{{ .key }}"
      data:
        - secretKey: key
          remoteRef: {key: /heym/llm-gateway-key}

Comportements attendus :

- **Un pod peut être Ready avant d'être synchronisé.** Le démarrage n'attend pas le serveur d'API, de sorte que l'interface reste accessible sans lui. Tant qu'un processus n'est pas synchronisé, il ne prend en charge aucune exécution en file d'attente ; une exécution utilisant l'un de ces credentials échoue avec `not synced from Kubernetes yet` avant l'exécution d'un quelconque nœud. Paramètres → Kubernetes (un onglet d'administration apparaissant uniquement lorsque `HEYM_K8S_CREDENTIALS` est activé) et Paramètres → Instances affichent l'état de synchronisation ; ne construisez donc pas de health check supposant que Ready équivaut à synchronisé.
- **Un Secret supprimé rend son credential indisponible**, tout en conservant son identifiant et ses partages ; recréer le Secret (élagage GitOps et réapplication) le restaure pour chaque workflow. Les lignes ne sont jamais supprimées automatiquement ; un administrateur les supprime depuis Paramètres → Kubernetes.
- **Un propriétaire ne s'étant pas encore connecté** fait l'objet d'une nouvelle tentative toutes les cinq minutes.
- **Un credential utilisateur portant le même nom et le même propriétaire** n'est jamais écrasé ; le Secret est signalé comme un conflit.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes évalue la politique d'egress après la traduction du service DNS vers un pod DNS, et les pods DNS d'OpenShift écoutent sur le port 5353, et non 53. Avec la politique de base, les sandbox connectées au réseau atteignent Internet par adresse IP, mais chaque résolution de nom expire. L'overlay ne modifie que cette règle :

- Il autorise UDP et TCP 5353, le port des pods DNS, et non le port 53 du service.
- Il sélectionne le namespace DNS via `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` n'est pas défini sur tous les clusters.
- La règle publique `ipBlock` continue d'exclure les plages privées, link-local et CGNAT.

## Cilium avec remplacement de kube-proxy

La configuration de base n'attribue aucune politique d'egress au pod backend. Si vous en ajoutez une, un simple `ipBlock` ne peut pas autoriser le serveur d'API : l'adresse du service est réécrite vers le port `:6443` d'un nœud avant l'application de la politique, et cette adresse porte l'identité `kube-apiserver` de Cilium. Autorisez-la avec une `CiliumNetworkPolicy`. Elle sélectionne également les workers, qui démarrent aussi des pods de sandbox (voir Répartition de charge) :

    apiVersion: cilium.io/v2
    kind: CiliumNetworkPolicy
    metadata:
      name: heym-kube-apiserver
    spec:
      endpointSelector:
        matchExpressions:
          - key: app.kubernetes.io/name
            operator: In
            values: [heym, heym-worker]
      egress:
        - toEntities: [kube-apiserver]
          toPorts:
            - ports: [{port: "6443", protocol: TCP}]

## Planification (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` accepte un JSON contenant `nodeSelector`, `tolerations`, `runtimeClassName` (par exemple gVisor), `imagePullSecrets` et `priorityClassName`. Aucun autre champ n'est accepté.

## Répartition de charge

Les workers sont des Deployments supplémentaires de la même image avec `HEYM_INSTANCE_ROLE=worker`, les mêmes valeurs de `SECRET_KEY` et `ENCRYPTION_KEY`, ainsi que le ServiceAccount `heym-backend`, afin qu'ils puissent également démarrer des pods de sandbox. Un worker exécute le nœud Code et nécessite donc une revendication de volume au niveau du répertoire d'espace de travail pour les dépendances du nœud Code : sa propre revendication `ReadWriteOnce` convient parfaitement, car ces répertoires ne vivent que le temps d'une seule exécution. `overlays/orbstack-cluster` ajoute un worker ; `scripts/k8s-cluster-smoke.sh` vérifie que les exécutions en file d'attente aboutissent sur celui-ci et que leurs pods de sandbox lui sont bien rattachés.

Démarrez les workers directement avec uvicorn, comme le fait `overlays/orbstack-cluster/worker.yaml`. Le point d'entrée de l'image exécute les migrations de base de données, qui sont réservées à l'instance principale (main). Attribuez à chaque worker un `HEYM_INSTANCE_ID` unique et stable ; le nom d'un pod de StatefulSet convient parfaitement. Les exécutions en file d'attente pour un worker qui s'arrête sont réaffectées à une autre instance par le leader.

## Test local sur OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Pour une instance principale plus un worker, appliquez plutôt `overlays/orbstack-cluster` et exécutez `./scripts/k8s-cluster-smoke.sh`.

## Ressources associées

- [Exemples de manifestes et README source](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Exécution & Déploiement](./running-and-deployment.md)
- [Répartition de charge](../reference/cluster.md)
