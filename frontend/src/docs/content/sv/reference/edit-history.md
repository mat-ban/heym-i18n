# Redigeringshistorik

Redigeringshistorik spårar sparade versioner av ett workflow. Den används för att visa ändringar över tid, jämföra versioner eller återställa till ett tidigare tillstånd.

**Obs:** Redigeringshistorik skiljer sig från [Körningshistorik](./execution-history.md). Redigeringshistorik spårar **sparningar** (ändringar i workflowets struktur); Körningshistorik spårar **körningar** (tidigare körningar).

## Var den finns

**Redigerarens verktygsfält** → **Redigeringshistorik** (GitBranch-ikon)

## Versioner

En ny version skapas varje gång workflowet **sparas**. Listan visar:

- **Aktuell** – Det senast sparade tillståndet (det som visas på canvas)
- **Version N** – Tidigare sparningar med tidsstämplar

Versioner utan ändringar jämfört med föregående version döljs.

## Diff-vy

Välj en version för att se vad som ändrats jämfört med det aktuella workflowet:

| Ändringstyp | Beskrivning |
|-------------|--------------|
| **Noder** | Tillagda, borttagna eller ändrade noder |
| **Kanter** | Tillagda, borttagna eller ändrade anslutningar |
| **Konfiguration** | Inställningar på workflownivå (autentisering, hastighetsbegränsningar, m.m.) |

Expandera varje ändring för att se fältnivåskillnader (t.ex. vilka nodegenskaper som ändrats).

## Förhandsgranskning

För att se hur workflowet såg ut vid en tidigare version, klicka på **Förhandsgranska** bredvid Återställ.

En skrivskyddad canvas öppnas som visar noderna och kanterna för den versionen. Det går att panorera och zooma för att utforska layouten; inga ändringar kan göras från denna vy.

## Återställ

För att återställa en tidigare version:

1. Välj den version som önskas
2. Klicka på **Återställ**
3. Bekräfta åtgärden
4. Det aktuella workflowet ersätts med den valda versionen; sidan laddas om

Återställning skapar ett nytt "aktuellt" tillstånd—det går att återställa igen vid behov.

## Rensa historik

Klicka på papperskorgsikonen i dialogrutans rubrik för att ta bort all versionshistorik. Denna åtgärd kan inte ångras. Det aktuella workflowet finns kvar; endast tidigare versioner raderas.

## När versioner skapas

Versioner skapas endast när workflowet **sparas** (Ctrl/Cmd+S eller knappen Spara). Osparade ändringar lagras inte i Redigeringshistorik förrän de sparas.

Ändringar av agent-skillar ingår i dessa ögonblicksbilder. För att bläddra igenom eller återställa en enskild skill utan att återställa hela workflowet, använd knappen **Historik** på det skill-kortet i agentnodens egenskapspanel. Se [Agentnod](../nodes/agent-node.md#skill-history).

## Relaterat

- [Körningshistorik](./execution-history.md) – Tidigare körningar och Bring to Canvas
- [Workflowets struktur](./workflow-structure.md) – Format för noder och kanter
- [Fliken Workflows](../tabs/workflows-tab.md) – Skapa och hantera workflows
