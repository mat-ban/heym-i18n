# Iestatījumi

Iestatījumu dialogs ļauj Jums pārvaldīt savu profilu, iestatīt pastāvīgas AI instrukcijas, atjaunināt Jūsu konta paroli, konfigurēt čata balsi, iestatīt noklusējuma AI akreditācijas datus un modeli, kā arī pārskatīt novērošanas statusu. Atveriet to, noklikšķinot uz **Jūsu avatāra un vārda** augšējā labajā stūrī.

## Dialoga atvēršana

Noklikšķiniet uz **Jūsu avatāra un vārda** augšējā labajā stūrī.Dialogs atveras ar šīm cilnēm: **Profils**, **Drošība**, **Balsis**, **AI Noklusējumi** un **Novērošana**. Instance administratoriem ir pieejama arī **SSO** cilne.

## Profila cilne

### Profila attēls

Heym rāda Jūsu [Gravatar](https://gravatar.com) attēlu, kas saistīts ar Jūsu konta e-pastu, galvenē, blakus Jūsu ziņojumiem [Čatā](../tabs/chat-tab.md) un **Čatā ar Heym**, [Board](../tabs/board-tab.md) komentāros un blakus Jūsu vārdam koplietošanas dialogos un komandas dalībnieku sarakstos. Lai to mainītu, atjauniniet attēlu Gravatar; Heym uzņems jauno attēlu dažu stundu laikā. Ja nav Gravatar attēla, Heym rāda Jūsu vārda pirmo burtu.

Attēls tiek iegūts no Heym servera un tiek kešots tur, tādējādi Jūsu pārlūkprogramma nekad nesazinās ar Gravatar. Ja serveris nevar piekļūt Gravatar, visi turpina redzēt iniciāļus.

### Vārds

Jūsu displeja vārds, kas tiek rādīts visā lietotnē. Šis lauks ir obligāts un to nedrīkst atstāt tukšu.

### Lietotāja noteikumi

Lietotāja noteikumi ir pielāgotas instrukcijas, kas automātiski tiek pievienotas katram AI pieprasījumam — gan darba plūsmas veidotājā, gan informācijas paneļa čatā. **Darba plūsmas veidotājā** ([AI Assistant](./ai-assistant.md)) tās tiek pievienotas sistēmas promptam, kas tiek izmantots, lai ģenerētu workflow JSON. **Informācijas paneļa čatā** tās tiek piemērotas kā sistēmas līmeņa konteksts. Jūs tās rakstāt vienreiz, un tās tiek piemērotas globāli, bez atkārtošanas katrā promptā.

**Biežākās izmantošanas:**

- Valoda vai tonis: `Vienmēr atbildiet angļu valodā. Saglabājiet atbildes kodolīgas.`
- Kodu stils: `Izmantojiet async/await modeļus. Dodiet priekšroku TypeScript interfeisiem pār tipiem.`
- Darba plūsmas konvencijas: `Iekļaujiet kļūdu apstrādi visās darba plūsmās. Izmantojiet aprakstošus mezglu nosaukumus.`
- Atbildes formāts: `Izmantojiet punktus. Izvairieties no garām skaidrojumiem.`

**Kur tās tiek piemērotas:**

| Konteksts | Apraksts |
|-----------|----------|
| **Darba plūsmas veidotājs** | [AI Assistant](./ai-assistant.md) pieprasījumi, lai ģenerētu vai modificētu darba plūsmas |
| **Informācijas paneļa čats** | Visi [Čata cilne](../tabs/chat-tab.md) sarunas |

Lietotāja noteikumi tiek pievienoti sistēmas līmenī — tie tiek izpildīti pirms katra prompta automātiski, bez papildu konfigurācijas katrai darba plūsmai vai sarunai.

### Profila izmaiņu saglabāšana

Noklikšķiniet uz **Saglabāt izmaiņas**, lai piemērotu. Izmaiņas stājas spēkā nekavējoties visiem jaunajiem AI pieprasījumiem.

## Drošības cilne

### Mainīt paroli

Izmantojiet Drošības cilni, lai atjauninātu Jūsu konta paroli.

**Prasības:**

| Noteikums | Prasība |
|-----------|---------|
| Minimālais garums | 8 rakstzīmes |
| Lielie burti | Vismaz viens lielais burts (A–Z) |
| Mazie burti | Vismaz viens mazais burts (a–z) |
| Cipars | Vismaz viens skaitlis (0–9) |

Parolei arī jāatšķiras no Jūsu pašreizējās paroles. Šie noteikumi tiek piemēroti gan frontend, gan backend.

**Soļi:**

1. Ievadiet savu **Pašreizējo paroli**
2. Ievadiet savu **Jauno paroli** (jāatbilst visām iepriekš minētajām prasībām)
3. Ievadiet vēlreiz **Apstipriniet jauno paroli**
4. Noklikšķiniet uz **Atjaunināt paroli**

Ja pašreizējā parole ir nepareiza, tiek parādīts iekļauts kļūdas ziņojums. Veiksmīgas darbības gadījumā parādās apstiprinājuma ziņojums, un forma automātiski tiek atiestatīta.

## Balsis cilne

Balsis cilne konfigurē runāto balsi [Čata cilnē](../tabs/chat-tab.md): izvēlieties **ElevenLabs akreditācijas datus** (vai pievienojiet tos tiešsaistē), izvēlieties **Balsi** no Jūsu ElevenLabs konta un **Saglabājiet balss iestatījumus**. Tas aktivizē katra ziņojuma izlasīšanu un interaktīvo balss režīmu. Skatiet [Čata balss (TTS & STT)](./chat-voice.md) pilnīgajai plūsmai.

## AI Noklusējumi cilne

AI Noklusējumi cilnei ir divas sadaļas.

### Vēlamie akreditācijas dati un modelis

Izvēlieties **vēlamo LLM akreditāciju** un **modeli** no tās. Tas kļūst par sākotnējo noklusējumu katrai AI funkcijai lietotnē — čatā, [AI Assistant](./ai-assistant.md) (veidotājs, analizators un darba plūsmas izveide), dēļa kartētājs, AI informācijas paneļa logrīki, [dokumentu čats](../tabs/chat-tab.md), datu tabulas AI shēmas palīgs, izteiksmju veidotājs un novērtējumi — kad šajā virsmā nav saglabātas izvēles.

Izvēles noteikumu katra virsma seko:

1. **Saglabāta izvēle** — izvēle, ko Jūs jau esat veicis šajā virsmā (piemēram, pēdējā čata sarunas modelis) vienmēr uzvar.
2. **Vēlamā** — tiek izmantota, kad nav saglabātas izvēles.
3. **Pirmais pieejamais akreditācijas datu** — rezerves variants, kad Jūs neesat iestatījis nekādas preferences.

Jūs joprojām varat mainīt akreditācijas datus un modeli katrā virsmā jebkurā laikā; preference tikai aizpilda sākotnējo noklusējumu. Atstājiet akreditācijas datus kā **Bez preferences**, lai saglabātu iepriekšējo pirmo akreditācijas datu uzvedību. Ja Jūsu vēlamā akreditācija vēlāk tiek dzēsta vai netiek koplietota, cilne parāda paziņojumu un virsmas klusi atgriežas pie pirmā pieejamā akreditācijas datu.
### Kodu pakotņu izmantošana

Katram **Codex** akreditācijas datiem (ieskaitot koplietojamos) cilnē tiek rādīta atlikusī likmju ierobežojuma izmantošana kā horizontāla josla katram aktīvajam logam — piemēram, **5 stundu** logs un/vai **Nedēļas** logs, atkarībā no Jūsu plāna. Katrs josla rāda atlikušā kvotas procentuālo daļu un atjaunošanas atpakaļskaitīšanu. **Atjaunot** poga pieprasa jaunu datu iegūšanu (rezultāti tiek īslaicīgi kešoti serverī).

Katram **OpenCode** akreditācijas datiem cilnē tiek rādīti OpenCode Go abonēšanas logi — **5 stundas**, **Nedēļa** un **Mēnesis** — tādā pašā joslu stilā, kas tiek nolasīts no vārtejas autentificētās izmantošanas galapunkta ar šī akreditācijas datu API atslēgu. Logs, kuram ir sasniegts ierobežojums, tiek rādīts kā **"ierobežojums sasniegts"** dzintara krāsā. Ja atslēga ir nederīga vai darba videi nav Go abonēšanas, kartē tiek norādīts iemesls, nevis rādītas joslas.

## Novērojamības cilne

Novērojamības cilne rāda tikai lasāmo statusu par [OpenTelemetry Tracing](./opentelemetry.md) šai instancei: vai izsekošana ir iespējota, OTLP galapunkts, pakalpojuma nosaukums, paraugu attiecība un kuri span'i tiek izlaisti. Izsekošana tiek konfigurēta, izmantojot `HEYM_OTEL_*` vides mainīgos aizmugurē, tāpēc šī cilne neko nemaina. Kad izsekošana ir atspējota, cilne uzskaita vides mainīgos, kas nepieciešami, lai to iespējotu. Noslēpumi, piemēram, OTLP autentifikācijas galvenes, šeit nekad netiek rādīti. Skatiet [Vides mainīgie](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) pilnai konfigurācijas atsaucei.

## SSO cilne

Redzama tikai instance administratoriem — konti, kas norādīti `HEYM_ADMIN_EMAILS`. Šī cilne savieno Heym ar ārēju OpenID Connect pakalpojumu, lai cilvēki varētu pieteikties ar jau esošajiem kontiem. Ievadiet izsniedzēja URL un klienta akreditācijas datus, kopējiet tikai lasāmā pāradresācijas URI savā pakalpojumā un palaidiet **Pārbaudīt savienojumu** pirms tā iespējot. Parole pieteikšanās var tikt izslēgta no šejienes, kad tests ir izturēts. Skatiet [Single Sign-On](./sso.md) pilnai iestatīšanai.

## Instance cilne

Redzama tikai instance administratoriem — konti, kas norādīti `HEYM_ADMIN_EMAILS`. Šī cilne uzskaita Heym instances, kas ir savienotas ar šo datu bāzi, un nosaka, kā fona izpildes tiek sadalītas starp tām. Katrs rinda rāda instances rediģējamo nosaukumu, tās lomu, vai tā ir aktīva, tās mērīto latentumu pret datu bāzi, ieslēgšanas/izslēgšanas slēdzi un tās svaru. Svari ir daļas no instancēm, kas pašlaik var veikt darbu, nevis procenti no 100: ar `41 / 26 / 33` un trešo instanci izslēgtu, pirmās divas patiesībā saņem 61% un 39%. Paneļa apakšā tiek drukāts šis efektīvais sadalījums, un tas atsakās saglabāt tikai tad, ja neviena iespējotā instance nav ar svaru vispār.

**Jaunām instancēm automātiski piešķirt daļu** ir ieslēgts pēc noklusējuma: instance, kas pievienojas, citādi atrastos ar svaru 0 un nesaņemtu neko, tāpēc vadītājs piešķir tai vienādu daļu vienreiz un samazina esošos svarus, saglabājot to attiecības. Tas nekad nepieskaras instancei, kuras svaru Jūs esat iestatījis paši.

Paneļa arī ziņo, cik daudz no pēdējām 24 stundu izpildēm varēja izpildīt tikai galvenā instance. Kad šī daļa ir augsta, apakšējie svari nevar pārvietot šo darbu. Skatiet [Slodzes sadalījums](./cluster.md) par to, kas paliek galvenajā un kā izvēlēties skaitļus.

## Kas nav šajā dialogā

| Funkcija | Kur to atrast |
|----------|----------------|
| **API atslēgu pārvaldība (MCP)** | [MCP cilne](../tabs/mcp-tab.md) – skatīt, kopēt un ģenerēt savu MCP servera API atslēgu |
| **Tēma (tumša / gaiša)** | Saules/Mēness pārslēgšanas poga galvenē (blakus lietotāja insignij) |
| **E-pasta maiņa** | Pašlaik netiek atbalstīta |

## Saistītie

- [AI Assistant](./ai-assistant.md) – Darbplūsmu veidotāja čats, kas izmanto Lietotāja noteikumus
- [Chat cilne](../tabs/chat-tab.md) – Informācijas paneļa čats, kas izmanto Lietotāja noteikumus
- [Chat Voice (TTS & STT)](./chat-voice.md) – ElevenLabs balss, kas konfigurēta Balss cilnē
- [MCP cilne](../tabs/mcp-tab.md) – MCP servera API atslēga un darbplūsmu rīku ekspozīcija
- [Credentials cilne](../tabs/credentials-tab.md) – API atslēgas AI mezgliem un integrācijām
- [Drošība](./security.md) – Sesiju pārvaldība, likmju ierobežošana, akreditācijas datu šifrēšana
- [Single Sign-On](./sso.md) – Savienojiet ārēju OpenID Connect pakalpojumu
- [OpenTelemetry Tracing](./opentelemetry.md) – Izplatīta izsekošana darbplūsmu un mezglu izpildēm
