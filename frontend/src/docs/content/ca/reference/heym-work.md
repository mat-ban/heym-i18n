# Heym Work

**Heym Work** és una segona interfície per a equips de negoci, construïda sobre Heym. Les persones usuàries descriuen una tasca amb les seves pròpies paraules, responen a unes quantes preguntes i obtenen un workflow creat i provat per Heym. Treballen des de pàgines dissenyades per a elles, gestionen revisions i veuen cada execució associada al nom de qui la va iniciar. Heym executa cada tasca en segon pla.

Heym Work s'executa com a contenidor independent al costat de Heym, amb una llicència separada de l'equip de Heym. Obtingueu més informació i sol·liciteu una prova a [heym.run/enterprise](https://heym.run/enterprise). Mireu el [vídeo de Heym Work](https://youtu.be/5Z2gGo6bcpU) per fer una visita de dos minuts.

## Què obtenen els equips de negoci

| Àrea | Què fa |
|------|--------|
| **Chat** | Descriviu una tasca escrivint o per veu. Heym demana les dades necessàries, construeix el workflow, el prova i el marca com a Verificat. |
| **Flows** | Els editors creen un flow a partir d'opcions en lloc d'un canvas: què l'inicia, un esborrany d'IA opcional i accions a Slack, Google Sheets i correu electrònic. Les respostes de Slack continuen l'execució, i les aprovacions també esperen a Activitat. Vegeu [Flows](#flows). |
| **Pàgines** | Pàgines fixades amb ginys: indicadors numèrics, gràfics, taules amb etiquetes d'estat, zones per deixar anar fitxers i aprovacions. Una fila de taula pot obrir la seva pròpia pàgina de detall. |
| **Aprovacions** | Les revisions dels passos de [Human-in-the-Loop](./human-in-the-loop.md) esperen a Activitat i a les pàgines, amb les opcions Aprova, Demana canvis i Rebutja. |
| **Activitat** | Cada execució, amb la persona que la va iniciar i la instància que la va dur a terme. |
| **Rols** | Propietari, Editor i Visor. L'inici de sessió es fa mitjançant el [Single Sign-On](./sso.md) que Heym ja utilitza. |
| **Edicions sectorials** | Les edicions per a serveis jurídics, educació, finances, logística, energia i comerç electrònic s'inicien amb pàgines, dades d'exemple i workflows adaptats a cada sector. |

## Flows

**Flows** es troba al menú de Heym Work per a Editors i Propietaris. Un flow es compon d'opcions en lloc de nodes, i Heym Work el desa com un workflow normal de Heym mitjançant l'API de Heym, en nom de la persona que el va crear. S'apliquen les regles d'accés, l'historial d'edicions i la sincronització de triggers de Heym com a l'editor, i cada execució apareix a Activitat com qualsevol altra.

| Part | Opcions |
|---|---|
| **Què l'inicia** | A petició, segons un calendari, amb un missatge de Slack, quan canvia una pestanya de Google Sheets (files afegides, modificades o eliminades) o quan un correu arriba a la bústia. Els triggers de full i correu comproven cada 1, 5, 15 o 60 minuts. |
| **Esborrany d'IA** (opcional) | Un model i instruccions converteixen allò que ha iniciat el flow en text per als passos posteriors. Un flow que no comenci des d'un full o correu pot llegir primer missatges recents de Slack des d'un canal o fil. |
| **Què passa després** | Accions en ordre, en qualsevol de les tres eines, independentment d'allò que hagi iniciat el flow. **Slack:** missatge de canal, missatge directe, formulari, missatge amb botons, aprovació, resposta a fil, actualització de missatge i resultat final. **Google Sheets:** afegir una fila o actualitzar la fila modificada. **Correu:** enviar un correu electrònic. |

- **Les respostes continuen l'execució.** Una aprovació, botons o formulari posen en pausa l'execució fins que algú respon a Slack. Una aprovació també espera a Activitat, i una decisió a qualsevol dels llocs retira els botons del missatge de Slack. Els passos posteriors de Slack romanen al fil del primer missatge.
- **Una sola targeta de Connexions.** Cada flow mostra l'espai de treball de Slack, el compte de Google Sheets i les bústies des d'on llegeix i envia. Són credencials de Heym: **Slack Bot** (token de bot, `xoxb-…`), **Google Sheets**, **IMAP** i **SMTP**; una credencial mancant es pot afegir des del mateix flow.
- **Una app Slack per a cada flow.** A l'aplicació Slack, establiu l'URL de Sol·licitud d'Interactivitat a `https://<el vostre Heym>/api/slack/interactions/<id credencial>` i l'URL de Sol·licitud de Subscripcions d'Esdeveniments a `https://<el vostre Heym>/api/slack/events/<id credencial>`. Heym Work mostra ambdues per a la connexió triada. Tots els flows en aquesta credencial les comparteixen.
- **Els triggers de Slack trien què escolten:** missatges en canals i missatges directes, missatges directes al bot, mencions del bot o missatges en un sol canal. Les publicacions del mateix bot mai no inicien un flow.
- **Requisits.** Els flows requereixen Heym 0.0.131 o posterior.

Els passos que construeix un flow són els mateixos nodes que podeu utilitzar al canvas: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) i [Cron](../nodes/cron-node.md).

