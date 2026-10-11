# Paralleelne täitmine

Heym käivitab sõlmi paralleelselt, kui neil puuduvad üksteisest sõltuvused, ning võimaldab mitmel workflow käivitusel samaaegselt toimida.

## Ühe käivituse piires

### DAG-põhine ajastamine

Täitja rühmitab sõlmed **täitmistaseme** järgi, kasutades suunatud atsüklilist graafi (DAG):

1. **Tase 0** – sõlmed, millel puuduvad sisenevad servad (algussõlmed)
2. **Tase N** – sõlmed, mille ülesvoolu sõltuvused asuvad kõik tasemetel 0..N-1

Sama taseme sõlmedel puuduvad üksteisest sõltuvused ning need käivitatakse paralleelselt.

### Lõimede hulk

- **Jagatud hulk**: `ThreadPoolExecutor(max_workers=8)` sõlmede täitmiseks
- **Ajastamine**: `wait(..., return_when=FIRST_COMPLETED)` – niipea kui mõni sõlm lõpetab, ajastatakse allavoolu sõlmed
- **Lõimkindel**: sõlmede väljundid salvestatakse lukuga (`store_node_output`)

### Orkestraatori alamagendid

Kui orkestraatori agent tagastab ühe käigu jooksul mitu `call_sub_agent` tööriistakutset, käivitatakse need paralleelselt. Vt [Agendi arhitektuur](./agent-architecture.md).

### Ühendamise sõlm

[Ühendamise](../nodes/merge-node.md) sõlm ühendab väljundid mitmest paralleelsest harust. Kasutage seda, kui on otseselt vaja tulemusi ühendada; vastasel juhul võivad paralleelsed harud lõppeda eraldi väljundsõlmedes.

### Tsüklid

Tsükli iteratsioonid käivitatakse **järjestikku**. Tsükli keha sõlmed ajastatakse iga iteratsiooni jaoks uuesti.

### Varajane tagastamine

Väljundsõlmed, millel on `allowDownstream`, saavad tagastada varakult. Ülejäänud allavoolu töö käivitatakse taustal.

## Samaaegsed workflow käivitused

- **Workflow-põhine lukk puudub** – mitu päringut saavad sama workflow'd samal ajal käivitada
- **Asünkroonne API** – FastAPI endpointid kasutavad `asyncio.to_thread(execute_workflow)`, et sündmuste tsükkel püsiks reageeriv
- **Isolatsioon** – iga käivitus saab oma `WorkflowExecutor` eksemplari ja oleku

Triggerid, mis käivitavad workflow'sid ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Redaktor), kutsuvad igaüks eraldi `execute_workflow` funktsiooni.

## Voogedastus

Voogedastus kasutab sama paralleelset mudelit, kuid edastab sündmusi sõlmede lõpetamisel. Redaktori ja portali chat-liides kasutavad voogedastust sisemiselt reaalajas edenemise näitamiseks ning webhooki kasutajad saavad nüüd sama sündmustevoogu kasutusele võtta [SSE voogedastuse](./sse-streaming.md) execute endpointi kaudu.

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – Paralleelne DAG-täitmine Heymi runtime'is
- [Workflow struktuur](./workflow-structure.md) – Sõlmed, servad ja täitmise voog
- [Põhikontseptsioonid](../getting-started/core-concepts.md) – Täitmise voo ülevaade
- [Sõlmede tüübid](./node-types.md) – [Ühendamise](../nodes/merge-node.md) sõlm ja muud tüübid
- [Triggerid](./triggers.md) – Käivituspunktid, mis triggerdavad käivitusi
- [SSE voogedastus](./sse-streaming.md) – Sündmustevoo formaat `/execute/stream` jaoks
