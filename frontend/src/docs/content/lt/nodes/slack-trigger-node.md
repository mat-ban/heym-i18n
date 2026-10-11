# Slack Trigger

**Slack Trigger** mazgas yra nulinio įvesties įėjimo taškas, kuris gauna Slack Events API webhook'us ir automatiškai pradeda workflow. Jis tvarko Slack URL patvirtinimo iššūkį ir patvirtina užklausų parašus su pasirašymo slaptažodžiu.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | `slack_trigger` kredencialas, turintis pasirašymo slaptažodį |

## Nustatymo Gidas

### 1. Sukurkite `slack_trigger` Kredencialą

1. Eikite į **Nustatymai → Kredencialai → Naujas kredencialas**
2. Pasirinkite tipą **Slack Trigger (Signing Secret)**
3. Įklijuokite **Pasirašymo slaptažodį** iš savo Slack programėlės:
   - Slack: **Programėlės nustatymai → Pagrindinė informacija → Programėlės kredencialai → Pasirašymo slaptažodis**
4. Išsaugokite kredencialą

### 2. Pridėkite Mazgą prie Savo Workflow

1. Atidarykite workflow drobę
2. Vilkite **Slack Trigger** iš mazgų panelės ant drobės
3. Spustelėkite mazgą, kad atidarytumėte Ypatybių panelę
4. Pasirinkite savo `slack_trigger` kredencialą
5. Nukopijuokite **Webhook URL**, rodoma panelėje

### 3. Sukonfigūruokite Savo Slack Programėlę

1. Savo Slack programėlės nustatymuose eikite į **Įvykių prenumeratos**
2. Įjunkite **Įvykių leidimą**
3. Įklijuokite Webhook URL į **Užklausos URL** lauką
4. Slack siunčia URL patvirtinimo iššūkį — Heym automatiškai atsako per milisekundes
5. Laukas tampa žalias: ✓ Patvirtinta
6. Prenumeruokite reikalingus **Bot Events** (pvz., `message.channels`, `reaction_added`)
7. Išsaugokite pakeitimus ir, jei reikia, iš naujo įdiekite programėlę į savo darbo erdvę

## Išvesties Laukai

Po to, kai mazgas suveikia, žemiau esantys mazgai gali pasiekti:

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.event` | Pilnas Slack įvykio objektas |
| `$nodeLabel.event.type` | Įvykio tipas (pvz., `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Žinutės tekstas (kai taikoma) |
| `$nodeLabel.event.user` | Slack vartotojo ID, kuris suaktyvino įvykį |
| `$nodeLabel.event.channel` | Kanalo ID |
| `$nodeLabel.event.ts` | Įvykio laiko žyma |
| `$nodeLabel.headers` | Sanitizuoti HTTP antraštės iš Slack |
| `$nodeLabel.triggered_by` | Suaktyvinimo šaltinio etiketė (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Drobės mazgo ID, kuris gavo Slack įvykį |

## Pavyzdinis Workflow

**Slack žinutė → LLM atsakymas → Slack siuntimas:**

```
slackTrigger → llm → slack
```

- **slackTrigger** etiketė: `slackEvent`
- **LLM** vartotojo žinutė: `"Atsakykite į šią Slack žinutę: $slackEvent.event.text"`
- **Slack** žinutė: `$llm.text`

## Saugumas

- Užklausos yra patvirtinamos naudojant **HMAC-SHA256** su jūsų pasirašymo slaptažodžiu
- Laiko žymės, senesnės nei **5 minutės**, yra atmetamos (apsaugos nuo pakartotinio užpuolimo)
- Jautrios antraštės (`x-slack-signature`, `authorization` ir kt.) yra pašalinamos prieš pasiekiant žemiau esančius mazgus
- Jei kredencialas nėra nustatytas, mazgas veikia be patvirtinimo — tai rekomenduojama tik vietiniam testavimui

## Pastabos

- Heym iš karto atsako su `200 OK` ir vykdo workflow fone — tai atitinka Slack 3 sekundžių atsakymo reikalavimą
- Webhook URL yra gautas iš mazgo ID ir niekada nesikeičia, net ir po workflow pervadinimo
- Reikia tik vieno `slackTrigger` mazgo kiekvienam workflow; naudokite **Switch** arba **Condition** mazgus žemiau, kad nukreiptumėte skirtingų įvykių tipus
