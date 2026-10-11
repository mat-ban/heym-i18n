# Decizie

Nodul **Decizie** adresează întrebări tipizate unui model de decizie cu privire la starea curentă a execuției și returnează probabilități. Nu generează text. Se utilizează atunci când un workflow are nevoie de o judecată pe baza căreia poate ramifica — rutare, triaj, clasare, verificare sau blocarea unui pas care nu poate fi anulat.

Modelele de decizie (numite și modele *System One*) sunt un tip diferit de model față de un LLM. Nu există prompt, instrucțiune de sistem, temperatură sau apelare de unelte. Se trimite o **stare** împreună cu o hartă de **întrebări**, iar fiecare răspuns revine sub forma unui număr însoțit de o distribuție de probabilitate. Deoarece un răspuns constă din doar câțiva tokeni, aceste modele sunt rapide și ieftine în comparație cu solicitarea unui [LLM](./llm-node.md) de a produce JSON și cu parsarea acestuia.

Pentru generare de text, utilizați nodul [LLM](./llm-node.md). Pentru un model care apelează unelte, utilizați [Nodul Agent](./agent-node.md).

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | Răspunsul furnizorului, verbatim — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | O acreditare de tip *Decision Model*. Nu o acreditare LLM. |
| `model` | string | Numele modelului, de exemplu `jev-latest` |
| `state` | expression | Ce ar trebui să citească modelul (implicit `$input.text`) |
| `questions` | array | Rânduri de întrebări ordonate; cel puțin unul |
| `customBodyEnabled` | boolean | Trimite un corp de cerere scris manual în locul formularului |
| `customBody` | expression (JSON) | Corpul de trimis atunci când comutatorul este activat |
| `requestTimeoutSeconds` | number | Numărul maxim de secunde de așteptare (implicit: 60) |

### Stare

**Starea** este situația pe care o judecă modelul. Acceptă un șir de caractere, un obiect sau un tablou.

Un câmp care conține exact o expresie își păstrează propriul tip, astfel încât `$input` trimite obiectul în sine, nu textul acestuia. Un șablon cu o expresie în interiorul său (`Ticket: $input.text`) se rezolvă la un șir de caractere. Oferiți fiecărei întrebări suficiente informații pentru a răspunde: text sursă, identități, relații, politici și fapte curente.

## Tipuri de întrebări

Fiecare întrebare are un `id`, un `type`, `instructions` și criterii care depind de tip.

`id`-ul este modul în care workflow-ul dumneavoastră citește răspunsul. Acesta **nu este niciodată trimis modelului**, astfel încât întreaga semnificație trebuie să se regăsească în `instructions`. Scrierea `id: is_urgent` cu `instructions: "Is it?"` nu oferă modelului nimic cu care să lucreze.

### Noul

Dacă o condiție este îndeplinită. Returnează probabilitatea ca răspunsul să fie da, de la 0 la 1.

Criteriile sunt opționale: **Yes means** și **No means** descriu ce acoperă fiecare parte. O valoare apropiată de 0.5 înseamnă că modelul consideră da și nu aproximativ la fel de probabile — nu „intensitate medie”.

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Se citește cu `$triage.answers.is_urgent.noul`.

### Choice

Alege o opțiune dintr-un set pe care îl definiți. Returnează opțiunea aleasă, distribuția completă și o încredere derivată din aceasta.

Adăugați o opțiune care acoperă „niciuna dintre acestea” ori de câte ori este posibil ca nimic să nu se potrivească — modelul nu poate alege o opțiune pe care nu ați oferit-o.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Se citește cu `$triage.answers.department.choice`, `.probabilities.billing` și `.confidence`.

### Score

Evaluează starea conform unei rubrici ordonate. Returnează o valoare ponderată probabilistic care poate ajunge **între** niveluri, împreună cu legenda și distribuția.

Nivelurile sunt ordonate de la cel mai mic, minimum două și maximum zece. Fiecare nivel ar trebui să descrie o situație concretă și să fie de sine stătător.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Se citește cu `$triage.answers.frustration.score`, `.legend` și `.confidence`.

## Generare cu AI

**Generare cu AI** transformă o propoziție simplă într-un șablon de stare sugerat și un set de rânduri de întrebări. Descrieți ce doriți să fie evaluat — „triază un tichet de suport primit: cât de urgent este, ce echipă îl deține și cât de frustrat pare clientul” — și verificați rezultatul înainte de a-l adăuga la nod.

