# Vahekaart Muutujad

Vahekaart **Muutujad** haldab **Globaalset muutujate hoidlat** – püsivaid võti-väärtus andmeid, mida jagatakse kõigi teie workflow'de vahel.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Vaadake muutujate demo</a></p>

## Ülevaade

- Looge, muutke ja kustutage globaalseid muutujaid
- Muutujad on kasutajapõhised ja püsivad üle workflow'de käivituste
- Viidake avaldistes kujul `$global.variableName`

## Muutuja loomine

1. Klõpsake **Uus muutuja**
2. Sisestage **nimi** (kasutatakse avaldistes)
3. Määrake **väärtus** (string, number, boolean, array või object)
4. Valige **väärtuse tüüp** (Auto, String, Number, Boolean, Array, Object)

## Muutmine ja kustutamine

- **Muutmine** – Klõpsake muutuja real oleval muutmise ikoonil
- **Kustutamine** – Klõpsake prügikasti ikoonil; seda kasutavad workflow'd vajavad asendust
- **Hulgikustutamine** – Valige mitu muutujat ja kasutage **Kustuta valitud**

## Kasutamine workflow'des

Viidake muutujatele mis tahes avaldises:

```
$global.environment
$global.settings.baseUrl
```

Globaalseid muutujaid saab määrata ka [Muutuja node'ist](../nodes/variable-node.md), lubades **Salvesta globaalsesse muutujate hoidlasse**.

## Seotud

- [Globaalsed muutujad](../reference/global-variables.md) – Viitejuhend
- [Muutuja node](../nodes/variable-node.md) – Määrake muutujaid `isGlobal` abil
- [Avaldise DSL](../reference/expression-dsl.md) – `$global` süntaks
- [Chati vahekaart](./chat-tab.md) – Chat pääseb ligi globaalsetele muutujatele
- [Kontekstipõhine showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend armatuurlaua vaadetele
