# Organizacija Workflow-ov

Heym vam omogoča organizacijo workflow-ov v mape, ustvarjanje podmap in načrtovanje workflow-ov za izbris. Oglejte si [Zavihek Workflow-ov](../tabs/workflows-tab.md) za pregled uporabniškega vmesnika.

## Mape in Podmape

Mape tvorijo drevo. Vsaka mapa ima:

- **Ime** – Prikazno ime
- **Starš** – `parent_id` povezuje z drugo mapo; `null` pomeni koren
- **Workflow-i** – Workflow-e je mogoče premikati v mape preko `folder_id`

### API

| Endpoint | Namen |
|----------|-------|
| `GET /folders` | Le korenske mape |
| `GET /folders/tree` | Celotno drevo (otroci + workflow-i) |
| `GET /folders/{id}` | Ena mapa z vsebino |
| `POST /folders` | Ustvari mapo (`parent_id` je neobvezno) |
| `PUT /folders/{id}` | Posodobi ime ali `parent_id` |
| `DELETE /folders/{id}` | Izbriši mapo (kaskadno) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Premakni workflow v mapo |
| `DELETE /folders/workflows/{workflow_id}/folder` | Odstrani workflow iz mape |
| `GET /folders/{id}/export` | Prenesi mapo + vse podmape kot ZIP |

### Struktura Drevesa

Odgovor drevesa vključuje `children` in `workflows` za vsako mapo. Skupni workflow-i se lahko pojavijo v mapi preko `WorkflowShare.folder_id`.

## Deljenje Workflow-ov

Odprite **Deli** v urejevalniku workflow-ov, da povabite uporabnike po elektronski pošti ali delite s [timom](./teams.md). Vsako povabilo in delitev s timom prinaša dovoljenje:

| Dovoljenje | Kaj lahko sodelavec stori |
|------------|---------------------------|
| **Branje** | Odpri workflow, pregleduj ga, oglej si zgodovino izvajanja in ga zaženi. Urejevalnik se odpre v načinu samo za branje: Shranjevanje je onemogočeno in platno ni mogoče spremeniti. |
| **Pisanje** | Vse, kar dovoljuje Branje, plus urejanje platna, nastavitev, analitičnega dokumenta in spomina agenta. |

Dovoljenje je prikazano poleg vsakega vnosa v pogovornem oknu Deli in ga je mogoče spremeniti kadarkoli iz tega spustnega menija, ne da bi bilo treba delitev odstraniti in ponovno dodati. Ko uporabnik dostopa do workflow-a preko več poti (direktna delitev in ena ali več timov), zmaga **najvišje** dovoljenje. Delitve, ki so obstajale pred uvedbo dovoljenj, so **Pisanje**, in API odjemalci, ki izpustijo `permission`, prav tako dobijo **Pisanje**.

