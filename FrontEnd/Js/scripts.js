const apiUrl = "http://localhost:5678/api";

let allWorks = [];

async function getWorks() {
  const response = await fetch(`${apiUrl}/works`);
  const works = await response.json();
  return works;
}

async function getCategories() {
  const response = await fetch(`${apiUrl}/categories`);
  const categories = await response.json();
  return categories;
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  
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

function createFilters(categories) {
  const filtersDiv = document.querySelector(".filters");
  filtersDiv.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-button", "active");
  allButton.addEventListener("click", function() {
    displayWorks(allWorks);
    const buttons = document.querySelectorAll(".filter-button");
    buttons.forEach(btn => btn.classList.remove("active"));
    allButton.classList.add("active");
  });
  filtersDiv.appendChild(allButton);
  
  
  for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button");
    button.textContent = categories[i].name;
    button.classList.add("filter-button");
    button.addEventListener("click", function() {
      const filtered = allWorks.filter(work => work.categoryId === categories[i].id);
      displayWorks(filtered);
      const buttons = document.querySelectorAll(".filter-button");
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
    filtersDiv.appendChild(button);
  }
}


function checkLoginStatus() {
  const token = sessionStorage.getItem("token");
  
  if (token) {
    document.getElementById("edit-banner").style.display = "flex";
    
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", function(e) {
      e.preventDefault();
      sessionStorage.removeItem("token");
      window.location.href = "index.html";
    });
    
    document.querySelector(".filters").style.display = "none";
    
    document.getElementById("edit-button").style.display = "flex";
  }
}

//GESTION DE LA MODALE

function openModal() {
  document.getElementById("modal").style.display = "flex";
  
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";
  
  for (let i = 0; i < allWorks.length; i++) {
    const item = document.createElement("div");
    item.classList.add("modal-gallery-item");
    
    const img = document.createElement("img");
    img.src = allWorks[i].imageUrl;
    img.alt = allWorks[i].title;
    
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
  // Récupérer à nouveau les travaux
            fetch(`${apiUrl}/works`)
              .then(function(response) {
                return response.json();
            })
            .then(function(works) {
      // Mettre à jour allWorks
              allWorks = works;
      
      // Rafraîchir la page principale
              displayWorks(allWorks);
      
      // Rafraîchir la modale (fermer et rouvrir)
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
  document.getElementById("modal-gallery-view").style.display = "block";
  document.getElementById("modal-add-view").style.display = "none";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

const editButton = document.getElementById("edit-button");
if (editButton) {
  editButton.addEventListener("click", function() {
    openModal();
  });
}

const closeBtn = document.querySelector(".modal-close");
if (closeBtn) {
  closeBtn.addEventListener("click", function() {
    closeModal();
  });
}

const modal = document.getElementById("modal");
if (modal) {
  modal.addEventListener("click", function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

const addButton = document.getElementById("modal-add-button");
if (addButton) {
  addButton.addEventListener("click", function() {
    document.getElementById("modal-gallery-view").style.display = "none";
    document.getElementById("modal-add-view").style.display = "block";
    
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

const backButton = document.querySelector(".modal-back");
if (backButton) {
  backButton.addEventListener("click", function() {
    document.getElementById("modal-gallery-view").style.display = "block";
    document.getElementById("modal-add-view").style.display = "none";
  });
}

// Preview de l'image
const imageInput = document.getElementById("work-image");
if (imageInput) {
  imageInput.addEventListener("change", function() {
    const file = imageInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const preview = document.getElementById("image-preview");
        preview.src = e.target.result;
        preview.style.display = "block";
        
        // Cacher les éléments de la zone de preview
        document.querySelector(".form-preview i").style.display = "none";
        document.querySelector(".preview-button").style.display = "none";
        document.querySelector(".form-preview p").style.display = "none";
      };
      
      reader.readAsDataURL(file);
    }
  });
}


// Vérifier si le formulaire est complet
function checkFormCompletion() {
  const imageInput = document.getElementById("work-image");
  const titleInput = document.getElementById("work-title");
  const categoryInput = document.getElementById("work-category");
  const submitButton = document.getElementById("submit-button");
  
  if (imageInput.files.length > 0 && titleInput.value !== "" && categoryInput.value !== "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

// Écouter les changements sur les champs
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

// Gérer la soumission du formulaire d'ajout
const addWorkForm = document.getElementById("add-work-form");
if (addWorkForm) {
  addWorkForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Récupérer les données du formulaire
    const imageFile = document.getElementById("work-image").files[0];
    const title = document.getElementById("work-title").value;
    const category = document.getElementById("work-category").value;
    
    console.log("Image:", imageFile);
    console.log("Titre:", title);
    console.log("Catégorie:", category);
    // Créer un FormData pour envoyer les données
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("category", category);
    
    console.log("FormData créé !");
    // Récupérer le token
    const token = sessionStorage.getItem("token");
    
    // Envoyer à l'API
    fetch(`${apiUrl}/works`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    })
    .then(function(response) {
      if (response.ok) {
        // Récupérer à nouveau tous les travaux
        fetch(`${apiUrl}/works`)
          .then(function(response) {
            return response.json();
          })
          .then(function(works) {
            // Mettre à jour allWorks
            allWorks = works;
            
            // Rafraîchir la galerie principale
            displayWorks(allWorks);
            
            // Fermer la modale
            closeModal();
            
            // Réinitialiser le formulaire
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




async function init() {
  allWorks = await getWorks();
  const categories = await getCategories();
  
  displayWorks(allWorks);
  createFilters(categories);
  checkLoginStatus();
}
init();