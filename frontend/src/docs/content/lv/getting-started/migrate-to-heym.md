# Pāreja uz Heym

Vai Jums jau ir Workflow citā rīkā? **AI Convert** pārvērš tos Heym Workflow Jūsu vietā. Ielīmējiet Workflow no n8n, Flowise, Dify, Langflow, sim.ai vai Activepieces — vai vienkārši aprakstiet, ko vēlaties — un Heym izveidos līdzvērtīgu Workflow uz dzīva kanvas, ko varat lejupielādēt un importēt.

Atveriet to **[heym.run/convert](https://heym.run/convert)** vai izmantojiet pogu **✨ AI Convert** vietnes galvenē.

## Kā tas darbojas

1. **Izvēlieties avota rīku** (neobligāti) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces vai atstājiet *Auto*.
2. **Norādiet savu Workflow** — ielīmējiet eksportēto JSON no sava pašreizējā rīka vai uzrakstiet vienkāršā valodā aprakstu par automatizāciju, ko vēlaties.
3. **Ģenerējiet** — Heym straumē rezultātu uz kanvas, zīmējot mezglus un savienojumus to tapšanas laikā.
4. **Lejupielādējiet vai nokopējiet** ģenerēto Workflow kā JSON.
5. **Importējiet uz Heym** — izmantojiet [Download & Import](../reference/download-import.md) plūsmu, lai ielīmētu JSON uz sava kanvas, pēc tam palaidiet to.

Konversija arī pievieno nelielu *Sticky Note* uz kanvas, kas atzīmē Workflow kā Heym ģenerētu — dzēsiet to, kad vien vēlaties.

## Ko Jūs iegūstat

Konvertētājs kartē avota konceptus uz vietējiem Heym mezgliem — Trigger, [LLM](../nodes/llm-node.md) soļiem, [HTTP](../nodes/http-node.md) izsaukumiem, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) darbībām, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) un [Output](../nodes/output-node.md). Pārskatiet rezultātu uz kanvas, pievienojiet savus [Credentials](../reference/credentials.md) un pielāgojiet visu, ko avota rīks izteica citādi.

> AI Convert ir sākumpunkts, nevis garantēts 1:1 pārnesums. Vienmēr pārskatiet ģenerēto Workflow pirms tā palaišanas produkcijā.

## Svarīgi zināt

- **AI-powered:** konversijas tiek ģenerētas ar liela mēroga valodas modeli, tāpēc rezultāti var atšķirties starp palaišanas reizēm. Ģenerējiet no jauna, ja pirmais rezultāts nav gluži piemērots.
- **Ievades apjoms:** ievade, ko ielīmējat vai ierakstāt, ir ierobežota līdz aptuveni **25 000 tokeniem**. Pirms konvertēšanas saīsiniet ļoti lielus eksportus.
- **Pieprasījumu ierobežojumi:** lai rīks būtu pieejams visiem, pieprasījumi vienam apmeklētājam ir ierobežoti līdz **1 reizei minūtē, 5 reizēm stundā un 10 reizēm dienā**.
- **Drošība:** pieprasījumi tiek pārbaudīti, un tiek apstrādāti tikai ar Workflow veidošanu saistīti pieprasījumi.

## Nākamie soļi

- Vai esat jauns canvas lietotājs? Sāciet ar [Ātro sākumu](./quick-start.md).
- Uzziniet, kā darbojas imports, sadaļā [Lejupielāde un imports](../reference/download-import.md).
- Vai mitināt Heym pats? Skatiet [Vides mainīgos](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md), lai iegūtu pilnu konfigurācijas uzziņu.
- Veidojiet no nulles ar lietotnē esošo [AI Assistant](../reference/ai-assistant.md).
