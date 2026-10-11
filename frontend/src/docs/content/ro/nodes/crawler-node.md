# Crawler

Nodul **Crawler** extrage conținut de pe pagini web folosind FlareSolverr, cu extragere HTML opțională prin selectori CSS. Utilizați-l pentru web scraping și extragerea conținutului.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.body` (HTML sau conținut extras) |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare FlareSolverr din [Acreditări](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL-ul de extras (acceptă expresii) |
| `crawlerWaitSeconds` | number | Secunde de așteptare înainte de extragere (implicit: 0) |
| `crawlerMaxTimeout` | number | Timeout maxim în ms (implicit: 60000) |
| `crawlerMode` | string | `"basic"` sau alte moduri |
| `crawlerSelectors` | array | Selectori CSS pentru extragere. Fiecare: `{ selector, attribute? }` |

## Exemplu

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Siguranța ieșirii

- URL-ul FlareSolverr stocat în acreditare trebuie să utilizeze `http://` sau `https://` și nu poate rezolva către o adresă link-local sau de metadate cloud. Setul refuzat este `169.254.0.0/16`, `fe80::/10`, adresele de metadate IPv6 Alibaba Cloud și AWS, precum și formele de tranziție IPv6 care pot transporta una dintre acestea. Este o listă de endpoint-uri cunoscute, nu o garanție pentru fiecare furnizor.
- Adresele loopback și private sunt permise în mod intenționat, astfel încât configurarea documentată `http://localhost:8191` și numele de servicii compose precum `http://flaresolverr:8191` să funcționeze în continuare. Consecința este că acest câmp poate fi direcționat și către orice alt serviciu accesibil de backend la acele adrese, iar răspunsul este returnat în ieșirea nodului. Partajarea acreditărilor nu limitează acest lucru: orice utilizator autentificat își poate crea propria acreditare FlareSolverr, astfel încât reținerea uneia existente nu schimbă nimic. Controalele care se aplică sunt încrederea în persoanele care pot autoriza workflow-uri și regulile de rețea care limitează la ce poate ajunge backend-ul.
- Heym fixează adresa rezolvată înainte de conectare, astfel încât un răspuns DNS nu poate muta cererea către o adresă de metadate după verificare. Proxy-urile de mediu sunt dezactivate cât timp garda este activă, iar redirectările nu sunt urmărite.
- Pagina pe care FlareSolverr o extrage apoi pentru dvs. este un hop separat pe care FlareSolverr îl rezolvă singur. Heym nu îl inspectează, astfel încât restricționarea locurilor la care se poate conecta containerul FlareSolverr ține de politica dvs. de rețea.
- Implementările self-hosted de încredere pot ridica regula de metadate cu `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Păstrați valoarea implicită în implementările găzduite sau multi-tenant.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Playwright](./playwright-node.md) – Alternativă de automatizare a browserului
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați o acreditare FlareSolverr
