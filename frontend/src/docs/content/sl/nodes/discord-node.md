# Discord

Vozlišče **Discord** pošlje sporočilo v Discord kanal prek prihajajočega Webhooka. Uporabite ga za opozorila, obvestila o workflows, odgovore podobne botom in poročanje o napakah.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `discord` poverilnica, ki vsebuje URL prihajajočega webhooka |
| `message` | izraz | Besedilo odhodnega sporočila. Podpira [izraze](../reference/expression-dsl.md). |
| `username` | izraz | Neobvezno prepisano ime za prikaz tega sporočila |
| `avatarUrl` | izraz | Neobvezna prepisana URL povezava do avatarja za to sporočilo |

## Nastavitev

1. Ustvarite [Discord Webhook poverilnico](../reference/integrations.md#discord)
2. Dodajte vozlišče **Discord** v svoj workflow
3. Izberite poverilnico
4. Nastavite `message` na odhodno besedilo ali predlogo, zgrajeno iz podatkov zgornjega toka
5. Po želji prepišite prikazano `username` in `avatarUrl`

## Primer

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Izhodne polja

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.status` | HTTP status koda, ki jo vrne Discord, običajno `204` ob uspehu |
| `$nodeLabel.response` | Suha vsebina odgovora, ki jo vrne Discord webhook |
| `$nodeLabel.message` | Besedilo sporočila, ki ga je poslal Heym |
| `$nodeLabel.username` | Ime uporabnika, poslano s webhookom, če je bilo navedeno |
| `$nodeLabel.avatar_url` | URL povezava do avatarja, poslana s webhookom, če je bila navedena |

## Pogoste sheme

- Uporabite ga skupaj z [Discord Trigger](./discord-trigger-node.md), ko želite dodatno objavo v kanalu poleg odgovora na interakcijo
- Pošljite obvestila o napakah iz [Error Handler](./error-handler-node.md)
- Objavite povzetke, ki jih generira [LLM](./llm-node.md) ali [Agent](./agent-node.md)

## Varnost pri izhodu

- URL webhooka, shranjen v poverilnici, mora uporabljati `http://` ali `https://` in se lahko rešuje le na javne naslove. Naslovi za zanko, zasebni, povezovalni, večkratni in metapodatkovni v oblak so blokirani.
- Heym preverja rešene naslove in zaklene ciljno povezavo pred pošiljanjem, tako da odgovor DNS ne more premakniti zahteve na notranji naslov po preverjanju. Proxiji okolja so onemogočeni, medtem ko je zaščita aktivna, in preusmeritve se ne upoštevajo.
- Namestitve, ki objavljajo na notranji webhook prejemnik, lahko nastavijo `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na zaupanja vredni samostojni instanci. Ohranite privzeto nastavitev na gostovanih ali večnajemniških namestitvah.

**Obvestilo o nadgradnji za v0.0.109:** ta preverjanje je novo za Discord. Poverilnica, katere URL webhooka kaže na zanko ali zasebni naslov, je zavrnjena, razen če je zgoraj navedena nastavitev omogočena.

## Sorodno

- [Discord Trigger](./discord-trigger-node.md) – Začnite workflow iz prihajajočih interakcij Discord
- [Integracije tretjih oseb](../reference/integrations.md) – Nastavitev Discord poverilnice
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte in upravljajte `discord` poverilnice
- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
