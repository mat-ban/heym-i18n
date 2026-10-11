# Tabblad Workflows

Het tabblad **Workflows** is de standaard dashboardweergave. Het toont uw workflowlijst, mapstructuur en stelt u in staat workflows te maken, te bewerken en te organiseren.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Bekijk de Workflows-demo</a></p>

## Een Chat starten

Boven de workflowlijst bevindt zich een chatvak dat u bij naam begroet en vraagt wat u wilt automatiseren. Voer een prompt in, voeg optioneel één bestand toe en kies de gewenste referentie en het gewenste model. Beide dropdowns zijn doorzoekbaar en beginnen met uw [AI-standaardwaarden](../reference/user-settings.md).

Bij verzending wordt een nieuw gesprek aangemaakt en geopend in het [tabblad Chat](./chat-tab.md), waar het antwoord binnenstroomt. Ondersteunde bijlagen zijn tekstbestanden, afbeeldingen en PDF's, één per bericht, net als bij de chatcomposer.

Als u nog geen LLM-referentie hebt, toont het vak een link naar het [tabblad Referenties](./credentials-tab.md) en blijft verzenden uitgeschakeld.

Klik op de **x** om het vak te verbergen. Een knop **Vraag AI** verschijnt dan naast de kop Workflows en brengt het terug. De keuze wordt onthouden in uw browser.

## Workflowlijst

De lijst is een weergave met twee panelen: workflows en mappen aan de linkerkant, een voorbeeld van de geselecteerde workflow aan de rechterkant.

