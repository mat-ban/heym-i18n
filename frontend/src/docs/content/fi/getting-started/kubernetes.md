# Heym Kubernetesissa

Ota Heym käyttöön Kubernetesissa ilman Docker-socketia. Suorita jokainen hiekkalaatikko (sandbox) omana podinaan tallennustilan, verkon ja worker-prosessien ohjeiden mukaisesti.

Esimerkkikonfiguraatiot Heymin suorittamiseen ilman Docker-socketia. Jokainen sandbox (Python-työkalut, skills, Code-solmu, tiedostoanalyysi, Playwright, MCP stdio, Codex, OpenCode) toimii omana podinaan Kubernetes API:n kautta.

## Vaatimukset

- Kubernetes 1.30 tai uudempi (sandbox-stdin käyttää `v5.channel.k8s.io`-liitosprotokollaa).
- CNI, joka valvoo NetworkPolicy-sääntöjä. Heym tarkistaa tämän ennen ensimmäistä offline-hiekkalaatikkoa ja kieltäytyy suorittamasta offline-hiekkalaatikoita, jos testipod voi edelleen muodostaa yhteyden.
- Kubeletin `podPidsLimit`. Podeissa ei ole podikohtaista PID-rajoituskenttää; tämä on siten ainoa suoja fork-pommeja vastaan muistin, suorittimen ja aikarajan ohella. Heym ei voi tarkistaa tätä: säiliön `/sys/fs/cgroup/pids.max` kuuluu sen omaan cgroup-ryhmään, ei podin ryhmään. Talos toimitetaan oletusarvoisesti ilman tätä rajoitusta.

