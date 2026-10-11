# Kontekstuālā uzziņa

**Kontekstuālā uzziņa** ir viegls lietotnē iebūvēts ceļvedis, kas izskaidro lapu, kurā pašlaik atrodaties, neuzspiežot nekavējoties pilnu dokumentācijas plūsmu.

## Ko tā dara

- Parāda īsu kopsavilkumu par pašreizējo lapu
- Saglabā pirmo līmeni kodolīgu, lai Jūs nepārslogotu
- Ļauj atklāt nelielu papildu informācijas apjomu tikai tad, kad tas nepieciešams
- Nodrošina saites uz pilno dokumentācijas lapu padziļinātai lasīšanai

## Kur tā parādās

V1 versijā uzziņa ir pieejama Heym autentificētajās galvenajās virsmās:

- Dashboard cilnes
- [Evals](../tabs/evals-tab.md)
- [Dokumentācija](../getting-started/introduction.md)
- Workflow redaktora kanva

Publiskās lapas, piemēram, pieteikšanās, reģistrācija, chat portāls un HITL pārskatīšana, uzziņu neparāda.

## Piekļuve

### Dators

- Fiksēts **Page Guide** trigger parādās ekrāna labajā malā
- Uzziņa atveras kā labās puses drawer
- Pēc noklusējuma tā paliek aizvērta
- Vienreizējs teaser palīdz atklāt, ka ceļvedis pastāv, nepiespiežot to atvērt

### Mobilā ierīce

- Tas pats saturs ir pieejams no peldošas **Page Guide** pogas
- Tas atveras apakšējā sheet, nevis labajā panelī

## Satura modelis

Katrs uzziņas ieraksts izmanto strukturētu definīciju, nevis pilnībā pielāgotu komponenti.

- **Title** – Kas ir šī lapa
- **Summary** – Viens īss skaidrojums
- **Bullets** – Daži ātri pārskatāmi norādījumi
- **Highlights** – Mazas kartītes galvenajai vērtībai vai lietošanas modeļiem
- **More Detail** – Sakļautas sadaļas papildu kontekstam
- **Actions** – Parasti viena vai divas saites, visbiežāk uz pilno dokumentāciju

Tas saglabā sistēmu elastīgu, vienlaikus izvairoties no gariem, trokšņainiem palīdzības paneļiem.

## Konteksta apzināšanās

Uzziņa mainās atkarībā no pašreizējās virsmas.

- Katrai Dashboard cilnei ir savs kopsavilkums
- Redaktors norāda uz [Canvas Features](./canvas-features.md)
- Dokumentācijas lapa izmanto vispārīgu dokumentācijas pārskatu un, ja iespējams, norāda uz pašreizējo rakstu, kas Jums jau ir atvērts

## Saglabāšana

Uzziņa saglabā nelielu daudzumu personīgā UI stāvokļa pārlūkprogrammas krātuvē:

- Vai panelis vai sheet pēdējo reizi bija atvērts
- Kuri lapas konteksti jau parādīja teaser
- Pēdējā atklātā detaļu sadaļa katrā kontekstā

## Kāpēc tā pastāv

Mērķis ir padarīt Heym vieglāk apgūstamu, nepievienojot vairāk smaga UI chrome.

- Īsi, vienmēr tuvumā esoši norādījumi orientācijai
- Skaidrs ceļš uz padziļinātu dokumentāciju
- Zems traucējumu līmenis pieredzējušiem lietotājiem

## Saistītais

- [Workflows Tab](../tabs/workflows-tab.md) – Galvenā Dashboard virsma
- [Evals Tab](../tabs/evals-tab.md) – Novērtējumu workflow
- [Canvas Features](./canvas-features.md) – Redaktora darbība un atkļūdošana
- [Quick Drawer](./quick-drawer.md) – Otra fiksētā labās puses utilītu virsma
