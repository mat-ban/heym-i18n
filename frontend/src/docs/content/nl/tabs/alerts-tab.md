# Tabblad Waarschuwingen

Op het tabblad **Waarschuwingen** definieert u drempelvoorwaarden over een tijdvenster en ontvangt u een melding wanneer deze worden overschreden. Heym registreert al uitvoeringsresultaten, uitvoeringsduur en LLM-kosten, maar geeft dit nooit uit eigen beweging door. Een waarschuwing is hoe u daarom vraagt.

Elke waarschuwing wordt geëvalueerd over een **tijdvenster** dat u kiest, nooit op basis van één enkele gebeurtenis. Eén mislukte uitvoering is ruis. Twaalf mislukte uitvoeringen in tien minuten is een incident.

## Typen waarschuwingen

| Type | De vraag die het beantwoordt | Waar het getal vandaan komt |
|---|---|---|
| **Foutdrempel** | Is dit vaker dan N keer mislukt in het venster? | Rijen in de [uitvoeringsgeschiedenis](../reference/execution-history.md) met een foutstatus |
| **Workflow-duur** | Werden uitvoeringen langzamer dan verwacht in het venster? | Uitvoeringstijd, geaggregeerd als maximum, gemiddelde of 95e percentiel |
| **Token-/USD-kosten** | Werd een budget overschreden in het venster? | [LLM-traces](./traces-tab.md) plus de LLM-kostentabel |
| **Uitvoeringsaantal** | Werd dit veel vaker uitgevoerd dan zou moeten? | Aantal rijen in de uitvoeringsgeschiedenis |

### Foutdrempel

Telt mislukte uitvoeringen over het venster en activeert wanneer het aantal uw drempel bereikt. Omdat het over een venster telt in plaats van elke fout afzonderlijk te onderscheppen, zal een enkele tijdelijke fout u niet alarmeren.

### Workflow-duur

Meet de uitvoeringsduur binnen het venster. Kies **max** (de langzaamste uitvoering), **gemiddelde** of **p95**. De p95-waarde gebruikt dezelfde percentielberekening als het [tabblad Analytics](./analytics-tab.md), zodat de waarschuwing en de latency-grafiek het nooit oneens zijn over hetzelfde venster.

**Minimum aantal uitvoeringen in het venster** houdt dit betrouwbaar. De langzaamste uitvoering in een bijna leeg venster is slechts die ene uitvoering, dus een minimum van bijvoorbeeld 3 voorkomt dat de waarschuwing op ruis afgaat.

### Token-/USD-kosten

