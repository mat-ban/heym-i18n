# Notion

Čvor **Notion** upravlja bazama podataka, izvorima podataka, stranicama i blokovima putem Notion API-ja.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | Interni integracijski token ili Notion OAuth |
| Verzija API-ja | `2026-03-11` |

Notion kolekcije stilizirane kao baze podataka koriste **ID-ove izvora podataka** u trenutnim verzijama API-ja. Podijelite svaku stranicu ili izvor podataka koji workflow treba s integracijom prije nego što pokrenete čvor. Polja resursa prihvaćaju ili sirovi Notion ID ili punu Notion URL adresu. URL-ovi se normaliziraju na njihov ugrađeni ID resursa prije API zahtjeva.

## Operacije

| Operacija | Obavezna polja | Glavni izlaz |
|-----------|----------------|--------------|
| Pretraži | Opcionalni upit/filter/razvrstavanje | `.results`, `.count`, `.next_cursor` |
| Dohvati stranicu | ID stranice | `.page` |
| Kreiraj stranicu | ID izvora podataka ili ID roditeljske stranice, Svojstva | `.page`, `.id`, `.url` |
| Ažuriraj stranicu | ID stranice, jedno od Svojstava/Icon/Cover | `.page` |
| Premjesti stranicu u smeće | ID stranice | `.page` |
| Vrati stranicu | ID stranice | `.page` |
| Kreiraj bazu podataka | Zahtjev za bazu podataka s `parent` | `.database`, `.id`, `.url` |
| Dohvati bazu podataka | ID baze podataka | `.database` |
| Ažuriraj bazu podataka | ID baze podataka, ne-prazan zahtjev za bazu podataka | `.database`, `.id`, `.url` |
| Kreiraj izvor podataka | Zahtjev za izvor podataka s `parent` i ne-praznim `properties` | `.data_source`, `.id`, `.url` |
| Dohvati izvor podataka | Izvor podataka | `.data_source` |
| Ažuriraj izvor podataka | ID izvora podataka, ne-prazan zahtjev za izvor podataka | `.data_source`, `.id`, `.url` |
| Upit za izvor podataka | ID izvora podataka | `.results`, `.count`, `.next_cursor` |
| Dohvati djecu bloka | ID bloka ili stranice | `.results`, `.count`, `.next_cursor` |
| Ažuriraj blok | ID bloka, objekt ažuriranja bloka | `.block` |
| Izbriši blok | ID bloka | `.block` |
| Dodaj blokove | ID bloka ili stranice, Djeca | `.results`, `.count` |

Sve operacije također vraćaju `.success` i `.operation`.

## JSON polja

