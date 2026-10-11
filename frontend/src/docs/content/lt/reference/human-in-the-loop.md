# Žmogus Ciklo Viduje

Žmogus ciklo viduje (HITL) leidžia [Agent Node](../nodes/agent-node.md) prašyti patvirtinimo tam tikrais momentais, laukti žmogaus sprendimo, o tada tęsti workflow iš to paties vykdymo momentinio vaizdo.

## Ką Tai Darome

- Prideda aiškius patvirtinimo kontrolinius taškus agentui, nesukuriant atskiro patvirtinimo workflow
- Sukuria vienkartinę viešą peržiūros URL adresą adresu `/review/{token}`
- Leidžia peržiūrėtojui pasirinkti `Accept`, `Edit & Continue` arba `Refuse`
- Pažymi vykdymą kaip `pending`, kol atkeliauja sprendimas
- Tęsia sustabdytą vykdymą ir leidžia agentui tęsti po patvirtinimo
- Palaiko kelis nuoseklius HITL kontrolinius taškus toje pačioje agento vykdyme

## Agentų Konfigūracija

Įgalinkite HITL agento savybių skydelyje.

| Nustatymas | Aprašymas |
|------------|-----------|
| `hitlEnabled` | Įjungia žmogaus peržiūrą šiam agentui |
| `hitlSummary` | Patvirtinimo gairės, kada agentas turėtų prašyti žmogaus peržiūros |

HITL prideda `request_human_review` įrankį agentui. Naudokite sistemos promptą ir `hitlSummary` gaires, kad pasakytumėte agentui, kurioms veiksmams reikia patvirtinimo. Kai agentas nusprendžia, kad kontrolinis taškas reikalauja peržiūros, jis siunčia vieną Markdown peržiūros tekstą žmogui. Peržiūrėtojui skirtas santrauka generuojama iš agento prašymo vykdymo metu; jei agentas jos nepateikia, Heym sukuria ją iš Markdown turinio. V1 versijoje HITL palaiko tik teksto režimo agento išvestis, todėl negali būti derinamas su `jsonOutputEnabled`.

Dėl MCP įrankių, Heym prašo modelio interpretuoti rašytas HITL instrukcijas į vieną iš trijų patvirtinimo apimčių:

- `always` frazėms, tokioms kaip "visada", "kiekvienu atveju" arba "kiekvienam"
- `once` frazėms, tokioms kaip "kartą" arba "tik vieną kartą"
- `never` frazėms, tokioms kaip "niekada", "neprašykite" arba "jau patvirtinta"

Ši interpretacija kontroliuoja, ar pakartotiniai MCP skambučiai vėl sustabdomi, lieka patvirtinti vieną kartą, ar visiškai praleidžia žmogaus peržiūrą.

Kai HITL yra įgalintas, agentas taip pat atskleidžia antrą drobės išvesties rankeną, pažymėtą `review`. Naudokite šią šaką, kad siųstumėte laukiančią peržiūros URL adresą ir santrauką į Slack, el. paštą, žurnalus ar bet kurį kitą pranešimų srautą, kol pagrindinis vykdymas laukia žmogaus.

## Peržiūros Srautas

1. Agentas pasiekia patvirtinimo reikalaujantį žingsnį ir kviečia `request_human_review`
2. Heym sukuria viešą peržiūros prašymą ir grąžina peržiūros URL
3. Bet kurie mazgai, prijungti prie agento `review` rankenos, vykdomi iš karto su laukiančiu HITL payload
4. Workflow vykdymas pereina į `pending`
5. Peržiūrėtojas atidaro `/review/{token}` neprisijungęs
6. Peržiūrėtojas pasirenka vieną veiksmą:
   - `Accept` tęsia su originaliu Markdown
   - `Edit & Continue` tęsia su redaguotu Markdown
   - `Refuse` tęsia su `decision: "refused"` ir praleidžia tolesnį agento veiksmą
7. Heym tęsia workflow iš saugomo momentinio vaizdo ir leidžia agentui tęsti su patvirtintu Markdown kontekstu
8. Jei vėlesnis žingsnis taip pat reikalauja patvirtinimo, agentas gali dar kartą kviečiant HITL sukurti kitą laukiančią kontrolinę tašką

Peržiūros nuorodos galioja 168 valandas, jei niekas neatsako.

## Vieša Peržiūros Puslapis

Viešas peržiūros puslapis rodo:

