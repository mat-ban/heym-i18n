# Tiimit

Tiimit mahdollistavat workflowtien, tunnistetietojen, globaalien muuttujien, vektorivarastojen ja Drive-tiedostojen jakamisen käyttäjäryhmän kanssa kerralla.

## Yleiskatsaus

- **Tiimi** – Nimitetty ryhmä, jolla on luoja ja jäsenet
- **Luoja** – Aina jäsen; voi muokata tiimiä, poistaa tiimin, lisätä jäseniä
- **Jäsen** – Voi lisätä ja poistaa muita jäseniä (pois lukien luoja); pääsee käsiksi tiimin kanssa jaettuihin resursseihin

## Tiimien luominen ja hallinta

Tiimit luodaan [Tiimit-välilehdeltä](../tabs/teams-tab.md). Jäsenet lisätään sähköpostiosoitteella; heillä on oltava käyttäjätili. Luojaa ei voi poistaa. Tiimin poistaminen poistaa kaikki tiimin jaot.

## Jakamismalli

Resursseja voidaan jakaa:

1. **Yksittäisten käyttäjien** kanssa – Sähköpostiosoitteella (käyttäjä-käyttäjä-jako)
2. **Tiimien** kanssa – Valitsemalla tiimi (tiimijako)

Molemmat mallit ovat lisäyksellisiä. Käyttäjä saa pääsyn, jos hän on joko:
- Jaettu suoraan (käyttäjäjako), tai
- Tiimin jäsen, jolla on tiimijako

## Mitä voidaan jakaa tiimien kanssa

| Resurssi | Jakopaikka |
|----------|----------------|
| Workflowt | Jakodialogi workflow-editorissa |
| Workflow-mallit | Jakodialogi workflow-mallia luotaessa/muokatessa |
| Solmumallit | Jakodialogi solmumallia luotaessa/muokatessa |
| Tunnistetiedot | Jakodialogi Tunnistetiedot-välilehdellä |
| Globaalit muuttujat | Jakodialogi Muuttujat-välilehdellä |
| Vektorivarastot | Jakodialogi Vektorit-välilehdellä |
| Drive-tiedostot | Jakodialogi Drive-välilehdellä tai Drive-solmun `shareWithMyTeams` / `unshareWithMyTeams` -toiminnot |

Malleissa, kun näkyvyys on **Tietyt käyttäjät**, voit valita myös tiimejä. Kaikki valittujen tiimien jäsenet saavat pääsyn malliin.
Drive-tiedostojen tiimijaot ovat vain luku -oikeuksia tiimijäsenille; tiedoston omistaja säilyttää hallintaoikeudet.

## API-endpointit

- `GET /api/teams` – Listaa käyttäjän tiimit
- `GET /api/teams/{id}` – Hae tiimin tiedot jäsenineen
- `GET /api/teams/{id}/shared-entities` – Palauttaa tiimin kanssa jaetut entiteetit (workflowt, tunnistetiedot, globaalit muuttujat, vektorivarastot, tiedostot, workflow-mallit, solmumallit)
- `POST /api/teams` – Luo tiimi
- `PATCH /api/teams/{id}` – Päivitä tiimi
- `DELETE /api/teams/{id}` – Poista tiimi (vain luoja)
- `POST /api/teams/{id}/members` – Lisää jäsen (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Poista jäsen

Resurssikohtaiset tiimijaot:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST-pyynnön body hyväksyy `permission` (`read` tai `write`, oletus `write`); olemassa olevan tiimin uudelleen lähettäminen päivittää sen oikeudet
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Aiheeseen liittyvät

- [Tiimit-välilehti](../tabs/teams-tab.md) – Tiimien luominen ja hallinta
- [Mallit-välilehti](../tabs/templates-tab.md) – Workflow- ja solmumallien jakaminen tiimien kanssa
- [Tunnistetietojen jakaminen](./credentials-sharing.md) – Tunnistetietojen jakaminen käyttäjien ja tiimien kanssa
- [Workflowjen organisointi](./workflow-organization.md) – Kansiot ja workflowjen jakaminen
