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
  const token = localStorage.getItem("token");
  
  if (token) {
    document.getElementById("edit-banner").style.display = "flex";
    
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", function(e) {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
    
    document.querySelector(".filters").style.display = "none";
    
    document.getElementById("edit-button").style.display = "flex";
  }
}

async function init() {
  allWorks = await getWorks();
  const categories = await getCategories();
  
  displayWorks(allWorks);
  createFilters(categories);
  checkLoginStatus();
}

init();