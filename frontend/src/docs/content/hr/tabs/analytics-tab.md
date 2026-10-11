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
- **Povucite za odabir** – Kliknite i povucite na bilo kojem grafikonu da fokusirate prilagođeni raspon datuma
- **Način odabira** – Odabrani rasponi osvježavaju sažetak kartica, grafikone i tablice workflow-a bez promjene osnovnog unaprijed postavljenog
- **Očisti odabir** – Vratite se na unaprijed postavljeno vremensko razdoblje kada završite s istraživanjem

## Automatsko Osvježavanje

- Omogućite automatsko osvježavanje kako biste održali metrike ažuriranima bez ručnog ponovnog učitavanja

## Povezano

- [Workflows Tab](./workflows-tab.md) – Workflows koji se mjere
- [Traces Tab](./traces-tab.md) – Detaljna inspekcija tragova
- [Logs Tab](./logs-tab.md) – Logovi tijekom izvođenja za otklanjanje grešaka
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče

Kada grafikon pokaže trend o kojem želite biti obaviješteni umjesto da ga pratite, pretvorite ga u [upozorenje](./alerts-tab.md): broj grešaka, trajanje pokretanja, LLM troškovi i broj izvršavanja mogu imati postavljenu granicu tijekom vremenskog razdoblja.
