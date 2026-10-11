# Human-in-the-Loop

Human-in-the-loop (HITL) permite unui [nod Agent](../nodes/agent-node.md) să solicite aprobare în momente specifice, să aștepte decizia unei persoane, apoi să continue workflow-ul din același snapshot de execuție.

## Ce face

- Adaugă puncte de verificare explicite pentru aprobare unui agent, fără a construi un workflow separat de aprobare
- Creează un URL public de revizuire de unică folosință la `/review/{token}`
- Permite unui revizor să aleagă `Accept`, `Edit & Continue` sau `Refuse`
- Marchează execuția ca `pending` până când sosește o decizie
- Reia execuția întreruptă și permite agentului să continue după aprobare
- Suportă mai multe puncte de verificare HITL secvențiale în aceeași rulare a agentului

## Configurarea agentului

Activați HITL în panoul de proprietăți al agentului.

| Setare | Descriere |
|---------|-------------|
| `hitlEnabled` | Activează revizuirea umană pentru acest agent |
| `hitlSummary` | Instrucțiuni de aprobare pentru momentul în care agentul ar trebui să solicite revizuire umană |

HITL adaugă un instrument `request_human_review` agentului. Utilizați system prompt-ul și instrucțiunile `hitlSummary` pentru a indica agentului ce acțiuni necesită aprobare. Când agentul decide că un punct de verificare necesită revizuire, acesta trimite un singur text de revizuire în format Markdown către persoană. Rezumatul destinat revizorului este generat din cererea agentului la momentul execuției; dacă agentul îl omite, Heym derivă unul din corpul Markdown. În v1, HITL suportă doar ieșiri de agent în mod text, deci nu poate fi combinat cu `jsonOutputEnabled`.

Pentru instrumentele MCP, Heym solicită modelului să interpreteze instrucțiunile HITL scrise într-unul din trei domenii de aprobare:

- `always` pentru expresii precum „always", „on each" sau „for each"
- `once` pentru expresii precum „once" sau „only one time"
- `never` pentru expresii precum „never", „do not ask" sau „already approved"

Această interpretare controlează dacă apelurile MCP repetate se întrerup din nou, rămân aprobate o singură dată sau omit complet revizuirea umană.

Când HITL este activat, agentul expune și un al doilea handle de ieșire pe canvas etichetat `review`. Utilizați acea ramură pentru a trimite URL-ul de revizuire în așteptare și rezumatul către Slack, email, logging sau orice alt flux de notificare, în timp ce execuția principală așteaptă o persoană.

## Fluxul de revizuire

1. Agentul ajunge la un pas care necesită aprobare și apelează `request_human_review`
2. Heym creează o cerere publică de revizuire și returnează un URL de revizuire
3. Orice noduri conectate la handle-ul `review` al agentului rulează imediat cu payload-ul HITL în așteptare
4. Execuția workflow-ului trece în starea `pending`
5. Un revizor deschide `/review/{token}` fără a se autentifica
6. Revizorul alege una dintre acțiuni:
   - `Accept` continuă cu Markdown-ul original
   - `Edit & Continue` continuă cu Markdown-ul editat
   - `Refuse` continuă cu `decision: "refused"` și omite acțiunile ulterioare ale agentului
7. Heym reia workflow-ul din snapshot-ul stocat și permite agentului să continue cu contextul Markdown aprobat
8. Dacă un pas ulterior necesită și el aprobare, agentul poate apela din nou HITL și poate crea un alt punct de verificare în așteptare

Linkurile de revizuire expiră după 168 de ore dacă nimeni nu răspunde.

## Pagina publică de revizuire

Pagina publică de revizuire afișează:

- Numele workflow-ului și eticheta agentului
- Un rezumat al revizorului generat automat din cererea de revizuire a agentului
- Textul de revizuire în format Markdown mai întâi, ca conținut principal
- O casetă de editare care se deschide doar după ce revizorul face clic pe `Edit`
- O previzualizare Markdown în timp real în timpul editării
- Butoane de acțiune pentru `Accept`, `Edit & Continue` și `Refuse`

Odată ce o decizie este trimisă, token-ul este blocat și nu mai poate fi reutilizat.

## Ieșiri și starea execuției

În timpul așteptării revizuirii, ieșirea agentului conține un payload în așteptare:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

După ce revizorul răspunde și workflow-ul se reia, ieșirea finală a agentului include metadatele deciziei:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Utilizați `$agentLabel.decision` în nodurile din aval pentru a ramifica pe rezultatele accepted, edited sau refused.

## Ramura de revizuire pe canvas

Handle-ul de ieșire `review` este disponibil doar când `hitlEnabled` este activat pentru un agent.

- Rulează înainte ca decizia umană să sosească
- Primește payload-ul HITL în așteptare, inclusiv `summary`, `draftText`, `reviewUrl`, `shareText` și `shareMarkdown`
- Este destinat pașilor de notificare sau predare, precum Slack, email sau logging de audit
- Rulează o dată pentru fiecare punct de verificare HITL
- Nu rulează din nou după ce revizorul răspunde; doar calea normală de ieșire a agentului continuă la reluare
## Unde apare

- [Istoricul execuțiilor](./execution-history.md) afișează imediat execuțiile `pending` și stochează URL-ul de revizuire în rezultatele nodului
- Răspunsurile din chat-ul [Portalului](./portal.md) afișează linkul de revizuire umană în locul unui răspuns gol
- Panoul de depanare și dialogurile de istoric afișează decizia finală HITL și textul revizuit
- Mânerul de ieșire pentru revizuire poate notifica canale externe chiar și atunci când workflow-ul a fost declanșat prin cron, curl sau trafic din portal
- Mai multe puncte de control HITL reutilizează aceeași intrare din istoricul execuțiilor, creând în același timp un link de revizuire unic pentru fiecare pauză

## Limitări actuale

- HITL este disponibil doar pe nodurile Agent
- HITL utilizează ieșirea text a agentului și nu acceptă ieșire JSON în v1
- O execuție pusă în pauză se reia din snapshot-ul stocat al workflow-ului, nu din cea mai recentă versiune editată a workflow-ului
- Sub-workflow-urile imbricate nu pot intra într-o stare HITL pending în v1; solicitați revizuirea de la agentul părinte înainte de a le apela

## Resurse conexe

- [Nodul Agent](../nodes/agent-node.md) - Configurați HITL pe un agent
- [Arhitectura agenților](./agent-architecture.md) - Cum se integrează agenții, instrumentele, sub-agenții și HITL
- [Istoricul execuțiilor](./execution-history.md) - Inspectați execuțiile pending și reluate
- [Board](../tabs/board-tab.md) - Execuțiile în lanț din Board pun cardul în pauză într-o stare pending (chihlimbar) la HITL
- [Portal](./portal.md) - Fluxuri publice de chat și linkuri de revizuire HITL
