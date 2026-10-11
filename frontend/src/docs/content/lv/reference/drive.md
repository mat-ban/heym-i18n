# Drive

Cilne **Drive** nodrošina centralizētu vietu, kur apskatīt, pārvaldīt un koplietot visus failus, ko ģenerējuši skills.

## Piekļuve Drive

Dodieties uz cilni **Drive** vadības panelī. Visi faili, ko ģenerējuši Jūsu workflow skills, parādās šeit, sakārtoti pēc izveides datuma.

## Failu saraksts

Failu saraksts parāda:

- **Name** - Sākotnējais faila nosaukums ar tipam raksturīgu ikonu
- **Type** - Faila MIME tips (piem., pdf, csv, docx)
- **Size** - Cilvēkam lasāms faila izmērs
- **Source** - Node label, kas ģenerēja failu
- **Date** - Kad fails tika izveidots
- **Actions** - Lejupielādes, koplietošanas un dzēšanas pogas

## Masveida darbības

Katram failam, kas pieder Jums, rindas sākumā ir atzīmēšanas lodziņš. Faili, kas ar Jums koplietoti komandas ietvaros, ir tikai lasāmi un tos nevar atlasīt. Atlasiet vairākus failus (Shift-klikšķis atlasa blakus esošu diapazonu; galvenes atzīmēšanas lodziņš atlasa visu lapu), lai virs saraksta parādītos masveida darbību josla, pēc tam noklikšķiniet uz **Bulk actions**, lai atvērtu vienu dialogu, kas piemēro vienu un to pašu iestatījumu katram atlasītajam failam:

- **Share all with my teams** / **Remove team sharing** — pārslēdz komandas koplietošanu visiem atlasītajiem failiem vienlaikus
- **Create share link for each file** — izveido koplietošanas saiti katram atlasītajam failam, izmantojot vienus un tos pašus derīguma termiņa, paroles un maksimālo lejupielāžu skaita iestatījumus

Dialogs ziņo, cik failiem tas tika piemērots; faili, kas Jums nepieder, tiek izlaisti. Rindu skaita lapā atlasītājs (25 / 50 / 100 / **All**) saraksta apakšā ļauj ielādēt vairāk failu vienā lapā, lai Jūs varētu atlasīt visā savā Drive.

## Failu koplietošana

Noklikšķiniet uz ikonas **Share**, lai atvērtu koplietošanas dialogu. Varat izveidot vairākas koplietošanas saites vienam failam ar dažādām konfigurācijām un pēc izvēles koplietot failu ar savām pašreizējām komandām.

### Publiska saite (uz Token balstīta)

Izveidojiet koplietošanas saiti bez paroles. Ikviens, kam ir saite, var lejupielādēt failu.

### Ar paroli aizsargāta saite (Basic Auth)

Iestatiet paroli, veidojot koplietošanu. Lejupielādes URL izmanto HTTP Basic Authentication - pārlūkprogrammas pieprasīs lietotājvārdu (`file`) un paroli, kad saite tiek atvērta.

### Saites opcijas

- **Expires (hours)** - Pēc izvēles iestatiet derīguma termiņu
- **Max downloads** - Pēc izvēles ierobežojiet lejupielāžu skaitu
- Abus var kombinēt maksimālai kontrolei

### Koplietot ar manām komandām

Iespējojiet **Share with my teams**, lai piešķirtu tikai lasāmu piekļuvi visām komandām, kurās pašlaik atrodaties. Komandas dalībnieki var redzēt un lejupielādēt failu no Drive un izmantot uz lasīšanu orientētas Drive node darbības, taču tikai faila īpašnieks var dzēst failu, izveidot vai atsaukt publiskās saites, vai mainīt paroli/TTL/lejupielāžu ierobežojumus.

Iestatījums ir specifisks failam. Ja vēlāk pievienojaties citai komandai vai izveidojat to, vēlreiz pārslēdziet koplietošanu vai palaidiet Drive node darbību `shareWithMyTeams`, lai pievienotu šo komandu. Izmantojiet `unshareWithMyTeams`, lai noņemtu komandas koplietošanu no faila workflow ietvaros.

### Koplietošanas pārvaldība

Koplietošanas dialogs parāda visas esošās koplietošanas saites ar:
- Pašreizējo lejupielāžu skaitu
- Derīguma termiņa statusu
- Vai Basic Auth ir iespējots
- Kopēšanas un atsaukšanas pogām

## Failu saites Chat un Portal

Kad skill ģenerē failus workflow izpildes laikā, izmantojot Portal chat vai Quick Drawer, lejupielādes saites atbildē parādās automātiski. Lietotāji var noklikšķināt, lai lejupielādētu tieši.

## Krātuve

Ģenerētie faili tiek glabāti servera failu sistēmā zem `data/files/`. Docker izvietojumos tas tiek montēts kā volume noturībai.

## Failu pārvaldība no workflow

[Drive node](../nodes/drive-node.md) ļauj pārvaldīt Drive failus programmatiski workflow ietvaros. Izmantojiet to, lai:

- **List** savus failus un atgrieztu metadatus, piemēram, faila nosaukumu, MIME tipu, izmēru, avotu un lejupielādes URL
- **Delete** failu pēc tam, kad tas ir piegādāts lietotājam
- **Share or unshare with your teams**, lai komandas dalībnieki varētu to lasīt un lejupielādēt tikai tik ilgi, kamēr pastāv komandas koplietošana
- **Set a password** lejupielādes saitei
- **Set a TTL**, lai saite beigtos pēc N stundām
- **Set a max downloads** ierobežojumu

Faila konvertēšana citā formātā ir [Converter node](../nodes/converter-node.md) uzdevums ar `conversion: "fileConvert"`. Tas nolasa Drive failu un saglabā konvertēto rezultātu kā jaunu failu.

Atsaucieties uz failu pēc tā ID no skill izvades: `$agentLabel._generated_files[0].id`

Skatiet [Drive node dokumentāciju](../nodes/drive-node.md) par konfigurācijas detaļām.

## Drive failu lasīšana no skills

Agent skills var izvēlēties Drive lasīšanu ar skill kartītes iestatījumu **Enable Drive files**. Kad tas ir iespējots, skill izpildlaiks iekļauj ģenerētu `heym_drive.py` palīgu. Skill kods var importēt palīgus, piemēram, `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` un `list_drive_files`.

Drive lasīšana ir ierobežota ar failiem, kas pieejami workflow izpildītājam: faili, kas tam pieder, un faili, kas ar izpildītāju koplietoti komandu ietvaros. Izmantojiet faila id precīzai meklēšanai vai precīzu faila nosaukumu, kad lietotājs atsaucas uz failu pēc nosaukuma. Faila nosaukuma meklēšana atgriež jaunāko pieejamo failu ar šo nosaukumu; `list_drive_files(filename="...")` atgriež visas atbilstības.

## Saistītais

- [Drive Node](../nodes/drive-node.md) - Workflow darbības (list, get, delete, password, TTL, max downloads, team sharing)
- [Drive Tab](../tabs/drive-tab.md) - Pārlūkojiet failus vadības panelī
- [File Generation](./file-generation.md) - Kā tiek ģenerēti `_generated_files` un lejupielādes URL

## Tīrīšana
Beigušies koplietošanas token tiek automātiski iztīrīti katru dienu. Paši faili saglabājas, līdz tie tiek manuāli dzēsti, izmantojot cilni Drive. Izmantojiet **Clear All**, lai vienā darbībā dzēstu katru failu un to koplietošanas saites.
