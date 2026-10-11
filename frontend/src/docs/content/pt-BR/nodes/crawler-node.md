# Crawler

O nó **Crawler** realiza scraping de páginas web usando FlareSolverr, com extração opcional de HTML por meio de seletores CSS. Utilize-o para web scraping e extração de conteúdo.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.body` (HTML ou conteúdo extraído) |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial do FlareSolverr em [Credentials](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL a ser raspada (suporta expressões) |
| `crawlerWaitSeconds` | number | Segundos de espera antes do scraping (padrão: 0) |
| `crawlerMaxTimeout` | number | Timeout máximo em ms (padrão: 60000) |
| `crawlerMode` | string | `"basic"` ou outros modos |
| `crawlerSelectors` | array | Seletores CSS para extração. Cada um: `{ selector, attribute? }` |

## Exemplo

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

## Segurança de Egress

- A URL do FlareSolverr armazenada na credencial deve usar `http://` ou `https://` e não pode resolver para um endereço link-local ou de metadados de nuvem. O conjunto recusado é `169.254.0.0/16`, `fe80::/10`, os endereços de metadados IPv6 da Alibaba Cloud e da AWS, e as formas de transição IPv6 que podem carregar um deles. Trata-se de uma lista de endpoints conhecidos, não de uma garantia sobre todos os provedores.
- Endereços de loopback e privados são permitidos intencionalmente, para que a configuração documentada `http://localhost:8191` e nomes de serviços do compose como `http://flaresolverr:8191` continuem funcionando. A consequência é que este campo também pode ser apontado para qualquer outro serviço que o backend consiga alcançar nesses endereços, e a resposta retorna na saída do nó. O compartilhamento de credenciais não contém isso: qualquer usuário autenticado pode criar sua própria credencial do FlareSolverr, portanto reter uma existente não muda nada. Os controles que de fato se aplicam são confiar nas pessoas que podem criar workflows e regras de rede que limitam o que o backend consegue alcançar.
- O Heym fixa o endereço resolvido antes de conectar, de modo que uma resposta DNS não pode mover a requisição para um endereço de metadados após a verificação. Proxies de ambiente são desabilitados enquanto a proteção está ativa, e redirecionamentos não são seguidos.
- A página que o FlareSolverr então busca para você é um salto separado que o próprio FlareSolverr resolve. O Heym não a inspeciona, portanto restringir onde o contêiner do FlareSolverr pode se conectar é responsabilidade da sua política de rede.
- Implantações auto-hospedadas confiáveis podem suspender a regra de metadados com `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenha o padrão em implantações hospedadas ou multi-inquilino.

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Playwright Node](./playwright-node.md) – Alternativa de automação de navegador
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar credencial do FlareSolverr
