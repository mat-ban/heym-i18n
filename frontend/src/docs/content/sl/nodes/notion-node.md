# Notion

Vozlišče **Notion** upravlja z bazami podatkov, viri podatkov, stranmi in bloki preko Notion API.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | Interni integracijski token ali Notion OAuth |
| Različica API | `2026-03-11` |

Zbirke v slogu baze podatkov Notion uporabljajo **ID-je virov podatkov** v trenutnih različicah API. Preden zaženete vozlišče, delite vsako stran ali vir podatkov, ki ga workflow potrebuje, z integracijo. Polja virov sprejemajo bodisi surov Notion ID bodisi celoten Notion URL. URL-ji se normalizirajo na njihov vgrajeni ID vira pred zahtevo API.

## Operacije

| Operacija | Zahtevana polja | Glavni izhod |
|-----------|-----------------|-------------|
| Iskanje | Neobvezno poizvedovanje/filter/razvrščanje | `.results`, `.count`, `.next_cursor` |
| Pridobi stran | ID strani | `.page` |
| Ustvari stran | ID vira podatkov ali ID nadrejne strani, lastnosti | `.page`, `.id`, `.url` |
| Posodobi stran | ID strani, ena od lastnosti/ikona/platnica | `.page` |
| Premakni stran v smeti | ID strani | `.page` |
| Obnovi stran | ID strani | `.page` |
| Ustvari bazo podatkov | Zahteva za bazo podatkov z `parent` | `.database`, `.id`, `.url` |
| Pridobi bazo podatkov | ID baze podatkov | `.database` |
| Posodobi bazo podatkov | ID baze podatkov, ne-prazna zahteva za bazo podatkov | `.database`, `.id`, `.url` |
| Ustvari vir podatkov | Zahteva za vir podatkov z `parent` in ne-praznimi `properties` | `.data_source`, `.id`, `.url` |
| Pridobi vir podatkov | Vir podatkov | `.data_source` |
| Posodobi vir podatkov | ID vira podatkov, ne-prazna zahteva za vir podatkov | `.data_source`, `.id`, `.url` |
| Poizvedba po viru podatkov | ID vira podatkov | `.results`, `.count`, `.next_cursor` |
| Pridobi otroke bloka | ID bloka ali strani | `.results`, `.count`, `.next_cursor` |
| Posodobi blok | ID bloka, objekt za posodobitev bloka | `.block` |
| Izbriši blok | ID bloka | `.block` |
| Dodaj bloke | ID bloka ali strani, otroci | `.results`, `.count` |

Vse operacije prav tako vračajo `.success` in `.operation`.

## JSON polja

Zahteva za bazo podatkov, zahteva za vir podatkov, lastnosti, otroci, filter, razvrščanje, razvrstitve, ikona in platnica sprejemajo Notion API JSON. Izrazi znotraj JSON nizov se razrešijo pred zahtevo. Polje je lahko tudi en samostojen izraz, ki se neposredno razreši v zahtevani objekt ali tabelo, kot so `$input.database`, `$input.properties` ali `$input.children`.

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

Za vsebino strani ali bloka so otroci tabela objektov bloka Notion:

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

## Baze podatkov in viri podatkov

V trenutnem Notion API je **baza podatkov** vsebnik, **vir podatkov** pa vsebuje shemo lastnosti in poizvedljive vrstice. Pridobi bazo podatkov vrne seznam `data_sources` baze podatkov; uporabite enega od teh ID-jev z Pridobi vir podatkov ali Poizvedba po viru podatkov.

Ustvari bazo podatkov sprejme celoten objekt zahteve z Notionovega končnega točke za ustvarjanje baze podatkov. Vsebuje mora `parent` in lahko vsebuje `title`, `description`, `is_inline`, `initial_data_source`, `icon` in `cover`. Na primer:

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
        "content": "Naloge"
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

Posodobi bazo podatkov sprejme objekt zahteve končne točke za posodobitev, vključno z `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` in `is_locked`. Polja ID baze podatkov sprejemajo surov ID, celoten Notion URL ali izraz.

Uporabite **Pridobi vir podatkov**, da pridobite shemo `properties` vira podatkov, preden zgradite objekt lastnosti za Ustvari stran. **Ustvari vir podatkov** zahteva objekt nadrejne baze podatkov in ne-prazno shemo `properties`. **Posodobi vir podatkov** sprejme ne-prazno zahtevo, ki jo podpira ustrezna Notion končna točka.

Na primer, ustvarite vir podatkov znotraj obstoječe baze podatkov:

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

