# Kartica Upozorenja

Kartica **Upozorenja** omogućuje vam definiranje uvjetnih pragova unutar vremenskog okvira i obavještavanje kada su ti pragovi prekoračeni. Heym već bilježi rezultate izvršavanja, trajanje izvođenja i troškove LLM-a, ali nikada to ne nudi bez zahtjeva. Upozorenje je način na koji to tražite.

Svako upozorenje se procjenjuje unutar **vremenskog okvira** koji odaberete, nikada na temelju jednog događaja. Jedno neuspješno izvršavanje je šum. Dvanaest neuspješnih izvršavanja u deset minuta je incident.

## Tipovi Upozorenja

| Tip | Pitanje na koje odgovara | Odakle dolazi broj |
|---|---|---|
| **Prag pogreške** | Je li ovo neuspjelo više od N puta u okviru? | Redovi [povijesti izvršavanja](../reference/execution-history.md) s statusom pogreške |
| **Trajanje workflow-a** | Je li izvršavanje postalo sporije od očekivanog u okviru? | Vrijeme izvršavanja, agregirano kao maksimum, prosjek ili 95. percentil |
| **Trošak Tokena / USD** | Je li trošak prekoračio proračun u okviru? | [LLM tragovi](./traces-tab.md) plus tablica troškova LLM-a |
| **Broj izvršavanja** | Je li ovo izvršavanje bilo daleko češće nego što bi trebalo? | Broj redova povijesti izvršavanja |

### Prag pogreške

Broji neuspješna izvršavanja unutar okvira i aktivira se kada broj dostigne vaš prag. Budući da se broji unutar okvira umjesto da se povezuje s svakim neuspjehom, jedna prolazna pogreška vas neće obavijestiti.

### Trajanje workflow-a

Mjeri trajanje izvršavanja unutar okvira. Odaberite **maksimum** (najsporije izvršavanje), **prosjek** ili **p95**. P95 broj koristi istu proračunsku metodu percentila kao i [Kartica analitike](./analytics-tab.md), tako da upozorenje i grafikon latencije nikada ne proturječe jedni drugima za isti okvir.

**Minimalni broj izvršavanja u okviru** održava ovo poštenim. Najsporije izvršavanje u gotovo praznom okviru je samo to jedno izvršavanje, pa postavljanje minimuma, recimo, 3 sprječava aktivaciju upozorenja zbog šuma.

### Trošak Tokena / USD

