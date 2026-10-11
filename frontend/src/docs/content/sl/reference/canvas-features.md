# Funkcije Platna

Urejevalnik workflow-ov ponuja več funkcij za odpravljanje napak, testiranje in organizacijo vozlišč: **Zagon do vozlišča**, **Pripeta podatka**, **Zapisniki izvajanja**, **Omogoči/Onemogoči** in **Izvleči v pod-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Oglejte si predstavitev urejevalnika</a></p>

## Zagon do vozlišča

Premaknite kazalec nad katero koli vozlišče, razen lepljivega zapiska, in kliknite **Zagon** pod njim. Heym izvede to vozlišče in njegove odvisnosti, ki so zgoraj, pri čemer spodnja vozlišča in nepovezane veje ostanejo nedotaknjene. To uporablja testni način platna, vključno s pripetimi izhodi in običajnimi pogoji veje workflow-a.

Če izbrana pot vsebuje vhodna polja, se odpre desni **Zagon** panel in se osredotoči na prvo polje. Vnesite vrednosti, nato kliknite **Zagon do _oznake vozlišča_** ali pritisnite **Ctrl+Enter** (Cmd+Enter na macOS). Splošni način telesa se osredotoči na urejevalnik JSON telesa. Poti brez vhodnih polj se izvedejo takoj, ne da bi odprli panel. Pripeta vhodna vozlišča ponovno uporabijo svoj pripeti izhod, ne da bi zahtevala vhod.

Panel ohranja izbrani cilj za naslednje zagone. Izberite **Zagon celotnega workflow-a**, da izbrišete cilj. Gumbi za zagon so onemogočeni, medtem ko je izvajanje aktivno. Cilj znotraj zanke ustavi zagon, ko je to vozlišče prvič doseženo; izbira vozlišča po zanki izvede celotno zgornjo zanko.

## Pripeta podatka

Pripeta podatka vam omogoča, da pripnete izhod vozlišča iz zadnjega zagona, tako da lahko testirate spodnja vozlišča, ne da bi ponovno izvajali pripeto vozlišče.

### Kje ga najti

- **Panel lastnosti** – Izberite vozlišče in se pomaknite do razdelka **Pripeta podatka**
- **Oznaka vozlišča** – Ikona priponke se prikaže na vozlišču, ko so podatki pripeti

### Dejanja

| Dejanja | Opis |
|---------|------|
| **Pripni** | Pripne izhod zadnjega izvajanja vozlišča (na voljo po zagonu) |
| **Počisti** | Odstrani pripete podatke |
| **Uredi** | Uredite pripeti JSON neposredno; kliknite Shrani, da uporabite |

### Obnašanje v testnem načinu

Ko izvajate workflow v testnem načinu, vozlišča z `pinnedData` preskočijo izvajanje in uporabijo pripeti izhod namesto tega. Uporabite to za:

- Testiranje spodnje logike brez klicanja zunanjih API-jev
- Odpravljanje napak v izrazih, ki se sklicujejo na izhod vozlišča
- Iteracijo po pozivih ali pogojih s fiksnimi vzorčnimi podatki

Dopolnitev izrazov v urejevalniku uporablja pripete podatke, kadar so na voljo, za predlaganje polj.

## Zapisniki izvajanja

**Debug panel** (spodnji predal) prikazuje zapise izvajanja v realnem času med izvajanjem workflow-ov. Prav tako lahko odprete aktivno produkcijsko izvajanje iz pogovora Zgodovina ali kartice na plošči. Urejevalnik se poveže s SSE tokom tega zagona, obnovi rezultate dokončanih vozlišč in še naprej prikazuje animacije vozlišč in zapise, ko se nova vozlišča začnejo in končajo.

### Kaj prikazuje

- **Rezultati vozlišč** – Status po vozliščih (`uspeh`, `napaka`, `preskočeno`, `izvaja se`), čas izvajanja in izhod
- **Končni izhodi** – Agregirani izhodi iz [Output](../nodes/output-node.md) vozlišč
- **Napredek agenta** – Za [Agent](../nodes/agent-node.md) vozlišča, korak za korakom klici orodij in razmišljanje

### Dejanja

