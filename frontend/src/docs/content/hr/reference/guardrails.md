# Zaštitne mjere

Zaštitne mjere omogućuju vam blokiranje nesigurnih ili nepoželjnih korisničkih poruka prije nego što dođu do [LLM](../nodes/llm-node.md) ili [Agent](../nodes/agent-node.md) čvora. Kada poruka odgovara blokiranoj kategoriji, čvor generira grešku umjesto da izvrši radnju, što možete uhvatiti s [Error Handler](../nodes/error-handler-node.md) čvorom.

## Omogućavanje zaštitnih mjera

Otvorite panel s svojstvima za **LLM** ili **AI Agent** čvor i pomaknite se do prekidača **Enable Guardrails** (ikona štita). Označavanje okvira otkriva odjeljak za konfiguraciju.

## Vjerodajnice i model zaštitnih mjera

Kada su zaštitne mjere omogućene, **morate** odabrati **vjerodajnicu i model** za sigurnost sadržaja. Provjera zaštitnih mjera koristi odabranu vjerodajnicu i model iz čvora — bez povratka, bez varijabli okruženja. Koristite OpenAI ili Google vjerodajnicu za pouzdano filtriranje sadržaja, posebno kada vaš glavni model koristi prilagođenog pružatelja (npr. Zhipu, GLM) koji možda ne podržava zaštitne mjere ili vraća API greške (npr. 404).

Workflow se ne može izvršiti dok nisu odabrane i Vjerodajnica zaštitnih mjera i Model zaštitnih mjera.

## Blokirane kategorije

Odaberite jednu ili više kategorija za blokiranje. Poruka koja odgovara bilo kojoj označenoj kategoriji bit će odbijena.

| Kategorija | Što blokira |
|---|---|
| **Nasilje** | Nasilan, prijeteći ili fizički štetan sadržaj |
| **Govori mržnje** | Diskriminacija, rasizam ili bigotizam |
| **Seksualni sadržaj** | Eksplicitan seksualni sadržaj ili scenariji |
| **NSFW / Psovke** | Vulgarni jezik, psovke, eksplicitne uvrede i odrasli sleng na bilo kojem jeziku |
| **Samopovreda** | Samoubojstvo, samoozljeđivanje ili srodni sadržaj |
| **Uznemiravanje** | Osobni napadi, uvrede, maltretiranje ili zastrašivanje |
| **Nezakonita aktivnost** | Upute za izvršavanje nezakonitih radnji |
| **Politički ekstremizam** | Ekstremistički politički sadržaj ili nasilna propaganda |
| **Spam / Phishing** | Spam, phishing ili socijalno inženjerstvo |
| **Zahtjev za osobnim podacima** | Zatraživanje privatnih ili osobno prepoznatljivih informacija |
| **Prompt injekcija** | Pokušaji zaobilaženja sistemskih uputa, umetanja zlonamjernih prompta ili manipulacije ponašanjem modela |

## Osjetljivost

Postavka **Osjetljivost** kontrolira koliko strogo se otkrivaju prekršaji:

| Razina | Ponašanje |
|---|---|
| **Niska** | Označava čak i granične ili nejasne slučajeve |
| **Srednja** *(zadano)* | Označava jasne prekršaje; ignorira granične slučajeve |
| **Visoka** | Označava samo ekstremne, nedvosmislene prekršaje |

## Kako radi otkrivanje

Otkrivanje koristi **odabranu vjerodajnicu i model zaštitnih mjera**:

- **OpenAI vjerodajnice** — koristi [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (besplatno, brzo, bez korištenja tokena) za pet kategorija koje pokriva izvorno (Nasilje, Govori mržnje, Seksualni sadržaj, Samopovreda, Uznemiravanje). Preostale kategorije provjeravaju se pozivom klasifikacije LLM koristeći odabrani model zaštitnih mjera.
- **Google / prilagođene vjerodajnice** — sve kategorije provjeravaju se pozivom klasifikacije LLM koristeći odabranu vjerodajnicu i model zaštitnih mjera.

Kada vaš glavni model koristi prilagođenog pružatelja (npr. Zhipu, Cerebras) koji može vratiti 404 ili druge API greške, odaberite **OpenAI ili Google vjerodajnicu** za zaštitne mjere.

## Format greške

Kada se aktiviraju zaštitne mjere, čvor generira grešku s porukom:

```
Kršenje zaštitnih mjera: poruka blokirana zbog zabranjenog sadržaja.
Prekršene kategorije: Nasilje, Govori mržnje
```

Izlaz čvora također uključuje `guardrail_violated_categories` (niz oznaka prekršenih kategorija) tako da se u Debug Panelu i Povijesti izvršenja može jasno prikazati "Blokirano od: X, Y".

Koristite opciju čvora **Continue on error** (ili [Error Handler](../nodes/error-handler-node.md)) za usmjeravanje workflow-a na alternativnu granu kada se aktiviraju zaštitne mjere.

## Primjer workflow-a

```
Input → Agent (zaštitne mjere: Nasilje, Nezakonita aktivnost, ozbiljnost: Srednja)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Žao nam je, taj zahtjev je blokiran.") → Output
```

## Napomene

- **Nema ponovnih pokušaja**: Kršenja zaštitnih mjera su namjerni blokovi i nikada se ne ponavljaju, čak i ako je čvoru omogućena opcija "Retry on failure".
- Nema potrebe za migracijom baze podataka — postavke zaštitnih mjera pohranjuju se u JSON-u čvora workflow-a zajedno s drugim podacima čvora.
- Zaštitne mjere provjeravaju **korisničku poruku** (nakon evaluacije izraza predloška), a ne sirovi predložak.
- Postavljanje **nema kategorija** dok su zaštitne mjere omogućene ekvivalentno je onome da su one onemogućene — provjera se ne provodi.
- Na **niskoj** ozbiljnosti, klasifikacija LLM uvijek se pokreće (najbolja pokrivenost na više jezika). OpenAI vjerodajnice dodatno pokreću Moderation API.
- Na **srednjoj/visokoj** ozbiljnosti, OpenAI vjerodajnice koriste Moderation API za izvorno podržane kategorije i klasifikaciju LLM za ostale. Google/prilagođene vjerodajnice uvijek koriste klasifikaciju LLM.
- Klasifikacija LLM je **neovisna o jeziku** — otkriva prekršaje na turskom, arapskom, ruskom, španjolskom i drugim jezicima.