Zahtjev za bazu podataka, zahtjev za izvor podataka, Svojstva, Djeca, Filter, Razvrstavanje, Razvrstavanja, Ikona i Pokrivač prihvaćaju Notion API JSON. Izrazi unutar JSON nizova se rješavaju prije zahtjeva. Polje može biti i jedan samostalni izraz koji se izravno rješava u potrebni objekt ili niz, poput `$input.database`, `$input.properties` ili `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Za sadržaj stranice ili bloka, Djeca su niz Notion objekata bloka:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Baze podataka i izvori podataka

U trenutnom Notion API-ju, **baza podataka** je kontejner, a **izvor podataka** sadrži shemu svojstava i redove koji se mogu upititi. Dohvati bazu podataka vraća popis `data_sources` baze podataka; koristite jedan od tih ID-ova s Dohvati izvor podataka ili Upit za izvor podataka.

Kreiraj bazu podataka prihvaća cijeli objekt zahtjeva s Notionove točke za kreiranje baze podataka. Mora sadržavati `parent` i može sadržavati `title`, `description`, `is_inline`, `initial_data_source`, `icon` i `cover`. Na primjer:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Zadaci"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Ažuriraj bazu podataka prihvaća objekt zahtjeva s točke ažuriranja, uključujući `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` i `is_locked`. Polja ID-a baze podataka prihvaćaju sirovi ID, punu Notion URL adresu ili izraz.

Koristite **Dohvati izvor podataka** za dohvaćanje sheme `properties` izvora podataka prije izrade objekta svojstava za Kreiraj stranicu. **Kreiraj izvor podataka** zahtijeva objekt roditeljske baze podataka i ne-praznu shemu `properties`. **Ažuriraj izvor podataka** prihvaća ne-prazan objekt zahtjeva podržan od strane odgovarajuće Notion točke.

Na primjer, kreirajte izvor podataka unutar postojeće baze podataka:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Odabir izvora podataka i roditeljske stranice podržava pretraživanje na strani poslužitelja s kratkim odgodom i paginacijom **Učitaj više** temeljenom na kursoru. Koristite **Osvježi** nakon dijeljenja novog resursa u Notionu. Prebacite se na **Koristi izraz** za unos izraza, sirovog ID-a ili URL-a.

Filteri pretraživanja iz starijih tutorijala koji koriste
`{"property":"object","value":"database"}` prevedeni su na trenutnu vrijednost `data_source`. Novi workflows trebaju koristiti `data_source` ili `page` izravno.

Dodaj blokove podržava pozicije **Početak**, **Kraj** i **Iza bloka**. Kreiraj stranicu i Dodaj blokove automatski dijele više od 100 vrhunskih djece u uredne zahtjeve kako bi zadovoljili Notionovu granicu po zahtjevu.

Zahtjevi s ograničenjem brzine (`429` ili `529`) ponavljaju se do tri puta. Heym poštuje Notionovu `Retry-After` oznaku, ograničava svaki ček na 10 sekundi i dodaje nasumičnu jitter. Notion zahtjevi dijele HTTP vezu na razini procesa širom stranica i čvorova workflow-a.
## Ograničenja Notion API-ja

- Jedna vrijednost bogatog teksta `text.content` može sadržavati najviše 2,000 znakova. Duži tekst podijelite na više objekata bogatog teksta.
- Notion ograničava djecu blokova na najviše 100 po zahtjevu. Heym grupira veće nizove djece, ali svaki pojedinačni blok i dalje mora zadovoljiti ograničenja Notionovog payloada.
- API prihvaća najviše dva ugniježđena nivoa djece blokova u jednom zahtjevu. Stvorite dublje strukture s dodatnim operacijama Append Blocks.
- Payloadovi zahtjeva su ograničeni na 1,000 elemenata blokova i 500 KB ukupno.

## Paginacija

Pretraživanje, upit izvora podataka i dobivanje djece blokova prihvaćaju veličinu stranice od 1 do 100 i opcionalni početni kursor. Postavite veličinu stranice na `0` kako biste automatski pratili kursor i spojili sve rezultate, do sigurnosnog limita od 10,000 rezultata čvora.

## Postavljanje vjerodajnica

Odaberite jedno od postavki u dijalogu za vjerodajnice (**Interni token** ili **OAuth**):

- **Interni token:** Kreirajte internu integraciju, kopirajte njezin token u Heym, a zatim podijelite svaku potrebnu stranicu ili izvor podataka s integracijom. Koristite **Testiraj vezu** za provjeru pristupa.
- **OAuth:** Kreirajte javnu Notion integraciju i registrirajte
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` u Notionu. U dijalogu za vjerodajnice u Heymu, odaberite **OAuth**, unesite Client ID i Client Secret integracije, a zatim kliknite **Poveži** za autorizaciju radnog prostora. Tajna se pohranjuje šifrirana s vjerodajnicom i ne smije se nalaziti u OAuth stanju ili konfiguraciji okruženja. Nakon autorizacije, vjerodajnica prikazuje naziv povezanog radnog prostora (`connected (Naziv Radnog Prostora)`). Čekajući OAuth vjerodajnice prikazuju `Nije povezano`.

Ostavljanje polja za interni token praznim tijekom uređivanja čuva pohranjeni token.

Za prilagođene [HTTP](../nodes/http-node.md) zahtjeve, `$credentials.YourNotionCredential` rješava se na isti bearer token koji koristi Notion čvor (interni token ili OAuth pristupni token).

## Napomene o verziji API-ja

Heym veže Notion zahtjeve na verziju API-ja `2026-03-11`. Ova verzija koristi:

- `data_source_id` roditelje i `/data_sources` krajnje točke umjesto starih putanja za upite baze podataka
- `in_trash` umjesto `archived` za operacije premještanja/obnavljanja stranica
- `position` objekte (`start`, `end`, `after_block`) za Append Block Children

Prilikom migracije starijih primjera automatizacije Notion:

- Zamijenite reference na roditelje baze podataka/upite s ID-ovima izvora podataka iz **Preuzmi bazu podataka** ili odabira izvora podataka u uređivaču
- Zamijenite `archived: true` s `in_trash: true`
- Zamijenite parametre append `after` s poljem **Append Position** čvora

Filtri pretraživanja koji još uvijek koriste objekt vrijednosti `database` automatski se normaliziraju na `data_source`.

## Povezano

- [Vjerodajnice](../reference/credentials.md)
- [Integracije trećih strana](../reference/integrations.md)
- [Tipovi čvorova](../reference/node-types.md)
