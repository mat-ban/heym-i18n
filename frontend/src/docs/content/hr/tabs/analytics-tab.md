# Analytics Tab

Završni **Analytics** tab prikazuje metrike izvršavanja i trendove za Vaše workflows. Pratite korištenje, performanse i identificirajte uska grla.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Pogledajte demo Analyticsa</a></p>

## Sažetak Statistika

- **Ukupna izvršavanja** – Broj pokretanja workflow-a u odabranom razdoblju
- **Stopa uspješnosti** – Postotak uspješnih pokretanja
- **Prosječno trajanje** – Srednje vrijeme izvršavanja
- **Ušteđeno vrijeme** – Ukupno procijenjeno ušteđeno vrijeme: konfigurirane minute uštede po pokretanju svakog workflow-a × uspješna pokretanja, zbrojeno kroz odabrano razdoblje
- **Trendovi** – Indikatori rasta/pada u odnosu na prethodno razdoblje

## Raspon Vremena

- **1h**, **3h**, **6h** – Zadnji 1 sat, 3 sata ili 6 sati. Analitika se vodi po satima, pa ove opcije računaju početni sat prozora u cijelosti: Zadnji sat u 15:20 pokriva razdoblje od 14:00 do sada
- **24h** – Posljednjih 24 sata
- **7d** – Posljednjih 7 dana
- **30d** – Posljednjih 30 dana
- **Sve** – Cijela dostupna povijest

## Filter Workflow-a

- Filtrirajte metrike prema specifičnom workflow-u
- **Svi workflows** – Agregacija svih workflows

## Tablice

Dvije tablice prikazuju korištenje workflow-a: **Najviše korišteni** (šira) i **Najviše neuspješni**.

- **Ušteđeno vrijeme** – Najviše korišteni prikazuje zbrojeno ušteđeno vrijeme svakog workflow-a (minute uštede po pokretanju × uspješna pokretanja). **Nije postavljeno** znači da procjena nedostaje; kliknite na to da otvorite to polje na workflow-u.
- **Sortabilne kolone** – Kliknite na zaglavlje kolone da sortirate prema toj koloni. Kliknite ponovo da prebacite između uzlaznog/ silaznog. Strelice pokazuju smjer sortiranja.
- **Mobilne oznake** – Na malim ekranima, oznake kolona su skraćene (npr. "Izvršavanja" → "Pokretanja", "Uspjeh" → "OK", "Greška" → "Err") kako bi tablice stale bez horizontalnog pomicanja.

## Grafikon

- **Obujam izvršavanja tijekom vremena** – Linijski grafikon izvršavanja po vremenskim intervalima
- **Stopa uspjeha naspram greške** – Područje grafikon koji uspoređuje zdrava i neuspješna pokretanja
- **Prosječna latencija tijekom vremena** – Linijski grafikon koji prikazuje promjene vremena odgovora
- **Povuci za odabir** – Kliknite i povucite na bilo kojem grafikonu kako biste fokusirali prilagođeni datumski raspon. Odabir mora obuhvatiti najmanje dvije točke na grafikonu; običan klik ne odabire ništa
- **Način odabira** – Odabrani rasponi osvježavaju sažetak kartica, grafikone i tablice workflow-a bez promjene osnovnog unaprijed postavljenog
- **Očisti odabir** – Vratite se na unaprijed postavljeno vremensko razdoblje kada završite s istraživanjem

## Vrste čvorova

Ispod percentila latencije tri grafikona prikazuju kamo odlaze vrijeme i pogreške čvorova, grupirani prema vrsti čvora (Agent, HTTP Request, Code itd.) u svim prikazanim workflowima:

- **Čvorovi s najviše utrošenog vremena** – 10 vrsta čvorova s najvećim ukupnim vremenom izvođenja, prikazanih kao prosječno trajanje po pozivu. Sat bez poziva određene vrste prikazuje **Nema poziva** u tooltipu.
- **Vrste čvorova s najviše pogrešaka** – 10 vrsta čvorova s najviše pogrešaka (pogreška ili timeout), svaka s vlastitim brojem pogrešaka po vremenskom intervalu.
- **Najčešće pozivane vrste čvorova** – 10 vrsta čvorova koji su se najviše izvodili, svaka s vlastitim brojem poziva po vremenskom intervalu. Preskočeni čvorovi se ne računaju.

Zadržite pokazivač iznad grafikona kako biste vidjeli vrstu čvora ispod pokazivača, odmah pored njega. Vrsta čvora koja je premala da bi bila vidljiva pored najveće na grafikonu (ispod 1% njezine vrijednosti) izostavlja se iz tog grafikona i njegove legende. Grafikoni prate filtar workflowa, vremenski raspon i bilo koji raspon označen povlačenjem. Analitika čvorova bilježi se za pokretanja počevši od verzije koja ju je uvela, a dovršeno pokretanje pojavljuje se unutar otprilike jedne minute. Starija pokretanja se ne računaju.

## Automatsko Osvježavanje

- Omogućite automatsko osvježavanje kako biste održali metrike ažuriranima bez ručnog ponovnog učitavanja

## Povezano

- [Workflows Tab](./workflows-tab.md) – Workflows koji se mjere
- [Traces Tab](./traces-tab.md) – Detaljna inspekcija tragova
- [Logs Tab](./logs-tab.md) – Logovi tijekom izvođenja za otklanjanje grešaka
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče

Kada grafikon pokaže trend o kojem želite biti obaviješteni umjesto da ga pratite, pretvorite ga u [upozorenje](./alerts-tab.md): broj grešaka, trajanje pokretanja, LLM troškovi i broj izvršavanja mogu imati postavljenu granicu tijekom vremenskog razdoblja.
