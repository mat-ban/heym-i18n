# Pestanya Alertes

La pestanya **Alertes** us permet definir condicions llindar sobre una finestra temporal i rebre avisos quan es creuen. Heym ja registra els resultats d'execució, la durada de les execucions i la despesa en LLM, però no ho comparteix mai per iniciativa pròpia. Una alerta és la manera de demanar-ho.

Cada alerta s'avalua sobre una **finestra temporal** que trieu, mai sobre un esdeveniment aïllat. Una execució fallida és soroll. Dotze execucions fallides en deu minuts és un incident.

## Tipus d'alerta

| Tipus | La pregunta que respon | D'on surt el número |
|---|---|---|
| **Llindar d'errors** | Ha fallat més de N vegades a la finestra? | Files de [l'historial d'execucions](../reference/execution-history.md) amb estat d'error |
| **Durada del Workflow** | Les execucions s'han alentit més del previst a la finestra? | Temps d'execució, agregat com a màxim, mitjana o percentil 95 |
| **Cost en Tokens / USD** | La despesa ha superat un pressupost a la finestra? | [Traces d'LLM](./traces-tab.md) més la taula de costos d'LLM |
| **Recompte d'execucions** | S'ha executat molt més sovint del que hauria? | Recompte de files de l'historial d'execucions |

### Llindar d'errors

Compta les execucions fallides durant la finestra i s'activa quan el recompte arriba al vostre llindar. Com que compta sobre una finestra en lloc d'enganxar-se a cada fallada, un error transitori aïllat no us enviarà cap avís.

### Durada del Workflow

Mesura la durada de les execucions dins la finestra. Trieu **max** (l'execució més lenta), **mitjana** o **p95**. La xifra p95 utilitza el mateix càlcul de percentils que la [pestanya Analytics](./analytics-tab.md), de manera que l'alerta i el gràfic de latència mai no discrepen sobre la mateixa finestra.

**Execucions mínimes a la finestra** manté això honest. L'execució més lenta en una finestra gairebé buida és només aquella execució, així que establir un mínim de, per exemple, 3 evita que l'alerta s'activi per soroll.

### Cost en Tokens / USD

Suma la despesa en LLM durant la finestra, ja sigui com a total de tokens o com a dòlars nord-americans. Els imports en dòlars es resolen mitjançant la mateixa taula de preus que utilitzen la [pestanya Traces](./traces-tab.md) i la [Taula de costos d'LLM](./datatable-tab.md#llm-cost-table-system-table), de manera que una alerta de cost i la pàgina de costos sempre coincideixen.

Quan l'abast és tots els vostres Workflows, això inclou les crides a LLM fetes fora d'un Workflow, com ara la [pestanya Chat](./chat-tab.md) i l'[Assistent d'IA](../reference/ai-assistant.md). L'ús d'agents de codificació (Codex, OpenCode) no s'inclou.

Els models sense fila de preus es reporten al context de l'alerta com a no preuats en lloc de comptar-se silenciosament com a zero.

### Recompte d'execucions

Compta les execucions de qualsevol estat dins la finestra. Aquesta és la que detecta un Trigger espatllat: un Workflow que normalment s'executa 20 vegades per hora que de sobte s'executa 2.000 vegades. El registre d'activació inclou un desglossament per font de Trigger, perquè normalment aquesta és la resposta a "per què ha passat això".

## Abast

Una alerta vigila **un Workflow** o **tots els vostres Workflows**.

"Tots els vostres Workflows" significa tots els Workflows als quals el propietari de l'alerta pot accedir. Deliberadament no significa tots els Workflows de la instància de Heym: les alertes es poden compartir, i compartir una alerta no hauria de donar a algú números agregats de Workflows que no pot obrir.

## L'assistent

Crear una alerta recorre cinc passos.

1. **Tipus** — trieu un dels quatre anteriors.
2. **Abast** — un Workflow, o tots.
3. **Condició** — la finestra temporal, més els camps de llindar per a aquell tipus.
4. **Resposta** — què s'executa quan s'activa, i amb quina freqüència continuar avisant-vos.
5. **Revisió** — poseu-li nom i vegeu la prova retrospectiva.

### La prova retrospectiva

El pas de Revisió respon la pregunta que realment importa abans de desar: *durant les últimes 24 hores, quantes vegades s'hauria activat això?*

Reporta el recompte d'activacions i el valor més alt observat respecte al vostre llindar. Si diu que la condició s'hauria activat 400 vegades, corregiu el llindar abans de desar en lloc de després de rebre avisos. Podeu ampliar el període de retrospectiva a 3 o 7 dies.

## Esborrany amb IA

A la part superior del primer pas hi ha un quadre on descriviu el que voleu en llenguatge planer:

> Avisa'm si la sincronització de factures falla més de 5 vegades en 10 minuts

Heym ho converteix en una definició d'alerta, omple cada pas que pot i avança amb els camps omplerts per IA marcats, de manera que confirmeu en lloc de tornar a escriure. Una sol·licitud completa us porta a Revisió.

**Una sol·licitud parcial encara us fa avançar.** Digueu només "avisa'm si falla 5 vegades" i obteniu una alerta de llindar d'errors amb el recompte omplert, valors per defecte per a la resta, i l'assistent s'obre al primer pas que encara us necessita: en aquest cas Abast, perquè no s'ha nomenat cap Workflow. Una nota a la part superior indica què queda per decidir. Mai no bloqueja Següent ni Crear.

El mateix s'aplica quan el model nomena un Workflow al qual no podeu accedir, o retorna una condició amb camps que falten. Les parts que tenen sentit es conserven, la resta torna als valors per defecte d'aquell tipus d'alerta, i ajusteu a partir d'aquí. Res d'això no eludeix la validació: les regles pròpies de l'assistent i l'API tornen a verificar l'alerta quan la deseu.
## Comportament de repetició

Un cop s'activa una alerta, entra en estat d'activació. El que passa després és la vostra elecció al pas 4.

- **Notificar una vegada, fins que es recuperi** (el valor per defecte) — s'activa una vegada i després roman en silenci mentre es manté la condició. Quan la mètrica torna a baixar per sota del llindar, l'alerta torna a OK i esdevé elegible per activar-se de nou. La recuperació és un canvi d'estat, no un esdeveniment: no crea un registre d'activació ni executa el Workflow de notificació.
- **Continuar notificant a intervals** — s'activa de nou cada N minuts mentre es mantingui la condició.

El valor per defecte existeix perquè un Workflow trencat comprovat cada 60 segons produiria, d'altra manera, 60 activacions per hora, que és com les alertes acaben silenciades.

## Executar un Workflow en activar-se

El pas 4 ofereix tres respostes a "què hauria de passar quan s'activi":

- **Crear i assignar un Workflow nou** (el valor per defecte) — desar l'alerta també crea un Workflow anomenat *"&lt;nom de l'alerta&gt; notification"* i l'enllaça. Arriba amb un Node d'entrada els camps del qual són exactament el Payload següent, de manera que `$alert.body.observed_value` i la resta es resolen immediatament i només cal adjuntar el Node que lliura el missatge. **Go to workflow** a la targeta de l'alerta l'obre. Aquest és el valor per defecte perquè una alerta que s'activa cap enlloc és fàcil de passar per alt.
- **Triar un Workflow existent** — executar alguna cosa que ja hàgiu construït.
- **No fer res** — l'activació encara es registra a la pestanya, simplement no executa res.

El Payload de l'alerta arriba com el cos d'entrada d'aquest Workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Quin Workflow ha produït el número

`workflows` és l'únic lloc on apareix un Workflow. Llista cada Workflow que ha contribuït a la lectura, cadascun amb el seu propi `value` — el recompte d'errors d'aquest Workflow, el recompte d'execucions, l'execució més lenta en mil·lisegons o la despesa, segons el tipus d'alerta. La llista està ordenada per `value`, de més alt a més baix, de manera que `workflows[0]` és el pitjor infractor.

És **sempre un array**: d'un sol element sota l'àmbit d'un Workflow, de molts elements sota "all my workflows", i buit en lloc de null quan no hi ha res atribuïble. Un Workflow de notificació pot iterar-lo sense cap comprovació de forma.

Deliberadament no hi ha cap `workflow_id` en singular. Descrivia l'àmbit de l'alerta en lloc de la mètrica, de manera que era `null` sota l'àmbit de sistema, que és exactament el cas on "quin Workflow?" importa més. `observed_value` continua sent l'agregat amb què es va comparar el llindar; els camps `value` per Workflow expliquen d'on prové.

Així és com les alertes arriben a Slack, correu electrònic, Telegram o a qualsevol altre lloc: amb els [Nodes](../reference/node-types.md) que ja teniu, en lloc d'un sistema de notificació separat.

Una alerta no pot notificar el Workflow que està vigilant. Això seria un bucle, de manera més òbvia per a una alerta de recompte d'execucions on cada notificació se suma al recompte que mesura.

Les execucions de notificació són execucions ordinàries, de manera que apareixen a l'[historial d'execucions](../reference/execution-history.md) com qualsevol altra execució. Un Workflow de notificació que falla es registra a l'activació, però mai impedeix que l'activació mateixa es registri.

Un Workflow de notificació s'executa com el propietari de l'alerta, amb les seves credencials i variables globals, exactament com si les hagués executat ell mateix. Triar un Workflow que algú us ha compartit no manlleva les credencials d'aquesta persona. Si el propietari perd l'accés al Workflow de notificació, l'activació encara es registra, però l'execució de notificació s'omet.

## Historial d'activacions

Sota la llista d'alertes hi ha l'historial d'activacions: què s'ha activat, quan, el valor observat respecte del llindar, la finestra exacta que s'ha avaluat i el resultat de la notificació.

Reconèixer una activació marca la fila i canvia la insígnia de l'alerta de **Firing** a **Acknowledged**. Això és una declaració sobre vosaltres, no sobre l'alerta: la condició encara es manté, i l'alerta torna a **OK** per si sola quan la mètrica torna a baixar per sota del llindar.

Cada registre emmagatzema el detall contribuent en el moment en què es va activar: ids d'execucions fallides i missatges d'error, despesa per model o el desglossament per font de Trigger. Això és deliberat. La finestra ha passat, i recalcular-la més tard pot donar una resposta diferent.

Els registres d'activació es conserven durant 90 dies.

## Preguntar al Xat sobre les alertes

La [pestanya de Xat](./chat-tab.md) pot respondre preguntes sobre les vostres alertes:

- "Quines alertes tinc?"
- "Hi ha alguna alerta al Workflow de factures?"
- "Per què s'ha activat l'alerta de costos?"
- "Quan s'ha activat això per última vegada?"

Per a una pregunta de "per què s'ha activat", el Xat cita el valor observat real, el llindar i la finestra temporal del registre d'activació, juntament amb el detall contribuent.

## Compartir

Les alertes es poden compartir amb usuaris individuals o amb [equips](./teams-tab.md). Les persones amb qui les compartiu poden veure l'alerta i el seu historial d'activacions. Només el propietari pot editar-la, posar-la en pausa, eliminar-la o tornar-la a compartir.
### Quan es revoca l'accés al workflow

Una alerta sobre un únic workflow continua llegint les mètriques d'execució d'aquest workflow, de manera que revocar l'accés d'algú al workflow també determina què passa amb les seves alertes sobre aquest:

- **Revocar la compartició amb un usuari o un equip** pregunta al propietari del workflow si també vol aturar les alertes d'aquest usuari o equip sobre el workflow. L'opció predeterminada és aturar-les. Les alertes aturades es posen en pausa, no s'eliminen, i cadascuna es registra com a `alert.disable_on_access_revoke` al [registre d'auditoria](../reference/audit.md).
- **Eliminar un membre d'un equip o suprimir un equip** sempre atura les alertes afectades, perquè la persona que fa aquest canvi no és necessàriament el propietari del workflow.
- Una alerta només s'atura quan el seu propietari no té cap altre camí d'accés al workflow, com ara una compartició directa o un altre equip.
- Reprendre o provar una alerta en pausa torna a comprovar l'accés del propietari, de manera que una alerta aturada no es pot tornar a activar ni es pot fer servir per llegir les mètriques del workflow sense accés. Prémer **Reprendre** sense accés mostra una notificació que explica que el propietari del workflow l'ha de tornar a compartir primer.

## Gestionar alertes

- **Pausar / Reprendre** — una alerta en pausa no s'avalua mai. Reprendre-la la comprova immediatament en lloc d'esperar el següent interval.
- **Editar** — els canvis es validen en conjunt, de manera que una edició parcial no pot deixar l'alerta en un estat invàlid.
- **Eliminar** — suprimeix l'alerta i el seu historial de disparaments.

## Vegeu també

- [Pestanya Analytics](./analytics-tab.md) — els gràfics dels quals provenen aquests llindars
- [Pestanya Traces](./traces-tab.md) — d'on provenen les xifres de cost d'LLM
- [Historial d'execucions](../reference/execution-history.md) — les execucions que mesuren les alertes d'error, durada i recompte
- [Pestanya Chat](./chat-tab.md) — consultar alertes en llenguatge natural
- [Equips](./teams-tab.md) — compartir alertes amb un equip
