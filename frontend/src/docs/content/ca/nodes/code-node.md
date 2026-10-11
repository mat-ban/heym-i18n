# Codi

El node **Code** executa el Python que escriviu, amb el seu propi `requirements.txt`, i retorna JSON. Cada execució obté un contenidor completament nou que es destrueix en finalitzar l'execució, de manera que una execució no pot veure ni afectar mai una altra.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.result` (allò que hagi retornat `main`), més `$nodeLabel.logs` i `$nodeLabel.install` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `codeSource` | string | Codi font Python. Ha de definir `main(params)` i retornar un valor serialitzable a JSON |
| `codeParameters` | expression | Un objecte JSON que connecta les dades del workflow amb el codi. Les expressions es resolen abans que s'executi el codi |
| `codeRequirements` | string | Contingut de `requirements.txt`, un paquet per línia. Si és buit, s'omet la instal·lació |
| `codeAllowNetwork` | boolean | Si el codi mateix pot accedir a la xarxa (per defecte `false`) |

## La funció `main`

El vostre codi ha de definir una funció `main` de nivell superior que rebi un argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Les instruccions a nivell de mòdul sí que s'executen, però només allò que retorna `main` esdevé la sortida del node.

L'editor mostra els números de línia, i el botó d'expansió que hi ha al costat de **Format** n'obre un de més gran que es tanca amb `Esc` — les edicions s'apliquen a mesura que escriviu, de manera que no hi ha res a desar. El botó **Format** reformata el vostre codi amb Ruff, preservant els comentaris. També repara el dany d'indentació que habitualment causa en enganxar: un bloc uniformement indentat, tabulacions barrejades amb espais, i una línia desplaçada un espai o dos respecte del seu bloc es corregeixen en lloc de rebutjar-se. Un error de sintaxi genuí es reporta amb la seva línia i columna. El formatatge s'executa al mateix contenidor aïllat on s'executa el node — sense xarxa, sense entorn de backend — de manera que necessita Docker igual que l'execució.

## Lectura de paràmetres

`params` admet notació de punt, incloent-hi objectes niats i llistes:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` llegeix claus que no són identificadors Python vàlids
- `params.get("maybe")` retorna `None` en lloc de generar un error quan una clau és absent
- `params.to_dict()` retorna el diccionari pla
- Llegir una clau que no s'ha proporcionat mai genera un error que anomena la clau i llista què hi ha disponible

## Sortida

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — el valor de retorn de `main`. Els nodes posteriors llegeixen `$nodeLabel.result.message`
- `logs` — tot allò que el codi ha enviat a `print`, capturat per separat perquè no corrompi mai el resultat
- `install` — quina eina ha instal·lat les dependències (`uv`, `pip` o `none`) i la seva sortida

## Dependències

Llisteu els paquets a `requirements.txt` exactament com ho faríeu localment:

```
requests==2.32.3
feedparser
```

Els paquets s'instal·len amb `uv` en un directori d'un sol ús abans que s'executi el codi; si `uv` no pot gestionar un paquet, Heym ho reintenta amb `pip`. No es guarda res a la memòria cau entre execucions, de manera que les dependències pesades afegeixen diversos segons a cada execució. Deixar `requirements.txt` buit omet completament el pas d'instal·lació i és notablement més ràpid.

Els paquets que no inclouen cap wheel i necessiten un compilador de C fallaran en instal·lar-se. El motiu apareix a `install.log`.

## Xarxa

| Fase | Xarxa |
|-------|---------|
| Instal·lació de dependències | Sempre activa — pip i uv han d'arribar a PyPI |
| Execució del vostre codi | Desactivada per defecte. `codeAllowNetwork` l'activa |

Amb `codeAllowNetwork` desactivat, una crida de sortida com `requests.get(...)` falla amb un error de connexió. Aquest és el comportament per defecte previst: la majoria de nodes Code transformen dades que un altre node ja ha obtingut. Preferiu obtenir-les amb un node **HTTP** i passar el cos a través de `codeParameters`.

## Sandbox i límits

El vostre codi s'executa com a usuari no root en un contenidor amb totes les capacitats de Linux eliminades, `no-new-privileges` establert, i un sistema de fitxers arrel de només lectura. No rep cap socket de Docker ni cap dels secrets o l'entorn del backend.

| Límit | Valor |
|-------|-------|
| Memòria | 512 MB |
| CPUs | 1 |
| Processos | 256 |
| Temps d'espera d'instal·lació de dependències | 120 segons |
| Temps d'espera d'execució | 60 segons |

Aquestes són propietats fixes del sandbox, no configuració.

> **Cal Docker.** A diferència de les eines i habilitats Python de l'Agent, el node Code no té cap mode alternatiu local ni cap variable d'entorn per relaxar-ho. Sense un dimoni Docker accessible, el node falla amb un error clar en lloc d'executar el vostre codi al procés del backend. En desenvolupament natiu amb `./run.sh`, inicieu Docker abans d'utilitzar aquest node. Vegeu [Seguretat → Sandbox del node Code](../reference/security.md#code-node-sandbox).
## Utilitzeu un altre node quan sigui adequat

| Si voleu | Utilitzeu |
|-------------|-----|
| Analitzar o construir CSV, TSV, XML, o aplicar OCR a un fitxer | [Converter](converter-node.md) |
| Cridar una API HTTP | [HTTP](http-node.md) |
| Mapar o renombrar camps | [Set](set-node.md) |
| Executar un altre workflow | [Execute](execute-node.md) |

Recorreu a **Code** quan la lògica genuïnament no encaixi amb aquests — càlculs personalitzats, anàlisi a mida o un algorisme.

## Exemple

Puntueu les files produïdes per un node anterior:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Amb `codeParameters` establert a `{ "rows": "$fetchRows.result" }`, els nodes posteriors llegeixen `$scoreRows.result.total`.
