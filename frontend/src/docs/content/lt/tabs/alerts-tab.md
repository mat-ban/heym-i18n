# Įspėjimų skirtukas

**Įspėjimų** skirtukas leidžia nustatyti slenkstines sąlygas per laiko intervalą ir gauti pranešimus, kai jos yra viršijamos. Heym jau registruoja vykdymo rezultatus, vykdymo trukmę ir LLM išlaidas, tačiau niekada to neskelbia. Įspėjimas yra būdas, kaip to paprašyti.

Kiekvienas įspėjimas vertinamas per **laiko intervalą**, kurį pasirinksite, niekada ne pagal vieną įvykį. Vienas nesėkmingas vykdymas yra triukšmas. Dvylika nesėkmingų vykdymų per dešimt minučių yra incidentas.

## Įspėjimų tipai

| Tipas | Klausimas, į kurį atsakoma | Iš kur gaunamas skaičius |
|---|---|---|
| **Klaidos slenkstis** | Ar tai nepavyko daugiau nei N kartų per intervalą? | [Vykdymo istorija](../reference/execution-history.md) su klaidos statusu |
| **Workflow trukmė** | Ar vykdymai tapo lėtesni nei tikėtasi per intervalą? | Vykdymo laikas, agreguotas kaip max, vidurkis arba 95-asis percentilis |
| **Token / USD kaina** | Ar išlaidos viršijo biudžetą per intervalą? | [LLM pėdsakai](./traces-tab.md) plius LLM kainų lentelė |
| **Vykdymo skaičius** | Ar tai vykdoma daug dažniau nei turėtų? | Vykdymo istorijos eilučių skaičius |

### Klaidos slenkstis

Skaičiuoja nesėkmingus vykdymus per intervalą ir aktyvuojasi, kai skaičius pasiekia Jūsų nustatytą slenkstį. Kadangi jis skaičiuoja per intervalą, o ne fiksuoja kiekvieną nesėkmę, vienas laikinas klaidos atvejis Jūsų neįspės.

### Workflow trukmė

Matuoja vykdymo trukmę per intervalą. Pasirinkite **max** (lėčiausias vykdymas), **vidurkis** arba **p95**. P95 skaičius naudoja tą pačią percentilės skaičiavimo metodiką kaip [Analizės skirtukas](./analytics-tab.md), todėl įspėjimas ir latencijos diagrama niekada nesutampa dėl to paties intervalo.

**Minimalus vykdymų skaičius intervale** užtikrina, kad tai būtų sąžininga. Lėčiausias vykdymas beveik tuščiame intervale yra tik tas vienas vykdymas, todėl nustatant minimalią vertę, pavyzdžiui, 3, sustabdysite įspėjimo aktyvavimą dėl triukšmo.

### Token / USD kaina

