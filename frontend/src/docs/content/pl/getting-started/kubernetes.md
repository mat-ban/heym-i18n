# Heym w Kubernetes

Wdróż Heym w Kubernetes bez gniazda Docker (Docker socket). Uruchamiaj każdy sandbox jako dedykowany pod, korzystając z przewodników dotyczących pamięci masowej, sieci i workerów.

Przykładowe manifesty do uruchamiania Heym bez gniazda Docker. Każdy sandbox (narzędzia Python, skills, węzeł Code, analiza plików, Playwright, MCP stdio, Codex, OpenCode) działa jako osobny pod za pośrednictwem Kubernetes API.

## Wymagania

- Kubernetes 1.30 lub nowszy (stdin sandboxa używa protokołu dołączania `v5.channel.k8s.io`).
- CNI wymuszający NetworkPolicy. Heym sprawdza to przed uruchomieniem pierwszego sandboxa offline i odrzuca uruchamianie sandboxów offline, jeśli pod testowy nadal może nawiązywać połączenia.
- Parametr kubelet `podPidsLimit`. Pody nie posiadają pola limitu PID na poziomie poda; jest to zatem jedyna ochrona przed bombami widelcowymi (fork-bombs) obok pamięci RAM, procesora i limitu czasu. Heym nie może tego zweryfikować: `/sys/fs/cgroup/pids.max` kontenera odnosi się do jego własnej grupy cgroup, a nie do cgroup poda. Talos domyślnie dostarczany jest bez tego limitu.

## Instalacja

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) to chart społecznościowy rozwijany przez Alexeya Masolova i publikowany na [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), z profilami platform dla OpenShift, EKS, AKS oraz GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Pamięć masowa (Storage)

`heym-data` przechowuje pliki Drive, wtyczki oraz przestrzenie robocze Codex/OpenCode. Pody sandboxów montują jeden `subPath` tego wolumenu na każde wykonanie. Z trybem `ReadWriteMany` mogą działać na dowolnym węźle. Z `ReadWriteOnce` są przypięte do węzła backendu. `ReadWriteOncePod` nie jest obsługiwany.

## Niestandardowe pakiety CA

Zamontuj swój pakiet CA w podzie backendu i wskaż go w zmiennej `SSL_CERT_FILE` (lub `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`). Heym skopiuje plik do `codex-workspaces/_ca/` w roszczeniu wolumenu i zamontuje tę kopię w trybie tylko do odczytu pod tą samą ścieżką w każdym sandboxie odbierającym zmienną. Przy roszczeniu `ReadWriteOnce` te sandboxy będą uruchamiane na węźle backendu.

Certyfikat CA nie otwiera sieci. Ruch egress sandboxa dociera wyłącznie do adresów publicznych; dlatego wewnętrzny mirror pakietów, proxy lub wewnętrzne API wymaga osobnej reguły, na przykład:

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

## Dedykowany namespace dla sandboxów

Ustaw `HEYM_SANDBOX_K8S_NAMESPACE`, aby uruchamiać sandboxy w innym namespace, oznacz ten namespace etykietą `pod-security.kubernetes.io/enforce: restricted`, przenieś tam Role i zachowaj w namespace Heym Role przyznającą uprawnienie `get` dla `pods`. Sandboxy przestrzeni roboczych wymagają wówczas roszczenia o nazwie `heym-data` w namespace sandboxa, powiązanego z tym samym udziałem RWX (drugi, statycznie aprowizowany PersistentVolume).

## Credentials z Kubernetes Secrets

Secret z etykietą `heym.run/credential: "true"` staje się credentialem tylko do odczytu. Wartości pozostają w pamięci każdego procesu i nigdy nie trafiają do bazy danych ani jej kopii zapasowych; modyfikacja Secretu rotuje credential bez konieczności restartu. Działa każde narzędzie zapisujące Secret: External Secrets Operator, SealedSecrets, SOPS za pośrednictwem Flux lub Argo CD bądź `kubectl`.

Dodaj komponent do swojego overlay. Nadaje on ServiceAccount uprawnienia `get`, `list` i `watch` dla obiektów Secret oraz ustawia `HEYM_K8S_CREDENTIALS=true` w każdym Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC dla obiektów Secret nie może być zawężany według etykiet; Heym może zatem odczytać każdy Secret w monitorowanym namespace. Uruchamiaj Heym we własnym namespace lub ustaw `HEYM_K8S_CREDENTIALS_NAMESPACE` na namespace zawierający wyłącznie credentials Heym. Uruchomienie zostanie zablokowane, jeśli którakolwiek ze zmiennych `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` lub `HEYM_MCP_STDIO_SANDBOX` ma wartość `subprocess`, ponieważ kod użytkownika wykonywałby się obok tokena ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nazwa credentiala wyświetlana w Heym
        heym.run/type: custom                   # Typ credentiala
        heym.run/owner: admin@example.com       # Istniejący użytkownik
        heym.run/share-users: alice@example.com # Opcjonalne, rozdzielone przecinkami adresy e-mail
        heym.run/share-teams: automation        # Opcjonalne, rozdzielone przecinkami nazwy zespołów
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Każdy klucz danych odpowiada polu konfiguracji. W przypadku typu z polami zagnieżdżonymi lub polami innymi niż ciągi znaków umieść całą konfigurację jako JSON pod pojedynczym kluczem `config.json`. Typy przechowujące odświeżane tokeny OAuth (Codex, Google, BigQuery oraz Linear lub Notion w trybie OAuth) nie mogą być tylko do odczytu i są odrzucane.

