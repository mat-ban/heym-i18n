# Migracija na Heym

Već imate workflowe u nekom drugom alatu? **AI Convert** ih pretvara u Heym workflowe za Vas. Zalijepite workflow iz n8n, Flowise, Dify, Langflow, sim.ai ili Activepieces — ili jednostavno opišite što želite — i Heym izrađuje ekvivalentni workflow na živom platnu koje možete preuzeti i uvesti.

Otvorite ga na **[heym.run/convert](https://heym.run/convert)** ili upotrijebite gumb **✨ AI Convert** u zaglavlju stranice.

## Kako funkcionira

1. **Odaberite izvorni alat** (neobavezno) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces ili ostavite na *Auto*.
2. **Priložite svoj workflow** — zalijepite izvezeni JSON iz trenutačnog alata ili napišite opis automatizacije koju želite jednostavnim jezikom.
3. **Generirajte** — Heym prenosi rezultat na platno, crtajući čvorove i veze dok nastaju.
4. **Preuzmite ili kopirajte** generirani workflow kao JSON.
5. **Uvezite u Heym** — upotrijebite tijek [Download & Import](../reference/download-import.md) za lijepljenje JSON-a na svoje platno, zatim ga pokrenite.

Konverzija također dodaje malu *Sticky Note* na platno koja označava da je workflow generirao Heym — izbrišite je kad god želite.

## Što dobivate

Konverter preslikava izvorne koncepte na izvorne Heym čvorove — triggere, [LLM](../nodes/llm-node.md) korake, [HTTP](../nodes/http-node.md) pozive, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) radnje, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) i [Output](../nodes/output-node.md). Pregledajte rezultat na platnu, povežite svoje [Credentials](../reference/credentials.md) i prilagodite sve što je izvorni alat izrazio drugačije.

> AI Convert je početna točka, a ne zajamčeni 1:1 prijenos. Uvijek pregledajte generirani workflow prije nego što ga pokrenete u produkciji.

## Dobro je znati

- **Pokretano umjetnom inteligencijom:** konverzije generira veliki jezični model, pa se rezultati mogu razlikovati između pokretanja. Ponovno generirajte ako prvi rezultat nije posve odgovarajući.
- **Veličina unosa:** unos koji zalijepite ili upišete ograničen je na otprilike **25 000 tokena**. Skratite vrlo velike izvoze prije konverzije.
- **Ograničenja brzine:** kako bi alat bio dostupan svima, zahtjevi su ograničeni na **1 u minuti, 5 na sat i 10 dnevno** po posjetitelju.
- **Sigurnost:** zahtjevi se provjeravaju, a obrađuju se samo zahtjevi za izradu Workflowa.

## Sljedeći koraci

- Novi ste na platnu? Započnite s [Brzi početak](./quick-start.md).
- Saznajte kako funkcionira uvoz u [Preuzimanje i uvoz](../reference/download-import.md).
- Samostalno hostate Heym? Pogledajte [Varijable okoline](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) za potpunu referencu konfiguracije.
- Izradite od nule uz pomoć ugrađenog [AI Assistant](../reference/ai-assistant.md).
