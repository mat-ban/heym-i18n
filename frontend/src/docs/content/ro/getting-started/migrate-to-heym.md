# Migrați la Heym

Aveți deja workflow-uri într-un alt instrument? **AI Convert** le transformă în workflow-uri Heym pentru dumneavoastră. Lipiți un workflow din n8n, Flowise, Dify, Langflow, sim.ai sau Activepieces — sau descrieți pur și simplu ceea ce doriți — iar Heym construiește workflow-ul echivalent pe un canvas live pe care îl puteți descărca și importa.

Deschideți-l la **[heym.run/convert](https://heym.run/convert)** sau utilizați butonul **✨ AI Convert** din antetul site-ului.

## Cum funcționează

1. **Selectați instrumentul sursă** (opțional) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces sau lăsați pe *Auto*.
2. **Furnizați workflow-ul** — lipiți JSON-ul exportat din instrumentul dumneavoastră actual sau scrieți o descriere în limbaj natural a automatizării dorite.
3. **Generați** — Heym transmite rezultatul pe un canvas, desenând nodurile și conexiunile pe măsură ce sunt produse.
4. **Descărcați sau copiați** workflow-ul generat ca JSON.
5. **Importați în Heym** — utilizați fluxul [Download & Import](../reference/download-import.md) pentru a lipi JSON-ul pe canvas, apoi rulați-l.

Conversia adaugă, de asemenea, o mică *Sticky Note* pe canvas, marcând workflow-ul ca fiind generat de Heym — ștergeți-o oricând doriți.

## Ce obțineți

Convertorul mapează conceptele sursă pe noduri native Heym — Trigger, pași [LLM](../nodes/llm-node.md), apeluri [HTTP](../nodes/http-node.md), acțiuni [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) și [Output](../nodes/output-node.md). Examinați rezultatul pe canvas, configurați-vă [Credentials](../reference/credentials.md) și ajustați orice element pe care instrumentul sursă l-a exprimat diferit.

> AI Convert este un punct de plecare, nu o portare 1:1 garantată. Examinați întotdeauna workflow-ul generat înainte de a-l rula în producție.

## Bine de știut

- **Bazat pe AI:** conversiile sunt produse de un model lingvistic de mari dimensiuni, astfel încât rezultatele pot varia între rulări. Regenerați dacă primul rezultat nu este tocmai potrivit.
- **Dimensiunea inputului:** inputul pe care îl lipiți sau tastați este limitat la aproximativ **25.000 de tokenuri**. Reduceți exporturile foarte mari înainte de conversie.
- **Limite de rată:** pentru a menține instrumentul disponibil pentru toată lumea, cererile sunt limitate la **1 pe minut, 5 pe oră și 10 pe zi** per vizitator.
- **Siguranță:** cererile sunt verificate, iar numai cererile de construire a workflow-urilor sunt procesate.

## Pași următori

- Sunteți nou pe canvas? Începeți cu [Quick Start](./quick-start.md).
- Aflați cum funcționează importul în [Download & Import](../reference/download-import.md).
- Găzduiți Heym pe cont propriu? Consultați [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) pentru referința completă de configurare.
- Construiți de la zero cu [AI Assistant](../reference/ai-assistant.md) din aplicație.
