# Variables globals

El **Magatzem de variables globals** conté dades persistents de tipus clau-valor, abastades a l'usuari, que es mantenen entre execucions de workflow. Utilitzeu-lo per a configuració, indicadors de funcionalitats, comptadors o estat compartit que necessitin diversos workflows.

> **No hi emmagatzemeu secrets.** Les variables globals no són una caixa forta de secrets: els valors s'emmagatzemen sense xifrar, es retornen íntegrament a qualsevol persona amb qui les compartiu i els col·laboradors les poden editar. Les claus d'API, contrasenyes i tokens pertanyen a [Credentials](./credentials.md), que les xifra en repòs i mai retorna el secret al client.

## Locals vs. globals

| Magatzem | Sintaxi | Abast | Persistència |
|-------|--------|-------|-------------|
| **Local del workflow** | `$vars.variableName` | Només l'execució actual | En memòria, es perd quan acaba l'execució |
| **Global** | `$global.variableName` | Tots els workflows de l'usuari | Persistit a la base de dades |

## Creació de variables globals

1. **Des de la pestanya Variables** – [Pestanya Variables](../tabs/global-variables-tab.md): creeu, editeu i suprimiu variables directament.
2. **Des d'un node Variable** – Activeu **Store in Global Variable Store** (`isGlobal: true`) a les propietats del node. La variable s'escriu al magatzem quan s'executa el workflow.

## Ús en expressions

Accediu a les variables globals amb `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Utilitzeu els mateixos mètodes que amb les variables locals del workflow (p. ex. `.upper()`, `.length`, `.add()` per a arrays).

## Tipus de valor

Tipus admesos: `string`, `number`, `boolean`, `array`, `object`. Trieu el tipus en crear o editar una variable.

## Compartició de variables globals

Podeu compartir una variable global amb altres usuaris o [Teams](./teams.md) perquè la puguin utilitzar en els seus propis workflows.

- **Compartir amb un usuari** – Feu clic a la icona de compartir al costat d'una variable pròpia, introduïu el correu electrònic del destinatari i feu clic a **Share**. El destinatari veurà la variable a la seva llista de Variables globals amb una etiqueta **Shared** i una indicació "Shared by &lt;your email&gt;".
- **Compartir amb un equip** – Al diàleg de compartició, seleccioneu un equip i feu clic a **Add**. Tots els membres de l'equip hi obtenen accés.
- **Accés editable** – Els destinataris poden veure, editar i referenciar la variable compartida mitjançant `$global.variableName` als seus workflows. Només el propietari pot compartir, deixar de compartir o suprimir la variable.
- **Conflictes de noms** – Si un destinatari ja té una variable amb el mateix nom, la seva pròpia variable té prioritat sobre la compartida.
- **Deixar de compartir** – Obriu el diàleg de compartició de la variable i feu clic al botó **×** al costat de l'usuari a qui voleu revocar l'accés.

## Integració amb el Chat

Les variables globals estan disponibles per a l'assistent de [Chat](../tabs/chat-tab.md). El LLM pot referenciar-les en respondre preguntes o generar contingut.

## Relacionat

- [Pestanya Variables](../tabs/global-variables-tab.md) – Gestioneu les variables globals a la interfície
- [Node Variable](../nodes/variable-node.md) – Definiu variables amb `isGlobal`
- [Expression DSL](./expression-dsl.md) – Sintaxi `$global`