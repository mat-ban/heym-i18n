# Žurnālu cilne

**Žurnālu** cilne rāda Docker konteineru žurnālus Heym stekam. To var izmantot atkļūdošanai, uzraudzībai un problēmu risināšanai. Lai iegūtu darba plūsmu izpildes žurnālus (mezglu rezultātus, izejas), izmantojiet Debug paneli darba plūsmas redaktorā—skatiet [Kanvas funkcijas](../reference/canvas-features.md#execution-logs).

Docker atbalstītie žurnāli pēc noklusējuma ir atslēgti pašizvietotās instalācijās. Lai tos aktivizētu, iestatiet `DOCKER_LOGS_ENABLED=true`, norādiet `DOCKER_LOGS_ALLOWED_EMAILS` kā uzticamu lietotāju e-pastu sarakstu, kas var piekļūt Docker žurnāliem, un pārliecinieties, ka `/var/run/docker.sock` ir pievienots aizmugures konteineram. Noklusējuma Docker Compose pakalpojums un tiešais `docker run` piemērs ietver šo montāžu Docker balstītajiem MCP stdio rīkiem; saglabājiet to tikai tad, ja piekrītat Docker soketa uzticības robežai.

Ja reģistrācija ir atvērta, izveidojiet uzticamo administratora kontu pirms Docker žurnālu aktivizēšanas vai saglabājiet `ALLOW_REGISTER=false`; citādi neapstiprināta pašreģistrācija varētu pieprasīt atļautā e-pasta adresi.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Skatīt žurnālu demonstrāciju</a></p>

## Konteineru izvēle

- **Visi konteineri** – Apvienotie žurnāli no aizmugures, priekšpuses un PostgreSQL
- **Aizmugure** – `heym-backend` konteineru
- **Priekšpuse** – `heym-frontend` konteineru
- **PostgreSQL** – `heym-postgres` konteineru

## Žurnāla līmeņa filtrs

- **Visi** – Rādīt visus žurnāla līmeņus
- **INFO** – INFO un augstāki
- **WARNING** – Brīdinājumi un kļūdas
- **ERROR** – Tikai kļūdas
- **DEBUG** – Debug un augstāki

## Meklēšana

- Filtrēt žurnālus pēc teksta meklēšanas
- Atbilstības tiek izceltas žurnāla izejā

## Funkcijas

- **Automātiskā ritināšana** – Ritināt uz leju, kad ierodas jauni žurnāli
- **Plūsma** – Plūstoši žurnāli reālajā laikā (ja atbalstīts)
- **Kopēt** – Kopēt žurnālus starpliktuvē
- **Lejupielādēt** – Lejupielādēt žurnālus kā failu

## Lietošanas gadījumi

- Atkļūdot darba plūsmas izpildes kļūmes
- Pārbaudīt API pieprasījumu/atbilžu žurnālus
- Uzraudzīt datu bāzes vaicājumus
- Pārbaudīt palaišanas un veselības ziņojumus

## Saistītie

- [Kanvas funkcijas](../reference/canvas-features.md) – Izpildes žurnāli darba plūsmas Debug panelī
- [Izpildes cilne](./traces-tab.md) – LLM izpildes izpēte
- [Analītikas cilne](./analytics-tab.md) – Izpildes metri
- [Darba plūsmu cilne](./workflows-tab.md) – Darba plūsmu pārvaldība
- [Kontekstualizēta demonstrācija](../reference/contextual-showcase.md) – Kompakts lapas ceļvedis informācijas paneļa virsmām
