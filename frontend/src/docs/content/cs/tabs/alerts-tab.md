# Karta Alerts

Karta **Alerts** vám umožňuje definovat prahové podmínky v rámci časového okna a nechat si oznámit, když jsou překročeny. Heym již zaznamenává výsledky spuštění, dobu běhu a útratu za LLM, ale nikdy je sám od sebe nehlásí. Alert je způsob, jakým si o to řeknete.

Každý alert se vyhodnocuje v rámci **časového okna**, které si zvolíte, nikdy ne na základě jediné události. Jedno neúspěšné spuštění je šum. Dvanáct neúspěšných spuštění za deset minut je incident.

## Typy alertů

| Typ | Na jakou otázku odpovídá | Odkud pochází číslo |
|---|---|---|
| **Error threshold** | Selhalo to v okně více než Nkrát? | Řádky [Execution history](../reference/execution-history.md) se stavem chyby |
| **Workflow duration** | Zpomalila se spuštění v okně více, než se očekávalo? | Doba provádění, agregovaná jako max, průměr nebo 95. percentil |
| **Token / USD cost** | Překročila útrata v okně rozpočet? | [LLM traces](./traces-tab.md) plus tabulka nákladů na LLM |
| **Execution count** | Běželo to mnohem častěji, než by mělo? | Počet řádků historie spuštění |

### Error threshold

Počítá neúspěšná spuštění v rámci okna a spustí se, když počet dosáhne vašeho prahu. Protože počítá v rámci okna, místo aby se napojoval na každé selhání, jediná přechodná chyba vás nebude kontaktovat.

### Workflow duration

Měří dobu běhu v rámci okna. Zvolte **max** (nejpomalejší spuštění), **average** nebo **p95**. Hodnota p95 používá stejný výpočet percentilu jako [Analytics tab](./analytics-tab.md), takže alert a graf latence se nikdy nerozcházejí ohledně stejného okna.

**Minimum runs in the window** to udržuje v mezích. Nej pomalejší spuštění v téměř prázdném okně je prostě to jedno spuštění, takže nastavení minima například na 3 zabrání tomu, aby se alert spouštěl na šum.

### Token / USD cost

Sčítá útratu za LLM v rámci okna, buď jako celkové tokeny, nebo jako americké dolary. Částky v dolarech se vyhodnocují prostřednictvím stejné cenové tabulky, kterou používají [Traces tab](./traces-tab.md) a [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table), takže cost alert a stránka nákladů vždy souhlasí.

Když je rozsah všechny vaše workflow, zahrnuje to volání LLM provedená mimo workflow, jako jsou [Chat tab](./chat-tab.md) a [AI Assistant](../reference/ai-assistant.md). Využití coding agenta (Codex, OpenCode) není zahrnuto.

Modely bez cenového řádku jsou v kontextu alertu hlášeny jako neoceněné, místo aby byly tiše počítány jako nula.

### Execution count

Počítá spuštění jakéhokoli stavu v rámci okna. Toto je ten, který zachytí trigger, který se pokazil: workflow, které normálně běží 20krát za hodinu, najednou běží 2 000krát. Záznam o spuštění obsahuje rozpis podle zdroje triggeru, protože to je obvykle odpověď na „proč se to stalo".

## Rozsah

Alert sleduje buď **jedno workflow**, nebo **všechna vaše workflow**.

„Všechna vaše workflow" znamená každé workflow, ke kterému má vlastník alertu přístup. Záměrně to neznamená každé workflow na instanci Heym: alerty lze sdílet a sdílení alertu by nemělo někomu poskytnout agregovaná čísla pro workflow, která nemůže otevřít.

## Průvodce

Vytvoření alertu prochází pěti kroky.

1. **Type** — vyberte jeden ze čtyř výše uvedených.
2. **Scope** — jedno workflow, nebo všechna.
3. **Condition** — časové okno plus prahová pole pro daný typ.
4. **Response** — co se spustí při aktivaci a jak často vám to má být opakovaně oznamováno.
5. **Review** — pojmenujte jej a prohlédněte si backtest.

### Backtest

Krok Review odpovídá na otázku, která je před uložením skutečně důležitá: *za posledních 24 hodin, jak často by se to spustilo?*

Uvádí počet spuštění a nejvyšší pozorovanou hodnotu vůči vašemu prahu. Pokud uvádí, že by se podmínka spustila 400krát, opravíte práh před uložením, místo abyste byli kontaktováni. Můžete rozšířit zpětné hledání na 3 nebo 7 dní.

