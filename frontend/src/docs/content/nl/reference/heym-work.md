# Heym Work

**Heym Work** is een tweede interface voor zakelijke teams, gebouwd bovenop Heym. Gebruikers beschrijven een taak in hun eigen woorden, beantwoorden een paar vragen en ontvangen een workflow die door Heym is gebouwd en getest. Ze werken vanuit speciaal voor hen gebouwde pagina's, handelen beoordelingen af en zien elke uitvoering met de naam van de uitvoerder. Heym voert elke taak op de achtergrond uit.

Heym Work draait als een eigen container naast Heym, met een aparte licentie van het Heym-team. Lees meer en vraag een proefperiode aan op [heym.run/enterprise](https://heym.run/enterprise). Bekijk de [Heym Work-film](https://youtu.be/5Z2gGo6bcpU) voor een rondleiding van twee minuten.

## Wat zakelijke teams krijgen

| Gebied | Functionaliteit |
|--------|-----------------|
| **Chat** | Beschrijf een taak via tekst of spraak. Heym vraagt wat nodig is, bouwt de workflow, test deze en markeert deze als Geverifieerd. |
| **Flows** | Editors bouwen een flow op basis van keuzes in plaats van een canvas: wat deze start, een optioneel AI-concept en acties in Slack, Google Sheets en e-mail. Antwoorden vanuit Slack vervolgen de run, en goedkeuringen wachten ook in Activiteit. Zie [Flows](#flows). |
| **Pagina's** | Vastgezette pagina's met widgets: getallen, grafieken, tabellen met statuschips, bestandsuploads en goedkeuringen. Een tabelrij kan een eigen detailpagina openen. |
| **Goedkeuringen** | Beoordelingen uit [Human-in-the-Loop](./human-in-the-loop.md)-stappen wachten in Activiteit en op pagina's, met Goedkeuren, Wijzigingen aanvragen en Afwijzen. |
| **Activiteit** | Elke uitvoering, inclusief de persoon die deze heeft gestart en het uitvoerende exemplaar. |
| **Rollen** | Eigenaar, Editor en Kijker. Gebruikers melden zich aan met de [Single Sign-On](./sso.md) die Heym al gebruikt. |
| **Branche-edities** | Edities voor juridische zaken, onderwijs, financiën, logistiek, energie en e-commerce openen met pagina's, voorbeeldgegevens en workflows voor die sector. |

## Flows

**Flows** bevindt zich in het menu van Heym Work voor Editors en Eigenaren. Een flow wordt samengesteld uit keuzes in plaats van nodes, en Heym Work slaat deze via de Heym API op als een normale Heym-workflow, op naam van de persoon die deze heeft gemaakt. Heym's toegangsregels, bewerkingsgeschiedenis en triggersynchronisatie zijn van toepassing zoals in de editor, en elke run verschijnt in Activiteit zoals elke andere.

| Onderdeel | Keuzes |
|---|---|
| **Wat het start** | Op aanvraag, volgens een schema, bij een Slack-bericht, wanneer een Google Sheets-tabblad verandert (rijen toegevoegd, gewijzigd of verwijderd) of wanneer een e-mail een inbox bereikt. Sheet- en e-mailtriggers controleren elke 1, 5, 15 of 60 minuten. |
| **AI-concept** (optioneel) | Een model en instructies zetten wat de flow startte om in tekst voor de stappen erna. Een flow die niet start vanuit een sheet of e-mail kan eerst recente Slack-berichten uit een kanaal of thread lezen. |
| **Wat er daarna gebeurt** | Acties op volgorde, in elk van de drie tools, ongeacht wat de flow heeft gestart. **Slack:** kanaalbericht, direct bericht, formulier, bericht met knoppen, goedkeuring, threadantwoord, berichtupdate en eindresultaat. **Google Sheets:** rij toevoegen of gewijzigde rij bijwerken. **E-mail:** e-mail verzenden. |

- **Antwoorden vervolgen de run.** Een goedkeuring, knoppen of een formulier pauzeren de run totdat iemand in Slack antwoordt. Een goedkeuring wacht ook in Activiteit, en een beslissing op een van beide plaatsen verwijdert de knoppen uit het Slack-bericht. Latere Slack-stappen blijven in de thread van het eerste bericht.
- **Eén Verbindingskaart.** Elke flow toont de Slack-werkruimte, het Google Sheets-account en de inboxen waaruit deze leest en verzendt. Het zijn Heym-inloggegevens: **Slack Bot** (een bot-token, `xoxb-…`), **Google Sheets**, **IMAP** en **SMTP**; een ontbrekende kan worden toegevoegd vanuit de flow zelf.
- **Eén Slack-app voor elke flow.** Stel in de Slack-app de Interactivity Request URL in op `https://<uw Heym>/api/slack/interactions/<inloggegevens-id>` en de Event Subscriptions Request URL op `https://<uw Heym>/api/slack/events/<inloggegevens-id>`. Heym Work toont beide voor de gekozen verbinding. Elke flow op die inloggegevens deelt ze.
- **Slack-triggers kiezen waar ze naar luisteren:** berichten in kanalen en DM's, directe berichten aan de bot, vermeldingen van de bot of berichten in één enkel kanaal. Eigen berichten van de bot starten nooit een flow.
- **Vereisten.** Flows vereisen Heym 0.0.131 of nieuwer.

De stappen die een flow bouwt, zijn dezelfde nodes die u op het canvas kunt gebruiken: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) en [Cron](../nodes/cron-node.md).

## Heym Work verbinden

Bekijk de [installatievideo](https://youtu.be/zXGfg1HPSLk) voor de volledige configuratie, vanaf de eerste opdracht tot aan het startscherm.

De verbinding wordt ingesteld in **Instellingen → Heym Work**. Dit tabblad is alleen zichtbaar voor instantiebeheerders die vermeld staan in `HEYM_ADMIN_EMAILS`.

| Veld | Functionaliteit |
|------|-----------------|
| **Heym Work-adres** | De locatie waar Heym Work draait, bijvoorbeeld `https://work.example.com`. Na aanmelding keert men hier terug. Klik op **Opslaan**. |
| **Integratiesleutel** | **Sleutel genereren** maakt de sleutel aan die Heym Work gebruikt voor elk verzoek aan Heym. Deze wordt eenmalig getoond met een kopieerknop. Heym bewaart alleen de hash ervan. |
| **Heym Work inschakelen** | Schakelt de verbinding in. Hiervoor zijn eerst het adres en een sleutel nodig. |
| **Sector- en teamedities** | Edities voor juridische zaken, onderwijs, financiën, logistiek, energie en e-commerce, plus edities voor IT, verkoop, marketing en HR voor bedrijfsteams, openen met pagina's, voorbeeldgegevens en workflows voor dat werk. |

Open vervolgens het Heym Work-adres en voltooi de installatie:

1. **Licentie**: voer de licentiesleutel van het Heym-team in.
2. **Heym**: voer het Heym-adres en de integratiesleutel in.
3. **Eigenaar**: meld u aan met een account dat is ingesteld als Heym Work-eigenaar.

Het startscherm wordt geopend, klaar voor het team.

### De sleutel roteren

**Sleutel roteren** vervangt de integratiesleutel. Heym Work stopt met functioneren totdat de nieuwe sleutel daar is ingevoerd, en alle gebruikers die zijn aangemeld bij Heym Work worden afgemeld. Gebruik dit wanneer de sleutel mogelijk is gelekt of wanneer iemand vertrekt die deze heeft ingezien.

### De verbinding uitschakelen

Schakel **Heym Work inschakelen** uit om de verbinding te verbreken. Heym Work vraagt dan opnieuw om de Heym-sleutel. Heym blijft alle workflows, schema's en webhooks in beide gevallen gewoon uitvoeren.

## Beveiligingsmodel

- **Elke wijziging verloopt via Heym.** Heym Work leest de getoonde gegevens uit de database van Heym en stuurt elke actie via het met een sleutel beveiligde kanaal naar Heym, waar Heym de eigen toegangsregels toepast. Heym Work bewaart eigen gegevens in een afzonderlijk `heym_work`-schema.
- **De sleutel wordt in rust gehasht.** Heym vergelijkt de hash van de aangeboden sleutel en slaat de sleutel zelf nooit op.
- **Aanmelding blijft bij Heym.** Gebruikers melden zich aan via Heym, met de eigen identiteitsprovider wanneer [SSO](./sso.md) is ingeschakeld.
- **Wijzigingen worden gecontroleerd.** Het opslaan van de verbinding en het roteren van de sleutel schrijven `work_integration.update`- en `work_integration.key_rotate`-regels naar het [auditlogboek](./audit.md).

## Licenties

Heym Work vereist een eigen licentiesleutel, verstrekt door het Heym-team. Elke dag stuurt Heym Work naar heym.run het licentie-ID, een installatie-ID, het aantal actieve gebruikers in de afgelopen 30 dagen, het totale aantal leden, het aantal uitvoeringen in de afgelopen 24 uur en de Heym- en Heym Work-versies. Workflow-inhoud, invoer, uitvoer en inloggegevens blijven altijd op uw eigen servers.

Als de dagelijkse synchronisatie 30 dagen achtereen mislukt, begint een respijtperiode van 14 dagen. Daarna vraagt de Heym Work-interface een Eigenaar om een sleutel. Een proefperiode loopt door tot de laatste dag en wordt hervat zodra het Heym-team deze verlengt, met maximaal één proefperiode per installatie. Heym zelf blijft gedurende de hele periode operationeel. Netwerken zonder internettoegang gebruiken een offline licentie via enterprise@heym.run.

## Video's

Alle Heym Work-video's zijn te vinden in de [Heym Work-afspeellijst](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Gerelateerd

- [Enterprise](./enterprise.md): Commerciële licenties en ondersteuning
- [Single Sign-On](./sso.md): De aanmelding die Heym Work gebruikt
- [Human-in-the-Loop](./human-in-the-loop.md): De beoordelingen die Heym Work toont
- [Auditlogboek](./audit.md): De gebeurtenissen die verbindingswijzigingen registreren
- [Instellingen](./user-settings.md): De locatie van het tabblad Heym Work
