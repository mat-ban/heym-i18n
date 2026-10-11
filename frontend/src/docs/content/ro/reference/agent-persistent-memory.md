# Memorie Persistentă a Agentului

Nodurile de agent pot păstra un **graf de cunoștințe per-nod** stocat în baza de date: entități (cu tipuri și proprietăți) și relații între ele. Când este activată, Heym **injectează un rezumat al acelui graf în system prompt** la fiecare rulare (dacă graful nu este gol). După o rulare reușită, un **job de extragere LLM** îmbină în fundal faptele noi din conversație în graf.

Sub-agenții și orchestratorii folosesc fiecare graful asociat **propriului nod de canvas** în mod implicit. De asemenea, puteți **acorda altor agenți acces de citire sau citire/scriere** la graful acestui nod (inclusiv agenți din **alte workflow-uri** pe care le dețineți) — consultați [Partajarea cu alți agenți](#sharing-with-other-agents).

## Activare

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Când este `true`, încarcă graful acestui nod în system prompt și programează extragerea post-rulare pentru graful acestui nod |
| `memoryShares` | array (opțional) | Acordă altor noduri de agent acces la graful de memorie al **acestui** nod; consultați [Partajarea](#sharing-with-other-agents) |

Activați-o din proprietățile nodului Agent (**Persistent memory (graph)**). O pictogramă roz de **creier** pe nod deschide editorul de graf atunci când memoria este activată (sau când este afișat un model).

## Editorul de graf

Dialogul redă entitățile ca un graf animat, cu forțe direcționate — cercuri colorate dimensionate după numărul de conexiuni și grupate după tipul entității — plus editare și navigare (fit view, aranjare ordonată, scurtături de tastatură). Puteți **adăuga, edita sau șterge** manual noduri și muchii; selectoarele de relație Sursă/Țintă sunt căutabile pentru grafuri cu multe entități. Selectarea unui nod afișează conexiunile sale de intrare și ieșire, fiecare fiind clicabilă pentru a sări la acel nod. Modificările se aplică doar grafului **acestui** agent (graful pentru nodul de canvas al cărui creier l-ați deschis).

## Partajarea cu alți agenți

În dialogul grafului de memorie, **Share memory with other agents** vă permite să atașați **parteneri** care pot consuma acest graf la runtime:

1. Alegeți un **workflow** (orice workflow pe care îl puteți deschide în editor).
2. Alegeți un nod de **agent** din acel workflow.
3. Setați **Read only** sau **Read & write**.

| Permisiune | Efect |
|------------|--------|
| Read only | Când rulează agentul **partener**, acest graf este îmbinat în system prompt-ul partenerului (dacă are entități). Fără extragere în acest graf din rularea partenerului. |
| Read & write | Același comportament de prompt ca la citire, iar după o finalizare **reușită** a partenerului, extragerea obișnuită de memorie poate de asemenea **îmbina în acest graf (al proprietarului)** folosind acreditările rulării partenerului. |

Partenerii sunt stocați per nod proprietar ca intrări `memoryShares` cu `peerWorkflowId` și `peerCanvasNodeId` (și `permission`). Workflow-urile mai vechi pot omite `peerWorkflowId` pentru parteneri din **același** workflow; editorul tratează acest lucru ca workflow-ul curent.

**Partajarea între workflow-uri** este rezolvată la runtime prin scanarea workflow-urilor **pe care le dețineți**. Rulările fără un context de utilizator autentificat rezolvă doar partajările definite în JSON-ul workflow-ului **curent** (același canvas).

## Comportament la runtime

### Graf propriu (`persistentMemoryEnabled`)

1. **Înainte de apelul LLM** — Dacă graful are entități, un bloc este adăugat la instrucțiunea de sistem explicând că acestea sunt fapte din rulări anterioare (pot fi incomplete; mesajul curent al utilizatorului are prioritate în caz de conflict).
2. **După o finalizare reușită** — Un job în fundal cere modelului (aceleași acreditări ca rularea agentului) JSON structurat (entități + relații). Acel payload este îmbinat în baza de date (se aplică deduplicarea și curățarea relațiilor pentru anumite tipuri, de ex. muchii de tip angajare).

### Partener care primește grafuri partajate

Când rulează un agent, sistemul găsește noduri **proprietar** (din oricare dintre workflow-urile dvs., când este posibil) ale căror `memoryShares` indică spre workflow-ul și nodul de canvas ale acestei rulări. Pentru fiecare potrivire, graful acelui proprietar este adăugat ca secțiune de **memorie partajată** în system prompt. Partenerii cu **Read & write** programează suplimentar ținte de extragere pentru workflow-ul/graful **proprietarului** când rularea reușește.

Extragerea **nu** rulează când rularea eșuează sau se termină într-o stare HITL în așteptare.

## JSON-ul workflow-ului (câmpul `data`)

Persistat pe nodul de agent ca alte setări:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` este `"read"` sau `"write"`. Omiteți `memoryShares` sau folosiți `[]` când nu există partajare.

Consultați [Workflow Structure](./workflow-structure.md) pentru forma completă a obiectului de nod.

## Resurse conexe

- [Agent Node](../nodes/agent-node.md) — Configurare completă a agentului
- [Agent Architecture](./agent-architecture.md) — Orchestrator, sub-agenți, unelte
- [Workflow Structure](./workflow-structure.md) — Formatul JSON al workflow-ului
- [Canvas Features](./canvas-features.md) — Controlul creierului și dialogul grafului
- [Traces tab](../tabs/traces-tab.md) — Observabilitatea cererilor/răspunsurilor LLM
