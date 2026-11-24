/* global Stripe */

import auth from "../models/auth.js"
import products from "../models/products.js"
import orders from "../models/orders.js"
import { clearCart } from "./cart.js"

const stripe = Stripe('pk_test_51SQm4wL626KeakG07TkoOmFZOxD1rmmeWQb9pCO0dfEAuny10glrtIPS7cXD43ecMg5uS1ahzngx1zV4Md2F55dM00iLh6AzSO')

let session = null

const checkoutDiv = document.getElementById("checkout")
const orderForm = document.getElementById("order-form")

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
        unit_amount: 10000, // 100 kr, Stripe vill ha öre
      },
      quantity: cart[product]
    })
  }

  return items
}

async function initializeCheckout() {
  const fetchClientSecret = async () => {
    try {
      const data = {
        items: await buildItems(),
        return_url: location.href,
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

    checkout.mount('#checkout')
  } catch (error) {
    checkoutDiv.textContent =
      `Kunde inte starta betalningen: ${error.message}. Töm varukorgen och försök igen.`
  }
}

async function handleSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const cart = JSON.parse(localStorage.getItem("cart") || "{}")

  const newOrder = await orders.createOrder({
    name: formData.get("firstname"),
    address: formData.get("address"),
    zip: formData.get("zip"),
    city: formData.get("city"),
    country: "Sverige",
    email: session.customer_email,
    payment_id: session.payment_id,
    api_key: auth.api_key,
  })
  const newOrderId = newOrder.data.id

  for (let product in cart) {
    await orders.addOrderItem({
      order_id: newOrderId,
      product_id: product,
      amount: cart[product],
      api_key: auth.api_key,
    })
  }

  clearCart()
  orderForm.classList.remove("visible")
  checkoutDiv.textContent = `Tack! Din order (nr ${newOrderId}) är lagd.`
}

orderForm.addEventListener("submit", handleSubmit)

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
      document.getElementById("email").value = session.customer_email
      orderForm.classList.add("visible")
      checkoutDiv.textContent = "Betalningen genomfördes. Fyll i ditt namn och skicka beställningen."
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
