# Alarmer-fanen

**Alarmer**-fanen gør det muligt at definere grænseværdibetingelser over et tidsvindue og blive underrettet, når de overskrides. Heym registrerer allerede kørselsresultater, køretid og LLM-forbrug, men tilbyder aldrig disse oplysninger aktivt. En alarm er den måde, hvorpå man anmoder om dem.

Hver alarm evalueres over et valgfrit **tidsvindue**, aldrig på en enkelt hændelse. En mislykket kørsel er støj. Tolv mislykkede kørsler på ti minutter er en hændelse.

## Alarmtyper

| Type | Det spørgsmål den besvarer | Hvor tallet kommer fra |
|---|---|---|
| **Fejlgrænse** | Er der sket mere end N fejl i vinduet? | Rækker i [kørselshistorikken](../reference/execution-history.md) med fejlstatus |
| **Workflow-varighed** | Er kørslerne blevet langsommere end forventet i vinduet? | Køretid, aggregeret som maksimum, gennemsnit eller 95. percentil |
| **Token / USD-omkostning** | Er forbruget overskredet budgettet i vinduet? | [LLM-sporinger](./traces-tab.md) plus LLM-omkostningstabellen |
| **Kørselsantal** | Er denne kørsel sket langt hyppigere end den burde? | Antal rækker i kørselshistorikken |

### Fejlgrænse

Tæller mislykkede kørsler i vinduet og udløses, når tælleren når den definerede grænse. Da den tæller over et vindue i stedet for at reagere på hver enkelt fejl, vil en enkelt midlertidig fejl ikke udløse en alarm.

### Workflow-varighed

Måler kørselsvarighed inden for vinduet. Vælg **maksimum** (den langsomste kørsel), **gennemsnit** eller **p95**. P95-tallet bruger samme percentilberegning som [Analytics-fanen](./analytics-tab.md), så alarmen og latenstidsdiagrammet altid er enige om samme vindue.

**Minimumsantal kørsler i vinduet** sikrer troværdighed. Den langsomste kørsel i et næsten tomt vindue er blot den ene kørsel, så ved at indstille et minimum på f.eks. 3 undgås falske alarmer på grund af støj.

### Token / USD-omkostning

