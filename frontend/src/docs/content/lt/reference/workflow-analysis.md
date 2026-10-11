# Workflow analizė

**Workflow analizė** yra kairėje pusėje esantis skydelis, kuriame laikomas vienas bendras, redaguojamas Markdown dokumentas kiekvienai darbo eigai. Naudokite jį paaiškinti, ką daro darbo eiga, ir užfiksuoti tobulinimo idėjas — leiskite AI sugeneruoti pirmąjį juodraštį už Jus.

Dokumentas yra bendrinamas: visi, kurie gali pasiekti darbo eigą, gali jį skaityti ir redaguoti. Jis saugomas kartu su darbo eiga ir automatiškai ištrinamas, kai darbo eiga ištrinama.

## Skydelio Atidarymas

1. Atidarykite darbo eigą redaktoriuje.
2. Paspauskite **Analizuoti** (žvaigždutės piktograma) redaktoriaus įrankių juostoje.
3. Skydelis atsidaro kairėje. Mazgų paletė (kairysis skydelis) susitraukia, kol jis atidarytas; pakartotinai atidarius mazgų paletę, analizės skydelis užsidaro.

Skydelis yra prieinamas tik išsaugotoms darbo eigoms. Naujoje, neišsaugotoje darbo eigoje pirmiausia išsaugokite ją.

## Dokumentas

Skydelis rodo vieną Markdown dokumentą su dviem peržiūromis, kurių pasirinkimas vykdomas paspaudus **Redaguoti** (pieštuko piktograma) ir **Peržiūrėti** (akių piktograma) mygtukus:

| Peržiūra | Paskirtis |
|----------|-----------|
| **Redaguoti** | Paprastas Markdown redaktorius (teksto sritis). |
| **Peržiūrėti** | Atvaizduotas Markdown. |

Antraštėje rodomas **paskutinis redaktorius** ir kada jis redagavo dokumentą.

### Išsaugojimas

Paspauskite **Išsaugoti**, kad išsaugotumėte savo pakeitimus. Išsaugojimas yra aktyvuotas tik tada, kai yra neišsaugotų redagavimų.

Kadangi dokumentas yra bendrinamas, išsaugojimai naudoja optimistinę konkurenciją:

- Jei kas nors kitas išsaugojo naujesnę versiją nuo tada, kai atidarėte skydelį, Jūsų išsaugojimas bus atmestas, o įspėjimas parodys kitą redaktorių.
- Tada galite pasirinkti **Perkrauti (atsisakyti mano)**, kad gautumėte serverio versiją, arba **Perrašyti**, kad priverstinai išsaugotumėte savo versiją vietoj jų.

## AI Analizė

Pasirinkite LLM **Kredencialą** ir **Modelį** skydelio viršuje (modelių sąrašas įkeliamas iš pasirinkto kredencialo — žr. [Kredencialai](../tabs/credentials-tab.md)). Tada vykdykite analizę:

- **Analizuoti mano darbo eigą** — rodomas, kai dokumentas tuščias. Jis tiesiogiai įkelia AI sugeneruotą Markdown ataskaitą į redaktorių kaip neišsaugotą juodraštį. Peržiūrėkite ir redaguokite ją, tada **Išsaugokite**.
- **Pakartotinė analizė** — rodomas, kai dokumentas jau turi turinį. Jis tiesiogiai įkelia naują ataskaitą į atskirą **peržiūrą**, palikdamas Jūsų esamą dokumentą nepaliestą. Pasirinkite **Priimti**, kad pakeistumėte redaktoriaus turinį nauja analize, arba **Atsisakyti**, kad išlaikytumėte tai, ką turėjote.

Abi veiklos pirmiausia **vykdo darbo eigą** (kai ji yra galiojanti ir vykdoma) ir įtraukia vykdymo rezultatus į analizės užklausą, todėl ataskaita atspindi, kaip darbo eiga iš tikrųjų veikia. Jei darbo eiga negali būti vykdoma, analizė vykdoma remiantis jos statine struktūra.

Sugeneruota ataskaita apima tris skyrius, eilės tvarka: **Tobulinimo sritys** (konkretūs pasiūlymai, įskaitant **saugumo** aspektą, kai darbo eiga liečia kredencialus, vartotojo įvestį, išorinius užklausimus ar duomenų atskleidimą), darbo eigos **Paskirtis** ir **Ką ji daro** (žingsnis po žingsnio perėjimas per mazgus).

**Tobulinimo sričių** skyrius visada vykdo keturis aiškius patikrinimus:

1. **Klaidų aprėptis** — jei drobėje nėra [Klaidų Apdorojimo](../nodes/error-handler-node.md) mazgo ir nėra sukonfigūruota klaidų darbo eiga, ataskaita tai pabrėžia ir rekomenduoja pridėti klaidų apdorojimą.
2. **Laikas, sutaupytas** — jei nėra nustatyto numatomo laiko, sutaupomo per vykdymą, ataskaita rekomenduoja sukonfigūruoti vieną, kad [Analitika](../tabs/analytics-tab.md) **Sutaupytas Laikas** metrika galėtų užpildyti.
3. **Tinklo mazgai** — mazgams, kurie atlieka tinklo užklausas (pvz., [HTTP](../nodes/http-node.md) ir integracijos mazgai), ataskaita rekomenduoja mazgams specifinį klaidų apdorojimą (pakartoti ir/arba tęsti klaidos atveju).
4. **Įspėjimai** — kai nėra sukonfigūruotų [įspėjimų](../tabs/alerts-tab.md) darbo eigai, ataskaita rekomenduoja nustatyti įspėjimus prieš pereinant į gamybą.

### Analizatoriaus Vykdymas Iš Ypatybių

Kai darbo eiga turi mazgus drobėje, bet dar neturi analizės dokumento, darbo eigos lygio [Ypatybių](./canvas-features.md) skydelyje pasirodo **Vykdyti Analizatorių** mygtukas (rodomas, kai jokio mazgo nėra pasirinkta). Jis atidaro šį Workflow analizės skydelį, kad galėtumėte pasirinkti kredencialą ir modelį bei sugeneruoti ataskaitą.

Kiekvienas analizės vykdymas yra įrašomas [Vykdymuose](../tabs/traces-tab.md) po **Workflow analizės** šaltiniu.

Jei LLM kredencialas nėra sukonfigūruotas, Analizuoti mygtukas yra neaktyvus — pridėkite vieną [Kredencialų Skiltyje](../tabs/credentials-tab.md).

## Susiję

- [AI Asistentas](./ai-assistant.md) — generuoti arba modifikuoti darbo eigos mazgus iš natūralios kalbos.
- [Lipnusis Užrašas](../nodes/sticky-note-node.md) — trumpiems užrašams, pritvirtintiems tiesiai ant drobės.
