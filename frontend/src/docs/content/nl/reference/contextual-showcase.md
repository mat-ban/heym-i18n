# Contextuele Showcase

De **Contextuele Showcase** is een lichtgewicht gids binnen de app die uitlegt op welke pagina u zich momenteel bevindt, zonder u direct in een volledige documentatiestroom te duwen.

## Wat het doet

- Toont een korte samenvatting voor de huidige pagina
- Houdt de eerste laag beknopt zodat u niet wordt overladen
- Laat u een kleine hoeveelheid extra detail uitklappen, alleen wanneer nodig
- Linkt door naar de volledige documentatiepagina voor verdere verdieping

## Waar het verschijnt

In v1 is de showcase beschikbaar op de geauthenticeerde hoofdschermen van Heym:

- Dashboard-tabs
- [Evaluatie](../tabs/evals-tab.md)
- [Documentatie](../getting-started/introduction.md)
- Het canvas van de workflow-editor

Openbare pagina's zoals login, registratie, chatportaal en HITL-review tonen de showcase niet.

## Toegang

### Desktop

- Een vaste **Page Guide**-trigger verschijnt aan de rechterrand van het scherm
- De showcase opent als een drawer aan de rechterzijde
- Deze blijft standaard gesloten
- Een eenmalige teaser helpt onthullen dat de gids bestaat, zonder deze geforceerd te openen

### Mobiel

- Dezelfde inhoud is beschikbaar via een zwevende **Page Guide**-knop
- Deze opent in een bottom sheet in plaats van een rechterrail

## Contentmodel

Elke showcase-entry gebruikt een gestructureerde definitie in plaats van een volledig aangepaste component.

- **Titel** – Wat deze pagina is
- **Samenvatting** – Eén korte uitleg
- **Bullets** – Enkele scanbare aanwijzingen
- **Highlights** – Kleine kaarten voor kernwaarde of gebruikspatronen
- **Meer detail** – Ingeklapte secties voor extra context
- **Acties** – Meestal één of twee links, veelal naar de volledige documentatie

Dit houdt het systeem flexibel en vermijdt lange, rumoerige hulppanelen.

## Contextbewustzijn

De showcase verandert mee met het huidige scherm.

- Dashboard-tabs hebben elk hun eigen samenvatting
- De editor verwijst naar [Canvas-functies](./canvas-features.md)
- De documentatiepagina gebruikt een algemeen documentatieoverzicht en verwijst, indien mogelijk, naar het artikel dat u al hebt geopend

## Persistentie

De showcase slaat een kleine hoeveelheid persoonlijke UI-status op in de browseropslag:

- Of het paneel of de sheet laatst geopend was
- Welke paginacontexten de teaser al hebben getoond
- De laatst uitgeklapte detailsectie per context

## Waarom het bestaat

Het doel is om Heym gemakkelijker te leren zonder meer zware UI-chrome toe te voegen.

- Korte, altijd nabije begeleiding voor oriëntatie
- Duidelijk pad naar diepere documentatie
- Weinig onderbreking voor ervaren gebruikers

## Gerelateerd

- [Workflows-tab](../tabs/workflows-tab.md) – Hoofdoppervlak van het dashboard
- [Evaluatie-tab](../tabs/evals-tab.md) – Evaluatie-workflows
- [Canvas-functies](./canvas-features.md) – Editorgedrag en debugging
- [Quick Drawer](./quick-drawer.md) – Het andere vaste hulpoppervlak aan de rechterzijde
