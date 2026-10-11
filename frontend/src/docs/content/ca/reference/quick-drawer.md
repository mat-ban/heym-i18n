# Quick Drawer

El **Quick Drawer** és un panell lateral dret d'execució ràpida per a workflows. Apareix a les pàgines autenticades, com ara la pestanya [Workflows](../tabs/workflows-tab.md) del tauler, Docs i Avaluacions.

## Accés

- Feu clic al trigger fix **Quick / Workflows** a la vora dreta central de la pantalla
- Quan el [Contextual Showcase](./contextual-showcase.md) també estigui disponible, el seu trigger **Page Guide** se situa per sobre de Quick Workflows
- El calaix s'obre des de la dreta i desplaça la pàgina actual cap a l'esquerra amb un reescalat subtil
- En mòbil, el Quick Drawer queda ocult
- El calaix no es mostra a l'editor de workflows, a les pàgines d'inici de sessió/registre, al portal ni a les pàgines de revisió HITL

## Cerca de workflows

Utilitzeu el camp de filtre a la part superior del calaix per cercar workflows per:

- Nom del workflow
- Descripció del workflow

La cerca no distingeix entre majúscules i minúscules i actualitza la llista immediatament.

## Workflows fixats

Fixeu workflows per mantenir-los a la part superior del calaix.

- Els workflows fixats apareixen en una secció pròpia per sobre de la llista completa
- Els nous fixats s'afegeixen a la part superior
- L'ordre dels fixats es conserva entre recàrregues a l'emmagatzematge del navegador

## Execució de workflows

Seleccioneu un workflow per obrir el seu formulari d'entrada.

- Els camps d'entrada es mostren verticalment en l'ordre del calaix
- Feu clic a **Run Workflow** per executar el workflow seleccionat
- Feu clic a **Stop Workflow** per cancel·lar una execució en curs des del calaix
- Els workflows sense camps d'entrada també es poden executar directament

El calaix utilitza la mateixa API d'execució de workflows que altres superfícies d'execució de Heym, de manera que les sortides i el comportament en temps d'execució es mantenen consistents.

Aturar una execució des del calaix també cancel·la l'execució activa al backend, incloent-hi qualsevol tasca de navegador Playwright en curs per a aquesta execució del workflow.

## Progrés i resultats

Després d'iniciar una execució, el calaix mostra:

- Progrés dels passos en streaming per als nodes a mesura que s'inicien i finalitzen
- Estat final: `success`, `error` o `pending`
- Sortides finals en un panell JSON compacte
- Entrades de l'Historial etiquetades amb `Quick Drawer`

`pending` significa que el workflow està esperant una acció posterior, com ara una revisió humana.

## Emmagatzematge del navegador

El Quick Drawer emmagatzema les preferències personals a `localStorage`:

- IDs dels workflows fixats
- Darrer workflow seleccionat

El calaix **no** conserva els valors d'entrada en aquesta versió.

## Abast

El Quick Drawer és intencionadament una superfície d'execució lleugera.

- Inclou: cerca, fixació, selecció, entrada, execució, progrés, resultat
- Exclou: creació de workflows, edició, gestió de carpetes i accions del canvas

## Relacionat

- [Workflows Tab](../tabs/workflows-tab.md) – Llista principal de workflows, carpetes i gestió
- [Quick Start](../getting-started/quick-start.md) – Creeu i executeu el vostre primer workflow
- [Execution History](./execution-history.md) – Reviseu execucions anteriors
- [Webhooks](./webhooks.md) – Dispareu workflows per HTTP
- [Contextual Showcase](./contextual-showcase.md) – Rail d'orientació a nivell de pàgina que complementa el Quick Drawer