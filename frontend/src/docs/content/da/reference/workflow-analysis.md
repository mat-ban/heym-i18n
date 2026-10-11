# Workflow-analyse

**Workflow-analyse** er et panel på venstre side, der indeholder et delt, redigerbart Markdown-dokument pr. workflow. Det kan bruges til at forklare workflowets formål og registrere forbedringsforslag – og AI kan generere et første udkast.

Dokumentet er delt: Alle med adgang til workflowet kan læse og redigere det. Det gemmes sammen med workflowet og slettes automatisk, når workflowet slettes.

## Åbning af panelet

1. Åbn et workflow i editoren.
2. Klik på **Analyse** (Glitter-ikon) i værktøjslinjen.
3. Panelet åbnes til venstre. Node-paletten (venstre panel) minimeres, mens analysepanelet er åbent; ved genåbning af node-paletten lukkes analysepanelet.

Panelet er kun tilgængeligt for gemte workflows. For et helt nyt, ugemt workflow skal det gemmes først.

## Dokumentet

Panelet viser et enkelt Markdown-dokument med to visninger, der skiftes mellem via knapperne **Rediger** (blyant) og **Forhåndsvisning** (øje):

| Visning | Formål |
|------|---------|
| **Rediger** | Simpel Markdown-editor (tekstområde). |
| **Forhåndsvisning** | Gengivet Markdown. |

Overskriften viser **hvem der sidst redigerede** dokumentet og hvornår.

### Gemning

Klik på **Gem** for at bevare ændringer. Gem-knappen er kun aktiv, når der er ugemte ændringer.

Da dokumentet er delt, anvendes optimistisk samtidighed ved gemning:

- Hvis en anden har gemt en nyere version, siden panelet blev åbnet, afvises gemningen, og en advarsel vises med navnet på den anden redaktør.
- Det er herefter muligt at vælge **Genindlæs (kassér mine)** for at hente serverversionen eller **Overskriv** for at tvinge gemning af den lokale version over den anden.

## AI-analyse

Vælg en **Legitimationsoplysning** og **Model** for en LLM øverst i panelet (modellisten indlæses fra den valgte legitimationsoplysning – se [Legitimationsoplysninger](../tabs/credentials-tab.md)). Derefter kan analysen køres:

- **Analyser mit workflow** – vises, når dokumentet er tomt. Det streamer en AI-genereret Markdown-rapport direkte ind i editoren som et ugemt udkast. Gennemgå og rediger det, og klik derefter på **Gem**.
- **Genanalysér** – vises, når dokumentet allerede har indhold. Det streamer en ny rapport til en separat **forhåndsvisning** uden at ændre det eksisterende dokument. Vælg **Accepter** for at erstatte editorindholdet med den nye analyse eller **Kassér** for at beholde det gamle.

Begge handlinger **kører først workflowet** (når det er gyldigt og kørbart) og inkluderer kørselsresultaterne i analysens prompt, så rapporten afspejler, hvordan workflowet faktisk opfører sig. Hvis workflowet ikke kan køres, fortsætter analysen ud fra dets statiske struktur.

Den genererede rapport dækker tre sektioner i rækkefølge: **Forbedringsområder** (konkrete forslag, inklusive en **sikkerhedsvinkel**, når workflowet håndterer legitimationsoplysninger, brugerinput, eksterne anmodninger eller dataeksponering), workflowets **Formål** og **Hvad det gør** (en trin-for-trin gennemgang af noderne).

Sektionen **Forbedringsområder** indeholder altid fire eksplicitte kontroller:

1. **Fejldækning** – hvis canvas ikke har en [Error Handler](../nodes/error-handler-node.md)-node og intet fejlworkflow er konfigureret, påpeges dette, og der anbefales at tilføje fejlhåndtering.
2. **Tid sparet** – hvis der ikke er angivet en estimeret tid sparet pr. kørsel, anbefales det at konfigurere dette, så [Analytics](../tabs/analytics-tab.md)-målet **Tid sparet** kan udfyldes.
3. **Netværksnoder** – for noder, der foretager netværkskald (såsom [HTTP](../nodes/http-node.md) og integrationsnoder), anbefales nodespecifik fejlhåndtering (gentagelse og/eller fortsæt-ved-fejl) for disse noder.
4. **Advarsler** – når der ikke er konfigureret [advarsler](../tabs/alerts-tab.md) for workflowet, anbefales det at opsætte advarsler før produktionssætning.

### Kør analysator fra Egenskaber

Når et workflow har noder på canvas, men ingen analyse endnu, vises en **Kør analysator**-knap i workflow-niveauets [Egenskaber](./canvas-features.md)-panel (vises, når ingen node er valgt). Den åbner dette Workflow-analyse-panel, så der kan vælges legitimationsoplysninger og model til rapportgenerering.

Hver analysekørsel registreres i [Kørsler](../tabs/traces-tab.md) under kilden **Workflow-analyse**.

Hvis der ikke er konfigureret nogen LLM-legitimationsoplysninger, er Analyse-knappen deaktiveret – tilføj en under [Legitimationsfanen](../tabs/credentials-tab.md).

## Relateret

- [AI-assistent](./ai-assistant.md) – generer eller modificer workflow-noder fra naturligt sprog.
- [Klistermærke](../nodes/sticky-note-node.md) – til korte noter direkte på canvas.
