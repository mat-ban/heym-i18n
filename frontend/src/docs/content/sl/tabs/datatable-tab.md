# Podatkovna tabela

Zavihek **Podatkovna tabela** vam omogoča ustvarjanje in upravljanje strukturiranih podatkovnih tabel neposredno v Heym. Tabele se lahko uporabljajo v workflows preko [DataTable vozlišča](../nodes/datatable-node.md) za programatične CRUD operacije.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Oglejte si predstavitev podatkovne tabele</a></p>

## Ustvarjanje tabele

1. Pojdite na zavihek Podatkovna tabela iz nadzorne plošče
2. Kliknite **Ustvari podatkovno tabelo**
3. Vnesite ime in neobvezni opis
4. Dodajte stolpce s pomočjo urejevalnika stolpcev

## Stolpci

Vsak stolpec ima:

| Lastnost | Opis |
|----------|-------------|
| Ime | Prikazno ime stolpca |
| Tip | `string`, `number`, `boolean`, `date` ali `json` |
| Obvezno | Ali morajo nove vrstice vključevati ta stolpec |
| Edinstveno | Ali morajo biti vrednosti edinstvene med vrsticami |
| Privzeta vrednost | Samodejno izpolnjena, ko vrstica izpusti ta stolpec |

Dodajte, uredite ali odstranite stolpce iz glave podrobnega pogleda tabele.

## Generiranje stolpcev z AI

Namesto da bi stolpce dodajali ročno, lahko tabelo opišete v preprostem jeziku (ali prilepite vzorčni JSON) in pustite, da LLM predlaga shemo. Obe možnosti odpreta enak pogovorno okno:

- **Generiraj z AI** (glava seznama podatkovnih tabel) — ustvari povsem novo tabelo iz vašega opisa.
- **AI stolpci** (podrobni pogled tabele, poleg kontrol stolpcev) — predlaga *nove* stolpce, ki jih dodate v odprto tabelo.

### Kako deluje

1. Izberite **LLM poverilnico** in **model** (privzeto na vašo prvo LLM poverilnico in njen najnovejši model).
2. Vpišite opis — na primer *"Tabela knjig z naslovom, avtorjem, številom strani in ali sem jo prebral"* — ali prilepite vzorčni JSON/schema.
3. Kliknite **Generiraj**. Model vrne predlagano shemo.
4. Preglejte generirane stolpce v urejevalni obliki: spremenite **ime**, **tip**, **privzeto**, **edinstveno** in **ne prazno** (obvezno) za vsak stolpec, izbrišite neželene stolpce ali **Dodajte stolpec** ročno. Za novo tabelo lahko tudi uredite AI-predlagano **ime** in **opis**.
5. Kliknite **Ustvari tabelo** (nova tabela) ali **Dodaj stolpce** (obstoječa tabela), da shranite. Pritisnite **Esc**, da kadar koli zaprete pogovorno okno.

### Samo dodajanje za obstoječe tabele

Ko generirate stolpce za obstoječo tabelo, model vidi vaše trenutne stolpce kot kontekst in predlaga **samo nove** stolpce. Obstoječi stolpci in njihovi podatki nikoli niso spremenjeni ali odstranjeni — generirani stolpci se dodajo. Podvojena imena (neobčutljiva na velike in male črke) se samodejno odstranijo.

> LLM poverilnica (OpenAI, Google ali po meri) je obvezna. Če je nimate, jo najprej dodajte v Nastavitvah.

## Upravljanje vrstic

- **Dodaj vrstico**: Kliknite gumb za dodajanje, da ustvarite novo vrstico
- **Inline urejanje**: Dvakrat kliknite na katero koli celico, da uredite njeno vrednost. Pritisnite Enter ali kliknite stran, da shranite, Escape za preklic
- **Izbriši vrstico**: Uporabite meni dejanj vrstice, da odstranite vrstico
- **Stranjenje**: Vrstice se prikazujejo po 25 na stran z navigacijo po straneh

## Uvoz/izvoz CSV

### Uvoz
1. Kliknite **Uvozi CSV** v podrobnem pogledu tabele
2. Izberite CSV datoteko za nalaganje
3. Predogled prvih 5 vrstic in preslikava stolpcev
4. Zeleni stolpci so ujemajoči se z obstoječimi stolpci tabele; rumeni so neujemajoči
5. Kliknite Uvozi za množično vstavljanje vrstic

### Izvoz
Kliknite **Izvozi CSV**, da prenesete vse vrstice kot CSV datoteko.

## Deljenje

