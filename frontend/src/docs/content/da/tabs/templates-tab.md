# Skabeloner-fanen

Skabeloner-fanen gør det muligt at gemme, gennemse og genbruge komplette workflows og enkelte noder. Del noget, der er opbygget én gang, og anvend det på nye projekter med ét klik.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Se Skabeloner-demo</a></p>

## Oversigt

Der findes to typer skabeloner:

- **Workflow-skabeloner** – gemmer et komplet workflow (alle noder og forbindelser) som et genanvendeligt udgangspunkt.
- **Node-skabeloner** – gemmer en enkelt konfigureret node (f.eks. en finjusteret LLM-node eller en tilpasset HTTP-node) til genbrug på tværs af forskellige workflows.

Skift mellem de to ved at bruge **Workflows / Nodes**-skifteren øverst på fanen.

Brug søgefeltet til at filtrere de synlige skabeloner efter navn, beskrivelse, tags eller nodetype.

---

## Oprettelse af skabelon

### Workflow-skabelon

1. Åbn det workflow, der skal deles, i editoren.
2. Klik på **Share as Template** i værktøjslinjen øverst.
3. Udfyld navn, beskrivelse og valgfrie tags.
4. Vælg synlighed: **Everyone** (alle brugere) eller **Specific users** (indtast brugernavne og/eller vælg teams).
5. Klik på **Share**. En grøn notifikation bekræfter, at handlingen lykkedes.

### Node-skabelon

1. Højreklik på en vilkårlig node på canvas.
2. Vælg **Share as Template** fra kontekstmenuen.
3. Udfyld formularen og klik på **Share**.

---

## Brug af skabelon

### Workflow-skabelon

1. Åbn **Templates**-fanen og sikr, at **Workflows** er valgt.
2. Klik på et kort for at forhåndsvise det, eller klik direkte på **Use**.
3. Workflowet klones til et nyt workflow, der åbnes i editoren.

### Node-skabelon

1. Åbn **Templates**-fanen og vælg **Nodes**.
2. Klik på **Use** på et node-skabelonkort.
3. En dialog vises – vælg, hvor noden skal tilføjes:
   - **New workflow** – opretter et nyt workflow, der kun indeholder denne node.
   - **Existing workflow** – vælg fra workflowlisten; noden indsættes automatisk, når editoren åbnes.

---

## Forhåndsvisning

Klik på et vilkårligt skabelonkort for at åbne en fuld forhåndsvisning:

- **Kort-miniaturer** – skabelonkort viser en tilpasset skrivebeskyttet canvas-snapshot for både workflows og enkeltnode-skabeloner.
- **Workflow-skabeloner** – en skrivebeskyttet canvas, der matcher forhåndsvisningsstilen fra redigeringshistorikken, inklusive panorerings- og zoomfunktioner.
- **Node-skabeloner** – den gemte node åbnes på samme skrivebeskyttede canvas som en enkeltnode-forhåndsvisning.
- **Node-detaljer** – klik på en vilkårlig node i forhåndsvisningen for at inspicere dens gemte konfiguration i sidepanelet.
- Tags, brugstæller og **ejer** vises for alle skabeloner.

Tryk på **ESC** eller klik udenfor for at lukke forhåndsvisningen.

---

## Håndtering af skabeloner

- **Rediger** – Hvis man er skabelonens ejer, kan man svæve over kortet og klikke på blyantikonet for at opdatere navn, beskrivelse, tags eller synlighed.
- **Slet** – Hvis man er skabelonens ejer, kan man svæve over kortet og slette skabelonen efter bekræftelsesprompten.
- **Ejer-specifikke handlinger** – Redigerings- og sletningskontroller vises kun for skabeloner, man selv har oprettet.

---

## Kommandopalette (CTRL+K)

Skabeloner (både workflow og node) kan søges i **CTRL+K**-kommandopaletten. Vælg en skabelon for at bruge den med det samme – workflow-skabeloner åbnes i editoren, node-skabeloner spørger om en destination.

---

## Skabeloner i Chat

Det er muligt at stille AI spørgsmål om skabelonerne – den kender alle skabeloner i arbejdsområdet.

---

## Synlighed

| Indstilling | Hvem kan se den |
|---|---|
| Everyone | Alle brugere på platformen |
| Specific users | Brugere, der er listet ved navn, og/eller teams, der er valgt – alle teammedlemmer får adgang |

Når der deles med **Specific users**, kan der tilføjes både enkelte brugere (ved navn) og teams. Teammedlemmer ser skabelonen i Skabeloner-fanen og kan bruge den.

---

## Relateret

- [Teams](../reference/teams.md) – Del skabeloner med teams
- [Canvas-funktioner](../reference/canvas-features.md)
- [Workflow-struktur](../reference/workflow-struktur.md)
- [Node-typer](../reference/node-types.md)
- [Chat-fan](./chat-tab.md)
- [Kontekstuel showcase](../reference/contextual-showcase.md) – Kort sidevejledning til dashboard-faner
