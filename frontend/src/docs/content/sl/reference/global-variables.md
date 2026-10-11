# Globalne Spremenljivke

**Shramba globalnih spremenljivk** hrani trajne, uporabniško usmerjene podatke v obliki ključ-vrednost, ki preživijo med izvajanji workflow-ov. Uporabite jo za konfiguracijo, funkcijske zastavice, števce ali skupno stanje, ki ga potrebujejo več workflow-ov.

> **Tukaj ne shranjujte skrivnosti.** Globalne spremenljivke niso zakladnica skrivnosti: vrednosti so shranjene nešifrirane, vrnjene so v celoti vsakomur, s katerim jih delite, in sodelavci jih lahko urejajo. API ključi, gesla in tokeni spadajo v [Poverilnice](./credentials.md), ki jih šifrira v mirovanju in nikoli ne vrne skrivnosti odjemalcu.

## Lokalno proti Globalno

| Shramba | Sintaksa | Obseg | Trajnost |
|---------|----------|-------|----------|
| **Lokalno za Workflow** | `$vars.variableName` | Le trenutna izvedba | V pomnilniku, izgubljeno ob koncu izvedbe |
| **Globalno** | `$global.variableName` | Vsi workflow-ji za uporabnika | Shranjeno v bazi podatkov |

## Ustvarjanje Globalnih Spremenljivk

1. **Iz zavihka Spremenljivke** – [Zavihek Spremenljivke](../tabs/global-variables-tab.md): Ustvarite, uredite in izbrišite spremenljivke neposredno.
2. **Iz vozlišča Spremenljivka** – Omogočite **Shrani v Globalno Shrambo Spremenljivk** (`isGlobal: true`) v lastnostih vozlišča. Spremenljivka se zapiše v shrambo, ko se workflow izvede.

## Uporaba v Izrazih

Dostopajte do globalnih spremenljivk z `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Uporabite iste metode kot za lokalne spremenljivke workflow (npr. `.upper()`, `.length`, `.add()` za tabele).

## Tipi Vrednosti

Podprti tipi: `string`, `number`, `boolean`, `array`, `object`. Izberite tip pri ustvarjanju ali urejanju spremenljivke.

## Deljenje Globalnih Spremenljivk

Globalno spremenljivko lahko delite z drugimi uporabniki ali [Timom](./teams.md), da jo lahko uporabijo v svojih workflow-ih.

- **Delite z uporabnikom** – Kliknite ikono za deljenje poleg lastne spremenljivke, vnesite e-poštni naslov prejemnika in kliknite **Deli**. Prejemnik bo videl spremenljivko v svojem seznamu Globalnih Spremenljivk z oznako **Deli** in oznako "Deli &lt;vaš e-poštni naslov&gt;".
- **Delite s timom** – V pogovornem oknu za deljenje izberite tim in kliknite **Dodaj**. Vsi člani tima pridobijo dostop.
- **Urejevalni dostop** – Prejemniki lahko ogledajo, uredijo in se sklicujejo na deljeno spremenljivko prek `$global.variableName` v svojih workflow-ih. Le lastnik lahko deli, prekliče deljenje ali izbriše spremenljivko.
- **Konflikti imen** – Če ima prejemnik že spremenljivko z istim imenom, njegova lastna spremenljivka prevlada nad deljeno.
- **Preklic deljenja** – Odprite pogovorno okno za deljenje spremenljivke in kliknite gumb **×** poleg uporabnika, za katerega želite odstraniti dostop.

## Integracija s Chatom

Globalne spremenljivke so na voljo asistentu [Chat](../tabs/chat-tab.md). LLM jih lahko uporablja pri odgovarjanju na vprašanja ali generiranju vsebine.

## Sorodno

- [Zavihek Spremenljivke](../tabs/global-variables-tab.md) – Upravljanje globalnih spremenljivk v uporabniškem vmesniku
- [Vozlišče Spremenljivka](../nodes/variable-node.md) – Nastavite spremenljivke z `isGlobal`
- [Izraz DSL](./expression-dsl.md) – Sintaksa `$global`
