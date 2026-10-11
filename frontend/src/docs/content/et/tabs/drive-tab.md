# Drive vahekaart

Drive vahekaart kuvab kõiki faile, mille skillid on teie workflow'des genereerinud.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Vaadake Drive demo</a></p>

## Ülevaade

Skillide genereeritud failid (PDF, DOCX, CSV, pildid jne) salvestatakse automaatselt ja loetletakse Drive vahekaardil. Iga fail kuvab oma nime, tüübi, suuruse, allika sõlme, loomiskuupäeva ja meeskonnaga jagamise olekut.

## Funktsioonid

- **Otsing** – Filtreerige faile nime, tüübi või allika sõlme järgi
- **Kopeeri faili ID** – Kopeerige faili UUID lõikelauale, valmis kleepimiseks [Drive](../nodes/drive-node.md) või [Converter](../nodes/converter-node.md) sõlme
- **Laadi alla** – Autenditud allalaadimine teie failidele ja failidele, mida on teiega meeskondade kaudu jagatud
- **Jaga** – Looge jagatavaid allalaadimislinke valikulise paroolikaitse ja aegumisega või jagage faili kirjutuskaitstuna oma praeguste meeskondadega
- **Kustuta** – Eemaldage failid ja nende jagamislingid
- **Kustuta kõik** – Kustutage pärast kinnitust kõik failid ja nende jagamislingid
- **Hulgioperatsioonid** – Valige märkeruutudega mitu faili (vahemiku valimiseks Shift-klõps) ja rakendage neile kõigile korraga sama toimingut
- **Lehekülgede jagamine** – Sirvige suuri failikogumeid, kasutades ridade arvu valijat lehekülje kohta (25 / 50 / 100 / Kõik)

## Hulgioperatsioonid

Failid, mille omanik olete, kuvavad oma rea alguses märkeruutu (meeskonna kaudu teiega jagatud failid on kirjutuskaitstud ega ole valitavad). Valige mitu rida – või kasutage päise märkeruutu kogu lehekülje valimiseks ja **Shift-klõpsu** vahemiku valimiseks – seejärel kasutage loendi kohal kuvatavat hulgioperatsioonide riba:

- **Laadi alla ZIP** pakib kõik valitud failid ühte ZIP-arhiivi ja laadib selle alla
- **Hulgioperatsioonid** avab ühe dialoogi, et rakendada üht seadet kõigile valitud failidele:
  - **Jaga kõiki oma meeskondadega** / **Eemalda meeskonnaga jagamine** ühe klõpsuga
  - **Loo igale failile jagamislink**, kasutades samu parooli, aegumise ja maksimaalsete allalaadimiste seadeid
- **Kustuta** eemaldab pärast kinnitust kõik valitud failid ja nende jagamislingid
- **Tühista valik** tühistab kõigi failide valiku

Dialoog teatab, mitmele failile see rakendus (failid, mille omanik te ei ole, jäetakse vahele). Kasutage ridade arvu valija valikut **Kõik**, et laadida kõik failid ühele leheküljele ja valida üle kogu Drive'i. Otsingukasti sisestamine lülitab ridade arvu valija automaatselt valikule **Kõik**, et otsing hõlmaks kõiki faile, mitte ainult praegust lehekülge; otsingu tühjendamine taastab teie eelmise valiku.

## Jagamine

Looge jagamislinke järgmistega:
- **Autentimiseta** – Avalik tokenipõhine allalaadimise URL
- **Basic Auth** – Parooliga kaitstud link (kasutajanimi: `file`)
- **Aegumine** – Valikuline ajal põhinev aegumine
- **Allalaadimispiirangud** – Valikuline maksimaalne allalaadimiste arv

Lubage failil **Jaga oma meeskondadega**, et muuta see nähtavaks kõigile meeskondadele, kuhu te praegu kuulute. Jagatud meeskonnaliikmed saavad kirjutuskaitstud juurdepääsu; haldustoimingud jäävad ainult omanikule.

## Agendi skilli juurdepääs

Agendi sõlme skillid saavad valida Drive'i failide lugemise. Kui skilli puhul on **Luba Drive'i failid** sisse lülitatud, saab selle Pythoni kood lugeda juurdepääsetavaid Drive'i faile faili ID või täpse failinime järgi genereeritud `heym_drive.py` abifunktsiooni kaudu. Seade on vaikimisi välja lülitatud.

Täpsemate üksikasjade saamiseks vaadake [Drive'i viidet](../reference/drive.md).

## Seotud

- [Drive'i sõlm](../nodes/drive-node.md) – Loetlege faile, hankige metaandmeid, jagage meeskondadega või muutke jagamise piiranguid workflow'st
- [Failide genereerimine](../reference/file-generation.md) – Kuidas skillid faile genereerivad
- [Drive'i viide](../reference/drive.md) – Jagamislingid, tokenid ja puhastamine
- [Portal](../reference/portal.md) – Faililingid portaali chat'i vastustes
