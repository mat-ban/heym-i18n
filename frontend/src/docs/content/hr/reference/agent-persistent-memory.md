# Trajna memorija agenta

Agent čvorovi mogu zadržati **graf znanja po čvoru** pohranjen u bazi podataka: entitete (s tipovima i svojstvima) i odnose između njih. Kada je omogućeno, Heym **ubacuje sažetak tog grafa u sustavni prompt** pri svakom izvršavanju (ako graf nije prazan). Nakon uspješnog izvršavanja, **LLM ekstrakcijski zadatak** spaja nove činjenice iz razgovora u graf u pozadini.

Pod-agenti i orkestratori koriste graf vezan uz **svoj vlastiti canvas čvor** prema zadanim postavkama. Također možete **dodijeliti drugim agentima pristup za čitanje ili čitanje/pisanje** ovom čvoru grafa (uključujući agente u **drugim workflow-ima** koje posjedujete)—vidite [Dijeljenje s drugim agentima](#sharing-with-other-agents).

## Omogućavanje

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kada je `true`, učitajte graf ovog čvora u sustavni prompt i zakazujte ekstrakciju nakon izvršavanja za graf ovog čvora |
| `memoryShares` | array (opcionalno) | Daje drugim agent čvorovima pristup **ovom** čvoru memorijskog grafa; vidite [Dijeljenje](#sharing-with-other-agents) |

Uključite ga u svojstvima Agent čvora (**Trajna memorija (graf)**). Ružičasta **ikona mozga** na čvoru otvara uređivač grafa kada je memorija omogućena (ili kada je model prikazan).

## Uređivač grafa

Dijalog prikazuje entitete kao animirani, graf vođen silom — obojene kružnice veličine prema broju veza i grupirane prema tipu entiteta — plus uređivanje i navigaciju (prilagodba pogleda, uredan raspored, prečaci na tipkovnici). Možete **dodati, urediti ili izbrisati** čvorove i rubove ručno; odabirnici odnosa Izvor/Cilj su pretraživi za grafove s mnogim entitetima. Odabir čvora prikazuje njegove odlazne i dolazne veze, svaka je klikabilna za skakanje na taj čvor. Promjene se primjenjuju samo na **ovaj** graf agenta (graf za canvas čvor čiji ste mozak otvorili).

## Dijeljenje s drugim agentima

U dijalogu memorijskog grafa, **Dijeli memoriju s drugim agentima** omogućuje vam da povežete **kolege** koji mogu koristiti ovaj graf tijekom izvođenja:

1. Odaberite **workflow** (bilo koji workflow koji možete otvoriti u uređivaču).
2. Odaberite **agent** čvor u tom workflow-u.
3. Postavite **Samo za čitanje** ili **Čitanje i pisanje**.

| Dozvola | Učinak |
|------------|--------|
| Samo za čitanje | Kada agent **kolega** izvrši, ovaj graf se spaja u sustavni prompt kolege (ako ima entitete). Nema ekstrakcije u ovaj graf iz izvršavanja kolege. |
| Čitanje i pisanje | Isti ponašanje prompta kao kod čitanja, a nakon **uspješnog** završetka kolege, uobičajena ekstrakcija memorije može se također **spojiti u ovaj (vlasnički) graf** koristeći vjerodajnice izvršavanja kolege. |

Kolege se pohranjuju po vlasničkom čvoru kao `memoryShares` unosi s `peerWorkflowId` i `peerCanvasNodeId` (i `permission`). Stariji workflow-i mogu izostaviti `peerWorkflowId` za kolege u **istom** workflow-u; uređivač to tretira kao trenutni workflow.

**Dijeljenje između workflow-a** rješava se tijekom izvođenja skeniranjem workflow-a **koje posjedujete**. Izvršenja bez autentificiranog korisničkog konteksta samo rješavaju dijeljenja definirana u **trenutnom** workflow-ovom JSON-u (isti canvas).

## Ponašanje tijekom izvođenja

### Vlastiti graf (`persistentMemoryEnabled`)

1. **Prije LLM poziva** — Ako graf ima entitete, blok se dodaje u sustvenu instrukciju objašnjavajući da su to činjenice iz prethodnih izvršenja (može biti nepotpuno; trenutna korisnička poruka pobjeđuje u sukobu).
2. **Nakon uspješnog završetka** — Pozadinski zadatak traži od modela (iste vjerodajnice kao i izvršavanje agenta) strukturirani JSON (entiteti + odnosi). Taj payload se spaja u bazu podataka (primjenjuju se deduplikacija i čišćenje odnosa za neke tipove, npr. rubove stila zapošljavanja).

### Kolega koji prima dijeljene grafove

Kada agent izvrši, sustav pronalazi **vlasničke** čvorove (u bilo kojem od vaših workflow-a, kada je to moguće) čiji `memoryShares` upućuju na workflow i canvas čvor ovog izvršavanja. Za svako podudaranje, graf tog vlasnika se dodaje kao **dijeljena memorija** u sustavni prompt. **Čitanje i pisanje** kolege dodatno zakazuju ciljeve ekstrakcije za **vlasnički** workflow/graf kada izvršavanje uspije.

Ekstrakcija se **ne** izvršava kada dođe do pogreške u izvršavanju ili završi u HITL čekanju.

## Workflow JSON (`data` polje)

Pohranjeno na agent čvoru poput drugih postavki:

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

`permission` je `"read"` ili `"write"`. Izostavite `memoryShares` ili koristite `[]` kada nema dijeljenja.

Pogledajte [Struktura workflow-a](./workflow-structure.md) za puni oblik objekta čvora.

## Povezano

- [Agent čvor](../nodes/agent-node.md) — Puna konfiguracija agenta
- [Arhitektura agenta](./agent-architecture.md) — Orkestrator, pod-agenti, alati
- [Struktura workflow-a](./workflow-structure.md) — JSON format workflow-a
- [Canvas značajke](./canvas-features.md) — Kontrola mozga i dijalog grafa
- [Traces tab](../tabs/traces-tab.md) — LLM zahtjev/odgovor vidljivost