## Connectar Heym Work

Mireu el [vídeo d'instal·lació](https://youtu.be/zXGfg1HPSLk) per conèixer tota la configuració, des de la primera ordre fins a la pàgina d'inici.

La connexió es configura a **Configuració → Heym Work**. La pestanya només apareix per als administradors d'instància indicats a `HEYM_ADMIN_EMAILS`.

| Camp | Què fa |
|------|--------|
| **Adreça de Heym Work** | On s'executa Heym Work, per exemple `https://work.example.com`. L'inici de sessió redirigeix aquí. Premeu **Desa**. |
| **Clau d'integració** | **Genera clau** crea la clau que Heym Work utilitza per a cada sol·licitud a Heym. Es mostra una única vegada, amb un botó per copiar-la. Heym només n'emmagatzema el resum criptogràfic (hash). |
| **Activa Heym Work** | Habilita la connexió. Requereix haver indicat prèviament l'adreça i una clau. |
| **Edicions de sector i equip** | Edicions jurídica, educació, finances, logística, energia i comerç electrònic, a més d'edicions de TI, vendes, màrqueting i RRHH per a equips d'empresa, s'obren amb pàgines, dades de mostra i workflows dedicats. |

A continuació, obriu l'adreça de Heym Work i completeu la configuració:

1. **Llicència**: introduïu la clau de llicència facilitada per l'equip de Heym.
2. **Heym**: indiqueu l'adreça de Heym i la clau d'integració.
3. **Propietari**: inicieu sessió amb un compte designat com a Propietari de Heym Work.

S'obre la pàgina d'inici, a punt per al treball de l'equip.

### Rotació de la clau

**Rota la clau** substitueix la clau d'integració. Heym Work deixarà de funcionar fins que s'hi introdueixi la nova clau, i totes les sessions iniciades a Heym Work es tancaran. Utilitzeu aquesta opció si sospiteu que la clau s'ha filtrat o quan marxi una persona que hi hagi tingut accés.

### Desactivació de la connexió

Desactiveu l'opció **Activa Heym Work** per interrompre la connexió. Llavors Heym Work tornarà a demanar la clau de Heym. Heym continuarà executant tots els workflows, calendaris i webhooks en qualsevol cas.

## Model de seguretat

- **Cada canvi passa per Heym.** Heym Work llegeix el que mostra de la base de dades de Heym i envia cada acció a Heym a través del canal protegit per clau, on Heym aplica les seves pròpies regles d'accés. Heym Work manté les seves dades en un esquema separat `heym_work`.
- **La clau s'emmagatzema com a hash.** Heym compara el hash de la clau presentada i mai no desa la clau en text clar.
- **L'autenticació resideix a Heym.** Les persones usuàries inicien sessió a través de Heym, utilitzant el vostre proveïdor d'identitat quan el [SSO](./sso.md) està activat.
- **Els canvis s'auditen.** Desar la connexió i rotar la clau generen registres `work_integration.update` i `work_integration.key_rotate` al [registre d'auditoria](./audit.md).

## Llicenciament

Heym Work necessita una clau de llicència pròpia emesa per l'equip de Heym. Cada dia Heym Work envia a heym.run el seu identificador de llicència, un identificador d'instal·lació, el nombre d'usuaris actius dels darrers 30 dies, el total de membres, el nombre d'execucions en les últimes 24 hores i les versions de Heym i Heym Work. El contingut dels workflows, entrades, sortides i credencials romanen sempre als vostres servidors.

Si la sincronització diària falla durant 30 dies, s'inicia un període de gràcia de 14 dies, després del qual la interfície de Heym Work demanarà una clau a un Propietari. Una prova funciona fins a l'últim dia i es reactiva quan l'equip de Heym l'amplia (s'admet una sola prova per instal·lació). Heym continua funcionant sense interrupció durant tot el temps. Les xarxes sense accés a Internet utilitzen una llicència fora de línia a través d'enterprise@heym.run.

## Vídeos

Tots els vídeos de Heym Work es troben a la [llista de reproducció de Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Temes relacionats

- [Enterprise](./enterprise.md): Llicenciament comercial i suport tècnic
- [Single Sign-On](./sso.md): L'inici de sessió que utilitza Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Les revisions que es mostren a Heym Work
- [Registre d'auditoria](./audit.md): Les línies registrades pels canvis de connexió
- [Configuració](./user-settings.md): Ubicació de la pestanya Heym Work
