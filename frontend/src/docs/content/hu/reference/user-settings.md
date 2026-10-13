# Beállítások

A Beállítások párbeszédablak segítségével kezelheti a profilját, állandó AI-utasításokat állíthat be, frissítheti fiókja jelszavát, konfigurálhatja a chat hangját, beállíthatja az alapértelmezett AI-hitelesítési adatait és modelljét, valamint áttekintheti a megfigyelhetőségi állapotot. A megnyitáshoz kattintson a fejléc jobb felső sarkában található **avatárjára és nevére**.

## A párbeszédablak megnyitása

Kattintson **avatárjára és nevére** a fejléc jobb felső sarkában. A párbeszédablak a következő fülekkel nyílik meg: **Profil**, **Biztonság**, **Hang**, **AI-alapértelmezések** és **Megfigyelhetőség**. Az instance-adminisztrátorok az **SSO**, a **Heym Work** és az **Instances** füleket is látják.

## Profil fül

### Profilkép

A Heym a fiókja e-mail-címéhez tartozó [Gravatar](https://gravatar.com) képet jeleníti meg a fejlécben, a [Chat](../tabs/chat-tab.md) és a **Chat with Heym** felületen az üzenetei mellett, a [Board](../tabs/board-tab.md) hozzászólásainál, valamint a megosztási párbeszédablakokban és a csapattaglistákban a neve mellett. A módosításhoz frissítse a képet a Gravataron; a Heym néhány órán belül átveszi az újat. Gravatar-kép hiányában a Heym a neve első betűjét jeleníti meg.

A képet a Heym szerver tölti le és gyorsítótárazza, így a böngészője soha nem lép kapcsolatba a Gravatarral. Ha a szerver nem éri el a Gravatart, mindenki továbbra is a monogramokat látja.

### Név

Az alkalmazásban megjelenő megjelenített neve. Ez a mező kötelező, nem hagyható üresen.

### Felhasználói szabályok

A Felhasználói szabályok olyan egyéni utasítások, amelyeket a rendszer automatikusan beilleszt minden AI-kérésbe—mind a workflow-szerkesztőben, mind az irányítópult chatjében. A **workflow-szerkesztőben** ([AI Assistant](./ai-assistant.md)) a workflow JSON előállításához használt system prompt végéhez fűződnek. Az **irányítópult chatjében** rendszerszintű kontextusként érvényesülnek. Egyszer írja meg őket, és globálisan érvényesek lesznek anélkül, hogy minden promptban meg kellene ismételnie.

**Gyakori felhasználási módok:**

- Nyelv vagy hangnem: `Always respond in English. Keep responses concise.`
- Kódstílus: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow-konvenciók: `Include error handling in all workflows. Use descriptive node labels.`
- Válaszformátum: `Use bullet points. Avoid lengthy explanations.`

**Hol érvényesülnek:**

| Kontextus | Leírás |
|---------|-------------|
| **Workflow-szerkesztő** | [AI Assistant](./ai-assistant.md) kérések workflow-k létrehozásához vagy módosításához |
| **Irányítópult chat** | Az összes [Chat fül](../tabs/chat-tab.md) beszélgetés |

A Felhasználói szabályok rendszerszinten kerülnek beillesztésre—minden prompt előtt automatikusan lefutnak, anélkül hogy workflow-nként vagy beszélgetésenként külön konfigurációra lenne szükség.

### Profilmódosítások mentése

A módosítások alkalmazásához kattintson a **Save Changes** gombra. A módosítások azonnal életbe lépnek minden új AI-kérésnél.

## Biztonság fül

### Jelszó módosítása

A Biztonság fül segítségével frissítheti fiókja jelszavát.

**Követelmények:**

| Szabály | Követelmény |
|------|-------------|
| Minimális hossz | 8 karakter |
| Nagybetű | Legalább egy nagybetű (A–Z) |
| Kisbetű | Legalább egy kisbetű (a–z) |
| Számjegy | Legalább egy szám (0–9) |

A jelszónak emellett különböznie kell a jelenlegi jelszavától. Ezeket a szabályokat a frontend és a backend egyaránt érvényesíti.

**Lépések:**

1. Adja meg a **Current Password** mezőben a jelenlegi jelszavát
2. Adja meg a **New Password** mezőben az új jelszavát (meg kell felelnie a fenti összes követelménynek)
3. Írja be újra a **Confirm New Password** mezőben
4. Kattintson az **Update Password** gombra

Ha a jelenlegi jelszó helytelen, egy beágyazott hibaüzenet jelenik meg. Sikeres módosítás esetén egy visszaigazoló üzenet jelenik meg, és az űrlap automatikusan visszaáll.

## Hang fül

A Hang fül a [Chat fül](../tabs/chat-tab.md) beszélt hangját konfigurálja: válasszon egy **ElevenLabs hitelesítési adatot** (vagy adjon hozzá egyet beágyazottan), válasszon egy **Voice**-ot az ElevenLabs-fiókjából, majd kattintson a **Save Voice Settings** gombra. Ez engedélyezi az üzenetenkénti felolvasást és az interaktív hangmódot. A teljes folyamatot lásd: [Chat Voice (TTS & STT)](./chat-voice.md).

## AI-alapértelmezések fül

Az AI-alapértelmezések fül két részből áll.

### Előnyben részesített hitelesítési adat és modell

Válasszon egy **előnyben részesített LLM hitelesítési adatot** és abból egy **modellt**. Ez lesz az alkalmazás minden AI-funkciójának kiinduló alapértelmezése — a chat, az [AI Assistant](./ai-assistant.md) (szerkesztő, elemző és workflow-létrehozás), a board mapper, az AI irányítópult-widgetek, a [docs chat](../tabs/chat-tab.md), az adattábla AI-séma segítője, a kifejezésszerkesztő és az evals — minden olyan esetben, amikor az adott felületen nincs saját mentett kiválasztás.

Az egyes felületek által követett kiválasztási szabály:

1. **Mentett kiválasztás** — az adott felületen korábban megtett választás (például egy chat-beszélgetés utolsó modellje) mindig elsőbbséget élvez.
2. **Előnyben részesített** — akkor használatos, ha nincs mentett kiválasztás.
3. **Első elérhető hitelesítési adat** — a tartalék megoldás, ha nem állított be preferenciát.

A hitelesítési adatot és a modellt továbbra is bármikor módosíthatja felületenként; a preferencia csak a kezdeti alapértelmezést tölti ki. Hagyja a hitelesítési adatot **No preference** értéken, hogy megőrizze a korábbi első hitelesítési adat szerinti viselkedést. Ha az előnyben részesített hitelesítési adatát később törlik vagy visszavonják a megosztását, a fül egy értesítést jelenít meg, és a felületek csendben visszaállnak az első elérhető hitelesítési adatra.
### Kódolási csomag használata

Minden **Codex** hitelesítési adathoz (beleértve a megosztottakat is) a lap az aktív ablakonként hátralévő rate-limit használatot vízszintes sávként jeleníti meg — például egy **5 órás** ablakot és/vagy egy **Heti** ablakot, az Ön csomagjától függően. Minden sáv a hátralévő kvóta százalékos arányát és egy visszaállítási visszaszámlálást mutat. A **Frissítés** gomb igény szerint újra lekéri az adatokat (az eredményeket a szerver rövid ideig gyorsítótárazza).

Minden **OpenCode** hitelesítési adathoz a lap az OpenCode Go előfizetési ablakokat — **5 óra**, **Heti** és **Havi** — ugyanilyen stílusú sávként jeleníti meg, a gateway hitelesített usage endpointjáról olvasva, az adott hitelesítési adat API-kulcsával. Az a ablak, amely elérte a felső korlátját, borostyánsárga színnel **"limit reached"** felirattal jelenik meg. Ha a kulcs érvénytelen, vagy a munkaterületnek nincs Go előfizetése, a kártya sávok helyett az okot írja le.

## Observability lap

Az Observability lap az [OpenTelemetry Tracing](./opentelemetry.md) írásvédett állapotát mutatja ehhez az instance-hez: hogy engedélyezve van-e a tracing, az OTLP endpointot, a szolgáltatás nevét, a sampler arányát és azt, hogy mely spane-ek kerülnek kibocsátásra. A tracing a backend `HEYM_OTEL_*` környezeti változóin keresztül konfigurálható, ezért ez a lap semmit nem szerkeszt. Amikor a tracing le van tiltva, a lap felsorolja az engedélyezéséhez szükséges környezeti változókat. Az olyan titkos adatok, mint az OTLP auth headerek, itt soha nem jelennek meg. A teljes konfigurációs referenciáért lásd a [Környezeti változók](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) oldalt.

## SSO lap

Csak az instance adminisztrátorai számára látható — azoknak a fiókoknak, amelyek a `HEYM_ADMIN_EMAILS` listában szerepelnek. Ez a lap összekapcsolja a Heymet egy külső OpenID Connect szolgáltatóval, hogy a felhasználók a már meglévő fiókjaikkal jelentkezhessenek be. Adjon meg egy issuer URL-t és client hitelesítési adatokat, másolja be az írásvédett redirect URI-t a szolgáltatójába, és az engedélyezés előtt futtassa a **Kapcsolat tesztelése** műveletet. A jelszavas bejelentkezés innen kikapcsolható, miután a teszt sikeres. A teljes beállításért lásd az [Egyszeri bejelentkezés](./sso.md) oldalt.

## Heym Work lap

Az instance-adminisztrátorok itt csatlakoztatják a [Heym Work](./heym-work.md) üzleti csapatoknak szóló felületet: annak címét, az egyszer megjelenő integrációs kulcsot és az **Enable Heym Work** kapcsolót. A lap azt is megmutatja, mikor jelentkezett be utoljára a Heym Work, mi a verziószáma és milyen a licencállapota. Lásd: [A Heym Work csatlakoztatása](./heym-work.md#connecting-heym-work).

## Instances lap

Csak az instance adminisztrátorai számára látható — azoknak a fiókoknak, amelyek a `HEYM_ADMIN_EMAILS` listában szerepelnek. Ez a lap felsorolja az adatbázishoz kapcsolódó Heym instance-eket, és beállítja, hogyan oszlanak meg a háttérben futó futtatások közöttük. Minden sor az instance szerkeszthető nevét, szerepét, azt hogy él-e, az adatbázishoz mért késleltetését, egy be/ki kapcsolót és a súlyát mutatja. A súlyok azon instance-ek részesedései, amelyek éppen munkát tudnak vállalni, nem 100 százalékos arányok: `41 / 26 / 33` esetén, ha a harmadik instance ki van kapcsolva, az első kettő valójában 61%-ot és 39%-ot kap. A panel a táblázat alatt kiírja ezt a tényleges felosztást, és csak akkor tagadja meg a mentést, ha egyetlen engedélyezett instance-nek sincs egyáltalán súlya.

A **Give new instances a share automatically** alapértelmezés szerint be van kapcsolva: egy csatlakozó instance egyébként 0 súlyon ülne és semmit nem kapna, ezért a leader egyszer egyenlő részesedést ad neki, és az arányok megtartásával lecsökkenti a meglévő súlyokat. Soha nem nyúl ahhoz az instance-hez, amelynek a súlyát Ön maga állította be.

A panel azt is jelenti, hogy az elmúlt 24 óra futtatásai közül mennyi tudott csak a fő instance-en végrehajtódni. Amikor ez az arány magas, az alatta lévő súlyok nem tudják elmozdítani ezt a munkát. Arról, hogy mi marad a fő instance-en és hogyan válassza meg a számokat, lásd a [Terheléselosztás](./cluster.md) oldalt.

## Mi nincs ebben a párbeszédablakban

| Funkció | Hol található |
|---------|-----------------|
| **API-kulcs kezelése (MCP)** | [MCP lap](../tabs/mcp-tab.md) – az MCP szerver API-kulcsának megtekintése, másolása és újragenerálása |
| **Téma (sötét / világos)** | Nap/Hold váltógomb a fejlécben (a felhasználói jelvény mellett) |
| **E-mail módosítása** | Jelenleg nem támogatott |

## Kapcsolódó

- [AI asszisztens](./ai-assistant.md) – Workflow builder chat, amely a User Rules-t használja
- [Chat lap](../tabs/chat-tab.md) – Dashboard chat, amely a User Rules-t használja
- [Chat hang (TTS & STT)](./chat-voice.md) – A Voice lapon konfigurált ElevenLabs hang
- [MCP lap](../tabs/mcp-tab.md) – MCP szerver API-kulcs és workflow eszközök elérhetővé tétele
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – API-kulcsok AI csomópontokhoz és integrációkhoz
- [Biztonság](./security.md) – Munkamenet-kezelés, rate limiting, hitelesítési adatok titkosítása
- [Egyszeri bejelentkezés](./sso.md) – Külső OpenID Connect szolgáltató összekapcsolása
- [OpenTelemetry Tracing](./opentelemetry.md) – Elosztott tracing workflow- és csomópont-végrehajtásokhoz
