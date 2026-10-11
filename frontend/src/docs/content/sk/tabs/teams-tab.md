# Karta Teams

Karta **Teams** vám umožňuje vytvárať a spravovať tímy na zdieľanie workflowov, prihlasovacích údajov, premenných, vektorových úložísk a súborov Drive so skupinami používateľov.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Pozrite si ukážku Teams</a></p>

## Vytvorenie tímu

1. Kliknite na **New Team**
2. Zadajte názov a voliteľný popis
3. Kliknite na **Create**

Automaticky sa stanete tvorcom tímu a jeho prvým členom.

## Správa členov

- **Add member** – Zadajte e-mail používateľa v dialógu s detailmi tímu a kliknite na **Add**
- **Remove member** – Kliknite na X vedľa člena (tvorcu nie je možné odstrániť)
- **Edit team** – Tvorcovia môžu upravovať názov a popis
- **Delete team** – Tvorcovia môžu tím odstrániť; všetky zdieľania tímu sa odstránia
- **Shared resources** – Dialóg s detailmi tímu zobrazuje workflowy, prihlasovacie údaje, premenné, vektorové úložiská, súbory Drive, šablóny workflowov a šablóny uzlov zdieľané s tímom. Kliknutím na workflow ho otvoríte v editore; pre ostatné zdroje prepnite na príslušnú kartu.

## Zdieľanie s tímami

Zdieľajte zdroje s tímami z:

- **Workflows** – Dialóg zdieľania v editore workflowu
- **Workflow Templates** – Dialóg zdieľania pri vytváraní/úprave šablóny workflowu (viditeľnosť: Specific users)
- **Node Templates** – Dialóg zdieľania pri vytváraní/úprave šablóny uzla (viditeľnosť: Specific users)
- **Credentials** – Dialóg zdieľania na karte Prihlasovacie údaje
- **Variables** – Dialóg zdieľania na karte Premenné
- **Vector Stores** – Dialóg zdieľania na karte Vektory
- **Dashboards** – Nastavenia dashboardu na karte Dashboard (read alebo write)
- **Drive Files** – Dialóg zdieľania na karte Drive alebo operácie uzla Drive `shareWithMyTeams` / `unshareWithMyTeams`

Keď zdieľate s tímom, všetci členovia tímu získajú prístup. Podrobnosti nájdete v časti [Teams](../reference/teams.md).

Keď zdieľate workflow s tímom, zdieľajte s tým istým tímom aj prihlasovacie údaje a pod-workflowy, od ktorých daný workflow závisí. Samotný prístup k workflowu neudeľuje prístup k prihlasovacím údajom ani k podriadenému workflowu.

## Integrácia s Chatom

AI asistent na karte [Chat](./chat-tab.md) dokáže vypísať vaše tímy. Opýtajte sa "my teams" a zobrazia sa tímy, do ktorých patríte.

## Súvisiace

- [Teams](../reference/teams.md) – Referencia Teams a model zdieľania
- [Credentials Sharing](../reference/credentials-sharing.md) – Zdieľanie prihlasovacích údajov s používateľmi a tímami
- [Workflow Organization](../reference/workflow-organization.md) – Priečinky a zdieľanie
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkou pre povrchy dashboardu
