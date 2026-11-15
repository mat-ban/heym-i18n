# Heym na Kubernetesu

Implementirajte Heym na Kubernetesu bez Docker socketa. Pokrenite svaki sandbox kao zaseban pod uz vodiče za pohranu, mrežu i workere.

Primjeri manifesta za pokretanje Heyma bez Docker socketa. Svaki sandbox (Python alati, skills, čvor Code, analiza datoteka, Playwright, MCP stdio, Codex, OpenCode) radi kao zaseban pod putem Kubernetes API-ja.

## Zahtjevi

- Kubernetes 1.30 ili noviji (stdin sandboxa koristi protokol priključivanja `v5.channel.k8s.io`).
- CNI koji provodi NetworkPolicy. Heym to provjerava prije prvog offline sandboxa i odbija pokretanje offline sandboxa ako se testni pod još uvijek može povezati.
- Vrijednost `podPidsLimit` na kubeletu. Podovi nemaju polje ograničenja PID-a po podu; stoga je ovo jedina zaštita od fork-bombi uz memoriju, procesor i vremensko ograničenje. Heym to ne može provjeriti: `/sys/fs/cgroup/pids.max` spremnika pripada njegovoj vlastitoj cgroup grupi, a ne cgroup grupi poda. Talos se prema zadanim postavkama isporučuje bez ovog ograničenja.

