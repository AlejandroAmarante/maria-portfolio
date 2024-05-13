window.onload = function () {
  const loadingAnimation = document.getElementById("loading-animation");
  loadingAnimation.innerHTML =
    '<object type="image/svg+xml" data="./imgs/ring-resize.svg"></object>'; // Show loading animation

  // Fetch data from JSON file
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const showcase = document.getElementById("showcase");
      data.cards.forEach((card) => {
        const cardElement = document.createElement("a");
        cardElement.classList.add("card");
        cardElement.href = card.link; // Set the href to the card's link
        cardElement.target = "_blank";

        const imageElement = document.createElement("img");
        imageElement.src = card.image;
        imageElement.onload = () => {
          // Hide loading animation when image is fully loaded
          loadingAnimation.style.display = "none";
          cardElement.style.display = "block";
        };
        cardElement.appendChild(imageElement);

        const titleElement = document.createElement("h2");
        titleElement.textContent = card.title;
        cardElement.appendChild(titleElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = card.description;
        cardElement.appendChild(descriptionElement);

        showcase.appendChild(cardElement);
      });
    });
};
