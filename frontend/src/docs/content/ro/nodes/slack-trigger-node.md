# Slack Trigger

Nodul **Slack Trigger** este un punct de intrare fără date de intrare care primește webhook-uri de la Slack Events API și pornește automat un workflow. Acesta gestionează provocarea de verificare a URL-ului Slack și verifică semnăturile cererilor folosind un signing secret.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditarea `slack_trigger` care conține signing secret-ul |

## Ghid de configurare

### 1. Creați o acreditare `slack_trigger`

1. Accesați **Settings → Credentials → New Credential**
2. Selectați tipul **Slack Trigger (Signing Secret)**
3. Lipiți **Signing Secret**-ul din aplicația dvs. Slack:
   - În Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Salvați acreditarea

### 2. Adăugați nodul în workflow-ul dvs.

1. Deschideți canvas-ul workflow-ului
2. Trageți **Slack Trigger** din panoul de noduri pe canvas
3. Faceți clic pe nod pentru a deschide panoul Properties
4. Selectați acreditarea `slack_trigger`
5. Copiați **Webhook URL**-ul afișat în panou

### 3. Configurați aplicația dvs. Slack

1. În setările aplicației Slack accesați **Event Subscriptions**
2. Activați **Enable Events**
3. Lipiți Webhook URL-ul în câmpul **Request URL**
4. Slack trimite o provocare de verificare a URL-ului — Heym răspunde automat în câteva milisecunde
5. Câmpul devine verde: ✓ Verified
6. Abonați-vă la **Bot Events** de care aveți nevoie (de ex. `message.channels`, `reaction_added`)
7. Salvați modificările și reinstalați aplicația în spațiul de lucru dacă vi se solicită

## Câmpuri de ieșire

După declanșarea nodului, nodurile din aval pot accesa:

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.event` | Obiectul complet al evenimentului Slack |
| `$nodeLabel.event.type` | Tipul evenimentului (de ex. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Textul mesajului (când este aplicabil) |
| `$nodeLabel.event.user` | ID-ul utilizatorului Slack care a declanșat evenimentul |
| `$nodeLabel.event.channel` | ID-ul canalului |
| `$nodeLabel.event.ts` | Marca temporală a evenimentului |
| `$nodeLabel.headers` | Anteturile HTTP sanitizate de la Slack |
| `$nodeLabel.triggered_by` | Eticheta sursei de declanșare (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID-ul nodului din canvas care a primit evenimentul Slack |

## Exemplu de workflow

**Mesaj Slack → răspuns LLM → trimitere Slack:**

```
slackTrigger → llm → slack
```

- Eticheta **slackTrigger**: `slackEvent`
- Mesajul utilizatorului pentru **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Mesajul **Slack**: `$llm.text`

## Securitate

- Cererile sunt verificate folosind **HMAC-SHA256** cu signing secret-ul dvs.
- Marca temporală mai veche de **5 minute** este respinsă (prevenirea atacurilor de tip replay)
- Anteturile sensibile (`x-slack-signature`, `authorization` etc.) sunt eliminate înainte de a ajunge la nodurile din aval
- Dacă nu este setată nicio acreditare, nodul rulează fără verificare — recomandat doar pentru testare locală

## Note

- Heym răspunde cu `200 OK` imediat și rulează workflow-ul în fundal — aceasta satisface cerința Slack de răspuns în 3 secunde
- Webhook URL-ul este derivat din ID-ul nodului și nu se modifică niciodată, chiar și după redenumirea workflow-ului
- Este necesar un singur nod `slackTrigger` per workflow; utilizați noduri **Switch** sau **Condition** în aval pentru a direcționa diferite tipuri de evenimente
