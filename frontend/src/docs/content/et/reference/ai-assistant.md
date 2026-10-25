# AI-assistent

**AI-assistent** on vestluspanel, mis avaneb Debug-paneelilt ja algab redaktori paremas alumises nurgas. Paneeli liigutamiseks lohistage päist ning laiuse või kõrguse muutmiseks lohistage serva või nurka. Paneel ei kahane alla 360×480 piksli. Asukoht ja suurus jäetakse sellesse brauserisse meelde. Päises olev **Lähtesta asukoht ja suurus** viib paneeli tagasi paremasse alumisse nurka. Kasutage workflow'de loomiseks või muutmiseks loomulikku keelt—kirjeldage, mida soovite, ja AI genereerib sõlmed ning servad, mis lõuendile rakendatakse.

Väljaspool redaktorit puudutavate dokumentatsiooniküsimuste jaoks kasutage [Chat with Heym](./chat-with-heym.md). See keskkond on optimeeritud lehekülge tundvaks tooteabiks, mitte workflow'de genereerimiseks.

## Paneeli avamine

1. Avage workflow redaktoris
2. Leidke **Debug-paneel** all (käivituste tulemuste ala)
3. Klõpsake paneeli tööriistaribal nuppu **AI** (Sparkles-ikoon)
4. AI-assistendi paneel avaneb paremas alumises nurgas. Liigutamiseks lohistage selle päist või laiuse ja kõrguse muutmiseks lohistage serva või nurka.

Vajutage redaktoris ükskõik kus `Ctrl + I` / `Cmd + I`, et paneel avada või sulgeda — kiirklahv töötab ka siis, kui tekstisisestus on fookuses. Vt [Kiirklahvid](./keyboard-shortcuts.md).

