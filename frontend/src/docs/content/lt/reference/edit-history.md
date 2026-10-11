# Redagavimo Istorija

Redagavimo Istorija seka išsaugotas versijas workflow. Naudokite ją, kad peržiūrėtumėte pokyčius laikui bėgant, palygintumėte versijas arba grįžtumėte prie ankstesnės būsenos.

**Pastaba:** Redagavimo Istorija skiriasi nuo [Vykdymo Istorijos](./execution-history.md). Redagavimo Istorija seka **išsaugojimus** (workflow struktūros pokyčius); Vykdymo Istorija seka **vykdymus** (ankstesnius vykdymus).

## Kur Rasti

**Redaktoriaus įrankių juosta** → **Redagavimo Istorija** (GitBranch ikona)

## Versijos

Nauja versija sukurta kiekvieną kartą, kai **Išsaugote** workflow. Sąrašas rodo:

- **Dabartinė** – Naujausia išsaugota būsena (ką matote drobėje)
- **Versija N** – Ankstesni išsaugojimai su laiko žymėmis

Versijos, kurios neturi pokyčių palyginus su ankstesne, yra paslėptos.

## Diff Peržiūra

Pasirinkite versiją, kad pamatytumėte, kas pasikeitė palyginus su dabartiniu workflow:

| Pokyčių Tipas | Aprašymas |
|---------------|-----------|
| **Mazgai**    | Pridėti, pašalinti arba modifikuoti mazgai |
| **Kraštai**   | Pridėti, pašalinti arba modifikuoti ryšiai |
| **Konfigūracija** | Workflow lygio nustatymai (autentifikacija, greičio apribojimai ir kt.) |

Išplėskite kiekvieną pokytį, kad pamatytumėte lauko lygio skirtumus (pvz., kurie mazgo parametrai pasikeitė).

## Peržiūra

Norėdami pamatyti, kaip workflow atrodė ankstesnėje versijoje, spustelėkite **Peržiūra** šalia Grąžinti.

Atidaroma tik skaitymui skirta drobė, rodanti tų mazgų ir kraštų versiją. Galite slinkti ir priartinti, kad ištirtumėte išdėstymą; iš šios peržiūros negalima atlikti jokių pakeitimų.

## Grąžinti

Norėdami atkurti ankstesnę versiją:

1. Pasirinkite norimą versiją
2. Spustelėkite **Grąžinti**
3. Patvirtinkite veiksmą
4. Dabartinis workflow pakeičiamas pasirinkta versija; puslapis perkraunamas

Grąžinimas sukuria naują "dabartinę" būseną – galite grąžinti dar kartą, jei reikia.

## Išvalyti Istoriją

Spustelėkite šiukšlių ikoną dialogo antraštėje, kad pašalintumėte visą versijų istoriją. Šio veiksmo negalima atšaukti. Dabartinis workflow lieka; tik ankstesnės versijos yra ištrinamos.

## Kada Sukuriamos Versijos

Versijos sukuriamos tik tada, kai **Išsaugote** (Ctrl/Cmd+S arba Išsaugoti mygtukas). Nepasirinkti pokyčiai nėra saugomi Redagavimo Istorijoje, kol neišsaugosite.

Agentų įgūdžių redagavimai yra įtraukti į šiuos momentinius vaizdus. Norėdami naršyti arba atkurti vieną įgūdį negrąžinant viso workflow, naudokite **Istorija** mygtuką to įgūdžio kortelėje Agentų mazgo parametrų skydelyje. Žr. [Agentų Mazgas](../nodes/agent-node.md#skill-history).

## Susiję

- [Vykdymo Istorija](./execution-history.md) – Ankstesni vykdymai ir Atnešti į Drobę
- [Workflow Struktūra](./workflow-structure.md) – Mazgo ir krašto formatas
- [Workflows Skirtukas](../tabs/workflows-tab.md) – Kurti ir valdyti workflows
