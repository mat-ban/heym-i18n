# Notion

**Notion** mazgas valdo duomenų bazes, duomenų šaltinius, puslapius ir blokus per Notion API.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | Vidinis integracijos tokenas arba Notion OAuth |
| API versija | `2026-03-11` |

Notion duomenų bazės stiliaus kolekcijos naudoja **duomenų šaltinio ID** dabartinėse API versijose. Pasidalykite kiekvienu puslapiu arba duomenų šaltiniu, kurio reikia workflow, su integracija prieš vykdant mazgą. Išteklių laukai priima arba žalią Notion ID, arba visą Notion URL. URL yra normalizuojami į jų įterptą ištekliaus ID prieš API užklausą.

## Operacijos

| Operacija | Reikalingi laukai | Pagrindinė išvestis |
|-----------|-------------------|---------------------|
| Paieška | Pasirinktinė užklausa/filtras/rūšiavimas | `.results`, `.count`, `.next_cursor` |
| Gauti puslapį | Puslapio ID | `.page` |
| Sukurti puslapį | Duomenų šaltinio ID arba Tėvinio puslapio ID, Ypatybės | `.page`, `.id`, `.url` |
| Atnaujinti puslapį | Puslapio ID, viena iš Ypatybių/Ikonos/Dangtelio | `.page` |
| Perkelti puslapį į šiukšliadėžę | Puslapio ID | `.page` |
| Atkurti puslapį | Puslapio ID | `.page` |
| Sukurti duomenų bazę | Duomenų bazės užklausa su `parent` | `.database`, `.id`, `.url` |
| Gauti duomenų bazę | Duomenų bazės ID | `.database` |
| Atnaujinti duomenų bazę | Duomenų bazės ID, ne tuščia duomenų bazės užklausa | `.database`, `.id`, `.url` |
| Sukurti duomenų šaltinį | Duomenų šaltinio užklausa su `parent` ir ne tuščiais `properties` | `.data_source`, `.id`, `.url` |
| Gauti duomenų šaltinį | Duomenų šaltinis | `.data_source` |
| Atnaujinti duomenų šaltinį | Duomenų šaltinio ID, ne tuščia duomenų šaltinio užklausa | `.data_source`, `.id`, `.url` |
| Užklausti duomenų šaltinį | Duomenų šaltinio ID | `.results`, `.count`, `.next_cursor` |
| Gauti blokų vaikus | Bloko arba puslapio ID | `.results`, `.count`, `.next_cursor` |
| Atnaujinti bloką | Bloko ID, bloko atnaujinimo objektas | `.block` |
| Ištrinti bloką | Bloko ID | `.block` |
| Pridėti blokus | Bloko arba puslapio ID, Vaikai | `.results`, `.count` |

Visos operacijos taip pat grąžina `.success` ir `.operation`.

## JSON laukai

Duomenų bazės užklausa, Duomenų šaltinio užklausa, Ypatybės, Vaikai, Filtras, Rūšiavimas, Rūšiavimai, Ikona ir Dangtelis priima Notion API JSON. Išraiškos JSON eilutėse yra išsprendžiamos prieš užklausą. Laukas taip pat gali būti viena savarankiška išraiška, kuri tiesiogiai išsprendžia į reikiamą objektą arba masyvą, pavyzdžiui, `$input.database`, `$input.properties` arba `$input.children`.

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

Puslapio arba bloko turiniui, Vaikai yra Notion blokų objektų masyvas:

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

## Duomenų bazės ir duomenų šaltiniai

Dabartinėje Notion API, **duomenų bazė** yra konteineris, o **duomenų šaltinis** laiko ypatybių schemą ir užklausiamus įrašus. Gauti duomenų bazę grąžina duomenų bazės `data_sources` sąrašą; naudokite vieną iš tų ID su Gauti duomenų šaltinį arba Užklausti duomenų šaltinį.

Sukurti duomenų bazę priima visą užklausos objektą iš Notion Sukurti duomenų bazę galinio taško. Jis turi turėti `parent` ir gali turėti `title`, `description`, `is_inline`, `initial_data_source`, `icon` ir `cover`. Pavyzdžiui:

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
        "content": "Užduotys"
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

Atnaujinti duomenų bazę priima atnaujinimo galinio taško užklausos objektą, įskaitant `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` ir `is_locked`. Duomenų bazės ID laukai priima žalią ID, visą Notion URL arba išraišką.

Naudokite **Gauti duomenų šaltinį**, kad gautumėte duomenų šaltinio `properties` schemą prieš kuriant Sukurti puslapį ypatybių objektą. **Sukurti duomenų šaltinį** reikalauja tėvinio duomenų bazės objekto ir ne tuščios `properties` schemos. **Atnaujinti duomenų šaltinį** priima ne tuščią užklausos objektą, palaikomą atitinkamo Notion galinio taško.

Pavyzdžiui, sukurkite duomenų šaltinį esamoje duomenų bazėje:

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