Dejanja, ki so rezervirana za lastnika, nikoli ne odvisijo od dovoljenja: brisanje workflow-a, vračanje ali brisanje različic, brisanje zgodovine, upravljanje delitev in [nastavitve, rezervirane za lastnika](#owner-only-settings) spodaj ostanejo pri lastniku, tudi za **Pisanje** sodelavce. **Branje** sodelavec, ki pošlje urejanje preko API-ja (`PUT /api/workflows/{id}`, analitična opomba, spomin agenta, brisanje predpomnilnika) ali preko AI asistenta, prejme `403` z `Imate dostop samo za branje do tega workflow-a`.

Delitev workflow-a omogoča dostop do platna, zgodovine izvajanja in analitičnega dokumenta. Ne deli pa samodejno:

- **Poverilnic**, na katere se sklicujejo vozlišča v workflow-u
- **Pod-workflow-ov**, ki jih kličejo [Execute](../nodes/execute-node.md) vozlišča ali agenti

Prejemniki potrebujejo te poverilnice in otroške workflow-e, deljene z njimi ločeno (isti uporabniki ali timi). Delite poverilnice iz [Zavihka Poverilnice](../tabs/credentials-tab.md); glejte [Deljenje Poverilnic](./credentials-sharing.md). Delite vsak pod-workflow iz svojega lastnega pogovornega okna za deljenje.

### Nastavitve, rezervirane za lastnika

Celotna konfiguracija **Zaženi z cURL** ostane pri lastniku po delitvi. Sodelavci še vedno odprejo pogovorno okno in kopirajo ustvarjeno ukazno vrstico, vendar so kontrole samo za branje.

Vsaka sprememba teh nastavitev kot ne-lastnik je zavrnjena z `403`:

- **Avtentikacija** (`auth_type`) in **Ključ Glave** (`auth_header_key`)
- **Način Telesa Zahteve** (`webhook_body_mode`) in **Metoda Zahteve** (`http_method`)
- **Predpomnilnik Odgovora** (`cache_ttl_seconds`) in **Omejitev Hitrosti** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Vrednost Glave** (`auth_header_value`) se obnaša drugače: je popolnoma skrita pred sodelavci, in pisanje sodelavca se ignorira namesto da bi bilo zavrnjeno. Urejevalnik prikazuje polje zakrito, tako da bi `403` tam prekinil običajno shranjevanje namesto da bi signaliziral napad.

Avtentikacija je razlog, da je blok rezerviran za lastnika: `Anonymous` omogoča neavtoriziranim klicateljem izvajanje workflow-a, in izvajanje brez prijavljenega klicatelja rešuje poverilnice in globalne spremenljivke kot **lastnik**, ne kot klicatelj. Preostali del bloka je objavljena pogodba o zahtevi in stroški lastnika, zato se premika z njim.

**Ob napaki, zaženi workflow** (`error_workflow_id`) v **Lastnostih** na ravni workflow-a je rezerviran za lastnika iz istega razloga: [workflow ob napaki](./features.md#error-workflow) se izvaja s poverilnicami in globalnimi spremenljivkami neuspelega izvajanja, ki so lastnikove za sprožene in anonimne izvajanja. Sodelavci vidijo nastavitev samo za branje, in dodajanje, zamenjava ali brisanje te nastavitve kot ne-lastnik je zavrnjeno z `403`.

Urejanje platna, imena in opisa ni prizadeto.

### Izvršilni žetoni

Sodelavec lahko ustvari izvršilni žeton za workflow, ki je deljen z njim. Izvajanje se pripisuje **tistemu, ki je ustvaril žeton**, tako da uporablja poverilnice in globalne spremenljivke tega uporabnika, ne lastnika. Le resnično anonimni klic — `auth_type: anonymous` brez klicatelja — se izvaja v lastnikovem kontekstu.

## Načrtovano za Izbris

Workflow-i so lahko načrtovani za izbris namesto da bi bili takoj odstranjeni.

- **Polje**: `scheduled_for_deletion` (nullable datetime)
- **Obnašanje**: Ko je nastavljeno, se workflow premakne v `folder_id = null` in se prikaže v razdelku "Načrtovano za Izbris".
### API

| Endpoint | Namen |
|----------|-------|
| `PUT /workflows/{id}/schedule-deletion` | Nastavi `scheduled_for_deletion`, počisti `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Počisti `scheduled_for_deletion` (obnovi) |

### UI

- **Povleci v smeti** – Spustite workflows v območje "Načrtovano za izbris", da jih načrtujete
- **Obnovi** – Odstrani iz načrta
- **Takojšnji izbris** – Ikona smeti za trajno odstranitev

### Logika čiščenja

Cron naloga se dnevno izvaja ob **23:59** (konfigurirana časovna cona). Workflow se izbriše le, ko:

- **Vsi začetni vozli** (vozli brez vhodnih robov, razen sticky/errorHandler) imajo `active === false`

Če je kateri koli začetni vozlišče še vedno aktivno, workflow ostane do naslednjega izvajanja.

## Dashboard UI

- **Vrste map** – Nova mapa, rekurzivno drevo map z razširjanjem/kolapsom. Vsaka mapa nosi
  neobvezni opis pod svojim imenom in oznako, ki šteje workflows, ki jih vsebuje, vključno s podmapami.
- **Dejanja map** – Nova podmapa, Preimenuj, Spremeni ikono, Prenesi kot ZIP in Izbriši so na voljo
  v vsaki vrstici mape; kontekstni meni ob desnem klikom ponuja enak nabor, mobilni telefoni pa prikazujejo en sam
  gumb menija.
- **Glavno območje** – Korenski workflows (brez mape, niso načrtovani) in Načrtovano za izbris
- **Predogled spuščanja mape** – Povlečenje workflow izpostavi natančno mapo ali podmapo in
  prikaže njeno polno pot v predogledu velikosti kartice. Zmanjšana mapa se razširi po kratkem lebdenju.
- **Stabilna povratna informacija o povlečenju** – Vir kartice uporablja duh povlečenja, aktivna tarča spuščanja ostane
  izbrana med pomikanjem ali prečkanjem kontrol v isti mapi.
- **Preverjanje cilja** – Trenutna mapa je prikazana kot **Že v mapi** in ne sprejema
  odvečne premike.
- **Druga območja spuščanja** – Korenski in "Načrtovano za izbris" se osvetlita, ko lahko sprejmeta
  povlečen workflow.
- **ZIP spuščanje** – Spustite ZIP datoteko na območje workflow, da uvozite strukturo map na korenski ravni

## Sorodno

- [Workflows Tab](../tabs/workflows-tab.md) – Ustvarite in upravljajte workflows
- [Poverilnice za deljenje](./credentials-sharing.md) – Delite poverilnice s sodelavci pri workflow
- [Ekipe](./teams.md) – Delite workflows in poverilnice s ekipami
- [Osnovni koncepti](../getting-started/core-concepts.md) – Workflows, vozli in izvajanje
- [Struktura workflow](./workflow-structure.md) – JSON format za workflows
- [Trigerji](./triggers.md) – Začetna vozlišča in vstopne točke
