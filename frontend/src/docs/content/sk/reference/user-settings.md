# Nastavenia

Dialógové okno Nastavenia vám umožňuje spravovať váš profil, nastaviť trvalé pokyny pre AI, aktualizovať heslo k účtu, konfigurovať hlas pre Chat, nastaviť predvolené prihlasovacie údaje a model pre AI a skontrolovať stav observability. Otvoríte ho kliknutím na **váš avatar a meno** v pravom hornom rohu hlavičky.

## Otvorenie dialógového okna

Kliknite na **váš avatar a meno** v pravom hornom rohu hlavičky. Dialógové okno sa otvorí s týmito kartami: **Profile**, **Security**, **Voice**, **AI Defaults** a **Observability**. Správcovia inštancie vidia navyše karty **SSO**, **Heym Work** a **Instances**.

## Karta Profile

### Profilový obrázok

Heym zobrazuje váš obrázok z [Gravatar](https://gravatar.com) pre e-mailovú adresu vášho účtu v hlavičke, vedľa vašich správ v [Chat](../tabs/chat-tab.md) a **Chat with Heym**, pri komentároch na [Board](../tabs/board-tab.md) a vedľa vášho mena v dialógoch na zdieľanie a v zoznamoch členov tímu. Ak ho chcete zmeniť, aktualizujte obrázok na Gravatar; Heym prevezme nový do niekoľkých hodín. Bez obrázka z Gravatar Heym zobrazuje prvé písmeno vášho mena.

Obrázok načítava server Heym a ukladá ho do vyrovnávacej pamäte, takže váš prehliadač nikdy nekomunikuje s Gravatar. Ak server nedokáže dosiahnuť Gravatar, všetci naďalej vidia iniciály.

### Meno

Vaše zobrazované meno používané v celej aplikácii. Toto pole je povinné a nemôže zostať prázdne.

### User Rules

User Rules sú vlastné pokyny automaticky vkladané do každej požiadavky AI – v tvorbe workflowov aj v chat na dashboarde. V **tvorbe workflowov** ([AI Assistant](./ai-assistant.md)) sa pripájajú k systémovému promptu používanému na generovanie JSON workflowu. V **chat na dashboarde** sa aplikujú ako kontext na systémovej úrovni. Napíšete ich raz a platia globálne bez toho, aby ste ich museli opakovať v každom prompte.

**Bežné použitia:**

- Jazyk alebo tón: `Always respond in English. Keep responses concise.`
- Štýl kódu: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Konvencie workflowov: `Include error handling in all workflows. Use descriptive node labels.`
- Formát odpovede: `Use bullet points. Avoid lengthy explanations.`

**Kde sa aplikujú:**

| Kontext | Popis |
|---------|-------------|
| **Tvorba workflowov** | Požiadavky [AI Assistant](./ai-assistant.md) na generovanie alebo úpravu workflowov |
| **Chat na dashboarde** | Všetky konverzácie na [karte Chat](../tabs/chat-tab.md) |

User Rules sa vkladajú na systémovej úrovni – spúšťajú sa pred každým promptom automaticky, bez akejkoľvek ďalšej konfigurácie pre jednotlivé workflowy alebo konverzácie.

### Uloženie zmien profilu

Kliknutím na **Save Changes** zmeny použijete. Zmeny sa prejavia okamžite pre všetky nové požiadavky AI.

## Karta Security

### Zmena hesla

Kartu Security použite na aktualizáciu hesla k účtu.

**Požiadavky:**

| Pravidlo | Požiadavka |
|------|-------------|
| Minimálna dĺžka | 8 znakov |
| Veľké písmeno | Aspoň jedno veľké písmeno (A–Z) |
| Malé písmeno | Aspoň jedno malé písmeno (a–z) |
| Číslica | Aspoň jedno číslo (0–9) |

Heslo sa tiež musí líšiť od vášho aktuálneho hesla. Tieto pravidlá sa vynucujú na frontende aj backende.

**Postup:**

1. Zadajte **Current Password**
2. Zadajte **New Password** (musí spĺňať všetky vyššie uvedené požiadavky)
3. Znovu zadajte v **Confirm New Password**
4. Kliknite na **Update Password**

Ak je aktuálne heslo nesprávne, zobrazí sa chybové hlásenie priamo vo formulári. Pri úspechu sa zobrazí potvrdzujúca správa a formulár sa automaticky vyresetuje.

## Karta Voice

Karta Voice konfiguruje hovorený hlas pre [kartu Chat](../tabs/chat-tab.md): vyberte **prihlasovacie údaje ElevenLabs** (alebo ich pridajte priamo tu), zvoľte **Voice** zo svojho účtu ElevenLabs a kliknite na **Save Voice Settings**. Tým sa povolí čítanie jednotlivých správ nahlas a interaktívny hlasový režim. Celý postup nájdete v [Chat Voice (TTS & STT)](./chat-voice.md).

## Karta AI Defaults

Karta AI Defaults má dve sekcie.

### Preferované prihlasovacie údaje a model

Vyberte **preferované prihlasovacie údaje LLM** a **model** z nich. Táto voľba sa stane počiatočnou predvoľbou pre každú funkciu AI v aplikácii – chat, [AI Assistant](./ai-assistant.md) (builder, analyzátor a vytváranie workflowov), board mapper, AI widgety na dashboarde, [docs chat](../tabs/chat-tab.md), pomocník pre AI schému dátovej tabuľky, tvorcu výrazov a evals – vždy, keď dané rozhranie nemá vlastnú uloženú voľbu.

Pravidlo výberu, ktorým sa každé rozhranie riadi, je:

1. **Uložená voľba** – voľba, ktorú ste už vykonali v danom rozhraní (napríklad posledný model v konverzácii chat), má vždy prednosť.
2. **Preferované** – použije sa, keď neexistuje uložená voľba.
3. **Prvé dostupné prihlasovacie údaje** – náhradná možnosť, keď ste nenastavili žiadnu preferenciu.

Prihlasovacie údaje a model môžete kedykoľvek zmeniť aj v jednotlivých rozhraniach; preferencia iba vyplní počiatočnú predvoľbu. Ak ponecháte prihlasovacie údaje ako **No preference**, zachová sa predchádzajúce správanie s prvými prihlasovacími údajmi. Ak budú vaše preferované prihlasovacie údaje neskôr odstránené alebo prestanú byť zdieľané, karta zobrazí upozornenie a rozhrania ticho prejdú na prvé dostupné prihlasovacie údaje.
### Využitie balíka Coding

Pre každé prihlasovacie údaje **Codex** (vrátane zdieľaných) karta zobrazuje zostávajúce využitie limitu rýchlosti ako horizontálny pruh pre každé aktívne okno – napríklad okno **5 hodín** a/alebo okno **Týždenne**, v závislosti od Vášho plánu. Každý pruh zobrazuje percento zostávajúcej kvóty a odpočítavanie do resetovania. Tlačidlo **Obnoviť** znovu načíta údaje na požiadanie (výsledky sa krátko ukladajú do vyrovnávacej pamäte na serveri).

Pre každé prihlasovacie údaje **OpenCode** karta zobrazuje okná predplatného OpenCode Go – **5 hodín**, **Týždenne** a **Mesačne** – v rovnakom štýle pruhov, načítané z autentifikovaného endpointu využitia brány pomocou API kľúča daných prihlasovacích údajov. Okno, ktoré dosiahlo svoj limit, sa zobrazuje ako **„limit reached"** jantárovou farbou. Ak je kľúč neplatný alebo pracovný priestor nemá predplatné Go, karta namiesto pruhov uvádza dôvod.

## Karta Observability

Karta Observability zobrazuje stav iba na čítanie pre [OpenTelemetry Tracing](./opentelemetry.md) tejto inštancie: či je trasovanie povolené, OTLP endpoint, názov služby, pomer sampler-a a ktoré spany sa vysielajú. Trasovanie sa konfiguruje prostredníctvom premenných prostredia `HEYM_OTEL_*` na backende, takže táto karta nič needituje. Keď je trasovanie zakázané, karta uvádza premenné prostredia potrebné na jeho zapnutie. Tajné údaje, ako napríklad autorizačné hlavičky OTLP, sa tu nikdy nezobrazujú. Úplnú referenciu konfigurácie nájdete v [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

## Karta SSO

Viditeľná iba pre administrátorov inštancie – účty uvedené v `HEYM_ADMIN_EMAILS`. Táto karta pripája Heym k externému poskytovateľovi OpenID Connect, aby sa používatelia prihlasovali pomocou účtov, ktoré už majú. Zadajte URL adresu vydavateľa a prihlasovacie údaje klienta, skopírujte URI adresu presmerovania iba na čítanie do svojho poskytovateľa a pred povolením spustite **Test connection**. Po úspešnom teste je možné odtiaľto vypnúť prihlasovanie heslom. Úplné nastavenie nájdete v [Single Sign-On](./sso.md).

## Karta Heym Work

Správcovia inštancie tu pripájajú [Heym Work](./heym-work.md), rozhranie pre obchodné tímy: jeho adresu, jednorazovo zobrazený registračný kľúč integrácie a prepínač **Enable Heym Work**. Karta tiež zobrazuje, kedy sa Heym Work naposledy ohlásil, jeho verziu a stav licencie. Pozri [Pripojenie Heym Work](./heym-work.md#connecting-heym-work).

## Karta Instances

Viditeľná iba pre administrátorov inštancie – účty uvedené v `HEYM_ADMIN_EMAILS`. Táto karta uvádza inštancie Heym pripojené k tejto databáze a nastavuje, ako sa úlohy na pozadí rozdeľujú medzi ne. Každý riadok zobrazuje upraviteľný názov inštancie, jej rolu, či je aktívna, nameranú latenciu k databáze, prepínač zapnutia/vypnutia a jej váhu. Váhy predstavujú podiely inštancií, ktoré momentálne môžu prijímať prácu, nie percentá zo 100: pri `41 / 26 / 33` a vypnutej tretej inštancii prvé dve skutočne dostávajú 61 % a 39 %. Panel zobrazuje tento efektívny podiel pod tabuľkou a odmietne uložiť iba vtedy, keď žiadna povolená inštancia nemá vôbec žiadnu váhu.

**Give new instances a share automatically** je predvolene zapnuté: inštancia, ktorá sa pripojí, by inak zostala s váhou 0 a nedostávala by nič, takže líder jej raz pridelí rovnaký podiel a zníži existujúce váhy so zachovaním ich pomerov. Nikdy nezasiahne do inštancie, ktorej váhu ste nastavili sami.

Panel tiež uvádza, koľko z behov za posledných 24 hodín sa mohlo vykonať iba na hlavnej inštancii. Keď je tento podiel vysoký, váhy pod ním nedokážu touto prácou pohnúť. Pozrite si [Load Distribution](./cluster.md), kde sa dozviete, čo zostáva na hlavnej inštancii a ako zvoliť čísla.

## Čo sa v tomto dialógu nenachádza

| Funkcia | Kde ju nájsť |
|---------|-----------------|
| **Správa API kľúčov (MCP)** | [Karta MCP](../tabs/mcp-tab.md) – zobrazenie, kopírovanie a opätovné vygenerovanie API kľúča Vášho MCP servera |
| **Téma (tmavá / svetlá)** | Prepínač Slnko/Mesiac v hlavičke (vedľa odznaku používateľa) |
| **Zmena e-mailu** | Momentálne nie je podporovaná |

## Súvisiace

- [AI Assistant](./ai-assistant.md) – Chat pre tvorbu Workflow, ktorý používa User Rules
- [Karta Chat](../tabs/chat-tab.md) – Chat v dashboarde, ktorý používa User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Hlas ElevenLabs nakonfigurovaný na karte Voice
- [Karta MCP](../tabs/mcp-tab.md) – API kľúč MCP servera a sprístupnenie nástrojov Workflow
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – API kľúče pre AI uzly a integrácie
- [Security](./security.md) – Správa relácií, obmedzovanie rýchlosti, šifrovanie prihlasovacích údajov
- [Single Sign-On](./sso.md) – Pripojenie externého poskytovateľa OpenID Connect
- [OpenTelemetry Tracing](./opentelemetry.md) – Distribuované trasovanie spustení Workflow a uzlov
