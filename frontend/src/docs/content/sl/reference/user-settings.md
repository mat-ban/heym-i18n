# Nastavitve

Pogovor o nastavitvah vam omogoča upravljanje vašega profila, nastavitev trajnih navodil za AI, posodobitev gesla za račun, konfiguracijo glasu za klepet, nastavitev privzetih poverilnic in modela AI ter pregled stanja opazovanja. Odprite ga tako, da kliknete **vašo avatar in ime** v zgornjem desnem kotu glave.

## Odprtje pogovora

Kliknite **vašo avatar in ime** v zgornjem desnem kotu glave. Pogovor se odpre s temi zavihki: **Profil**, **Varnost**, **Glas**, **Privzeti AI** in **Opazovanje**. Administratorji instanc vidijo tudi zavihek **SSO**.

## Zavihek Profil

### Slika profila

Heym prikazuje vašo [Gravatar](https://gravatar.com) sliko za vaš račun e-pošte v glavi, poleg vaših sporočil v [Klepetu](../tabs/chat-tab.md) in **Klepetu z Heym**, na komentarjih v [Odboru](../tabs/board-tab.md) ter poleg vašega imena v dialogih za deljenje in seznamih članov ekipe. Da jo spremenite, posodobite sliko na Gravatar; Heym prevzame novo sliko v nekaj urah. Brez slike Gravatar Heym prikaže prvo črko vašega imena.

Slika se pridobi s strežnika Heym in se tam predpomni, tako da vaš brskalnik nikoli ne stopi v stik z Gravatarjem. Če strežnik ne more doseči Gravatarja, vsi še naprej vidijo inicialke.

### Ime

Vaše prikazano ime, ki se prikazuje po aplikaciji. To polje je obvezno in ga ni mogoče pustiti prazno.

### Pravila uporabnikov

Pravila uporabnikov so prilagojena navodila, ki se samodejno vstavijo v vsako zahtevo AI — tako v graditelju workflow kot v klepetu na nadzorni plošči. V **graditelju workflow** ([AI Assistant](./ai-assistant.md)) se dodajo k sistemskemu promptu, ki se uporablja za generiranje workflow JSON. V **klepetu na nadzorni plošči** se uporabljajo kot kontekst na sistemski ravni. Zapišete jih enkrat in veljajo globalno, brez ponavljanja v vsakem promptu.

**Pogoste uporabe:**

- Jezik ali ton: `Vedno odgovarjajte v angleščini. Ohranite odgovore jedrnate.`
- Slog kodiranja: `Uporabite vzorce async/await. Prednost dajte TypeScript vmesnikom pred tipi.`
- Konvencije workflow: `Vključite obravnavo napak v vse workflows. Uporabite opisne oznake vozlišč.`
- Oblika odgovora: `Uporabite oznake. Izogibajte se dolgotrajnim razlagam.`

**Kje se uporabljajo:**

| Kontekst | Opis |
|----------|------|
| **Graditelj workflow** | [AI Assistant](./ai-assistant.md) zahteve za generiranje ali spreminjanje workflow-ov |
| **Klepet na nadzorni plošči** | Vsa pogovarjanja v [Klepetu](../tabs/chat-tab.md) |

Pravila uporabnikov se vstavijo na sistemski ravni — izvajajo se pred vsakim promptom samodejno, brez dodatne konfiguracije za vsak workflow ali pogovor.

### Shranjevanje sprememb profila

Kliknite **Shrani spremembe**, da jih uporabite. Spremembe začnejo veljati takoj za vse nove zahteve AI.

## Zavihek Varnost

### Sprememba gesla

Uporabite zavihek Varnost za posodobitev gesla za vaš račun.

**Zahteve:**

| Pravilo | Zahteva |
|---------|---------|
| Minimalna dolžina | 8 znakov |
| Velike črke | Vsaj ena velika črka (A–Z) |
| Male črke | Vsaj ena mala črka (a–z) |
| Številka | Vsaj ena številka (0–9) |

Geslo mora biti tudi drugačno od vašega trenutnega gesla. Ta pravila se uveljavljajo tako na sprednjem kot na zadnjem delu.

**Koraki:**

1. Vnesite vaše **Trenutno geslo**
2. Vnesite vaše **Novo geslo** (mora izpolnjevati vse zgoraj navedene zahteve)
3. Ponovno vnesite v **Potrdite novo geslo**
4. Kliknite **Posodobi geslo**

Če je trenutno geslo napačno, se prikaže sporočilo o napaki. Ob uspehu se prikaže potrditveno sporočilo in obrazec se samodejno ponastavi.

## Zavihek Glas

Zavihek Glas konfigurira govorjeni glas za [Klepet](../tabs/chat-tab.md): izberite **ElevenLabs poverilnico** (ali dodajte eno v vrstici), izberite **Glas** iz vašega računa ElevenLabs in **Shrani nastavitve glasu**. To omogoča branje sporočil na glas in interaktivni način glasu. Oglejte si [Klepetni glas (TTS & STT)](./chat-voice.md) za celoten postopek.

## Zavihek Privzeti AI

Zavihek Privzeti AI ima dva razdelka.

### Prednostna poverilnica in model

Izberite **prednostno LLM poverilnico** in **model** iz nje. To postane začetni privzeti za vse funkcije AI v aplikaciji — klepet, [AI Assistant](./ai-assistant.md) (graditelj, analitik in ustvarjanje workflow-ov), zemljevid odbora, pripomočke nadzorne plošče AI, [klepet dokumentov](../tabs/chat-tab.md), pomočnika za shemo podatkovne tabele AI, graditelja izrazov in vrednotenja — kadar ta površina nima shranjene izbire.

Pravila izbire, ki jih sledi vsaka površina, so:

1. **Shranjena izbira** — izbira, ki ste jo že naredili na tej površini (na primer zadnji model klepetne konverzacije), vedno zmaga.
2. **Prednostna** — uporablja se, ko ni shranjene izbire.
3. **Prva razpoložljiva poverilnica** — rezervna možnost, ko niste nastavili nobene prednosti.

Še vedno lahko kadar koli spremenite poverilnico in model na posamezni površini; prednost le napolni začetni privzeti. Pustite poverilnico kot **Brez prednosti**, da ohranite prejšnje vedenje prve poverilnice. Če je vaša prednostna poverilnica kasneje izbrisana ali ni več deljena, se na zavihku prikaže obvestilo in površine tiho preklopijo na prvo razpoložljivo poverilnico.
### Uporaba paketa za kodiranje

Za vsako **Codex** poverilnico (vključno s skupnimi) zavihek prikazuje preostalo uporabo omejitve hitrosti kot horizontalno vrstico na aktivnem oknu — na primer **5 ur** in/ali **Tedensko** okno, odvisno od vašega načrta. Vsaka vrstica prikazuje odstotek preostale kvote in odštevanje do ponovnega nastavitve. Gumb **Osveži** ponovno pridobi podatke na zahtevo (rezultati so kratkoročno predpomnjeni na strežniku).

Za vsako **OpenCode** poverilnico zavihek prikazuje okna naročnine OpenCode Go — **5 ur**, **Tedensko** in **Mesečno** — v istem slogu vrstice, ki se berejo iz pristaniškega končnega točke za avtenticirano uporabo z API ključem te poverilnice. Okno, ki je doseglo svoj maksimum, je prikazano kot **"dosežen limit"** v jantarni barvi. Če je ključ neveljaven ali delovno okolje nima naročnine Go, kartica namesto vrstic pove, zakaj.

## Zavihek Opazovanje

Zavihek Opazovanje prikazuje status samo za branje [OpenTelemetry Tracing](./opentelemetry.md) za to instanco: ali je sledenje omogočeno, OTLP končna točka, ime storitve, razmerje vzorčenja in kateri razponi so oddani. Sledenje je konfigurirano preko `HEYM_OTEL_*` okolijskih spremenljivk na zadnjem delu, zato ta zavihek ne ureja ničesar. Ko je sledenje onemogočeno, zavihek navaja okoljske spremenljivke, potrebne za njegovo aktivacijo. Tajnosti, kot so OTLP avtentikacijski glave, nikoli niso prikazane tukaj. Oglejte si [Okoljske spremenljivke](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) za celotno referenco konfiguracije.

## Zavihek SSO

Vidno samo administratorjem instance — računi, navedeni v `HEYM_ADMIN_EMAILS`. Ta zavihek povezuje Heym z zunanjim ponudnikom OpenID Connect, tako da se ljudje prijavljajo z računi, ki jih že imajo. Vnesite URL izdajatelja in poverilnice stranke, kopirajte URI za preusmeritev samo za branje v vašega ponudnika in zaženite **Preizkusi povezavo** pred omogočanjem. Prijava s geslom se lahko izklopi od tukaj, ko test uspe. Oglejte si [Enotna prijava](./sso.md) za celotno nastavitev.

## Zavihek Instance

Vidno samo administratorjem instance — računi, navedeni v `HEYM_ADMIN_EMAILS`. Ta zavihek navaja instance Heym, povezane s to bazo podatkov, in nastavi, kako so razdeljeni ozadnji zagon. Vsaka vrstica prikazuje urejeno ime instance, njeno vlogo, ali je aktivna, njeno izmerjeno zakasnitev do baze podatkov, stikalo za vklop/izklop in njeno težo. Teže so deleži instanc, ki lahko trenutno prevzamejo delo, ne odstotki od 100: z `41 / 26 / 33` in tretjo instanco izklopljeno, prvi dve dejansko prejmeta 61% in 39%. Plošča natisne to učinkovito delitev pod tabelo in zavrne shranjevanje le, ko nobena omogočena instanca nima teže.

**Novi instancam samodejno dodelite delež** je privzeto vklopljeno: instanca, ki se pridruži, bi sicer imela težo 0 in ne bi prejela ničesar, zato vodja dodeli enak delež enkrat in zmanjša obstoječe teže, da ohrani njihove razmerja. Nikoli ne posega v instanco, katere težo ste nastavili sami.

Plošča prav tako poroča, koliko zagonov v zadnjih 24 urah je lahko izvedenih le na glavni instanci. Ko je ta delež visok, teže spodaj ne morejo premikati tega dela. Oglejte si [Porazdelitev obremenitve](./cluster.md) za to, kar ostane na glavni in kako izbrati številke.

## Kaj ni v tem pogovoru

| Funkcija | Kje jo najti |
|----------|--------------|
| **Upravljanje API ključev (MCP)** | [MCP Zavihek](../tabs/mcp-tab.md) – ogled, kopiranje in regeneracija vašega MCP strežniškega API ključa |
| **Tema (temna / svetla)** | Gumb za preklop Sonce/Luna v glavi (poleg oznake uporabnika) |
| **Sprememba e-pošte** | Trenutno ni podprta |

## Sorodno

- [AI Asistent](./ai-assistant.md) – Klepetalnik za gradnjo delovnih tokov, ki uporablja uporabniška pravila
- [Zavihek Klepet](../tabs/chat-tab.md) – Nadzorna plošča klepet, ki uporablja uporabniška pravila
- [Klepet Glas (TTS & STT)](./chat-voice.md) – Glas ElevenLabs, konfiguriran v zavihku Glas
- [MCP Zavihek](../tabs/mcp-tab.md) – MCP strežniški API ključ in izpostavitev orodja za delovne tokove
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – API ključi za AI vozlišča in integracije
- [Varnost](./security.md) – Upravljanje sej, omejevanje hitrosti, šifriranje poverilnic
- [Enotna prijava](./sso.md) – Povezovanje z zunanjim ponudnikom OpenID Connect
- [OpenTelemetry Sledenje](./opentelemetry.md) – Porazdeljeno sledenje za izvajanja delovnih tokov in vozlišč
