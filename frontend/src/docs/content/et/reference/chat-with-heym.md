# Chat Heymiga

Chat Heymiga on lehekülge teadvustav assistent, mis on kättesaadav dokumentatsiooni päisest. See avaneb tsentreeritud dialoogis, võimaldab valida LLM-i mandaadi ja mudeli ning vastab küsimustele, kasutades esmase kontekstina praegust dokumentatsiooni lehekülge.

## Dialoogi avamine

1. Avage mis tahes lehekülg asukohas `/docs`
2. Klõpsake päises **Chat Heymiga**
3. Valige [mandaat](../tabs/credentials-tab.md) ja mudel
4. Esitage küsimus lehekülje või platvormi kohta

Väiksematel ekraanidel on trigger ainult ikoonina; suurematel ekraanidel kuvatakse täielik silt.

## Millist konteksti see kasutab

- Praegu avatud dokumentatsiooni tee lisatakse päringusse kontekstuaalse juhisena
- Taustsüsteem kasutab endiselt olemasolevat armatuurlaua chat endpoint'i ja dokumentatsiooni otsingutööriistu
- Teie konto tasemel [User Rules](./user-settings.md) kehtivad jätkuvalt, kuna kasutatakse sama chat taustsüsteemi
- Reaalajas ettevalmistuse sammud voogedastatakse assistendi mulli enne lõplikku vastust, sarnaselt armatuurlaua chatiga
- Täpsustavad küsimused kuvatakse kaartidena, samamoodi nagu [Chat vahekaardil](../tabs/chat-tab.md). Kui workflow päring vajab mandaati, saate selle valida või luua kaardilt. Kui see vajab andmetabelit, saate valida ühe oma tabelitest või luua uue samal viisil.

Kui avate dialoogi konkreetsel artiklil, kuvab väike märgis aktiivse dokumentatsiooni tee, et saaksite kinnitada, millist lehekülge eelistatakse.

## Sessiooni käitumine

- Mandaadi ja mudeli valik püsivad paigal, kuni dialoog on üles seatud
- Sõnumite ajalugu on ainult sessioonipõhine ja tühjendatakse dialoogi sulgemisel
- Taustale klõpsamine, `Escape` ja sulgemisnupp lähtestavad kõik sessiooni
- **Stop** katkestab praeguse voogedastusvastuse
- Dialoog on tahtlikult lai ja fikseeritud suurusega; see ei paku täisekraani lülitit

## Millal seda kasutada

- Esitage järelküsimusi node'i või viitelehekülje lugemise ajal
- Selgitage funktsioonide erinevusi dokumentatsioonist lahkumata
- Leidke õige artikkel enne redaktori avamist

Kui soovite workflow'sid otse luua või muuta, kasutage selle asemel redaktori poolset [AI Assistant](./ai-assistant.md).

## Seotud

- [AI Assistant](./ai-assistant.md) – Redaktori chat workflow'de loomiseks
- [Credentials Tab](../tabs/credentials-tab.md) – Lisage LLM-i mandaadid, mida dialoog kasutab
- [Settings](./user-settings.md) – Globaalsed User Rules, mida rakendatakse AI liidestele
- [Quick Start](../getting-started/quick-start.md) – Esimese workflow läbimäng
