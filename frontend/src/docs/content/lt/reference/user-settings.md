# Nustatymai

Nustatymų dialogas leidžia valdyti Jūsų profilį, nustatyti nuolatines AI instrukcijas, atnaujinti Jūsų paskyros slaptažodį, sukonfigūruoti pokalbių balsą, nustatyti numatytuosius AI kredencialus ir modelį bei peržiūrėti stebėjimo būseną. Atidarykite jį spustelėję **Jūsų avatarą ir vardą** viršutiniame dešiniajame kampe.

## Dialogo atidarymas

Spustelėkite **Jūsų avatarą ir vardą** viršutiniame dešiniajame kampe. Dialogas atsidaro su šiomis kortelėmis: **Profilis**, **Saugumas**, **Balsas**, **AI numatyti nustatymai** ir **Stebėjimas**. Instancijos administratoriai taip pat mato **SSO** kortelę.

## Profilio kortelė

### Profilio nuotrauka

Heym rodo Jūsų [Gravatar](https://gravatar.com) nuotrauką pagal Jūsų paskyros el. paštą antraštėje, šalia Jūsų žinučių [Chat](../tabs/chat-tab.md) ir **Chat with Heym**, [Board](../tabs/board-tab.md) komentarų, taip pat šalia Jūsų vardo dalijimosi dialoguose ir komandos narių sąrašuose. Norėdami ją pakeisti, atnaujinkite nuotrauką Gravatar; Heym perima naują nuotrauką per kelias valandas. Jei neturite Gravatar nuotraukos, Heym rodo pirmąją Jūsų vardo raidę.

Nuotrauka yra gaunama iš Heym serverio ir ten talpinama, todėl Jūsų naršyklė niekada nesikreipia į Gravatar. Jei serveris negali pasiekti Gravatar, visi mato inicialus.

### Vardas

Jūsų rodomas vardas, kuris matomas visoje programoje. Šis laukas yra privalomas ir negali būti paliktas tuščias.

### Vartotojo taisyklės

Vartotojo taisyklės yra individualios instrukcijos, automatiškai įterpiamos į kiekvieną AI užklausą — tiek darbo eigos kūrimo priemonėje, tiek valdymo skydelyje. **Darbo eigos kūrimo priemonėje** ([AI Assistant](./ai-assistant.md)) jos pridedamos prie sistemos prompto, naudojamo generuoti darbo eigos JSON. **Valdymo skydelio pokalbyje** jos taikomos kaip sistemos lygio kontekstas. Jūs jas rašote vieną kartą, ir jos taikomos globaliai, be poreikio kartoti kiekviename prompt'e.

**Dažniausiai naudojamos:**

- Kalba ar tonas: `Visada atsakykite anglų kalba. Laikykite atsakymus trumpus.`
- Kodo stilius: `Naudokite async/await modelius. Teikite pirmenybę TypeScript sąsajoms vietoj tipų.`
- Darbo eigos konvencijos: `Visose darbo eigos turi būti įtraukta klaidų tvarkymas. Naudokite aprašomuosius mazgų pavadinimus.`
- Atsakymo formatas: `Naudokite punktus. Venkite ilgo paaiškinimo.`

**Kur jos taikomos:**

| Kontekstas | Aprašymas |
|------------|-----------|
| **Darbo eigos kūrimo priemonė** | [AI Assistant](./ai-assistant.md) užklausos, skirtos generuoti ar keisti darbo eigas |
| **Valdymo skydelio pokalbis** | Visi [Chat tab](../tabs/chat-tab.md) pokalbiai |

Vartotojo taisyklės yra įterpiamos sistemos lygiu — jos vykdomos prieš kiekvieną prompt'ą automatiškai, be papildomos konfigūracijos kiekvienai darbo eigai ar pokalbiui.

### Profilio pakeitimų išsaugojimas

Spustelėkite **Išsaugoti pakeitimus**, kad pritaikytumėte. Pakeitimai įsigalioja iš karto visoms naujoms AI užklausoms.

## Saugumo kortelė

### Slaptažodžio keitimas

Naudokite Saugumo kortelę, kad atnaujintumėte savo paskyros slaptažodį.

**Reikalavimai:**

| Taisyklė | Reikalavimas |
|-----------|--------------|
| Minimalus ilgis | 8 simboliai |
| Didžioji raidė | Bent viena didžioji raidė (A–Z) |
| Mažoji raidė | Bent viena mažoji raidė (a–z) |
| Skaičius | Bent vienas skaičius (0–9) |

Slaptažodis taip pat turi skirtis nuo Jūsų dabartinio slaptažodžio. Šios taisyklės taikomos tiek priekyje, tiek užnugaryje.

**Veiksmai:**

1. Įveskite savo **Dabartinį slaptažodį**
2. Įveskite savo **Naują slaptažodį** (turi atitikti visus aukščiau nurodytus reikalavimus)
3. Pakartokite **Patvirtinti naują slaptažodį**
4. Spustelėkite **Atnaujinti slaptažodį**

Jei dabartinis slaptažodis yra neteisingas, rodomas klaidos pranešimas. Sėkmės atveju pasirodo patvirtinimo pranešimas, o forma automatiškai atnaujinama.

## Balsų kortelė

Balsų kortelė sukonfigūruoja kalbėtą balsą [Chat tab](../tabs/chat-tab.md): pasirinkite **ElevenLabs kredencialą** (arba pridėkite vieną tiesiogiai), pasirinkite **Balsą** iš savo ElevenLabs paskyros ir **Išsaugoti balsų nustatymus**. Tai leidžia perskaityti žinutes ir naudoti interaktyvų balso režimą. Daugiau informacijos rasite [Chat Voice (TTS & STT)](./chat-voice.md).

## AI numatytų nustatymų kortelė

AI numatytų nustatymų kortelė turi dvi sekcijas.

### Pageidaujamas kredencialas ir modelis

Pasirinkite **pageidaujamą LLM kredencialą** ir **modelį** iš jo. Tai taps pradiniu numatytu nustatymu kiekvienai AI funkcijai programoje — pokalbiui, [AI Assistant](./ai-assistant.md) (kūrėjui, analitikui ir darbo eigos kūrimui), lentos žemėlapiui, AI valdymo skydelio valdikliams, [dokumentų pokalbiui](../tabs/chat-tab.md), duomenų lentelės AI schemos pagalbininkui, išraiškų kūrėjui ir vertinimams — kai toje srityje nėra išsaugoto pasirinkimo.

Pasirinkimo taisyklė, kurios laikosi kiekviena sritis, yra tokia:

1. **Išsaugotas pasirinkimas** — pasirinkimas, kurį jau padarėte toje srityje (pavyzdžiui, paskutinio modelio pokalbyje) visada laimi.
2. **Pageidaujamas** — naudojamas, kai nėra išsaugoto pasirinkimo.
3. **Pirmas prieinamas kredencialas** — atsarginis variantas, kai nesate nustatę pageidavimo.

Jūs vis tiek galite keisti kredencialą ir modelį kiekvienoje srityje bet kuriuo metu; pageidavimas tik užpildo pradinį numatytą nustatymą. Palikite kredencialą kaip **Be pageidavimo**, kad išlaikytumėte ankstesnį pirmo kredencialo elgesį. Jei Jūsų pageidaujamas kredencialas vėliau bus ištrintas arba nebus bendrinamas, kortelėje bus rodomas pranešimas, o sritys tyliai grįš prie pirmo prieinamo kredencialo.
### Kodo paketo naudojimas

Kiekvienam **Codex** kredencialui (įskaitant bendrinamus) skirtame skirtuke rodomas likęs greičio ribojimo naudojimas kaip horizontalus baras per aktyvų langą — pavyzdžiui, **5 valandų** langas ir/arba **Savaitinis** langas, priklausomai nuo Jūsų plano. Kiekvienas baras rodo likusios kvotos procentą ir atnaujinimo atgalinį skaičiavimą. **Atnaujinti** mygtukas leidžia pakartotinai gauti informaciją pagal poreikį (rezultatai trumpam saugomi serveryje).

Kiekvienam **OpenCode** kredencialui skirtame skirtuke rodomi OpenCode Go prenumeratos langai — **5 valandos**, **Savaitinis** ir **Mėnesinis** — tokiu pačiu baro stiliumi, skaitomi iš vartotojo autentifikavimo taško su to kredencialo API raktu. Langas, kuris pasiekė savo ribą, rodomas kaip **"ribos pasiektos"** geltonai. Jei raktas yra neteisingas arba darbo erdvė neturi Go prenumeratos, kortelė nurodo priežastį, o ne rodo barus.

## Stebėjimo skirtukas

Stebėjimo skirtukas rodo tik skaitymo statusą [OpenTelemetry Tracing](./opentelemetry.md) šiai instancijai: ar stebėjimas yra įjungtas, OTLP endpoint, paslaugos pavadinimas, mėginių ėmimo santykis ir kurie spanai yra išmetami. Stebėjimas konfigūruojamas per `HEYM_OTEL_*` aplinkos kintamuosius serveryje, todėl šis skirtukas nieko nekeičia. Kai stebėjimas yra išjungtas, skirtukas išvardija aplinkos kintamuosius, reikalingus jį įjungti. Tokie slapti duomenys kaip OTLP autentifikavimo antraštės čia niekada nėra rodomi. Daugiau informacijos rasite [Aplinkos kintamuosiuose](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

## SSO skirtukas

Matomas tik instancijos administratoriams — paskyroms, išvardytoms `HEYM_ADMIN_EMAILS`. Šis skirtukas jungia Heym su išoriniu OpenID Connect teikėju, kad žmonės galėtų prisijungti naudodami jau turimas paskyras. Įveskite leidėjo URL ir kliento kredencialus, nukopijuokite tik skaitymo nukreipimo URI į savo teikėją ir atlikite **Testuoti ryšį** prieš įjungdami. Slaptažodžio prisijungimą galima išjungti iš čia, kai testas bus sėkmingas. Daugiau informacijos rasite [Vieningo prisijungimo](./sso.md) nustatymuose.

## Instancijų skirtukas

Matomas tik instancijos administratoriams — paskyroms, išvardytoms `HEYM_ADMIN_EMAILS`. Šis skirtukas išvardija Heym instancijas, prijungtas prie šios duomenų bazės, ir nustato, kaip fono vykdymai yra paskirstomi tarp jų. Kiekvienoje eilutėje rodomas instancijos redaguojamas pavadinimas, jos vaidmuo, ar ji yra aktyvi, jos išmatuota latencija iki duomenų bazės, įjungimo/išjungimo jungiklis ir jos svoris. Svoris yra instancijų dalys, kurios šiuo metu gali atlikti darbą, o ne procentai iš 100: su `41 / 26 / 33` ir trečia instancija išjungta, pirmos dvi iš tikrųjų gauna 61% ir 39%. Panelei spausdinamas efektyvus paskirstymas po lentele, ir ji atsisako išsaugoti tik tada, kai nė viena įjungta instancija neturi svorio.

**Naujiems instancijoms automatiškai suteikti dalį** yra įjungta pagal numatytuosius nustatymus: instancija, kuri prisijungia, kitaip sėdėtų su svoriu 0 ir nieko negautų, todėl lyderis suteikia jai lygią dalį vieną kartą ir sumažina esamus svorius, išlaikydamas jų santykius. Ji niekada nepaliečia instancijos, kurios svorį nustatėte patys.

Panelei taip pat pranešama, kiek iš paskutinių 24 valandų vykdymų galėjo būti vykdomi tik pagrindinėje instancijoje. Kai ta dalis yra didelė, žemiau esantys svoriai negali perkelti to darbo. Daugiau informacijos apie [Krovinių paskirstymą](./cluster.md) rasite, kas lieka pagrindinėje instancijoje ir kaip pasirinkti skaičius.

## Kas nėra šiame dialoge

| Funkcija | Kur rasti |
|----------|-----------|
| **API raktų valdymas (MCP)** | [MCP skirtukas](../tabs/mcp-tab.md) – peržiūrėti, kopijuoti ir regeneruoti savo MCP serverio API raktą |
| **Tema (tamsi / šviesi)** | Saulės/Mėnulio perjungimo mygtukas antraštėje (šalia vartotojo ženklo) |
| **El. pašto keitimas** | Šiuo metu nepalaikoma |

## Susiję

- [AI Asistentas](./ai-assistant.md) – Darbo eigos kūrimo pokalbis, naudojantis Vartotojo taisykles
- [Chat skirtukas](../tabs/chat-tab.md) – Valdymo skydelio pokalbis, naudojantis Vartotojo taisykles
- [Chat balsas (TTS & STT)](./chat-voice.md) – ElevenLabs balsas, sukonfigūruotas Balsų skirtuke
- [MCP skirtukas](../tabs/mcp-tab.md) – MCP serverio API raktas ir darbo eigos įrankių ekspozicija
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – API raktai AI mazgams ir integracijoms
- [Saugumas](./security.md) – Sesijų valdymas, greičio ribojimas, kredencialų šifravimas
- [Vieningas prisijungimas](./sso.md) – Prijungti išorinį OpenID Connect teikėją
- [OpenTelemetry Tracing](./opentelemetry.md) – Išskirstytas stebėjimas darbo eigos ir mazgų vykdymams
