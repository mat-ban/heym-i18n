# Discord

Nodul **Discord** trimite un mesaj către un canal Discord printr-un Incoming Webhook. Utilizați-l pentru alerte, notificări de workflow, răspunsuri de tip bot și raportarea erorilor.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditarea `discord` care conține URL-ul incoming webhook |
| `message` | expression | Textul mesajului de ieșire. Acceptă [expresii](../reference/expression-dsl.md). |
| `username` | expression | Suprascriere opțională a numelui afișat pentru acest mesaj |
| `avatarUrl` | expression | Suprascriere opțională a URL-ului avatarului pentru acest mesaj |

## Configurare

1. Creați o [acreditare Discord Webhook](../reference/integrations.md#discord)
2. Adăugați nodul **Discord** în workflow-ul dvs.
3. Selectați acreditarea
4. Setați `message` la textul de ieșire sau la un șablon construit din datele upstream
5. Opțional, suprascrieți `username` și `avatarUrl` afișate

## Exemplu

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Câmpuri de ieșire

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.status` | Codul de stare HTTP returnat de Discord, de obicei `204` la succes |
| `$nodeLabel.response` | Corpul răspunsului brut returnat de webhook-ul Discord |
| `$nodeLabel.message` | Textul mesajului pe care l-a trimis Heym |
| `$nodeLabel.username` | Numele de utilizator trimis cu webhook-ul, dacă este furnizat |
| `$nodeLabel.avatar_url` | URL-ul avatarului trimis cu webhook-ul, dacă este furnizat |

## Modele comune

- Utilizați-l împreună cu [Discord Trigger](./discord-trigger-node.md) atunci când doriți o postare suplimentară pe canal dincolo de răspunsul la interacțiune
- Trimiteți notificări de eșec din [Error Handler](./error-handler-node.md)
- Postați rezumate generate de [LLM](./llm-node.md) sau [Agent](./agent-node.md)

## Siguranța ieșirii

- URL-ul webhook-ului stocat în acreditare trebuie să utilizeze `http://` sau `https://` și să se rezolve doar către adrese publice. Destinațiile de tip loopback, private, link-local, multicast și cloud-metadata sunt blocate.
- Heym validează adresele rezolvate și fixează ținta conexiunii înainte de trimitere, astfel încât un răspuns DNS să nu poată muta cererea către o adresă internă după verificare. Proxy-urile de mediu sunt dezactivate cât timp protecția este activă, iar redirecționările nu sunt urmărite.
- Implementările care postează către un receptor webhook intern pot seta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` pe o instanță self-hosted de încredere. Păstrați valoarea implicită pe implementările găzduite sau multi-tenant.

**Notă de upgrade pentru v0.0.109:** această verificare este nouă pentru Discord. O acreditare al cărei URL de webhook indică spre loopback sau o adresă privată este refuzată dacă setarea de mai sus nu este activată.

## Resurse conexe

- [Discord Trigger](./discord-trigger-node.md) – Porniți un workflow din interacțiuni Discord primite
- [Third-Party Integrations](../reference/integrations.md) – Configurarea acreditării Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Adăugați și gestionați acreditările `discord`
- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
