# Playwright

O nó **Playwright** automatiza interações com o navegador por meio de etapas configuráveis. Utilize-o para web scraping, preenchimento de formulários e workflows baseados em navegador.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.results`, `$nodeLabel.screenshot` e dados opcionais de rede/navegador |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `playwrightMode` | string | `"steps"` (padrão) ou `"code"` (Run Code). Escolha no dropdown Mode do Painel de Propriedades |
| `playwrightSteps` | array | Etapas: navigate, click, type, aiStep, etc. Cada etapa possui action e selector/params. `disabled: true` mantém a etapa na lista, mas a ignora em tempo de execução |
| `playwrightCode` | string | Playwright Python personalizado usado quando o Mode é Run Code. Executa no sandbox reforçado e está **desabilitado por padrão** — consulte a observação de segurança abaixo |
| `playwrightHeadless` | boolean | Executar em modo headless (padrão: true) |
| `playwrightStealth` | boolean | Configuração opt-in do modo Steps que reduz sinais comuns de automação do Playwright (padrão: false). Rótulo no Painel de Propriedades: Reduce automation flags |
| `playwrightTimeout` | number | Timeout em ms (padrão: 30000) |
| `playwrightCaptureNetwork` | boolean | Captura respostas JSON, headers, cookies e armazenamento do navegador |
| `playwrightAuthEnabled` | boolean | Restaura a autenticação do navegador a partir de cookies/storageState antes de executar as etapas |
| `playwrightAuthStateExpression` | string | Expressão ou JSON que resolve para o `storageState` do Playwright ou `cookies[]` brutos |
| `playwrightAuthCheckSelector` | string | Selector que deve estar visível após o bootstrap de autenticação |
| `playwrightAuthCheckTimeout` | number | Timeout em ms para a verificação do selector autenticado (padrão: 5000) |
| `playwrightAuthFallbackSteps` | array | Etapas de fallback somente de login a serem executadas quando a restauração de cookies não autentica a página |

## Tipos de Etapa

- **navigate** – Ir para a URL
- **refresh** – Recarregar a página atual (`timeout` opcional da etapa em ms para a navegação de recarga)
- **click** – Clicar no elemento pelo selector
- **type** – Digitar texto em um input (caractere por caractere)
- **fill** – Preencher o valor do input
- **wait** – Aguardar um timeout (ms)
- **screenshot** – Capturar screenshot (`outputKey` armazena base64 em results)
- **getText** – Conteúdo de texto de um elemento (`selector`, `outputKey` opcional)
- **getAttribute** – Valor do atributo (`selector`, `attribute`, `outputKey` opcional)
- **getHTML** – HTML externo de um elemento (`selector`, `outputKey` opcional)
- **getVisibleTextOnPage** – Texto visível da página inteira como `document.body.innerText` (sem selector; use `outputKey`; `timeout` opcional da etapa em ms aguarda antes da captura)
- **hover** – Passar o mouse sobre o elemento
- **selectOption** – Selecionar opção em um `<select>`
- **scrollDown** / **scrollUp** – Rolagem com a roda do mouse (`amount` opcional em pixels)
- **aiStep** – O LLM retorna os mesmos tipos de ações que as etapas manuais (veja abaixo); `aiStep` aninhado não é suportado

## Desativando uma Etapa

Cada etapa possui um botão de liga/desliga em seu cabeçalho. Uma etapa desativada exibe seu título riscado e esmaecido, permanece na lista com todos os seus campos e é ignorada quando o nó é executado — útil para isolar um selector com falha sem excluir o trabalho. A etapa armazenada carrega `disabled: true`; etapas sem esse flag são executadas normalmente.

Etapas desativadas são invisíveis para o restante do nó: elas não satisfazem a regra "a primeira etapa deve ser `navigate`" do bootstrap de autenticação, um `aiStep` desativado não faz chamada ao LLM, e entradas desativadas em `playwrightAuthFallbackSteps` também são ignoradas. Desativar todas as etapas faz a execução falhar com uma mensagem solicitando que você habilite uma.

## Etapa de IA

A ação **aiStep** usa um LLM para analisar o HTML da página (e, opcionalmente, um screenshot) e gerar ações do Playwright a partir de instruções em linguagem natural. A API aceita os mesmos nomes de ação das etapas manuais (incluindo `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, rolagens, etc.). O **Auto heal** substitui apenas etapas com falha baseadas em selector por alternativas para click, type, fill, hover e selectOption.

