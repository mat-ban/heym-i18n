# Karta Šablóny

Karta Šablóny vám umožňuje ukladať, prehliadať a opätovne používať kompletné workflowy a jednotlivé uzly. Zdieľajte niečo, čo ste raz vytvorili, a aplikujte to na nové projekty jedným kliknutím.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Pozrite si ukážku Šablón</a></p>

## Prehľad

Existujú dva typy šablón:

- **Šablóny workflowov** — uložte kompletné workflow (všetky uzly a prepojenia) ako opakovane použiteľný východiskový bod.
- **Šablóny uzlov** — uložte jeden nakonfigurovaný uzol (napr. vyladený uzol LLM alebo vlastný HTTP uzol) na opakované použitie v rôznych workflowoch.

Medzi oboma typmi prepínajte pomocou prepínača **Workflows / Nodes** v hornej časti karty.

Pomocou vyhľadávacieho panela filtrujte viditeľné šablóny podľa názvu, popisu, tagov alebo typu uzla.

---

## Vytvorenie šablóny

### Šablóna workflowu

1. Otvorte vo editore workflow, ktorý chcete zdieľať.
2. Kliknite na **Share as Template** v hornej lište nástrojov.
3. Vyplňte názov, popis a voliteľné tagy.
4. Zvoľte viditeľnosť: **Everyone** (všetci používatelia) alebo **Specific users** (zadajte používateľské mená a/alebo vyberte tímy).
5. Kliknite na **Share**. Zelené oznámenie potvrdí úspech.

### Šablóna uzla

1. Kliknite pravým tlačidlom na ľubovoľný uzol na plátne.
2. V kontextovom menu vyberte **Share as Template**.
3. Vyplňte formulár a kliknite na **Share**.

---

## Použitie šablóny

### Šablóna workflowu

1. Otvorte kartu **Templates** a uistite sa, že je vybraná možnosť **Workflows**.
2. Kliknutím na kartu zobrazíte náhľad alebo kliknite priamo na **Use**.
3. Workflow sa naklonuje do nového workflowu, ktorý sa otvorí v editore.

### Šablóna uzla

1. Otvorte kartu **Templates** a vyberte **Nodes**.
2. Na karte šablóny uzla kliknite na **Use**.
3. Zobrazí sa dialógové okno — vyberte, kam pridať uzol:
   - **New workflow** — vytvorí nové workflow obsahujúce iba tento uzol.
   - **Existing workflow** — vyberte zo zoznamu svojich workflowov; uzol sa automaticky vloží pri otvorení editora.

---

## Náhľad

Kliknutím na ľubovoľnú kartu šablóny otvoríte úplný náhľad:

- **Miniatúry kariet** — karty šablón zobrazujú prispôsobený náhľad plátna iba na čítanie pre workflowy aj šablóny s jedným uzlom.
- **Šablóny workflowov** — plátno iba na čítanie, ktoré zodpovedá štýlu náhľadu histórie úprav, vrátane posúvania a priblíženia.
- **Šablóny uzlov** — uložený uzol sa otvorí na tom istom plátne iba na čítanie ako náhľad s jedným uzlom.
- **Podrobnosti uzla** — kliknutím na ľubovoľný uzol v náhľade si v bočnom paneli prezriete jeho uloženú konfiguráciu.
- Tagy, počet použití a **vlastník** sa zobrazujú pri všetkých šablónach.

Náhľad zatvoríte stlačením **ESC** alebo kliknutím mimo neho.

---

## Správa šablón

- **Edit** – Ak ste vlastníkom šablóny, prejdite kurzorom na kartu a kliknutím na ikonu ceruzky aktualizujte jej názov, popis, tagy alebo viditeľnosť
- **Delete** – Ak ste vlastníkom šablóny, prejdite kurzorom na kartu a po potvrdzujúcej výzve šablónu odstráňte
- **Akcie iba pre vlastníka** – Ovládacie prvky na úpravu a odstránenie sa zobrazujú iba pri šablónach, ktoré ste vytvorili

---

## Paleta príkazov (CTRL+K)

Šablóny (workflowov aj uzlov) sú vyhľadateľné z palety príkazov **CTRL+K**. Vyberte šablónu a okamžite ju použite — šablóny workflowov sa otvoria v editore, šablóny uzlov vyzvú na výber cieľa.

---

## Šablóny v Chate

Môžete klásť AI otázky o svojich šablónach — pozná všetky šablóny vo vašom pracovnom priestore.

---

## Viditeľnosť

| Nastavenie | Kto ju vidí |
|---|---|
| Everyone | Všetci používatelia na platforme |
| Specific users | Používatelia, ktorých uvediete podľa mena a/alebo tímy, ktoré vyberiete — prístup získa každý člen tímu |

Pri zdieľaní s **Specific users** môžete pridať jednotlivých používateľov (podľa mena) aj tímy. Členovia tímu vidia šablónu na karte Templates a môžu ju použiť.

---

## Súvisiace

- [Teams](../reference/teams.md) – Zdieľanie šablón s tímami
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Krátky sprievodca stránkou pre karty dashboardu
