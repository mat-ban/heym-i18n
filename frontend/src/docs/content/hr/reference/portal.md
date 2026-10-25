# Portal

**Portal** izlaže Heym workflows kao javne UI-e u stilu chata. Krajnji korisnici mogu pokretati workflows putem URL-a bez prijave u Heym.

## Što Radi

- **Javni URL**: `/chat/{slug}` (npr. `/chat/my-workflow`)
- **Chat sučelje**: Korisnici komuniciraju putem chat UI-a (poruke, unosi, odgovori)
- **Opcionalna autentifikacija**: Ako su korisnici portala konfigurirani, prijava je obavezna; inače je portal javan
- **Streaming**: Napredak čvora u stvarnom vremenu tijekom izvršavanja (kada je omogućeno)
- **Prekid aktivnih izvršavanja**: Korisnici mogu prekinuti aktivno izvršavanje portala iz podnožja chata; aktivno izvršavanje workflow-a se također otkazuje na strani poslužitelja
- **Učitavanje datoteka**: Opcionalno učitavanje datoteka (tekst, slike itd.) po polju unosa
- **Predaja ljudskoj recenziji**: Pokretanja portala mogu prikazati [HITL review links](./human-in-the-loop.md) kada agent zatraži odobrenje
- **Prikaz slika**: Izlazi workflow-a koji sadrže slike (npr. iz LLM generacije slika ili Playwright snimaka zaslona) pojavljuju se kao sličice u chatu. Kliknite na bilo koju sliku za otvaranje preglednika na cijelom ekranu; pritisnite **Esc** ili koristite tipku za povratak na uređaju za zatvaranje

## Konfiguracija Workflow-a

| Postavka | Opis |
|----------|------|
| `portal_enabled` | Omogućite portal za ovaj workflow |
| `portal_slug` | URL slug (npr. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Koristite streaming izvršavanje |
| `portal_file_upload_enabled` | Dozvolite učitavanje datoteka |
| `portal_file_config` | Konfiguracija datoteka po polju (tipovi, ograničenja) |

Konfigurirajte u uređivaču: **Portal** gumb u zaglavlju workflow-a otvara dijalog za postavke portala.

## Tok

1. **Info**: `GET /api/portal/{slug}/info` – Vraća metapodatke workflow-a i polja unosa (bez autentifikacije)
2. **Prijava** (ako je potrebna): `POST /api/portal/{slug}/login` – Vraća sesijski token
3. **Izvršavanje**: `POST /api/portal/{slug}/execute` – Portal chat UI poziva ovo (ili njegovu streaming varijantu interno kada je omogućeno); krajnji korisnici komuniciraju putem chat sučelja, a ne izravnim pozivanjem API-ja.
4. **Prekid**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Zatraženo kada korisnik pritisne **Stop** tijekom aktivnog izvršavanja portala

## HITL u Portal Pokretanjima

Ako portal workflow dosegne [Agent Node](../nodes/agent-node.md) s omogućenom [Human-in-the-Loop](./human-in-the-loop.md), odgovor portala prikazuje poveznicu za recenziju umjesto da ostane prazan.

- Status izvršavanja workflow-a postaje `pending`
- Portal chat prikazuje URL za recenziju
- Bilo koji čvorovi povezani s agentovim `review` izlazom mogu odmah obavijestiti Slack, e-mail ili druge kanale
- Recenzent donosi odluku na `/review/{token}` bez prijave
- Nakon recenzije, workflow nastavlja od pohranjene snimke

To omogućuje kombiniranje javnih chat tokova s privatnim koracima odobrenja ljudi.

## Polja Unosa

Polja unosa dolaze iz [Input](../nodes/input-node.md) čvorova. API izvlači početne čvorove tipa `textInput` i njihova `inputFields`. Izvršavanje koristi isti motor kao i normalni tokovi; unosi se prosljeđuju kao `body.inputs` i `conversation_history` za višekratne tokove.

## Autentifikacija i Sesije

- **WorkflowPortalUser**: Korisničko ime/lozinka po workflow-u (kada je autentifikacija omogućena)
- **Uklanjanje zadnjeg korisnika**: Kada je portal omogućen, brisanje zadnjeg korisnika portala čini portal ponovno javnim; dijaloški okvir postavki prvo traži potvrdu
- **PortalSession**: Sesijski tokeni s TTL-om od 168 sati
- **Ograničenje brzine**: 3 neuspjele prijave → 24h zabrana po workflow-u+IP
- Istečene sesije se čiste cron poslom

## UI Konfiguracija

**WebPortalSettingsDialog** kartice:

1. **Općenito**: Omogućite portal, postavite slug, kopirajte URL portala
2. **Korisnici**: Dodajte/uklonite korisnike portala (korisničko ime/lozinka)
3. **Opcije**: Streaming način, učitavanje datoteka, pregled polja unosa

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – Portal kao chat površina za agente u produkciji
- [Workflows Tab](../tabs/workflows-tab.md) – Kreirajte workflows i omogućite portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Javne stranice za recenziju za neodgovorene izlaze agenata
- [Triggers](./triggers.md) – Portal kao ulazna točka
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) za ulaze portala
- [Workflow Structure](./workflow-structure.md) – Čvorovi i rubovi
