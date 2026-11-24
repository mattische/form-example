import products from "../models/products.js"
import { instantiateCartButtons } from "./cart.js"

async function renderProducts() {
  const productList = document.getElementById("product-list")

  try {
    const result = await products.fetchAll()

    productList.innerHTML = result.map((product) => `<div class="product">
  <img src="${product.thumbnail_url}" alt="Album art ${product.name}" />
  <h3>${product.name}</h3>
  <span class="add-to-cart" data-product-id="${product.id}">+</span>
</div>`).join("\n")

    instantiateCartButtons()
  } catch (error) {
    productList.textContent = `Kunde inte hämta produkter: ${error.message}. Kontrollera api_key i models/auth.js.`
  }
}

renderProducts()