Zbraja troškove LLM-a unutar okvira, bilo kao ukupne tokene ili kao američke dolare. Iznosi u dolarima se obračunavaju putem iste tablice cijena koju koriste [Kartica tragova](./traces-tab.md) i [Tablica troškova LLM-a](./datatable-tab.md#llm-cost-table-system-table), tako da upozorenje o troškovima i stranica troškova uvijek slažu.

Kada je opseg svih vaših workflow-a, to uključuje LLM pozive napravljene izvan workflow-a, kao što su [Kartica chata](./chat-tab.md) i [AI Asistent](../reference/ai-assistant.md). Korištenje kodirajućih agenata (Codex, OpenCode) nije uključeno.

Modeli bez redova cijena se u kontekstu upozorenja izvještavaju kao neocijenjeni umjesto da se tiho broje kao nula.

### Broj izvršavanja

Broji izvršavanja bilo kojeg statusa unutar okvira. Ovo je ono što hvata pogrešan trigger: workflow koji obično radi 20 puta na sat iznenada se izvršava 2,000 puta. Zapis o aktivaciji uključuje razdvajanje po izvoru triggera, jer je to obično odgovor na pitanje "zašto se ovo dogodilo".

## Opseg

Upozorenje prati ili **jedan workflow** ili **sve vaše workflow-e**.

"Svi vaši workflow-i" znači svaki workflow kojem vlasnik upozorenja može pristupiti. Namjerno ne znači svaki workflow na Heym instanci: upozorenja se mogu dijeliti, a dijeljenje upozorenja ne bi trebalo omogućiti nekome pristup agregiranim brojevima za workflow-e koje ne mogu otvoriti.

## Čarobnjak

Kreiranje upozorenja prolazi kroz pet koraka.

1. **Tip** — odaberite jedan od četiri navedena.
2. **Opseg** — jedan workflow ili svi.
3. **Uvjet** — vremenski okvir, plus polja praga za taj tip.
4. **Odgovor** — što se pokreće kada se aktivira, i koliko često da vas obavještava.
5. **Pregled** — imenujte ga i pogledajte povratno testiranje.

### Povratno testiranje

Korak Pregled odgovara na pitanje koje zapravo ima značaj prije nego što spremite: *u posljednja 24 sata, koliko bi često ovo bilo aktivirano?*

Izvještava o broju aktivacija i najvišoj zabilježenoj vrijednosti u odnosu na vaš prag. Ako kaže da bi se uvjet aktivirao 400 puta, ispravite prag prije spremanja umjesto nakon što vas obavijeste. Možete proširiti vremenski okvir na 3 ili 7 dana.

## AI Nacrt

Na vrhu prvog koraka nalazi se okvir u kojem opisujete što želite jednostavnim jezikom:

> Upozorite me ako sinkronizacija računa ne uspije više od 5 puta u 10 minuta

Heym to pretvara u definiciju upozorenja, popunjava svaki korak koji može, i unaprijed označava polja ispunjena AI-jem, tako da potvrđujete umjesto da ponovo upisujete. Potpuni zahtjev vas dovodi do Pregleda.

**Djelomični zahtjev vas i dalje pomiče naprijed.** Recite samo "upozorite me ako ne uspije 5 puta" i dobit ćete upozorenje o pragu pogreške s ispunjenim brojem, zadanim vrijednostima za ostalo, a čarobnjak se otvara na prvom koraku koji još treba vašu intervenciju: u tom slučaju Opseg, jer nijedan workflow nije imenovan. Napomena na vrhu kaže što je ostalo za odlučiti. Nikada ne blokira Dalje ili Kreiraj.

Isto vrijedi kada model imenuje workflow kojem ne možete pristupiti, ili vraća uvjet s nedostajućim poljima. Dijelovi koji imaju smisla se zadržavaju, a ostalo se vraća na zadane vrijednosti za taj tip upozorenja, a vi prilagođavate odatle. Ništa ovdje ne zaobilazi validaciju: pravila čarobnjaka i API ponovno provjeravaju upozorenje kada ga spremite.
## Ponovno ponašanje

Kada se upozorenje aktivira, ulazi u stanje aktivacije. Što se događa sljedeće, Vaš je izbor u koraku 4.

- **Obavijesti jednom, dok se ne oporavi** (zadano) — aktivira se jednom, a zatim ostaje tiho dok uvjet traje. Kada se metrika vrati ispod praga, upozorenje se vraća u stanje OK i postaje ponovno sposobno za aktivaciju. Oporavak je promjena stanja, a ne događaj: ne stvara zapis o aktivaciji i ne pokreće workflow za obavijest.
- **Nastavi obavještavati u intervalu** — ponovno se aktivira svakih N minuta sve dok uvjet traje.

Zadano postoji jer bi pokvareni workflow koji se provjerava svake 60 sekundi inače proizveo 60 aktivacija na sat, što je način na koji se obavijesti prigušuju.

## Pokretanje Workflowa na Aktivaciji

Korak 4 nudi tri odgovora na pitanje "što bi se trebalo dogoditi kada se ovo aktivira":

- **Stvorite i dodijelite novi workflow** (zadano) — spremanje upozorenja također stvara workflow pod nazivom *"&lt;ime upozorenja&gt; obavijest"* i povezuje ga. Dolazi s ulaznim čvorom čija su polja točno onakva kao što je payload ispod, tako da se `$alert.body.observed_value` i ostalo odmah rješava i samo trebate priključiti čvor koji isporučuje poruku. **Idite na workflow** na kartici upozorenja otvara ga. Ovo je zadano jer je lako propustiti upozorenje koje se aktivira u ništa.
- **Odaberite postojeći workflow** — pokrenite nešto što ste već izgradili.
- **Ne radite ništa** — aktivacija se i dalje bilježi na kartici, samo ne pokreće ništa.

Payload upozorenja dolazi kao ulazno tijelo tog workflowa:

```json
{
  "alert_id": "...",
  "alert_name": "Neuspjesi sinkronizacije računa",
  "alert_type": "error_threshold",
  "condition": "5+ grešaka u 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Sinkronizacija računa", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Koji je workflow proizveo broj

`workflows` je jedino mjesto gdje se workflow pojavljuje. Navodi svaki workflow koji je doprinio očitanju, svaki sa svojim `value` — brojem grešaka tog workflowa, brojem izvršavanja, najsporijim izvršavanjem u milisekundama ili potrošnjom, ovisno o vrsti upozorenja. Popis je sortiran prema `value`, od najvećeg prema najmanjem, tako da je `workflows[0]` najgori počinitelj.

To je **uvijek niz**: jedini element pod opsegom jednog workflowa, mnogi pod "svi moji workflowi", i prazan umjesto null kada ništa nije pripisivo. Workflow za obavijest može ga iterirati bez provjere oblika.

Namjerno ne postoji jedinstveni `workflow_id`. Opisuje opseg upozorenja, a ne metriku, pa je bio `null` pod sustavnim opsegom, što je točno slučaj kada je "koji workflow?" najvažnije. `observed_value` ostaje agregat s kojim je uspoređen prag; polja `value` po workflowu objašnjavaju odakle dolazi.

Ovako upozorenja dolaze do Slacka, e-pošte, Telegrama ili bilo gdje drugdje: s [čvorovima](../reference/node-types.md) koje već imate, a ne s odvojenim sustavom obavijesti.

Upozorenje ne može obavijestiti workflow koji prati. To bi bila petlja, najviše očito za upozorenje o broju izvršavanja gdje svaka obavijest dodaje na broj koji mjeri.

Obavijesti se izvršavaju kao obična izvršavanja, pa se pojavljuju u [povijesti izvršavanja](../reference/execution-history.md) poput bilo kojeg drugog izvršavanja. Workflow za obavijest koji ne uspije zabilježen je na aktivaciji, ali nikada ne sprječava da se sama aktivacija zabilježi.

Workflow za obavijest se izvršava kao vlasnik upozorenja, s njihovim vjerodajnicama i globalnim varijablama, točno kao da su ga sami pokrenuli. Odabir workflowa koji vam je netko podijelio ne posuđuje vjerodajnice te osobe. Ako vlasnik izgubi pristup workflowu za obavijest, aktivacija se i dalje bilježi, ali se izvršavanje obavijesti preskoči.

## Povijest Aktivacija

Ispod popisa upozorenja nalazi se povijest aktivacija: što se aktiviralo, kada, očitana vrijednost u odnosu na prag, točan prozor koji je evaluiran i ishod obavijesti.

Priznavanje aktivacije označava redak i mijenja oznaku upozorenja s **Aktivno** na **Priznato**. To je izjava o Vama, a ne o upozorenju: uvjet i dalje traje, a upozorenje se vraća u **OK** samo kada se metrika vrati ispod praga.

Svaki zapis pohranjuje detalje koji su doprinijeli u trenutku kada se aktivirao: neuspješni identifikatori izvršavanja i poruke o grešci, potrošnja po modelu ili razdvajanje izvora okidača. To je namjerno. Prozor je prošao, a ponovna izračunavanja kasnije mogu dati drugačiji odgovor.

Zapisi o aktivacijama čuvaju se 90 dana.

## Postavljanje Pitanja Chatu O Upozorenjima

[Chat kartica](./chat-tab.md) može odgovoriti na pitanja o Vašim upozorenjima:

- "Koja upozorenja imam?"
- "Postoji li upozorenje na workflowu za račune?"
- "Zašto je upozorenje o troškovima aktivirano?"
- "Kada je ovo posljednji put aktivirano?"

Za pitanje "zašto se aktiviralo", Chat citira stvarnu očitanu vrijednost, prag i vremenski prozor iz zapisa o aktivaciji, zajedno s detaljima koji su doprinijeli.

## Dijeljenje

Upozorenja se mogu dijeliti s pojedinačnim korisnicima ili s [timovima](./teams-tab.md). Osobe s kojima dijelite mogu vidjeti upozorenje i njegovu povijest aktivacija. Samo vlasnik može uređivati, pauzirati, brisati ili ponovno dijeliti.
### Kada se ukloni pristup workflowu

Upozorenje na jednom workflowu nastavlja čitati metrike izvršavanja tog workflowa, stoga uklanjanje pristupa nekoj osobi ili timu također određuje što će se dogoditi s njihovim upozorenjima na tom workflowu:

- **Uklanjanje korisnika ili dijeljenje tima** traži od vlasnika workflowa da odluči hoće li također zaustaviti upozorenja tog korisnika ili tima na workflowu. Zaustavljanje je zadano. Zaustavljena upozorenja su pauzirana, a ne izbrisana, i svako od njih se bilježi kao `alert.disable_on_access_revoke` u [audit logu](../reference/audit.md).
- **Uklanjanje člana tima ili brisanje tima** uvijek zaustavlja pogođena upozorenja, jer osoba koja provodi tu promjenu nije nužno vlasnik workflowa.
- Upozorenje se zaustavlja samo kada njegov vlasnik nema drugi put do workflowa, poput izravnog dijeljenja ili drugog tima.
- Ponovno pokretanje ili testiranje pauziranog upozorenja ponovno provjerava pristup vlasnika, stoga se zaustavljeno upozorenje ne može ponovno uključiti ili koristiti za čitanje metrika workflowa bez pristupa. Pritiskom na **Ponovno pokreni** bez pristupa prikazuje se obavijest koja objašnjava da vlasnik workflowa prvo mora ponovno podijeliti.

## Upravljanje Upozorenjima

- **Pauziraj / Ponovno pokreni** — pauzirano upozorenje nikada se ne evaluira. Ponovno pokretanje provjerava ga odmah umjesto da čeka sljedeći interval.
- **Uredi** — promjene se validiraju kao cjelina, tako da djelomična izmjena ne može ostaviti upozorenje u nevažećem stanju.
- **Izbriši** — uklanja upozorenje i njegovu povijest aktiviranja.

## Također pogledajte

- [Analytics Tab](./analytics-tab.md) — grafikoni s kojih su ovi pragovi izvučeni
- [Traces Tab](./traces-tab.md) — odakle dolaze LLM troškovi
- [Execution History](../reference/execution-history.md) — izvršavanja koja mjere greške, trajanje i broj upozorenja
- [Chat Tab](./chat-tab.md) — upit upozorenja na prirodnom jeziku
- [Teams](./teams-tab.md) — dijeljenje upozorenja s timom
