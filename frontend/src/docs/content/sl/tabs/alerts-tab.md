# Zavihek Opozorila

Zavihek **Opozorila** vam omogoča, da določite mejne pogoje v časovnem oknu in vas obvesti, ko so ti prekoračeni. Heym že beleži rezultate izvajanja, trajanje izvajanja in stroške LLM, vendar tega nikoli ne ponudi samodejno. Opozorilo je način, kako to zahtevate.

Vsako opozorilo se ocenjuje v **časovnem oknu**, ki ga izberete, nikoli na podlagi enega samega dogodka. En neuspešen zagon je šum. Dvanajst neuspešnih zagonov v desetih minutah je incident.

## Vrste opozoril

| Vrsta | Vprašanje, na katerega odgovarja | Od kod prihaja številka |
|---|---|---|
| **Mejna vrednost napak** | Ali je to spodletelo več kot N-krat v oknu? | Vrstice zgodovine izvajanja z napako |
| **Trajanje delovnega toka** | Ali so se zagonov upočasnili bolj, kot je bilo pričakovano v oknu? | Čas izvajanja, agregiran kot maksimum, povprečje ali 95. percentil |
| **Strošek v tokenih / USD** | Ali so stroški presegli proračun v oknu? | [LLM sledi](./traces-tab.md) plus tabela stroškov LLM |
| **Število izvajanj** | Ali se je to izvajalo veliko pogosteje, kot bi se moralo? | Število vrstic zgodovine izvajanja |

### Mejna vrednost napak

Šteje neuspešne zagon v oknu in se aktivira, ko število doseže vašo mejo. Ker šteje v oknu in ne povezuje vsakega neuspeha, vas enkratna prehodna napaka ne bo obvestila.

### Trajanje delovnega toka

Merjenje trajanja zagonov znotraj okna. Izberite **maksimum** (najpočasnejši zagon), **povprečje** ali **p95**. Podatek p95 uporablja isto izračunavanje percentila kot zavihek [Analitika](./analytics-tab.md), tako da opozorilo in graf latence nikoli ne nasprotujeta drug drugemu za isto okno.

**Minimalno število zagonov v oknu** ohranja to pošteno. Najpočasnejši zagon v skoraj praznem oknu je samo ta en zagon, zato nastavitev minimuma, recimo, 3 preprečuje, da bi se opozorilo aktiviralo zaradi šuma.

### Strošek v tokenih / USD

