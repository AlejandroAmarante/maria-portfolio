window.onload = function () {
  const loadingAnimation = document.getElementById("loading-animation");
  loadingAnimation.innerHTML =
    '<object type="image/svg+xml" data="./imgs/ring-resize.svg"></object>'; // Show loading animation

  // Function to hide loading animation
  const hideLoadingAnimation = () => {
    setTimeout(() => {
      loadingAnimation.style.transition = "transform 1s ease-out";
      loadingAnimation.style.transform = "translateY(-100vh)";
    }, 1000).then(() => (loadingAnimation.style.display = "none"));
  };

  // Function to check if the background image of the 'about' section has loaded
  const checkBackgroundImageLoaded = (callback) => {
    const aboutSection = document.getElementById("about");
    const bgImage = new Image();
    const bgUrl = window
      .getComputedStyle(aboutSection)
      .backgroundImage.slice(5, -2);

    console.log(bgUrl);

    bgImage.onload = callback;
    bgImage.src = bgUrl;
  };

  // Fetch data and update the page
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

        cardElement.appendChild(imageElement);

        const content = document.createElement("div");
        content.classList.add("card-content");
        cardElement.appendChild(content);

        const titleElement = document.createElement("h2");
        titleElement.textContent = work.title;
        content.appendChild(titleElement);

        if (work.description) {
          const descriptionElement = document.createElement("p");
          descriptionElement.textContent = work.description;
          content.appendChild(descriptionElement);
        }

        const tagContainer = document.createElement("div");
        tagContainer.classList.add("tag-container");
        if (work.tags) {
          work.tags.forEach((tag) => {
            const tagElement = document.createElement("div");
            tagElement.classList.add("tag");
            tagElement.textContent = tag;
            tagContainer.appendChild(tagElement);
          });
        }
        content.appendChild(tagContainer);
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
        cardElement.appendChild(imageElement);

        const content = document.createElement("div");
        content.classList.add("card-content");
        cardElement.appendChild(content);

        if (work.title) {
          const titleElement = document.createElement("h2");
          titleElement.textContent = work.title;
          content.appendChild(titleElement);
        }

        if (work.description) {
          const descriptionElement = document.createElement("p");
          descriptionElement.textContent = work.description;
          content.appendChild(descriptionElement);
        }

        const tagContainer = document.createElement("div");
        tagContainer.classList.add("tag-container");
        if (work.tags) {
          work.tags.forEach((tag) => {
            const tagElement = document.createElement("div");
            tagElement.classList.add("tag");
            tagElement.textContent = tag;
            tagContainer.appendChild(tagElement);
          });
        }
        content.appendChild(tagContainer);

        recentWorks.appendChild(cardElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Check if the background image of the 'about' section has loaded, then hide the loading animation
  checkBackgroundImageLoaded(hideLoadingAnimation);

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
