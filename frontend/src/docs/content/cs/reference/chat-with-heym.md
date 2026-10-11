# Chat s Heym

Chat s Heym je asistent pracující s kontextem stránky, který je dostupný v záhlaví dokumentace. Otevírá se v dialogovém okně uprostřed obrazovky, umožňuje zvolit přihlašovací údaje LLM a model a odpovídá na dotazy s aktuální stránkou dokumentace jako prvním kontextem.

## Otevření dialogu

1. Otevřete libovolnou stránku v sekci `/docs`
2. Klikněte na **Chat s Heym** v záhlaví
3. Zvolte [přihlašovací údaje](../tabs/credentials-tab.md) a model
4. Položte dotaz týkající se stránky nebo platformy

Na menších obrazovkách je spouštěč zobrazen pouze jako ikona; na větších obrazovkách zobrazuje celý popisek.

## Jaký kontext se používá

- Aktuálně otevřená cesta v dokumentaci je vložena do požadavku jako kontextové vodítko
- Backend nadále využívá stávající endpoint chatu dashboardu a nástroje pro vyhledávání v dokumentaci
- Vaše [Uživatelská pravidla](./user-settings.md) na úrovni účtu se nadále uplatňují, protože je znovu použit stejný backend chatu
- Živé kroky přípravy se streamují do bubliny asistenta před konečnou odpovědí, podobně jako v chatu dashboardu
- Dopňující otázky se zobrazují jako karty, stejně jako v [záložce Chat](../tabs/chat-tab.md). Pokud požadavek na workflow vyžaduje přihlašovací údaje, můžete některé zvolit nebo je vytvořit přímo z karty. Pokud vyžaduje datovou tabulku, můžete zvolit jednu ze svých tabulek nebo stejným způsobem vytvořit novou.

Když dialog otevřete na konkrétním článku, zobrazí se malý odznak s aktivní cestou v dokumentaci, abyste mohli ověřit, která stránka má prioritu.

## Chování relace

- Volba přihlašovacích údajů a modelu zůstává zachována, dokud je dialog otevřen
- Historie zpráv existuje pouze po dobu relace a při zavření dialogu se vymaže
- Kliknutí na pozadí, klávesa `Escape` i tlačítko zavření resetují relaci
- **Stop** přeruší aktuálně streamovanou odpověď
- Dialog je záměrně široký a s pevnou velikostí; nenabízí přepínač celé obrazovky

## Kdy jej použít

- Pokládejte dopňující otázky při čtení stránky uzlu nebo referenční stránky
- Vyjasněte si rozdíly mezi funkcemi, aniž byste opustili dokumentaci
- Najděte správný článek před otevřením editoru

Pokud chcete workflow přímo vytvářet nebo upravovat, použijte místo toho [AI asistenta](./ai-assistant.md) na straně editoru.

## Související

- [AI asistent](./ai-assistant.md) – Chat v editoru pro vytváření workflow
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidejte přihlašovací údaje LLM používané dialogem
- [Nastavení](./user-settings.md) – Globální uživatelská pravidla uplatňovaná na AI rozhraní
- [Rychlý start](../getting-started/quick-start.md) – První průchod workflow
