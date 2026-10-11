# Crawler

El nodo **Crawler** realiza scraping de páginas web utilizando FlareSolverr con extracción HTML opcional mediante selectores CSS. Úselo para web scraping y extracción de contenido.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.body` (HTML o contenido extraído) |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de FlareSolverr desde [Credenciales](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL a scrapear (admite expresiones) |
| `crawlerWaitSeconds` | number | Segundos de espera antes del scraping (predeterminado: 0) |
| `crawlerMaxTimeout` | number | Tiempo de espera máximo en ms (predeterminado: 60000) |
| `crawlerMode` | string | `"basic"` u otros modos |
| `crawlerSelectors` | array | Selectores CSS para extracción. Cada uno: `{ selector, attribute? }` |

## Ejemplo

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

## Seguridad de egreso

- La URL de FlareSolverr almacenada en la credencial debe usar `http://` o `https://` y no puede resolverse a una dirección link-local o de metadatos en la nube. El conjunto rechazado es `169.254.0.0/16`, `fe80::/10`, las direcciones de metadatos IPv6 de Alibaba Cloud y AWS, y las formas de transición IPv6 que pueden transportar una de ellas. Es una lista de endpoints conocidos, no una garantía sobre todos los proveedores.
- Las direcciones de loopback y privadas se permiten de forma intencional, para que la configuración documentada `http://localhost:8191` y los nombres de servicio de compose como `http://flaresolverr:8191` sigan funcionando. La consecuencia es que este campo también puede apuntarse a cualquier otro servicio que el backend pueda alcanzar en esas direcciones, y la respuesta regresa en la salida del nodo. Compartir la credencial no contiene esto: cualquier usuario autenticado puede crear su propia credencial de FlareSolverr, por lo que retener una existente no cambia nada. Los controles que sí aplican son confiar en las personas que pueden crear workflows, y las reglas de red que limitan lo que el backend puede alcanzar.
- Heym fija la dirección resuelta antes de conectarse, de modo que una respuesta DNS no puede mover la solicitud hacia una dirección de metadatos después de la verificación. Los proxies de entorno se deshabilitan mientras la protección está activa, y no se siguen redirecciones.
- La página que FlareSolverr luego obtiene para usted es un salto separado que FlareSolverr resuelve por sí mismo. Heym no la inspecciona, por lo que restringir hacia dónde puede conectarse el contenedor de FlareSolverr corresponde a su política de red.
- Las implementaciones autoalojadas de confianza pueden levantar la regla de metadatos con `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenga el valor predeterminado en implementaciones alojadas o multiinquilino.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Playwright](./playwright-node.md) – Alternativa de automatización de navegador
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Agregar credencial de FlareSolverr