## AI Drafting

V horní části prvního kroku je pole, kde popíšete, co chcete, přirozeným jazykem:

> Warn me if the invoice sync fails more than 5 times in 10 minutes

Heym to převede na definici alertu, vyplní každý krok, který může, a přeskočí dopředu s označením polí vyplněných AI, takže potvrzujete, místo abyste znovu psali. Kompletní požadavek vás dostane na Review.

**Částečný požadavek vás stále posune vpřed.** Řekněte pouze „warn me if it fails 5 times" a dostanete error threshold alert s vyplněným počtem, výchozími hodnotami pro zbytek a průvodce se otevře na prvním kroku, který vás ještě potřebuje: v tomto případě Scope, protože nebylo pojmenováno žádné workflow. Poznámka v horní části uvádí, co zbývá rozhodnout. Nikdy neblokuje Next ani Create.

Totéž platí, když model pojmenuje workflow, ke kterému nemáte přístup, nebo vrátí podmínku s chybějícími poli. Části, které dávají smysl, jsou zachovány, zbytek se vrátí k výchozím hodnotám pro daný typ alertu a vy odtud upravujete. Nic zde neobchází validaci: pravidla průvodce i API znovu zkontrolují alert při uložení.
## Chování opakování

Jakmile se alert spustí, přejde do stavu spuštění. Co se stane dál, závisí na vaší volbě v kroku 4.

- **Upozornit jednou, dokud se neobnoví** (výchozí nastavení) — spustí se jednou, poté zůstane v klidu, dokud podmínka trvá. Když metrika klesne zpět pod prahovou hodnotu, alert se vrátí do stavu OK a může se znovu spustit. Obnovení je změna stavu, nikoli událost: nevytváří záznam o spuštění a nespouští notify workflow.
- **Upozorňovat opakovaně v intervalu** — spustí se znovu každých N minut, dokud podmínka trvá.

Výchozí nastavení existuje proto, že poškozený workflow kontrolovaný každých 60 sekund by jinak produkoval 60 spuštění za hodinu, což je způsob, jakým se alerting umlčuje.

## Spuštění workflow při aktivaci

Krok 4 nabízí tři odpovědi na otázku „co se má stát, když se to spustí":

- **Vytvořit a přiřadit nový workflow** (výchozí nastavení) — uložení alertu také vytvoří workflow s názvem *„&lt;název alertu&gt; notification"* a propojí jej. Přijde s vstupním uzlem, jehož pole přesně odpovídají níže uvedenému payloadu, takže `$alert.body.observed_value` a zbytek se okamžitě vyhodnotí a vy pouze připojíte uzel, který doručí zprávu. **Go to workflow** na kartě alertu jej otevře. Toto je výchozí nastavení, protože alert, který se spustí do prázdna, lze snadno přehlédnout.
- **Vybrat existující workflow** — spustit něco, co jste již vytvořili.
- **Nedělat nic** — spuštění se stále zaznamená na kartě, pouze se nic nespustí.

Payload alertu přichází jako vstupní tělo tohoto workflow:

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

### Který workflow vyprodukoval dané číslo

`workflows` je jediné místo, kde se workflow objevuje. Uvádí každý workflow, který přispěl k měření, každý s vlastní hodnotou `value` — počet chyb daného workflow, počet spuštění, nejpomalejší běh v milisekundách nebo útrata, v závislosti na typu alertu. Seznam je seřazen podle `value` od nejvyšší po nejnižší, takže `workflows[0]` je nejhorší případ.

Je to **vždy pole**: jedno-prvkové při scope jednoho workflow, mnoho-prvkové při „all my workflows" a prázdné místo null, když nelze nic přiřadit. Notify workflow jím může iterovat bez kontroly tvaru.

Záměrně neexistuje singulární `workflow_id`. Popisoval scope alertu, nikoli metriku, takže byl `null` při system scope, což je přesně případ, kdy je otázka „který workflow?" nejdůležitější. `observed_value` zůstává agregát, se kterým byla porovnávána prahová hodnota; pole `value` jednotlivých workflow vysvětlují, odkud pochází.

Takto alerty dosáhnou Slacku, e-mailu, Telegramu nebo kamkoli jinam: s [uzly](../reference/node-types.md), které již máte, namísto samostatného systému oznámení.

Alert nemůže upozorňovat workflow, které sleduje. To by byla smyčka, nejzřetelněji u alertu na počet spuštění, kde každé oznámení přispívá k počtu, který měří.

