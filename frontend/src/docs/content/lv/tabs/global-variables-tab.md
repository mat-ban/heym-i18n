# Mainīgo cilne

**Mainīgo** cilne pārvalda **Globālo mainīgo krātuvi** – pastāvīgu atslēgu-vērtību datus, kas tiek kopīgi izmantoti visos Jūsu workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Skatīt mainīgo demonstrāciju</a></p>

## Pārskats

- Izveidojiet, rediģējiet un dzēsiet globālos mainīgos
- Mainīgie ir lietotāja kontekstā un saglabājas visās workflow izpildēs
- Atsaucieties izteiksmēs, izmantojot `$global.variableName`

## Mainīgā izveide

1. Noklikšķiniet uz **Jauns mainīgais**
2. Ievadiet **nosaukumu** (izmanto izteiksmēs)
3. Iestatiet **vērtību** (virkne, skaitlis, loģiska vērtība, masīvs vai objekts)
4. Izvēlieties **vērtības tipu** (Automātiski, Virkne, Skaitlis, Loģiska vērtība, Masīvs, Objekts)

## Rediģēšana un dzēšana

- **Rediģēt** – Noklikšķiniet uz rediģēšanas ikonas mainīgā rindā
- **Dzēst** – Noklikšķiniet uz atkritumu ikonas; workflows, kas to izmanto, būs jāaizvieto
- **Masveida dzēšana** – Izvēlieties vairākus mainīgos un izmantojiet **Dzēst izvēlētos**

## Izmantošana workflows

Atsaucieties uz mainīgajiem jebkurā izteiksmē:

```
$global.environment
$global.settings.baseUrl
```

Jūs varat arī iestatīt globālos mainīgos no [Mainīgā mezgla](../nodes/variable-node.md), iespējjojot **Saglabāt Globālajā mainīgo krātuvē**.

## Saistītie

- [Globālie mainīgie](../reference/global-variables.md) – Atsauces rokasgrāmata
- [Mainīgā mezgls](../nodes/variable-node.md) – Iestatiet mainīgos ar `isGlobal`
- [Izteiksmju DSL](../reference/expression-dsl.md) – `$global` sintakse
- [Čata cilne](./chat-tab.md) – Čats var piekļūt globālajiem mainīgajiem
- [Kontekstualizēta demonstrācija](../reference/contextual-showcase.md) – Kompakta lapas rokasgrāmata informācijas paneļa virsmām
