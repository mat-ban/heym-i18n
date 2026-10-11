# Human-in-the-Loop

Human-in-the-Loop (HITL) gør det muligt for en [Agent Node](../nodes/agent-node.md) at anmode om godkendelse på specifikke tidspunkter, vente på en menneskelig beslutning og derefter fortsætte workflowet fra det samme udførelsesøjeblik.

## Hvad Det Gør

- Tilføjer eksplicitte godkendelsespunkter til en agent uden at skulle bygge et separat godkendelsesworkflow
- Opretter en engangs offentlig gennemgangs-URL på `/review/{token}`
- Giver en gennemganger mulighed for at `Acceptere`, `Redigere & Fortsætte` eller `Afvise`
- Marker kørslen som `pending`, indtil en beslutning modtages
- Genoptager den pausede kørsel og lader agenten fortsætte efter godkendelse
- Understøtter flere sekventielle HITL-kontrolpunkter i samme agentkørsel

## Agentkonfiguration

Aktivér HITL i agentens egenskabspanel.

| Indstilling | Beskrivelse |
|---------|-------------|
| `hitlEnabled` | Aktiverer menneskelig gennemgang for denne agent |
| `hitlSummary` | Retningslinjer for godkendelse, der beskriver, hvornår agenten skal anmode om menneskelig gennemgang |

HITL tilføjer et `request_human_review` værktøj til agenten. Brug systemprompten og `hitlSummary`-retningslinjerne til at fortælle agenten, hvilke handlinger der kræver godkendelse. Når agenten beslutter, at et kontrolpunkt kræver gennemgang, sender den en enkelt Markdown-gennemgangstekst til mennesket. Den gennemgangsoversigt, der vises for gennemgangeren, genereres fra agentens anmodning ved runtime; hvis agenten udelader den, udleder Heym en fra Markdown-teksten. I v1 understøtter HITL kun tekstbaserede agentoutputs, så det kan ikke kombineres med `jsonOutputEnabled`.

For MCP-værktøjer beder Heym modellen om at fortolke de skrevne HITL-instruktioner til et af tre godkendelsesomfang:

- `always` for udtryk som "altid", "ved hver" eller "for hver"
- `once` for udtryk som "én gang" eller "kun én gang"
- `never` for udtryk som "aldrig", "spørg ikke" eller "allerede godkendt"

Denne fortolkning styrer, om gentagne MCP-kald pauser igen, forbliver godkendt én gang eller springer menneskelig gennemgang helt over.

Når HITL er aktiveret, eksponerer agenten også en anden canvas-output-håndtag mærket `review`. Brug den gren til at sende den afventende gennemgangs-URL og oversigt til Slack, e-mail, logføring eller enhver anden notifikationsflow, mens hovedkørslen venter på en person.

## Gennemgangsflow

1. Agenten når et godkendelseskrævende trin og kalder `request_human_review`
2. Heym opretter en offentlig gennemgangsanmodning og returnerer en gennemgangs-URL
3. Eventuelle noder forbundet til agentens `review`-håndtag kører umiddelbart med den afventende HITL-payload
4. Workflow-kørslen flyttes til `pending`
5. En gennemganger åbner `/review/{token}` uden at logge ind
6. Gennemgangeren vælger én handling:
   - `Accepter` fortsætter med den originale Markdown
   - `Rediger & Fortsæt` fortsætter med den redigerede Markdown
   - `Afvis` fortsætter med `decision: "refused"` og springer yderligere agenthandling over
7. Heym genoptager workflowet fra den gemte snapshot og lader agenten fortsætte med den godkendte Markdown-kontekst
8. Hvis et senere trin også kræver godkendelse, kan agenten kalde HITL igen og oprette et nyt afventende kontrolpunkt

Gennemgangslinks udløber efter 168 timer, hvis ingen svarer.

## Offentlig Gennemgangsside

Den offentlige gennemgangsside viser:

- Workflow-navnet og agentetiketten
- En automatisk genereret gennemgangsoversigt fra agentens gennemgangsanmodning
- Markdown-gennemgangsteksten først som hovedindhold
- En redigeringsboks, der kun åbnes, når gennemgangeren klikker på `Rediger`
- En live Markdown-forhåndsvisning under redigering
- Handlingsknapper til `Accepter`, `Rediger & Fortsæt` og `Afvis`

Når en beslutning er indsendt, låses tokenet og kan ikke genbruges.

## Outputs og Kørselsstatus

Mens der ventes på gennemgang, indeholder agentoutputtet en afventende payload:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Efter at gennemgangeren har svaret og workflowet er genoptaget, inkluderer det endelige agentoutput beslutningsmetadata:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Brug `$agentLabel.decision` i nedstrømsnoder til at forgrene sig på accepterede, redigerede eller afviste udfald.

## Canvas Gennemgangsgren

`review`-outputhåndtaget er kun tilgængeligt, når `hitlEnabled` er aktiveret for en agent.

- Det kører, før den menneskelige beslutning modtages
- Det modtager den afventende HITL-payload, inklusive `summary`, `draftText`, `reviewUrl`, `shareText` og `shareMarkdown`
- Det er beregnet til notifikations- eller overdragelsestrin som Slack, e-mail eller revisionslogning
- Det kører én gang for hvert HITL-kontrolpunkt
- Det kører ikke igen efter at gennemgangeren har svaret; kun den normale agentoutputsti fortsætter ved genoptagelse
## Hvor det vises

- [Kørselshistorik](./execution-history.md) viser `pending`-kørsler med det samme og gemmer gennemgangs-URL'en i noderesultater
- [Portal](./portal.md) chat-svar viser linket til menneskelig gennemgang i stedet for et tomt svar
- Debug-panelet og historik-dialoger viser den endelige HITL-beslutning og den gennemgåede tekst
- Review-output-handlen kan underrette eksterne kanaler, selv når workflowet blev udløst af cron, curl eller portal-trafik
- Flere HITL-checkpoints genbruger den samme kørselshistorikpost, mens der oprettes et nyt engangs-gennemgangslink for hver pause

## Nuværende begrænsninger

- HITL er kun tilgængelig på Agent-noder
- HITL bruger agentens tekstoutput og understøtter ikke JSON-output i v1
- En sat på pause kørsel genoptages fra den gemte workflow-snapshot, ikke den senest redigerede workflow-version
- Indlejrede under-workflows kan ikke indtræde i en pending HITL-tilstand i v1; anmod om gennemgang fra den overordnede agent før de kaldes

## Relateret

- [Agent Node](../nodes/agent-node.md) - Konfigurer HITL på en agent
- [Agentarkitektur](./agent-architecture.md) - Hvordan agenter, værktøjer, underagenter og HITL hænger sammen
- [Kørselshistorik](./execution-history.md) - Inspicer pending- og genoptagede kørsler
- [Board](../tabs/board-tab.md) - Board-kædekørsler sætter kortet i en pending (gul) tilstand ved HITL
- [Portal](./portal.md) - Offentlige chatflows og HITL-gennemgangslinks