Notify běhy jsou běžná spuštění, takže se objevují v [historii spuštění](../reference/execution-history.md) jako jakýkoli jiný běh. Notify workflow, který selže, se zaznamená u spuštění, ale nikdy nezabrání tomu, aby se samotné spuštění zaznamenalo.

Notify workflow běží jako vlastník alertu, s jeho přihlašovacími údaji a globálními proměnnými, přesně jako kdyby jej spustil sám. Výběr workflow, který s vámi někdo sdílel, si nepůjčuje přihlašovací údaje této osoby. Pokud vlastník ztratí přístup k notify workflow, spuštění se stále zaznamená, ale notify běh se přeskočí.

## Historie spuštění

Pod seznamem alertů je historie spuštění: co se spustilo, kdy, pozorovaná hodnota vůči prahové hodnotě, přesné okno, které bylo vyhodnoceno, a výsledek oznámení.

Potvrzení spuštění označí řádek a změní odznak alertu z **Firing** na **Acknowledged**. To je tvrzení o vás, nikoli o alertu: podmínka stále trvá a alert se sám vrátí do stavu **OK**, když metrika klesne zpět pod prahovou hodnotu.

Každý záznam ukládá přispívající detail v okamžiku spuštění: ID selhávajících spuštění a chybové zprávy, útratu podle modelu nebo rozpad podle zdroje triggeru. To je záměrné. Okno již uplynulo a jeho pozdější přepočet může dát jiný výsledek.

Záznamy o spuštění se uchovávají 90 dní.

## Dotazování Chatu na alerty

[Chat tab](./chat-tab.md) dokáže odpovědět na otázky týkající se vašich alertů:

- „Jaké alerty mám?"
- „Existuje alert na invoice workflow?"
- „Proč se spustil cost alert?"
- „Kdy se to naposledy spustilo?"

U otázky „proč se to spustilo" Chat cituje skutečnou pozorovanou hodnotu, prahovou hodnotu a časové okno ze záznamu o spuštění spolu s přispívajícím detailem.

## Sdílení

Alerty lze sdílet s jednotlivými uživateli nebo s [týmy](./teams-tab.md). Lidé, se kterými je sdílíte, mohou vidět alert a jeho historii spuštění. Pouze vlastník jej může upravovat, pozastavit, smazat nebo znovu sdílet.
### Když je odebrán přístup k workflow

Upozornění na jeden workflow neustále čte metriky běhu tohoto workflow, takže odebrání přístupu někoho k workflow také určuje, co se stane s jeho upozorněními na něj:

- **Odebrání sdílení uživatele nebo týmu** se zeptá vlastníka workflow, zda má také zastavit upozornění tohoto uživatele nebo týmu na workflow. Zastavení je výchozí volba. Zastavená upozornění jsou pozastavena, nikoli smazána, a každé z nich je zaznamenáno jako `alert.disable_on_access_revoke` v [audit logu](../reference/audit.md).
- **Odebrání člena týmu nebo smazání týmu** vždy zastaví dotčená upozornění, protože osoba provádějící tuto změnu nemusí být vlastníkem workflow.
- Upozornění je zastaveno pouze tehdy, když jeho vlastník nemá k workflow žádnou jinou cestu, například přímé sdílení nebo jiný tým.
- Obnovení nebo testování pozastaveného upozornění znovu zkontroluje přístup vlastníka, takže zastavené upozornění nelze znovu zapnout ani použít ke čtení metrik workflow bez přístupu. Stisknutí **Resume** bez přístupu zobrazí oznámení vysvětlující, že vlastník workflow jej musí nejprve znovu nasdílet.

## Správa upozornění

- **Pause / Resume** — pozastavené upozornění není nikdy vyhodnocováno. Obnovení jej zkontroluje okamžitě, místo aby čekalo na další interval.
- **Edit** — změny jsou validovány jako celek, takže částečná úprava nemůže ponechat upozornění v neplatném stavu.
- **Delete** — odstraní upozornění a jeho historii spuštění.

## Viz také

- [Analytics Tab](./analytics-tab.md) — grafy, ze kterých jsou tyto prahové hodnoty odvozeny
- [Traces Tab](./traces-tab.md) — odkud pocházejí údaje o nákladech LLM
- [Execution History](../reference/execution-history.md) — běhy, které upozornění na chybu, dobu trvání a počet měří
- [Chat Tab](./chat-tab.md) — dotazování na upozornění v přirozeném jazyce
- [Teams](./teams-tab.md) — sdílení upozornění s týmem