Ühe sõlmega töötamiseks viige kursor selle kohale lõuendil ja klõpsake selle kohal **AI**. Paneel avaneb sellele sõlmele keskendunult. Vaadake [Ühe sõlme muutmine](#changing-one-node).

## Paneeli sulgemine

Klõpsake nuppu **X**, vajutage `Ctrl + I` / `Cmd + I` või lülitage Debug-paneeli tööriistaribal nuppu **AI**. Päis lohistab paneeli; see ei sulge seda.

## Konfiguratsioon

Enne sõnumite saatmist valige:

| Säte | Kirjeldus |
|---------|-------------|
| **Mandaat** | LLM-i mandaat (API-võti) jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| **Mudel** | Mudeli nimi (nt `gpt-4o`, `gemini-2.5-flash`) |

Lisage mandaadid jaotises [Mandaatide vahekaart](../tabs/credentials-tab.md). Mudelite loend laaditakse valitud mandaadist.

## Agent-režiim vs Ask-režiim

Paneelil on kaks režiimi, mida lülitatakse paneeli päises oleva **Agent / Ask** kiibiga.

| Režiim | Vaikimisi | Käitumine |
|------|---------|-----------|
| **Agent** | ✓ | Ehitab ja muudab lõuendit. AI genereerib workflow JSON-ploki, mis rakendatakse vastuse valmimisel automaatselt lõuendile. |
| **Ask** | | Vastab ainult küsimustele. Lõuendit ei puudutata kunagi. Kasutage seda oma workflow', Heymi funktsioonide või nõu küsimiseks ilma lõuendi uuendust käivitamata. |

Režiime saab igal ajal vahetada. Režiimi muutmine ei tühjenda vestlust.

Agent-režiimis laseb sõnumivälja all olev **YOLO mode** märkeruut assistendil käivitada ja parandada seda, mida ta ehitab. Vt [YOLO-režiim](#yolo-režiim).

## Vestluse kasutamine

- Sisestage oma taotlus sisendisse (nt "Loo workflow, mis võtab kasutaja sisendi ja saadab selle LLM-ile")
- Saatmiseks vajutage **Enter** (uue rea jaoks Shift+Enter)
- AI edastab oma vastuse voogesituses. **Agent**-režiimis, kui vastus sisaldab workflow'd \`\`\`json koodiplokis, parsitakse see automaatselt ja rakendatakse lõuendile. **Ask**-režiimis ei muudeta lõuendit kunagi.
- Vestluse lähtestamiseks kasutage **Clear**
- Sõnumi kohal hõljudes ja selle kopeerimisikoonil klõpsates kopeerite kuvatava teksti, sealhulgas workflow JSON-i
- Sõnumikasti kohal oleva joone lohistamisega saab kasti kõrgemaks muuta. Sisendala võib kasvada kuni 60% paneelist ning naaseb lehe uuesti laadimisel oma vaikekõrgusele

## Workflow automaatne rakendamine

Kui AI vastus sisaldab kehtivat workflow JSON-plokki (koos `nodes` ja valikuliselt `edges`-iga) \`\`\`json koodiplokis, siis Heym:

1. Parsib JSON-i vastusest
2. Asendab praeguse lõuendi uute sõlmede ja servadega
3. Korrastab sõlmede paigutuse
4. Märgib workflow salvestamata

Kui parsimine ebaõnnestub, kuvatakse nupp **Retry** vastuse uuesti genereerimiseks.

## Ühe sõlme muutmine

Viige kursor sõlme kohale lõuendil ja klõpsake selle kohal **AI**. Paneel avaneb režiimis Agent, keskendudes sellele sõlmele, ja näitab, millist sõlme muudetakse:

| Sõlmel on... | Paneel näitab |
|---|---|
| Praeguses käituses tulemust pole | **Modifying Node:** kompaktses reas koos sõlme ikooni ja nimega. Assistent redigeerib ainult sõlme enda konfiguratsioonist; käivitage sõlm esmalt, kui see peaks väljundit nägema |
| Tulemus praeguses käituses | **Modifying Node: (Has Node Output)** sõlme enda kohal: ikoon, nimi ja tüüp, viimane olek ja kestus ning tõrge ebaõnnestumise korral. Assistent näeb seda väljundit ja tõrget sõlme redigeerimisel |

Viige kursor sildi kohale, et näha, millises olekus paneel on.

Olenemata paneeli olekust loeb assistent ka sõlme dokumentatsioonilehte sõlme päises oleva raamatuikooni taga. Ta kasutab lehte sõlme valikute mõistmiseks ja neile vastamiseks.

Sõnumite all alustavad päringut kolm valikut:

| Valik | Mida see teeb |
|---|---|
| **Change this node as ...** | Täidab sõnumikasti tekstiga *Muuda see sõlm järgmiseks:*, et saaksite lause lõpetada |
| **Fix error in this node ...** | Täidab *Paranda viga selles sõlmes.* Assistent loeb selle sõlme vea viimasest käitusest |
| **Other** | Fokuseerib tühja sõnumikasti |

Muutke teksti ja vajutage **Send**. Assistent tagastab ainult selle sõlme ja Heym uuendab seda kohapeal: sõlm säilitab oma id, tüübi ja nime, nii et avaldised nagu `$checkLinkedIn.result` teistes sõlmedes töötavad edasi. Teised sõlmed, ühendused ja paigutus ei muutu ning **Undo** taastab eelmise konfiguratsiooni.

Kui päring ei mahu sõlme sisse, näiteks vajab teist sõlmetüüpi või uut sõlme, teatab assistent redigeerimise asemel sellest, mida tuleks muuta. Sulgege sõlme fookus sõlmekaardil oleva **X**-iga, et uuesti redigeerida kogu workflowd. Paneeli sulgemine tühistab samuti fookuse.

[YOLO-režiim](#yolo-mode) töötab fokuseeritud sõlmega: assistent muudab sõlme, käivitab workflow ja parandab sõlme, kuni käitus õnnestub. Režiimis **Ask** ütleb fookus assistendile, millise sõlme kohta teie küsimus käib, ja lõuendit ei muudeta.

## YOLO-režiim

**YOLO mode** laseb assistendil testida seda, mida ta ehitab. Märkige sõnumivälja all **YOLO mode** märkeruut ja saatke oma taotlus. Märkeruut kuvatakse ainult Agent-režiimis. See on vaikimisi välja lülitatud ja lähtestatakse väljalülitatud olekusse, kui leht uuesti laaditakse. Lühikese kokkuvõtte jaoks hõljudes selle kõrval oleva infoikooni kohal.

Kui YOLO-režiim on sisse lülitatud, ei peatu assistent pärast workflow' rakendamist:

1. Ta rakendab workflow lõuendile.
2. Enne esimest käivitust küsib ta test-sisendeid. Kaart loetleb workflow' sisendväljad, täidetuna assistendi soovitatud väärtustega. Muutke neid ja vajutage **Run**. Hilisemad käivitused kasutavad neid väärtusi uuesti. Kaart tuleb tagasi ainult siis, kui sisendväljad muutuvad või assistent vajab erinevaid testandmeid.
3. Ta käivitab workflow lõuendil täpselt nagu nupp **Run**: salvestamata muudatused salvestatakse esmalt, sõlmed süttivad ning käivitus kuvatakse Debug-paneelis ja jaotises [Käivituste ajalugu](./execution-history.md).
4. Ta loeb tulemust. Kui käivitus tegi seda, mida palusite, lõpetab ta staatusega **Verified** ja lühikese kokkuvõttega. Kui mitte, parandab ta workflow'd ja käivitab selle uuesti.

Ta teeb sõnumi kohta kõige rohkem **5 käivitust**. Vajutage igal ajal **Stop**, et tsükkel lõpetada ja pooleliolev käivitus peatada.

Iga vastus näitab oma samme nende toimumise ajal:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, koos reaga `Executing <node>` iga sõlme kohta;
- lõplik otsus.

Pärast iga käivitust näitab lühike rida nagu *Attempt 1 result sent · error in 1.2s*, et tulemus läks assistendile tagasi.
### Muude workflow'de käivitamine

YOLO-režiimis saab assistent käivitada ka teie muid workflow'sid, kui tal on vaja nende tulemust. Näiteks saab ta kontrollida, mida workflow tagastab, enne kui seda [Execute](../nodes/execute-node.md) sõlmest välja kutsuda. Need käivitused kuvatakse sammudena `Running workflow "<name>"...` ja need salvestatakse käivituste ajalukku triggeri allikaga `ai_assistant`. Redigeeritavat workflow'd testitakse alati lõuendil.

### Millal see enneaegselt peatub

| Olukord | Mis juhtub |
|---|---|
| Assistent vajab otsust, teavet, mandaati või andmetabelit | Ta küsib tavapärase küsimuskaardi abil. Vastamine jätkab tsüklit. |
| Käivitus ootab [inimese ülevaatamist](./human-in-the-loop.md) | Tsükkel peatub. Kinnitage ülevaatamine ja seejärel saatke sõnum. |
| Workflow ootab faili üleslaadimist | Tsükkel peatub. YOLO-režiim ei saa testida üleslaadimisega käivitatavaid käivitusi. |
| Workflow'st salvestati mujal uuem versioon | Tsükkel peatub. Lahendage salvestuskonflikt ja seejärel saatke sõnum. |

> **Käivitused on päris.** E-kirjad, sõnumid ja API-kutsed workflow's saadetakse tegelikult igal katsel ning DataTable sõlmed kirjutavad päris ridu. Iga käivitus salvestab workflow, seega varasemad versioonid jäävad [redigeerimise ajalukku](./edit-history.md).

## Häälensisestus

Toetatud brauserites lubab nupp **Voice** kõne tekstiks teisendada. Klõpsake salvestamise alustamiseks, klõpsake uuesti peatamiseks. Transkribeeritud tekst saadetakse enne saatmist AI-le grammatika parandamiseks.

## Agent Node vs AI Assistant

| | Agent Node | AI Assistant |
|---|------------|---------------|
| **Eesmärk** | LLM sõlm workflow sees; käivitub täitmise ajal | Chat-liides workflow'de loomiseks loomulikus keeles |
| **Asukoht** | Lõuendi sõlm | Silumispaneel → hõljuv paneel |
| **Millal** | Käitusajal | Redigeerimise ajal |

Vaadake [Agent Node](../nodes/agent-node.md), et tutvuda workflow sõlmega, mis täidab LLM-kutseid tööriistade ja MCP-ga.

## Kuidas see töötab (AI Builder DSL)

AI Assistant põhineb **workflow DSL-il** (valdkonnaspetsiifiline keel), mis kirjeldab sõlmi, servi ja avaldisi. Kui saadate sõnumi:

1. Teie sõnum koos [kasutaja reeglitega](./user-settings.md) ja praeguse workflow'ga (kui see on olemas) saadetakse taustasüsteemi.
2. Taustasüsteem koostab **süsteemse prompti**, mis sisaldab:
   - Täielikku workflow DSL-i (sõlmede tüübid, avaldise süntaks, reeglid, näited)
   - Teie kasutaja reeglid, mis on lisatud kui "User Custom Rules"
   - Praeguse workflow JSON-i, kui redigeerite olemasolevat workflow'd
   - Saadaolevate workflow'de loetelu, kui kasutate Execute sõlme
   - Teie enda mandaatide nimesid, tüüpe ja id-sid (mitte kunagi nende väärtusi)
   - Nende andmetabelite nimesid, id-sid, kirjeldusi ja veerge, mida saate kasutada (mitte kunagi nende ridu)
3. Mudel tagastab ühe workflow JSON-ploki (koos `nodes` ja `edges`-iga). Frontend parsib selle ja rakendab lõuendile.

### Mandaadid

Kui workflow vajab mandaati, küsib assistent enne selle loomist. Kui teil on sobivat tüüpi mandaate, loetleb ta need koos valikuga **Create a new credential**; kui teil neid pole, küsib ta, kas luua üks. Iga küsimus võimaldab teil ka jätkata ilma mandaadita.

Loomise valimine avab paneelis mandaadi vormi, mis on eelseadistatud õigele tüübile ja soovitatud nimele. Väärtused lähevad otse Heymi; assistent saab teada ainult nime ja tüübi. OAuth mandaadid (Google Sheets, Google Drive, BigQuery, Linear, Notion) ühendatakse hüpikaknas ning juhuks, kui hüpikaken on blokeeritud, kuvatakse link autoriseerimislehele. Kui mandaat on salvestatud, kuvab kaart selle nime ja loomise nupp lülitub välja; vajutage **Submit answers** ja assistent paneb uue mandaadi sõlmele.

Võite ka küsida mandaati eraldi ("create a GitHub credential") või paluda muuta olemasolevat ("update my sheet credential", "reconnect my Google Sheets"). Assistent vastab sama kaardiga: loomine avab tühja vormi, uuendamine avab vormi sellel mandaadil, kusjuures selle saladused on maskeeritud.

Assistent eelistab spetsiaalset sõlme. Kui ükski sõlm ei kata toimingut, näiteks vahelehe lisamist Google Sheetsi, kasutab ta HTTP-päringut ja kirjutab valitud mandaadi jaoks päise rea. Vaadake [HTTP › Autentimine mandaatidega](../nodes/http-node.md#authenticating-with-credentials).

Täpsustavad küsimused, ilma milleta workflow saab hakkama, on oma sisendis märgitud kui **Optional** ja need võib vahele jätta.

DSL kehtestab camelCase-sildid, ühtsed avaldise reeglid ja sõlmepõhised väljad. Kui välja väärtus on üksik `$expr`, säilitab taustasüsteem algse tüübi; kui väärtus segab proosat ja `$refs`-e, on tulemuseks string. Ühe-`$` reegel kehtib endiselt: sulgudes ei tohi olla `$`-märki. [Seadete](./user-settings.md) kasutaja reeglid sisestatakse sellesse süsteemsesse prompti, et teie eelistused kehtiksid iga AI loodud workflow puhul.

Kui praegune workflow sisaldab Agent skill-e, lisab AI Assistant sellesse workflow konteksti ainult iga skill-i `SKILL.md`. Manustatud `.py` failid ja binaarsed skill-varad eemaldatakse enne päringut, et ehitaja püsiks mudeli konteksti piirides ka siis, kui skill-id sisaldavad mahukaid implementatsioone.
### Andmetabelid

Kui workflow salvestab, hoiustab või otsib kirjeid ja te ei ole määranud teist hoidlat, kasutab assistent [DataTable](../nodes/datatable-node.md) node'i. Kui nimetate ühe oma tabelitest ja sellel on workflow'le vajalikud veerud, kasutab assistent seda. Vastasel juhul küsib ta, millist tabelit kasutada. Kaart loetleb sobivad tabelid, igaühe kirjelduse ja veerutüüpidega, lisaks **Loo uus tabel** pakutud nime ja veergudega. Teiega jagatud tabeleid pakutakse samuti; tabelit, mida saate ainult lugeda, pakutakse ainult lugemiseks.

Valige uus tabel ja vajutage **Esita vastused**: kaart loob tabeli ning assistent paneb selle id node'ile ja kasutab selle täpseid veerunimesid. Võite ka paluda tabelit eraldi, näiteks "loo tabel minu müügivihjete jaoks".

Assistent näeb tabelite nimesid, kirjeldusi ja veerge, mitte kunagi ridu. Ta ei muuda kunagi olemasoleva tabeli veerge: kui tabelil puudub veerg, mida workflow vajab, nimetab ta veeru ja pakub selle asemel uut tabelit. Lisage veerge [DataTable vahekaardil](../tabs/datatable-tab.md).

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – Loomulikus keeles loomine kui agendi elutsükli esimene etapp
- [Kiire algus](../getting-started/quick-start.md) – Looge oma esimene workflow
- [Seaded](./user-settings.md) – Kasutaja reeglid, mis sisestatakse AI Assistanti süsteemi prompti
- [Chat Heymiga](./chat-with-heym.md) – Lehekülge teadvustav assistent dokumentatsiooni alas
- [Põhikontseptsioonid](../getting-started/core-concepts.md) – Workflow'd, node'id ja täitmise voog
- [Agendi node](../nodes/agent-node.md) – LLM node tööriistade ja MCP-ga
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Lisage AI Assistandile API võtmeid
- [Workflow struktuur](./workflow-structure.md) – Workflow'de JSON-vorming
