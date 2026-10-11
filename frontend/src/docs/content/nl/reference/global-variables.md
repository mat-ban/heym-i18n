# Globale Variabelen

De **Global Variable Store** bevat persistente key-value-gegevens op gebruikersniveau die bewaard blijven over workflow-uitvoeringen heen. Gebruik deze voor configuratie, feature flags, tellers of gedeelde status die meerdere workflows nodig hebben.

> **Sla hier geen secrets op.** Globale variabelen zijn geen kluis voor secrets: waarden worden onversleuteld opgeslagen, ze worden volledig teruggegeven aan iedereen met wie u ze deelt, en samenwerkers kunnen ze bewerken. API-sleutels, wachtwoorden en tokens horen thuis in [Referenties](./credentials.md), die ze versleuteld opslaat en de secret nooit terugstuurt naar de client.

## Lokaal versus Globaal

| Store | Syntaxis | Bereik | Persistentie |
|-------|--------|-------|-------------|
| **Workflow-lokaal** | `$vars.variableName` | Alleen huidige uitvoering | In-memory, verloren wanneer de uitvoering eindigt |
| **Globaal** | `$global.variableName` | Alle workflows voor de gebruiker | Opgeslagen in de database |

## Globale variabelen aanmaken

1. **Via het tabblad Variabelen** – [Tabblad Variabelen](../tabs/global-variables-tab.md): Maak, bewerk en verwijder variabelen rechtstreeks.
2. **Via een Variabele-node** – Schakel **Store in Global Variable Store** (`isGlobal: true`) in bij de eigenschappen van de node. De variabele wordt naar de store geschreven wanneer de workflow wordt uitgevoerd.

## Gebruiken in expressies

Toegang tot globale variabelen met `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Gebruik dezelfde methoden als bij workflow-lokale variabelen (bijv. `.upper()`, `.length`, `.add()` voor arrays).

## Waardetypen

Ondersteunde typen: `string`, `number`, `boolean`, `array`, `object`. Kies het type bij het aanmaken of bewerken van een variabele.

## Globale variabelen delen

U kunt een globale variabele delen met andere gebruikers of [Teams](./teams.md), zodat zij deze in hun eigen workflows kunnen gebruiken.

- **Delen met gebruiker** – Klik op het deelpictogram naast een variabele die u bezit, voer het e-mailadres van de ontvanger in en klik op **Share**. De ontvanger ziet de variabele in de lijst met globale variabelen met een **Shared**-badge en het label "Shared by &lt;uw e-mailadres&gt;".
- **Delen met team** – Selecteer in het deelvenster een team en klik op **Add**. Alle teamleden krijgen toegang.
- **Bewerkbare toegang** – Ontvangers kunnen de gedeelde variabele bekijken, bewerken en er via `$global.variableName` naar verwijzen in hun workflows. Alleen de eigenaar kan de variabele delen, het delen ongedaan maken of verwijderen.
- **Naamconflicten** – Als een ontvanger al een variabele met dezelfde naam heeft, krijgt de eigen variabele voorrang op de gedeelde variabele.
- **Delen ongedaan maken** – Open het deelvenster voor de variabele en klik op de **×**-knop naast de gebruiker voor wie u de toegang wilt intrekken.

## Chat-integratie

Globale variabelen zijn beschikbaar voor de [Chat](../tabs/chat-tab.md)-assistent. Het LLM kan ernaar verwijzen bij het beantwoorden van vragen of het genereren van content.

## Gerelateerd

- [Tabblad Variabelen](../tabs/global-variables-tab.md) – Beheer globale variabelen in de UI
- [Variabele-node](../nodes/variable-node.md) – Variabelen instellen met `isGlobal`
- [Expression DSL](./expression-dsl.md) – `$global`-syntaxis
