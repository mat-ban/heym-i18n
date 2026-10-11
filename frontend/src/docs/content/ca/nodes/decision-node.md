# Decisió

El node **Decision** planteja preguntes tipificades a un model de decisió sobre l'estat actual de l'execució i retorna probabilitats. No genera text. Utilitzeu-lo quan un workflow necessiti un judici sobre el qual pugui ramificar-se — enrutament, triatge, classificació, verificació o bloqueig d'un pas que no es pot desfer.

Els models de decisió (també anomenats models *System One*) són un tipus de model diferent d'un LLM. No hi ha prompt, ni instrucció de sistema, ni temperatura, ni crida d'eines. Envieu un **estat** més un mapa de **preguntes**, i cada resposta torna com un número amb una distribució de probabilitat al darrere. Com que una resposta només són uns quants tokens, aquests models són ràpids i econòmics en comparació amb demanar a un [LLM](./llm-node.md) que produeixi JSON i analitzar-lo.

Per a la generació de text, utilitzeu el node [LLM](./llm-node.md). Per a un model que crida eines, utilitzeu el [Node Agent](./agent-node.md).

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | La resposta del proveïdor textualment — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Una credencial de *Decision Model*. No una credencial d'LLM. |
| `model` | string | Nom del model, per exemple `jev-latest` |
| `state` | expression | Què ha de llegir el model (per defecte `$input.text`) |
| `questions` | array | Files de preguntes ordenades; com a mínim una |
| `customBodyEnabled` | boolean | Envia un cos de sol·licitud escrit a mà en lloc del formulari |
| `customBody` | expression (JSON) | El cos a enviar quan l'opció està activada |
| `requestTimeoutSeconds` | number | Segons màxims d'espera (per defecte: 60) |

### Estat

L'**Estat** és la situació que el model jutja. Accepta una cadena, un objecte o un array.

Un camp que conté exactament una expressió conserva el seu propi tipus, de manera que `$input` envia l'objecte mateix en lloc del seu text. Una plantilla amb una expressió a dins (`Ticket: $input.text`) es resol com una cadena. Proporcioneu a cada pregunta prou informació per respondre: text d'origen, identitats, relacions, polítiques i fets actuals.

## Tipus de preguntes

Cada pregunta té un `id`, un `type`, unes `instructions` i uns criteris que depenen del tipus.

L'`id` és com el vostre workflow llegeix la resposta. **Mai s'envia al model**, de manera que tot el significat ha de residir a `instructions`. Escriure `id: is_urgent` amb `instructions: "Is it?"` no dona al model res amb què treballar.

### Noul

Si una condició es compleix. Retorna la probabilitat que la resposta sigui sí, de 0 a 1.

Els criteris són opcionals: **Yes means** i **No means** descriuen què cobreix cada costat. Un valor proper a 0.5 significa que el model troba sí i no aproximadament igual de probables — no "intensitat mitjana".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Llegiu-lo amb `$triage.answers.is_urgent.noul`.

### Choice

Tria una opció d'un conjunt que definiu. Retorna l'opció triada, la distribució completa i una confiança derivada d'aquesta.

Afegiu una opció que cobreixi "cap d'aquestes" sempre que res pugui encaixar — el model no pot triar una opció que no hàgiu ofert.

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

Llegiu-lo amb `$triage.answers.department.choice`, `.probabilities.billing` i `.confidence`.

### Score

Valora l'estat segons una rúbrica ordenada. Retorna un valor ponderat per probabilitat que pot caure **entre** nivells, més la llegenda i la distribució.

Els nivells van del més baix primer, com a mínim dos i com a màxim deu. Cada nivell hauria de descriure una situació concreta i sostenir-se per si mateix.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Llegiu-lo amb `$triage.answers.frustration.score`, `.legend` i `.confidence`.
## Generar amb IA

**Generar amb IA** converteix una frase simple en una plantilla d'estat suggerida i un conjunt de files de preguntes. Descriviu què voleu que es jutgi — "classifica un tiquet d'assistència entrant: com d'urgent és, quin equip n'és responsable i com de frustrat sembla el client" — i reviseu el resultat abans d'afegir-lo al node.

