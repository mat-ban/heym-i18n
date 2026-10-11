# Pokalbis su Heym

Pokalbis su Heym yra puslapio konteksto asistentas, prieinamas iš dokumentacijos antraštės. Jis atsidaro centre esančiame dialoge, leidžia pasirinkti LLM kredencialą ir modelį, ir atsako į klausimus naudodamas dabartinio dokumento puslapį kaip pirmą kontekstą.

## Dialogo Atidarymas

1. Atidarykite bet kurį puslapį po `/docs`
2. Paspauskite **Pokalbis su Heym** antraštėje
3. Pasirinkite [kredencialą](../tabs/credentials-tab.md) ir modelį
4. Užduokite klausimą apie puslapį ar platformą

Mažesniuose ekranuose aktyvatorius rodomas tik kaip ikona; didesniuose ekranuose rodomas visas pavadinimas.

## Koks Kontekstas Naudojamas

- Dabartinis atidarytas dokumentų kelias įterpiamas į užklausą kaip kontekstinė gairė
- Backend'as vis dar naudoja esamą valdymo skydelio pokalbio endpoint'ą ir dokumentų paieškos įrankius
- Jūsų paskyros lygio [Vartotojo taisyklės](./user-settings.md) ir toliau galioja, nes tas pats pokalbio backend'as yra naudojamas
- Gyvi paruošimo žingsniai transliuojami į asistento burbulą prieš galutinį atsakymą, panašiai kaip valdymo skydelyje
- Paaiškinimo klausimai rodomi kaip kortelės, kaip ir [Pokalbio skirtuke](../tabs/chat-tab.md). Kai workflow užklausa reikalauja kredencialo, galite pasirinkti vieną arba sukurti ją iš kortelės. Kai reikia duomenų lentelės, galite pasirinkti vieną iš savo lentelių arba sukurti naują tokiu pačiu būdu.

Atidarius dialogą konkrečiame straipsnyje, mažas ženkliukas rodo aktyvų dokumentų kelią, kad galėtumėte patvirtinti, kuris puslapis yra prioritetinis.

## Sesijos Elgsena

- Kredencialo ir modelio pasirinkimas išlieka, kol dialogas yra atidarytas
- Žinučių istorija yra sesijos lygio ir išvaloma, kai dialogas uždaromas
- Paspaudus fono sritį, `Escape` klavišą arba uždarymo mygtuką, sesija atstatoma
- **Stop** nutraukia dabartinę transliuojamą atsakymą
- Dialogas yra specialiai platus ir fiksuoto dydžio; jis nesiūlo viso ekrano perjungimo

## Kada Naudoti

- Užduokite papildomus klausimus skaitydami mazgą ar nuorodų puslapį
- Paaiškinkite funkcijų skirtumus neišėję iš dokumentacijos
- Raskite tinkamą straipsnį prieš atidarydami redaktorių

Jei norite tiesiogiai kurti ar keisti workflows, naudokite redaktoriaus pusėje esantį [AI Assistant](./ai-assistant.md).

## Susiję

- [AI Assistant](./ai-assistant.md) – Redaktoriaus pokalbis kuriant workflows
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti LLM kredencialus, naudojamus dialoge
- [Nustatymai](./user-settings.md) – Globalios vartotojo taisyklės, taikomos AI paviršiams
- [Greitas pradžia](../getting-started/quick-start.md) – Pirmo workflow apžvalga
