# Distribució de càrrega

Apunteu una segona instància de Heym a la mateixa base de dades PostgreSQL i s'uneix com a worker. Les execucions de workflow en segon pla es reparteixen llavors entre les instàncies segons un percentatge que establiu, de manera que la màquina que serveix la UI i l'API no sigui també l'única màquina que executa tots els workflows.

Les instàncies no es comuniquen mai entre elles. Postgres transporta la feina, de manera que un worker no necessita cap port obert, cap certificat ni cap ruta de tornada a la instància principal — només accés a la base de dades.

## Rols

Una instància és **main**, fixada per una variable d'entorn. Serveix la UI, l'API, MCP i el portal de chat, i és propietària de l'emmagatzematge de fitxers i dels connectors instal·lats. Tota altra instància és un **worker**: només arriba a la base de dades i executa execucions en segon pla.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

El rol main és independent de l'elecció de líder. Heym ja elegeix un líder a tot el clúster perquè sigui propietari del cron, l'avaluació d'alertes i la recuperació de fallades; si main cau, el lideratge es trasllada a un worker en uns quants segons i les execucions programades continuen disparant-se. El rol main no es trasllada, perquè l'emmagatzematge de fitxers no pot traslladar-se amb ell.

## Què pot sortir de la instància main

La ubicació es decideix a partir dels nodes del workflow abans que comenci l'execució. Una execució es queda a main quan qualsevol node seu — incloent-hi els nodes dins de sub-workflows que crida — toca alguna cosa que només existeix en una màquina:

| Node | Per què es queda a main |
|---|---|
| Codex, OpenCode Go | L'espai de treball de l'agent de codificació es queda al disc local perquè una continuació pugui reprendre's allà |
| Agent amb una skill adjunta | El codi de la skill llegeix i escriu a Heym Drive |
| Drive, Converter, Google Drive | Llegeixen i escriuen fitxers generats |
| Trigger File Upload | La pujada aterra al disc de main |
| Send Email | Els relés SMTP corporatius normalment permeten una sola adreça d'origen |
| Nodes de connector | Un connector s'instal·la al disc d'una instància |

**Tota la resta es distribueix** — incloent-hi el node Code, Playwright i les eines Python de l'Agent. Cada instància executa la mateixa imatge amb el seu propi socket de Docker, de manera que un sandbox no és motiu per mantenir una execució a main, i aquests són els nodes més àvids de CPU del producte.

Un workflow el sub-workflow del qual es tria mitjançant una expressió no es pot inspeccionar per endavant, de manera que es queda a main.

## Triar percentatges

Els pesos són enters que es defineixen a **Settings → Instances**. Són **quotes de les instàncies que actualment poden acceptar feina**, no percentatges sobre 100: el planificador divideix pel total propi d'aquest conjunt.

Aquesta distinció es fa evident tan bon punt una instància queda fora. Amb `Main 41, Worker A 26, Worker B 33`, apagar Worker B deixa un conjunt de 67, de manera que Main rep realment 41/67 = **61%** i Worker A 26/67 = **39%**. El tauler mostra el repartiment efectiu sota la taula exactament per aquest motiu, i desar mai es bloqueja pel fet que els números no sumin 100 — només es rebutja un repartiment en què cap instància habilitada tingui un pes.

Hi ha dues coses més que és fàcil equivocar-se.

**Un percentatge no és una quota de potència de màquina.** Només cobreix les execucions que passen per la cua. Servir la UI i l'API, transmetre execucions de l'editor i del portal, i gestionar les pujades de fitxers són tota feina de main i no es compta. Main fa més del que diu el seu número.

**El percentatge de main és un sostre, no un terra.** Les execucions que només poden executar-se a main es carreguen contra la seva quota, de manera que un cop gastada aquesta quota, les execucions distribuïbles restants recauen en els workers. Establir un número baix per a main és segur — la feina que hi ha de córrer encara hi corre. Establir-lo alt deixa els workers sense feina.

Així, amb un main potent i un worker més petit, comenceu més a prop de 60/40 que de la ràtio bruta de les màquines, i després compareu durades reals d'execució a la pestanya Execucions i ajusteu.

Els pesos es renormalitzen entre les instàncies que estan actualment actives i habilitades. Amb `main=70, A=15, B=15`, si A queda fora de línia el repartiment esdevé 70/85 i 15/85 entre main i B, i torna a 70/15/15 quan A reapareix.

