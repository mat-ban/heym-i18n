# Kontextuell översikt

Den **kontextuella översikten** är en lättviktig guide på plats i appen som förklarar sidan man för närvarande befinner sig på utan att omedelbart tvinga in användaren i ett fullständigt dokumentationsflöde.

## Vad den gör

- Visar en kort sammanfattning för den aktuella sidan
- Håller det första lagret koncist så att användaren inte överbelastas
- Gör det möjligt att expandera en liten mängd extra detaljer endast vid behov
- Länkar ut till den fullständiga dokumentsidan för djupare läsning

## Var den visas

I v1 är översikten tillgänglig på Heyms autentiserade huvudytor:

- Flikar på Dashboard
- [Utvärdering](../tabs/evals-tab.md)
- [Dokumentation](../getting-started/introduction.md)
- Workflow-editorns Canvas

Publika sidor som inloggning, registrering, chat-portal och HITL-granskning visar inte översikten.

## Åtkomst

### Desktop

- En fast **Sidguide**-trigger visas vid skärmens högra kant
- Översikten öppnas som en låda på höger sida
- Den förblir stängd som standard
- En engångsteaser hjälper till att visa att guiden finns utan att tvinga fram den

### Mobil

- Samma innehåll är tillgängligt via en flytande **Sidguide**-knapp
- Den öppnas i ett bottenark istället för en högerpanel

## Innehållsmodell

Varje översiktspost använder en strukturerad definition istället för en helt anpassad komponent.

- **Titel** – Vad sidan är
- **Sammanfattning** – En kort förklaring
- **Punkter** – Några snabbt skanningsbara ledtrådar
- **Höjdpunkter** – Små kort för nyckelvärde eller användningsmönster
- **Mer detaljer** – Kollapsade avsnitt för extra kontext
- **Åtgärder** – Vanligtvis en eller två länkar, oftast till fullständig dokumentation

Detta håller systemet flexibelt samtidigt som långa, röriga hjälppaneler undviks.

## Kontextmedvetenhet

Översikten ändras med den aktuella ytan.

- Flikar på Dashboard har varje sin egen sammanfattning
- Editorn pekar på [Canvas-funktioner](./canvas-features.md)
- Dokumentsidan använder en generisk dokumentationsöversikt och pekar, när det är möjligt, på den aktuella artikeln som redan är öppen

## Beständighet

Översikten lagrar en liten mängd personligt UI-tillstånd i webbläsarlagring:

- Huruvida panelen eller arket senast var öppet
- Vilka sidkontexter som redan har visat teasern
- Det senast expanderade detaljavsnittet per kontext

## Varför den finns

Målet är att göra Heym enklare att lära sig utan att lägga till mer tung UI-krom.

- Kort, alltid nära vägledning för orientering
- Tydlig väg till djupare dokumentation
- Låg störning för erfarna användare

## Relaterat

- [Fliken Workflows](../tabs/workflows-tab.md) – Huvudyta på Dashboard
- [Fliken Utvärdering](../tabs/evals-tab.md) – Utvärderingsflöden
- [Canvas-funktioner](./canvas-features.md) – Editorbeteende och felsökning
- [Snabbpanel](./quick-drawer.md) – Den andra fasta verktygsytan på höger sida
