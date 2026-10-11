# Single Sign-On

Heym dokáže overovať používateľov voči akémukoľvek externému poskytovateľovi **OpenID Connect**. Administrátor zadá URL adresu vydavateľa v časti **Settings → SSO** a Heym načíta všetky ostatné endpointy z discovery dokumentu daného poskytovateľa.

Žiadny poskytovateľ nie je natvrdo zakódovaný. Keycloak, Okta, Entra ID, Auth0, Google a akýkoľvek iný OIDC poskytovateľ sa pripája prostredníctvom rovnakých polí, pretože jediné, čo sa Heymu oznamuje, je vydavateľ.

Prihlásenie heslom a SSO fungujú súbežne. Prihlásenie heslom je možné vypnúť, keď je SSO overené.

## Predtým, než začnete

Nastavenia SSO platia pre celú inštanciu, takže ich môžu meniť iba administrátori inštancie. Administrátori sa určujú pomocou premennej prostredia, nie sú uložení v databáze:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Prázdna hodnota neudeľuje práva nikomu. Po zmene je potrebné reštartovať backend. Účty v tomto zozname tiež vidia kartu **SSO** v časti Settings a zachovávajú si prístup pomocou hesla, aj keď je prihlásenie heslom vypnuté — pozri [Vypnutie prihlásenia heslom](#disabling-password-sign-in).

## Registrácia Heymu u poskytovateľa

Vo svojom poskytovateľovi identity vytvorte **confidential client** (nazývaný aj app registration) s nasledujúcimi parametrami:

| Nastavenie | Hodnota |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | Zapnuté — Heym používa client secret |
| Redirect URI | Presná hodnota zobrazená na karte SSO v Heyme |
| Scopes | `openid email profile` |

Heym vypočíta redirect URI z premennej `FRONTEND_URL` a zobrazí ju iba na čítanie vo formulári nastavení spolu s tlačidlom na kopírovanie. Vždy končí na `/api/auth/sso/callback`. Skopírujte ju namiesto manuálneho prepisovania — nezhodná redirect URI je najčastejšou príčinou zlyhania konfigurácie a poskytovatelia ju odmietnu bez vysvetlenia.

Váš poskytovateľ musí vracať overenú e-mailovú adresu. Pozri [Priradenie účtu](#account-mapping).

## Konfigurácia Heymu

Otvorte **Settings → SSO**. Karta sa zobrazuje iba pre účty uvedené v `HEYM_ADMIN_EMAILS`.

| Pole | Čo robí |
|-------|--------------|
| **Enable single sign-on** | Zobrazí tlačidlo prihlásenia na prihlasovacej obrazovke. |
| **Issuer URL** | Základná URL adresa poskytovateľa, napríklad `https://idp.example.com/realms/your-realm`. Heym pripojí `/.well-known/openid-configuration` a zvyšok načíta odtiaľ. |
| **Client ID** | Identifikátor klienta od vášho poskytovateľa. |
| **Client secret** | Ukladá sa zašifrovaný. Ak chcete zachovať uloženú hodnotu, nechajte pole prázdne — Heym nikdy nevráti secret, ktorý uchováva. |
| **Redirect URI** | Iba na čítanie. Skopírujte ju do allowlistu svojho poskytovateľa. |
| **Scopes** | Predvolene `openid email profile`. |
| **Sign-in button label** | Text na tlačidle prihlasovacej obrazovky, napríklad „Sign in with Okta". |
| **Create an account on first sign-in** | Či neznámi používatelia automaticky dostanú účet v Heyme. |
| **Allowed email domains** | Oddelené čiarkami. Prázdna hodnota povoľuje akúkoľvek doménu, ktorú poskytovateľ overí. |
| **Disable password sign-in** | Vypne overovanie heslom pre celú inštanciu. |

### Najprv otestujte pripojenie

**Test connection** načíta discovery dokument a podpisové kľúče poskytovateľa a následne oznámi token endpoint, ktorý našiel. Môžete ho spustiť na vydavateľovi, ktorého ste zadali, ale ešte neuložili, takže nesprávna URL adresa vás stojí jedno kliknutie namiesto uloženia.

Test *zaznamená* úspešný výsledok iba vtedy, keď je testovaný vydavateľ ten, ktorý je už uložený. Test konceptu vám povie, či sa URL adresa dá vyriešiť; neoprávňuje však konfiguráciu, ktorá nie je uložená. Zmena vydavateľa, client ID, scopes alebo secretu vymaže zaznamenaný výsledok z rovnakého dôvodu.

## Ako funguje prihlásenie

1. Používateľ klikne na tlačidlo prihlásenia na prihlasovacej obrazovke.
2. Heym ho presmeruje k poskytovateľovi s parametrami `state`, `nonce` a PKCE challenge.
3. Používateľ sa overí u poskytovateľa.
4. Poskytovateľ ho presmeruje späť na callback Heymu s autorizačným kódom.
5. Heym vymení kód za tokeny a overí ID token voči zverejneným kľúčom poskytovateľa, pričom skontroluje podpis, audience, vydavateľa, platnosť a nonce.
6. Heym vyrieši účet a vydá vlastnú session, presne tak, ako pri prihlásení heslom.

Všetko po kroku 6 zostáva nezmenené: rovnaké session cookies, rovnaké životnosti tokenov, rovnaké oprávnenia.

## Priradenie účtu

Heym vyrieši účet v tomto poradí:

1. **`(issuer, subject)`** — identita, ktorú poskytovateľ uplatnil pri predchádzajúcom prihlásení. Táto je smerodajná a pretrvá aj pri zmene e-mailu u poskytovateľa.
2. **Overený e-mail** — existujúci účet v Heyme s touto adresou sa nárokuje a subject poskytovateľa sa odvtedy na ňom zaznamenáva.
3. **Nový účet** — vytvorí sa, ak je zapnutá možnosť **Create an account on first sign-in** a doména je povolená.

E-mail sa považuje za overený iba vtedy, keď ID token obsahuje `email_verified: true`. Ak je tento claim `false` alebo chýba, prihlásenie sa odmietne. Nárokovanie existujúceho účtu — alebo vytvorenie nového — na základe adresy, za ktorú poskytovateľ neručí, je cestou k prevzatiu účtu, a preto to Heym nerobí. Poskytovateľa, ktorý nikdy nevysiela `email_verified`, je potrebné nakonfigurovať tak, aby tak robil.

Takto vytvorené účty nemajú heslo. Prihlasujú sa výhradne prostredníctvom poskytovateľa.
## Zakázanie prihlásenia heslom

Prepínač **Zakázať prihlásenie heslom** zostáva nedostupný, kým nie sú splnené tri podmienky:

1. SSO je povolené.
2. Test pripojenia prešiel, aby nesprávny issuer nemohol zamknúť dvere za sebou.
3. Aspoň jeden účet v `HEYM_ADMIN_EMAILS` má skutočne heslo.

Keď je zapnutý, autentifikácia heslom je odmietnutá na všetkých troch miestach, ktoré heslo vytvárajú alebo prijímajú: prihlasovací formulár, **registrácia** a stránka súhlasu MCP OAuth. Registrácia sa počíta, pretože vydáva heslo; ak by zostala otvorená, nastavenie by mohol obísť ktokoľvek, kto sa dostane na `/register`.

Účty uvedené v `HEYM_ADMIN_EMAILS` sú oslobodené od všetkých troch. Ktokoľvek, kto môže upravovať konfiguračný súbor prostredia, už dokáže inštanciu obnoviť, takže táto záruka žije v kóde a nie v pamäti operátora.

### Prečo existuje tretia podmienka

Administrátor, ktorého účet Heym bol vytvorený *prostredníctvom* SSO, nemá žiadne heslo. Výnimka by mu umožnila prejsť bránou, ale nemá sa čím prihlásiť — takže inštancia by nemala cestu späť, ak by poskytovateľ vypadol. Heym odmieta vstúpiť do tohto stavu a dáva to najavo.

Ak narazíte na túto správu, prihláste sa prostredníctvom SSO a zaregistrujte účet s heslom na jednej zo svojich administrátorských adries (registrácia je stále otvorená pre administrátorské adresy práve z tohto dôvodu), alebo pridajte adresu, ktorá už má heslo, do `HEYM_ADMIN_EMAILS`.

### Obnova, keď je poskytovateľ nedostupný

V poradí podľa preferencie:

1. **Prihláste sa pomocou núdzového administrátorského hesla.** Prihlasovacia obrazovka skrýva formulár pre heslo, keď je prihlásenie heslom vypnuté, takže kliknutím na **Sign in with a password instead** pod tlačidlom SSO ho zobrazíte. Formulár nie je obchádzka: každá adresa mimo `HEYM_ADMIN_EMAILS` je stále odmietnutá a je jej povedané prečo.
2. **Pridajte sa do `HEYM_ADMIN_EMAILS`** v konfiguračnom súbore prostredia a reštartujte backend. Účet, ktorý už má heslo, sa potom môže prihlásiť.
3. **Znovu otvorte prihlásenie heslom priamo v databáze**, ak žiadny administrátor nemá heslo:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Reštart nie je potrebný; nastavenie sa číta pri každej požiadavke.

Koncoví používatelia portálu nie sú ovplyvnení. Autentifikujú sa voči samostatnému adresáru — pozrite si [Portal](./portal.md).

## Chyby prihlásenia

Neúspešné prihlásenie sa vráti na prihlasovaciu obrazovku s čitateľnou správou. Heym nikdy nezobrazuje surový text chyby poskytovateľa.

| Správa | Príčina |
|---------|-------|
| That sign-in attempt expired | Pokus trval dlhšie ako desať minút alebo prehliadač zahodil transakčný cookie. Skúste to znova. |
| Could not reach the identity provider | Discovery alebo výmena tokenu zlyhala. Skontrolujte URL issuera a to, či je poskytovateľ dostupný z backendu. |
| The provider's response could not be verified | ID token zlyhal pri overení podpisu, audience, issuera, platnosti alebo nonce. Zvyčajne nesúlad client ID. |
| The provider did not return an email address | Chýba scope `email` alebo poskytovateľ neuvoľňuje tento claim. |
| Your email address is not verified | Poskytovateľ poslal `email_verified: false` alebo claim vynechal. |
| Your email domain is not allowed | Adresa je mimo **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** je vypnuté a žiadny účet nezodpovedá. Administrátor musí nejaký vytvoriť. |
| Single sign-on is not configured | SSO je zakázané alebo chýba issuer, client ID alebo secret. |

## Bezpečnostné poznámky

- **Client secret je šifrovaný v pokoji** a nikdy ho nevracia žiadny endpoint. Formulár nastavení uvádza iba to, či je nejaký uložený.
- **PKCE verifier nikdy neopúšťa Heym.** Je držaný v krátkodobom `HttpOnly` cookie namiesto v parametri `state`, ktorý prechádza cez poskytovateľa v otvorenej podobe.
- **Akceptované sú iba asymetrické podpisy.** `none` a symetrické algoritmy sú odmietnuté bez ohľadu na to, čo poskytovateľ inzeruje.
- **Cieľ po prihlásení je overený** ako cesta v rámci rovnakého pôvodu, takže callback sa nedá použiť ako otvorený redirect.
- **Každé prihlásenie je auditované.** Úspechy, zlyhania a odmietnutia sa zobrazujú ako riadky `auth.sso_login` a zmeny konfigurácie ako `sso_settings.update` — pozrite si [Audit Logging](./audit.md).

## Čo nie je podporované

- **SAML.** OIDC je jediný protokol.
- **Viacerí súčasní poskytovatelia.** Jedna inštancia sa pripája k jednému poskytovateľovi.
- **Mapovanie skupín alebo rolí** z claimov poskytovateľa.
- **Single logout.** Odhlásenie z Heym vás neodhlási z poskytovateľa.