**Una instància que torna no té dret a les execucions que es va perdre.** El temps passat Offline, Disabled o en una versió no coincident no es compta en contra seu, de manera que un worker que passa una nit no disponible es reincorpora a la posició actual del conjunt i el repartiment torna a llegir-se 70/30 des de la seva primera execució — no absorbeix totes les execucions fins que s'ha posat al dia. Un worker que va estar disponible tot el temps sí que es posa al dia, que és el que fa que el percentatge de main sigui un sostre.
### Una instància nova s'uneix amb zero

Una instància a la qual no s'ha assignat mai un pes comença a 0, cosa que la deixaria Live, Enabled i sense rebre res. **Assigneu automàticament una quota a les instàncies noves** — activat per defecte, a sota de la taula d'instàncies — ho soluciona: en la propera passada del líder, el nouvingut rep una quota igual del pool, i els pesos existents es redueixen proporcionalment mantenint les seves ràtios entre si, de manera que un 70/30 deliberat continua llegint-se aproximadament com a 70/30 després. El total es manté exactament a 100.

Això s'executa **una vegada per instància**. Tant la passada automàtica com la vostra pròpia edició marquen la instància com a configurada, de manera que una instància que configureu vosaltres mateixos no es canvia mai a la vostra esquena — incloent-hi una que hàgiu establert deliberadament a 0. Desactiveu aquesta opció si preferiu que cada màquina nova us esperi.

Només hi participen les instàncies habilitades, live i compatibles. Assignar una quota a una màquina que no pot executar res deixaria aquesta quota sense utilitat.

### Quan els percentatges no poden ajudar

El tauler de configuració informa de quantes de les execucions de les últimes 24 hores només s'han pogut executar a main. Si aquest nombre és elevat — una càrrega de treball amb molt de Codex o Drive — els workers estaran inactius independentment del que diguin els pesos, i la solució és una instància main més gran en lloc de més instàncies.

## Dimensionar PostgreSQL per a un clúster