- Workflow pavadinimą ir agento etiketę
- Automatiškai sugeneruotą peržiūrėtojo santrauką iš agento peržiūros prašymo
- Pirmiausia Markdown peržiūros tekstą, kaip pagrindinį turinį
- Redagavimo laukelį, kuris atsidaro tik po to, kai peržiūrėtojas paspaudžia `Edit`
- Gyvą Markdown peržiūrą redagavimo metu
- Veiksmų mygtukus `Accept`, `Edit & Continue` ir `Refuse`

Kai sprendimas pateikiamas, token yra užrakintas ir negali būti pakartotinai naudojamas.

## Išvestys ir Vykdymo Būsenos

Laukdami peržiūros, agento išvestis turi laukiančią payload:

```json
{
  "decision": null,
  "summary": "Peržiūrėkite klientui paruoštą atsakymą prieš jį siunčiant.",
  "draftText": "# Tikslas\n...\n\n# Planuojami Įrankių Skambučiai / Veiksmai\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Peržiūrėkite klientui paruoštą atsakymą prieš jį siunčiant.\n\n[Atidaryti peržiūros puslapį](https://example.com/review/abc123)"
}
```

Po to, kai peržiūrėtojas atsako ir workflow tęsiasi, galutinė agento išvestis apima sprendimo metaduomenis:

```json
{
  "text": "Galutinė agento išvestis po patvirtinimo ir vykdymo",
  "decision": "accepted",
  "summary": "Peržiūrėkite klientui paruoštą atsakymą prieš jį siunčiant.",
  "originalDraft": "# Tikslas\n...\n\n# Planuojami Įrankių Skambučiai / Veiksmai\n- ...",
  "requestId": "uuid"
}
```

Naudokite `$agentLabel.decision` žemiau esančiuose mazguose, kad šakotumėte pagal priimtus, redaguotus ar atmestus rezultatus.

## Drobės Peržiūros Šaka

`review` išvesties rankena yra prieinama tik tada, kai `hitlEnabled` yra įjungtas agentui.

- Ji vykdoma prieš atvykstant žmogaus sprendimui
- Ji gauna laukiančią HITL payload, įskaitant `summary`, `draftText`, `reviewUrl`, `shareText` ir `shareMarkdown`
- Ji skirta pranešimų ar perdavimo žingsniams, tokiems kaip Slack, el. paštas ar audito žurnalai
- Ji vykdoma vieną kartą kiekvienam HITL kontroliniam taškui
- Ji nebevykdoma po to, kai peržiūrėtojas atsako; tik normalus agento išvesties kelias tęsiasi atnaujinus
## Kur Tai Pasireiškia

- [Vykdymo istorija](./execution-history.md) rodo `pending` vykdymus iš karto ir saugo peržiūros URL mazgo rezultatuose
- [Portal](./portal.md) pokalbių atsakymai rodo žmogaus peržiūros nuorodą vietoj tuščio atsakymo
- Debug panelė ir istorijos dialogai rodo galutinį HITL sprendimą ir peržiūrėtą tekstą
- Peržiūros išvesties tvarkyklė gali pranešti išoriniams kanalams net kai workflow buvo aktyvuotas naudojant cron, curl ar portalų srautą
- Daugiau nei vienas HITL kontrolinis taškas naudoja tą pačią vykdymo istorijos įrašą, kuriant naują vienkartinę peržiūros nuorodą kiekvienam sustabdymui

## Dabartiniai Apribojimai

- HITL yra prieinamas tik Agent mazguose
- HITL naudoja agento teksto išvestį ir nepalaiko JSON išvesties v1 versijoje
- Sustabdytas vykdymas tęsiasi nuo saugomo workflow momentinio vaizdo, o ne nuo naujausios redaguotos workflow versijos
- Įdėtiniai sub-workflows negali patekti į laukiančią HITL būseną v1; prašykite peržiūros iš tėvo agento prieš juos iškviesdami

## Susiję

- [Agent mazgas](../nodes/agent-node.md) - Sukonfigūruokite HITL agentui
- [Agentų architektūra](./agent-architecture.md) - Kaip agentai, įrankiai, sub-agentai ir HITL dera kartu
- [Vykdymo istorija](./execution-history.md) - Tikrinkite laukiančius ir tęsiamus vykdymus
- [Lenta](../tabs/board-tab.md) - Lentos grandinės vykdymai sustabdo kortelę laukiančioje (amber) būsenoje HITL
- [Portal](./portal.md) - Vieši pokalbių srautai ir HITL peržiūros nuorodos
