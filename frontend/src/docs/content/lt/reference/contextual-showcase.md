# Kontekstinis Pavyzdys

**Kontekstinis Pavyzdys** yra lengvas vidinės programos gidas, kuris paaiškina, kurioje puslapio dalyje esate, nesukeldamas poreikio iš karto pereiti į visą dokumentacijos srautą.

## Kas Jis Daro

- Rodo trumpą santrauką apie dabartinį puslapį
- Laiko pirmąjį sluoksnį glaustą, kad nebūtumėte perkrauti informacija
- Leidžia išplėsti nedidelį papildomų detalių kiekį tik tada, kai to reikia
- Nuorodos į visą dokumentacijos puslapį gilesniam skaitymui

## Kur Jis Pasirodo

1 versijoje pavyzdys yra prieinamas Heym autentifikuotose pagrindinėse paviršiuose:

- Valdymo skydelio skirtukai
- [Vertinimai](../tabs/evals-tab.md)
- [Dokumentacija](../getting-started/introduction.md)
- Workflow redaktoriaus drobė

Viešieji puslapiai, tokie kaip prisijungimas, registracija, pokalbių portalas ir HITL peržiūra, nepateikia pavyzdžio.

## Prieiga

### Darbalaukis

- Fiksuotas **Puslapio Gido** triggeris pasirodo dešinėje ekrano pusėje
- Pavyzdys atsidaro kaip dešinės pusės stalčius
- Pagal numatytuosius nustatymus jis lieka uždarytas
- Vienkartinis teaseris padeda atskleisti, kad gidas egzistuoja, nesukeldamas poreikio jį atidaryti

### Mobilusis

- Tas pats turinys yra prieinamas iš plūduriuojančio **Puslapio Gido** mygtuko
- Jis atsidaro apatiniame lape, o ne dešinėje pusėje

## Turinys

Kiekvienas pavyzdžio įrašas naudoja struktūrizuotą apibrėžimą, o ne visiškai pritaikytą komponentą.

- **Pavadinimas** – Kas yra šis puslapis
- **Santrauka** – Vienas trumpas paaiškinimas
- **Taškai** – Keletas skaitomų užuominų
- **Išskirtiniai bruožai** – Mažos kortelės pagrindinėms vertėms ar naudojimo modeliams
- **Daugiau Detalių** – Suskleistos sekcijos papildomam kontekstui
- **Veiksmai** – Paprastai viena ar dvi nuorodos, dažniausiai į visą dokumentaciją

Tai išlaiko sistemą lanksčią, vengiant ilgų, triukšmingų pagalbos panelių.

## Konteksto Sąmoningumas

Pavyzdys keičiasi priklausomai nuo dabartinio paviršiaus.

- Valdymo skydelio skirtukai kiekvienas turi savo santrauką
- Redaktorius nurodo [Drobės Bruožus](./canvas-features.md)
- Dokumentacijos puslapis naudoja bendrą dokumentacijos apžvalgą ir, kai įmanoma, nurodo dabartinį straipsnį, kurį jau turite atidarytą

## Išlaikymas

Pavyzdys saugo nedidelį asmeninį UI būseną naršyklės saugykloje:

- Ar panelė ar lapas buvo paskutinį kartą atidaryti
- Kurie puslapio kontekstai jau parodė teaserį
- Paskutinė išplėsta detalių sekcija pagal kontekstą

## Kodėl Jis Egzistuoja

Tikslas yra padaryti Heym lengviau išmokstamą, nepridedant daugiau sunkių UI elementų.

- Trumpas, visada šalia esantis gidas orientacijai
- Aiškus kelias į gilesnę dokumentaciją
- Mažas trukdymas patyrusiems vartotojams

## Susiję

- [Workflow Skirtukas](../tabs/workflows-tab.md) – Pagrindinė valdymo skydelio paviršius
- [Vertinimų Skirtukas](../tabs/evals-tab.md) – Vertinimo workflow
- [Drobės Bruožai](./canvas-features.md) – Redaktoriaus elgesys ir derinimas
- [Greitas Stalčius](./quick-drawer.md) – Kitas fiksuotas dešinės pusės naudingas paviršius
