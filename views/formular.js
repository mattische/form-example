const form = document.getElementById("form")
const output = document.getElementById("output")

// Lyssna på "submit", som sker när man klickar på Skicka (och formuläret är giltigt)
form.addEventListener("submit", (event) => {
  // Stoppa webbläsarens standardbeteende (att ladda om sidan och skicka formuläret)
  event.preventDefault()

  // FormData läser alla fält i formuläret, med name-attributet som nyckel
  const formData = new FormData(form)

  // Ett enskilt fält hämtas med get(namnet på fältet)
  console.log("Förnamn:", formData.get("firstname"))

  // Alla fält på en gång som ett vanligt objekt: { firstname: "...", email: "..." }
  const data = Object.fromEntries(formData)

  data.password = "***" // visa aldrig lösenord

  // JSON.stringify gör objektet till text som vi kan visa på sidan
  output.textContent = JSON.stringify(data, null, 2)
})
