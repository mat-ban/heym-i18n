# Failų analizė

Failų analizė leidžia Chat, [Agent mazgui](../nodes/agent-node.md) ir [Code mazgui](../nodes/code-node.md) atidaryti bei analizuoti didelius failus iš [Drive](./drive.md) izoliuotoje Python smėliadėžėje. PDF, skaičiuoklės, CSV, DOCX ir JSON failai pirmiausia patikrinami ir skaitomi pasirinktinai, todėl 200 puslapių sutarčiai ar milijono eilučių darbaknygei niekada nereikia tilpti į modelio kontekstą.

## Kaip tai veikia

Kiekvienas iškvietimas vykdomas naujame konteineryje be prieigos prie tinklo. Reikalingi failai nukopijuojami tik skaitymo režimu, kodas įvykdomas ir konteineris pašalinamas. Nedidelis darbinis aplankas išlieka tarp tos pačios sesijos iškvietimų, todėl vėlesnis žingsnis gali remtis ankstesnio žingsnio išsaugotais rezultatais.

| Kelias | Turinys |
|------|--------|
| `/input` | Šios sesijos Drive failai, tik skaitomi |
| `/work` | Darbinė erdvė, išliekanti sesijos metu, pvz., `/work/sales.pkl` |
| `/work/out` | Čia įrašyti failai po iškvietimo išsaugomi Drive ir grąžinami kaip nuorodos |

Smėliadėžėje iš anksto įdiegti pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx ir langdetect paketai bei Tesseract OCR, kurį naudoja ir [Converter mazgas](../nodes/converter-node.md).

## Įrankiai

Modelis veikia su trimis įrankiais, o ketvirtasis pasiekiamas Chat aplinkoje:

| Įrankis | Funkcija |
|------|----------|
| `list_files` | Išvardija Drive failus, kuriuos galite atidaryti: pavadinimas, tipas, dydis, data |
| `inspect_file` | Grąžina failo tipą, metaduomenis ir struktūrą su trumpa ištrauka |
| `run_python` | Vykdo Python nurodytiems failams ir grąžina konsolės išvestį |
| `clear_workspace` | Tik Chat: ištrina pokalbio darbinį aplanką |

`inspect_file` skaito tik tai, kas būtina suvestinei:

| Tipas | Suvestinė |
|-----|-----------------|
| PDF | Puslapių skaičius, pavadinimas ir autorius, ar galima išgauti tekstą, kalba, puslapių dydžiai, pirmojo puslapio tekstas ir lentelės. Nuskaityti PDF skaitomi su OCR (iki 5 puslapių) |
| XLSX / XLS | Lapai su eilučių ir stulpelių skaičiumi, antraščių eilutės, tipai, pandas `read_hint`, įvardytieji diapazonai, pirmosios eilutės |
| CSV / TSV | Koduotė, skyriklis, eilučių skaičius, stulpeliai su tipais, pirmosios eilutės |
| DOCX | Antraščių struktūra, lentelės, žodžių ir simbolių skaičius, autorius ir data |
| JSON | Šakninis tipas, raktai, masyvo ilgis, įdėjimo gylis, pavyzdiniai įrašai |

Atidarykite failą `run_python` viduje naudodami modulį `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Chat aplinkoje

Prisekite PDF, skaičiuoklės, DOCX, CSV ar JSON failus, paveikslėlius (PNG, JPG, GIF, WebP) arba paprasto teksto failus [Chat skirtuke](../tabs/chat-tab.md), Heym Work Chat arba per MCP įrankį `heym_chat`. Viena žinutė gali talpinti iki 10 failų. Kiekvienas failas saugomas jūsų Drive; į žinutę patenka tik jo pavadinimas ir ID. Chat patikrina failą, perskaito klausimui reikalingą dalį ir atsako lentelėmis arba ištraukomis.

## Workflow procesuose

Vykdymas atidaro tik savo failus: įkeltus per [Failo Įkėlimo Trigger mazgą](../nodes/file-upload-trigger-node.md), tuos, kuriuos mazgai įrašė į Drive, ir tuos, kuriuos [Drive mazgas](../nodes/drive-node.md) gavo atlikdamas veiksmą **Get** to paties vykdymo metu.

- **Agent mazgas**: jei agento įvestyje ar žinutėje yra failas, jis automatiškai gauna aukščiau nurodytus įrankius tiems failams.
- **Code mazgas**: nustatykite **Files** į išraišką, pvz., `$Upload.file.id`. Failai prijungiami ir išvardijami `params.files`.

## Apribojimai

| Apribojimas | Reikšmė |
|-----------|------|
| Atmintis vienam iškvietimui | 2 GB |
| Laikas vienam iškvietimui | 120 sekundžių |
| Darbinis aplankas sesijai | 2 GB |
| Išvesties failai vienam iškvietimui | 20, iki 100 MB kiekvienas |
| Spausdinta išvestis, grąžinama modeliui | 20 000 simbolių |
| Failai vienam iškvietimui | 20 |

## Sauga

- Smėliadėžė neturi prieigos prie tinklo, neturi prieigos prie Heym nustatymų ar paslapčių ir veikia kaip neprivilegijuotas naudotojas.
- Failai analizuojami tik smėliadėžės viduje.
- Chat aplinkoje prieiga atitinka Drive: atidarote savo failus ir failus, bendrinamus su jūsų komandomis.
- Failo atidarymas Chat yra fiksuojamas audito žurnale.
- Failų turinys traktuojamas griežtai kaip duomenys; failo viduje esantys nurodymai nevykdomi.

## Reikalavimai

Failų analizei reikalinga smėliadėžės vidinė sistema Heym egzemplioriuje (Docker arba [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Susiję

- [Drive](./drive.md)
- [Code mazgas](../nodes/code-node.md)
- [Agent mazgas](../nodes/agent-node.md)
- [Chat skirtuke](../tabs/chat-tab.md)
