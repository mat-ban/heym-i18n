# Karta Upozornenia

Karta **Upozornenia** vám umožňuje definovať prahové podmienky v rámci časového okna a byť informovaný, keď dôjde k ich prekročeniu. Heym už zaznamenáva výsledky spustení, trvanie behu a výdavky na LLM, no nikdy ich neoznamuje z vlastnej iniciatívy. Upozornenie je spôsob, ako si o to požiadať.

Každé upozornenie sa vyhodnocuje v rámci vami zvoleného **časového okna**, nikdy nie na základe jedinej udalosti. Jedno zlyhané spustenie je šum. Dvanásť zlyhaných spustení za desať minút je incident.

## Typy upozornení

| Typ | Otázka, na ktorú odpovedá | Odkiaľ pochádza číslo |
|---|---|---|
| **Prah chýb** | Zlyhalo to v okne viac ako N-krát? | Záznamy v [Histórii spustení](../reference/execution-history.md) so stavom chyby |
| **Trvanie workflowu** | Spomalili sa behy v okne viac, než sa očakávalo? | Čas spustenia, agregovaný ako maximum, priemer alebo 95. percentil |
| **Náklady na Token / USD** | Prekročili výdavky v okne rozpočet? | [LLM traces](./traces-tab.md) plus tabuľka nákladov na LLM |
| **Počet spustení** | Bežalo to oveľa častejšie, než by malo? | Počet záznamov v Histórii spustení |

### Prah chýb

Počíta zlyhané behy v rámci okna a spustí sa, keď počet dosiahne váš prah. Keďže počíta v rámci okna namiesto zachytávania každého zlyhania, jediná prechodná chyba vás nebude alarmovať.

### Trvanie workflowu

Meria trvanie behu v rámci okna. Zvoľte **max** (najpomalší beh), **priemer** alebo **p95**. Hodnota p95 používa rovnaký výpočet percentilu ako [karta Analytika](./analytics-tab.md), takže upozornenie a graf latencie sa nikdy nebudú rozchádzať v rámci toho istého okna.

**Minimálny počet behov v okne** udržiava toto upozornenie spoľahlivé. Najpomalší beh v takmer prázdnom okne je jednoducho ten jediný beh, takže nastavenie minima napríklad na 3 zabráni spusteniu upozornenia na základe šumu.

### Náklady na Token / USD

