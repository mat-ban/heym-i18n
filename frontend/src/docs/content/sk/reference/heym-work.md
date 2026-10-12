# Heym Work

**Heym Work** je druhé rozhranie pre obchodné tímy, postavené na platforme Heym. Používatelia popíšu úlohu vlastnými slovami, odpovedia na niekoľko otázok a získajú workflow, ktorý Heym vytvoril a otestoval. Pracujú na stránkach vytvorených priamo pre nich, vybavujú schvaľovania a vidia každé spustenie označené menom zadávateľa. Heym vykonáva všetky úlohy na pozadí.

Heym Work beží ako samostatný kontajner vedľa Heym s oddelenou licenciou od tímu Heym. Zistite viac a požiadajte o skúšobnú verziu na [heym.run/enterprise](https://heym.run/enterprise). Pozrite si [video o Heym Work](https://youtu.be/5Z2gGo6bcpU) a absolvujte dvojminútovú prehliadku.

## Čo získajú firemné tímy

| Oblasť | Funkcia |
|--------|---------|
| **Chat** | Popíšte úlohu textom alebo hlasom. Heym sa opýta na potrebné podrobnosti, zostaví workflow, otestuje ho a označí ako Overené. |
| **Stránky** | Pripnuté stránky widgetov: čísla, grafy, tabuľky so stavovými štítkami, zóny na vkladanie súborov a schvaľovania. Riadok tabuľky môže otvoriť vlastnú stránku s podrobnosťami. |
| **Schvaľovania** | Kontroly z krokov [Human-in-the-Loop](./human-in-the-loop.md) čakajú v sekcii Aktivita a na stránkach s možnosťami Schváliť, Požiadať o zmeny a Odmietnuť. |
| **Aktivita** | Každé spustenie s uvedením osoby, ktorá ho spustila, a inštancie, ktorá ho vykonala. |
| **Roly** | Vlastník, Editor a Prehliadač. Používatelia sa prihlasujú pomocou [Single Sign-On](./sso.md), ktoré Heym už využíva. |
| **Odvetvové edície** | Edície pre právo, vzdelávanie, financie, logistiku, energetiku a e-commerce obsahujú pripravené stránky, ukážkové dáta a workflow pre dané odvetvie. |

## Pripojenie Heym Work

Pozrite si [inštalačné video](https://youtu.be/zXGfg1HPSLk), kde nájdete celý postup od prvého príkazu až po domovskú stránku.

Pripojenie sa konfiguruje v **Nastavenia → Heym Work**. Táto karta je viditeľná len pre správcov inštancie uvedených v premennej `HEYM_ADMIN_EMAILS`.

| Pole | Funkcia |
|------|---------|
| **Adresa Heym Work** | Adresa, kde beží Heym Work, napríklad `https://work.example.com`. Prihlásenie smeruje späť sem. Kliknite na **Uložiť**. |
| **Integračný kľúč** | Tlačidlo **Generovať kľúč** vytvorí kľúč, ktorý Heym Work používa na každú požiadavku na Heym. Zobrazí sa iba raz spolu s tlačidlom na skopírovanie. Heym ukladá iba jeho hash. |
| **Povoliť Heym Work** | Zapne pripojenie. Najprv vyžaduje zadanie adresy a kľúča. |
| Stav | **Naposledy aktívny**, **Verzia Work** a **Licencia**, podľa posledného hlásenia z Heym Work. |

Následne otvorte adresu Heym Work a dokončite konfiguráciu:

1. **Licencia**: zadajte licenčný kľúč od tímu Heym.
2. **Heym**: zadajte adresu Heym a integračný kľúč.
3. **Vlastník**: prihláste sa účtom uvedeným ako Vlastník Heym Work.

Otvorí sa domovská stránka pripravená pre prácu tímu.

### Rotácia kľúča

Možnosť **Obnoviť kľúč** nahradí integračný kľúč. Heym Work prestane fungovať, kým sa doň nezadá nový kľúč, a všetci používatelia prihlásení do Heym Work budú odhlásení. Použite túto funkciu pri podozrení na únik kľúča alebo pri odchode osoby, ktorá k nemu mala prístup.

### Deaktivácia pripojenia

Vypnutím voľby **Povoliť Heym Work** spojenie prerušíte. Heym Work potom znova požiada o kľúč Heym. Heym v každom prípade naďalej vykonáva všetky workflow, plány a webhooky.

## Bezpečnostný model

- **Každá zmena prechádza cez Heym.** Heym Work načítava zobrazované údaje z databázy Heym a každú akciu odosiela do Heym cez kanál chránený kľúčom, kde Heym uplatňuje vlastné pravidlá prístupu. Heym Work uchováva vlastné údaje v samostatnej schéme `heym_work`.
- **Kľúč je v úložisku hashovaný.** Heym porovnáva hash predloženého kľúča a samotný kľúč nikdy neukladá v otvorenej podobe.
- **Prihlasovanie zabezpečuje Heym.** Používatelia sa prihlasujú cez Heym s využitím vášho poskytovateľa identity, ak je aktívne [SSO](./sso.md).
- **Zmeny podliehajú auditu.** Uloženie konfigurácie a rotácia kľúča zapisujú záznamy `work_integration.update` a `work_integration.key_rotate` do [denníka auditu](./audit.md).

## Licencovanie

Heym Work vyžaduje vlastný licenčný kľúč vydaný tímom Heym. Heym Work denne odosiela na heym.run svoje ID licencie, ID inštalácie, počet aktívnych používateľov za posledných 30 dní, celkový počet členov, počet spustení za posledných 24 hodín a verzie Heym a Heym Work. Obsah workflow, vstupy, výstupy a prihlasovacie údaje zostávajú na vašich serveroch.

Ak denná synchronizácia zlyhá počas 30 dní, začne plynúť 14-dňová ochranná lehota, po ktorej rozhranie Heym Work vyzve Vlastníka na zadanie kľúča. Skúšobná verzia beží do svojho posledného dňa a obnoví sa, keď ju tím Heym predĺži (je povolená jedna skúšobná verzia na inštaláciu). Heym sám beží nepretržite počas celého obdobia. Siete bez prístupu na internet využívajú offline licenciu dostupnú cez enterprise@heym.run.

## Videá

Všetky videá k Heym Work nájdete v [zozname videí Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Súvisiace témy

- [Enterprise](./enterprise.md): Komerčné licencovanie a podpora
- [Single Sign-On](./sso.md): Prihlasovanie používané v Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Schvaľovania zobrazené v Heym Work
- [Denník auditu](./audit.md): Záznamy generované zmenami pripojenia
- [Nastavenia](./user-settings.md): Miesto, kde sa nachádza karta Heym Work
