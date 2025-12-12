// Constants
const BREAKPOINT_MOBILE = 800;
const NAVBAR_SCROLL_THRESHOLD = 120;
const LOADING_ANIMATION_DELAY = 1000;

class WebsiteManager {
  constructor() {
    this.elements = {
      loadingScreen: document.querySelector(".loading-screen"),
      aboutSection: document.getElementById("about"),
      menuToggle: document.querySelector(".menu-toggle"),
      navList: document.querySelector(".nav-list"),
      sidebar: document.querySelector(".sidebar-nav"),
      selectedWorksGrid: document.querySelector("#selected-works .works-grid"),
      recentWorksGrid: document.querySelector("#recent-works .works-grid"),
      socialGrid: document.querySelector("#social-showcase .works-grid"),
    };

    this.createModalElements();
    this.init();
  }

  createModalElements() {
    // Create modal container
    this.modal = document.createElement("div");
    this.modal.className = "modal";

    // Create close button
    this.modalClose = document.createElement("span");
    this.modalClose.className = "modal__close";
    this.modalClose.innerHTML = "&times;";

    // Create modal image
    this.modalImage = document.createElement("img");
    this.modalImage.className = "modal__image";

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
    this.elements.menuToggle.addEventListener("click", () =>
      this.toggleNavigation()
    );
    this.elements.navList.addEventListener("click", (event) =>
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
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggleNavigation() {
    const { navList, menuToggle, sidebar } = this.elements;

    navList.classList.toggle("show");
    menuToggle.classList.toggle("active");
    sidebar.classList.toggle("show");
  }

  handleNavLinkClick(event) {
    if (
      event.target.tagName === "A" &&
      this.elements.navList.classList.contains("show")
    ) {
      this.toggleNavigation();
    }
  }

  handleNavbarScroll() {
    this.elements.sidebar.classList.toggle(
      "navbar-scroll",
      window.scrollY > NAVBAR_SCROLL_THRESHOLD
    );
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navLinks = Array.from(this.elements.navList.querySelectorAll("a"));
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

      // Group items by section
      const sections = {
        "selected-works": [],
        "recent-works": [],
        "social-media": [],
      };

      data.items.forEach((item) => {
        if (sections[item.section]) {
          sections[item.section].push(item);
        }
      });

      // Render each section
      this.renderItems(
        sections["selected-works"],
        this.elements.selectedWorksGrid
      );
      this.renderItems(sections["recent-works"], this.elements.recentWorksGrid);
      this.renderItems(sections["social-media"], this.elements.socialGrid);
    } catch (error) {
      console.error("Error loading content:", error);
    }
  }

  renderItems(items, container) {
    if (!Array.isArray(items)) {
      console.error("Items must be an array");
      return;
    }

    container.innerHTML = "";

    items.forEach((item) => {
      const element = this.createItemElement(item);
      container.appendChild(element);
    });
  }

  createItemElement(item) {
    const displayType = item.displayType || "image-only";

    switch (displayType) {
      case "image-only":
        return this.createImageOnlyCard(item);
      case "horizontal-card":
        return this.createFullCard(item, true);
      case "vertical-card":
        return this.createFullCard(item, false);
      default:
        return this.createImageOnlyCard(item);
    }
  }

  createImageOnlyCard(item) {
    const card = document.createElement("div");
    card.className = "card card--image-only";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.description || "Image";
    image.loading = "lazy";
    image.className = "card__image";

    card.addEventListener("click", () => this.showModal(item.image));
    card.appendChild(image);

    return card;
  }

  createFullCard(item, isHorizontal) {
    const card = document.createElement("a");
    card.className = `card${isHorizontal ? " card--horizontal" : ""}`;

    // Only set href and target if link exists
    if (item.link) {
      card.href = item.link;
      card.target = "_blank";
    } else {
      card.style.cursor = "default";
      card.onclick = (e) => e.preventDefault();
    }

    // Image (always present based on structure)
    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.loading = "lazy";
      image.className = "card__image";
      card.appendChild(image);
    }

    const content = document.createElement("div");
    content.className = "card__content";

    // Title (if exists)
    if (item.title) {
      const title = document.createElement("h2");
      title.textContent = item.title;
      title.className = "card__title";
      content.appendChild(title);
    }

    // Description (if exists)
    if (item.description) {
      const description = document.createElement("p");
      description.textContent = item.description;
      description.className = "card__description";
      content.appendChild(description);
    }

    // Tags (if exists)
    if (item.tags && Array.isArray(item.tags)) {
      const tagList = document.createElement("div");
      tagList.className = "tag-list";

      item.tags.forEach((tagText) => {
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = tagText;
        tagList.appendChild(tag);
      });

      content.appendChild(tagList);
    }

    card.appendChild(content);
    return card;
  }

  updateLayoutForCurrentDevice() {
    const cards = Array.from(this.elements.selectedWorksGrid.children);
    const isMobile = window.innerWidth <= BREAKPOINT_MOBILE;

    cards.forEach((card) => {
      card.classList.toggle("card--horizontal", !isMobile);
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
    const { loadingScreen } = this.elements;

    setTimeout(() => {
      loadingScreen.classList.add("hidden");

      loadingScreen.addEventListener(
        "transitionend",
        () => {
          loadingScreen.style.display = "none";
        },
        { once: true }
      );
    }, LOADING_ANIMATION_DELAY);
  }
}

// Initialize when DOM is loaded
window.onload = () => new WebsiteManager();
