# Linear vozlišče

**Linear** vozlišče povezuje workflows z Linear GraphQL API za avtomatizacijo težav in delovnih prostorov.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | Linear osebni API ključ ali OAuth2 |
| Izhod | `$nodeLabel.*` |

## Poverilnica

Ustvarite **Linear** poverilnico v [Zavihku Poverilnice](../tabs/credentials-tab.md). Izberite en
način avtentikacije:

**Osebni API ključ**

1. V Linearju odprite **Nastavitve → Varnost in dostop → Osebni API ključi**.
2. Ustvarite ključ z dostopom do delovnega prostora, ki ga želite avtomatizirati.
3. Prilepite ključ v novo Linear poverilnico v Heym in uporabite **Preizkusi povezavo**, da jo preverite.

**OAuth2**

1. Ustvarite Linear OAuth aplikacijo.
2. Registrirajte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kot preusmeritveno URI.
3. V Heym izberite **OAuth2**, vnesite ID stranke in skrivnost stranke, nato kliknite **Poveži**.

Osebni API ključi in OAuth žetoni delujejo kot uporabnik, ki jih je ustvaril ali avtoriziral.

## Operacije

| Operacija | Zahtevana polja | Izhod |
|-----------|-----------------|--------|
| Pridobi gledalca | — | `viewer` |
| Naštej ekipe | Omejitev; neobvezno Počakaj na kazalec | `teams`, `count`, `pageInfo` |
| Naštej projekte | Omejitev; neobvezno Počakaj na kazalec | `projects`, `count`, `pageInfo` |
| Naštej težave | Omejitev; neobvezno ID ekipe, ID projekta, Počakaj na kazalec | `issues`, `count`, `pageInfo` |
| Naštej stanja delovnega toka | ID ekipe | `states`, `count` |
| Naštej člane ekipe | ID ekipe, Omejitev; neobvezno Počakaj na kazalec | `members`, `count`, `pageInfo` |
| Pridobi težavo | ID težave ali identifikator, kot je `ENG-123` | `issue`, `identifier`, `url` |
| Ustvari težavo | ID ekipe, Naslov | `issue`, `identifier`, `url` |
| Posodobi težavo | ID težave ali identifikator in vsaj eno spremenjeno polje | `issue`, `identifier`, `url` |
| Izbriši težavo | ID težave ali identifikator | `deleted` |
| Dodaj povezavo do težave | ID težave ali identifikator, URL povezave | `link` |
| Ustvari komentar | ID težave ali identifikator, Telo komentarja | `comment` |
| Naštej komentarje | ID težave ali identifikator, Omejitev; neobvezno Počakaj na kazalec | `comments`, `count`, `pageInfo` |
| Posodobi komentar | ID komentarja, Telo komentarja | `comment` |
| Izbriši komentar | ID komentarja | `deleted`, `entityId` |
| Reši komentar | ID komentarja | `comment` |
| Ne reši komentar | ID komentarja | `comment` |

Vsa besedilna polja podpirajo [izraze](../reference/expression-dsl.md).

## Polja težav

- **ID ekipe** in **ID projekta** sta Linear UUID-ji. Uporabite Naštej ekipe ali Naštej projekte, da jih odkrijete.
- **ID stanja** je UUID stanja delovnega toka, ki se uporablja pri ustvarjanju ali posodabljanju težave. Uporabite Naštej stanja delovnega toka, da ga odkrijete.
- **ID dodeljenega** je UUID Linear uporabnika. Uporabite Naštej člane ekipe, da ga odkrijete.
- **Prioriteta** sprejema vrednosti od `0` do `4`: brez prioritete, nujno, visoko, normalno in nizko.
- Pustite neobvezna posodobitvena polja prazna, da ohranite njihove trenutne vrednosti.
- Nastavite posodobitveno polje na `null`, da izbrišete opis, projekt, dodeljenega ali stanje.
- **URL povezave** doda zunanjo povezavo do priponke v težavo.
- **ID komentarja** je Linear UUID za obstoječi komentar. Uporabite Naštej komentarje, da ga odkrijete.
- **ID nadrejenega komentarja** odgovori na obstoječi Linear komentar pri ustvarjanju komentarja.

## Paginarjenje

Naštej operacije lahko vrnejo eno stran ali samodejno pridobijo vsako stran:

- Pustite **Vrni vse** izklopljeno, da ročno uporabite `Omejitev` in `Počakaj na kazalec`.
- Vklopite **Vrni vse**, da sledite Linear kazalcem na strežniški strani, do 10.000 rezultatov.

Strani rezultati vrnejo `pageInfo.hasNextPage` in `pageInfo.endCursor`. Prenesite kazalec v
**Počakaj na kazalec** pri naslednjem zagonu vozlišča, da pridobite naslednjo stran, ko je **Vrni vse** izklopljeno.

## Primeri

Ustvarite težavo iz vhodnih podatkov:

- Operacija: `Ustvari težavo`
- ID ekipe: `team UUID`
- Naslov: `$input.title`
- Opis: `$input.description`
- Prioriteta: `2`

Dodajte komentar k ustvarjeni težavi:

- Operacija: `Ustvari komentar`
- ID težave: `$createLinearIssue.issue.id`
- Telo komentarja: `$input.comment`
- ID nadrejenega komentarja: neobvezno, ko odgovarjate na drug komentar

Rešite nit komentarjev:

- Operacija: `Reši komentar`
- ID komentarja: `$listComments.comments[0].id`

Dodajte zunanjo povezavo do težave:

- Operacija: `Dodaj povezavo do težave`
- ID težave: `$createLinearIssue.issue.id`
- URL povezave: `$input.url`

Paginarite skozi člane ekipe:

- Operacija: `Naštej člane ekipe`
- ID ekipe: `$listTeams.teams[0].id`
- Omejitev: `50`
- Počakaj na kazalec: `$listTeamMembers.pageInfo.endCursor` pri naslednjem zagonu, ko je `hasNextPage` resnično

Odkrijte ID-je stanja delovnega toka pred posodabljanjem težave:

- Operacija: `Naštej stanja delovnega toka`
- ID ekipe: `$listTeams.teams[0].id`
- Nato uporabite `$listStates.states[0].id` kot **ID stanja** pri **Posodobi težavo**

## Izhod

Vsaka uspešna operacija nastavi:

- `$linear.success`
- `$linear.operation`

Naštej operacije prav tako izpostavljajo `count` in, kjer je to primerno, `pageInfo`. Operacije s težavami izpostavljajo celoten Linear payload težave in priročne vrednosti, kot so `identifier` in `url`.
Mutacije komentarjev izpostavljajo celoten `comment` payload, razen Izbriši komentar, ki izpostavlja `deleted` in `entityId`.

## Sorodno

- [Zavihek Poverilnice](../tabs/credentials-tab.md)
- [Vrste vozlišč](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
