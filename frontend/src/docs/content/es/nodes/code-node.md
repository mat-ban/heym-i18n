# Código

El nodo **Code** ejecuta el código Python que usted escriba, con su propio `requirements.txt`, y devuelve JSON. Cada ejecución obtiene un contenedor completamente nuevo que se destruye al finalizar la ejecución, por lo que una ejecución nunca puede ver ni afectar a otra.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.result` (lo que haya devuelto `main`), más `$nodeLabel.logs` y `$nodeLabel.install` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `codeSource` | string | Código fuente Python. Debe definir `main(params)` y devolver un valor serializable en JSON |
| `codeParameters` | expression | Un objeto JSON que conecta los datos del workflow con el código. Las expresiones se resuelven antes de que se ejecute el código |
| `codeRequirements` | string | Contenido de `requirements.txt`, un paquete por línea. Si está vacío, se omite la instalación |
| `codeAllowNetwork` | boolean | Indica si el propio código puede acceder a la red (por defecto `false`) |

## La función `main`

Su código debe definir una función `main` de nivel superior que reciba un argumento:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Las sentencias a nivel de módulo sí se ejecutan, pero solo lo que devuelve `main` se convierte en la salida del nodo.

El editor muestra los números de línea, y el botón de expansión situado junto a **Format** abre uno más grande que se cierra con `Esc`; las ediciones se aplican a medida que usted escribe, por lo que no hay nada que guardar. El botón **Format** vuelve a formatear su código con Ruff, preservando los comentarios. También repara el daño de indentación que suele provocar el pegado: un bloque con indentación uniforme, tabulaciones mezcladas con espacios y una línea desplazada uno o dos espacios respecto a su bloque se corrigen en lugar de rechazarse. Un error de sintaxis genuino se informa con su línea y columna. El formateo se ejecuta en el mismo contenedor aislado en el que se ejecuta el nodo —sin red, sin entorno del backend—, por lo que requiere Docker igual que la ejecución.

## Lectura de parámetros

`params` admite notación de punto, incluso a través de objetos y listas anidados:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` lee claves que no son identificadores válidos de Python
- `params.get("maybe")` devuelve `None` en lugar de generar un error cuando una clave está ausente
- `params.to_dict()` devuelve el diccionario simple
- Leer una clave que nunca se proporcionó genera un error que nombra la clave y enumera lo que está disponible

## Salida

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — el valor de retorno de `main`. Los nodos posteriores leen `$nodeLabel.result.message`
- `logs` — todo lo que el código envió a `print`, capturado por separado para que nunca corrompa el resultado
- `install` — qué herramienta instaló las dependencias (`uv`, `pip` o `none`) y su salida

## Dependencias

Enumere los paquetes en `requirements.txt` exactamente como lo haría en local:

```
requests==2.32.3
feedparser
```

Los paquetes se instalan con `uv` en un directorio desechable antes de que se ejecute el código; si `uv` no puede manejar un paquete, Heym reintenta con `pip`. Nada se almacena en caché entre ejecuciones, por lo que las dependencias pesadas añaden varios segundos a cada ejecución. Dejar `requirements.txt` vacío omite por completo el paso de instalación y es notablemente más rápido.

Los paquetes que no incluyen una wheel y necesitan un compilador de C no se podrán instalar. El motivo aparece en `install.log`.

## Red

| Fase | Red |
|-------|---------|
| Instalación de dependencias | Siempre activada — pip y uv tienen que acceder a PyPI |
| Ejecución de su código | Desactivada por defecto. `codeAllowNetwork` la activa |

Con `codeAllowNetwork` desactivado, una llamada saliente como `requests.get(...)` falla con un error de conexión. Ese es el comportamiento predeterminado previsto: la mayoría de los nodos Code transforman datos que otro nodo ya obtuvo. Se recomienda obtener los datos con un nodo **HTTP** y pasar el cuerpo a través de `codeParameters`.

## Sandbox y límites

Su código se ejecuta como un usuario no root en un contenedor con todas las capacidades de Linux eliminadas, `no-new-privileges` establecido y un sistema de archivos raíz de solo lectura. No recibe ningún socket de Docker ni ninguno de los secretos o del entorno del backend.

| Límite | Valor |
|-------|-------|
| Memoria | 512 MB |
| CPUs | 1 |
| Procesos | 256 |
| Tiempo de espera de instalación de dependencias | 120 segundos |
| Tiempo de espera de ejecución | 60 segundos |

Estas son propiedades fijas del sandbox, no configuración.

> **Se requiere Docker.** A diferencia de las herramientas y skills de Agent Python, el nodo Code no tiene modo de respaldo local ni variable de entorno para relajarlo. Sin un daemon de Docker accesible, el nodo falla con un error claro en lugar de ejecutar su código en el proceso del backend. En el desarrollo nativo con `./run.sh`, inicie Docker antes de usar este nodo. Consulte [Seguridad → Sandbox del nodo Code](../reference/security.md#code-node-sandbox).
## Utilice otro nodo cuando se ajuste a sus necesidades

| Si desea | Utilice |
|-------------|-----|
| Analizar o construir CSV, TSV, XML, o aplicar OCR a un archivo | [Converter](converter-node.md) |
| Llamar a una API HTTP | [HTTP](http-node.md) |
| Asignar o renombrar campos | [Set](set-node.md) |
| Ejecutar otro workflow | [Execute](execute-node.md) |

Recurra a **Code** cuando la lógica genuinamente no encaje en esas opciones: cálculos matemáticos personalizados, análisis a medida o un algoritmo.

## Ejemplo

Puntúe las filas producidas por un nodo anterior:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Con `codeParameters` establecido en `{ "rows": "$fetchRows.result" }`, los nodos posteriores leen `$scoreRows.result.total`.
