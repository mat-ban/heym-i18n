# Tastaturgenveje

Heym tilbyder tastaturgenveje i workflow-editoren og på canvas for at fremskynde almindelige handlinger.

## Globale editorgenveje

Disse genveje er aktive overalt i workflow-editoren.

| Genvej | Handling |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Åbn kommandopaletten |
| `Ctrl + I` / `Cmd + I` | Slå [AI-assistent](./ai-assistant.md)-panelet til/fra (virker under skrivning) |
| `Ctrl + Enter` / `Cmd + Enter` | Kør det aktuelle workflow |
| `Ctrl + S` / `Cmd + S` | Gem workflowet |
| `Ctrl + Z` / `Cmd + Z` | Fortryd |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Gendan |
| `Ctrl + Y` / `Cmd + Y` | Gendan (alternativ) |
| `Escape` | Luk åbne overlays, dialoger og paneler |

## Canvas-genveje

Disse genveje gælder, når canvas er i fokus (ingen tekstindtastning er aktiv).

### Valg og navigation

| Genvej | Handling |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Vælg alle noder |
| `Shift` (hold) | Træk for at vælge flere noder |
| `Ctrl` / `Cmd` (hold) | Klik for at tilføje individuelle noder til valget |
| `Escape` | Fravælg alle noder; luk inline-node-søgning |

### Redigering af noder

| Genvej | Handling |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Kopier valgte node(r) |
| `Ctrl + X` / `Cmd + X` | Klip valgte node(r) |
| `Ctrl + V` / `Cmd + V` | Indsæt node(r) |
| `Delete` eller `Backspace` | Slet valgte node(r) og/eller kant(er) |
| `D` | Slå valgte node(r) til/fra (aktiveret/deaktiveret) |
| `P` | Slå fastgjorte data til/fra på den valgte node |

### Inline-node-søgning

Ved at indtaste ethvert udskriveligt tegn på canvas (når ingen tekstindtastning er i fokus) åbnes inline-node-søgningspopup'en. Det indtastede tegn bliver det første tegn i søgeforespørgslen.

| Genvej | Handling |
|----------|--------|
| Ethvert udskriveligt tegn | Åbn inline-node-søgning og begynd at skrive |
| `Backspace` | Fjern det sidste tegn fra søgeforespørgslen |
| `Escape` | Luk inline-node-søgningen |

## Kommandopalet (`Ctrl + K`)

Kommandopaletten er tilgængelig fra editoren, dashboardet, dokumentationen og evalueringsvisningerne. Den giver mulighed for hurtigt at navigere til workflows, faner og dokumentationssider uden at forlade tastaturet.

| Genvej | Handling |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Åbn kommandopaletten |
| `↑` / `↓` | Naviger i resultatlisten |
| `Tab` / `Shift + Tab` | Naviger i resultatlisten |
| `Enter` | Åbn det valgte element |
| `Escape` | Luk paletten |

## Dashboard-genveje

Disse genveje er aktive på Workflows-fanen, når ingen anden tekstindtastning er aktiv.

| Genvej | Handling |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Fokuser på workflow-søgning |
| `Escape` | Ryd workflow-søgning, når den indeholder tekst |

## Egenskabspanel-genveje

Disse genveje er aktive, når en node er valgt, og egenskabspanellet er åbent.

| Genvej | Handling |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Åbn det linkede underworkflow i en ny fane (kun Execute-node) |

## Evaluering-dialog-genveje

Disse genveje er aktive, mens evalueringsdialogen er åben.

| Genvej | Handling |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Anvend udtryk og luk dialogen |
| `Ctrl + Z` / `Cmd + Z` | Fortryd ændringer i udtrykseditoren |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Gendan ændringer i udtrykseditoren |
| `Ctrl + Y` / `Cmd + Y` | Gendan ændringer i udtrykseditoren (alternativ) |

## Historik og kørselsgenveje

Disse genveje er tilgængelige i dialogen Eksekveringshistorik og panelet Kørsler.

| Genvej | Handling |
|----------|--------|
| `S` | Slå søgeindtastningen til/fra for at filtrere poster |

## Relateret

- [Canvas-funktioner](./canvas-features.md) – Fastgør data, aktiver/deaktiver, ekstraher til underworkflow
- [Workflow-struktur](./workflow-structure.md) – Node- og kantformat
- [Execute-node](../nodes/execute-node.md) – Kalder underworkflows (`Ctrl + Shift + O`)
- [Hurtig start](../getting-started/quick-start.md) – Byg det første workflow
