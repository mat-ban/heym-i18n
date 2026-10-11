# Discord

**Discord** node saadab sõnumi Discordi kanalisse sissetuleva webhooki kaudu. Kasutage seda teavituste, workflow'de märguannete, botilaadsete vastuste ja vigade raporteerimise jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | `discord` mandaat, mis sisaldab sissetuleva webhooki URL-i |
| `message` | expression | Väljamineva sõnumi tekst. Toetab [avaldised](../reference/expression-dsl.md). |
| `username` | expression | Valikuline kuvatava nime alistamine selle sõnumi jaoks |
| `avatarUrl` | expression | Valikuline avatari URL-i alistamine selle sõnumi jaoks |

## Seadistamine

1. Looge [Discord Webhook mandaat](../reference/integrations.md#discord)
2. Lisage **Discord** node oma workflow'sse
3. Valige mandaat
4. Määrake `message` väljaminevale tekstile või ülesvoolu andmetest loodud mallile
5. Soovi korral alistage kuvatav `username` ja `avatarUrl`

## Näide

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

## Väljundi väljad

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.status` | Discordi tagastatud HTTP olekukood, tavaliselt `204` õnnestumise korral |
| `$nodeLabel.response` | Discordi webhooki tagastatud töötlemata vastuse sisu |
| `$nodeLabel.message` | Sõnumi tekst, mille Heym saatis |
| `$nodeLabel.username` | Webhookiga saadetud kasutajanimi, kui see on esitatud |
| `$nodeLabel.avatar_url` | Webhookiga saadetud avatari URL, kui see on esitatud |

## Levinud mustrid

- Kasutage seda koos [Discord Triggeriga](./discord-trigger-node.md), kui soovite lisaks interaktsiooni vastusele täiendavat kanalipostitust
- Saatke veateateid [Error Handlerist](./error-handler-node.md)
- Postitage kokkuvõtteid, mille on genereerinud [LLM](./llm-node.md) või [Agent](./agent-node.md)

## Väljamineku turvalisus

- Mandaadis salvestatud webhooki URL peab kasutama `http://` või `https://` ning lahenema ainult avalikele aadressidele. Loopback-, privaatsed, link-local-, multicast- ja pilve-metadata sihtkohad on blokeeritud.
- Heym valideerib lahendatud aadressid ja kinnitab ühenduse sihtmärgi enne saatmist, nii et DNS-vastus ei saa pärast kontrolli päringut sisemisele aadressile suunata. Keskkonna proxy'd on valve aktiivselt olles keelatud ning ümbersuunamisi ei järgita.
- Juurutused, mis postitavad sisemisele webhooki vastuvõtjale, saavad usaldusväärsel isemajutatud instantsil määrata `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hoidke vaikeväärtust hostitud või mitme rentniku juurutustel.

**Uuendusteade versioonile v0.0.109:** see kontroll on Discordi jaoks uus. Mandaat, mille webhooki URL osutab loopback- või privaatsele aadressile, lükatakse tagasi, kui ülaltoodud säte ei ole lubatud.

## Seotud

- [Discord Trigger](./discord-trigger-node.md) – Käivitage workflow sissetulevate Discordi interaktsioonide põhjal
- [Kolmandate osapoolte integratsioonid](../reference/integrations.md) – Discordi mandaadi seadistamine
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Lisage ja haldake `discord` mandaate
- [Node'i tüübid](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
