# Discord Trigger

Węzeł **Discord Trigger** jest punktem wejściowym bez danych wejściowych, który odbiera webhooki Discord Interactions API i automatycznie uruchamia workflow. Należy go używać w przypadku slash commands, przycisków, modali oraz innych interakcji aplikacji Discord, które mają być przekazywane do dalszych węzłów AI lub integracyjnych.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania `discord_trigger` zawierające klucz publiczny aplikacji Discord |

## Przewodnik konfiguracji

### 1. Utwórz dane logowania `discord_trigger`

1. Przejdź do **Settings → Credentials → New Credential**
2. Wybierz typ **Discord Trigger (Public Key)**
3. Wklej **Application Public Key** z Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Zapisz dane logowania

### 2. Dodaj węzeł do workflow

1. Przeciągnij **Discord Trigger** na canvas
2. Wybierz węzeł, aby otworzyć panel Properties
3. Wybierz swoje dane logowania `discord_trigger`
4. Skopiuj **Interactions URL** wyświetlany w panelu węzła

### 3. Zarejestruj endpoint Interactions w Discord

1. Otwórz [Discord Developer Portal](https://discord.com/developers/applications)
2. Wybierz swoją aplikację
3. Przejdź do **General Information** lub **Interactions**
4. Wklej **Interactions Endpoint URL** węzła w polu endpoint
5. Discord wysyła żądanie `PING` w celu walidacji endpointu, a Heym odpowiada automatycznie po zweryfikowaniu sygnatury
6. Zapisz zmiany

## Pola wyjściowe

Po uruchomieniu węzła dalsze węzły mogą uzyskać dostęp do:

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.interaction` | Pełny payload interakcji Discord |
| `$nodeLabel.type` | Typ interakcji |
| `$nodeLabel.data` | Payload komendy, przycisku lub modala |
| `$nodeLabel.data.name` | Nazwa slash command, jeśli dotyczy |
| `$nodeLabel.data.options` | Tablica opcji slash command |
| `$nodeLabel.headers` | Oczyszczone nagłówki webhooka |
| `$nodeLabel.triggered_by` | Etykieta źródła triggera (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID węzła na canvas, który odebrał interakcję Discord |
| `$nodeLabel.triggered_at` | Znacznik czasu ISO dla tego wykonania workflow |

## Przykładowy workflow

**Discord slash command → LLM → Output**

```
discordTrigger → llm → output
```

- Etykieta **Discord Trigger**: `discordEvent`
- Wiadomość użytkownika **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Wiadomość **Output**: `$llm.text`

## Bezpieczeństwo

- Żądania są weryfikowane przy użyciu **Ed25519** z kluczem publicznym aplikacji
- Znaczniki czasu starsze niż **5 minut** są odrzucane w celu ograniczenia ataków replay
- Wrażliwe nagłówki (`x-signature-ed25519`, `authorization` itp.) są usuwane, zanim dane dotrą do dalszych węzłów
- Trigger wymaga prawidłowych danych logowania `discord_trigger`; żądania są odrzucane, jeśli dane logowania są brakujące lub nieprawidłowe

## Uwagi

- Heym natychmiast zwraca odroczoną odpowiedź Discord, uruchamia workflow w tle i publikuje końcowe wyjście workflow jako follow-up Discord, gdy węzeł `Output` wygeneruje treść
- Interactions URL jest wyprowadzany z ID węzła i pozostaje stabilny nawet po zmianie nazwy workflow
- Używaj zwykłego [Discord Node](./discord-node.md) tylko wtedy, gdy oprócz follow-up interakcji potrzebny jest również osobny webhook post
- Jeden węzeł `discordTrigger` jest zazwyczaj wystarczający; użyj **Switch** lub **Condition** w dalszej części workflow, aby rozdzielić różne typy interakcji

## Powiązane

- [Discord Node](./discord-node.md) – Wysyłanie wychodzących wiadomości Discord
- [Triggers](../reference/triggers.md) – Przegląd wszystkich punktów wejściowych workflow
- [Third-Party Integrations](../reference/integrations.md) – Konfiguracja danych logowania Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie i zarządzanie danymi logowania `discord_trigger`
