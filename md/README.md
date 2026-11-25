# Betalning och formulär - exempel (JSUX kmom04)

Referensimplementation byggd enligt kursmaterialet
([Integrera Stripe](https://dbwebb-jsux.github.io/kunskap/integrera_stripe/),
[Orderformulär](https://dbwebb-jsux.github.io/kunskap/orderformular_for_webbshoppen/)).

Se `GUIDE.md` för ordning, tider och tips, och `HALLBARHET.md` (sidvikt) samt `HALLBARHET-AI.md` (AI och datacenter) för hållbarhet och energi. Slides finns i `slides/index.html`.

## Köra

1. Lägg din API-nyckel i `models/auth.js` (https://lager.emilfolino.se/v2/auth/api_key).
2. Kopiera produkter, en gång: `curl -X POST https://lager.emilfolino.se/v2/copier/products -d "api_key=DIN NYCKEL"`
3. `npx http-server . -p 8000` och öppna http://localhost:8000
4. Lägg produkter i varukorgen, klicka Beställ, betala med testkortet `4242 4242 4242 4242`, datum `12/34`, valfri CVC.
5. Fyll i formuläret och skicka. Ordern skapas i Lager-API:t.

## Filer

- `index.html`, `views/main.js`, `views/cart.js`: webshop och varukorg
- `order.html`, `views/order.js`: Stripe-betalning och beställningsformulär
- `style/forms.css`: formulärstil med pseudoklasser
- `order-dalig.html`: ett avsiktligt dåligt formulär att jämföra med
