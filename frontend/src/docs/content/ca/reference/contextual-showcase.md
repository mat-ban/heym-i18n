# Contextual Showcase

El **Contextual Showcase** és una guia lleugera integrada a l'aplicació que explica la pàgina on es troba en cada moment, sense conduir-lo immediatament a un flux complet de documentació.

## Què fa

- Mostra un resum breu de la pàgina actual
- Manté la primera capa concisa per no sobrecarregar-lo
- Permet ampliar una petita quantitat de detall addicional només quan cal
- Enllaça amb la pàgina completa de documentació per a una lectura més aprofundida

## On apareix

A la v1, el showcase està disponible a les superfícies principals autenticades de Heym:

- Pestanyes del Dashboard
- [Evals](../tabs/evals-tab.md)
- [Documentation](../getting-started/introduction.md)
- El canvas de l'editor de workflow

Les pàgines públiques com ara login, registre, portal de Chat i revisió HITL no mostren el showcase.

## Accés

### Escriptori

- Un trigger fix **Page Guide** apareix a la vora dreta de la pantalla
- El showcase s'obre com un calaix lateral dret
- Es manté tancat per defecte
- Un teaser d'una sola vegada ajuda a revelar que la guia existeix sense forçar-ne l'obertura

### Mòbil

- El mateix contingut està disponible des d'un botó flotant **Page Guide**
- S'obre en un full inferior en lloc d'un rail dret

## Model de contingut

Cada entrada del showcase utilitza una definició estructurada en lloc d'un component completament personalitzat.

- **Title** – Què és aquesta pàgina
- **Summary** – Una explicació breu
- **Bullets** – Uns quants senyals fàcils de llegir
- **Highlights** – Targetes petites per a valors clau o patrons d'ús
- **More Detail** – Seccions plegades per a context addicional
- **Actions** – Normalment un o dos enllaços, sovint cap a la documentació completa

Això manté el sistema flexible alhora que evita panells d'ajuda llargs i sorollosos.

## Consciència del context

El showcase canvia segons la superfície actual.

- Cada pestanya del Dashboard té el seu propi resum
- L'editor apunta a [Canvas Features](./canvas-features.md)
- La pàgina de docs utilitza una visió general genèrica de la documentació i, quan és possible, apunta a l'article actual que ja té obert

## Persistència

El showcase emmagatzema una petita quantitat d'estat personal de la interfície a l'emmagatzematge del navegador:

- Si el panell o el full estava obert per última vegada
- Quins contextos de pàgina ja han mostrat el teaser
- L'última secció de detall ampliada per context

## Per què existeix

L'objectiu és fer que Heym sigui més fàcil d'aprendre sense afegir més elements pesants a la interfície.

- Orientació breu i sempre a mà
- Camí clar cap a documentació més aprofundida
- Baixa interrupció per als usuaris experimentats

## Relacionat

- [Workflows Tab](../tabs/workflows-tab.md) – Superfície principal del Dashboard
- [Evals Tab](../tabs/evals-tab.md) – Workflows d'avaluació
- [Canvas Features](./canvas-features.md) – Comportament de l'editor i depuració
- [Quick Drawer](./quick-drawer.md) – L'altra superfície d'utilitat fixa a la dreta