- **Kopiraj kot JSON** – Kopira celoten zapis izvajanja v odložišče
- **Odpri v JSON urejevalniku** – Odpre zapis v JSON Hero ali JSON Editor Online za pregled
- **Prenesi ustvarjene datoteke** – Če je veščina ustvarila prenosljive datoteke (`_generated_files`), se prikaže gumb Prenesi. Prenosi posameznih datotek se izvedejo neposredno; več datotek odpre izbiro.

### Razlikovanje od zavihka Zapiski

Debug panel prikazuje **zapisnike izvajanja workflow-a** (rezultati vozlišč, izhodi). [Zavihek Zapiski](../tabs/logs-tab.md) prikazuje **zapisnike Docker kontejnerjev** (backend, frontend, baza podatkov). <!-- pragma: allowlist secret -->

## Omogoči / Onemogoči

Lahko onemogočite vozlišča, tako da se med izvajanjem preskočijo. Onemogočena vozlišča prikazujejo oznako "izklopljeno" in se zdijo zatemnjena.

### Kako preklopiti

| Metoda | Opis |
|--------|------|
| **Panel lastnosti** | Izberite vozlišče → Ikona napajanja (zgoraj desno) |
| **Kontextni meni** | Desni klik na vozlišča → Onemogoči ali Omogoči |
| **Tipkovnica** | Izberite vozlišča → pritisnite **D** (glejte [Tipkovne bližnjice](./keyboard-shortcuts.md)) |

### Večizbor

Ko je izbranih več vozlišč, se Omogoči/Onemogoči uporabi za vsa. Kontextni meni prikazuje "Omogoči", če je katero koli izbrano vozlišče onemogočeno, "Onemogoči", če so vsa omogočena.

### Obnašanje med izvajanjem

Vozlišča z `active: false` se preskočijo. Spodnja vozlišča ne prejemajo podatkov iz preskočenih vozlišč. Uporabite to, da začasno izključite vozlišča, ne da bi jih izbrisali.

Za preklop vozlišča vklop ali izklop znotraj workflow-a namesto ročno uporabite [Onemogoči vozlišče](../nodes/disable-node.md) in [Omogoči vozlišče](../nodes/enable-node.md).
## Graf spomina agenta

