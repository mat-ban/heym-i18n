# Heym Work

**Heym Work** je drugi vmesnik za poslovne ekipe, zgrajen na platformi Heym. Uporabniki z lastnimi besedami opišejo nalogo, odgovorijo na nekaj vprašanj in prejmejo workflow, ki ga je Heym zgradil in preizkusil. Delajo na straneh, prilagojenih njihovim potrebam, potrjujejo preglede in spremljajo vsak zagon z navedbo odgovorne osebe. Heym vsako nalogo izvaja v ozadju.

Heym Work deluje kot samostojen vsebnik ob Heymu z ločeno licenco ekipe Heym. Izvedite več in zahtevajte preskusno različico na [heym.run/enterprise](https://heym.run/enterprise). Oglejte si [video o Heym Work](https://youtu.be/5Z2gGo6bcpU) za dvominutni pregled.

## Kaj pridobijo poslovne ekipe

| Področje | Delovanje |
|----------|-----------|
| **Chat** | Opišite nalogo z besedilom ali glasom. Heym povpraša po potrebnih podatkih, zgradi workflow, ga preizkusi in označi kot Preverjeno. |
| **Flows** | Uredniki sestavijo flow iz izbir namesto na canvasu: kaj ga zažene, neobvezen osnutek AI in dejanja v Slacku, Google Sheets ter e-pošti. Odgovori iz Slacka nadaljujejo zagon, odobritve pa čakajo tudi v Dejavnosti. Glejte [Flows](#flows). |
| **Strani** | Pripete strani z gradniki: števila, grafikoni, tabele s statusnimi oznakami, polja za odlaganje datotek in odobritve. Vrstica tabele lahko odpre lastno stran s podrobnostmi. |
| **Odobritve** | Pregledi iz korakov [Human-in-the-Loop](./human-in-the-loop.md) čakajo v Dejavnosti in na straneh, z možnostmi Odobri, Zahtevaj spremembe in Zavrni. |
| **Dejavnost** | Vsak zagon z navedbo osebe, ki ga je sprožila, in primerka, ki ga je izvedel. |
| **Vloge** | Lastnik, Urednik in Gledalec. Prijava poteka prek mehanizma [Single Sign-On](./sso.md), ki ga Heym že uporablja. |
| **Panogerske izdaje** | Izdaje za pravne službe, izobraževanje, finance, logistiko, energetiko in e-trgovino se odprejo s pripravljenimi stranmi, vzorčnimi podatki in namenskimi delovnimi tokovi. |

## Flows

**Flows** je v meniju Heym Work za Urednike in Lastnike. Flow je sestavljen iz izbir namesto iz vozlišč, Heym Work pa ga shrani kot običajen Heym workflow prek Heym API v imenu osebe, ki ga je ustvarila. Pravila dostopa, zgodovina urejanja in sinhronizacija sprožilcev Heyma veljajo tako kot v urejevalniku, vsak zagon pa se v Dejavnosti prikaže kot kateri koli drug.

| Del | Izbire |
|---|---|
| **Kaj ga zažene** | Na zahtevo, po urniku, ob sporočilu v Slacku, ko se spremeni zavihek Google Sheets (vrstice dodane, spremenjene ali izbrisane) ali ko e-pošta doseže nabiralnik. Sprožilci za preglednice in e-pošto preverjajo vsakih 1, 5, 15 ali 60 minut. |
| **Osnutek AI** (neobvezno) | Model in navodila pretvorijo to, kar je zagnalo flow, v besedilo za naslednje korake. Flow, ki se ne začne iz preglednice ali e-pošte, lahko najprej prebere nedavna sporočila Slack iz kanala ali niti. |
| **Kaj se zgodi potem** | Dejanja po vrstnem redu v katerem koli od treh orodij, ne glede na to, kaj je zagnalo flow. **Slack:** sporočilo v kanalu, neposredno sporočilo, obrazec, sporočilo z gumbi, odobritev, odgovor v niti, posodobitev sporočila in končni izid. **Google Sheets:** dodajte vrstico ali posodobite spremenjeno vrstico. **E-pošta:** pošljite e-pošto. |

- **Odgovori nadaljujejo zagon.** Odobritev, gumbi ali obrazec začasno ustavijo zagon, dokler nekdo ne odgovori v Slacku. Odobritev čaka tudi v Dejavnosti, odločitev na katerem koli mestu pa odstrani gumbe iz sporočila Slack. Kasnejši koraki Slacka ostanejo v niti prvega sporočila.
- **Ena sama kartica Povezave.** Vsak flow prikazuje delovni prostor Slacka, račun Google Sheets in poštne predale, iz katerih bere in s katerimi pošilja. To so poverilnice Heyma: **Slack Bot** (žeton bota, `xoxb-…`), **Google Sheets**, **IMAP** in **SMTP**; manjkajočo poverilnico lahko dodate neposredno iz samega flowa.
- **Ena aplikacija Slack za vsak flow.** V aplikaciji Slack nastavite URL zahteve za interaktivnost na `https://<vaš Heym>/api/slack/interactions/<id poverilnice>` in URL zahteve za naročnino na dogodke na `https://<vaš Heym>/api/slack/events/<id poverilnice>`. Heym Work prikazuje oba za izbrano povezavo. Vsi flowi na tej poverilnici si ju delijo.
- **Sprožilci Slacka izberejo, kaj poslušajo:** sporočila v kanalih in neposrednih sporočilih, neposredna sporočila botu, omembe bota ali sporočila v enem samem kanalu. Lastne objave bota nikoli ne zaženejo flowa.
- **Zahteve.** Flows zahtevajo Heym 0.0.131 ali novejši.

Koraki, ki jih zgradi flow, so ista vozlišča, ki jih lahko uporabite na canvasu: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) in [Cron](../nodes/cron-node.md).

## Povezovanje Heym Work

Oglejte si [namestitveni video](https://youtu.be/zXGfg1HPSLk) za celoten postopek namestitve, od prvega ukaza do začetne strani.

Povezava se konfigurira v **Nastavitve → Heym Work**. Zavihek je viden le skrbnikom primerka, navedenim v spremenljivki `HEYM_ADMIN_EMAILS`.

| Polje | Delovanje |
|-------|-----------|
| **Naslov Heym Work** | Naslov, kjer deluje Heym Work, na primer `https://work.example.com`. Prijava se preusmeri tja. Kliknite **Shrani**. |
| **Integracijski ključ** | Gumb **Ustvari ključ** ustvari ključ, ki ga Heym Work uporablja za vsako zahtevo na Heym. Prikaže se le enkrat z gumbom za kopiranje. Heym shrani le njegov zgoščeni niz (hash). |
| **Omogoči Heym Work** | Vklopi povezavo. Pred tem zahteva vnos naslova in ključa. |
| **Izdaje za industrije in ekipe** | Izdaje za pravo, izobraževanje, finance, logistiko, energijo in e-trgovino ter izdaje IT, prodaje, trženja in kadrov za ekipe podjetij se odprejo s stranmi, vzorčnimi podatki in workflowi za to delo. |

Nato odprite naslov Heym Work in dokončajte nastavitev:

1. **Licenca**: vnesite licenčni ključ, ki ga je izdala ekipa Heym.
2. **Heym**: vnesite naslov Heyma in integracijski ključ.
3. **Lastnik**: prijavite se z računom, navedenim kot Lastnik Heym Work.

Odpre se začetna stran, pripravljena za delo ekipe.

### Zamenjava ključa

Možnost **Zamenjaj ključ** zamenja integracijski ključ. Heym Work preneha delovati, dokler se tam ne vnese nov ključ, vsi prijavljeni uporabniki v Heym Work pa so odjavljeni. Uporabite to možnost v primeru suma uhajanja ključa ali ko sodelavec z dostopom zapusti ekipo.

### Onemogočanje povezave

Izklopite stikalo **Omogoči Heym Work**, da prekinete povezavo. Heym Work bo v tem primeru znova zahteval ključ Heyma. Heym v vsakem primeru nemoteno nadaljuje z izvajanjem vseh delovnih tokov, urnikov in spletnih kljuk (webhook).

## Varnostni model

- **Vsaka sprememba poteka skozi Heym.** Heym Work bere prikazane podatke iz Heymove baze podatkov in vsako dejanje pošilja v Heym prek kanala, zaščitenega s ključem, kjer Heym uveljavlja svoja pravila dostopa. Heym Work hrani lastne podatke v ločeni shemi `heym_work`.
- **Ključ je v mirovanju zgoščen.** Heym primerja hash predloženega ključa in samega ključa nikoli ne shrani v odprti obliki.
- **Prijava ostaja pri Heymu.** Uporabniki se prijavljajo prek Heyma z uporabo vašega ponudnika identitete, ko je [SSO](./sso.md) vklopljen.
- **Spremembe se revidirajo.** Shranjevanje povezave in zamenjava ključa zabeležita vrstici `work_integration.update` in `work_integration.key_rotate` v [revizijski dnevnik](./audit.md).

## Licenciranje

Heym Work potrebuje lasten licenčni ključ, ki ga izda ekipa Heym. Heym Work dnevno posreduje strežniku heym.run svoj ID licence, ID namestitve, število aktivnih uporabnikov v zadnjih 30 dneh, skupno število članov, število zagonov v zadnjih 24 urah ter različici Heym in Heym Work. Vsebina delovnih tokov, vhodi, izhodi in poverilnice ostajajo na vaših lokalnih strežnikih.

Če dnevna sinhronizacija ne uspe 30 zaporednih dni, nastopi 14-dnevno obdobje odloga, po katerem vmesnik Heym Work od Lastnika zahteva ključ. Preskusna različica velja do svojega zadnjega dne in se nadaljuje ob podaljšanju s strani ekipe Heym (dovoljen je en preskus na namestitev). Sam Heym ves čas deluje neprekinjeno. Omrežja brez dostopa do interneta uporabljajo licenco brez povezave prek enterprise@heym.run.

## Videoposnetki

Vsi videoposnetki o Heym Work so zbrani na [seznamu predvajanja Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Povezane teme

- [Enterprise](./enterprise.md): Komercialno licenciranje in podpora
- [Single Sign-On](./sso.md): Prijava, ki jo uporablja Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Pregledi, prikazani v Heym Work
- [Dnevnik revizije](./audit.md): Zapisi ob spremembah povezave
- [Nastavitve](./user-settings.md): Kje se nahaja zavihek Heym Work
