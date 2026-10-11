# Início de Sessão Único

O Heym pode autenticar utilizadores através de qualquer fornecedor externo **OpenID Connect**. Um administrador introduz um URL de emissor em **Definições → SSO**, e o Heym lê todos os restantes endpoints a partir do documento de descoberta desse fornecedor.

Nenhum fornecedor está pré-configurado. Keycloak, Okta, Entra ID, Auth0, Google e qualquer outro fornecedor OIDC ligam-se através dos mesmos campos, porque a única informação fornecida ao Heym é o emissor.

O início de sessão por palavra-passe e o SSO funcionam lado a lado. O início de sessão por palavra-passe pode ser desativado depois de o SSO estar verificado.

## Antes de Começar

As definições de SSO são globais à instância, pelo que apenas os administradores da instância as podem alterar. Os administradores são definidos por uma variável de ambiente, não armazenados na base de dados:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Um valor vazio não concede acesso a ninguém. Reinicie o backend após a alteração. As contas nesta lista também veem o separador **SSO** nas Definições e mantêm o acesso por palavra-passe mesmo quando o início de sessão por palavra-passe está desativado — consulte [Desativar o Início de Sessão por Palavra-Passe](#desativar-o-início-de-sessão-por-palavra-passe).

## Registar o Heym no Seu Fornecedor

No seu fornecedor de identidade, crie um **cliente confidencial** (também designado por registo de aplicação) com:

| Definição | Valor |
|---------|-------|
| Protocolo | OpenID Connect |
| Tipo de concessão | Authorization Code com PKCE |
| Autenticação do cliente | Ativada — o Heym utiliza um segredo de cliente |
| URI de redirecionamento | O valor exato apresentado no separador SSO do Heym |
| Âmbitos | `openid email profile` |

O Heym calcula o URI de redirecionamento a partir de `FRONTEND_URL` e apresenta-o apenas para leitura no formulário de definições, com um botão de cópia. Termina sempre em `/api/auth/sso/callback`. Copie-o em vez de o escrever — um URI de redirecionamento incorreto é a falha de configuração mais comum, e os fornecedores rejeitam-no sem explicação.

O seu fornecedor deve devolver um endereço de email verificado. Consulte [Mapeamento de Contas](#mapeamento-de-contas).

## Configurar o Heym

Abra **Definições → SSO**. O separador só aparece para contas em `HEYM_ADMIN_EMAILS`.

| Campo | O que faz |
|-------|--------------|
| **Ativar início de sessão único** | Mostra o botão de início de sessão no ecrã de login. |
| **URL do emissor** | O URL base do fornecedor, por exemplo `https://idp.example.com/realms/your-realm`. O Heym acrescenta `/.well-known/openid-configuration` e lê o resto a partir daí. |
| **ID do cliente** | O identificador de cliente do seu fornecedor. |
| **Segredo do cliente** | Armazenado encriptado. Deixe o campo em branco para manter o valor armazenado — o Heym nunca devolve um segredo que detém. |
| **URI de redirecionamento** | Apenas para leitura. Copie-o para a lista de permissões do seu fornecedor. |
| **Âmbitos** | `openid email profile` por predefinição. |
| **Etiqueta do botão de início de sessão** | O texto no botão do ecrã de login, por exemplo "Iniciar sessão com Okta". |
| **Criar uma conta no primeiro início de sessão** | Se utilizadores desconhecidos obtêm automaticamente uma conta no Heym. |
| **Domínios de email permitidos** | Separados por vírgulas. Em branco permite qualquer domínio que o fornecedor autentique. |
| **Desativar o início de sessão por palavra-passe** | Desativa a autenticação por palavra-passe em toda a instância. |

### Testar primeiro a ligação

**Testar ligação** obtém o documento de descoberta e as chaves de assinatura do fornecedor e, em seguida, indica o endpoint de token que encontrou. Pode executá-lo num emissor que introduziu mas ainda não guardou, pelo que um URL errado custa um clique em vez de uma gravação.

Um teste só *regista* um resultado bem-sucedido quando o emissor testado é o que já está armazenado. Um teste em rascunho indica se o URL é resolvido; não valida uma configuração que não está guardada. Alterar o emissor, o ID do cliente, os âmbitos ou o segredo limpa o resultado registado pelo mesmo motivo.

## Como Funciona o Início de Sessão

1. Alguém clica no botão de início de sessão no ecrã de login.
2. O Heym redireciona-o para o fornecedor com um `state`, um `nonce` e um desafio PKCE.
3. O utilizador autentica-se com o fornecedor.
4. O fornecedor redireciona de volta para o callback do Heym com um código de autorização.
5. O Heym troca o código por tokens e verifica o ID token contra as chaves publicadas pelo fornecedor, verificando a assinatura, a audiência, o emissor, a expiração e o nonce.
6. O Heym resolve a conta e emite a sua própria sessão, exatamente como faz um início de sessão por palavra-passe.

Tudo o que está a jusante do passo 6 permanece inalterado: os mesmos cookies de sessão, os mesmos tempos de vida dos tokens, as mesmas permissões.

## Mapeamento de Contas

O Heym resolve uma conta pela seguinte ordem:

1. **`(issuer, subject)`** — a identidade que o fornecedor afirmou num início de sessão anterior. Esta é autoritativa e sobrevive a uma alteração de email no fornecedor.
2. **Email verificado** — uma conta Heym existente com esse endereço é reclamada, e o subject do fornecedor é registado nela a partir daí.
3. **Uma nova conta** — criada se **Criar uma conta no primeiro início de sessão** estiver ativado e o domínio for permitido.

Um email só conta como verificado quando o ID token contém `email_verified: true`. Se essa afirmação for `false` ou estiver ausente, o início de sessão é recusado. Reclamar uma conta existente — ou criar uma nova — com base num endereço que o fornecedor não garante é um caminho de apropriação de conta, pelo que o Heym não o faz. Um fornecedor que nunca emite `email_verified` tem de ser configurado para o fazer.

As contas criadas desta forma não têm palavra-passe. Iniciam sessão apenas através do fornecedor.

## Desativar a autenticação por palavra-passe

O interruptor **Desativar a autenticação por palavra-passe** permanece indisponível até que três condições se verifiquem:

1. O SSO está ativado.
2. Um teste de ligação foi bem-sucedido, para que um emissor incorreto não possa trancar a porta atrás de si.
3. Pelo menos uma conta em `HEYM_ADMIN_EMAILS` tem efetivamente uma palavra-passe.

Quando está ativado, a autenticação por palavra-passe é recusada nas três superfícies que a emitem ou aceitam: o formulário de início de sessão, o **registo** e a página de consentimento OAuth do MCP. O registo conta porque emite uma palavra-passe; deixá-lo aberto tornaria a definição contornável por qualquer pessoa que consiga aceder a `/register`.

As contas listadas em `HEYM_ADMIN_EMAILS` estão isentas das três. Quem consegue editar o ficheiro de ambiente já consegue recuperar a instância, pelo que esta garantia reside no código e não na memória de um operador.

### Porque existe a terceira condição

Um administrador cuja conta Heym foi criada *através* do SSO não tem palavra-passe alguma. A isenção permitir-lhe-ia passar a barreira, mas não há nada com que iniciar sessão — pelo que a instância não teria forma de regressar caso o fornecedor ficasse indisponível. O Heym recusa entrar nesse estado e comunica-o.

Se encontrar essa mensagem, inicie sessão através do SSO e registe uma conta com palavra-passe num dos seus endereços de administrador (o registo continua aberto a endereços de administrador precisamente por este motivo), ou adicione a `HEYM_ADMIN_EMAILS` um endereço que já tenha palavra-passe.

### Recuperar quando o fornecedor está indisponível

Por ordem de preferência:

1. **Inicie sessão com uma palavra-passe de administrador de emergência.** O ecrã de início de sessão oculta o formulário de palavra-passe quando a autenticação por palavra-passe está desativada, pelo que deve clicar em **Iniciar sessão com uma palavra-passe** por baixo do botão SSO para o revelar. O formulário não é um contorno: todos os endereços fora de `HEYM_ADMIN_EMAILS` continuam a ser recusados, e é indicado o motivo.
2. **Adicione-se a `HEYM_ADMIN_EMAILS`** no ficheiro de ambiente e reinicie o backend. Uma conta que já tenha palavra-passe pode então iniciar sessão.
3. **Reative a autenticação por palavra-passe diretamente na base de dados**, caso nenhum administrador tenha palavra-passe:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Não é necessário reiniciar; a definição é lida a cada pedido.

Os utilizadores finais do Portal não são afetados. Autenticam-se num diretório separado — consulte [Portal](./portal.md).

## Erros de início de sessão

Um início de sessão falhado regressa ao ecrã de início de sessão com uma mensagem legível. O Heym nunca apresenta o texto de erro em bruto do fornecedor.

| Mensagem | Causa |
|---------|-------|
| Essa tentativa de início de sessão expirou | A tentativa demorou mais de dez minutos, ou o navegador descartou o cookie de transação. Tente novamente. |
| Não foi possível contactar o fornecedor de identidade | A descoberta ou a troca de token falhou. Verifique o URL do emissor e se o fornecedor está acessível a partir do backend. |
| Não foi possível verificar a resposta do fornecedor | O ID token falhou a validação de assinatura, audiência, emissor, expiração ou nonce. Normalmente, uma incompatibilidade do client ID. |
| O fornecedor não devolveu um endereço de email | O scope `email` está em falta, ou o fornecedor não divulga a claim. |
| O seu endereço de email não está verificado | O fornecedor enviou `email_verified: false`, ou omitiu a claim. |
| O domínio do seu email não é permitido | O endereço está fora dos **Domínios de email permitidos**. |
| Não existe nenhuma conta Heym para si | A opção **Criar uma conta no primeiro início de sessão** está desativada e nenhuma conta corresponde. Um administrador tem de criar uma. |
| O single sign-on não está configurado | O SSO está desativado, ou o emissor, o client ID ou o segredo estão em falta. |

## Notas de segurança

- **O segredo do cliente é encriptado em repouso** e nunca é devolvido por nenhum endpoint. O formulário de definições indica apenas se existe um armazenado.
- **O verificador PKCE nunca sai do Heym.** É mantido num cookie `HttpOnly` de curta duração em vez de no parâmetro `state`, que passa pelo fornecedor à vista de todos.
- **Apenas são aceites assinaturas assimétricas.** Os algoritmos `none` e simétricos são rejeitados independentemente do que o fornecedor anuncie.
- **O destino pós-início de sessão é validado** como um caminho da mesma origem, pelo que o callback não pode ser utilizado como redirecionamento aberto.
- **Todos os inícios de sessão são auditados.** Os sucessos, as falhas e as recusas aparecem como linhas `auth.sso_login`, e as alterações de configuração como `sso_settings.update` — consulte [Audit Logging](./audit.md).

## O que não é suportado

- **SAML.** O OIDC é o único protocolo.
- **Vários fornecedores em simultâneo.** Uma instância liga-se a um fornecedor.
- **Mapeamento de grupos ou funções** a partir das claims do fornecedor.
- **Single logout.** Terminar sessão no Heym não termina a sessão no fornecedor.
