# Lastfördelning

Peka en andra Heym-instans mot samma PostgreSQL-databas och den ansluter som en worker. Bakgrundskörningar av workflows delas sedan mellan instanserna enligt en procentsats som anges, så att maskinen som betjänar gränssnittet och API:et inte också är den enda maskinen som kör varje workflow.

Instanserna kommunicerar aldrig med varandra. Postgres bär arbetet, så en worker behöver ingen öppen port, inget certifikat och ingen väg tillbaka till huvudinstansen — endast databasåtkomst.

## Roller

En instans är **main**, fastställd via en miljövariabel. Den betjänar gränssnittet, API:et, MCP och chattportalen, och den äger fillagring och installerade plugin. Varje annan instans är en **worker**: den når endast databasen och kör bakgrundskörningar.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Rollen main är åtskild från leader election. Heym väljer redan en leader över klustret som äger cron, utvärdering av varningar och återställning efter krascher; om main går ner flyttas ledarskapet till en worker inom några sekunder och schemalagda körningar fortsätter att utlösas. Rollen main flyttas inte, eftersom fillagringen inte kan flyttas med den.

## Vad som kan lämna huvudinstansen

Placering avgörs utifrån workflowens noder innan körningen startar. En körning stannar på main när någon nod i den — inklusive noder inuti sub-workflows som den anropar — berör något som endast finns på en maskin:

| Nod | Varför den stannar på main |
|---|---|
| Codex, OpenCode Go | Kodagentens arbetsyta stannar på lokal disk så att en uppföljning kan återupptas i den |
| Agent med en skill kopplad | Skill-koden läser och skriver till Heym Drive |
| Drive, Converter, Google Drive | De läser och skriver genererade filer |
| File Upload-trigger | Uppladdningen landar på mains disk |
| Send Email | Företags-SMTP-reläer tillåter vanligtvis endast en källadress |
| Plugin-noder | Ett plugin är installerat på en instans disk |

**Allt annat distribueras** — inklusive Code-noden, Playwright och Agent Python-verktyg. Varje instans kör samma image med sin egen Docker-socket, så en sandbox är inte ett skäl att behålla en körning på main, och dessa är de mest CPU-krävande noderna i produkten.

En workflow vars sub-workflow väljs av ett uttryck kan inte inspekteras i förväg, så den stannar på main.

## Att välja procentsatser

Vikter är heltal som anges under **Settings → Instances**. De är **andelar av de instanser som för närvarande kan ta arbete**, inte procentandelar av 100: schemaläggaren dividerar med den poolens egen summa.

Den distinktionen blir tydlig så snart en instans faller bort. Med `Main 41, Worker A 26, Worker B 33` lämnar avstängning av Worker B en pool på 67, så Main tar i praktiken emot 41/67 = **61%** och Worker A 26/67 = **39%**. Panelen visar den effektiva fördelningen under tabellen just av detta skäl, och sparande blockeras aldrig för att talen inte summerar till 100 — endast en fördelning där ingen aktiverad instans har en vikt avvisas.

Ytterligare två saker är lätta att få fel.

**En procentsats är inte en andel av maskinkraft.** Den täcker endast körningar som går genom kön. Att betjäna gränssnittet och API:et, strömma editor- och portalkörningar samt hantera filuppladdningar är allt mains arbete och inget av det räknas. Main gör mer än vad dess tal anger.

**Mains procentsats är ett tak, inte ett golv.** Körningar som endast kan utföras på main belastar dess kvot, så när den kvoten är förbrukad faller de återstående distribuerbara körningarna till workerna. Att sätta mains tal lågt är säkert — arbete som måste köras där körs ändå. Att sätta det högt svälter workerna.

Så med en stark main och en mindre worker, börja närmare 60/40 än maskinernas råa förhållande, och jämför sedan verkliga körtidslängder i fliken Traces och justera.

Vikter renormaliseras över de instanser som för närvarande är live och aktiverade. Med `main=70, A=15, B=15`, om A går offline blir fördelningen 70/85 och 15/85 mellan main och B, och återgår till 70/15/15 när A kommer tillbaka.

**En instans som kommer tillbaka är inte skyldig de körningar den missade.** Tid som spenderats Offline, Disabled eller på en felaktig version räknas inte mot den, så en worker som är otillgänglig en natt återansluter vid poolens aktuella position och fördelningen visar 70/30 igen från dess första körning — den absorberar inte varje körning förrän den har kommit ikapp. En worker som var tillgänglig hela tiden kommer fortfarande ikapp, vilket är vad som gör mains procentsats till ett tak.

### En ny instans ansluter vid noll

En instans som aldrig har tilldelats en vikt börjar på 0, vilket skulle lämna den Live, Enabled och mottagande av ingenting. **Give new instances a share automatically** — på som standard, under instanstabellen — åtgärdar detta: vid leaderns nästa pass tilldelas nykomlingen en lika stor andel av poolen, och de befintliga vikterna skalas ner med bevarade inbördes förhållanden, så en avsiktlig 70/30 läses fortfarande som ungefär 70/30 efteråt. Summan förblir exakt 100.

Detta körs **en gång per instans**. Både det automatiska passet och en egen redigering markerar instansen som konfigurerad, så en instans som angetts manuellt ändras aldrig bakom ryggen — inklusive en som medvetet satts till 0. Stäng av inställningen om varje ny maskin hellre ska vänta på manuell åtgärd.

Endast aktiverade, live och kompatibla instanser deltar. Att tilldela en andel till en maskin som inte kan utföra något skulle lämna den andelen strandsatt.
### När procentandelar inte kan hjälpa

Inställningspanelen rapporterar hur många av de senaste 24 timmarnas körningar som endast kunde köras på main. Om den siffran är hög — en Codex-tung eller Drive-tung arbetsbelastning — kommer arbetarna att stå stilla oavsett vad vikterna säger, och lösningen är en större main-instans snarare än fler av dem.

## Dimensionering av PostgreSQL för ett kluster

Anslutningar skalar med instanser, inte bara med användare. Varje instans kör flera uvicorn-processer, och varje process håller en anslutningspool plus fyra `LISTEN`-anslutningar (avbrytning, köuppvakningar, körningsresultat, chat-strömmar). Öppna chat-strömmar delar den enda chat-anslutningen, så de lägger inte till några databasanslutningar. Ett kluster med tre instanser på standardvärdet `max_connections = 100` tar slut, och Heym kan då inte nå sin egen databas.

Budgetera ungefär `instances x processes x (async pool + sync pool + 4)` och sätt `max_connections` över det.

Minska poolerna snarare än att bara höja taket. En enskild distribution har som standard 10+20 async- och 5+10 sync-anslutningar per process, vilket är generöst för en maskin och alldeles för mycket för ett kluster:

| Variabel | Enskild instans | Kluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Exempel-compose-filen sätter dessa och `max_connections = 300`. Det tar ett kluster med två instanser från ett tak på 768 anslutningar ner till 192, med tre instanser fortfarande under 300.

## Krav som klustret inte kan upprätthålla automatiskt

**Varje instans måste använda samma `SECRET_KEY` och `ENCRYPTION_KEY`.** En worker med en annan `ENCRYPTION_KEY` kan inte dekryptera autentiseringsuppgifter, och varje körning som använder autentiseringsuppgifter skulle misslyckas med ett fel som inte namnger något användbart. Heym jämför en digest av båda nycklarna vid varje heartbeat, tillsammans med appversionen och databasrevisionen, och markerar en instans som inte matchar som **Mismatch** så att den inte tar emot något arbete alls. Belastningen faller tillbaka på main tills det åtgärdas.

Det definierar också uppgraderingsordningen. Att uppgradera main först markerar varje worker som inkompatibel; arbetet återgår till main, och varje worker återansluter i takt med att den uppgraderas. Långsammare, synligt och reversibelt.

**Rikta ingress endast mot main-instansen.** Round-robin av användartrafik över instanser skulle skicka en filuppladdning till en maskin och dess nedladdning till en annan. Inget i koden förhindrar detta, eftersom en worker kör samma image och kommer att svara på varje begäran den tar emot.

**Varje instans behöver `FRONTEND_URL`, satt till samma publika adress.** En körning som pausar för mänsklig granskning skapar sin granskningslänk på den instans som körde den, inte på main, och samma sak gäller för Codex-uppföljningslänkar och för nedladdnings-URL:er för genererade filer. En worker som lämnas utan den bygger dessa länkar mot sin egen lokala adress, och den som tar emot en sådan länk kan inte öppna den.

**Worker-instanser har en annan utgående IP.** Varje API som vitlistar källadresser ser den nya. Send Email körs på main av just denna anledning; för HTTP-noden, ge antingen klustret en enda NAT-utgångsadress eller vitlista varje instans.

## Lägga till en worker på en annan maskin

`docker-compose.worker.yml` i repots rot kör en worker på sin egen värd. Den har ingen databas och inget användargränssnitt: den når main-instansens PostgreSQL och tar sin andel av bakgrundskörningarna.

Fyll i en `.env` bredvid den — image-tagg, databasvärd och autentiseringsuppgifter, båda nycklarna och ett instans-id — och starta den. Compose vägrar starta förrän varje obligatoriskt värde är satt, i stället för att komma upp med en platshållare som misslyckas senare på ett sätt som är svårt att läsa.

Image-taggen måste vara den version main kör, och båda nycklarna måste kopieras exakt. En skillnad i någon av dem visar workern som Mismatch och den tar inte emot något arbete.

## Läsa tabellen Instances

| Kolumn | Betydelse |
|---|---|
| Name | Redigerbar etikett; den stämplas på varje körning som denna instans utför |
| Role | `main` eller `worker`, från miljön |
| Status | **Live** med ett färskt heartbeat, **Offline** efter 30 sekunders tystnad, **Mismatch** när versionen, databasrevisionen eller nycklarna skiljer sig från mains |
| ms | Tur och retur från den instansen till databasen, mätt av instansen själv |
| On | Ta en worker ur rotation utan att stoppa den — pågående körningar slutförs, inga nya tilldelas. Låst till på för main-instansen: arbete med filer, plugin och kodningsagent körs där oavsett vad växeln säger |
| Weight | Dess andel av distribuerbara körningar |

## Körningshistorik

Varje körning i körningshistoriken namnger den instans som utförde den, och båda historikdialogerna kan filtreras ner till en instans. Filtret matchar på instansens id medan det visar dess namn, så att byta namn på en instans skriver inte om vad gamla körningar säger.

Inget av detta visas i en installation med en enda instans: fälten är tomma, ingen etikett visas och inget filter erbjuds.
## Beteende vid fel

**Om en worker avslutas mitt under en körning** blir dess heartbeat inaktuellt och ledarens befintliga återställningssvep kör om körningen på en aktiv instans. Den körad som den hade tagit anspråk på avvecklas separat: när ingen aktiv körning finns för den och en tvåminuters frist har passerat, markerar ledaren raden som misslyckad och väcker den som väntade på resultatet. Enbart ålder är aldrig triggern, så en legitimt lång körning lämnas i fred; och raden markeras som misslyckad i stället för att köas om, eftersom återställningen redan äger omkörningen och en omköning skulle köra samma workflow två gånger.

**Om main går ner** fortsätter cron att avfyras från en worker och distribuerbara körningar fortsätter att köras. Körningar som behöver main köas upp och väntar, och töms när den återkommer — men endast inom fönstret för misfire-frist (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 sekunder som standard). Allt äldre stängs som överhoppat, med orsaken registrerad, i stället för att spela upp timmar av eftersläpning på en gång.

UI, API, MCP och editorn är otillgängliga medan main är nere, eftersom ingress pekar dit.

## Relaterat

- [Köra & distribuera](../getting-started/running-and-deployment.md) – Distribuera en enskild instans först; miljövariablerna och nyckelkonfigurationen finns där
- [Inställningar](./user-settings.md) – Fliken Instances, och vem som kan se den
- [Spårningar](../tabs/traces-tab.md) – Jämför verkliga körtidslängder mellan instanser innan uppdelningen ändras
- [Säkerhet](./security.md) – Varför varje instans måste dela `SECRET_KEY` och `ENCRYPTION_KEY`
