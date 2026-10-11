# Workflow analüüs

**Workflow analüüs** on vasakpoolne paneel, mis sisaldab üht jagatud ja redigeeritavat Markdown-dokumenti iga workflow kohta. Kasutage seda, et selgitada, mida workflow teeb, ja koguda parendusideid — ning laske AI-l teile esimene mustand genereerida.

Dokument on jagatud: igaüks, kellel on juurdepääs workflow'le, saab seda lugeda ja redigeerida. See salvestatakse koos workflow'ga ja kustutatakse automaatselt, kui workflow kustutatakse.

## Paneeli avamine

1. Avage workflow redaktoris.
2. Klõpsake redaktori tööriistaribal nuppu **Analyze** (Sparkles-ikoon).
3. Paneel avaneb vasakul. Sõlmede palett (vasak paneel) ahendatakse, kuni see on avatud; sõlmede paleti uuesti avamine sulgeb analüüsipaneeli.

Paneel on saadaval ainult salvestatud workflow'de jaoks. Täiesti uue salvestamata workflow puhul salvestage see esmalt.

## Dokument

Paneel kuvab üht Markdown-dokumenti kahe vaatega, mida saab vahetada nuppude **Edit** (pliiats) ja **Preview** (silm) abil:

| Vaade | Otstarve |
|------|---------|
| **Edit** | Lihtne Markdown-redaktor (textarea). |
| **Preview** | Renderdatud Markdown. |

Päis näitab, **kes viimati redigeeris** dokumenti ja millal.

### Salvestamine

Muudatuste salvestamiseks klõpsake nuppu **Save**. Save on lubatud ainult siis, kui on salvestamata muudatusi.

Kuna dokument on jagatud, kasutavad salvestused optimistlikku konkurentsi:

- Kui keegi teine salvestas uuema versiooni pärast seda, kui te paneeli avasite, lükatakse teie salvestus tagasi ja kuvatakse hoiatus, milles nimetatakse teist redigeerijat.
- Seejärel saate valida **Reload (discard mine)**, et võtta serveri versioon, või **Overwrite**, et jõuga salvestada oma versioon nende versiooni peale.

## AI analüüs

Valige paneeli ülaosas LLM-i **Credential** ja **Model** (mudelite loend laaditakse valitud mandaadi põhjal — vt [Credentials](../tabs/credentials-tab.md)). Seejärel käivitage analüüs:

- **Analyze my workflow** — kuvatakse, kui dokument on tühi. See voogedastab AI genereeritud Markdown-aruande otse redaktorisse salvestamata mustandina. Vaadake see üle ja redigeerige, seejärel klõpsake **Save**.
- **Reanalyze** — kuvatakse, kui dokumendis on juba sisu. See voogedastab värske aruande eraldi **preview**'sse, jättes teie praeguse dokumendi puutumata. Valige **Accept**, et asendada redaktori sisu uue analüüsiga, või **Discard**, et jätta alles see, mis teil oli.

Mõlemad toimingud **käivitavad esmalt workflow** (kui see on kehtiv ja käivitatav) ja lisavad käivituse tulemused analüüsi prompti, nii et aruanne peegeldab seda, kuidas workflow tegelikult käitub. Kui workflow'd ei saa käivitada, jätkub analüüs selle staatilise struktuuri põhjal.

Genereeritud aruanne hõlmab kolme jaotist järgmises järjekorras: **Improvement areas** (konkreetsed soovitused, sealhulgas **turvalisuse** vaatenurk alati, kui workflow puudutab mandaate, kasutaja sisendit, väliseid päringuid või andmete avalikustamist), workflow **Purpose** ja **What it does** (samm-sammuline ülevaade sõlmedest).

Jaotis **Improvement areas** teostab alati neli selgesõnalist kontrolli:

1. **Error coverage** — kui lõuendil pole [Error Handler](../nodes/error-handler-node.md) sõlme ja ühtegi error workflow'd pole konfigureeritud, toob aruanne selle esile ja soovitab lisada veakäsitluse.
2. **Time saved** — kui ühe käivituse kohta hinnangulist säästetud aega pole määratud, soovitab aruanne selle konfigureerida, et [Analytics](../tabs/analytics-tab.md) **Time Saved** mõõdik saaks täituda.
3. **Network nodes** — sõlmede puhul, mis teevad võrgupäringuid (näiteks [HTTP](../nodes/http-node.md) ja integratsioonisõlmed), soovitab aruanne neil sõlmedel sõlmepõhist veakäsitlust (retry ja/või continue-on-error).
4. **Alerts** — kui workflow'le pole [alerts](../tabs/alerts-tab.md) konfigureeritud, soovitab aruanne seadistada alerts enne prod keskkonda minekut.

### Run Analyzer from Properties

Kui workflow'l on lõuendil sõlmed, kuid analüüsidokumenti veel pole, kuvatakse workflow-tasemel [Properties](./canvas-features.md) paneelis nupp **Run Analyzer** (kuvatakse, kui ükski sõlm pole valitud). See avab selle Workflow analüüsi paneeli, et saaksite valida mandaadi ja mudeli ning aruande genereerida.

Iga analüüsikäivitus salvestatakse [Traces](../tabs/traces-tab.md) allika **Workflow Analysis** alla.

Kui LLM-i mandaati pole konfigureeritud, on Analyze nupp keelatud — lisage see [Credentials Tab](../tabs/credentials-tab.md) vahekaardil.

## Seotud

- [AI Assistant](./ai-assistant.md) — genereerige või muutke workflow sõlmi loomulikust keelest.
- [Sticky Note](../nodes/sticky-note-node.md) — lühikeste märkmete jaoks, mis on kinnitatud otse lõuendile.
