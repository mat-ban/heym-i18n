# Scheda Teams

La scheda **Teams** consente di creare e gestire team per condividere workflow, credenziali, variabili, archivi vettoriali e file di Drive con gruppi di utenti.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Guarda la demo di Teams</a></p>

## Creazione di un team

1. Fare clic su **New Team**
2. Inserire un nome e una descrizione opzionale
3. Fare clic su **Create**

Si diventa automaticamente il creatore del team e il primo membro.

## Gestione dei membri

- **Aggiungi membro** – Inserire l'email di un utente nella finestra di dettaglio del team e fare clic su **Add**
- **Rimuovi membro** – Fare clic sulla X accanto a un membro (il creatore non può essere rimosso)
- **Modifica team** – I creatori possono modificare nome e descrizione
- **Elimina team** – I creatori possono eliminare il team; tutte le condivisioni del team vengono rimosse
- **Risorse condivise** – La finestra di dettaglio del team mostra workflow, credenziali, variabili, archivi vettoriali, file di Drive, modelli di workflow e modelli di nodo condivisi con il team. Fare clic su un workflow per aprirlo nell'editor; passare alla scheda pertinente per le altre risorse.

## Condivisione con i team

Condividere le risorse con i team da:

- **Workflows** – Finestra di condivisione nell'editor del workflow
- **Workflow Templates** – Finestra di condivisione durante la creazione/modifica di un modello di workflow (visibilità: Specific users)
- **Node Templates** – Finestra di condivisione durante la creazione/modifica di un modello di nodo (visibilità: Specific users)
- **Credentials** – Finestra di condivisione nella scheda Credentials
- **Variables** – Finestra di condivisione nella scheda Variables
- **Vector Stores** – Finestra di condivisione nella scheda Vectors
- **Dashboards** – Impostazioni della dashboard nella scheda Dashboard (lettura o scrittura)
- **Drive Files** – Finestra di condivisione nella scheda Drive o operazioni `shareWithMyTeams` / `unshareWithMyTeams` del nodo Drive

Quando si condivide con un team, tutti i membri del team ottengono l'accesso. Per i dettagli, consultare [Teams](../reference/teams.md).

Quando si condivide un workflow con un team, condividere con lo stesso team anche le credenziali e i sub-workflow da cui il workflow dipende. Il solo accesso al workflow non concede l'accesso alle credenziali o ai workflow figlio.

## Integrazione con Chat

L'assistente IA della [scheda Chat](./chat-tab.md) può elencare i team. Chiedere "my teams" per visualizzare i team di appartenenza.

## Correlati

- [Teams](../reference/teams.md) – Riferimento sui team e modello di condivisione
- [Credentials Sharing](../reference/credentials-sharing.md) – Condividere credenziali con utenti e team
- [Workflow Organization](../reference/workflow-organization.md) – Cartelle e condivisione
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta alle pagine per le superfici della dashboard
