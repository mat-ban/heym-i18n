# Greitasis Dėklas

**Greitasis Dėklas** yra dešinėje pusėje esantis greito vykdymo panelis, skirtas workflows. Jis pasirodo autentifikuotose puslapiuose, tokiuose kaip valdymo pultas [Workflows tab](../tabs/workflows-tab.md), Docs ir Evals.

## Prieiga

- Spustelėkite fiksuotą **Quick / Workflows** trigger'į dešinėje ekrano vidurinėje dalyje
- Kai [Contextual Showcase](./contextual-showcase.md) taip pat yra prieinamas, jo **Page Guide** trigger'is yra virš Quick Workflows
- Dėklas atsidaro iš dešinės ir šiek tiek perkelia dabartinį puslapį į kairę su subtiliu perskaičiavimu
- Mobiliajame telefone Greitasis Dėklas yra paslėptas
- Dėklas nėra rodomas workflows redaktoriuje, prisijungimo/registracijos, portalo ar HITL peržiūros puslapiuose

## Workflow Paieška

Naudokite filtro laukelį dėklo viršuje, kad ieškotumėte workflows pagal:

- Workflow pavadinimą
- Workflow aprašymą

Paieška yra nesvarbi atvejui ir atnaujina sąrašą iš karto.

## Prisegti Workflows

Prisekite workflows, kad jie būtų viršuje dėkle.

- Prisegti workflows pasirodo savo sekcijoje virš viso sąrašo
- Nauji prisegimai pridedami prie viršaus
- Prisegimo tvarka išlieka perkeltiems naršyklės saugykloje

## Vykdomi Workflows

Pasirinkite workflow, kad atidarytumėte jo įvesties formą.

- Įvesties laukai rodomi vertikaliai dėklo tvarka
- Spustelėkite **Run Workflow**, kad vykdytumėte pasirinktą workflow
- Spustelėkite **Stop Workflow**, kad nutrauktumėte vykdomą vykdymą iš dėklo
- Workflows be įvesties laukų vis tiek gali būti vykdomi tiesiogiai
- Workflow, kuris prasideda [File Upload Trigger](../nodes/file-upload-trigger-node.md) mazgu, vietoj formos rodo numetimo zoną: nuvilkite į ją failą arba spustelėkite, kad pasirinktumėte. Zonoje nurodomi trigger priimami failų tipai bei dydis, o kiti failai atmetami dar prieš įkėlimą. **Run Workflow** lieka neaktyvus, kol nepasirenkamas failas.

Dėklas naudoja tą pačią workflow vykdymo API kaip ir kitos Heym vykdymo paviršiai, todėl išvestys ir vykdymo elgesys išlieka nuoseklūs.

Nutraukus vykdymą iš dėklo, taip pat nutraukiamas aktyvus backend vykdymas, įskaitant bet kokį vykdomą Playwright naršyklės darbą už tą workflow vykdymą.

## Progresas ir Rezultatai

Pradėjus vykdymą, dėklas rodo:

- Transliuojamą žingsnių progresą mazgams, kai jie prasideda ir baigiasi
- Galutinę būseną: `success`, `error` arba `pending`
- Galutines išvestis kompaktiškame JSON pane
- Istorijos įrašus, pažymėtus `Quick Drawer`

`pending` reiškia, kad workflow laukia vėlesnio veiksmo, pavyzdžiui, žmogaus peržiūros.

Vykdymas su failu vyksta per vienkartinę trigger įkėlimo nuorodą: stalčius paprašo workflow nuorodos, įkelia į ją failą ir parodo rezultatą, kai įkėlimas baigiasi. Vykdymai su failu rodo galutinę būseną ir išvestis, bet nerodo pažangos žingsnis po žingsnio, o istorijoje taip pat pažymimi `Quick Drawer` žyma. Pasirinktas failas išvalomas po kiekvieno vykdymo, nes viena nuoroda priima tik vieną failą.

## Naršyklės Saugykla

Greitasis Dėklas saugo asmeninius nustatymus `localStorage`:

- Prisegtų workflow ID
- Paskutinio pasirinkto workflow

Dėklas **ne** išlaiko įvesties reikšmes šioje versijoje.

## Apimtis

Greitasis Dėklas yra sąmoningai lengvas vykdymo paviršius.

- Įtraukti: paieška, prisegimas, pasirinkimas, įvestis (įskaitant failą), vykdymas, progresas, rezultatas
- Neįtraukti: workflow kūrimas, redagavimas, aplankų valdymas ir drobės veiksmai

## Susiję

- [Workflows Tab](../tabs/workflows-tab.md) – Pagrindinis workflows sąrašas, aplankai ir valdymas
- [Quick Start](../getting-started/quick-start.md) – Sukurkite ir vykdykite savo pirmąjį workflow
- [Execution History](./execution-history.md) – Peržiūrėkite praėjusius vykdymus
- [Webhooks](./webhooks.md) – Trigger'inkite workflows per HTTP
- [Contextual Showcase](./contextual-showcase.md) – Puslapio lygio gairių juosta, kuri papildo Greitąjį Dėklą
