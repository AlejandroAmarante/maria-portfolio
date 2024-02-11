window.onload = function () {
  // Fetch data from JSON file
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const showcase = document.getElementById("showcase");
      data.cards.forEach((card) => {
        const cardElement = document.createElement("a");
        cardElement.classList.add("card");
        cardElement.href = card.link; // Set the href to the card's link

        const imageElement = document.createElement("img");
        imageElement.src = card.image;
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
