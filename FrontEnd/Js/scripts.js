const apiUrl = "http://localhost:5678/api";

// Stocke tous les travaux récupérés de l'API
let allWorks = [];

// Récupère tous les travaux depuis l'API
async function getWorks() {
  const response = await fetch(`${apiUrl}/works`);
  const works = await response.json();
  return works;
}

// Récupère toutes les catégories depuis l'API
async function getCategories() {
  const response = await fetch(`${apiUrl}/categories`);
  const categories = await response.json();
  return categories;
}

// Affiche les travaux dans la galerie de la page principale
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  
  // Parcourt chaque travail et crée les éléments HTML
  for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    
    img.src = works[i].imageUrl;
    img.alt = works[i].title;
    figcaption.textContent = works[i].title;
    
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

// Crée les boutons de filtre
function createFilters(categories) {
  const filtersDiv = document.querySelector(".filters");
  filtersDiv.innerHTML = "";

  // Bouton "Tous" pour afficher tous les travaux
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-button", "active");
  allButton.addEventListener("click", function() {
    displayWorks(allWorks);
    // Gère la classe active pour le style
    const buttons = document.querySelectorAll(".filter-button");
    buttons.forEach(btn => btn.classList.remove("active"));
    allButton.classList.add("active");
  });
  filtersDiv.appendChild(allButton);
  
  // Crée un bouton pour chaque catégorie
  for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button");
    button.textContent = categories[i].name;
    button.classList.add("filter-button");
    button.addEventListener("click", function() {
      // Filtre les travaux par catégorie
      const filtered = allWorks.filter(work => work.categoryId === categories[i].id);
      displayWorks(filtered);
      // Gère la classe active
      const buttons = document.querySelectorAll(".filter-button");
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
    filtersDiv.appendChild(button);
  }
}

// Vérifie si l'utilisateur est connecté et affiche le mode édition
function checkLoginStatus() {
  const token = sessionStorage.getItem("token");
  
  if (token) {
    document.getElementById("edit-banner").style.display = "flex";
    
    // Change login en logout dans le menu
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", function(e) {
      e.preventDefault();
      sessionStorage.removeItem("token"); // Déconnexion
      window.location.href = "index.html"; // Recharge la page
    });
    
    document.querySelector(".filters").style.display = "none";
    document.getElementById("edit-button").style.display = "flex";
  }
}

// Ouvre la modale et affiche la galerie des travaux
function openModal() {
  document.getElementById("modal").style.display = "flex";
  
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";
  
  // Affiche chaque travail avec un bouton de suppression
  for (let i = 0; i < allWorks.length; i++) {
    const item = document.createElement("div");
    item.classList.add("modal-gallery-item");
    
    const img = document.createElement("img");
    img.src = allWorks[i].imageUrl;
    img.alt = allWorks[i].title;
    
    // Bouton de suppression
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", function() {
      const workId = allWorks[i].id;
      const token = sessionStorage.getItem("token");

      fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      .then(function(response) {
        if (response.ok) {
          fetch(`${apiUrl}/works`)
            .then(function(response) {
              return response.json();
            })
            .then(function(works) {
              allWorks = works; 
              displayWorks(allWorks); 
              closeModal();
              openModal(); 
            });
        }
      });
    });
    
    item.appendChild(img);
    item.appendChild(deleteBtn);
    modalGallery.appendChild(item);
  }
  
  // Affiche la vue galerie
  document.getElementById("modal-gallery-view").style.display = "block";
  document.getElementById("modal-add-view").style.display = "none";
}

// Ferme la modale
function closeModal() {
  document.getElementById("modal").style.display = "none";
}


// Ouvre la modale au clic sur modifier
const editButton = document.getElementById("edit-button");
if (editButton) {
  editButton.addEventListener("click", function() {
    openModal();
  });
}

// Ferme la modale au clic sur la croix
const closeBtn = document.querySelector(".modal-close");
if (closeBtn) {
  closeBtn.addEventListener("click", function() {
    closeModal();
  });
}