| Opção | Descrição |
|--------|-------------|
| `instructions` | O que a IA deve fazer (ex.: "Click the Login button") |
| `credentialId` | Credencial do LLM (OpenAI, Google ou Custom) |
| `model` | Lista pesquisável de modelos da credencial de LLM selecionada |
| `saveStepsForFuture` | Armazena em cache as etapas geradas para execuções futuras (evita chamada ao LLM) |
| `sendScreenshot` | Envia screenshot ao LLM para elementos visuais |
| `aiStepTimeout` | Timeout para a chamada ao LLM em ms (padrão 30000) |

### AI Auto Heal

O **AI Auto Heal** torna os workflows resilientes a mudanças no DOM. Quando um selector falha duas vezes (por exemplo, após um redesign do site), o Heym chama o LLM para encontrar um localizador alternativo — tipicamente `role=button[name='Submit']` ou `text=Exact text` em vez de selectors CSS.

Habilite o **Auto heal mode** nas propriedades da etapa de IA. Se a etapa salva falhar:

1. O Heym captura o HTML atual e o screenshot
2. Envia a etapa com falha + o contexto da página ao LLM
3. O LLM retorna uma alternativa robusta (localizador baseado em role, localizador por texto ou CSS de fallback)
4. Tenta novamente com o novo selector

Isso reduz a instabilidade quando os sites atualizam sua marcação ou nomes de classe.
## Reduzir sinalizadores de automação

Habilite **Reduzir sinalizadores de automação** (`playwrightStealth: true`) quando um site tratar o Chromium empacotado do Playwright como um bot por causa de sinais padrão de automação (`HeadlessChrome` no user agent, `navigator.webdriver`, ausência de `window.chrome`).

Esta opção se aplica apenas no modo **Steps**. Ela:

- Remove o sinalizador `--enable-automation` do Chromium e define `--disable-blink-features=AutomationControlled`
- Envia um user agent padrão do Chrome (sem `HeadlessChrome`)
- Restaura superfícies comuns do navegador que o Playwright deixa vazias (`window.chrome`, plugins)
- Mantém o renderizador de GPU do host inalterado quando há uma GPU disponível (macOS/Windows local). Linux/Docker não possui GPU; a string do renderizador de software do Chromium é reportada como uma GPU típica Mali (ARM) ou Mesa (x86) em vez de SwiftShader.

Ela não oculta que a sessão é conduzida via Chrome DevTools Protocol, e não é uma forma de contornar a segurança do site, CAPTCHAs ou controles de acesso. Use-a para workflows que você está autorizado a executar — ferramentas internas, seus próprios sites e automação de navegador permitida.

O modo Run Code permanece inalterado — scripts personalizados iniciam o Chromium por conta própria.

## Captura de rede

Habilite `playwrightCaptureNetwork` para coletar dados adicionais de depuração durante a execução:

- `networkRequests` – Respostas JSON/API capturadas
- `cookies` – Cookies do navegador ao final da execução
- `localStorage` – Pares chave-valor do `localStorage` do navegador
- `sessionStorage` – Pares chave-valor do `sessionStorage` do navegador

Isso é útil quando você precisa inspecionar chamadas de API ocultas, estado de autenticação ou dados do lado do navegador após um fluxo automatizado.

## Bootstrap de cookies e fallback de login

Habilite `playwrightAuthEnabled` quando você quiser que o Playwright abra uma página já autenticada.

### Origem do estado de autenticação

Defina `playwrightAuthStateExpression` com uma expressão como `$global.authState`. O valor pode ser:

- Um objeto `storageState` do Playwright: `{"cookies": [...], "origins": [...]}`
- Um array bruto de `cookies[]`
- Uma string JSON contendo qualquer um dos formatos

Padrão recomendado:

1. Execute um nó Playwright com captura de rede ou bootstrap de autenticação habilitado
2. Armazene `$playwrightNode.cookies` ou um objeto completo de estado de autenticação em uma [Variável Global](../reference/global-variables.md)
3. Reutilize essa variável em nós Playwright posteriores via `$global.authState`

