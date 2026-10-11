# Globala variabler

**Global Variable Store** innehåller beständig nyckel-värde-data som är kopplad till användaren och som överlever mellan workflow-körningar. Den används för konfiguration, funktionsflaggor, räknare eller delat tillstånd som flera workflows behöver.

> **Lagra inte hemligheter här.** Globala variabler är inte ett valv för hemligheter: värden lagras okrypterade, de returneras i sin helhet till alla som variabeln delas med, och medarbetare kan redigera dem. API-nycklar, lösenord och tokens hör hemma i [Autentiseringsuppgifter](./credentials.md), som krypterar dem i vila och aldrig returnerar hemligheten till klienten.

## Lokala kontra globala

| Lagring | Syntax | Omfattning | Beständighet |
|-------|--------|-------|-------------|
| **Workflow-lokal** | `$vars.variableName` | Endast aktuell körning | I minnet, försvinner när körningen avslutas |
| **Global** | `$global.variableName` | Alla workflows för användaren | Lagras i databasen |

## Skapa globala variabler

1. **Från fliken Variabler** – [Fliken Variabler](../tabs/global-variables-tab.md): Skapa, redigera och ta bort variabler direkt.
2. **Från en Variabel-nod** – Aktivera **Store in Global Variable Store** (`isGlobal: true`) i nodens egenskaper. Variabeln skrivs till lagringen när workflowet körs.

## Använda i uttryck

Globala variabler nås med `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Samma metoder används som för workflow-lokala variabler (t.ex. `.upper()`, `.length`, `.add()` för arrayer).

## Värdetyper

Typer som stöds: `string`, `number`, `boolean`, `array`, `object`. Typen väljs när en variabel skapas eller redigeras.

## Dela globala variabler

En global variabel kan delas med andra användare eller [Team](./teams.md) så att de kan använda den i sina egna workflows.

- **Dela med användare** – Klicka på delningsikonen bredvid en ägd variabel, ange mottagarens e-postadress och klicka på **Share**. Mottagaren ser variabeln i sin lista över globala variabler med en **Shared**-markering och etiketten "Shared by &lt;avsändarens e-postadress&gt;".
- **Dela med team** – Välj ett team i delningsdialogen och klicka på **Add**. Alla teammedlemmar får åtkomst.
- **Redigerbar åtkomst** – Mottagare kan visa, redigera och referera till den delade variabeln via `$global.variableName` i sina workflows. Endast ägaren kan dela, sluta dela eller ta bort variabeln.
- **Namnkonflikter** – Om en mottagare redan har en variabel med samma namn har den egna variabeln företräde framför den delade.
- **Sluta dela** – Öppna delningsdialogen för variabeln och klicka på **×**-knappen bredvid den användare som åtkomsten ska tas bort för.

## Chat-integration

Globala variabler är tillgängliga för [Chat](../tabs/chat-tab.md)-assistenten. LLM:en kan referera till dem när den besvarar frågor eller genererar innehåll.

## Relaterat

- [Fliken Variabler](../tabs/global-variables-tab.md) – Hantera globala variabler i gränssnittet
- [Variabel-nod](../nodes/variable-node.md) – Ange variabler med `isGlobal`
- [Expression DSL](./expression-dsl.md) – `$global`-syntax