Sčíta výdavky na LLM v rámci okna, buď ako celkové tokeny alebo ako americké doláre. Sumy v dolároch sa vyhodnocujú cez rovnakú cenovú tabuľku, ktorú používa [karta Traces](./traces-tab.md) a [Tabuľka nákladov na LLM](./datatable-tab.md#llm-cost-table-system-table), takže upozornenie na náklady a stránka nákladov sa vždy zhodujú.

Keď rozsah zahŕňa všetky vaše workflowy, zahrňuje to aj volania LLM vykonané mimo workflowu, ako napríklad v [karte Chat](./chat-tab.md) a [AI Asistentovi](../reference/ai-assistant.md). Využitie kódovacích agentov (Codex, OpenCode) nie je zahrnuté.

Modely bez cenového riadku sú v kontexte upozornenia uvedené ako neocenené, namiesto tichého započítania ako nula.

### Počet spustení

Počíta behy akéhokoľvek stavu v rámci okna. Toto je to, čo zachytí pokazený trigger: workflow, ktorý bežne beží 20-krát za hodinu, zrazu beží 2 000-krát. Záznam o spustení obsahuje rozpis podľa zdroja triggera, pretože to je zvyčajne odpoveď na otázku „prečo sa to stalo".

## Rozsah

Upozornenie sleduje buď **jeden workflow**, alebo **všetky vaše workflowy**.

„Všetky vaše workflowy" znamená každý workflow, ku ktorému má vlastník upozornenia prístup. Zámerne to neznamená každý workflow na inštancii Heym: upozornenia je možné zdieľať a zdieľanie upozornenia by nemalo niekomu poskytnúť agregované čísla pre workflowy, ktoré nemôže otvoriť.

## Sprievodca

Vytvorenie upozornenia prechádza piatimi krokmi.

1. **Typ** — vyberte jeden zo štyroch vyššie uvedených.
2. **Rozsah** — jeden workflow alebo všetky.
3. **Podmienka** — časové okno plus polia prahu pre daný typ.
4. **Odozva** — čo sa spustí pri aktivácii a ako často vám to má naďalej oznamovať.
5. **Kontrola** — pomenujte ho a pozrite si backtest.

### Backtest

Krok Kontrola odpovedá na otázku, ktorá je pred uložením skutočne dôležitá: *za posledných 24 hodín, ako často by sa toto spustilo?*

Uvádza počet spustení a najvyššiu pozorovanú hodnotu voči vášmu prahu. Ak uvádza, že podmienka by sa spustila 400-krát, upravíte prah pred uložením namiesto po tom, čo vás to alarmuje. Môžete rozšíriť obdobie spätného pohľadu na 3 alebo 7 dní.

## AI návrh

V hornej časti prvého kroku je pole, kde opíšete, čo chcete, prirodzeným jazykom:

> Upozorni ma, ak synchronizácia faktúr zlyhá viac ako 5-krát za 10 minút

Heym to premení na definíciu upozornenia, vyplní každý krok, ktorý dokáže, a preskočí dopredu s označenými poliami vyplnenými AI, takže potvrdzujete namiesto opätovného vypisovania. Kompletná požiadavka vás zavedie na krok Kontrola.

**Čiastočná požiadavka vás stále posunie vpred.** Ak uvediete len „upozorni ma, ak to zlyhá 5-krát", dostanete upozornenie na prah chýb s vyplneným počtom, predvolenými hodnotami pre zvyšok a sprievodca sa otvorí na prvom kroku, ktorý ešte potrebuje vašu pozornosť: v tomto prípade Rozsah, pretože nebol pomenovaný žiadny workflow. Poznámka v hornej časti uvádza, čo ešte treba rozhodnúť. Nikdy neblokuje tlačidlá Ďalej ani Vytvoriť.

To isté platí, keď model pomenuje workflow, ku ktorému nemáte prístup, alebo vráti podmienku s chýbajúcimi poľami. Časti, ktoré dávajú zmysel, sa zachovajú, zvyšok sa vráti k predvoleným hodnotám pre daný typ upozornenia a odtiaľ ich upravíte. Nič tu neobchádza validáciu: pravidlá sprievodcu aj API pri uložení upozornenie znova skontrolujú.
## Opakované správanie

Keď sa upozornenie spustí, prejde do stavu spustenia. Čo sa stane následne, závisí od vášho výberu v kroku 4.

- **Upozorniť raz, kým sa neobnoví** (predvolené) — spustí sa raz, potom zostane ticho, kým podmienka pretrváva. Keď metrika klesne späť pod prahovú hodnotu, upozornenie sa vráti do stavu OK a môže sa znova spustiť. Obnovenie je zmena stavu, nie udalosť: nevytvára záznam o spustení a nespúšťa notify workflow.
- **Upozorňovať opakovane v intervale** — spustí sa znova každých N minút, kým podmienka pretrváva.

Predvolené správanie existuje preto, lebo pokazený workflow kontrolovaný každých 60 sekúnd by inak vytvoril 60 spustení za hodinu, čo je dôvod, prečo sa upozornenia umlčujú.

## Spustenie workflow pri aktivácii

Krok 4 ponúka tri odpovede na otázku „čo sa má stať, keď sa toto spustí“:

- **Vytvoriť a priradiť nový workflow** (predvolené) — uloženie upozornenia zároveň vytvorí workflow s názvom *„&lt;názov upozornenia&gt; notification“* a prepojí ho. Dorazí s vstupným uzlom, ktorého polia presne zodpovedajú nižšie uvedenému payloadu, takže `$alert.body.observed_value` a zvyšok sa okamžite vyhodnotia a stačí vám pripojiť uzol, ktorý doručí správu. **Prejsť na workflow** na karte upozornenia ho otvorí. Toto je predvolené správanie, pretože upozornenie, ktoré sa spustí do prázdna, sa dá ľahko prehliadnuť.
- **Vybrať existujúci workflow** — spustí niečo, čo ste už vytvorili.
- **Nerobiť nič** — spustenie sa stále zaznamená na karte, len nespustí nič.

Payload upozornenia dorazí ako vstupné telo tohto workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Ktorý workflow vytvoril dané číslo

`workflows` je jediné miesto, kde sa workflow objavuje. Uvádza každý workflow, ktorý prispel k meraniu, každý s vlastnou hodnotou `value` — počet chýb daného workflow, počet spustení, najpomalšie spustenie v milisekundách alebo útrata, v závislosti od typu upozornenia. Zoznam je zoradený podľa `value` zostupne, takže `workflows[0]` je najväčší problém.

Je to **vždy pole**: jedno prvok pri rozsahu jedného workflow, mnoho pri „všetky moje workflow“ a prázdne namiesto null, keď nič nemožno priradiť. Notify workflow ním môže iterovať bez kontroly tvaru.

Zámerne neexistuje žiadne jednotné `workflow_id`. Opisovalo rozsah upozornenia, nie metriku, takže bolo `null` pri systémovom rozsahu, čo je práve prípad, keď je otázka „ktorý workflow?“ najdôležitejšia. `observed_value` zostáva agregát, s ktorým sa porovnávala prahová hodnota; polia `value` jednotlivých workflow vysvetľujú, odkiaľ pochádza.

Takto sa upozornenia dostávajú do Slacku, e-mailu, Telegramu alebo kamkoľvek inam: pomocou [uzlov](../reference/node-types.md), ktoré už máte, namiesto samostatného systému notifikácií.

Upozornenie nemôže upozorňovať workflow, ktorý sleduje. To by bola slučka, najzreteľnejšie pri upozornení na počet spustení, kde každé upozornenie pridáva k počtu, ktorý meria.

Spustenia notify sú bežné spustenia, takže sa zobrazujú v [histórii spustení](../reference/execution-history.md) ako každé iné spustenie. Notify workflow, ktorý zlyhá, sa zaznamená pri spustení, ale nikdy nezabráni tomu, aby sa samotné spustenie zaznamenalo.

Notify workflow sa spúšťa ako vlastník upozornenia, s jeho prihlasovacími údajmi a globálnymi premennými, presne tak, ako keby ho spustil sám. Výber workflow, ktorý s vami niekto zdieľal, si nepožičiava jeho prihlasovacie údaje. Ak vlastník stratí prístup k notify workflow, spustenie sa stále zaznamená, ale notify beh sa preskočí.

## História spustení

Pod zoznamom upozornení je história spustení: čo sa spustilo, kedy, pozorovaná hodnota voči prahovej hodnote, presné okno, ktoré sa vyhodnocovalo, a výsledok notifikácie.

Potvrdenie spustenia označí riadok a zmení odznak upozornenia z **Firing** na **Acknowledged**. To je vyhlásenie o vás, nie o upozornení: podmienka stále pretrváva a upozornenie sa samo vráti do stavu **OK**, keď metrika klesne späť pod prahovú hodnotu.

Každý záznam uchováva prispievajúce detaily v momente spustenia: identifikátory zlyhaných spustení a chybové správy, útratu podľa modelu alebo rozpis podľa zdroja triggera. Je to zámerné. Okno už uplynulo a jeho neskoršie prepočítanie môže dať odlišnú odpoveď.

Záznamy o spustení sa uchovávajú 90 dní.

## Pýtanie sa Chatu na upozornenia

Karta [Chat](./chat-tab.md) dokáže odpovedať na otázky o vašich upozorneniach:

- „Aké upozornenia mám?“
- „Existuje upozornenie na invoice workflow?“
- „Prečo sa spustilo upozornenie na náklady?“
- „Kedy sa to naposledy spustilo?“

Pri otázke „prečo sa to spustilo“ Chat cituje skutočnú pozorovanú hodnotu, prahovú hodnotu a časové okno zo záznamu o spustení spolu s prispievajúcimi detailmi.

## Zdieľanie

Upozornenia možno zdieľať s jednotlivými používateľmi alebo s [tímami](./teams-tab.md). Ľudia, s ktorými ich zdieľate, môžu vidieť upozornenie a jeho históriu spustení. Iba vlastník ho môže upravovať, pozastaviť, odstrániť alebo znova zdieľať.
### Keď je odobraný prístup k workflowu

Upozornenie na jednom workflowe neustále číta metriky spustení tohto workflowu, takže odobranie prístupu niekoho k workflowu zároveň určuje, čo sa stane s jeho upozorneniami naň:

- **Odobranie zdieľania používateľa alebo tímu** sa opýta vlastníka workflowu, či má zároveň zastaviť upozornenia tohto používateľa alebo tímu na workflowe. Predvolenou možnosťou je zastavenie. Zastavené upozornenia sú pozastavené, nie odstránené, a každé z nich sa zaznamená ako `alert.disable_on_access_revoke` v [audit logu](../reference/audit.md).
- **Odobranie člena tímu alebo odstránenie tímu** vždy zastaví dotknuté upozornenia, pretože osoba vykonávajúca túto zmenu nemusí byť vlastníkom workflowu.
- Upozornenie sa zastaví len vtedy, keď jeho vlastník nemá k workflowu žiadnu inú cestu, napríklad priame zdieľanie alebo iný tím.
- Obnovenie alebo testovanie pozastaveného upozornenia znova overí prístup vlastníka, takže zastavené upozornenie nie je možné znova zapnúť ani použiť na čítanie metrík workflowu bez prístupu. Stlačenie tlačidla **Resume** bez prístupu zobrazí oznámenie vysvetľujúce, že vlastník workflowu ho musí najprv znova zdieľať.

## Správa upozornení

- **Pause / Resume** — pozastavené upozornenie sa nikdy nevyhodnocuje. Obnovenie ho skontroluje okamžite namiesto čakania na ďalší interval.
- **Edit** — zmeny sa validujú ako celok, takže čiastočná úprava nemôže ponechať upozornenie v neplatnom stave.
- **Delete** — odstráni upozornenie a jeho históriu spustení.

## Pozri tiež

- [Analytics Tab](./analytics-tab.md) — grafy, z ktorých sú tieto prahové hodnoty odvodené
- [Traces Tab](./traces-tab.md) — odkiaľ pochádzajú údaje o nákladoch LLM
- [Execution History](../reference/execution-history.md) — spustenia, ktoré merajú upozornenia na chyby, trvanie a počet
- [Chat Tab](./chat-tab.md) — dopytovanie sa na upozornenia v prirodzenom jazyku
- [Teams](./teams-tab.md) — zdieľanie upozornení s tímom
