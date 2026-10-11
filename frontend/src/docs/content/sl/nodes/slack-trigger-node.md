# Slack Trigger

Vozlišče **Slack Trigger** je vhodna točka brez vhodnih parametrov, ki prejema webhooke iz Slack Events API in samodejno zažene workflow. Obvladuje Slackovo preverjanje URL in preverja podpise zahtevkov s pomočjo podpisnega skrivnega ključa.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Poverilnica `slack_trigger`, ki vsebuje podpisni skrivni ključ |

## Navodila za nastavitev

### 1. Ustvarite `slack_trigger` Poverilnico

1. Pojdite na **Nastavitve → Poverilnice → Nova Poverilnica**
2. Izberite tip **Slack Trigger (Signing Secret)**
3. Prilepite **Signing Secret** iz vaše Slack aplikacije:
   - V Slacku: **Nastavitve aplikacije → Osnovne informacije → Poverilnice aplikacije → Signing Secret**
4. Shranite poverilnico

### 2. Dodajte Vozlišče v Vaš Workflow

1. Odprite platno workflow
2. Povlecite **Slack Trigger** iz panela vozlišč na platno
3. Kliknite na vozlišče, da odprete panel lastnosti
4. Izberite svojo `slack_trigger` poverilnico
5. Kopirajte **Webhook URL**, prikazan v panelu

### 3. Konfigurirajte Vašo Slack Aplikacijo

1. V nastavitvah vaše Slack aplikacije pojdite na **Event Subscriptions**
2. Preklopite **Enable Events** na vklopljeno
3. Prilepite Webhook URL v polje **Request URL**
4. Slack pošlje izziv za preverjanje URL — Heym samodejno odgovori v milisekundah
5. Polje postane zeleno: ✓ Preverjeno
6. Naročite se na **Bot Events**, ki jih potrebujete (npr. `message.channels`, `reaction_added`)
7. Shranite svoje spremembe in ponovno namestite aplikacijo v svoj delovni prostor, če je to potrebno

## Izhodne Polja

Po aktivaciji vozlišča lahko spodnja vozlišča dostopajo do:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.event` | Celoten objekt Slack dogodka |
| `$nodeLabel.event.type` | Tip dogodka (npr. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Besedilo sporočila (ko je primerno) |
| `$nodeLabel.event.user` | ID Slack uporabnika, ki je sprožil dogodek |
| `$nodeLabel.event.channel` | ID kanala |
| `$nodeLabel.event.ts` | Časovna oznaka dogodka |
| `$nodeLabel.headers` | Sanitizirani HTTP glave iz Slacka |
| `$nodeLabel.triggered_by` | Oznaka vira sprožitve (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID vozlišča na platnu, ki je prejel Slack dogodek |

## Primer Workflow

**Slack sporočilo → LLM odgovor → Slack pošlji:**

```
slackTrigger → llm → slack
```

- Oznaka **slackTrigger**: `slackEvent`
- Sporočilo uporabnika **LLM**: `"Odgovori na to Slack sporočilo: $slackEvent.event.text"`
- Slack sporočilo: `$llm.text`

## Varnost

- Zahtevki so preverjeni z uporabo **HMAC-SHA256** s vašim podpisnim skrivnim ključem
- Časovne oznake starejše od **5 minut** so zavrnjene (preprečevanje ponovnih napadov)
- Občutljive glave (`x-slack-signature`, `authorization`, itd.) so odstranjene, preden dosežejo spodnja vozlišča
- Če ni nastavljena nobena poverilnica, vozlišče deluje brez preverjanja — to je priporočljivo le za lokalno testiranje

## Opombe

- Heym takoj odgovori z `200 OK` in izvaja workflow v ozadju — to zadostuje Slackovemu zahtevku po 3-sekundnem odgovoru
- Webhook URL je izpeljan iz ID-ja vozlišča in se nikoli ne spremeni, tudi po preimenovanju workflow
- Potrebno je le eno `slackTrigger` vozlišče na workflow; uporabite **Switch** ali **Condition** vozlišča spodaj za usmerjanje različnih tipov dogodkov