Delite tabele z drugimi uporabniki ali ekipami:

1. Odprite pogovorno okno za deljenje iz podrobnega pogleda tabele
2. Dodajte uporabnike po e-pošti s **pravicami za branje** ali **pisanje**
3. Dodajte ekipe s **pravicami za branje** ali **pisanje**
4. Uporabniki samo za branje lahko vidijo podatke; uporabniki za pisanje lahko spreminjajo vrstice

## Ustvarjanje tabel z AI pomočnikom

Platno [AI pomočnik](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) in orodje `heym_chat` na [MCP zavihku](./mcp-tab.md) lahko izberejo eno od vaših tabel za workflow, ki ga gradijo, ali ustvarijo novo. Predlagajo ime in stolpce ter ustvarijo tabelo, ko oddate vprašanje. Nikoli ne spremenijo stolpcev obstoječe tabele ali se dotaknejo njenih vrstic: tukaj dodajte ali uredite stolpce.

## Uporaba v workflows

[DataTable vozlišče](../nodes/datatable-node.md) povezuje tabele z workflows. Operacije vključujejo iskanje, pridobivanje vseh, pridobivanje po ID-ju, vstavljanje, posodabljanje, odstranjevanje in upsert. Poverilnice niso potrebne.

## LLM stroškovna tabela (sistem tabela)

Prikazana je pritrjena sekcija **Sistemske tabele** nad vašimi uporabniško ustvarjenimi tabelami z enim samim vnosom: **LLM stroškovna tabela**. To je fiksna shema, ki jo lahko urejate na ravni uporabnika in prikazuje cene po modelih, ki se uporabljajo v [Izvedbah](./traces-tab.md) stroškovnih grafikonih.

### Odkodiranje podatkov

Heym ohranja globalno tabelo cen po modelih, ki je zasnovana na javnem cenovnem končnem točki Helicone (`https://www.helicone.ai/api/llm-costs`). Sinhronizacija poteka v ozadju prvič, ko odprete tabelo ali Izvedbe, in je omejena na en prenos na 24 ur. Pritisnite **Osveži**, da prisilite takojšnjo ponovno sinhronizacijo. Odstranitve iz seznama Helicone niso lokalno izbrisane, tako da zgodovinski pregledi stroškov ostanejo stabilni.

### Shema (stolpci samo za branje)

| Stolpec | Pomen |
|---|---|
| Pružitelj | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativno, uporablja Helicone) |
| Model | Identifikator modela, ujemajoč se z `trace.model` |
| Operacija | Ujemajoči operator: `equals`, `startsWith` ali `includes` |
| Vhod $/1M | USD na 1 milijon prompt tokenov |
| Izhod $/1M | USD na 1 milijon completion tokenov |
| Vir | `helicone`, `seed` ali `user` |
### Prilagajanje cen

- **Uredite vrstico** za nadomestitev njenih cen. Vaša nadomestitev je specifična za uporabnika in je označena z oznako `Customized`; prihodnji sinhronizaciji Helicone jo ignorirata.
- **Ponastavi na privzeto** odstrani nadomestitev in obnovi globalno vrednost za to vrstico.
- **Dodaj prilagojen model** odpre pogovorno okno za ustvarjanje vrstice, ki je namenjena samo uporabniku (na primer, zasebni fino prilagojen model, ki ga Helicone ne navaja). Prilagojene vrstice so označene z `User added`, njihovo brisanje pa jih popolnoma odstrani.

### Ujemanje z izvodi

Ko nadzorna plošča Izvodi izračuna stroške, primerja vsak `trace.model` z:

1. Vašimi nadomestitvami (natančno ujemanje po imenu modela) najprej
2. V nasprotnem primeru z globalno tabelo — `equals` natančno ujemanje ima prednost pred `startsWith`/`includes`; izenačenja znotraj istega operatorja se rešujejo z najdaljšim ujemanjem predpone/substringa modela

Če nobena vrstica ne ustreza, je model naveden pod obvestilom **Unpriced models** na strani Izvodi; njegov prispevek k stroškom je nič, dokler ne dodate prilagojene vrstice ali nadomestite eno.

## Sorodno

- [DataTable Node](../nodes/datatable-node.md) - Referenca za vozlišče delovnega toka
- [Traces Tab](./traces-tab.md) - Uporablja LLM Cost Table za stroškovni donut in KPI kartice
- [Grist Node](../nodes/grist-node.md) - Alternativa za zunanjo preglednico
- [Variables Tab](./global-variables-tab.md) - Alternativa za shranjevanje ključ-vrednost
