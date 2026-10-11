# Meeskondade vahekaart

**Meeskondade** vahekaart võimaldab luua ja hallata meeskondi, et jagada workflow'sid, mandaate, muutujaid, vektorhoidlaid ja Drive'i faile kasutajate rühmadega.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Vaadake meeskondade demo</a></p>

## Meeskonna loomine

1. Klõpsake **Uus meeskond**
2. Sisestage nimi ja valikuline kirjeldus
3. Klõpsake **Loo**

Teist saab automaatselt meeskonna looja ja esimene liige.

## Liikmete haldamine

- **Liikme lisamine** – Sisestage meeskonna üksikasjade dialoogis kasutaja e-posti aadress ja klõpsake **Lisa**
- **Liikme eemaldamine** – Klõpsake liikme kõrval X (looja eemaldamine ei ole võimalik)
- **Meeskonna muutmine** – Loojad saavad muuta nime ja kirjeldust
- **Meeskonna kustutamine** – Loojad saavad meeskonna kustutada; kõik meeskonnaga jagamised eemaldatakse
- **Jagatud ressursid** – Meeskonna üksikasjade dialoog kuvab workflow'sid, mandaate, muutujaid, vektorhoidlaid, Drive'i faile, workflow' mallid ja node'i malle, mis on meeskonnaga jagatud. Klõpsake workflow'l, et avada see redaktoris; muude ressursside jaoks lülituge vastavale vahekaardile.

## Meeskondadega jagamine

Jagage ressursse meeskondadega järgmistest kohtadest:

- **Workflows** – Jagamise dialoog workflow' redaktoris
- **Workflow' mallid** – Jagamise dialoog workflow' malli loomisel/muutmisel (nähtavus: konkreetsed kasutajad)
- **Node'i mallid** – Jagamise dialoog node'i malli loomisel/muutmisel (nähtavus: konkreetsed kasutajad)
- **Mandaadid** – Jagamise dialoog mandaatide vahekaardil
- **Muutujad** – Jagamise dialoog muutujate vahekaardil
- **Vektorhoidlad** – Jagamise dialoog vektorite vahekaardil
- **Tahvlid** – Tahvli seaded tahvli vahekaardil (lugemis- või kirjutamisõigus)
- **Drive'i failid** – Jagamise dialoog Drive'i vahekaardil või Drive'i node'i toimingud `shareWithMyTeams` / `unshareWithMyTeams`

Kui jagate meeskonnaga, saavad kõik meeskonnaliikmed juurdepääsu. Üksikasju vt [Meeskonnad](../reference/teams.md).

Kui jagate workflow'd meeskonnaga, jagage samale meeskonnale ka mandaate ja alam-workflow'sid, millest see workflow sõltub. Ainult workflow' juurdepääs ei anna juurdepääsu mandaatidele ega alam-workflow'dele.

## Chat'i integratsioon

[Chat'i vahekaardi](./chat-tab.md) AI-assistent saab loetleda teie meeskondi. Küsige "minu meeskonnad", et näha, millistesse meeskondadesse kuulute.

## Seotud

- [Meeskonnad](../reference/teams.md) – Meeskondade viide ja jagamise mudel
- [Mandaatide jagamine](../reference/credentials-sharing.md) – Mandaatide jagamine kasutajate ja meeskondadega
- [Workflow' korraldus](../reference/workflow-organization.md) – Kaustad ja jagamine
- [Kontekstipõhine tutvustus](../reference/contextual-showcase.md) – Kompaktne lehejuhend tahvli vaadete jaoks
