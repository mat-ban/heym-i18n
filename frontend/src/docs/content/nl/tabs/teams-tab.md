# Teams-tabblad

Het tabblad **Teams** biedt de mogelijkheid om teams aan te maken en te beheren voor het delen van workflows, inloggegevens, variabelen, vectoropslag en Drive-bestanden met groepen gebruikers.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Teams-demo bekijken</a></p>

## Een team aanmaken

1. Klik op **Nieuw team**
2. Voer een naam en optionele beschrijving in
3. Klik op **Aanmaken**

U wordt automatisch de maker van het team en het eerste lid.

## Leden beheren

- **Lid toevoegen** – Voer een e-mailadres van een gebruiker in het detailvenster van het team in en klik op **Toevoegen**
- **Lid verwijderen** – Klik op de X naast een lid (de maker kan niet worden verwijderd)
- **Team bewerken** – Makers kunnen naam en beschrijving bewerken
- **Team verwijderen** – Makers kunnen het team verwijderen; alle teamdelingsrelaties worden verwijderd
- **Gedeelde bronnen** – Het detailvenster van het team toont workflows, inloggegevens, variabelen, vectoropslag, Drive-bestanden, workflow-sjablonen en node-sjablonen die met het team zijn gedeeld. Klik op een workflow om deze in de editor te openen; schakel over naar het betreffende tabblad voor andere bronnen.

## Delen met teams

Deel bronnen met teams vanuit:

- **Workflows** – Deelvenster in de workflow-editor
- **Workflow-sjablonen** – Deelvenster bij het aanmaken/bewerken van een workflow-sjabloon (zichtbaarheid: Specifieke gebruikers)
- **Node-sjablonen** – Deelvenster bij het aanmaken/bewerken van een node-sjabloon (zichtbaarheid: Specifieke gebruikers)
- **Inloggegevens** – Deelvenster in het tabblad Inloggegevens
- **Variabelen** – Deelvenster in het tabblad Variabelen
- **Vectoropslag** – Deelvenster in het tabblad Vectors
- **Dashboards** – Dashboardinstellingen in het tabblad Dashboard (lezen of schrijven)
- **Drive-bestanden** – Deelvenster in het tabblad Drive of de Drive-node `shareWithMyTeams` / `unshareWithMyTeams`-bewerkingen

Wanneer u met een team deelt, krijgen alle teamleden toegang. Zie [Teams](../reference/teams.md) voor meer informatie.

Wanneer u een workflow met een team deelt, deel dan ook de inloggegevens en sub-workflows waarvan die workflow afhankelijk is met hetzelfde team. Toegang tot een workflow alleen verleent geen toegang tot inloggegevens of onderliggende workflows.

## Chat-integratie

De AI-assistent in het [Chat-tabblad](./chat-tab.md) kan uw teams weergeven. Vraag "mijn teams" om te zien bij welke teams u hoort.

## Gerelateerd

- [Teams](../reference/teams.md) – Teams-referentie en deelmodel
- [Inloggegevens delen](../reference/credentials-sharing.md) – Inloggegevens delen met gebruikers en teams
- [Workflow-organisatie](../reference/workflow-organization.md) – Mappen en delen
- [Contextuele showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboardoppervlakken
