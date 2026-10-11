# Teams-fanen

**Teams**-fanen gør det muligt at oprette og administrere teams til deling af workflows, legitimationsoplysninger, variabler, vektorlagre og Drive-filer med grupper af brugere.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Se Teams-demo</a></p>

## Oprettelse af et team

1. Klik på **Nyt team**
2. Indtast et navn og valgfri beskrivelse
3. Klik på **Opret**

Brugeren bliver automatisk teamets opretter og første medlem.

## Administration af medlemmer

- **Tilføj medlem** – Indtast en bruger-e-mail i teamets detaljedialog og klik på **Tilføj**
- **Fjern medlem** – Klik på X ved siden af et medlem (opretteren kan ikke fjernes)
- **Rediger team** – Oprettere kan redigere navn og beskrivelse
- **Slet team** – Oprettere kan slette teamet; alle teamdeling fjernes
- **Delte ressourcer** – Teamets detaljedialog viser workflows, legitimationsoplysninger, variabler, vektorlagre, Drive-filer, workflow-skabeloner og node-skabeloner delt med teamet. Klik på et workflow for at åbne det i editoren; skift til den relevante fane for andre ressourcer.

## Deling med teams

Del ressourcer med teams fra:

- **Workflows** – Deltingsdialog i workflow-editoren
- **Workflow-skabeloner** – Deltingsdialog ved oprettelse/redigering af workflow-skabelon (synlighed: Specifikke brugere)
- **Node-skabeloner** – Deltingsdialog ved oprettelse/redigering af node-skabelon (synlighed: Specifikke brugere)
- **Legitimationsoplysninger** – Deltingsdialog i Legitimationsoplysninger-fanen
- **Variabler** – Deltingsdialog i Variabler-fanen
- **Vektorlagre** – Deltingsdialog i Vektorer-fanen
- **Dashboards** – Dashboard-indstillinger i Dashboard-fanen (læse- eller skriveadgang)
- **Drive-filer** – Deltingsdialog i Drive-fanen eller Drive-node `shareWithMyTeams` / `unshareWithMyTeams` operationer

Når der deles med et team, får alle teammedlemmer adgang. Se [Teams](../reference/teams.md) for detaljer.

Når et workflow deles med et team, bør de underliggende legitimationsoplysninger og under-workflows også deles med samme team. Workflow-adgang giver ikke automatisk adgang til legitimationsoplysninger eller underliggende workflows.

## Chat-integration

Den [intelligente assistent i Chat-fanen](./chat-tab.md) kan vise teammedlemskaber. Spørg "my teams" for at se hvilke teams der tilhøres.

## Relateret

- [Teams](../reference/teams.md) – Reference for teams og delingsmodel
- [Deling af legitimationsoplysninger](../reference/credentials-sharing.md) – Del legitimationsoplysninger med brugere og teams
- [Workflow-organisation](../reference/workflow-organization.md) – Mapper og deling
- [Kontekstuel showcase](../reference/contextual-showcase.md) – Kompakt sideguide til dashboard-overflader
