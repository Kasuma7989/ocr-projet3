
const apiUrl = "http://localhost:5678/api";

let allWorks = [];

async function getWorks() {
  try {
    const response = await fetch(`${apiUrl}/works`);
    const works = await response.json();
    return works;
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${apiUrl}/categories`);
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return [];
  }
}

 
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
                    
  gallery.innerHTML = "";      
  
  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

function createFilters(categories) {
  const portfolioSection = document.getElementById("portfolio");
  const title = portfolioSection.querySelector("h2");
  const filtersDiv = document.createElement("div");
  filtersDiv.classList.add("filters");
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-button", "active");
  allButton.addEventListener("click", () => {
    filterWorks(null);
    setActiveButton(allButton);
  });
  filtersDiv.appendChild(allButton);


  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-button");
    button.addEventListener("click", () => {
      filterWorks(category.id);
      setActiveButton(button);
    });
    filtersDiv.appendChild(button);
  });
  
  portfolioSection.insertBefore(filtersDiv, title.nextSibling);
}

function filterWorks(categoryId) {
  if (categoryId === null) {
    displayWorks(allWorks);
  } else {
    const filteredWorks = allWorks.filter(work => work.categoryId === categoryId);
    displayWorks(filteredWorks);
  }
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach(button => {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
}

async function init() {
  allWorks = await getWorks();
  const categories = await getCategories();
  displayWorks(allWorks);
  createFilters(categories);
}

init();