const apiUrl = "http://localhost:5678/api";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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

function showError(message) {
  let errorElement = document.querySelector(".error-message");
  
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.classList.add("error-message");
    const loginSection = document.getElementById("login");
    const forgotPassword = document.querySelector(".forgot-password");
    loginSection.insertBefore(errorElement, forgotPassword);
  }
  
  errorElement.textContent = message;
}