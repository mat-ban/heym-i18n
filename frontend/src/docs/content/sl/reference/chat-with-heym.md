# Klepet z Heym

Klepet z Heym je pomočnik, ki je zavedajoč se strani in je na voljo iz glave dokumentacije. Odpre se v osrednjem pogovornem oknu, omogoča vam izbiro poverilnice LLM in modela ter odgovarja na vprašanja z aktualno stranjo dokumentacije kot prvim kontekstom.

## Odprtje pogovornega okna

1. Odprite katero koli stran pod `/docs`
2. Kliknite **Klepet z Heym** v glavi
3. Izberite [poverilnico](../tabs/credentials-tab.md) in model
4. Postavite vprašanje o strani ali platformi

Na manjših zaslonih je sprožilec le ikona; na večjih zaslonih se prikaže celotna oznaka.

## Kakšen kontekst uporablja

- Trenutno odprta pot dokumentacije se vključi v zahtevo kot kontekstualno usmeritev
- Backend še vedno uporablja obstoječi končni točki za klepet na nadzorni plošči in orodja za iskanje dokumentacije
- Vaša pravila [Uporabnika](./user-settings.md) na ravni računa ostajajo v veljavi, ker se isti backend za klepet ponovno uporablja
- Koraki za pripravo v živo se pretakajo v mehurček asistenta pred končnim odgovorom, podobno kot pri klepetu na nadzorni plošči
- Pojasnjevalna vprašanja se prikažejo kot kartice, enako kot v [zavihku Klepet](../tabs/chat-tab.md). Ko zahteva za workflow potrebuje poverilnico, lahko izberete eno ali jo ustvarite iz kartice. Ko potrebuje podatkovno tabelo, lahko izberete eno od svojih tabel ali ustvarite novo na enak način.

Ko odprete pogovorno okno na specifičnem članku, se prikaže majhna oznaka, ki prikazuje aktivno pot dokumentacije, tako da lahko potrdite, katera stran je prioritizirana.

## Obnašanje seje

- Izbira poverilnice in modela ostane na mestu, medtem ko je pogovorno okno odprto
- Zgodovina sporočil je le za sejo in se izbriše, ko se pogovorno okno zapre
- Klik na ozadje, `Escape` in gumb za zapiranje vsi ponastavijo sejo
- **Ustavi** prekine trenutno pretakanje odgovora
- Pogovorno okno je namenoma široko in fiksne velikosti; ne ponuja preklopa v celozaslonski način

## Kdaj ga uporabiti

- Postavite nadaljnja vprašanja med branjem vozlišča ali referenčne strani
- Pojasnite razlike med funkcijami, ne da bi zapustili dokumentacijo
- Najdite pravi članek, preden odprete urejevalnik

Če želite neposredno graditi ali spreminjati workflows, uporabite [AI pomočnika](./ai-assistant.md) na strani urejevalnika.

## Sorodno

- [AI Pomočnik](./ai-assistant.md) – Klepet v urejevalniku za gradnjo workflows
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte LLM poverilnice, ki jih uporablja pogovorno okno
- [Nastavitve](./user-settings.md) – Globalna pravila uporabnika, ki se uporabljajo na AI površinah
- [Hiter začetek](../getting-started/quick-start.md) – Prvi vodnik po workflow
