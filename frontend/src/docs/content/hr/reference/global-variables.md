# Globalne Varijable

**Globalna Spremišta Varijabli** drže trajne, korisnički opsežne ključ-vrijednost podatke koji opstaju kroz izvršavanja workflow-a. Koristite ih za konfiguraciju, oznake značajki, brojače ili zajedničko stanje koje više workflow-a trebaju.

> **Nemojte ovdje pohranjivati tajne.** Globalne varijable nisu spremište za tajne: vrijednosti se pohranjuju nešifrirane, vraćaju se u cijelosti svima s kojima ih dijelite, a suradnici ih mogu uređivati. API ključevi, lozinke i tokeni pripadaju [Vjerodajnicama](./credentials.md), koje ih šifriraju u mirovanju i nikada ne vraćaju tajnu klijentu.

## Lokalno vs Globalno

| Spremište | Sintaksa | Opseg | Trajnost |
|-----------|----------|-------|----------|
| **Lokalno za Workflow** | `$vars.variableName` | Samo trenutno izvršavanje | U memoriji, izgubljeno kada izvršavanje završi |
| **Globalno** | `$global.variableName` | Svi workflow-i za korisnika | Pohranjeno u bazi podataka |

## Kreiranje Globalnih Varijabli

1. **Iz kartice Varijable** – [Kartica Varijable](../tabs/global-variables-tab.md): Kreirajte, uređujte i brišite varijable izravno.
2. **Iz čvora Varijable** – Omogućite **Pohrani u Globalno Spremište Varijabli** (`isGlobal: true`) u svojstvima čvora. Varijabla se zapisuje u spremište kada se workflow izvršava.

## Korištenje u Izrazima

Pristupite globalnim varijablama s `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Koristite iste metode kao i za lokalne varijable workflow-a (npr. `.upper()`, `.length`, `.add()` za nizove).

## Tipovi Vrijednosti

Podržani tipovi: `string`, `number`, `boolean`, `array`, `object`. Odaberite tip prilikom kreiranja ili uređivanja varijable.

## Dijeljenje Globalnih Varijabli

Možete dijeliti globalnu varijablu s drugim korisnicima ili [Timovima](./teams.md) kako bi je mogli koristiti u svojim vlastitim workflow-ima.

- **Dijeli s korisnikom** – Kliknite ikonu dijeljenja pored varijable koju posjedujete, unesite e-mail primatelja i kliknite **Dijeli**. Primatelj će vidjeti varijablu u svom popisu Globalnih Varijabli s oznakom **Dijeljeno** i oznakom "Dijeljeno od &lt;vaš e-mail&gt;".
- **Dijeli s timom** – U dijaloškom okviru za dijeljenje, odaberite tim i kliknite **Dodaj**. Svi članovi tima dobivaju pristup.
- **Pristup za uređivanje** – Primatelji mogu pregledavati, uređivati i referencirati dijeljenu varijablu putem `$global.variableName` u svojim workflow-ima. Samo vlasnik može dijeliti, ukinuti dijeljenje ili obrisati varijablu.
- **Sukobi imena** – Ako primatelj već ima varijablu s istim imenom, njihova vlastita varijabla ima prednost nad dijeljenom.
- **Ukinuti dijeljenje** – Otvorite dijaloški okvir za dijeljenje varijable i kliknite gumb **×** pored korisnika kojem želite ukloniti pristup.

## Integracija s Chat-om

Globalne varijable su dostupne asistentu [Chat](../tabs/chat-tab.md). LLM ih može referencirati prilikom odgovaranja na pitanja ili generiranja sadržaja.

## Povezano

- [Kartica Varijable](../tabs/global-variables-tab.md) – Upravljanje globalnim varijablama u UI-u
- [Čvor Varijable](../nodes/variable-node.md) – Postavljanje varijabli s `isGlobal`
- [Expression DSL](./expression-dsl.md) – `$global` sintaksa
