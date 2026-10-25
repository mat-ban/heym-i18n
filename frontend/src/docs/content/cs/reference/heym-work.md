# Heym Work

**Heym Work** je druhé rozhraní pro obchodní týmy, postavené na platformě Heym. Uživatelé popíší úkol vlastními slovy, zodpoví několik otázek a získají workflow, které Heym vytvořil a otestoval. Pracují na stránkách navržených přímo pro ně, vyřizují schvalování a vidí každé spuštění označené jménem zadavatele. Heym spouští každý úkol na pozadí.

Heym Work běží jako samostatný kontejner vedle Heym s oddělenou licencí od týmu Heym. Zjistěte více a požádejte o zkušební verzi na [heym.run/enterprise](https://heym.run/enterprise). Podívejte se na [video o Heym Work](https://youtu.be/5Z2gGo6bcpU) a prohlédněte si dvouminutovou ukázku.

## Co firemní týmy získají

| Oblast | Funkce |
|--------|--------|
| **Chat** | Popište úkol textem nebo hlasem. Heym se zeptá na potřebné podrobnosti, sestaví workflow, otestuje jej a označí jako Ověřeno. |
| **Flows** | Editoři sestavují flow z možností namísto na plátně: co jej spouští, volitelný návrh AI a akce v Slacku, Google Sheets a e-mailu. Odpovědi ze Slacku pokračují v běhu a schválení čekají také v Aktivitě. Viz [Flows](#flows). |
| **Stránky** | Připnuté stránky widgetů: čísla, grafy, tabulky se stavovými čipy, zóny pro vkládání souborů a schvalování. Řádek tabulky může otevřít vlastní stránku s podrobnostmi. |
| **Schvalování** | Kontroly z kroků [Human-in-the-Loop](./human-in-the-loop.md) čekají v Aktivita a na stránkách s možnostmi Schválit, Požádat o změny a Zamítnout. |
| **Aktivita** | Každé spuštění s uvedením osoby, která jej spustila, a instance, která jej zpracovala. |
| **Role** | Vlastník, Editor a Prohlížeč. Uživatelé se přihlašují pomocí [Single Sign-On](./sso.md), které Heym již používá. |
| **Odvětvové edice** | Edice pro právo, vzdělávání, finance, logistiku, energetiku a e-commerce obsahují připravené stránky, ukázková data a workflow pro daný obor. |

## Flows

**Flows** je v nabídce Heym Work pro Editory a Vlastníky. Flow je sestaveno z voleb namísto uzlů a Heym Work jej ukládá jako běžný Heym workflow prostřednictvím Heym API jménem osoby, která jej vytvořila. Pravidla přístupu, historie úprav a synchronizace triggerů Heym platí stejně jako v editoru a každý běh se zobrazuje v Aktivitě jako jakýkoli jiný.

| Část | Volby |
|---|---|
| **Co jej spouští** | Na vyžádání, podle plánu, při zprávě Slack, při změně karty Google Sheets (přidání, změna nebo smazání řádků) nebo při doručení e-mailu do schránky. Triggery tabulek a e-mailu kontrolují každých 1, 5, 15 nebo 60 minut. |
| **Návrh AI** (volitelný) | Model a instrukce převádějí to, co spustilo flow, do textu pro další kroky. Flow, které nezačíná z tabulky nebo e-mailu, může nejprve přečíst nedávné zprávy Slack z kanálu nebo vlákna. |
| **Co se stane potom** | Akce v pořadí v kterémkoli ze tří nástrojů, ať už flow spustilo cokoli. **Slack:** zpráva kanálu, přímá zpráva, formulář, zpráva s tlačítky, schválení, odpověď ve vlákně, aktualizace zprávy a konečný výsledek. **Google Sheets:** přidat řádek nebo aktualizovat změněný řádek. **E-mail:** odeslat e-mail. |

- **Odpovědi pokračují v běhu.** Schválení, tlačítka nebo formulář pozastaví běh, dokud někdo neodpoví v Slacku. Schválení čeká také v Aktivitě a rozhodnutí na kterémkoli místě odstraní tlačítka ze zprávy Slack. Další kroky Slack zůstávají ve vlákně první zprávy.
- **Jedna karta Připojení.** Každé flow zobrazuje pracovní prostor Slack, účet Google Sheets a schránky, ze kterých čte a přes které odesílá. Jsou to přihlašovací údaje Heym: **Slack Bot** (token bota, `xoxb-…`), **Google Sheets**, **IMAP** a **SMTP**; chybějící údaj lze přidat přímo z flow.
- **Jedna aplikace Slack pro každé flow.** V aplikaci Slack nastavte adresu URL požadavku na interaktivitu na `https://<váš Heym>/api/slack/interactions/<id pověření>` a adresu URL požadavku na odběr událostí na `https://<váš Heym>/api/slack/events/<id pověření>`. Heym Work zobrazuje obě pro zvolené připojení. Všechna flow s těmito údaji je sdílejí.
- **Triggery Slack volí, co poslouchají:** zprávy v kanálech a přímých zprávách, přímé zprávy botovi, zmínky o botovi nebo zprávy v jednom kanálu. Vlastní příspěvky bota nikdy nespouštějí flow.
- **Požadavky.** Flows vyžadují Heym 0.0.131 nebo novější.

Kroky sestavené přes flow jsou stejné uzly, jaké můžete použít na plátně: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) a [Cron](../nodes/cron-node.md).

## Připojení Heym Work

Podívejte se na [instalační video](https://youtu.be/zXGfg1HPSLk), kde naleznete kompletní postup od prvního příkazu až po domovskou stránku.

Spojení se konfiguruje v **Nastavení → Heym Work**. Karta je přístupná pouze pro administrátory instance uvedené v proměnné `HEYM_ADMIN_EMAILS`.

| Pole | Funkce |
|------|--------|
| **Adresa Heym Work** | Místo, kde běží Heym Work, například `https://work.example.com`. Přihlášení přesměruje zpět sem. Stiskněte **Uložit**. |
| **Integrační klíč** | Tlačítko **Generovat klíč** vytvoří klíč, který Heym Work používá pro každý požadavek na Heym. Zobrazí se pouze jednou spolu s tlačítkem pro zkopírování. Heym ukládá pouze jeho hash. |
| **Povolit Heym Work** | Zapne propojení. Vyžaduje nejprve zadání adresy a klíče. |
| **Edice pro odvětví a týmy** | Edice pro právo, vzdělávání, finance, logistiku, energetiku a e-commerce spolu s edicemi IT, prodeje, marketingu a HR pro firemní týmy se otevírají se stránkami, ukázkovými daty a workflow pro tuto práci. |

Poté otevřete adresu Heym Work a dokončete konfiguraci:

1. **Licence**: zadejte licenční klíč od týmu Heym.
2. **Heym**: zadejte adresu Heym a integrační klíč.
3. **Vlastník**: přihlaste se účtem uvedeným jako Vlastník Heym Work.

Otevře se domovská stránka, připravená pro práci týmu.

### Rotace klíče

Volba **Obnovit klíč** nahradí integrační klíč. Heym Work přestane fungovat, dokud do něj nebude zadán nový klíč, a všichni uživatelé přihlášení k Heym Work budou odhlášeni. Tuto funkci použijte při podezření na únik klíče nebo při odchodu osoby, která k němu měla přístup.

### Deaktivace připojení

Vypnutím volby **Povolit Heym Work** spojení přerušíte. Heym Work následně znovu požádá o klíč Heym. Heym v obou případech nadále spouští všechna workflow, plány i webhooky.

## Bezpečnostní model

- **Každá změna prochází přes Heym.** Heym Work načítá zobrazovaná data z databáze Heym a každou akci odesílá do Heym přes kanál chráněný klíčem, kde Heym uplatňuje vlastní pravidla přístupu. Heym Work uchovává svá data v samostatném schématu `heym_work`.
- **Klíč je v úložišti hashován.** Heym porovnává hash předloženého klíče a samotný klíč nikdy neukládá v otevřené podobě.
- **Přihlašování zajišťuje Heym.** Uživatelé se přihlašují přes Heym s využitím vašeho poskytovatele identity, pokud je aktivní [SSO](./sso.md).
- **Změny podléhají auditu.** Uložení konfigurace a rotace klíče zapisují události `work_integration.update` a `work_integration.key_rotate` do [protokolu auditu](./audit.md).

## Licencování

Heym Work vyžaduje vlastní licenční klíč vydaný týmem Heym. Heym Work odesílá denně na server heym.run své ID licence, ID instalace, počet aktivních uživatelů za posledních 30 dní, celkový počet členů, počet spuštění za posledních 24 hodin a verze systémů Heym a Heym Work. Obsah workflow, vstupy, výstupy a přihlašovací údaje zůstávají na vašich serverech.

Pokud denní synchronizace selže po dobu 30 dnů, začíná 14denní ochranná lhůta, po jejímž uplynutí rozhraní Heym Work vyzve Vlastníka k zadání klíče. Zkušební verze běží do posledního dne a obnoví se, jakmile ji tým Heym prodlouží (je povolena jedna zkušební verze na instalaci). Heym samotný funguje nepřetržitě po celou dobu. Sítě bez přístupu k internetu využívají offline licenci dostupnou přes enterprise@heym.run.

## Videa

Všechna videa k Heym Work jsou k dispozici v [playlistu Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Související témata

- [Enterprise](./enterprise.md): Komerční licencování a podpora
- [Single Sign-On](./sso.md): Přihlašování, které Heym Work využívá
- [Human-in-the-Loop](./human-in-the-loop.md): Schvalovací kroky zobrazené v Heym Work
- [Protokolování auditu](./audit.md): Záznamy generované změnami připojení
- [Nastavení](./user-settings.md): Kde se nachází karta Heym Work
