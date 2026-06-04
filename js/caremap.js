const places = [
  {
    id: "bali-wellness",
    title: "The Bali Wellness Company",
    type: "Wellness Space",
    category: "wellness",
    distance: "Sanur, Denpasar",
    image: "../assets/images/place1.jpg",
    description: "A calming wellness space for self-care, relaxation, and emotional balance.",
    tags: ["Wellness", "Self-Care", "Relaxation"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Bali+Wellness+Company+Sanur+Denpasar"
  },
  {
    id: "koa-shala",
    title: "Koa Shala",
    type: "Wellness Space",
    category: "wellness",
    distance: "Sanur, Denpasar",
    image: "../assets/images/place2.jpg",
    description: "A peaceful yoga and wellness place with a soft, mindful atmosphere.",
    tags: ["Yoga", "Meditation", "Calm"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Koa+Shala+Sanur+Denpasar"
  },
  {
    id: "svaha-spa",
    title: "Svaha Spa Sanora",
    type: "Wellness Space",
    category: "selfcare",
    distance: "Sanur, Denpasar",
    image: "../assets/images/place3.jpg",
    description: "A relaxing spa and self-care space to help you feel refreshed and cared for.",
    tags: ["Spa", "Healing", "Comfort"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Svaha+Spa+Sanora+Sanur+Denpasar"
  }
];

const placesList = document.querySelector("#placesList");
const searchInput = document.querySelector("#searchInput");
const categoryButtons = document.querySelectorAll(".category-card");
const quickButtons = document.querySelectorAll(".quick-card button");

let activeCategory = "all";
let favoritePlaces = JSON.parse(localStorage.getItem("feelioFavoritePlaces")) || [];

function saveFavorites(){
  localStorage.setItem("feelioFavoritePlaces", JSON.stringify(favoritePlaces));
}

function isFavorite(id){
  return favoritePlaces.includes(id);
}

function toggleFavorite(id){
  if(isFavorite(id)){
    favoritePlaces = favoritePlaces.filter(placeId => placeId !== id);
  }else{
    favoritePlaces.push(id);
  }

  saveFavorites();
  renderPlaces();
}

function renderPlaces(){
  const keyword = searchInput.value.toLowerCase();

  const filtered = places.filter(place => {
    const matchCategory = activeCategory === "all" || place.category === activeCategory;

    const matchSearch =
      place.title.toLowerCase().includes(keyword) ||
      place.type.toLowerCase().includes(keyword) ||
      place.description.toLowerCase().includes(keyword) ||
      place.tags.join(" ").toLowerCase().includes(keyword);

    return matchCategory && matchSearch;
  });

  if(filtered.length === 0){
    placesList.innerHTML = `
      <div class="empty-state">
        No place found. Try another keyword or category.
      </div>
    `;
    return;
  }

  placesList.innerHTML = filtered.map(place => `
    <article class="place-card">
      <img src="${place.image}" alt="${place.title}">

      <div class="place-info">
        <h3>${place.title}</h3>
        <div class="place-meta">${place.type} • ${place.distance}</div>
        <p>${place.description}</p>

        <div class="place-tags">
          ${place.tags.map(tag => `<span class="place-tag">${tag}</span>`).join("")}
        </div>
      </div>

      <div class="place-buttons">
        <button
          class="favorite-btn ${isFavorite(place.id) ? "active" : ""}"
          data-id="${place.id}"
          aria-label="Save ${place.title}"
        >
          <i class="fa-solid fa-heart"></i>
        </button>

        <button
          class="place-action"
          data-map="${place.mapUrl}"
          aria-label="Open ${place.title} on Google Maps"
        >
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </article>
  `).join("");
}

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    activeCategory = button.dataset.category;
    renderPlaces();
  });
});

placesList.addEventListener("click", event => {
  const favoriteButton = event.target.closest(".favorite-btn");

  if(favoriteButton){
    toggleFavorite(favoriteButton.dataset.id);
    return;
  }

  const actionButton = event.target.closest(".place-action");

  if(actionButton){
    window.open(actionButton.dataset.map, "_blank");
  }
});

searchInput.addEventListener("input", renderPlaces);

quickButtons.forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    if(action){
      window.open(action, "_blank");
    }
  });
});

renderPlaces();

let careRevealObserver;

function initCareRevealAnimation(){
  if(careRevealObserver){
    careRevealObserver.disconnect();
  }

  careRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
      }else{
        entry.target.classList.remove("is-visible");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "-40px 0px -40px 0px"
  });

  const revealItems = document.querySelectorAll(
    ".hero, .search-section, .category-section, .care-layout, .alone-card, .quick-card"
  );

  revealItems.forEach(item => {
    item.classList.add("scroll-reveal");
    careRevealObserver.observe(item);
  });
}

initCareRevealAnimation();