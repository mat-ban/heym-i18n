# Human-in-the-Loop

Human-in-the-loop (HITL) ļauj [Agent mezglam](../nodes/agent-node.md) pieprasīt apstiprinājumu noteiktos brīžos, nogaidīt cilvēka lēmumu un pēc tam turpināt workflow no tā paša izpildes momentuzņēmuma.

## Ko tas nodrošina

- Pievieno agentam skaidri definētus apstiprināšanas kontrolpunktus, neveidojot atsevišķu apstiprināšanas workflow
- Izveido vienreizēju publisku pārskatīšanas URL adresē `/review/{token}`
- Ļauj pārskatītājam izvēlēties `Accept`, `Edit & Continue` vai `Refuse`
- Atzīmē izpildi kā `pending`, līdz tiek saņemts lēmums
- Atsāk apturēto izpildi un ļauj agentam turpināt pēc apstiprinājuma
- Atbalsta vairākus secīgus HITL kontrolpunktus vienā agenta palaišanas reizē

## Agenta konfigurācija

Iespējojiet HITL agenta rekvizītu panelī.

| Iestatījums | Apraksts |
|---------|-------------|
| `hitlEnabled` | Ieslēdz cilvēka pārskatīšanu šim agentam |
| `hitlSummary` | Apstiprināšanas vadlīnijas, kad agentam jāpieprasa cilvēka pārskatīšana |

HITL pievieno agentam rīku `request_human_review`. Izmantojiet system prompt un `hitlSummary`
vadlīnijas, lai norādītu agentam, kuras darbības ir jāapstiprina. Kad agents nolemj, ka kontrolpunkts
ir jāpārskata, tas nosūta vienu Markdown pārskatīšanas tekstu cilvēkam. Pārskatītājam paredzētais kopsavilkums tiek
ģenerēts no agenta pieprasījuma izpildes laikā; ja agents to izlaiž, Heym to atvasina no
Markdown satura. V1 versijā HITL atbalsta tikai agenta teksta režīma izvades, tāpēc to nevar apvienot ar
`jsonOutputEnabled`.

MCP rīkiem Heym lūdz modelim interpretēt rakstītās HITL instrukcijas vienā no trim
apstiprināšanas tvērumiem:

- `always` frāzēm, piemēram, "always", "on each" vai "for each"
- `once` frāzēm, piemēram, "once" vai "only one time"
- `never` frāzēm, piemēram, "never", "do not ask" vai "already approved"

Šī interpretācija nosaka, vai atkārtoti MCP izsaukumi atkal tiks apturēti, paliks apstiprināti vienreiz vai izlaidīs
cilvēka pārskatīšanu pilnībā.

Kad HITL ir iespējots, agents arī atklāj otru kanvas izvades rokturi ar apzīmējumu `review`. Izmantojiet šo zaru, lai nosūtītu gaidošo pārskatīšanas URL un kopsavilkumu uz Slack, e-pastu, žurnālu vai jebkuru citu paziņojumu plūsmu, kamēr galvenā izpilde gaida cilvēku.

## Pārskatīšanas plūsma

1. Agents sasniedz soli, kam nepieciešams apstiprinājums, un izsauc `request_human_review`
2. Heym izveido publisku pārskatīšanas pieprasījumu un atgriež pārskatīšanas URL
3. Visi mezgli, kas savienoti ar agenta `review` rokturi, nekavējoties izpildās ar gaidošo HITL payload
4. Workflow izpilde pāriet uz `pending`
5. Pārskatītājs atver `/review/{token}` bez pieteikšanās
6. Pārskatītājs izvēlas vienu darbību:
   - `Accept` turpina ar sākotnējo Markdown
   - `Edit & Continue` turpina ar rediģēto Markdown
   - `Refuse` turpina ar `decision: "refused"` un izlaiž turpmākās agenta darbības
7. Heym atsāk workflow no saglabātā momentuzņēmuma un ļauj agentam turpināt ar apstiprināto Markdown kontekstu
8. Ja arī vēlākam solim nepieciešams apstiprinājums, agents var vēlreiz izsaukt HITL un izveidot vēl vienu gaidošu kontrolpunktu

