# Drive

Drive skirtas centrinis vieta peržiūrėti, valdyti ir dalintis visais failais, kuriuos generuoja įgūdžiai.

## Prieiga prie Drive

Eikite į **Drive** skirtuką valdymo pultelyje. Visi failai, kuriuos generuoja Jūsų workflow įgūdžiai, rodomi čia, rūšiuojami pagal sukūrimo datą.

## Failų sąrašas

Failų sąrašas rodo:

- **Pavadinimas** - Originalus failo pavadinimas su tipo specifiniu ikona
- **Tipas** - Failo MIME tipas (pvz., pdf, csv, docx)
- **Dydis** - Žmonėms suprantamas failo dydis
- **Šaltinis** - Mazgo etiketė, kuri sugeneravo failą
- **Data** - Kada failas buvo sukurtas
- **Veiksmai** - Atsisiuntimo, dalinimosi ir trynimo mygtukai

## Masiniai veiksmai

Kiekvienas failas, kurį turite, turi žymimąjį langelį savo eilutės pradžioje. Failai, kurie su Jumis dalijami per komandą, yra tik skaitymui ir negali būti pasirinkti. Pasirinkite kelis failus (Shift + paspaudimas pasirinks nuoseklų diapazoną; antraštės žymėjimo langelis pasirinks visą puslapį), kad atskleistumėte masinių veiksmų juostą virš sąrašo, tada spustelėkite **Masiniai veiksmai**, kad atidarytumėte dialogą, kuris taiko tą patį nustatymą visiems pasirinktiems failams:

- **Dalinti visiems mano komandoms** / **Pašalinti komandos dalinimą** — perjungia komandos dalinimą visiems pasirinktiems failams vienu metu
- **Sukurti dalinimosi nuorodą kiekvienam failui** — sukuria dalinimosi nuorodą kiekvienam pasirinktam failui, naudojant tuos pačius galiojimo, slaptažodžio ir maksimalios atsisiuntimų vertes

Dialogas praneša, kiek failų jis taikė; failai, kurių neturite, yra praleidžiami. Eilučių per puslapį pasirinkimo mygtukas (25 / 50 / 100 / **Visi**) sąrašo apačioje leidžia įkelti daugiau failų viename puslapyje, kad galėtumėte pasirinkti visą savo Drive.

## Failų dalinimas

Spustelėkite **Dalinimosi** ikoną, kad atidarytumėte dalinimosi dialogą. Galite sukurti kelias dalinimosi nuorodas kiekvienam failui su skirtingomis konfigūracijomis ir, pasirinktinai, dalintis failu su savo esamomis komandomis.

### Vieša nuoroda (pagal token)

Sukurkite dalinimosi nuorodą be slaptažodžio. Bet kas, turintis nuorodą, gali atsisiųsti failą.

### Slaptažodžiu apsaugota nuoroda (Pagrindinė autentifikacija)

Nustatykite slaptažodį, kai kuriate dalinimą. Atsisiuntimo URL naudoja HTTP Basic Authentication - naršyklės paprašys vartotojo vardo (`file`) ir slaptažodžio, kai nuoroda bus atidaryta.

### Nuorodų parinktys

- **Galioja (valandos)** - Pasirinktinai nustatykite galiojimo laiką
- **Maksimalūs atsisiuntimai** - Pasirinktinai apribokite atsisiuntimų skaičių
- Abu gali būti derinami, kad būtų maksimaliai kontroliuojama

### Dalinti su mano komandomis

Įgalinkite **Dalinti su mano komandomis**, kad suteiktumėte tik skaitymo prieigą visoms komandoms, kurioms šiuo metu priklausote. Komandos nariai gali matyti ir atsisiųsti failą iš Drive ir naudoti skaitymo orientuotas Drive mazgo operacijas, tačiau tik failo savininkas gali ištrinti failą, sukurti ar atšaukti viešas nuorodas arba keisti slaptažodį/TTL/atsisiuntimų limitus.

