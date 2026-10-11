# Diàleg d'avaluació d'expressions

El Diàleg d'avaluació d'expressions és l'editor ampliat per als camps que admeten expressions. S'obre des del botó d'expansió situat al costat d'un camp d'expressió i ofereix un espai de treball més gran, autocompletat, previsualització en directe del backend i exploració de la sortida, tot en un sol lloc.

## Obrir el diàleg

- Feu clic al botó d'expansió situat al costat d'un camp d'expressió al tauler de Propietats.
- Els camps multilínia mostren el botó dins del camp d'entrada.
- Els camps d'una sola línia mostren el botó a la dreta del camp d'entrada.

## Disposició del diàleg

- El diàleg s'obre com una finestra modal centrada d'aproximadament **80vw × 80vh**.
- La capçalera mostra **Evaluate — {field name}** quan es coneix l'etiqueta del camp.
- L'editor conserva l'autocompletat, la navegació entre camps i les accions habituals **Apply** / **Cancel**.
- La previsualització s'actualitza automàticament uns **300 ms** després que deixeu d'escriure.
- Premeu `Ctrl` / `Cmd` + `Enter` per aplicar el text actual al camp i tancar el diàleg (igual que **Apply**).

## Secció de sortida

L'àrea de sortida s'actualitza automàticament després que feu una pausa en escriure a l'editor.

### Avaluació

| Tipus d'expressió | Resultat |
|---|---|
| Un sol `$expr` (camp sencer) | Es conserva el valor natiu |
| Un sol camí de punts sense `$` (camp sencer, sense `$`, sense salt de línia incrustat) | Igual que `$` + aquest camí (el backend normalitza per a l'avaluació) |
| Text amb `$refs` incrustats | El resultat final sempre és una cadena |
| Text literal (sense `$`, no és un sol camí de punts) | Es retorna tal qual |

**Exemples**

| Entrada | Resultat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (igual que `$input.items` quan tot el valor és aquest camí) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

El context d'avaluació es construeix en aquest ordre:

- **Dades fixades** als nodes ascendents
- **Sortides de l'última execució** del canvas
- `null` quan no hi ha dades ascendents disponibles

Si el node actual té dependències ascendents però cap d'elles té dades fixades ni un resultat d'execució recent, el diàleg primer realitza una execució de prova per construir el context i després avalua el text actual.

### Selector de camí de sortida

Quan el resultat del backend és un objecte o una matriu, l'àrea de sortida pot mostrar un selector de camí interactiu en lloc del JSON en brut.

- Feu doble clic en una fila per afegir aquest camí a la referència `$node.path` actual.
- Feu un sol clic a les files expandibles per obrir o tancar branques.
- Utilitzeu el quadre de consulta integrat per cercar claus, valors i cadenes de camí.

## Autocompletat

- Escriviu `$` per obrir suggeriments de nodes ascendents, elements integrats i mètodes.
- Premeu `Tab` o `Enter` per inserir el suggeriment seleccionat.
- Utilitzeu `↑` / `↓` per moure-us per la llista de suggeriments.

### Respostes d'exemple

Quan continueu una referència `$…` amb un punt, cada fila de suggeriment mostra la resposta que produiria aquest suggeriment, en negreta a la dreta de la fila.

- En escriure `$set.listItems.first().toString().u` es llisten `upper`, `urlEncode`, `urlDecode` i `unescape`, cadascun amb el seu resultat avaluat — de manera que podeu triar pel resultat en lloc de pel nom.
- En escriure `$node.text.toJson()` s'analitza una cadena JSON en un objecte o una matriu. Després de `.toJson()`, l'autocompletat pot oferir les claus analitzades (per exemple `repoUrl`) quan hi ha disponible la sortida de l'última execució o les dades fixades.
- Els resultats s'avaluen al backend contra les mateixes dades fixades i sortides de l'última execució que utilitza la previsualització del diàleg, de manera que coincideixen amb el que produirà el camp.
- Només s'avaluen els suggeriments que es mantenen per si sols: mètodes sense arguments (`upper()`, `first()`, `keys()`, `toJson()`) i propietats simples (`length`, `year`). Els suggeriments que primer necessiten arguments — `map`, `filter`, `sort`, `replace` — es deixen en blanc.
- Una fila es manté en blanc quan el candidat no produeix cap resposta: un error, un `null` o un mètode que no s'aplica a aquest valor.
- Les respostes s'escurcen a una línia. Passeu el cursor per sobre d'una resposta escurçada per veure'n més.

## Build with AI

El botó **Build with AI** apareix a la cantonada superior dreta del diàleg d'avaluació quan hi ha un workflow carregat. Obre una finestra modal imbricada on podeu descriure l'expressió que voleu en text pla i fer que un LLM la generi per vosaltres.

### Com funciona

1. Feu clic a **Build with AI** a la barra d'eines del diàleg d'avaluació.
2. Seleccioneu una credencial d'LLM i un model als desplegables.
3. Escriviu una descripció en text pla del que voleu — per exemple, *"Get the customer name from the API response"*.
4. Feu clic a **Generate**. La finestra modal crida el backend, que utilitza el prompt de sistema de l'[Expression DSL](./expression-dsl.md) juntament amb les sortides de l'última execució del workflow com a context, i retorna una única cadena d'expressió.
5. L'expressió generada s'avalua immediatament contra les mateixes dades del canvas perquè pugueu veure el resultat abans d'aplicar-la.
6. Feu clic a **Apply** per substituir el contingut de l'editor per l'expressió generada, o a **Regenerate** per tornar-ho a provar.

### Context utilitzat

El generador rep les sortides dels nodes de l'última execució de prova al canvas. Si el workflow encara no s'ha executat, l'LLM genera una expressió d'esforç òptim basada en les etiquetes dels nodes i les convencions del DSL.
### Requisits

- Cal configurar una credencial d'LLM (OpenAI, Google o Custom) a la pestanya [Credencials](./credentials.md).
- El workflow ha d'estar obert a l'editor.

## Dreceres de teclat

| Drecera | Acció |
|---|---|
| Pausa d'escriptura (~300 ms) | Actualitza la previsualització del backend |
| `Ctrl` / `Cmd` + `Enter` | Aplica i tanca el diàleg |
| `Escape` | Tanca primer l'autocompletat; en cas contrari, tanca el diàleg |

## `$` imbricat als arguments de mètode

Per a l'avaluació al diàleg o al backend, podeu passar una altra referència amb un `$` imbricat dins de crides com ara `.get($other.field)` quan necessiteu una clau dinàmica. També podeu utilitzar un path nu dins de `.get(...)` (per exemple, `other.field`); el backend el resol de la mateixa manera. Els camps desats del workflow han de seguir igualment les regles de l'[Expression DSL](./expression-dsl.md); l'API d'avaluació també accepta un path de punts nu de línia sencera per comoditat (vegeu la taula anterior).

## Navegació

Els editors de mapatge Set i Execute poden mostrar botons **Prev** / **Next** perquè pugueu moure-us entre camps sense tancar el diàleg.

## Relacionat

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credencials](./credentials.md) — necessàries per a la funcionalitat Build with AI
- [Node LLM](../nodes/llm-node.md)
- [Node Output](../nodes/output-node.md)
- [Node Condition](../nodes/condition-node.md)
