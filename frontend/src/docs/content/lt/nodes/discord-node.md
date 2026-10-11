# Discord

**Discord** mazgas siunčia žinutę į Discord kanalą per Incoming Webhook. Naudokite jį įspėjimams, darbo eigų pranešimams, botų tipo atsakymams ir klaidų ataskaitoms.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | `discord` kredencialas, kuriame yra incoming webhook URL |
| `message` | išraiška | Išeinančios žinutės tekstas. Palaiko [išraiškas](../reference/expression-dsl.md). |
| `username` | išraiška | Pasirinktinė šios žinutės rodymo vardo perrašymas |
| `avatarUrl` | išraiška | Pasirinktinė šios žinutės avataro URL perrašymas |

## Nustatymas

1. Sukurkite [Discord Webhook kredencialą](../reference/integrations.md#discord)
2. Pridėkite **Discord** mazgą prie savo darbo eigos
3. Pasirinkite kredencialą
4. Nustatykite `message` kaip išeinantį tekstą arba šabloną, sukurtą iš aukščiau esančių duomenų
5. Pasirinktinai perrašykite rodymo `username` ir `avatarUrl`

## Pavyzdys

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

## Išvesties laukai

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.status` | HTTP status kodas, grąžinamas iš Discord, paprastai `204` sėkmingai |
| `$nodeLabel.response` | Žaliavos atsakymo kūnas, grąžinamas iš Discord webhook |
| `$nodeLabel.message` | Žinutės tekstas, kurį išsiuntė Heym |
| `$nodeLabel.username` | Vartotojo vardas, siunčiamas su webhook, jei pateiktas |
| `$nodeLabel.avatar_url` | Avataro URL, siunčiamas su webhook, jei pateiktas |

## Dažni modeliai

- Naudokite kartu su [Discord Trigger](./discord-trigger-node.md), kai norite papildomo kanalo įrašo be sąveikos atsakymo
- Siųskite klaidų pranešimus iš [Error Handler](./error-handler-node.md)
- Paskelbkite santraukas, sugeneruotas naudojant [LLM](./llm-node.md) arba [Agent](./agent-node.md)

## Išėjimo saugumas

- Webhook URL, saugomas kredenciale, turi naudoti `http://` arba `https://` ir būti nukreiptas tik į viešas adresus. Loopback, privatūs, link-local, multicast ir cloud-metadata paskirties vietos yra blokuojamos.
- Heym patikrina išspręstus adresus ir fiksuoja ryšio tikslą prieš siunčiant, todėl DNS atsakymas negali perkelti užklausos į vidinį adresą po patikrinimo. Aplinkos proxy yra išjungti, kol veikia apsauga, ir peradresavimai nėra sekami.
- Diegimai, kurie siunčia į vidinį webhook gavėją, gali nustatyti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` patikimo savarankiškai talpinamoje instancijoje. Laikykite numatytąją reikšmę talpinamuose arba daugiafunkciniuose diegimuose.

**Atnaujinimo pastaba v0.0.109:** ši patikra yra nauja Discord. Kredencialas, kurio webhook URL nurodo į loopback arba privatų adresą, bus atmestas, nebent aukščiau nurodyta nustatymas būtų įjungtas.

## Susiję

- [Discord Trigger](./discord-trigger-node.md) – Pradėkite darbo eigą iš gaunamų Discord sąveikų
- [Trečiųjų šalių integracijos](../reference/integrations.md) – Discord kredencialų nustatymas
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti ir valdyti `discord` kredencialus
- [Mazgų tipai](../reference/node-types.md) – Visi mazgų tipų apžvalga
