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

function changeCart(event) {
  const button = event.target.closest("button[data-action]")

  if (!button) {
    return
  }

  const productID = button.closest(".cart-controls").dataset.productId
  const cart = JSON.parse(localStorage.getItem("cart") || "{}")

  if (button.dataset.action === "inc") {
    cart[productID] += 1
  } else if (button.dataset.action === "dec") {
    cart[productID] -= 1
  } else {
    delete cart[productID]
  }

  if (cart[productID] <= 0) {
    delete cart[productID]
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  renderCartProducts()
}

document.getElementById("cart-products").addEventListener("click", changeCart)

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

      //.thumbnail_url <-> image_url
      cartItems.push(`<div class="cart-item">
    <img src="${productInfo.image_url} " alt="Album art ${ productInfo.name } " />
    <p>${productInfo.name}</p>
    <div class="cart-controls" data-product-id="${product}">
      <button type="button" data-action="dec" aria-label="Minska antal ${productInfo.name}">−</button>
      <span>${cart[product]}</span>
      <button type="button" data-action="inc" aria-label="Öka antal ${productInfo.name}">+</button>
      <button type="button" data-action="remove" aria-label="Ta bort ${productInfo.name}">🗑</button>
    </div>
</div>`)
    }

    cartHTML = cartItems.join("\n")
  }

  document.getElementById("cart-products").innerHTML = cartHTML
  orderButton.hidden = Object.keys(cart).length === 0
}

updateCartCount()

export { instantiateCartButtons, clearCart }
