# Čovjek-u-povezivanju

Čovjek-u-povezivanju (HITL) omogućuje [Agent Node](../nodes/agent-node.md) da zatraži odobrenje u određenim trenucima, čeka na ljudsku odluku, a zatim nastavlja workflow iz iste točke izvršavanja.

## Što to radi

- Dodaje eksplicitne točke odobrenja agentu bez potrebe za izradom zasebnog workflow-a za odobrenje
- Stvara jednokratnu javnu URL adresu za pregled na `/review/{token}`
- Omogućuje recenzentu da `Prihvati`, `Uredi i Nastavi` ili `Odbije`
- Označava izvršavanje kao `pending` dok odluka ne stigne
- Nastavlja pauzirano izvršavanje i omogućuje agentu da nastavi nakon odobrenja
- Podržava više uzastopnih HITL točaka u istom izvođenju agenta

## Konfiguracija agenta

Omogućite HITL u panelu svojstava agenta.

| Postavka | Opis |
|----------|------|
| `hitlEnabled` | Uključuje ljudski pregled za ovog agenta |
| `hitlSummary` | Smjernice za odobrenje kada agent treba zatražiti ljudski pregled |

HITL dodaje alat `request_human_review` agentu. Koristite sistemski prompt i `hitlSummary` smjernice kako biste rekli agentu koje radnje trebaju odobrenje. Kada agent odluči da točka treba pregled, šalje jedan Markdown tekst za pregled ljudskoj osobi. Sažetak za recenzenta generira se iz zahtjeva agenta u vrijeme izvođenja; ako ga agent izostavi, Heym ga izvodi iz Markdown tijela. U v1, HITL podržava samo izlaze agenta u tekstualnom načinu, stoga se ne može kombinirati s `jsonOutputEnabled`.

Za MCP alate, Heym traži od modela da interpretira napisane HITL upute u jedan od tri opsega odobrenja:

- `always` za fraze poput "uvijek", "na svakom" ili "za svaki"
- `once` za fraze poput "jednom" ili "samo jedanput"
- `never` za fraze poput "nikada", "ne pitajte" ili "već odobreno"

Ta interpretacija kontrolira hoće li ponovljeni MCP pozivi ponovno pauzirati, ostati odobreni jednom ili potpuno preskočiti ljudski pregled.

Kada je HITL omogućen, agent također izlaže drugi izlazni čvor označen `review`. Koristite tu granu za slanje URL-a za pregled i sažetak na Slack, e-mail, logiranje ili bilo koji drugi tok obavijesti dok glavno izvršavanje čeka na osobu.

## Tok pregleda

1. Agent dođe do koraka koji zahtijeva odobrenje i poziva `request_human_review`
2. Heym stvara javni zahtjev za pregled i vraća URL za pregled
3. Svi čvorovi povezani s agentovim `review` čvorom odmah se izvršavaju s HITL payload-om u čekanju
4. Izvršavanje workflow-a prelazi u `pending`
5. Recenzent otvara `/review/{token}` bez prijave
6. Recenzent bira jednu od radnji:
   - `Prihvati` nastavlja s originalnim Markdown-om
   - `Uredi i Nastavi` nastavlja s uređenim Markdown-om
   - `Odbij` nastavlja s `decision: "refused"` i preskoči daljnje radnje agenta
7. Heym nastavlja workflow iz pohranjenog snimka i omogućuje agentu da nastavi s odobrenim Markdown kontekstom
8. Ako kasniji korak također zahtijeva odobrenje, agent može ponovno pozvati HITL i stvoriti još jednu točku u čekanju

Linkovi za pregled istječu nakon 168 sati ako nitko ne odgovori.

## Javna stranica za pregled

Javna stranica za pregled prikazuje:

