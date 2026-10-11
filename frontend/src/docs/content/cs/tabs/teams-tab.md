# Karta Teams

Karta **Teams** vám umožňuje vytvářet a spravovat týmy pro sdílení workflow, přihlašovacích údajů, proměnných, vektorových úložišť a souborů Drive se skupinami uživatelů.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Přehrát ukázku Teams</a></p>

## Vytvoření týmu

1. Klikněte na **New Team**
2. Zadejte název a volitelný popis
3. Klikněte na **Create**

Automaticky se stáváte tvůrcem týmu a jeho prvním členem.

## Správa členů

- **Přidat člena** – V dialogu s detailem týmu zadejte e-mail uživatele a klikněte na **Add**
- **Odebrat člena** – Klikněte na X vedle člena (tvůrce nelze odebrat)
- **Upravit tým** – Tvůrci mohou upravovat název a popis
- **Smazat tým** – Tvůrci mohou tým smazat; všechna sdílení týmu budou odstraněna
- **Sdílené prostředky** – Dialog s detailem týmu zobrazuje workflow, přihlašovací údaje, proměnné, vektorová úložiště, soubory Drive, šablony workflow a šablony uzlů sdílené s týmem. Kliknutím na workflow jej otevřete v editoru; pro ostatní prostředky přepněte na příslušnou kartu.

## Sdílení s týmy

Sdílejte prostředky s týmy z:

- **Workflows** – Dialog sdílení v editoru workflow
- **Workflow Templates** – Dialog sdílení při vytváření/úpravě šablony workflow (viditelnost: Specific users)
- **Node Templates** – Dialog sdílení při vytváření/úpravě šablony uzlu (viditelnost: Specific users)
- **Credentials** – Dialog sdílení na kartě Credentials
- **Variables** – Dialog sdílení na kartě Variables
- **Vector Stores** – Dialog sdílení na kartě Vectors
- **Dashboards** – Nastavení dashboardu na kartě Dashboard (read nebo write)
- **Drive Files** – Dialog sdílení na kartě Drive nebo operace uzlu Drive `shareWithMyTeams` / `unshareWithMyTeams`

Když sdílíte s týmem, získávají přístup všichni členové týmu. Podrobnosti naleznete v části [Teams](../reference/teams.md).

Když sdílíte workflow s týmem, sdílejte se stejným týmem také přihlašovací údaje a podřízené workflow, na kterých toto workflow závisí. Přístup k workflow sám o sobě neuděluje přístup k přihlašovacím údajům ani k podřízenému workflow.

## Integrace chatu

AI asistent na [kartě Chat](./chat-tab.md) dokáže vypsat vaše týmy. Zeptejte se "my teams" a zobrazí se vám týmy, do kterých patříte.

## Související

- [Teams](../reference/teams.md) – Referenční příručka Teams a model sdílení
- [Credentials Sharing](../reference/credentials-sharing.md) – Sdílení přihlašovacích údajů s uživateli a týmy
- [Workflow Organization](../reference/workflow-organization.md) – Složky a sdílení
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou pro dashboardové plochy
