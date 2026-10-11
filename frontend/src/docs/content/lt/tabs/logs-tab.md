# Žurnalų skirtukas

**Žurnalų** skirtukas rodo Docker konteinerių žurnalus Heym stack. Naudokite jį derinimui, stebėjimui ir problemų sprendimui. Norint gauti darbo eigos vykdymo žurnalus (mazgų rezultatus, išvestis), naudokite derinimo skydelį darbo eigos redaktoriuje—žr. [Drobės funkcijos](../reference/canvas-features.md#execution-logs).

Docker palaikomi žurnalai pagal nutylėjimą yra išjungti savarankiškai talpinamuose diegimuose. Norėdami juos įjungti, nustatykite `DOCKER_LOGS_ENABLED=true`, nustatykite `DOCKER_LOGS_ALLOWED_EMAILS` kaip kableliais atskirtą patikimų vartotojų el. pašto adresų sąrašą, kurie gali pasiekti Docker žurnalus, ir įsitikinkite, kad `/var/run/docker.sock` yra prijungtas prie backend konteinerio. Numatytoji Docker Compose paslauga ir tiesioginis `docker run` pavyzdys apima šį prijungimą Docker pagrindu veikiančioms MCP stdio priemonėms; laikykite jį tik tada, kai priimate Docker socket patikimumo ribą.

Jei registracija yra atvira, sukurkite patikimą administratoriaus paskyrą prieš įjungdami Docker žurnalus arba laikykite `ALLOW_REGISTER=false`; kitaip nepatvirtinta savarankiška registracija gali pasinaudoti leidžiamu el. pašto adresu.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Žiūrėti žurnalų demonstraciją</a></p>

## Konteinerių pasirinkimas

- **Visi konteineriai** – Sujungti žurnalai iš backend, frontend ir PostgreSQL
- **Backend** – `heym-backend` konteineris
- **Frontend** – `heym-frontend` konteineris
- **PostgreSQL** – `heym-postgres` konteineris

## Žurnalo lygio filtras

- **Visi** – Rodyti visus žurnalo lygius
- **INFO** – INFO ir aukščiau
- **WARNING** – Įspėjimai ir klaidos
- **ERROR** – Tik klaidos
- **DEBUG** – Derinimo ir aukščiau

## Paieška

- Filtruoti žurnalus pagal teksto paiešką
- Atitikimai yra paryškinti žurnalo išvestyje

## Funkcijos

- **Automatinis slinkimas** – Slinkti į apačią, kai atvyksta nauji žurnalai
- **Srautas** – Stebėti žurnalus realiu laiku (kai palaikoma)
- **Kopijuoti** – Kopijuoti žurnalus į iškarpinę
- **Atsisiųsti** – Atsisiųsti žurnalus kaip failą

## Naudojimo atvejai

- Derinti darbo eigos vykdymo nesėkmes
- Tikrinti API užklausų/atsakymų žurnalus
- Stebėti duomenų bazės užklausas
- Patikrinti paleidimo ir sveikatos pranešimus

## Susiję

- [Drobės funkcijos](../reference/canvas-features.md) – Vykdymo žurnalai darbo eigos derinimo skydelyje
- [Vykdymų skirtukas](./traces-tab.md) – LLM vykdymo tyrimas
- [Analitikos skirtukas](./analytics-tab.md) – Vykdymo metrikos
- [Darbo eigos skirtukas](./workflows-tab.md) – Darbo eigos valdymas
- [Kontekstinis demonstravimas](../reference/contextual-showcase.md) – Kompaktiška puslapio gairė valdymo skydeliams
