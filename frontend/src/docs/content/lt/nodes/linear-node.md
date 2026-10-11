# Linear mazgas

**Linear** mazgas jungia workflows su Linear GraphQL API, skirtu problemų ir darbo erdvės automatizavimui.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | Linear asmeninis API raktas arba OAuth2 |
| Išvestis | `$nodeLabel.*` |

## Kredencialas

Sukurkite **Linear** kredencialą [Kredencialų skiltyje](../tabs/credentials-tab.md). Pasirinkite vieną
autentifikavimo režimą:

**Asmeninis API raktas**

1. Linear programoje atidarykite **Nustatymai → Saugumas ir prieiga → Asmeniniai API raktai**.
2. Sukurkite raktą, kuris suteikia prieigą prie darbo erdvės, kurią norite automatizuoti.
3. Įklijuokite raktą į naują Linear kredencialą Heym programoje ir naudokite **Išbandyti ryšį**, kad jį patvirtintumėte.

**OAuth2**

1. Sukurkite Linear OAuth programą.
2. Registruokite `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kaip nukreipimo URI.
3. Heym programoje pasirinkite **OAuth2**, įveskite Kliento ID ir Kliento Slaptažodį, tada spustelėkite **Prisijungti**.

Asmeniniai API raktai ir OAuth žetonai veikia kaip vartotojas, kuris juos sukūrė arba autorizavo.

## Operacijos

| Operacija | Reikalingi laukai | Išvestis |
|-----------|-------------------|----------|
| Gauti žiūrovą | — | `viewer` |
| Išvardyti komandas | Limitas; neprivalomas Po Kursoriumi | `teams`, `count`, `pageInfo` |
| Išvardyti projektus | Limitas; neprivalomas Po Kursoriumi | `projects`, `count`, `pageInfo` |
| Išvardyti problemas | Limitas; neprivalomas Komandos ID, Projekto ID, Po Kursoriumi | `issues`, `count`, `pageInfo` |
| Išvardyti darbo eigos būsenas | Komandos ID | `states`, `count` |
| Išvardyti komandos narius | Komandos ID, Limitas; neprivalomas Po Kursoriumi | `members`, `count`, `pageInfo` |
| Gauti problemą | Problemos ID arba identifikatorius, pvz., `ENG-123` | `issue`, `identifier`, `url` |
| Sukurti problemą | Komandos ID, Pavadinimas | `issue`, `identifier`, `url` |
| Atnaujinti problemą | Problemos ID arba identifikatorius ir bent vienas pakeistas laukas | `issue`, `identifier`, `url` |
| Ištrinti problemą | Problemos ID arba identifikatorius | `deleted` |
| Pridėti problemos nuorodą | Problemos ID arba identifikatorius, Nuorodos URL | `link` |
| Sukurti komentarą | Problemos ID arba identifikatorius, Komentarų turinys | `comment` |
| Išvardyti komentarus | Problemos ID arba identifikatorius, Limitas; neprivalomas Po Kursoriumi | `comments`, `count`, `pageInfo` |
| Atnaujinti komentarą | Komentarų ID, Komentarų turinys | `comment` |
| Ištrinti komentarą | Komentarų ID | `deleted`, `entityId` |
| Išspręsti komentarą | Komentarų ID | `comment` |
| Neišspręsti komentaro | Komentarų ID | `comment` |

Visi teksto laukai palaiko [išraiškas](../reference/expression-dsl.md).

## Problemos laukai

- **Komandos ID** ir **Projekto ID** yra Linear UUID. Naudokite Išvardyti komandas arba Išvardyti projektus, kad juos atrastumėte.
- **Būsenos ID** yra darbo eigos būsenos UUID, naudojamas kuriant arba atnaujinant problemą. Naudokite Išvardyti darbo eigos būsenas, kad jį atrastumėte.
- **Priskyrimo ID** yra Linear vartotojo UUID. Naudokite Išvardyti komandos narius, kad jį atrastumėte.
- **Prioritetas** priima `0` iki `4`: be prioriteto, skubus, aukštas, normalus ir žemas.
- Palikite neprivalomus atnaujinimo laukus tuščius, kad išsaugotumėte jų dabartines vertes.
- Nustatykite atnaujinimo lauką į `null`, kad išvalytumėte aprašymą, projektą, priskyrimą arba būseną.
- **Nuorodos URL** prideda išorinę priedų nuorodą prie problemos.
- **Komentaro ID** yra Linear UUID esamam komentarui. Naudokite Išvardyti komentarus, kad jį atrastumėte.
- **Tėvo komentaro ID** atsako į esamą Linear komentarą kuriant komentarą.

## Puslapiavimas

Išvardijimo operacijos gali grąžinti arba vieną puslapį, arba automatiškai gauti kiekvieną puslapį:

- Palikite **Grąžinti viską** išjungtą, kad rankiniu būdu naudotumėte `Limit` ir `After Cursor`.
- Įjunkite **Grąžinti viską**, kad sekti Linear kursorus serverio pusėje, iki 10,000 rezultatų.

Puslapiuoti rezultatai grąžina `pageInfo.hasNextPage` ir `pageInfo.endCursor`. Perduokite kursorį į
**After Cursor** kitame mazgo vykdyme, kad gautumėte kitą puslapį, kai **Grąžinti viską** yra išjungta.

## Pavyzdžiai

Sukurkite problemą iš aukščiau esančios įvesties:

- Operacija: `Sukurti problemą`
- Komandos ID: `team UUID`
- Pavadinimas: `$input.title`
- Aprašymas: `$input.description`
- Prioritetas: `2`

Pridėkite komentarą prie sukurtos problemos:

- Operacija: `Sukurti komentarą`
- Problemos ID: `$createLinearIssue.issue.id`
- Komentarų turinys: `$input.comment`
- Tėvo komentaro ID: neprivalomas, atsakant į kitą komentarą

Išspręskite komentarų giją:

- Operacija: `Išspręsti komentarą`
- Komentarų ID: `$listComments.comments[0].id`

Pridėkite išorinę nuorodą prie problemos:

- Operacija: `Pridėti problemos nuorodą`
- Problemos ID: `$createLinearIssue.issue.id`
- Nuorodos URL: `$input.url`

Puslapiuokite per komandos narius:

- Operacija: `Išvardyti komandos narius`
- Komandos ID: `$listTeams.teams[0].id`
- Limitas: `50`
- Po Kursoriumi: `$listTeamMembers.pageInfo.endCursor` kitame vykdyme, kai `hasNextPage` yra tiesa

Atraskite darbo eigos būsenos ID prieš atnaujindami problemą:

- Operacija: `Išvardyti darbo eigos būsenas`
- Komandos ID: `$listTeams.teams[0].id`
- Tada naudokite `$listStates.states[0].id` kaip **Būsenos ID** **Atnaujinti problemą**

## Išvestis

Kiekviena sėkminga operacija nustato:

- `$linear.success`
- `$linear.operation`

Išvardijimo operacijos taip pat atskleidžia `count` ir, kur taikoma, `pageInfo`. Problemos operacijos atskleidžia visą Linear problemos payload ir patogius laukus, tokius kaip `identifier` ir `url`.
Komentarų mutacijos atskleidžia visą `comment` payload, išskyrus Ištrinti komentarą, kuris atskleidžia `deleted` ir `entityId`.

## Susiję

- [Kredencialų skiltis](../tabs/credentials-tab.md)
- [Mazgų tipai](../reference/node-types.md)
- [Išraiškų DSL](../reference/expression-dsl.md)
