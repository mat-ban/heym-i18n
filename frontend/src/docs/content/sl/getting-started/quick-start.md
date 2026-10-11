# Hiter začetek

Zaženite svoj prvi Heym Workflow v nekaj minutah.

Ali Heym še ne deluje? Glejte [Zagon in namestitev](./running-and-deployment.md) ali sledite video vodniku: [Nastavite Heym lokalno v manj kot 2 minutah](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Ustvarite Workflow

1. Pojdite na zavihek [Workflows](../tabs/workflows-tab.md)
2. Kliknite **New Workflow**
3. Poimenujte svoj workflow (npr. "Hello World")

## 2. Dodajte vozlišča

1. Odprite ploščo **Nodes** na levi
2. Povlecite vozlišče [Input](../nodes/input-node.md) na platno
3. Povlecite vozlišče [LLM](../nodes/llm-node.md) in ga povežite z Input
4. Povlecite vozlišče [Output](../nodes/output-node.md) in ga povežite z LLM

```
[Input] --> [LLM] --> [Output]
```

Glejte [Vrste vozlišč](../reference/node-types.md) za vsa razpoložljiva vozlišča.

## 3. Konfigurirajte

- **Input**: Nastavite privzeto vrednost ali pustite prazno za uporabniški vnos (glejte [Input Node](../nodes/input-node.md))
- **LLM**: Izberite [credential](../tabs/credentials-tab.md) in model, dodajte sistemsko navodilo ter nastavite `userMessage` na `$input.text` (glejte [LLM Node](../nodes/llm-node.md))
- **Output**: Nastavite `message` na `$llm.text`, da posredujete odgovor LLM (glejte [Output Node](../nodes/output-node.md))

Uporabite sintakso [Expression DSL](../reference/expression-dsl.md) za `$input.text` in `$llm.text`. Kliknite gumb za razširitev na poljih izrazov za [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) z predogledom v živo iz backend-a.

## 4. Zaženite

Kliknite **Run**, pritisnite `Ctrl + Enter` ali uporabite debug ploščo za izvedbo. Workflow se izvede od vozlišča Input skozi povezana vozlišča do Output. Glejte [Triggers](../reference/triggers.md) za druge načine zagona workflow-ov ([webhook](../reference/webhooks.md), portal, cron itd.).

Ogled preteklih zagonov v **History** (orodna vrstica) in uporabite **Bring to Canvas** za ponovni zagon z enakimi vhodi.

Na straneh Docs, Evals in drugih internih straneh, ki niso platno, lahko uporabite tudi [Quick Drawer](../reference/quick-drawer.md), da izberete pripet workflow in ga zaženete, ne da bi se vrnili v urejevalnik.

Če berete dokumentacijo in želite pojasnilo pred gradnjo, odprite [Chat with Heym](../reference/chat-with-heym.md) iz glave Docs, da postavite vprašanja, povezana s stranjo.

Druga možnost je, da uporabite [AI Assistant](../reference/ai-assistant.md) iz Debug plošče za ustvarjanje workflow-ov z naravnim jezikom—opišite, kaj želite, in AI ustvari vozlišča in povezave.

Ali že gradite avtomatizacije v drugem orodju? [Migrate to Heym](./migrate-to-heym.md) pretvori workflow iz n8n, Flowise, Dify, Langflow, sim.ai ali Activepieces v Heym workflow, ki ga lahko uvozite.

## Povezane vsebine

- [Osnovni koncepti](./core-concepts.md) – Workflowi, vozlišča in potek izvajanja
- [Migracija na Heym](./migrate-to-heym.md) – Pretvorite n8n, Flowise, Dify, Langflow, sim.ai ali Activepieces workflowe v Heym z AI
- [Zagon in namestitev](./running-and-deployment.md) – Zaženite lokalno z `run.sh` ali namestite z `deploy.sh`
- [Okoljske spremenljivke](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Celotna referenca konfiguracije
- [Nastavitve](../reference/user-settings.md) – Nastavite ime, User Rules in geslo
- [Funkcije platna](../reference/canvas-features.md) – Data pin, dnevniki izvajanja, omogoči/onemogoči, izvleci v pod-workflow
- [Bližnjice na tipkovnici](../reference/keyboard-shortcuts.md) – Bližnjice platna in urejevalnika
- [Expression DSL](../reference/expression-dsl.md) – Sklicevanje na podatke v konfiguraciji vozlišča
- [Pogovorno okno za vrednotenje izrazov](../reference/expression-evaluation-dialog.md) – Razširljiv urejevalnik z predogledom v živo iz zaledja
- [Triggerji](../reference/triggers.md) – Vse vstopne točke workflowa ([webhook](../reference/webhooks.md), portal, cron itd.)
- [Zgodovina izvajanja](../reference/execution-history.md) – Ogled preteklih zagonov in Bring to Canvas
- [Hitri predal](../reference/quick-drawer.md) – Zaženite pripete workflowe s strani, ki niso platno
- [Klepet s Heym](../reference/chat-with-heym.md) – Postavite kontekstualna vprašanja iz glave dokumentacije
- [Zavihek Workflows](../tabs/workflows-tab.md) – Ustvarjanje in upravljanje workflowov
- [Zavihek Credentials](../tabs/credentials-tab.md) – Dodajte API ključe za LLM vozlišča
- [AI pomočnik](../reference/ai-assistant.md) – Ustvarite workflowe z naravnim jezikom
