# Guardrails

Guardrails mahdollistavat turvattomien tai ei-toivottujen käyttäjäviestien estämisen ennen kuin ne saavuttavat [LLM](../nodes/llm-node.md)- tai [Agent](../nodes/agent-node.md)-solmun. Kun viesti vastaa estettyä kategoriaa, solmu nostaa virheen suorituksen sijaan, jonka voi siepata [Error Handler](../nodes/error-handler-node.md)-solmulla.

## Guardrailsin käyttöönotto

Avaa **LLM**- tai **AI Agent** -solmun Properties-paneeli ja vieritä kohtaan **Enable Guardrails** -vaihtoehto (kilpi-ikoni). Valintaruudun merkitseminen paljastaa määritysosion.

## Guardrails-tunnistetiedot ja malli

Kun guardrails on käytössä, **on valittava** **tunnistetiedot ja malli** sisällön turvallisuutta varten. Guardrails-tarkistus käyttää solmun valittuja tunnistetietoja ja mallia — ei varajaisratkaisuja eikä ympäristömuuttujia. Käytä OpenAI- tai Google-tunnistetietoja luotettavaan sisällön suodatukseen, erityisesti kun päämalli käyttää mukautettua tarjoajaa (esim. Zhipu, GLM), joka ei välttämättä tue guardrailsia tai palauttaa API-virheitä (esim. 404).

Workflow ei voi suorittaa ennen kuin sekä Guardrail Credential että Guardrail Model on valittu.

## Estetyt kategoriat

Valitse yksi tai useampi estettävä kategoria. Viesti, joka vastaa valittuja kategorioita, hylätään.

| Kategoria | Estetty sisältö |
|---|---|
| **Violence** | Väkivaltainen, uhkaava tai fyysisesti vahingollinen sisältö |
| **Hate Speech** | Syrjintä, rasismi tai vihapuhe |
| **Sexual Content** | Eksplisiittinen seksuaalinen sisältö tai skenaariot |
| **NSFW / Profanity** | Karkea kieli, kirosanat, eksplisiittiset loukkaukset ja aikuisslangi millä tahansa kielellä |
| **Self-Harm** | Itsemurha, itsensä vahingoittaminen tai siihen liittyvä sisältö |
| **Harassment** | Henkilökohtaiset hyökkäykset, loukkaukset, kiusaaminen tai pelottelu |
| **Illegal Activity** | Ohjeet laittomien tekojen tekemiseen |
| **Political Extremism** | Ääriajatteluun liittyvä poliittinen sisältö tai väkivaltainen propaganda |
| **Spam / Phishing** | Roskaposti, phishing tai sosiaalinen manipulointi |
| **Personal Data Request** | Yksityisen tai henkilökohtaisesti tunnistettavan tiedon pyytäminen |
| **Prompt Injection** | Yritykset ohittaa järjestelmäohjeet, lisätä haitallisia promptteja tai manipuloida mallin käyttäytymistä |

## Herkkyys

**Sensitivity** -asetus määrittää, kuinka tiukasti rikkomukset havaitaan:

| Taso | Käyttäytyminen |
|---|---|
| **Low** | Liputtaa jopa rajallisia tai epäselviä tapauksia |
| **Medium** *(oletus)* | Liputtaa selkeät rikkomukset; ohittaa rajalliset tapaukset |
| **High** | Liputtaa vain äärimmäiset, yksiselitteiset rikkomukset |

## Miten havainto toimii

Havainto käyttää **valittuja guardrails-tunnistetietoja ja mallia**:

- **OpenAI-tunnistetiedot** — käyttää [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (ilmainen, nopea, ei tokenien käyttöä) viidelle natiivisti tuetulle kategoriatalle (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Loput kategoriat tarkistetaan LLM-luokittelukutsulla käyttäen valittua guardrails-mallia.
- **Google / mukautetut tunnistetiedot** — kaikki kategoriat tarkistetaan LLM-luokittelukutsulla käyttäen valittuja guardrails-tunnistetietoja ja mallia.

Kun päämalli käyttää mukautettua tarjoajaa (esim. Zhipu, Cerebras), joka saattaa palauttaa 404 tai muita API-virheitä, valitse guardrailsia varten **OpenAI- tai Google-tunnistetiedot**.

## Virhemuoto

Kun guardrails laukeaa, solmu nostaa virheen viestillä:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Solmun tuloksen `output` sisältää myös `guardrail_violated_categories` (taulukko rikotuista kategorioista), jotta Debug-paneeli ja Execution History voivat näyttää selkeästi "Blocked by: X, Y".

Käytä solmun **Continue on error** -vaihtoehtoa (tai [Error Handler](../nodes/error-handler-node.md)) ohjataksesi workflown varajaishaaraan, kun guardrails laukeaa.

## Esimerkkiworkflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Huomioita

- **Ei uudelleenyrityksiä**: Guardrails-rikkomukset ovat tarkoituksellisia estojä eikä niitä koskaan yritetä uudelleen, vaikka solmulla olisi "Retry on failure" käytössä.
- Tietokantamigraatiota ei vaadita — guardrails-asetukset tallennetaan workflown solmun JSON-tiedostoon muiden solmudatoiden ohella.
- Guardrails tarkistaa ratkaistun **käyttäjäviestin** (kun mallilausekkeet on arvioitu), ei raakaa mallia.
- **Ei kategorioita** guardrailsin ollessa käytössä vastaa guardrailsin poissaoloa — tarkistusta ei suoriteta.
- **Low**-herkkyydellä LLM-luokittelu suoritetaan aina (paras monikielinen kattavuus). OpenAI-tunnistetiedot suorittavat lisäksi Moderation API:n.
- **Medium/High**-herkkyydellä OpenAI-tunnistetiedot käyttävät Moderation API:a natiivisti tuetuille kategorioille ja LLM-luokittelua lopuille. Google/mukautetut tunnistetiedot käyttävät aina LLM-luokittelua.
- LLM-luokittelu on **kieliriippumaton** — se havaitsee rikkomukset turkiksi, arabiaksi, venäjäksi, espanjaksi ja muilla kielillä.
