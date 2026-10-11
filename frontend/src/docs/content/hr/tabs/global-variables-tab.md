# Kartica Varijable

Kartica **Varijable** upravlja **Globalnim Spremištem Varijabli** – trajnim ključ-vrijednost podacima koji se dijele među svim Vašim workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Pogledajte demo Varijabli</a></p>

## Pregled

- Kreirajte, uređujte i brišite globalne varijable
- Varijable su korisnički opsežene i traju kroz izvršavanja workflows-a
- Referencirajte u izrazima putem `$global.variableName`

## Kreiranje Varijable

1. Kliknite **Nova Varijabla**
2. Unesite **ime** (koristi se u izrazima)
3. Postavite **vrijednost** (string, broj, boolean, niz ili objekt)
4. Odaberite **tip vrijednosti** (Automatski, String, Broj, Boolean, Niz, Objekt)

## Uređivanje i Brisanje

- **Uredi** – Kliknite ikonu za uređivanje na redu varijable
- **Briši** – Kliknite ikonu za smeće; workflows koji je koriste trebaju zamjenu
- **Masovno brisanje** – Odaberite više varijabli i koristite **Briši odabrano**

## Korištenje u Workflows

Referencirajte varijable u bilo kojem izrazu:

```
$global.environment
$global.settings.baseUrl
```

Također možete postaviti globalne varijable iz [Variable node](../nodes/variable-node.md) omogućavanjem **Spremi u Globalno Spremište Varijabli**.

## Povezano

- [Globalne Varijable](../reference/global-variables.md) – Vodič za referencu
- [Variable Node](../nodes/variable-node.md) – Postavite varijable s `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – `$global` sintaksa
- [Chat Kartica](./chat-tab.md) – Chat može pristupiti globalnim varijablama
- [Kontekstualna Izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče
