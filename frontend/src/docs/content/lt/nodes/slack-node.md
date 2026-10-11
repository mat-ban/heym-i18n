# Slack

**Slack** mazgas siunčia žinutę į Slack kanalą per Incoming Webhook. Naudokite jį pranešimams, įspėjimams ir klaidų ataskaitoms.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | Perduoda įvestį |

## Parametrai

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `credentialId` | UUID | Slack kredencialas (webhook URL) iš [Kredencialų](../tabs/credentials-tab.md) |
| `message` | išraiška | Žinutės tekstas. Palaiko [išraiškas](../reference/expression-dsl.md). |

## Nustatymas

1. Sukurkite Incoming Webhook savo Slack darbo erdvėje.
2. Pridėkite Slack kredencialą Kredencialų skiltyje su webhook URL.
3. Nurodykite kredencialą mazge.

## Pavyzdys

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

Naudokite su [Klaidų tvarkytoju](./error-handler-node.md) pranešimams apie nesėkmes:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Išėjimo saugumas

- Kredenciale saugomas webhook URL turi naudoti `http://` arba `https://` ir būti nukreiptas tik į viešas adresus. Loopback, privatūs, link-local, multicast ir cloud-metadata tikslai yra blokuojami.
- Heym patikrina išspręstus adresus ir fiksuoja ryšio tikslą prieš siunčiant, todėl DNS atsakymas negali perkelti užklausos į vidinį adresą po patikrinimo. Aplinkos proxy yra išjungti, kol veikia apsauga, ir peradresavimai nėra sekami.
- Diegimai, kurie siunčia į vidinį webhook gavėją, gali nustatyti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` patikimo savarankiškai talpinamoje instancijoje. Laikykite numatytąją reikšmę talpinamuose arba daugiakartiniuose diegimuose.

**Atnaujinimo pastaba v0.0.109:** šis patikrinimas yra naujas Slack. Kredencialas, kurio webhook URL nurodo į loopback arba privatų adresą, bus atmestas, nebent aukščiau nurodyta nuostata būtų įjungta.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Klaidų tvarkytojas](./error-handler-node.md) – Siųsti Slack, kai workflow nepavyksta
- [Kredencialų skiltis](../tabs/credentials-tab.md) – Pridėti Slack webhook
