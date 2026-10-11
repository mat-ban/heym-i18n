# Šablonų skirtukas

Šablonų skirtukas leidžia jums išsaugoti, naršyti ir pakartotinai naudoti visus workflows ir atskirus mazgus. Pasidalykite kažkuo, ką sukūrėte vieną kartą, ir pritaikykite tai naujiems projektams vienu paspaudimu.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Žiūrėti šablonų demonstraciją</a></p>

## Apžvalga

Yra dviejų rūšių šablonai:

- **Workflow šablonai** — išsaugokite visą workflow (visus mazgus ir jungtis) kaip pakartotinai naudojamą pradžios tašką.
- **Mazgų šablonai** — išsaugokite vieną sukonfigūruotą mazgą (pvz., sureguliuotą LLM mazgą arba pritaikytą HTTP mazgą) pakartotiniam naudojimui skirtinguose workflows.

Perjunkite tarp dviejų naudojant **Workflows / Nodes** perjungiklį viršuje skirtuko.

Naudokite paieškos juostą, kad filtruotumėte matomus šablonus pagal pavadinimą, aprašymą, žymas ar mazgo tipą.

---

## Šablono kūrimas

### Workflow šablonas

1. Atidarykite workflow, kurį norite pasidalinti, redaktoriuje.
2. Paspauskite **Share as Template** viršutinėje įrankių juostoje.
3. Užpildykite pavadinimą, aprašymą ir pasirenkamas žymas.
4. Pasirinkite matomumą: **Everyone** (visi vartotojai) arba **Specific users** (įveskite vartotojų vardus ir/arba pasirinkite komandas).
5. Paspauskite **Share**. Žaliai pranešimas patvirtina sėkmę.

### Mazgo šablonas

1. Dešiniuoju pelės mygtuku spustelėkite bet kurį mazgą drobėje.
2. Pasirinkite **Share as Template** iš kontekstinio meniu.
3. Užpildykite formą ir paspauskite **Share**.

---

## Šablono naudojimas

### Workflow šablonas

1. Atidarykite **Templates** skirtuką ir įsitikinkite, kad pasirinktas **Workflows**.
2. Paspauskite kortelę, kad ją peržiūrėtumėte, arba tiesiog paspauskite **Use**.
3. Workflow bus nukopijuotas į naują workflow, kuris atsidarys redaktoriuje.

### Mazgo šablonas

1. Atidarykite **Templates** skirtuką ir pasirinkite **Nodes**.
2. Paspauskite **Use** ant mazgo šablono kortelės.
3. Atsiranda dialogas — pasirinkite, kur pridėti mazgą:
   - **New workflow** — sukuria naują workflow, kuriame yra tik šis mazgas.
   - **Existing workflow** — pasirinkite iš savo workflow sąrašo; mazgas bus automatiškai įterptas, kai atsidarys redaktorius.

---

## Peržiūra

Paspauskite bet kurią šablono kortelę, kad atidarytumėte pilną peržiūrą:

- **Kortelių miniatiūros** — šablonų kortelės rodo pritaikytą tik skaitymui skirtą drobės nuotrauką tiek workflows, tiek vieno mazgo šablonams.
- **Workflow šablonai** — tik skaitymui skirta drobė, atitinkanti redagavimo istorijos peržiūros stilių, įskaitant panoramavimą ir priartinimą.
- **Mazgų šablonai** — išsaugotas mazgas atsidaro toje pačioje tik skaitymui skirtoje drobėje kaip vieno mazgo peržiūra.
- **Mazgo detalės** — paspauskite bet kurį mazgą peržiūroje, kad patikrintumėte jo išsaugotą konfigūraciją šoniniame pane.
- Žymos, naudojimo skaičius ir **savininkas** rodomi visiems šablonams.

Paspauskite **ESC** arba spustelėkite už jos ribų, kad uždarytumėte peržiūrą.

---

## Šablonų valdymas

- **Redaguoti** – Jei esate šablono savininkas, užveskite pelę ant kortelės ir spustelėkite pieštuko ikoną, kad atnaujintumėte jos pavadinimą, aprašymą, žymas ar matomumą.
- **Ištrinti** – Jei esate šablono savininkas, užveskite pelę ant kortelės ir ištrinkite šabloną po patvirtinimo pranešimo.
- **Savininko veiksmai** – Redagavimo ir ištrynimo valdikliai rodomi tik tiems šablonams, kuriuos sukūrėte.

---

## Komandų paletė (CTRL+K)

Šablonai (tiek workflow, tiek mazgų) yra ieškomi iš **CTRL+K** komandų paletės. Pasirinkite šabloną, kad jį naudotumėte iš karto — workflow šablonai atsidaro redaktoriuje, mazgų šablonai prašo nurodyti paskirties vietą.

---

## Šablonai pokalbyje

Galite užduoti AI klausimų apie savo šablonus — jis žino visus šablonus jūsų darbo erdvėje.

---

## Matomumas

| Nustatymas | Kas gali matyti |
|---|---|
| Everyone | Visi vartotojai platformoje |
| Specific users | Vartotojai, kuriuos nurodote vardu ir/arba pasirinktos komandos — visi komandos nariai gauna prieigą |

Dalindamiesi su **Specific users**, galite pridėti tiek individualius vartotojus (pagal vardą), tiek komandas. Komandos nariai mato šabloną Šablonų skirtuke ir gali jį naudoti.

---

## Susiję

- [Teams](../reference/teams.md) – Pasidalykite šablonais su komandomis
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Trumpas puslapio vadovas dėl valdymo skydelių
