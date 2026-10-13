# Rychlý panel

**Rychlý panel** je postranní panel pro rychlé spouštění workflow na pravé straně. Zobrazuje se na přihlášených stránkách, jako je karta [Workflow](../tabs/workflows-tab.md) na dashboardu, dokumentace a Evaluace.

## Přístup

- Klikněte na pevný přepínač **Quick / Workflows** na pravém středovém okraji obrazovky
- Pokud je k dispozici také [Kontextová showcase](./contextual-showcase.md), její přepínač **Page Guide** se nachází nad Quick Workflows
- Panel se otevírá zprava a posouvá aktuální stránku doleva s jemným přeškálováním
- Na mobilních zařízeních je Rychlý panel skrytý
- Panel se nezobrazuje v editoru workflow, na přihlašovacích/registračních stránkách, v portálu ani na stránkách HITL review

## Vyhledávání workflow

Pomocí filtrovacího pole v horní části panelu vyhledávejte workflow podle:

- Názvu workflow
- Popisu workflow

Vyhledávání nerozlišuje velká a malá písmena a seznam se aktualizuje okamžitě.

## Připnuté workflow

Připněte workflow, aby zůstala v horní části panelu.

- Připnutá workflow se zobrazují ve vlastní sekci nad úplným seznamem
- Nová připnutí se přidávají nahoru
- Pořadí připnutí je zachováno i po opětovném načtení díky úložišti prohlížeče

## Spouštění workflow

Vyberte workflow pro otevření jeho vstupního formuláře.

- Vstupní pole se zobrazují svisle v pořadí panelu
- Kliknutím na **Run Workflow** spustíte vybrané workflow
- Kliknutím na **Stop Workflow** zrušíte běžící spuštění z panelu
- Workflow bez vstupních polí lze spustit přímo
- Workflow, který začíná uzlem [File Upload Trigger](../nodes/file-upload-trigger-node.md), místo toho zobrazí zónu pro přetažení: přetáhněte do ní soubor nebo kliknutím soubor vyberte. Zóna uvádí typy a velikost souborů, které trigger přijímá, a ostatní soubory před nahráním odmítne. Tlačítko **Run Workflow** zůstává neaktivní, dokud není vybrán soubor.

Panel používá stejné API pro spouštění workflow jako ostatní běhová rozhraní Heym, takže výstupy a chování za běhu zůstávají konzistentní.

Zastavení běhu z panelu také zruší aktivní spuštění na backendu, včetně případné probíhající úlohy prohlížeče Playwright pro daný běh workflow.

## Průběh a výsledky

Po spuštění běhu panel zobrazuje:

- Streamovaný průběh kroků uzlů při jejich spouštění a dokončení
- Konečný stav: `success`, `error` nebo `pending`
- Konečné výstupy v kompaktním JSON panelu
- Záznamy v Historii označené `Quick Drawer`

`pending` znamená, že workflow čeká na pozdější akci, například na lidskou kontrolu.

Spuštění se souborem probíhá přes jednorázový nahrávací odkaz triggeru: panel požádá workflow o odkaz, nahraje na něj soubor a po dokončení nahrávání zobrazí výsledek. Spuštění se souborem zobrazují konečný stav a výstupy, ale nikoli průběh krok za krokem, a v historii jsou rovněž označena štítkem `Quick Drawer`. Vybraný soubor se po každém spuštění vymaže, protože jeden odkaz přijímá pouze jeden soubor.

## Úložiště prohlížeče

Rychlý panel ukládá osobní předvolby do `localStorage`:

- ID připnutých workflow
- Naposledy vybrané workflow

Panel v této verzi **neukládá** vstupní hodnoty.

## Rozsah

Rychlý panel je záměrně odlehčeným rozhraním pro spouštění.

- Zahrnuto: vyhledávání, připínání, výběr, vstup (včetně souboru), spuštění, průběh, výsledek
- Vyloučeno: vytváření a úpravy workflow, správa složek a akce na canvasu

## Související

- [Karta Workflow](../tabs/workflows-tab.md) – Hlavní seznam workflow, složky a správa
- [Rychlý start](../getting-started/quick-start.md) – Vytvořte a spusťte své první workflow
- [Historie spuštění](./execution-history.md) – Prohlížení minulých běhů
- [Webhooks](./webhooks.md) – Spouštění workflow přes HTTP
- [Kontextová showcase](./contextual-showcase.md) – Průvodce na úrovni stránky, který doplňuje Rychlý panel
