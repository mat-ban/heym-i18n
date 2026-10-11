# Xat amb Heym

El Xat amb Heym és un assistent conscient de la pàgina disponible des de la capçalera de la documentació. S'obre en un diàleg centrat, permet seleccionar una credencial i un model d'LLM, i respon a les preguntes utilitzant la pàgina de documentació actual com a primer context.

## Obrir el diàleg

1. Obriu qualsevol pàgina sota `/docs`
2. Feu clic a **Xat amb Heym** a la capçalera
3. Seleccioneu una [credencial](../tabs/credentials-tab.md) i un model
4. Formuleu una pregunta sobre la pàgina o sobre la plataforma

En pantalles petites, el trigger només mostra la icona; en pantalles més grans, mostra l'etiqueta completa.

## Quin context utilitza

- La ruta de documentació oberta actualment s'injecta a la sol·licitud com a guia contextual
- El backend continua utilitzant l'endpoint de xat existent del tauler i les eines de cerca de documentació
- Les vostres [Regles d'usuari](./user-settings.md) a nivell de compte continuen aplicant-se, ja que es reutilitza el mateix backend de xat
- Els passos de preparació en directe es transmeten a la bombolla de l'assistent abans de la resposta final, de manera similar al xat del tauler
- Les preguntes d'aclariment apareixen com a targetes, igual que a la [pestanya Xat](../tabs/chat-tab.md). Quan una sol·licitud de workflow necessita una credencial, podeu seleccionar-ne una o crear-la des de la targeta. Quan necessita una taula de dades, podeu seleccionar una de les vostres taules o crear-ne una de nova de la mateixa manera.

Quan obriu el diàleg en un article concret, una petita etiqueta mostra la ruta de documentació activa perquè pugueu confirmar quina pàgina s'està prioritzant.

## Comportament de la sessió

- La selecció de credencial i model es manté mentre el diàleg estigui muntat
- L'historial de missatges és només de sessió i s'esborra quan es tanca el diàleg
- El clic al fons, `Escape` i el botó de tancament reinicien la sessió
- **Atura** avorta la resposta en streaming actual
- El diàleg és intencionadament ampli i de mida fixa; no ofereix una opció de pantalla completa

## Quan utilitzar-lo

- Formuleu preguntes de seguiment mentre llegiu una pàgina de node o de referència
- Aclariu diferències entre funcionalitats sense sortir de la documentació
- Trobeu l'article adequat abans d'obrir l'editor

Si voleu construir o modificar workflows directament, utilitzeu l'[Assistent d'IA](./ai-assistant.md) de l'editor.

## Relacionat

- [Assistent d'IA](./ai-assistant.md) – Xat de l'editor per construir workflows
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu credencials d'LLM utilitzades pel diàleg
- [Configuració](./user-settings.md) – Regles d'usuari globals aplicades a les superfícies d'IA
- [Inici ràpid](../getting-started/quick-start.md) – Primera guia pas a pas d'un workflow