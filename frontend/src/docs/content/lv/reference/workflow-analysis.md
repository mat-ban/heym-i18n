# Workflow analīze

**Workflow analīze** ir kreisās puses panelis, kas satur vienu koplietotu, rediģējamu Markdown dokumentu katram workflow. Izmantojiet to, lai izskaidrotu, ko workflow dara, un lai apkopotu uzlabošanas idejas — un ļaujiet AI ģenerēt pirmo melnrakstu jūsu vietā.

Dokuments ir koplietots: ikviens, kam ir piekļuve workflow, var to lasīt un rediģēt. Tas tiek glabāts kopā ar workflow un tiek automātiski dzēsts, kad workflow tiek dzēsts.

## Paneļa atvēršana

1. Atveriet workflow redaktorā.
2. Redaktora rīkjoslā noklikšķiniet uz **Analyze** (Sparkles ikona).
3. Panelis atveras kreisajā pusē. Kamēr tas ir atvērts, node palete (kreisais panelis) tiek sakļauta; node paletes atkārtota atvēršana aizver analīzes paneli.

Panelis ir pieejams tikai saglabātiem workflow. Pavisam jaunam, nesaglabātam workflow vispirms saglabājiet to.

## Dokuments

Panelis rāda vienu Markdown dokumentu ar diviem skatiem, ko pārslēdz ar pogām **Edit** (zīmulis) un **Preview** (acs):

| Skats | Mērķis |
|------|---------|
| **Edit** | Vienkāršs Markdown redaktors (textarea). |
| **Preview** | Renderēts Markdown. |

Galvenē ir redzams, **kas pēdējais rediģēja** dokumentu un kad.

### Saglabāšana

Noklikšķiniet uz **Save**, lai saglabātu izmaiņas. Save ir aktīva tikai tad, ja ir nesaglabātas izmaiņas.

Tā kā dokuments ir koplietots, saglabāšana izmanto optimistisko vienlaicību:

- Ja kāds cits kopš paneļa atvēršanas ir saglabājis jaunāku versiju, jūsu saglabāšana tiek noraidīta un parādās brīdinājums, nosaucot otru redaktoru.
- Pēc tam varat izvēlēties **Reload (discard mine)**, lai pieņemtu servera versiju, vai **Overwrite**, lai piespiedu kārtā saglabātu savu versiju pāri viņējai.

## AI analīze

Paneļa augšdaļā izvēlieties LLM **Credential** un **Model** (modeļu saraksts tiek ielādēts no izvēlētā credential — skatiet [Credentials](../tabs/credentials-tab.md)). Pēc tam palaidiet analīzi:

- **Analyze my workflow** — tiek rādīta, kad dokuments ir tukšs. Tā straumē AI ģenerētu Markdown ziņojumu tieši redaktorā kā nesaglabātu melnrakstu. Pārskatiet un rediģējiet to, pēc tam noklikšķiniet uz **Save**.
- **Reanalyze** — tiek rādīta, kad dokumentā jau ir saturs. Tā straumē jaunu ziņojumu atsevišķā **preview**, atstājot jūsu pašreizējo dokumentu neskartu. Izvēlieties **Accept**, lai aizstātu redaktora saturu ar jauno analīzi, vai **Discard**, lai saglabātu iepriekšējo.

Abas darbības vispirms **palaiž workflow** (kad tas ir derīgs un izpildāms) un iekļauj izpildes rezultātus analīzes prompt, tāpēc ziņojums atspoguļo to, kā workflow faktiski darbojas. Ja workflow nevar palaist, analīze turpinās, balstoties uz tā statisko struktūru.

Ģenerētais ziņojums aptver trīs sadaļas šādā secībā: **Improvement areas** (konkrēti ieteikumi, tostarp **security** aspekts ikreiz, kad workflow skar credentials, lietotāja ievadi, ārējus pieprasījumus vai datu atklāšanu), workflow **Purpose** un **What it does** (soli pa solim pārskats par node).

Sadaļa **Improvement areas** vienmēr veic četras skaidras pārbaudes:

1. **Error coverage** — ja kanvā nav [Error Handler](../nodes/error-handler-node.md) node un nav konfigurēts error workflow, ziņojums to norāda un iesaka pievienot kļūdu apstrādi.
2. **Time saved** — ja nav iestatīts aptuvenais ietaupītais laiks uz vienu izpildi, ziņojums iesaka to konfigurēt, lai [Analytics](../tabs/analytics-tab.md) metrika **Time Saved** varētu tikt aizpildīta.
3. **Network nodes** — attiecībā uz node, kas veic tīkla izsaukumus (piemēram, [HTTP](../nodes/http-node.md) un integrāciju node), ziņojums iesaka konkrētam node raksturīgu kļūdu apstrādi (retry un/vai continue-on-error) šiem node.
4. **Alerts** — ja workflow nav konfigurēti [alerts](../tabs/alerts-tab.md), ziņojums iesaka iestatīt alerts pirms pārejas uz prod.

### Run Analyzer no Properties

Kad workflow kanvā ir node, bet vēl nav analīzes dokumenta, workflow līmeņa [Properties](./canvas-features.md) panelī parādās poga **Run Analyzer** (tiek rādīta, kad nav atlasīts neviens node). Tā atver šo Workflow analīzes paneli, lai varētu izvēlēties credential un modeli un ģenerēt ziņojumu.

Katra analīzes izpilde tiek ierakstīta [Traces](../tabs/traces-tab.md) sadaļā ar avotu **Workflow Analysis**.

Ja nav konfigurēts neviens LLM credential, poga Analyze ir atspējota — pievienojiet to [Credentials Tab](../tabs/credentials-tab.md).

## Saistītais

- [AI Assistant](./ai-assistant.md) — ģenerējiet vai modificējiet workflow node, izmantojot dabisko valodu.
- [Sticky Note](../nodes/sticky-note-node.md) — īsām piezīmēm, kas piespraustas tieši uz kanvas.
