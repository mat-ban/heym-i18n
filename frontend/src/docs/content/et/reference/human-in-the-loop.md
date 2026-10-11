# Human-in-the-Loop

Human-in-the-loop (HITL) võimaldab [Agent Node'il](../nodes/agent-node.md) taotleda kinnitust kindlatel hetkedel, oodata inimlikku otsust ja seejärel jätkata workflow'd samast käivituse hetktõmmisest.

## Mida see teeb

- Lisab agendile selgesõnalised kinnituskontrollpunktid ilma eraldi kinnitusworkflow'd loomata
- Loob ühekordse avaliku ülevaatamise URL-i aadressil `/review/{token}`
- Võimaldab ülevaatajal valida `Accept`, `Edit & Continue` või `Refuse`
- Märgib käivituse olekusse `pending`, kuni otsus saabub
- Jätkab peatatud käivitust ja laseb agendil pärast kinnitust jätkata
- Toetab mitut järjestikust HITL-kontrollpunkti sama agendi käivituse jooksul

## Agendi konfiguratsioon

Lubage HITL agendi atribuutide paneelil.

| Seade | Kirjeldus |
|---------|-------------|
| `hitlEnabled` | Lülitab selle agendi jaoks sisse inimliku ülevaatamise |
| `hitlSummary` | Kinnituse juhised, millal peaks agent taotlema inimlikku ülevaatamist |

HITL lisab agendile tööriista `request_human_review`. Kasutage süsteemi prompti ja `hitlSummary`
juhiseid, et öelda agendile, millised tegevused vajavad kinnitust. Kui agent otsustab, et kontrollpunkt
vajab ülevaatamist, saadab ta inimesele ühe Markdown-formaadis ülevaatamise teksti. Ülevaatajale suunatud kokkuvõte
genereeritakse agendi taotlusest käitusajal; kui agent jätab selle välja, tuletab Heym selle
Markdown-sisu põhjal. Versioonis v1 toetab HITL ainult tekstirežiimis agendi väljundeid, seega ei saa seda kombineerida
`jsonOutputEnabled`-iga.

MCP tööriistade puhul palub Heym mudelil tõlgendada kirjalikke HITL-juhiseid üheks kolmest
kinnitusulatusest:

- `always` fraaside puhul nagu "always", "on each" või "for each"
- `once` fraaside puhul nagu "once" või "only one time"
- `never` fraaside puhul nagu "never", "do not ask" või "already approved"

See tõlgendus kontrollib, kas korduvad MCP-kutsed peatuvad uuesti, jäävad ühe korra kinnitatuks või jätavad
inimliku ülevaatamise täielikult vahele.

Kui HITL on lubatud, eksponeerib agent ka teise lõuendi väljundkäepideme sildiga `review`. Kasutage seda haru, et saata ootel oleva ülevaatamise URL ja kokkuvõte Slacki, e-postile, logimisse või mis tahes muusse teavitusevoogu, samal ajal kui põhikäivitus ootab inimest.

## Ülevaatamise voog

1. Agent jõuab kinnitust nõudva sammuni ja kutsub `request_human_review`
2. Heym loob avaliku ülevaatamise taotluse ja tagastab ülevaatamise URL-i
3. Kõik agendi `review` käepidemega ühendatud sõlmed käivituvad kohe ootel oleva HITL payload'iga
4. Workflow' käivitus liigub olekusse `pending`
5. Ülevaataja avab `/review/{token}` ilma sisse logimata
6. Ülevaataja valib ühe tegevuse:
   - `Accept` jätkab algse Markdowniga
   - `Edit & Continue` jätkab muudetud Markdowniga
   - `Refuse` jätkab `decision: "refused"`-iga ja jätab edasise agendi tegevuse vahele
7. Heym jätkab workflow'd salvestatud hetktõmmisest ja laseb agendil jätkata kinnitatud Markdowni kontekstiga
8. Kui hilisem samm nõuab samuti kinnitust, saab agent HITL-i uuesti kutsuda ja luua veel ühe ootel kontrollpunkti

Ülevaatamise lingid aeguvad 168 tunni pärast, kui keegi ei vasta.

## Avalik ülevaatamise leht

Avalik ülevaatamise leht kuvab:

- Workflow' nime ja agendi silti
- Automaatselt genereeritud ülevaataja kokkuvõtte agendi ülevaatamise taotlusest
- Markdown-formaadis ülevaatamise teksti esimesena, põhisisuna
- Muutmiskasti, mis avaneb alles pärast seda, kui ülevaataja klõpsab `Edit`
- Reaalajas Markdowni eelvaate muutmise ajal
- Tegevusnupud `Accept`, `Edit & Continue` ja `Refuse`

Kui otsus on esitatud, lukustatakse token ja seda ei saa uuesti kasutada.

## Väljundid ja käivituse olek

Ülevaatamist oodates sisaldab agendi väljund ootel payload'i:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Pärast seda, kui ülevaataja on vastanud ja workflow jätkub, sisaldab agendi lõplik väljund otsuse metaandmeid:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Kasutage `$agentLabel.decision` allavoolu sõlmedes, et hargneda kinnitatud, muudetud või keeldutud tulemuste põhjal.

## Lõuendi ülevaatamise haru

Väljundkäepide `review` on saadaval ainult siis, kui agendi jaoks on sisse lülitatud `hitlEnabled`.

- See käivitub enne, kui inimlik otsus saabub
- See saab ootel HITL payload'i, sealhulgas `summary`, `draftText`, `reviewUrl`, `shareText` ja `shareMarkdown`
- See on mõeldud teavitamis- või üleandmissammudeks nagu Slack, e-post või auditi logimine
- See käivitub üks kord iga HITL-kontrollpunkti kohta
- See ei käivitu uuesti pärast seda, kui ülevaataja on vastanud; jätkamisel jätkub ainult tavaline agendi väljundi tee
## Kus see ilmub

- [Käivituste ajalugu](./execution-history.md) näitab `pending` käivitusi kohe ja salvestab ülevaatamise URL-i sõlme tulemustesse
- [Portal](./portal.md) chat-vastused näitavad inimülevaatamise linki tühja vastuse asemel
- Silumispaneel ja ajaloo dialoogid näitavad lõplikku HITL-otsust ja ülevaadatud teksti
- Ülevaatamise väljundkäepide saab teavitada väliseid kanaleid ka siis, kui workflow käivitati cron'i, cURL-i või portali liikluse poolt
- Mitmed HITL-kontrollpunktid kasutavad uuesti sama käivituste ajaloo kirjet, luues samal ajal iga pausi jaoks uue ühekordse ülevaatamise lingi

## Praegused piirangud

- HITL on saadaval ainult Agent-sõlmedel
- HITL kasutab agendi tekstiväljundit ega toeta JSON-väljundit v1-s
- Peatatud käivitus jätkub salvestatud workflow' snapshot'ist, mitte viimasest muudetud workflow' versioonist
- Pesastatud alam-workflow'd ei saa v1-s siseneda ootel HITL-olekusse; taotlege ülevaatamist ülemagendilt enne nende kutsumist

## Seotud

- [Agent Node](../nodes/agent-node.md) – HITL-i konfigureerimine agendil
- [Agendi arhitektuur](./agent-architecture.md) – kuidas agendid, tööriistad, alamagendid ja HITL kokku sobivad
- [Käivituste ajalugu](./execution-history.md) – ootel ja jätkatud käivituste uurimine
- [Tahvel](../tabs/board-tab.md) – Tahvli ahela käivitused peatavad kaardi HITL-i korral ootel (merevaigukollases) olekus
- [Portal](./portal.md) – avalikud chat-voogud ja HITL-i ülevaatamise lingid
