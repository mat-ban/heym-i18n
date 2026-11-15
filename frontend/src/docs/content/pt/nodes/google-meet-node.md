# Google Meet

Encontre intervalos disponíveis no Google Calendar e crie, atualize ou elimine convites para reuniões com links do Google Meet, e-mails dos participantes e horários selecionados. A conta Google associada é a proprietária do evento; os participantes recebem os convites por e-mail.

## Associar a sua conta

1. Na [Google Cloud Console](https://console.cloud.google.com), ative a **Google Calendar API**.
2. Configure o ecrã de consentimento OAuth e crie um cliente OAuth para **Aplicação Web**. Adicione a sua conta Google como utilizador de teste caso a aplicação esteja em modo de teste.
3. Registe `https://your-heym-domain/api/credentials/google-meet/oauth/callback` como URI de redirecionamento autorizada. Para desenvolvimento local, utilize a origem do Heym no seu browser com o mesmo caminho.
4. Aceda a **Dashboard → Credenciais → Novo → Google Meet (OAuth2)**, introduza um nome, Client ID e Client Secret, clique em **Associar** e inicie sessão com o Google.
5. Conceda ambas as permissões: Eventos de calendário (`calendar.events`) e disponibilidade de calendário (`calendar.events.freebusy`). Selecione esta credencial no nó.

Os tokens são encriptados no armazenamento e renovados automaticamente. Esta é uma credencial separada do Google AI, Sheets ou Drive. Um calendário tem de suportar videoconferências Google Meet para que a criação seja bem-sucedida.

## Operações

| Operação | Comportamento | Campos obrigatórios |
| --- | --- | --- |
| `read` | Devolver intervalos livres e ocupados de um calendário | Credencial |
| `create` | Criar um evento agendado com uma nova conferência Meet e convites por e-mail | Título, hora de início, hora de fim |
| `update` | Atualizar os campos fornecidos do evento e notificar os convidados | ID do evento e pelo menos um campo alterado |
| `delete` | Eliminar o evento e notificar os convidados do cancelamento | ID do evento |

## Configuração

Os campos de texto abaixo aceitam expressões. Todos os campos, incluindo a opção booleana de detalhes, podem ser fornecidos por um Agent quando este nó é anexado como ferramenta.

| Campo | Predefinição | Finalidade |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Calendário principal da conta associada, ou ID/e-mail de calendário acessível |
| `gmTimeZone` | `UTC` | Fuso horário IANA, como `Europe/Lisbon`, utilizado para datas locais e tempos de resposta |
| `gmStartDate` | Hora atual | Início do intervalo de leitura, como data ISO ou datetime |
| `gmEndDate` | Primeiro dia do mês seguinte à meia-noite | Fim exclusivo do intervalo de leitura; o intervalo máximo é de 60 dias de calendário |
| `gmIncludeBusyDetails` | `false` | Apenas leitura: incluir títulos de eventos e participantes em `busy_slots`; booleano, não é um campo de expressão |
| `gmEventId` | Vazio | ID do evento de calendário para update/delete; utilize o `event_id` devolvido, não um URL do Meet |
| `gmTitle` | Vazio | Título do convite; obrigatório em `create` |
| `gmDescription` | Vazio | Descrição do convite |
| `gmStartTime` | Vazio | Início da reunião, por exemplo `2026-11-10T14:00:00+01:00` |
| `gmEndTime` | Vazio | Fim da reunião; deve ser posterior ao início |
| `gmAttendees` | Vazio | E-mails separados por vírgula/ponto e vírgula/quebra de linha ou array JSON de strings de e-mail |
| `gmLocation` | Vazio | Localização opcional da reunião além da conferência Meet |

### Intervalos de tempo disponíveis

A leitura predefinida abrange desde a hora atual até ao **dia 1 do mês seguinte às 00:00**, no fuso horário selecionado. Passe `gmEndDate` para definir um intervalo diferente. Um intervalo superior a 60 dias ou uma data inválida é rejeitado antes de chamar o Google.

O resultado tem por base a API **free/busy** da Google. Os intervalos ocupados são consolidados e subtraídos à janela solicitada. O campo `available_slots` contém intervalos contínuos com carimbos de data/hora `start` e `end`.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Availability",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "read",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmStartDate": "2026-11-06",
    "gmEndDate": "2026-11-13"
  }
}
```

### Incluir detalhes de eventos ocupados

Em **Ler intervalos de tempo disponíveis**, ative **Incluir detalhes de eventos ocupados** (`gmIncludeBusyDetails: true`) para adicionar o título e os participantes a cada intervalo ocupado. Esta opção está desativada por predefinição.

```json
{
  "start": "2026-11-06T21:15:00+01:00",
  "end": "2026-11-06T21:30:00+01:00",
  "title": "Daily check-in",
  "attendees": [
    "colleague@example.com"
  ]
}
```

### Agendar uma reunião

1. Execute um nó `read` com a credencial do proprietário do workflow.
2. Apresente `available_slots` na sua interface de agendamento.
3. Transmita `email`, `startTime` e `endTime` como entradas do workflow.
4. Execute `create` com a mesma credencial. O visitante não necessita de conta Google; o seu e-mail é registado como participante.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Booking",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "create",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmTitle": "Meet with me",
    "gmDescription": "A meeting booked through Heym",
    "gmAttendees": "$input.email",
    "gmStartTime": "$input.startTime",
    "gmEndTime": "$input.endTime"
  }
}
```

## Saída

| Operação | Campos de saída |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Utilize `$Availability.available_slots` ou `$Booking.meet_url` em nós a jusante. Cada operação também devolve `status: "success"` e a respetiva `operation`.

## Relacionados

- [Credenciais](../reference/credentials.md)
- [Integrações](../reference/integrations.md)
- [Compartilhamento de Credenciais](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Saída](output-node.md)
