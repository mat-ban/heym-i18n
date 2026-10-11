# Chatten met Heym

Chatten met Heym is een paginabewuste assistent die beschikbaar is vanuit de documentatieheader. Deze opent in een gecentreerd dialoogvenster, laat u een LLM-referentie en -model kiezen, en beantwoordt vragen met de huidige documentatiepagina als eerste context.

## Het dialoogvenster openen

1. Open een pagina onder `/docs`
2. Klik op **Chatten met Heym** in de header
3. Selecteer een [referentie](../tabs/credentials-tab.md) en model
4. Stel een vraag over de pagina of het platform

Op kleinere schermen is de trigger alleen een pictogram; op grotere schermen wordt het volledige label weergegeven.

## Welke context wordt gebruikt

- Het momenteel geopende documentatiepad wordt als contextuele richtlijn in het verzoek ingevoegd
- De backend gebruikt nog steeds het bestaande dashboard-chat-endpoint en de documentatiezoektools
- Uw [Gebruikersregels](./user-settings.md) op accountniveau blijven van toepassing, omdat dezelfde chat-backend opnieuw wordt gebruikt
- Live voorbereidingsstappen worden in de assistent-bubbel gestreamd vóór het definitieve antwoord, vergelijkbaar met de dashboard-chat
- Verduidelijkingsvragen verschijnen als kaarten, hetzelfde als in het tabblad [Chat](../tabs/chat-tab.md). Wanneer een workflowverzoek een referentie nodig heeft, kunt u er een kiezen of deze vanaf de kaart aanmaken. Wanneer er een gegevenstabel nodig is, kunt u een van uw tabellen kiezen of op dezelfde manier een nieuwe aanmaken.

Wanneer u het dialoogvenster opent op een specifiek artikel, toont een kleine badge het actieve documentatiepad, zodat u kunt bevestigen welke pagina prioriteit krijgt.

## Sessiegedrag

- De selectie van referentie en model blijft behouden zolang het dialoogvenster geopend blijft
- De berichtgeschiedenis is alleen voor de sessie en wordt gewist wanneer het dialoogvenster wordt gesloten
- Een klik op de achtergrond, `Escape` en de sluitknop resetten allemaal de sessie
- **Stop** breekt het huidige streaming-antwoord af
- Het dialoogvenster is bewust breed en heeft een vaste grootte; er is geen volledig scherm-schakelaar beschikbaar

## Wanneer te gebruiken

- Stel vervolgvragen tijdens het lezen van een node- of referentiepagina
- Verduidelijk functieverschillen zonder de documentatie te verlaten
- Vind het juiste artikel voordat u de editor opent

Als u workflows direct wilt bouwen of wijzigen, gebruik dan in plaats daarvan de [AI Assistant](./ai-assistant.md) aan de editorzijde.

## Gerelateerd

- [AI Assistant](./ai-assistant.md) – Editor-chat voor het bouwen van workflows
- [Tabblad Referenties](../tabs/credentials-tab.md) – LLM-referenties toevoegen die door het dialoogvenster worden gebruikt
- [Instellingen](./user-settings.md) – Algemene Gebruikersregels die op AI-oppervlakken worden toegepast
- [Snelstart](../getting-started/quick-start.md) – Eerste workflow-walkthrough
