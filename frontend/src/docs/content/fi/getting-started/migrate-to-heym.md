# Siirtyminen HeyMIin

Onko työnkulkuja jo toisessa työkalussa? **AI Convert** muuntaa ne puolestasi Heym-työnkuluiksi. Liitä työnkulku n8n:stä, Flowisesta, Difystä, Langflowista, sim.aista tai Activepiecesistä — tai kuvaile vain, mitä haluat — ja Heym rakentaa vastaavan työnkulun live-kankaalle, jonka voi ladata ja tuoda.

Avaa se osoitteessa **[heym.run/convert](https://heym.run/convert)** tai käytä sivun ylätunnisteen **✨ AI Convert** -painiketta.

## Miten se toimii

1. **Valitse lähdetyökalu** (valinnainen) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces tai jätä *Auto*-tilaan.
2. **Anna työnkulku** — liitä nykyisestä työkalusta viety JSON tai kirjoita haluamasi automaatio selkokielellä.
3. **Luo** — Heym striimaa tuloksen kankaalle piirtäen solmut ja yhteydet sitä mukaa kun ne syntyvät.
4. **Lataa tai kopioi** luotu työnkulku JSON-muodossa.
5. **Tuo HeyMIin** — käytä [Download & Import](../reference/download-import.md) -toimintoa liittääksesi JSONin kankaalle ja suorita se.

Muunnos lisää kankaalle myös pienen *Sticky Noten*, joka merkitsee työnkulun Heymin luomaksi — se voidaan poistaa milloin tahansa.

## Mitä saat

Muunnin kartoittaa lähdekäsitteet natiiveille Heym-solmuille — Triggerit, [LLM](../nodes/llm-node.md) -vaiheet, [HTTP](../nodes/http-node.md) -kutsut, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) -toiminnot, [Loopit](../nodes/loop-node.md), [Ehdot](../nodes/condition-node.md) ja [Output](../nodes/output-node.md). Tarkista tulos kankaalla, liitä [Credentials](../reference/credentials.md) ja mukauta kaikki, minkä lähdetyökalu ilmaisi eri tavalla.

> AI Convert on lähtökohta, ei taattu 1:1-siirto. Tarkista luotu työnkulku aina ennen sen suorittamista tuotannossa.

## Hyvä tietää

- **AI-pohjainen:** muunnokset tuottaa suuri kielimalli, joten tulokset voivat vaihdella suorituskertojen välillä. Luo uudelleen, jos ensimmäinen tulos ei ole aivan oikea.
- **Syötteen koko:** liitetty tai kirjoitettu syöte on rajoitettu noin **25 000 tokeniin**. Karsi erittäin suuret vientitiedostot ennen muuntamista.
- **Nopeusrajoitukset:** työkalun pitämiseksi kaikkien saatavilla pyynnöt on rajoitettu **1 per minuutti, 5 per tunti ja 10 per päivä** kävijää kohden.
- **Turvallisuus:** pyynnöt seulotaan, ja vain työnkulun rakentamiseen liittyvät pyynnöt käsitellään.

## Seuraavat vaiheet

- Uusi kankaalla? Aloita [Quick Start](./quick-start.md) -oppaasta.
- Lue, miten tuonti toimii: [Download & Import](../reference/download-import.md).
- Heymin itseisännöinti? Katso täydellinen kokoonpanoviite: [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).
- Rakenna alusta alkaen sovelluksen sisäisellä [AI Assistant](../reference/ai-assistant.md) -työkalulla.
