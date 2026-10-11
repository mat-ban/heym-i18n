# Prehod na Heym

Imate že Workflow v drugem orodju? **AI Convert** jih pretvori v Heym Workflow za Vas. Prilepite Workflow iz n8n, Flowise, Dify, Langflow, sim.ai ali Activepieces — ali preprosto opišite, kaj želite — in Heym zgradi enakovreden Workflow na živem platnu, ki ga lahko prenesete in uvozite.

Odprite ga na **[heym.run/convert](https://heym.run/convert)** ali uporabite gumb **✨ AI Convert** v glavi strani.

## Kako deluje

1. **Izberite izvorno orodje** (neobvezno) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces ali pustite na *Auto*.
2. **Zagotovite svoj Workflow** — prilepite izvožen JSON iz trenutnega orodja ali napišite opis avtomatizacije, ki jo želite, v preprostem jeziku.
3. **Ustvarite** — Heym pretaka rezultat na platno ter riše vozlišča in povezave, ko nastajajo.
4. **Prenesite ali kopirajte** ustvarjeni Workflow kot JSON.
5. **Uvozite v Heym** — uporabite postopek [Download & Import](../reference/download-import.md), da prilepite JSON na svoje platno, nato pa ga zaženite.

Pretvorba na platno doda tudi majhen *Sticky Note*, ki označuje Workflow kot ustvarjen s strani Heym — izbrišete ga lahko kadarkoli.

## Kaj dobite

Pretvornik preslika izvorne koncepte v izvorna Heym vozlišča — Triggerje, korake [LLM](../nodes/llm-node.md), klice [HTTP](../nodes/http-node.md), dejanja [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) in [Output](../nodes/output-node.md). Preglejte rezultat na platnu, povežite svoje [Credentials](../reference/credentials.md) in prilagodite vse, kar je izvorno orodje izrazilo drugače.

> AI Convert je izhodišče, ne zagotovljen prenos 1:1. Vedno preglejte ustvarjeni Workflow, preden ga zaženete v produkciji.

## Dobro je vedeti

- **Podprto z umetno inteligenco:** pretvorbe izvaja velik jezikovni model, zato se lahko rezultati med posameznimi zagoni razlikujejo. Če prvi rezultat ni povsem ustrezen, ga znova ustvarite.
- **Velikost vnosa:** vnos, ki ga prilepite ali vnesete, je omejen na približno **25.000 žetonov**. Pred pretvorbo skrajšajte zelo velike izvoze.
- **Omejitve pogostosti:** da bi orodje ostalo na voljo vsem, so zahteve omejene na **1 na minuto, 5 na uro in 10 na dan** na obiskovalca.
- **Varnost:** zahteve so pregledane in obdelajo se samo zahteve za gradnjo Workflow.

## Naslednji koraki

- Ste novi na platnu? Začnite s [Hitrim začetkom](./quick-start.md).
- Kako deluje uvažanje, izveste v razdelku [Prenos in uvoz](../reference/download-import.md).
- Ali Heym gostite sami? Za celoten referenčni pregled konfiguracije glejte [Okoljske spremenljivke](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).
- Gradite od začetka z [AI Assistant](../reference/ai-assistant.md) v aplikaciji.
