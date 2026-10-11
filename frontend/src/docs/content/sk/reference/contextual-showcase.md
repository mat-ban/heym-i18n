# Kontextový sprievodca

**Kontextový sprievodca** je odľahčený sprievodný panel priamo v aplikácii, ktorý vysvetľuje stránku, na ktorej sa práve nachádzate, bez toho, aby Vás okamžite vtiahol do plnohodnotného dokumentačného toku.

## Čo robí

- Zobrazuje krátke zhrnutie pre aktuálnu stránku
- Udržiava prvú vrstvu stručnú, aby Vás nezahlcoval
- Umožňuje rozbaliť malé množstvo dodatočných detailov len v prípade potreby
- Odkazuje na plnú stránku dokumentácie pre hlbšie čítanie

## Kde sa zobrazuje

Vo verzii v1 je sprievodca dostupný na autentifikovaných hlavných plochách Heymu:

- Karty Dashboardu
- [Evals](../tabs/evals-tab.md)
- [Dokumentácia](../getting-started/introduction.md)
- Plátno editora workflowov

Verejné stránky, ako napríklad prihlásenie, registrácia, chat portál a HITL review, sprievodcu nezobrazujú.

## Prístup

### Desktop

- Pevný trigger **Page Guide** sa zobrazuje na pravom okraji obrazovky
- Sprievodca sa otvára ako pravý bočný panel
- Predvolene zostáva zatvorený
- Jednorazový upútavka pomáha odhaliť, že sprievodca existuje, bez toho, aby sa vynucovalo jeho otvorenie

### Mobil

- Rovnaký obsah je dostupný prostredníctvom plávajúceho tlačidla **Page Guide**
- Otvára sa v spodnom paneli namiesto pravého bočného panelu

## Model obsahu

Každý záznam sprievodcu používa štruktúrovanú definíciu namiesto plne vlastného komponentu.

- **Názov** – Čo je táto stránka
- **Zhrnutie** – Jedno krátke vysvetlenie
- **Odrážky** – Niekoľko ľahko čitateľných podnetov
- **Zvýraznenia** – Malé karty pre kľúčovú hodnotu alebo vzory používania
- **Viac detailov** – Zbalené sekcie pre dodatočný kontext
- **Akcie** – Zvyčajne jeden alebo dva odkazy, najčastejšie na plnú dokumentáciu

Vďaka tomu zostáva systém flexibilný a zároveň sa vyhýba dlhým, rušivým panelom pomocníka.

## Kontextová uvedomelosť

Sprievodca sa mení podľa aktuálnej plochy.

- Karty Dashboardu majú každá svoje vlastné zhrnutie
- Editor odkazuje na [Funkcie plátna](./canvas-features.md)
- Stránka dokumentácie používa všeobecný prehľad dokumentácie a, ak je to možné, odkazuje na aktuálny článok, ktorý už máte otvorený

## Trvalosť

Sprievodca ukladá malé množstvo osobného stavu UI do úložiska prehliadača:

- Či bol panel alebo spodný panel naposledy otvorený
- Ktoré kontexty stránok už zobrazili upútavku
- Poslednú rozbalenú sekciu detailov pre každý kontext

## Prečo existuje

Cieľom je urobiť Heym ľahšie naučiteľným bez pridávania ďalšieho ťažkého UI rozhrania.

- Krátke, vždy nablízku dostupné usmernenie pre orientáciu
- Jasná cesta k hlbšej dokumentácii
- Nízke vyrušenie pre skúsených používateľov

## Súvisiace

- [Karta Workflows](../tabs/workflows-tab.md) – Hlavná plocha Dashboardu
- [Karta Evals](../tabs/evals-tab.md) – Workflowy hodnotenia
- [Funkcie plátna](./canvas-features.md) – Správanie editora a ladenie
- [Rýchly panel](./quick-drawer.md) – Druhá pevná pomocná plocha na pravej strane
