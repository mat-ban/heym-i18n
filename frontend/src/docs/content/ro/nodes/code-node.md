# Cod

Nodul **Cod** rulează cod Python scris de dumneavoastră, cu propriul fișier `requirements.txt`, și returnează JSON. Fiecare execuție primește un container complet nou, care este distrus la finalul rulării, astfel încât o execuție nu poate vedea sau afecta niciodată o altă execuție.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.result` (ceea ce a returnat `main`), plus `$nodeLabel.logs` și `$nodeLabel.install` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `codeSource` | string | Codul sursă Python. Trebuie să definească `main(params)` și să returneze o valoare serializabilă JSON |
| `codeParameters` | expression | Un obiect JSON care conectează datele din workflow la cod. Expresiile sunt rezolvate înainte de rularea codului |
| `codeRequirements` | string | Conținutul fișierului `requirements.txt`, un pachet pe linie. Dacă este gol, instalarea este omisă |
| `codeAllowNetwork` | boolean | Dacă codul în sine poate accesa rețeaua (implicit `false`) |

## Funcția `main`

Codul dumneavoastră trebuie să definească o funcție `main` la nivel superior, care primește un singur argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Instrucțiunile la nivel de modul sunt executate, dar doar ceea ce returnează `main` devine ieșirea nodului.

Editorul afișează numerele de linie, iar butonul de extindere de lângă **Format** deschide un editor mai mare care se închide cu `Esc` — modificările se aplică pe măsură ce tastați, deci nu există nimic de salvat. Butonul **Format** reformatează codul cu Ruff, păstrând comentariile. De asemenea, repară daunele de indentare cauzate de obicei de lipire: un bloc indentat uniform, tabulatori amestecați cu spații și o linie deplasată cu unul sau două spații față de blocul său sunt toate corectate în loc să fie respinse. O eroare de sintaxă autentică este raportată împreună cu linia și coloana sa. Formatarea rulează în același container izolat în care rulează nodul — fără rețea, fără mediul backend — deci necesită Docker exact ca și execuția.

## Citirea parametrilor

`params` acceptă notația cu punct, inclusiv prin obiecte și liste imbricate:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` citește chei care nu sunt identificatori Python valizi
- `params.get("maybe")` returnează `None` în loc să genereze o eroare când o cheie lipsește
- `params.to_dict()` returnează dicționarul simplu
- Citirea unei chei care nu a fost furnizată niciodată generează o eroare care numește cheia și enumeră ce este disponibil

## Ieșire

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — valoarea returnată de `main`. Nodurile din aval citesc `$nodeLabel.result.message`
- `logs` — tot ce codul a trimis către `print`, capturat separat astfel încât să nu corupă niciodată rezultatul
- `install` — ce instrument a instalat dependențele (`uv`, `pip` sau `none`) și ieșirea acestuia

## Dependențe

Enumerați pachetele în `requirements.txt` exact așa cum ați face-o local:

```
requests==2.32.3
feedparser
```

Pachetele sunt instalate cu `uv` într-un director temporar înainte de rularea codului; dacă `uv` nu poate gestiona un pachet, Heym reîncearcă cu `pip`. Nimic nu este stocat în cache între rulări, deci dependențele grele adaugă câteva secunde la fiecare execuție. Lăsarea fișierului `requirements.txt` gol omite complet pasul de instalare și este vizibil mai rapidă.

Pachetele care nu includ un wheel și necesită un compilator C nu vor putea fi instalate. Motivul apare în `install.log`.

## Rețea

| Fază | Rețea |
|-------|---------|
| Instalarea dependențelor | Întotdeauna activă — pip și uv trebuie să ajungă la PyPI |
| Rularea codului dumneavoastră | Dezactivată implicit. `codeAllowNetwork` o activează |

Cu `codeAllowNetwork` dezactivat, un apel către exterior precum `requests.get(...)` eșuează cu o eroare de conexiune. Acesta este comportamentul implicit dorit: majoritatea nodurilor Cod transformă date pe care un alt nod le-a preluat deja. Preferați să preluați datele cu un nod **HTTP** și să transmiteți corpul prin `codeParameters`.

## Sandbox și limite

Codul dumneavoastră rulează ca utilizator non-root într-un container cu toate capabilitățile Linux eliminate, `no-new-privileges` setat și un sistem de fișiere root read-only. Nu primește nici un socket Docker și niciunul dintre secretele sau variabilele de mediu ale backend-ului.

| Limită | Valoare |
|-------|-------|
| Memorie | 512 MB |
| CPU-uri | 1 |
| Procese | 256 |
| Timeout pentru instalarea dependențelor | 120 secunde |
| Timeout pentru execuție | 60 secunde |

Acestea sunt proprietăți fixe ale sandbox-ului, nu configurații.

> **Docker este necesar.** Spre deosebire de instrumentele și abilitățile Agent Python, nodul Cod nu are mod de rezervă local și nicio variabilă de mediu pentru a-l relaxa. Fără un daemon Docker accesibil, nodul eșuează cu o eroare clară în loc să ruleze codul dumneavoastră în procesul backend. În dezvoltarea nativă cu `./run.sh`, porniți Docker înainte de a utiliza acest nod. Consultați [Securitate → Sandbox-ul nodului Cod](../reference/security.md#code-node-sandbox).

## Utilizați un alt nod când unul se potrivește

| Doriți să | Utilizați |
|-------------|-----|
| Analizați sau construiți CSV, TSV, XML sau aplicați OCR unui fișier | [Converter](converter-node.md) |
| Apelați un API HTTP | [HTTP](http-node.md) |
| Mapati sau redenumiți câmpuri | [Set](set-node.md) |
| Rulați un alt workflow | [Execute](execute-node.md) |

Apelați la **Cod** atunci când logica nu se potrivește cu adevărat acestora — calcule personalizate, analiză sintactică specifică sau un algoritm.
## Exemplu

Rândurile de scor generate de un nod amonte:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Cu `codeParameters` setat la `{ "rows": "$fetchRows.result" }`, nodurile din aval citesc `$scoreRows.result.total`.
