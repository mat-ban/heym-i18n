# Muudatuste ajalugu

Muudatuste ajalugu jälgib workflow'de salvestatud versioone. Kasutage seda, et näha muudatusi ajas, võrrelda versioone või taastada varasem olek.

**Märkus:** Muudatuste ajalugu erineb [Käivituste ajaloost](./execution-history.md). Muudatuste ajalugu jälgib **salvestusi** (workflow struktuuri muudatusi); Käivituste ajalugu jälgib **käivitusi** (varasemaid täitmisi).

## Kust seda leida

**Redaktori tööriistariba** → **Muudatuste ajalugu** (GitBranch ikoon)

## Versioonid

Uus versioon luuakse iga kord, kui workflow **salvestatakse**. Nimekiri kuvab:

- **Praegune** – Viimane salvestatud olek (see, mida lõuendil näete)
- **Versioon N** – Varasemad salvestused koos ajatemplitega

Versioonid, milles ei ole eelmisega võrreldes muudatusi, on peidetud.

## Erinevuste vaade

Valige versioon, et näha, mis on võrreldes praeguse workflow'ga muutunud:

| Muudatuse tüüp | Kirjeldus |
|-------------|--------------|
| **Sõlmed** | Lisatud, eemaldatud või muudetud sõlmed |
| **Ühendused** | Lisatud, eemaldatud või muudetud ühendused |
| **Konfiguratsioon** | Workflow tasemel seaded (autentimine, päringupiirangud jne) |

Laiendage iga muudatust, et näha väljatasemel erinevusi (nt millised sõlme omadused muutusid).

## Eelvaade

Et näha, milline workflow varasemas versioonis välja nägi, klõpsake **Eelvaade** Taasta kõrval.

Avatakse kirjutuskaitstud lõuend, mis kuvab selle versiooni sõlmi ja ühendusi. Saate lõuendit liigutada ja suumida, et paigutust uurida; sellest vaatest ei saa muudatusi teha.

## Taastamine

Varasema versiooni taastamiseks:

1. Valige soovitud versioon
2. Klõpsake **Taasta**
3. Kinnitage toiming
4. Praegune workflow asendatakse valitud versiooniga; leht laaditakse uuesti

Taastamine loob uue "praeguse" oleku—vajadusel saate uuesti taastada.

## Ajaloo tühjendamine

Kõigi versioonide ajaloo eemaldamiseks klõpsake dialoogi päises prügikasti ikooni. Seda toimingut ei saa tagasi võtta. Praegune workflow jääb alles; kustutatakse ainult varasemad versioonid.

## Millal versioonid luuakse

Versioonid luuakse ainult siis, kui workflow **salvestatakse** (Ctrl/Cmd+S või Salvesta nupp). Salvestamata muudatusi ei talletata muudatuste ajaloos enne salvestamist.

Agendi skill'i muudatused on nendes hetktõmmistes kaasatud. Üksiku skill'i sirvimiseks või taastamiseks ilma kogu workflow'd taastamata kasutage **Ajalugu** nuppu selle skill'i kaardil Agendi sõlme omaduste paneelis. Vt [Agendi sõlm](../nodes/agent-node.md#skill-history).

## Seotud

- [Käivituste ajalugu](./execution-history.md) – Varasemad käivitused ja Lõuendile toomine
- [Workflow struktuur](./workflow-structure.md) – Sõlmede ja ühenduste formaat
- [Workflows vahekaart](../tabs/workflows-tab.md) – Workflow'de loomine ja haldamine
