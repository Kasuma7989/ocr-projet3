const apiUrl = "http://localhost:5678/api";

// Récupère le formulaire de connexion
const loginForm = document.getElementById("login-form");

// Gère la soumission du formulaire
loginForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le rechargement de la page
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  // Envoie les identifiants à l'API
  fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // Indique quon envoie du json
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Identifiants incorrects");
    }
  })
  .then(function(data) {
    sessionStorage.setItem("token", data.token);
    window.location.href = "index.html";
  })
  .catch(function(error) {
    showError("Erreur dans l'identifiant ou le mot de passe");
  });
});


// Affiche un message d'erreur sous le formulaire
function showError(message) {
  let errorElement = document.querySelector(".error-message");
  
  // Si le message d'erreur n'existe pas encore, on le crée
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.classList.add("error-message");
    const loginSection = document.getElementById("login");
    const forgotPassword = document.querySelector(".forgot-password");
    loginSection.insertBefore(errorElement, forgotPassword);
  }
  
  errorElement.textContent = message;
}