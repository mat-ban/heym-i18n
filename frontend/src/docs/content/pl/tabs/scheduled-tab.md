# Zakładka Harmonogramy

Zakładka **Harmonogramy** wyświetla wszystkie aktywne workflow cron na wizualnym kalendarzu. Przełączaj się między widokami dnia, tygodnia i miesiąca, aby zobaczyć, kiedy zaplanowano uruchomienie automatyzacji.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Obejrzyj demonstrację Harmonogramów</a></p>

## Widoki

- **Dzień** – Oś czasu godzina po godzinie dla wybranego dnia; każde wystąpienie pojawia się jako blok o zaplanowanej godzinie
- **Tydzień** – Siatka siedmiu kolumn obejmująca bieżący tydzień; bloki układają się jeden na drugim, gdy wiele workflow uruchamia się o tej samej godzinie
- **Miesiąc** – Pełna siatka miesiąca; każda komórka zawiera listę workflow zaplanowanych do uruchomienia w danym dniu

## Bloki workflow

Każdy blok wyświetla:

- **Nazwę workflow** – Kliknij, aby bezpośrednio otworzyć canvas workflow
- **Wyrażenie cron** – Widoczne po najechaniu kursorem, pokazujące surowy harmonogram (np. `0 9 * * 1-5`)

## Nawigacja

Administratorzy instancji wymienieni w `HEYM_ADMIN_EMAILS` widzą harmonogramy wszystkich właścicieli, gdy opcja **Pokaż wszystkie workflow** jest zaznaczona. Odznacz ją, aby zobaczyć tylko własne workflow. Pozostali użytkownicy zachowują opcję **Pokaż udostępnione mi**. Aby wycofać automatyzację pracownika, należy użyć [kontrolek administracji instancji](./workflows-tab.md#instance-administration) w podglądzie Workflows, aby wstrzymać lub wznowić triggery.

- Użyj strzałek **poprzedni / następny**, aby przechodzić między dniami, tygodniami lub miesiącami
- Przycisk **Dzisiaj** natychmiast powraca do bieżącej daty

## Powiązane

- [Węzeł Cron](../nodes/cron-node.md) – Konfiguracja triggerów harmonogramu na canvas
- [Zakładka Workflows](./workflows-tab.md) – Zarządzanie i organizacja wszystkich workflow
- [Zakładka Analityka](./analytics-tab.md) – Metryki i trendy wykonań
