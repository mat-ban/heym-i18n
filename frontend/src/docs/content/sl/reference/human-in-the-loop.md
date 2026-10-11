# Človek-v-zanki

Človek-v-zanki (HITL) omogoča [Agent Node](../nodes/agent-node.md), da ob določenih trenutkih zahteva odobritev, počaka na človeško odločitev in nato nadaljuje workflow iz istega izvršilnega posnetka.

## Kaj to počne

- Doda eksplicitne odobritvene točke agentu, ne da bi bilo potrebno zgraditi ločen odobritveni workflow
- Ustvari enkratno javno URL povezavo za pregled na `/review/{token}`
- Omogoča recenzentu, da izbere `Sprejmi`, `Uredi in Nadaljuj` ali `Zavrni`
- Označi izvršitev kot `pending`, dokler ne pride odločitev
- Nadaljuje s prekinjeno izvršitvijo in omogoča agentu, da nadaljuje po odobritvi
- Podpira več zaporednih HITL točk v istem zagonu agenta

## Konfiguracija agenta

Omogočite HITL v panelu lastnosti agenta.

| Nastavitev | Opis |
|------------|-------|
| `hitlEnabled` | Vklopi človeški pregled za ta agent |
| `hitlSummary` | Smernice za odobritev, kdaj naj agent zahteva človeški pregled |

HITL doda orodje `request_human_review` agenta. Uporabite sistemski prompt in smernice `hitlSummary`, da poveste agentu, katere akcije potrebujejo odobritev. Ko agent ugotovi, da je potrebna pregledna točka, pošlje enotno Markdown besedilo za pregled človeku. Povzetek, ki ga vidi recenzent, se generira iz agenta ob izvajanju; če ga agent izpusti, Heym izpelje enega iz Markdown telesa. V različici 1 HITL podpira le izhode agenta v besedilnem načinu, zato ga ni mogoče kombinirati z `jsonOutputEnabled`.

Za orodja MCP Heym prosi model, da interpretira napisane HITL navodila v eno od treh obsegov odobritve:

- `always` za fraze, kot so "vedno", "pri vsakem" ali "za vsak"
- `once` za fraze, kot so "enkrat" ali "samo enkrat"
- `never` za fraze, kot so "nikoli", "ne sprašuj" ali "že odobreno"

Ta interpretacija nadzira, ali se ponovljeni klici MCP ponovno ustavijo, ostanejo odobreni enkrat ali popolnoma preskočijo človeški pregled.

Ko je HITL omogočen, agent izpostavi tudi drugo izhodno ročico platna, označeno kot `review`. Uporabite to vejo za pošiljanje URL povezave za pregled in povzetka na Slack, e-pošto, beleženje ali katerikoli drug obveščevalni tok, medtem ko glavna izvršitev čaka na osebo.

## Tok pregleda

1. Agent doseže korak, ki zahteva odobritev, in pokliče `request_human_review`
2. Heym ustvari javno zahtevo za pregled in vrne URL povezavo za pregled
3. Vsa vozlišča, povezana z agentovim `review` ročajem, se takoj izvedejo s pending HITL payload
4. Izvršitev workflow se premakne v `pending`
5. Recenzent odpre `/review/{token}` brez prijave
6. Recenzent izbere eno dejanje:
   - `Sprejmi` nadaljuje z izvirnim Markdown
   - `Uredi in Nadaljuj` nadaljuje z urejenim Markdown
   - `Zavrni` nadaljuje z `odločitev: "zavrnjen"` in preskoči nadaljnje delovanje agenta
7. Heym nadaljuje workflow iz shranjenega posnetka in omogoča agentu, da nadaljuje z odobrenim kontekstom Markdown
8. Če kasnejši korak prav tako zahteva odobritev, lahko agent ponovno pokliče HITL in ustvari še eno pending točko

Povezave za pregled potečejo po 168 urah, če nihče ne odgovori.

## Javni pregledni strani

Javna pregledna stran prikazuje:

