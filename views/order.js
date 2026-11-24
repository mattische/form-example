/* global Stripe */
// order.js: betalning med Stripe och beställningsformulär.
// Flöde: 1) visa Stripes formulär  2) efter betalning: hämta status  3) visa vårt formulär  4) skapa order

import auth from "../models/auth.js"
import products from "../models/products.js"
import orders from "../models/orders.js"
import { clearCart } from "./cart.js"

// Stripes PUBLIKA testnyckel. Den hemliga nyckeln finns i Lager-API:t (backend).
const stripe = Stripe('pk_test_51SQm4wL626KeakG07TkoOmFZOxD1rmmeWQb9pCO0dfEAuny10glrtIPS7cXD43ecMg5uS1ahzngx1zV4Md2F55dM00iLh6AzSO')

// Svaret från session-status sparas här så att formuläret kommer åt e-post och payment_id
let session = null

const checkoutDiv = document.getElementById("checkout")
const orderForm = document.getElementById("order-form")


// ---------- 1. Stripes betalformulär ----------

// Gör om varukorgen i LocalStorage till det format Lager-API:t och Stripe vill ha
async function buildItems() {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}")
  let items = []

  for (let product in cart) {
    const productData = await products.fetchProduct(product)

    if (!productData) {
      throw new Error(`Produkt ${product} finns inte i lagret`)
    }

    items.push({
      price_data: {
        currency: 'sek',
        product_data: {
          name: productData.name
        },
        unit_amount: 10000, // 100 kr. Stripe vill ha öre.
      },
      quantity: cart[product]
    })
  }

  return items
}

async function initializeCheckout() {
  // Stripe anropar denna funktion för att få en "clientSecret" från vår backend
  const fetchClientSecret = async () => {
    try {
      const data = {
        items: await buildItems(),
        return_url: location.href, // dit Stripe skickar användaren efter betalning
        api_key: auth.api_key,
      }

      const response = await fetch(`${auth.api_url}/stripe/create-checkout-session`, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: "POST",
      })
      const result = await response.json()

      // fetch kastar bara fel vid nätverksfel. Svar som 404 och 500 måste vi kontrollera själva.
      if (!response.ok) {
        throw new Error(result.errors?.detail || "Okänt fel")
      }

      return result.clientSecret
    } catch (error) {
      // Stripe sväljer felet, så vi visar det själva
      checkoutDiv.textContent =
        `Kunde inte starta betalningen: ${error.message}. Töm varukorgen och försök igen.`
      throw error
    }
  }

  try {
    const checkout = await stripe.initEmbeddedCheckout({
      fetchClientSecret,
    })

    // Stripe ritar sitt formulär i #checkout
    checkout.mount('#checkout')
  } catch (error) {
    checkoutDiv.textContent =
      `Kunde inte starta betalningen: ${error.message}. Töm varukorgen och försök igen.`
  }
}


// ---------- 4. Vårt formulär: skapa ordern ----------

async function handleSubmit(event) {
  // Stoppa webbläsarens standardbeteende (att ladda om sidan)
  event.preventDefault()

  // FormData läser alla fält i formuläret. get("name") hämtar ett fält.
  const formData = new FormData(event.target)
  const cart = JSON.parse(localStorage.getItem("cart") || "{}")

  // 4a. Skapa ordern. E-post och payment_id kommer från Stripe-sessionen.
  const newOrder = await orders.createOrder({
    name: `${formData.get("firstname")} ${formData.get("lastname")}`,
    address: formData.get("address"),
    zip: formData.get("zip"),
    city: formData.get("city"),
    country: "Sverige",
    email: session.customer_email,
    payment_id: session.payment_id,
    api_key: auth.api_key,
  })
  const newOrderId = newOrder.data.id

  // 4b. Skapa en orderrad för varje produkt i varukorgen
  for (let product in cart) {
    await orders.addOrderItem({
      order_id: newOrderId,
      product_id: product,
      amount: cart[product],
      api_key: auth.api_key,
    })
  }

  // 4c. Töm varukorgen och tacka
  clearCart()
  orderForm.classList.remove("visible")
  checkoutDiv.textContent = `Tack! Din order (nr ${newOrderId}) är lagd.`
}

orderForm.addEventListener("submit", handleSubmit)


// ---------- 2 + 3. Efter betalning: hämta status och visa vårt formulär ----------

// Efter betalning skickar Stripe tillbaka användaren hit med ?session_id=... i adressen
const sessionId = new URLSearchParams(window.location.search).get('session_id')

if (sessionId) {
  try {
    const response = await fetch(`${auth.api_url}/stripe/session-status?session_id=${sessionId}&api_key=${auth.api_key}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.errors?.detail || "Okänt fel")
    }

    session = result

    if (session.status == 'complete') {
      // Betalningen gick igenom: fyll i e-post från Stripe och visa vårt formulär
      document.getElementById("email").value = session.customer_email
      orderForm.classList.add("visible")
      checkoutDiv.textContent = "Betalningen genomfördes. Fyll i dina uppgifter och skicka beställningen."
    } else {
      initializeCheckout()
    }
  } catch (error) {
    checkoutDiv.textContent =
      `Vi kunde inte hämta din betalning: ${error.message}. Gå tillbaka till varukorgen och försök igen.`
  }
} else {
  initializeCheckout()
}
