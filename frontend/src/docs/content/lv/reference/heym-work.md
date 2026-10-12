# Heym Work

**Heym Work** ir papildu saskarne biznesa komandām, kas izveidota uz Heym platformas bāzes. Lietotāji apraksta uzdevumu saviem vārdiem, atbild uz dažiem jautājumiem un saņem workflow, ko Heym ir izveidojis un pārbaudījis. Darbs norit īpaši viņiem izveidotās lapās, tiek apstrādāti saskaņošanas pieprasījumi un katrs izpildes process tiek attēlots ar iesniedzēja vārdu. Heym katru uzdevumu izpilda fonā.

Heym Work darbojas kā atsevišķs konteiners līdzās Heym ar atsevišķu Heym komandas licenci. Uzziniet vairāk un piesakieties izmēģinājumam vietnē [heym.run/enterprise](https://heym.run/enterprise). Noskatieties [Heym Work video](https://youtu.be/5Z2gGo6bcpU), lai iepazītos ar divu minūšu pārskatu.

## Ko iegūst biznesa komandas

| Joma | Funkcionalitāte |
|------|-----------------|
| **Chat** | Aprakstiet uzdevumu teksta vai balss veidā. Heym jautā nepieciešamo informāciju, izveido workflow, to pārbauda un atzīmē kā Pārbaudīts. |
| **Lapas** | Piespraustas logrīku lapas: skaitļi, diagrammas, tabulas ar statusa iezīmēm, failu ievilkšanas zonas un apstiprinājumi. Tabulas rinda var atvērt savu detalizētās informācijas lapu. |
| **Apstiprinājumi** | Pārbaudes no [Human-in-the-Loop](./human-in-the-loop.md) posmiem gaida sadaļā Aktivitāte un lapās ar iespējām Apstiprināt, Pieprasīt izmaiņas un Noraidīt. |
| **Aktivitāte** | Katra izpilde kopā ar personu, kas to palaida, un instanci, kas to veica. |
| **Lomas** | Īpašnieks, Redaktors un Skatītājs. Pierakstīšanās notiek ar [Single Sign-On](./sso.md), ko Heym jau izmanto. |
| **Nozaru izdevumi** | Juridisko pakalpojumu, izglītības, finanšu, loģistikas, enerģētikas un e-komercijas izdevumos ir iekļautas gatavas lapas, paraugdati un nozarei pielāgoti darbplūsmu risinājumi. |

## Heym Work savienošana

Noskatieties [uzstādīšanas video](https://youtu.be/zXGfg1HPSLk), lai uzzinātu par visu konfigurācijas gaitu no pirmās komandas līdz sākumlapai.

Savienojumu konfigurē sadaļā **Iestatījumi → Heym Work**. Cilne ir redzama tikai instances administratoriem, kuri norādīti mainīgajā `HEYM_ADMIN_EMAILS`.

| Lauks | Funkcionalitāte |
|-------|-----------------|
| **Heym Work adrese** | Vieta, kur darbojas Heym Work, piemēram, `https://work.example.com`. Pēc pieteikšanās notiek atgriešanās šeit. Nospiediet **Saglabāt**. |
| **Integrācijas atslēga** | Poga **Ģenerēt atslēgu** izveido atslēgu, ko Heym Work izmanto katram pieprasījumam uz Heym. Tā tiek parādīta tikai vienu reizi kopā ar kopēšanas pogu. Heym saglabā tikai tās jaucējkodu (hash). |
| **Iespējot Heym Work** | Ieslēdz savienojumu. Vispirms nepieciešams ievadīt adresi un atslēgu. |
| Statuss | **Pēdējo reizi redzēts**, **Work versija** un **Licence**, kā pēdējo reizi ziņojis Heym Work. |

Pēc tam atveriet Heym Work adresi un pabeidziet iestatīšanu:

1. **Licence**: ievadiet Heym komandas piešķirto licences atslēgu.
2. **Heym**: ievadiet Heym adresi un integrācijas atslēgu.
3. **Īpašnieks**: pierakstieties ar kontu, kas norādīts kā Heym Work īpašnieks.

Tiek atvērta sākumlapa, kas ir gatava komandas darbam.

### Atslēgas maiņa

Darbība **Nomainīt atslēgu** aizstāj integrācijas atslēgu. Heym Work pārtrauc darbību, līdz tajā tiek ievadīta jaunā atslēga, un visi Heym Work pierakstītie lietotāji tiek izrakstīti. Izmantojiet šo iespēju, ja pastāv aizdomas par atslēgas noplūdi vai ja organizāciju pamet darbinieks, kuram tā bija pieejama.

### Savienojuma atspējošana

Izslēdziet slēdzi **Iespējot Heym Work**, lai pārtrauktu savienojumu. Pēc tam Heym Work atkārtoti pieprasīs Heym atslēgu. Heym jebkurā gadījumā turpina izpildīt visas darbplūsmas, grafikus un tīmekļa aizķeres (webhooks).

## Drošības modelis

- **Katra izmaiņa iet caur Heym.** Heym Work nolasa rādītos datus no Heym datubāzes un nosūta katru darbību uz Heym pa kanālu, kas aizsargāts ar atslēgu, kur Heym piemēro savus piekļuves noteikumus. Heym Work glabā savus datus atsevišķā shēmā `heym_work`.
- **Atslēga miera stāvoklī tiek glabāta kā jaucējkods.** Heym salīdzina iesniegtās atslēgas jaucējkodu un nekad nesaglabā atslēgu atklātā veidā.
- **Pierakstīšanās paliek Heym pārziņā.** Lietotāji piesakās caur Heym, izmantojot jūsu identitātes nodrošinātāju, kad ir ieslēgts [SSO](./sso.md).
- **Izmaiņas tiek auditētas.** Savienojuma saglabāšana un atslēgas maiņa ieraksta rindas `work_integration.update` un `work_integration.key_rotate` [audita žurnālā](./audit.md).

## Licencēšana

Heym Work nepieciešama sava licences atslēga, ko izsniedz Heym komanda. Katru dienu Heym Work nosūta vietnei heym.run savu licences ID, instalācijas ID, aktīvo lietotāju skaitu pēdējās 30 dienās, kopējo dalībnieku skaitu, izpildīto procesu skaitu pēdējās 24 stundās un Heym un Heym Work versijas. Darbplūsmu saturs, ievades dati, izvades dati un akreditācijas dati paliek tikai jūsu serveros.

Ja ikdienas sinhronizācija neizdodas 30 dienas, sākas 14 dienu labvēlības periods, pēc kura Heym Work saskarne pieprasa atslēgu Īpašniekam. Izmēģinājuma versija darbojas līdz pēdējai dienai un atsākas, kad Heym komanda to pagarina (atļauts viens izmēģinājums vienai instalācijai). Pats Heym turpina darboties bez pārtraukuma visu šo laiku. Tīkli bez interneta piekļuves izmanto bezsaistes licenci, kas pieejama caur enterprise@heym.run.

## Video

Visi Heym Work video ir pieejami [Heym Work atskaņošanas sarakstā](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Saistītās tēmas

- [Enterprise](./enterprise.md): Komerciālā licencēšana un atbalsts
- [Single Sign-On](./sso.md): Pierakstīšanās risinājums, ko izmanto Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Heym Work saskarnē attēlotās pārbaudes
- [Audita žurnāls](./audit.md): Ieraksti, kas rodas savienojuma izmaiņu rezultātā
- [Iestatījumi](./user-settings.md): Kur atrodas cilne Heym Work