- Ime workflow in oznako agenta
- Samodejno generiran povzetek recenzenta iz agentove zahteve za pregled
- Markdown besedilo za pregled najprej, kot glavno vsebino
- Polje za urejanje, ki se odpre šele, ko recenzent klikne `Uredi`
- Življenjski predogled Markdown med urejanjem
- Gumb za dejanja `Sprejmi`, `Uredi in Nadaljuj` ter `Zavrni`

Ko je odločitev oddana, je token zaklenjen in ga ni mogoče ponovno uporabiti.

## Izhodi in stanje izvršitve

Med čakanjem na pregled agentov izhod vsebuje pending payload:

```json
{
  "decision": null,
  "summary": "Pregledajte odgovor, pripravljen za stranko, preden ga pošljete.",
  "draftText": "# Cilj\n...\n\n# Načrtovani klici orodij / dejanja\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Pregledajte odgovor, pripravljen za stranko, preden ga pošljete.\n\n[Odprite pregledno stran](https://example.com/review/abc123)"
}
```

Po tem, ko recenzent odgovori in se workflow nadaljuje, končni izhod agenta vključuje metapodatke o odločitvi:

```json
{
  "text": "Končni izhod agenta po odobritvi in izvršitvi",
  "decision": "accepted",
  "summary": "Pregledajte odgovor, pripravljen za stranko, preden ga pošljete.",
  "originalDraft": "# Cilj\n...\n\n# Načrtovani klici orodij / dejanja\n- ...",
  "requestId": "uuid"
}
```

Uporabite `$agentLabel.decision` v spodnjih vozliščih za razvejitev na sprejete, urejene ali zavrnjene izide.

## Veja pregleda platna

Izhodna ročica `review` je na voljo le, ko je `hitlEnabled` vklopljen za agenta.

- Izvede se pred prihodom človeške odločitve
- Prejme pending HITL payload, vključno z `summary`, `draftText`, `reviewUrl`, `shareText` in `shareMarkdown`
- Namenjena je obveščevalnim ali predajnim korakom, kot so Slack, e-pošta ali beleženje revizij
- Izvede se enkrat za vsak HITL checkpoint
- Ne izvede se ponovno po odgovoru recenzenta; le običajna pot izhoda agenta se nadaljuje ob ponovnem zagonu
## Kje se Pojavi

- [Zgodovina Izvajanja](./execution-history.md) takoj prikaže `pending` izvajanja in shrani URL za pregled v rezultatih vozlišča
- Odgovori v [Portalu](./portal.md) prikazujejo povezavo za človeški pregled namesto praznega odgovora
- Plošča za odpravljanje napak in pogovorna okna zgodovine prikazujejo končno odločitev HITL in pregledano besedilo
- Upravljalnik izhodnih rezultatov lahko obvešča zunanje kanale, tudi ko je bil workflow sprožen s cron, cURL ali prometom iz portala
- Več HITL kontrolnih točk ponovno uporablja isto vnosno zgodovino izvajanja, medtem ko ustvarja novo enkratno povezavo za pregled za vsako prekinitev

## Trenutne Omejitve

- HITL je na voljo samo na Agent vozliščih
- HITL uporablja besedilni izhod agenta in ne podpira JSON izhoda v v1
- Prekinjeno izvajanje se nadaljuje iz shranjenega posnetka workflow, ne iz najnovejše urejene različice workflow
- Vloženi pod-workflows ne morejo preiti v stanje `pending` HITL v v1; zahtevajte pregled od nadrejenega agenta, preden jih pokličete

## Sorodno

- [Agent Vozlišče](../nodes/agent-node.md) - Konfigurirajte HITL na agentu
- [Arhitektura Agenta](./agent-architecture.md) - Kako agenti, orodja, pod-agenti in HITL delujejo skupaj
- [Zgodovina Izvajanja](./execution-history.md) - Preverite čakajoča in nadaljevana izvajanja
- [Tabla](../tabs/board-tab.md) - Veriga izvajanj na tabli ustavi kartico v čakajočem (ambar) stanju na HITL
- [Portal](./portal.md) - Javni tokovi klepeta in povezave za HITL pregled
