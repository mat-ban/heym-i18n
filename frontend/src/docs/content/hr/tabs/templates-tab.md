# Kartica Predložaka

Kartica Predložaka omogućuje vam spremanje, pregledavanje i ponovnu upotrebu cjelovitih workflows-a i pojedinačnih čvorova. Podijelite nešto što ste jednom izgradili i primijenite to na nove projekte jednim klikom.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Pogledajte demo Predložaka</a></p>

## Pregled

Postoje dvije vrste predložaka:

- **Predlošci workflows-a** — spremite cjelovit workflow (sve čvorove i veze) kao ponovno upotrebljivu polaznu točku.
- **Predlošci čvorova** — spremite jedan konfigurirani čvor (npr. podešeni LLM čvor ili prilagođeni HTTP čvor) za ponovnu upotrebu u različitim workflows-ima.

Prebacujte se između dviju opcija pomoću prekidača **Workflows / Nodes** na vrhu kartice.

Koristite traku za pretraživanje kako biste filtrirali vidljive predloške prema imenu, opisu, oznakama ili vrsti čvora.

---

## Kreiranje Predloška

### Predložak workflows-a

1. Otvorite workflow koji želite podijeliti u uređivaču.
2. Kliknite **Share as Template** u gornjoj alatnoj traci.
3. Ispunite naziv, opis i opcionalne oznake.
4. Odaberite vidljivost: **Everyone** (svi korisnici) ili **Specific users** (unesite korisnička imena i/ili odaberite timove).
5. Kliknite **Share**. Zeleni obavijest potvrđuje uspjeh.

### Predložak čvora

1. Desnom tipkom miša kliknite bilo koji čvor na platnu.
2. Odaberite **Share as Template** iz kontekstnog izbornika.
3. Ispunite obrazac i kliknite **Share**.

---

## Korištenje Predloška

### Predložak workflows-a

1. Otvorite karticu **Templates** i provjerite je li odabran **Workflows**.
2. Kliknite karticu za pregled, ili kliknite **Use** izravno.
3. Workflow se klonira u novi workflow koji se otvara u uređivaču.

### Predložak čvora

1. Otvorite karticu **Templates** i odaberite **Nodes**.
2. Kliknite **Use** na kartici predloška čvora.
3. Pojavit će se dijalog — odaberite gdje dodati čvor:
   - **New workflow** — stvara novi workflow koji sadrži samo ovaj čvor.
   - **Existing workflow** — odaberite iz svoje liste workflows-a; čvor se automatski umetne kada se uređivač otvori.

---

## Pregled

Kliknite bilo koju karticu predloška za otvaranje punog pregleda:

- **Sličice kartica** — kartice predložaka prikazuju prilagođeni snapshot platna u načinu samo za čitanje za workflows-e i predloške s jednim čvorom.
- **Predlošci workflows-a** — platno samo za čitanje koje odgovara stilu pregleda povijesti uređivanja, uključujući pomicanje i zumiranje.
- **Predlošci čvorova** — spremljeni čvor otvara se na istom platnu samo za čitanje kao pregled s jednim čvorom.
- **Detalji čvora** — kliknite bilo koji čvor u pregledu kako biste pregledali njegovu spremljenu konfiguraciju u bočnoj traci.
- Oznake, broj korištenja i **vlasnik** prikazani su za sve predloške.

Pritisnite **ESC** ili kliknite izvan pregleda kako biste ga zatvorili.

---

## Upravljanje Predlošcima

- **Uredi** – Ako ste vlasnik predloška, zadržite pokazivač iznad kartice i kliknite ikonu olovke za ažuriranje naziva, opisa, oznaka ili vidljivosti.
- **Izbriši** – Ako ste vlasnik predloška, zadržite pokazivač iznad kartice i izbrišite predložak nakon potvrde.
- **Radnje samo za vlasnike** – Kontrole za uređivanje i brisanje prikazuju se samo za predloške koje ste vi stvorili.

---

## Paleta Komandi (CTRL+K)

Predloške (i workflows i čvorove) moguće je pretraživati iz palete komandi **CTRL+K**. Odaberite predložak za trenutnu upotrebu — predlošci workflows-a otvaraju se u uređivaču, a predlošci čvorova traže odredište.

---

## Predlošci u Chatu

Možete postavljati AI pitanja o svojim predlošcima — on poznaje sve predloške u vašem radnom prostoru.

---

## Vidljivost

| Postavka | Tko to može vidjeti |
|---|---|
| Everyone | Svi korisnici na platformi |
| Specific users | Korisnici koje navedete imenom i/ili timovi koje odaberete — svi članovi tima dobivaju pristup |

Kada dijelite s **Specific users**, možete dodati i pojedinačne korisnike (po imenu) i timove. Članovi tima vide predložak u kartici Predlošci i mogu ga koristiti.

---

## Povezano

- [Timovi](../reference/teams.md) – Dijelite predloške s timovima
- [Značajke Platna](../reference/canvas-features.md)
- [Struktura Workflows-a](../reference/workflow-structure.md)
- [Vrste Čvorova](../reference/node-types.md)
- [Chat Kartica](./chat-tab.md)
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kratki vodič za kartice nadzorne ploče
