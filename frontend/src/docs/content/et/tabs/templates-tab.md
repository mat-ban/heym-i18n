# Mallide vahekaart

Mallide vahekaart võimaldab salvestada, sirvida ja taaskasutada terviklikke workflow'sid ja üksikuid node'e. Jagage midagi, mille olete korra loonud, ja rakendage seda uutes projektides ühe klõpsuga.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Vaadake mallide demo</a></p>

## Ülevaade

Malle on kahte tüüpi:

- **Workflow mallid** — salvestage terviklik workflow (kõik node'id ja ühendused) taaskasutatava lähtepunktina.
- **Node'i mallid** — salvestage üksik konfigureeritud node (nt häälestatud LLM node või kohandatud HTTP node) taaskasutamiseks erinevates workflow'des.

Vahetage nende kahe vahel, kasutades vahekaardi ülaosas olevat lülitit **Workflows / Nodes**.

Kasutage otsinguriba nähtavate mallide filtreerimiseks nime, kirjelduse, siltide või node'i tüübi järgi.

---

## Malli loomine

### Workflow mall

1. Avage redaktoris workflow, mida soovite jagada.
2. Klõpsake ülemisel tööriistaribal **Share as Template**.
3. Täitke nimi, kirjeldus ja valikulised sildid.
4. Valige nähtavus: **Everyone** (kõik kasutajad) või **Specific users** (sisestage kasutajanimed ja/või valige tiimid).
5. Klõpsake **Share**. Roheline teavitus kinnitab õnnestumist.

### Node'i mall

1. Tehke lõuendil mis tahes node'il paremklõps.
2. Valige kontekstimenüüst **Share as Template**.
3. Täitke vorm ja klõpsake **Share**.

---

## Malli kasutamine

### Workflow mall

1. Avage vahekaart **Templates** ja veenduge, et **Workflows** on valitud.
2. Klõpsake kaardil eelvaate avamiseks või klõpsake otse **Use**.
3. Workflow kloonitakse uueks workflow'ks, mis avaneb redaktoris.

### Node'i mall

1. Avage vahekaart **Templates** ja valige **Nodes**.
2. Klõpsake node'i malli kaardil **Use**.
3. Kuvatakse dialoog — valige, kuhu node lisada:
   - **New workflow** — loob uue workflow, mis sisaldab ainult seda node'i.
   - **Existing workflow** — valige oma workflow'de loendist; node lisatakse automaatselt, kui redaktor avaneb.

---

## Eelvaade

Klõpsake mis tahes malli kaardil täiseelvaate avamiseks:

- **Kaartide pisipildid** — malli kaardid kuvavad kohandatud kirjutuskaitstud lõuendi hetktõmmist nii workflow'de kui ka üksiku node'i mallide puhul.
- **Workflow mallid** — kirjutuskaitstud lõuend, mis vastab redigeerimisajaloo eelvaate stiilile, sealhulgas panoraamimine ja suumimine.
- **Node'i mallid** — salvestatud node avaneb samal kirjutuskaitstud lõuendil üksiku node'i eelvaatena.
- **Node'i üksikasjad** — klõpsake eelvaates mis tahes node'il, et vaadata selle salvestatud konfiguratsiooni külgpaneelil.
- Sildid, kasutuskordade arv ja **omanik** kuvatakse kõigi mallide puhul.

Eelvaate sulgemiseks vajutage **ESC** või klõpsake väljaspool.

---

## Mallide haldamine

- **Muutmine** – kui olete malli omanik, hõljutage kursorit kaardi kohal ja klõpsake pliiatsi ikoonil, et värskendada selle nime, kirjeldust, silte või nähtavust
- **Kustutamine** – kui olete malli omanik, hõljutage kursorit kaardi kohal ja kustutage mall pärast kinnitusviipa
- **Ainult omaniku toimingud** – muutmise ja kustutamise juhtnupud kuvatakse ainult teie loodud mallide puhul

---

## Käsukäskude palett (CTRL+K)

Mallid (nii workflow kui ka node'i mallid) on otsitavad **CTRL+K** käsukäskude paletist. Valige mall, et seda kohe kasutada — workflow mallid avanevad redaktoris, node'i mallid küsivad sihtkohta.

---

## Mallid Chat'is

Võite AI-lt küsida küsimusi oma mallide kohta — see teab kõiki malle teie tööruumis.

---

## Nähtavus

| Seade | Kes seda näeb |
|---|---|
| Everyone | Kõik platvormi kasutajad |
| Specific users | Kasutajad, kelle loetlete nime järgi, ja/või tiimid, mille valite — kõik tiimiliikmed saavad juurdepääsu |

Jagades valikuga **Specific users**, saate lisada nii üksikuid kasutajaid (nime järgi) kui ka tiime. Tiimiliikmed näevad malli vahekaardil Templates ja saavad seda kasutada.

---

## Seotud

- [Teams](../reference/teams.md) – Jagage malle tiimidega
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Lühike lehejuhend armatuurlaua vahekaartide kohta
