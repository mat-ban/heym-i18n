# Zavihek Predloge

Zavihek Predloge vam omogoča shranjevanje, iskanje in ponovno uporabo celotnih workflows ter posameznih vozlišč. Delite nekaj, kar ste enkrat ustvarili, in to uporabite v novih projektih z enim klikom.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Oglejte si predstavitev predlog</a></p>

## Pregled

Obstajata dva tipa predlog:

- **Predloge workflows** — shranite celoten workflow (vsa vozlišča in povezave) kot ponovno uporabno izhodišče.
- **Predloge vozlišč** — shranite eno konfigurirano vozlišče (npr. prilagojeno LLM vozlišče ali prilagojeno HTTP vozlišče) za ponovno uporabo v različnih workflows.

Preklapljajte med obema s stikalom **Workflows / Nodes** na vrhu zavihka.

Uporabite iskalno vrstico za filtriranje vidnih predlog po imenu, opisu, oznakah ali tipu vozlišča.

---

## Ustvarjanje Predloge

### Predloga workflow

1. Odprite workflow, ki ga želite deliti, v urejevalniku.
2. Kliknite **Share as Template** v zgornji orodni vrstici.
3. Izpolnite ime, opis in neobvezne oznake.
4. Izberite vidnost: **Everyone** (vsi uporabniki) ali **Specific users** (vnesite uporabniška imena in/ali izberite ekipe).
5. Kliknite **Share**. Zeleno obvestilo potrdi uspeh.

### Predloga vozlišča

1. Z desnim klikom na katero koli vozlišče na platnu.
2. Izberite **Share as Template** iz kontekstnega menija.
3. Izpolnite obrazec in kliknite **Share**.

---

## Uporaba Predloge

### Predloga workflow

1. Odprite zavihek **Templates** in se prepričajte, da je izbran **Workflows**.
2. Kliknite kartico za predogled, ali kliknite **Use** neposredno.
3. Workflow se klonira v nov workflow, ki se odpre v urejevalniku.

### Predloga vozlišča

1. Odprite zavihek **Templates** in izberite **Nodes**.
2. Kliknite **Use** na kartici predloge vozlišča.
3. Pojavi se pogovorno okno — izberite, kam dodati vozlišče:
   - **New workflow** — ustvari nov workflow, ki vsebuje samo to vozlišče.
   - **Existing workflow** — izberite iz seznama vaših workflow; vozlišče se samodejno vstavi, ko se urejevalnik odpre.

---

## Predogled

Kliknite katero koli kartico predloge za odpiranje celotnega predogleda:

- **Miniature kartice** — kartice predlog prikazujejo prilagojen posnetek platna v načinu samo za branje za workflows in predloge z enim vozliščem.
- **Predloge workflows** — platno v načinu samo za branje, ki ustreza slogu predogleda zgodovine urejanja, vključno s pomikanjem in zoomiranjem.
- **Predloge vozlišč** — shranjeno vozlišče se odpre na istem platnu v načinu samo za branje kot predogled enega vozlišča.
- **Podrobnosti vozlišča** — kliknite katero koli vozlišče v predogledu, da pregledate njegovo shranjeno konfiguracijo v stranskem panelu.
- Oznake, število uporabe in **lastnik** so prikazani za vse predloge.

Pritisnite **ESC** ali kliknite zunaj, da zaprete predogled.

---

## Upravljanje Predlog

- **Uredi** – Če ste lastnik predloge, premaknite kurzor nad kartico in kliknite ikono svinčnika, da posodobite njeno ime, opis, oznake ali vidnost.
- **Izbriši** – Če ste lastnik predloge, premaknite kurzor nad kartico in izbrišite predlogo po potrditvenem pozivu.
- **Dejanja samo za lastnike** – Kontrole za urejanje in brisanje so prikazane samo za predloge, ki ste jih ustvarili vi.

---

## Ukazna Paleta (CTRL+K)

Predloge (tako workflow kot vozlišča) so iskalne iz **CTRL+K** ukazne palete. Izberite predlogo, da jo takoj uporabite — predloge workflow se odprejo v urejevalniku, predloge vozlišč pa zahtevajo izbiro destinacije.

---

## Predloge v Chatu

Lahko postavite vprašanja AI o vaših predlogah — pozna vse predloge v vašem delovnem prostoru.

---

## Vidnost

| Nastavitev | Kdo jo lahko vidi |
|---|---|
| Everyone | Vsi uporabniki na platformi |
| Specific users | Uporabniki, ki jih navedete po imenu in/ali ekipe, ki jih izberete — vsi člani ekipe pridobijo dostop |

Ko delite z **Specific users**, lahko dodate tako posamezne uporabnike (po imenu) kot ekipe. Člani ekipe vidijo predlogo v zavihku Predloge in jo lahko uporabijo.

---

## Sorodno

- [Teams](../reference/teams.md) – Delite predloge z ekipami
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Kratka stran z navodili za zavihke nadzorne plošče