Duomenų šaltinio ir Tėvinio puslapio pasirinkikliai palaiko serverio pusės paiešką su trumpu debesavimu ir kursoriu pagrįsta **Įkelti daugiau** puslapiavimu. Naudokite **Atnaujinti**, kai pasidalijate nauju ištekliumi Notion. Perjunkite į **Naudoti išraišką**, kad įvestumėte išraišką, žalią ID arba URL.

Paieškos filtrai iš senesnių pamokų, kurie naudoja `{"property":"object","value":"database"}`, yra verčiami į dabartinę `data_source` vertę. Nauji workflow turėtų naudoti `data_source` arba `page` tiesiogiai.

Pridėti blokus palaiko **Pradžia**, **Pabaiga** ir **Po bloku** pozicijas. Sukurti puslapį ir Pridėti blokus automatiškai padalina daugiau nei 100 viršutinių lygių vaikų į užsakytas užklausas, kad atitiktų Notion per užklausą limitą.

Greitį ribojančios užklausos (`429` arba `529`) bando dar kartą iki trijų kartų. Heym gerbia Notion `Retry-After` antraštę, apriboja kiekvieną laukimą iki 10 sekundžių ir prideda atsitiktinį jitter. Notion užklausos dalijasi procesų lygio HTTP ryšio baseinu tarp puslapių ir workflow mazgų.
## Notion API apribojimai

- Vienas turtingo teksto `text.content` reikšmė gali turėti ne daugiau kaip 2,000 simbolių. Ilgesnį tekstą padalinkite į kelis turtingo teksto objektus.
- Notion riboja viršutinio lygio blokų vaikus iki 100 užklausai. Heym grupuoja didesnes vaikų masyvus, tačiau kiekvienas atskiras blokas vis tiek turi atitikti Notion payload apribojimus.
- API priima ne daugiau kaip du įdėtus blokų vaikus vienoje užklausoje. Sukurkite gilesnes struktūras su papildomomis Append Blocks operacijomis.
- Užklausų payload yra ribojamas iki 1,000 blokų elementų ir 500 KB bendrai.

## Puslapiavimas

Search, Query Data Source ir Get Block Children priima puslapio dydį nuo 1 iki 100 ir neprivalomą pradinį žymeklį. Nustatykite puslapio dydį į `0`, kad automatiškai sekite žymeklius ir sujungtumėte visus rezultatus, iki mazgo 10,000 rezultatų saugumo ribos.

## Kredencialų nustatymas

Pasirinkite vieną iš nustatymų kredencialų dialoge (**Internal token** arba **OAuth**):

- **Internal token:** Sukurkite vidinę integraciją, nukopijuokite jos token į Heym, tada pasidalykite kiekviena reikalinga puslapiu ar duomenų šaltiniu su integracija. Naudokite **Test Connection**, kad patvirtintumėte prieigą.
- **OAuth:** Sukurkite viešą Notion integraciją ir užregistruokite
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` Notion. Heym kredencialų dialoge pasirinkite **OAuth**, įveskite integracijos Kliento ID ir Kliento Slaptažodį, tada spustelėkite **Connect**, kad įgalintumėte darbo erdvę. Slaptažodis saugomas užšifruotas su kredencialu ir nėra įtraukiamas į OAuth būseną ar aplinkos konfigūraciją. Po įgalinimo kredencialas rodo prijungtos darbo erdvės pavadinimą (`connected (Workspace Name)`). Laukiantys OAuth kredencialai rodo `Not connected`.

Palikdami vidinio token lauko tuščią redaguojant, išsaugosite saugomą token.

Kreipiantis į individualius [HTTP](../nodes/http-node.md) užklausas, `$credentials.YourNotionCredential` atitinka tą patį bearer token, kurį naudoja Notion mazgas (vidinis token arba OAuth prieigos token).

## API versijos pastabos

Heym fiksuoja Notion užklausas prie API versijos `2026-03-11`. Ši versija naudoja:

- `data_source_id` tėvus ir `/data_sources` endpointus vietoj senų duomenų bazės užklausų kelių
- `in_trash` vietoj `archived` puslapio šiukšlių/atkūrimo operacijoms
- `position` objektus (`start`, `end`, `after_block`) Append Block Children operacijoms

Migracijos metu senesnių Notion automatizavimo pavyzdžių:

- Pakeiskite duomenų bazės tėvų/užklausų nuorodas su duomenų šaltinio ID iš **Retrieve Database** arba redaktoriaus duomenų šaltinio pasirinkimo.
- Pakeiskite `archived: true` su `in_trash: true`
- Pakeiskite append `after` parametrus su mazgo **Append Position** lauku

Paieškos filtrai, kurie vis dar naudoja objekto reikšmę `database`, automatiškai normalizuojami į `data_source`.

## Susiję

- [Kredencialai](../reference/credentials.md)
- [Trečiųjų šalių integracijos](../reference/integrations.md)
- [Mazgų tipai](../reference/node-types.md)