L'esborrany el genera un LLM, de manera que el diàleg sol·licita una credencial d'LLM. El model de decisió respon les preguntes més endavant, quan s'executa el workflow. Els ids generats es dedupliquen respecte a les files que el node ja conté, de manera que generar dues vegades mai no sobreescriu una clau de resposta existent.

Cada generació es registra a la pestanya [Execucions](../tabs/traces-tab.md) sota la font **Decision Questions**, juntament amb les execucions `decision.systemone` que escriu el mateix node en temps d'execució.

## Cos de sol·licitud personalitzat

Activeu **Cos de sol·licitud personalitzat** per enviar el JSON que escriviu vosaltres mateixos en lloc del formulari. Utilitzeu-ho per a un endpoint el contracte del qual difereix del que construeix el formulari.

L'editor s'inicialitza a partir del formulari actual, i les expressions que conté es resolen abans d'enviar la sol·licitud. Mentre el commutador està activat, el camp State i les files de preguntes s'ignoren. La resposta es transmet sense modificar en tots dos casos, de manera que un contracte diferent simplement produeix una forma diferent perquè les vostres expressions la llegeixin.

## Sortida

El node retorna exactament el que ha retornat el proveïdor. No es canvia el nom ni s'aplana res.

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

## Ramificació segons una resposta

Un node [Switch](./switch-node.md) encamina segons l'opció triada, i un node [Condition](./condition-node.md) pot enviar els casos de baixa confiança allà on una persona els vegi:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Una resposta tipada garanteix la forma, no la veritat. Trieu llindars en funció de les vostres pròpies dades i conseqüències en lloc de copiar un número d'un exemple.

## Credencial

Creeu una credencial **Decision Model** a la pestanya [Credencials](../tabs/credentials-tab.md) amb:

- **Base URL** — l'endpoint, per exemple `https://api.typesafe.ai`. Heym hi afegeix `/v1/systemone`.
- **API Key** — opcional. Els endpoints que no necessiten cap clau es poden deixar en blanc.

En editar una credencial, es conserva la clau emmagatzemada quan el camp de la clau es deixa en blanc; torneu-la a escriure només per substituir-la.

La mateixa credencial pot jutjar execucions d'[Avaluacions](../tabs/evals-tab.md): amb **LLM-as-Judge** seleccionat, trieu-la com a jutge i el model de decisió puntua cada resposta respecte a la sortida esperada.

Heym bloqueja per defecte les sol·licituds sortints a adreces privades i de loopback, de manera que un endpoint de decisió que executeu vosaltres mateixos a `localhost` o en un rang privat necessita `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Els models de decisió no apareixen a les taules de preus d'LLM que Heym sincronitza, de manera que la columna **Cost** a [Execucions](../tabs/traces-tab.md) queda buida per a aquestes crides. Els recomptes de tokens sí que es registren, i podeu afegir el vostre propi preu amb una substitució de preus.

## Errors

| Situació | Què passa |
|-----------|--------------|
| Clau d'API no vàlida | El node falla amb un missatge que anomena la credencial |
| Pregunta mal formada | El missatge a nivell de camp del mateix proveïdor es trasllada a l'error del node |
| Límit de velocitat o sobrecàrrega | El node falla amb un missatge que indica que la condició és transitòria — activeu la [reintentació](../reference/features.md) per a aquest node per superar-la |
| Id de pregunta duplicat o buit | El node falla abans que s'enviï cap sol·licitud |

## Relacionat

- [Node LLM](./llm-node.md) – Genera text en lloc d'un judici
- [Node Agent](./agent-node.md) – Recull evidències amb eines i després jutja-les aquí
- [Node Switch](./switch-node.md) – Encamina segons l'opció triada
- [Node Condition](./condition-node.md) – Filtra segons la confiança
- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Credencials](../reference/credentials.md) – Tipus i camps de credencials
- [Pestanya Execucions](../tabs/traces-tab.md) – Inspeccioneu les crides de decisió i l'ús de tokens
