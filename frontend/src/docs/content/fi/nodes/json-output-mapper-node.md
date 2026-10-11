# JSON-tulosteen muokkaaja

**JSON-tulosteen muokkaaja** -solmu rakentaa JSON-objektin avain/arvo -[kartoituksista](./set-node.md) (sama malli kuin [Set](./set-node.md) -solmussa). Käytä sitä, kun kutsujien tulee vastauksena saada **pelkkä JSON-runko** vastauksen juuritasolla.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 0 (nielu) |
| Suorituksen tuloste | `mappings` -kentistä rakennettu objekti |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `mappings` | taulukko | `{ "key": "fieldName", "value": "expression" }` -merkinnät (sama kuin Set-solmussa) |

## Agenttityökalun käyttö

Ei tuettu. Tämä solmu on loppunielu, joten sitä ei voi liittää [Agent Node](./agent-node.md) -työkalujen kahvaan. Käytä [Set](./set-node.md) -solmua, kun agentin tulee muokata arvoja keskustelun aikana.

## Webhook- ja suorituskäyttäytyminen

Kun tämä solmu on workflow:n **ainoa** lopputuloste, suorituksen **tulosteet** ovat itse kartoitettu objekti: `mappings` -kenttien avaimet näkyvät JSON:n **ylätasolla**. Tulosteessa **ei** ole ulompaa wrapperia solmun tunnisteen mukaan eikä `{ "result": ... }` -objektia (toisin kuin [Output](./output-node.md) -solmussa).

Jos useammalla loppusolmulla on tulosteita (esimerkiksi [Output](./output-node.md) plus JSON-tulosteen muokkaaja tai useita haaroja), Heym käyttää normaalia muotoa: jokainen lopputuloste avataan sen `label` -kentän mukaan.

## Silmukkarajoitus

Sama sääntö kuin [Output](./output-node.md) -solmussa: älä sijoita tätä solmua silmukan iterointihaaraan – vain silmukan `done` -haaran jälkeen. Katso [Loop](./loop-node.md).

## Esimerkki

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Aiheeseen liittyvät

- [Set](./set-node.md) – Samat kartoitusmekaniikat välimuunnoksille
- [Output](./output-node.md) – Viesti- tai skeemapohjainen vastaus `result` -kääreellä
- [Node Types](../reference/node-types.md) – Kaikki solmutyypit
- [Workflow Structure](../reference/workflow-structure.md) – JSON-workflow-muoto
- [Webhooks](../reference/webhooks.md) – Suoritusendpoint ja vastaukset
