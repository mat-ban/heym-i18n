# Autorizarea plugin-urilor

Plugin-urile Heym sunt pachete zip de încredere instalate de un operator. Un pachet poate
adăuga unul sau mai multe noduri personalizate de acțiune sau trigger fără a modifica aplicația de bază.

## Structura pachetului

Un zip de plugin trebuie să conțină `plugin.json` în rădăcina pachetului și fișierul de intrare Python
numit de `entry` (implicit `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` este opțional și este servit ca pagină de documentație a plugin-ului. Plasați un
`icon.svg` în rădăcina pachetului pentru pictograma implicită a nodului sau setați o cale
`icon` specifică nodului în `plugin.json`.

## Manifestul

Utilizați un `plugin.json` cu mai multe noduri atunci când un pachet expune mai multe noduri:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Manifestele legacy cu un singur nod sunt de asemenea acceptate: omiteți `nodes` și furnizați
la nivel superior `kind`, `fields`, `dslHint` și `docSlug`.

## Câmpurile manifestului

| Câmp | Note |
|-------|-------|
| `id` | Id-ul pachetului cu litere mici, folosind litere, cifre și cratime. |
| `name` | Numele pachetului într-un format ușor de citit. |
| `version` | Versiunea pachetului folosită pentru afișare și cache-ul handler-ului. |
| `description` | Descriere scurtă afișată în UI și în contextul asistentului. |
| `entry` | Calea fișierului handler Python din interiorul zip-ului; implicit `handler.py`. |
| `dependencies` | Cerințe pip opționale instalate cu `uv pip install`. |
| `nodes` | Nodurile personalizate expuse de acest pachet. |

Fiecare nod necesită un `key` unic, un `name` și un `kind` de tip `action` sau
`trigger`. Dacă `function` este omis, acțiunile apelează `run` iar trigger-ele apelează
`trigger`.

Tipurile de câmpuri acceptate sunt `string`, `number`, `boolean` și `select`. Câmpurile select
folosesc un array `options` de obiecte `{ "label": "...", "value": "..." }`.
Setați `required` pentru câmpurile obligatorii și `secret` pentru intrările mascate. Manifestul
acceptă de asemenea metadatele `default`, `dynamic` și `expression` pentru câmpuri; acestea sunt
stocate împreună cu manifestul, dar nodurile plugin-ului citesc în prezent configurația salvată a nodului
la runtime, în loc să populeze automat configurația lipsă din valorile implicite.

Câmpurile string non-secrete sunt redate cu UI-ul de introducere a expresiilor. La runtime,
orice valoare de configurare string salvată care începe cu `$` este rezolvată înainte ca handler-ul
să fie apelat.

## Funcțiile handler

Handler-ele de acțiune primesc intrările workflow-ului, configurația rezolvată și un context mic:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Handler-ele de trigger primesc configurația rezolvată și contextul:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Returnați un dicționar pentru a expune câmpuri de ieșire denumite. Dacă un handler returnează alt
tip, Heym îl împachetează ca `{ "value": result }`.

## Instalare și runtime

Plugin-urile sunt dezactivate implicit. Operatorii le activează cu
`HEYM_PLUGINS_ENABLED=true` și restricționează gestionarea la
`HEYM_PLUGIN_ADMIN_EMAILS`. Fișierele plugin-urilor instalate se află sub
`HEYM_PLUGINS_DIR` și ar trebui montate persistent în implementările containerizate.

Codul plugin-ului este Python de încredere, instalat de operator, care rulează în proces cu
backend-ul. Poate accesa rețeaua și bibliotecile instalate, așa că instalați doar
pachete pe care sunteți dispus să le rulați cu același nivel de încredere ca Heym însuși.
