# Discord

**Discord** mezgls nosūta ziņojumu uz Discord kanālu, izmantojot Incoming Webhook. Izmantojiet to brīdinājumiem, workflow paziņojumiem, botam līdzīgām atbildēm un kļūdu ziņošanai.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | `discord` akreditācijas dati, kas satur incoming webhook URL |
| `message` | expression | Izejošā ziņojuma teksts. Atbalsta [expressions](../reference/expression-dsl.md). |
| `username` | expression | Neobligāta attēlojamā vārda aizstāšana šim ziņojumam |
| `avatarUrl` | expression | Neobligāta avatara URL aizstāšana šim ziņojumam |

## Iestatīšana

1. Izveidojiet [Discord Webhook akreditācijas datus](../reference/integrations.md#discord)
2. Pievienojiet **Discord** mezglu savam workflow
3. Izvēlieties akreditācijas datus
4. Iestatiet `message` uz izejošo tekstu vai veidni, kas veidota no iepriekšējo mezglu datiem
5. Ja nepieciešams, aizstājiet attēlojamo `username` un `avatarUrl`

## Piemērs

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

## Izvades lauki

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.status` | Discord atgrieztais HTTP statusa kods, parasti `204` veiksmes gadījumā |
| `$nodeLabel.response` | Discord webhook atgrieztais neapstrādātais atbildes pamatteksts |
| `$nodeLabel.message` | Ziņojuma teksts, ko Heym nosūtīja |
| `$nodeLabel.username` | Ar webhook nosūtītais lietotājvārds, ja norādīts |
| `$nodeLabel.avatar_url` | Ar webhook nosūtītais avatara URL, ja norādīts |

## Biežāk izmantotie modeļi

- Izmantojiet to kopā ar [Discord Trigger](./discord-trigger-node.md), ja vēlaties papildu ziņojumu kanālā papildus mijiedarbības atbildei
- Sūtiet kļūdu paziņojumus no [Error Handler](./error-handler-node.md)
- Publicējiet kopsavilkumus, ko ģenerē [LLM](./llm-node.md) vai [Agent](./agent-node.md)

## Izejošās plūsmas drošība

- Akreditācijas datos saglabātajam webhook URL ir jāizmanto `http://` vai `https://` un jāatrisina tikai uz publiskām adresēm. Loopback, privātās, link-local, multicast un cloud-metadata galamērķi ir bloķēti.
- Heym validē atrisinātās adreses un pirms nosūtīšanas piesprauž savienojuma mērķi, tāpēc DNS atbilde nevar pārvietot pieprasījumu uz iekšēju adresi pēc pārbaudes. Vides starpniekserveri tiek atspējoti, kamēr aizsargs ir aktīvs, un pāradresācijas netiek sekotas.
- Izvietojumi, kas publicē uz iekšēju webhook uztvērēju, var iestatīt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` uz uzticamas self-hosted instances. Saglabājiet noklusējuma iestatījumu hostētos vai multi-tenant izvietojumos.

**Jaunināšanas piezīme v0.0.109:** šī pārbaude ir jauna Discord mezglam. Akreditācijas dati, kuru webhook URL norāda uz loopback vai privātu adresi, tiek noraidīti, ja vien iepriekš minētais iestatījums nav iespējots.

## Saistītie

- [Discord Trigger](./discord-trigger-node.md) – Sākt workflow no ienākošajām Discord mijiedarbībām
- [Third-Party Integrations](../reference/integrations.md) – Discord akreditācijas datu iestatīšana
- [Credentials Tab](../tabs/credentials-tab.md) – Pievienot un pārvaldīt `discord` akreditācijas datus
- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
