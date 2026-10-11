# Analītikas cilne

**Analītikas** cilne rāda izpildes metriku un tendences Jūsu workflows. Uzraugiet lietojumu, veiktspēju un identificējiet šaurās vietas.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Skatīt analītikas demonstrāciju</a></p>

## Kopsavilkuma statistika

- **Kopējās izpildes** – Workflow izpildes skaits izvēlētajā periodā
- **Veiksmju procents** – Veiksmīgu izpildes procentuālā daļa
- **Vidējais ilgums** – Vidējais izpildes laiks
- **Ietaupītais laiks** – Kopējais aprēķinātais ietaupītais laiks: katra workflow konfigurētie ietaupītie minūtes par izpildi × tās veiksmīgās izpildes, summētas izvēlētajā logā
- **Tendences** – Augšup/uz leju rādītāji salīdzinājumā ar iepriekšējo periodu

## Laika intervāls

- **24h** – Pēdējās 24 stundas
- **7d** – Pēdējās 7 dienas
- **30d** – Pēdējās 30 dienas
- **Visi** – Visa pieejamā vēsture

## Workflow filtrs

- Filtrēt metriku pēc konkrēta workflow
- **Visi workflows** – Apvienotā statistika visiem workflows

## Tabulas

Divas tabulas rāda workflow lietojumu: **Visvairāk izmantotie** (platāki) un **Visvairāk neizdevušies**.

- **Ietaupītais laiks** – Visvairāk izmantotie rāda katra workflow summēto ietaupīto laiku (minūtes ietaupītas par izpildi × veiksmīgās izpildes). **Nav iestatīts** nozīmē, ka novērtējums trūkst; noklikšķiniet uz tā, lai atvērtu šo lauku workflow.
- **Kārtotie kolonnas** – Noklikšķiniet uz kolonnas virsraksta, lai kārtotu pēc šīs kolonnas. Noklikšķiniet vēlreiz, lai pārslēgtu augošā/nokrišņu secībā. Bultu rādītāji parāda kārtošanas virzienu.
- **Mobilie etiķetes** – Uz mazām ekrāniem kolonnas etiķetes tiek saīsinātas (piem., "Izpildes" → "Izpildes", "Veiksmīgi" → "OK", "Kļūda" → "Err"), lai tabulas ietilptu bez horizontālas ritināšanas.

## Diagrammas

- **Izpildes apjoms laika gaitā** – Līniju diagramma par izpildēm pa laika intervāliem
- **Veiksmju pret kļūdu procentu** – Platuma diagramma, kas salīdzina veselīgas un neizdevušās izpildes
- **Vidējā latentums laika gaitā** – Līniju diagramma, kas rāda atbildes laika izmaiņas
- **Velciet, lai izvēlētos** – Noklikšķiniet un velciet jebkurā diagrammā, lai fokusētos uz pielāgotu datumu intervālu
- **Izvēles režīms** – Izvēlētie intervāli atsvaidzinās kopsavilkuma kartes, diagrammas un workflow tabulas, nemainot bāzes iestatījumus
- **Notīrīt izvēli** – Atgriezieties pie iepriekš iestatītā laika loga, kad esat pabeidzis izpēti

## Automātiskā atsvaidzināšana

- Iespējiet automātisko atsvaidzināšanu, lai saglabātu metrikas atjauninātas bez manuālas atkārtotas ielādes

## Saistītie

- [Workflows cilne](./workflows-tab.md) – Mērītie workflows
- [Izpildes cilne](./traces-tab.md) – Detalizēta izpildes pārbaude
- [Žurnālu cilne](./logs-tab.md) – Izpildes žurnāli atkļūdošanai
- [Kontekstualā demonstrācija](../reference/contextual-showcase.md) – Kompakts lapas ceļvedis informācijas paneļa virsmām

Kad diagramma rāda tendenci, par kuru Jūs vēlaties tikt informēts, nevis to vērot, pārvērtiet to par [brīdinājumu](./alerts-tab.md): kļūdu skaits, izpildes ilgums, LLM izdevumi un izpildes skaits var tikt noteikti ar slieksni laika logā.