Summerer LLM-forbrug i vinduet, enten som samlet antal tokens eller som USD-beløb. Dollarbeløber beregnes via samme pristabel som [Traces-fanen](./traces-tab.md) og [LLM-omkostningstabellen](./datatable-tab.md#llm-cost-table-system-table) bruger, så en omkostningsalarm og omkostningssiden altid er enige.

Når omfanget er alle workflows, inkluderes også LLM-kald uden for workflows, såsom [Chat-fanen](./chat-tab.md) og [AI-assistenten](../reference/ai-assistant.md). Brug af kodeagenter (Codex, OpenCode) inkluderes ikke.

Modeller uden pristabel rapporteres i alarmens kontekst som "uprisgivet" i stedet for at tælles stiltiende som nul.

### Kørselsantal

Tæller kørsler af enhver status i vinduet. Denne type fanger en trigger, der er gået galt: et workflow, der normalt kører 20 gange i timen, pludselig kører 2.000 gange. Alarmposten inkluderer en opdeling per triggerkilde, da dette typisk besvarer "hvorfor skete dette".

## Omfang

En alarm overvåger enten **et enkelt workflow** eller **alle workflows**.

"Alle workflows" betyder alle workflows, som alarmens ejer har adgang til. Det betyder bevidst ikke alle workflows på Heym-instansen: alarmer kan deles, og deling af en alarm bør ikke give nogen aggregerede tal for workflows, de ikke kan åbne.

## Guiden

Oprettelse af en alarm gennemgår fem trin.

1. **Type** — vælg en af de fire ovenstående.
2. **Omfang** — et workflow eller alle.
3. **Betingelse** — tidsvinduet plus grænseværdifelter for den valgte type.
4. **Reaktion** — hvad der kører ved udløsning, og hvor ofte der skal underrettes.
5. **Gennemgang** — navngiv den, og se backtesten.

### Backtesten

Gennemgangstrinet besvarer det spørgsmål, der faktisk betyder noget før lagring: *hvor ofte ville dette have udløst over de sidste 24 timer?*

Den rapporterer antal udløsninger og den højeste observerede værdi i forhold til grænseværdien. Hvis den angiver, at betingelsen ville have udløst 400 gange, justeres grænseværdien før lagring i stedet for efter modtagelse af alarm. Det er muligt at udvide tilbagelooket til 3 eller 7 dage.

## AI-udkast

Øverst i første trin findes en boks, hvor det er muligt at beskrive ønsket i almindeligt sprog:

> Advær mig, hvis fakturasynkroniseringen fejler mere end 5 gange på 10 minutter

Heym omdanner dette til en alarmdefinition, udfylder alle felter, den kan, og springer frem med de AI-udfyldte felter markeret, så det kun er nødvendigt at bekræfte i stedet for at indtaste igen. En komplet anmodning fører direkte til Gennemgang.

**En delvis anmodning fremskynder stadig processen.** Hvis der kun angives "advær mig, hvis den fejler 5 gange", oprettes en fejlgrænsealarm med udfyldt tæller, standardværdier for resten, og guiden åbnes på det første trin, der stadig kræver input: i dette tilfælde Omfang, da intet workflow blev navngivet. En note øverst angiver, hvad der mangler. Det blokerer aldrig for Næste eller Opret.

Det samme gælder, når modellen navngiver et workflow, der ikke er tilgængeligt, eller returnerer en betingelse med manglende felter. De dele, der giver mening, beholdes, resten falder tilbage til standardværdier for den alarmtype, og det er muligt at justere derfra. Intet her omgår validering: guidens egne regler og API'en tjekker begge alarmen igen ved lagring.
## Gentagelsesadfærd

Når en alarm udløses, indtager den en aktiveret tilstand. Hvad der sker herefter, kan konfigureres i trin 4.

- **Notifikation én gang, indtil tilstanden normaliseres** (standard) - udløses én gang og forbliver derefter inaktiv, så længe betingelsen er opfyldt. Når målet falder tilbage under tærsklen, vender alarmen tilbage til OK-status og kan udløses igen. Normalisering er en tilstandsændring, ikke en hændelse: den skaber ikke en udløsningspost og kører ikke notifikations-workflowet.
- **Fortsæt notifikationer med interval** - udløses igen hvert N. minut, så længe betingelsen er opfyldt.

Standardindstillingen eksisterer, fordi et defekt workflow, der kontrolleres hvert 60. sekund, ellers ville producere 60 udløsninger i timen, hvilket ville føre til mutering af alarmen.

## Kørsel af Workflow ved Udløsning

Trin 4 tilbyder tre muligheder for "hvad der skal ske, når denne alarm udløses":

- **Opret og tildel et nyt workflow** (standard) - ved at gemme alarmen oprettes et workflow kaldet *"&lt;alarmnavn&gt; notifikation"* og linkes til det. Det leveres med en Input-node, hvis felter nøjagtigt matcher payload'en nedenfor, så `$alert.body.observed_value` og andre felter resolveres umiddelbart, og der kun skal tilknyttes den node, der leverer beskeden. **Gå til workflow** på alarmkortet åbner det. Dette er standard, fordi en alarm, der udløser uden handling, er let at overse.
- **Vælg et eksisterende workflow** - kør noget, der allerede er bygget.
- **Gør intet** - udløsningen registreres stadig i fanen, men der køres ikke noget.

Alarm-payload'en ankommer som workflowets input-body:

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

### Hvilket workflow producerede værdien

`workflows` er det eneste sted, et workflow vises. Det lister alle workflows, der bidrog til aflæsningen, hver med sin egen `value` - det workflows fejltælling, køretælling, langsommeste kørsel i millisekunder eller forbrug, afhængigt af alarmtypen. Listen er sorteret efter `value`, højeste først, så `workflows[0]` er den største synder.

Det er **altid en array**: et enkelt element under ét-workflow-scope, mange under "alle mine workflows", og tom i stedet for null, når intet kan tilskrives. Et notifikations-workflow kan iterere det uden formkontrol.

Der er med vilje ingen ental `workflow_id`. Det beskrev alarmens scope snarere end målet, så det var `null` under systemscope, hvilket netop er tilfældet, hvor "hvilket workflow?" betyder mest. `observed_value` forbliver den samlede værdi, der blev sammenlignet med tærsklen; de enkelte workflows `value`-felter forklarer, hvor den kom fra.

Sådan når alarmer Slack, e-mail, Telegram eller andre steder: med de [noder](../reference/node-types.md), der allerede findes, i stedet for et separat notifikationssystem.

En alarm kan ikke notificere det workflow, den overvåger. Det ville skabe en løkke, mest tydeligt for en eksekveringstællingsalarm, hvor hver notifikation tilføjer til den tælling, den måler.

Notifikationskørsler er almindelige eksekveringer, så de vises i [eksekveringshistorik](../reference/execution-history.md) som enhver anden kørsel. Et notifikations-workflow, der fejler, registreres på udløsningen, men forhindrer aldrig selve udløsningen i at blive registreret.

Et notifikations-workflow kører som alarmens ejer, med deres legitimationsoplysninger og globale variabler, præcis som hvis de havde kørt det selv. Valg af et workflow, nogen har delt med brugeren, låner ikke deres legitimationsoplysninger. Hvis ejeren mister adgang til notifikations-workflowet, registreres udløsningen stadig, men notifikationskørslen springes over.

## Udløsningshistorik

Under alarmlisten findes udløsningshistorikken: hvad der udløstes, hvornår, den observerede værdi mod tærsklen, det nøjagtige vindue, der blev evalueret, og notifikationsresultatet.

Anerkendelse af en udløsning markerer rækken og ændrer alarmens badge fra **Udløst** til **Anerkendt**. Det er en erklæring om brugeren, ikke om alarmen: betingelsen holder stadig, og alarmen vender tilbage til **OK** af sig selv, når målet falder tilbage under tærsklen.

Hver post gemmer bidragsydende detaljer fra udløsningstidspunktet: fejlende eksekverings-id'er og fejlmeddelelser, pr. model-forbrug eller trigger-source-opdeling. Dette er med vilje. Vinduet er passeret, og genberegning senere kan give et andet svar.

Udløsningsposter opbevares i 90 dage.

## Spørgsmål om Alarmer i Chat

[Chat-fanen](./chat-tab.md) kan besvare spørgsmål om alarmer:

- "Hvilke alarmer har jeg?"
- "Er der en alarm på invoice-workflowet?"
- "Hvorfor udløste cost-alarmen?"
- "Hvornår udløste denne sidst?"

For et "hvorfor udløste den?"-spørgsmål citerer Chat den faktiske observerede værdi, tærsklen og tidsvinduet fra udløsningsposten sammen med de bidragsydende detaljer.

## Deling

Alarmer kan deles med enkelte brugere eller med [teams](./teams-tab.md). Personer, der deles med, kan se alarmen og dens udløsningshistorik. Kun ejeren kan redigere, pause, slette eller gen-dele den.
### Når adgang til workflow fjernes

En advarsel på et enkelt workflow fortsætter med at læse workflowets kørselsstatistikker, så fjernelse af en brugers adgang til workflowet afgør også, hvad der sker med deres advarsler på det:

- **Fjernelse af en bruger- eller teamdeling** spørger workflow-ejeren, om der også skal stoppes for brugerens eller teamets advarsler på workflowet. Stop er standardvalget. Stoppede advarsler sættes på pause og slettes ikke, og hver enkelt registreres som `alert.disable_on_access_revoke` i [revisionsloggen](../reference/audit.md).
- **Fjernelse af et teammedlem eller sletning af et team** stopper altid de berørte advarsler, fordi personen, der foretager ændringen, ikke nødvendigvis er workflow-ejeren.
- En advarsel stoppes kun, når dens ejer ikke har andre adgangsveje til workflowet, såsom en direkte deling eller et andet team.
- Genoptagelse eller test af en sat-på-pause-advarsel tjekker ejerens adgang igen, så en stoppet advarsel kan ikke tændes igen eller bruges til at læse workflowets statistikker uden adgang. Ved tryk på **Genoptag** uden adgang vises en meddelelse, der forklarer, at workflow-ejeren først skal dele det igen.

## Håndtering af advarsler

- **Pause / Genoptag** — en sat-på-pause-advarsel evalueres aldrig. Genoptagelse tjekker den med det samme i stedet for at vente på det næste interval.
- **Rediger** — ændringer valideres som en helhed, så en delvis redigering ikke kan efterlade advarslen i en ugyldig tilstand.
- **Slet** — fjerner advarslen og dens udløste historik.

## Se også

- [Analytics-fanen](./analytics-tab.md) — diagrammerne, som disse tærskler er trukket fra
- [Traces-fanen](./traces-tab.md) — hvor LLM-omkostningstal kommer fra
- [Kørselshistorik](../reference/execution-history.md) — kørslerne, som fejl-, varigheds- og tælleadvarsler måler
- [Chat-fanen](./chat-tab.md) — forespørgsler på advarsler i naturligt sprog
- [Teams](./teams-tab.md) — deling af advarsler med et team
