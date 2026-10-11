# Single Sign-On

O Heym pode autenticar pessoas contra qualquer provedor externo **OpenID Connect**. Um administrador insere uma URL de emissor em **Configurações → SSO**, e o Heym lê todos os demais endpoints a partir do documento de descoberta desse provedor.

Nenhum provedor é fixado no código. Keycloak, Okta, Entra ID, Auth0, Google e qualquer outro provedor OIDC se conectam pelos mesmos campos, porque a única informação fornecida ao Heym é o emissor.

O login por senha e o SSO funcionam lado a lado. O login por senha pode ser desativado depois que o SSO for verificado.

## Antes de Começar

As configurações de SSO são válidas para toda a instância, portanto apenas administradores da instância podem alterá-las. Os administradores são definidos por uma variável de ambiente, não armazenados no banco de dados:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Um valor vazio não concede acesso a ninguém. Reinicie o backend após alterá-lo. As contas nesta lista também veem a aba **SSO** em Configurações e mantêm acesso por senha mesmo quando o login por senha está desativado — consulte [Desativando o Login por Senha](#desativando-o-login-por-senha).

## Registrando o Heym no Seu Provedor

No seu provedor de identidade, crie um **cliente confidencial** (também chamado de registro de aplicativo) com:

| Configuração | Valor |
|---------|-------|
| Protocolo | OpenID Connect |
| Tipo de concessão | Authorization Code com PKCE |
| Autenticação do cliente | Ativada — o Heym usa um client secret |
| Redirect URI | O valor exato exibido na aba SSO do Heym |
| Escopos | `openid email profile` |

O Heym calcula o redirect URI a partir de `FRONTEND_URL` e o exibe como somente leitura no formulário de configurações, com um botão de cópia. Ele sempre termina em `/api/auth/sso/callback`. Copie-o em vez de digitá-lo — um redirect URI divergente é a falha de configuração mais comum, e os provedores o rejeitam sem explicação.

Seu provedor deve retornar um endereço de email verificado. Consulte [Mapeamento de Conta](#mapeamento-de-conta).

## Configurando o Heym

Abra **Configurações → SSO**. A aba só aparece para contas em `HEYM_ADMIN_EMAILS`.

| Campo | O que faz |
|-------|--------------|
| **Ativar single sign-on** | Exibe o botão de login na tela de login. |
| **Issuer URL** | A URL base do provedor, por exemplo `https://idp.example.com/realms/your-realm`. O Heym acrescenta `/.well-known/openid-configuration` e lê o restante a partir daí. |
| **Client ID** | O identificador do cliente fornecido pelo seu provedor. |
| **Client secret** | Armazenado de forma criptografada. Deixe o campo em branco para manter o valor armazenado — o Heym nunca retorna um secret que possui. |
| **Redirect URI** | Somente leitura. Copie isto para a lista de permissões do seu provedor. |
| **Escopos** | `openid email profile` por padrão. |
| **Rótulo do botão de login** | O texto no botão da tela de login, por exemplo "Entrar com Okta". |
| **Criar uma conta no primeiro login** | Se pessoas desconhecidas recebem uma conta no Heym automaticamente. |
| **Domínios de email permitidos** | Separados por vírgula. Em branco permite qualquer domínio que o provedor autentique. |
| **Desativar login por senha** | Desativa a autenticação por senha em toda a instância. |

### Teste a conexão primeiro

**Testar conexão** busca o documento de descoberta e as chaves de assinatura do provedor, e então informa o token endpoint encontrado. Você pode executá-lo em um emissor que digitou mas ainda não salvou, de modo que uma URL incorreta custa um clique em vez de um salvamento.

Um teste só *registra* um resultado bem-sucedido quando o emissor testado é o que já está armazenado. Um teste em rascunho informa se a URL resolve; ele não valida uma configuração que não foi salva. Alterar o emissor, o client ID, os escopos ou o secret limpa o resultado registrado pelo mesmo motivo.

## Como o Login Funciona

1. Alguém clica no botão de login na tela de login.
2. O Heym o redireciona ao provedor com um `state`, um `nonce` e um desafio PKCE.
3. Ele se autentica com o provedor.
4. O provedor redireciona de volta ao callback do Heym com um código de autorização.
5. O Heym troca o código por tokens e verifica o ID token contra as chaves publicadas pelo provedor, checando a assinatura, a audience, o emissor, a expiração e o nonce.
6. O Heym resolve a conta e emite sua própria sessão, exatamente como faz um login por senha.

Tudo a partir do passo 6 permanece inalterado: os mesmos cookies de sessão, os mesmos tempos de vida dos tokens, as mesmas permissões.

## Mapeamento de Conta

O Heym resolve uma conta nesta ordem:

1. **`(issuer, subject)`** — a identidade que o provedor afirmou em um login anterior. Isto é autoritativo e sobrevive a uma mudança de email no provedor.
2. **Email verificado** — uma conta existente no Heym com esse endereço é reivindicada, e o subject do provedor é registrado nela a partir de então.
3. **Uma nova conta** — criada se **Criar uma conta no primeiro login** estiver ativado e o domínio for permitido.

Um email só conta como verificado quando o ID token carrega `email_verified: true`. Se essa claim for `false` ou estiver ausente, o login é recusado. Reivindicar uma conta existente — ou criar uma nova — com base em um endereço que o provedor não atesta é um caminho para tomada de conta, então o Heym não faz isso. Um provedor que nunca emite `email_verified` precisa ser configurado para fazê-lo.

Contas criadas dessa forma não têm senha. Elas fazem login apenas por meio do provedor.
## Desativando o Login por Senha

O interruptor **Disable password sign-in** permanece indisponível até que três condições sejam verdadeiras:

1. O SSO está habilitado.
2. Um teste de conexão foi aprovado, para que um issuer incorreto não possa trancar a porta atrás de si mesmo.
3. Pelo menos uma conta em `HEYM_ADMIN_EMAILS` realmente possui uma senha.

Quando está ativado, a autenticação por senha é recusada em todas as três superfícies que emitem ou aceitam uma: o formulário de login, o **registration** e a página de consentimento do MCP OAuth. O registration conta porque emite uma senha; deixá-lo aberto tornaria a configuração contornável por qualquer pessoa que consiga acessar `/register`.

As contas listadas em `HEYM_ADMIN_EMAILS` estão isentas das três. Quem consegue editar o arquivo de ambiente já pode recuperar a instância, então essa garantia vive no código em vez de na memória de um operador.

### Por que a terceira condição existe

Um administrador cuja conta Heym foi criada *através* do SSO não possui senha alguma. A isenção o deixaria passar pelo portão, mas não há nada com que ele possa fazer login — então a instância não teria como voltar caso o provedor ficasse indisponível. O Heym se recusa a entrar nesse estado e informa isso.

Se você se deparar com essa mensagem, faça login através do SSO e registre uma conta com senha em um dos seus endereços de administrador (o registration ainda está aberto para endereços de administrador exatamente por esse motivo), ou adicione um endereço que já tenha uma senha a `HEYM_ADMIN_EMAILS`.

### Recuperando quando o provedor está indisponível

Em ordem de preferência:

1. **Faça login com uma senha de administrador break-glass.** A tela de login oculta o formulário de senha quando o login por senha está desativado, então clique em **Sign in with a password instead** abaixo do botão de SSO para revelá-lo. O formulário não é um bypass: todo endereço fora de `HEYM_ADMIN_EMAILS` continua sendo recusado, e informado do motivo.
2. **Adicione-se a `HEYM_ADMIN_EMAILS`** no arquivo de ambiente e reinicie o backend. Uma conta que já possui uma senha poderá então fazer login.
3. **Reabra o login por senha diretamente no banco de dados**, caso nenhum administrador possua senha alguma:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Nenhum reinício é necessário; a configuração é lida a cada requisição.

Os usuários finais do Portal não são afetados. Eles se autenticam contra um diretório separado — consulte [Portal](./portal.md).

## Erros de Login

Um login malsucedido retorna à tela de login com uma mensagem legível. O Heym nunca exibe o texto de erro bruto do provedor.

| Mensagem | Causa |
|---------|-------|
| That sign-in attempt expired | A tentativa levou mais de dez minutos, ou o navegador descartou o cookie da transação. Tente novamente. |
| Could not reach the identity provider | A descoberta ou a troca de token falhou. Verifique a URL do issuer e se o provedor está acessível a partir do backend. |
| The provider's response could not be verified | O ID token falhou na validação de assinatura, audience, issuer, expiração ou nonce. Geralmente é uma incompatibilidade de client ID. |
| The provider did not return an email address | O escopo `email` está ausente, ou o provedor não libera a claim. |
| Your email address is not verified | O provedor enviou `email_verified: false`, ou omitiu a claim. |
| Your email domain is not allowed | O endereço está fora de **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** está desativado e nenhuma conta corresponde. Um administrador precisa criar uma. |
| Single sign-on is not configured | O SSO está desabilitado, ou o issuer, client ID ou secret estão ausentes. |

## Notas de Segurança

- **O client secret é criptografado em repouso** e nunca é retornado por nenhum endpoint. O formulário de configurações informa apenas se um está armazenado.
- **O PKCE verifier nunca sai do Heym.** Ele é mantido em um cookie `HttpOnly` de curta duração em vez de no parâmetro `state`, que faz round-trip através do provedor à vista de todos.
- **Apenas assinaturas assimétricas são aceitas.** `none` e algoritmos simétricos são rejeitados independentemente do que o provedor anuncie.
- **O destino pós-login é validado** como um caminho de mesma origem, então o callback não pode ser usado como um open redirect.
- **Todo login é auditado.** Sucessos, falhas e recusas aparecem como linhas `auth.sso_login`, e alterações de configuração como `sso_settings.update` — consulte [Audit Logging](./audit.md).

## O Que Não É Suportado

- **SAML.** OIDC é o único protocolo.
- **Múltiplos provedores simultâneos.** Uma instância se conecta a um provedor.
- **Mapeamento de grupo ou papel** a partir das claims do provedor.
- **Single logout.** Sair do Heym não desconecta você do provedor.