Redactarea este realizată de un LLM, astfel încât dialogul solicită o acreditare LLM. Modelul de decizie răspunde la întrebări mai târziu, atunci când rulează workflow-ul. Id-urile generate sunt deduplicate față de rândurile pe care nodul le deține deja, astfel încât generarea de două ori nu suprascrie niciodată o cheie de răspuns existentă.

Fiecare generare este înregistrată în fila [Traces](../tabs/traces-tab.md) sub sursa **Decision Questions**, alături de urmele `decision.systemone` scrise de nodul însuși în timpul execuției.
## Custom request body

Activați **Custom request body** pentru a trimite JSON scris de dumneavoastră în locul formularului. Utilizați această opțiune pentru un endpoint al cărui contract diferă de cel construit de formular.

Editorul este pre-populat din formularul curent, iar expresiile din interiorul acestuia sunt rezolvate înainte de trimiterea cererii. Cât timp opțiunea este activată, câmpul State și rândurile de întrebări sunt ignorate. Răspunsul este transmis neschimbat în ambele cazuri, astfel încât un contract diferit produce pur și simplu o structură diferită pe care expresiile dumneavoastră o pot citi.

## Output

Nodul returnează exact ceea ce a returnat furnizorul. Nimic nu este redenumit sau aplatizat.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Ramificare pe baza unui răspuns

Un nod [Switch](./switch-node.md) rutează pe opțiunea aleasă, iar un nod [Condition](./condition-node.md) poate trimite cazurile cu încredere scăzută către o persoană care le va vedea:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Un răspuns tipizat garantează structura, nu veridicitatea. Alegeți pragurile pe baza propriilor date și consecințe, în loc să copiați o valoare dintr-un exemplu.

## Acreditări

Creați o acreditare **Decision Model** în fila [Credentials](../tabs/credentials-tab.md) cu:

- **Base URL** — endpoint-ul, de exemplu `https://api.typesafe.ai`. Heym adaugă `/v1/systemone`.
- **API Key** — opțional. Endpoint-urile care nu necesită o cheie pot fi lăsate necompletate.

La editarea unei acreditări, cheia stocată este păstrată atunci când câmpul pentru cheie este lăsat necompletat; retastați-o doar pentru a o înlocui.

Aceeași acreditare poate evalua rulările de [Evals](../tabs/evals-tab.md): cu **LLM-as-Judge** selectat, alegeți-o ca judecător, iar modelul de decizie punctează fiecare răspuns în raport cu output-ul așteptat.

Heym blochează implicit cererile către adrese private și de tip loopback, astfel încât un endpoint de decizie pe care îl rulați dumneavoastră pe `localhost` sau într-un interval privat necesită `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Modelele de decizie nu apar în tabelele de prețuri LLM sincronizate de Heym, astfel încât coloana **Cost** din [Traces](../tabs/traces-tab.md) rămâne goală pentru aceste apeluri. Numărul de token-uri este totuși înregistrat, iar dumneavoastră puteți adăuga propriul preț printr-o suprascriere de preț.

## Erori

| Situație | Ce se întâmplă |
|-----------|--------------|
| Cheie API invalidă | Nodul eșuează cu un mesaj care numește acreditarea |
| Întrebare malformată | Mesajul furnizorului la nivel de câmp este preluat în eroarea nodului |
| Limitare de rată sau supraîncărcare | Nodul eșuează cu un mesaj care indică faptul că starea este tranzitorie — activați [retry](../reference/features.md) pentru acest nod pentru a o depăși |
| Id de întrebare duplicat sau gol | Nodul eșuează înainte de a fi trimisă vreo cerere |

## Resurse conexe

- [LLM Node](./llm-node.md) – Generați text în locul unei judecăți
- [Agent Node](./agent-node.md) – Colectați dovezi cu instrumente, apoi evaluați-le aici
- [Switch Node](./switch-node.md) – Rutați pe opțiunea aleasă
- [Condition Node](./condition-node.md) – Filtrați pe baza încrederii
- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Credentials](../reference/credentials.md) – Tipuri și câmpuri de acreditări
- [Traces Tab](../tabs/traces-tab.md) – Inspectați apelurile de decizie și consumul de token-uri
