# Karta Šablony

Karta Šablony vám umožňuje ukládat, procházet a znovu používat kompletní workflow a jednotlivé uzly. Sdílejte něco, co jste jednou vytvořili, a použijte to v nových projektech jedním kliknutím.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Přehrát ukázku Šablon</a></p>

## Přehled

Existují dva typy šablon:

- **Šablony workflow** — uložte kompletní workflow (všechny uzly a propojení) jako znovupoužitelný výchozí bod.
- **Šablony uzlů** — uložte jeden nakonfigurovaný uzel (např. vyladěný uzel LLM nebo vlastní HTTP uzel) pro opětovné použití v různých workflow.

Přepínejte mezi nimi pomocí přepínače **Workflows / Nodes** v horní části karty.

Pomocí vyhledávacího pole filtrujte viditelné šablony podle názvu, popisu, tagů nebo typu uzlu.

---

## Vytvoření šablony

### Šablona workflow

1. Otevřete workflow, které chcete sdílet, v editoru.
2. Klikněte na **Share as Template** v horní liště nástrojů.
3. Vyplňte název, popis a volitelné tagy.
4. Zvolte viditelnost: **Everyone** (všichni uživatelé) nebo **Specific users** (zadejte uživatelská jména a/nebo vyberte týmy).
5. Klikněte na **Share**. Zelené oznámení potvrdí úspěch.

### Šablona uzlu

1. Klikněte pravým tlačítkem na libovolný uzel na plátně.
2. Vyberte **Share as Template** z kontextové nabídky.
3. Vyplňte formulář a klikněte na **Share**.

---

## Použití šablony

### Šablona workflow

1. Otevřete kartu **Templates** a ujistěte se, že je vybráno **Workflows**.
2. Klikněte na kartu pro náhled, nebo klikněte přímo na **Use**.
3. Workflow se naklonuje do nového workflow, které se otevře v editoru.

### Šablona uzlu

1. Otevřete kartu **Templates** a vyberte **Nodes**.
2. Klikněte na **Use** na kartě šablony uzlu.
3. Zobrazí se dialog — zvolte, kam přidat uzel:
   - **New workflow** — vytvoří nové workflow obsahující pouze tento uzel.
   - **Existing workflow** — vyberte ze seznamu svých workflow; uzel se automaticky vloží při otevření editoru.

---

## Náhled

Kliknutím na libovolnou kartu šablony otevřete úplný náhled:

- **Miniatury karet** — karty šablon zobrazují přizpůsobený snímek plátna pouze pro čtení, a to jak pro workflow, tak pro šablony jednotlivých uzlů.
- **Šablony workflow** — plátno pouze pro čtení, které odpovídá stylu náhledu historie úprav, včetně posouvání a zoomu.
- **Šablony uzlů** — uložený uzel se otevře na stejném plátně pouze pro čtení jako náhled jednoho uzlu.
- **Podrobnosti uzlu** — klikněte na libovolný uzel v náhledu pro zobrazení jeho uložené konfigurace v bočním panelu.
- Tagy, počet použití a **vlastník** jsou zobrazeny u všech šablon.

Stiskněte **ESC** nebo klikněte mimo pro zavření náhledu.

---

## Správa šablon

- **Edit** – Pokud jste vlastníkem šablony, najeďte na kartu a klikněte na ikonu tužky pro aktualizaci názvu, popisu, tagů nebo viditelnosti
- **Delete** – Pokud jste vlastníkem šablony, najeďte na kartu a po potvrzovací výzvě šablonu smažte
- **Akce pouze pro vlastníka** – Ovládací prvky pro úpravu a smazání se zobrazují pouze u šablon, které jste vytvořili

---

## Paleta příkazů (CTRL+K)

Šablony (jak workflow, tak uzly) jsou vyhledatelné z palety příkazů **CTRL+K**. Vyberte šablonu pro okamžité použití — šablony workflow se otevřou v editoru, šablony uzlů vyzvou k výběru cíle.

---

## Šablony v Chatu

Můžete se AI ptát na otázky týkající se vašich šablon — zná všechny šablony ve vašem pracovním prostoru.

---

## Viditelnost

| Nastavení | Kdo ji vidí |
|---|---|
| Everyone | Všichni uživatelé na platformě |
| Specific users | Uživatelé, které uvedete jménem, a/nebo týmy, které vyberete — všichni členové týmu získají přístup |

Při sdílení s **Specific users** můžete přidat jak jednotlivé uživatele (jménem), tak týmy. Členové týmu vidí šablonu na kartě Templates a mohou ji použít.

---

## Související

- [Teams](../reference/teams.md) – Sdílení šablon s týmy
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Krátký průvodce stránkou pro karty dashboardu
