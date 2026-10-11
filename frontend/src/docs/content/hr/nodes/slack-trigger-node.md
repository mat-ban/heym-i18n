# Slack Trigger

Čvor **Slack Trigger** je ulazna točka bez ulaza koja prima Slack Events API webhookove i automatski pokreće workflow. Upravlja Slackovim izazovom za verifikaciju URL-a i provjerava potpise zahtjeva pomoću signing secreta.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger` vjerodajnica koja sadrži signing secret |

## Vodič za postavljanje

### 1. Izradite `slack_trigger` vjerodajnicu

1. Idite na **Settings → Credentials → New Credential**
2. Odaberite tip **Slack Trigger (Signing Secret)**
3. Zalijepite **Signing Secret** iz svoje Slack aplikacije:
   - U Slacku: **App settings → Basic Information → App Credentials → Signing Secret**
4. Spremite vjerodajnicu

### 2. Dodajte čvor u svoj workflow

1. Otvorite canvas workflowa
2. Povucite **Slack Trigger** iz panela čvorova na canvas
3. Kliknite na čvor da otvorite panel Properties
4. Odaberite svoju `slack_trigger` vjerodajnicu
5. Kopirajte **Webhook URL** prikazan u panelu

### 3. Konfigurirajte svoju Slack aplikaciju

1. U postavkama svoje Slack aplikacije idite na **Event Subscriptions**
2. Uključite **Enable Events**
3. Zalijepite Webhook URL u polje **Request URL**
4. Slack šalje izazov za verifikaciju URL-a — Heym automatski odgovara u roku od nekoliko milisekundi
5. Polje postaje zeleno: ✓ Verified
6. Pretplatite se na **Bot Events** koje trebate (npr. `message.channels`, `reaction_added`)
7. Spremite promjene i ponovno instalirajte aplikaciju u svoj workspace ako se to zatraži

## Izlazna polja

Nakon što se čvor pokrene, nizvodni čvorovi mogu pristupiti:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.event` | Potpuni Slack event objekt |
| `$nodeLabel.event.type` | Tip događaja (npr. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Tekst poruke (kada je primjenjivo) |
| `$nodeLabel.event.user` | Slack user ID osobe koja je pokrenula događaj |
| `$nodeLabel.event.channel` | ID kanala |
| `$nodeLabel.event.ts` | Vremenska oznaka događaja |
| `$nodeLabel.headers` | Sanitizirani HTTP headers iz Slacka |
| `$nodeLabel.triggered_by` | Oznaka izvora triggera (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID canvas čvora koji je primio Slack događaj |

## Primjer workflowa

**Slack poruka → LLM odgovor → Slack slanje:**

```
slackTrigger → llm → slack
```

- **slackTrigger** oznaka: `slackEvent`
- **LLM** korisnička poruka: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** poruka: `$llm.text`

## Sigurnost

- Zahtjevi se provjeravaju pomoću **HMAC-SHA256** s vašim signing secretom
- Vremenske oznake starije od **5 minuta** se odbijaju (prevencija replay napada)
- Osjetljivi headers (`x-slack-signature`, `authorization` itd.) uklanjaju se prije nego stignu do nizvodnih čvorova
- Ako vjerodajnica nije postavljena, čvor radi bez verifikacije — preporučuje se samo za lokalno testiranje

## Napomene

- Heym odmah odgovara s `200 OK` i pokreće workflow u pozadini — to zadovoljava Slackov zahtjev za odgovorom unutar 3 sekunde
- Webhook URL izvodi se iz ID-a čvora i nikada se ne mijenja, čak i nakon preimenovanja workflowa
- Potreban je samo jedan `slackTrigger` čvor po workflowu; koristite **Switch** ili **Condition** čvorove nizvodno za usmjeravanje različitih tipova događaja
