# Pikanäppäimet

Heym tarjoaa pikanäppäimet workflow-editorissa ja canvasissa yleisten toimintojen nopeuttamiseksi.

## Yleiset editorin pikanäppäimet

Nämä pikanäppäimet ovat käytössä missä tahansa workflow-editorissa.

| Pikanäppäin | Toiminto |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Avaa komentovalikko |
| `Ctrl + I` / `Cmd + I` | [Tekoälyavustajan](./ai-assistant.md) paneelin näkyvyys (toimii kirjoitettaessa) |
| `Ctrl + Enter` / `Cmd + Enter` | Suorita nykyinen workflow |
| `Ctrl + S` / `Cmd + S` | Tallenna workflow |
| `Ctrl + Z` / `Cmd + Z` | Kumoa |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Tee uudelleen |
| `Ctrl + Y` / `Cmd + Y` | Tee uudelleen (vaihtoehtoinen) |
| `Escape` | Sulje avoimet ponnahdusikkunat, valintaikkunat ja paneelit |

## Canvasin pikanäppäimet

Nämä pikanäppäimet ovat käytössä, kun canvas on aktiivinen (ei tekstinsyöttöä).

### Valinta ja navigointi

| Pikanäppäin | Toiminto |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Valitse kaikki solmut |
| `Shift` (painettuna) | Vedä valitaksesi useita solmuja |
| `Ctrl` / `Cmd` (painettuna) | Klikkaa lisätäksesi yksittäisiä solmuja valintaan |
| `Escape` | Poista kaikkien solmujen valinta; sulje sisäinen solmuhaku |

### Solmujen muokkaus

| Pikanäppäin | Toiminto |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Kopioi valitut solmut |
| `Ctrl + X` / `Cmd + X` | Leikkaa valitut solmut |
| `Ctrl + V` / `Cmd + V` | Liitä solmut |
| `Delete` tai `Backspace` | Poista valitut solmut ja/tai yhteydet |
| `D` | Vaihda valittujen solmujen käyttöön/poiskäytöstä -tila |
| `P` | Vaihda kiinnitetyn datan näkyvyyttä valitussa solmussa |

### Sisäinen solmuhaku

Minkä tahansa tulostettavan merkin kirjoittaminen canvasissa (kun tekstinsyöttö ei ole aktiivinen) avaa sisäisen solmuhakuikkunan. Kirjoitettu merkki muodostaa hakukyselyn ensimmäisen merkin.

| Pikanäppäin | Toiminto |
|----------|--------|
| Mikä tahansa tulostettava merkki | Avaa sisäisen solmuhaudun ja aloita kirjoittaminen |
| `Backspace` | Poista hakukyselyn viimeinen merkki |
| `Escape` | Sulje sisäinen solmuhaku |

## Komentovalikko (`Ctrl + K`)

Komentovalikko on käytettävissä editorista, kojelaudasta, dokumentaatiosta ja arviointinäkymistä. Sen avulla voit nopeasti siirtyä workflowihin, välilehtiin ja dokumentaatiosivuille jättämättä näppäimistöä.

| Pikanäppäin | Toiminto |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Avaa komentovalikko |
| `↑` / `↓` | Selaa tuloksien listaa |
| `Tab` / `Shift + Tab` | Selaa tuloksien listaa |
| `Enter` | Avaa valitun kohteen |
| `Escape` | Sulje valikko |

## Kojelaudan pikanäppäimet

Nämä pikanäppäimet ovat käytössä Workflows-välilehdellä, kun muuta tekstinsyöttöä ei ole aktiivisena.

| Pikanäppäin | Toiminto |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Kohdista workflow-hakuun |
| `Escape` | Tyhjennä workflow-haku, kun siinä on tekstiä |

## Ominaisuuspanelin pikanäppäimet

Nämä pikanäppäimet ovat käytössä, kun solmu on valittuna ja ominaisuuspaneli on auki.

| Pikanäppäin | Toiminto |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Avaa linkitetty aliworkflow uuteen välilehteen (vain Execute-solmu) |

## Arviointivalikon pikanäppäimet

Nämä pikanäppäimet ovat käytössä, kun Arviointi-valintaikkuna on auki.

| Pikanäppäin | Toiminto |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Käytä lauseke ja sulje valintaikkuna |
| `Ctrl + Z` / `Cmd + Z` | Kumoa muutokset lausekkeen editorissa |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Tee uudelleen muutokset lausekkeen editorissa |
| `Ctrl + Y` / `Cmd + Y` | Tee uudelleen muutokset lausekkeen editorissa (vaihtoehtoinen) |

## Historian ja suoritusten pikanäppäimet

Nämä pikanäppäimet ovat käytettävissä Suoritushistoria-valintaikkunassa ja Suoritukset-paneelissa.

| Pikanäppäin | Toiminto |
|----------|--------|
| `S` | Vaihda hakukenttä merkintöjen suodattamiseen |

## Aiheeseen liittyvät

- [Canvasin ominaisuudet](./canvas-features.md) – Datakiinnitys, käyttöön/poiskäytöstä, erottelu aliworkflowksi
- [Workflown rakenne](./workflow-structure.md) – Solmun ja yhteyden muoto
- [Execute-solmu](../nodes/execute-node.md) – Kutsuu aliworkflowja (`Ctrl + Shift + O`)
- [Pika-aloitus](../getting-started/quick-start.md) – Rakenna ensimmäinen workflowsi

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
