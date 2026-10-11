# Descarga e importación

Exporte workflows o carpetas completas como archivos, o impórtelos mediante arrastrar y soltar. Utilice esta funcionalidad para realizar copias de seguridad, compartir o migrar workflows entre instancias.

## Descargar Workflow (JSON)

**Ubicación:** Barra de herramientas del editor → botón **Download** (visible en pantallas grandes)

**Qué exporta:**
- `nodes` – Todos los nodos del canvas
- `edges` – Todas las conexiones entre nodos

**Nombre del archivo:** `{workflow-name}.json` (derivado del nombre del workflow)

**Formato:** Consulte [Workflow Structure](./workflow-structure.md) para el esquema JSON.

## Descargar carpeta (ZIP)

**Ubicación:** Dashboard → pestaña Workflows → menú de 3 puntos de la carpeta → **Download as ZIP**

**Qué exporta:**
- Todos los workflows de la carpeta y de todas las subcarpetas, de forma recursiva
- La jerarquía de carpetas se conserva como directorios dentro del ZIP

**Estructura del ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Cada archivo `.json` contiene `{ name, nodes, edges }`.

## Importación

### Desde el Dashboard (pestaña Workflows)

1. Vaya a la pestaña [Workflows](../tabs/workflows-tab.md)
2. Arrastre un archivo **JSON** o **ZIP** sobre el área de workflows

**Archivo JSON:** Se crea un nuevo workflow. El nombre del workflow proviene del campo `name` del JSON, o del nombre del archivo si `name` no está presente.

**Archivo ZIP:** Se recrea toda la estructura de carpetas en el nivel raíz. Cada archivo `.json` dentro del ZIP se convierte en un workflow ubicado en la carpeta correspondiente. Las Credenciales y las referencias entre workflows que no existan en la instancia actual se eliminan automáticamente. Si algunos workflows no se pueden importar, se muestra un resumen con la cantidad de importaciones exitosas.

### Desde el Canvas (editor)

1. Abra un workflow en el editor
2. Arrastre un archivo JSON sobre el canvas
3. Si el canvas ya contiene nodos o edges, un diálogo de confirmación le preguntará si desea reemplazar el workflow actual
4. Los nodos y edges importados reemplazan o se fusionan con el workflow actual

## Formatos de archivo

### JSON (workflow individual)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Obligatorio; array de objetos de nodo
- `edges` – Opcional; array de objetos de edge (por defecto `[]`)
- `name` – Opcional; se utiliza al crear un nuevo workflow desde la importación en el Dashboard

### ZIP (carpeta)

Archivo ZIP en el que la estructura de directorios refleja la jerarquía de carpetas. Cada archivo es un JSON de workflow (consulte arriba). Los nombres de carpetas y workflows se derivan de los nombres de directorios y archivos respectivamente.

Consulte [Workflow Structure](./workflow-structure.md) para los formatos de nodos y edges.

## Casos de uso

- **Copia de seguridad** – Descargue workflows o carpetas completas antes de realizar cambios importantes
- **Compartir** – Exporte y comparta archivos JSON con sus compañeros de equipo
- **Migración** – Mueva workflows o estructuras de carpetas entre instancias de Heym
- **Control de versiones** – Almacene los JSON de workflows en Git junto con el código

## Relacionado

- [Workflow Structure](./workflow-structure.md) – Formato JSON para nodos y edges
- [Workflows Tab](../tabs/workflows-tab.md) – Cree workflows e importe mediante arrastrar y soltar
- [Workflow Organization](./workflow-organization.md) – Carpetas y subcarpetas
- [Canvas Features](./canvas-features.md) – Funcionalidades del editor, incluida la importación en el canvas