Pārskatīšanas saites pēc 168 stundām zaudē derīgumu, ja neviens neatbild.

## Publiskā pārskatīšanas lapa

Publiskā pārskatīšanas lapa parāda:

- Workflow nosaukumu un agenta apzīmējumu
- Automātiski ģenerētu pārskatītāja kopsavilkumu no agenta pārskatīšanas pieprasījuma
- Markdown pārskatīšanas tekstu vispirms, kā galveno saturu
- Rediģēšanas lodziņu, kas atveras tikai pēc tam, kad pārskatītājs noklikšķina uz `Edit`
- Dzīvu Markdown priekšskatījumu rediģēšanas laikā
- Darbību pogas `Accept`, `Edit & Continue` un `Refuse`

Kad lēmums ir iesniegts, token tiek bloķēts un to vairs nevar izmantot.

## Izvades un izpildes stāvoklis

Kamēr tiek gaidīta pārskatīšana, agenta izvade satur gaidošu payload:

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

Pēc tam, kad pārskatītājs ir atbildējis un workflow ir atsākts, galīgā agenta izvade ietver lēmuma metadatus:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Izmantojiet `$agentLabel.decision` lejupstraumes mezglos, lai sazarotu pēc pieņemtiem, rediģētiem vai noraidītiem rezultātiem.

## Kanvas pārskatīšanas zars

Izvades rokturis `review` ir pieejams tikai tad, kad agentam ir ieslēgts `hitlEnabled`.

- Tas izpildās pirms cilvēka lēmuma saņemšanas
- Tas saņem gaidošo HITL payload, tostarp `summary`, `draftText`, `reviewUrl`, `shareText` un `shareMarkdown`
- Tas ir paredzēts paziņošanas vai nodošanas soļiem, piemēram, Slack, e-pastam vai audita žurnālam
- Tas izpildās vienreiz katram HITL kontrolpunktam
- Tas neizpildās vēlreiz pēc tam, kad pārskatītājs ir atbildējis; atsākot turpinās tikai parastā agenta izvades plūsma
## Kur tas parādās

- [Izpildes vēsture](./execution-history.md) uzreiz parāda `pending` palaišanas un saglabā pārskatīšanas URL mezgla rezultātos
- [Portāls](./portal.md) chat atbildes parāda cilvēka pārskatīšanas saiti tukšas atbildes vietā
- Atkļūdošanas panelis un vēstures dialogi parāda galīgo HITL lēmumu un pārskatīto tekstu
- Pārskatīšanas izvades rokturis var paziņot ārējiem kanāliem pat tad, ja workflow tika aktivizēts ar cron, curl vai portāla trafiku
- Vairāki HITL kontrolpunkti atkārtoti izmanto vienu un to pašu izpildes vēstures ierakstu, vienlaikus izveidojot jaunu vienreizēju pārskatīšanas saiti katram pauzējumam

## Pašreizējie ierobežojumi

- HITL ir pieejams tikai Agent mezglos
- HITL izmanto aģenta teksta izvadi un v1 neatbalsta JSON izvadi
- Apturēta izpilde atsākas no saglabātā workflow momentuzņēmuma, nevis no jaunākās rediģētās workflow versijas
- Ligzdoti apakš-workflow v1 nevar nonākt gaidošā HITL stāvoklī; pirms to izsaukšanas pieprasiet pārskatīšanu no vecākaģenta

## Saistītie

- [Agent mezgls](../nodes/agent-node.md) - Konfigurējiet HITL aģentā
- [Aģentu arhitektūra](./agent-architecture.md) - Kā aģenti, rīki, apakaģenti un HITL sader kopā
- [Izpildes vēsture](./execution-history.md) - Pārbaudiet gaidošās un atsāktās palaišanas
- [Board](../tabs/board-tab.md) - Board ķēdes palaišanas aptur kartīti gaidošā (dzintara) stāvoklī pie HITL
- [Portāls](./portal.md) - Publiskās chat plūsmas un HITL pārskatīšanas saites
