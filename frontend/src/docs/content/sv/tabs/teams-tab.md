# Teams-fliken

**Teams**-fliken gör det möjligt att skapa och hantera team för delning av workflows, credentials, variabler, vector stores och Drive-filer med grupper av användare.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

## Skapa ett team

1. Klicka på **New Team**
2. Ange ett namn och en valfri beskrivning
3. Klicka på **Create**

Teamets skapare blir automatiskt den första medlemmen.

## Hantera medlemmar

- **Add member** – Ange en användares e-postadress i teamets detaljdialog och klicka på **Add**
- **Remove member** – Klicka på X bredvid en medlem (skaparen kan inte tas bort)
- **Edit team** – Skapare kan redigera namn och beskrivning
- **Delete team** – Skapare kan ta bort teamet; alla teamdelningar tas bort
- **Shared resources** – Teamets detaljdialog visar workflows, credentials, variabler, vector stores, Drive-filer, workflow-mallar och nodmallar som delats med teamet. Klicka på en workflow för att öppna den i editorn; byt till relevant flik för övriga resurser.

## Dela med team

Dela resurser med team från:

- **Workflows** – Delningsdialog i workflow-editorn
- **Workflow Templates** – Delningsdialog vid skapande/redigering av en workflow-mall (synlighet: Specifika användare)
- **Node Templates** – Delningsdialog vid skapande/redigering av en nodmall (synlighet: Specifika användare)
- **Credentials** – Delningsdialog i fliken Credentials
- **Variables** – Delningsdialog i fliken Variables
- **Vector Stores** – Delningsdialog i fliken Vectors
- **Dashboards** – Dashboard-inställningar i fliken Dashboard (läs- eller skrivbehörighet)
- **Drive Files** – Delningsdialog i fliken Drive eller Drive-nodens `shareWithMyTeams` / `unshareWithMyTeams`-operationer

När en resurs delas med ett team får samtliga teammedlemmar åtkomst. Se [Teams](../reference/teams.md) för detaljer.

När en workflow delas med ett team ska även de credentials och sub-workflows som workflowen är beroende av delas med samma team. Enbart workflow-åtkomst ger inte åtkomst till credentials eller underordnade workflows.

## Chat-integration

AI-assistenten i [Chat-fliken](./chat-tab.md) kan lista teamen. Fråga "my teams" för att se vilka team som användaren tillhör.

## Relaterat

- [Teams](../reference/teams.md) – Teams-referens och delningsmodell
- [Credentials Sharing](../reference/credentials-sharing.md) – Dela credentials med användare och team
- [Workflow Organization](../reference/workflow-organization.md) – Mappar och delning
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor
