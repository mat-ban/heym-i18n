# Rýchly panel

**Rýchly panel** je panel rýchleho spúšťania workflowov na pravej strane. Zobrazuje sa na autentifikovaných stránkach, ako je karta [Workflowy](../tabs/workflows-tab.md) na dashboarde, Dokumentácia a Evals.

## Prístup

- Kliknite na pevný trigger **Quick / Workflows** na pravom strednom okraji obrazovky
- Ak je dostupný aj [Contextual Showcase](./contextual-showcase.md), jeho trigger **Page Guide** sa nachádza nad Quick Workflows
- Panel sa otvára sprava a posúva aktuálnu stránku doľava s jemným preškálovaním
- Na mobilných zariadeniach je Rýchly panel skrytý
- Panel sa nezobrazuje v editore workflowov, na prihlasovacích/registračných stránkach, v portáli ani na stránkach HITL review

## Vyhľadávanie workflowov

Pomocou filtračného poľa v hornej časti panela vyhľadávajte workflowy podľa:

- Názvu workflowu
- Popisu workflowu

Vyhľadávanie nerozlišuje veľkosť písmen a zoznam aktualizuje okamžite.

## Pripnuté workflowy

Pripnite workflowy, aby zostali v hornej časti panela.

- Pripnuté workflowy sa zobrazujú vo vlastnej sekcii nad úplným zoznamom
- Nové pripnutia sa pridávajú navrch
- Poradie pripnutí sa zachováva pri opätovnom načítaní v úložisku prehliadača

## Spúšťanie workflowov

Vyberte workflow na otvorenie jeho vstupného formulára.

- Vstupné polia sa zobrazujú vertikálne v poradí panela
- Kliknutím na **Run Workflow** spustíte vybraný workflow
- Kliknutím na **Stop Workflow** zrušíte bežiace spustenie z panela
- Workflowy bez vstupných polí je možné spustiť priamo
- Workflow, ktorý začína uzlom [File Upload Trigger](../nodes/file-upload-trigger-node.md), namiesto toho zobrazí zónu na presunutie: presuňte do nej súbor alebo kliknutím súbor vyberte. Zóna uvádza typy a veľkosť súborov, ktoré trigger prijíma, a ostatné súbory pred nahraním odmietne. Tlačidlo **Run Workflow** zostáva neaktívne, kým nie je vybraný súbor.

Panel používa rovnaké API na spúšťanie workflowov ako ostatné spúšťacie rozhrania v Hey m, takže výstupy a správanie za behu zostávajú konzistentné.

Zastavenie spustenia z panela zároveň zruší aktívne spustenie na backende, vrátane akéhokoľvek prebiehajúceho Playwright browser jobu pre dané spustenie workflowu.

## Priebeh a výsledky

Po spustení behu panel zobrazuje:

- Streamovaný priebeh krokov pre uzly počas ich spúšťania a dokončovania
- Konečný stav: `success`, `error` alebo `pending`
- Konečné výstupy v kompaktnom JSON paneli
- Záznamy v Histórii označené ako `Quick Drawer`

`pending` znamená, že workflow čaká na neskoršiu akciu, ako je napríklad ľudská kontrola.

Spustenia z Quick Draweru sú produkčné spustenia, takže workflow s [limitom súbehu](./webhooks.md#concurrency-limit-and-queued-runs) ich môže nechať čakať. Kým spustenie čaká v rade, stav hlási **Waiting in queue (2/5)**; keď sa spustenie začne, zmení sa na "running" a po skončení zobrazí výsledok bez postupného krokového priebehu. Spustenie, ktoré v rade expirovalo alebo bolo počas čakania zrušené, končí ako `error`.

Spustenie so súborom prebieha cez jednorazový nahrávací odkaz triggera: panel požiada workflow o odkaz, nahrá naň súbor a po dokončení nahrávania zobrazí výsledok. Spustenia so súborom zobrazujú konečný stav a výstupy, ale nie priebeh krok za krokom, a v histórii sú takisto označené značkou `Quick Drawer`. Vybraný súbor sa po každom spustení vymaže, pretože jeden odkaz prijíma iba jeden súbor.

## Úložisko prehliadača

Rýchly panel ukladá osobné preferencie do `localStorage`:

- ID pripnutých workflowov
- Naposledy vybraný workflow

Panel v tejto verzii **neukladá** vstupné hodnoty.

## Rozsah

Rýchly panel je zámerne odľahčené rozhranie na spúšťanie.

- Zahrnuté: vyhľadávanie, pripínanie, výber, vstup (vrátane súboru), spustenie, priebeh, výsledok
- Vylúčené: vytváranie workflowov, úpravy, správa priečinkov a akcie na plátne

## Súvisiace

- [Karta Workflowy](../tabs/workflows-tab.md) – Hlavný zoznam workflowov, priečinky a správa
- [Rýchly štart](../getting-started/quick-start.md) – Vytvorte a spustite svoj prvý workflow
- [História spustení](./execution-history.md) – Prehľad minulých behov
- [Webhooks](./webhooks.md) – Spúšťanie workflowov cez HTTP
- [Contextual Showcase](./contextual-showcase.md) – Návodný panel na úrovni stránky, ktorý dopĺňa Rýchly panel