- Elke rij toont het workflowpictogram, de naam, de beschrijving, wanneer deze voor het laatst is bijgewerkt en een [statuslabel](#workflow-status)
- Workflows kunnen zich in de hoofdmap of in mappen bevinden, en vastgemaakte workflows verschijnen in hun eigen groep **Vastgemaakt** bovenaan
- **Klik** op een rij om deze te selecteren en het voorbeeld aan de rechterkant te laden
- **Dubbelklik** op een rij, of druk op **Enter** terwijl deze is gefocust, om deze te openen in de [editor](../getting-started/quick-start.md)
- Gebruik **Ctrl+klik** (of **Cmd+klik**) om in een nieuw tabblad te openen
- Elke rij bevat aan de rechterkant de acties voor bewerken, kopiëren, vastmaken en verwijderen. Op telefoons zijn deze verborgen zodat de naam de volledige breedte behoudt; **houd een rij daar lang ingedrukt** om het actiepaneel te openen
- Maak veelgebruikte workflows vast in de [Quick Drawer](../reference/quick-drawer.md), zodat u ze snel kunt uitvoeren vanaf het tabblad Workflows en andere interne pagina's

## Workflowvoorbeeld

Door een workflow te selecteren wordt het voorbeeldpaneel naast de lijst gevuld. Op schermen smaller dan 1280px opent hetzelfde paneel als een paneel vanaf de onderkant van het scherm.

Het paneel toont:

- De naam van de workflow, wie deze heeft gemaakt en wanneer, en wanneer deze voor het laatst is bewerkt
- **Workflow openen** – opent de workflow in de editor
- **Nu uitvoeren** – opent de workflow in de [Quick Drawer](../reference/quick-drawer.md), waar u de invoer invult en de uitvoering start zonder de lijst te verlaten
- **Beschrijving** – de beschrijving van de workflow
- **Triggerconfiguratie** – het schema voor een cron-workflow, of de luisterende trigger voor een event-workflow. Workflows die via HTTP worden aangeroepen tonen een knop **cURL kopiëren** in plaats van het ruwe endpoint en de auth-tekst: deze kopieert een volledig verzoek met de juiste URL, headers, auth-placeholder en een body opgebouwd uit de invoervelden van de workflow. Wanneer de workflow een [portaal](../reference/portal.md) publiceert, verschijnt hier ook de openbare chatlink
- **Details laatste uitvoering** – de uitkomst en duur van de meest recente uitvoering, of een melding dat de workflow nooit is uitgevoerd
- **Workflowstappen en sub-agenten** – de knooppunten in uitvoeringsvolgorde, elk met het model, de bewerking of het schema en een punt dat aangeeft of het actief is. Door een stap te selecteren wordt dat knooppunt in de editor geopend met het eigenschappenpaneel al open

Het paneel blijft naast de lijst vastgezet terwijl u scrolt, zodat het leesbaar blijft in een lange workflowlijst.

## Instancebeheer

Accounts die in `HEYM_ADMIN_EMAILS` zijn vermeld, kunnen elke workflow op de instance weergeven, openen, bewerken, de uitvoeringsgeschiedenis inspecteren en verwijderen zonder overdracht van eigendom of deling. De instelling is een kommagescheiden lijst van e-mailadressen, hoofdletterongevoelig vergeleken. Een lege lijst verleent niemand deze toegang. Herstart de backend na het wijzigen ervan.

Beheerders zien het e-mailadres van de eigenaar in de workflowlijst en kunnen op dat adres zoeken. Selecteer een workflow om **Instancebeheer** in de preview te openen:

1. **Triggers pauzeren** wordt alleen getoond voor workflows die een Cron-knooppunt bevatten. Het schakelt de Cron en andere automatische trigger-knooppunten van de workflow uit via een normale versioned save. Bestaande uitvoeringen kunnen voltooien. Handmatige, API-, portal- en sub-workflow-aanroepen blijven beschikbaar; deze actie is geen workflowbrede uitvoeringsvergrendeling.
2. De knop verandert in **Triggers hervatten** terwijl deze gepauzeerd is, ook na het herladen van de pagina. Hervatten schakelt de triggers die door de beheerder zijn gepauzeerd weer in en laat triggers die al uitgeschakeld waren ongewijzigd. Voor oudere gepauzeerde workflows zonder opgeslagen beheerderspauzestatus schakelt Hervatten hun automatische triggers in.
3. Gebruik de actie **Workflow verwijderen** in de workflowrij zodra uitvoeringen zijn afgerond. Verwijdering geeft een conflict zolang er nog werk in uitvoering, in de wachtrij of in afwachting van beoordeling is. Geplande verwijdering past dezelfde controle toe.

Pauzeer triggers en laat bestaande uitvoeringen voltooien voordat u verwijdert. Een trigger die al is verzonden op het moment van pauzeren kan nog steeds voltooien. Gebruik verwijdering wanneer de workflow niet langer aanroepbaar mag zijn.

Webhook-secrets en authenticatie-instellingen die alleen voor de eigenaar zijn, behouden hun bestaande beschermingen. Beheer draagt geen eigendom over en deelt de referentiegegevens van de eigenaar niet. Beheerdersacties voor pauzeren, hervatten, verwijderen en plannen verschijnen in het [audit trail](../reference/audit.md) met de handelende beheerder en de workflow-eigenaar.

## Workflowstatus

Elke rij heeft een statuschip die is afgeleid van de trigger-knooppunten van de workflow, de live uitvoeringsstatus,
en — voor workflows zonder trigger-knooppunt — hoe de meest recente uitvoering is gestart:

| Status | Betekenis |
| --- | --- |
| **Running** | De workflow heeft op dit moment een uitvoering in uitvoering |
| **Scheduled** | Deze heeft een actieve [cron](../nodes/cron-node.md)-trigger |
| **Listening** | Deze heeft een actieve event-trigger, zoals een Slack-, Telegram-, IMAP- of WebSocket-trigger |
| **Paused** | Deze heeft trigger-knooppunten, maar elk ervan is gedeactiveerd |
| **API** | Deze heeft geen trigger-knooppunten en is het laatst uitgevoerd door een HTTP-aanroep naar het execute-endpoint |
| **SubWorker** | Deze heeft geen trigger-knooppunten en is het laatst uitgevoerd als sub-workflow door een bovenliggende workflow |
| **Portal** | Deze heeft geen trigger-knooppunten en is het laatst uitgevoerd vanuit de [portal](../reference/portal.md) |
| **WEB** | Deze heeft geen trigger-knooppunten en het enige terminale knooppunt is een [HTML output mapper](../nodes/html-output-mapper-node.md), zodat aanroepen een gerenderde webpagina retourneert |
| **Manual** | Deze heeft geen trigger-knooppunten en is nooit uitgevoerd, of de laatste uitvoering kwam ergens anders vandaan |
| **Remove Scheduled** | Deze is [gepland voor verwijdering](../reference/workflow-organization.md) |

De chips API, SubWorker en Portal lezen de enkele meest recente vermelding in de
[uitvoeringsgeschiedenis](./logs-tab.md) van de workflow, dus een workflow die op twee manieren wordt aangeroepen toont de laatst binnengekomene. **WEB** wordt in plaats daarvan bepaald op basis van de grafiek, dus heeft voorrang op die drie: een pagina-serverende workflow toont WEB zelfs nadat deze via HTTP is aangeroepen. Trigger-knooppunten winnen altijd van alle andere: een cron-workflow die ook via HTTP wordt aangeroepen blijft **Scheduled**.

Gebruik de vervolgkeuzelijst **Status** naast het zoekveld om slechts één status te tonen. De vervolgkeuzelijst vermeldt hoeveel workflows momenteel overeenkomen met elk ervan. Een statusfilter reikt ook binnen mappen: mappen met een overeenkomst worden automatisch uitgeklapt en mappen zonder overeenkomst worden verborgen totdat u het filter wist.

## Actieve workflows

Op desktop toont de cirkelvormige badge in de bovenste werkbalk hoeveel workflows momenteel
worden uitgevoerd en deze wordt automatisch elke 10 seconden vernieuwd. Klik op een badge met een waarde anders dan nul om de lijst met actieve workflows te openen, die maximaal vier rijen toont voordat er wordt gescrold. Selecteer een workflownaam om de editor aan de live-weergave van die uitvoering te koppelen. De nul-badge is informatief en kan niet worden geopend, en de badge is verborgen op mobiele schermen.

## Zoeken

Gebruik het zoekveld voor workflows naast **Status**, of druk op **Ctrl+F** (of **Cmd+F**), om workflows op titel of beschrijving te filteren. Overeenkomende workflows in mappen worden getoond met hun mapvertakkingen uitgeklapt. Druk op **Escape** om het zoeken te wissen.

## Mappen

- Organiseer workflows in [mappen en submappen](../reference/workflow-organization.md)
- Maak mappen aan met de knop **Nieuwe map**, geef elke map een naam en een optionele beschrijving die onder de naam in de lijst wordt weergegeven
- Elke maprij toont hoeveel workflows deze bevat, inclusief submappen, naast de acties voor nieuwe submap, hernoemen, pictogram wijzigen, downloaden als ZIP en verwijderen. Op telefoons toont de rij in plaats daarvan één menuknop
- Sleep een workflow over een map of submap om een voorbeeld van de bestemming ter grootte van een kaart te zien. Het
  gemarkeerde voorbeeld toont het volledige mappad voordat u loslaat, en bij het aanwijzen van een samengevouwen
  map wordt deze kort uitgeklapt zodat u geneste mappen kunt bereiken.
- Sleep workflows tussen mappen of naar de hoofdmap. De gesleepte kaart blijft zichtbaar als een spookweergave,
  en de actieve bestemming blijft gemarkeerd terwijl u scrolt.
- Het terugplaatsen van een workflow in de huidige map is uitgeschakeld en gemarkeerd als **Al in map**.
- Hernoem een map of wijzig de beschrijving via de hernoemactie of het rechtermuisknopcontextmenu

## Workflows aanmaken

1. Klik op **Nieuwe workflow**
2. Voer een naam en optionele beschrijving in
3. De workflow wordt geopend in de editor

## Importeren

Sleep een JSON-workflowbestand naar het workflowgebied om een nieuwe workflow aan te maken. De geïmporteerde knooppunten en verbindingen worden gebruikt om de workflow aan te maken; de naam komt uit het veld `name` in de JSON of de bestandsnaam. Zie [Downloaden & importeren](../reference/download-import.md) voor het JSON-formaat en de importopties.

## Delen

Open een workflow in de editor en klik op **Delen** om gebruikers per e-mail uit te nodigen of te delen met een [team](./teams-tab.md). Kies **Lezen** (bekijken en uitvoeren) of **Schrijven** (ook bewerken) voor elke gebruiker of elk team, en wijzig dit later via de vervolgkeuzelijst naast de vermelding. Referenties en sub-workflows worden niet automatisch gedeeld; deel deze afzonderlijk met dezelfde gebruikers of teams. Zie [Workfloworganisatie](../reference/workflow-organization.md#sharing-workflows) en [Referenties delen](../reference/credentials-sharing.md).

## Bewerken en verwijderen

- **Bewerken** – Wijzig de naam en beschrijving van de workflow via de bewerkactie in de rij
- **Verwijderen** – Workflows worden [gepland voor verwijdering](../reference/workflow-organization.md); ze verplaatsen naar een prullenbakgebied voordat ze permanent worden verwijderd

## Gelijktijdige bewerkingen

Bij opslaan wordt de revisie meegestuurd waarop uw bewerkingen zijn gebaseerd, en de server weigert de schrijfactie als de workflow in de tussentijd is gewijzigd — bijvoorbeeld omdat een teamgenoot deze heeft opgeslagen, of omdat u dezelfde workflow in een tweede tabblad hebt geopend. Heym toont dan een dialoogvenster **Verouderde workflow gedetecteerd** met twee keuzes:

- **Annuleren** – Behoudt uw niet-opgeslagen wijzigingen in de editor zodat u in een ander tabblad opnieuw kunt laden en ze kunt samenvoegen
- **Overschrijven** – Slaat toch op en vervangt de versie van de andere persoon

Het **uitvoeren** van een workflow slaat deze eerst op, dus het doorloopt dezelfde controle. Als de workflow ondertussen is gewijzigd, pauzeert de uitvoering bij het dialoogvenster in plaats van stilzwijgend te overschrijven: **Overschrijven en uitvoeren** slaat uw versie op en start de uitvoering, **Uitvoering annuleren** laat beide varen en laat uw bewerkingen ongewijzigd.

De controle maakt deel uit van het opslaanverzoek zelf, dus het kost geen extra round trip en er is geen venster waarin een opslagactie deze kan omzeilen. Uw eigen wijzigingen elders in de app — een hernoeming, een instellingswijziging, een schakelaar in het eigenschappenpaneel — gelden nooit als conflict.

## Opdrachtenpalet

Druk op **Ctrl+K** (of **Cmd+K**) om het opdrachtenpalet te openen. U kunt:
- Workflows op naam zoeken
- Naar elk [dashboardtabblad](./credentials-tab.md) springen
- Recente workflows openen

## Gerelateerd

- [Snelstart](../getting-started/quick-start.md) – Bouw uw eerste workflow
- [Workfloworganisatie](../reference/workflow-organization.md) – Mappen, submappen en geplande verwijdering
- [Workflowstructuur](../reference/workflow-structure.md) – JSON-formaat voor workflows
- [Downloaden & importeren](../reference/download-import.md) – Workflows exporteren en importeren als JSON
- [Portaal](../reference/portal.md) – Workflows beschikbaar stellen als openbare chat-UI's
- [Bord](./board-tab.md) – Workflows uitvoeren vanaf kanban-kaarten via kolomketens
- [Kernconcepten](../getting-started/core-concepts.md) – Workflows, knooppunten en uitvoering
- [Uitvoeringsgeschiedenis](../reference/execution-history.md) – Eerdere uitvoeringen bekijken en naar Canvas brengen
- [Snelle lade](../reference/quick-drawer.md) – Workflows vastmaken en uitvoeren vanaf dashboard, documentatie en andere niet-editorpagina's
- [Contextuele showcase](../reference/contextual-showcase.md) – Korte paginagids voor dashboardoppervlakken
