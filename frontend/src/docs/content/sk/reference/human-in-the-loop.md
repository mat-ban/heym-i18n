# Human-in-the-Loop

Human-in-the-loop (HITL) umožňuje [uzlu Agent](../nodes/agent-node.md) vyžiadať schválenie v konkrétnych momentoch, počkať na rozhodnutie človeka a následne pokračovať vo workflow z rovnakého snímku spustenia.

## Čo to robí

- Pridáva do agenta explicitné kontrolné body schválenia bez potreby vytvárať samostatný workflow na schvaľovanie
- Vytvára jednorazovú verejnú URL adresu na kontrolu na adrese `/review/{token}`
- Umožňuje recenzentovi zvoliť `Accept`, `Edit & Continue` alebo `Refuse`
- Označí spustenie ako `pending`, kým nedorazí rozhodnutie
- Obnoví pozastavené spustenie a umožní agentovi pokračovať po schválení
- Podporuje viacero sekvenčných HITL kontrolných bodov v rámci jedného behu agenta

## Konfigurácia agenta

HITL zapnete v paneli vlastností agenta.

| Nastavenie | Popis |
|---------|-------------|
| `hitlEnabled` | Zapína ľudskú kontrolu pre tohto agenta |
| `hitlSummary` | Pokyny na schvaľovanie, kedy má agent vyžiadať ľudskú kontrolu |

HITL pridáva agentovi nástroj `request_human_review`. Pomocou systémového promptu a pokynov `hitlSummary` určite agentovi, ktoré akcie vyžadujú schválenie. Keď agent usúdi, že kontrolný bod potrebuje kontrolu, odošle človeku jediný text kontroly vo formáte Markdown. Súhrn pre recenzenta sa generuje z požiadavky agenta za behu; ak ho agent vynechá, Heym ho odvodí z tela Markdownu. Vo verzii v1 HITL podporuje iba výstupy agenta v textovom režime, takže ho nemožno kombinovať s `jsonOutputEnabled`.

Pri nástrojoch MCP Heym požiada model, aby interpretoval zapísané HITL pokyny do jedného z troch rozsahov schválenia:

- `always` pre frázy ako „always", „on each" alebo „for each"
- `once` pre frázy ako „once" alebo „only one time"
- `never` pre frázy ako „never", „do not ask" alebo „already approved"

Táto interpretácia určuje, či opakované volania MCP opäť pozastavia beh, zostanú raz schválené, alebo úplne preskočia ľudskú kontrolu.

Keď je HITL zapnutý, agent tiež sprístupní druhý výstupný konektor na plátne označený ako `review`. Túto vetvu použite na odoslanie URL adresy čakajúcej kontroly a súhrnu do Slacku, e-mailu, logovania alebo akéhokoľvek iného toku oznámení, zatiaľ čo hlavné spustenie čaká na človeka.

## Tok kontroly

1. Agent dosiahne krok vyžadujúci schválenie a zavolá `request_human_review`
2. Heym vytvorí verejnú požiadavku na kontrolu a vráti URL adresu kontroly
3. Všetky uzly pripojené ku konektoru `review` agenta sa spustia okamžite s čakajúcim HITL payloadom
4. Spustenie workflow prejde do stavu `pending`
5. Recenzent otvorí `/review/{token}` bez prihlásenia
6. Recenzent zvolí jednu akciu:
   - `Accept` pokračuje s pôvodným Markdownom
   - `Edit & Continue` pokračuje s upraveným Markdownom
   - `Refuse` pokračuje s `decision: "refused"` a preskočí ďalšiu akciu agenta
7. Heym obnoví workflow z uloženého snímku a umožní agentovi pokračovať so schváleným kontextom Markdownu
8. Ak aj neskorší krok vyžaduje schválenie, agent môže znova zavolať HITL a vytvoriť ďalší čakajúci kontrolný bod

Odkazy na kontrolu vypršia po 168 hodinách, ak nikto nezareaguje.

## Verejná stránka kontroly

Verejná stránka kontroly zobrazuje:

- Názov workflow a označenie agenta
- Automaticky vygenerovaný súhrn pre recenzenta z požiadavky agenta na kontrolu
- Text kontroly vo formáte Markdown ako prvý, ako hlavný obsah
- Pole na úpravu, ktoré sa otvorí až po kliknutí recenzenta na `Edit`
- Živý náhľad Markdownu počas úprav
- Tlačidlá akcií `Accept`, `Edit & Continue` a `Refuse`

Po odoslaní rozhodnutia sa token uzamkne a nemožno ho znova použiť.

## Výstupy a stav spustenia

Počas čakania na kontrolu obsahuje výstup agenta čakajúci payload:

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

Keď recenzent odpovie a workflow sa obnoví, konečný výstup agenta obsahuje metadata rozhodnutia:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Použite `$agentLabel.decision` v nadväzujúcich uzloch na vetvenie podľa výsledkov accepted, edited alebo refused.

## Vetva kontroly na plátne

Výstupný konektor `review` je dostupný iba vtedy, keď je pre agenta zapnutý `hitlEnabled`.

- Spúšťa sa predtým, než dorazí rozhodnutie človeka
- Prijíma čakajúci HITL payload vrátane `summary`, `draftText`, `reviewUrl`, `shareText` a `shareMarkdown`
- Je určený na kroky oznámenia alebo odovzdania, ako napríklad Slack, e-mail alebo auditné logovanie
- Spúšťa sa raz pre každý HITL kontrolný bod
- Po odpovedi recenzenta sa už znova nespúšťa; pri obnovení pokračuje iba bežná výstupná cesta agenta
## Kde sa zobrazuje

- [História spustení](./execution-history.md) okamžite zobrazuje spustenia v stave `pending` a ukladá URL na kontrolu do výsledkov uzla
- Odpovede v chate [Portálu](./portal.md) zobrazujú odkaz na manuálnu kontrolu namiesto prázdnej odpovede
- Panel Debug a dialógy histórie zobrazujú konečné rozhodnutie HITL a skontrolovaný text
- Výstupný handle kontroly môže upozorniť externé kanály aj vtedy, keď bol workflow spustený cez cron, curl alebo prevádzkou portálu
- Viacero kontrolných bodov HITL opätovne používa ten istý záznam histórie spustení, pričom pre každé pozastavenie vytvára nový jednorazový odkaz na kontrolu

## Aktuálne obmedzenia

- HITL je dostupný iba na uzloch Agent
- HITL používa textový výstup agenta a vo verzii v1 nepodporuje výstup JSON
- Pozastavené spustenie pokračuje zo uloženého snapshotu workflow, nie z najnovšej upravenej verzie workflow
- Vnorené pod-workflowy nemôžu vo verzii v1 prejsť do stavu čakajúceho HITL; vyžiadajte si kontrolu od nadradeného agenta pred ich zavolaním

## Súvisiace

- [Uzol Agent](../nodes/agent-node.md) – Konfigurácia HITL na agentovi
- [Architektúra agenta](./agent-architecture.md) – Ako do seba zapadajú agenti, nástroje, pod-agentovia a HITL
- [História spustení](./execution-history.md) – Kontrola čakajúcich a obnovených spustení
- [Board](../tabs/board-tab.md) – Spustenia reťazca Board pozastavia kartu v čakajúcom (jantárovom) stave pri HITL
- [Portál](./portal.md) – Verejné toky chatu a odkazy na kontrolu HITL
