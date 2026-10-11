# Chat s Heym

Chat s Heym je asistent s kontextom aktuálnej stránky, ktorý je dostupný v hlavičke dokumentácie. Otvára sa v centrovanom dialógovom okne, umožňuje Vám vybrať prihlasovacie údaje pre LLM a model a odpovedá na otázky s aktuálnou stránkou dokumentácie ako prvým kontextom.

## Otvorenie dialógového okna

1. Otvorte ľubovoľnú stránku v rámci `/docs`
2. Kliknite na **Chat s Heym** v hlavičke
3. Vyberte [prihlasovacie údaje](../tabs/credentials-tab.md) a model
4. Položte otázku týkajúcu sa stránky alebo platformy

Na menších obrazovkách je spúšťací prvok iba ikona; na väčších obrazovkách zobrazuje celý štítok.

## Aký kontext sa používa

- Aktuálne otvorená cesta v dokumentácii sa vkladá do požiadavky ako kontextové usmernenie
- Backend naďalej používa existujúci endpoint chatu dashboardu a nástroje na vyhľadávanie v dokumentácii
- Vaše [Pravidlá používateľa](./user-settings.md) na úrovni účtu sa naďalej uplatňujú, pretože sa opätovne používa rovnaký backend chatu
- Kroky prípravy v reálnom čase sa streamujú do bubliny asistenta pred konečnou odpoveďou, podobne ako v chate dashboardu
- Otázky na objasnenie sa zobrazujú ako karty, rovnako ako na karte [Chat](../tabs/chat-tab.md). Ak požiadavka na workflow vyžaduje prihlasovacie údaje, môžete nejaké vybrať alebo ich vytvoriť z karty. Ak vyžaduje dátovú tabuľku, môžete vybrať jednu zo svojich tabuliek alebo rovnakým spôsobom vytvoriť novú.

Keď dialógové okno otvoríte na konkrétnom článku, malý odznak zobrazuje aktívnu cestu v dokumentácii, takže môžete potvrdiť, ktorá stránka má prioritu.

## Správanie relácie

- Výber prihlasovacích údajov a modelu zostáva zachovaný, kým je dialógové okno namontované
- História správ existuje iba počas relácie a vymaže sa pri zatvorení dialógového okna
- Kliknutie na pozadie, kláves `Escape` a tlačidlo zatvorenia resetujú reláciu
- **Stop** preruší aktuálnu streamovanú odpoveď
- Dialógové okno je zámerne široké a s pevnou veľkosťou; neponúka prepínač na celú obrazovku

## Kedy ho použiť

- Kladenie doplňujúcich otázok počas čítania stránky uzla alebo referenčnej stránky
- Objasnenie rozdielov medzi funkciami bez opustenia dokumentácie
- Nájdenie správneho článku pred otvorením editora

Ak chcete workflowy vytvárať alebo upravovať priamo, použite namiesto toho [AI asistenta](./ai-assistant.md) na strane editora.

## Súvisiace

- [AI asistent](./ai-assistant.md) – Chat v editore na vytváranie workflowov
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov pre LLM používaných dialógovým oknom
- [Nastavenia](./user-settings.md) – Globálne Pravidlá používateľa uplatňované na AI rozhrania
- [Rýchly štart](../getting-started/quick-start.md) – Prvé kroky s workflowom
