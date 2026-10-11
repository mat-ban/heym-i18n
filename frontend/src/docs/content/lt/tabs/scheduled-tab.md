# Tvarkaraščio skirtukas

**Tvarkaraščio** skirtukas rodo visus aktyvius cron workflows vizualiniame kalendoriuje. Perjunkite tarp dienos, savaitės ir mėnesio vaizdų, kad pamatytumėte, kada jūsų automatizacijos yra suplanuotos vykdyti.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Žiūrėti Tvarkaraščio demonstraciją</a></p>

## Vaizdai

- **Diena** – Valandų chronologija pasirinktai dienai; kiekvienas įvykis rodomas kaip blokas suplanuotu laiku
- **Savaitė** – Septynių stulpelių tinklelis, apimantis dabartinę savaitę; blokai susikaupia, kai keli workflows vykdomi tuo pačiu metu
- **Mėnuo** – Pilno mėnesio tinklelis; kiekviena langelis rodo workflows, suplanuotus vykdyti tą dieną

## Workflow blokai

Kiekvienas blokas rodo:

- **Workflow pavadinimas** – Spustelėkite, kad tiesiogiai atidarytumėte workflow drobę
- **Cron išraiška** – Matoma užvedus pelę, rodanti žalią tvarkaraštį (pvz., `0 9 * * 1-5`)

## Navigacija

Instance administratoriai, išvardyti `HEYM_ADMIN_EMAILS`, mato visų savininkų tvarkaraščius, kai pažymėta **Rodyti visus workflows**. Atžymėkite, kad matytumėte tik savo workflows. Kiti vartotojai išlaiko **Rodyti bendrinamus su manimi** parinktį. Norėdami nutraukti darbuotojo automatizaciją, naudokite [instance administravimo valdymo priemones](./workflows-tab.md#instance-administration) ant Workflows peržiūros, kad sustabdytumėte arba atnaujintumėte triggers.

- Naudokite **ankstesnius / kitus** rodykles, kad judėtumėte tarp dienų, savaičių ar mėnesių
- **Šiandien** mygtukas greitai grąžina į dabartinę datą

## Susiję

- [Cron mazgas](../nodes/cron-node.md) – Sukonfigūruokite suplanuotus triggers ant drobės
- [Workflows skirtukas](./workflows-tab.md) – Tvarkykite ir organizuokite visus workflows
- [Analitikos skirtukas](./analytics-tab.md) – Vykdymo metrikos ir tendencijos
