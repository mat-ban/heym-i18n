# Analiza Workflowa

**Analiza Workflowa** je panel na levi strani, ki vsebuje en skupen, urejen Markdown dokument za vsak workflow. Uporabite ga za razlago delovanja workflowa in za zajemanje idej za izboljšave — ter omogočite AI, da vam ustvari prvi osnutek.

Dokument je deljen: vsakdo, ki lahko dostopa do workflowa, ga lahko bere in ureja. Shranjen je skupaj z workflowom in se samodejno izbriše, ko je workflow izbrisan.

## Odprtje panela

1. Odprite workflow v urejevalniku.
2. Kliknite **Analiziraj** (ikona iskrice) v orodni vrstici urejevalnika.
3. Panel se odpre na levi strani. Paleta vozlišč (levi panel) se medtem skrči; ponovni odpiranje palete vozlišč zapre analitični panel.

Panel je na voljo samo za shranjene workflows. Pri popolnoma novem, neshranjenem workflowu ga najprej shranite.

## Dokument

Panel prikazuje en sam Markdown dokument z dvema pogledoma, ki ju preklapljate s pomočjo gumbov **Uredi** (svinčnik) in **Predogled** (oko):

| Pogled | Namen |
|--------|-------|
| **Uredi** | Navaden Markdown urejevalnik (besedilno polje). |
| **Predogled** | Prikazani Markdown. |

Zgornji del prikazuje **kdo je nazadnje uredil** dokument in kdaj.

### Shranjevanje

Kliknite **Shrani**, da ohranite svoje spremembe. Shrani je omogočeno le, ko so prisotne neshranjene spremembe.

Ker je dokument deljen, shranjevanja uporabljajo optimistično konkurenco:

- Če je nekdo drug shranil novejšo različico odkar ste odprli panel, bo vaše shranjevanje zavrnjeno in prikazano bo opozorilo, ki navaja drugega urednika.
- Nato lahko izberete **Ponovno naloži (opusti moje)**, da prevzamete različico s strežnika, ali **Prepiši**, da prisilno shranite svojo različico namesto njihove.

## AI analiza

Izberite **Poverilnico** in **Model** LLM na vrhu panela (seznam modelov se naloži iz izbrane poverilnice — glejte [Poverilnice](../tabs/credentials-tab.md)). Nato zaženite analizo:

- **Analiziraj moj workflow** — prikazano, ko je dokument prazen. Neposredno v urejevalnik pretaka poročilo, ki ga ustvari AI, kot neshranjen osnutek. Preglejte in uredite ga, nato pa **Shrani**.
- **Ponovno analiziraj** — prikazano, ko dokument že vsebuje vsebino. Pretaka sveže poročilo v ločen **predogled**, pri čemer vaša trenutna dokumentacija ostane nedotaknjena. Izberite **Sprejmi**, da zamenjate vsebino urejevalnika z novo analizo, ali **Zavrni**, da obdržite tisto, kar ste imeli.

Obe akciji najprej **izvedejo workflow** (ko je veljaven in izvedljiv) in vključita rezultate izvajanja v analizo, tako da poročilo odraža, kako workflow dejansko deluje. Če workflow ne more teči, analiza poteka iz njegove statične strukture.

Ustvarjeno poročilo pokriva tri odseke, v tem vrstnem redu: **Področja izboljšav** (konkretni predlogi, vključno z **varnostnim** vidikom, kadar workflow obravnava poverilnice, uporabniške vnose, zunanje zahteve ali izpostavljenost podatkov), **Namen** workflowa in **Kaj počne** (korak za korakom skozi vozlišča).

Odsek **Področja izboljšav** vedno izvede štiri eksplicitne preglede:

1. **Pokritost napak** — če platno nima vozlišča [Obravnava napak](../nodes/error-handler-node.md) in ni konfiguriranega workflowa za napake, to poročilo izpostavi in priporoča dodajanje obravnave napak.
2. **Prihranjen čas** — če ni nastavljenega ocenjenega prihranka časa na izvedbo, poročilo priporoča, da ga konfigurirate, da se lahko metrika [Analitika](../tabs/analytics-tab.md) **Prihranjen čas** napolni.
3. **Mrežna vozlišča** — za vozlišča, ki izvajajo mrežne klice (kot so [HTTP](../nodes/http-node.md) in integracijska vozlišča), poročilo priporoča obravnavo napak specifično za vozlišča (ponovno poskusi in/ali nadaljuj ob napaki) na teh vozliščih.
4. **Opozorila** — ko za workflow niso konfigurirana [opozorila](../tabs/alerts-tab.md), poročilo priporoča nastavitev opozoril pred prehodom v produkcijo.

5. **Evals**: ko ima workflow vozel [Agent](../nodes/agent-node.md) brez zbirke agenta, poročilo priporoča **Agent Suite** (ali **Prompt Suite**) v [Evals](../tabs/evals-tab.md#agent-suites); kadar ima vozel [LLM](../nodes/llm-node.md), priporoča **Prompt Suite** za preizkus poziva v različnih modelih.

### Zagon analize iz lastnosti

Ko ima workflow vozlišča na platnu, vendar še nima analitičnega dokumenta, se v panelu [Lastnosti](./canvas-features.md) na ravni workflowa prikaže gumb **Zagon analize** (prikazan, ko nobeno vozlišče ni izbrano). Odpre ta panel za Analizo Workflowa, da lahko izberete poverilnico in model ter ustvarite poročilo.

Vsak zagon analize se zabeleži v [Zgodovina](../tabs/traces-tab.md) pod virom **Analiza Workflowa**.

Če ni konfigurirane poverilnice LLM, je gumb Analiziraj onemogočen — dodajte eno v [Zavihek Poverilnice](../tabs/credentials-tab.md).

## Sorodno

- [AI Asistent](./ai-assistant.md) — generirajte ali spremenite vozlišča workflowa iz naravnega jezika.
- [Lepljiva opomba](../nodes/sticky-note-node.md) — za kratke opombe, pritrjene neposredno na platno.
