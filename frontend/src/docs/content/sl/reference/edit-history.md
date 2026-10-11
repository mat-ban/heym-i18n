# Zgodovina Urejanj

Zgodovina urejanj sledi shranjenim različicam workflow-a. Uporabite jo za ogled sprememb skozi čas, primerjavo različic ali vrnitev na prejšnje stanje.

**Opomba:** Zgodovina urejanj se razlikuje od [Zgodovine Izvajanj](./execution-history.md). Zgodovina urejanj sledi **shranjevanjem** (spremembe strukture workflow-a); Zgodovina izvajanj sledi **izvajanjem** (prejšnjim izvajanjem).

## Kje jo Najdete

**Orodna vrstica urejevalnika** → **Zgodovina Urejanj** (ikona GitBranch)

## Različice

Nova različica se ustvari vsakič, ko **shranite** workflow. Seznam prikazuje:

- **Trenutna** – Najnovejše shranjeno stanje (kar vidite na platnu)
- **Različica N** – Prejšnja shranjevanja s časovnimi žigi

Različice brez sprememb v primerjavi s prejšnjo so skrite.

## Pregled Sprememb

Izberite različico, da vidite, kaj se je spremenilo v primerjavi s trenutnim workflow-om:

| Tip Spremembe | Opis |
|---------------|------|
| **Vozlišča** | Dodana, odstranjena ali spremenjena vozlišča |
| **Povezave** | Dodane, odstranjene ali spremenjene povezave |
| **Konfiguracija** | Nastavitve na ravni workflow-a (avtentikacija, omejitve hitrosti itd.) |

Razširite vsako spremembo, da vidite razlike na ravni polj (npr. katera lastnost vozlišča se je spremenila).

## Predogled

Da vidite, kako je workflow izgledal v prejšnji različici, kliknite **Predogled** poleg Vrnitev.

Odpre se platno v načinu samo za branje, ki prikazuje vozlišča in povezave te različice. Lahko se pomikate in zoomirate, da raziskujete postavitev; iz tega pogleda ni mogoče narediti sprememb.

## Vrnitev

Za obnovitev prejšnje različice:

1. Izberite različico, ki jo želite
2. Kliknite **Vrnitev**
3. Potrdite dejanje
4. Trenutni workflow se nadomesti z izbrano različico; stran se ponovno naloži

Vrnitev ustvari novo "trenutno" stanje—lahko se vrnete nazaj, če je potrebno.

## Počisti Zgodovino

Kliknite ikono smeti v glavi pogovora, da odstranite vso zgodovino različic. Te akcije ni mogoče razveljaviti. Trenutni workflow ostane; le prejšnje različice so izbrisane.

## Kdaj Se Ustvarijo Različice

Različice se ustvarijo le, ko **shranite** (Ctrl/Cmd+S ali gumb Shrani). Neshranjene spremembe niso shranjene v Zgodovino urejanj, dokler jih ne shranite.

Uredbe veščin agenta so vključene v te posnetke. Za brskanje ali obnovitev posamezne veščine brez vrnitve celotnega workflow-a uporabite gumb **Zgodovina** na kartici te veščine v lastnostih vozlišča agenta. Oglejte si [Vozlišče Agenta](../nodes/agent-node.md#skill-history).

## Sorodno

- [Zgodovina Izvajanj](./execution-history.md) – Prejšnja izvajanja in Prinesi na Platno
- [Struktura Workflow-a](./workflow-structure.md) – Oblika vozlišč in povezav
- [Zavihek Workflows](../tabs/workflows-tab.md) – Ustvarjanje in upravljanje workflow-ov
