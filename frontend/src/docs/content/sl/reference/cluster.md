# Porazdelitev obremenitve

Usmerite drugo instanco Heym na isto bazo PostgreSQL in se pridruži kot delavec. Zaledni workflow se nato deli med instancami v odstotku, ki ga nastavite, tako da stroj, ki nudi UI in API, ni edini stroj, ki izvaja vsak workflow.

Instanca nikoli ne komunicira med seboj. Postgres prenaša delo, zato delavec ne potrebuje odprtega porta, certifikata ali poti nazaj do glavne instance — le dostop do baze podatkov.

## Vloge

Ena instanca je **glavna**, določena z okoljsko spremenljivko. Nudi UI, API, MCP in portal za klepet ter upravlja s shrambo datotek in nameščenimi vtičniki. Vsaka druga instanca je **delavec**: dostopa le do baze podatkov in izvaja zaledne naloge.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # ali: worker
HEYM_INSTANCE_NAME=EU Main    # prikazno ime, kasneje urejeno v Nastavitvah
HEYM_INSTANCE_ID=eu-main      # neobvezno; izpeljano iz imena, ko je prazno
```

Glavna vloga je ločena od izbire vodje. Heym že izbere enega vodjo v okviru gruče, ki upravlja s cron, vrednotenjem opozoril in obnovitvijo po zrušitvi; če glavna instanca preneha delovati, vodstvo preide na delavca v nekaj sekundah in načrtovane naloge se še naprej izvajajo. Glavna vloga se ne premika, ker shranjevanje datotek ne more preiti z njo.

## Kaj lahko zapusti glavno instanco

Postavitev se odloči na podlagi vozlišč workflow pred začetkom izvajanja. Izvajanje ostane na glavni instanci, ko katero koli vozlišče v njem — vključno z vozlišči znotraj pod-workflow, ki jih kliče — dostopa do nečesa, kar obstaja le na enem stroju:

| Vozlišče | Zakaj ostane na glavni instanci |
|---|---|
| Codex, OpenCode Go | Delovno okolje kodirnega agenta ostane na lokalnem disku, da se lahko nadaljuje |
| Agent s priloženo veščino | Koda veščine bere in piše na Heym Drive |
| Drive, Pretvornik, Google Drive | Berejo in pišejo generirane datoteke |
| Trigger za nalaganje datotek | Naložena datoteka pristane na disku glavne instance |
| Pošlji e-pošto | Korporativni SMTP posredniki običajno dovolijo en vir naslov |
| Vozlišča vtičnikov | Vtičnik je nameščen na disku ene instance |

**Vse ostalo je razdeljeno** — vključno z vozliščem Code, Playwright in orodji Agent Python. Vsaka instanca izvaja isto sliko s svojim Docker vtičnikom, zato peskovnik ni razlog za ohranjanje izvajanja na glavni instanci, in to so najbolj procesorsko zahtevna vozlišča v produktu.

Workflow, katerega pod-workflow je izbran z izrazom, ni mogoče pregledati vnaprej, zato ostane na glavni instanci.

## Izbira odstotkov

Teže so cela števila, nastavljena pod **Nastavitve → Instance**. So **deleži tistih instanc, ki trenutno lahko prevzamejo delo**, ne odstotki od 100: načrtovalnik deli po skupnem znesku te skupine.

Ta razlika se pokaže takoj, ko ena instanca izpade. Z `Main 41, Worker A 26, Worker B 33`, izklop Worker B pusti skupino 67, tako da Main dejansko prejme 41/67 = **61%** in Worker A 26/67 = **39%**. Plošča izpiše učinkovito delitev pod tabelo iz tega razloga, in shranjevanje nikoli ni blokirano, ker se številke ne seštejejo na 100 — le delitev, kjer nobena omogočena instanca nima teže, je zavrnjena.

Še dve stvari je enostavno zamešati.

**Odstotek ni delež strojne moči.** Pokriva le izvajanja, ki gredo skozi čakalno vrsto. Nudenje UI in API, izvajanje v realnem času in obvladovanje nalaganja datotek so vse naloge glavne instance in nič od tega ni šteto. Glavna instanca dela več, kot pravi njena številka.

**Odstotek glavne instance je strop, ne dno.** Izvajanja, ki se lahko izvajajo le na glavni instanci, se obračunajo proti njenemu kvotu, tako da, ko je ta kvota porabljena, preostala razdeljiva izvajanja padejo na delavce. Nastavitev nizke številke za glavno instanco je varna — delo, ki mora teči tam, se še vedno izvaja. Nastavitev visoke številke pa stradava delavce.

Torej z močno glavno instanco in manjšim delavcem začnite bližje 60/40 kot surovemu razmerju strojev, nato primerjajte dejanske trajanje izvajanj na zavihku Izvajanja in prilagodite.

Teže se ponovno normalizirajo med trenutno aktivnimi in omogočenimi instancami. Z `main=70, A=15, B=15`, če A izpade, se delitev spremeni v 70/85 in 15/85 med glavno in B, in se vrne na 70/15/15, ko se A vrne.

**Instanca, ki se vrne, ni dolžna izvajanj, ki jih je zamudila.** Čas, preživet v načinu Offline, Onemogočeno ali na nezdružljivi različici, se ne šteje proti njej, tako da se delavec, ki je preživel noč nedostopen, ponovno pridruži trenutni poziciji skupine in delitev se ponovno bere 70/30 od njegove prve izvedbe — ne absorbira vsakega izvajanja, dokler ne ujame. Delavec, ki je bil na voljo ves čas, se še vedno ujema, kar pomeni, da je odstotek glavne instance strop.

### Nova instanca se pridruži z ničlo

Instanca, ki nikoli ni bila dodeljena teži, začne pri 0, kar bi jo pustilo Aktivno, Omogočeno in ne prejema ničesar. **Samodejno dodelite delež novim instancam** — privzeto omogočeno, pod tabelo instanc — to reši: ob naslednjem pregledu vodje novinec dobi enak delež skupine, obstoječe teže pa se zmanjšajo, pri čemer ohranjajo razmerja med seboj, tako da se namerna 70/30 še vedno bere kot približno 70/30. Skupaj ostane natančno 100.

To se izvede **enkrat na instanco**. Tako samodejni pregled kot vaša lastna ureditev označita instanco kot konfigurirano, tako da instanca, ki jo nastavite sami, nikoli ne bo spremenjena brez vašega vedenja — vključno z eno, ki ste jo namerno nastavili na 0. Izklopite nastavitev, če bi raje, da vsaka nova naprava čaka na vas.

Sodelujejo le omogočene, aktivne in združljive instance. Dodelitev deleža napravi, ki ne more izvajati ničesar, bi pustila ta delež brez dela.
### Kdaj odstotki ne morejo pomagati

Nastavitvena plošča poroča, koliko zadnjih 24-urnih izvajanj je bilo mogoče izvesti le na glavnem vozlišču. Če je ta številka visoka — obremenitev, ki je močno odvisna od Codexa ali Drive-a — bodo delavci ostali neaktivni, ne glede na to, kaj pravijo uteži, in odgovor je večje glavno vozlišče namesto več manjših.

## Dimenzioniranje PostgreSQL za klaster

Povezave se povečujejo s številom vozlišč, ne le uporabnikov. Vsako vozlišče izvaja več procesov uvicorn, vsak proces pa ima povezovalni bazen plus štiri `LISTEN` povezave (preklic, prebujanje vrste, rezultati izvajanja, chat tokovi). Odprti chat tokovi delijo eno chat povezavo, zato ne dodajajo povezav do baze podatkov. Klaster s tremi vozlišči pri privzetem `max_connections = 100` zmanjša število povezav, in Heym nato ne more doseči svoje baze podatkov.

Približno proračunajte `instances x processes x (async pool + sync pool + 4)` in nastavite `max_connections` nad to vrednost.

Zmanjšajte bazene namesto da bi le dvignili strop. Enotna namestitev privzeto uporablja 10+20 asinhronih in 5+10 sinhronih povezav na proces, kar je velikodušno za eno napravo in preveč za klaster:

| Spremenljivka | Enotno vozlišče | Klaster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Primer datoteke za sestavljanje nastavi te vrednosti in `max_connections = 300`. To zmanjša strop povezav klasterja s tremi vozlišči s 768 na 192, pri čemer tri vozlišča ostanejo pod 300.

## Zahteve, ki jih klaster ne more uveljaviti namesto vas

**Vsako vozlišče mora uporabljati enak `SECRET_KEY` in `ENCRYPTION_KEY`.** Delavec z drugačnim `ENCRYPTION_KEY` ne more dešifrirati poverilnic, in vsako izvajanje, ki uporablja poverilnice, bi spodletelo z napako, ki ne navaja nič koristnega. Heym primerja digest obeh ključev pri vsakem srčnem utripu, skupaj z različico aplikacije in revizijo baze podatkov, in označi neusklajeno vozlišče kot **Mismatch**, tako da ne prejme nobenega dela. Obremenitev se vrne na glavno vozlišče, dokler tega ne popravite.

To prav tako določa vrstni red nadgradnje. Nadgradnja glavnega vozlišča najprej označi vsakega delavca kot nezdružljivega; delo se vrne na glavno vozlišče, in vsak delavec se ponovno pridruži, ko je nadgrajen. Počasnejše, vidno in reverzibilno.

**Usmerite dostop samo na glavno vozlišče.** Krožno usklajevanje uporabniškega prometa med vozlišči bi poslalo nalaganje datoteke na eno napravo in njeno prenos na drugo. Nič v kodi tega ne preprečuje, ker delavec izvaja isto sliko in bo odgovoril na vsako zahtevo, ki jo prejme.

**Vsako vozlišče potrebuje `FRONTEND_URL`, nastavljen na isto javno naslov.** Izvajanje, ki se ustavi za človeški pregled, ustvari svoj povezavo za pregled na vozlišču, ki ga je izvedlo, ne na glavnem, in enako velja za povezave za nadaljevanje Codexa in za URL-je za prenos ustvarjenih datotek. Delavec, ki ostane brez tega, gradi te povezave proti svojemu lokalnemu naslovu, in kdorkoli prejme eno, je ne more odpreti.

**Delavska vozlišča imajo drugačen odhodni IP.** Vsaka API, ki dovoljuje seznam virov, vidi nov. Pošiljanje e-pošte deluje na glavnem vozlišču prav iz tega razloga; za HTTP vozlišče bodisi dajte klasterju en sam NAT izhodni naslov ali dovoljenjite vsako vozlišče.

## Dodajanje delavca na drugo napravo

`docker-compose.worker.yml` v korenu repozitorija zažene delavca na svojem gostitelju. Nima baze podatkov in uporabniškega vmesnika: dostopa do PostgreSQL glavnega vozlišča in prevzame svoj delež ozadja.

Izpolnite `.env` poleg njega - oznaka slike, gostitelj baze podatkov in poverilnice, oba ključa in ID vozlišča - in ga zaženite. Sestavljanje zavrne zagon, dokler niso nastavljene vse zahtevane vrednosti, namesto da bi se pojavila zamenjava, ki kasneje ne uspe na način, ki je težko berljiv.

Oznaka slike mora biti različica, ki jo izvaja glavno vozlišče, in oba ključa morata biti natančno kopirana. Razlika v katerem koli od njih prikaže delavca kot Mismatch in ne prejme dela.

## Branje tabele Instances

| Stolpec | Pomen |
|---|---|
| Ime | Urejen oznaka; natisne se na vsako izvajanje, ki ga to vozlišče izvede |
| Vloga | `main` ali `worker`, iz okolja |
| Status | **Živ** z novim srčnim utripom, **Izklopljen** po 30 sekundah tišine, **Mismatch** ko se različica, revizija baze podatkov ali ključi razlikujejo od glavnega |
| ms | Čas potovanja od tega vozlišča do baze podatkov, izmerjen s samim vozliščem |
| Na | Odstranite delavca iz rotacije, ne da bi ga ustavili — končana izvajanja, nobena nova niso dodeljena. Zaklenjeno za glavno vozlišče: delo z datotekami, vtičniki in kodirnimi agenti se izvaja tam, ne glede na to, kaj pravi stikalo |
| Utež | Njegov delež razpoložljivih izvajanj |

## Zgodovina izvajanja

Vsako izvajanje v zgodovini izvajanja imenuje vozlišče, ki ga je izvedlo, in oba pogovorna okna zgodovine lahko filtrirata do enega vozlišča. Filter se ujema z ID-jem vozlišča, medtem ko prikazuje njegovo ime, tako da preimenovanje vozlišča ne prepiše, kaj pravijo stara izvajanja.

Nič od tega se ne prikaže pri namestitvi z enim vozliščem: polja so prazna, oznaka se ne prikaže in filter ni na voljo.
## Obnašanje ob napaki

**Če delavec umre med izvajanjem**, njegov srčni utrip postane zastarel in vodja ponovno izvede izvajanje na aktivni instanci. Vrstica v čakalni vrsti, ki jo je prevzel, se ločeno umakne: ko ne obstaja aktivno izvajanje zanj in mine dve minuti milosti, vodja označi vrstico kot neuspešno in obudi tiste, ki so čakali na rezultat. Starost sama po sebi nikoli ni sprožilec, zato se legitimno dolga izvajanja pustijo pri miru; vrstica se označi kot neuspešna namesto da bi se ponovno dodala v čakalno vrsto, ker okrevanje že prevzema ponovni zagon, ponovna dodajanja v čakalno vrsto pa bi izvajala isti workflow dvakrat.

**Če glavni sistem preneha delovati**, cron še naprej deluje iz delavca in distribuirana izvajanja se nadaljujejo. Izvajanja, ki potrebujejo glavni sistem, se zberejo in čakajo, ter se izpraznijo, ko se vrne — vendar le znotraj okna milosti za napačno aktivacijo (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, privzeto 600 sekund). Vse, kar je starejše, se označi kot preskočeno, z razlogom zabeleženim, namesto da bi se enkrat predvajalo ure zamude.

Uporabniški vmesnik, API, MCP in urejevalnik niso na voljo, medtem ko glavni sistem ne deluje, ker so to vstopne točke.

## Sorodno

- [Zagon in namestitev](../getting-started/running-and-deployment.md) – Najprej namestite eno instanco; okoljske spremenljivke in nastavitev ključev so tam
- [Nastavitve](./user-settings.md) – Zavihek Instances in kdo ga lahko vidi
- [Izvajanja](../tabs/traces-tab.md) – Primerjajte dejanske trajanje izvajanj med instancami pred spremembo delitve
- [Varnost](./security.md) – Zakaj mora vsaka instanca deliti `SECRET_KEY` in `ENCRYPTION_KEY`
