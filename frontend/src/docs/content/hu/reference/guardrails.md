# Guardrails

A Guardrails segítségével blokkolhatja a nem biztonságos vagy nem kívánt felhasználói üzeneteket, mielőtt azok elérnének egy [LLM](../nodes/llm-node.md) vagy [Agent](../nodes/agent-node.md) csomópontot. Ha egy üzenet egy blokkolt kategóriának megfelel, a csomópont a végrehajtás helyett hibát dob, amelyet egy [Error Handler](../nodes/error-handler-node.md) csomóponttal foghat el.

## A Guardrails engedélyezése

Nyissa meg egy **LLM** vagy **AI Agent** csomópont Properties paneljét, és görgessen az **Enable Guardrails** kapcsolóhoz (pajzs ikon). A jelölőnégyzet bejelölésével megjelenik a konfigurációs szakasz.

## Guardrail hitelesítési adatok és modell

A Guardrails engedélyezésekor **kötelező** kiválasztania egy **hitelesítési adatot és modellt** a tartalombiztonsághoz. A guardrail-ellenőrzés a csomóponton kiválasztott hitelesítési adatokat és modellt használja — nincs tartalék, nincsenek környezeti változók. A megbízható tartalomszűréshez használjon OpenAI vagy Google hitelesítési adatokat, különösen akkor, ha a fő modell olyan egyedi szolgáltatót használ (pl. Zhipu, GLM), amely esetleg nem támogatja a Guardrails funkciót, vagy API-hibákat (pl. 404) ad vissza.

A workflow nem futtatható, amíg a Guardrail Credential és a Guardrail Model egyaránt nincs kiválasztva.

## Blokkolt kategóriák

Válasszon ki egy vagy több blokkolandó kategóriát. Az az üzenet, amely megfelel bármely bejelölt kategóriának, elutasításra kerül.

| Kategória | Mit blokkol |
|---|---|
| **Violence** | Erőszakos, fenyegető vagy fizikailag ártalmas tartalom |
| **Hate Speech** | Diszkrimináció, rasszizmus vagy bigottság |
| **Sexual Content** | Explicit szexuális tartalom vagy jelenetek |
| **NSFW / Profanity** | Trágár nyelvezet, káromkodás, explicit sértések és felnőtt szleng bármely nyelven |
| **Self-Harm** | Öngyilkosság, önsértés vagy kapcsolódó tartalom |
| **Harassment** | Személyes támadások, sértések, zaklatás vagy megfélemlítés |
| **Illegal Activity** | Utasítások illegális cselekmények elkövetéséhez |
| **Political Extremism** | Szélsőséges politikai tartalom vagy erőszakos propaganda |
| **Spam / Phishing** | Spam, adathalászat vagy social engineering |
| **Personal Data Request** | Magán- vagy személyazonosításra alkalmas adatok kérése |
| **Prompt Injection** | Kísérletek a rendszerutasítások felülírására, rosszindulatú promptok befecskendezésére vagy a modell viselkedésének manipulálására |

## Érzékenység

A **Sensitivity** beállítás szabályozza, milyen szigorúan történik a szabálysértések észlelése:

| Szint | Viselkedés |
|---|---|
| **Low** | Még a határeseteket vagy kétértelmű eseteket is megjelöli |
| **Medium** *(alapértelmezett)* | Az egyértelmű szabálysértéseket jelöli meg; a határeseteket figyelmen kívül hagyja |
| **High** | Csak a szélsőséges, egyértelmű szabálysértéseket jelöli meg |

## Hogyan működik az észlelés

Az észlelés a **kiválasztott guardrail hitelesítési adatokat és modellt** használja:

- **OpenAI hitelesítési adatok** — az [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) szolgáltatást használja (ingyenes, gyors, nem használ tokeneket) az általa natívan lefedett öt kategóriához (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). A többi kategóriát a kiválasztott guardrail modellel végzett LLM-osztályozási hívás ellenőrzi.
- **Google / egyedi hitelesítési adatok** — minden kategóriát a kiválasztott guardrail hitelesítési adatokkal és modellel végzett LLM-osztályozási hívás ellenőrzi.

Ha a fő modell olyan egyedi szolgáltatót használ (pl. Zhipu, Cerebras), amely 404-et vagy más API-hibát adhat vissza, válasszon **OpenAI vagy Google hitelesítési adatokat** a Guardrails funkcióhoz.

## Hibaformátum

Amikor egy guardrail aktiválódik, a csomópont a következő üzenettel dob hibát:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

A csomópont eredményének `output` mezője tartalmazza a `guardrail_violated_categories` értéket is (a megsértett kategóriacímkék tömbjét), így a Debug Panel és az Execution History egyértelműen meg tudja jeleníteni a „Blocked by: X, Y" üzenetet.

Használja a csomópont **Continue on error** opcióját (vagy egy [Error Handler](../nodes/error-handler-node.md) csomópontot), hogy a guardrail aktiválódásakor a workflow egy tartalék ágra irányuljon.

## Példa workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Megjegyzések

- **Nincsenek újrapróbálkozások**: A guardrail-szabálysértések szándékos blokkolások, és soha nem kerülnek újrapróbálkozásra, még akkor sem, ha a csomóponton engedélyezve van a „Retry on failure" opció.
- Nincs szükség adatbázis-migrációra — a guardrail beállítások a workflow csomópont JSON-jában tárolódnak, a többi csomópontadattal együtt.
- A Guardrails a feloldott **felhasználói üzenetet** ellenőrzi (a sablonkifejezések kiértékelése után), nem a nyers sablont.
- Ha a Guardrails engedélyezése mellett **egyetlen kategória sincs beállítva**, az megegyezik a letiltással — nem történik ellenőrzés.
- **Low** érzékenység esetén az LLM-osztályozás mindig lefut (a legjobb többnyelvű lefedettség érdekében). Az OpenAI hitelesítési adatok emellett a Moderation API-t is futtatják.
- **Medium/High** érzékenység esetén az OpenAI hitelesítési adatok a natívan támogatott kategóriákhoz a Moderation API-t, a többihez pedig LLM-osztályozást használnak. A Google/egyedi hitelesítési adatok mindig LLM-osztályozást használnak.
- Az LLM-osztályozás **nyelvfüggetlen** — észleli a szabálysértéseket török, arab, orosz, spanyol és más nyelveken.
