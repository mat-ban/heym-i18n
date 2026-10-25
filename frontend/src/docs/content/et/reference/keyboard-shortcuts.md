# Klaviatuuri kiirklahvid

Heym pakub workflow-redaktoris ja lõuendil klaviatuuri kiirklahve, et kiirendada tavapäraseid toiminguid.

## Redaktori üldised kiirklahvid

Need kiirklahvid on aktiivsed kõikjal workflow-redaktoris.

| Kiirklahv | Toiming |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Ava käsukäskude palett (Command Palette) |
| `Ctrl + I` / `Cmd + I` | Näita/peida [AI Assistant](./ai-assistant.md) paneeli (töötab ka tippimise ajal) |
| `Ctrl + Enter` / `Cmd + Enter` | Käivita praegune workflow |
| `Ctrl + S` / `Cmd + S` | Salvesta workflow |
| `Ctrl + Z` / `Cmd + Z` | Võta tagasi |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Tee uuesti |
| `Ctrl + Y` / `Cmd + Y` | Tee uuesti (alternatiivne) |
| `Escape` | Sulge avatud ülekatted, dialoogid ja paneelid |

## Lõuendi kiirklahvid

Need kiirklahvid kehtivad, kui lõuend on fookuses (ükski tekstisisestus ei ole aktiivne).

### Valimine ja navigeerimine

| Kiirklahv | Toiming |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Vali kõik sõlmed |
| `Shift` (hoia all) | Lohistades vali mitu sõlme |
| `Ctrl` / `Cmd` (hoia all) | Klõpsates lisa üksikud sõlmed valikusse |
| `Escape` | Tühista kõigi sõlmede valik; sulge reasisene sõlmeotsing |

### Sõlmede redigeerimine

| Kiirklahv | Toiming |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Kopeeri valitud sõlm(ed) |
| `Ctrl + X` / `Cmd + X` | Lõika valitud sõlm(ed) |
| `Ctrl + V` / `Cmd + V` | Kleebi sõlm(ed) |
| `Delete` või `Backspace` | Kustuta valitud sõlm(ed) ja/või serv(a) |
| `D` | Näita/peida valitud sõlm(ed) lubatud / keelatud |
| `P` | Näita/peida kinnitatud andmed valitud sõlmel |

### Reasisene sõlmeotsing

Mis tahes trükitava märgi tippimine lõuendil (kui ükski tekstisisestus ei ole fookuses) avab reasisese sõlmeotsingu hüpikakna. Tipitud märk saab otsingupäringu esimeseks märgiks.

| Kiirklahv | Toiming |
|----------|--------|
| Mis tahes trükitav märk | Ava reasisene sõlmeotsing ja alusta tippimist |
| `Backspace` | Eemalda otsingupäringust viimane märk |
| `Escape` | Sulge reasisene sõlmeotsing |

## Käsukäskude palett (`Ctrl + K`)

Käsukäskude palett on saadaval redaktorist, töölaualt, dokumentatsioonist ja hindamiste vaadetest. See võimaldab kiiresti navigeerida workflow'de, vahekaartide ja dokumentatsioonilehtede vahel ilma klaviatuurilt lahkumata.

| Kiirklahv | Toiming |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Ava käsukäskude palett |
| `↑` / `↓` | Navigeeri tulemuste loendis |
| `Tab` / `Shift + Tab` | Navigeeri tulemuste loendis |
| `Enter` | Ava valitud üksus |
| `Escape` | Sulge palett |

## Töölaua kiirklahvid

Need kiirklahvid on aktiivsed vahekaardil Workflows, kui ükski muu tekstisisestus ei ole aktiivne.

| Kiirklahv | Toiming |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Fookusta workflow otsing |
| `Escape` | Tühjenda workflow otsing, kui see sisaldab teksti |

## Atribuutide paneeli kiirklahvid

Need kiirklahvid on aktiivsed, kui sõlm on valitud ja atribuutide paneel on avatud.

| Kiirklahv | Toiming |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Ava lingitud alam-workflow uuel vahekaardil (ainult Execute sõlm) |

## Hindamise dialoogi kiirklahvid

Need kiirklahvid on aktiivsed, kui hindamise dialoog on avatud.

| Kiirklahv | Toiming |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Rakenda avaldis ja sulge dialoog |
| `Ctrl + Z` / `Cmd + Z` | Võta avaldise redaktoris muudatused tagasi |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Tee avaldise redaktoris muudatused uuesti |
| `Ctrl + Y` / `Cmd + Y` | Tee avaldise redaktoris muudatused uuesti (alternatiivne) |

## Ajaloo ja käivituste kiirklahvid

Need kiirklahvid on saadaval käivituste ajaloo dialoogis ja käivituste paneelis.

| Kiirklahv | Toiming |
|----------|--------|
| `S` | Näita/peida otsingusisestus kirjete filtreerimiseks |

## Seotud

- [Lõuendi funktsioonid](./canvas-features.md) – Andmete kinnitamine, lubamine/keelamine, alam-workflow'ks eraldamine
- [Workflow struktuur](./workflow-structure.md) – Sõlmede ja servade formaat
- [Execute sõlm](../nodes/execute-node.md) – Kutsub alam-workflow'sid (`Ctrl + Shift + O`)
- [Kiire algus](../getting-started/quick-start.md) – Ehitage oma esimene workflow

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
