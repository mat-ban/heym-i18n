# MCP Zavihek

Zavihek **MCP** konfigurira integracijo Model Context Protocol (MCP). MCP omogoča AI strankam (Claude, ChatGPT, Gemini, Cursor in katerikoli MCP-združljiv pripomoček), da kličete vaše Heym workflows kot pripomočke.

Heym podpira dva načina: **privzeti strežnik**, ki izpostavi vse workflows, omogočene za MCP, pod enim samim endpointom, in **imenovane strežnike**, ki vsaki logični skupini workflows dodelijo svojo lastno URL in API ključ.

Oba načina lahko izpostavita dve vrsti pripomočkov: posamezne **workflows** in **Heym chat pripomoček** — celoten [Chat zavihek](./chat-tab.md) motor za en `heym_chat` pripomoček.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Oglejte si MCP predstavitev</a></p>

## Privzeti MCP Strežnik

Privzeti strežnik je vedno na voljo na `{origin}/api/mcp/sse`. Vse workflows, pri katerih je MCP vklopljen, se tukaj pojavijo kot pripomočki.

### MCP API Ključ

- Ključi so shranjeni kot SHA-256 digest, zato Heym ne more prikazati obstoječega ključa. Zavihek poroča, ali je ključ nastavljen, ne pa kaj je.
- **Ustvari** / **Ponovno ustvari** – Novi ključ se prikaže enkrat, takoj po njegovi ustvaritvi. Kopirajte ga takrat; ponovni nalaganje zavihka ga trajno skrije.
- Uporabite ta ključ pri povezovanju Claude Desktop, Cursor ali drugih MCP strank z Heym.
- Ste izgubili ključ? Ponovno ga ustvarite. Prejšnji ključ preneha delovati takoj.

### Metode Povezovanja

- **API Ključ** – Uporabite MCP API ključ za programatične povezave. Zavihek lahko kopira pripravljen JSON konfiguracijo in vključuje gumb **Dodaj v Cursor** za enostavno nastavitev Cursorja.
- **Claude** – Zavihek prikazuje URL MCP strežnika in korake za nastavitev za Claude. Pustite OAuth Client ID in Secret prazna; Claude se samodejno registrira in avtenticira preko Heym OAuth.
- **ChatGPT** – Zavihek prikazuje URL strežnika MCP in korake nastavitve za aplikacijo ChatGPT. Vklopite način za razvijalce (Developer mode), ustvarite aplikacijo z URL-jem in izberite OAuth; ChatGPT se samodejno registrira.
- **Gemini** – Zavihek prikazuje URL strežnika MCP in korake nastavitve za aplikacijo po meri Gemini: na gemini.google.com izberite **Settings → Connected Apps → Add a custom app**, prilepite URL in pustite **Advanced features** zaprto; Gemini se samodejno registrira in overi prek Heym OAuth. Ko je povezan, Heym deluje tudi v mobilni aplikaciji Gemini.

### MCP Preklop za Workflow

Vsak workflow se lahko izpostavi kot MCP pripomoček:

- **Omogoči** – Pripomočki workflow postanejo na voljo vsem strankam, povezanih s privzetim strežnikom.
- **Onemogoči** – Workflow ni izpostavljen.

Karte workflow prikazujejo opis in predogled imen vhodnih polj, tako da lahko vidite, kaj vsak pripomoček pričakuje pred omogočanjem.

## Heym Chat Pripomoček

Oddelek **Heym Zmožnosti** pretvori motor Chat zavihka v en sam MCP pripomoček z imenom `heym_chat`. Omogočite ga na privzetem strežniku, na katerem koli imenovanem strežniku ali na obeh — vsaka površina ima svoj preklop in izbiro modela.

Ko je vklopljen, se `heym_chat` prikaže v `tools/list` skupaj z vašimi workflow pripomočki. MCP stranka pošlje eno sporočilo v naravnem jeziku, Heym motor pa prevzame od tam, z enakimi zmožnostmi, kot jih ima Chat zavihek:

