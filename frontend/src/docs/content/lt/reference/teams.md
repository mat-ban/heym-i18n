# Komandos

Komandos leidžia vienu metu dalintis workflows, kredencialais, globaliais kintamaisiais, vektorių saugyklomis ir Drive failais su vartotojų grupe.

## Apžvalga

- **Komanda** – Pavadinta grupė su kūrėju ir nariais
- **Kūrėjas** – Visada yra narys; gali redaguoti komandą, ištrinti komandą, pridėti narius
- **Narys** – Gali pridėti ir pašalinti kitus narius (išskyrus kūrėją); turi prieigą prie išteklių, dalinamų su komanda

## Komandų kūrimas ir valdymas

Komandas galima kurti iš [Komandų skilties](../tabs/teams-tab.md). Pridėkite narius pagal el. paštą; jie turi turėti paskyrą. Kūrėjo negalima pašalinti. Ištrinant komandą, pašalinami visi komandos dalijimai.

## Ištekliai, kurie gali būti dalijami

Ištekliai gali būti dalijami su:

1. **Individualiais vartotojais** – Pagal el. paštą (vartotojo-vartotojui dalijimas)
2. **Komandomis** – Pasirinkus komandą (komandos dalijimas)

Abu modeliai yra papildomi. Vartotojas gauna prieigą, jei jis yra:

- Dalijamas tiesiogiai (vartotojo dalijimas), arba
- Komandos narys, turintis komandos dalijimą

## Kas gali būti dalijama su komandomis

| Išteklius | Dalijimosi vieta |
|-----------|------------------|
| Workflows | Dalijimosi dialogas workflows redaktoriuje |
| Workflow šablonai | Dalijimosi dialogas kuriant/redaguojant workflow šabloną |
| Mazgų šablonai | Dalijimosi dialogas kuriant/redaguojant mazgų šabloną |
| Kredencialai | Dalijimosi dialogas Kredencialų skiltyje |
| Globalūs kintamieji | Dalijimosi dialogas Kintamųjų skiltyje |
| Vektorių saugyklos | Dalijimosi dialogas Vektorių skiltyje |
| Drive failai | Dalijimosi dialogas Drive skiltyje arba Drive mazgo `shareWithMyTeams` / `unshareWithMyTeams` operacijos |

Šablonams, kai matomumas yra **Specifiniai vartotojai**, taip pat galite pasirinkti komandas. Visi pasirinktos komandos nariai gauna prieigą prie šablono. Drive failų komandos dalijimai yra tik skaitymo režimu komandos nariams; failo savininkas išlaiko valdymo teises.

## API Endpointai

- `GET /api/teams` – Išvardina komandas, kurioms vartotojas priklauso
- `GET /api/teams/{id}` – Gauti komandos detales su nariais
- `GET /api/teams/{id}/shared-entities` – Grąžina su komanda dalijamus objektus (workflows, kredencialai, globalūs kintamieji, vektorių saugyklos, failai, workflow šablonai, mazgų šablonai)
- `POST /api/teams` – Sukurti komandą
- `PATCH /api/teams/{id}` – Atnaulinti komandą
- `DELETE /api/teams/{id}` – Ištrinti komandą (tik kūrėjui)
- `POST /api/teams/{id}/members` – Pridėti narį (kūnas: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Pašalinti narį

Komandos dalijimai pagal išteklius:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST kūnas priima `permission` (`read` arba `write`, numatytasis `write`); pakartotinai pateikus esamą komandą, atnaujinamos jos teisės
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Susiję

- [Komandų skiltis](../tabs/teams-tab.md) – Kurti ir valdyti komandas
- [Šablonų skiltis](../tabs/templates-tab.md) – Dalintis workflow ir mazgų šablonais su komandomis
- [Kredencialų dalijimas](./credentials-sharing.md) – Dalintis kredencialais su vartotojais ir komandomis
- [Workflow organizavimas](./workflow-organization.md) – Katalogai ir workflow dalijimas