Suskaičiuoja LLM išlaidas per intervalą, tiek kaip bendrą token skaičių, tiek kaip JAV dolerius. Dolerių sumos nustatomos per tą pačią kainų lentelę, kurią naudoja [Pėdsakų skirtukas](./traces-tab.md) ir [LLM kainų lentelė](./datatable-tab.md#llm-cost-table-system-table), todėl įspėjimas dėl kainos ir kainų puslapis visada sutampa.

Kai apimtis apima visus Jūsų workflows, tai apima LLM skambučius, atliktus už workflow ribų, tokius kaip [Chat skirtukas](./chat-tab.md) ir [AI asistentas](../reference/ai-assistant.md). Kodo agentų naudojimas (Codex, OpenCode) nėra įtrauktas.

Modeliai, neturintys kainų eilutės, įspėjimo kontekste pranešami kaip neįkainoti, o ne tyliai skaičiuojami kaip nulis.

### Vykdymo skaičius

Skaičiuoja bet kokių statusų vykdymus per intervalą. Tai yra tas, kuris užfiksuoja netinkamą aktyvatorių: workflow, kuris paprastai vykdomas 20 kartų per valandą, staiga vykdomas 2,000 kartų. Įrašas apie aktyvavimą apima per aktyvatorių šaltinį pateiktą analizę, nes tai paprastai yra atsakymas į klausimą „kodėl tai įvyko“.

## Apimtis

Įspėjimas stebi arba **vieną workflow**, arba **visus Jūsų workflows**.

„Visi Jūsų workflows“ reiškia kiekvieną workflow, kurį įspėjimo savininkas gali pasiekti. Tai sąmoningai nereiškia kiekvieno workflow Heym instancijoje: įspėjimai gali būti dalijami, o dalijantis įspėjimu neturėtų būti suteikiami agreguoti skaičiai už workflows, kurių atidaryti negalima.

## Wizard

Įspėjimo kūrimas vyksta per penkis žingsnius.

1. **Tipas** — pasirinkite vieną iš keturių aukščiau.
2. **Apimtis** — vienas workflow arba visi.
3. **Sąlyga** — laiko intervalas, plius slenkstinės reikšmės tam tipui.
4. **Atsakas** — kas vyksta, kai jis aktyvuojasi, ir kaip dažnai Jums pranešama.
5. **Peržiūra** — pavadinkite jį ir peržiūrėkite atgalinį testavimą.

### Atgalinis testavimas

Peržiūros žingsnis atsako į klausimą, kuris iš tikrųjų yra svarbus prieš išsaugant: *per paskutines 24 valandas, kaip dažnai tai būtų aktyvavęsi?*

Jis praneša apie aktyvavimo skaičių ir didžiausią stebėtą vertę, palyginti su Jūsų slenksčiu. Jei jis sako, kad sąlyga būtų aktyvavusi 400 kartų, Jūs turėtumėte pataisyti slenkstį prieš išsaugodami, o ne po to, kai būsite įspėti. Galite praplėsti atgalinį laikotarpį iki 3 arba 7 dienų.

## AI projektavimas

Pirmame žingsnyje viršuje yra langelis, kuriame aprašote, ko norite paprasta kalba:

> Įspėkite mane, jei sąskaitų sinchronizavimas nepavyksta daugiau nei 5 kartus per 10 minučių

Heym tai paverčia į įspėjimo apibrėžimą, užpildo kiekvieną žingsnį, kurį gali, ir pereina prie AI užpildytų laukų, pažymėtų, kad Jūs patvirtintumėte, o ne perrašytumėte. Pilnas užklausimas nuves Jus į Peržiūrą.

**Dalinis užklausimas vis tiek leidžia Jums judėti į priekį.** Pasakykite tik „įspėkite mane, jei tai nepavyksta 5 kartus“, ir gausite klaidos slenkstį su užpildytu skaičiumi, numatytomis kitoms reikšmėms, o wizard atsidarys pirmame žingsnyje, kuris vis dar reikalauja Jūsų: tokiu atveju Apimtis, nes nebuvo paminėtas workflow. Viršuje esantis pranešimas nurodo, kas dar turi būti nuspręsta. Tai niekada neužblokuoja „Kitas“ ar „Sukurti“.

Tas pats taikoma, kai modelis nurodo workflow, kurio negalite pasiekti, arba grąžina sąlygą su trūkstamais laukais. Suprantamos dalys išlaikomos, o likusi dalis grįžta prie numatytųjų šio įspėjimo tipo, ir Jūs tai koreguojate iš ten. Nieko čia neaplenkia patikros: wizard taisyklės ir API abu dar kartą patikrina įspėjimą, kai jį išsaugote.
## Pakartotinis elgesys

Kai įspėjimas įsijungia, jis pereina į aktyvuotą būseną. Kas vyksta toliau, priklauso nuo Jūsų pasirinkimo 4 žingsnyje.

- **Pranešti vieną kartą, kol atsigaus** (numatytasis) — įsijungia vieną kartą, tada tyliai laukia, kol sąlyga išliks. Kai metrika vėl nukrenta žemiau slenksčio, įspėjimas grįžta į OK ir vėl gali įsijungti. Atsigavimas yra būsenos pokytis, o ne įvykis: jis nesukuria įsijungimo įrašo ir nevykdo notify workflow.
- **Tęsti pranešimus intervalais** — įsijungia vėl kas N minučių, kol sąlyga išliks.

Numatytasis nustatymas egzistuoja, nes sugedęs workflow, tikrinamas kas 60 sekundžių, kitaip sukurtų 60 įsijungimų per valandą, kas ir sukelia įspėjimų nutildymą.

## Workflow vykdymas įsijungus

4 žingsnis siūlo tris atsakymus į klausimą "kas turėtų nutikti, kai tai įsijungia":

- **Sukurti ir priskirti naują workflow** (numatytasis) — išsaugant įspėjimą taip pat sukuriamas workflow pavadinimu *"&lt;įspėjimo pavadinimas&gt; pranešimas"* ir jis sujungiamas. Jis atkeliauja su įvesties mazgu, kurio laukai yra tiksliai tokie, kaip žemiau pateiktas payload, todėl `$alert.body.observed_value` ir kiti laukai iš karto išsprendžiami, ir Jums tereikia prijungti mazgą, kuris perduoda žinutę. **Eiti į workflow** įspėjimo kortelėje jį atidaro. Tai yra numatytasis nustatymas, nes įspėjimas, kuris įsijungia niekur, lengvai gali būti praleistas.
- **Pasirinkti esamą workflow** — vykdyti kažką, ką jau sukūrėte.
- **Nieko nedaryti** — įsijungimas vis tiek užfiksuojamas skirtuke, tiesiog nevykdo nieko.

Įspėjimo payload atkeliauja kaip to workflow įvesties kūnas:

```json
{
  "alert_id": "...",
  "alert_name": "Sąskaitų faktūrų sinchronizavimo klaidos",
  "alert_type": "error_threshold",
  "condition": "5+ klaidų per 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Sąskaitų faktūrų sinchronizavimas", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Kuris workflow sukūrė skaičių

`workflows` yra vienintelė vieta, kur workflow pasirodo. Jis išvardija kiekvieną workflow, kuris prisidėjo prie rodmenų, kiekvienas su savo `value` — to workflow klaidų skaičius, vykdymo skaičius, lėčiausias vykdymas milisekundėmis arba išlaidos, priklausomai nuo įspėjimo tipo. Sąrašas rūšiuojamas pagal `value`, didžiausias pirmas, todėl `workflows[0]` yra blogiausias kaltininkas.

Tai **visada yra masyvas**: vieno elemento po vieno workflow srities, daug po "visi mano workflow", ir tuščias, o ne null, kai nieko negalima priskirti. Notify workflow gali jį iteruoti be formos patikrinimo.

Yra tyčia nenaudojamas vienintelis `workflow_id`. Jis apibūdina įspėjimo sritį, o ne metriką, todėl jis buvo `null` sistemos srityje, kas yra būtent ta situacija, kur "kuris workflow?" yra svarbiausia. `observed_value` lieka agreguota, su kuria buvo lyginamas slenkstis; per-workflow `value` laukai paaiškina, iš kur jis atsirado.

Taip įspėjimai pasiekia Slack, el. paštą, Telegram ar bet kur kitur: su [mazgais](../reference/node-types.md), kuriuos jau turite, o ne su atskira pranešimų sistema.

Įspėjimas negali pranešti workflow, kurį jis stebi. Tai sukurtų ciklą, ypač akivaizdu, kai kalbama apie vykdymo skaičiaus įspėjimą, kur kiekvienas pranešimas prideda prie skaičiaus, kurį jis matuoja.

Notify vykdymai yra įprasti vykdymai, todėl jie pasirodo [vykdymo istorijoje](../reference/execution-history.md) kaip ir bet kuris kitas vykdymas. Nepavykęs notify workflow užfiksuojamas įsijungime, tačiau niekada nesustabdo paties įsijungimo užfiksavimo.

Notify workflow vykdomas kaip įspėjimo savininkas, su jų kredencialais ir globaliais kintamaisiais, lyg jie patys jį būtų vykdę. Pasirinkus workflow, kurį kas nors pasidalino su Jumis, nepasiskolinate to asmens kredencialų. Jei savininkas praranda prieigą prie notify workflow, įsijungimas vis tiek užfiksuojamas, tačiau notify vykdymas praleidžiamas.

## Įsijungimo istorija

Žemiau įspėjimų sąrašo yra įsijungimo istorija: kas įsijungė, kada, stebėta vertė prieš slenkstį, tikslus langas, kuris buvo įvertintas, ir notify rezultatas.

Patvirtinus įsijungimą, pažymima eilutė ir įspėjimo ženklelis keičiasi iš **Įsijungia** į **Patvirtinta**. Tai yra pareiškimas apie Jus, o ne apie įspėjimą: sąlyga vis dar galioja, ir įspėjimas grįžta į **OK** savaime, kai metrika vėl nukrenta žemiau slenksčio.

Kiekvienas įrašas saugo prisidedančią informaciją tuo momentu, kai jis įsijungė: nesėkmingų vykdymų id ir klaidų pranešimus, per-modelio išlaidas arba trigger-source išskaidymą. Tai yra tyčia. Langas praėjo, ir vėlesnis jo perskaičiavimas gali duoti kitą atsakymą.

Įsijungimo įrašai saugomi 90 dienų.

## Klausimas Chat apie įspėjimus

[Chat skirtukas](./chat-tab.md) gali atsakyti į klausimus apie Jūsų įspėjimus:

- "Kokius įspėjimus turiu?"
- "Ar yra įspėjimas apie sąskaitų faktūrų workflow?"
- "Kodėl įsijungė išlaidų įspėjimas?"
- "Kada tai paskutinį kartą įsijungė?"

Klausimui "kodėl tai įsijungė" Chat cituoja faktinę stebėtą vertę, slenkstį ir laiko langą iš įsijungimo įrašo, kartu su prisidedančia informacija.

## Dalinimasis

Įspėjimai gali būti dalinami su individualiais vartotojais arba su [komandomis](./teams-tab.md). Žmonės, su kuriais dalinatės, gali matyti įspėjimą ir jo įsijungimo istoriją. Tik savininkas gali redaguoti, sustabdyti, ištrinti ar vėl pasidalinti juo.
### Kai pašalinamas prieigos prie workflow

Įspėjimas apie konkretų workflow nuolat skaito to workflow vykdymo metriką, todėl pašalinus kažkieno prieigą prie workflow taip pat nusprendžiama, kas nutiks jų įspėjimams:

- **Pašalinus vartotoją ar komandos bendrinimą** workflow savininkas klausia, ar taip pat sustabdyti to vartotojo ar komandos įspėjimus apie workflow. Sustabdymas yra numatytasis pasirinkimas. Sustabdyti įspėjimai yra sustabdyti, o ne ištrinti, ir kiekvienas iš jų yra užfiksuotas kaip `alert.disable_on_access_revoke` [audito žurnale](../reference/audit.md).
- **Pašalinus komandos narį arba ištrinant komandą** visada sustabdomi paveikti įspėjimai, nes asmuo, atliekantis šį pakeitimą, nebūtinai yra workflow savininkas.
- Įspėjimas yra sustabdomas tik tada, kai jo savininkas neturi jokio kito kelio prie workflow, pavyzdžiui, tiesioginio bendrinimo ar kitos komandos.
- Atkuriant arba testuojant sustabdytą įspėjimą vėl tikrinama savininko prieiga, todėl sustabdytas įspėjimas negali būti įjungtas arba naudojamas workflow metrikoms skaityti be prieigos. Paspaudus **Atkurti** be prieigos, rodomas pranešimas, paaiškinantis, kad workflow savininkas pirmiausia turi jį vėl bendrinti.

## Įspėjimų valdymas

- **Sustabdyti / Atkurti** — sustabdytas įspėjimas niekada nėra vertinamas. Atkūrimas tikrinamas iš karto, o ne laukiamas kito intervalo.
- **Redaguoti** — pakeitimai yra patvirtinami kaip visuma, todėl dalinis redagavimas negali palikti įspėjimo netinkamoje būsenoje.
- **Ištrinti** — pašalina įspėjimą ir jo iššokusių įvykių istoriją.

## Taip pat žiūrėkite

- [Analizės skirtukas](./analytics-tab.md) — diagramos, iš kurių gaunami šie slenksčiai
- [Vykdymo skirtukas](./traces-tab.md) — iš kur gaunami LLM kaštų skaičiai
- [Vykdymo istorija](../reference/execution-history.md) — vykdymai, kuriuos matuoja klaidų, trukmės ir skaičiaus įspėjimai
- [Chat skirtukas](./chat-tab.md) — įspėjimų užklausimas natūralia kalba
- [Komandos](./teams-tab.md) — įspėjimų bendrinimas su komanda
