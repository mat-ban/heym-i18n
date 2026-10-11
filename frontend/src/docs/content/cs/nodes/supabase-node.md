# Supabase

Uzel **Supabase** načítá a upravuje tabulky zpřístupněné prostřednictvím PostgREST API projektu Supabase. Použijte jej, pokud chcete mít z workflow přístup ke stavu aplikace podloženému SQL bez ručního psaní HTTP požadavků.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | Supabase |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje Supabase z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operace: `select`, `insert`, `update`, `upsert` nebo `delete` |
| `supabaseSchema` | expression | Název schématu. Pokud je prázdný, uzel použije výchozí schéma z přihlašovacích údajů, poté `public`. |
| `supabaseTable` | expression | Jednoduchý název tabulky pro dotaz nebo úpravu. Schéma vložte do `supabaseSchema`, nikoli sem. |
| `supabaseSelectColumns` | expression | Čárkami oddělený seznam pro PostgREST select u operace `select` (výchozí `*`) |
| `supabaseFilter` | expression | JSON objekt filtru. Podporuje přesné shody, objekty operátorů a logické skupiny, např. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` nebo `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maximální počet řádků vrácených pro `select` (`0` = načíst všechny odpovídající řádky se serverovou stránkováním, záporné hodnoty se použijí jako `100`) |
| `supabaseOrderBy` | expression | Volitelný sloupec pro řazení u operace `select` |
| `supabaseAscending` | boolean | Řadit vzestupně při `true`, sestupně při `false` |
| `supabaseRowsInputMode` | string | Pro `insert`/`upsert`: režim `raw` s JSON polem nebo `auto` pro automatické mapování jediného vstupu z předchozího uzlu |
| `supabaseDataInputMode` | string | Pro `update`: režim `raw` s JSON objektem nebo `auto` pro automatické mapování jediného vstupu z předchozího uzlu |
| `supabaseIgnoredInputFields` | string | Volitelný čárkami oddělený seznam názvů polí, která se mají vynechat při automatickém mapování vstupních dat |
| `supabaseRows` | expression | JSON pole objektů řádků pro `insert` a `upsert` |
| `supabaseOnConflict` | expression | Volitelné čárkami oddělené cílové sloupce konfliktu pro `upsert`, například `id` nebo `tenant_id,email` |
| `supabaseData` | expression | JSON objekt aktualizovaných hodnot sloupců pro `update` |

## Nastavení přihlašovacích údajů

Vytvořte přihlašovací údaje **Supabase** na kartě [Přihlašovací údaje](../tabs/credentials-tab.md) s:

1. Vaší **Project URL**, například `https://your-project.supabase.co`
2. **API klíčem** s přístupem k tabulkám, které má tento workflow používat
3. Volitelným **výchozím schématem** (výchozí je `public`)

Uzel komunikuje s PostgREST endpointem Supabase na adrese `/rest/v1/<table>`.
V poli `supabaseTable` uvádějte pouze název tabulky, například `users` nebo `profiles`. Nevkládejte sem `schema.table`, `rpc/...` ani jiné API cesty.

Pokud jsou vybrány platné přihlašovací údaje Supabase, může editor objevit zpřístupněné tabulky a sloupce tabulek
přímo z metadat PostgREST OpenAPI. Pomocí rozbalovacího seznamu **discovered tables** vyberte
tabulku a pomocí **column chips** pod **Select Columns** rychle sestavte seznam pro select.

## Operace

| Operace | Povinná pole | Popis |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Načíst řádky s volitelnými filtry přesné shody, limitem a řazením |
| `insert` | `supabaseTable`, `supabaseRows` nebo automatické mapování vstupu | Vložit jeden nebo více řádků |
| `update` | `supabaseTable`, `supabaseData` nebo automatické mapování vstupu, `supabaseFilter` | Aktualizovat řádky odpovídající filtru |
| `upsert` | `supabaseTable`, `supabaseRows` nebo automatické mapování vstupu | Vložit nebo sloučit řádky pomocí sémantiky upsert v Supabase. Pokud potřebujete explicitní cíl konfliktu, použijte `supabaseOnConflict`. |
| `delete` | `supabaseTable`, `supabaseFilter` | Smazat řádky odpovídající filtru |

## Syntaxe filtru

`supabaseFilter` kompiluje strukturovaný JSON do parametrů dotazu PostgREST.

- Přesná shoda: `{"status":"active"}`
- Porovnání: `{"created_at":{"gte":"2026-01-01"}}`
- Příslušnost do množiny: `{"status":{"in":["active","paused"]}}`
- Shoda vzoru: `{"email":{"ilike":"*@example.com"}}`
- Logické OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logické AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Pro více operátorů na stejném poli použijte raději logickou skupinu:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Stránkování

Operace `select` nyní provádí skutečné serverové stránkování vůči PostgREST.

- `supabaseLimit: "0"` načte všechny odpovídající řádky stránku po stránce
- Hodnoty `supabaseLimit` vyšší než 1000 se automaticky rozdělí do více požadavků
- Výsledky se sloučí zpět do jednoho pole `.rows` a hodnota `.count` zůstává celkovým počtem odpovídajících řádků

Při čtení velkých tabulek nastavte stabilní `supabaseOrderBy`, aby hranice stránek zůstaly předvídatelné.

## Automatické mapování vstupu

Pro `insert`, `upsert` a `update` přepněte uzel na **Auto-map input**, pokud jediný
předchozí uzel již produkuje tvar, který chcete zapsat.

- Jediný objekt se stane jedním řádkem nebo jedním payloadem pro update
- Pole objektů se stane mnoha řádky pro `insert` / `upsert`
- Objekt z předchozího uzlu s polem `rows` toto pole přímo využije
- `supabaseIgnoredInputFields` umožňuje vynechat pole, jako jsou `id`, `created_at` nebo `success`
## Reference výstupu

| Výstupní pole | Typ | Popis |
|-------------|------|-------------|
| `.rows` | array | Vrácené objekty řádků |
| `.count` | number | Počet vrácených nebo ovlivněných řádků |
| `.success` | boolean | Zda operace proběhla úspěšně |

## Příklad – Výběr aktivních uživatelů

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Přístup k výstupu: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Příklad – Upsert řádku profilu

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání přihlašovacích údajů Supabase
- [Integrace třetích stran](../reference/integrations.md) – Nastavení přihlašovacích údajů pro integrace