Somt de LLM-kosten over het venster op, hetzij als totaal aantal tokens, hetzij in Amerikaanse dollars. Dollarbedragen worden bepaald via dezelfde prijstabel die het [tabblad Traces](./traces-tab.md) en de [LLM-kostentabel](./datatable-tab.md#llm-cost-table-system-table) gebruiken, zodat een kostengebaseerde waarschuwing en de kostenpagina altijd overeenkomen.

Wanneer het bereik al uw workflows omvat, worden ook LLM-aanroepen buiten een workflow meegerekend, zoals het [tabblad Chat](./chat-tab.md) en de [AI-assistent](../reference/ai-assistant.md). Gebruik van coding-agenten (Codex, OpenCode) wordt niet meegerekend.

Modellen zonder prijsrij worden in de context van de waarschuwing gerapporteerd als niet-geprijsd in plaats van stilzwijgend als nul geteld.

### Uitvoeringsaantal

Telt uitvoeringen van elke status in het venster. Dit is degene die een verkeerd geconfigureerde trigger opvangt: een workflow die normaal 20 keer per uur wordt uitgevoerd en plotseling 2.000 keer wordt uitgevoerd. Het activeringsrecord bevat een uitsplitsing per trigger-bron, omdat dat meestal het antwoord is op "waarom is dit gebeurd".

## Bereik

Een waarschuwing bewaakt hetzij **één workflow**, hetzij **al uw workflows**.

"Al uw workflows" betekent elke workflow waartoe de eigenaar van de waarschuwing toegang heeft. Het betekent bewust niet elke workflow op de Heym-instantie: waarschuwingen kunnen worden gedeeld, en het delen van een waarschuwing mag iemand geen geaggregeerde cijfers geven voor workflows die deze niet kan openen.

## De wizard

Het aanmaken van een waarschuwing doorloopt vijf stappen.

1. **Type** — kies een van de vier hierboven.
2. **Bereik** — één workflow, of allemaal.
3. **Voorwaarde** — het tijdvenster, plus de drempelvelden voor dat type.
4. **Respons** — wat er wordt uitgevoerd bij activering, en hoe vaak u opnieuw wordt geïnformeerd.
5. **Beoordeling** — geef het een naam en bekijk de backtest.

### De backtest

De stap Beoordeling beantwoordt de vraag die er vóór het opslaan werkelijk toe doet: *hoe vaak zou dit de afgelopen 24 uur zijn afgegaan?*

Het rapporteert het aantal activeringen en de hoogst waargenomen waarde ten opzichte van uw drempel. Als er staat dat de voorwaarde 400 keer zou zijn afgegaan, past u de drempel aan vóór het opslaan in plaats van nadat u bent gealarmeerd. U kunt de terugkijkperiode uitbreiden naar 3 of 7 dagen.

## AI-concept

Bovenaan de eerste stap bevindt zich een vak waarin u in gewone taal beschrijft wat u wilt:

> Waarschuw mij als de factuursynchronisatie meer dan 5 keer mislukt in 10 minuten

Heym zet dat om in een waarschuwingdefinitie, vult elke stap die het kan in en springt vooruit met de door AI ingevulde velden gemarkeerd, zodat u bevestigt in plaats van opnieuw typt. Een volledig verzoek brengt u naar Beoordeling.

**Een gedeeltelijk verzoek brengt u nog steeds verder.** Zeg alleen "waarschuw mij als het 5 keer mislukt" en u krijgt een waarschuwing voor foutdrempel met het aantal ingevuld, standaardwaarden voor de rest, en de wizard opent op de eerste stap die nog uw aandacht nodig heeft: in dat geval Bereik, omdat er geen workflow is genoemd. Een opmerking bovenaan vermeldt wat er nog te beslissen valt. Het blokkeert nooit Volgende of Aanmaken.

Hetzelfde geldt wanneer het model een workflow noemt waartoe u geen toegang heeft, of een voorwaarde retourneert met ontbrekende velden. De onderdelen die zinvol zijn, worden behouden, de rest valt terug op de standaardwaarden voor dat waarschuwingstype, en u past het van daaruit aan. Niets hiervan omzeilt validatie: zowel de eigen regels van de wizard als de API controleren de waarschuwing opnieuw bij het opslaan.

## Herhaalgedrag

Zodra een waarschuwing afgaat, komt deze in een geactiveerde status. Wat er daarna gebeurt, is uw keuze in stap 4.

- **Eenmalig melden, totdat deze herstelt** (de standaard) — gaat eenmaal af en blijft daarna stil zolang de voorwaarde geldt. Wanneer de metriek weer onder de drempelwaarde zakt, keert de waarschuwing terug naar OK en kan deze opnieuw afgaan. Herstel is een statuswijziging, geen gebeurtenis: het maakt geen afgaat-record aan en voert de notify-workflow niet uit.
- **Blijven melden met een interval** — gaat opnieuw af elke N minuten zolang de voorwaarde geldt.

De standaard bestaat omdat een kapotte workflow die elke 60 seconden wordt gecontroleerd anders 60 keer per uur zou afgaan, en dat is hoe waarschuwingen worden gedempt.

## Een workflow uitvoeren bij afgaan

Stap 4 biedt drie antwoorden op "wat moet er gebeuren wanneer dit afgaat":

- **Een nieuwe workflow aanmaken en toewijzen** (de standaard) — bij het opslaan van de waarschuwing wordt ook een workflow aangemaakt met de naam *"&lt;naam van waarschuwing&gt; notification"* en daaraan gekoppeld. Deze komt met een input-knooppunt waarvan de velden exact de onderstaande payload zijn, zodat `$alert.body.observed_value` en de rest onmiddellijk worden omgezet en u alleen nog het knooppunt hoeft te koppelen dat het bericht verzendt. **Ga naar workflow** op de waarschuwingskaart opent deze. Dit is de standaard omdat een waarschuwing die in het niets afgaat gemakkelijk wordt gemist.
- **Een bestaande workflow kiezen** — voer iets uit dat u al hebt gebouwd.
- **Niets doen** — het afgaan wordt nog steeds vastgelegd in het tabblad, er wordt alleen niets uitgevoerd.

De waarschuwingspayload komt binnen als de input-body van die workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Welke workflow het getal heeft geproduceerd

`workflows` is de enige plaats waar een workflow voorkomt. Het vermeldt elke workflow die aan de meting heeft bijgedragen, elk met een eigen `value` — het foutenaantal, het aantal uitvoeringen, de traagste uitvoering in milliseconden of de besteding van die workflow, afhankelijk van het waarschuwingstype. De lijst is gesorteerd op `value`, hoogste eerst, dus `workflows[0]` is de grootste boosdoener.

Het is **altijd een array**: één element onder scope van één workflow, vele onder "al mijn workflows", en leeg in plaats van null wanneer niets toerekenbaar is. Een notify-workflow kan erover itereren zonder een vormcontrole.

Er is bewust geen enkelvoudige `workflow_id`. Die beschreef de scope van de waarschuwing in plaats van de metriek, dus was deze `null` onder systeemscope, precies het geval waarin "welke workflow?" het meest van belang is. `observed_value` blijft het aggregaat waarmee de drempelwaarde is vergeleken; de per-workflow `value`-velden verklaren waar het vandaan kwam.

Zo bereiken waarschuwingen Slack, e-mail, Telegram of waar dan ook: met de [knooppunten](../reference/node-types.md) die u al hebt, in plaats van een apart meldingssysteem.

Een waarschuwing kan niet de workflow melden die deze in de gaten houdt. Dat zou een lus zijn, het meest duidelijk bij een waarschuwing voor het aantal uitvoeringen, waarbij elke melding bijdraagt aan het aantal dat deze meet.

Notify-uitvoeringen zijn gewone uitvoeringen, dus ze verschijnen in de [uitvoeringsgeschiedenis](../reference/execution-history.md) zoals elke andere uitvoering. Een notify-workflow die mislukt, wordt vastgelegd bij het afgaan, maar verhindert nooit dat het afgaan zelf wordt vastgelegd.

Een notify-workflow wordt uitgevoerd als de eigenaar van de waarschuwing, met diens inloggegevens en globale variabelen, precies alsof deze de workflow zelf had uitgevoerd. Het kiezen van een workflow die iemand met u heeft gedeeld, leent niet de inloggegevens van die persoon. Als de eigenaar de toegang tot de notify-workflow verliest, wordt het afgaan nog steeds vastgelegd, maar wordt de notify-uitvoering overgeslagen.

## Geschiedenis van afgaan

Onder de waarschuwingenlijst staat de geschiedenis van afgaan: wat afging, wanneer, de waargenomen waarde tegen de drempelwaarde, het exact geëvalueerde venster en de notify-uitkomst.

Het bevestigen van een afgaan markeert de rij en verandert de badge van de waarschuwing van **Firing** naar **Acknowledged**. Dat is een uitspraak over u, niet over de waarschuwing: de voorwaarde geldt nog steeds en de waarschuwing keert vanzelf terug naar **OK** wanneer de metriek weer onder de drempelwaarde zakt.

Elk record bewaart de bijdragende details op het moment dat deze afging: ids van mislukte uitvoeringen en foutmeldingen, besteding per model of de uitsplitsing naar trigger-bron. Dit is bewust. Het venster is verstreken en het later opnieuw berekenen kan een ander antwoord opleveren.

Afgaat-records worden 90 dagen bewaard.

## Chat vragen over waarschuwingen

Het tabblad [Chat](./chat-tab.md) kan vragen over uw waarschuwingen beantwoorden:

- "Welke waarschuwingen heb ik?"
- "Is er een waarschuwing op de factuur-workflow?"
- "Waarom ging de kostenwaarschuwing af?"
- "Wanneer is deze voor het laatst afgegaan?"

Bij een vraag als "waarom ging deze af" citeert Chat de werkelijke waargenomen waarde, de drempelwaarde en het tijdvenster uit het afgaat-record, samen met de bijdragende details.

## Delen

Waarschuwingen kunnen worden gedeeld met individuele gebruikers of met [teams](./teams-tab.md). Mensen met wie u deelt, kunnen de waarschuwing en de geschiedenis van afgaan zien. Alleen de eigenaar kan deze bewerken, pauzeren, verwijderen of opnieuw delen.

### Wanneer workflowtoegang wordt ingetrokken

Een waarschuwing op één enkele workflow blijft de uitvoeringsstatistieken van die workflow uitlezen. Het intrekken van iemands toegang tot de workflow bepaalt daarom ook wat er met diens waarschuwingen daarop gebeurt:

- **Het verwijderen van een gebruiker- of teamshare** vraagt de workflow-eigenaar of ook de waarschuwingen van die gebruiker of dat team op de workflow moeten worden stopgezet. Stopzetten is de standaard. Stopgezette waarschuwingen worden gepauzeerd, niet verwijderd, en elk ervan wordt geregistreerd als `alert.disable_on_access_revoke` in het [audit log](../reference/audit.md).
- **Het verwijderen van een teamlid of het verwijderen van een team** zet de betrokken waarschuwingen altijd stop, omdat degene die deze wijziging doorvoert niet noodzakelijkerwijs de workflow-eigenaar is.
- Een waarschuwing wordt alleen stopgezet wanneer de eigenaar geen ander pad naar de workflow heeft, zoals een directe share of een ander team.
- Het hervatten of testen van een gepauzeerde waarschuwing controleert de toegang van de eigenaar opnieuw, zodat een stopgezette waarschuwing niet opnieuw kan worden ingeschakeld of gebruikt kan worden om de statistieken van de workflow uit te lezen zonder toegang. Op **Resume** drukken zonder toegang toont een melding dat de workflow-eigenaar deze eerst opnieuw moet delen.

## Waarschuwingen beheren

- **Pause / Resume** — een gepauzeerde waarschuwing wordt nooit geëvalueerd. Hervatten controleert deze onmiddellijk in plaats van te wachten op het volgende interval.
- **Edit** — wijzigingen worden als geheel gevalideerd, zodat een gedeeltelijke bewerking de waarschuwing niet in een ongeldige staat kan achterlaten.
- **Delete** — verwijdert de waarschuwing en de geschiedenis van afgevuurde meldingen.

## Zie ook

- [Analytics Tab](./analytics-tab.md) — de grafieken waaruit deze drempelwaarden worden gehaald
- [Traces Tab](./traces-tab.md) — waar de LLM-kostencijfers vandaan komen
- [Execution History](../reference/execution-history.md) — de uitvoeringen die waarschuwingen voor fouten, duur en aantal meten
- [Chat Tab](./chat-tab.md) — waarschuwingen opvragen in natuurlijke taal
- [Teams](./teams-tab.md) — waarschuwingen delen met een team