// Ferme la modale au clic en dehors
const modal = document.getElementById("modal");
if (modal) {
  modal.addEventListener("click", function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Affiche le formulaire d'ajout au clic sur ajouter une photo
const addButton = document.getElementById("modal-add-button");
if (addButton) {
  addButton.addEventListener("click", function() {
    document.getElementById("modal-gallery-view").style.display = "none";
    document.getElementById("modal-add-view").style.display = "block";
    
    // Charge les catégories dans le select du formulaire
    const select = document.getElementById("work-category");
    select.innerHTML = '<option value=""></option>';
    
    fetch(`${apiUrl}/categories`)
      .then(function(response) {
        return response.json();
      })
      .then(function(categories) {
        for (let i = 0; i < categories.length; i++) {
          const option = document.createElement("option");
          option.value = categories[i].id;
          option.textContent = categories[i].name;
          select.appendChild(option);
        }
      });
  });
}

// Retour à la galerie au clic sur la flèche
const backButton = document.querySelector(".modal-back");
if (backButton) {
  backButton.addEventListener("click", function() {
    document.getElementById("modal-gallery-view").style.display = "block";
    document.getElementById("modal-add-view").style.display = "none";
  });
}

// preview de l'imagre
const imageInput = document.getElementById("work-image");
if (imageInput) {
  imageInput.addEventListener("change", function() {
    const file = imageInput.files[0];
    
    if (file) {
      // Lit le fichier et affiche la preview
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const preview = document.getElementById("image-preview");
        preview.src = e.target.result;
        preview.style.display = "block";
        
        // Cache les éléments initiaux de la zone de preview
        document.querySelector(".form-preview i").style.display = "none";
        document.querySelector(".preview-button").style.display = "none";
        document.querySelector(".form-preview p").style.display = "none";
      };
      
      reader.readAsDataURL(file);
    }
  });
}

// Vérifie si tous les champs sont remplis pour activer le bouton
function checkFormCompletion() {
  const imageInput = document.getElementById("work-image");
  const titleInput = document.getElementById("work-title");
  const categoryInput = document.getElementById("work-category");
  const submitButton = document.getElementById("submit-button");
  
  // Active le bouton seulement si tout est rempli
  if (imageInput.files.length > 0 && titleInput.value !== "" && categoryInput.value !== "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

// Écoute les changements sur les champs du formulaire
const imgInput = document.getElementById("work-image");
const titleInput = document.getElementById("work-title");
const categoryInput = document.getElementById("work-category");

if (imgInput) {
  imageInput.addEventListener("change", checkFormCompletion);
}
if (titleInput) {
  titleInput.addEventListener("input", checkFormCompletion);
}
if (categoryInput) {
  categoryInput.addEventListener("change", checkFormCompletion);
}


const addWorkForm = document.getElementById("add-work-form");
if (addWorkForm) {
  addWorkForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    
    // Récupère les données du formulaire
    const imageFile = document.getElementById("work-image").files[0];
    const title = document.getElementById("work-title").value;
    const category = document.getElementById("work-category").value;
    
    // Prépare les données au format FormData
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("category", category);
    
    const token = sessionStorage.getItem("token");
    
    // Envoie les données à l'API
    fetch(`${apiUrl}/works`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    })
    .then(function(response) {
      if (response.ok) {
        fetch(`${apiUrl}/works`)
          .then(function(response) {
            return response.json();
          })
          .then(function(works) {
            allWorks = works;
            displayWorks(allWorks);
            closeModal();
            
            // Réinitialise le formulaire
            addWorkForm.reset();
            document.getElementById("image-preview").style.display = "none";
            document.querySelector(".form-preview i").style.display = "block";
            document.querySelector(".preview-button").style.display = "block";
            document.querySelector(".form-preview p").style.display = "block";
          });
      } else {
        console.log("Erreur lors de l'ajout");
      }
    });
  });
}

// Fonction principale qui lance tout au chargement de la page
async function init() {
  allWorks = await getWorks();
  const categories = await getCategories();
  displayWorks(allWorks);
  createFilters(categories);
  checkLoginStatus();
}

init();