- Zgradite workflow, ga testno zaženite z vzorčnimi vhodi, ga popravite in zaključite, ko zagon uspe (glejte [Način gradnje](#build-mode))
- Pregledujte in zaganjajte svoje obstoječe workflowe
- Poročajte o analitiki, nedavnih izvajanjih in prihajajočih cron urnikih.
- Poročajte o zgodovini izvajanja enega workflow: kolikokrat je bil izveden, število statusov, kdaj je bil izveden, in na zahtevo vhodih, izhodih ter napakah po vozliščih enega izvajanja.
- Poročajte, kaj se trenutno izvaja: kolikšna števila izvajanj je aktivnih, imena njihovih workflow, kako dolgo se vsako izvaja, na katerem vozlišču se trenutno nahajajo, in povezavo do živega izvajanja.
- Na [Board zavihku](./board-tab.md) naštejte table, ustvarite karte in preberite podrobnosti kart.
- Naštejte svoje podatkovne tabele z njihovimi stolpci, ustvarite nove in jih povežite v workflows, ki jih gradi.
- Preberite ekipe in globalne spremenljivke ter iščite dokumentacijo.
- Odobrite, uredite ali zavrnite čakajoče preglede človeka v zanki.

Zmožnosti, dodane v Chat zavihek, postanejo kasneje na voljo preko `heym_chat` samodejno — ni potrebnega preklopa za vsako zmožnost, da ostaneta sinhronizirana.

### Način gradnje

`heym_chat` vedno izvaja pogon Chat v načinu gradnje (build mode). V enem klicu lahko pomočnik shrani nov workflow, ga zažene z realističnimi vzorčnimi vhodi, prebere poročilo o zagonu, popravi, kar ni uspelo, in ga znova zažene – do pet testnih zagonov na klic. Ko zadnji zagon zadnjega shranjevanja uspe, zaključi s povzetkom v enem stavku, odgovor pa se konča z `Verified: the latest test run of the saved workflow passed.`

- Testni zagoni so resnični zagoni. Njihovi stranski učinki se zgodijo in pojavijo se v zgodovini zagonov workflowa kot vsak drug zagon.
- Shranjevanja sledijo poti urejevalnika: sprememba grafa ohrani prejšnji graf v **Edit History** workflowa.
- Če želite spremeniti workflow, ki ga je zgradil prej, nadaljujte nit z istim `conversation_id`. Pomočnik posodobi ta workflow, namesto da bi ustvaril novega, in spreminja le workflowe, ki jih lahko urejate.
- Ko je porabljenih vseh pet testnih zagonov, se pomočnik ustavi in pojasni, kaj še vedno ne uspe.

Poverilnice ostanejo v uporabniškem vmesniku: `heym_chat` nikoli ne prikazuje, izbira ali ustvarja jih. Ko gradi ali ureja workflow, so nova vozlišča, ki potrebujejo poverilnico, prazna, odgovor pa jih imenuje, tako da jih lahko nastavite v urejevalniku.

Podatkovne tabele so drugačne. Tabela ne vsebuje nobene skrivnosti, zato lahko `heym_chat` našteje vaše tabele, vpraša, katero naj uporabi workflow, in ustvari novo s svojimi stolpci. Nikoli ne bere ali piše vrstic.

### Poverilnica in model

`heym_chat` izvaja motor na vašem Heym računu, zato potrebuje svojo LLM poverilnico:

| Polje | Obnašanje |
|-------|----------|
| **Poverilnica** | Izberite katero koli OpenAI, Google ali Custom poverilnico, do katere imate dostop. Prednastavljeno iz prednostne poverilnice v [Nastavitvah](../reference/user-settings.md), ko je niste izbrali. |
| **Model** | Naložen iz izbrane poverilnice. Prednastavljeno iz vašega preferiranega modela, ko se poverilnica ujema. |

Če katerikoli manjkajo, se pripomoček še vedno prikaže v `tools/list`, vendar vsak klic vrne napako, ki vas obvešča, da dokončate nastavitev v tem zavihku.

### Argumenti in zgodovina

| Argument | Obvezno | Opis |
|----------|----------|-------------|
| `message` | Da | Navodilo ali vprašanje, v naravnem jeziku. |
| `conversation_id` | Ne | `conversation_id` iz prejšnjega rezultata `heym_chat`, za nadaljevanje te teme. |

Vsak klic se zapiše v vašo [Chat zavihek](./chat-tab.md) zgodovino kot običajen pogovor, označen z ikono vtiča v seznamu pogovorov. Sporočila, kartice pripomočkov in pavze za pojasnilo izgledajo natanko tako kot pogovor, ki ste ga začeli sami, in lahko odprete nit ter nadaljujete pogovor v brskalniku. Vsak rezultat vrne svoj `conversation_id`, tako da lahko MCP stranka nadaljuje isto nit namesto da bi odprla novo pri vsakem klicu.

Ko asistent potrebuje pojasnilo, se ustavi in to pove; odgovorite z odgovori, ki uporabljajo isti `conversation_id`.
## Imenovani MCP strežniki

Imenovani strežniki vam omogočajo segmentacijo workflows v izolirane MCP endpoint-e. Vsak strežnik ima svojo URL povezavo in API ključ, tako da se lahko različni AI odjemalci, ekipe ali uporabe povežejo natančno na tiste workflows, ki jih potrebujejo.

### Ustvarjanje imenovanega strežnika

1. Vnesite ime v vhodno polje na dnu zavihka MCP (npr. **CRM Orodja**)
2. Kliknite **Ustvari** — nova kartica strežnika se takoj prikaže
3. Kliknite na kartico, da jo razširite

### Nastavitve po strežniku

Vsaka kartica strežnika prikazuje:

| Nastavitev | Opis |
|------------|------|
| **SSE Endpoint** | Edinstvena URL povezava: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API ključ** | Neodvisen ključ, prikazan enkrat ob generiranju ali regeneriranju. Takoj ga kopirajte; shranjen je v hashirani obliki in ga kasneje ni mogoče razkriti |
| **Kako se povezati** | **Kopiraj JSON** kopira pripravljen MCP konfiguracijo za lepljenje; **Dodaj v Kazalec** ga namesti z enim klikom |
| **Heym zmožnosti** | Preklopite orodje `heym_chat` za ta strežnik in izberite njegove poverilnice in model |
| **Dodeljeni Workflows** | Preklopite, kateri od vaših workflows ta strežnik izpostavi |

### Dodelitev Workflows

Dodelitev workflows je po strežniku in neodvisna od preklopa privzetega strežnika. Workflow je lahko omogočen na privzetem strežniku in na več imenovanih strežnikih hkrati, ali pa na nobenem.

Preklop workflow premakne na vrh dodeljenega seznama, tako da ostane vrstica, ki ste jo pravkar spremenili, vidna namesto da bi se pomaknila stran.

### Avtentikacija

Imenovani strežniki podpirajo iste metode avtentikacije kot privzeti strežnik:

- **X-MCP-Key header** – Posredujte API ključ strežnika neposredno (API odjemalci, Kazalec). Samo za glavo: ključi niso sprejeti kot `?key=` poizvedbeni parameter, ker URL-ji končajo v dnevnikih dostopa, dnevnikih proxy in zgodovini brskalnika.
- **Claude, ChatGPT in Gemini OAuth** – Dodajte URL strežnika v priključke ali aplikacije po meri odjemalca; pustite poverilnice prazne in odjemalec se samodejno registrira prek OAuth. Bearer token mora potovati v `Authorization` glavi, ne kot `?token=`.
- **Sejni token** – Izdaja se med SSE handshake; omejen je na določen strežnik, tako da tokeni iz enega imenovanega strežnika ne morejo dostopati do drugega. Ta kratkotrajni `?session=` parameter ni prizadet.

### Brisanje imenovanega strežnika

Kliknite ikono **X** na glavi kartice strežnika. Brisanje odstrani strežnik in vse njegove dodelitve workflows; sami workflows niso prizadeti.

## SSE Endpoint

| Strežnik | Endpoint |
|----------|----------|
| Privzeti | `{origin}/api/mcp/sse` |
| Imenovani | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Oba endpoint-a podpirata SSE transport (GET, MCP specifikacija 2024-11-05) in Streamable HTTP transport (POST, MCP specifikacija 2025-03-26). Claude, ChatGPT in Gemini uporabljajo OAuth 2.1 / PKCE za varno prijavo na obeh.

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – MCP kot prvovrstna prvina v Heym
- [Agent Node](../nodes/agent-node.md) – Agent vozlišče s podporo za MCP orodja
- [Arhitektura agenta](../reference/agent-architecture.md) – MCP odjemalec, razporeditev orodij, orkestrator
- [Triggerji](../reference/triggers.md) – MCP kot vstopna točka za workflows
- [Chat Tab](./chat-tab.md) – Motor za orodje `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Ustvarjanje in upravljanje workflows
- [Vrste vozlišč](../reference/node-types.md) – Pregled AI vozlišč
- [Kontekstni prikaz](../reference/contextual-showcase.md) – Kompaktni vodnik po površinah nadzorne plošče
