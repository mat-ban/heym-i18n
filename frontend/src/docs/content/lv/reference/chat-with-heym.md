# Chat ar Heym

Chat ar Heym ir lapu apzināts asistents, kas pieejams dokumentācijas galvenē. Tas atveras centrētā dialogā, ļauj izvēlēties LLM akreditācijas datus un modeli un atbild uz jautājumiem, izmantojot pašreizējo dokumentācijas lapu kā pirmo kontekstu.

## Dialoga atvēršana

1. Atveriet jebkuru lapu sadaļā `/docs`
2. Galvenē noklikšķiniet uz **Chat ar Heym**
3. Izvēlieties [akreditācijas datus](../tabs/credentials-tab.md) un modeli
4. Uzdodiet jautājumu par lapu vai platformu

Mazākos ekrānos aktivizētājs ir tikai ikona; lielākos ekrānos tas rāda pilnu apzīmējumu.

## Kādu kontekstu tas izmanto

- Pašlaik atvērtais dokumentācijas ceļš tiek ievadīts pieprasījumā kā kontekstuāla norāde
- Aizmugursistēma joprojām izmanto esošo dashboard chat endpoint un dokumentācijas meklēšanas rīkus
- Jūsu konta līmeņa [User Rules](./user-settings.md) joprojām tiek piemēroti, jo tiek izmantota tā pati chat aizmugursistēma
- Sagatavošanas soļi tiešraidē tiek straumēti asistenta burbulī pirms galīgās atbildes, līdzīgi kā dashboard chat
- Precizējošie jautājumi parādās kā kartītes, tāpat kā [Chat tab](../tabs/chat-tab.md). Kad workflow pieprasījumam nepieciešami akreditācijas dati, varat izvēlēties vienus vai izveidot tos no kartītes. Kad tam nepieciešama datu tabula, varat izvēlēties vienu no savām tabulām vai tādā pašā veidā izveidot jaunu.

Atverot dialogu konkrētā rakstā, neliela nozīmīte rāda aktīvo dokumentācijas ceļu, lai varētu pārliecināties, kurai lapai tiek piešķirta prioritāte.

## Sesijas darbība

- Akreditācijas datu un modeļa izvēle paliek spēkā, kamēr dialogs ir montēts
- Ziņojumu vēsture ir tikai sesijas ietvaros un tiek notīrīta, kad dialogs tiek aizvērts
- Fona noklikšķis, `Escape` un aizvēršanas poga visas atiestata sesiju
- **Stop** pārtrauc pašreizējo straumēto atbildi
- Dialogs ir apzināti plats un fiksēta izmēra; tam nav pilnekrāna pārslēga

## Kad to izmantot

- Uzdodiet papildu jautājumus, lasot node vai atsauces lapu
- Noskaidrojiet funkciju atšķirības, nepametot dokumentāciju
- Atrodiet pareizo rakstu pirms redaktora atvēršanas

Ja vēlaties veidot vai modificēt workflow tieši, izmantojiet redaktora puses [AI Assistant](./ai-assistant.md).

## Saistītie

- [AI Assistant](./ai-assistant.md) – Redaktora chat workflow veidošanai
- [Credentials Tab](../tabs/credentials-tab.md) – Pievienojiet LLM akreditācijas datus, ko izmanto dialogs
- [Settings](./user-settings.md) – Globālie User Rules, kas piemēroti AI virsmām
- [Quick Start](../getting-started/quick-start.md) – Pirmā workflow pamācība