[Agent](../nodes/agent-node.md) vozlišča z omogočenim **[trajnim spominom](./agent-persistent-memory.md)** prikazujejo roza **možgani** nadzor na vozlišču. Kliknite nanj, da odprete urejevalnik grafov spomina: entitete se prikažejo kot animiran, s silo usmerjen graf, razvrščen po tipu entitete, z iskalnimi izbirniki za vir/cilj za dodajanje odnosov in panelom povezav za preklapljanje med povezanimi entitetami. Enak pogovorni okvir vključuje **Deli spomin z drugimi agenti** (workflow → agent → branje ali branje/pisanje) za [deljenje spomina med agenti](./agent-persistent-memory.md#sharing-with-other-agents). Medtem ko je pogovorni okvir odprt, se glavna funkcija razveljavitve/ponovne izvedbe na platnu odloži, tako da urejanje grafov ohrani svojo zgodovino.

**Filtriranje grafa.** V zgornjem levem kotu platna je kontrola za iskanje, ki je zložena v bližnjico, dokler je ne kliknete ali pritisnete **Ctrl/Cmd+F**. Ujemala bo ime entitete, njen tip in vsako ključno in vrednost atributa, prav tako pa tudi tip odnosa (`parent_of`) in njegove lastnosti; ujemajoč odnos prinese obe entiteti s seboj. Vsi izrazi, ločeni z belimi presledki, morajo ustrezati. Ujemajoča entiteta prinese s seboj celotno sosesko — vsak odnos, v katerem sodeluje, in entiteto na nasprotni strani vsakega — tako da ujemanje nikoli ne ostane kot nepovezana pika. Ujemajoč odnos prinese le dve entiteti, ki ju povezuje, in se tam ustavi, saj iskanje po tipu odnosa postavlja vprašanje o tem odnosu, ne pa o vsem, na kar so pritrjena njegova konca. Vse ostalo je na platnu in v seznamu **Vse povezave** popolnoma skrito — ne zbledelo — in oznaka prikazuje, koliko od skupnih entitet je ostalo. **✕** znotraj polja najprej izbriše poizvedbo, nato pa ob drugem pritisku zapre polje. Escape se razveljavi na enak način, od znotraj navzven: najprej izbriše poizvedbo, nato zapre iskalno polje, nato zapusti razširjen pogled platna in zapre pogovorni okvir šele, ko ni odprtih nobenih od teh. Čiščenje obnovi celoten graf z vsako entiteto nazaj, kjer je bila.

**Ročno postavljanje entitet.** Z vlečenjem entitete jo pritrdite tam, kjer jo spustite, tako da se samodejna postavitev prilagodi preostalem grafu okoli nje, namesto da bi jo potegnila nazaj. Vlečenje izbrane entitete premika njene neposredno povezane entitete skupaj z njo, ohranja obliko gruče; vlečenje katere koli druge entitete premika le to entiteto. **Urejena postavitev** (gumb palice) sprosti vsako pritrjeno entiteto in ponovno izvede samodejno postavitev.

## Izvleči v pod-workflow

Pretvorite izbrana vozlišča v ponovno uporabni pod-workflow in jih nadomestite z [Izvrši](../nodes/execute-node.md) vozliščem.

### Kako uporabiti

1. Izberite eno ali več vozlišč na platnu
2. Desni klik → **Izvleči v pod-workflow**
3. Vnesite ime (in neobvezni opis) za nov workflow
4. Kliknite **Izvleči**

### Kaj se zgodi

- Ustvarjen je nov workflow z izbranimi vozlišči
- Zunanji vnosi (povezave izven izbire) postanejo polja [Vhod](../nodes/input-node.md) pod-workflow
- Zunanji izhodi (povezave do vozlišč zunaj izbire) so preslikani na [Izhod](../nodes/output-node.md) pod-workflow
- Izbrana vozlišča so nadomeščena z enim samim [Izvrši](../nodes/execute-node.md) vozliščem, ki kliče nov workflow
- Preslikave vhodov/izhodov so samodejno ohranjene

### Uporabni primeri

- Ponovna uporaba zaporedja vozlišč v več workflowih
- Poenostavitev kompleksnega workflowa z združevanjem povezanih logik
- Ustvarjanje modularnih, testabilnih pod-workflowov

## Zagon s cURL

Gumb **cURL** v orodni vrstici urejevalnika (zgoraj desno) odpre pogovorni okvir za sestavljanje in kopiranje cURL ukaza za sprožitev workflowa prek API-ja.

- Izberite način telesa zahteve workflowa (`Določeno` ali `Splošno`)
- Nastavite vrsto avtentikacije (Anonimno, JWT ali Avtentikacija z glavo)
- Konfigurirajte predpomnjenje odgovorov in omejevanje hitrosti
- Preklopite na SSE pretakanje in prilagodite sporočila ob zagonu za vsako vozlišče
- Uredite telo zahteve
- V splošnem načinu panel za zagon platna uporablja isto surovo JSON telo kot pogovorni okvir cURL
- Kliknite **Kopiraj cURL**, da kopirate ukaz, pripravljen za zagon

Oglejte si [Webhooki](./webhooks.md#run-with-curl-dialog) za podrobnosti o celotnem pogovornem okviru in [SSE Streaming](./sse-streaming.md) za protokol dogodkov.

## Sorodno

- [Bližnjice na tipkovnici](./keyboard-shortcuts.md) – Vse bližnjice na platnu in v urejevalniku
- [Trajni spomin agenta](./agent-persistent-memory.md) – Obnašanje grafov spomina in API
- [Izvrši vozlišče](../nodes/execute-node.md) – Kliče pod-workflowe
- [Izraz DSL](./expression-dsl.md) – Reference in pritrjeni podatki
- [Struktura workflowa](./workflow-structure.md) – Oblika vozlišč in povezav
- [Prenos in uvoz](./download-import.md) – Izvoz in uvoz workflowov kot JSON
- [Tipi vozlišč](./node-types.md) – Vse vrste vozlišč
- [Zavihek dnevnikov](../tabs/logs-tab.md) – Dnevniki Docker kontejnerjev
- [Zgodovina izvajanja](./execution-history.md) – Prejšnji zagon
- [Predloge](../tabs/templates-tab.md) – Shranjevanje in ponovna uporaba workflowov in vozlišč
- [Kontekstualni prikaz](./contextual-showcase.md) – Kompaktni vodnik po strani, na voljo v urejevalniku
