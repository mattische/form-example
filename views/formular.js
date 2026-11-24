const form = document.getElementById("form")
const output = document.getElementById("output")

form.addEventListener("submit", (event) => {
  event.preventDefault()

  const data = Object.fromEntries(new FormData(form))

  data.password = "***" // visa aldrig lösenord

  output.textContent = JSON.stringify(data, null, 2)
})
