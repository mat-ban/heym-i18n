# Hiterna Predal

**Hiter predal** je stranski hitri panel za izvajanje workflows. Pojavi se na avtoriziranih straneh, kot so nadzorna plošča [zavihek Workflows](../tabs/workflows-tab.md), dokumenti in vrednotenja.

## Dostop

- Kliknite na fiksni **Hiter / Workflows** trigger na desnem srednjem robu zaslona.
- Ko je [Kontekstni prikaz](./contextual-showcase.md) prav tako na voljo, se njegov **Smernik strani** nahaja nad Hitro Workflows.
- Predal se odpre z desne strani in premakne trenutno stran levo z rahlim premerom.
- Na mobilnih napravah je Hiter predal skrit.
- Predal ni prikazan na strani za urejanje workflows, prijavo/registracijo, portalu ali HITL pregledih.

## Iskanje Workflows

Uporabite filtrirno polje na vrhu predala za iskanje workflows po:

- Ime workflow
- Opis workflow

Iskanje je brez razlikovanja med velikimi in malimi črkami ter takoj posodobi seznam.

## Pripeti Workflows

Pripnite workflows, da jih obdržite na vrhu predala.

- Pripeti workflows se pojavijo v svojem lastnem razdelku nad celotnim seznamom.
- Nova pripeta workflows se dodajo na vrh.
- Zaporedje pripetih workflows se ohrani med ponovnimi nalaganji v shrambi brskalnika.

## Izvajanje Workflows

Izberite workflow, da odprete njegov obrazec za vnos.

- Vhodna polja so prikazana vertikalno v vrstnem redu predala.
- Kliknite **Izvedi Workflow**, da izvedete izbrani workflow.
- Kliknite **Ustavi Workflow**, da prekličete trenutno izvajanje iz predala.
- Workflows brez vhodnih polj se lahko še vedno izvajajo neposredno.
- Workflow, ki se začne z vozliščem [File Upload Trigger](../nodes/file-upload-trigger-node.md), namesto tega prikaže območje za odlaganje: vanj povlecite datoteko ali kliknite za izbiro. Območje navaja vrste in velikost datotek, ki jih trigger sprejema, ter druge datoteke zavrne pred nalaganjem. Gumb **Izvedi Workflow** (**Run Workflow**) ostane onemogočen, dokler ni izbrana datoteka.

Predal uporablja isto API za izvajanje workflows kot druge površine za izvajanje v Heym, zato ostajajo izhodi in obnašanje med izvajanjem dosledni.

Ustavitev izvajanja iz predala prav tako prekliče aktivno izvajanje na zadnjem delu, vključno z morebitnimi nalogami brskalnika Playwright, ki so v teku za to izvajanje workflow.

## Napredek in Rezultati

Po začetku izvajanja predal prikazuje:

- Pretakanje napredka korakov za vozlišča, ko se začnejo in končajo.
- Končni status: `uspeh`, `napaka` ali `v čakanju`.
- Končni izhodi v kompaktni JSON plošči.
- Vnos zgodovine označen z `Hiter predal`.

`v čakanju` pomeni, da workflow čaka na kasnejšo akcijo, kot je človeški pregled.

Zagoni iz Hitrega predala (Quick Drawer) so produkcijski zagoni, zato jih lahko workflow z [omejitvijo sočasnosti](./webhooks.md#concurrency-limit-and-queued-runs) postavi na čakanje. Medtem ko je zagon v vrsti, status prikazuje **Waiting in queue (2/5)**; ko se zagon začne, se spremeni v "running" in ob zaključku prikaže rezultat, brez postopnega napredka po korakih. Zagon, ki je potekel v čakalni vrsti ali bil med čakanjem preklican, se konča kot `error`.

Zagon z datoteko poteka prek enkratne povezave za nalaganje triggerja: predal od workflowa zahteva povezavo, nanjo naloži datoteko in prikaže rezultat, ko se nalaganje zaključi. Zagoni z datoteko prikažejo končni status in izhode, ne pa tudi napredka po korakih, v zgodovini pa so prav tako označeni s `Quick Drawer`. Izbrana datoteka se po vsakem zagonu počisti, saj ena povezava sprejme le eno datoteko.

## Shramba Brskalnika

Hiter predal shranjuje osebne nastavitve v `localStorage`:

- ID-ji pripetih workflow
- Zadnji izbrani workflow

Predal **ne** ohranja vrednosti vnosa v tej različici.

## Obseg

Hiter predal je namenoma lahka površina za izvajanje.

- Vključuje: iskanje, pripenjanje, izbiro, vnos (vključno z datoteko), izvajanje, napredek, rezultat.
- Izključuje: ustvarjanje workflow, urejanje, upravljanje map in akcije na platnu.

## Sorodno

- [Zavihek Workflows](../tabs/workflows-tab.md) – Glavni seznam workflow, mape in upravljanje.
- [Hiter začetek](../getting-started/quick-start.md) – Ustvarite in izvedite svoj prvi workflow.
- [Zgodovina izvajanja](./execution-history.md) – Pregled preteklih izvajanj.
- [Webhooki](./webhooks.md) – Aktivirajte workflows preko HTTP.
- [Kontekstni prikaz](./contextual-showcase.md) – Smernica na ravni strani, ki dopolnjuje Hiter predal.
