import auth from "./auth.js"

async function post(path, body) {
  const response = await fetch(`${auth.api_url}/${path}`, {
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json'
    },
    method: "POST",
  })

  return await response.json()
}

const orders = {
  createOrder: (orderData) => post("orders", orderData),
  addOrderItem: (orderItemData) => post("order_items", orderItemData),
}

export default orders