Sešteje stroške LLM v oknu, bodisi kot skupne tokene bodisi kot ameriške dolarje. Dolarni zneski se rešujejo skozi isto tabelo cen, ki jo uporablja [Zavihek sledi](./traces-tab.md) in [Tabela stroškov LLM](./datatable-tab.md#llm-cost-table-system-table), tako da opozorilo o stroških in stran s stroški vedno soglašata.

Ko je obseg vseh vaših delovnih tokov, to vključuje klice LLM, opravljene zunaj delovnega toka, kot so [Zavihek Chat](./chat-tab.md) in [AI Asistent](../reference/ai-assistant.md). Uporaba kodirnih agentov (Codex, OpenCode) ni vključena.

Modeli brez vrstice cen se v kontekstu opozorila poročajo kot neocenjeni, namesto da bi bili tiho šteti kot nič.

### Število izvajanj

Šteje zagon vseh statusov v oknu. To je tisto, kar ujame napačen trigger: delovni tok, ki običajno deluje 20-krat na uro, nenadoma deluje 2.000-krat. Zapis o aktivaciji vključuje razčlenitev po viru triggerja, ker je to običajno odgovor na vprašanje "zakaj se je to zgodilo".

## Obseg

Opozorilo spremlja bodisi **en delovni tok** bodisi **vse vaše delovne tokove**.

"Vse vaše delovne tokove" pomeni vsak delovni tok, do katerega ima lastnik opozorila dostop. Namenoma ne pomeni vsakega delovnega toka na instanci Heym: opozorila se lahko delijo, in deljenje opozorila ne sme nekoga obdariti s skupnimi številkami za delovne tokove, ki jih ne more odpreti.

## Čarovnik

Ustvarjanje opozorila poteka v petih korakih.

1. **Vrsta** — izberite eno od zgoraj navedenih štirih.
2. **Obseg** — en delovni tok ali vsi.
3. **Pogoji** — časovno okno, plus polja meje za to vrsto.
4. **Odgovor** — kaj se izvede, ko se aktivira, in kako pogosto vas obvešča.
5. **Pregled** — poimenujte ga in si oglejte nazajtest.

### Nazajtest

Korak Pregled odgovarja na vprašanje, ki je dejansko pomembno, preden shranite: *v zadnjih 24 urah, koliko pogosto bi se to aktiviralo?*

Poroča o številu aktivacij in najvišji opazovani vrednosti v primerjavi z vašo mejo. Če pravi, da bi se pogoj aktiviral 400-krat, popravite mejo pred shranjevanjem, namesto da bi bili obveščeni. Lahko razširite pogled na 3 ali 7 dni.

## AI Osnutek

Na vrhu prvega koraka je polje, kjer v preprostem jeziku opišete, kaj želite:

> Opozorite me, če sinhronizacija računov ne uspe več kot 5-krat v 10 minutah

Heym to spremeni v definicijo opozorila, izpolni vsak korak, ki ga lahko, in preskoči naprej s polji, ki jih je izpolnila AI, tako da potrdite namesto da ponovno vnašate. Popolna zahteva vas pripelje do Pregleda.

**Delna zahteva vas še vedno premakne naprej.** Recimo samo "opozorite me, če ne uspe 5-krat" in dobite opozorilo o mejni vrednosti napak s številom, izpolnjenim, privzetimi vrednostmi za ostalo, in čarovnik se odpre na prvem koraku, ki še potrebuje vašo pozornost: v tem primeru Obseg, ker ni bil imenovan noben delovni tok. Opomba na vrhu pove, kaj je še treba odločiti. Nikoli ne blokira Naprej ali Ustvari.

Enako velja, ko model imenuje delovni tok, do katerega ne morete dostopati, ali vrne pogoj s manjkajočimi polji. Delci, ki so smiselni, ostanejo, ostalo pa se vrne na privzete vrednosti za to vrsto opozorila, vi pa prilagodite od tam. Nič tukaj ne obide validacije: pravila čarovnika in API ponovno preverijo opozorilo, ko ga shranite.
## Ponovno obnašanje

Ko se opozorilo sproži, preide v stanje sproženja. Kaj se zgodi naprej, je vaša izbira v koraku 4.

- **Obvesti enkrat, dokler se ne obnovi** (privzeto) — sproži se enkrat, nato ostane tiho, dokler pogoj drži. Ko se metrika vrne pod prag, se opozorilo vrne v stanje OK in postane spet upravičeno za sprožitev. Obnova je sprememba stanja, ne dogodek: ne ustvari zapisa o sprožitvi in ne zažene notify workflow.
- **Nadaljujte z obveščanjem v intervalih** — sproži se znova vsakih N minut, dokler pogoj drži.

Privzeto obstaja, ker bi pokvarjen workflow, ki se preverja vsakih 60 sekund, sicer proizvedel 60 sprožitev na uro, kar je način, kako se obveščanje utiša.

## Zagon Workflow ob Sprožitvi

Korak 4 ponuja tri odgovore na vprašanje "kaj naj se zgodi, ko se to sproži":

- **Ustvari in dodeli nov workflow** (privzeto) — shranitev opozorila prav tako ustvari workflow z imenom *"&lt;ime opozorila&gt; obvestilo"* in ga poveže. Pridobi se z vhodnim vozliščem, katerih polja so natančno enaka spodnjemu payloadu, tako da se `$alert.body.observed_value` in ostalo takoj razreši in morate le priložiti vozlišče, ki dostavi sporočilo. **Pojdite na workflow** na kartici opozorila ga odpre. To je privzeto, ker je opozorilo, ki se sproži v nič, enostavno spregledati.
- **Izberite obstoječi workflow** — zaženite nekaj, kar ste že zgradili.
- **Ne naredite ničesar** — sprožitev je še vedno zabeležena na zavihku, le da ne zažene ničesar.

Opozorilni payload prispe kot vhodno telo tega workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Napake pri sinhronizaciji računov",
  "alert_type": "error_threshold",
  "condition": "5+ napak v 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Sinhronizacija računov", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Kateri workflow je proizvedel številko

`workflows` je edino mesto, kjer se workflow pojavi. Našteje vsak workflow, ki je prispeval k branju, vsak s svojo `value` — število napak tega workflow, število zagonov, najpočasnejši zagon v milisekundah ali poraba, odvisno od vrste opozorila. Seznam je razvrščen po `value`, od najvišje navzdol, tako da je `workflows[0]` najslabši krivec.

To je **vedno tabela**: enojni element pod obsegom enega workflow, več pod "vsi moji workflows", in prazen namesto null, ko ni nič pripisano. Notify workflow lahko iterira brez preverjanja oblike.

Namerno ni enotnega `workflow_id`. Opisuje obseg opozorila, ne metrike, zato je bil `null` pod sistemskim obsegom, kar je natančno tisti primer, kjer "kateri workflow?" najbolj šteje. `observed_value` ostaja agregat, s katerim je bil primerjan prag; polja `value` po workflow razložijo, od kod prihaja.

Tako opozorila dosežejo Slack, e-pošto, Telegram ali kjerkoli drugje: z [vozlišči](../reference/node-types.md), ki jih že imate, namesto z ločenim sistemom za obveščanje.

Opozorilo ne more obvestiti workflow, ki ga spremlja. To bi bila zanka, najbolj očitno za opozorilo o številu zagonov, kjer vsako obvestilo doda k številu, ki ga meri.

Notify zagon je običajen zagon, zato se pojavi v [zgodovini zagonov](../reference/execution-history.md) kot vsak drug zagon. Notify workflow, ki ne uspe, se zabeleži ob sprožitvi, vendar nikoli ne prepreči, da bi se sama sprožitev zabeležila.

Notify workflow se izvaja kot lastnik opozorila, z njihovimi poverilnicami in globalnimi spremenljivkami, točno tako, kot če bi ga sami zagnali. Izbira workflow, ki vam ga je nekdo delil, ne izposodi poverilnic te osebe. Če lastnik izgubi dostop do notify workflow, se sprožitev še vedno zabeleži, vendar se zagon notify preskoči.

## Zgodovina Sprožitev

Pod seznamom opozoril je zgodovina sprožitev: kaj se je sprožilo, kdaj, opazovana vrednost v primerjavi s pragom, natančno okno, ki je bilo ocenjeno, in izid obveščanja.

Potrditev sprožitve označi vrstico in spremeni oznako opozorila iz **Sproženo** v **Potrjeno**. To je izjava o vas, ne o opozorilu: pogoj še vedno drži, opozorilo se vrne v **OK** samo, ko se metrika vrne pod prag.

Vsak zapis shranjuje podrobnosti, ki so prispevale ob trenutku sprožitve: id-ji neuspešnih zagonov in sporočila o napakah, poraba po modelih ali razčlenitev vira sprožitve. To je namerno. Okno je minilo, in ponovno izračunavanje kasneje lahko da drugačen odgovor.

Zgodovina sprožitev se hrani 90 dni.

## Spraševanje Chata o Opozorilih

Zavihek [Chat](./chat-tab.md) lahko odgovori na vprašanja o vaših opozorilih:

- "Katera opozorila imam?"
- "Ali obstaja opozorilo na workflow za račune?"
- "Zakaj se je sprožilo opozorilo o stroških?"
- "Kdaj se je to nazadnje sprožilo?"

Za vprašanje "zakaj se je sprožilo" Chat citira dejansko opazovano vrednost, prag in časovno okno iz zapisa sprožitve, skupaj s podrobnostmi, ki so prispevale.

## Deljenje

Opozorila se lahko delijo z individualnimi uporabniki ali z [ekipami](./teams-tab.md). Osebe, s katerimi delite, lahko vidijo opozorilo in njegovo zgodovino sprožitev. Le lastnik lahko ureja, ustavi, izbriše ali ponovno deli.
### Ko je dostop do workflowa odstranjen

Opozorilo na posameznem workflowu še naprej bere metrike izvajanja tega workflowa, zato odstranitev dostopa nekoga do workflowa vpliva tudi na to, kaj se zgodi z njihovimi opozorili:

- **Odstranitev uporabnika ali deljenja ekipe** vpraša lastnika workflowa, ali naj se tudi ustavijo opozorila tega uporabnika ali ekipe na workflowu. Ustavitev je privzeta možnost. Ustavljena opozorila so začasno ustavljena, ne pa izbrisana, in vsako je zabeleženo kot `alert.disable_on_access_revoke` v [revizijskem dnevniku](../reference/audit.md).
- **Odstranitev člana ekipe ali izbris ekipe** vedno ustavi prizadeta opozorila, ker oseba, ki izvaja to spremembo, ni nujno lastnik workflowa.
- Opozorilo se ustavi le, ko njegov lastnik nima druge poti do workflowa, kot je neposredno deljenje ali druga ekipa.
- Nadaljevanje ali testiranje ustavljenega opozorila ponovno preveri dostop lastnika, zato ustavljenega opozorila ni mogoče ponovno vklopiti ali uporabiti za branje metrik workflowa brez dostopa. Pritisnite **Nadaljuj** brez dostopa, da se prikaže obvestilo, ki pojasnjuje, da mora lastnik workflowa najprej ponovno deliti.

## Upravljanje opozoril

- **Pauza / Nadaljuj** — ustavljeno opozorilo nikoli ni ocenjevano. Nadaljevanje ga takoj preveri, namesto da bi čakalo na naslednji interval.
- **Uredi** — spremembe se validirajo kot celota, zato delna ureditev ne more pustiti opozorila v neveljavnem stanju.
- **Izbriši** — odstrani opozorilo in njegovo zgodovino sprožitev.

## Glejte tudi

- [Zavihek Analitika](./analytics-tab.md) — grafi, iz katerih so črte teh pragov
- [Zavihek Sledi](./traces-tab.md) — od kje prihajajo številke stroškov LLM
- [Zgodovina izvajanja](../reference/execution-history.md) — izvajanja, ki jih merijo opozorila o napakah, trajanju in številu
- [Zavihek Chat](./chat-tab.md) — poizvedovanje o opozorilih v naravnem jeziku
- [Ekipe](./teams-tab.md) — deljenje opozoril z ekipo
