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
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (padrão) ou `"code"` (Run Code). Selecione no menu suspenso Mode do Painel de Propriedades |
| `playwrightSteps` | array | Etapas: navigate, click, type, aiStep, etc. Cada etapa possui action e selector/params. `disabled: true` mantém a etapa na lista, mas a ignora em tempo de execução |
| `playwrightCode` | string | Playwright Python personalizado usado quando o Mode é Run Code. É executado no sandbox reforçado e está **desabilitado por padrão** — consulte a nota de segurança abaixo |
| `playwrightHeadless` | boolean | Executar em modo headless (padrão: true) |
| `playwrightStealth` | boolean | Configuração opcional do modo Steps que reduz sinais comuns de automação do Playwright (padrão: false). Rótulo no Painel de Propriedades: Reduce automation flags |
| `playwrightTimeout` | number | Timeout em ms (padrão: 30000) |
| `playwrightCaptureNetwork` | boolean | Capturar respostas JSON, cabeçalhos, cookies e armazenamento do navegador |
| `playwrightAuthEnabled` | boolean | Restaurar autenticação do navegador a partir de cookies/storageState antes de executar as etapas |
| `playwrightAuthStateExpression` | string | Expressão ou JSON que resulta em `storageState` do Playwright ou `cookies[]` brutos |
| `playwrightAuthCheckSelector` | string | Selector que deve estar visível após o bootstrap de autenticação |
| `playwrightAuthCheckTimeout` | number | Timeout em ms para a verificação do selector autenticado (padrão: 5000) |
| `playwrightAuthFallbackSteps` | array | Etapas de fallback apenas para login, a serem executadas quando a restauração de cookies não autenticar a página |

## Tipos de etapa

- **navigate** – Ir para a URL
- **refresh** – Recarregar a página atual (`timeout` opcional da etapa em ms para a navegação de recarga)
- **click** – Clicar no elemento por selector
- **type** – Digitar texto no campo de entrada (caractere por caractere)
- **fill** – Preencher o valor do campo de entrada
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

## Desativando uma etapa

Cada etapa possui um botão de ativação/desativação em seu cabeçalho. Uma etapa desativada exibe seu título riscado e esmaecido, permanece na lista com todos os seus campos e é ignorada quando o nó é executado — útil para isolar um selector com falha sem excluir o trabalho. A etapa armazenada carrega `disabled: true`; etapas sem esse sinalizador são executadas normalmente.

Etapas desativadas são invisíveis para o restante do nó: elas não satisfazem a regra de que "a primeira etapa deve ser `navigate`" do bootstrap de autenticação, um `aiStep` desativado não realiza chamada ao LLM e entradas desativadas em `playwrightAuthFallbackSteps` também são ignoradas. Desativar todas as etapas faz a execução falhar com uma mensagem solicitando que você ative pelo menos uma.

## Etapa de IA

