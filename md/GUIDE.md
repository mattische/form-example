# Guide: betalning och formulär (kmom04)

Följer kursens två övningar:
[Integrera Stripe](https://dbwebb-jsux.github.io/kunskap/integrera_stripe/) och
[Orderformulär för webbshoppen](https://dbwebb-jsux.github.io/kunskap/orderformular_for_webbshoppen/).

Slides: `slides/index.html`. Starta repot med `npx http-server . -p 8000` och öppna `http://localhost:8000`.

## Förberedelser (före lektionen)

- `models/auth.js` har en giltig API-nyckel och produkterna är kopierade till lagret (en gång).
- Tom varukorg: `localStorage.removeItem("cart")` i konsolen (F12).
- Provkör hela flödet en gång: lägg i varukorgen, betala, fyll i formuläret, kontrollera ordern på
  `https://lager.emilfolino.se/v2/orders?api_key=DIN_NYCKEL`.
- Öppna DevTools, fliken Network, så att anropen syns.

## Ordning

| # | Tid | Visa | Fil | Kursens övning |
|---|-----|------|-----|----------------|
| 1 | 5 min | Resultatet: varukorg, Beställ, betala, formulär, order | `index.html`, `order.html` | kmom04-videon |
| 2 | 5 min | Varför Stripe och en server. Kursens Stripe-server finns i Lager-API:t | slides 4-5 | Integrera Stripe |
| 3 | 10 min | Stripe i koden: `buildItems`, `initializeCheckout`, `clientSecret` | `views/order.js` (avsnitt 1) | Integrera Stripe |
| 4 | 5 min | Efter betalning: `?session_id`, `session-status`, `console.log(session)` | `views/order.js` (avsnitt 2+3) | Integrera Stripe |
| 5 | 5 min | Stripes formulär som förebild. Prova ett nekat kort | webbläsaren | |
| 6 | 15 min | Vårt formulär: label, type, required, autocomplete, placeholder, hjälptext. Jämför med `order-dalig.html` | `order.html`, `order-dalig.html` | Orderformulär (input-typer, validering) |
| 7 | 10 min | Pseudoklasser: `:user-invalid`, `:user-valid`, `:focus-visible`, `:read-only`, `::placeholder` | `style/forms.css` | Orderformulär (styling) |
| 8 | 10 min | `preventDefault`, `FormData`, `POST /orders`, `clearCart` | `views/order.js` (avsnitt 4) | Orderformulär (formData) |
| 9 | 5 min | Fel: ogiltigt `session_id`, tom varukorg, offline | `views/order.js` | kmom10 krav 3 |

Totalt ungefär 70 minuter. Korta del 6-8 om tiden är knapp.

## Att visa live i del 6-7

- Skriv fel postnummer (`3797`), lämna fältet och se `:user-invalid` (röd ram, bakgrund, röd hjälptext).
- Skriv rätt (`379 79`) och se `:user-valid` (grön ram).
- Tabba genom fälten och visa `:focus-visible`.
- Fokus på att placeholder är ett exempel. Skriv i fältet och visa att den försvinner, medan labeln och hjälptexten finns kvar.
- E-postfältet: `readonly` (grått, går inte att ändra). Be dem testa att ändra `readonly` till `disabled` i DevTools och se att `formData.get("email")` blir `null`.
- Reguljära uttryck tas av en annan lärare. Här räcker det att visa att `pattern` finns och vad det gör.

## Tips och tricks till studenterna

**Stripe**
- Testkort (kontrollerade mot `docs.stripe.com/testing`): `4242 4242 4242 4242` lyckas, `4000 0000 0000 0002` nekas.
  Datum i framtiden (till exempel `12/34`), valfri CVC (3 siffror).
- Fler testkort finns i Stripes dokumentation. Prova dem själv innan du lovar vad de gör.
- Den publika nyckeln `pk_test_...` är inte hemlig. Den hemliga nyckeln ligger i backend (Lager-API:t).
- Stripe fungerar över `http://localhost` och vanlig http i testläge. Live kräver https.

**JavaScript**
- `type="module"` på skriptet krävs för `import` och för `await` utanför en funktion.
- `fetch` kastar bara fel vid nätverksfel. Kontrollera `response.ok` själv.
- `console.log(session)` visar vad Stripe skickar tillbaka.
- Fliken Network i DevTools visar `create-checkout-session` och `session-status` med svar.

**Formulär och CSS**
- `label for` måste matcha `input id`, annars fungerar inte klick på etiketten.
- `type="number"` är för tal man räknar med. Postnummer och telefon är `text` respektive `tel`.
- `:user-invalid` i stället för `:invalid`, annars är fälten röda redan när sidan laddas.
- Ett `hidden`-attribut kan slås ut av en egen `display`-regel i CSS. Då syns elementet ändå.
- Förlita dig inte på färg ensam. Använd ram, bakgrund eller text också.

**Felsökning**
- `localStorage` delas per adress och port. En gammal varukorg från ett annat projekt på samma port kan ge fel.
  Rensa med `localStorage.removeItem("cart")`.
- Hård omladdning: Ctrl+Shift+R.
- Syns inte Stripe-formuläret: titta i konsolen och på sidan, felet visas nu i `#checkout`.
- API-nyckeln checkas in i kursen med flit. I ett riktigt projekt hör nycklar hemma i backend eller miljövariabler.
