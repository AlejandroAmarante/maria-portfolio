window.onload = function () {
  const loadingAnimation = document.getElementById("loading-animation");
  loadingAnimation.innerHTML =
    '<object type="image/svg+xml" data="./imgs/ring-resize.svg"></object>'; // Show loading animation

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const selectedWorks = document.getElementById("selected-works");
      data["selected-works"].forEach((work) => {
        const cardElement = document.createElement("a");
        cardElement.classList.add("card");
        cardElement.href = work.link;
        cardElement.target = "_blank";

        const imageElement = document.createElement("img");
        imageElement.src = work.image;
        imageElement.onload = () => {
          loadingAnimation.style.display = "none";
        };
        cardElement.appendChild(imageElement);

        const content = document.createElement("div");
        content.classList.add("card-content");
        cardElement.appendChild(content);

        const titleElement = document.createElement("h2");
        titleElement.textContent = work.title;
        content.appendChild(titleElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = work.description;
        content.appendChild(descriptionElement);

        selectedWorks.appendChild(cardElement);
      });

      const recentWorks = document.getElementById("recent-works");
      data["recent-works"].forEach((work) => {
        const cardElement = document.createElement("a");
        cardElement.classList.add("card");
        cardElement.classList.add("rows");
        cardElement.href = work.link;
        cardElement.target = "_blank";

        const imageElement = document.createElement("img");
        imageElement.src = work.image;
        imageElement.onload = () => {
          loadingAnimation.style.display = "none";
        };
        cardElement.appendChild(imageElement);

        const content = document.createElement("div");
        content.classList.add("card-content");
        cardElement.appendChild(content);

        const titleElement = document.createElement("h2");
        titleElement.textContent = work.title;
        content.appendChild(titleElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = work.description;
        content.appendChild(descriptionElement);

        recentWorks.appendChild(cardElement);
      });
    });
  // Fetch data from JSON file
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const recentWorks = document.getElementById("recent-works");
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

        const content = document.createElement("div");
        content.classList.add("card-content");
        cardElement.appendChild(content);

        const titleElement = document.createElement("h2");
        titleElement.textContent = card.title;
        content.appendChild(titleElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = card.description;
        content.appendChild(descriptionElement);

        recentWorks.appendChild(cardElement);
      });
    });

  // Make the navbar turn blue when you scroll down 50px
  const navbar = document.getElementById("navbar");
  window.onscroll = () => {
    if (window.scrollY > 120) {
      navbar.classList.add("navbar-scroll");
    } else {
      navbar.classList.remove("navbar-scroll");
    }
  };

  // Make it so the navbar link being underlined corresponds to the current section on the page
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("#nav-links a");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      const scrollPosition = window.pageYOffset + 100;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href").endsWith(`#${sectionId}`)) {
            link.classList.add("active");
          }
        });
      }
    });
  });
};