Izbirniki za vir podatkov in nadrejno stran podpirajo iskanje na strežniški strani z majhnim zamikom in paginacijo **Naloži več** na osnovi kurzorja. Uporabite **Osveži** po delitvi novega vira v Notion. Preklopite na **Uporabi izraz**, da vnesete izraz, surov ID ali URL.

Filtri iskanja iz starejših tutorialov, ki uporabljajo
`{"property":"object","value":"database"}`, so prevedeni v trenutno vrednost `data_source`. Novi workflows naj neposredno uporabljajo `data_source` ali `page`.

Dodaj bloke podpira položaje **Začetek**, **Konec** in **Po bloku**. Ustvari stran in Dodaj bloke samodejno razdelita več kot 100 vrhnjih otrok v urejene zahteve, da zadostita Notionovemu omejitvi na zahtevo.

Zahteve, ki so omejene s hitrostjo (`429` ali `529`), se ponovijo do trikrat. Heym spoštuje Notionovo glavo `Retry-After`, omeji vsak čakanje na 10 sekund in doda naključni jitter. Zahteve Notion delijo skupni HTTP povezovalni bazen po straneh in vozliščih workflow.
## Omejitve API-ja Notion

- En sam rich-text `text.content` vrednost lahko vsebuje največ 2.000 znakov. Daljše besedilo razdelite na več rich-text objektov.
- Notion omejuje število otrok na najvišji ravni bloka na 100 na zahtevo. Heym združuje večje tabele otrok, vendar mora vsak posamezen blok še vedno izpolnjevati omejitve payload-a Notion.
- API sprejema največ dve nivoja vgnjenih otrok bloka v eni zahtevi. Ustvarite globlje strukture z nadaljnjimi operacijami Append Blocks.
- Zahteve payload so omejene na 1.000 elementov bloka in 500 KB skupno.

## Paginarjenje

Iskanje, poizvedba podatkovnega vira in pridobivanje otrok bloka sprejemajo velikost strani od 1 do 100 ter opcijski začetni kurzor. Nastavite velikost strani na `0`, da samodejno sledite kurzorjem in združite vse rezultate, do varnostne meje 10.000 rezultatov vozlišča.

## Nastavitev poverilnic

Izberite eno od nastavitev v pogovornem oknu poverilnic (**Notranji token** ali **OAuth**):

- **Notranji token:** Ustvarite notranjo integracijo, kopirajte njen token v Heym, nato pa delite vsako zahtevano stran ali podatkovni vir z integracijo. Uporabite **Preizkusi povezavo**, da preverite dostop.
- **OAuth:** Ustvarite javno integracijo Notion in registrirajte
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` v Notion. V pogovornem oknu poverilnic Heym izberite **OAuth**, vnesite ID stranke in skrivni ključ integracije, nato kliknite **Poveži**, da avtorizirate delovno okolje. Skrivni ključ je shranjen šifriran s poverilnico in ni vključen v stanje OAuth ali konfiguracijo okolja. Po avtorizaciji poverilnica prikaže ime povezanega delovnega okolja (`connected (Ime delovnega okolja)`). Čakajoče OAuth poverilnice prikazujejo `Not connected`.

Pustitev polja notranjega tokena praznega med urejanjem ohrani shranjeni token.

Za prilagojene [HTTP](../nodes/http-node.md) zahteve se `$credentials.YourNotionCredential` razreši na enak bearer token, ki ga uporablja vozlišče Notion (notranji token ali OAuth dostopni token).

## Opombe o različici API-ja

Heym veže zahteve Notion na različico API-ja `2026-03-11`. Ta različica uporablja:

- `data_source_id` starše in `/data_sources` končne točke namesto poti za poizvedbe v prejšnjih različicah
- `in_trash` namesto `archived` za operacije premikanja strani v smeti/obnavljanja
- `position` objekte (`start`, `end`, `after_block`) za dodajanje otrok bloka

Pri migraciji starejših primerov avtomatizacije Notion:

- Zamenjajte reference na starše/query podatkovne baze z ID-ji podatkovnih virov iz **Pridobi podatkovno bazo** ali izbira podatkovnega vira v urejevalniku
- Zamenjajte `archived: true` z `in_trash: true`
- Zamenjajte parametre dodajanja `after` z **Append Position** poljem vozlišča

Filtri iskanja, ki še vedno uporabljajo vrednost objekta `database`, se samodejno normalizirajo na `data_source`.

## Sorodno

- [Poverilnice](../reference/credentials.md)
- [Integracije tretjih oseb](../reference/integrations.md)
- [Vrste vozlišč](../reference/node-types.md)
