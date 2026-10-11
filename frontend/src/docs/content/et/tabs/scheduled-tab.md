# Ajakavade vahekaart

Vahekaart **Ajakavad** (Scheduled) kuvab kõiki aktiivseid cron-workflow'sid visuaalsel kalendril. Päeva, nädala ja kuu vaadete vahel saab lülituda, et näha, millal teie automatiseerimised on käivitamiseks ajastatud.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Vaadake ajakavade demo</a></p>

## Vaated

- **Päev** – Tunnipõhine ajatelg valitud päeva kohta; iga toimumine kuvatakse plokina oma ajastatud ajal
- **Nädal** – Seitsmest veerust koosnev ruudustik, mis hõlmab jooksvat nädalat; plokid kuhjuvad, kui mitu workflow'd käivituvad samal tunnil
- **Kuu** – Terve kuu ruudustik; iga lahter loetleb workflow'd, mis on sellel päeval käivitamiseks ajastatud

## Workflow' plokid

Iga plokk kuvab:

- **Workflow' nimi** – Klõpsake, et avada otse workflow' lõuend
- **Cron-avaldis** – Nähtav hõljumisel, kuvades töötlemata ajakava (nt `0 9 * * 1-5`)

## Navigeerimine

Instantsi administraatorid, kes on loetletud muutujas `HEYM_ADMIN_EMAILS`, näevad kõigi omanike ajakavasid, kui **Show all workflows** on märgitud. Tühjendage märge, et näha ainult oma workflow'sid. Teistel kasutajatel säilib valik **Show shared with me**. Töötaja automatiseerimise lõpetamiseks kasutage [instantsi halduse juhtelemente](./workflows-tab.md#instance-administration) workflow'de eelvaates, et triggerid peatada või jätkata.

- Kasutage **eelmise / järgmise** nooli, et liikuda päevade, nädalate või kuude vahel
- Nupp **Today** naaseb hetkega praeguse kuupäeva juurde

## Seotud

- [Cron-sõlm](../nodes/cron-node.md) – Ajastatud triggerite konfigureerimine lõuendil
- [Workflow'de vahekaart](./workflows-tab.md) – Kõigi workflow'de haldamine ja korraldamine
- [Analüütika vahekaart](./analytics-tab.md) – Käivituste mõõdikud ja trendid
