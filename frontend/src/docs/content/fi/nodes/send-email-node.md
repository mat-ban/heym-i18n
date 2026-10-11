# Sähköpostin lähetys

**Send Email** -solmu lähettää sähköpostiviestejä SMTP-protokollan avulla. Käytä sitä ilmoituksiin, hälytyksiin ja transaktiosähköposteihin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP-tunnistetiedot kohdasta [Tunnistetiedot](../tabs/credentials-tab.md) |
| `to` | lauseke | Vastaanottaja(t). Useammalle erotettu pilkulla. |
| `cc` | lauseke | Kopiovastaanottaja(t) (carbon copy). Useammalle erotettu pilkulla. |
| `bcc` | lauseke | Piilokopiovastaanottaja(t) (blind carbon copy). Useammalle erotettu pilkulla. Muilta vastaanottajilta piilotettu. |
| `subject` | lauseke | Sähköpostin aihe |
| `emailBody` | lauseke | Sähköpostin sisältö |
| `attachments` | lauseke | Pilkulla erotetut [Drive](./drive-node.md) -tiedostojen ID:t liitteinä. Vain workflowin omistajan tai hänen tiimiensä kanssa jaettuja tiedostoja voidaan liittää. |

## Liitteet

Liitä tiedostoja [Drive](./drive-node.md) -palvelusta antamalla yksi tai useampi Drive-tiedoston ID `attachments` -kenttään. Käytä `$`-lauseketta viitataksesi ylempänä olevan Drive-solmun `id`-tulosteeseen (esimerkiksi `$drive.id`) tai luettele staattiset ID:t pilkuilla erotettuna. Jokainen ID selvitetään workflowin omistajan näkökulmasta; virheellinen tai esteellinen ID aiheuttaa solmun epäonnistumisen sen sijaan, että lähetettäisiin osittainen sähköposti.

## Asennus

Lisää SMTP-tunnistetiedot palvelimen, portin, sähköpostiosoitteen ja salasanan kanssa. Yleisiä SMTP-palvelimia:

- Gmail: `smtp.gmail.com`, portti 587 (sovellussalasana vaaditaan)
- Outlook: `smtp.office365.com`, portti 587

## Esimerkki

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Yllä olevan `attachments` -arvo viittaa ylempänä olevaan [Drive](./drive-node.md) -solmuun, jonka nimi on `drive`, ja liittää sen tuottaman tiedoston.

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Virheenkäsittelijä](./error-handler-node.md) – Sähköpostin lähetys virhetilanteessa
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – SMTP-tunnistetietojen lisäys
- [Kolmannen osapuolen integraatiot](../reference/integrations.md#smtp-email) – SMTP-palveluntarjoajien asennus (Gmail, Outlook, Mailgun, SendGrid)
