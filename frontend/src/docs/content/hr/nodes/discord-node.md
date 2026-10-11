# Discord

**Discord** čvor šalje poruku u Discord kanal putem dolaznog Webhooka. Koristite ga za upozorenja, obavijesti o workflowima, odgovore nalik botu i izvješćivanje o pogreškama.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `discord` vjerodajnica koja sadrži URL dolaznog webhooka |
| `message` | expression | Tekst odlazne poruke. Podržava [expressione](../reference/expression-dsl.md). |
| `username` | expression | Neobavezno nadjačavanje prikaznog imena za ovu poruku |
| `avatarUrl` | expression | Neobavezno nadjačavanje URL-a avatara za ovu poruku |

## Postavljanje

1. Izradite [Discord Webhook vjerodajnicu](../reference/integrations.md#discord)
2. Dodajte **Discord** čvor u svoj workflow
3. Odaberite vjerodajnicu
4. Postavite `message` na odlazni tekst ili predložak izgrađen od podataka iz prethodnih čvorova
5. Neobavezno nadjačajte prikazno `username` i `avatarUrl`

## Primjer

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

## Izlazna polja

| Expression | Opis |
|------------|-------------|
| `$nodeLabel.status` | HTTP statusni kod koji vraća Discord, obično `204` pri uspjehu |
| `$nodeLabel.response` | Sirovo tijelo odgovora koje vraća Discord webhook |
| `$nodeLabel.message` | Tekst poruke koju je Heym poslao |
| `$nodeLabel.username` | Korisničko ime poslano s webhookom, ako je navedeno |
| `$nodeLabel.avatar_url` | URL avatara poslan s webhookom, ako je naveden |

## Uobičajeni obrasci

- Koristite ga uz [Discord Trigger](./discord-trigger-node.md) kada želite dodatnu objavu u kanalu povrh odgovora na interakciju
- Šaljite obavijesti o pogreškama iz [Error Handlera](./error-handler-node.md)
- Objavljujte sažetke koje generiraju [LLM](./llm-node.md) ili [Agent](./agent-node.md)

## Sigurnost izlaznog prometa

- URL webhooka pohranjen u vjerodajnici mora koristiti `http://` ili `https://` i razrješavati se isključivo na javne adrese. Loopback, privatne, link-local, multicast i cloud-metadata destinacije su blokirane.
- Heym validira razriješene adrese i prije slanja fiksira ciljnu adresu veze, tako da DNS odgovor ne može preusmjeriti zahtjev na internu adresu nakon provjere. Proxyji iz okoline onemogućeni su dok je zaštita aktivna, a preusmjeravanja se ne slijede.
- Implementacije koje objavljuju na interni webhook receiver mogu postaviti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na pouzdanoj self-hosted instanci. Zadržite zadanu vrijednost na hosted ili multi-tenant implementacijama.

**Napomena o nadogradnji za v0.0.109:** ova je provjera nova za Discord. Vjerodajnica čiji URL webhooka pokazuje na loopback ili privatnu adresu bit će odbijena osim ako je gornja postavka omogućena.

## Povezano

- [Discord Trigger](./discord-trigger-node.md) – Pokrenite workflow iz dolaznih Discord interakcija
- [Integracije trećih strana](../reference/integrations.md) – Postavljanje Discord vjerodajnice
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodavanje i upravljanje `discord` vjerodajnicama
- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