A ação **aiStep** utiliza um LLM para analisar o HTML da página (e, opcionalmente, um screenshot) e gerar ações do Playwright a partir de instruções em linguagem natural. A API aceita os mesmos nomes de ação das etapas manuais (incluindo `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, rolagens, etc.). O **Auto heal** substitui apenas etapas com falha baseadas em selector por alternativas para click, type, fill, hover e selectOption.

| Opção | Descrição |
|--------|-------------|
| `instructions` | O que a IA deve fazer (ex.: "Click the Login button") |
| `credentialId` | Credencial do LLM (OpenAI, Google ou Custom) |
| `model` | Lista pesquisável de modelos da credencial de LLM selecionada |
| `saveStepsForFuture` | Armazenar em cache as etapas geradas para execuções futuras (evita chamada ao LLM) |
| `sendScreenshot` | Enviar screenshot ao LLM para elementos visuais |
| `aiStepTimeout` | Timeout para a chamada ao LLM em ms (padrão: 30000) |
### AI Auto Heal

O **AI Auto Heal** torna os workflows resilientes a alterações no DOM. Quando um seletor falha duas vezes (por exemplo, após uma reformulação do site), o Heym recorre ao LLM para encontrar um localizador alternativo — tipicamente `role=button[name='Submit']` ou `text=Exact text` em vez de seletores CSS.

Ative o **Auto heal mode** nas propriedades do passo de IA. Se o passo guardado falhar:

1. O Heym captura o HTML atual e uma captura de ecrã
2. Envia o passo falhado + o contexto da página ao LLM
3. O LLM devolve uma alternativa robusta (localizador baseado em role, localizador por texto ou CSS de recurso)
4. Volta a tentar com o novo seletor

Isto reduz a instabilidade quando os sites atualizam a sua marcação ou nomes de classes.

## Reduce automation flags

Ative **Reduce automation flags** (`playwrightStealth: true`) quando um site trata o Chromium incluído no Playwright como um bot devido a sinais de automação padrão (`HeadlessChrome` no user agent, `navigator.webdriver`, ausência de `window.chrome`).

Esta opção aplica-se apenas no modo **Steps**. Ela:

- Remove o flag `--enable-automation` do Chromium e define `--disable-blink-features=AutomationControlled`
- Envia um user agent padrão do Chrome (sem `HeadlessChrome`)
- Restaura superfícies comuns do navegador que o Playwright deixa vazias (`window.chrome`, plugins)
- Mantém inalterado o renderer de GPU do host quando existe uma GPU disponível (macOS/Windows local). O Linux/Docker não tem GPU; a string do renderer de software do Chromium é reportada como uma GPU típica Mali (ARM) ou Mesa (x86) em vez de SwiftShader.

Não oculta que a sessão é conduzida através do Chrome DevTools Protocol, e não é uma forma de contornar a segurança do site, CAPTCHAs ou controlos de acesso. Utilize-a em workflows que está autorizado a executar — ferramentas internas, os seus próprios sites e automação de navegador permitida.

O modo Run Code mantém-se inalterado — os scripts personalizados lançam o Chromium por si próprios.

## Network Capture

Ative `playwrightCaptureNetwork` para recolher dados de depuração adicionais durante a execução:

- `networkRequests` – Respostas JSON/API capturadas
- `cookies` – Cookies do navegador no final da execução
- `localStorage` – Pares chave-valor do `localStorage` do navegador
- `sessionStorage` – Pares chave-valor do `sessionStorage` do navegador

Isto é útil quando precisa de inspecionar chamadas API ocultas, estado de autenticação ou dados do lado do navegador após um fluxo automatizado.

## Cookie Bootstrap And Login Fallback

Ative `playwrightAuthEnabled` quando pretender que o Playwright abra uma página já com sessão iniciada.

### Auth State Source

Defina `playwrightAuthStateExpression` com uma expressão como `$global.authState`. O valor pode ser:

- Um objeto `storageState` do Playwright: `{"cookies": [...], "origins": [...]}`
- Um array `cookies[]` em bruto
- Uma string JSON que contenha qualquer uma das formas

Padrão recomendado:

1. Execute um nó Playwright com captura de rede ou bootstrap de autenticação ativado
2. Armazene `$playwrightNode.cookies` ou um objeto de estado de autenticação completo numa [Global Variable](../reference/global-variables.md)
3. Reutilize essa variável em nós Playwright posteriores através de `$global.authState`

### Auth Check

O primeiro passo principal do Playwright deve ser `navigate`. Após esse passo carregar, o Heym verifica `playwrightAuthCheckSelector`.

- Se o seletor estiver visível, os restantes passos principais continuam normalmente
- Se o seletor estiver ausente, o Heym executa `playwrightAuthFallbackSteps`
- Após a conclusão dos passos de recurso, o Heym verifica novamente o mesmo seletor
- Se o seletor continuar ausente, o nó falha com um erro de bootstrap de autenticação

Os passos de recurso assumem a navegação após a falha de autenticação. Devem deixar o navegador na página autenticada esperada pelo resto do fluxo principal.

## Output Fields

- `$playwrightNode.status` – `"ok"` em caso de sucesso
- `$playwrightNode.results` – Saídas dos passos (getText, getHTML, getVisibleTextOnPage, getAttribute, chaves de captura de ecrã, etc.)
- `$playwrightNode.screenshot` – Captura de ecrã em Base64 quando um passo a guarda
- `$playwrightNode.cookies` – Cookies finais do navegador quando o bootstrap de autenticação ou a captura de rede estão ativados
- `$playwrightNode.networkRequests` – Respostas de rede capturadas (quando ativado)
- `$playwrightNode.localStorage` – Armazenamento local do navegador (quando ativado)
- `$playwrightNode.sessionStorage` – Armazenamento de sessão do navegador (quando ativado)

## Example

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

No Painel de Propriedades, defina **Mode** como **Run Code** para editar `playwrightCode` em vez de etapas visuais. A inicialização de autenticação aplica-se apenas ao modo Steps.

Exemplo (sandbox / Docker — o Chromium requer `--no-sandbox`):

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
- **Isolado quando habilitado.** O código personalizado não é executado no processo do backend. Ele é executado em um contêiner irmão descartável e reforçado, sem socket do Docker, sem bind mounts do backend, sem segredos do backend em seu ambiente, com capabilities removidas, `no-new-privileges` e limites de CPU / memória / PID. Se o Docker estiver indisponível, a execução falha de forma segura (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` opta por retornar ao caminho em processo, apenas para uso confiável ou de desenvolvimento local (não é uma fronteira de segurança). O `./run.sh` nativo usa `subprocess` por padrão quando nenhum `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` está definido. O `./deploy.sh` (Compose) e a imagem única do GHCR resolvem o runner irmão por meio de `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (com fallback para `HEYM_CODEX_DOCKER_IMAGE`) e usam o caminho de venv correspondente (`/app/.venv` vs `/app/backend/.venv`).
- **Observação sobre o Chromium.** O contêiner de sandbox é executado como root por padrão, e o Chromium se recusa a ser executado como root sem `--no-sandbox`. O código personalizado que inicia o Chromium deve passá-lo, por exemplo `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. As inicializações baseadas em etapas (e stealth) também passam `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` para que scripts de fingerprint não possam abrir STUN UDP para `stun.l.google.com:19302`. Chamadas personalizadas de `chromium.launch` também devem incluir esse flag.

Os nós Playwright baseados em etapas (`playwrightSteps`) são totalmente gerados pelo Heym (sem código arbitrário), não são afetados por tudo o que foi descrito acima e estão sempre disponíveis — prefira-os.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Crawler](./crawler-node.md) – Web scraping mais simples com FlareSolverr
- [Compartilhamento de Credenciais](../reference/credentials-sharing.md) – Credenciais de LLM para etapas de IA
