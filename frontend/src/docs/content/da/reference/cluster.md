# Loadfordeling

Når en anden Heym-instance peges mod den samme PostgreSQL-database, tilføjes den som en arbejder. Kørsler af workflows i baggrunden fordeles derefter mellem instancerne efter en indstillet procentdel, så maskinen der håndterer brugergrænsefladen og API'en ikke også er den eneste der kører alle workflows.

Instancerne kommunikerer aldrig direkte med hinanden. PostgreSQL bærer arbejdsbyrden, så en arbejder behøver ingen åben port, certifikat eller rute tilbage til hovedinstancen - kun databaseadgang.

## Roller

Én instance er **main**, fastsat via en miljøvariabel. Den håndterer brugergrænsefladen, API'en, MCP og chatportalen samt ejer filopbevaring og installerede plugins. Alle andre instancer er **arbejdere**: de har kun adgang til databasen og udfører kørsler i baggrunden.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # eller: worker
HEYM_INSTANCE_NAME=EU Main    # visningsnavn, kan redigeres senere under Indstillinger
HEYM_INSTANCE_ID=eu-main      # valgfri; afledes af navnet hvis tom
```

Main-rollen adskilles fra ledervalg. Heym vælger allerede én leder på tværs af clustret til at håndtere cron, evaluering af advarsler og genopretning efter nedbrud; hvis main går ned, flyttes lederskabet til en arbejder inden for få sekunder, og planlagte kørsler fortsætter. Main-rollen flyttes ikke, da filopbevaring ikke kan flyttes med den.

## Hvad kan forlade hovedinstancen

Placering afgøres ud fra workflowets noder før kørslen starter. En kørsel forbliver på main, hvis en hvilken som helst node - inklusive noder i under-workflows den kalder - berører noget der kun findes på én maskine:

| Node | Årsag til at forblive på main |
|---|---|
| Codex, OpenCode Go | Workspace for kode-agenten forbliver på lokal disk, så en efterfølgende kørsel kan genoptages |
| Agent med tilknyttet færdighed | Færdighedskode læser og skriver til Heym Drive |
| Drive, Converter, Google Drive | Læser og skriver genererede filer |
| File Upload trigger | Upload lander på main's disk |
| Send Email | Virksomheders SMTP-relæer tillader ofte kun én afsenderadresse |
| Plugin-noder | Et plugin er installeret på én instances disk |

**Alt andet distribueres** - inklusive Code-node, Playwright og Agent Python-værktøjer. Hver instance kører det samme image med sin egen Docker-socket, så en sandkasse er ikke en årsag til at holde en kørsel på main, og disse er de mest CPU-krævende noder i produktet.

Et workflow hvis under-workflow vælges af et udtryk kan ikke inspiceres på forhånd, så det forbliver på main.

## Valg af procentdele

Vægte er heltal indstillet under **Indstillinger → Instancer**. De er **andele af hvilke instancer der aktuelt kan modtage arbejde**, ikke procentdele af 100: planlæggeren dividerer med poolens egen totale sum.

Denne forskel viser sig så snart én instance falder fra. Med `Main 41, Worker A 26, Worker B 33` og Worker B slukket, efterlades en pool på 67, så Main modtager 41/67 = **61%** og Worker A 26/67 = **39%**. Panelet viser den effektive fordeling under tabellen netop af denne grund, og gemning blokeres aldrig fordi tallene ikke summerer til 100 - kun en fordeling hvor ingen aktiveret instance har en vægt afvises.

To ting er let at misforstå.

**En procentdel er ikke en andel af maskinkraft.** Den dækker kun kørsler der går gennem køen. Betjening af brugergrænsefladen og API'en, streaming af editor- og portalkørsler samt håndtering af filuploads er alt sammen main's arbejde og tæller ikke med. Main udfører mere end dens tal angiver.

**Main's procentdel er et loft, ikke et gulv.** Kørsler der kun kan udføres på main trækkes fra dens kvote, så når denne er opbrugt, falder de resterende distribuerbare kørsler til arbejderne. At sætte main's tal lavt er sikkert - arbejde der skal køres der, bliver det. At sætte det højt sultner arbejderne.

Med en stærk main og en mindre arbejder, start nærmere 60/40 end maskinernes rå forhold, sammenlign derefter faktiske kørselstider under Kørsler-fanen og juster.

Vægte normaliseres på tværs af de instancer der aktuelt er live og aktiverede. Med `main=70, A=15, B=15` og A offline, bliver fordelingen 70/85 og 15/85 mellem main og B, og vender tilbage til 70/15/15 når A kommer online igen.

**En instance der kommer tilbage, får ikke de kørsler den har misset.** Tid brugt Offline, Deaktiveret eller på en inkompatibel version tæller ikke mod den, så en arbejder der har været utilgængelig en nat, genforenes ved poolens aktuelle position og fordelingen læses som 70/30 fra dens første kørsel - den absorberer ikke alle kørsler indtil den har indhentet forsinkelsen. En arbejder der har været tilgængelig hele tiden indhenter stadig, hvilket er hvad der gør main's procentdel til et loft.

### Ny instance tilføjes med nul

En instance der aldrig har fået tildelt en vægt starter på 0, hvilket ville efterlade den Live, Aktiveret og uden at modtage noget. **Tildel automatisk andel til nye instancer** - slået til som standard under instancetabellen - løser dette: ved lederens næste gennemløb får den nye en lige stor andel af poolen, og de eksisterende vægte skaleres ned mens deres indbyrdes forhold bevares, så en bevidst 70/30 stadig læses som cirka 70/30 bagefter. Den totale sum forbliver præcis 100.

Dette kører **én gang per instance**. Både det automatiske gennemløb og egne redigeringer markerer instancen som konfigureret, så en instance der er indstillet manuelt aldrig ændres bagved - inklusive en der bevidst er sat til 0. Slå indstillingen fra hvis alle nye maskiner skal vente på manuel konfiguration.

Kun aktiverede, live og kompatible instancer deltager. At give en andel til en maskine der ikke kan eksekvere noget, ville efterlade denne andel ubrugt.
### Når procenter ikke er til hjælp

Indstillingspanelet rapporterer, hvor stor en del af de seneste 24 timers kørsler, der kun kunne udføres på main. Hvis tallet er højt - en Codex- eller Drive-tung arbejdsbyrde - vil worker-instanserne forblive inaktive uanset vægtindstillingerne, og løsningen er en større main-instans i stedet for flere worker-instanser.

## Dimensionering af PostgreSQL til et cluster

Forbindelser skalerer med instanser, ikke kun brugere. Hver instans kører flere uvicorn-processer, og hver proces har en forbindelsespul plus fire `LISTEN`-forbindelser (annullering, køopvågning, kørselsresultater, chatstrømme). Åbne chatstrømme deler den ene chatforbindelse, så de tilføjer ikke flere databaseforbindelser. Et cluster med tre instanser på standardindstillingen `max_connections = 100` løber tør, og Heym kan så ikke nå sin egen database.

Beregn groft `instanser x processer x (async-pul + sync-pul + 4)` og indstil `max_connections` over dette.

Formindsk puljerne i stedet for kun at hæve loftet. En enkelt installation har standardværdierne 10+20 async- og 5+10 sync-forbindelser per proces, hvilket er generøst for en enkelt maskine og langt for meget for et cluster:

| Variabel | Enkeltinstans | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Eksempelfilen for compose indstiller disse og `max_connections = 300`. Dette reducerer loftet for et cluster med to instanser fra 768 til 192 forbindelser, mens tre instanser stadig er under 300.

## Krav, som clusteret ikke kan håndhæve

**Alle instanser skal bruge den samme `SECRET_KEY` og `ENCRYPTION_KEY`.** En worker med en anden `ENCRYPTION_KEY` kan ikke dekryptere legitimationsoplysninger, og hver kørsel, der bruger disse, vil fejle med en ubrugelig fejlmeddelelse. Heym sammenligner en digest af begge nøgler ved hver pulsslagstjek, sammen med appversionen og databaserevisionen, og markerer en uoverensstemmende instans som **Mismatch**, så den ikke modtager noget arbejde. Belastningen falder tilbage på main, indtil det er løst.

Dette definerer også opgraderingsrækkefølgen. Hvis main opgraderes først, markeres alle workers inkompatible; arbejdet vender tilbage til main, og hver worker genforenes, efterhånden som den opgraderes. Langsommere, synligt og reversibelt.

**Peg indgående trafik kun mod main-instansen.** Round-robin af bruger-trafik på tværs af instanser vil sende en filupload til en maskine og dens download til en anden. Intet i koden forhindrer dette, fordi en worker kører det samme image og vil besvare enhver anmodning, den modtager.

**Alle instanser har brug for `FRONTEND_URL`, indstillet til den samme offentlige adresse.** En kørsel, der sættes på pause til menneskelig gennemgang, genererer sin gennemgangslink på den instans, der udførte den, ikke på main, og det samme gælder for Codex-opfølgningslinks og download-URL'er til genererede filer. En worker uden denne indstilling bygger disse links mod sin egen lokale adresse, og den, der modtager et sådant link, kan ikke åbne det.

**Worker-instanser har en anden udgående IP.** Enhver API, der tillader kildeadresser, vil se den nye. Send Email kører på main af netop denne grund; for HTTP-noden skal der enten gives clusteret en enkelt NAT-udgangsadresse eller tillades hver enkelt instans.

## Tilføjelse af en worker på en anden maskine

`docker-compose.worker.yml` i repository-roden kører en worker på sin egen vært. Den har ingen database og ingen brugergrænseflade: den når main-instansens PostgreSQL og tager sin del af baggrundskørslerne.

Udfyld en `.env` ved siden af - image-tag, databasevært og legitimationsoplysninger, begge nøgler og en instans-id - og start den. Compose nægter at starte, før alle nødvendige værdier er angivet, i stedet for at starte med en pladsholder, der senere fejler på en sværlæselig måde.

Image-tagget skal være den version, main kører, og begge nøgler skal kopieres nøjagtigt. En forskel i begge viser workeren som Mismatch, og den modtager intet arbejde.

## Læsning af instanstabellen

| Kolonne | Betydning |
|---|---|
| Navn | Redigerbart label; det stempeles på hver kørsel, denne instans udfører |
| Rolle | `main` eller `worker`, fra miljøet |
| Status | **Live** med et frisk pulsslag, **Offline** efter 30 sekunders stilhed, **Mismatch** når version, databaserevision eller nøgler afviger fra main's |
| ms | Rundtur fra den instans til databasen, målt af instansen selv |
| Til | Tag en worker ud af rotation uden at stoppe den - igangværende kørsler afsluttes, ingen nye tildeles. Låst til for main-instansen: fil-, plugin- og coding-agent-arbejde kører der uanset indstillingen |
| Vægt | Dens andel af distribuerbare kørsler |

## Kørselshistorik

Hver kørsel i kørselshistorikken navngiver den instans, der udførte den, og begge historik-dialoger kan filtreres ned til én instans. Filtret matcher på instansens id, mens dens navn vises, så omdøbning af en instans omskriver ikke, hvad gamle kørsler angiver.

Intet af dette vises på en enkeltinstans-installation: felterne er tomme, intet label vises, og intet filter tilbydes.
## Fejlhåndtering

**Hvis en worker afbrydes midt i en kørsel**, bliver dens heartbeat inaktiv, og lederens eksisterende gendannelsesscanning genkører kørslen på en aktiv instans. Den kø-række, der var blevet påbegyndt, håndteres separat: Når der ikke findes en aktiv kørsel for den, og en nådeperiode på to minutter er udløbet, markerer lederen rækken som fejlet og vækker den, der ventede på resultatet. Alder alene udløser aldrig handlingen, så en legitim lang kørsel forbliver uberørt; og rækken markeres som fejlet i stedet for at blive genindkørt, fordi gendannelsen allerede har overtaget genkørslen, og genindkøring ville køre det samme workflow to gange.

**Hvis main-instansen går ned**, fortsætter cron med at udløse fra en worker, og distribuerbare kørsler fortsætter med at eksekvere. Kørsler, der kræver main, sættes i kø og venter, og afvikles, når main er tilgængelig igen — men kun inden for nådevinduet for misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, standard 600 sekunder). Alt ældre lukkes som sprunget over, med årsagen registreret, i stedet for at afvikle timers bagkø på én gang.

Brugerfladen, API'en, MCP og editoren er utilgængelige, mens main er nede, fordi indgangspunkterne ligger der.

## Relateret

- [Kørsel & Deployment](../getting-started/running-and-deployment.md) – Installer en enkelt instans først; miljøvariabler og nøgleopsætning findes der
- [Indstillinger](./user-settings.md) – Fanen Instanser, og hvem der kan se den
- [Kørselshistorik](../tabs/traces-tab.md) – Sammenlign faktiske kørselsvarigheder mellem instanser før ændring af opdeling
- [Sikkerhed](./security.md) – Hvorfor alle instanser skal dele `SECRET_KEY` og `ENCRYPTION_KEY`
