# Varovalne meje

Varovalne meje vam omogočajo, da blokirate nevarna ali nezaželena sporočila uporabnikov, preden dosežejo [LLM](../nodes/llm-node.md) ali [Agent](../nodes/agent-node.md) vozlišče. Ko sporočilo ustreza blokirani kategoriji, vozlišče vrže napako namesto da bi izvedlo, kar lahko ujamete z vozliščem [Error Handler](../nodes/error-handler-node.md).

## Omogočanje varovalnih meja

Odprite ploščo lastnosti za vozlišče **LLM** ali **AI Agent** in se pomaknite do preklopnika **Enable Guardrails** (ikona ščita). Označitev polja razkrije konfiguracijski razdelek.

## Poverilnica in model varovalnih meja

Ko so varovalne meje omogočene, morate izbrati **poverilnico in model** za varnost vsebine. Preverjanje varovalnih meja uporablja izbrano poverilnico in model iz vozlišča — brez rezervne možnosti, brez okolijskih spremenljivk. Uporabite poverilnico OpenAI ali Google za zanesljivo filtriranje vsebine, še posebej, ko vaš glavni model uporablja prilagojen ponudnik (npr. Zhipu, GLM), ki morda ne podpira varovalnih meja ali vrne napake API (npr. 404).

Delovni tok ne more teči, dokler nista izbrana tako Poverilnica varovalnih meja kot Model varovalnih meja.

## Blokirane kategorije

Izberite eno ali več kategorij za blokiranje. Sporočilo, ki ustreza kateri koli označeni kategoriji, bo zavrnjeno.

| Kategorija | Kaj blokira |
|---|---|
| **Nasilje** | Nasilna, grozeča ali fizično škodljiva vsebina |
| **Sovražni govor** | Diskriminacija, rasizem ali bigotizem |
| **Seksualna vsebina** | Eksplicitna seksualna vsebina ali scenariji |
| **NSFW / Kletvice** | Groba jezik, kletvice, eksplicitne žaljivke in odrasli sleng v katerem koli jeziku |
| **Samopoškodovanje** | Samomor, samopoškodovanje ali sorodna vsebina |
| **Nasilje** | Osebni napadi, žaljivke, nadlegovanje ali ustrahovanje |
| **Nezakonita dejavnost** | Navodila za izvajanje nezakonitih dejanj |
| **Politični ekstremizem** | Ekstremistična politična vsebina ali nasilna propaganda |
| **Spam / Phishing** | Spam, phishing ali socialno inženirstvo |
| **Zahteva po osebnih podatkih** | Zahteva po zasebnih ali osebno prepoznavnih informacijah |
| **Vstavljanje pozivov** | Poskusi zaobiti sistemske navodila, vnesti zlonamerne pozive ali manipulirati obnašanje modela |

## Občutljivost

Nastavitev **Občutljivost** nadzira, kako strogo se zaznavajo kršitve:

| Raven | Obnašanje |
|---|---|
| **Nizka** | Oznake tudi za mejne ali dvoumne primere |
| **Srednja** *(privzeto)* | Oznake jasnih kršitev; ignorira mejne primere |
| **Visoka** | Oznake le ekstremnih, nedvoumnih kršitev |

## Kako deluje zaznavanje

Zaznavanje uporablja **izbrano poverilnico in model varovalnih meja**:

- **OpenAI poverilnice** — uporablja [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (brezplačno, hitro, brez uporabe žetonov) za pet kategorij, ki jih pokriva nativno (Nasilje, Sovražni govor, Seksualna vsebina, Samopoškodovanje, Nasilje). Preostale kategorije se preverjajo z LLM klasifikacijo z uporabo izbranega modela varovalnih meja.
- **Google / prilagojene poverilnice** — vse kategorije se preverjajo z LLM klasifikacijo z uporabo izbrane poverilnice in modela varovalnih meja.

Ko vaš glavni model uporablja prilagojen ponudnik (npr. Zhipu, Cerebras), ki lahko vrne 404 ali druge napake API, izberite **OpenAI ali Google poverilnico** za varovalne meje.

## Oblika napake

Ko se aktivira varovalna meja, vozlišče sproži napako z sporočilom:

```
Kršitev varovalne meje: sporočilo blokirano zaradi prepovedane vsebine.
Kršene kategorije: Nasilje, Sovražni govor
```

Izhod `output` vozlišča prav tako vključuje `guardrail_violated_categories` (niz oznak kršenih kategorij), tako da lahko Plošča za odpravljanje napak in Zgodovina izvajanja jasno prikažeta "Blokirano z: X, Y".

Uporabite možnost vozlišča **Continue on error** (ali vozlišče [Error Handler](../nodes/error-handler-node.md)), da usmerite delovni tok na rezervno vejo, ko se aktivirajo varovalne meje.

## Primer delovnega toka

```
Vhod → Agent (varovalne meje: Nasilje, Nezakonita dejavnost, resnost: Srednja)
          ├── obravnava izhoda → LLM → Izhod
          └── obravnava napake  → Error Handler → Set("Opravičujemo se, ta zahteva je bila blokirana.") → Izhod
```

## Opombe

- **Brez ponovitev**: Kršitve varovalnih meja so namerne blokade in nikoli ne bodo ponovljene, tudi če ima vozlišče omogočeno "Retry on failure".
- Ni potrebna migracija baze podatkov — nastavitve varovalnih meja so shranjene v JSON-u vozlišča delovnega toka skupaj z drugimi podatki vozlišča.
- Varovalne meje preverjajo rešeno **sporočilo uporabnika** (po tem, ko so izrazi predloge ovrednoteni), ne surovo predlogo.
- Nastavitev **brez kategorij** med omogočenimi varovalnimi mejami je enakovredna temu, da jih imate onemogočene — preverjanje se ne izvede.
- Pri **nizki** resnosti se vedno izvede LLM klasifikacija (najboljša večjezična pokritost). Poverilnice OpenAI dodatno izvajajo Moderation API.
- Pri **srednji/visoki** resnosti poverilnice OpenAI uporabljajo Moderation API za nativno podprte kategorije in LLM klasifikacijo za preostale. Google/prilagojene poverilnice vedno uporabljajo LLM klasifikacijo.
- LLM klasifikacija je **neodvisna od jezika** — zaznava kršitve v turščini, arabščini, ruščini, španščini in drugih jezikih.
