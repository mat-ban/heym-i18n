# Google Meet

Encontre intervalos disponíveis no Google Calendar e crie, atualize ou exclua convites de reuniões com links do Google Meet, e-mails dos participantes e horários selecionados. A conta Google conectada é a proprietária do evento; os participantes recebem os convites por e-mail.

## Conectar sua conta

1. No [Google Cloud Console](https://console.cloud.google.com), habilite a **Google Calendar API**.
2. Configure a tela de consentimento OAuth e crie um cliente OAuth do tipo **Aplicativo Web**. Adicione sua conta Google como usuário de teste caso o app esteja em modo de teste.
3. Registre `https://your-heym-domain/api/credentials/google-meet/oauth/callback` como URI de redirecionamento autorizado. Para desenvolvimento local, use a origem do Heym no seu navegador com o mesmo caminho.
4. Abra **Dashboard → Credenciais → Novo → Google Meet (OAuth2)**, digite um nome, Client ID e Client Secret, clique em **Conectar** e faça login com o Google.
5. Conceda ambas as permissões: Eventos de agenda (`calendar.events`) e disponibilidade de agenda (`calendar.events.freebusy`). Selecione essa credencial no nó.

Os tokens são criptografados no armazenamento e renovados automaticamente. Esta é uma credencial separada do Google AI, Sheets ou Drive. Uma agenda deve suportar videoconferências do Google Meet para que a criação tenha sucesso.

## Operações

| Operação | Comportamento | Campos obrigatórios |
| --- | --- | --- |
| `read` | Retornar intervalos livres e ocupados de uma agenda | Credencial |
| `create` | Criar um evento agendado com uma nova videoconferência Meet e convites por e-mail | Título, horário de início, horário de término |
| `update` | Atualizar os campos fornecidos do evento e notificar os convidados | ID do evento e pelo menos um campo alterado |
| `delete` | Excluir o evento e notificar os convidados sobre o cancelamento | ID do evento |

## Configuração

Os campos de texto abaixo aceitam expressões. Todos os campos, incluindo a opção booleana de detalhes, podem ser fornecidos por um Agent quando este nó é anexado como ferramenta.

| Campo | Padrão | Finalidade |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Agenda principal da conta conectada, ou ID/e-mail de agenda acessível |
| `gmTimeZone` | `UTC` | Fuso IANA, como `America/Sao_Paulo`, usado para datas locais e tempos de resposta |
| `gmStartDate` | Horário atual | Início do intervalo de leitura, como data ISO ou datetime |
| `gmEndDate` | Primeiro dia do mês seguinte à meia-noite | Término exclusivo do intervalo de leitura; o intervalo máximo é de 60 dias corridos |
| `gmIncludeBusyDetails` | `false` | Somente leitura: incluir títulos de eventos e participantes em `busy_slots`; booleano, não é campo de expressão |
| `gmEventId` | Vazio | ID do evento de agenda para update/delete; use o `event_id` retornado, não uma URL do Meet |
| `gmTitle` | Vazio | Título do convite; obrigatório em `create` |
| `gmDescription` | Vazio | Descrição do convite |
| `gmStartTime` | Vazio | Início da reunião, por exemplo `2026-11-10T14:00:00-03:00` |
| `gmEndTime` | Vazio | Término da reunião; deve ser após o início |
| `gmAttendees` | Vazio | E-mails separados por vírgula/ponto e vírgula/quebra de linha ou array JSON de strings de e-mail |
| `gmLocation` | Vazio | Localização opcional da reunião além da videoconferência Meet |

### Intervalos de tempo disponíveis

A leitura padrão abrange do horário atual até o **dia 1º do mês seguinte às 00:00**, no fuso horário selecionado. Passe `gmEndDate` para definir uma janela diferente. Um intervalo superior a 60 dias ou uma data inválida é rejeitado antes de chamar o Google.

O resultado é baseado na API **free/busy** do Google. Os intervalos ocupados são mesclados e subtraídos da janela solicitada. `available_slots` contém intervalos contínuos com carimbos de data/hora `start` e `end`.

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

Em **Ler intervalos de tempo disponíveis**, ative **Incluir detalhes de eventos ocupados** (`gmIncludeBusyDetails: true`) para adicionar o título e os participantes a cada slot ocupado. Essa opção fica desativada por padrão.

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

1. Execute um nó `read` com as credenciais do proprietário do workflow.
2. Exiba `available_slots` na sua interface de agendamento.
3. Passe `email`, `startTime` e `endTime` como entradas do workflow.
4. Execute `create` com as mesmas credenciais. O visitante não precisa de conta Google; seu e-mail é registrado como participante.

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

Utilize `$Availability.available_slots` ou `$Booking.meet_url` em nós downstream. Toda operação também retorna `status: "success"` e sua respectiva `operation`.

## Relacionados

- [Credentials](../reference/credentials.md)
- [Integrações](../reference/integrations.md)
- [Compartilhamento de Credenciais](../reference/credentials-sharing.md)
- [Entrada](input-node.md)
- [Saída](output-node.md)
