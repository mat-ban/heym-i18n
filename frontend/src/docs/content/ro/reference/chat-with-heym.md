# Chat cu Heym

Chat cu Heym este un asistent conștient de pagină, disponibil din antetul documentației. Se deschide într-un dialog centrat, vă permite să selectați o acreditare LLM și un model și răspunde la întrebări având pagina curentă de documentație ca prim context.

## Deschiderea dialogului

1. Deschideți orice pagină din `/docs`
2. Faceți clic pe **Chat with Heym** în antet
3. Selectați o [acreditare](../tabs/credentials-tab.md) și un model
4. Adresați o întrebare despre pagină sau despre platformă

Pe ecranele mai mici, trigger-ul este doar o pictogramă; pe ecranele mai mari, afișează eticheta completă.

## Ce context utilizează

- Calea către documentația deschisă în prezent este injectată în cerere ca îndrumare contextuală
- Backend-ul utilizează în continuare endpoint-ul existent de chat din dashboard și instrumentele de căutare în documentație
- [Regulile de utilizator](./user-settings.md) la nivel de cont continuă să se aplice, deoarece se reutilizează același backend de chat
- Pașii de pregătire în timp real sunt transmise în bula asistentului înainte de răspunsul final, similar cu chat-ul din dashboard
- Întrebările de clarificare apar sub formă de carduri, la fel ca în [fila Chat](../tabs/chat-tab.md). Când o cerere de workflow necesită o acreditare, puteți selecta una sau o puteți crea din card. Când necesită un tabel de date, puteți selecta unul dintre tabelele dvs. sau puteți crea unul nou în același mod.

Când deschideți dialogul pe un anumit articol, un mic badge afișează calea activă către documentație, astfel încât să puteți confirma care pagină este prioritizată.

## Comportamentul sesiunii

- Selecția acreditării și a modelului rămâne neschimbată cât timp dialogul rămâne montat
- Istoricul mesajelor este doar pe durata sesiunii și este șters la închiderea dialogului
- Clicul pe fundal, `Escape` și butonul de închidere resetează toate sesiunea
- **Stop** întrerupe răspunsul curent în streaming
- Dialogul este intenționat lat și cu dimensiuni fixe; nu oferă o opțiune de afișare pe tot ecranul

## Când să îl utilizați

- Adresați întrebări suplimentare în timp ce citiți o pagină de nod sau de referință
- Clarificați diferențele dintre funcționalități fără a părăsi documentația
- Găsiți articolul potrivit înainte de a deschide editorul

Dacă doriți să construiți sau să modificați workflow-uri direct, utilizați în schimb [AI Assistant](./ai-assistant.md) din partea editorului.

## Resurse conexe

- [AI Assistant](./ai-assistant.md) – Chat în editor pentru construirea workflow-urilor
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați acreditări LLM utilizate de dialog
- [Setări](./user-settings.md) – Reguli de utilizator globale aplicate suprafețelor AI
- [Start rapid](../getting-started/quick-start.md) – Primul parcurs ghidat prin workflow
