# Tokens d'execució

Els tokens d'execució són JWT amb abast que concedeixen accés als endpoints d'execució i d'streaming d'un únic workflow. Permeten invocar un workflow des de sistemes externs sense exposar el token de sessió d'usuari de llarga durada.

## Per què utilitzar tokens d'execució

Quan l'autenticació d'un workflow està configurada com a **JWT**, l'endpoint normalment requereix una sessió d'usuari vàlida. Els tokens d'execució permeten:

- Compartir un token invocable amb scripts externs, pipelines de CI o integracions sense compartir les credencials del compte.
- Limitar l'exposició: un token només és vàlid per a un workflow concret.
- Revocar l'accés a l'instant sense canviar la contrasenya ni rotar els tokens de sessió.
- Triar entre tokens de curta durada (minuts o hores) i de llarga durada (fins a 10 anys).

## Crear un token

Obriu el diàleg **Run with cURL** a l'editor (barra d'eines superior dreta). Quan l'autenticació del workflow està configurada com a **JWT Token**, el diàleg mostra un gestor de tokens:

1. Trieu **Short-lived** o **Long-lived (10yr)**.
2. Per als tokens de curta durada, introduïu la durada en segons (mínim 60).
3. Feu clic a **+ New Token**.

El token es crea immediatament, s'afegeix a la llista i se selecciona automàticament, de manera que l'ordre cURL s'actualitza per incloure'l.

## Llista de tokens

Cada fila de token mostra:

| Columna | Descripció |
|--------|-------------|
| Created | Marca de temps de creació |
| Status | **Expires:** data, **Expired** o **Revoked** |
| Icona d'ull | Commuta la visibilitat del valor del token |
| Botó Revoke | Marca el token com a revocat (irreversible) |

Feu clic a qualsevol fila activa (no expirada ni revocada) per seleccionar-la. El token seleccionat s'incrusta a la previsualització de l'ordre cURL.

Els tokens expirats i revocats romanen visibles a la llista, però no es poden seleccionar.

## Utilitzar un token

Copieu el valor del token de la llista (feu clic a la icona d'ull per revelar-lo) i incloeu-lo com a token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Quan utilitzeu **Copy cURL** al diàleg amb un token seleccionat, el token ja està incrustat a l'ordre; no cal cap substitució manual.

## Abast del token

Cada token porta aquestes claims JWT:

| Claim | Valor |
|-------|-------|
| `sub` | ID d'usuari del creador del token |
| `wid` | UUID del workflow: el token es rebutja per a qualsevol altre workflow |
| `scope` | `workflow:execute`: el distingeix d'un token de sessió d'usuari |
| `jti` | ID únic del token utilitzat per a les consultes de revocació |
| `exp` | Marca de temps de caducitat |

El backend comprova tots aquests elements a cada petició: validesa de la signatura, caducitat, coincidència de `wid` i que el `jti` no hagi estat revocat.

## Revocació

Feu clic al botó de revocació (cercle amb barra) al costat d'un token per revocar-lo. La revocació té efecte immediat: les peticions posteriors que utilitzin aquest token retornen `401`. La fila del token roman visible a la llista amb l'etiqueta **Revoked**.

No hi ha manera de desfer la revocació. Creeu un token nou si necessiteu restaurar l'accés.

## API

Els endpoints de gestió de tokens s'autentiquen amb la vostra sessió habitual.

| Mètode | Ruta | Descripció |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Crear un token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Llistar els vostres tokens per a aquest workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Revocar un token |

**Cos de la petició de creació:**

```json
{ "ttl_seconds": 900 }
```

**Resposta de creació:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

El camp `token` només es retorna una vegada, en el moment de la creació. Emmagatzemeu-lo immediatament; les peticions `GET` posteriors retornen la mateixa fila, però també podeu revelar-lo al diàleg cURL en qualsevol moment.

## Abast de visibilitat

Cada usuari només veu els tokens que ha creat. Els membres de l'equip amb accés a un workflow compartit no poden veure els tokens dels altres.

## Relacionat

- [Webhooks](./webhooks.md) — endpoints de trigger HTTP i el diàleg cURL
- [Security](./security.md) — gestió de sessions i visió general de l'autenticació
- [SSE Streaming](./sse-streaming.md) — utilitzar tokens d'execució amb l'endpoint d'streaming