# Chat with Heym

A Chat with Heym egy oldalfelismerő asszisztens, amely a dokumentáció fejlécéből érhető el. Középre igazított párbeszédablakban nyílik meg, lehetővé teszi egy LLM hitelesítési adat és modell kiválasztását, valamint a kérdésekre az aktuális dokumentációs oldalt első kontextusként használva válaszol.

## A párbeszédablak megnyitása

1. Nyisson meg egy tetszőleges oldalt a `/docs` alatt
2. Kattintson a **Chat with Heym** elemre a fejlécben
3. Válasszon egy [hitelesítési adatot](../tabs/credentials-tab.md) és modellt
4. Tegyen fel egy kérdést az oldallal vagy a platformmal kapcsolatban

Kisebb képernyőkön az indító csak ikonként jelenik meg; nagyobb képernyőkön a teljes címke látható.

## Milyen kontextust használ

- Az éppen megnyitott dokumentációs útvonal kontextuális útmutatásként kerül a kérésbe
- A háttérrendszer továbbra is a meglévő dashboard chat endpointot és a dokumentációkeresési eszközöket használja
- A fiókszintű [User Rules](./user-settings.md) továbbra is érvényesek, mivel ugyanaz a chat háttérrendszer kerül újra felhasználásra
- Az élő előkészítési lépések a végső válasz előtt az asszisztens buborékjába streamelnek, hasonlóan a dashboard chathez
- A tisztázó kérdések kártyákként jelennek meg, ugyanúgy, mint a [Chat tab](../tabs/chat-tab.md) esetében. Amikor egy workflow-kéréshez hitelesítési adat szükséges, kiválaszthat egyet, vagy létrehozhatja azt a kártyáról. Amikor adattáblára van szükség, kiválaszthatja az egyik tábláját, vagy ugyanígy létrehozhat egy újat.

Amikor a párbeszédablakot egy adott cikknél nyitja meg, egy kis jelvény mutatja az aktív dokumentációs útvonalat, így megerősítheti, melyik oldal élvez elsőbbséget.

## Munkamenet viselkedése

- A hitelesítési adat és a modell kiválasztása a helyén marad, amíg a párbeszédablak csatolva van
- Az üzenetelőzmények csak a munkamenetre vonatkoznak, és a párbeszédablak bezárásakor törlődnek
- A háttérre kattintás, az `Escape` és a bezárás gomb mind visszaállítja a munkamenetet
- A **Stop** megszakítja az aktuális streamelő választ
- A párbeszédablak szándékosan széles és fix méretű; nem kínál teljes képernyős váltást

## Mikor érdemes használni

- Tegyen fel további kérdéseket, miközben egy csomópontot vagy referenciaoldalt olvas
- Tisztázza a funkciók közötti különbségeket anélkül, hogy elhagyná a dokumentációt
- Találja meg a megfelelő cikket, mielőtt megnyitná a szerkesztőt

Ha közvetlenül szeretne workflow-kat építeni vagy módosítani, használja helyette a szerkesztőoldali [AI Assistant](./ai-assistant.md) eszközt.

## Kapcsolódó

- [AI Assistant](./ai-assistant.md) – Szerkesztői chat workflow-k építéséhez
- [Credentials Tab](../tabs/credentials-tab.md) – A párbeszédablak által használt LLM hitelesítési adatok hozzáadása
- [Settings](./user-settings.md) – Az AI felületekre alkalmazott globális User Rules
- [Quick Start](../getting-started/quick-start.md) – Az első workflow végigvezetése
