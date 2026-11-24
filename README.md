# Betalning med Stripe – exempel (JSUX kmom04)

Referensimplementation byggd enligt kursmaterialet (`kunskap/integrera_stripe` och `orderformular_for_webbshoppen`).

1. Hämta en API-nyckel: https://lager.emilfolino.se/v2/auth/api_key och lägg den i `models/auth.js`.
2. Kopiera produkter (en gång): `curl -X POST https://lager.emilfolino.se/v2/copier/products -d "api_key=DIN NYCKEL"`
3. Starta: `python -m http.server 8000` och öppna http://localhost:8000
4. Lägg produkter i varukorgen, klicka Beställ, betala med testkort `4242 4242 4242 4242`, valfritt framtida datum, valfri CVC.
5. Efter betalning: fyll i förnamn och skicka, så skapas ordern i Lager-API:t.

Flöde: order.js -> POST /stripe/create-checkout-session -> clientSecret -> Stripe Embedded Checkout
-> redirect med ?session_id -> GET /stripe/session-status -> POST /orders + /order_items.

`order-dalig.html` är ett avsiktligt dåligt formulär att jämföra med formuläret i `order.html` (labels, input-typer, pattern, autocomplete).

## Föreläsning

- `slides/index.html`: slides (piltangenter för att bläddra), i samma stil som kursens slides.
- `formular.html`: enkel formulärsida med regex-validering (telefon, postnummer, lösenord, ålder).
- `order-dalig.html`: dåligt formulär att jämföra med.
- `index.html`: den färdiga webshopen med Stripe.
