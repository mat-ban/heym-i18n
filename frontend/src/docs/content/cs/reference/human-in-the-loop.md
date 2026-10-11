# Human-in-the-Loop

Human-in-the-loop (HITL) umožňuje [uzlu Agent](../nodes/agent-node.md) vyžádat schválení v konkrétních okamžicích, počkat na rozhodnutí člověka a poté pokračovat ve workflow ze stejného snímku spuštění.

## Co to dělá

- Přidává do agenta explicitní kontrolní body schválení bez nutnosti vytvářet samostatné schvalovací workflow
- Vytváří jednorázovou veřejnou URL pro kontrolu na adrese `/review/{token}`
- Umožňuje recenzentovi zvolit `Accept`, `Edit & Continue` nebo `Refuse`
- Označí spuštění jako `pending`, dokud nedorazí rozhodnutí
- Obnoví pozastavené spuštění a umožní agentovi pokračovat po schválení
- Podporuje více po sobě jdoucích HITL kontrolních bodů v rámci jednoho spuštění agenta

## Konfigurace agenta

Zapněte HITL v panelu vlastností agenta.

| Nastavení | Popis |
|---------|-------------|
| `hitlEnabled` | Zapne lidskou kontrolu pro tohoto agenta |
| `hitlSummary` | Pokyny pro schvalování, kdy má agent požádat o lidskou kontrolu |

HITL přidává agentovi nástroj `request_human_review`. Pomocí systémového promptu a pokynů `hitlSummary` určete agentovi, které akce vyžadují schválení. Když agent rozhodne, že kontrolní bod vyžaduje revizi, odešle člověku jediný Markdown text revize. Souhrn určený recenzentovi je vygenerován z požadavku agenta za běhu; pokud jej agent vynechá, Heym jej odvodí z těla Markdownu. Ve verzi v1 HITL podporuje pouze textové výstupy agenta, takže jej nelze kombinovat s `jsonOutputEnabled`.

U nástrojů MCP Heym žádá model, aby interpretoval zapsané HITL instrukce do jednoho ze tří rozsahů schválení:

- `always` pro fráze jako „always", „on each" nebo „for each"
- `once` pro fráze jako „once" nebo „only one time"
- `never` pro fráze jako „never", „do not ask" nebo „already approved"

Tato interpretace řídí, zda opakovaná volání MCP znovu pozastaví, zůstanou jednou schválena, nebo zcela přeskočí lidskou kontrolu.

Když je HITL zapnutý, agent také vystavuje druhý výstupní handle na plátně označený `review`. Tuto větev použijte k odeslání URL čekající revize a souhrnu do Slacku, e-mailu, logování nebo jakéhokoli jiného oznamovacího toku, zatímco hlavní spuštění čeká na člověka.

## Průběh revize

1. Agent dosáhne kroku vyžadujícího schválení a zavolá `request_human_review`
2. Heym vytvoří veřejný požadavek na revizi a vrátí URL revize
3. Všechny uzly připojené k handle `review` agenta se okamžitě spustí s čekajícím HITL payloadem
4. Spuštění workflow přejde do stavu `pending`
5. Recenzent otevře `/review/{token}` bez přihlášení
6. Recenzent zvolí jednu akci:
   - `Accept` pokračuje s původním Markdownem
   - `Edit & Continue` pokračuje s upraveným Markdownem
   - `Refuse` pokračuje s `decision: "refused"` a přeskočí další akci agenta
7. Heym obnoví workflow z uloženého snímku a umožní agentovi pokračovat se schváleným kontextem Markdownu
8. Pokud i pozdější krok vyžaduje schválení, agent může znovu zavolat HITL a vytvořit další čekající kontrolní bod

Odkazy na revizi vyprší po 168 hodinách, pokud nikdo neodpoví.

## Veřejná stránka revize

Veřejná stránka revize zobrazuje:

- Název workflow a označení agenta
- Automaticky vygenerovaný souhrn pro recenzenta z požadavku agenta na revizi
- Markdown text revize jako první, jako hlavní obsah
- Editační pole, které se otevře až po kliknutí recenzenta na `Edit`
- Živý náhled Markdownu během úprav
- Akční tlačítka `Accept`, `Edit & Continue` a `Refuse`

Jakmile je rozhodnutí odesláno, token se uzamkne a nelze jej znovu použít.

## Výstupy a stav spuštění

Během čekání na revizi obsahuje výstup agenta čekající payload:

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

Poté, co recenzent odpoví a workflow se obnoví, konečný výstup agenta obsahuje metadata rozhodnutí:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Použijte `$agentLabel.decision` v navazujících uzlech k větvení podle výsledků accepted, edited nebo refused.

## Větev revize na plátně

Výstupní handle `review` je k dispozici pouze tehdy, když je pro agenta zapnutý `hitlEnabled`.

- Spouští se předtím, než dorazí lidské rozhodnutí
- Přijímá čekající HITL payload včetně `summary`, `draftText`, `reviewUrl`, `shareText` a `shareMarkdown`
- Je určen pro oznamovací nebo předávací kroky, jako je Slack, e-mail nebo auditní logování
- Spouští se jednou pro každý HITL kontrolní bod
- Po odpovědi recenzenta se již znovu nespouští; při obnovení pokračuje pouze běžná výstupní cesta agenta
## Kde se zobrazuje

- [Historie spuštění](./execution-history.md) okamžitě zobrazuje běhy ve stavu `pending` a ukládá URL pro kontrolu do výsledků uzlů
- Odpovědi v chatu [Portálu](./portal.md) zobrazují odkaz na lidskou kontrolu místo prázdné odpovědi
- Panel ladění a dialogy historie zobrazují konečné rozhodnutí HITL a zkontrolovaný text
- Výstupní handle kontroly může upozornit externí kanály, i když byl workflow spuštěn pomocí cron, curl nebo provozu z portálu
- Více kontrolních bodů HITL znovu používá stejný záznam historie spuštění a zároveň pro každé pozastavení vytváří nový jednorázový odkaz pro kontrolu

## Aktuální omezení

- HITL je dostupné pouze na uzlech Agent
- HITL používá textový výstup agenta a v v1 nepodporuje výstup JSON
- Pozastavené spuštění pokračuje ze uloženého snapshotu workflow, nikoli z nejnovější upravené verze workflow
- Vnořené dílčí workflow nemohou v v1 přejít do stavu čekajícího HITL; před jejich voláním si vyžádejte kontrolu od nadřazeného agenta

## Související

- [Uzel Agent](../nodes/agent-node.md) - Konfigurace HITL na agentovi
- [Architektura agenta](./agent-architecture.md) - Jak do sebe zapadají agenti, nástroje, dílčí agenti a HITL
- [Historie spuštění](./execution-history.md) - Kontrola čekajících a obnovených běhů
- [Board](../tabs/board-tab.md) - Běhy řetězce Board pozastaví kartu ve stavu čekání (jantarová barva) při HITL
- [Portál](./portal.md) - Veřejné toky chatu a odkazy pro kontrolu HITL
