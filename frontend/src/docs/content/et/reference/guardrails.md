# Guardrails

Guardrails võimaldavad blokeerida ebaturvalisi või soovimatuid kasutajasõnumeid enne, kui need jõuavad [LLM](../nodes/llm-node.md) või [Agent](../nodes/agent-node.md) sõlme. Kui sõnum vastab blokeeritud kategooriale, viskab sõlm vea selle käivitamise asemel, mille saate kinni püüda [Error Handler](../nodes/error-handler-node.md) sõlmega.

## Guardrails'i lubamine

Avage **LLM** või **AI Agent** sõlme Properties-paneel ja kerige valikuni **Enable Guardrails** (kilbi ikoon). Ruudu märkimine toob esile konfiguratsioonisektsiooni.

## Guardrail'i mandaat ja mudel

Kui guardrails on lubatud, **peate** valima **mandaadi ja mudeli** sisu turvalisuse jaoks. Guardrail'i kontroll kasutab sõlmest valitud mandaati ja mudelit — varuvarianti ega keskkonnamuutujaid ei kasutata. Usaldusväärse sisufiltreerimise jaoks kasutage OpenAI või Google'i mandaati, eriti kui teie põhimudel kasutab kohandatud pakkujat (nt Zhipu, GLM), mis ei pruugi guardrails'i toetada või tagastab API-vigu (nt 404).

Workflow ei saa käivituda enne, kui nii Guardrail Credential kui ka Guardrail Model on valitud.

## Blokeeritud kategooriad

Valige üks või mitu kategooriat blokeerimiseks. Sõnum, mis vastab mõnele märgitud kategooriale, lükatakse tagasi.

| Kategooria | Mida see blokeerib |
|---|---|
| **Violence** | Vägivaldne, ähvardav või füüsiliselt kahjustav sisu |
| **Hate Speech** | Diskrimineerimine, rassism või sallimatus |
| **Sexual Content** | Selgesõnaline seksuaalne sisu või stsenaariumid |
| **NSFW / Profanity** | Labane keel, roppused, selgesõnalised solvangud ja täiskasvanute släng mis tahes keeles |
| **Self-Harm** | Enesetapp, enesevigastamine või sellega seotud sisu |
| **Harassment** | Isiklikud rünnakud, solvangud, kiusamine või hirmutamine |
| **Illegal Activity** | Juhised ebaseaduslike tegude toimepanemiseks |
| **Political Extremism** | Ekstremistlik poliitiline sisu või vägivaldne propaganda |
| **Spam / Phishing** | Rämpspost, phishing või sotsiaalne manipuleerimine |
| **Personal Data Request** | Privaatse või isikut tuvastava teabe küsimine |
| **Prompt Injection** | Katsed tühistada süsteemijuhiseid, sisestada pahatahtlikke promptisid või manipuleerida mudeli käitumist |

## Tundlikkus

**Sensitivity** seade kontrollib, kui rangelt rikkumisi tuvastatakse:

| Tase | Käitumine |
|---|---|
| **Low** | Märgib ka piiripealseid või mitmetähenduslikke juhtumeid |
| **Medium** *(vaikimisi)* | Märgib selgeid rikkumisi; eirab piiripealseid juhtumeid |
| **High** | Märgib ainult äärmuslikke, ühemõttelisi rikkumisi |

## Kuidas tuvastamine töötab

Tuvastamine kasutab **valitud guardrail'i mandaati ja mudelit**:

- **OpenAI mandaadid** — kasutab [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (tasuta, kiire, tokenite kasutuseta) viie kategooria jaoks, mida see natiivselt katab (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Ülejäänud kategooriad kontrollitakse LLM-i klassifitseerimiskutsega, kasutades valitud guardrail'i mudelit.
- **Google / kohandatud mandaadid** — kõiki kategooriaid kontrollitakse LLM-i klassifitseerimiskutsega, kasutades valitud guardrail'i mandaati ja mudelit.

Kui teie põhimudel kasutab kohandatud pakkujat (nt Zhipu, Cerebras), mis võib tagastada 404 või muid API-vigu, valige guardrails'i jaoks **OpenAI või Google'i mandaat**.

## Vea formaat

Kui guardrail käivitub, viskab sõlm vea teatega:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Sõlme tulemuse `output` sisaldab samuti `guardrail_violated_categories` (rikutud kategooriate siltide massiiv), et Debug Panel ja Execution History saaksid selgelt kuvada "Blocked by: X, Y".

Kasutage sõlme **Continue on error** valikut (või [Error Handler](../nodes/error-handler-node.md) sõlme), et suunata workflow varuharule, kui guardrails käivitub.

## Näidis-workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Märkused

- **Korduskatsed puuduvad**: Guardrail'i rikkumised on tahtlikud blokeeringud ega lähe kunagi korduskatsele, isegi kui sõlmel on lubatud "Retry on failure".
- Andmebaasi migratsiooni pole vaja — guardrail'i seaded salvestatakse workflow' node JSON-i koos muude sõlmeandmetega.
- Guardrails kontrollib lahendatud **kasutajasõnumit** (pärast malliväljendite hindamist), mitte töötlemata malli.
- **Kategooriate puudumine** guardrails'i lubatuna on samaväärne nende keelamisega — kontrolli ei teostata.
- **Low** tõsidusastmel käivitub LLM-i klassifitseerimine alati (parim mitmekeelne katvus). OpenAI mandaadid käivitavad lisaks Moderation API.
- **Medium/High** tõsidusastmel kasutavad OpenAI mandaadid Moderation API natiivselt toetatud kategooriate jaoks ja LLM-i klassifitseerimist ülejäänute jaoks. Google'i/kohandatud mandaadid kasutavad alati LLM-i klassifitseerimist.
- LLM-i klassifitseerimine on **keelest sõltumatu** — see tuvastab rikkumisi türgi, araabia, vene, hispaania ja teistes keeltes.
