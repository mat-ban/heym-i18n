# Kontekstualna Predstavitev

**Kontekstualna predstavitev** je lahka vodilna funkcija v aplikaciji, ki pojasnjuje stran, na kateri se trenutno nahajate, brez takojšnjega prehoda v celoten dokumentacijski tok.

## Kaj Počuje

- Prikazuje kratek povzetek trenutne strani
- Ohranja prvo plast jedrnato, da vas ne preobremeni
- Omogoča razširitev majhnega dodatnega podrobnosti le, kadar je to potrebno
- Povezuje na celotno stran dokumentacije za poglobljeno branje

## Kje Se Pojavi

V različici 1 je predstavitev na voljo na avtenticiranih glavnih površinah Heym:

- Zavihek nadzorne plošče
- [Vrednotenja](../tabs/evals-tab.md)
- [Dokumentacija](../getting-started/introduction.md)
- Platno urejevalnika workflow

Javne strani, kot so prijava, registracija, portal za klepet in HITL pregled, ne prikazujejo predstavitve.

## Dostop

### Namizje

- Fiksni **Vodič po Strani** se prikaže na desnem robu zaslona
- Predstavitev se odpre kot desni predal
- Privzeto ostane zaprta
- Enkratni namig pomaga razkriti, da vodič obstaja, ne da bi ga prisilil, da se odpre

### Mobilno

- Enaka vsebina je na voljo iz plavajočega gumba **Vodič po Strani**
- Odpre se v spodnjem listu namesto na desni strani

## Model Vsebine

Vsak vnos v predstavitvi uporablja strukturirano definicijo namesto popolnoma prilagojene komponente.

- **Naslov** – Kaj je ta stran
- **Povzetek** – Ena kratka razlaga
- **Točke** – Nekaj skenabilnih namigov
- **Poudarki** – Majhne kartice za ključne vrednosti ali vzorce uporabe
- **Več Podrobnosti** – Zloženi odseki za dodatni kontekst
- **Dejanja** – Običajno ena ali dve povezavi, najpogosteje do celotne dokumentacije

To ohranja sistem fleksibilen, hkrati pa se izogiba dolgim, hrupnim pomočnim panelom.

## Zavedanje o Kontekstu

Predstavitev se spreminja glede na trenutno površino.

- Zavihek nadzorne plošče ima vsak svoj povzetek
- Urejevalnik se nanaša na [Funkcije Platna](./canvas-features.md)
- Stran dokumentacije uporablja splošni pregled dokumentacije in, kadar je to mogoče, kaže na trenutni članek, ki ga že imate odprtega

## Trajnost

Predstavitev shranjuje majhno količino osebnega stanja uporabniškega vmesnika v shrambo brskalnika:

- Ali je bil panel ali list nazadnje odprt
- Kateri konteksti strani so že prikazali namig
- Zadnji razširjeni odsek podrobnosti za vsak kontekst

## Zakaj Obstaja

Cilj je olajšati učenje Heym brez dodajanja težke uporabniške površine.

- Kratke, vedno prisotne smernice za orientacijo
- Jasna pot do globlje dokumentacije
- Nizka prekinitev za izkušene uporabnike

## Sorodno

- [Zavihek Workflows](../tabs/workflows-tab.md) – Glavna površina nadzorne plošče
- [Zavihek Vrednotenja](../tabs/evals-tab.md) – Workflow vrednotenja
- [Funkcije Platna](./canvas-features.md) – Obnašanje in odpravljanje napak v urejevalniku
- [Hiter Predal](./quick-drawer.md) – Druga fiksna desna utilitarna površina