## Instalacija

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) je chart zajednice koji održava Alexey Masolov i objavljen je na [Artifact Hubu](https://artifacthub.io/packages/helm/heym/heym), s unaprijed definiranim postavkama platforme za OpenShift, EKS, AKS i GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Pohrana (Storage)

`heym-data` pohranjuje Drive datoteke, dodatke i Codex/OpenCode radne prostore. Sandbox podovi montiraju jedan `subPath` tog volumena po svakom izvođenju. Uz `ReadWriteMany` mogu se izvoditi na bilo kojem čvoru. Uz `ReadWriteOnce` vezani su za čvor backend sustava. `ReadWriteOncePod` nije podržan.

## Prilagođeni paketi certifikacijskih tijela (CA)

Montirajte svoj CA paket u backend pod i usmjerite `SSL_CERT_FILE` (ili `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) prema njemu. Heym kopira datoteku u `codex-workspaces/_ca/` na zahtjevu volumena i montira tu kopiju samo za čitanje na istoj putanji u svakom sandboxu koji primi varijablu. Uz zahtjev `ReadWriteOnce`, ti se sandboxovi izvode na čvoru backend sustava.

Certifikacijsko tijelo ne otvara mrežu. Egress promet sandboxa doseže samo javne adrese; stoga interno zrcalo paketa, proxy ili interni API zahtijeva vlastito pravilo, na primjer:

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

## Namjenski namespace za sandboxove

Postavite `HEYM_SANDBOX_K8S_NAMESPACE` za pokretanje sandboxova u drugom namespaceu, označite taj namespace oznakom `pod-security.kubernetes.io/enforce: restricted`, premjestite Role tamo i zadržite u Heymovu namespaceu Role koja dodjeljuje `get` nad `pods`. Sandboxovi radnih prostora tada trebaju zahtjev pod nazivom `heym-data` u namespaceu sandboxa povezan s istim RWX dijeljenjem (drugi, statički osiguran PersistentVolume).

## Credentials iz Kubernetes Secrets

Secret s oznakom `heym.run/credential: "true"` postaje credential samo za čitanje. Vrijednosti ostaju u memoriji svakog procesa i nikada ne dopiru do baze podataka niti njezinih sigurnosnih kopija; promjena Secreta rotira credential bez ponovnog pokretanja. Bilo koji alat koji piše Secret funkcionira: External Secrets Operator, SealedSecrets, SOPS putem Fluxa ili Argo CD-a, ili `kubectl`.

Dodajte komponentu u svoj overlay. Ona dodjeljuje ServiceAccountu prava `get`, `list` i `watch` nad Secrets i postavlja `HEYM_K8S_CREDENTIALS=true` na svaki Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC za Secrets ne može se suziti prema oznaci; Heym stoga može čitati svaki Secret u nadziranom namespaceu. Pokrenite Heym u vlastitom namespaceu ili postavite `HEYM_K8S_CREDENTIALS_NAMESPACE` na namespace koji sadrži isključivo Heymove credentiale. Pokretanje se odbija ako je bilo koja od varijabli `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` ili `HEYM_MCP_STDIO_SANDBOX` postavljena na `subprocess`, jer bi se korisnički kod izvodio pored tokena ServiceAccounta.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Naziv credentiala prikazan u Heymu
        heym.run/type: custom                   # Vrsta credentiala
        heym.run/owner: admin@example.com       # Postojeći korisnik
        heym.run/share-users: alice@example.com # Neobavezni e-mailovi odvojeni zarezom
        heym.run/share-teams: automation        # Neobavezni nazivi timova odvojeni zarezom
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Svaki podatkovni ključ predstavlja konfiguracijsko polje. Za vrstu s ugniježđenim poljima ili poljima koja nisu nizovi znakova, postavite cjelokupnu konfiguraciju kao JSON pod jedan ključ `config.json`. Vrste koje pohranjuju osvježene OAuth tokene (Codex, Google, BigQuery i Linear ili Notion u načinu OAuth) ne mogu biti samo za čitanje i odbijaju se.

Uz External Secrets Operator postavite oznaku i anotacije na ciljni predložak:

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

Što očekivati:

- **Pod može biti u stanju Ready prije nego što je sinkroniziran.** Pokretanje ne čeka API poslužitelj, pa korisničko sučelje ostaje dostupno. Dok se proces ne sinkronizira, ne preuzima pokretanja iz reda čekanja; izvođenje koje koristi jedan od ovih credentiala ne uspijeva s pogreškom `not synced from Kubernetes yet` prije izvođenja bilo kojeg čvora. Postavke → Kubernetes (kartica administratora koja se pojavljuje samo kada je uključen `HEYM_K8S_CREDENTIALS`) i Postavke → Instance prikazuju stanje sinkronizacije; stoga nemojte graditi provjeru stanja (health check) koja pretpostavlja da Ready znači sinkronizirano.
- **Izbrisani Secret čini njegov credential nedostupnim**, zadržavajući njegov ID i dijeljenja; ponovno stvaranje Secreta (GitOps brisanje i ponovna primjena) vraća ga za svaki workflow. Redovi se nikada ne uklanjaju automatski; administrator ih uklanja iz Postavke → Kubernetes.
- **Za vlasnika koji se još nije prijavio**, pokušaj se ponavlja svakih pet minuta.
- **Korisnički credential s istim nazivom i vlasnikom** nikada se ne prepisuje; Secret se umjesto toga prijavljuje kao sukob.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes procjenjuje egress pravilo nakon što se usluga DNS Service prevede u DNS pod, a OpenShiftovi DNS podovi slušaju na portu 5353, a ne 53. Uz osnovno pravilo mrežni sandboxovi dosežu internet putem IP adrese, ali svako traženje imena ističe. Overlay mijenja isključivo to pravilo:

- Dopušta UDP i TCP na portu 5353 (port DNS podova), a ne 53 usluge Service.
- Odabire DNS namespace putem `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` nije postavljen na svakom clusteru.
- Javno pravilo `ipBlock` nastavlja isključivati privatne, link-local i CGNAT raspone.

## Cilium sa zamjenom kube-proxyja

Osnovna konfiguracija ne dodjeljuje pravilo egress za backend pod. Ako ga dodate, običan `ipBlock` ne može dopustiti API poslužitelj: adresa Servicea se prepisuje na port `:6443` čvora prije primjene pravila, a ta adresa nosi identitet `kube-apiserver` Ciliuma. Dopustite to pomoću `CiliumNetworkPolicy`. Ona također odabire workere, koji također pokreću sandbox podove (pogledajte Raspodjela opterećenja):

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

## Raspoređivanje (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` prihvaća JSON s `nodeSelector`, `tolerations`, `runtimeClassName` (na primjer gVisor), `imagePullSecrets` i `priorityClassName`. Nijedno drugo polje se ne prihvaća.

## Raspodjela opterećenja

Workeri su dodatni Deployments iste slike s `HEYM_INSTANCE_ROLE=worker`, istim vrijednostima `SECRET_KEY` i `ENCRYPTION_KEY`, te ServiceAccount računom `heym-backend`, tako da i oni mogu pokretati sandbox podove. Worker izvodi čvor Code, stoga mu je potreban volumen u radnom direktoriju za ovisnosti čvora Code: dovoljan je vlastiti zahtjev `ReadWriteOnce`, jer ti direktoriji postoje samo tijekom jednog izvođenja. `overlays/orbstack-cluster` dodaje jednog workera; `scripts/k8s-cluster-smoke.sh` provjerava dolaze li izvođenja iz reda čekanja na njega i pripadaju li njihovi sandbox podovi tom workeru.

Pokrenite workere izravno pomoću uvicorna, kao što to čini `overlays/orbstack-cluster/worker.yaml`. Ulazna točka slike pokreće migracije baze podataka, a one pripadaju glavnoj instanci (main). Dodijelite svakom workeru jedinstveni i stabilni `HEYM_INSTANCE_ID`; naziv poda u StatefulSetu izvrsno funkcionira. Izvođenja u redu čekanja za zaustavljenog workera vođa (leader) premješta na drugu instancu.

## Lokalni test na OrbStacku

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Za glavnu instancu plus jednog workera primijenite umjesto toga `overlays/orbstack-cluster` i pokrenite `./scripts/k8s-cluster-smoke.sh`.

## Povezane teme

- [Primjeri manifesta i README izvornog koda](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Rad i implementacija](./running-and-deployment.md)
- [Raspodjela opterećenja](../reference/cluster.md)
