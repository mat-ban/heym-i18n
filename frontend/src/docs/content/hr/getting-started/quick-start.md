# Brzi početak

Pokrenite svoj prvi Heym workflow u nekoliko minuta.

Još nemate pokrenut Heym? Pogledajte [Pokretanje i implementacija](./running-and-deployment.md) ili slijedite video vodič: [Postavite Heym lokalno u manje od 2 minute](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Izradite Workflow

1. Idite na karticu [Workflows](../tabs/workflows-tab.md)
2. Kliknite **New Workflow**
3. Nazovite svoj workflow (npr. "Hello World")

## 2. Dodajte čvorove

1. Otvorite ploču **Nodes** s lijeve strane
2. Povucite [Input](../nodes/input-node.md) čvor na platno
3. Povucite [LLM](../nodes/llm-node.md) čvor i povežite ga s Input čvorom
4. Povucite [Output](../nodes/output-node.md) čvor i povežite ga s LLM čvorom

```
[Input] --> [LLM] --> [Output]
```

Pogledajte [Vrste čvorova](../reference/node-types.md) za sve dostupne čvorove.

## 3. Konfigurirajte

- **Input**: Postavite zadanu vrijednost ili ostavite prazno za korisnički unos (pogledajte [Input Node](../nodes/input-node.md))
- **LLM**: Odaberite [credential](../tabs/credentials-tab.md) i model, dodajte sistemsku instrukciju i postavite `userMessage` na `$input.text` (pogledajte [LLM Node](../nodes/llm-node.md))
- **Output**: Postavite `message` na `$llm.text` za prosljeđivanje LLM odgovora (pogledajte [Output Node](../nodes/output-node.md))

Koristite sintaksu [Expression DSL](../reference/expression-dsl.md) za `$input.text` i `$llm.text`. Kliknite gumb za proširenje na poljima izraza za [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) s pregledom uživo na backendu.

## 4. Pokrenite

Kliknite **Run**, pritisnite `Ctrl + Enter` ili upotrijebite debug panel za izvršavanje. Workflow se izvršava od Input čvora kroz povezane čvorove do Output čvora. Pogledajte [Triggers](../reference/triggers.md) za druge načine pokretanja workflowa ([webhook](../reference/webhooks.md), portal, cron itd.).

Pregledajte prethodna izvršavanja u **History** (alatna traka) i upotrijebite **Bring to Canvas** za ponovno pokretanje s istim ulazima.

Na stranicama Docs, Evals i drugim internim stranicama izvan platna također možete upotrijebiti [Quick Drawer](../reference/quick-drawer.md) za odabir prikvačenog workflowa i njegovo pokretanje bez povratka u editor.

Ako čitate dokumentaciju i želite pojašnjenje prije izrade, otvorite [Chat with Heym](../reference/chat-with-heym.md) iz zaglavlja Docs za postavljanje pitanja o trenutnoj stranici.

Alternativno, upotrijebite [AI Assistant](../reference/ai-assistant.md) iz Debug panela za izradu workflowa prirodnim jezikom—opišite što želite i AI generira čvorove i veze.

Već izrađujete automatizacije u drugom alatu? [Migrate to Heym](./migrate-to-heym.md) pretvara n8n, Flowise, Dify, Langflow, sim.ai ili Activepieces workflow u Heym workflow koji možete uvesti.

## Povezano

- [Osnovni koncepti](./core-concepts.md) – Workflowi, čvorovi i tijek izvršavanja
- [Migracija na Heym](./migrate-to-heym.md) – Pretvorite n8n, Flowise, Dify, Langflow, sim.ai ili Activepieces workflowe u Heym uz pomoć AI-ja
- [Pokretanje i implementacija](./running-and-deployment.md) – Pokrenite lokalno s `run.sh` ili implementirajte s `deploy.sh`
- [Varijable okoline](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Potpuna referenca konfiguracije
- [Postavke](../reference/user-settings.md) – Konfigurirajte ime, Korisnička pravila i lozinku
- [Značajke platna](../reference/canvas-features.md) – Prikvačivanje podataka, zapisnici izvršavanja, omogućavanje/onemogućavanje, izdvajanje u pod-workflow
- [Tipkovnički prečaci](../reference/keyboard-shortcuts.md) – Prečaci platna i uređivača
- [Expression DSL](../reference/expression-dsl.md) – Referenciranje podataka u konfiguraciji čvora
- [Dijalog za evaluaciju izraza](../reference/expression-evaluation-dialog.md) – Proširivi uređivač s pregledom uživo na pozadinskom sustavu
- [Triggeri](../reference/triggers.md) – Sve ulazne točke workflowa ([webhook](../reference/webhooks.md), portal, cron itd.)
- [Povijest izvršavanja](../reference/execution-history.md) – Pregledajte prošla pokretanja i funkciju Bring to Canvas
- [Brza ladica](../reference/quick-drawer.md) – Pokrenite prikvačene workflowe sa stranica izvan platna
- [Chat s Heymom](../reference/chat-with-heym.md) – Postavljajte kontekstualna pitanja iz zaglavlja dokumentacije
- [Kartica Workflows](../tabs/workflows-tab.md) – Stvarajte i upravljajte workflowima
- [Kartica Credentials](../tabs/credentials-tab.md) – Dodajte API ključeve za LLM čvorove
- [AI asistent](../reference/ai-assistant.md) – Stvarajte workflowe prirodnim jezikom
