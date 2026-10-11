# Slack

**Slack** mezgls nosūta ziņojumu uz Slack kanālu, izmantojot Incoming Webhook. Izmantojiet to paziņojumiem, brīdinājumiem un kļūdu ziņošanai.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | Nodod tālāk ievadi |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | Slack akreditācijas dati (webhook URL) no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `message` | expression | Ziņojuma teksts. Atbalsta [izteiksmes](../reference/expression-dsl.md). |

## Iestatīšana

1. Izveidojiet Incoming Webhook savā Slack darbvietā
2. Pievienojiet Slack akreditācijas datus cilnē Akreditācijas dati ar webhook URL
3. Atsaucieties uz akreditācijas datiem mezglā

## Piemērs

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

Izmantojiet kopā ar [Error Handler](./error-handler-node.md) kļūdu paziņojumiem:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Izejas drošība

- Akreditācijas datos saglabātajam webhook URL ir jāizmanto `http://` vai `https://` un jāatrisina tikai uz publiskām adresēm. Loopback, privātās, link-local, multicast un cloud-metadata galamērķi ir bloķēti.
- Heym validē atrisinātās adreses un pirms nosūtīšanas piesaista savienojuma mērķi, tāpēc DNS atbilde nevar pārvietot pieprasījumu uz iekšēju adresi pēc pārbaudes. Vides starpniekserveri tiek atspējoti, kamēr aizsargs ir aktīvs, un pāradresācijas netiek sekotas.
- Izvietojumi, kas sūta uz iekšēju webhook uztvērēju, var iestatīt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` uz uzticama pašmitināta instancē. Saglabājiet noklusējuma iestatījumu mitinātos vai daudznomnieku izvietojumos.

**Jaunināšanas piezīme versijai v0.0.109:** šī pārbaude ir jauna Slack mezglam. Akreditācijas dati, kuru webhook URL norāda uz loopback vai privātu adresi, tiek noraidīti, ja vien iepriekš minētais iestatījums nav iespējots.

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Error Handler](./error-handler-node.md) – Sūtīt Slack, ja workflow neizdodas
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienot Slack webhook
