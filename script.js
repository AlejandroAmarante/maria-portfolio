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
      clientBlogsGrid: document.querySelector("#client-blogs .works-grid"),
      socialGrid: document.querySelector("#social-showcase .works-grid"),
      revenueChart: document.getElementById("revenueChart"),
      trafficChart: document.getElementById("trafficChart"),
      conversionChart: document.getElementById("conversionChart"),
    };

    this.charts = {};
    this.createModalElements();
    this.init();
  }

  createModalElements() {
    this.modal = document.createElement("div");
    this.modal.className = "modal";

    this.modalClose = document.createElement("span");
    this.modalClose.className = "modal__close";
    this.modalClose.innerHTML = "&times;";

    this.modalImage = document.createElement("img");
    this.modalImage.className = "modal__image";

    this.modal.appendChild(this.modalClose);
    this.modal.appendChild(this.modalImage);
    document.body.appendChild(this.modal);
  }

  init() {
    this.setupEventListeners();
    this.loadContent();
    this.initializeCharts();
    this.checkBackgroundImageLoaded();
    this.updateLayoutForCurrentDevice();
  }

  setupEventListeners() {
    if (this.elements.menuToggle) {
      this.elements.menuToggle.addEventListener("click", () =>
        this.toggleNavigation()
      );
    }

    if (this.elements.navList) {
      this.elements.navList.addEventListener("click", (event) =>
        this.handleNavLinkClick(event)
      );
    }

    window.addEventListener("scroll", () => {
      this.handleNavbarScroll();
      this.updateActiveNavLink();
    });

    window.addEventListener("resize", () =>
      this.updateLayoutForCurrentDevice()
    );

    this.modalClose.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
  }

  initializeCharts() {
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          align: "center",
          font: {
            size: 18,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20
          },
        },
        annotation: {
          annotations: {
            hireDate: {
              type: "line",
              xMin: 6.5,
              xMax: 6.5,
              borderColor: "#ef4444",
              borderWidth: 2,
              borderDash: [6, 6],
              label: {
                display: true,
                content: "Hire Date",
                position: "end",
                backgroundColor: "#ef4444",
                color: "#fff",
                font: {
                  size: 13,
                  weight: "bold",
                },
                padding: 6,
                yAdjust: 10
              },
            },
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          grace: "50%",
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    };

    // Revenue Chart
    if (this.elements.revenueChart) {
      this.charts.revenue = new Chart(this.elements.revenueChart, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Monthly Revenue ($)",
              data: [
                12000, 13000, 12500, 14000, 13500, 14500, 14200, 17000, 18500,
                20000, 22000, 24000,
              ],
              segment: {
                borderColor: (ctx) => {
                  return ctx.p0DataIndex < 7 ? "#758fb5" : "#90c8f3ff";
                },
                backgroundColor: (ctx) => {
                  return ctx.p0DataIndex < 7
                    ? "rgba(117, 143, 181, 0.1)"
                    : "rgba(124, 174, 211, 0.1)";
                },
              },
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: (ctx) => {
                return ctx.dataIndex < 7 ? "#758fb5" : "#90c8f3ff";
              },
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          ...chartDefaults,
          plugins: {
            ...chartDefaults.plugins,
            title: {
              ...chartDefaults.plugins.title,
              text: "Monthly Revenue ($)",

            },
          },
        },
      });
    }

    // Traffic Chart
    if (this.elements.trafficChart) {
      this.charts.traffic = new Chart(this.elements.trafficChart, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Website Traffic",
              data: [
                4000, 4200, 4100, 4300, 4400, 4500, 4600, 6500, 7200, 7800,
                8200, 9000,
              ],
              backgroundColor: (ctx) => {
                return ctx.dataIndex < 7 ? "#758fb5da" : "#90c8f3da";
              },
              borderColor: (ctx) => {
                return ctx.dataIndex < 7 ? "#758fb5" : "#90c8f3ff";
              },
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        },
        options: {
          ...chartDefaults,
          plugins: {
            ...chartDefaults.plugins,
            title: {
              ...chartDefaults.plugins.title,
              text: "Website Traffic",
            },
          },
        },
      });
    }

    // Conversion Chart
    if (this.elements.conversionChart) {
      this.charts.conversion = new Chart(this.elements.conversionChart, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Conversion Rate (%)",
              data: [
                1.4, 1.5, 1.6, 1.5, 1.6, 1.7, 1.6, 2.3, 2.6, 2.8, 3.0, 3.2,
              ],
              segment: {
                borderColor: (ctx) => {
                  return ctx.p0DataIndex < 7 ? "#758fb5" : "#90c8f3ff";
                },
                backgroundColor: (ctx) => {
                  return ctx.p0DataIndex < 7
                    ? "rgba(117, 143, 181, 0.1)"
                    : "rgba(124, 174, 211, 0.1)";
                },
              },
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: (ctx) => {
                return ctx.dataIndex < 7 ? "#758fb5" : "#90c8f3ff";
              },
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          ...chartDefaults,
          plugins: {
            ...chartDefaults.plugins,
            title: {
              ...chartDefaults.plugins.title,
              text: "Conversion Rate (%)",
            },
          },
        },
      });
    }
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
    if (!navList || !menuToggle || !sidebar) return;

    navList.classList.toggle("show");
    menuToggle.classList.toggle("active");
    sidebar.classList.toggle("show");
  }

  handleNavLinkClick(event) {
    if (
      event.target.tagName === "A" &&
      this.elements.navList?.classList.contains("show")
    ) {
      this.toggleNavigation();
    }
  }

  handleNavbarScroll() {
    if (!this.elements.sidebar) return;

    this.elements.sidebar.classList.toggle(
      "navbar-scroll",
      window.scrollY > NAVBAR_SCROLL_THRESHOLD
    );
  }

  updateActiveNavLink() {
    if (!this.elements.navList) return;

    const sections = document.querySelectorAll("section");
    const navLinks = Array.from(this.elements.navList.querySelectorAll("a"));
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      if (section.offsetParent === null) return;

      const { offsetTop, offsetHeight, id } = section;
      const isInView =
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight;

      if (isInView) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href")?.endsWith(`#${id}`)
          );
        });
      }
    });
  }

  async loadContent() {
    try {
      const response = await fetch("data.json");
      const data = await response.json();

      const sections = {
        "selected-works": [],
        "recent-works": [],
        "social-media": [],
        "client-blogs": [],
      };

      data.items.forEach((item) => {
        if (sections[item.section]) {
          sections[item.section].push(item);
        }
      });

      this.renderItems(
        sections["selected-works"],
        this.elements.selectedWorksGrid
      );
      this.renderItems(sections["recent-works"], this.elements.recentWorksGrid);
      this.renderItems(sections["social-media"], this.elements.socialGrid);
      this.renderItems(sections["client-blogs"], this.elements.clientBlogsGrid);
    } catch (error) {
      console.error("Error loading content:", error);
    }
  }

  renderItems(items, container) {
    if (!container || !Array.isArray(items)) return;

    const section = container.closest("section");
    const sectionId = section?.id;

    container.innerHTML = "";

    if (items.length === 0) {
      if (section) section.style.display = "none";

      const navLink = this.elements.navList?.querySelector(
        `a[href="#${sectionId}"]`
      );
      if (navLink) navLink.style.display = "none";

      return;
    }

    if (section) section.style.display = "";

    items.forEach((item) => {
      const element = this.createItemElement(item);
      container.appendChild(element);
    });
  }

  createItemElement(item) {
    const displayType = item.displayType || "image-only";

    switch (displayType) {
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

    if (item.link) {
      card.href = item.link;
      card.target = "_blank";
    } else {
      card.style.cursor = "default";
      card.onclick = (e) => e.preventDefault();
    }

    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.loading = "lazy";
      image.className = "card__image";
      card.appendChild(image);
    }

    const content = document.createElement("div");
    content.className = "card__content";

    if (item.title) {
      const title = document.createElement("h2");
      title.textContent = item.title;
      title.className = "card__title";
      content.appendChild(title);
    }

    if (item.description) {
      const description = document.createElement("p");
      description.textContent = item.description;
      description.className = "card__description";
      content.appendChild(description);
    }

    if (Array.isArray(item.tags) && item.tags.length) {
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
    const grid = this.elements.selectedWorksGrid;
    if (!grid) return;

    const cards = Array.from(grid.children);
    const isMobile = window.innerWidth <= BREAKPOINT_MOBILE;

    cards.forEach((card) => {
      card.classList.toggle("card--horizontal", !isMobile);
    });
  }

  checkBackgroundImageLoaded() {
    if (!this.elements.aboutSection) return;

    const bgImageValue = window.getComputedStyle(
      this.elements.aboutSection
    ).backgroundImage;

    if (!bgImageValue || bgImageValue === "none") {
      this.hideLoadingAnimation();
      return;
    }

    const bgUrl = bgImageValue.slice(5, -2);
    const bgImage = new Image();

    bgImage.onload = () => this.hideLoadingAnimation();
    bgImage.src = bgUrl;
  }

  hideLoadingAnimation() {
    const { loadingScreen } = this.elements;
    if (!loadingScreen) return;

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

window.onload = () => new WebsiteManager();
