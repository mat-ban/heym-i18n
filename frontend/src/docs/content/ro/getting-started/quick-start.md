# Pornire rapidă

Puneți primul dumneavoastră workflow Heym în funcțiune în câteva minute.

Nu aveți încă Heym pornit? Consultați [Rulare și implementare](./running-and-deployment.md) sau urmăriți tutorialul video: [Configurați Heym local în mai puțin de 2 minute](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Creați un Workflow

1. Accesați fila [Workflows](../tabs/workflows-tab.md)
2. Faceți clic pe **New Workflow**
3. Denumiți workflow-ul (de ex. „Hello World")

## 2. Adăugați noduri

1. Deschideți panoul **Nodes** din stânga
2. Trageți un nod [Input](../nodes/input-node.md) pe canvas
3. Trageți un nod [LLM](../nodes/llm-node.md) și conectați-l la Input
4. Trageți un nod [Output](../nodes/output-node.md) și conectați-l la LLM

```
[Input] --> [LLM] --> [Output]
```

Consultați [Tipuri de noduri](../reference/node-types.md) pentru toate nodurile disponibile.

## 3. Configurați

- **Input**: Setați o valoare implicită sau lăsați gol pentru introducerea de către utilizator (consultați [Nodul Input](../nodes/input-node.md))
- **LLM**: Selectați o [credențială](../tabs/credentials-tab.md) și un model, adăugați o instrucțiune de sistem și setați `userMessage` la `$input.text` (consultați [Nodul LLM](../nodes/llm-node.md))
- **Output**: Setați `message` la `$llm.text` pentru a transmite mai departe răspunsul LLM (consultați [Nodul Output](../nodes/output-node.md))

Utilizați sintaxa [Expression DSL](../reference/expression-dsl.md) pentru `$input.text` și `$llm.text`. Faceți clic pe butonul de extindere din câmpurile de expresie pentru a deschide [Dialogul de evaluare a expresiilor](../reference/expression-evaluation-dialog.md) cu previzualizare live din backend.

## 4. Rulați

Faceți clic pe **Run**, apăsați `Ctrl + Enter` sau utilizați panoul de depanare pentru a executa. Workflow-ul rulează de la nodul Input prin nodurile conectate până la Output. Consultați [Triggers](../reference/triggers.md) pentru alte modalități de rulare a workflow-urilor ([webhook](../reference/webhooks.md), portal, cron etc.).

Vizualizați rulările anterioare în **History** (bara de instrumente) și utilizați **Bring to Canvas** pentru a rula din nou cu aceleași date de intrare.

În Docs, Evals și alte pagini interne care nu sunt canvas, puteți utiliza și [Quick Drawer](../reference/quick-drawer.md) pentru a selecta un workflow fixat și a-l rula fără a reveni la editor.

Dacă citiți documentația și doriți clarificări înainte de a construi, deschideți [Chat with Heym](../reference/chat-with-heym.md) din antetul Docs pentru a adresa întrebări contextuale paginii.

Alternativ, utilizați [AI Assistant](../reference/ai-assistant.md) din panoul Debug pentru a crea workflow-uri cu limbaj natural—descrieți ce doriți, iar AI-ul generează noduri și conexiuni.

Construiți deja automatizări într-un alt instrument? [Migrați la Heym](./migrate-to-heym.md) convertește un workflow n8n, Flowise, Dify, Langflow, sim.ai sau Activepieces într-un workflow Heym pe care îl puteți importa.

## Resurse conexe

- [Concepte fundamentale](./core-concepts.md) – Workflow-uri, noduri și flux de execuție
- [Migrați la Heym](./migrate-to-heym.md) – Convertiți workflow-uri n8n, Flowise, Dify, Langflow, sim.ai sau Activepieces în Heym cu AI
- [Rulare și implementare](./running-and-deployment.md) – Porniți local cu `run.sh` sau implementați cu `deploy.sh`
- [Variabile de mediu](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referință completă de configurare
- [Setări](../reference/user-settings.md) – Configurați numele, User Rules și parola
- [Funcționalități Canvas](../reference/canvas-features.md) – Data pin, jurnale de execuție, activare/dezactivare, extragere în sub-workflow
- [Scurtături de tastatură](../reference/keyboard-shortcuts.md) – Scurtături pentru canvas și editor
- [Expression DSL](../reference/expression-dsl.md) – Referirea datelor în configurația nodurilor
- [Dialogul de evaluare a expresiilor](../reference/expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live din backend
- [Triggers](../reference/triggers.md) – Toate punctele de intrare ale workflow-ului ([webhook](../reference/webhooks.md), portal, cron etc.)
- [Istoric execuții](../reference/execution-history.md) – Vizualizați rulările anterioare și Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Rulați workflow-uri fixate din pagini care nu sunt canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Adresați întrebări contextuale din antetul documentației
- [Fila Workflows](../tabs/workflows-tab.md) – Creați și gestionați workflow-uri
- [Fila Credentials](../tabs/credentials-tab.md) – Adăugați chei API pentru nodurile LLM
- [AI Assistant](../reference/ai-assistant.md) – Creați workflow-uri cu limbaj natural
