# Slack

**Slack** node saadab sõnumi Slacki kanalisse Incoming Webhooki kaudu. Kasutage seda teavituste, hoiatuste ja vigade raporteerimise jaoks.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | Passes through input |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | Slacki mandaat (webhook URL) jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `message` | expression | Sõnumi tekst. Toetab [avaldised](../reference/expression-dsl.md). |

## Seadistamine

1. Looge Slacki tööruumis Incoming Webhook
2. Lisage Mandaatide vahekaardil Slacki mandaat koos webhook URL-iga
3. Viidake mandaadile nodes

## Näide

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

Kasutage koos [Error Handleriga](./error-handler-node.md) ebaõnnestumisteavituste jaoks:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Väljamineva liikluse turvalisus

- Mandaadis salvestatud webhook URL peab kasutama `http://` või `https://` ning lahenema ainult avalikele aadressidele. Loopback-, privaatsed, link-local-, multicast- ja pilve-metadata sihtkohad on blokeeritud.
- Heym valideerib lahendatud aadressid ja kinnitab ühenduse sihtmärgi enne saatmist, nii et DNS-vastus ei saa pärast kontrolli päringut sisemisele aadressile suunata. Keskkonna proxy'd on valvuri aktiivsuse ajal keelatud ning ümbersuunamisi ei järgita.
- Juurutuskeskkonnad, mis saadavad päringuid sisemisele webhook-vastuvõtjale, saavad usaldusväärses isemajutatud instantsis seada `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hoidke vaikeväärtust hostitud või mitme rentnikuga juurutustes.

**Uuendusteade versioonile v0.0.109:** see kontroll on Slacki jaoks uus. Mandaat, mille webhook URL osutab loopback- või privaatsele aadressile, lükatakse tagasi, kui ülaltoodud säte ei ole lubatud.

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Error Handler](./error-handler-node.md) – Slacki saatmine workflow' ebaõnnestumisel
- [Credentials Tab](../tabs/credentials-tab.md) – Slacki webhooki lisamine