- Ime workflow-a i oznaku agenta
- Automatski generirani sažetak recenzenta iz zahtjeva agenta za pregled
- Markdown tekst za pregled prvo, kao glavni sadržaj
- Okvir za uređivanje koji se otvara samo nakon što recenzent klikne `Uredi`
- Uživanje u Markdown pregledu tijekom uređivanja
- Gumb za radnje `Prihvati`, `Uredi i Nastavi`, i `Odbij`

Nakon što je odluka podnesena, token je zaključan i ne može se ponovno koristiti.

## Izlazi i stanje izvršavanja

Dok čeka na pregled, izlaz agenta sadrži payload u čekanju:

```json
{
  "decision": null,
  "summary": "Pregledajte odgovor spreman za kupca prije nego što bude poslan.",
  "draftText": "# Cilj\n...\n\n# Planirani pozivi alata / Radnje\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Pregledajte odgovor spreman za kupca prije nego što bude poslan.\n\n[Otvorite stranicu za pregled](https://example.com/review/abc123)"
}
```

Nakon što recenzent odgovori i workflow se nastavi, konačni izlaz agenta uključuje metapodatke odluke:

```json
{
  "text": "Konačni izlaz agenta nakon odobrenja i izvršavanja",
  "decision": "accepted",
  "summary": "Pregledajte odgovor spreman za kupca prije nego što bude poslan.",
  "originalDraft": "# Cilj\n...\n\n# Planirani pozivi alata / Radnje\n- ...",
  "requestId": "uuid"
}
```

Koristite `$agentLabel.decision` u downstream čvorovima za grananje na prihvaćene, uređene ili odbijene ishode.

## Grana pregleda na platnu

Izlazni čvor `review` dostupan je samo kada je `hitlEnabled` uključen za agenta.

- Izvršava se prije nego što odluka ljudske osobe stigne
- Prima payload HITL u čekanju, uključujući `summary`, `draftText`, `reviewUrl`, `shareText` i `shareMarkdown`
- Namijenjen je za obavijesti ili prijenosne korake kao što su Slack, e-mail ili revizijsko logiranje
- Izvršava se jednom za svaku HITL točku
- Ne izvršava se ponovno nakon što recenzent odgovori; samo normalni izlazni put agenta nastavlja se nakon nastavka
## Gdje se Pojavljuje

- [Povijest Izvršavanja](./execution-history.md) prikazuje `pending` izvršenja odmah i pohranjuje URL za pregled u rezultatima čvora
- [Portal](./portal.md) odgovori u chatu prikazuju poveznicu za ljudski pregled umjesto praznog odgovora
- Debug panel i dijalozi povijesti prikazuju konačnu HITL odluku i pregledani tekst
- Rukovanje izlazom pregleda može obavijestiti vanjske kanale čak i kada je workflow pokrenut putem cron-a, cURL-a ili prometa s portala
- Više HITL kontrolnih točaka ponovno koristi istu stavku povijesti izvršavanja dok stvara novu poveznicu za jednokratni pregled za svaku pauzu

## Trenutna Ograničenja

- HITL je dostupan samo na Agent čvorovima
- HITL koristi tekstualni izlaz agenta i ne podržava JSON izlaz u v1
- Pauzirano izvršavanje nastavlja se iz pohranjene snimke workflow-a, a ne iz najnovije uređene verzije workflow-a
- Ugniježđeni pod-workflow-i ne mogu ući u stanje `pending` HITL u v1; zatražite pregled od roditeljskog agenta prije nego što ih pozovete

## Povezano

- [Agent Čvor](../nodes/agent-node.md) - Konfigurirajte HITL na agentu
- [Arhitektura Agenta](./agent-architecture.md) - Kako se agenti, alati, pod-agent i HITL uklapaju zajedno
- [Povijest Izvršavanja](./execution-history.md) - Istražite `pending` i nastavljena izvršenja
- [Odbor](../tabs/board-tab.md) - Odbor lanac izvršavanja pauzira karticu u `pending` (amber) stanju na HITL
- [Portal](./portal.md) - Javni chat tokovi i HITL poveznice za pregled
