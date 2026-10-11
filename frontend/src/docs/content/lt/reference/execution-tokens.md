# Vykdymo Tokenai

Vykdymo tokenai yra JWT, kurie suteikia prieigą prie vieno Workflow vykdymo ir srauto endpoint'ų. Jie leidžia jums kviesti Workflow iš išorinių sistemų, nesidalinant savo ilgalaikiu vartotojo sesijos tokenu.

## Kodėl Naudoti Vykdymo Tokenus

Kai Workflow autentifikacija nustatyta kaip **JWT**, endpoint'as paprastai reikalauja galiojančios vartotojo sesijos. Vykdymo tokenai leidžia jums:

- Dalintis kviečiamu tokenu su išoriniais skriptais, CI pipeline'ais ar integracijomis, nesidalinant savo paskyros kredencialais.
- Apriboti ekspoziciją — tokenas galioja tik vienam konkrečiam Workflow.
- Nedelsiant atšaukti prieigą, nesikeičiant slaptažodžio ar rotuojant sesijos tokenus.
- Pasirinkti tarp trumpalaikių tokenų (minutėms ar valandoms) ir ilgalaikių tokenų (iki 10 metų).

## Tokeno Kūrimas

Atidarykite **Vykdyti su cURL** dialogą redaktoriuje (viršutiniame dešiniajame įrankių juostoje). Kai Workflow autentifikacija nustatyta kaip **JWT Token**, dialogas rodo tokenų valdymo įrankį:

1. Pasirinkite **Trumpalaikis** arba **Ilgalaikis (10m)**.
2. Trumpalaikių tokenų atveju, įveskite trukmę sekundėmis (minimalus 60).
3. Spustelėkite **+ Naujas Tokenas**.

Tokenas sukuriamas iš karto, pridedamas prie sąrašo ir automatiškai pasirenkamas, kad cURL komanda atnaujintų jį.

## Tokenų Sąrašas

Kiekviena tokeno eilutė rodo:

| Stulpelis | Aprašymas |
|-----------|-----------|
| Sukurtas | Sukūrimo laiko žyma |
| Būsena | **Galioja iki:** data, **Pasibaigęs**, arba **Atšauktas** |
| Akies ikona | Perjungti tokeno vertės matomumą |
| Atšaukti mygtukas | Pažymėti tokeną kaip atšauktą (negrįžtamai) |

Spustelėkite bet kurią aktyvią (nepasibaigusią, neatsauktą) eilutę, kad ją pasirinktumėte. Pasirinktas tokenas įterpiamas į cURL komandos peržiūrą.

Pasibaigę ir atšaukti tokenai lieka matomi sąraše, tačiau negali būti pasirenkami.

## Tokeno Naudojimas

Kopijuokite tokeno vertę iš sąrašo (spustelėkite akies ikoną, kad ją atskleistumėte) ir įtraukite ją kaip `Bearer` tokeną:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Kai naudojate **Kopijuoti cURL** dialoge su pasirinktu tokenu, tokenas jau yra įterptas į komandą — jokio rankinio pakeitimo nereikia.

## Tokeno Apribojimas

Kiekvienas tokenas turi šias JWT pretenzijas:

| Pretenzija | Vertė |
|------------|-------|
| `sub` | Tokeno kūrėjo vartotojo ID |
| `wid` | Workflow UUID — tokenas atmetamas bet kuriam kitam Workflow |
| `scope` | `workflow:execute` — skiria jį nuo vartotojo sesijos tokeno |
| `jti` | Unikalus tokeno ID, naudojamas atšaukimo paieškoms |
| `exp` | Pasibaigimo laiko žyma |

Backend'as tikrina visus šiuos parametrus kiekviename užklausoje: parašo galiojimą, pasibaigimą, atitinkantį `wid` ir kad `jti` nebuvo atšauktas.

## Atšaukimas

Spustelėkite atšaukti (apskritimo-kryžius) mygtuką šalia tokeno, kad jį atšauktumėte. Atšaukimas įsigalioja iš karto — vėlesnės užklausos, naudojančios tą tokeną, grąžina `401`. Tokeno eilutė lieka matoma sąraše su **Atšauktas** žyma.

Nėra galimybės atšaukti atšaukimą. Sukurkite naują tokeną, jei reikia atkurti prieigą.

## API

Tokenų valdymo endpoint'ai yra autentifikuojami su jūsų įprasta sesija.

| Metodas | Kelias | Aprašymas |
|---------|--------|-----------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Sukurti tokeną |
| `GET` | `/api/workflows/{id}/execution-tokens` | Išvardinti jūsų tokenus šiam Workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Atšaukti tokeną |

**Sukūrimo užklausos kūnas:**

```json
{ "ttl_seconds": 900 }
```

**Sukūrimo atsakymas:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

`token` laukas grąžinamas tik sukūrimo metu. Išsaugokite jį iš karto; vėlesnės `GET` užklausos grąžins tą pačią eilutę, tačiau jį taip pat galite atskleisti cURL dialoge bet kuriuo metu.

## Matomumo Apribojimas

Kiekvienas vartotojas mato tik tuos tokenus, kuriuos sukūrė. Komandos nariai, turintys prieigą prie bendro Workflow, negali matyti vieni kitų tokenų.

## Susiję

- [Webhook'ai](./webhooks.md) — HTTP trigger endpoint'ai ir cURL dialogas
- [Saugumas](./security.md) — Sesijos valdymo ir autentifikacijos apžvalga
- [SSE Srautas](./sse-streaming.md) — Naudokite vykdymo tokenus su srauto endpoint'u
