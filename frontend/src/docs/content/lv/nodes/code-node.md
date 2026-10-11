# Kods

**Kods** node izpilda Jūsu rakstīto Python kodu ar savu `requirements.txt` un atgriež JSON. Katra izpilde iegūst pilnīgi jaunu konteineru, kas tiek iznīcināts, tiklīdz izpilde beidzas, tāpēc viena izpilde nekad nevar redzēt vai ietekmēt citu.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.result` (tas, ko atgriež `main`), kā arī `$nodeLabel.logs` un `$nodeLabel.install` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Node identifikators (camelCase) |
| `codeSource` | string | Python pirmkods. Jādefinē `main(params)` un jāatgriež JSON serializējama vērtība |
| `codeParameters` | expression | JSON objekts, kas savieno workflow datus ar kodu. Izteiksmes tiek atrisinātas pirms koda izpildes |
| `codeRequirements` | string | `requirements.txt` saturs, viena pakotne katrā rindā. Tukšs izlaiž instalēšanu |
| `codeAllowNetwork` | boolean | Vai kodam pašam ir atļauts piekļūt tīklam (pēc noklusējuma `false`) |

## Funkcija `main`

Jūsu kodam jādefinē augstākā līmeņa `main`, kas pieņem vienu argumentu:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Moduļa līmeņa priekšraksti tiek izpildīti, bet tikai tas, ko atgriež `main`, kļūst par node izvadi.

Redaktorā tiek rādīti rindu numuri, un paplašināšanas poga blakus **Format** atver lielāku redaktoru, kas aizveras ar `Esc` — izmaiņas tiek piemērotas, rakstot, tāpēc nekas nav jāsaglabā. Poga **Format** pārformatē Jūsu kodu ar Ruff, saglabājot komentārus. Tā arī novērš atkāpju bojājumus, ko parasti izraisa ielīmēšana: vienmērīgi atkāpots bloks, tabulatori sajaukti ar atstarpēm un rinda, kas atrodas vienu vai divas atstarpes ārpus sava bloka, tiek izlabotas, nevis noraidītas. Īsta sintakses kļūda tiek ziņota ar tās rindu un kolonnu. Formatēšana notiek tajā pašā izolētajā konteinerā, kurā darbojas node — bez tīkla, bez backend vides — tāpēc tai nepieciešams Docker tāpat kā izpildei.

## Parametru lasīšana

`params` atbalsta punktu pierakstu, tostarp caurslāņotiem objektiem un sarakstiem:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` nolasa atslēgas, kas nav derīgi Python identifikatori
- `params.get("maybe")` atgriež `None`, nevis rada kļūdu, ja atslēga nav atrasta
- `params.to_dict()` atgriež parasto vārdnīcu
- Mēģinājums nolasīt atslēgu, kas netika nodrošināta, rada kļūdu, kas nosauc atslēgu un uzskaita pieejamās

## Izvade

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main` atgrieztā vērtība. Lejupējie node lasa `$nodeLabel.result.message`
- `logs` — viss, ko kods nosūtīja uz `print`, tverti atsevišķi, lai tie nekad nesabojātu rezultātu
- `install` — kurš rīks instalēja atkarības (`uv`, `pip` vai `none`) un tā izvade

## Atkarības

Uzskaitiet pakotnes `requirements.txt` tieši tā, kā to darītu lokāli:

```
requests==2.32.3
feedparser
```

Pakotnes tiek instalētas ar `uv` vienreizlietojamā direktorijā pirms koda izpildes; ja `uv` nevar apstrādāt pakotni, Heym mēģina vēlreiz ar `pip`. Nekas netiek kešots starp izpildēm, tāpēc smagas atkarības katrai izpildei pievieno vairākas sekundes. Ja `requirements.txt` tiek atstāts tukšs, instalēšanas solis tiek pilnībā izlaists, un tas ir ievērojami ātrāk.

Pakotnes, kas nepiegādā wheel un kurām nepieciešams C kompilators, neizdosies instalēt. Iemesls parādīsies `install.log`.

## Tīkls

| Fāze | Tīkls |
|-------|---------|
| Atkarību instalēšana | Vienmēr ieslēgts — pip un uv ir jāsasniedz PyPI |
| Jūsu koda izpilde | Pēc noklusējuma izslēgts. `codeAllowNetwork` to ieslēdz |

Ja `codeAllowNetwork` ir izslēgts, izejošs izsaukums, piemēram, `requests.get(...)`, neizdodas ar savienojuma kļūdu. Tas ir paredzētais noklusējums: lielākā daļa Kods node pārveido datus, ko cits node jau ir ieguvis. Priekšroku dodiet datu iegūšanai ar **HTTP** node un satura nodošanai iekšā caur `codeParameters`.

## Sandbox un ierobežojumi

Jūsu kods darbojas kā lietotājs, kas nav root, konteinerā ar visām atņemtajām Linux spējām, iestatītu `no-new-privileges` un tikai lasāmu saknes failu sistēmu. Tas nesaņem Docker socket un nevienu no backend noslēpumiem vai vides.

| Ierobežojums | Vērtība |
|-------|-------|
| Atmiņa | 512 MB |
| CPU | 1 |
| Procesi | 256 |
| Atkarību instalēšanas taimauts | 120 sekundes |
| Izpildes taimauts | 60 sekundes |

Šīs ir fiksētas sandbox īpašības, nevis konfigurācija.

> **Nepieciešams Docker.** Atšķirībā no Agent Python rīkiem un prasmēm, Kods node nav lokālā rezerves režīma un nav vides mainīgā, lai to atslābinātu. Bez sasniedzama Docker dēmona node neizdodas ar skaidru kļūdu, nevis izpilda Jūsu kodu backend procesā. Izstrādē ar vietējo `./run.sh` palaidiet Docker pirms šī node izmantošanas. Skatiet [Drošība → Kods node sandbox](../reference/security.md#code-node-sandbox).

## Izmantojiet citu node, kad tas atbilst

| Ja vēlaties | Izmantojiet |
|-------------|-----|
| Parsēt vai veidot CSV, TSV, XML vai OCR failu | [Converter](converter-node.md) |
| Izsaukt HTTP API | [HTTP](http-node.md) |
| Kartēt vai pārdēvēt laukus | [Set](set-node.md) |
| Palaist citu workflow | [Execute](execute-node.md) |

Izmantojiet **Kods**, kad loģika patiešām neatbilst šiem — pielāgota matemātika, specifiska parsēšana vai algoritms.
## Piemērs

Punktu skaita rindas, ko ģenerē augšupējais mezgls:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Ja `codeParameters` ir iestatīts uz `{ "rows": "$fetchRows.result" }`, lejupējie mezgli nolasa `$scoreRows.result.total`.
