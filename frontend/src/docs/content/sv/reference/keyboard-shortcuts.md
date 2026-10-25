# Tangentbordsgenvägar

Heym tillhandahåller tangentbordsgenvägar i workflow-editorn och på canvas för att snabba upp vanliga åtgärder.

## Globala genvägar i editorn

Dessa genvägar är aktiva var som helst i workflow-editorn.

| Genväg | Åtgärd |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Öppna kommandopaletten |
| `Ctrl + I` / `Cmd + I` | Växla panelen för [AI-assistenten](./ai-assistant.md) (fungerar medan text skrivs) |
| `Ctrl + Enter` / `Cmd + Enter` | Kör det aktuella workflowet |
| `Ctrl + S` / `Cmd + S` | Spara workflowet |
| `Ctrl + Z` / `Cmd + Z` | Ångra |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Gör om |
| `Ctrl + Y` / `Cmd + Y` | Gör om (alternativ) |
| `Escape` | Stäng öppna överlägg, dialogrutor och paneler |

## Genvägar på canvas

Dessa genvägar gäller när canvas är i fokus (ingen textinmatning är aktiv).

### Markering och navigering

| Genväg | Åtgärd |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Markera alla noder |
| `Shift` (håll ned) | Dra för att markera flera noder |
| `Ctrl` / `Cmd` (håll ned) | Klicka för att lägga till enskilda noder i markeringen |
| `Escape` | Avmarkera alla noder; stäng inline-sökning efter noder |

### Redigera noder

| Genväg | Åtgärd |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Kopiera markerade nod(er) |
| `Ctrl + X` / `Cmd + X` | Klipp ut markerade nod(er) |
| `Ctrl + V` / `Cmd + V` | Klistra in nod(er) |
| `Delete` eller `Backspace` | Ta bort markerade nod(er) och/eller kant(er) |
| `D` | Växla markerade nod(er) aktiverad/inaktiverad |
| `P` | Växla fäst data på den markerade noden |

### Inline-sökning efter noder

När ett tryckbart tecken skrivs på canvas (när ingen textinmatning är i fokus) öppnas popup-fönstret för inline-sökning efter noder. Det angivna tecknet blir det första tecknet i sökfrågan.

| Genväg | Åtgärd |
|----------|--------|
| Valfritt tryckbart tecken | Öppna inline-sökning efter noder och börja skriva |
| `Backspace` | Ta bort det sista tecknet från sökfrågan |
| `Escape` | Stäng inline-sökningen efter noder |

## Kommandopalett (`Ctrl + K`)

Kommandopaletten är tillgänglig från editorn, översikten, dokumentationen och utvärderingsvyerna. Den gör det möjligt att snabbt navigera till workflows, flikar och dokumentationssidor utan att lämna tangentbordet.

| Genväg | Åtgärd |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Öppna kommandopaletten |
| `↑` / `↓` | Navigera i resultatlistan |
| `Tab` / `Shift + Tab` | Navigera i resultatlistan |
| `Enter` | Öppna det markerade objektet |
| `Escape` | Stäng paletten |

## Genvägar i översikten

Dessa genvägar är aktiva på fliken Workflows när ingen annan textinmatning är aktiv.

| Genväg | Åtgärd |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Fokusera sökning efter workflows |
| `Escape` | Rensa sökning efter workflows när den innehåller text |

## Genvägar i egenskapspanelen

Dessa genvägar är aktiva medan en nod är markerad och egenskapspanelen är öppen.

| Genväg | Åtgärd |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Öppna det länkade under-workflowet i en ny flik (endast Execute-noden) |

## Genvägar i utvärderingsdialogrutan

Dessa genvägar är aktiva medan utvärderingsdialogrutan är öppen.

| Genväg | Åtgärd |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Verkställ uttryck och stäng dialogrutan |
| `Ctrl + Z` / `Cmd + Z` | Ångra ändringar i uttrycksredigeraren |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Gör om ändringar i uttrycksredigeraren |
| `Ctrl + Y` / `Cmd + Y` | Gör om ändringar i uttrycksredigeraren (alternativ) |

## Genvägar för historik och traces

Dessa genvägar är tillgängliga i dialogrutan för körningshistorik och i panelen Traces.

| Genväg | Åtgärd |
|----------|--------|
| `S` | Växla sökinmatningen för att filtrera poster |

## Relaterat

- [Canvas-funktioner](./canvas-features.md) – Data pin, aktivera/inaktivera, extrahera till under-workflow
- [Workflow-struktur](./workflow-structure.md) – Format för noder och kanter
- [Execute-nod](../nodes/execute-node.md) – Anropar under-workflows (`Ctrl + Shift + O`)
- [Snabbstart](../getting-started/quick-start.md) – Bygg det första workflowet

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
