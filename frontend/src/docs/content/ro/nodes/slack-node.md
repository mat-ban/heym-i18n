# Slack

Nodul **Slack** trimite un mesaj către un canal Slack printr-un Webhook de intrare. Utilizați-l pentru notificări, alerte și raportarea erorilor.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | Transmite intrarea mai departe |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare Slack (URL webhook) din [Acreditări](../tabs/credentials-tab.md) |
| `message` | expression | Textul mesajului. Suportă [expresii](../reference/expression-dsl.md). |

## Configurare

1. Creați un Webhook de intrare în spațiul de lucru Slack
2. Adăugați o acreditare Slack în fila Acreditări cu URL-ul webhook
3. Referiți acreditarea în nod

## Exemplu

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Utilizați împreună cu [Error Handler](./error-handler-node.md) pentru notificări de eșec:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Siguranța ieșirii

- URL-ul webhook stocat în acreditare trebuie să utilizeze `http://` sau `https://` și să se rezolve doar către adrese publice. Destinațiile de tip loopback, private, link-local, multicast și cloud-metadata sunt blocate.
- Heym validează adresele rezolvate și fixează ținta conexiunii înainte de trimitere, astfel încât un răspuns DNS să nu poată muta cererea către o adresă internă după verificare. Proxy-urile de mediu sunt dezactivate cât timp protecția este activă, iar redirecționările nu sunt urmărite.
- Implementările care trimit către un receptor webhook intern pot seta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` pe o instanță self-hosted de încredere. Păstrați valoarea implicită pe implementările găzduite sau multi-tenant.

**Notă de actualizare pentru v0.0.109:** această verificare este nouă pentru Slack. O acreditare al cărei URL webhook indică spre loopback sau o adresă privată este refuzată dacă setarea de mai sus nu este activată.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Error Handler](./error-handler-node.md) – Trimite Slack la eșecul workflow-ului
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați webhook Slack
