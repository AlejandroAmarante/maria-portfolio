window.onload = function () {
  // Elements
  const loadingAnimation = document.getElementById("loading-animation");
  const aboutSection = document.getElementById("about");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  const navLinks = document.getElementById("nav-links");
  const navbar = document.getElementById("navbar");
  const selectedWorks = document.getElementById("selected-works");
  const recentWorks = document.getElementById("recent-works");

  // Hide loading animation
  const hideLoadingAnimation = () => {
    setTimeout(() => {
      loadingAnimation.style.transition = "transform 1s ease-out";
      loadingAnimation.style.transform = "translateY(-100vh)";
      loadingAnimation.addEventListener("transitionend", () => {
        loadingAnimation.style.display = "none";
      });
    }, 1000);
  };

  // Check if background image has loaded
  const checkBackgroundImageLoaded = (callback) => {
    const bgImage = new Image();
    const bgUrl = window
      .getComputedStyle(aboutSection)
      .backgroundImage.slice(5, -2);
    bgImage.onload = callback;
    bgImage.src = bgUrl;
  };

  // Toggle navLinks visibility and navbar background color
  const toggleNavLinks = () => {
    navLinks.classList.toggle("show");
    if (hamburgerIcon.style.display === "none") {
      hamburgerIcon.style.display = "block";
      closeIcon.style.display = "none";
    } else {
      hamburgerIcon.style.display = "none";
      closeIcon.style.display = "block";
    }
    navbar.style.backgroundColor = navLinks.classList.contains("show")
      ? "#9abed8"
      : "transparent";
  };

  hamburgerMenu.addEventListener("click", toggleNavLinks);

  // Hide navLinks when a link is clicked
  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A" && navLinks.classList.contains("show")) {
      toggleNavLinks();
    }
  });

  // Fetch data and update the page
  const createCardElement = (work, flexColumn) => {
    const cardElement = document.createElement("a");
    cardElement.classList.add("card");
    if (flexColumn) {
      cardElement.classList.add("column");
    }
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

    return cardElement;
  };

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      data["selected-works"].forEach((work) => {
        selectedWorks.appendChild(createCardElement(work, true));
      });
      data["recent-works"].forEach((work) => {
        recentWorks.appendChild(createCardElement(work, false));
      });
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Navbar scroll behavior
  window.onscroll = () => {
    if (window.scrollY > 120) {
      navbar.classList.add("navbar-scroll");
    } else {
      navbar.classList.remove("navbar-scroll");
    }
  };

  // Update navbar link based on scroll position
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinksArray = Array.from(navLinks.querySelectorAll("a"));

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      const scrollPosition = window.pageYOffset + 100;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinksArray.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href").endsWith(`#${sectionId}`)
          );
        });
      }
    });
  });

  if (window.innerWidth <= 800) {
    Array.from(selectedWorks.children).forEach((child) => {
      child.classList.remove("column");
    });
  }

  window.addEventListener("resize", () => {
    Array.from(selectedWorks.children).forEach((child) => {
      if (window.innerWidth <= 800) {
        child.classList.remove("column");
      } else {
        child.classList.add("column");
      }
    });
  });

  // Check if the background image of the 'about' section has loaded, then hide the loading animation
  checkBackgroundImageLoaded(hideLoadingAnimation);
};