Les connexions escalen amb les instàncies, no només amb els usuaris. Cada instància executa diversos processos uvicorn, i cada procés manté un pool de connexions més quatre connexions `LISTEN` (cancel·lació, despertars de cua, resultats d'execució, fluxos de chat). Els fluxos de chat oberts comparteixen l'única connexió de chat, de manera que no afegeixen connexions a la base de dades. Un clúster de tres instàncies amb el valor per defecte `max_connections = 100` s'esgota, i Heym aleshores no aconsegueix arribar a la seva pròpia base de dades.

Calculeu aproximadament `instances x processes x (async pool + sync pool + 4)` i establiu `max_connections` per sobre d'aquest valor.

Reduïu els pools en lloc d'augmentar només el sostre. Un desplegament únic utilitza per defecte 10+20 connexions async i 5+10 sync per procés, cosa que és generosa per a una màquina i massa per a un clúster:

| Variable | Instància única | Clúster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

El fitxer compose d'exemple estableix aquests valors i `max_connections = 300`. Això fa baixar un clúster de dues instàncies d'un sostre de 768 connexions a 192, amb tres instàncies encara per sota de 300.

## Requisits que el clúster no pot aplicar per vosaltres

**Cada instància ha d'utilitzar la mateixa `SECRET_KEY` i `ENCRYPTION_KEY`.** Un worker amb una `ENCRYPTION_KEY` diferent no pot desxifrar credencials, i cada execució que utilitzi credencials fallaria amb un error que no indica res d'útil. Heym compara un digest d'ambdues claus a cada heartbeat, juntament amb la versió de l'aplicació i la revisió de la base de dades, i marca una instància que no coincideix com a **Mismatch** perquè no rebi cap feina. La càrrega recau sobre main fins que ho corregiu.

Això també defineix l'ordre d'actualització. Actualitzar main primer marca tots els workers com a incompatibles; la feina torna a main, i cada worker es reincorpora a mesura que s'actualitza. Més lent, visible i reversible.

**Adreceu l'ingress només a la instància main.** Fer round-robin del trànsit d'usuaris entre instàncies enviaria una pujada de fitxer a una màquina i la seva descàrrega a una altra. Res al codi ho impedeix, perquè un worker executa la mateixa imatge i respondrà qualsevol petició que rebi.

**Cada instància necessita `FRONTEND_URL`, establerta a la mateixa adreça pública.** Una execució que es pausa per a revisió humana genera el seu enllaç de revisió a la instància que la va executar, no a main, i el mateix passa amb els enllaços de seguiment de Codex i amb les URL de descàrrega dels fitxers generats. Un worker sense aquesta variable construeix aquests enllaços contra la seva pròpia adreça local, i qui en rebi un no el podrà obrir.

**Les instàncies worker tenen una IP de sortida diferent.** Qualsevol API que permeti adreces d'origen a la llista blanca veurà la nova. Send Email s'executa a main exactament per aquest motiu; per al node HTTP, o bé doneu al clúster una única adreça de sortida NAT o bé afegiu cada instància a la llista blanca.

## Afegir un worker en una altra màquina

`docker-compose.worker.yml` a l'arrel del repositori executa un worker al seu propi host. No té base de dades ni interfície d'usuari: arriba al PostgreSQL de la instància main i pren la seva quota de les execucions en segon pla.

Ompliu un `.env` al costat — etiqueta d'imatge, host i credencials de la base de dades, ambdues claus i un id d'instància — i inicieu-lo. Compose es nega a iniciar-se fins que tots els valors obligatoris estiguin establerts, en lloc d'arrencar amb un valor de substitució que falla més endavant d'una manera difícil d'interpretar.

L'etiqueta d'imatge ha de ser la versió que executa main, i ambdues claus s'han de copiar exactament. Una diferència en qualsevol de les dues mostra el worker com a Mismatch i no rep cap feina.
## Lectura de la taula d'instàncies

| Columna | Significat |
|---|---|
| Name | Etiqueta editable; s'estampa a cada execució que duu a terme aquesta instància |
| Role | `main` o `worker`, provinent de l'entorn |
| Status | **Live** amb un heartbeat recent, **Offline** després de 30 segons de silenci, **Mismatch** quan la versió, la revisió de la base de dades o les claus difereixen de les de main |
| ms | Anada i tornada des d'aquesta instància fins a la base de dades, mesurada per la mateixa instància |
| On | Treu un worker de rotació sense aturar-lo — les execucions en curs finalitzen, no se n'assignen de noves. Bloquejat per a la instància main: la feina de fitxers, plugins i agents de codi s'executa allà independentment de l'estat del commutador |
| Weight | La seva quota d'execucions distribuïbles |

## Historial d'execucions

Cada execució de l'historial d'execucions indica la instància que la va dur a terme, i tots dos diàlegs d'historial poden filtrar-se fins a una sola instància. El filtre coincideix amb l'id de la instància mentre en mostra el nom, de manera que canviar el nom d'una instància no reescriu el que diuen les execucions antigues.

Res d'això no apareix en una instal·lació d'una sola instància: els camps són buits, no es mostra cap etiqueta i no s'ofereix cap filtre.

## Comportament davant d'errors

**Si un worker mor a mig executar**, el seu heartbeat queda obsolet i l'escombratge de recuperació existent del líder torna a executar l'execució en una instància activa. La fila de la cua que havia reclamat es retira per separat: un cop no existeix cap execució activa per a ella i ha passat un marge de dos minuts, el líder marca la fila com a fallida i desperta qui esperava el resultat. L'antiguitat per si sola no és mai el trigger, de manera que una execució legítimament llarga es deixa tranquil·la; i la fila es marca com a fallida en lloc de tornar a la cua, perquè la recuperació ja s'encarrega de la reexecució i tornar-la a la cua executaria el mateix workflow dues vegades.

**Si main cau**, el cron continua disparant-se des d'un worker i les execucions distribuïbles continuen executant-se. Les execucions que necessiten main s'encuen i esperen, i es drenen quan aquest torna — però només dins la finestra de gràcia de misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 segons per defecte). Qualsevol cosa més antiga es tanca com a omesa, amb el motiu registrat, en lloc de reproduir hores de backlog de cop.

La UI, l'API, MCP i l'editor no estan disponibles mentre main és caigut, perquè l'ingress apunta allà.

## Relacionat

- [Running & Deployment](../getting-started/running-and-deployment.md) – Desplegueu primer una sola instància; les variables d'entorn i la configuració de claus hi són
- [Settings](./user-settings.md) – La pestanya Instances, i qui la pot veure
- [Traces](../tabs/traces-tab.md) – Compareu durades reals d'execució entre instàncies abans de canviar el repartiment
- [Security](./security.md) – Per què cada instància ha de compartir `SECRET_KEY` i `ENCRYPTION_KEY`