## Asennus

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) on Alexey Masolovin ylläpitämä yhteisön chart, joka on julkaistu [Artifact Hubissa](https://artifacthub.io/packages/helm/heym/heym) ja joka sisältää alusta-esiasetukset OpenShiftille, EKS:lle, AKS:lle ja GKE:lle:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Tallennustila (Storage)

`heym-data` tallentaa Drive-tiedostot, liitännäiset ja Codex/OpenCode-työtilat. Sandbox-podit liittävät yhden `subPath`-polun tästä taltio-osuudesta suoritusta kohden. Asetuksella `ReadWriteMany` ne voivat toimia missä tahansa solmussa. Asetuksella `ReadWriteOnce` ne on sidottu backendin solmuun. `ReadWriteOncePod` ei ole tuettu.

## Mukautetut CA-varmennepaketit

Liitä CA-pakettisi backend-podiin ja osoita `SSL_CERT_FILE` (tai `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) siihen. Heym kopioi tiedoston taltiovarauksen hakemistoon `codex-workspaces/_ca/` ja liittää kyseisen kopion vain luku -tilassa samaan polkuun jokaisessa hiekkalaatikossa, joka vastaanottaa muuttujan. `ReadWriteOnce`-varauksella nämä hiekkalaatikot toimivat backendin solmussa.

CA ei avaa verkkoa. Sandboxin egress-liikenne saavuttaa ainoastaan julkiset osoitteet; sisäinen pakettipeili, välityspalvelin tai sisäinen API vaatii siksi oman sääntönsä, esimerkiksi:

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

## Erillinen nimiavaruus (namespace) hiekkalaatikoille

Aseta `HEYM_SANDBOX_K8S_NAMESPACE` suorittamaan hiekkalaatikot muualla, merkitse nimiavaruus tunnisteella `pod-security.kubernetes.io/enforce: restricted`, siirrä Role sinne ja säilytä Heymin nimiavaruudessa Role, joka myöntää `get`-oikeuden `pods`-resursseille. Työtilan hiekkalaatikot tarvitsevat tämän jälkeen hiekkalaatikoiden nimiavaruudessa varauksen nimeltä `heym-data`, joka on sidottu samaan RWX-jakoon (toinen, staattisesti varattu PersistentVolume).

## Credentials Kubernetes Secrets -resursseista

Secret, jolla on merkintä `heym.run/credential: "true"`, muuttuu vain luku -tilaiseksi credentialiksi. Arvot pysyvät kunkin prosessin muistissa eivätkä koskaan päädy tietokantaan tai sen varmuuskopioihin; Secretin muuttaminen kierrättää credentialin ilman uudelleenkäynnistystä. Kaikki työkalut, jotka kirjoittavat Secretin, toimivat: External Secrets Operator, SealedSecrets, SOPS Fluxin tai Argo CD:n kautta, tai `kubectl`.

Lisää komponentti kerrokseesi (overlay). Se myöntää ServiceAccountille oikeudet `get`, `list` ja `watch` Secrets-resursseihin ja asettaa arvon `HEYM_K8S_CREDENTIALS=true` jokaiselle Deploymentille:

    components:
      - ../../components/kubernetes-credentials

Secrets RBAC -oikeuksia ei voi rajata tunnisteen mukaan; Heym voi siksi lukea kaikki valvotun nimiavaruuden Secretit. Suorita Heym omassa nimiavaruudessaan tai aseta `HEYM_K8S_CREDENTIALS_NAMESPACE` nimiavaruuteen, joka sisältää vain Heymin credentialeja. Käynnistys estetään, jos jokin muuttujista `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` tai `HEYM_MCP_STDIO_SANDBOX` on tilassa `subprocess`, koska käyttäjäkoodi suoritettaisiin ServiceAccount-tunnisteen rinnalla.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Heymissä näkyvä credential-nimi
        heym.run/type: custom                   # Credential-tyyppi
        heym.run/owner: admin@example.com       # Olemassa oleva käyttäjä
        heym.run/share-users: alice@example.com # Valinnaiset pilkuilla erotetut sähköpostit
        heym.run/share-teams: automation        # Valinnaiset pilkuilla erotetut tiiminimet
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Jokainen tietoavain vastaa konfiguraatiokenttää. Jos tyypissä on sisäkkäisiä kenttiä tai muita kuin merkkijonokenttiä, aseta koko konfiguraatio JSON-muodossa yhden `config.json`-avaimen alle. Tyypit, jotka tallentavat uusittuja OAuth-tunnisteita (Codex, Google, BigQuery sekä Linear tai Notion OAuth-tilassa), eivät voi olla vain luku -tilassa, ja ne hylätään.

Käytettäessä External Secrets Operator -työkalua aseta tunniste ja annotaatiot kohdemalliin:

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

Mitä odottaa:

- **Podi voi olla Ready-tilassa ennen synkronointia.** Käynnistys ei odota API-palvelinta, joten käyttöliittymä pysyy käytettävissä ilman sitä. Ennen kuin prosessi on synkronoitu, se ei käsittele jonossa olevia ajoja; näitä credentialeja käyttävä ajo epäonnistuu virheellä `not synced from Kubernetes yet` ennen minkään solmun suorittamista. Asetukset → Kubernetes (ylläpidon välilehti, joka näkyy vain, kun `HEYM_K8S_CREDENTIALS` on käytössä) ja Asetukset → Instanssit näyttävät synkronointitilan; älä siis luo kuntotarkastusta, joka olettaa Ready-tilan tarkoittavan synkronoitua.
- **Poistettu Secret tekee sen credentialista saavuttamattoman** säilyttäen sen tunnuksen ja jaot; Secretin luominen uudelleen (GitOps-karsinta ja uudelleensoveltaminen) palauttaa sen jokaiseen workflowhun. Rivejä ei koskaan poisteta automaattisesti; ylläpitäjä poistaa ne kohdasta Asetukset → Kubernetes.
- **Jos omistaja ei ole vielä kirjautunut sisään**, toimenpidettä yritetään uudelleen viiden minuutin välein.
- **Käyttäjän credentialia, jolla on sama nimi ja omistaja**, ei koskaan korvata; Secret ilmoitetaan sen sijaan ristiriitana.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes arvioi egress-käytännön sen jälkeen, kun DNS Service on käännetty DNS-podiksi, ja OpenShiftin DNS-podit kuuntelevat porttia 5353, eivät 53. Peruskäytännöllä verkotetut hiekkalaatikot tavoittavat internetin IP-osoitteen kautta, mutta jokainen nimipalveluhaku aikakatkaistaan. Kerros muuttaa vain tätä sääntöä:

- Se sallii UDP- ja TCP-liikenteen portissa 5353 (DNS-podien portti) palvelun portin 53 sijaan.
- Se valitsee DNS-nimiavaruuden arvolla `kubernetes.io/metadata.name: openshift-dns`. Arvoa `network.openshift.io/policy-group: dns` ei ole asetettu kaikissa klustereissa.
- Julkinen `ipBlock`-sääntö sulkee edelleen pois yksityiset, link-local- ja CGNAT-alueet.

## Cilium kube-proxy-korvauksella

Perusrakenne ei määritä backend-podille mitään egress-käytäntöä. Jos lisäät sellaisen, tavallinen `ipBlock` ei voi sallia API-palvelinta: palveluosoite kirjoitetaan uudelleen solmun porttiin `:6443` ennen käytännön soveltamista, ja tämä osoite kantaa Ciliumin `kube-apiserver`-identiteettiä. Salli se käyttämällä `CiliumNetworkPolicy`-resurssia. Se valitsee myös workerit, jotka niin ikään käynnistävät sandbox-podeja (katso Kuormanjako):

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

## Ajoitus (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` vastaanottaa JSON-muotoisen määrityksen kentillä `nodeSelector`, `tolerations`, `runtimeClassName` (esimerkiksi gVisor), `imagePullSecrets` ja `priorityClassName`. Mitään muita kenttiä ei hyväksytä.

## Kuormanjako

Workerit ovat saman kuvan lisäasennuksia (Deployments), joissa on `HEYM_INSTANCE_ROLE=worker`, samat `SECRET_KEY`- ja `ENCRYPTION_KEY`-arvot sekä `heym-backend`-ServiceAccount, joten ne voivat myös käynnistää sandbox-podeja. Worker suorittaa Code-solmun, joten se tarvitsee työtilahakemistoon taltiovarauksen Code-solmun riippuvuuksille: sen oma `ReadWriteOnce`-varaus riittää, koska nämä hakemistot ovat olemassa vain yhden suorituksen ajan. `overlays/orbstack-cluster` lisää yhden workerin; `scripts/k8s-cluster-smoke.sh` tarkistaa, että jonossa olevat ajot päätyvät sille ja että niiden sandbox-podit kuuluvat kyseiselle workerille.

Käynnistä workerit suoraan uvicornilla, kuten tiedostossa `overlays/orbstack-cluster/worker.yaml` tehdään. Kuvan aloituspiste suorittaa tietokantamigraatiot, ja ne kuuluvat pääinstanssille (main). Anna jokaiselle workerille yksilöllinen, vakaa `HEYM_INSTANCE_ID`; StatefulSet-podin nimi toimii erinomaisesti. Pysäytetylle workerille jonotetut ajot siirretään johtajan (leader) toimesta toiselle instanssille.

## Paikallinen testi OrbStackissa

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Pääinstanssia ja yhtä workeria varten käytä sen sijaan tiedostoa `overlays/orbstack-cluster` ja suorita `./scripts/k8s-cluster-smoke.sh`.

## Liittyvät aiheet

- [Esimerkkikonfiguraatiot ja lähdekoodin README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Käyttö ja käyttöönotto](./running-and-deployment.md)
- [Kuormanjako](../reference/cluster.md)
