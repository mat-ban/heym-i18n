# Plugin Node

**Plugin**-sõlm käivitab installitud pluginа poolt pakutava kohandatud toimingu. Pluginad laiendavad Heymi uute sõlmetüüpidega — toimingud, kolmandate osapoolte integratsioonid või ükskõik mis, mida saab Pythonis väljendada — ilma tuumrakendust muutmata.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.<keys returned by the plugin>` |

Pluginа **pakett** (üks zip) võib sisaldada **mitut sõlme** — mis tahes kombinatsiooni toimingutest ja triggeritest. Iga sõlm kuvatakse paletis jaotise **Plugins** all oma nime ja kirjeldusega. Ühe lohistamine lõuendile loob Plugin-sõlme, mis on seotud selle paketiga (`pluginId`) ja sõlmega (`pluginNodeKey`).

## Millal kasutada

Kasutage Plugin-sõlme, kui operaator on installinud pluginа, mis teostab vajalikku toimingut — näiteks privaatse API kutsumine, suhtlemine sise­süsteemiga või teie juurutuse jaoks kirjutatud erilahenduse käivitamine.

Trigger-stiilis pluginаte kohta, mis käivitavad workflow, vaadake
[Plugin Trigger node](./plugin-trigger-node.md).

## Konfiguratsioon

Sõlme konfiguratsioonivorm genereeritakse pluginа manifestist. Iga pluginа poolt deklareeritud väli (`string`, `number`, `boolean` või `select`) renderdatakse automaatselt. Mitte-salajased string-väljad kasutavad avaldise sisendit ning salvestatud string-konfiguratsiooni väärtused, mis algavad sümboliga `$`, lahendatakse enne pluginа handleri käivitamist.

Salajased väljad (näiteks API võtmed) on UI-s maskeeritud ega kirjutata kunagi logidesse.

## Kuidas pluginad töötavad

Pluginad tarnib Heym ja installib operaator, seega pluginа kood on **usaldusväärne** ja töötab protsessisiseselt nagu sisseehitatud sõlm, täieliku võrgu- ja teegipääsuga. Pluginа võib deklareerida pip `dependencies`, mis installitakse instantsi installimise ajal.

Pluginаte installimine ja eemaldamine on piiratud operaatoritega, kelle e-posti aadress on loetletud `HEYM_PLUGIN_ADMIN_EMAILS`-is, ning kogu alamsüsteem on väravatud `HEYM_PLUGINS_ENABLED`-iga (vaikimisi välja lülitatud). Keskkonnamuutujate kohta vaadake
[Running & Deployment](../getting-started/running-and-deployment.md).

## Kohandatud ikoonid

Pluginа võib tarnida kohandatud SVG logosid. Asetage `icon.svg` paketi juurkausta, et määrata vaikeväärtus igale sõlmele, ja/või andke sõlmele oma `"icon": "<file>.svg"` manifestis. Ikoon kuvatakse nii paleti kaardil kui ka lõuendi sõlmel; sõlmed, millel pole ikooni, kasutavad vaikimisi pusletüki glüüfi.

## AI Builder

Installitud pluginad on esitatud AI-assistendile ja chat-lõuendile, seega saate paluda Heymil "kasuta Acme CRM pluginа kirje loomiseks" ja see genereerib Plugin-sõlme õige `pluginId` ja `config`-iga.

## Pluginаte autorlus

Pluginа paketi loomiseks vaadake
[Plugin Authoring](../reference/plugin-authoring.md), kus on kirjeldatud zip-i paigutust, manifesti välju, handleri signatuure, ikoone, sõltuvusi ja käitusaegset usaldusmudelit.