W przypadku External Secrets Operator umieść etykietę i adnotacje w szablonie docelowym:

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

Czego należy oczekiwać:

- **Pod może zgłaszać stan Ready przed zakończeniem synchronizacji.** Uruchamianie nie czeka na serwer API, dzięki czemu interfejs użytkownika pozostaje dostępny. Dopóki proces nie zostanie zsynchronizowany, nie podejmuje zadań w kolejce; wykonanie używające jednego z tych credentials kończy się błędem `not synced from Kubernetes yet` przed uruchomieniem jakiegokolwiek węzła. Ustawienia → Kubernetes (karta administratora widoczna tylko przy włączonym `HEYM_K8S_CREDENTIALS`) oraz Ustawienia → Instancje pokazują stan synchronizacji; nie twórz zatem mechanizmu health check zakładającego, że Ready oznacza zakończenie synchronizacji.
- **Usunięty Secret sprawia, że credential staje się niedostępny**, zachowując jego identyfikator i udostępnienia; ponowne utworzenie Secretu (usunięcie GitOps i ponowne wdrożenie) przywraca go we wszystkich workflow. Wiersze nigdy nie są usuwane automatycznie; administrator usuwa je w sekcji Ustawienia → Kubernetes.
- **W przypadku właściciela, który jeszcze się nie zalogował**, ponowne próby odbywają się co pięć minut.
- **Credential użytkownika o tej samej nazwie i właścicielu** nigdy nie jest nadpisywany; Secret jest wówczas zgłaszany jako konflikt.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes ocenia regułę egress po translacji usługi DNS Service na pod DNS, a pody DNS w OpenShift nasłuchują na porcie 5353, a nie 53. Przy podstawowej regule sandboxy podłączone do sieci łączą się z internetem po adresie IP, lecz każde rozpoznawanie nazw kończy się przekroczeniem limitu czasu (timeout). Overlay zmienia wyłącznie tę regułę:

- Zezwala na UDP i TCP na porcie 5353 (port podów DNS), a nie 53 usługi Service.
- Wybiera namespace DNS za pomocą `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` nie występuje na każdym klastrze.
- Publiczna reguła `ipBlock` nadal wyklucza zakresy prywatne, link-local oraz CGNAT.

## Cilium z zastąpieniem kube-proxy

Konfiguracja bazowa nie przypisuje żadnej reguły egress do poda backendu. W razie jej dodania zwykły `ipBlock` nie może odblokować serwera API: adres Service jest przepisywany na port `:6443` węzła przed zastosowaniem reguły, a adres ten nosi tożsamość `kube-apiserver` Cilium. Zezwól na to za pomocą `CiliumNetworkPolicy`. Wybiera ona także workery, które również uruchamiają pody sandboxów (patrz Rozkład obciążenia):

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

## Planowanie (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` przyjmuje format JSON z polami `nodeSelector`, `tolerations`, `runtimeClassName` (na przykład gVisor), `imagePullSecrets` oraz `priorityClassName`. Żadne inne pola nie są akceptowane.

## Rozkład obciążenia

Workery to dodatkowe wdrożenia (Deployments) tego samego obrazu ze zmienną `HEYM_INSTANCE_ROLE=worker`, tymi samymi wartościami `SECRET_KEY` i `ENCRYPTION_KEY` oraz kontem `heym-backend` ServiceAccount, dzięki czemu również mogą uruchamiać pody sandboxów. Worker wykonuje węzeł Code, dlatego potrzebuje roszczenia w katalogu roboczym na zależności węzła Code: wystarczy własne roszczenie `ReadWriteOnce`, ponieważ te katalogi istnieją tylko na czas jednego wykonania. `overlays/orbstack-cluster` dodaje jednego workera; skrypt `scripts/k8s-cluster-smoke.sh` sprawdza, czy kolejkowane wykonania trafiają do niego i czy ich pody sandboxów należą do tego workera.

Uruchamiaj workery bezpośrednio za pomocą uvicorn, jak w `overlays/orbstack-cluster/worker.yaml`. Punkt wejścia obrazu uruchamia migracje bazy danych, a te należą do instancji głównej (main). Nadaj każdemu workerowi unikalny, stabilny identyfikator `HEYM_INSTANCE_ID`; nazwa poda w StatefulSet sprawdza się znakomicie. Wykonania w kolejce przypisane do zatrzymanego workera są przenoszone na inną instancję przez lidera.

## Test lokalny w OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

W przypadku instalacji z instancją główną i jednym workerem zastosuj zamiast tego `overlays/orbstack-cluster` i uruchom `./scripts/k8s-cluster-smoke.sh`.

## Powiązane materiały

- [Przykładowe manifesty i README kodu źródłowego](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Uruchamianie i wdrażanie](./running-and-deployment.md)
- [Rozkład obciążenia](../reference/cluster.md)
