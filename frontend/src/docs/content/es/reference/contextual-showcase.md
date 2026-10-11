# Contextual Showcase

El **Contextual Showcase** es una guía ligera integrada en la aplicación que explica la página en la que se encuentra actualmente sin dirigirle inmediatamente a un flujo de documentación completo.

## Qué hace

- Muestra un resumen breve de la página actual
- Mantiene la primera capa concisa para no saturarle
- Permite expandir una pequeña cantidad de detalle adicional solo cuando sea necesario
- Enlaza a la página de documentación completa para una lectura más profunda

## Dónde aparece

En la v1, el showcase está disponible en las superficies principales autenticadas de Heym:

- Pestañas del Dashboard
- [Evals](../tabs/evals-tab.md)
- [Documentación](../getting-started/introduction.md)
- El canvas del editor de workflows

Las páginas públicas como inicio de sesión, registro, portal de chat y revisión HITL no muestran el showcase.

## Acceso

### Escritorio

- Un trigger fijo **Page Guide** aparece en el borde derecho de la pantalla
- El showcase se abre como un drawer lateral derecho
- Permanece cerrado por defecto
- Un teaser de una sola vez ayuda a revelar que la guía existe sin forzar su apertura

### Móvil

- El mismo contenido está disponible desde un botón flotante **Page Guide**
- Se abre en una hoja inferior en lugar de un panel lateral derecho

## Modelo de contenido

Cada entrada del showcase utiliza una definición estructurada en lugar de un componente completamente personalizado.

- **Title** – Qué es esta página
- **Summary** – Una explicación breve
- **Bullets** – Algunas indicaciones escaneables
- **Highlights** – Tarjetas pequeñas para valor clave o patrones de uso
- **More Detail** – Secciones contraídas para contexto adicional
- **Actions** – Generalmente uno o dos enlaces, con mayor frecuencia a la documentación completa

Esto mantiene el sistema flexible mientras evita paneles de ayuda largos y ruidosos.

## Conciencia del contexto

El showcase cambia según la superficie actual.

- Cada pestaña del Dashboard tiene su propio resumen
- El editor apunta a [Canvas Features](./canvas-features.md)
- La página de documentación utiliza una descripción general genérica de documentación y, cuando es posible, apunta al artículo actual que ya tiene abierto

## Persistencia

El showcase almacena una pequeña cantidad de estado de UI personal en el almacenamiento del navegador:

- Si el panel o la hoja estuvo abierto por última vez
- Qué contextos de página ya mostraron el teaser
- La última sección de detalle expandida por contexto

## Por qué existe

El objetivo es hacer que Heym sea más fácil de aprender sin agregar más elementos pesados de UI.

- Orientación breve y siempre cercana para la orientación
- Ruta clara hacia documentación más profunda
- Baja interrupción para usuarios experimentados

## Relacionado

- [Workflows Tab](../tabs/workflows-tab.md) – Superficie principal del Dashboard
- [Evals Tab](../tabs/evals-tab.md) – Workflows de evaluación
- [Canvas Features](./canvas-features.md) – Comportamiento del editor y depuración
- [Quick Drawer](./quick-drawer.md) – La otra superficie de utilidad fija del lado derecho