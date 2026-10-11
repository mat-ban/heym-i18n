# Portál

**Portál** sprístupňuje workflowy Heym ako verejné chatové rozhrania. Koncoví používatelia môžu spúšťať workflowy prostredníctvom URL bez prihlásenia do Heym.

## Čo robí

- **Verejná URL**: `/chat/{slug}` (napr. `/chat/my-workflow`)
- **Chatové rozhranie**: Používatelia komunikujú prostredníctvom chatového UI (správy, vstupy, odpovede)
- **Voliteľná autentifikácia**: Ak sú nakonfigurovaní používatelia portálu, vyžaduje sa prihlásenie; v opačnom prípade je portál verejný
- **Streamovanie**: Priebeh uzlov v reálnom čase počas spustenia (ak je povolené)
- **Zastavenie bežiacich spustení**: Používatelia môžu zastaviť prebiehajúce spustenie portálu z päty chatu; aktívne spustenie workflowu sa zruší aj na strane servera
- **Nahrávanie súborov**: Voliteľné nahrávanie súborov (text, obrázky atď.) pre každé vstupné pole
- **Odovzdanie na ľudskú kontrolu**: Spustenia portálu môžu zobraziť [odkazy na HITL kontrolu](./human-in-the-loop.md), keď agent pozastaví činnosť a čaká na schválenie
- **Zobrazenie obrázkov**: Výstupy workflowu obsahujúce obrázky (napr. z generovania obrázkov LLM alebo snímok Playwright) sa zobrazujú ako miniatúry v chate. Kliknutím na ľubovoľný obrázok otvoríte zobrazenie na celú obrazovku; zatvorte ho stlačením **Esc** alebo použitím tlačidla späť na zariadení

## Konfigurácia workflowu

| Nastavenie | Popis |
|---------|-------------|
| `portal_enabled` | Povoliť portál pre tento workflow |
| `portal_slug` | URL slug (napr. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Použiť streamované spustenie |
| `portal_file_upload_enabled` | Povoliť nahrávanie súborov |
| `portal_file_config` | Konfigurácia súborov pre jednotlivé polia (typy, limity) |

Konfigurácia v editore: Tlačidlo **Portal** v hlavičke workflowu otvorí dialóg nastavení portálu.

## Tok

1. **Info**: `GET /api/portal/{slug}/info` – Vráti metadata workflowu a vstupné polia (bez autentifikácie)
2. **Prihlásenie** (ak sa vyžaduje): `POST /api/portal/{slug}/login` – Vráti session token
3. **Spustenie**: `POST /api/portal/{slug}/execute` – Toto volá chatové UI portálu (alebo interne jeho streamovanú variantu, ak je povolená); koncoví používatelia komunikujú prostredníctvom chatového rozhrania, nie priamym volaním API.
4. **Zastavenie**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Vyžiadané, keď používateľ počas aktívneho spustenia portálu stlačí **Stop**

## HITL v spusteniach portálu

Ak workflow portálu dosiahne [uzol Agent](../nodes/agent-node.md) s povoleným [Human-in-the-Loop](./human-in-the-loop.md), odpoveď portálu zobrazí odkaz na kontrolu namiesto prázdneho zobrazenia.

- Stav spustenia workflowu sa zmení na `pending`
- Chat portálu zobrazí URL na kontrolu
- Všetky uzly pripojené k výstupnému portu `review` agenta môžu okamžite upozorniť Slack, e-mail alebo iné kanály
- Kontrolór dokončí rozhodnutie na `/review/{token}` bez prihlásenia
- Po kontrole sa workflow obnoví z uloženého snapshotu

To umožňuje kombinovať verejné chatové toky so súkromnými krokmi ľudského schválenia.

## Vstupné polia

Vstupné polia pochádzajú z uzlov [Input](../nodes/input-node.md). API extrahuje počiatočné uzly typu `textInput` a ich `inputFields`. Spustenie používa rovnaký engine ako bežné spustenia; vstupy sa odovzdávajú ako `body.inputs` a `conversation_history` pre toky s viacerými kolami.

## Autentifikácia a sessions

- **WorkflowPortalUser**: Používateľské meno/heslo pre jednotlivé workflowy (ak je povolená autentifikácia)
- **PortalSession**: Session tokeny s TTL 168 hodín
- **Obmedzenie rýchlosti**: 3 neúspešné pokusy o prihlásenie → 24-hodinový zákaz pre daný workflow+IP
- Expirované sessions sa čistia pomocou cron jobu

## Konfiguračné UI

Karty **WebPortalSettingsDialog**:

1. **General**: Povoliť portál, nastaviť slug, skopírovať URL portálu
2. **Users**: Pridať/odstrániť používateľov portálu (používateľské meno/heslo)
3. **Options**: Režim streamovania, nahrávanie súborov, zobrazenie vstupných polí

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – Portál ako chatové rozhranie pre agentov v produkcii
- [Karta Workflows](../tabs/workflows-tab.md) – Vytváranie workflowov a povolenie portálu
- [Human-in-the-Loop](./human-in-the-loop.md) – Verejné stránky na kontrolu pre čakajúce výstupy agentov
- [Triggers](./triggers.md) – Portál ako vstupný bod
- [Typy uzlov](./node-types.md) – [Input](../nodes/input-node.md) pre vstupy portálu
- [Štruktúra workflowu](./workflow-structure.md) – Uzly a hrany
