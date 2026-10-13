# Nastavení

Dialog **Nastavení** vám umožňuje spravovat váš profil, nastavit trvalé pokyny pro AI, aktualizovat heslo k účtu, konfigurovat hlas chatu, nastavit výchozí přihlašovací údaje a model AI a zkontrolovat stav observability. Otevřete jej kliknutím na **váš avatar a jméno** v pravém horním rohu záhlaví.

## Otevření dialogu

Klikněte na **váš avatar a jméno** v pravém horním rohu záhlaví. Dialog se otevře s těmito kartami: **Profil**, **Zabezpečení**, **Hlas**, **Výchozí nastavení AI** a **Observability**. Správci instance vidí navíc karty **SSO**, **Heym Work** a **Instance**.

## Karta Profil

### Profilový obrázek

Heym zobrazuje váš obrázek z [Gravatar](https://gravatar.com) pro e-mailový účet v záhlaví, vedle vašich zpráv v [Chatu](../tabs/chat-tab.md) a v **Chat with Heym**, u komentářů na [Boardu](../tabs/board-tab.md) a vedle vašeho jména v dialozích pro sdílení a seznamech členů týmu. Chcete-li jej změnit, aktualizujte obrázek na Gravataru; Heym jej načte do několika hodin. Bez obrázku z Gravataru Heym zobrazuje první písmeno vašeho jména.

Obrázek je načítán serverem Heym a ukládán do mezipaměti, takže váš prohlížeč nikdy nekontaktuje Gravatar. Pokud server nemůže Gravatar dosáhnout, všichni nadále vidí iniciály.

### Jméno

Vaše zobrazované jméno napříč celou aplikací. Toto pole je povinné a nesmí zůstat prázdné.

### Uživatelská pravidla

Uživatelská pravidla jsou vlastní pokyny automaticky vkládané do každého požadavku AI – jak v nástroji pro tvorbu workflow, tak v chatovacím rozhraní dashboardu. V **nástroji pro tvorbu workflow** ([AI Assistant](./ai-assistant.md)) jsou připojena k systémovému promptu používanému ke generování JSON workflow. V **chatovacím rozhraní dashboardu** jsou aplikována jako kontext na systémové úrovni. Napíšete je jednou a platí globálně, aniž byste je museli opakovat v každém promptu.

**Běžné použití:**

- Jazyk nebo tón: `Always respond in English. Keep responses concise.`
- Styl kódu: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Konvence workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Formát odpovědi: `Use bullet points. Avoid lengthy explanations.`

**Kde se uplatňují:**

| Kontext | Popis |
|---------|-------|
| **Nástroj pro tvorbu workflow** | Požadavky [AI Assistant](./ai-assistant.md) na generování nebo úpravu workflow |
| **Chatovací rozhraní dashboardu** | Všechny konverzace na [kartě Chat](../tabs/chat-tab.md) |

Uživatelská pravidla jsou vkládána na systémové úrovni – spouštějí se automaticky před každým promptem, bez jakékoli další konfigurace pro jednotlivé workflow nebo konverzace.

### Uložení změn profilu

Kliknutím na **Save Changes** změny použijete. Změny se projeví okamžitě u všech nových požadavků AI.

## Karta Zabezpečení

### Změna hesla

Kartu Zabezpečení použijte k aktualizaci hesla k účtu.

**Požadavky:**

| Pravidlo | Požadavek |
|----------|-----------|
| Minimální délka | 8 znaků |
| Velká písmena | Alespoň jedno velké písmeno (A–Z) |
| Malá písmena | Alespoň jedno malé písmeno (a–z) |
| Číslice | Alespoň jedno číslo (0–9) |

Heslo se také musí lišit od vašeho současného hesla. Tato pravidla jsou vynucována jak na frontendu, tak na backendu.

**Postup:**

1. Zadejte své **Current Password**
2. Zadejte své **New Password** (musí splňovat všechny výše uvedené požadavky)
3. Zadejte znovu do **Confirm New Password**
4. Klikněte na **Update Password**

Pokud je současné heslo nesprávné, zobrazí se vložená chybová zpráva. Při úspěchu se zobrazí potvrzující zpráva a formulář se automaticky resetuje.

## Karta Hlas

Karta Hlas konfiguruje mluvený hlas pro [kartu Chat](../tabs/chat-tab.md): vyberte **přihlašovací údaje ElevenLabs** (nebo je přidejte přímo v dialogu), zvolte **Voice** ze svého účtu ElevenLabs a klikněte na **Save Voice Settings**. Tím se povolí hlasité předčítání jednotlivých zpráv a interaktivní hlasový režim. Kompletní postup najdete v části [Chat Voice (TTS & STT)](./chat-voice.md).

## Karta Výchozí nastavení AI

Karta Výchozí nastavení AI má dvě sekce.

### Preferované přihlašovací údaje a model

Vyberte **preferované přihlašovací údaje LLM** a **model** z nich. Tato volba se stává výchozím nastavením pro všechny funkce AI v aplikaci – chat, [AI Assistant](./ai-assistant.md) (tvůrce, analyzátor a vytváření workflow), mapovač boardu, widgety AI dashboardu, [chat s dokumenty](../tabs/chat-tab.md), pomocník pro schéma AI v datové tabulce, tvůrce výrazů a evals – vždy, když dané rozhraní nemá vlastní uloženou volbu.

Pravidlo výběru, kterým se každé rozhraní řídí, je:

1. **Uložená volba** – volba, kterou jste již v daném rozhraní provedli (například poslední model konverzace v chatu), má vždy přednost.
2. **Preferované** – použije se, pokud neexistuje uložená volba.
3. **První dostupné přihlašovací údaje** – náhradní řešení, pokud jste nenastavili žádnou preferenci.

Přihlašovací údaje a model můžete kdykoli změnit i pro jednotlivá rozhraní; preference pouze vyplňuje počáteční výchozí hodnotu. Ponechte přihlašovací údaje jako **No preference**, chcete-li zachovat předchozí chování s prvními dostupnými údaji. Pokud budou vaše preferované přihlašovací údaje později smazány nebo přestanou být sdíleny, karta zobrazí upozornění a rozhraní tiše přejdou zpět na první dostupné přihlašovací údaje.
### Využití kódovacího balíčku

Pro každý přihlašovací údaj **Codex** (včetně sdílených) karta zobrazuje zbývající využití limitu rychlosti jako vodorovný pruh pro každé aktivní okno – například okno **5 hodin** a/nebo **týdenní** okno, v závislosti na vašem plánu. Každý pruh zobrazuje procento zbývající kvóty a odpočet do resetování. Tlačítko **Obnovit** znovu načte data na vyžádání (výsledky jsou krátce uloženy v mezipaměti na serveru).

Pro každý přihlašovací údaj **OpenCode** karta zobrazuje okna předplatného OpenCode Go – **5 hodin**, **týdenní** a **měsíční** – ve stejném stylu pruhů, načtená z autentizovaného koncového bodu využití brány pomocí API klíče daného přihlašovacího údaje. Okno, které dosáhlo svého limitu, se zobrazuje jako **„limit dosažen“** jantarově žlutě. Pokud je klíč neplatný nebo pracovní prostor nemá předplatné Go, karta místo pruhů uvede důvod.

## Karta Observability

Karta Observability zobrazuje stav [OpenTelemetry Tracing](./opentelemetry.md) pouze pro čtení pro tuto instanci: zda je trasování povoleno, OTLP koncový bod, název služby, poměr sampleru a které spany jsou emitovány. Trasování se konfiguruje prostřednictvím proměnných prostředí `HEYM_OTEL_*` na backendu, takže tato karta nic needituje. Pokud je trasování zakázáno, karta uvádí proměnné prostředí potřebné k jeho zapnutí. Tajné údaje, jako jsou autentizační hlavičky OTLP, se zde nikdy nezobrazují. Úplný přehled konfigurace naleznete v části [Proměnné prostředí](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

## Karta SSO

Viditelná pouze pro administrátory instance – účty uvedené v `HEYM_ADMIN_EMAILS`. Tato karta propojuje Heym s externím poskytovatelem OpenID Connect, aby se uživatelé přihlašovali účty, které již mají. Zadejte URL vydavatele a přihlašovací údaje klienta, zkopírujte adresu URI pro přesměrování pouze pro čtení do svého poskytovatele a před povolením spusťte **Test připojení**. Po úspěšném testu lze odtud vypnout přihlašování heslem. Úplné nastavení naleznete v části [Single Sign-On](./sso.md).

## Karta Heym Work

Správci instance zde připojují [Heym Work](./heym-work.md), rozhraní pro obchodní týmy: jeho adresu, jednorázově zobrazený integrační klíč a přepínač **Enable Heym Work**. Karta také ukazuje, kdy se Heym Work naposledy ohlásil, jeho verzi a stav licence. Viz [Připojení Heym Work](./heym-work.md#connecting-heym-work).

## Karta Instance

Viditelná pouze pro administrátory instance – účty uvedené v `HEYM_ADMIN_EMAILS`. Tato karta uvádí instance Heym připojené k této databázi a nastavuje, jak jsou úlohy na pozadí rozděleny mezi ně. Každý řádek zobrazuje upravitelný název instance, její roli, zda je aktivní, naměřenou latenci k databázi, přepínač zapnuto/vypnuto a její váhu. Váhy představují podíly instancí, které aktuálně mohou přijímat práci, nikoli procenta ze 100: při `41 / 26 / 33` a vypnuté třetí instanci skutečně první dvě dostávají 61 % a 39 %. Panel zobrazuje tento efektivní podíl pod tabulkou a odmítne uložit pouze tehdy, když žádná povolená instance nemá vůbec žádnou váhu.

**Přidělit novým instancím podíl automaticky** je ve výchozím nastavení zapnuto: instance, která se připojí, by jinak zůstala na váze 0 a nedostávala by nic, takže leader jí jednou přidělí rovný podíl a stávající váhy úměrně zmenší se zachováním jejich poměrů. Nikdy nezasahuje do instance, jejíž váhu jste nastavili sami.

Panel také uvádí, kolik z úloh za posledních 24 hodin mohlo být spuštěno pouze na hlavní instanci. Pokud je tento podíl vysoký, váhy pod ním tuto práci nemohou přesunout. Informace o tom, co zůstává na hlavní instanci a jak zvolit čísla, naleznete v části [Rozložení zátěže](./cluster.md).

## Co v tomto dialogu není

| Funkce | Kde ji najít |
|---------|-----------------|
| **Správa API klíčů (MCP)** | [Karta MCP](../tabs/mcp-tab.md) – zobrazení, kopírování a regenerace API klíče serveru MCP |
| **Motiv (tmavý / světlý)** | Přepínač Slunce/Měsíc v záhlaví (vedle odznaku uživatele) |
| **Změna e-mailu** | Aktuálně nepodporováno |

## Související

- [AI asistent](./ai-assistant.md) – Chat pro tvorbu Workflow, který používá uživatelská pravidla
- [Karta Chat](../tabs/chat-tab.md) – Chat na dashboardu, který používá uživatelská pravidla
- [Hlasový chat (TTS a STT)](./chat-voice.md) – Hlas ElevenLabs konfigurovaný na kartě Hlas
- [Karta MCP](../tabs/mcp-tab.md) – API klíč serveru MCP a zpřístupnění nástrojů Workflow
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – API klíče pro AI uzly a integrace
- [Zabezpečení](./security.md) – Správa relací, omezování rychlosti, šifrování přihlašovacích údajů
- [Single Sign-On](./sso.md) – Připojení externího poskytovatele OpenID Connect
- [OpenTelemetry Tracing](./opentelemetry.md) – Distribuované trasování spuštění Workflow a uzlů
