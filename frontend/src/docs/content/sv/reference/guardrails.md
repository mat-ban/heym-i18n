# Guardrails

Guardrails gör det möjligt att blockera osäkra eller oönskade användarmeddelanden innan de når en [LLM](../nodes/llm-node.md)- eller [Agent](../nodes/agent-node.md)-nod. När ett meddelande matchar en blockerad kategori utlöser noden ett fel istället för att köras, vilket kan fångas upp med en [Error Handler](../nodes/error-handler-node.md)-nod.

## Aktivera Guardrails

Öppna panelen Egenskaper för en **LLM**- eller **AI Agent**-nod och rulla till växlingsknappen **Enable Guardrails** (sköldikonen). Genom att markera kryssrutan visas konfigurationsavsnittet.

## Guardrail-autentiseringsuppgifter och modell

När guardrails är aktiverade **måste** en **autentiseringsuppgift och modell** väljas för innehållssäkerhet. Guardrail-kontrollen använder den valda autentiseringsuppgiften och modellen från noden — ingen återfallsmetod, inga miljövariabler. Använd en OpenAI- eller Google-autentiseringsuppgift för tillförlitlig innehållsfiltrering, särskilt när huvudmodellen använder en anpassad leverantör (t.ex. Zhipu, GLM) som kanske inte stöder guardrails eller returnerar API-fel (t.ex. 404).

Workflowet kan inte köras förrän både Guardrail Credential och Guardrail Model har valts.

## Blockerade kategorier

Välj en eller flera kategorier att blockera. Ett meddelande som matchar någon markerad kategori avvisas.

| Kategori | Vad som blockeras |
|---|---|
| **Violence** | Våldsamt, hotfullt eller fysiskt skadligt innehåll |
| **Hate Speech** | Diskriminering, rasism eller intolerans |
| **Sexual Content** | Explicit sexuellt innehåll eller scenarier |
| **NSFW / Profanity** | Rått språk, svordomar, explicita skällsord och vuxenslang på alla språk |
| **Self-Harm** | Självmord, självskada eller relaterat innehåll |
| **Harassment** | Personliga angrepp, förolämpningar, mobbning eller hot |
| **Illegal Activity** | Instruktioner för att begå olagliga handlingar |
| **Political Extremism** | Extremistiskt politiskt innehåll eller våldspropaganda |
| **Spam / Phishing** | Spam, phishing eller social manipulation |
| **Personal Data Request** | Begäran om privata eller personligt identifierbara uppgifter |
| **Prompt Injection** | Försök att åsidosätta systeminstruktioner, injicera skadliga prompts eller manipulera modellens beteende |

## Känslighet

Inställningen **Sensitivity** styr hur strikt överträdelser upptäcks:

| Nivå | Beteende |
|---|---|
| **Low** | Flaggar även gränsfall eller tvetydiga fall |
| **Medium** *(standard)* | Flaggar tydliga överträdelser; ignorerar gränsfall |
| **High** | Flaggar endast extrema, entydiga överträdelser |

## Hur detektering fungerar

Detektering använder den **valda guardrail-autentiseringsuppgiften och modellen**:

- **OpenAI-autentiseringsuppgifter** — använder [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (kostnadsfritt, snabbt, ingen token-förbrukning) för de fem kategorier som stöds nativt (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Återstående kategorier kontrolleras med ett LLM-klassificeringsanrop med den valda guardrail-modellen.
- **Google-/anpassade autentiseringsuppgifter** — alla kategorier kontrolleras med ett LLM-klassificeringsanrop med den valda guardrail-autentiseringsuppgiften och modellen.

När huvudmodellen använder en anpassad leverantör (t.ex. Zhipu, Cerebras) som kan returnera 404 eller andra API-fel, välj en **OpenAI- eller Google-autentiseringsuppgift** för guardrails.

## Felformat

När en guardrail utlöses genererar noden ett fel med meddelandet:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Nodresultatets `output` innehåller även `guardrail_violated_categories` (array med etiketter för överträdda kategorier) så att Debug Panel och Execution History tydligt kan visa "Blocked by: X, Y".

Använd nodens alternativ **Continue on error** (eller en [Error Handler](../nodes/error-handler-node.md)) för att dirigera workflowet till en återfallsgren när guardrails utlöses.

## Exempel på workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Anteckningar

- **Inga återförsök**: Guardrail-överträdelser är avsiktliga blockeringar och görs aldrig om, även om noden har "Retry on failure" aktiverat.
- Ingen databasmigrering krävs — guardrail-inställningar lagras i workflowets nod-JSON tillsammans med övrig noddata.
- Guardrails kontrollerar det upplösta **användarmeddelandet** (efter att malluttryck har utvärderats), inte den råa mallen.
- Att ange **inga kategorier** medan guardrails är aktiverade motsvarar att ha dem inaktiverade — ingen kontroll utförs.
- Vid **Low**-känslighet körs alltid LLM-klassificering (bäst flerspråkig täckning). OpenAI-autentiseringsuppgifter kör dessutom Moderation API.
- Vid **Medium/High**-känslighet använder OpenAI-autentiseringsuppgifter Moderation API för nativt stödda kategorier och LLM-klassificering för resten. Google-/anpassade autentiseringsuppgifter använder alltid LLM-klassificering.
- LLM-klassificering är **språkoberoende** — den upptäcker överträdelser på turkiska, arabiska, ryska, spanska och andra språk.
