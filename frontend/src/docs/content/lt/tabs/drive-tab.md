# Drive skirtas

Drive skirtas rodo visus failus, kuriuos generuoja įgūdžiai per Jūsų workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Žiūrėti Drive demonstraciją</a></p>

## Apžvalga

Failai, kuriuos generuoja įgūdžiai (PDF, DOCX, CSV, vaizdai ir kt.), automatiškai saugomi ir rodomi Drive skirtame. Kiekvienas failas rodo savo pavadinimą, tipą, dydį, šaltinio mazgą, sukūrimo datą ir komandos bendrinimo būseną.

## Funkcijos

- **Paieška** - Filtruokite failus pagal pavadinimą, tipą ar šaltinio mazgą
- **Kopijuoti failo ID** - Kopijuokite failo UUID į iškarpinę, paruoštą įklijavimui į [Drive](../nodes/drive-node.md) arba [Converter](../nodes/converter-node.md) mazgą
- **Atsisiųsti** - Autentifikuotas atsisiuntimas Jūsų failams ir failams, bendrinamiems su Jumis per komandas
- **Bendrinkite** - Sukurkite bendrinamus atsisiuntimo nuorodas su pasirinktinėmis slaptažodžio apsaugomis ir galiojimo laikais, arba bendrinkite failą tik skaitymui su savo dabartinėmis komandomis
- **Ištrinti** - Pašalinkite failus ir jų bendrinimo nuorodas
- **Išvalyti viską** - Ištrinkite kiekvieną failą ir jų bendrinimo nuorodas po patvirtinimo
- **Masiniai veiksmai** - Pasirinkite kelis failus su žymėjimo langeliais (Shift-spustelėkite, kad pasirinktumėte intervalą) ir taikykite tą pačią veiksmą visiems iš karto
- **Puslapiavimas** - Naršykite per dideles failų kolekcijas su eilučių per puslapį pasirinkimo galimybe (25 / 50 / 100 / Visi)

## Masiniai veiksmai

Failai, kuriuos turite, rodo žymėjimo langelį savo eilutės pradžioje (failai, bendrinami su Jumis per komandą, yra tik skaitymui ir nėra pasirenkami). Pasirinkite kelias eilutes — arba naudokite antraštės žymėjimo langelį, kad pasirinktumėte visą puslapį, ir **Shift-spustelėkite**, kad pasirinktumėte intervalą — tada naudokite masinių veiksmų juostą, kuri pasirodo virš sąrašo:

- **Atsisiųsti ZIP** sujungia kiekvieną pasirinktą failą į vieną ZIP archyvą ir atsisiunčia jį
- **Masiniai veiksmai** atidaro vieną dialogą, kad taikytumėte vieną nustatymą kiekvienam pasirinktam failui:
  - **Bendrinkite visus su mano komandomis** / **Pašalinti komandos bendrinimą** vienu spustelėjimu
  - **Sukurti bendrinimo nuorodą kiekvienam failui** naudojant tą patį slaptažodį, galiojimą ir maksimalų atsisiuntimų skaičių
- **Ištrinti** pašalina kiekvieną pasirinktą failą ir jo bendrinimo nuorodas po patvirtinimo
- **Išvalyti pasirinkimą** atžymi viską

Dialogas praneša, kiek failų jis taikė (failai, kurių neturite, yra praleidžiami). Naudokite eilučių per puslapį pasirinkimo galimybę **Visi**, kad įkeltumėte kiekvieną failą viename puslapyje ir pasirinktumėte visą savo Drive. Rašydami paieškos laukelyje automatiškai perjungiate eilučių per puslapį pasirinkimo galimybę į **Visi**, kad paieška apimtų kiekvieną failą, o ne tik dabartinį puslapį; išvalius paiešką, atkuriamas Jūsų ankstesnis pasirinkimas.

## Bendrinimas

Sukurkite bendrinimo nuorodas su:
- **Be autentifikacijos** - Vieša token pagrindu veikianti atsisiuntimo URL
- **Pagrindinė autentifikacija** - Slaptažodžiu apsaugota nuoroda (vartotojo vardas: `file`)
- **Galiojimas** - Pasirinktinė laiko pagrindu veikianti galiojimo trukmė
- **Atsisiuntimų limitai** - Pasirinktinė maksimali atsisiuntimų skaičius

Įgalinkite **Bendrinkite su mano komandomis** faile, kad jis būtų matomas visoms komandoms, kurioms šiuo metu priklausote. Bendrinami komandos nariai gauna tik skaitymo prieigą; valdymo veiksmai lieka tik savininkams.

## Agentų įgūdžių prieiga

Įgūdžiai Agent mazge gali pasirinkti skaityti Drive failus. Kai **Įgalinti Drive failus** yra įjungta įgūdžiui, jo Python kodas gali skaityti prieinamus Drive failus pagal failo ID arba tikslų failo pavadinimą per sugeneruotą `heym_drive.py` pagalbinį failą. Nustatymas pagal numatytuosius nustatymus yra išjungtas.

Žr. [Drive nuorodą](../reference/drive.md) visiems išsamiems duomenims.

## Susiję

- [Drive mazgas](../nodes/drive-node.md) - Išvardyti failus, gauti metaduomenis, bendrinti su komandomis arba keisti bendrinimo apribojimus iš workflow
- [Failų generavimas](../reference/file-generation.md) - Kaip įgūdžiai generuoja failus
- [Drive nuoroda](../reference/drive.md) - Bendrinimo nuorodos, tokenai ir valymas
- [Portalas](../reference/portal.md) - Failų nuorodos portalo pokalbių atsakymuose
