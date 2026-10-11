# Zavihek Drive

Zavihek Drive prikazuje vse datoteke, ki jih generirajo veščine v vaših workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Oglejte si predstavitev Drive</a></p>

## Pregled

Datoteke, ki jih generirajo veščine (PDF, DOCX, CSV, slike itd.), se samodejno shranijo in prikažejo v zavihku Drive. Vsaka datoteka prikazuje svoje ime, tip, velikost, izvorno vozlišče, datum ustvarjanja in stanje deljenja s timom.

## Funkcije

- **Iskanje** - Filtrirajte datoteke po imenu, tipu ali izvoru vozlišča
- **Kopiraj ID datoteke** - Kopirajte UUID datoteke v odložišče, pripravljen za lepljenje v [Drive](../nodes/drive-node.md) ali [Converter](../nodes/converter-node.md) vozlišče
- **Prenesi** - Avtentificirano prenašanje vaših datotek in datotek, ki so bile deljene z vami prek timov
- **Deli** - Ustvarite deljive povezave za prenos z opcijsko zaščito s geslom in potekom, ali delite datoteko samo za branje s svojimi trenutnimi timi
- **Izbriši** - Odstranite datoteke in njihove povezave za deljenje
- **Počisti vse** - Izbrišite vse datoteke in njihove povezave za deljenje po potrditvi
- **Masovne akcije** - Izberite več datotek s potrditvenimi polji (Shift-klik za obseg) in uporabite isto akcijo za vse hkrati
- **Stranjenje** - Prebrskajte velike zbirke datotek z izbirnikom vrstic na stran (25 / 50 / 100 / Vse)

## Masovne akcije

Datoteke, ki jih imate, prikazujejo potrditveno polje na začetku njihove vrstice (datoteke, ki so bile deljene z vami prek tima, so samo za branje in niso izbirne). Izberite več vrstic — ali uporabite potrditveno polje v glavi za izbiro celotne strani, in **Shift-kliknite** za izbiro obsega — nato uporabite vrstico masovnih akcij, ki se prikaže nad seznamom:

- **Prenesi ZIP** združi vse izbrane datoteke v en sam ZIP arhiv in ga prenese
- **Masovne akcije** odpre en sam pogovor za uporabo ene nastavitve na vsako izbrano datoteko:
  - **Deli vse s svojimi timi** / **Odstrani deljenje s timom** z enim klikom
  - **Ustvari povezavo za deljenje za vsako datoteko** z enakim geslom, potekom in nastavitvami največjega prenosa
- **Izbriši** odstrani vse izbrane datoteke in njihove povezave za deljenje po potrditvi
- **Počisti izbiro** deselectira vse

Pogovor poroča, koliko datotek je bilo obdelanih (datoteke, ki jih ne posedujete, so izpuščene). Uporabite možnost **Vse** izbirnika vrstic na stran, da naložite vse datoteke na eno stran in izberete čez celoten Drive. Vnos v iskalno polje samodejno preklopi izbirnik vrstic na stran na **Vse**, tako da iskanje pokriva vse datoteke, ne le trenutne strani; čiščenje iskanja obnovi vašo prejšnjo izbiro.

## Deljenje

Ustvarite povezave za deljenje z:
- **Brez avtentifikacije** - Javni URL za prenos na osnovi žetona
- **Osnovna avtentifikacija** - Povezava, zaščitena z geslom (uporabniško ime: `file`)
- **Potek** - Opcijski časovni potek
- **Omejitve prenosa** - Opcijska največja številka prenosov

Omogočite **Deli s svojimi timi** na datoteki, da jo naredite vidno vsem timom, ki jim trenutno pripadate. Člani deljenega tima dobijo dostop samo za branje; upravljalske akcije ostanejo samo za lastnike.

## Dostop do veščin agenta

Veščine na vozlišču Agent se lahko odločijo za branje datotek iz Drive. Ko je **Omogoči datoteke Drive** vklopljeno za veščino, lahko njen Python koda bere dostopne datoteke Drive po ID-ju datoteke ali natančnem imenu datoteke prek generiranega pomočnika `heym_drive.py`. Nastavitev je privzeto izklopljena.

Oglejte si [Drive referenco](../reference/drive.md) za popolne podrobnosti.

## Sorodno

- [Drive Node](../nodes/drive-node.md) - Seznam datotek, pridobivanje metapodatkov, deljenje s timi ali spreminjanje omejitev deljenja iz workflows
- [Generiranje datotek](../reference/file-generation.md) - Kako veščine generirajo datoteke
- [Drive referenca](../reference/drive.md) - Povezave za deljenje, žetoni in čiščenje
- [Portal](../reference/portal.md) - Povezave do datotek v odgovorih v portalu za klepet
