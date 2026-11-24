import auth from "./auth.js"

const products = {
  fetchAll: async function fetchAll() {
    const response = await fetch(`${auth.api_url}/products?api_key=${auth.api_key}`)
    const result = await response.json()

    return result.data
  },

  fetchProduct: async function fetchProduct(id) {
    const response = await fetch(`${auth.api_url}/products/${id}?api_key=${auth.api_key}`)
    const result = await response.json()

    return result.data
  }
}

export default products
