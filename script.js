// Constants
const BREAKPOINT_MOBILE = 800;
const NAVBAR_SCROLL_THRESHOLD = 120;
const LOADING_ANIMATION_DELAY = 1000;

class WebsiteManager {
  constructor() {
    this.elements = {
      loadingAnimation: document.getElementById("loading-animation"),
      aboutSection: document.getElementById("about"),
      hamburgerMenu: document.getElementById("hamburger-menu"),
      hamburgerIcon: document.getElementById("menu-icon"),
      closeIcon: document.getElementById("close-icon"),
      navLinks: document.getElementById("nav-links"),
      navbar: document.getElementById("navbar"),
      selectedWorks: document.getElementById("selected-works"),
      recentWorks: document.getElementById("recent-works"),
      socialMedia: document.getElementById("social-media"),
    };

    // Create modal elements
    this.createModalElements();
    this.init();
  }

  createModalElements() {
    // Create modal container
    this.modal = document.createElement("div");
    this.modal.className = "modal";
    this.modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      z-index: 1000;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;

    // Create close button
    this.modalClose = document.createElement("span");
    this.modalClose.className = "modal-close";
    this.modalClose.innerHTML = "&times;";
    this.modalClose.style.cssText = `
      position: absolute;
      top: 20px;
      right: 30px;
      color: #f1f1f1;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
    `;

    // Create modal image
    this.modalImage = document.createElement("img");
    this.modalImage.className = "modal-content";
    this.modalImage.style.cssText = `
      max-width: 90%;
      max-height: 90vh;
      margin: auto;
      display: block;
    `;

    // Assemble modal
    this.modal.appendChild(this.modalClose);
    this.modal.appendChild(this.modalImage);
    document.body.appendChild(this.modal);
  }

  init() {
    this.setupEventListeners();
    this.loadContent();
    this.checkBackgroundImageLoaded();
    this.updateLayoutForCurrentDevice();
  }

  setupEventListeners() {
    // Navigation
    this.elements.hamburgerMenu.addEventListener("click", () =>
      this.toggleNavLinks()
    );
    this.elements.navLinks.addEventListener("click", (event) =>
      this.handleNavLinkClick(event)
    );

    // Scroll handling
    window.addEventListener("scroll", () => {
      this.handleNavbarScroll();
      this.updateActiveNavLink();
    });

    // Resize handling
    window.addEventListener("resize", () =>
      this.updateLayoutForCurrentDevice()
    );

    // Modal handling
    this.modalClose.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Keyboard handling for modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
  }

  showModal(imageSrc) {
    this.modalImage.src = imageSrc;
    // Enable pointer events before showing
    this.modal.style.pointerEvents = "auto";
    this.modal.style.display = "flex";
    // Force reflow
    this.modal.offsetHeight;
    this.modal.style.opacity = "1";
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  }

  closeModal() {
    this.modal.style.opacity = "0";
    setTimeout(() => {
      this.modal.style.display = "none";
      this.modal.style.pointerEvents = "none";
      document.body.style.overflow = ""; // Restore scrolling
    }, 300); // Match transition duration
  }

  toggleNavLinks() {
    const { navLinks, hamburgerIcon, closeIcon, navbar } = this.elements;
    navLinks.classList.toggle("show");

    const isMenuOpen = navLinks.classList.contains("show");
    hamburgerIcon.style.display = isMenuOpen ? "none" : "block";
    closeIcon.style.display = isMenuOpen ? "block" : "none";
    navbar.style.backgroundColor = isMenuOpen ? "#7caed3" : "transparent";
  }

  handleNavLinkClick(event) {
    if (
      event.target.tagName === "A" &&
      this.elements.navLinks.classList.contains("show")
    ) {
      this.toggleNavLinks();
    }
  }

  handleNavbarScroll() {
    this.elements.navbar.classList.toggle(
      "navbar-scroll",
      window.scrollY > NAVBAR_SCROLL_THRESHOLD
    );
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navLinks = Array.from(this.elements.navLinks.querySelectorAll("a"));
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const { offsetTop, offsetHeight, id } = section;
      const isInView =
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight;

      if (isInView) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href").endsWith(`#${id}`)
          );
        });
      }
    });
  }

  async loadContent() {
    try {
      const response = await fetch("data.json");
      const data = await response.json();

      this.renderWorks(
        data["selected-works"],
        this.elements.selectedWorks,
        true
      );
      this.renderWorks(data["recent-works"], this.elements.recentWorks, false);
      this.renderSocialMedia(data["social-media"], this.elements.socialMedia);
    } catch (error) {
      console.error("Error loading content:", error);
    }
  }

  renderSocialMedia(posts, container) {
    if (!Array.isArray(posts)) {
      console.error("Social media posts must be an array");
      return;
    }

    container.innerHTML = ""; // Clear existing content

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "social-media-card";
      card.style.cursor = "pointer";

      const image = document.createElement("img");
      image.src = post.image;
      image.alt = post.description || "Social media post";
      image.loading = "lazy"; // Add lazy loading

      // Add click handler to show modal
      card.addEventListener("click", () => this.showModal(post.image));

      card.appendChild(image);
      container.appendChild(card);
    });
  }

  renderWorks(works, container, flexColumn) {
    if (!Array.isArray(works)) {
      console.error("Works must be an array");
      return;
    }

    container.innerHTML = ""; // Clear existing content

    works.forEach((work) => {
      const card = this.createCard(work, flexColumn);
      container.appendChild(card);
    });
  }

  createCard(work, flexColumn) {
    const card = document.createElement("a");
    card.className = `card${flexColumn ? " column" : ""}`;
    card.href = work.link;
    card.target = "_blank";

    const image = document.createElement("img");
    image.src = work.image;
    image.loading = "lazy"; // Add lazy loading
    card.appendChild(image);

    const content = document.createElement("div");
    content.className = "card-content";

    if (work.title) {
      const title = document.createElement("h2");
      title.textContent = work.title;
      content.appendChild(title);
    }

    if (work.description) {
      const description = document.createElement("p");
      description.textContent = work.description;
      content.appendChild(description);
    }

    const tagContainer = document.createElement("div");
    tagContainer.className = "tag-container";

    if (work.tags) {
      work.tags.forEach((tagText) => {
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = tagText;
        tagContainer.appendChild(tag);
      });
    }

    content.appendChild(tagContainer);
    card.appendChild(content);
    return card;
  }

  updateLayoutForCurrentDevice() {
    const cards = Array.from(this.elements.selectedWorks.children);
    const isMobile = window.innerWidth <= BREAKPOINT_MOBILE;

    cards.forEach((card) => {
      card.classList.toggle("column", !isMobile);
    });
  }

  checkBackgroundImageLoaded() {
    const bgUrl = window
      .getComputedStyle(this.elements.aboutSection)
      .backgroundImage.slice(5, -2);

    const bgImage = new Image();
    bgImage.onload = () => this.hideLoadingAnimation();
    bgImage.src = bgUrl;
  }

  hideLoadingAnimation() {
    const { loadingAnimation } = this.elements;

    setTimeout(() => {
      loadingAnimation.style.transition = "transform 1s ease-out";
      loadingAnimation.style.transform = "translateY(-100vh)";

      loadingAnimation.addEventListener(
        "transitionend",
        () => {
          loadingAnimation.style.display = "none";
        },
        { once: true }
      );
    }, LOADING_ANIMATION_DELAY);
  }
}

// Initialize when DOM is loaded
window.onload = () => new WebsiteManager();
