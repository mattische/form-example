# Hållbarhet och energi på webben

Material till föreläsningen i kmom04. Underlag: lästipsen i kursmomentet
([kmom04](https://dbwebb-jsux.github.io/kmom04/)) och mätningar på det här exemplet.
Arbetsdokument: ändra, korta och bygg vidare.

## Budskap till studenterna

**Du kan själv påverka.** Varje val en utvecklare gör (en bild, ett bibliotek, ett extra anrop)
multipliceras med antalet besökare. Små val blir stora tillsammans.

## 1. Artiklarna i Lästips

### Danny van Kooten, "CO2 emissions on the web" (2020)
https://www.dannyvankooten.com/blog/2020/website-carbon-emissions/

- Poängen: små ändringar i kod som många använder multipliceras. Ett kilobyte mindre i en fil som laddas på
  2 miljoner sajter blir ungefär **2950 kg CO2 per månad** enligt hans uppskattning.
- Räkningen, steg för steg:
  1. 0,5 kWh per GB överförd data (Pihkola m.fl. 2018).
  2. 1 kB × 2 000 000 sajter = 1 kWh.
  3. × 10 000 besökare per månad = 10 000 kWh.
  4. × 0,295 kg CO2 per kWh (europeiskt elnät) = 2950 kg CO2.
- Sidvikt: mobilsidor har gått från 200 kB till 1,9 MB (HTTP Archive). Kontrast: en sida på 5 kB.
- Råd: fråga om varje tillägg behövs, undvik ramverk när det går, responsiva bilder, lång cachetid,
  komprimering, lätt analys, grön hosting.
- Han skriver själv att 0,5 kWh/GB är en grov uppskattning (först 2,9, och spannet går från cirka 0,08 för fast
  bredband till 37 för 2G). Poängen är resonemanget, inte den exakta siffran.

### Pihkola m.fl. (2018), energiförbrukning vid mobil dataöverföring
https://doi.org/10.3390/su10072494

- Läst: bara sammanfattningen (abstract). Hela artikeln blockeras för automatiska hämtningar, så läs den själv
  innan du citerar siffror ur den.
- Sammanfattningen: energin per överförd gigabyte har minskat kraftigt i Finland 2010-2017, men användningen har ökat
  så mycket att frågan är om det räcker. Det är en **rebound-effekt**. De ser också på livscykeln (direkt och
  indirekt energi) och på konsumentens roll.

## 2. Mätningar på det här exemplet

Mätt 2026-11-24 med `curl`. Överförd storlek (gzip) för `stripe.js`, okomprimerad för övrigt.

| Del | Storlek | CO2 per sidvisning* |
|---|---|---|
| Hela vår egen kod (HTML, CSS, JS, hero-SVG) | ca 22 kB | ca 0,003 g |
| `stripe.js` (gzip) | ca 324 kB (1,2 MB okomprimerad) | ca 0,05 g |
| 12 miniatyrbilder (`thumbnail_url`) | ca 0,49 MB | ca 0,07 g |
| 12 fullstora bilder (`image_url`) | ca 28,6 MB | ca 4,2 g |

\* Med van Kootens antaganden: `GB × 0,5 kWh/GB × 295 g CO2/kWh` (alltså GB × 147,5 g). Räkna själv:
28,6 MB = 0,0286 GB, 0,0286 × 147,5 ≈ 4,2 g. Det är en grov uppskattning och bara ett räkneexempel.

Det intressanta:
- Fullstora bilder är i snitt cirka 2,4 MB styck, miniatyrerna cirka 41 kB. Det är ungefär **58 gånger** skillnad.
- `stripe.js` är ungefär 15 gånger större än all vår egen kod. Det är priset för att slippa bygga säkra kortfält
  själv. Skriptet laddas bara på `order.html`, inte på förstasidan.

## 3. Så kan studenterna påverka (konkreta exempel)

### Exempel A: bilder i varukorgen

Varukorgen visar bilden som en liten ruta (ca 4 rem, alltså cirka 64 px), men kursens kod hämtar den fullstora bilden.

Före (`views/cart.js`, `renderCartProducts`):

```html
<img src="${productInfo.image_url}" alt="Album art ${productInfo.name}" />
```

Efter: miniatyr, lat inladdning och angiven storlek (så att sidan inte hoppar när bilden kommer):

```html
<img src="${productInfo.thumbnail_url}" alt="Album art ${productInfo.name}"
     width="64" height="64" loading="lazy" />
```

Lärdomar:
- Välj bild efter hur stor den visas. API:t ger redan `thumbnail_url` och `image_url`.
- `loading="lazy"` laddar bilder först när de närmar sig skärmen.
- `width` och `height` ger layouten rätt storlek direkt.
- Mer om detta finns i kursens artikel [Responsiva bilder](https://dbwebb-jsux.github.io/kunskap/responsiva-bilder/)
  (`srcset` och `sizes`).

### Exempel B: onödiga anrop

`renderCartProducts` hämtar varje produkt på nytt varje gång varukorgen ritas, och `buildItems` gör det igen
på ordersidan. Samma produkter hämtas många gånger.

Idé: spara svaret i `models/products.js` och återanvänd det (ej körd, ett förslag att pröva):

```js
const cache = {}

fetchProduct: async function fetchProduct(id) {
  if (!cache[id]) {
    const response = await fetch(`${auth.api_url}/products/${id}?api_key=${auth.api_key}`)
    const result = await response.json()

    cache[id] = result.data
  }

  return cache[id]
}
```

Avvägning: cachen gäller bara tills sidan laddas om, och lagersaldot kan ha ändrats. Fundera på när det är ok.

### Exempel C: beroenden

Fråga "behövs det?" innan man lägger till ett bibliotek eller skript. Stripe är ett bra exempel där svaret
är ja (säkerhet och PCI), men man ska veta vad det kostar. Jämför 22 kB mot 324 kB.

### Fler saker man kan göra (allmänna råd, inte mätta här)
- Moderna bildformat (WebP, AVIF) i stället för stora JPEG/PNG.
- Komprimering och cache-headers på servern.
- Grön hosting och CDN.
- Färre tredjepartsskript och lättare analysverktyg.
- Tänk på CPU-tid för JavaScript, inte bara överförda bytes.

## 4. Så visar du det live

1. Öppna DevTools (F12), fliken **Network**, bocka i **Disable cache**.
2. Ladda förstasidan och notera "transferred" längst ned.
3. Lägg 3 produkter i varukorgen (öppnar varukorgen). Notera hur mycket som tillkommer. Fullstora bilder syns tydligt.
4. Byt till `thumbnail_url` (Exempel A) och mät igen.
5. Ladda `order.html` och se `stripe.js` i listan (Filter: JS).
6. Räkna med formeln i avsnitt 2 tillsammans med studenterna.

## 5. Övning till studenterna

1. Mät din egen webshop: sidans totala vikt i Network, och vilka tre filer som är tyngst.
2. Byt ut en tung resurs mot en lättare och mät igen.
3. Räkna ut skillnaden i gram CO2 med formeln, för 10 000 besökare.
4. Skriv två meningar: vad skulle du aldrig lägga i en webbshop för att den är för tung?

## 6. Diskussionsfrågor

- Hur stor skillnad gör ett enskilt val? När är det värt besväret?
- Rebound-effekten: om sidor blir effektivare, används de då mer? Vad betyder det?
- Säkerhet mot vikt: Stripe är tungt men säkert. När är det rätt val?
- Vem bär ansvaret: utvecklaren, företaget, användaren? (Pihkola tar upp konsumentens roll.)
- Vad mäter siffrorna inte (enheten, servern, tillverkning av hårdvara)?

## 7. Att tänka på (källkritik)

- 0,5 kWh/GB är en grov uppskattning från 2020 och spannet är stort. Använd siffrorna som räkneexempel.
- Mina mätningar gäller just dagens sida, med de bilder Lager-API:t levererar.
- Min läsning av Pihkola-artikeln bygger på sammanfattningen, inte hela texten.

## Källor

- van Kooten: https://www.dannyvankooten.com/blog/2020/website-carbon-emissions/
- Pihkola m.fl. 2018: https://doi.org/10.3390/su10072494
- Aslan m.fl. 2017 (refereras av van Kooten): https://doi.org/10.1111/jiec.12630
- HTTP Archive (sidvikt över tid): https://httparchive.org
- Kursens artikel om responsiva bilder: https://dbwebb-jsux.github.io/kunskap/responsiva-bilder/
