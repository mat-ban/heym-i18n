# Human-in-the-Loop

Human-in-the-loop (HITL) permet que un [Node Agent](../nodes/agent-node.md) sol·liciti aprovació en moments concrets, esperi una decisió humana i després continuï el workflow des del mateix snapshot d'execució.

## Què fa

- Afegeix punts de control d'aprovació explícits a un agent sense necessitat de construir un workflow d'aprovació separat
- Crea una URL de revisió pública d'un sol ús a `/review/{token}`
- Permet que un revisor `Accepti`, `Editi i continuï` o `Refusi`
- Marca l'execució com a `pending` fins que arribi una decisió
- Reprèn l'execució pausada i permet que l'agent continuï després de l'aprovació
- Admet múltiples punts de control HITL seqüencials en una mateixa execució de l'agent

## Configuració de l'Agent

Activeu HITL al panell de propietats de l'agent.

| Configuració | Descripció |
|---------|-------------|
| `hitlEnabled` | Activa la revisió humana per a aquest agent |
| `hitlSummary` | Directrius d'aprovació sobre quan l'agent ha de sol·licitar revisió humana |

HITL afegeix una eina `request_human_review` a l'agent. Utilitzeu el system prompt i les directrius `hitlSummary` per indicar a l'agent quines accions requereixen aprovació. Quan l'agent decideix que un punt de control necessita revisió, envia un únic text de revisió en Markdown a la persona. El resum adreçat al revisor es genera a partir de la sol·licitud de l'agent en temps d'execució; si l'agent l'omet, Heym en deriva un a partir del cos en Markdown. A la v1, HITL només admet sortides d'agent en mode text, de manera que no es pot combinar amb `jsonOutputEnabled`.

Per a les eines MCP, Heym demana al model que interpreti les instruccions HITL escrites en un dels tres àmbits d'aprovació:

- `always` per a frases com "always", "on each" o "for each"
- `once` per a frases com "once" o "only one time"
- `never` per a frases com "never", "do not ask" o "already approved"

Aquesta interpretació controla si les crides MCP repetides es tornen a pausar, es mantenen aprovades una vegada o ometen completament la revisió humana.

Quan HITL està activat, l'agent també exposa un segon handle de sortida al canvas etiquetat com a `review`. Utilitzeu aquesta branca per enviar la URL de revisió pendent i el resum a Slack, correu electrònic, registres o qualsevol altre flux de notificació mentre l'execució principal espera una persona.

## Flux de revisió

1. L'agent arriba a un pas que requereix aprovació i crida `request_human_review`
2. Heym crea una sol·licitud de revisió pública i retorna una URL de revisió
3. Qualsevol Node connectat a l'handle `review` de l'agent s'executa immediatament amb el payload HITL pendent
4. L'execució del workflow passa a `pending`
5. Un revisor obre `/review/{token}` sense iniciar sessió
6. El revisor tria una acció:
   - `Accept` continua amb el Markdown original
   - `Edit & Continue` continua amb el Markdown editat
   - `Refuse` continua amb `decision: "refused"` i omet qualsevol acció posterior de l'agent
7. Heym reprèn el workflow des del snapshot emmagatzemat i permet que l'agent continuï amb el context del Markdown aprovat
8. Si un pas posterior també requereix aprovació, l'agent pot tornar a cridar HITL i crear un altre punt de control pendent

Els enllaços de revisió caduquen al cap de 168 hores si ningú respon.

## Pàgina de revisió pública

La pàgina de revisió pública mostra:

- El nom del workflow i l'etiqueta de l'agent
- Un resum del revisor generat automàticament a partir de la sol·licitud de revisió de l'agent
- El text de revisió en Markdown primer, com a contingut principal
- Una caixa d'edició que només s'obre després que el revisor faci clic a `Edit`
- Una previsualització en directe del Markdown mentre s'edita
- Botons d'acció per a `Accept`, `Edit & Continue` i `Refuse`

Un cop enviada una decisió, el token es bloqueja i no es pot reutilitzar.

## Sortides i estat d'execució

Mentre s'espera la revisió, la sortida de l'agent conté un payload pendent:

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

Després que el revisor respongui i el workflow es reprengui, la sortida final de l'agent inclou les metadades de la decisió:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Utilitzeu `$agentLabel.decision` als Nodes posteriors per ramificar segons els resultats acceptats, editats o refusats.

## Branca de revisió al canvas

L'handle de sortida `review` només està disponible quan `hitlEnabled` està activat per a un agent.

- S'executa abans que arribi la decisió humana
- Rep el payload HITL pendent, incloent-hi `summary`, `draftText`, `reviewUrl`, `shareText` i `shareMarkdown`
- Està pensat per a passos de notificació o lliurament com Slack, correu electrònic o registre d'auditoria
- S'executa una vegada per a cada punt de control HITL
- No es torna a executar després que el revisor respongui; només el camí de sortida normal de l'agent continua en reprendre's
## On apareix

- [Execution History](./execution-history.md) mostra les execucions `pending` immediatament i emmagatzema l'URL de revisió als resultats del Node
- Les respostes de xat del [Portal](./portal.md) mostren l'enllaç de revisió humana en lloc d'una resposta buida
- El panell de Debug i els diàlegs d'historial mostren la decisió final de HITL i el text revisat
- El handle de sortida de revisió pot notificar canals externs fins i tot quan el Workflow s'ha activat per cron, curl o trànsit del portal
- Diversos checkpoints de HITL reutilitzen la mateixa entrada d'historial d'execució mentre creen un nou enllaç de revisió d'un sol ús per a cada pausa

## Límits actuals

- HITL està disponible només als Nodes d'Agent
- HITL utilitza la sortida de text de l'agent i no admet sortida JSON a la v1
- Una execució en pausa es reprèn des de la instantània del Workflow emmagatzemada, no des de la darrera versió editada del Workflow
- Els sub-workflows imbricats no poden entrar en un estat HITL pendent a la v1; sol·liciteu la revisió des de l'agent pare abans de cridar-los

## Relacionat

- [Agent Node](../nodes/agent-node.md) - Configureu HITL en un agent
- [Agent Architecture](./agent-architecture.md) - Com encaixen els agents, les eines, els sub-agents i HITL
- [Execution History](./execution-history.md) - Inspeccioneu les execucions pendents i represes
- [Board](../tabs/board-tab.md) - Les execucions de la cadena del Board posen la targeta en estat pendent (ambre) a HITL
- [Portal](./portal.md) - Fluxos de xat públics i enllaços de revisió de HITL
