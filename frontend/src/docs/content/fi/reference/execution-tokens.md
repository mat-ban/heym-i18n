# Suoritustokenit

Suoritustokenit ovat rajattuja JWT-tunnisteita, jotka antavat käyttöoikeuden yhden workflown suoritus- ja streamaus-endpointteihin. Ne mahdollistavat workflown kutsumisen ulkoisista järjestelmistä paljastamatta pitkäikäistä käyttäjäistunto-tokenia.

## Miksi käyttää suoritustokenia

Kun workflown todennus on asetettu **JWT**-tilaan, endpoint vaatii normaalisti voimassa olevan käyttäjäistunnon. Suoritustokenit antavat mahdollisuuden:

- Jakaa kutsuttava token ulkoisten skriptien, CI-pipelinejen tai integraatioiden kanssa jakamatta tilin tunnistetietoja.
- Rajoittaa altistumista – token on voimassa vain yhdelle tietylle workflowlle.
- Peruuttaa käyttöoikeus välittömästi vaihtamatta salasanaa tai kierrättämällä istuntotokenia.
- Valita lyhytikäisten (minuutit tai tunnit) ja pitkäikäisten (jopa 10 vuotta) tokenien välillä.

## Tokenin luominen

Avaa **Suorita cURL:lla** -valintaikkuna editorissa (oikeassa yläkulmassa oleva työkalurivi). Kun workflown todennus on asetettu **JWT Token** -tilaan, valintaikkuna näyttää tokenien hallintanäkymän:

1. Valitse **Lyhytikäinen** tai **Pitkäikäinen (10v)**.
2. Lyhytikäisille tokeneille syötä kesto sekunteina (vähintään 60).
3. Klikkaa **+ Uusi Token**.

Token luodaan välittömästi, lisätään listaan ja valitaan automaattisesti, jolloin cURL-komento päivittyy sisältämään sen.

## Token-lista

Jokainen token-rivi näyttää:

| Sarake | Kuvaus |
|--------|-------------|
| Luotu | Luontiaikaleima |
| Tila | **Vanhenee:** päivämäärä, **Vanhentunut** tai **Peruutettu** |
| Silmä-kuvake | Näytä/piilota tokenin arvo |
| Peruuta-painike | Merkitse token peruutetuksi (peruuttamaton) |

Klikkaa mitä tahansa aktiivista (ei-vanhentunutta, ei-peruutettua) riviä valitaksesi sen. Valittu token upotetaan cURL-komennon esikatseluun.

Vanhentuneet ja peruutetut tokenit pysyvät näkyvillä listassa, mutta niitä ei voi valita.

## Tokenin käyttö

Kopioi tokenin arvo listasta (klikkaa silmä-kuvaketta nähdäksesi sen) ja sisällytä se `Bearer`-tokenina:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Kun käytät **Kopioi cURL** -toimintoa valintaikkunassa tokenin ollessa valittuna, token upotetaan automaattisesti komentoon – manuaalista korvaamista ei tarvita.

## Tokenin rajoitukset

Jokainen token sisältää seuraavat JWT-vaateet:

| Vaate | Arvo |
|-------|-------|
| `sub` | Tokenin luoneen käyttäjän ID |
| `wid` | Workflown UUID – token hylätään kaikille muille workflowille |
| `scope` | `workflow:execute` – erottaa sen käyttäjäistunto-tokenista |
| `jti` | Uniikki token-ID, jota käytetään peruutustarkistuksissa |
| `exp` | Vanhentumisaikaleima |

Taustajärjestelmä tarkistaa nämä jokaisella pyynnöllä: allekirjoituksen kelpoisuus, vanhentuminen, vastaavuus `wid`:hen ja että `jti` ei ole peruutettu.

## Peruuttaminen

Klikkaa peruutuspainiketta (ympyrä-viiva) tokenin vierestä peruuttaaksesi sen. Peruutus tulee voimaan välittömästi – seuraavat pyynnöt, joissa käytetään kyseistä tokenia, palauttavat virhekoodin `401`. Token-rivi pysyy näkyvillä listassa **Peruutettu** -merkinnällä.

Peruutusta ei voi kumota. Luo uusi token, jos haluat palauttaa käyttöoikeuden.

## API

Tokenien hallinta-endpointit todennetaan käyttäjän normaalilla istunnolla.

| Metodi | Polku | Kuvaus |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Luo token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Listaa workflown tokenit |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Peruuta token |

**Luo-pyynnön runko:**

```json
{ "ttl_seconds": 900 }
```

**Luo-vastaus:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

`token`-kenttä palautetaan vain kerran luonnin yhteydessä. Tallenna se välittömästi; seuraavat `GET`-pyynnöt palauttavat saman rivin, mutta voit myös paljastaa sen cURL-valintaikkunassa milloin tahansa.

## Näkyvyysalue

Jokainen käyttäjä näkee vain itse luomansa tokenit. Tiimin jäsenet, joilla on käyttöoikeus jaetun workflown kanssa, eivät näe toistensa tokenia.

## Liittyvät aiheet

- [Webhookit](./webhooks.md) – HTTP-trigger-endpointit ja cURL-valintaikkuna
- [Turvallisuus](./security.md) – Istunnonhallinta ja todennusyhteenveto
- [SSE-streamaus](./sse-streaming.md) – Käytä suoritustokenia streamaus-endpointin kanssa