### Verificação de autenticação

O primeiro passo principal do Playwright deve ser `navigate`. Após esse passo carregar, o Heym verifica `playwrightAuthCheckSelector`.

- Se o seletor estiver visível, os passos principais restantes continuam normalmente
- Se o seletor estiver ausente, o Heym executa `playwrightAuthFallbackSteps`
- Após a conclusão dos passos de fallback, o Heym verifica o mesmo seletor novamente
- Se o seletor ainda estiver ausente, o nó falha com um erro de bootstrap de autenticação

Os passos de fallback são responsáveis pela navegação após a falha de autenticação. Eles devem deixar o navegador na página autenticada esperada pelo restante do fluxo principal.

## Campos de saída

- `$playwrightNode.status` – `"ok"` em caso de sucesso
- `$playwrightNode.results` – Saídas dos passos (getText, getHTML, getVisibleTextOnPage, getAttribute, chaves de screenshot, etc.)
- `$playwrightNode.screenshot` – Screenshot em Base64 quando um passo salva um
- `$playwrightNode.cookies` – Cookies finais do navegador quando o bootstrap de autenticação ou a captura de rede está habilitado
- `$playwrightNode.networkRequests` – Respostas de rede capturadas (quando habilitado)
- `$playwrightNode.localStorage` – Armazenamento local do navegador (quando habilitado)
- `$playwrightNode.sessionStorage` – Armazenamento de sessão do navegador (quando habilitado)

## Exemplo

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Modo Run Code

No Painel de Propriedades, defina **Mode** como **Run Code** para editar `playwrightCode` em vez de passos visuais. O bootstrap de autenticação se aplica apenas ao modo Steps.

Exemplo (sandbox / Docker — o Chromium precisa de `--no-sandbox`):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

O wrapper fornece `inputs`, `headless`, `timeout_ms` e `capture_network`. Você pode incorporar expressões `$nodeLabel.field` no código; imprima JSON com `status` e `results`.
## Segurança de código personalizado

O campo `playwrightCode` executa Python arbitrário. Como isso equivale à execução de código, ele está **desabilitado por padrão** e, quando habilitado, é executado em sandbox:

- **Desabilitado por padrão.** A execução de um nó que tenha `playwrightCode` definido falha com um erro claro, a menos que um operador defina `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. A verificação é executada no momento da execução, portanto também abrange workflows previamente salvos e execuções agendadas / de sub-workflow.
- **Isolado quando habilitado.** O código personalizado não é executado no processo do backend. Ele é executado em um contêiner irmão descartável e reforçado, sem socket do Docker, sem bind mounts do backend, sem segredos do backend em seu ambiente, com capabilities removidas, `no-new-privileges` e limites de CPU / memória / PID. Se o Docker estiver indisponível, a execução falha de forma segura (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` opta por voltar ao caminho em processo, apenas para uso confiável ou de desenvolvimento local (não é uma fronteira de segurança). O `./run.sh` nativo usa `subprocess` por padrão quando nenhum `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` está definido. O `./deploy.sh` (Compose) e a imagem única do GHCR resolvem o runner irmão por meio de `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (com fallback para `HEYM_CODEX_DOCKER_IMAGE`) e usam o caminho de venv correspondente (`/app/.venv` vs `/app/backend/.venv`).
- **Observação sobre o Chromium.** O contêiner de sandbox é executado como root por padrão, e o Chromium se recusa a ser executado como root sem `--no-sandbox`. O código personalizado que inicia o Chromium deve passar essa flag, por exemplo `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. As inicializações baseadas em etapas (e stealth) também passam `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` para que scripts de fingerprint não possam abrir STUN UDP para `stun.l.google.com:19302`. Chamadas personalizadas de `chromium.launch` também devem incluir essa flag.

Os nós Playwright baseados em etapas (`playwrightSteps`) são totalmente gerados pelo Heym (sem código arbitrário), não são afetados por nada do que foi descrito acima e estão sempre disponíveis — prefira-os.

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Crawler](./crawler-node.md) – Web scraping mais simples com FlareSolverr
- [Compartilhamento de credenciais](../reference/credentials-sharing.md) – Credenciais de LLM para etapas de IA
