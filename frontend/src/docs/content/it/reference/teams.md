# Teams

I Teams consentono di condividere workflow, credenziali, variabili globali, archivi vettoriali e file di Drive con un gruppo di utenti contemporaneamente.

## Panoramica

- **Team** – Un gruppo denominato con un creatore e dei membri
- **Creatore** – È sempre un membro; può modificare il team, eliminare il team e aggiungere membri
- **Membro** – Può aggiungere e rimuovere altri membri (eccetto il creatore); ha accesso alle risorse condivise con il team

## Creazione e gestione dei Teams

Creare i team dalla [scheda Teams](../tabs/teams-tab.md). Aggiungere i membri tramite email; questi devono disporre di un account. Il creatore non può essere rimosso. L'eliminazione di un team rimuove tutte le condivisioni del team.

## Modello di condivisione

Le risorse possono essere condivise con:

1. **Utenti singoli** – Tramite email (condivisione da utente a utente)
2. **Teams** – Selezionando un team (condivisione di team)

Entrambi i modelli sono additivi. Un utente ottiene l'accesso se è:

- Destinatario diretto della condivisione (condivisione utente), oppure
- Membro di un team che dispone di una condivisione di team

## Cosa può essere condiviso con i Teams

| Risorsa | Posizione della condivisione |
|----------|----------------|
| Workflows | Finestra di condivisione nell'editor dei workflow |
| Modelli di workflow | Finestra di condivisione durante la creazione/modifica di un modello di workflow |
| Modelli di nodo | Finestra di condivisione durante la creazione/modifica di un modello di nodo |
| Credenziali | Finestra di condivisione nella scheda Credenziali |
| Variabili globali | Finestra di condivisione nella scheda Variabili |
| Archivi vettoriali | Finestra di condivisione nella scheda Vectors |
| File di Drive | Finestra di condivisione nella scheda Drive oppure operazioni `shareWithMyTeams` / `unshareWithMyTeams` del Nodo Drive |

Per i modelli, quando la visibilità è impostata su **Utenti specifici**, è inoltre possibile selezionare dei team. Tutti i membri dei team selezionati ottengono l'accesso al modello.
Le condivisioni di team dei file di Drive sono di sola lettura per i membri del team; il proprietario del file mantiene i permessi di gestione.

## Endpoint API

- `GET /api/teams` – Elenca i team a cui appartiene l'utente
- `GET /api/teams/{id}` – Recupera i dettagli del team con i relativi membri
- `GET /api/teams/{id}/shared-entities` – Restituisce le entità condivise con il team (workflow, credenziali, variabili globali, archivi vettoriali, file, modelli di workflow, modelli di nodo)
- `POST /api/teams` – Crea un team
- `PATCH /api/teams/{id}` – Aggiorna un team
- `DELETE /api/teams/{id}` – Elimina un team (solo il creatore)
- `POST /api/teams/{id}/members` – Aggiunge un membro (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Rimuove un membro

Condivisioni di team per risorsa:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – il body della POST accetta `permission` (`read` o `write`, predefinito `write`); inviando nuovamente un team già presente se ne aggiorna il permesso
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Correlati

- [Scheda Teams](../tabs/teams-tab.md) – Creare e gestire i team
- [Scheda Modelli](../tabs/templates-tab.md) – Condividere modelli di workflow e di nodo con i team
- [Condivisione delle credenziali](./credentials-sharing.md) – Condividere le credenziali con utenti e team
- [Organizzazione dei workflow](./workflow-organization.md) – Cartelle e condivisione dei workflow