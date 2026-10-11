# Trajna pomnilnika agenta

Vozlišča agentov lahko hranijo **graf znanja na ravni vozlišča** shranjen v bazi podatkov: entitete (s tipi in lastnostmi) ter odnosi med njimi. Ko je omogočeno, Heym **vstavi povzetek tega grafa v sistemski poziv** pri vsakem zagonu (če graf ni prazen). Po uspešnem zagonu se **naloga za ekstrakcijo LLM** v ozadju združi nove dejstva iz pogovora v graf.

Podagenti in orkestratorji privzeto uporabljajo graf, povezan z **njihovim lastnim platnom**. Prav tako lahko **dovolite drugim agentom dostop za branje ali branje/pisanje** do grafa tega vozlišča (vključno z agenti v **drugih workflows**, ki jih imate v lasti)—glejte [Dajanje dostopa drugim agentom](#sharing-with-other-agents).

## Omogočanje

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Ko je `true`, naloži graf tega vozlišča v sistemski poziv in načrtuje ekstrakcijo po zagonu za graf tega vozlišča |
| `memoryShares` | array (neobvezno) | Dovoljuje drugim vozliščem agentov dostop do **tega** vozlišča pomnilnika; glejte [Dajanje dostopa](#sharing-with-other-agents) |

Omogočite ga v lastnostih vozlišča agenta (**Trajna pomnilnika (graf)**). Roza **možgani** ikona na vozlišču odpre urejevalnik grafa, ko je pomnilnik omogočen (ali ko je prikazan model).

## Urejevalnik grafa

Dialog prikazuje entitete kot animiran, prisilno usmerjen graf — obarvani krogi, velikosti glede na število povezav in razvrščeni po tipu entitete — poleg možnosti za urejanje in navigacijo (prilagodi pogled, urejen izgled, bližnjice na tipkovnici). Lahko **dodate, uredite ali izbrišete** vozlišča in robove ročno; izbirniki za razmerje Vir/Cilj so iskalni za grafe z mnogimi entitetami. Izbira vozlišča prikaže njegove odhodne in prihodnje povezave, vsaka je klikljiva za skok na to vozlišče. Spremembe se uporabijo samo za **ta** graf agenta (graf za platno vozlišča, katerega možgane ste odprli).

## Dajanje dostopa drugim agentom

V dialogu pomnilniškega grafa, **Dajanje dostopa do pomnilnika drugim agentom** vam omogoča, da pripnete **sodelavce**, ki lahko ob zagonu uporabljajo ta graf:

1. Izberite **workflow** (katerikoli workflow, ki ga lahko odprete v urejevalniku).
2. Izberite **agent** vozlišče v tem workflow.
3. Nastavite **Samo za branje** ali **Branje in pisanje**.

| Dovoljenje | Učinek |
|------------|--------|
| Samo za branje | Ko se **sodelavec** agent zažene, se ta graf združi v sistemski poziv sodelavca (če ima entitete). Ekstrakcija v ta graf iz zagonov sodelavca ne poteka. |
| Branje in pisanje | Enako vedenje poziva kot pri branju, in po **uspešni** dokončanju sodelavca se običajna ekstrakcija pomnilnika lahko **združi v ta (lastnikov) graf** z uporabo poverilnice zagon sodelavca. |

Sodelavci se shranijo za vsako lastniško vozlišče kot `memoryShares` vnosi z `peerWorkflowId` in `peerCanvasNodeId` (in `permission`). Starejši workflows morda ne vključujejo `peerWorkflowId` za sodelavce v **istem** workflow; urejevalnik to obravnava kot trenutni workflow.

**Dajanje dostopa med workflows** se reši ob zagonu s skeniranjem workflows **ki jih imate v lasti**. Zagon brez overjenega uporabniškega konteksta le rešuje delitve, definirane v **trenutnem** JSON-u workflow (isto platno).

## Vedenje ob zagonu

### Lastni graf (`persistentMemoryEnabled`)

1. **Pred klicem LLM** — Če graf vsebuje entitete, se blok doda k sistemski navodili, ki pojasnjuje, da so to dejstva iz prejšnjih zagonov (lahko so nepopolna; trenutna uporabniška sporočila prevladajo v primeru konflikta).
2. **Po uspešni dokončanju** — Naloga v ozadju prosi model (ista poverilnica kot zagon agenta) za strukturiran JSON (entitete + odnosi). Ta payload se združi v bazo (uporabljajo se deduplifikacija in čiščenje odnosov za nekatere tipe, npr. robove v slogu zaposlitve).

### Sodelavec, ki prejema deljene grafe

Ko se agent zažene, sistem najde **lastniška** vozlišča (v kateremkoli od vaših workflows, ko je to mogoče), katerih `memoryShares` kažejo na workflow in platno tega zagona. Za vsak ujemajoči se primer se graf tega lastnika doda kot **deljeni pomnilnik** v sistemski poziv. **Branje in pisanje** sodelavci dodatno načrtujejo cilje ekstrakcije za **lastniški** workflow/graf, ko zagon uspe.

Ekstrakcija **ne** poteka, ko zagon napaka ali konča v stanju HITL čakajoč.

## JSON workflow (`data` polje)

Shranjeno na vozlišču agenta kot druge nastavitve:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` je `"read"` ali `"write"`. Odpustite `memoryShares` ali uporabite `[]`, ko ni deljenja.

Glejte [Struktura workflow](./workflow-structure.md) za celotno obliko objekta vozlišča.

## Sorodno

- [Vozlišče agenta](../nodes/agent-node.md) — Celotna konfiguracija agenta
- [Arhitektura agenta](./agent-architecture.md) — Orkestrator, podagenti, orodja
- [Struktura workflow](./workflow-structure.md) — JSON format workflow
- [Funkcije platna](./canvas-features.md) — Nadzor možganov in dialog grafa
- [Zavihek sledi](../tabs/traces-tab.md) — Opazovanje zahtev/odgovorov LLM
