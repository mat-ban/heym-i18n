# Single Sign-On

Heym umí ověřovat uživatele proti libovolnému externímu poskytovateli **OpenID Connect**. Administrátor zadá v části **Settings → SSO** URL vydavatele (issuer) a Heym si všechny ostatní endpointy načte z discovery dokumentu daného poskytovatele.

Žádný poskytovatel není napevno zadrátovaný. Keycloak, Okta, Entra ID, Auth0, Google a jakýkoli další OIDC poskytovatel se připojuje přes stejná pole, protože jediné, co se Heymu sděluje, je issuer.

Přihlašování heslem a SSO fungují vedle sebe. Přihlašování heslem lze vypnout, jakmile je SSO ověřeno.

## Než začnete

Nastavení SSO platí pro celou instanci, takže jej smějí měnit pouze administrátoři instance. Administrátoři se určují pomocí proměnné prostředí, nikoli uložením v databázi:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Prázdná hodnota nepřiděluje práva nikomu. Po změně restartujte backend. Účty v tomto seznamu také vidí kartu **SSO** v části Settings a zachovávají si přístup pomocí hesla, i když je přihlašování heslem vypnuté — viz [Disabling Password Sign-In](#disabling-password-sign-in).

## Registrace Heymu u vašeho poskytovatele

U svého poskytovatele identity vytvořte **confidential client** (označovaný také jako registrace aplikace) s těmito parametry:

| Nastavení | Hodnota |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | Zapnuto — Heym používá client secret |
| Redirect URI | Přesná hodnota zobrazená na kartě SSO v Heymu |
| Scopes | `openid email profile` |

Heym vypočítá redirect URI z `FRONTEND_URL` a zobrazí jej v nastavení pouze pro čtení s tlačítkem pro kopírování. Vždy končí na `/api/auth/sso/callback`. Zkopírujte jej, nepište jej ručně — neshodná redirect URI je nejčastější příčinou selhání nastavení a poskytovatelé ji odmítnou bez vysvětlení.

Váš poskytovatel musí vracet ověřenou e-mailovou adresu. Viz [Account Mapping](#account-mapping).

## Konfigurace Heymu

Otevřete **Settings → SSO**. Karta se zobrazuje pouze účtům uvedeným v `HEYM_ADMIN_EMAILS`.

| Pole | Co dělá |
|-------|--------------|
| **Enable single sign-on** | Zobrazí tlačítko pro přihlášení na přihlašovací obrazovce. |
| **Issuer URL** | Základní URL poskytovatele, například `https://idp.example.com/realms/your-realm`. Heym připojí `/.well-known/openid-configuration` a zbytek načte odtud. |
| **Client ID** | Identifikátor klienta od vašeho poskytovatele. |
| **Client secret** | Ukládá se šifrovaně. Ponechte pole prázdné, chcete-li zachovat uloženou hodnotu — Heym nikdy nevrací secret, který uchovává. |
| **Redirect URI** | Pouze pro čtení. Zkopírujte jej do allowlistu u svého poskytovatele. |
| **Scopes** | Ve výchozím nastavení `openid email profile`. |
| **Sign-in button label** | Text na tlačítku přihlašovací obrazovky, například „Sign in with Okta". |
| **Create an account on first sign-in** | Zda neznámí uživatelé automaticky dostanou účet v Heymu. |
| **Allowed email domains** | Oddělené čárkami. Prázdná hodnota povoluje jakoukoli doménu, kterou poskytovatel ověří. |
| **Disable password sign-in** | Vypne ověřování heslem pro celou instanci. |

### Nejprve otestujte připojení

**Test connection** načte discovery dokument a podpisové klíče poskytovatele a poté ohlásí token endpoint, který nalezl. Můžete jej spustit na issueru, který jste zadali, ale ještě neuložili, takže špatná URL stojí jedno kliknutí místo uložení.

Test *zaznamená* úspěšný výsledek pouze tehdy, když je testovaný issuer ten, který je již uložen. Test konceptu vám řekne, zda se URL přeloží; neopravňuje však konfiguraci, která není uložena. Změna issueru, client ID, scopes nebo secretu vymaže zaznamenaný výsledek ze stejného důvodu.

## Jak přihlášení funguje

1. Někdo klikne na přihlašovací obrazovce na tlačítko pro přihlášení.
2. Heym jej přesměruje k poskytovateli s `state`, `nonce` a PKCE challenge.
3. Uživatel se ověří u poskytovatele.
4. Poskytovatel přesměruje zpět na callback Heymu s autorizačním kódem.
5. Heym vymění kód za tokeny a ověří ID token proti zveřejněným klíčům poskytovatele, přičemž zkontroluje podpis, audience, issuer, platnost a nonce.
6. Heym dohledá účet a vydá vlastní session, přesně jako při přihlášení heslem.

Vše za krokem 6 zůstává nezměněno: stejné session cookies, stejné životnosti tokenů, stejná oprávnění.

## Account Mapping

Heym dohledá účet v tomto pořadí:

1. **`(issuer, subject)`** — identita, kterou poskytovatel uplatnil při předchozím přihlášení. Tato je směrodatná a přetrvá i změnu e-mailu u poskytovatele.
2. **Ověřený e-mail** — existující účet v Heymu s touto adresou je převzat a subject poskytovatele se na něm od té doby zaznamenává.
3. **Nový účet** — vytvoří se, pokud je zapnuto **Create an account on first sign-in** a doména je povolena.

E-mail se považuje za ověřený pouze tehdy, když ID token obsahuje `email_verified: true`. Pokud je tento claim `false` nebo chybí, přihlášení se odmítne. Převzetí existujícího účtu — nebo vytvoření nového — na základě adresy, za kterou poskytovatel neručí, je cestou k převzetí účtu, a proto to Heym nedělá. Poskytovatele, který `email_verified` nikdy nevydává, je třeba nakonfigurovat tak, aby jej vydával.

Účty vytvořené tímto způsobem nemají heslo. Přihlašují se pouze prostřednictvím poskytovatele.
## Zakázání přihlašování heslem

Přepínač **Zakázat přihlašování heslem** zůstává nedostupný, dokud nejsou splněny tři podmínky:

1. Je povoleno SSO.
2. Proběhl úspěšný test připojení, aby se nesprávný issuer nemohl zamknout za vlastními dveřmi.
3. Alespoň jeden účet v `HEYM_ADMIN_EMAILS` skutečně má heslo.

Když je přepínač zapnutý, ověřování heslem je odmítnuto na všech třech místech, která heslo vydávají nebo přijímají: přihlašovací formulář, **registrace** a stránka souhlasu MCP OAuth. Registrace se počítá, protože vydává heslo; ponechat ji otevřenou by znamenalo, že nastavení může obejít kdokoli, kdo se dostane na `/register`.

Účty uvedené v `HEYM_ADMIN_EMAILS` jsou ze všech tří omezení vyjmuty. Kdokoli, kdo může upravovat konfigurační soubor prostředí, už stejně dokáže instanci obnovit, takže tato záruka spočívá v kódu, nikoli v paměti operátora.

### Proč existuje třetí podmínka

Administrátor, jehož účet v Heymu byl vytvořen *prostřednictvím* SSO, nemá vůbec žádné heslo. Výjimka by ho sice pustila za bránu, ale neměl by se čím přihlásit — instance by tedy neměla cestu zpět, kdyby poskytovatel přestal fungovat. Heym odmítá do tohoto stavu přejít a dá to najevo.

Pokud na tuto zprávu narazíte, přihlaste se přes SSO a zaregistrujte účet s heslem na některé ze svých administrátorských adres (registrace je administrátorským adresám otevřená právě z tohoto důvodu), nebo přidejte do `HEYM_ADMIN_EMAILS` adresu, která už heslo má.

### Obnovení, když poskytovatel nefunguje

V pořadí podle preference:

1. **Přihlaste se pomocí nouzového administrátorského hesla.** Přihlašovací obrazovka skryje formulář pro heslo, když je přihlašování heslem vypnuté, takže jej zobrazíte kliknutím na **Přihlásit se místo toho heslem** pod tlačítkem SSO. Formulář není obejitím: každá adresa mimo `HEYM_ADMIN_EMAILS` je stále odmítnuta, a to i s vysvětlením proč.
2. **Přidejte se do `HEYM_ADMIN_EMAILS`** v konfiguračním souboru prostředí a restartujte backend. Účet, který už heslo má, se pak může přihlásit.
3. **Znovu povolte přihlašování heslem přímo v databázi**, pokud žádný administrátor nemá vůbec heslo:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Restart není potřeba; nastavení se načítá při každém požadavku.

Koncoví uživatelé portálu nejsou ovlivněni. Ověřují se proti samostatnému adresáři — viz [Portál](./portal.md).

## Chyby při přihlašování

Neúspěšné přihlášení se vrátí na přihlašovací obrazovku s čitelnou zprávou. Heym nikdy nezobrazuje surový text chyby od poskytovatele.

| Zpráva | Příčina |
|---------|-------|
| That sign-in attempt expired | Pokus trval déle než deset minut nebo prohlížeč zahodil transakční cookie. Zkuste to znovu. |
| Could not reach the identity provider | Selhalo zjišťování (discovery) nebo výměna tokenu. Zkontrolujte URL issueru a zda je poskytovatel dostupný z backendu. |
| The provider's response could not be verified | ID token neprošel ověřením podpisu, audience, issueru, platnosti nebo nonce. Obvykle neshoda client ID. |
| The provider did not return an email address | Chybí scope `email` nebo poskytovatel claim nevydává. |
| Your email address is not verified | Poskytovatel poslal `email_verified: false` nebo claim vynechal. |
| Your email domain is not allowed | Adresa je mimo **Povolené e-mailové domény**. |
| No Heym account exists for you | **Vytvořit účet při prvním přihlášení** je vypnuto a žádný účet neodpovídá. Účet musí vytvořit administrátor. |
| Single sign-on is not configured | SSO je zakázáno nebo chybí issuer, client ID či secret. |

## Bezpečnostní poznámky

- **Client secret je šifrován v klidovém stavu** a nikdy jej nevrací žádný endpoint. Formulář nastavení pouze uvádí, zda je nějaký uložen.
- **PKCE verifier nikdy neopouští Heym.** Je držen v krátkodobé cookie `HttpOnly`, nikoli v parametru `state`, který prochází přes poskytovatele na očích.
- **Přijímají se pouze asymetrické podpisy.** `none` a symetrické algoritmy jsou odmítnuty bez ohledu na to, co poskytovatel inzeruje.
- **Cíl po přihlášení je ověřen** jako cesta ve stejném originu, takže callback nelze zneužít jako otevřené přesměrování.
- **Každé přihlášení je auditováno.** Úspěchy, selhání a odmítnutí se objevují jako řádky `auth.sso_login` a změny konfigurace jako `sso_settings.update` — viz [Audit Logging](./audit.md).

## Co není podporováno

- **SAML.** Jediným protokolem je OIDC.
- **Více souběžných poskytovatelů.** Jedna instance se připojuje k jednomu poskytovateli.
- **Mapování skupin nebo rolí** z claimů poskytovatele.
- **Single logout.** Odhlášení z Heymu vás neodhlásí od poskytovatele.
