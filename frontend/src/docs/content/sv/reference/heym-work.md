# Heym Work

**Heym Work** är ett andra gränssnitt för verksamhetsteam, byggt ovanpå Heym. Användare beskriver en uppgift med egna ord, besvarar några frågor och får ett färdigt workflow som Heym har byggt och testat. Arbetet sker från sidor anpassade för ändamålet, granskningar hanteras direkt och varje körning visas med namnet på den som startade den. Heym kör varje uppgift i bakgrunden.

Heym Work körs som en separat container intill Heym, med en särskild licens från Heym-teamet. Läs mer och begär en testversion på [heym.run/enterprise](https://heym.run/enterprise). Se [Heym Work-filmen](https://youtu.be/5Z2gGo6bcpU) för en två minuter lång genomgång.

## Vad verksamhetsteam får

| Område | Funktion |
|--------|----------|
| **Chat** | Beskrivning av en uppgift sker via text eller röst. Heym efterfrågar nödvändiga uppgifter, bygger ett workflow, testar det och märker det som Verifierat. |
| **Flows** | Redaktörer bygger ett flöde från val i stället för en rityta: vad som startar det, ett valfritt AI-utkast och åtgärder i Slack, Google Sheets och e-post. Svar från Slack fortsätter körningen, och godkännanden väntar också i Aktivitet. Se [Flows](#flows). |
| **Sidor** | Fästa sidor med widgetar: mätvärden, diagram, tabeller med statusbrickor, filuppladdningsytor och godkännanden. En tabellrad kan öppna en egen detaljsida. |
| **Godkännanden** | Granskningar från [Human-in-the-Loop](./human-in-the-loop.md)-steg väntar under Aktivitet och på sidor, med valen Godkänn, Begär ändringar och Avvisa. |
| **Aktivitet** | Varje körning, tillsammans med personen som startade den och den instans som utförde den. |
| **Roller** | Ägare, Redigerare och Läsare. Inloggning sker med det [Single Sign-On](./sso.md) som Heym redan använder. |
| **Branschutgåvor** | Utgåvor för juridik, utbildning, ekonomi, logistik, energi och e-handel öppnas med färdiga sidor, exempeldata och anpassade workflows för branschen. |

## Flows

**Flows** finns i Heym Works meny för Redaktörer och Ägare. Ett flow byggs av val i stället för noder, och Heym Work sparar det som ett vanligt Heym-arbetsflöde via Heyms API å den persons vägnar som skapade det. Heyms åtkomstregler, redigeringshistorik och triggersynkronisering gäller på samma sätt som i editorn, och varje körning visas i Aktivitet som vilken annan körning som helst.

| Del | Valmöjligheter |
|---|---|
| **Vad som startar det** | På begäran, enligt ett schema, vid ett Slack-meddelande, när en flik i Google Sheets ändras (rader tillagda, ändrade eller borttagna) eller när ett e-postmeddelande når en inkorg. Kalkylarks- och e-posttriggere kontrollerar var 1:a, 5:e, 15:e eller 60:e minut. |
| **AI-utkast** (valfritt) | En modell och instruktioner omvandlar det som startade flödet till text för de efterföljande stegen. Ett flöde som inte startar från ett kalkylark eller ett e-postmeddelande kan först läsa de senaste Slack-meddelandena från en kanal eller tråd. |
| **Vad som händer härnäst** | Åtgärder i ordning i något av de tre verktygen, oavsett vad som startade flödet. **Slack:** kanalmeddelande, direktmeddelande, formulär, meddelande med knappar, godkännande, trådsvar, meddelandeuppdatering och slutresultat. **Google Sheets:** lägg till en rad eller uppdatera den rad som ändrades. **E-post:** skicka ett e-postmeddelande. |

- **Svar fortsätter körningen.** Ett godkännande, knappar eller ett formulär pausar körningen tills någon svarar i Slack. Ett godkännande väntar också i Aktivitet, och ett beslut på endera platsen tar bort knapparna från Slack-meddelandet. Senare Slack-steg förblir i den första meddelandetråden.
- **Ett enda Anslutningskort.** Varje flow visar Slack-arbetsytan, Google Sheets-kontot och inkorgarna som det läser från och skickar med. De är Heym-inloggningsuppgifter: **Slack Bot** (ett bot-token, `xoxb-…`), **Google Sheets**, **IMAP** och **SMTP**; saknade uppgifter kan läggas till direkt från flödet.
- **En Slack-app för varje flow.** I Slack-appen anges webbadressen för interaktivitetsförfrågningar till `https://<ditt Heym>/api/slack/interactions/<id inloggningsuppgift>` och webbadressen för händelseprenumerationer till `https://<ditt Heym>/api/slack/events/<id inloggningsuppgift>`. Heym Work visar båda för den valda anslutningen. Alla flows med den inloggningsuppgiften delar dem.
- **Slack-triggere väljer vad de lyssnar på:** meddelanden i kanaler och direktmeddelanden, direktmeddelanden till botten, omnämnanden av botten eller meddelanden i en enskild kanal. Bottens egna inlägg startar aldrig ett flöde.
- **Krav.** Flows kräver Heym 0.0.131 eller senare.

Stegen som ett flow bygger är samma noder som kan användas på ritytan: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) och [Cron](../nodes/cron-node.md).

## Ansluta Heym Work

Se [installationsvideon](https://youtu.be/zXGfg1HPSLk) för hela installationsförloppet, från första kommandot till startsidan.

Anslutningen konfigureras under **Inställningar → Heym Work**. Fliken visas enbart för instansadministratörer listade i `HEYM_ADMIN_EMAILS`.

| Fält | Funktion |
|------|----------|
| **Heym Work-adress** | Platsen där Heym Work körs, exempelvis `https://work.example.com`. Inloggning återvänder hit. Klicka på **Spara**. |
| **Integrationsnyckel** | **Generera nyckel** skapar nyckeln som Heym Work använder vid varje anrop till Heym. Nyckeln visas en enda gång tillsammans med en kopieringsknapp. Heym sparar enbart en hash av den. |
| **Aktivera Heym Work** | Slår på anslutningen. Förutsätter att adress och nyckel angetts först. |
| **Bransch- och teamutgåvor** | Utgåvor för juridik, utbildning, finans, logistik, energi och e-handel samt utgåvor för IT, försäljning, marknadsföring och HR för företagsteam öppnas med sidor, exempeldata och arbetsflöden för det arbetet. |

Öppna därefter Heym Work-adressen och slutför installationen:

1. **Licens**: ange licensnyckeln från Heym-teamet.
2. **Heym**: ange adressen till Heym samt integrationsnyckeln.
3. **Ägare**: logga in med ett konto som har angetts som Heym Work-ägare.

Startsidan öppnas, redo för teamets arbete.

### Rotera nyckeln

**Rotera nyckel** ersätter befintlig integrationsnyckel. Heym Work slutar fungera tills den nya nyckeln matats in där, och samtliga inloggade användare i Heym Work loggas ut. Använd detta om nyckeln misstänks ha läckt eller om någon med kännedom om nyckeln lämnar organisationen.

### Inaktivera anslutningen

Stäng av **Aktivera Heym Work** för att avbryta anslutningen. Heym Work kommer då att begära Heym-nyckeln på nytt. Heym fortsätter att köra samtliga workflows, scheman och webhooks oavsett vilket.

## Säkerhetsmodell

- **Varje ändring passerar genom Heym.** Heym Work läser visade data från databasen i Heym och skickar varje åtgärd via den nyckelskyddade kanalen till Heym, där Heym tillämpar de egna behörighetsreglerna. Heym Work lagrar egna data i ett separat `heym_work`-schema.
- **Nyckeln hashas i vila.** Heym jämför en hash av den uppvisade nyckeln och lagrar aldrig nyckeln i klartext.
- **Inloggning sker hos Heym.** Användare loggar in via Heym, med vald identitetsleverantör när [SSO](./sso.md) är aktivt.
- **Ändringar granskas.** När anslutningen sparas eller nyckeln roteras skrivs poster för `work_integration.update` och `work_integration.key_rotate` till [granskningsloggen](./audit.md).

## Licensiering

Heym Work kräver en egen licensnyckel utfärdad av Heym-teamet. Varje dag skickar Heym Work sitt licens-ID, ett installations-ID, antalet aktiva användare under de senaste 30 dagarna, totalt antal medlemmar, antal körningar under de senaste 24 timmarna samt versionsnummer för Heym och Heym Work till heym.run. Innehåll i workflows, indata, utdata och autentiseringsuppgifter stannar alltid kvar på lokala servrar.

Om den dagliga synkroniseringen misslyckas i 30 dagar påbörjas en respitperiod på 14 dagar, varefter Heym Work-gränssnittet uppmanar en Ägare att ange en nyckel. En testperiod gäller fram till sista dagen och återaktiveras så snart Heym-teamet förlänger den (en testperiod per installation tillåts). Själva Heym fortsätter att fungera utan avbrott under hela förloppet. Nätverk utan internetanslutning använder en offline-licens via enterprise@heym.run.

## Videor

Samtliga videor om Heym Work finns samlade i [Heym Work-spellistan](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Relaterat

- [Enterprise](./enterprise.md): Kommersiell licensiering och support
- [Single Sign-On](./sso.md): Inloggningslösningen som Heym Work använder
- [Human-in-the-Loop](./human-in-the-loop.md): Granskningarna som visas i Heym Work
- [Granskningsloggning](./audit.md): Posterna som skapas vid anslutningsändringar
- [Inställningar](./user-settings.md): Platsen där fliken Heym Work finns
