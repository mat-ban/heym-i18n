# Cilne Teams

Cilne **Teams** ļauj izveidot un pārvaldīt komandas, lai koplietotu workflow, akreditācijas datus, mainīgos, vektoru krātuves un Drive failus ar lietotāju grupām.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

## Komandas izveide

1. Noklikšķiniet uz **New Team**
2. Ievadiet nosaukumu un neobligātu aprakstu
3. Noklikšķiniet uz **Create**

Jūs automātiski kļūstat par komandas izveidotāju un pirmo dalībnieku.

## Dalībnieku pārvaldība

- **Pievienot dalībnieku** – Komandas detalizētās informācijas dialogā ievadiet lietotāja e-pasta adresi un noklikšķiniet uz **Add**
- **Noņemt dalībnieku** – Noklikšķiniet uz X blakus dalībniekam (izveidotāju nevar noņemt)
- **Rediģēt komandu** – Izveidotāji var rediģēt nosaukumu un aprakstu
- **Dzēst komandu** – Izveidotāji var dzēst komandu; visi komandas koplietojumi tiek noņemti
- **Koplietotie resursi** – Komandas detalizētās informācijas dialogs parāda workflow, akreditācijas datus, mainīgos, vektoru krātuves, Drive failus, workflow veidnes un node veidnes, kas koplietotas ar komandu. Noklikšķiniet uz workflow, lai to atvērtu redaktorā; pārslēdzieties uz attiecīgo cilni citiem resursiem.

## Koplietošana ar komandām

Koplietojiet resursus ar komandām no:

- **Workflows** – Koplietošanas dialogs workflow redaktorā
- **Workflow Templates** – Koplietošanas dialogs, veidojot/rediģējot workflow veidni (redzamība: Specific users)
- **Node Templates** – Koplietošanas dialogs, veidojot/rediģējot node veidni (redzamība: Specific users)
- **Credentials** – Koplietošanas dialogs cilnē Credentials
- **Variables** – Koplietošanas dialogs cilnē Variables
- **Vector Stores** – Koplietošanas dialogs cilnē Vectors
- **Dashboards** – Dashboard iestatījumi cilnē Dashboard (lasīšana vai rakstīšana)
- **Drive Files** – Koplietošanas dialogs cilnē Drive vai Drive node `shareWithMyTeams` / `unshareWithMyTeams` operācijas

Kad koplietojat ar komandu, visi komandas dalībnieki iegūst piekļuvi. Skatiet [Teams](../reference/teams.md) papildu informācijai.

Kad koplietojat workflow ar komandu, koplietojiet arī akreditācijas datus un apakš-workflow, no kuriem šis workflow ir atkarīgs, ar to pašu komandu. Tikai workflow piekļuve nepiešķir piekļuvi akreditācijas datiem vai pakārtotajam workflow.

## Chat integrācija

Cilnes [Chat](./chat-tab.md) AI asistents var uzskaitīt Jūsu komandas. Jautājiet "my teams", lai redzētu, kurām komandām Jūs piederat.

## Saistītie resursi

- [Teams](../reference/teams.md) – Teams uzziņa un koplietošanas modelis
- [Credentials Sharing](../reference/credentials-sharing.md) – Koplietot akreditācijas datus ar lietotājiem un komandām
- [Workflow Organization](../reference/workflow-organization.md) – Mapes un koplietošana
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakts lapas ceļvedis dashboard virsmām
