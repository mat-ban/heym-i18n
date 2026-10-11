# Agendi püsiv mälu

Agendi node'id saavad hoida **node-põhist teadmiste graafi** andmebaasis: entiteedid (koos tüüpide ja omadustega) ning nendevahelised seosed. Kui see on lubatud, süstib Heym **iga käivituse ajal selle graafi kokkuvõtte süsteemi prompti** (kui graaf ei ole tühi). Pärast edukat käivitust liidab **LLM-i ekstraktimise töö** taustal vestlusest uued faktid graafi.

Alamagendid ja orkestraatorid kasutavad vaikimisi igaüks **oma lõuendi node'iga** seotud graafi. Samuti on võimalik **anda teistele agentidele selle node'i graafile lugemis- või lugemis-/kirjutamisõigus** (sealhulgas agentidele **teistes workflow'des**, mis kuuluvad Teile) — vt [Jagamine teiste agentidega](#sharing-with-other-agents).

## Lubamine

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kui `true`, laaditakse selle node'i graaf süsteemi prompti ja planeeritakse käivitusejärgne ekstraktimine selle node'i graafi jaoks |
| `memoryShares` | massiiv (valikuline) | Annab teistele agendi node'idele juurdepääsu **selle** node'i mälugraafile; vt [Jagamine](#sharing-with-other-agents) |

Lülitage see sisse agendi node'i omadustes (**Persistent memory (graph)**). Node'il olev roosa **aju** ikoon avab graafi redaktori, kui mälu on lubatud (või kui mudel on kuvatud).

## Graafi redaktor

Dialoog kuvab entiteete animeeritud, jõupõhise graafina — värvilised ringid, mille suurus sõltub ühenduste arvust ja mis on rühmitatud entiteedi tüübi järgi — lisaks redigeerimine ja navigeerimine (vaate sobitamine, korrastatud paigutus, kiirklahvid). Node'e ja servi saab **käsitsi lisada, muuta või kustutada**; Source/Target seose valijad on otsitavad graafide puhul, kus on palju entiteete. Node'i valimisel kuvatakse selle väljuvad ja sisenevad ühendused, millest igaühele saab klõpsata, et hüpata selle node'i juurde. Muudatused rakenduvad **ainult selle** agendi graafile (selle lõuendi node'i graaf, mille aju avasite).

## Jagamine teiste agentidega

Mälugraafi dialoogis võimaldab **Share memory with other agents** lisada **kaaslasi**, kes võivad seda graafi käitusajal tarbida:

1. Valige **workflow** (ükskõik milline workflow, mille saate redaktoris avada).
2. Valige selles workflow's **agendi** node.
3. Määrake **Read only** või **Read & write**.

| Õigus | Mõju |
|------------|--------|
| Read only | Kui **kaaslane** agent käivitub, liidetakse see graaf kaaslase süsteemi prompti (kui sellel on entiteete). Kaaslase käivitusest ei toimu ekstraktimist sellesse graafi. |
| Read & write | Sama prompti käitumine nagu lugemisel, ning pärast **edukat** kaaslase lõpetamist võib tavaline mälu ekstraktimine samuti **liita sellesse (omaniku) graafi**, kasutades kaaslase käivituse mandaati. |

Kaaslased salvestatakse omaniku node'i kohta `memoryShares` kirjetena koos `peerWorkflowId` ja `peerCanvasNodeId` (ning `permission`). Vanemad workflow'd võivad **samas** workflow's olevate kaaslaste puhul `peerWorkflowId` välja jätta; redaktor käsitleb seda praeguse workflow'na.

**Workflow'devaheline jagamine** lahendatakse käitusajal, skaneerides workflow'sid, **mis kuuluvad Teile**. Käivitused ilma autenditud kasutaja kontekstita lahendavad ainult **praeguse** workflow' JSON-is (samas lõuendis) määratletud jagamised.

## Käitumine käitusajal

### Oma graaf (`persistentMemoryEnabled`)

1. **Enne LLM-i kutset** — Kui graafis on entiteete, lisatakse süsteemi juhisele plokk, mis selgitab, et need on faktid varasematest käivitustest (võivad olla puudulikud; vastuolu korral on praegune kasutaja sõnum ülimuslik).
2. **Pärast edukat lõpetamist** — Taustatöö küsib mudelilt (sama mandaat nagu agendi käivitusel) struktureeritud JSON-i (entiteedid + seosed). See payload liidetakse andmebaasi (deduplikatsioon ja seoste puhastamine rakenduvad mõne tüübi puhul, nt töösuhte stiilis servad).

### Kaaslane, kes saab jagatud graafe

Kui agent käivitub, leiab süsteem **omaniku** node'id (ükskõik millises Teie workflow's, kui võimalik), mille `memoryShares` osutavad selle käivituse workflow'le ja lõuendi node'ile. Iga vastavuse korral lisatakse selle omaniku graaf süsteemi prompti **jagatud mälu** jaotisena. **Read & write** kaaslased planeerivad lisaks ekstraktimise sihtmärgid **omaniku** workflow'/graafi jaoks, kui käivitus õnnestub.

Ekstraktimine **ei toimu**, kui käivitus ebaõnnestub või lõpeb HITL-i ootel olekus.

## Workflow' JSON (`data` väli)

Salvestatakse agendi node'ile nagu teised seaded:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` on `"read"` või `"write"`. Jätke `memoryShares` välja või kasutage `[]`, kui jagamist ei toimu.

Node'i objekti täieliku kuju kohta vt [Workflow Structure](./workflow-structure.md).

## Seotud

- [Agent Node](../nodes/agent-node.md) — Agendi täielik konfiguratsioon
- [Agent Architecture](./agent-architecture.md) — Orkestraator, alamagendid, tööriistad
- [Workflow Structure](./workflow-structure.md) — JSON workflow' formaat
- [Canvas Features](./canvas-features.md) — Aju juhtelement ja graafi dialoog
- [Traces tab](../tabs/traces-tab.md) — LLM-i päringute/vastuste jälgitavus
