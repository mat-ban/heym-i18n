# Jira csomópont

A **Jira** csomópont a workflow-kat a Jira REST API-hoz kapcsolja projekt-, issue-, megjegyzés-, melléklet-, felhasználó-, értesítés- és állapotátmenet-automatizáláshoz. Az alapértelmezett művelet a **Search Issues**.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adatok | Jira (Cloud email/API token, Data Center felhasználónév/jelszó vagy személyes hozzáférési token, base URL, telepítési mód, opcionális REST API verzió) |
| Kimenet | `$nodeLabel.*` |

## Hitelesítési adatok

Hozzon létre egy **Jira** hitelesítési adatot a [Hitelesítési adatok fülön](../tabs/credentials-tab.md). A tárolt konfigurációs kulcsok: `email`, `api_token`, `base_url`, `deployment`, `auth_mode` és opcionális `api_version`. Jira Cloud esetén az `email` az Atlassian-fiók e-mail-címét, az `api_token` pedig az Atlassian API tokent tárolja. Jira Data Center / Server esetén ugyanezek a kulcsok a Basic auth felhasználónevét és jelszavát tárolják, illetve `auth_mode: pat` esetén az `api_token` egy Bearer tokenként elküldött személyes hozzáférési tokent tárol, és az `email` nincs használatban. A beállítás lépéseit lásd a [Third-Party Integrations](../reference/integrations.md#jira) oldalon.

| Mező | Konfigurációs kulcs | Leírás |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloud Atlassian-fiók e-mail-címe, vagy Jira Data Center / Server felhasználónév |
| Hitelesítés | `auth_mode` | `basic` (alapértelmezett) vagy `pat` (csak Data Center / Server) |
| API Token / Password / Személyes hozzáférési token | `api_token` | Jira Cloud Atlassian API token, Jira Data Center / Server jelszó Basic auth-hoz vagy Data Center személyes hozzáférési token `pat` módban |
| Base URL | `base_url` | Jira webhely URL-je, például `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` Jira Cloud esetén vagy `data_center` Jira Data Center / Server esetén |
| REST API Version | `api_version` | Jira Cloud esetén alapértelmezés szerint `3`. Data Center / Server a REST API v2-t használja |

A személyes hozzáférési tokenekhez Jira Data Center / Server 8.14 vagy újabb verzió szükséges. A hitelesítési módszer váltása törli a tárolt titkot, ezért váltáskor adja meg az új jelszót vagy tokent.

A **Test Connection** használatával ellenőrizheti a hitelesítési adatokat az aktuális Jira-felhasználóval szemben.

## Műveletek

| Művelet | Kötelező mezők | Kimenet |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Opcionális Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Opcionális JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key vagy ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key vagy ID és legalább egy módosított mező | `issue`, `key` |
| Delete Issue | Issue Key vagy ID | `deleted` |
| Get Issue Changelog | Issue Key vagy ID; opcionális Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key vagy ID, Subject, Text Body | `notified` |
| List Comments | Issue Key vagy ID; opcionális Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key vagy ID, Comment Body | `comment` |
| Get Comment | Issue Key vagy ID, Comment ID | `comment` |
| Update Comment | Issue Key vagy ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key vagy ID, Comment ID | `deleted` |
| Add Attachment | Issue Key vagy ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; opcionális Include Binary | `attachment` |
| List Attachments | Issue Key vagy ID; opcionális Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key vagy ID | `transitions`, `count` |
| Transition Issue | Issue Key vagy ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

A kifejezéseket támogató szövegmezők támogatják a [kifejezéseket](../reference/expression-dsl.md), például `$input.text`. A `jiraIncludeBinary` egy logikai kapcsoló, amely nem támogatja a kifejezéseket, de agent által biztosítottként jelölhető meg, amikor a Jira csomópont egy Agent tool fogantyúhoz van csatolva.

## Issue- és frissítési mezők

- A **Project Key** a rövid projektkulcs, például `ENG`. A kulcsok felderítéséhez használja a List Projects műveletet.
- Az **Issue Key or ID** elfogad olyan kulcsokat, mint az `ENG-123`, vagy numerikus issue ID-kat. Az értékek felderítéséhez használja a Search Issues vagy a List Projects műveletet.
- A **Transition ID** a List Transitions műveletből származik. Minden transition objektum tartalmaz egy `id` mezőt.
- A **Comment ID** és az **Attachment ID** a List Comments, a List Attachments vagy a korábbi create/get válaszokból származik.
- Az **Account ID / Username** a Jira Cloud `accountId` értéke vagy a Jira Data Center / Server felhasználóneve. A Get Myself vagy a Get User segíthet a felderítésében.
- Az issue **description** és a megjegyzés **body** szövege a REST API v3-on Atlassian Document Format formátumban kerül elküldésre; amikor a hitelesítési adatok telepítési módja Data Center / Server, akkor egyszerű szövegként kerülnek elküldésre. A v3-ban az újsor karakterek külön bekezdésekké válnak.
- A **Get Issue Changelog** a Jira Cloud lapozott changelog endpointját használja. Data Center / Server esetén a kibővített issue changelog adatokat olvassa, és a beállított offset/limit értéket alkalmazza a visszaadott előzményekre.
- Az **Update Issue** műveletnél hagyja üresen az opcionális mezőket, hogy megőrizze azok aktuális értékét.
- Állítsa a **Description** vagy az **Assignee Account ID / Username** mezőt `null` értékre a frissítés során ezen mezők törléséhez. A címkék nem törölhetők `null` értékkel.
- A Notify Issue művelet **Recipients JSON** mezője kihagyás esetén alapértelmezés szerint `{"assignee":true}`. A gyakori kulcsok közé tartozik az `assignee`, `reporter`, `watchers` és `voters` (például `{"assignee":true,"watchers":true}`).
- Az **Add Attachment** nyers base64 vagy data URL tartalmat fogad el, és a platform fájlméret-beállítása korlátozza (alapértelmezés szerint 99 MB).
## Lapozás

- A **Search Issues** kurzor alapú lapozást használ a `jiraNextPageToken` segítségével Jira Cloud esetén. Olvassa ki a `pagination.nextPageToken` értékét az előző futtatásból, és adja át a következő Search Issues csomópontnak.
- A **Search Issues** offset alapú lapozást használ a `jiraStartAt` segítségével Jira Data Center / Server esetén. Olvassa ki a `pagination.startAt`, `pagination.maxResults` és `pagination.total` értékeket a következő oldal kiszámításához.
- A **List Projects**, **Get Issue Changelog**, **List Comments** és **List Attachments** offset alapú lapozást használ a `jiraLimit` és `jiraStartAt` paraméterekkel. A lapozott eredmények a `pagination.startAt`, `pagination.maxResults`, `pagination.total` és `pagination.isLast` mezőket adják vissza.
- A **List Attachments** először az issue összes mellékletét kéri le, majd az eredményt kliensoldalon szeleteli. A lapozási mezők továbbra is a visszaadott oldalt írják le, de nagy issue-k esetén ez további lekérési költséggel járhat.
- A **List Transitions** nem használ lapozást.

## Kulcsfontosságú mezők

| Mező | Mely műveletek használják | Megjegyzések |
| --- | --- | --- |
| `credentialId` | Minden művelet | Saját tulajdonú Jira hitelesítési adat UUID-ja |
| `jiraOperation` | Minden művelet | Alapértelmezés: `searchIssues` |
| `jiraProjectKey` | Create Issue | Projektkulcs, például `ENG` |
| `jiraIssueKey` | Issue-, komment-, melléklet-, értesítési és tranzíciós műveletek | Issue-kulcs, például `ENG-123`, vagy numerikus issue-azonosító |
| `jiraIssueType` | Create Issue | Alapértelmezés: `Task` |
| `jiraIssueTypeId` | Create Issue | Opcionális issue-típus azonosító; ha be van állítva, felülírja a `jiraIssueType` értékét |
| `jiraSummary` | Create/Update Issue | A Create Issue műveletnél kötelező |
| `jiraDescription` | Create/Update Issue | REST API v3 esetén ADF formátumban, REST API v2 esetén egyszerű szövegként kerül elküldésre; frissítéskor a leírás törléséhez használja a `null` értéket |
| `jiraJql` | Search Issues | Alapértelmezés: `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Opcionális JSON-tömb vagy vesszővel elválasztott issue-mezők; üres érték esetén alapértelmezés: `key`, `summary`, `status`, `assignee` és `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId vagy Data Center / Server felhasználónév; frissítéskor a felelős törléséhez használja a `null` értéket |
| `jiraLabels` | Create/Update Issue | JSON-tömb vagy vesszővel elválasztott szöveg |
| `jiraCommentBody` | Create/Update Comment | REST API v3 esetén ADF formátumban, REST API v2 esetén egyszerű szövegként kerül elküldésre |
| `jiraCommentId` | Get/Update/Delete Comment | Jira komment-azonosító |
| `jiraTransitionId` | Transition Issue | A List Transitions művelettel deríthető fel |
| `jiraAttachmentId` | Get/Delete Attachment | Jira melléklet-azonosító |
| `jiraAttachmentFilename` | Add Attachment | Feltöltött fájlnév |
| `jiraAttachmentBase64` | Add Attachment | Nyers base64 vagy data URL tartalom; a fájlméret-korlát vonatkozik rá |
| `jiraAttachmentMimeType` | Add Attachment | Opcionális MIME-típus; üres érték esetén a fájlnévből kerül kikövetkeztetésre |
| `jiraIncludeBinary` | Get/List Attachment | Logikai kapcsoló; engedélyezése esetén hozzáadja a `content_base64` mezőt |
| `jiraNotifySubject` | Notify Issue | Kötelező értesítési tárgy |
| `jiraNotifyTextBody` | Notify Issue | Kötelező egyszerű szöveges értesítési törzs |
| `jiraNotifyHtmlBody` | Notify Issue | Opcionális HTML-törzs |
| `jiraNotifyTo` | Notify Issue | Címzettek JSON formátumban; alapértelmezés: `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId vagy Data Center / Server felhasználónév |
| `jiraUserEmail` | Create User | Az új felhasználó e-mail-címe |
| `jiraUsername` | Create User | Opcionális Data Center / Server felhasználónév; ennek hiányában a `jiraUserEmail` értékére esik vissza |
| `jiraUserDisplayName` | Create User | Opcionális megjelenítendő név |
| `jiraUserProducts` | Create User | JSON-tömb vagy vesszővel elválasztott termékkulcsok; csak Jira Cloud esetén |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Alapértelmezés: `50`; tartomány 1–100 |
| `jiraStartAt` | Search Issues Data Center / Server esetén, List Projects, Get Issue Changelog, List Comments, List Attachments | Offset alapú lapozás kezdőindexe |
| `jiraNextPageToken` | Search Issues Jira Cloud esetén | Az előző keresési válaszból származó kurzor token |

## Példák

Issue létrehozása a bemeneti adatokból:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Issue frissítése és a felelős törlése:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Issue-k keresése egyéni mezőkkel és kurzor alapú lapozással:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Issue-k keresése Data Centeren offset alapú lapozással:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Issue tranzíciója az elérhető tranzíciók listázása után:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Ezután futtassa a **Transition Issue** műveletet a következő Transition ID értékkel: `$listTransitions.transitions[0].id`

A figyelők értesítése egy issue frissítéséről:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Kimenet

Minden sikeres művelet beállítja a következőket:

- `$jira.success`
- `$jira.operation`

**Get Myself** esetén elérhető a `user`.

**Lapozott lista műveletek** esetén elérhető a `count`, egy gyűjtemény mező, valamint a `pagination`:

| Művelet | Gyűjtemény kulcs | Lapozás formátuma |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** esetén elérhető a `transitions` és a `count`, lapozás nélkül.

**Issue módosítások és olvasások** esetén elérhető a Jira issue payload, valamint adott esetben a `key`.

**Comment** get/create/update esetén elérhető a `comment`; delete esetén a `deleted`.

**Transition Issue** esetén elérhető a `transition` `{ transitionId }` formában, valamint a frissített `issue` és a `key`.

**Attachment add** esetén elérhető az `attachments` és a `count`. **Get Attachment** esetén elérhető az `attachment`; **List Attachments** esetén elérhető az `attachments`, a `count` és a `pagination`. Ha az **Include Binary** engedélyezve van, minden attachment objektum tartalmazhat `content_base64` mezőt. Delete esetén elérhető a `deleted`.

**User** get/create esetén elérhető a `user`; delete esetén a `deleted`.

**Notify Issue** esetén elérhető a `notified`.

Gyakori hozzáférési minták:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Kapcsolódó

- [Hitelesítési adatok fül](../tabs/credentials-tab.md)
- [Külső integrációk](../reference/integrations.md#jira)
- [Csomópont típusok](../reference/node-types.md)
- [Kifejezés DSL](../reference/expression-dsl.md)
