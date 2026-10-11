# Nodul Plugin

Nodul **Plugin** execută o acțiune personalizată furnizată de un plugin instalat. Plugin-urile extind Heym cu noi tipuri de noduri — acțiuni, integrări cu terți sau orice poate fi exprimat în Python — fără a modifica aplicația de bază.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.<keys returned by the plugin>` |

Un **pachet** de plugin (un singur zip) poate include **mai multe noduri** — orice combinație de acțiuni și trigger-e. Fiecare nod apare în paletă sub secțiunea **Plugins** cu propriul nume și descriere. Tragerea unui nod pe canvas creează un nod Plugin asociat acelui pachet (`pluginId`) și acelui nod (`pluginNodeKey`).

## Când se utilizează

Utilizați un nod Plugin atunci când un operator a instalat un plugin care realizează acțiunea de care aveți nevoie — de exemplu apelarea unui API privat, comunicarea cu un sistem intern sau rularea unei logici personalizate scrise pentru implementarea dvs.

Pentru plugin-urile de tip trigger care pornesc un workflow, consultați
[Nodul Plugin Trigger](./plugin-trigger-node.md).

## Configurare

Formularul de configurare al nodului este generat din manifestul plugin-ului. Fiecare câmp declarat de plugin (`string`, `number`, `boolean` sau `select`) este afișat automat. Câmpurile de tip string care nu sunt secrete utilizează câmpul de expresie, iar valorile de configurare de tip string salvate care încep cu `$` sunt rezolvate înainte de rularea handler-ului plugin-ului.

Câmpurile secrete (cum ar fi cheile API) sunt mascate în interfața utilizator și nu sunt niciodată scrise în jurnale.

## Cum rulează plugin-urile

Plugin-urile sunt furnizate de Heym și instalate de un operator, astfel încât codul plugin-ului este **de încredere** și rulează în proces, precum un nod integrat, cu acces complet la rețea și la biblioteci. Un plugin poate declara `dependencies` pip care sunt instalate în instanță la momentul instalării.

Instalarea și eliminarea plugin-urilor este restricționată la operatorii a căror adresă de email este listată în `HEYM_PLUGIN_ADMIN_EMAILS`, iar întregul subsistem este controlat de `HEYM_PLUGINS_ENABLED` (dezactivat implicit). Consultați
[Running & Deployment](../getting-started/running-and-deployment.md) pentru variabilele de mediu.

## Pictograme personalizate

Un plugin poate include logo-uri SVG personalizate. Plasați un fișier `icon.svg` în rădăcina pachetului pentru a seta o pictogramă implicită pentru fiecare nod și/sau atribuiți unui nod propriul `"icon": "<file>.svg"` în manifest. Pictograma apare atât pe cardul din paletă, cât și pe nodul din canvas; nodurile fără pictogramă folosesc glifa implicită de piesă de puzzle.

## AI Builder

Plugin-urile instalate sunt expuse asistentului AI și canvas-ului de chat, astfel încât puteți cere Heym să „folosească plugin-ul Acme CRM pentru a crea o înregistrare", iar acesta va genera nodul Plugin cu `pluginId` și `config` corecte.

## Autorizarea plugin-urilor

Pentru a construi un pachet de plugin, consultați
[Plugin Authoring](../reference/plugin-authoring.md) pentru structura zip-ului, câmpurile manifestului, semnăturile handler-elor, pictograme, dependențe și modelul de încredere la runtime.
