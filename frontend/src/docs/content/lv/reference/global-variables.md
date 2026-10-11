# Globālie mainīgie

**Globālo mainīgo krātuve** glabā noturīgus, lietotāja tvēruma atslēgu-vērtību datus, kas saglabājas starp workflow izpildēm. Izmantojiet to konfigurācijai, funkciju karodziņiem, skaitītājiem vai koplietotam stāvoklim, kas nepieciešams vairākiem workflow.

> **Neglabājiet šeit noslēpumus.** Globālie mainīgie nav noslēpumu glabātuve: vērtības tiek glabātas nešifrētā veidā, tās tiek atgrieztas pilnībā ikvienam, ar ko tās koplietojat, un līdzautori tās var rediģēt. API atslēgas, paroles un token pieder [Akreditācijas datiem](./credentials.md), kas tos šifrē miera stāvoklī un nekad neatgriež noslēpumu klientam.

## Lokālie pret globālajiem

| Krātuve | Sintakse | Tvērums | Noturība |
|-------|--------|-------|-------------|
| **Workflow-lokālie** | `$vars.variableName` | Tikai pašreizējā izpilde | Atmiņā, zūd, kad izpilde beidzas |
| **Globālie** | `$global.variableName` | Visi lietotāja workflow | Saglabāti datubāzē |

## Globālo mainīgo izveide

1. **No cilnes Variables** – [Cilne Variables](../tabs/global-variables-tab.md): Izveidojiet, rediģējiet un dzēsiet mainīgos tieši.
2. **No mezgla Variable** – Iespējojiet **Store in Global Variable Store** (`isGlobal: true`) mezgla rekvizītos. Mainīgais tiek ierakstīts krātuvē, kad workflow darbojas.

## Izmantošana izteiksmēs

Piekļūstiet globālajiem mainīgajiem ar `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Izmantojiet tos pašus paņēmienus kā workflow-lokālajiem mainīgajiem (piem., `.upper()`, `.length`, `.add()` masīviem).

## Vērtību tipi

Atbalstītie tipi: `string`, `number`, `boolean`, `array`, `object`. Izvēlieties tipu, veidojot vai rediģējot mainīgo.

## Globālo mainīgo koplietošana

Varat koplietot globālo mainīgo ar citiem lietotājiem vai [Komandām](./teams.md), lai viņi to varētu izmantot savos workflow.

- **Koplietot ar lietotāju** – Noklikšķiniet uz koplietošanas ikonas blakus piederošajam mainīgajam, ievadiet saņēmēja e-pastu un noklikšķiniet uz **Share**. Saņēmējs redzēs mainīgo savā Global Variables sarakstā ar **Shared** nozīmīti un apzīmējumu "Shared by &lt;your email&gt;".
- **Koplietot ar komandu** – Koplietošanas dialogā atlasiet komandu un noklikšķiniet uz **Add**. Visi komandas dalībnieki iegūst piekļuvi.
- **Rediģējama piekļuve** – Saņēmēji var skatīt, rediģēt un atsaukties uz koplietoto mainīgo, izmantojot `$global.variableName` savos workflow. Tikai īpašnieks var koplietot, atcelt koplietošanu vai dzēst mainīgo.
- **Nosaukumu konflikti** – Ja saņēmējam jau ir mainīgais ar tādu pašu nosaukumu, viņa paša mainīgajam ir prioritāte pār koplietoto.
- **Atsaukt koplietošanu** – Atveriet mainīgā koplietošanas dialogu un noklikšķiniet uz pogas **×** blakus lietotājam, kuram vēlaties noņemt piekļuvi.

## Chat integrācija

Globālie mainīgie ir pieejami [Chat](../tabs/chat-tab.md) asistentam. LLM var uz tiem atsaukties, atbildot uz jautājumiem vai ģenerējot saturu.

## Saistītais

- [Cilne Variables](../tabs/global-variables-tab.md) – Pārvaldiet globālos mainīgos UI
- [Mezgls Variable](../nodes/variable-node.md) – Iestatiet mainīgos ar `isGlobal`
- [Expression DSL](./expression-dsl.md) – `$global` sintakse
