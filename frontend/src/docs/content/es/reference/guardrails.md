# Guardrails

Los Guardrails permiten bloquear mensajes de usuario inseguros o no deseados antes de que lleguen a un nodo [LLM](../nodes/llm-node.md) o [Agent](../nodes/agent-node.md). Cuando un mensaje coincide con una categoría bloqueada, el nodo genera un error en lugar de ejecutarse, lo cual puede capturar con un nodo [Error Handler](../nodes/error-handler-node.md).

## Habilitar Guardrails

Abra el panel de Propiedades de un nodo **LLM** o **AI Agent** y desplace hasta el interruptor **Enable Guardrails** (icono de escudo). Al marcar la casilla se muestra la sección de configuración.

## Credencial y modelo de Guardrail

Cuando los guardrails están habilitados, **debe** seleccionar una **credencial y un modelo** para la seguridad de contenido. La verificación del guardrail utiliza la credencial y el modelo seleccionados en el nodo — sin respaldo, sin variables de entorno. Utilice una credencial de OpenAI o Google para un filtrado de contenido confiable, especialmente cuando su modelo principal utiliza un proveedor personalizado (p. ej. Zhipu, GLM) que puede no admitir guardrails o devolver errores de API (p. ej. 404).

El workflow no puede ejecutarse hasta que se seleccionen tanto Guardrail Credential como Guardrail Model.

## Categorías bloqueadas

Seleccione una o más categorías para bloquear. Un mensaje que coincida con cualquier categoría marcada es rechazado.

| Categoría | Qué bloquea |
|---|---|
| **Violence** | Contenido violento, amenazante o físicamente dañino |
| **Hate Speech** | Discriminación, racismo o intolerancia |
| **Sexual Content** | Contenido o escenarios sexuales explícitos |
| **NSFW / Profanity** | Lenguaje soez, blasfemias, insultos explícitos y jerga para adultos en cualquier idioma |
| **Self-Harm** | Suicidio, autolesión o contenido relacionado |
| **Harassment** | Ataques personales, insultos, acoso o intimidación |
| **Illegal Activity** | Instrucciones para cometer actos ilegales |
| **Political Extremism** | Contenido político extremista o propaganda violenta |
| **Spam / Phishing** | Spam, phishing o ingeniería social |
| **Personal Data Request** | Solicitud de información privada o de identificación personal |
| **Prompt Injection** | Intentos de anular las instrucciones del sistema, inyectar prompts maliciosos o manipular el comportamiento del modelo |

## Sensibilidad

La configuración de **Sensitivity** controla con qué rigor se detectan las infracciones:

| Nivel | Comportamiento |
|---|---|
| **Low** | Señala incluso casos límite o ambiguos |
| **Medium** *(predeterminado)* | Señala infracciones claras; ignora los casos límite |
| **High** | Señala únicamente infracciones extremas e inequívocas |

## Cómo funciona la detección

La detección utiliza la **credencial y el modelo de guardrail seleccionados**:

- **Credenciales de OpenAI** — utiliza la [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratuita, rápida, sin consumo de tokens) para las cinco categorías que cubre de forma nativa (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Las categorías restantes se verifican mediante una llamada de clasificación LLM utilizando el modelo de guardrail seleccionado.
- **Credenciales de Google / personalizadas** — todas las categorías se verifican mediante una llamada de clasificación LLM utilizando la credencial y el modelo de guardrail seleccionados.

Cuando su modelo principal utiliza un proveedor personalizado (p. ej. Zhipu, Cerebras) que puede devolver 404 u otros errores de API, seleccione una **credencial de OpenAI o Google** para los guardrails.

## Formato del error

Cuando se activa un guardrail, el nodo genera un error con el mensaje:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

El `output` del resultado del nodo también incluye `guardrail_violated_categories` (arreglo de etiquetas de categorías infringidas) para que el Debug Panel y el Historial de ejecuciones puedan mostrar "Blocked by: X, Y" con claridad.

Utilice la opción **Continue on error** del nodo (o un [Error Handler](../nodes/error-handler-node.md)) para dirigir el workflow a una rama alternativa cuando se activen los guardrails.

## Workflow de ejemplo

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Notas

- **Sin reintentos**: las infracciones de guardrail son bloqueos intencionales y nunca se reintentan, incluso si el nodo tiene habilitado "Retry on failure".
- No se requiere migración de base de datos — la configuración de guardrails se almacena en el JSON del nodo del workflow junto con los demás datos del nodo.
- Los guardrails verifican el **mensaje de usuario** resuelto (tras evaluar las expresiones de plantilla), no la plantilla sin procesar.
- Establecer **ninguna categoría** con los guardrails habilitados equivale a tenerlos deshabilitados — no se realiza ninguna verificación.
- Con severidad **Low**, la clasificación LLM siempre se ejecuta (mejor cobertura multilingüe). Las credenciales de OpenAI ejecutan además la Moderation API.
- Con severidad **Medium/High**, las credenciales de OpenAI utilizan la Moderation API para las categorías admitidas de forma nativa y la clasificación LLM para el resto. Las credenciales de Google/personalizadas siempre utilizan la clasificación LLM.
- La clasificación LLM es **agnóstica al idioma** — detecta infracciones en turco, árabe, ruso, español y otros idiomas.