Nustatymas yra failo specifinis. Jei vėliau prisijungiate prie kitos komandos arba ją sukuriate, vėl perjunkite dalinimą arba vykdykite Drive mazgo `shareWithMyTeams` operaciją, kad pridėtumėte tą komandą. Naudokite `unshareWithMyTeams`, kad pašalintumėte komandos dalinimus iš failo workflow.

### Dalinimų valdymas

Dalinimosi dialogas rodo visas esamas dalinimosi nuorodas su:
- Dabartiniu atsisiuntimų skaičiumi
- Galiojimo būsena
- Ar įjungta Pagrindinė autentifikacija
- Kopijavimo ir atšaukimo mygtukai

## Failų nuorodos Chat & Portal

Kai įgūdis generuoja failus vykdant workflow per Portal chat arba Quick Drawer, atsisiuntimo nuorodos automatiškai pasirodo atsakyme. Vartotojai gali spustelėti, kad atsisiųstų tiesiogiai.

## Saugojimas

Generuoti failai saugomi serverio failų sistemoje po `data/files/`. Docker diegimuose tai montuojama kaip tūris, kad būtų užtikrintas išsaugojimas.

## Failų valdymas iš Workflows

[Drive mazgas](../nodes/drive-node.md) leidžia Jums valdyti Drive failus programiškai iš workflow. Naudokite jį:

- **Sąrašui** Jūsų failus ir grąžinti metaduomenis, tokius kaip failo pavadinimas, MIME tipas, dydis, šaltinis ir atsisiuntimo URL
- **Ištrinti** failą po to, kai jis buvo pristatytas vartotojui
- **Dalinti arba atšaukti dalinimą su Jūsų komandomis**, kad komandos nariai galėtų jį skaityti ir atsisiųsti tik kol komandos dalinimas egzistuoja
- **Nustatyti slaptažodį** atsisiuntimo nuorodai
- **Nustatyti TTL**, kad nuoroda galioja po N valandų
- **Nustatyti maksimalų atsisiuntimų** limitą

Failo konvertavimas į kitą formatą yra [Converter mazgo](../nodes/converter-node.md) užduotis, su `conversion: "fileConvert"`. Jis skaito Drive failą ir saugo konvertuotą rezultatą kaip naują.

Nuorodą į failą nurodykite pagal jo ID iš įgūdžio išvesties: `$agentLabel._generated_files[0].id`

Žr. [Drive mazgo dokumentaciją](../nodes/drive-node.md) konfigūracijos detalėms.

## Drive failų skaitymas iš įgūdžių

Agentų įgūdžiai gali pasirinkti Drive skaitymus su įgūdžio kortelės **Įgalinti Drive failus** nustatymu. Kai įgalinta, įgūdžio vykdymo laikas apima sugeneruotą `heym_drive.py` pagalbinį failą. Įgūdžio kodas gali importuoti pagalbinius failus, tokius kaip `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` ir `list_drive_files`.

Drive skaitymai yra apriboti failams, prieinamoms workflow aktoriui: turimiems failams ir failams, kurie su aktoriumi dalijami per komandas. Naudokite failo ID tiksliam paieškai arba tikslų failo pavadinimą, kai vartotojas nurodo failą pagal pavadinimą. Failo pavadinimo paieška grąžina naujausią prieinamą failą su tuo pavadinimu; `list_drive_files(filename="...")` grąžina visus atitikmenis.

## Susiję

- [Drive mazgas](../nodes/drive-node.md) - Workflow operacijos (sąrašas, gauti, ištrinti, slaptažodis, TTL, maksimalūs atsisiuntimai, komandos dalinimas)
- [Drive skirtukas](../tabs/drive-tab.md) - Naršyti failus valdymo pultelyje
- [Failų generavimas](./file-generation.md) - Kaip `_generated_files` ir atsisiuntimo URL yra gaminami

## Valymas
Pasibaigę dalinimosi tokenai automatiškai valomi kasdien. Patys failai išlieka, kol nėra rankiniu būdu ištrinti per Drive skirtuką. Naudokite **Išvalyti viską**, kad ištrintumėte kiekvieną failą ir jų dalinimosi nuorodas vienu veiksmu.
