# Perėjimas prie Heym

Jau turite Workflow kituose įrankiuose? **AI Convert** paverčia juos į Heym Workflow. Įklijuokite Workflow iš n8n, Flowise, Dify, Langflow, sim.ai arba Activepieces — arba tiesiog aprašykite, ko norite — ir Heym sukurs atitinkamą Workflow gyvame canvas, kurį galėsite atsisiųsti ir importuoti.

Atidarykite jį adresu **[heym.run/convert](https://heym.run/convert)** arba naudokite mygtuką **✨ AI Convert** svetainės antraštėje.

## Kaip tai veikia

1. **Pasirinkite šaltinio įrankį** (neprivaloma) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces arba palikite *Auto*.
2. **Pateikite savo Workflow** — įklijuokite eksportuotą JSON iš dabartinio įrankio arba parašykite paprastą aprašymą to, ką norite automatizuoti.
3. **Generuokite** — Heym transliuoja rezultatą į canvas, braižydamas nodes ir jungtis jiems sukuriant.
4. **Atsisiųskite arba nukopijuokite** sugeneruotą Workflow kaip JSON.
5. **Importuokite į Heym** — naudokite [Download & Import](../reference/download-import.md) eigą, kad įklijuotumėte JSON į savo canvas, tada paleiskite jį.

Konvertavimas taip pat prideda nedidelę *Sticky Note* canvas, žyminčią, kad Workflow sugeneruotas Heym — ištrinkite ją, kada norite.

## Ką gausite

Konverteris susieja šaltinio koncepcijas su natūraliais Heym nodes — Trigger, [LLM](../nodes/llm-node.md) žingsniais, [HTTP](../nodes/http-node.md) užklausomis, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) veiksmais, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) ir [Output](../nodes/output-node.md). Peržiūrėkite rezultatą canvas, prijunkite savo [Credentials](../reference/credentials.md) ir pakoreguokite viską, ką šaltinio įrankis išreiškė kitaip.

> AI Convert yra atspirties taškas, o ne garantuotas 1:1 perkėlimas. Visada peržiūrėkite sugeneruotą Workflow prieš paleisdami jį produkcinėje aplinkoje.

## Verta vertėtų žinoti

- **Veikia su AI:** konversijas atlieka didelis kalbos modelis, todėl rezultatai gali skirtis tarp paleidimų. Jei pirmasis rezultatas nėra tinkamas, sugeneruokite iš naujo.
- **Įvesties dydis:** įvestis, kurią įklijuojate ar įvedate, yra apribota maždaug **25 000 tokenų**. Prieš konvertuodami apkirpkite labai didelius eksportus.
- **Užklausų limitai:** kad įrankis būtų prieinamas visiems, užklausos ribojamos iki **1 per minutę, 5 per valandą ir 10 per dieną** vienam lankytojui.
- **Saugumas:** užklausos tikrinamos, o apdorojamos tik su Workflow kūrimu susijusios užklausos.

## Tolimesni žingsniai

- Pirmą kartą naudojatės drobe? Pradėkite nuo [Greitos pradžios](./quick-start.md).
- Sužinokite, kaip veikia importavimas, skiltyje [Atsisiuntimas ir importavimas](../reference/download-import.md).
- Savarankiškai diegiate Heym? Visą konfigūracijos informaciją rasite [Aplinkos kintamuosiuose](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).
- Kurkite nuo nulio naudodami programėlėje esantį [AI asistentą](../reference/ai-assistant.md).
