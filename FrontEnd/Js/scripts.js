const apiUrl = "http://localhost:5678/api/works";


async function getWorks() {
  try {
    const response = await fetch(apiUrl);
    const works = await response.json();
    return works;
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux:", error);
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

async function init() {
  const works = await getWorks();
  displayWorks(works);
}

init();