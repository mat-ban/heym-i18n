# Nodul Plugin Trigger

Nodul **Plugin Trigger** este omologul de tip trigger al
[nodului Plugin](./plugin-node.md). Acesta este furnizat de un plugin instalat
al cărui `kind` este `trigger` și produce datele inițiale de la care pornește un workflow.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.<keys returned by the plugin>` |

Un plugin de tip trigger poate reprezenta orice sursă — o altă aplicație, un serviciu
terț sau o altă tehnologie — atât timp cât handler-ul plugin-ului returnează datele
cu care trebuie să înceapă workflow-ul.

## Când se utilizează

Utilizați un nod Plugin Trigger atunci când un plugin instalat definește un trigger care pornește
workflow-ul dvs. Pentru plugin-urile care execută o acțiune în timpul unui workflow, utilizați
[nodul Plugin](./plugin-node.md) în schimb.

## Configurare

La fel ca nodul Plugin, formularul de configurare este generat din câmpurile
manifestului plugin-ului. Câmpurile de tip string care nu sunt secrete utilizează câmpul de expresie, iar câmpurile
secrete sunt mascate.

## Cum rulează plugin-urile

Codul plugin-urilor este de încredere (furnizat de Heym, instalat de operator) și rulează în proces.
Instalarea este restricționată la `HEYM_PLUGIN_ADMIN_EMAILS`, iar subsistemul este
controlat de `HEYM_PLUGINS_ENABLED`. Consultați
[Running & Deployment](../getting-started/running-and-deployment.md).

## Autorizarea plugin-urilor

Pentru a construi un pachet de plugin de tip trigger, consultați
[Plugin Authoring](../reference/plugin-authoring.md) pentru structura arhivei zip,
câmpurile manifestului, semnăturile handler-elor, pictogramele, dependențele și modelul
de încredere la runtime.
