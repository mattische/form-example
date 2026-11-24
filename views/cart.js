import products from "../models/products.js"

const cartContent = document.getElementById("cart-content")
const cart = document.getElementById("cart")
cart.addEventListener("click", toggleCart)

const closeCart = document.getElementById("close-cart")
closeCart.addEventListener("click", toggleCart)

function toggleCart() {
  const isOpen = cartContent.classList.toggle("active")

  document.body.classList.toggle("cart-open", isOpen)

  if (isOpen) {
    renderCartProducts()
  }
}

function openCart() {
  cartContent.classList.add("active")
  document.body.classList.add("cart-open")
  renderCartProducts()
}

function instantiateCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach(
    (elem) => elem.addEventListener("click", addToCart)
  )
}

function addToCart(event) {
  const productID = event.currentTarget.dataset.productId
  let cart = JSON.parse(localStorage.getItem("cart") || "{}")

  cart[productID] = (cart[productID] || 0) + 1

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  openCart()
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}")
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0)

  document.getElementById("cart-count").textContent = count
}

function clearCart() {
  localStorage.removeItem("cart")
  updateCartCount()
  renderCartProducts()
}

async function renderCartProducts() {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}")
  const orderButton = document.getElementById("order-button")
  let cartHTML = "<p>No products in cart.</p>"

  if (Object.keys(cart).length > 0) {
    const cartItems = []

    for (let product in cart) {
      const productInfo = await products.fetchProduct(product)

      cartItems.push(`<div class="cart-item">
    <img src="${productInfo.image_url}" alt="Album art ${productInfo.name}" />
    <p>${productInfo.name}</p><p>Antal: ${cart[product]}</p>
</div>`)
    }

    cartHTML = cartItems.join("\n")
  }

  document.getElementById("cart-products").innerHTML = cartHTML
  orderButton.hidden = Object.keys(cart).length === 0
}

updateCartCount()

export { instantiateCartButtons, clearCart }
