# Slack

Vozlišče **Slack** pošlje sporočilo v Slack kanal prek Incoming Webhook. Uporabite ga za obvestila, opozorila in poročanje o napakah.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | Prehaja skozi vhod |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Poverilnica Slack (URL za webhook) iz [Poverilnic](../tabs/credentials-tab.md) |
| `message` | izraz | Besedilo sporočila. Podpira [izraze](../reference/expression-dsl.md). |

## Nastavitev

1. Ustvarite Incoming Webhook v vašem Slack delovnem prostoru.
2. Dodajte Slack poverilnico v zavihku Poverilnice z URL-jem za webhook.
3. Sklicujte se na poverilnico v vozlišču.

## Primer

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Uporabite z [Obvladovalcem napak](./error-handler-node.md) za obvestila o napakah:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Varnost izhoda

- URL za webhook, shranjen v poverilnici, mora uporabljati `http://` ali `https://` in se rešiti le na javne naslove. Naslovi za povratne zanke, zasebni, lokalni povezavi, multicast in cilji za oblačne metapodatke so blokirani.
- Heym preverja rešene naslove in zaklene ciljno povezavo pred pošiljanjem, tako da odgovor DNS ne more premakniti zahteve na notranji naslov po preverjanju. Proxiji okolja so onemogočeni, medtem ko je zaščita aktivna, in preusmeritve se ne upoštevajo.
- Namestitve, ki pošiljajo na notranji prejemnik webhook, lahko nastavijo `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na zaupanja vredni samostojni instanci. Ohranite privzeto nastavitev na gostovanih ali večnajemniških namestitvah.

**Obvestilo o nadgradnji za v0.0.109:** ta preverjanje je novo za Slack. Poverilnica, katere URL za webhook kaže na povratno zanko ali zasebni naslov, je zavrnjena, razen če je zgoraj navedena nastavitev omogočena.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Obvladovalec napak](./error-handler-node.md) – Pošlji Slack ob neuspehu delovnega toka
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodaj Slack webhook
