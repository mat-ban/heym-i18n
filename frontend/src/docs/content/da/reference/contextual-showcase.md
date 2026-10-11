# Contextual Showcase

**Contextual Showcase** er en letvægtsguide i appen, der forklarer den aktuelle side uden at tvinge brugeren ind i en fuld dokumentationsflow med det samme.

## Funktionalitet

- Viser en kort oversigt over den aktuelle side
- Holder det første lag kortfattet for at undgå overvældning
- Giver mulighed for at udvide en lille mængde ekstra detaljer kun når det er nødvendigt
- Linker til den fulde dokumentationsside for dybere læsning

## Placering

I v1 er showcase'en tilgængelig på Heyms autentificerede hovedflader:

- Dashboard-faner
- [Evalueringer](../tabs/evals-tab.md)
- [Dokumentation](../getting-started/introduction.md)
- Workflow-editor-canvas

Offentlige sider som login, registrering, chatportal og HITL-gennemgang viser ikke showcase'en.

## Adgang

### Desktop

- En fast **Page Guide**-trigger vises på højre side af skærmen
- Showcase'en åbner som en højre side-skuffe
- Den forbliver lukket som standard
- En engangs-teaser hjælper med at afsløre, at guiden eksisterer uden at tvinge den åben

### Mobil

- Det samme indhold er tilgængeligt via en flydende **Page Guide**-knap
- Den åbner i et bundark i stedet for en højre side-skuffe

## Indholdsstruktur

Hver showcase-entry bruger en struktureret definition i stedet for et fuldt tilpasset komponent.

- **Titel** – Hvad siden handler om
- **Oversigt** – En kort forklaring
- **Punktopstilling** – Nogle få scannable cues
- **Højdepunkter** – Små kort til nøgleværdier eller brugsmønstre
- **Flere detaljer** – Sammenfoldede sektioner til ekstra kontekst
- **Handlinger** – Normalt et eller to links, oftest til fuld dokumentation

Dette holder systemet fleksibelt samtidig med at lange, støjende hjælpepaneler undgås.

## Kontekstbevidsthed

Showcase'en ændrer sig med den aktuelle flade.

- Dashboard-faner har hver deres egen oversigt
- Editoren peger på [Canvas-funktioner](./canvas-features.md)
- Dokumentationssiden bruger en generel dokumentationsoversigt og peger, når det er muligt, på den aktuelle artikel, der allerede er åben

## Persistens

Showcase'en gemmer en lille mængde personlig UI-tilstand i browserens lager:

- Om panelet eller arket sidst var åbent
- Hvilke sidekontekster allerede har vist teaseren
- Den sidst udvidede detaljesektion per kontekst

## Formålet

Målet er at gøre Heym lettere at lære uden at tilføje mere tung UI-chrome.

- Kort, altid-nær vejledning til orientering
- Klar vej til dybere dokumentation
- Lav forstyrrelse for erfarne brugere

## Relateret

- [Workflows-fane](../tabs/workflows-tab.md) – Hoveddashboardflade
- [Evalueringer-fane](../tabs/evals-tab.md) – Evaluering af workflows
- [Canvas-funktioner](./canvas-features.md) – Editoradfærd og debugging
- [Quick Drawer](./quick-drawer.md) – Den anden faste højre side-hjælpeflade
