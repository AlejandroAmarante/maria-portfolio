// Constants
const BREAKPOINT_MOBILE = 800;
const NAVBAR_SCROLL_THRESHOLD = 120;
const LOADING_ANIMATION_DELAY = 1000;

const DISPLAY_TYPES = {
  HORIZONTAL_CARD: "horizontal-card",
  VERTICAL_CARD: "vertical-card",
  IMAGE_ONLY: "image-only",
};

class WebsiteManager {
  constructor() {
    this.elements = this.#cacheElements();
    this.charts = {};
    this.modal = this.#createModal();
    this.socialMediaItems = [];
    this.currentMediaFilter = "image";
    this.#init();
  }

  // Private method to cache DOM elements
  #cacheElements() {
    return {
      loadingScreen: document.querySelector(".loading-screen"),
      aboutSection: document.getElementById("about"),
      menuToggle: document.querySelector(".menu-toggle"),
      navList: document.querySelector(".nav-list"),
      sidebar: document.querySelector(".sidebar-nav"),
      clientBlogsGrid: document.querySelector("#client-blogs .works-grid"),
      socialGrid: document.querySelector("#social-showcase .works-grid"),
      mediaFilterButtons: document.querySelectorAll(".media-filter-btn"),
      socialShowcaseSection: document.getElementById("social-showcase"),
      redesignGrid: document.querySelector("#site-redesigns .works-grid"),
      resultsSection: document.getElementById("results"),
      resultsContainer: document.querySelector("#results .results-container"),
    };
  }

  // Private method to create modal
  #createModal() {
    const modal = document.createElement("div");
    modal.className = "modal";

    const closeBtn = document.createElement("span");
    closeBtn.className = "modal__close";
    closeBtn.innerHTML = "&times;";

    const image = document.createElement("img");
    image.className = "modal__image";
    image.alt = "Modal image";

    modal.append(closeBtn, image);
    document.body.appendChild(modal);

    return { element: modal, closeBtn, image };
  }

  // Private initialization method
  #init() {
    this.#setupEventListeners();
    this.loadContent();
    this.#checkBackgroundImageLoaded();
    this.#updateLayoutForCurrentDevice();
  }

  // Private method for event listeners
  #setupEventListeners() {
    // Navigation toggle
    this.elements.menuToggle?.addEventListener("click", () =>
      this.#toggleNavigation()
    );

    // Navigation link clicks
    this.elements.navList?.addEventListener("click", (e) => {
      if (
        e.target.tagName === "A" &&
        this.elements.navList.classList.contains("show")
      ) {
        this.#toggleNavigation();
      }
    });

    // Scroll events (throttled for performance)
    let scrollTimeout;
    window.addEventListener(
      "scroll",
      () => {
        if (scrollTimeout) return;

        scrollTimeout = setTimeout(() => {
          this.#handleNavbarScroll();
          this.#updateActiveNavLink();
          scrollTimeout = null;
        }, 16); // ~60fps
      },
      { passive: true }
    );

    // Resize events (debounced for performance)
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(
        () => this.#updateLayoutForCurrentDevice(),
        150
      );
    });

    // Modal events
    this.modal.closeBtn.addEventListener("click", () => this.#closeModal());
    this.modal.element.addEventListener("click", (e) => {
      if (e.target === this.modal.element) this.#closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.#closeModal();
    });

    // Media filter buttons
    this.elements.mediaFilterButtons?.forEach((btn) => {
      btn.addEventListener("click", (e) => this.#handleMediaFilter(e));
    });
  }

  // Private method to handle media filter
  #handleMediaFilter(e) {
    const filterType = e.target.dataset.filter;
    if (filterType === this.currentMediaFilter) return;

    this.currentMediaFilter = filterType;

    // Update button states
    this.elements.mediaFilterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filterType);
    });

    // Fade out, update content, fade in
    const grid = this.elements.socialGrid;
    grid.classList.add("fade-out");

    setTimeout(() => {
      const filteredItems = this.socialMediaItems.filter(
        (item) => item.mediaType === filterType
      );
      this.#renderSection(filteredItems, grid);
      grid.classList.remove("fade-out");
      grid.classList.add("fade-in");

      setTimeout(() => grid.classList.remove("fade-in"), 300);
    }, 300);
  }

  // Private method to get chart defaults
  #getChartDefaults() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      font: { family: "'Poppins', sans-serif" },
      plugins: {
        legend: {
          display: false,
          labels: { font: { family: "'Poppins', sans-serif" } },
        },
        title: {
          display: true,
          align: "center",
          font: { size: 18, weight: "bold", family: "'Poppins', sans-serif" },
          padding: { top: 10, bottom: 10 },
        },
        subtitle: {
          display: true,
          align: "center",
          font: { size: 12, family: "'Poppins', sans-serif", style: "italic" },
          color: "#666",
          padding: { bottom: 15 },
        },
        annotation: {
          annotations: {
            hireDate: {
              type: "line",
              xMin: 2,
              xMax: 2,
              borderColor: "#ef4444ab",
              borderWidth: 0,
              borderDash: [6, 6],
              drawTime: "beforeDatasetsDraw",
              label: {
                display: true,
                content: "Hired Q3 2025",
                position: "end",
                backgroundColor: "#ef4444",
                color: "#fff",
                font: {
                  size: 13,
                  weight: "bold",
                  family: "'Poppins', sans-serif",
                },
                padding: 5,
                yAdjust: 8,
              },
            },
          },
        },
      },
      layout: { padding: { left: 10, right: 10, top: 10, bottom: 10 } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0, 0, 0, 0.05)" },
          grace: "60%",
          ticks: { font: { family: "'Poppins', sans-serif" } },
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { family: "'Poppins', sans-serif" },
            align: "center",
            padding: 1,
          },
          offset: true,
        },
      },
    };
  }

  // Private method to create individual charts
  #createChart(config, labels, defaults) {
    const { element, type, title, subTitle, data, hireDateIndex } = config;

    const dataset =
      type === "bar"
        ? this.#createBarDataset(data, hireDateIndex)
        : this.#createLineDataset(data, hireDateIndex);

    const options = {
      ...defaults,
      plugins: {
        ...defaults.plugins,
        title: { ...defaults.plugins.title, text: title },
      },
    };

    // Add subtitle if provided
    if (subTitle) {
      options.plugins.subtitle = {
        ...defaults.plugins.subtitle,
        text: subTitle,
      };
    }

    return new Chart(element, {
      type,
      data: { labels, datasets: [dataset] },
      options,
    });
  }

  // Private method for line chart dataset
  #createLineDataset(data, hireDateIndex) {
    return {
      label: "",
      data,
      segment: {
        borderColor: (ctx) =>
          this.#getSegmentColor(ctx, hireDateIndex, "#758fb5", "#90c8f3ff"),
        backgroundColor: (ctx) =>
          ctx.p0DataIndex < hireDateIndex
            ? "rgba(117, 143, 181, 0.1)"
            : "rgba(144, 200, 243, 0.1)",
      },
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: (ctx) =>
        ctx.dataIndex < hireDateIndex ? "#758fb5" : "#90c8f3ff",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      tension: 0.4,
    };
  }

  // Private method for bar chart dataset
  #createBarDataset(data, hireDateIndex) {
    return {
      label: "",
      data,
      backgroundColor: (ctx) =>
        ctx.dataIndex < hireDateIndex ? "#758fb5da" : "#90c8f3da",
      borderColor: (ctx) =>
        ctx.dataIndex < hireDateIndex ? "#758fb5" : "#90c8f3ff",
      borderWidth: 2,
      borderRadius: 6,
    };
  }

  // Private helper for segment colors with gradient
  #getSegmentColor(ctx, hireDateIndex, beforeColor, afterColor) {
    if (
      ctx.p0DataIndex === hireDateIndex - 1 &&
      ctx.p1DataIndex === hireDateIndex
    ) {
      const { chart } = ctx;
      const { ctx: canvasCtx, chartArea } = chart;
      if (!chartArea) return beforeColor;

      const meta = chart.getDatasetMeta(0).data;
      const gradient = canvasCtx.createLinearGradient(
        meta[hireDateIndex - 1].x,
        0,
        meta[hireDateIndex].x,
        0
      );
      gradient.addColorStop(0, beforeColor);
      gradient.addColorStop(1, afterColor);
      return gradient;
    }
    return ctx.p0DataIndex < hireDateIndex ? beforeColor : afterColor;
  }

  // Private method to initialize charts from data
  #initializeChartsFromData(chartGroups) {
    if (!this.elements.resultsContainer || !Array.isArray(chartGroups)) return;

    const labels = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
    const chartDefaults = this.#getChartDefaults();

    this.elements.resultsContainer.innerHTML = "";

    chartGroups.forEach((group) => {
      const groupElement = this.#createChartGroup(group, labels, chartDefaults);
      this.elements.resultsContainer.appendChild(groupElement);
    });
  }

  // Private method to create chart group
  #createChartGroup(group, labels, chartDefaults) {
    const groupWrapper = document.createElement("div");
    groupWrapper.className = "chart-group";
    groupWrapper.id = group.id;

    if (group.title || group.description) {
      const header = document.createElement("div");
      header.className = "section-header";

      if (group.title) {
        const title = document.createElement("h3");
        title.className = "section-header__title";
        title.textContent = group.title;
        header.appendChild(title);
      }

      if (group.description) {
        const description = document.createElement("p");
        description.className = "section-header__description";
        description.textContent = group.description;
        header.appendChild(description);
      }

      groupWrapper.appendChild(header);
    }

    const chartsGrid = document.createElement("div");
    chartsGrid.className = "charts-grid";

    group.charts.forEach((chartConfig) => {
      const chartWrapper = document.createElement("div");
      chartWrapper.className = "chart-wrapper";

      const canvas = document.createElement("canvas");
      canvas.id = `${group.id}-${chartConfig.id}`;

      chartWrapper.appendChild(canvas);
      chartsGrid.appendChild(chartWrapper);

      // Create chart after canvas is in DOM
      setTimeout(() => {
        this.charts[`${group.id}-${chartConfig.id}`] = this.#createChart(
          {
            element: canvas,
            type: chartConfig.type,
            title: chartConfig.title,
            subTitle: chartConfig.subTitle,
            data: chartConfig.data,
            hireDateIndex: chartConfig.hireDateIndex,
          },
          labels,
          chartDefaults
        );
      }, 0);
    });

    groupWrapper.appendChild(chartsGrid);
    return groupWrapper;
  }

  // Public method to show modal
  showModal(imageSrc) {
    this.modal.image.src = imageSrc;
    this.modal.element.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Private method to close modal
  #closeModal() {
    this.modal.element.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Private method to toggle navigation
  #toggleNavigation() {
    const { navList, menuToggle, sidebar } = this.elements;
    if (!navList || !menuToggle || !sidebar) return;

    navList.classList.toggle("show");
    menuToggle.classList.toggle("active");
    sidebar.classList.toggle("show");
  }

  // Private method for navbar scroll effect
  #handleNavbarScroll() {
    this.elements.sidebar?.classList.toggle(
      "navbar-scroll",
      window.scrollY > NAVBAR_SCROLL_THRESHOLD
    );
  }

  // Private method to update active nav link
  #updateActiveNavLink() {
    if (!this.elements.navList) return;

    const sections = document.querySelectorAll("section");
    const navLinks = Array.from(this.elements.navList.querySelectorAll("a"));
    const scrollPosition = window.scrollY + 100;

    let activeSection = null;

    sections.forEach((section) => {
      if (!section.offsetParent) return;

      const { offsetTop, offsetHeight, id } = section;
      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        activeSection = id;
      }
    });

    if (activeSection) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href")?.endsWith(`#${activeSection}`)
        );
      });
    }
  }

  // Public method to load content
  async loadContent() {
    try {
      const response = await fetch("data.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      // Render social media section
      if (data.socialMedia) {
        this.socialMediaItems = data.socialMedia;
        const initialSocialItems = this.socialMediaItems.filter(
          (item) => item.mediaType === this.currentMediaFilter
        );
        this.#renderSection(initialSocialItems, this.elements.socialGrid);
      }

      // Render articles section
      if (data.articles) {
        this.#renderSection(data.articles, this.elements.clientBlogsGrid);
      }

      // Render site redesigns section
      if (data.siteRedesigns) {
        this.#renderRedesignSection(
          data.siteRedesigns,
          this.elements.redesignGrid
        );
      }

      // Initialize charts from data
      if (data.chartGroups) {
        this.#initializeChartsFromData(data.chartGroups);
      }
    } catch (error) {
      console.error("Error loading content:", error);
    }
  }

  // Private method to render a section
  #renderSection(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = "";

    if (items.length === 0) return;

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      fragment.appendChild(this.#createItemElement(item));
    });
    container.appendChild(fragment);
  }

  // Private method to render redesign section with before/after sliders
  #renderRedesignSection(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = "";

    if (items.length === 0) return;

    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      fragment.appendChild(this.#createRedesignElement(item, index));
    });
    container.appendChild(fragment);
  }

  // Private method to create redesign comparison element
  #createRedesignElement(item, index) {
    const wrapper = document.createElement("div");
    wrapper.className = "redesign-item";

    if (item.title || item.description) {
      const info = document.createElement("div");
      info.className = "section-header";
      if (item.title) {
        const title = document.createElement("h3");
        title.className = "section-header__title";
        title.textContent = item.title;
        info.appendChild(title);
      }
      if (item.description) {
        const desc = document.createElement("p");
        desc.className = "section-header__description";
        desc.textContent = item.description;
        info.appendChild(desc);
      }
      wrapper.appendChild(info);
    }

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "comparison-slider-wrapper";

    const slider = document.createElement("img-comparison-slider");
    slider.className = "comparison-slider";
    slider.value = 50;

    const beforeDiv = document.createElement("div");
    beforeDiv.slot = "first";
    beforeDiv.className = "before-container";
    const beforeImg = document.createElement("img");
    beforeImg.src = item.beforeImage;
    beforeImg.alt = `${item.title || "Site"} - Before`;
    beforeImg.loading = "lazy";
    beforeDiv.appendChild(beforeImg);

    const afterDiv = document.createElement("div");
    afterDiv.slot = "second";
    afterDiv.className = "after-container";
    const afterImg = document.createElement("img");
    afterImg.src = item.afterImage;
    afterImg.alt = `${item.title || "Site"} - After`;
    afterImg.loading = "lazy";
    afterDiv.appendChild(afterImg);

    const handleSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    handleSvg.setAttribute("slot", "handle");
    handleSvg.setAttribute("width", "100");
    handleSvg.setAttribute("viewBox", "-8 -3 16 6");
    handleSvg.classList.add("custom-animated-handle");

    const outlinePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    outlinePath.setAttribute("stroke", "#00000070");
    outlinePath.setAttribute(
      "d",
      "M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2"
    );
    outlinePath.setAttribute("stroke-width", "2.5");
    outlinePath.setAttribute("fill", "none");
    outlinePath.setAttribute("vector-effect", "non-scaling-stroke");

    const handlePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    handlePath.setAttribute("stroke", "#fff");
    handlePath.setAttribute(
      "d",
      "M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2"
    );
    handlePath.setAttribute("stroke-width", "1");
    handlePath.setAttribute("fill", "#fff");
    handlePath.setAttribute("vector-effect", "non-scaling-stroke");

    handleSvg.appendChild(outlinePath);
    handleSvg.appendChild(handlePath);

    slider.appendChild(beforeDiv);
    slider.appendChild(afterDiv);
    slider.appendChild(handleSvg);

    const beforeLabel = document.createElement("div");
    beforeLabel.className = "comparison-label comparison-label--before";
    beforeLabel.textContent = "Before";

    const afterLabel = document.createElement("div");
    afterLabel.className = "comparison-label comparison-label--after";
    afterLabel.textContent = "After";

    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(beforeLabel);
    sliderWrapper.appendChild(afterLabel);

    wrapper.appendChild(sliderWrapper);

    const updateLabels = () => {
      const value = slider.value;
      beforeLabel.style.opacity = value > 15 ? "1" : "0";
      afterLabel.style.opacity = value < 85 ? "1" : "0";
    };
    updateLabels();
    slider.addEventListener("slide", updateLabels);
    slider.addEventListener("change", updateLabels);

    return wrapper;
  }

  // Private method to create item elements
  #createItemElement(item) {
    const displayType = item.displayType || DISPLAY_TYPES.IMAGE_ONLY;

    switch (displayType) {
      case DISPLAY_TYPES.HORIZONTAL_CARD:
        return this.#createFullCard(item, true);
      case DISPLAY_TYPES.VERTICAL_CARD:
        return this.#createFullCard(item, false);
      default:
        return this.#createImageOnlyCard(item);
    }
  }

  // Private method to create image-only card
  #createImageOnlyCard(item) {
    const card = document.createElement("div");
    card.className = "card card--image-only";

    if (item.mediaType === "video") {
      const video = document.createElement("video");
      video.src = item.media;
      video.alt = item.description || "Video";
      video.loading = "lazy";
      video.className = "card__image";
      video.controls = true;
      video.muted = true;
      video.playsInline = true;
      card.appendChild(video);
    } else {
      const image = document.createElement("img");
      image.src = item.media;
      image.alt = item.description || "Image";
      image.loading = "lazy";
      image.className = "card__image";
      card.addEventListener("click", () => this.showModal(item.media));
      card.appendChild(image);
    }

    return card;
  }

  // Private method to create full card
  #createFullCard(item, isHorizontal) {
    const card = document.createElement("a");
    card.className = `card${isHorizontal ? " card--horizontal" : ""}`;

    if (item.link) {
      card.href = item.link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.style.cursor = "default";
      card.onclick = (e) => e.preventDefault();
    }

    if (item.media) {
      const image = document.createElement("img");
      image.src = item.media;
      image.alt = item.title || "Card image";
      image.loading = "lazy";
      image.className = "card__image";
      card.appendChild(image);
    }

    const content = this.#createCardContent(item);
    card.appendChild(content);

    return card;
  }

  // Private method to create card content
  #createCardContent(item) {
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
      content.appendChild(this.#createTagList(item.tags));
    }

    return content;
  }

  // Private method to create tag list
  #createTagList(tags) {
    const tagList = document.createElement("div");
    tagList.className = "tag-list";

    const fragment = document.createDocumentFragment();
    tags.forEach((tagText) => {
      const tag = document.createElement("div");
      tag.className = "tag";
      tag.textContent = tagText;
      fragment.appendChild(tag);
    });

    tagList.appendChild(fragment);
    return tagList;
  }

  // Private method to update layout for device
  #updateLayoutForCurrentDevice() {
    // No longer needed for selected works, but kept for potential future use
    return;
  }

  // Private method to check background image load
  #checkBackgroundImageLoaded() {
    if (!this.elements.aboutSection) return;

    const bgImageValue = window.getComputedStyle(
      this.elements.aboutSection
    ).backgroundImage;

    if (!bgImageValue || bgImageValue === "none") {
      this.#hideLoadingAnimation();
      return;
    }

    const bgUrl = bgImageValue.slice(5, -2);
    const bgImage = new Image();

    bgImage.onload = () => this.#hideLoadingAnimation();
    bgImage.onerror = () => this.#hideLoadingAnimation();
    bgImage.src = bgUrl;
  }

  // Private method to hide loading animation
  #hideLoadingAnimation() {
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

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", () => new WebsiteManager());
