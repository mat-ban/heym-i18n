# Slack

**Slack** čvor šalje poruku u Slack kanal putem dolaznog Webhooka. Koristite ga za obavijesti, upozorenja i prijavu pogrešaka.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | Prosljeđuje ulaz |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Slack vjerodajnica (webhook URL) iz [Vjerodajnice](../tabs/credentials-tab.md) |
| `message` | expression | Tekst poruke. Podržava [izraze](../reference/expression-dsl.md). |

## Postavljanje

1. Izradite dolazni Webhook u svom Slack radnom prostoru
2. Dodajte Slack vjerodajnicu na kartici Vjerodajnice s webhook URL-om
3. Referencirajte vjerodajnicu u čvoru

## Primjer

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

Koristite s [Error Handler](./error-handler-node.md) za obavijesti o pogreškama:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Sigurnost izlaznog prometa

- Webhook URL pohranjen u vjerodajnici mora koristiti `http://` ili `https://` i razrješavati se isključivo na javne adrese. Loopback, privatne, link-local, multicast i cloud-metadata destinacije su blokirane.
- Heym validira razriješene adrese i prije slanja fiksira ciljnu točku veze, tako da DNS odgovor ne može premjestiti zahtjev na internu adresu nakon provjere. Proxyji iz okoline onemogućeni su dok je zaštita aktivna, a preusmjeravanja se ne slijede.
- Implementacije koje šalju na interni webhook prijemnik mogu postaviti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na pouzdanoj self-hosted instanci. Zadržite zadanu vrijednost na hosted ili multi-tenant implementacijama.

**Napomena o nadogradnji za v0.0.109:** ova provjera nova je za Slack. Vjerodajnica čiji webhook URL pokazuje na loopback ili privatnu adresu bit će odbijena osim ako gore navedena postavka nije omogućena.

## Povezano

- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Error Handler](./error-handler-node.md) – Pošaljite Slack pri pogrešci workflowa
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajte Slack webhook
