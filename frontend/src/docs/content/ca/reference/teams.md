# Equips

Els equips permeten compartir workflows, credencials, variables globals, magatzems vectorials i fitxers de Drive amb un grup d'usuaris alhora.

## Visió general

- **Equip** – Un grup amb nom amb un creador i membres
- **Creador** – Sempre és membre; pot editar l'equip, eliminar l'equip i afegir membres
- **Membre** – Pot afegir i eliminar altres membres (excepte el creador); té accés als recursos compartits amb l'equip

## Creació i gestió d'equips

Creeu equips des de la [pestanya Equips](../tabs/teams-tab.md). Afegiu membres per correu electrònic; han de tenir un compte. El creador no es pot eliminar. Eliminar un equip elimina tots els compartits de l'equip.

## Model de compartició

Els recursos es poden compartir amb:

1. **Usuaris individuals** – Per correu electrònic (compartició d'usuari a usuari)
2. **Equips** – Seleccionant un equip (compartició d'equip)

Tots dos models són additius. Un usuari obté accés si:

- Se li ha compartit directament (compartició d'usuari), o
- És membre d'un equip que té una compartició d'equip

## Què es pot compartir amb equips

| Recurs | Ubicació de la compartició |
|----------|----------------|
| Workflows | Diàleg de compartició a l'editor de workflows |
| Plantilles de workflow | Diàleg de compartició en crear/editar una plantilla de workflow |
| Plantilles de node | Diàleg de compartició en crear/editar una plantilla de node |
| Credencials | Diàleg de compartició a la pestanya Credencials |
| Variables globals | Diàleg de compartició a la pestanya Variables |
| Magatzems vectorials | Diàleg de compartició a la pestanya Vectors |
| Fitxers de Drive | Diàleg de compartició a la pestanya Drive o operacions `shareWithMyTeams` / `unshareWithMyTeams` del node Drive |

Per a les plantilles, quan la visibilitat és **Usuaris específics**, també podeu seleccionar equips. Tots els membres dels equips seleccionats obtenen accés a la plantilla.
Les comparticions d'equip de fitxers de Drive són de només lectura per als membres de l'equip; el propietari del fitxer conserva els permisos de gestió.

## Endpoints de l'API

- `GET /api/teams` – Llista els equips als quals pertany l'usuari
- `GET /api/teams/{id}` – Obté els detalls de l'equip amb els membres
- `GET /api/teams/{id}/shared-entities` – Retorna les entitats compartides amb l'equip (workflows, credencials, variables globals, magatzems vectorials, fitxers, plantilles de workflow, plantilles de node)
- `POST /api/teams` – Crea un equip
- `PATCH /api/teams/{id}` – Actualitza un equip
- `DELETE /api/teams/{id}` – Elimina un equip (només el creador)
- `POST /api/teams/{id}/members` – Afegeix un membre (cos: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Elimina un membre

Comparticions d'equip per recurs:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – el cos del POST accepta `permission` (`read` o `write`, per defecte `write`); tornar a publicar un equip existent n'actualitza el permís
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Relacionat

- [Pestanya Equips](../tabs/teams-tab.md) – Creeu i gestioneu equips
- [Pestanya Plantilles](../tabs/templates-tab.md) – Compartiu plantilles de workflow i de node amb equips
- [Compartició de credencials](./credentials-sharing.md) – Compartiu credencials amb usuaris i equips
- [Organització de workflows](./workflow-organization.md) – Carpetes i compartició de workflows