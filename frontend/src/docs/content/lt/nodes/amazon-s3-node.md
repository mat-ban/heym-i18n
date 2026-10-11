# Amazon S3 mazgas

Amazon S3 mazgas skaito ir rašo objektus [Amazon S3](https://aws.amazon.com/s3/).

## Palaikomos operacijos

- `Create Bucket`: Sukuria kibirą nurodytoje kredencialų regione.
- `Delete Bucket`: Ištrina tuščią kibirą.
- `List Buckets`: Išvardija kibirus, matomus pagal kredencialus.
- `Create Folder`: Sukuria tuščią aplanką (nulinio baito raktas, baigiasi simboliu `/`).
- `Delete Folder`: Ištrina visus objektus pagal aplanko prefiksą (įskaitant įdėtus raktus).
- `Get All in Folder`: Išvardija visą objekto metainformaciją pagal aplanko prefiksą (serverio pusės puslapiavimas).
- `Upload Object`: Rašo teksto payload į kibirą/raktą.
- `Get Object`: Atsisiunčia objektą ir grąžina arba dekoduotą tekstą, arba base64 turinį.
- `Copy Object`: Nukopijuoja objektą į kitą raktą arba kibirą.
- `List Objects`: Išvardija objekto metainformaciją pagal prefiksą (vienas puslapis, iki 1000 raktų; palaiko tęstinumo tokenus).
- `Delete Object`: Ištrina vieną objektą pagal raktą.

## Kredencialų nustatymas

Sukurkite `Amazon S3` kredencialą Kredencialų skiltyje su:

- Access Key ID
- Secret Access Key
- Region
- Pasirinkinis Session Token (laikinoms AWS STS kredencialams)

## Bendri laukai

- `Bucket`: Tikslo kibiro pavadinimas (paskirties kibiras kopijavimo operacijoms).
- `Object Key`: Kelio tipo objekto raktas, pavyzdžiui, `reports/daily.json`.
- `Folder Path`: Prefiksas aplanko operacijoms (pavyzdžiui, `docs/archive`).
- `Source Bucket`: Pasirinkinis šaltinio kibiras kopijai; pagal numatytuosius nustatymus - paskirties kibiras.
- `Source Object Key`: Šaltinio raktas kopijavimo operacijoms.
- `Prefix`: Naudojamas sąrašų operacijoms riboti rezultatus.
- `Continuation Token`: Pasirinkinis tokenas iš ankstesnio sąrašo atsakymo, kad gautumėte kitą puslapį.
- `Max Keys`: Puslapio dydis List Objects (1–1000).
- `Include Binary`: Kai įjungta Get Object, grąžina `body_base64` vietoj `body_text`.
- `Body`: Teksto turinys, kurį reikia įkelti.
- `Content Type`: Pasirinkinis MIME tipas įkeltam objektui.

## Išvesties pavyzdžiai

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Pastabos

- `Upload Object` šiuo metu įkelia UTF-8 teksto turinį.
- `Get Object` gali grąžinti base64 binariniams failams, įjungus binarinę parinktį.
- `Create Bucket` naudoja kredencialų regioną ir reikalauja `s3:CreateBucket`.
- `Delete Bucket` reikalauja, kad kibiras būtų tuščias ir reikia `s3:DeleteBucket`.
- `List Buckets` reikalauja `s3:ListAllMyBuckets`.
- `Create Folder` įkelia nulinio baito žymeklį; S3 neturi natūralios katalogo tipo.
- `Delete Folder` pašalina kiekvieną objektą, kurio raktas prasideda nuo aplanko prefikso; naudokite atsargiai.
- `Get All in Folder` automatiškai puslapiuoja per prefiksą, kol visi objektai bus grąžinti.
- `List Objects` grąžina vieną puslapį (iki 1000 raktų). Kai `truncated` yra tiesa, perduokite `next_continuation_token` į kito skambučio Continuation Token lauką.
- `Copy Object` reikalauja `s3:GetObject` šaltinyje ir `s3:PutObject` paskirties vietoje.

## Susiję

- [Node Types](../reference/node-types.md) – Visi mazgų tipai
- [Credentials](../reference/credentials.md) – Kredencialų tipai ir naudojimas
- [Third-Party Integrations](../reference/integrations.md) – Amazon S3 kredencialų nustatymas
