# Kontextový přehled

**Kontextový přehled** je odlehčený průvodce přímo v aplikaci, který vysvětluje stránku, na které se právě nacházíte, aniž by Vás okamžitě vtáhl do plnohodnotného dokumentačního toku.

## Co dělá

- Zobrazuje krátké shrnutí pro aktuální stránku
- Udržuje první vrstvu stručnou, abyste nebyli přetíženi
- Umožňuje rozbalit malé množství doplňujících informací pouze v případě potřeby
- Odkazuje na úplnou stránku dokumentace pro hlubší studium

## Kde se zobrazuje

Ve verzi v1 je přehled dostupný na autentizovaných hlavních plochách Heymu:

- Záložky Dashboardu
- [Evaluace](../tabs/evals-tab.md)
- [Dokumentace](../getting-started/introduction.md)
- Canvas editoru workflow

Veřejné stránky, jako jsou přihlášení, registrace, chat portál a HITL review, přehled nezobrazují.

## Přístup

### Desktop

- Na pravém okraji obrazovky se zobrazuje pevný trigger **Page Guide**
- Přehled se otevírá jako postranní panel na pravé straně
- Ve výchozím stavu zůstává zavřený
- Jednorázový teaser pomáhá odhalit, že průvodce existuje, aniž by se vynucovalo jeho otevření

### Mobil

- Stejný obsah je dostupný prostřednictvím plovoucího tlačítka **Page Guide**
- Otevírá se ve spodním panelu namísto pravého postranního panelu

## Model obsahu

Každý záznam přehledu používá strukturovanou definici namísto plně vlastní komponenty.

- **Název** – Co je tato stránka
- **Shrnutí** – Jedno krátké vysvětlení
- **Odrážky** – Několik snadno čitelných vodítek
- **Zvýraznění** – Malé karty pro klíčovou hodnotu nebo vzory použití
- **Více podrobností** – Sbalené sekce pro doplňující kontext
- **Akce** – Obvykle jeden nebo dva odkazy, nejčastěji na úplnou dokumentaci

Díky tomu zůstává systém flexibilní a zároveň se vyhýbá dlouhým a rušivým panelům nápovědy.

## Kontextové povědomí

Přehled se mění podle aktuální plochy.

- Každá záložka Dashboardu má vlastní shrnutí
- Editor odkazuje na [Canvas Features](./canvas-features.md)
- Stránka dokumentace používá obecný přehled dokumentace a pokud možno odkazuje na aktuální článek, který již máte otevřený

## Uchovávání stavu

Přehled ukládá malé množství osobního stavu UI do úložiště prohlížeče:

- Zda byl panel nebo spodní panel naposledy otevřen
- Které kontexty stránky již zobrazily teaser
- Poslední rozbalenou sekci podrobností pro každý kontext

## Proč existuje

Cílem je usnadnit učení Heymu bez přidávání dalších těžkopádných UI prvků.

- Krátké pokyny vždy nablízku pro orientaci
- Jasná cesta k hlubší dokumentaci
- Nízké vyrušení pro zkušené uživatele

## Související

- [Záložka Workflows](../tabs/workflows-tab.md) – Hlavní plocha Dashboardu
- [Záložka Evaluace](../tabs/evals-tab.md) – Evaluační workflow
- [Canvas Features](./canvas-features.md) – Chování editoru a ladění
- [Quick Drawer](./quick-drawer.md) – Další pevná užitná plocha na pravé straně
